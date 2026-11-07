(()=>{
'use strict';
const G=window.SALMON,A=window.SALMON_ART;
const{YUKON,stagesOf,VH,WATER_Y,GROUND,GOD_HITS,GOD_SWEEP,BGOD,FLOE_V,CLASH_T,CLASH_RATE,TRAIT,LAPS,RARE,UNITS,FUSE,ENEMIES,CHAPTERS,STAGES,STOM,META,lvMul,lvCost,metaCost,battleCfg,Battle}=G;
const $=id=>document.getElementById(id);
const fmt=n=>Math.floor(n).toLocaleString('ja-JP');
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY='salmon-run-v1',SPIN=200,MAXLV=30;
// ユーコン川の1回目。ylapはユーコン川タブで選んでいる周回
const YL=LAPS.findIndex(l=>l.yukon);
const fresh=()=>({ikura:300,own:{shake:1,ikura:1,aramaki:1},team:['shake','ikura','aramaki'],prog:LAPS.map(()=>0),meta:{wall:0,flood:0,stom:0},lap:0,ylap:YL,tip:false,snd:true,fuse:[]});
// 更新で項目が増減しても、古いセーブを今の形に直して読む
function migrate(s){
  const f=fresh(),own={};
  for(const[k,v]of Object.entries(s.own))if(UNITS[k]&&v>0)own[k]=Math.min(MAXLV,v|0);
  if(!Object.keys(own).length)Object.assign(own,f.own);
  const team=(Array.isArray(s.team)?s.team:[]).filter(k=>own[k]);
  return{...f,...s,own,team:team.length?team:Object.keys(own).slice(0,3),
    prog:f.prog.map((_,i)=>Math.min(stagesOf(i).length,Math.max(0,((s.prog||[])[i])|0))),
    meta:{...f.meta,...s.meta},fuse:(Array.isArray(s.fuse)?s.fuse:[]).filter(k=>FUSE[k]),lap:(l=>LAPS[l].yukon?0:l)(Math.min(LAPS.length-1,Math.max(0,s.lap|0))),ylap:LAPS[s.ylap]&&LAPS[s.ylap].yukon?s.ylap:YL};
}
let save=fresh();
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.own)save=migrate(s)}catch(e){}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}};
// 8年後の遡上をクリアすると、ハードとユーコン川がひらく
const lapOpen=i=>{if(!i)return true;const n=LAPS[i].need??i-1;return save.prog[n]>=stagesOf(n).length};
const yukonOpen=()=>lapOpen(LAPS.findIndex(l=>l.yukon));
const cleared=i=>save.prog[i]>=stagesOf(i).length;

/* 音 */
// エンディングの曲。和音は1小節ずつ、旋律は8分音符ずつ。-1はのばす
const SONG=(()=>{
  const C={C:[48,55,60,64,67],Gb:[47,55,59,62,67],Am:[45,52,57,60,64],Eg:[43,52,55,59,64],F:[41,48,53,57,60],Ce:[40,48,52,55,60],Dm:[38,45,50,53,57],G:[43,50,55,59,62],Em:[40,47,52,55,59]};
  const _=-1;
  return{ch:'C Gb Am Eg F Ce Dm G F G Em Am F G C C'.split(' ').map(k=>C[k]),mel:[
    76,_,_,_,74,_,72,_, 74,_,_,_,_,_,67,_, 72,_,_,_,71,_,69,_, 71,_,_,_,_,_,67,_,
    69,_,_,_,72,_,77,_, 76,_,_,_,74,_,72,_, 74,_,_,76,77,_,69,_, 71,_,_,_,74,_,_,_,
    81,_,_,_,79,_,77,_, 79,_,_,_,74,_,_,_, 79,_,_,_,76,_,74,_, 72,_,_,_,76,_,81,_,
    81,_,_,_,79,_,77,_, 76,_,77,_,79,_,74,_, 76,_,_,_,72,_,_,_, 72,_,_,_,_,_,_,_]};
})();
const Snd={ac:null,timer:null,step:0,mode:'normal',
  wake(){if(!save.snd)return;if(!this.ac){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ac=new C()}if(this.ac.state!=='running')this.ac.resume();this.bgm()},
  tone(f,d=.1,type='triangle',v=.05,when=0,to){if(!this.ac||!save.snd)return;const t=this.ac.currentTime+when,o=this.ac.createOscillator(),g=this.ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g).connect(this.ac.destination);o.start(t);o.stop(t+d+.02)},
  noise(d=.3,v=.08,fc=900,when=0){if(!this.ac||!save.snd)return;const n=this.ac.sampleRate*d|0,b=this.ac.createBuffer(1,n,this.ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=this.ac.createBufferSource(),f=this.ac.createBiquadFilter(),g=this.ac.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=fc;g.gain.value=v;s.connect(f).connect(g).connect(this.ac.destination);s.start(this.ac.currentTime+when)},
  note(f,d,v,when,type='sine'){if(!this.ac||!save.snd)return;const t=this.ac.currentTime+when,o=this.ac.createOscillator(),g=this.ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g).connect(this.ac.destination);o.start(t);o.stop(t+d+.05)},
  // 少し先まで予約して鳴らす。setIntervalの揺れを拍に出さないため
  song(){
    const a=this.ac,e=60/72/2,f=m=>440*2**((m-69)/12);
    if(this.next<a.currentTime)this.next=a.currentTime+.05;
    while(this.next<a.currentTime+.35){
      const i=this.step++%128,s=i&7,B=i>=64,ch=SONG.ch[i>>3],w=this.next-a.currentTime,m=SONG.mel[i];
      if(s===0||(B&&s===4))this.note(f(ch[0]),e*7,.05,w);
      const ar=[0,1,2,3,4,3,2,1][s];if(ar)this.tone(f(ch[ar]),e*3,'triangle',.016,w);
      if(m>0){let n=1;while(SONG.mel[(i+n)%128]===-1)n++;this.note(f(m),e*n+.25,B?.05:.04,w,'triangle');if(B)this.note(f(m-12),e*n+.25,.018,w)}
      if(B&&s===0)for(const k of[2,3,4])this.note(f(ch[k]+12),e*8,.008,w);
      this.next+=e;
    }
  },
  bgm(){if(this.timer)return;
    // 広告の曲は音の時計で少し先まで予約する。スマホで画面の処理が重くても拍がもたつかないように
    if(this.mode==='ad'){const m=[523,659,784,1046,784,659,698,587,523,659,784,880,784,0,1046,0];this.next=0;
      this.timer=setInterval(()=>{const a=this.ac;if(!save.snd||document.hidden||!a){this.next=0;return}
        if(this.next<a.currentTime)this.next=a.currentTime+.05;
        while(this.next<a.currentTime+.3){const i=this.step++%16,w=this.next-a.currentTime;if(m[i])this.tone(m[i],.13,'square',.022,w);if(i%4===0)this.tone(i%8?196:131,.2,'triangle',.05,w);this.next+=.15}},60);
      return}
    if(this.mode==='ending'){this.next=0;this.timer=setInterval(()=>{if(!save.snd||document.hidden||!this.ac){this.next=0;return}this.song()},60);return}
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
  god(){[523,659,784,1046,1318].forEach((f,i)=>this.tone(f,.6,'triangle',.05,i*.09));this.tone(1568,1.2,'sine',.03,.5)},
  godhit(w=0){this.noise(1,.14,900,w);this.tone(98,.8,'sawtooth',.05,w,49)},
  // 天の川の列が手前から敵の方へ走る1秒。ざっと上がる水音に、のぼる鮭のきらきらを重ねる
  sweep(w=0){if(!this.ac||!save.snd)return;const a=this.ac,t=a.currentTime+w,n=a.sampleRate*1.1|0,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
    const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type='bandpass';f.Q.value=1.4;f.frequency.setValueAtTime(500,t);f.frequency.exponentialRampToValueAtTime(3200,t+1);
    g.gain.setValueAtTime(.0008,t);g.gain.exponentialRampToValueAtTime(.12,t+.25);g.gain.exponentialRampToValueAtTime(.0008,t+1.1);s.connect(f).connect(g).connect(a.destination);s.start(t);s.stop(t+1.12);
    [784,880,988,1175,1319,1568,1760,2093].forEach((fq,i)=>this.tone(fq,.25,'triangle',.03,w+i*.125))},
  // 列が敵の城に届いた時のどん
  thud(w=0){this.tone(110,.35,'sawtooth',.05,w,55);this.noise(.25,.1,600,w)},
  heal(w=0){[1046,1318,1568].forEach((f,i)=>this.tone(f,.4,'sine',.03,w+i*.07))},
  // 出力までの遅れ。分かる端末だけ、その分だけ早めに鳴らす
  lag(){const a=this.ac;return a?Math.min(.15,a.outputLatency||a.baseLatency||0):0},
  // ボスの守護神。低く下がっていく不気味な音
  bgod(){[220,208,196,185,175].forEach((f,i)=>this.tone(f,.5,'sawtooth',.045,i*.12));this.noise(1.2,.1,400)},
  bghit(id){
    if(id==='todo'){this.noise(.6,.12,3200);this.tone(1400,.35,'triangle',.03,0,700);this.tone(80,.6,'sawtooth',.06,0,40)}
    else if(id==='taisho'){for(let i=0;i<4;i++)this.tone(900+i*140,.07,'square',.02,i*.05);this.noise(.12,.07,2600)}
    else if(id==='amimoto'){this.tone(260,.5,'triangle',.05,0,900);this.noise(.4,.08,1200)}
    else this.godhit()},
  tap(){this.tone(620+Math.random()*160,.05,'square',.02)},
  fuse(){[392,523,659,784,1046].forEach((f,i)=>this.tone(f,.22,'square',.03,i*.06));this.noise(.3,.08,2000)},
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
function show(v){view=v;for(const k of['title','menu','battle','ending'])$('v-'+k).hidden=k!==v;if(v==='menu')setTab(tab);if(v==='battle')fit()}
function setTab(t){tab=t;for(const b of document.querySelectorAll('.tabs button'))b.setAttribute('aria-selected',b.dataset.tab===t);
  for(const k of['map','yukon','ike','lane'])$('p-'+k).hidden=k!==t;({map:renderMap,yukon:renderYukon,ike:renderIke,lane:renderLane})[t]();$('purse').textContent=fmt(save.ikura)}
function refreshPurse(){$('purse').textContent=fmt(save.ikura)}
let toastT;function toast(s){const t=$('toast');t.textContent=s;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,1600)}

