(()=>{
'use strict';
const G=window.SALMON,A=window.SALMON_ART;
const{VH,WATER_Y,GROUND,TRAIT,LAPS,RARE,UNITS,ENEMIES,CHAPTERS,STAGES,STOM,META,lvMul,lvCost,metaCost,battleCfg,Battle}=G;
const $=id=>document.getElementById(id);
const fmt=n=>Math.floor(n).toLocaleString('ja-JP');
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY='salmon-run-v1',SPIN=200,MAXLV=20;
const fresh=()=>({ikura:300,own:{shake:1,ikura:1,aramaki:1},team:['shake','ikura','aramaki'],prog:[0,0,0],meta:{wall:0,flood:0,stom:0},lap:0,tip:false,snd:true});
// 更新で項目が増減しても、古いセーブを今の形に直して読む
function migrate(s){
  const f=fresh(),own={};
  for(const[k,v]of Object.entries(s.own))if(UNITS[k]&&v>0)own[k]=Math.min(MAXLV,v|0);
  if(!Object.keys(own).length)Object.assign(own,f.own);
  const team=(Array.isArray(s.team)?s.team:[]).filter(k=>own[k]);
  return{...f,...s,own,team:team.length?team:Object.keys(own).slice(0,3),
    prog:f.prog.map((_,i)=>Math.min(STAGES.length,Math.max(0,((s.prog||[])[i])|0))),
    meta:{...f.meta,...s.meta},lap:Math.min(LAPS.length-1,Math.max(0,s.lap|0))};
}
let save=fresh();
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.own)save=migrate(s)}catch(e){}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}};

/* 音 */
const Snd={ac:null,timer:null,step:0,mode:'normal',
  wake(){if(!save.snd)return;if(!this.ac){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ac=new C()}if(this.ac.state!=='running')this.ac.resume();this.bgm()},
  tone(f,d=.1,type='triangle',v=.05,when=0,to){if(!this.ac||!save.snd)return;const t=this.ac.currentTime+when,o=this.ac.createOscillator(),g=this.ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g).connect(this.ac.destination);o.start(t);o.stop(t+d+.02)},
  noise(d=.3,v=.08,fc=900){if(!this.ac||!save.snd)return;const n=this.ac.sampleRate*d|0,b=this.ac.createBuffer(1,n,this.ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=this.ac.createBufferSource(),f=this.ac.createBiquadFilter(),g=this.ac.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=fc;g.gain.value=v;s.connect(f).connect(g).connect(this.ac.destination);s.start()},
  bgm(){if(this.timer)return;
    if(this.mode==='boss'){const bass=[110,110,131,110,147,156,147,131],mel=[440,0,523,494,440,0,392,415];
      this.timer=setInterval(()=>{if(!save.snd||document.hidden)return;const i=this.step++%32;
        if(i%2===0)this.tone(bass[(i/2)%8]/2,.15,'sawtooth',.045);
        if(i%4===0)this.tone(92,.12,'sine',.08,0,45);
        if(i%4===2){const m=mel[(i>>2)%8];if(m)this.tone(m,.15,'square',.02)}
        if(i%16===12)this.tone(880,.28,'square',.012,0,740)},125);
      return}
    const sc=[262,294,330,392,440,523],pat=[0,2,4,2,3,1,2,0,4,5,4,2,3,2,1,0];
    this.timer=setInterval(()=>{if(!save.snd||document.hidden)return;const i=this.step++%32;if(i%2===0)this.tone(sc[pat[(i/2)%16]],.2,'triangle',.022);if(i%8===0)this.tone(sc[[0,3,2,3][(i/8)%4]]/2,.42,'sine',.04)},190)},
  setBgm(mode){if(this.mode===mode)return;this.mode=mode;this.step=0;if(this.timer){this.stop();this.bgm()}},
  stop(){clearInterval(this.timer);this.timer=null},
  spawn(){this.tone(520,.08,'square',.025,0,780)},hit(){this.noise(.05,.04,1600)},big(){this.tone(120,.2,'sawtooth',.06,0,50);this.noise(.15,.08,700)},
  flood(){this.noise(1.1,.16,520);this.tone(90,.9,'sawtooth',.05,0,40)},
  win(){[523,659,784,1046].forEach((f,i)=>this.tone(f,.26,'triangle',.07,i*.13))},lose(){[392,330,262,196].forEach((f,i)=>this.tone(f,.32,'triangle',.06,i*.17))},
  coin(){this.tone(880,.06,'square',.02);this.tone(1320,.09,'square',.02,.06)},
};