/* マップ */
function enemiesOf(s){const seen=[];for(const r of s.rules)if(!seen.includes(r.e))seen.push(r.e);return seen}
function renderMap(){renderRiver($('p-map'),save.lap)}
// ユーコン川タブ。ひらく前は鍵つきで見せ、初めて開いた時は迷子になったいきさつを流す
function renderYukon(){
  const p=$('p-yukon');
  if(!yukonOpen()){p.innerHTML='';const b=document.createElement('div');b.className='ylock';
    b.innerHTML='<h2>ユーコン川</h2><p>海の向こうの大きな川。生まれた川まで、3,000km。</p>';b.appendChild(portrait('yking',120,{dark:1}));
    const n=document.createElement('p');n.textContent='「8年後の遡上」をクリアするとひらく';b.appendChild(n);p.appendChild(b);return}
  if(!save.yIntro){save.yIntro=true;persist();Snd.wake();playEnding('yintro',()=>show('menu'));return}
  renderRiver(p,lapOpen(save.ylap)?save.ylap:YL);
  const n=document.createElement('p');n.className='ynote';n.textContent='ユーコン川では、オキアミがあまりたまらない。満タンから大事に使おう。';p.insertBefore(n,p.querySelector('.river'));
}
function renderRiver(p,lap){
  const prog=save.prog[lap],SL=stagesOf(lap),yk=!!LAPS[lap].yukon;p.innerHTML='';
  const laps=document.createElement('div');laps.className='laps';
  // 「川をのぼる」タブには既存の川の周回、「ユーコン川」タブにはユーコン川の周回だけを並べる
  LAPS.forEach((l,i)=>{if(!!l.yukon!==yk||!lapOpen(i))return;const b=document.createElement('button');b.textContent=l.btn||(l.hard?l.n:i?`${l.n}(敵の強さ ×${l.m})`:l.n);b.setAttribute('aria-pressed',i===lap);
    b.onclick=()=>{if(yk){save.ylap=i;persist();renderYukon()}else{save.lap=i;persist();renderMap()}};laps.appendChild(b)});
  const edOk=yk?cleared(YL):cleared(0);
  // ユーコン川タブでは、迷子になったいきさつ(導入)をいつでも見直せる
  if(yk){const b=document.createElement('button');b.textContent='はじまりを見る';b.onclick=()=>{Snd.wake();playEnding('yintro',()=>show('menu'))};laps.appendChild(b)}
  if(edOk){const b=document.createElement('button');b.textContent='エンディングを見る';b.onclick=()=>{Snd.wake();playEnding(yk?YL:lap,()=>show('menu'))};laps.appendChild(b)}
  if(laps.children.length>1||edOk)p.appendChild(laps);
  const riv=document.createElement('div');riv.className='river';let chShown=-1,nextEl=null;
  for(let i=SL.length-1;i>=0;i--){
    const s=SL[i],locked=i>prog,done=i<prog;
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
const reward=(i,lap,first)=>Math.round(stagesOf(lap)[i].reward*LAPS[lap].r*(first?1:.5));

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
  if(d.onDeath)a.push(`倒れると${UNITS[d.onDeath.id].n}${d.onDeath.n}体`);
  if(d.haste)a.push('仲間の足を速くする');
  if(d.revive)a.push('一度だけ起き上がる');
  if(d.fat)a.push(`倒れるとオキアミ +${d.fat}`);
  return a;
}
const unlockHint=d=>d.yukon&&!yukonOpen()?'ユーコン川がひらくと会える':d.via==='gacha'?'回転レーンで出ることがある':d.via.clear!==undefined?`「${STAGES[d.via.clear].n}」をクリア`:d.via.yclear!==undefined?`ユーコン川の「${YUKON[d.via.yclear].n}」をクリア`:'';
function renderIke(){
  const p=$('p-ike');p.innerHTML='';
  const h=document.createElement('h2');h.textContent=`出撃する${save.team.length}組(最大10)`;p.appendChild(h);
  const team=document.createElement('div');team.className='team';
  for(let i=0;i<10;i++){const id=save.team[i],b=document.createElement('button');b.className='tslot'+(id?' on':'');if(id){b.appendChild(portrait(id,64));b.setAttribute('aria-label',`${UNITS[id].n}を見る`);b.onclick=()=>{sel=id;renderIke()}}else{b.disabled=true;b.setAttribute('aria-label','空き')}team.appendChild(b)}
  p.appendChild(team);
  const wrap=document.createElement('div');wrap.className='ike';
  // 生まれた川の仲間とユーコン川の仲間を、別々の枠に分けて並べる
  const cols=document.createElement('div');
  const groups=[['生まれた川の仲間',k=>!UNITS[k].yukon],['ユーコン川の仲間',k=>UNITS[k].yukon]];
  for(const[title,f]of groups){const gh=document.createElement('h3');gh.className='gh';gh.textContent=title;
    const grid=document.createElement('div');grid.className='grid';cols.append(gh,grid);
  for(const id of Object.keys(UNITS).filter(f)){const d=UNITS[id],own=save.own[id],b=document.createElement('button');
    b.className=`cell r-${d.r}${own?'':' lock'}${sel===id?' sel':''}`;
    b.appendChild(portrait(id,84,{dark:!own}));
    const n=document.createElement('span');n.className='nm';n.textContent=own?d.n:'???';b.appendChild(n);
    if(own){const l=document.createElement('span');l.className='lv';l.textContent='Lv'+own;b.appendChild(l)}
    if(save.team.includes(id)){const l=document.createElement('span');l.className='in';l.textContent='出撃';b.appendChild(l)}
    b.onclick=()=>{sel=id;renderIke();document.querySelector('.detail').scrollIntoView({block:'nearest'})};grid.appendChild(b)}}
  const det=document.createElement('div');det.className='detail';det.appendChild(detailOf(sel));
  wrap.append(cols,det);p.appendChild(wrap);
  // 合体は隠し要素。見つけるまで名前も組み合わせも伏せる
  const fk=Object.keys(FUSE),fh=document.createElement('h2');fh.className='mt';fh.textContent=`合体 ${save.fuse.length} / ${fk.length}`;p.appendChild(fh);
  const fn=document.createElement('p');fn.className='fuse-hint';fn.textContent='出撃のしかたを工夫すると、仲間どうしが合体することがあるらしい。';p.appendChild(fn);
  const fl=document.createElement('div');fl.className='fuses';
  for(const k of fk){const f=FUSE[k],got=save.fuse.includes(k),el=document.createElement('div');el.className='fuse'+(got?'':' lock');
    if(got)el.appendChild(portrait(k,64));else{const q=document.createElement('span');q.className='q';q.textContent='?';el.appendChild(q)}
    const t=document.createElement('div');t.innerHTML=got?`<b>${f.n}</b><small>${UNITS[f.of[0]].n} + ${UNITS[f.of[1]].n}</small><small>${f.txt}</small>`:'<b>???</b><small>??? + ???</small>';
    el.appendChild(t);fl.appendChild(el)}
  p.appendChild(fl);
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
// ユーコン川の仲間は、ユーコン川がひらいてから流れてくる
const lanePool=()=>Object.keys(UNITS).filter(k=>UNITS[k].via==='gacha'&&(!UNITS[k].yukon||yukonOpen()));
let spinning=false,lastPull=null;
function renderLane(){
  const p=$('p-lane');p.innerHTML='';
  const gachaIds=lanePool(),got=gachaIds.filter(k=>save.own[k]).length;
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
  const pool=lanePool().filter(k=>UNITS[k].r===rar),id=pool[Math.random()*pool.length|0];
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
  B=new Battle(si,lap,battleCfg(save));bg=A.makeBackground(B.s.ch,B.L,VH,WATER_Y,GROUND,CHAPTERS);
  scene=null;adT=-1;godSfx=[];clashT=-1;$('clash').hidden=true;$('ad').hidden=true;Snd.setBgm('normal');vfx=[];slotCache=[];paused=false;userPan=0;endQueued=false;banner=null;speed=1;$('btn-speed').textContent='×1';$('over').hidden=true;
  $('hud-stage').textContent=`${LAPS[lap].hard?'ハード ':''}${fmt(B.s.km)}km ${B.s.n}`;
  buildSlots();show('battle');fit();cam=B.L-vw;clampCam();
  const tip=$('tip');
  if(!save.tip){tip.hidden=false;tip.textContent='下の値札を押すと仲間が出ます。オキアミは右上の胃袋にたまり、満腹になると止まります。左下で胃袋を広げられます。左の敵の拠点を壊せば勝ちです。';tip.onclick=()=>{tip.hidden=true};save.tip=true;persist();setTimeout(()=>{tip.hidden=true},9000)}
  else if(B.fast&&!save.yTip){tip.hidden=false;tip.textContent='川に入った鮭は、なにも食べずに泳ぎ続けます。胃袋は最大の2,600まで満タンで始まりますが、オキアミは少ししかたまりません。敵を倒すとオキアミが増えます。';tip.onclick=()=>{tip.hidden=true};save.yTip=true;persist();setTimeout(()=>{tip.hidden=true},11000)}
  else tip.hidden=true;
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
// 2つの値札がほぼ同時(FUSE_MS以内)に押され、その2体が合体できる組み合わせなら合体させる。隠し要素
const FUSE_MS=180;let lastPress={i:-1,t:0};
function deploy(i){
  if(!B||paused)return;
  const now=performance.now(),pv=lastPress;
  if(pv.i>=0&&pv.i!==i&&now-pv.t<FUSE_MS){const fid=B.fuseOf(pv.i,i);if(fid&&B.fuse(pv.i,i,fid)){lastPress={i:-1,t:0};return}}
  if(B.deploy(i)){Snd.spawn();lastPress={i,t:now}}
}
function upStom(){if(B&&!paused&&B.upStom()){Snd.coin();const m=$('hud-money');m.classList.remove('grow');void m.offsetWidth;m.classList.add('grow')}}
// 守護神は広告を見てから呼ぶ。今の広告は仮で、ゲーム自身の宣伝を5秒流す
const GODS=[{g:'並',n:'守護神の大波'},{g:'上',n:'イクラ流星群'},{g:'特上',n:'天の川のぼり'}];
let adT=-1;
function askGod(){
  if(!B||paused||!B.canGod())return;
  paused=true;
  overlay(`<h2>守護神をよぶ?</h2><p>鮭の守護神さまは、ただいまCMの真っ最中。5秒の広告が終わったら、かけつけてくれます。</p><p class="note">何が起きるかは、来てからのお楽しみ。2分に1回よべます。</p><div class="row"><button class="pop" id="o-ad">広告を見てよぶ</button><button class="pop ghost" id="o-no">やめておく</button></div>`,
    {'o-ad':()=>{$('over').hidden=true;adT=0;$('ad').hidden=false;Snd.setBgm('ad')},'o-no':()=>{$('over').hidden=true;paused=false}});
}
function tickAd(dt){
  adT+=dt;const cv=$('ad-cv'),r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  if(r.width){if(cv.width!==(r.width*d|0)||cv.height!==(r.height*d|0)){cv.width=r.width*d|0;cv.height=r.height*d|0}
    const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);drawAd(c,r.width,r.height,adT)}
  $('ad-left').textContent=`あと${Math.max(1,Math.ceil(5-adT))}秒`;
  if(adT<5)return;
  adT=-1;$('ad').hidden=true;paused=false;
  const q=Math.random();if(B)B.summon(q<.5?0:q<.9?1:2);
}
function drawAd(c,w,h,t){
  const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffb994');g.addColorStop(.6,'#f7dcc0');c.fillStyle=g;c.fillRect(0,0,w,h);
  const wy=h*.68;c.fillStyle='#2a8ea3';c.fillRect(0,wy,w,h-wy);c.fillStyle='#176477';c.fillRect(0,h-24,w,24);
  const sc=Math.max(.7,Math.min(1.1,h/520));
  ['shake','ikura','nigiri','beni','onigiri','king','ashi','oyako'].forEach((id,i)=>{const x=w+80-((t*150+i*130)%(w+320));c.save();c.translate(x,h-12);c.scale(sc,sc);A.drawActor(c,id,{t:t+i,sw:Math.sin(t*8+i),atk:0,roll:t*5});c.restore()});
  const big=(s,y,fs,col,rot=0)=>{c.save();c.translate(w/2,y);c.rotate(rot);c.font=`${fs}px 'Dela Gothic One',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.fillStyle=A.INK;c.fillText(s,fs*.07,fs*.09);c.lineWidth=fs*.14;c.strokeStyle=A.INK;c.strokeText(s,0,0);c.fillStyle=col;c.fillText(s,0,0);c.restore()};
  const fs=Math.min(w/9,h/6);
  if(t<1.7)big('268kmを、',h*.36,fs,'#fffdf4');
  else if(t<3.4)big('のぼりきれ。',h*.36,fs,'#fffdf4');
  else{const k=Math.min(1,(t-3.4)/.25);big('サーモン大遡上',h*.3,Math.min(w/8,h/5)*(1.4-.4*k),'#ff8a5c',-.04);
    if(t>3.8){c.save();c.translate(w/2,h*.52);c.rotate(.03);const tw=Math.min(w*.6,260),th=fs*.62;c.fillStyle='#ffe63b';c.fillRect(-tw/2,-th/2,tw,th);c.lineWidth=3;c.strokeStyle=A.INK;c.strokeRect(-tw/2,-th/2,tw,th);c.fillStyle='#e3170a';c.font=`${th*.6}px 'Dela Gothic One',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('好評遡上中!',0,2);c.restore()}}
}
press($('btn-god'),askGod);
function fire(){if(B&&!paused&&B.fire())Snd.flood()}
press($('btn-stom'),upStom);press($('btn-flood'),fire);
$('btn-speed').onclick=()=>{speed=speed===1?2:1;$('btn-speed').textContent='×'+speed};
$('btn-pause').onclick=()=>togglePause();
function togglePause(){
  if(!B||B.over)return;paused=!paused;
  if(paused)overlay(`<h2>一時停止</h2><p>${B.s.n}</p><div class="row"><button class="pop" id="o-resume">続ける</button><button class="pop ghost" id="o-quit">川をおりる</button></div>`,{'o-resume':togglePause,'o-quit':quit});
  else $('over').hidden=true;
}
function quit(){B=null;scene=null;godSfx=[];clashT=-1;$('clash').hidden=true;paused=false;Snd.setBgm('normal');$('over').hidden=true;show('menu')}
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
      const yk=!!LAPS[b.lap].yukon;
      if(b.lap===0||yk)for(const[k,d]of Object.entries(UNITS))if((yk?d.via.yclear:d.via.clear)===b.si&&!save.own[k]){save.own[k]=1;if(save.team.length<10)save.team.push(k);unlocked=k}}
    persist();
    const last=first&&b.si===stagesOf(b.lap).length-1,ending=last&&!LAPS[b.lap].hard&&!LAPS[b.lap].yukon&&b.lap<LAPS.length-1;
    let extra=null,html=`<h2>${last?'帰ってきた':'遡上成功'}</h2><div class="prize">イクラ +${fmt(gain)}</div>`;
    if(ending)html+=`<p>268km、泳ぎきった。川底に卵を産んで、この旅は終わる。4年後、この卵から生まれた子どもたちが、また帰ってくる。</p>`;
    if(last&&LAPS[b.lap].yukon)html+=LAPS[b.lap].hard?`<p>4年後のユーコン川も、3,000km泳ぎきった。どんな川でも、鮭はのぼる。</p>`:`<p>3,000km、泳ぎきった。ユーコン川の仲間たちと、ここまで来た。</p>`;
    // ユーコン川の1回目をクリアすると、ユーコン川の4年後がひらく
    const ynext=last&&LAPS[b.lap].yukon?LAPS.findIndex(l=>l.yukon&&l.need===b.lap):-1;
    if(ynext>=0){html+=`<p>ユーコン川の「${LAPS[ynext].btn}」がひらいた。</p>`;save.ylap=ynext;persist()}
    if(ending&&LAPS[b.lap+1]&&LAPS[b.lap+1].hard)html+=`<p>「ユーコン川」タブがひらいた。</p>`;
    if(unlocked){html+=`<p>${UNITS[unlocked].n}が仲間になった。</p>`;extra=portrait(unlocked,110)}
    html+=`<div class="row"><button class="pop" id="o-next">川へもどる</button></div>`;
    if(ending){save.lap=b.lap+1;persist()}
    const card=()=>overlay(html,{'o-next':quit},extra);
    if(last)playEnding(b.lap,()=>{show('battle');card()});else card();
  }else{
    Snd.lose();const gain=Math.round(reward(b.si,b.lap,false)*.2);save.ikura+=gain;persist();
    const boss=b.es.find(e=>e.def.boss&&LOSE[e.id]),who=boss?boss.id:b.lastHit,L=LOSE[who];
    const body=L?L.p:'鮭の群れがちりぢりになった。';
    overlay(`<h2>${L?L.h:'流された'}</h2><p>${body}慰めのイクラ ${fmt(gain)} をもらった。いけすで仲間を強くして、もう一度。</p><div class="row"><button class="pop" id="o-again">もう一度</button><button class="pop ghost" id="o-next">川へもどる</button></div>`,{'o-next':quit,'o-again':()=>startBattle(b.si,b.lap)},L?loseCanvas(who):null,!!L);
  }
}

/* エンディング */
const ecv=$('ecv'),ectx=ecv.getContext('2d');let et=0,eLap=0,eDone=null;
function playEnding(lap,done){eLap=typeof lap==='number'&&LAPS[lap]&&LAPS[lap].yukon?'yukon':lap;eDone=done;et=0;$('e-next').hidden=true;Snd.setBgm('ending');show('ending')}
function endEnding(){if(!eDone)return;const f=eDone;eDone=null;Snd.setBgm('normal');f()}
$('e-skip').onclick=endEnding;$('e-next').onclick=endEnding;
function tickEnding(dt){
  et+=dt;const r=ecv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(!r.width)return;
  if(ecv.width!==(r.width*d|0)||ecv.height!==(r.height*d|0)){ecv.width=r.width*d|0;ecv.height=r.height*d|0}
  const k=Math.min(r.height/360,r.width/480),W=r.width/k,c=ectx;
  c.setTransform(d,0,0,d,0,0);c.fillStyle='#0d1e26';c.fillRect(0,0,r.width,r.height);
  c.setTransform(d*k,0,0,d*k,0,d*(r.height-360*k)/2);c.save();c.beginPath();c.rect(0,0,W,360);c.clip();A.drawEnding(c,et,W,eLap);c.restore();
  if(et>A.endingLen(eLap)-1.5)$('e-next').hidden=false;
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
    else if(f.k==='revive'){vfx.push({k:'word',x:f.x,y:GROUND-70,s:'起き上がった',col:'#8dff9c',t:0,life:1});Snd.heal()}
    else if(f.k==='haste')vfx.push({k:'word',x:f.x,y:GROUND-62,s:'速',col:'#ffb3c7',t:0,life:.6});
    else if(f.k==='fat'){vfx.push({k:'word',x:f.x,y:GROUND-74,s:`脂 +${f.n}`,col:'#ffe63b',t:0,life:1.2});Snd.coin()}
    else if(f.k==='gim'){banner={s:f.s,t:0,col:'#1f5b63'};shakeT=.35;Snd.thud()}
    else if(f.k==='heal')vfx.push({k:'word',x:f.x,y:GROUND-58,s:'+',col:'#8dff9c',t:0,life:.5});
    else if(f.k==='atk')vfx.push({...f,k:'atk',t:0,life:f.fx==='shout'?.7:f.fx==='shoot'?.5:.34});
    else if(f.k==='god'){vfx.push({k:'god',kind:f.kind,t:0,life:GOD_LIFE[f.kind]});Snd.god();queueGodSfx(f.kind,f.t)}
    else if(f.k==='godhit'){flash=Math.max(flash,.25);shakeT=.5}
    else if(f.k==='riser')vfx.push({k:'riser',x:f.x,t:0,life:.9});
    else if(f.k==='sweep')vfx.push({k:'sweep',t:0,life:2,from:B.pbase.x,to:B.ebase.x});
    else if(f.k==='fuse'){vfx.push({k:'fuse',x:f.x,t:0,life:.8});banner={s:`合体! ${FUSE[f.id].n}`,t:0,col:'#2a8ea3'};Snd.fuse();if(!save.fuse.includes(f.id)){save.fuse.push(f.id);persist()}}
    else if(f.k==='boss'){banner={s:`${f.name} があらわれた`,t:0};Snd.big()}
    else if(f.k==='word')vfx.push({k:'word',x:f.x,y:GROUND-96,s:f.s,col:f.col,t:0,life:1.2});
    else if(f.k==='bgod'){const fr=B.us.length?Math.min(...B.us.map(u=>u.x)):B.pbase.x-260;
      vfx.push({k:'bgod',id:f.id,x:f.x,fr,t:0,life:BGOD[f.id].life+.3});banner={s:f.god,sub:`${f.name}が守護神をよんだ!`,t:0,col:'#5b2c83'};flash=Math.max(flash,.2);Snd.bgod()}
    else if(f.k==='bghit'){shakeT=.45;flash=Math.max(flash,.12);Snd.bghit(f.id)}
    else if(f.k==='clash')startClash();
    else if(f.k==='clashEnd'){
      banner={s:f.win?'押し勝った!':'押し負けた…',sub:f.win?'ボスの守護神を打ち消した':'こちらの守護神が押し返された',t:0,col:f.win?'#2a8ea3':'#5b2c83'};
      if(f.win)Snd.win();else Snd.lose();
      if(f.win&&f.first==='b')vfx=vfx.filter(v=>v.k!=='bgod');
      if(!f.win&&f.first==='p'){vfx=vfx.filter(v=>v.k!=='god'&&v.k!=='sweep'&&v.k!=='riser');godSfx=[]}}
    else if(f.k==='shock'){shakeT=.5}
    else if(f.k==='wave'){flash=.25;shakeT=.4}
  }
  B.fx.length=0;
}
// 守護神の音は当たる時刻が先に決まっているので、音の時計で少し前から予約する。
// 絵の出るフレームを待ってから鳴らすと、スマホでは処理の重さと出力の遅れの分だけ音が後ろにずれるため
let godSfx=[];
function queueGodSfx(kind,t0){
  const hits=GOD_HITS[kind],add=(t,fn)=>godSfx.push({at:t0+t,fn});
  if(kind<2)for(const t of hits)add(t,w=>Snd.godhit(w));
  else{add(hits[0],w=>Snd.heal(w));for(const t of hits){add(t,w=>Snd.sweep(w));add(t+GOD_SWEEP,w=>Snd.thud(w))}}
}
function tickGodSfx(){
  if(!godSfx.length||paused)return;
  const lag=Snd.lag();
  godSfx=godSfx.filter(q=>{const w=(q.at-B.time)/speed-lag;if(w>.25)return true;q.fn(Math.max(0,w));return false});
}
// ハードのボスの守護神。場所は呼んだ時のボスの位置(f.x)と、こちらの先頭(f.fr)をもとにする
const BG_COL={todo:'#9fe3ff',amimoto:'#ffd34d',taisho:'#ffb0a0',nushi:'#7fffd0',kibori:'#e8b77a'};
function bgHalo(c,x,y,rad,col,a){c.save();c.globalAlpha=.35*a;const g=c.createRadialGradient(x,y,rad*.2,x,y,rad);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,rad,0,6.2832);c.fill();c.restore()}
function bigActor(c,id,x,y,s,t,a,atk=0){c.save();c.globalAlpha=a;c.translate(x,y);c.scale(-s,s);A.drawActor(c,id,{t,sw:Math.sin(t*3)*.4,atk,roll:0});c.restore()}
function plate(c,x,y,rot,k){c.save();c.translate(x,y);c.rotate(rot);A.E(c,0,0,15,6,'#fffdf4',0,2);c.lineWidth=2;c.strokeStyle='#2a6fb0';c.beginPath();c.ellipse(0,0,11,4,0,0,6.2832);c.stroke();A.E(c,0,-4,9,4,'#fff',0,1.4);A.E(c,0,-7,10,3.4,['#ff7a50','#e3170a','#ffd34d','#ff9d7c'][k%4],0,1.4);c.restore()}
// ボスの守護神が出ている間は、カメラをその場面に向ける。竜神は進む柱を追う
const nushiX=(f,px)=>f.x+60+Math.min(1,Math.max(0,(f.t-.9)/2.1))*(px-f.x-140);
function bgFocus(f){return f.id==='nushi'?nushiX(f,B.pbase.x)-vw*.45:(f.x+Math.max(f.x+120,f.fr))/2-vw/2}
function drawBGod(c,f){
  const t=f.t,L=f.life,id=f.id,px=B.pbase.x,bx=f.x,a=Math.min(1,t*3,(L-t)*3),fr=Math.max(bx+120,f.fr);
  c.save();
  if(id==='todo'){
    // 大トドが空から落ちてくる → 流氷が手前へすべっていく
    const land=Math.min(1,t/1.3),y=GROUND+6-(1-land*land)*520,x=bx+150;
    for(let i=0;t>1.3&&i<60;i++){const fx=bx+80+i*36;if(fx>bx+(t-1.3)*FLOE_V+80)break;const k=(i*37)%11;
      c.globalAlpha=a*.9;A.poly(c,[[fx-20,GROUND+4+k],[fx-6,GROUND-14-k],[fx+18,GROUND-8],[fx+22,GROUND+8]],'#e6fbff',2)}
    c.globalAlpha=1;bgHalo(c,x,y-90,170,BG_COL.todo,a);bigActor(c,'todo',x,y,2,t,a*.95);
    if(t>1.3&&t<1.7){c.globalAlpha=1-(t-1.3)/.4;for(let i=0;i<10;i++)A.E(c,x+(i-5)*36,GROUND-(t-1.3)*120-((i*13)%30),16,10,'#fff',0,0);c.globalAlpha=1}
  }else if(id==='amimoto'){
    // 大漁旗を立て、空から大きな網を下ろして前の仲間をすくう
    for(let k=0;k<2;k++){const qx=bx-50+k*100,w=Math.sin(clock*5+k)*10;A.line(c,[[qx,GROUND+6],[qx,GROUND-250]],4,'#6b4a2a');c.globalAlpha=a;
      A.poly(c,[[qx,GROUND-250],[qx+110,GROUND-244+w],[qx+110,GROUND-180+w],[qx,GROUND-186]],['#e3170a','#2a6fb0'][k],2);c.fillStyle='#fffdf4';c.font="20px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('大漁',qx+55,GROUND-215+w/2);c.globalAlpha=1}
    const dn=Math.min(1,Math.max(0,(t-.8)/1.1)),up=Math.max(0,(t-1.9)/.6),ny=-160+dn*(GROUND+150)-up*up*(GROUND+260),x0=fr-50,x1=fr+330;
    c.globalAlpha=a;c.lineWidth=1.6;c.strokeStyle='rgba(23,36,44,.75)';
    for(let i=0;i<=14;i++){const q=x0+(x1-x0)*i/14;c.beginPath();c.moveTo(q,ny-170);c.lineTo(q+Math.sin(i)*6,ny);c.stroke()}
    for(let j=0;j<=8;j++){const q=ny-170+j*21;c.beginPath();c.moveTo(x0,q);c.lineTo(x1,q+Math.sin(j+clock*3)*3);c.stroke()}
    A.line(c,[[x0,ny-170],[x1,ny-170]],4,'#6b4a2a');for(let i=0;i<8;i++)A.E(c,x0+i*(x1-x0)/7,ny-172,7,7,'#ff8a2e',0,1.6);
    c.globalAlpha=1;bgHalo(c,bx,GROUND-140,150,BG_COL.amimoto,a);bigActor(c,'amimoto',bx-10,GROUND+6,1.6,t,a*.5);
  }else if(id==='taisho'){
    // 大きな大将が後ろに立ち、すし皿がつぎつぎ飛んでくる
    bgHalo(c,bx,GROUND-150,170,BG_COL.taisho,a);bigActor(c,'taisho',bx-30,GROUND+6,2.1,t,a*.55,Math.max(0,Math.sin(t*14)));
    for(let i=0;i<40;i++){const q=(t-1.05-i*.045)/.3;if(q<0||q>1)continue;const tx=fr+(i%6)*24-10,x=bx+50+(tx-bx-50)*q,y=GROUND-120-Math.sin(q*Math.PI)*40+((i*29)%50)*q;
      c.globalAlpha=.5;A.line(c,[[x-40,y],[x-6,y]],3,'#fffdf4');c.globalAlpha=1;plate(c,x,y,t*20+i,i)}
  }else if(id==='nushi'){
    // 水の柱と竜神が、手前へ進みながら3回体当たりする
    const X=nushiX(f,px);
    let lunge=0;for(const h of[1.3,2,2.7])if(t>h-.15&&t<h+.2)lunge=Math.max(lunge,1-Math.abs(t-h)/.2);
    c.globalAlpha=a*.85;const g=c.createLinearGradient(X-50,0,X+50,0);g.addColorStop(0,'rgba(120,214,226,.2)');g.addColorStop(.5,'rgba(160,236,246,.95)');g.addColorStop(1,'rgba(120,214,226,.2)');c.fillStyle=g;c.fillRect(X-50,-40,100,GROUND+48);
    for(let i=0;i<10;i++)A.E(c,X+Math.sin(clock*9+i)*30,GROUND-((clock*300+i*40)%(GROUND+40)),10,7,'#f7fdfc',i,0);
    c.globalAlpha=a;const hx=X+40+lunge*50,hy=GROUND-150+Math.sin(t*4)*14;
    for(let i=16;i>=0;i--){const sx=hx-20-i*22,sy=hy-40+Math.sin(t*6-i*.6)*26+i*3,r=19-i*.6;A.E(c,sx,sy,r,r,i%2?'#2fae8a':'#3cc79c',0,2);A.E(c,sx,sy+r*.45,r*.7,r*.35,'#ffe28a',0,0)}
    A.poly(c,[[hx-10,hy-18],[hx+6,hy-46],[hx+12,hy-20]],'#ffd34d',2);A.poly(c,[[hx-28,hy-18],[hx-26,hy-44],[hx-10,hy-20]],'#ffd34d',2);
    A.E(c,hx,hy,32,21,'#3cc79c',0,2.4);A.E(c,hx+26,hy+5,16,11,'#58d8ac',0,2);A.dot(c,hx+6,hy-6,5,'#fff');A.dot(c,hx+8,hy-6,2.6,A.INK);
    c.lineWidth=2;c.strokeStyle='#e3170a';c.beginPath();c.moveTo(hx+30,hy+8);c.quadraticCurveTo(hx+60,hy+20,hx+70,hy+44+Math.sin(t*8)*6);c.moveTo(hx+28,hy+2);c.quadraticCurveTo(hx+64,hy-8,hx+80,hy+8+Math.sin(t*8+1)*6);c.stroke();
    for(let i=0;i<5;i++)A.poly(c,[[hx-30-i*8,hy-14],[hx-46-i*10,hy-36-i%2*8],[hx-34-i*8,hy-6]],'#e3170a',1.5);
    if(lunge>.5)for(let k=0;k<5;k++)A.line(c,[[hx-80-k*10,hy-30+k*14],[hx-170-k*10,hy-30+k*14]],3,'#fffdf4');
  }else if(id==='kibori'){
    // 鮭をくわえた木彫りの熊が、空からたくさん降ってくる
    bgHalo(c,bx,GROUND-150,170,BG_COL.kibori,a);
    for(let i=0;i<48;i++){const st=.9+i*.05,q=(t-st)/.45;if(q<0)continue;const x=fr-40+((i*0.618)%1)*(px-fr-60),land=Math.min(1,q),y=-90+land*land*(GROUND+96);
      const fade=Math.max(0,1-(t-st-.45-.5)/.4);if(fade<=0)continue;c.save();c.globalAlpha=fade;c.translate(x,y);c.rotate(land<1?q*6:0);c.scale(-.34,.34);A.drawActor(c,'kibori',{t:0,sw:0,atk:0,roll:0});c.restore();
      if(land>=1&&q<1.3){c.globalAlpha=(1.3-q)/.3;A.E(c,x,GROUND+4,26,8,'#e8d8bf',0,0);c.globalAlpha=1}}
  }
  c.restore();
}
// 守護神どうしの押し合い。CLASH_T秒のあいだ連打して、ボスより多く押せば勝ち
let clashT=-1,taps=0;
function startClash(){clashT=0;taps=0;$('clash').hidden=false;Snd.big()}
$('clash').addEventListener('pointerdown',e=>{e.preventDefault();if(clashT>=0&&clashT<CLASH_T){taps++;Snd.tap()}});
function tickClash(dt){
  const C=B.clash;if(!C){clashT=-1;$('clash').hidden=true;return}
  clashT+=dt;const id=C.b.id,foe=CLASH_RATE[id]*Math.min(clashT,CLASH_T),pk=C.pk>=0?C.pk:(vfx.find(v=>v.k==='god')||{kind:0}).kind;
  const c=ctx,r=cv.width/dpr,h=cv.height/dpr,bal=Math.max(-1,Math.min(1,(taps-foe)/12)),mid=r/2-bal*r*.18,s=Math.min(1.1,h/360);
  c.save();c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='rgba(13,30,38,.55)';c.fillRect(0,0,r,h);
  const jig=Math.sin(clock*40)*3;
  const bs=1.3*s*Math.min(1,110/ENEMIES[id].w);c.save();c.translate(mid-130*s+jig,h*.66);c.scale(-bs,bs);bgHalo(c,0,-60,130,BG_COL[id],1);A.drawActor(c,id,{t:clock,sw:0,atk:1,roll:0});c.restore();
  c.save();c.translate(mid+120*s-jig,h*.42);c.scale(s*.6,s*.6);A.drawGuardian(c,clock,pk);c.restore();
  burst(c,mid,h*.42,24+Math.sin(clock*30)*6,'#ffe63b');
  const bw=Math.min(r-40,420),bx=r/2-bw/2,by=h*.16;c.fillStyle='#5b2c83';c.fillRect(bx,by,bw,16);c.fillStyle='#2a8ea3';c.fillRect(bx+bw/2-bal*bw/2,by,bw/2+bal*bw/2,16);c.lineWidth=3;c.strokeStyle=A.INK;c.strokeRect(bx,by,bw,16);
  word(c,'守護神どうしの押し合い!',r/2,by-18,'#ffe63b',Math.min(22,r/18));
  if(clashT<CLASH_T)word(c,`連打! あと${Math.ceil(CLASH_T-clashT)}秒`,r/2,h*.8,'#fffdf4',Math.min(30,r/14));
  c.restore();
  if(clashT>=CLASH_T+.3){const win=taps>foe;clashT=-1;$('clash').hidden=true;B.resolveClash(win)}
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
    case'shoot':{const q=a<.5?a*2:2-a*2;c.translate(f.x+dx*q,GROUND-2);c.scale(.62,.62);A.drawActor(c,'onigiri',{t:0,sw:0,atk:0,roll:a*24});break}
    case'scatter':for(let i=0;i<14;i++){const q=i/14*6.28;c.globalAlpha=1-a;c.fillStyle='#ff8a5c';c.fillRect(f.x+Math.cos(q)*a*60,GROUND-20+Math.sin(q)*a*34-a*10,5,3)}c.globalAlpha=1;break;
    case'kick':A.line(c,[[f.x-10,y-14],[f.tx+10,y-10]],3,'rgba(255,255,255,.75)');break;
    case'steam':c.globalAlpha=.5*(1-a);A.E(c,f.x,y-30,170*a+20,34,'#dff5e8',0,0);c.globalAlpha=1;break;
    case'line':c.lineWidth=1.6;c.strokeStyle='#f7f7f2';c.beginPath();c.moveTo(f.x+30,y-92);c.quadraticCurveTo((f.x+f.tx)/2,y-120,f.tx,y-14);c.stroke();break;
    case'net':c.lineWidth=1.6;c.strokeStyle='rgba(255,255,255,.85)';{const R=20+40*a;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(x+i*R/3,y-R);c.lineTo(x+i*R/3,y+10);c.stroke();c.beginPath();c.moveTo(x-R,y+i*R/4-20);c.lineTo(x+R,y+i*R/4-20);c.stroke()}}break;
    case'knife':c.lineWidth=4;c.strokeStyle='#eef6f8';c.beginPath();c.arc(f.tx,y-14,22,-1.2+a,1.4+a);c.stroke();break;
    case'syrup':{const q=Math.min(1,a*1.4);for(let i=0;i<5;i++){A.E(c,f.x+dx*Math.min(1,q+i*.04),y-14-Math.sin(q*3.14)*34+i*2,4.5-i*.5,3.5-i*.4,'#c9772a',0,i?0:1.2)}if(a>.6){c.globalAlpha=(1-a)*2.4;A.E(c,f.tx,GROUND-4,26,6,'#c9772a',0,1.2);c.globalAlpha=1}break}
    case'plank':for(let i=0;i<5;i++){const xx=f.x+22+i*9,yy=GROUND-10-(i%2)*8-a*12;c.globalAlpha=1-a;A.E(c,xx,yy,5,3,'#e9f7f4',0,0);c.globalAlpha=1}break;
    case'splash':{c.globalAlpha=1-a;for(let i=0;i<9;i++){const q=i/8*3.14;A.E(c,f.tx+Math.cos(q)*(18+a*50),GROUND-6-Math.sin(q)*(20+a*60),6,5,'#dff5f7',0,i%3?0:1)}c.globalAlpha=1;break}
    case'swoop':c.lineWidth=3;c.strokeStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(f.x,y-50);c.quadraticCurveTo(f.tx,y-60,f.tx,y);c.stroke();break;
    default:break;
  }
  c.restore();
}
function burst(c,x,y,r,col){c.beginPath();for(let i=0;i<12;i++){const a=i/12*6.283,q=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}c.closePath();c.fillStyle=col;c.fill();c.lineWidth=2;c.strokeStyle=A.INK;c.stroke()}
function word(c,s,x,y,col,fs){c.font=`${fs}px 'Dela Gothic One','Hiragino Sans',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=4;c.strokeStyle=A.INK;c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y)}
function drawOne(c,e,t){
  const d=e.def;c.save();
  const air=e.state==='air'&&e.air?Math.min(1,e.air.t/e.air.d):-1;
  c.translate(e.x,GROUND+e.lane-(d.fly||0)-(air>=0?Math.sin(air*Math.PI)*170:0));
  if(air>=0)c.rotate(air*Math.PI*3);
  if(e.side<0)c.scale(-1,1);
  const atk=e.state==='wind'?1-e.timer/d.wind:e.lunge;
  c.translate(-atk*(d.w>=90?4:7),0);
  if(e.state==='kb')c.rotate(.28);
  if(e.hurt>0&&((clock*40)|0)%2)c.globalAlpha=.55;
  A.drawActor(c,e.id,{t:e.anim+e.seed*5,sw:Math.sin(e.walk),atk,roll:e.walk*1.7,lunge:e.lunge});
  c.restore();
  if(e.stun>0&&e.ice){c.save();c.globalAlpha=.55;c.fillStyle='#c9f1ff';c.fillRect(e.x-d.w*.6,GROUND+e.lane-58,d.w*1.2,60);c.globalAlpha=1;c.lineWidth=2;c.strokeStyle='#eafcff';c.strokeRect(e.x-d.w*.6,GROUND+e.lane-58,d.w*1.2,60);A.line(c,[[e.x-d.w*.4,GROUND+e.lane-50],[e.x-d.w*.1,GROUND+e.lane-30]],2,'#fff');c.restore()}
  else if(e.stun>0)word(c,'時',e.x,GROUND-62,'#fff7d6',16);
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
// 守護神の登場と技。画面に重ねて描く
const GOD_LIFE=[4.3,4.4,5.4];
function godWave(c,r,h,p,top){
  const x=r+60-p*(r+400);
  c.beginPath();c.moveTo(x+r+400,h);c.lineTo(x+40,h);c.quadraticCurveTo(x-30,top+(h-top)*.55,x+30,top+30);c.quadraticCurveTo(x+70,top-20,x+150,top);c.lineTo(x+r+400,top);c.closePath();
  const g=c.createLinearGradient(x,0,x+400,0);g.addColorStop(0,'rgba(140,224,236,.95)');g.addColorStop(1,'rgba(31,127,149,.45)');c.fillStyle=g;c.fill();c.lineWidth=3;c.strokeStyle=A.INK;c.stroke();
  for(let i=0;i<10;i++){const q=i/9;A.E(c,x+36-Math.sin(q*3.1)*40+Math.sin(clock*20+i)*4,h-q*(h-top),14+(i%3)*5,10+(i%2)*5,'#f7fdfc',i,0)}
  return x;
}
function drawGod(c,f,r,h){
  const t=f.t,L=f.life,s=Math.min(1.1,h/360),G=GODS[f.kind],wy=offY+WATER_Y*Sc;
  let gx=r*.5,gy=h*.5-(1-Math.min(1,t/.6))**2*h*.8,rot=0,alpha=1;
  c.save();
  if(f.kind===0){
    for(let i=0;i<3;i++){const p=(t-1-i*.7)/1.1;if(p<=0||p>=1)continue;const top=i===2?h*.2:h*.32,x=godWave(c,r,h,p,top);
      // 3つ目の波と同時に、守護神が左へタックルする
      if(i===2&&x+60<gx){gx=x+60;rot=-.1;c.globalAlpha=.7;for(let k=0;k<6;k++)A.line(c,[[gx+70+k*6,gy-40+k*16],[gx+170+k*14,gy-40+k*16]],3,'#fffdf4');c.globalAlpha=1}}
    // 3つ目の波(t=2.4〜3.5)と一緒に画面の外へ抜けたら、そのまま消す
    gy+=Math.sin(t*5)*6;if(t>=3.5)alpha=0;
  }else if(f.kind===1){
    for(let i=0;i<72;i++){const q=(t-1.1-i*.034)/.55;if(q<0||q>1)continue;const x=((i*.137)%1)*r*1.15+60-q*130,y=-20+q*(wy+30);
      c.globalAlpha=.55;A.line(c,[[x+34,y-46],[x,y]],5,'#ffd3c2');c.globalAlpha=1;A.E(c,x,y,9,9,'#f0431f',0,2);A.dot(c,x-3,y-3,2.2,'#ffd3c2')}
  }else{
    const a=Math.max(0,Math.min(1,(t-1)*2,(L-.4-t)*2));
    if(a>0){c.globalAlpha=.35*a;for(let i=0;i<7;i++){c.strokeStyle=`hsl(${i*50},90%,68%)`;c.lineWidth=7;c.beginPath();c.arc(r/2,h*1.1,h*.75+i*10,3.3,6.1);c.stroke()}c.globalAlpha=1}
  }
  c.restore();
  if(f.kind!==0){const out=Math.max(0,(t-(L-.7))/.7);gy-=out*h*.4;alpha=1-out}
  if(alpha>0){c.save();c.globalAlpha=alpha;c.translate(gx,gy);c.rotate(rot);c.scale(s*.68,s*.68);A.drawGuardian(c,t,f.kind);c.restore()}
  const a=Math.min(1,t*4,(L-.6-t)*3);
  if(a>0){c.save();c.globalAlpha=a;const y=74,bw=Math.min(r-24,340);c.fillStyle='#fffdf4';c.fillRect(r/2-bw/2,y-18,bw,36);c.lineWidth=3;c.strokeStyle=A.INK;c.strokeRect(r/2-bw/2,y-18,bw,36);
    const bx=r/2-bw/2+30;c.beginPath();c.arc(bx,y,24,0,6.2832);c.fillStyle=f.kind===2?'#e3170a':f.kind===1?'#ff8a5c':'#2a8ea3';c.fill();c.stroke();
    c.fillStyle='#fff';c.font=`${f.kind===2?15:20}px 'Dela Gothic One',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(G.g,bx,y+1);
    c.fillStyle=A.INK;c.font="19px 'Dela Gothic One',sans-serif";c.fillText(G.n,r/2+18,y+1);c.restore()}
}
// 天の川のぼり:川底から空へのぼる鮭の列が、手前から敵の方へ走る。速さは sim.js の GOD_SWEEP・GOD_RISE と同じ
const SWEEP_IDS=['shake','beni','gin','shake','king'],SWEEP_T=1,RISE_V=600,RISE_FROM=GROUND+30;
function riseFish(c,x,y,i,t){
  c.save();c.globalAlpha=.6;A.line(c,[[x,y+26],[x,y+90]],4,'#fff6b0');c.globalAlpha=1;
  c.translate(x,y);c.rotate(Math.PI/2);c.scale(.62,.62);A.drawActor(c,SWEEP_IDS[i%5],{t:t*3+i,sw:0,atk:0,roll:0});c.restore();
}
function drawSweep(c,f){
  const n=120,x0=cam-80,x1=cam+vw+80;
  for(let i=0;i<n;i++){
    const u=i/n,d=f.t-u*SWEEP_T;if(d<0)continue;
    const y=RISE_FROM+((i*53)%30)-d*RISE_V;if(y<-160)continue;
    const x=f.from-u*(f.from-f.to)+((i*37)%23-11);if(x<x0||x>x1)continue;
    riseFish(c,x,y,i,f.t);
  }
}
// 敵の真下からのぼる鮭。体に届くと敵が消える
function drawRiser(c,f){const y=RISE_FROM-f.t*RISE_V;if(y>-160)riseFish(c,f.x,y,2,f.t)}
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
    else if(f.k==='riser')drawRiser(c,f);
    else if(f.k==='fuse'){const a=f.t/f.life;c.save();c.globalAlpha=1-a;for(let i=0;i<3;i++){c.lineWidth=4;c.strokeStyle=['#ffe63b','#fff','#ff8a5c'][i];c.beginPath();c.arc(f.x,GROUND-34,20+a*(70+i*22),0,6.2832);c.stroke()}c.restore();if(a<.4)burst(c,f.x,GROUND-34,40*(1-a),'#fff6b0')}
    else if(f.k==='sweep')drawSweep(c,f);
    else if(f.k==='bgod')drawBGod(c,f);
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
  for(const f of vfx)if(f.k==='god')drawGod(c,f,r,h);
  // 全体図
  const mx=16,mw=r-32,my=48,per=mw/B.L;
  c.fillStyle='rgba(13,52,64,.6)';c.fillRect(mx,my,mw,8);
  c.fillStyle='rgba(255,255,255,.28)';c.fillRect(mx+cam*per,my,vw*per,8);
  for(const e of B.us){c.fillStyle='#ff8a5c';c.fillRect(mx+e.x*per-1,my+1,2.4,6)}
  for(const e of B.es){c.fillStyle=e.def.boss?'#ffe63b':'#17242c';c.fillRect(mx+e.x*per-1,my+1,e.def.boss?4:2.4,6)}
  if(flash>0){c.fillStyle=`rgba(255,255,255,${flash*2})`;c.fillRect(0,0,r,h)}
  if(banner&&banner.t<2.2){const a=Math.min(1,Math.min(banner.t*5,(2.2-banner.t)*3)),sub=banner.sub?20:0;c.globalAlpha=a;c.fillStyle=banner.col||'#e3170a';c.fillRect(0,h*.26-sub,r,44+sub);if(sub)word(c,banner.sub,r/2,h*.26-6,'#fffdf4',Math.min(15,r/24));word(c,banner.s,r/2,h*.26+23,'#ffe63b',Math.min(26,r/14));c.globalAlpha=1}
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
  st.querySelector('b').textContent=`胃袋 Lv${B.stom}`;st.querySelector('small').textContent=B.fast?'食べない':mx?'最大':`${STOM.cost(B.stom)}で+${STOM.cap(B.stom+1)-STOM.cap(B.stom)}`;
  st.style.setProperty('--c',mx?1:Math.min(1,B.money/STOM.cost(B.stom)));st.classList.toggle('ready',B.canUp());
  const gb=$('btn-god'),gc=B.god.cd,gs=B.seal>0?'封印中':gc>0?`あと${Math.floor(Math.ceil(gc)/60)}:${String(Math.ceil(gc)%60).padStart(2,'0')}`:'CMのあとで';
  if(gb._s!==gs){gb._s=gs;gb.querySelector('small').textContent=gs}gb.classList.toggle('ready',B.canGod()&&!paused);gb.disabled=gc>0||B.seal>0||!!B.over;
  const ready=B.canFire();fl.classList.toggle('ready',ready);fl.style.setProperty('--c',B.flood.c/B.flood.need);fl.querySelector('small').textContent=B.seal>0?`封印中 ${Math.ceil(B.seal)}秒`:ready?'押すと発射':`${Math.ceil(B.flood.need-B.flood.c)}秒`;
}
function tickBattle(dt){
  if(!B)return;
  if(!paused&&!B.over){
    const st=1/60;acc+=Math.min(.1,dt)*speed;
    while(acc>=st){B.step(st);acc-=st}
    if(userPan>0)userPan-=dt;
    else{const front=B.us.length?Math.min(...B.us.map(e=>e.x)):B.L,fb=vfx.find(v=>v.k==='bgod'),target=fb?bgFocus(fb):front-vw*.32;cam+=(target-cam)*Math.min(1,dt*1.6);clampCam()}
  }
  drainFx();tickGodSfx();
  // 演出もゲームの速さに合わせる。×2で当たる時刻と絵がずれないように
  for(const f of vfx)f.t+=paused||B.clash?0:dt*speed;
  vfx=vfx.filter(f=>f.t<f.life);
  if(!paused){shakeT=Math.max(0,shakeT-dt);flash=Math.max(0,flash-dt);if(banner)banner.t+=dt}
  drawField(dt);if(clashT>=0)tickClash(dt);syncHud();
  if(adT<0)Snd.setBgm(!B.over&&B.es.some(e=>e.def.boss)?'boss':'normal');
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
  if(view==='battle'){tickBattle(dt);if(adT>=0)tickAd(dt)}else if(view==='ending')tickEnding(dt);else if(view==='title')drawParade();
}

$('btn-start').onclick=()=>{Snd.wake();show('menu')};
for(const b of document.querySelectorAll('.tabs button'))b.onclick=()=>setTab(b.dataset.tab);
const sndBtn=$('btn-snd');const sndLabel=()=>{sndBtn.textContent=save.snd?'音':'消';sndBtn.setAttribute('aria-pressed',save.snd)};sndLabel();
sndBtn.onclick=()=>{save.snd=!save.snd;persist();sndLabel();if(save.snd)Snd.wake();else Snd.stop()};
// iOSは指を離した時しか音を許可せず、アプリ切り替え後は音が止まるので毎回起こす
for(const ev of['touchend','pointerup'])addEventListener(ev,()=>Snd.wake(),{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&view==='battle'&&B&&!B.over&&!paused)togglePause()});
show('title');
window.__g={get B(){return B},migrate,portrait,deploy,startBattle,get save(){return save},setTab,show,Snd,quit,playEnding,get adT(){return adT},set et(v){et=v},get et(){return et},finish};
requestAnimationFrame(frame);
})();