/* 立ち絵 */
const pCache={};
function measure(id){
  if(pCache[id])return pCache[id];
  const S=460,cv=document.createElement('canvas');cv.width=S;cv.height=S;
  const c=cv.getContext('2d',{willReadFrequently:true});c.translate(S/2,S-30);
  A.drawActor(c,id,{t:.7,sw:.4,atk:0,roll:.2});
  const d=c.getImageData(0,0,S,S).data;let x0=S,x1=0,y0=S,y1=0;
  for(let y=0;y<S;y+=2)for(let x=0;x<S;x+=2)if(d[(y*S+x)*4+3]>16){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  return pCache[id]={cx:(x0+x1)/2-S/2,cy:(y0+y1)/2-(S-30),w:x1-x0+6,h:y1-y0+6};
}
function portrait(id,px,o={}){
  const cv=document.createElement('canvas'),dpr=2,S=px*dpr;cv.width=S;cv.height=S;
  const c=cv.getContext('2d'),m=measure(id),k=Math.min(S*.9/m.w,S*.9/m.h);
  c.translate(S/2,S/2);c.scale(k*(o.flip?-1:1),k);c.translate(-m.cx,-m.cy);
  A.drawActor(c,id,{t:.7,sw:.4,atk:0,roll:.2});
  if(o.dark){c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#17303a';c.fillRect(0,0,S,S)}
  return cv;
}

/* 画面切り替え */
let view='title',tab='map',sel='shake';
function show(v){view=v;for(const k of['title','menu','battle'])$('v-'+k).hidden=k!==v;if(v==='menu')setTab(tab);if(v==='battle')fit()}
function setTab(t){tab=t;for(const b of document.querySelectorAll('.tabs button'))b.setAttribute('aria-selected',b.dataset.tab===t);
  for(const k of['map','ike','lane'])$('p-'+k).hidden=k!==t;({map:renderMap,ike:renderIke,lane:renderLane})[t]();$('purse').textContent=fmt(save.ikura)}
function refreshPurse(){$('purse').textContent=fmt(save.ikura)}
let toastT;function toast(s){const t=$('toast');t.textContent=s;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,1600)}

/* マップ */
function enemiesOf(s){const seen=[];for(const r of s.rules)if(!seen.includes(r.e))seen.push(r.e);return seen}
function renderMap(){
  const lap=save.lap,prog=save.prog[lap],p=$('p-map');p.innerHTML='';
  const laps=document.createElement('div');laps.className='laps';
  LAPS.forEach((l,i)=>{if(i&&save.prog[i-1]<STAGES.length)return;const b=document.createElement('button');b.textContent=i?`${l.n}(敵の強さ ×${l.m})`:l.n;b.setAttribute('aria-pressed',i===lap);b.onclick=()=>{save.lap=i;persist();renderMap()};laps.appendChild(b)});
  if(laps.children.length>1)p.appendChild(laps);
  const riv=document.createElement('div');riv.className='river';let chShown=-1,nextEl=null;
  for(let i=STAGES.length-1;i>=0;i--){
    const s=STAGES[i],locked=i>prog,done=i<prog;
    if(s.ch!==chShown){chShown=s.ch;const c=CHAPTERS[s.ch],h=document.createElement('div');h.className='ch-head';h.innerHTML=`<h2>${c.n}</h2><span>${c.sub}</span>`;riv.appendChild(h)}
    const el=document.createElement('div');el.className='st'+(locked?' locked':done?' done':' next');
    const km=document.createElement('div');km.className='km';km.innerHTML=`${s.km}<small>km</small>`;
    const main=document.createElement('div');main.className='st-main';
    const nm=document.createElement('div');nm.className='st-name';nm.textContent=locked?'まだ見えない':s.n;
    if(done){const st=document.createElement('span');st.className='stamp';st.textContent='済';nm.appendChild(st)}
    main.appendChild(nm);
    if(!locked){const sub=document.createElement('div');sub.className='st-sub';for(const e of enemiesOf(s))sub.appendChild(portrait(e,28,{flip:1}));const em=document.createElement('em');em.textContent=`報酬 ${fmt(reward(i,lap,!done))}`;sub.appendChild(em);main.appendChild(sub)}
    el.append(km,main);
    if(!locked){const b=document.createElement('button');b.className='pop go';b.textContent='遡上';b.onclick=()=>startBattle(i,lap);el.appendChild(b)}
    riv.appendChild(el);if(i===prog)nextEl=el;
  }
  p.appendChild(riv);
  if(nextEl)requestAnimationFrame(()=>nextEl.scrollIntoView({block:'center'}));
}
const reward=(i,lap,first)=>Math.round(STAGES[i].reward*LAPS[lap].r*(first?1:.5));

/* いけす */
function abilityChips(d){
  const a=[];
  if(d.count)a.push(`${d.count}体で出撃`);
  if(d.area)a.push('範囲攻撃');
  if(d.range>=90&&!d.heal)a.push('遠くまで届く');
  if(d.vs)for(const[k,v]of Object.entries(d.vs))a.push(`${TRAIT[k]}に${v}倍`);
  if(d.crit)a.push(`トロの一撃 ${d.crit*100}%`);
  if(d.slow)a.push('敵を遅くする');
  if(d.stun)a.push(`敵を止める ${d.stun.p*100}%`);
  if(d.kbc)a.push(`吹き飛ばす ${d.kbc*100}%`);
  if(d.heal)a.push(`仲間を回復 ${d.heal*100}%`);
  if(d.roll)a.push('止まらず転がる');
  if(d.shield)a.push('一度だけ耐える');
  if(d.onDeath)a.push('倒れるとイクラ6粒');
  return a;
}
const unlockHint=d=>d.via==='gacha'?'回転レーンで出ることがある':d.via.clear!==undefined?`「${STAGES[d.via.clear].n}」をクリア`:'';
function renderIke(){
  const p=$('p-ike');p.innerHTML='';
  const h=document.createElement('h2');h.textContent=`出撃する${save.team.length}組(最大10)`;p.appendChild(h);
  const team=document.createElement('div');team.className='team';
  for(let i=0;i<10;i++){const id=save.team[i],b=document.createElement('button');b.className='tslot'+(id?' on':'');if(id){b.appendChild(portrait(id,64));b.setAttribute('aria-label',`${UNITS[id].n}を見る`);b.onclick=()=>{sel=id;renderIke()}}else{b.disabled=true;b.setAttribute('aria-label','空き')}team.appendChild(b)}
  p.appendChild(team);
  const wrap=document.createElement('div');wrap.className='ike';
  const grid=document.createElement('div');grid.className='grid';
  const order=Object.keys(UNITS);
  for(const id of order){const d=UNITS[id],own=save.own[id],b=document.createElement('button');
    b.className=`cell r-${d.r}${own?'':' lock'}${sel===id?' sel':''}`;
    b.appendChild(portrait(id,84,{dark:!own}));
    const n=document.createElement('span');n.className='nm';n.textContent=own?d.n:'???';b.appendChild(n);
    if(own){const l=document.createElement('span');l.className='lv';l.textContent='Lv'+own;b.appendChild(l)}
    if(save.team.includes(id)){const l=document.createElement('span');l.className='in';l.textContent='出撃';b.appendChild(l)}
    b.onclick=()=>{sel=id;renderIke();document.querySelector('.detail').scrollIntoView({block:'nearest'})};grid.appendChild(b)}
  const det=document.createElement('div');det.className='detail';det.appendChild(detailOf(sel));
  wrap.append(grid,det);p.appendChild(wrap);
  const h2=document.createElement('h2');h2.className='mt';h2.textContent='群れの強化';p.appendChild(h2);
  const ms=document.createElement('div');ms.className='metas';
  for(const[k,m]of Object.entries(META)){const l=save.meta[k],c=metaCost(l),el=document.createElement('div');el.className='meta';
    el.innerHTML=`<b>${m.n} Lv${l}</b><small>${m.txt}</small>`;
    const b=document.createElement('button');b.className='pop';b.textContent=l>=m.max?'最大':`イクラ ${fmt(c)} で強化`;b.disabled=l>=m.max||save.ikura<c;
    b.onclick=()=>{save.ikura-=c;save.meta[k]++;persist();Snd.coin();refreshPurse();renderIke()};el.appendChild(b);ms.appendChild(el)}
  p.appendChild(ms);
}
function detailOf(id){
  const d=UNITS[id],own=save.own[id],f=document.createDocumentFragment();
  const head=document.createElement('div');head.className='head';head.appendChild(portrait(id,104,{dark:!own}));
  const t=document.createElement('div');t.innerHTML=`<div class="rar">${RARE[d.r]}${own?` ・ Lv${own}`:''}</div><h3>${own?d.n:'まだ会っていない'}</h3>`;head.appendChild(t);f.appendChild(head);
  if(!own){const q=document.createElement('p');q.textContent=`出会い方:${unlockHint(d)}`;f.appendChild(q);return f}
  const q=document.createElement('p');q.textContent=d.txt;f.appendChild(q);
  const m=lvMul(own),st=document.createElement('div');st.className='stats';
  const rows=[['体力',fmt(d.hp*m)],['攻撃',d.heal?'-':fmt(d.atk*m)],['射程',d.range],['速さ',d.sp],['費用',d.cost],['再出撃',d.cd+'秒']];
  st.innerHTML=rows.map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');f.appendChild(st);
  const ch=abilityChips(d);if(ch.length){const c=document.createElement('div');c.className='chips';c.innerHTML=ch.map(x=>`<span>${x}</span>`).join('');f.appendChild(c)}
  const act=document.createElement('div');act.className='act';
  const inTeam=save.team.includes(id),tg=document.createElement('button');tg.className='pop ghost';tg.textContent=inTeam?'出撃から外す':'出撃に入れる';
  tg.disabled=(!inTeam&&save.team.length>=10)||(inTeam&&save.team.length<=1);
  tg.onclick=()=>{if(inTeam)save.team=save.team.filter(x=>x!==id);else save.team.push(id);persist();renderIke()};
  const cost=lvCost(own),up=document.createElement('button');up.className='pop';up.textContent=own>=MAXLV?'最大レベル':`イクラ ${fmt(cost)} で強化`;up.disabled=own>=MAXLV||save.ikura<cost;
  up.onclick=()=>{save.ikura-=cost;save.own[id]++;persist();Snd.coin();refreshPurse();renderIke()};
  act.append(up,tg);f.appendChild(act);return f;
}

/* 回転レーン */
let spinning=false,lastPull=null;
function renderLane(){
  const p=$('p-lane');p.innerHTML='';
  const gachaIds=Object.keys(UNITS).filter(k=>UNITS[k].via==='gacha'),got=gachaIds.filter(k=>save.own[k]).length;
  const h=document.createElement('h2');h.textContent='回転レーン';p.appendChild(h);
  const lb=document.createElement('div');lb.className='lanebox';const belt=document.createElement('div');belt.className='belt';belt.id='belt';
  for(let i=0;i<12;i++){const pl=document.createElement('div');pl.className='plate'+(i%7===3?' k':i%3===1?' g':'');belt.appendChild(pl)}
  lb.appendChild(belt);p.appendChild(lb);
  const g=document.createElement('div');g.className='gacha';
  const left=document.createElement('div');
  left.innerHTML=`<p class="rates">流れてくる皿を1枚取ると、仲間が1組増えます。同じ仲間が出たらLvが1上がります。<br>白皿<b>65%</b>　金皿<b>28%</b>　黒皿<b>7%</b><br>集めた仲間<b>${got} / ${gachaIds.length}</b></p>`;
  const b=document.createElement('button');b.className='pop';b.id='btn-spin';b.textContent=`イクラ ${SPIN} で皿を取る`;b.disabled=save.ikura<SPIN;b.onclick=spin;left.appendChild(b);
  const rv=document.createElement('div');rv.id='reveal';rv.className='reveal';
  if(lastPull)fillReveal(rv,lastPull);else{const m=document.createElement('p');m.textContent='まだ皿を取っていません。';rv.appendChild(m)}
  g.append(left,rv);p.appendChild(g);
}
function fillReveal(rv,r){
  const d=UNITS[r.id];rv.className='reveal r-'+d.r;rv.innerHTML='';rv.appendChild(portrait(r.id,150));
  const h=document.createElement('h3');h.textContent=d.n;
  const t=document.createElement('div');t.className='tagline';t.textContent=r.isNew?`${RARE[d.r]}・はじめまして`:`${RARE[d.r]}・Lv${r.lv}に上がった`;
  const q=document.createElement('p');q.style.margin='4px 0 0';q.style.fontSize='14px';q.textContent=d.txt;rv.append(t,h,q);
}
function spin(){
  if(spinning||save.ikura<SPIN)return;
  spinning=true;save.ikura-=SPIN;refreshPurse();Snd.coin();
  const belt=$('belt'),btn=$('btn-spin');belt.classList.add('fast');btn.disabled=true;
  const roll=Math.random(),rar=roll<.07?'UR':roll<.35?'SR':'R';
  const pool=Object.keys(UNITS).filter(k=>UNITS[k].via==='gacha'&&UNITS[k].r===rar),id=pool[Math.random()*pool.length|0];
  setTimeout(()=>{
    const isNew=!save.own[id];
    save.own[id]=Math.min(MAXLV,(save.own[id]||0)+1);
    if(isNew&&save.team.length<10)save.team.push(id);
    persist();spinning=false;lastPull={id,isNew,lv:save.own[id]};sel=id;
    if(view==='menu'&&tab==='lane'){renderLane();$('reveal').classList.add('pulse')}
    Snd.win();
  },REDUCED?120:900);
}

/* バトル */
const cv=$('cv'),ctx=cv.getContext('2d'),field=$('field');
let B=null,bg=null,cam=0,vw=800,Sc=1,offY=0,dpr=1,vfx=[],speed=1,paused=false,userPan=0,flash=0,shakeT=0,clock=0,banner=null,endQueued=false;
function fit(){
  const r=field.getBoundingClientRect();if(!r.width)return;
  dpr=Math.min(window.devicePixelRatio||1,2);cv.width=r.width*dpr|0;cv.height=r.height*dpr|0;
  Sc=Math.min(r.height/VH,r.width/420);
  if(B)Sc=Math.max(Sc,r.width/B.L);
  vw=r.width/Sc;offY=r.height-VH*Sc;clampCam();
}
function clampCam(){if(B)cam=Math.max(0,Math.min(B.L-vw,cam))}
new ResizeObserver(fit).observe(field);
function startBattle(si,lap){
  B=new Battle(si,lap,battleCfg(save));bg=A.makeBackground(STAGES[si].ch,B.L,VH,WATER_Y,GROUND,CHAPTERS);
  scene=null;Snd.setBgm('normal');vfx=[];slotCache=[];paused=false;userPan=0;endQueued=false;banner=null;speed=1;$('btn-speed').textContent='×1';$('over').hidden=true;
  $('hud-stage').textContent=`${STAGES[si].km}km ${STAGES[si].n}`;
  buildSlots();show('battle');fit();cam=B.L-vw;clampCam();
  const tip=$('tip');
  if(!save.tip){tip.hidden=false;tip.textContent='下の値札を押すと仲間が出ます。オキアミは右上の胃袋にたまり、満腹になると止まります。左下で胃袋を広げられます。左の敵の拠点を壊せば勝ちです。';tip.onclick=()=>{tip.hidden=true};save.tip=true;persist();setTimeout(()=>{tip.hidden=true},9000)}else tip.hidden=true;
}
// 指が触れた瞬間に反応させる。キーボード操作のclickはdetailが0になる
function press(el,fn){el.onpointerdown=e=>{if(e.pointerType!=='mouse'||e.button===0)fn()};el.onclick=e=>{if(e.detail===0)fn()}}
function buildSlots(){
  const w=$('slots');w.innerHTML='';
  B.slots.forEach((s,i)=>{const b=document.createElement('button');b.className='slot';b.id='slot-'+i;b.setAttribute('aria-label',`${s.def.n}を出す ${s.def.cost}オキアミ`);
    b.appendChild(portrait(s.id,60));
    const pr=document.createElement('span');pr.className='price';pr.textContent=s.def.cost;
    const wait=document.createElement('span');wait.className='wait';wait.innerHTML='<em class="sec"></em><span class="bar"><i></i></span>';
    b._sec=wait.querySelector('.sec');b._bar=wait.querySelector('.bar i');
    const k=document.createElement('kbd');k.textContent=(i+1)%10;
    b.append(wait,pr,k);press(b,()=>deploy(i));b.onanimationend=()=>b.classList.remove('flash');w.appendChild(b)});
  for(let i=B.slots.length;i<10;i++){const b=document.createElement('div');b.className='slot empty';w.appendChild(b)}
}
function deploy(i){if(B&&!paused&&B.deploy(i))Snd.spawn()}
function upStom(){if(B&&!paused&&B.upStom()){Snd.coin();const m=$('hud-money');m.classList.remove('grow');void m.offsetWidth;m.classList.add('grow')}}
function fire(){if(B&&!paused&&B.fire())Snd.flood()}
press($('btn-stom'),upStom);press($('btn-flood'),fire);
$('btn-speed').onclick=()=>{speed=speed===1?2:1;$('btn-speed').textContent='×'+speed};
$('btn-pause').onclick=()=>togglePause();
function togglePause(){
  if(!B||B.over)return;paused=!paused;
  if(paused)overlay(`<h2>一時停止</h2><p>${STAGES[B.si].n}</p><div class="row"><button class="pop" id="o-resume">続ける</button><button class="pop ghost" id="o-quit">川をおりる</button></div>`,{'o-resume':togglePause,'o-quit':quit});
  else $('over').hidden=true;
}
function quit(){B=null;scene=null;paused=false;Snd.setBgm('normal');$('over').hidden=true;show('menu')}
function overlay(html,acts,extra,wide){const o=$('over'),c=$('over-card');c.className='card'+(wide?' scene':'');c.innerHTML=html;if(extra)c.insertBefore(extra,c.children[1]||null);for(const[k,f]of Object.entries(acts))$(k).onclick=f;o.hidden=false}
// ボスに負けた時の見出しと文章。絵は art.js の LOSE_SCENES
const LOSE={
todo:{h:'座布団にされた',p:'トド親分の特等席は、鮭の上だった。あたたかくて、ちょっと重い。親分は昼寝を始めた。起きるまで動けない。'},
amimoto:{h:'大漁にされた',p:'みんなまとめて網の中。網元はえびす顔だ。明日の朝市で「活きがいい」と評判になるらしい。'},
taisho:{h:'本日のおすすめになった',p:'気がつけばシャリの上。皿はゆっくり回っている。向かいの席の人と目が合った。気まずい。'},
nushi:{h:'おいしくいただかれた',p:'滝のヌシのおなかの中は、暗くて、あたたかくて、意外と広い。ヌシは満足して昼寝を始めた。'},
kibori:{h:'おみやげになった',p:'気がつけば木彫りになって、口にくわえられていた。駅の売店で3,980円。買ってくれた人の玄関で、今日も川を見ている。'},
kamome:{h:'ひなのごはんになった',p:'カモメに運ばれて、崖の上の巣へ。ひなたちが大きな口をあけて待っていた。「ごはんじゃないよ!」の声は、ぴよぴよにかき消された。'},
karasu:{h:'ひなのごはんになった',p:'カラスに運ばれて、高い場所の巣へ。ひなたちは元気いっぱいだ。「ごはんじゃないよ!」と言っても、聞いてくれそうにない。'},
washi:{h:'ひなのごはんになった',p:'オジロワシに運ばれて、とても高い巣へ。景色は最高だ。ひなたちの食欲も最高だ。'},
konguma:{h:'おやつにされた',p:'子グマは鮭をお皿にのせて、きちんと手を合わせた。とても礼儀正しい。逃げるなら今だ。'},
higuma:{h:'おやつにされた',p:'ヒグマは川原でピクニックの用意をしていた。テーブルクロスまで敷いてある。主役はきみたちらしい。'},
mink:{h:'たくわえにされた',p:'ミンクの巣穴には、冬のための食べものがきれいにならんでいた。その列に、きみたちも加わった。春まで待機だ。'},
azarashi:{h:'ボールにされた',p:'アザラシの鼻の上で、ぐるぐる回された。お客さんがいれば拍手がもらえたはずだ。目が回って、まっすぐ泳げない。'},
kani:{h:'はさまれた',p:'モクズガニのハサミは、尾びれをつかんだらはなさない。カニは横にしか歩けないので、川のはしまで連れていかれた。'},
ugui:{h:'通せんぼされた',p:'小さなウグイたちがずらりとならんで、川をふさいだ。ひとりひとりは小さいが、数がすごかった。'},
tsuribito:{h:'記念写真を撮られた',p:'釣り人はとてもうれしそうだ。写真は「今日の大物」として壁にかざられるらしい。せめて、いい顔をしておこう。'},
ryoshi:{h:'箱づめにされた',p:'氷といっしょに箱の中へ。ふたが閉まる前に見えたのは「特選」の文字だった。ちょっとうれしい。'},
itamae:{h:'塩をふられた',p:'板前はていねいに塩をふった。「しょっぱい!」とさけんだが、ちょうどいい塩かげんらしい。'},
};
function loseCanvas(id){
  const cv=document.createElement('canvas'),S=2;cv.width=400*S;cv.height=210*S;cv.className='scene-cv';
  const c=cv.getContext('2d');
  scene=()=>{c.setTransform(S,0,0,S,0,0);c.clearRect(0,0,400,210);A.drawLoseScene(c,id,clock)};scene();
  return cv;
}
function finish(){
  const b=B;Snd.setBgm('normal');
  if(b.over==='win'){
    Snd.win();
    const first=b.si===save.prog[b.lap],gain=reward(b.si,b.lap,first);save.ikura+=gain;let unlocked=null;
    if(first){save.prog[b.lap]=b.si+1;
      if(b.lap===0)for(const[k,d]of Object.entries(UNITS))if(d.via.clear===b.si&&!save.own[k]){save.own[k]=1;if(save.team.length<10)save.team.push(k);unlocked=k}}
    persist();
    const ending=first&&b.si===STAGES.length-1&&b.lap<LAPS.length-1;
    let extra=null,html=`<h2>${ending?'帰ってきた':'遡上成功'}</h2><div class="prize">イクラ +${fmt(gain)}</div>`;
    if(ending)html+=`<p>268km、泳ぎきった。川底に卵を産んで、この旅は終わる。4年後、この卵から生まれた子どもたちが、また帰ってくる。</p>`;
    if(unlocked){html+=`<p>${UNITS[unlocked].n}が仲間になった。</p>`;extra=portrait(unlocked,110)}
    html+=`<div class="row"><button class="pop" id="o-next">川へもどる</button></div>`;
    if(ending){save.lap=b.lap+1;persist()}
    overlay(html,{'o-next':quit},extra);
  }else{
    Snd.lose();const gain=Math.round(reward(b.si,b.lap,false)*.2);save.ikura+=gain;persist();
    const boss=b.es.find(e=>e.def.boss&&LOSE[e.id]),who=boss?boss.id:b.lastHit,L=LOSE[who];
    const body=L?L.p:'鮭の群れがちりぢりになった。';
    overlay(`<h2>${L?L.h:'流された'}</h2><p>${body}慰めのイクラ ${fmt(gain)} をもらった。いけすで仲間を強くして、もう一度。</p><div class="row"><button class="pop" id="o-again">もう一度</button><button class="pop ghost" id="o-next">川へもどる</button></div>`,{'o-next':quit,'o-again':()=>startBattle(b.si,b.lap)},L?loseCanvas(who):null,!!L);
  }
}

/* カメラ操作 */
let drag=null;
field.addEventListener('pointerdown',e=>{if(e.target!==cv)return;drag={x:e.clientX,cam};field.setPointerCapture(e.pointerId)});
field.addEventListener('pointermove',e=>{if(!drag)return;cam=drag.cam-(e.clientX-drag.x)/Sc;clampCam();userPan=4});
field.addEventListener('pointerup',()=>{drag=null});field.addEventListener('pointercancel',()=>{drag=null});
field.addEventListener('wheel',e=>{e.preventDefault();cam+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/Sc;clampCam();userPan=4},{passive:false});
addEventListener('keydown',e=>{
  if(view!=='battle'||!B||e.repeat&&!e.key.startsWith('Arrow'))return;
  if(e.key>='0'&&e.key<='9'){deploy((+e.key+9)%10)}
  else if(e.key==='q'||e.key==='Q')upStom();
  else if(e.key===' '){e.preventDefault();fire()}
  else if(e.key==='p'||e.key==='P'||e.key==='Escape')togglePause();
  else if(e.key==='ArrowLeft'){cam-=60;clampCam();userPan=4}
  else if(e.key==='ArrowRight'){cam+=60;clampCam();userPan=4}
});

/* 演出 */
function drainFx(){
  for(const f of B.fx){
    if(f.k==='die')vfx.push({k:'die',e:f.e,t:0,life:f.e.side>0?1.8:.7});
    else if(f.k==='hit'){vfx.push({k:'hit',x:f.x,y:f.y,big:f.big,t:0,life:.22});if(Math.random()<.3)Snd.hit()}
    else if(f.k==='crit'){vfx.push({k:'word',x:f.x,y:f.y-16,s:'トロ!',col:'#ff5a2b',t:0,life:.7});Snd.big()}
    else if(f.k==='kb'){vfx.push({k:'word',x:f.x,y:f.y-20,s:'ドン',col:'#fff',t:0,life:.4})}
    else if(f.k==='guard')vfx.push({k:'word',x:f.x,y:GROUND-70,s:'耐えた',col:'#ffe63b',t:0,life:.8});
    else if(f.k==='heal')vfx.push({k:'word',x:f.x,y:GROUND-58,s:'+',col:'#8dff9c',t:0,life:.5});
    else if(f.k==='atk')vfx.push({...f,k:'atk',t:0,life:f.fx==='shout'?.7:.34});
    else if(f.k==='boss'){banner={s:`${f.name} があらわれた`,t:0};Snd.big()}
    else if(f.k==='shock'){shakeT=.5}
    else if(f.k==='wave'){flash=.25;shakeT=.4}
  }
  B.fx.length=0;
}
function drawAtkFx(c,f){
  const a=f.t/f.life,dx=f.tx-f.x,y=GROUND-24-(f.lane||0)*.2-(f.fly||0),x=f.x+dx*a;
  c.save();
  switch(f.fx){
    case'rice':for(let i=0;i<4;i++){A.E(c,x+i*8*(f.side>0?1:-1),y-12-Math.sin(a*3.14)*30-i*2,3,2,'#fff',i,1.2)}break;
    case'flame':{const g=c.createLinearGradient(f.x,0,f.tx,0);g.addColorStop(0,'#ffe55c');g.addColorStop(1,'rgba(255,92,30,.1)');c.fillStyle=g;c.beginPath();c.moveTo(f.x-30,y-12);c.lineTo(f.tx,y-34+a*10);c.lineTo(f.tx,y+16-a*10);c.closePath();c.fill();break}
    case'whip':{c.lineWidth=7;c.strokeStyle=A.INK;c.beginPath();c.moveTo(f.x,y-34);c.quadraticCurveTo((f.x+f.tx)/2,y-74*(1-a),f.tx,y-8);c.stroke();c.lineWidth=4;c.strokeStyle='#b5683a';c.stroke();break}
    case'petal':for(let i=0;i<14;i++){const o=(i*37)%20-10;A.E(c,f.x+dx*Math.min(1,a+i*.03),y-20+o*(1+a),3.5,2,'#ffc6d6',i,.8)}break;
    case'smoke':c.globalAlpha=.75*(1-a);for(let i=0;i<7;i++)A.E(c,f.tx+((i*31)%70-35),y-14-(i*13)%34-a*16,16+a*14,12+a*12,'#d8dedd',0,0);c.globalAlpha=1;break;
    case'flake':for(let i=0;i<16;i++){const xx=f.x+dx*Math.min(1,a*1.2+i*.02)+((i*29)%46-23);c.fillStyle='#ff8a5c';c.fillRect(xx,y-44+a*60+((i*17)%18),5,3)}break;
    case'clock':c.globalAlpha=1-a;c.lineWidth=3;c.strokeStyle='#fff7d6';for(let i=0;i<2;i++){c.beginPath();c.arc(f.tx,y-14,18+a*40+i*12,0,6.3);c.stroke()}c.globalAlpha=1;break;
    case'shout':c.lineWidth=5;c.strokeStyle=`rgba(255,230,59,${1-a})`;for(let i=0;i<3;i++){c.beginPath();c.arc(f.x-50,y-50,40+(a+i*.2)*f.life*340,2.2,4.1);c.stroke()}
      c.fillStyle='#fff';c.strokeStyle=A.INK;c.lineWidth=5;c.font="20px 'Dela Gothic One',sans-serif";c.textAlign='center';c.lineJoin='round';c.strokeText('今のぼる',f.x-90,y-120);c.fillText('今のぼる',f.x-90,y-120);break;
    case'kick':A.line(c,[[f.x-10,y-14],[f.tx+10,y-10]],3,'rgba(255,255,255,.75)');break;
    case'steam':c.globalAlpha=.5*(1-a);A.E(c,f.x,y-30,170*a+20,34,'#dff5e8',0,0);c.globalAlpha=1;break;
    case'line':c.lineWidth=1.6;c.strokeStyle='#f7f7f2';c.beginPath();c.moveTo(f.x+30,y-92);c.quadraticCurveTo((f.x+f.tx)/2,y-120,f.tx,y-14);c.stroke();break;
    case'net':c.lineWidth=1.6;c.strokeStyle='rgba(255,255,255,.85)';{const R=20+40*a;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(x+i*R/3,y-R);c.lineTo(x+i*R/3,y+10);c.stroke();c.beginPath();c.moveTo(x-R,y+i*R/4-20);c.lineTo(x+R,y+i*R/4-20);c.stroke()}}break;
    case'knife':c.lineWidth=4;c.strokeStyle='#eef6f8';c.beginPath();c.arc(f.tx,y-14,22,-1.2+a,1.4+a);c.stroke();break;
    case'swoop':c.lineWidth=3;c.strokeStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(f.x,y-50);c.quadraticCurveTo(f.tx,y-60,f.tx,y);c.stroke();break;
    default:break;
  }
  c.restore();
}
function burst(c,x,y,r,col){c.beginPath();for(let i=0;i<12;i++){const a=i/12*6.283,q=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}c.closePath();c.fillStyle=col;c.fill();c.lineWidth=2;c.strokeStyle=A.INK;c.stroke()}
function word(c,s,x,y,col,fs){c.font=`${fs}px 'Dela Gothic One','Hiragino Sans',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=4;c.strokeStyle=A.INK;c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y)}
function drawOne(c,e,t){
  const d=e.def;c.save();
  c.translate(e.x,GROUND+e.lane-(d.fly||0));
  if(e.side<0)c.scale(-1,1);
  const atk=e.state==='wind'?1-e.timer/d.wind:e.lunge;
  c.translate(-atk*(d.w>=90?4:7),0);
  if(e.state==='kb')c.rotate(.28);
  if(e.hurt>0&&((clock*40)|0)%2)c.globalAlpha=.55;
  A.drawActor(c,e.id,{t:e.anim+e.seed*5,sw:Math.sin(e.walk),atk,roll:e.walk*1.7});
  c.restore();
  if(e.stun>0)word(c,'時',e.x,GROUND-62,'#fff7d6',16);
  else if(e.slow>0){c.globalAlpha=.8;A.E(c,e.x+6,GROUND-50-(d.fly||0),9,6,'#d8dedd',0,1.2);c.globalAlpha=1}
  if(e.shield){A.dot(c,e.x+14,GROUND-54,3,'#ffe63b')}
}
function drawDead(c,f){
  const e=f.e,a=f.t/f.life;
  if(e.side>0){
    c.save();c.translate(e.x,GROUND+e.lane-a*(GROUND-WATER_Y+4));c.globalAlpha=Math.min(1,(1-a)*2.4);
    c.rotate(Math.min(1,a*4)*3.14);c.translate(0,20);A.drawActor(c,e.id,{t:0,sw:0,atk:0,roll:0});c.restore();
  }else{
    c.globalAlpha=1-a;for(let i=0;i<6;i++){const q=i/6*6.28;A.E(c,e.x+Math.cos(q)*a*40,GROUND-30+Math.sin(q)*a*30,8*(1-a)+2,8*(1-a)+2,'#fff',0,1.4)}c.globalAlpha=1;
  }
}
function drawBaseHp(c,b,label){
  const y=b.side>0?144:74,w=86,x=b.x-w/2;
  c.fillStyle='rgba(13,52,64,.85)';c.fillRect(x,y,w,18);
  c.fillStyle=b.side>0?'#ff8a5c':'#e9e4d0';c.fillRect(x+2,y+2,(w-4)*Math.max(0,b.hp/b.max),14);
  c.font="11px 'Zen Maru Gothic','Hiragino Sans',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.strokeStyle=A.INK;c.lineWidth=3;c.strokeText(label,b.x,y+9);c.fillText(label,b.x,y+9);
}
function drawField(dt){
  const c=ctx,r=cv.width/dpr,h=cv.height/dpr;
  c.setTransform(dpr,0,0,dpr,0,0);
  c.fillStyle=bg.pal.sky[0];c.fillRect(0,0,r,h);
  c.save();
  const sx=shakeT>0&&!REDUCED?(Math.random()-.5)*9*shakeT*2:0;
  c.translate(0,offY);c.scale(Sc,Sc);
  c.drawImage(bg.far,cam,0,Math.min(vw*2,bg.far.width-cam),VH*2,0,0,Math.min(vw,bg.far.width/2-cam/2),VH);
  c.translate(sx/Sc-cam,0);
  c.drawImage(bg.near,0,0,B.L,VH);
  const ch=B.s.ch;
  c.save();c.translate(B.ebase.x+(B.ebase.shake>0?Math.sin(clock*70)*3:0),0);A.drawEnemyBase(c,ch,clock,GROUND+6);c.restore();
  c.save();c.translate(B.pbase.x+(B.pbase.shake>0?Math.sin(clock*70)*3:0),0);A.drawSchool(c,clock,GROUND+6,B.pbase.hp/B.pbase.max);c.restore();
  const all=[...B.us,...B.es].sort((a,b)=>a.lane-b.lane);
  for(const f of vfx)if(f.k==='die')drawDead(c,f);
  for(const e of all)drawOne(c,e,clock);
  // 手前の水
  const x0=Math.max(0,cam-10),x1=Math.min(B.L,cam+vw+10);
  c.beginPath();c.moveTo(x0,GROUND+8);c.lineTo(x0,WATER_Y);
  for(let x=x0;x<=x1;x+=14)c.lineTo(x,WATER_Y+Math.sin(x*.035+clock*2)*2.4);
  c.lineTo(x1,GROUND+8);c.closePath();c.fillStyle='rgba(60,170,190,.26)';c.fill();
  c.lineWidth=2.5;c.strokeStyle='rgba(255,255,255,.75)';c.beginPath();for(let x=x0;x<=x1;x+=14){const y=WATER_Y+Math.sin(x*.035+clock*2)*2.4;x===x0?c.moveTo(x,y):c.lineTo(x,y)}c.stroke();
  c.lineWidth=1.6;c.strokeStyle='rgba(255,255,255,.28)';
  for(let i=0;i<26;i++){const x=((i*173+clock*(60+i%3*20))%(B.L+80))-40,y=WATER_Y+14+(i*29)%60;if(x<x0||x>x1)continue;c.beginPath();c.moveTo(x,y);c.lineTo(x+18+i%3*7,y);c.stroke()}
  // 演出
  for(const f of vfx){
    if(f.k==='atk')drawAtkFx(c,f);
    else if(f.k==='hit')burst(c,f.x,f.y,(f.big?26:14)*(1-f.t/f.life*.5),f.big?'#ffe63b':'#fff');
    else if(f.k==='word'){c.globalAlpha=Math.min(1,(1-f.t/f.life)*2);word(c,f.s,f.x,f.y-f.t*24,f.col,f.s.length>2?14:17);c.globalAlpha=1}
  }
  if(B.wave){
    const x=B.wave.x,top=GROUND-158;
    c.beginPath();c.moveTo(x+vw+200,GROUND+10);c.lineTo(x+46,GROUND+10);c.quadraticCurveTo(x-22,GROUND-70,x+26,top+26);c.quadraticCurveTo(x+56,top-18,x+120,top);c.lineTo(x+vw+200,top);c.closePath();
    const g=c.createLinearGradient(x,0,x+420,0);g.addColorStop(0,'rgba(120,214,226,.96)');g.addColorStop(1,'rgba(31,127,149,.55)');c.fillStyle=g;c.fill();c.lineWidth=3;c.strokeStyle=A.INK;c.stroke();
    for(let i=0;i<13;i++){const q=i/12,yy=GROUND+4-q*172,xx=x+34-Math.sin(q*3.1)*40+Math.sin(clock*26+i*1.7)*7;A.E(c,xx,yy,13+(i%3)*5,10+(i%2)*5,'#f7fdfc',i,0)}
    word(c,'鉄砲水',x+150,GROUND-96,'#ffe63b',26);
  }
  drawBaseHp(c,B.ebase,`${fmt(B.ebase.hp)} / ${fmt(B.ebase.max)}`);
  drawBaseHp(c,B.pbase,`${fmt(B.pbase.hp)} / ${fmt(B.pbase.max)}`);
  c.restore();
  // 全体図
  const mx=16,mw=r-32,my=48,per=mw/B.L;
  c.fillStyle='rgba(13,52,64,.6)';c.fillRect(mx,my,mw,8);
  c.fillStyle='rgba(255,255,255,.28)';c.fillRect(mx+cam*per,my,vw*per,8);
  for(const e of B.us){c.fillStyle='#ff8a5c';c.fillRect(mx+e.x*per-1,my+1,2.4,6)}
  for(const e of B.es){c.fillStyle=e.def.boss?'#ffe63b':'#17242c';c.fillRect(mx+e.x*per-1,my+1,e.def.boss?4:2.4,6)}
  if(flash>0){c.fillStyle=`rgba(255,255,255,${flash*2})`;c.fillRect(0,0,r,h)}
  if(banner&&banner.t<2.2){const a=Math.min(1,Math.min(banner.t*5,(2.2-banner.t)*3));c.globalAlpha=a;c.fillStyle='#e3170a';c.fillRect(0,h*.26,r,44);word(c,banner.s,r/2,h*.26+23,'#ffe63b',Math.min(26,r/14));c.globalAlpha=1}
}
let slotCache=[];
function syncHud(){
  const full=B.money>=B.cap,hm=$('hud-money');
  $('m-now').textContent=fmt(B.money);$('m-cap').textContent=` / ${fmt(B.cap)}`;
  hm.style.setProperty('--c',B.money/B.cap);hm.classList.toggle('full',full);
  B.slots.forEach((s,i)=>{const el=$('slot-'+i);if(!el)return;
    const poor=B.money<s.def.cost,waiting=s.cd>0,done=(1-s.cd/s.def.cd).toFixed(2),key=`${poor}${waiting}${done}`;
    if(slotCache[i]===key)return;slotCache[i]=key;
    if(!waiting&&el.classList.contains('cooling'))el.classList.add('flash');
    el.classList.toggle('poor',poor);el.classList.toggle('cooling',waiting);
    el._bar.style.setProperty('--c',done);el._sec.textContent=Math.ceil(s.cd)});
  const st=$('btn-stom'),fl=$('btn-flood'),mx=B.stom>=STOM.max;
  st.querySelector('b').textContent=`胃袋 Lv${B.stom}`;st.querySelector('small').textContent=mx?'最大':`${STOM.cost(B.stom)}で+${STOM.cap(B.stom+1)-STOM.cap(B.stom)}`;
  st.style.setProperty('--c',mx?1:Math.min(1,B.money/STOM.cost(B.stom)));st.classList.toggle('ready',B.canUp());
  const ready=B.canFire();fl.classList.toggle('ready',ready);fl.style.setProperty('--c',B.flood.c/B.flood.need);fl.querySelector('small').textContent=ready?'押すと発射':`${Math.ceil(B.flood.need-B.flood.c)}秒`;
}
function tickBattle(dt){
  if(!B)return;
  if(!paused&&!B.over){
    const st=1/60;acc+=Math.min(.1,dt)*speed;
    while(acc>=st){B.step(st);acc-=st}
    if(userPan>0)userPan-=dt;
    else{const front=B.us.length?Math.min(...B.us.map(e=>e.x)):B.L,target=front-vw*.32;cam+=(target-cam)*Math.min(1,dt*1.6);clampCam()}
  }
  drainFx();
  for(const f of vfx)f.t+=paused?0:dt;
  vfx=vfx.filter(f=>f.t<f.life);
  if(!paused){shakeT=Math.max(0,shakeT-dt);flash=Math.max(0,flash-dt);if(banner)banner.t+=dt}
  drawField(dt);syncHud();
  Snd.setBgm(!B.over&&B.es.some(e=>e.def.boss)?'boss':'normal');
  if(scene)scene();
  if(B.over&&!endQueued){endQueued=true;setTimeout(finish,900)}
}
let acc=0,scene=null;

/* タイトルの行列 */
const par=$('parade'),pctx=par.getContext('2d');
const paradeIds=['shake','ikura','nigiri','beni','aramaki','onigiri','sakura','ashi','oyako','smoke','king','keiji','toba','gin','ishikari','hanamagari','flake','toki','karafuto','abari','chanchan','trout','osuke'];
function drawParade(){
  const r=par.getBoundingClientRect();if(!r.width)return;const d=Math.min(devicePixelRatio||1,2);
  if(par.width!==(r.width*d|0)||par.height!==(r.height*d|0)){par.width=r.width*d|0;par.height=r.height*d|0}
  const c=pctx;c.setTransform(d,0,0,d,0,0);
  const g=c.createLinearGradient(0,0,0,r.height);g.addColorStop(0,'#ffb994');g.addColorStop(.55,'#f7dcc0');c.fillStyle=g;c.fillRect(0,0,r.width,r.height);
  c.fillStyle='#6f9a62';c.beginPath();c.moveTo(0,r.height*.62);for(let x=0;x<=r.width+60;x+=60)c.lineTo(x,r.height*.56-Math.sin(x*.012)*34-Math.abs(Math.sin(x*.05))*16);c.lineTo(r.width,r.height*.66);c.lineTo(0,r.height*.66);c.closePath();c.fill();
  const wy=r.height*.66;c.fillStyle='#2a8ea3';c.fillRect(0,wy,r.width,r.height-wy);c.fillStyle='#176477';c.fillRect(0,r.height-30,r.width,30);
  const gap=124,tot=paradeIds.reduce((s,id)=>s+(id==='osuke'?300:id==='king'?190:gap),0),base=r.height-16,sc=Math.max(.8,Math.min(1.25,r.height/640));
  let x=-220-(clock*46)%tot;
  for(let pass=0;pass<3;pass++)for(const id of paradeIds){
    const w=id==='osuke'?300:id==='king'?190:gap;
    if(x>-260&&x<r.width+260){c.save();c.translate(x,base);c.scale(sc,sc);A.drawActor(c,id,{t:clock+x*.01,sw:Math.sin(clock*8+x),atk:0,roll:clock*5});c.restore()}
    x+=w;
  }
  c.lineWidth=3;c.strokeStyle='rgba(255,255,255,.8)';c.beginPath();for(let q=0;q<=r.width;q+=14){const y=wy+Math.sin(q*.03+clock*2)*3;q?c.lineTo(q,y):c.moveTo(q,y)}c.stroke();
}

let last=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(.05,(now-last)/1000);last=now;clock+=dt;
  if(document.hidden)return;
  if(view==='battle')tickBattle(dt);else if(view==='title')drawParade();
}

$('btn-start').onclick=()=>{Snd.wake();show('menu')};
for(const b of document.querySelectorAll('.tabs button'))b.onclick=()=>setTab(b.dataset.tab);
const sndBtn=$('btn-snd');const sndLabel=()=>{sndBtn.textContent=save.snd?'音':'消';sndBtn.setAttribute('aria-pressed',save.snd)};sndLabel();
sndBtn.onclick=()=>{save.snd=!save.snd;persist();sndLabel();if(save.snd)Snd.wake();else Snd.stop()};
// iOSは指を離した時しか音を許可せず、アプリ切り替え後は音が止まるので毎回起こす
for(const ev of['touchend','pointerup'])addEventListener(ev,()=>Snd.wake(),{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&view==='battle'&&B&&!B.over&&!paused)togglePause()});
show('title');
window.__g={get B(){return B},startBattle,get save(){return save},setTab,show,Snd,quit};
requestAnimationFrame(frame);
})();
