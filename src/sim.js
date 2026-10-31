window.SALMON=(()=>{
'use strict';
const VH=330,WATER_Y=205,GROUND=282,KB_T=.55;
const TRAIT={fish:'川魚',shell:'カニ',bird:'鳥',beast:'ケモノ',human:'ヒト'};
const LAPS=[{n:'1回目の遡上',m:1,r:1},{n:'4年後の遡上',m:2.5,r:2},{n:'8年後の遡上',m:6,r:3.5}];
const RARE={N:'基本',R:'白皿',SR:'金皿',UR:'黒皿'};

const UNITS={
shake:{n:'シロザケ',r:'N',via:'start',cost:50,cd:2,hp:150,atk:18,rate:1,wind:.3,range:34,sp:42,kb:3,w:40,fx:'bite',
  txt:'いちばんふつうの鮭。秋になるとだいたい帰ってくる。'},
ikura:{n:'イクラ三兄弟',r:'N',via:'start',cost:30,cd:1.4,hp:50,atk:8,rate:.8,wind:.2,range:26,sp:56,kb:1,w:20,count:3,fx:'bite',
  txt:'3粒で1組。兄弟はあと3000粒ほどいる。'},
aramaki:{n:'新巻鮭',r:'N',via:'start',cost:150,cd:6,hp:1000,atk:22,rate:1.8,wind:.5,range:36,sp:20,kb:2,w:36,fx:'bite',
  txt:'塩でしめられ、縄でくくられ、それでも前線に立つ。'},
nigiri:{n:'サーモン握り',r:'N',via:{clear:0},cost:200,cd:6,hp:170,atk:60,rate:2.2,wind:.6,range:170,sp:30,kb:2,w:44,fx:'rice',
  txt:'シャリを飛ばして戦う。飛ばすほど本人は軽くなる。'},
abari:{n:'炙りサーモン',r:'N',via:{clear:3},cost:320,cd:9,hp:300,atk:90,rate:2.4,wind:.7,range:95,area:60,sp:30,kb:3,w:44,fx:'flame',
  txt:'自分を炙った火で敵も炙る。香ばしい。'},
oyako:{n:'親子丼',r:'N',via:{clear:6},cost:420,cd:14,hp:2000,atk:70,rate:2.5,wind:.6,range:40,sp:18,kb:2,w:50,onDeath:{id:'ikura',n:6},fx:'bite',
  txt:'親と子が同じ丼に入っている。倒れるとイクラがこぼれる。'},
toba:{n:'鮭とば',r:'N',via:{clear:9},cost:380,cd:11,hp:320,atk:130,rate:2.6,wind:.7,range:240,area:70,sp:26,kb:3,w:34,fx:'whip',
  txt:'干されて細長くなった。かむほど味が出るし、よく伸びる。'},
hanamagari:{n:'鼻曲がり',r:'N',via:{clear:12},cost:480,cd:14,hp:1500,atk:170,rate:1.8,wind:.5,range:42,sp:34,kb:3,w:60,vs:{beast:2},kbc:.3,fx:'bite',
  txt:'恋の季節のオス。顔つきが変わり、クマにも向かっていく。'},

gin:{n:'ギンザケ',r:'R',via:'gacha',cost:120,cd:3,hp:240,atk:44,rate:.8,wind:.25,range:36,sp:74,kb:3,w:40,fx:'bite',
  txt:'銀色で、とにかく速い。話しかけても止まらない。'},
karafuto:{n:'カラフトマス',r:'R',via:'gacha',cost:180,cd:6,hp:800,atk:36,rate:1.4,wind:.4,range:36,sp:30,kb:2,w:44,shield:1,fx:'bite',
  txt:'背中のコブが自慢。どんな一撃も一度だけ耐える。'},
sakura:{n:'サクラマス',r:'R',via:'gacha',cost:240,cd:7,hp:320,atk:75,rate:1.6,wind:.45,range:115,area:50,sp:44,kb:3,w:44,vs:{bird:2},fx:'petal',
  txt:'春に川へ帰る。花びらをまいて鳥を追い払う。'},
onigiri:{n:'鮭おにぎり',r:'R',via:'gacha',cost:150,cd:5,hp:220,atk:34,rate:.5,wind:.1,range:30,sp:96,kb:2,w:34,roll:1,fx:'bite',
  txt:'転がり続ける。止まり方は誰も教えていない。'},
smoke:{n:'スモークサーモン',r:'R',via:'gacha',cost:260,cd:9,hp:360,atk:32,rate:2.4,wind:.6,range:135,area:60,sp:28,kb:3,w:44,slow:{p:1,t:3},fx:'smoke',
  txt:'煙たい。煙に巻かれた敵は足が遅くなる。'},
trout:{n:'サーモントラウト',r:'R',via:'gacha',cost:200,cd:5,hp:460,atk:64,rate:1.2,wind:.35,range:38,sp:46,kb:3,w:44,vs:{human:2},fx:'bite',
  txt:'養殖育ち。人の手の内はだいたい知っている。'},
flake:{n:'鮭フレーク',r:'R',via:'gacha',cost:300,cd:8,hp:210,atk:42,rate:1.8,wind:.5,range:215,area:100,sp:30,kb:3,w:36,fx:'flake',
  txt:'瓶からふりかける。ご飯がない場所でもふりかける。'},

beni:{n:'ベニザケ',r:'SR',via:'gacha',cost:300,cd:7,hp:440,atk:120,rate:1.2,wind:.35,range:40,sp:52,kb:3,w:46,crit:.3,fx:'bite',
  txt:'赤い体に緑の顔。3割の確率でトロの一撃が出る。'},
ishikari:{n:'石狩鍋',r:'SR',via:'gacha',cost:400,cd:16,hp:760,atk:0,rate:3,wind:.5,range:150,sp:24,kb:2,w:50,heal:.12,fx:'steam',
  txt:'湯気を浴びた仲間の体力が回復する。みそ味。'},
chanchan:{n:'ちゃんちゃん焼き',r:'SR',via:'gacha',cost:450,cd:12,hp:1000,atk:190,rate:2.6,wind:.7,range:85,area:85,sp:24,kb:2,w:60,vs:{fish:2,shell:2},fx:'bite',
  txt:'鉄板ごと前に出る。川魚とカニには特に熱い。'},
ashi:{n:'脚サーモン',r:'SR',via:'gacha',cost:350,cd:9,hp:420,atk:140,rate:1.6,wind:.45,range:125,sp:66,kb:4,w:40,kbc:.25,fx:'kick',
  txt:'なぜ脚が生えたのか、本人にもわからない。'},
toki:{n:'時鮭',r:'SR',via:'gacha',cost:500,cd:12,hp:640,atk:140,rate:1.8,wind:.5,range:105,area:60,sp:40,kb:3,w:48,stun:{p:.4,t:1.6},fx:'clock',
  txt:'季節外れに獲れる「時知らず」。ときどき敵の時間も止める。'},

king:{n:'キングサーモン',r:'UR',via:'gacha',cost:900,cd:22,hp:4600,atk:460,rate:2.2,wind:.6,range:115,area:90,sp:26,kb:2,w:90,fx:'bite',
  txt:'鮭の王。和名はマスノスケ。王冠は自前。'},
keiji:{n:'鮭児',r:'UR',via:'gacha',cost:700,cd:20,hp:980,atk:560,rate:1,wind:.3,range:62,sp:92,kb:3,w:40,crit:.5,fx:'bite',
  txt:'一万匹に一匹といわれる幻の若い鮭。脂のりが異常。'},
osuke:{n:'鮭の大助',r:'UR',via:'gacha',cost:1500,cd:40,hp:6500,atk:1300,rate:3.6,wind:1,range:300,area:300,sp:14,kb:2,w:130,kbc:.5,fx:'shout',
  txt:'東北の言い伝えの鮭の王。「鮭の大助、今のぼる」と叫ぶ。'},
};

const ENEMIES={
ugui:{n:'ウグイ',trait:'fish',hp:70,atk:10,rate:1,wind:.3,range:30,sp:38,kb:1,gold:18,w:34,txt:'イクラを狙っている川魚。'},
kani:{n:'モクズガニ',trait:'shell',hp:180,atk:14,rate:1.2,wind:.4,range:26,sp:22,kb:2,gold:45,w:40},
kamome:{n:'カモメ',trait:'bird',hp:80,atk:16,rate:1.1,wind:.3,range:28,sp:62,kb:1,gold:28,w:36,fly:32},
karasu:{n:'カラス',trait:'bird',hp:240,atk:36,rate:1,wind:.3,range:30,sp:66,kb:2,gold:70,w:36,fly:36},
mink:{n:'ミンク',trait:'beast',hp:260,atk:34,rate:.8,wind:.25,range:30,sp:76,kb:2,gold:90,w:50},
azarashi:{n:'アザラシ',trait:'beast',hp:1100,atk:60,rate:2.2,wind:.7,range:34,sp:20,kb:2,gold:260,w:76},
washi:{n:'オジロワシ',trait:'bird',hp:900,atk:150,rate:2,wind:.6,range:120,area:50,sp:46,kb:2,gold:420,w:60,fly:58,fx:'swoop'},
tsuribito:{n:'釣り人',trait:'human',hp:520,atk:90,rate:3,wind:.9,range:210,sp:18,kb:2,gold:300,w:40,fx:'line'},
ryoshi:{n:'漁師',trait:'human',hp:1100,atk:80,rate:2.8,wind:.8,range:100,area:60,sp:20,kb:2,gold:480,w:44,slow:{p:1,t:2.5},fx:'net'},
itamae:{n:'板前',trait:'human',hp:1800,atk:230,rate:1,wind:.3,range:36,sp:56,kb:3,gold:620,w:40,fx:'knife'},
konguma:{n:'子グマ',trait:'beast',hp:1400,atk:130,rate:1.1,wind:.35,range:34,sp:52,kb:2,gold:420,w:60},
higuma:{n:'ヒグマ',trait:'beast',hp:6200,atk:420,rate:2.2,wind:.7,range:48,area:50,sp:30,kb:3,gold:1100,w:100},
todo:{n:'トド親分',trait:'beast',boss:1,hp:5400,atk:140,rate:2.6,wind:.8,range:60,area:50,sp:16,kb:4,gold:900,w:140},
amimoto:{n:'網元',trait:'human',boss:1,hp:8500,atk:170,rate:3,wind:.9,range:135,area:90,sp:16,kb:4,gold:1400,w:90,slow:{p:1,t:3},fx:'net'},
taisho:{n:'回転ずしの大将',trait:'human',boss:1,hp:22000,atk:520,rate:1.4,wind:.4,range:64,sp:34,kb:5,gold:2000,w:100,fx:'knife'},
nushi:{n:'滝のヌシ',trait:'beast',boss:1,hp:42000,atk:900,rate:2.4,wind:.7,range:70,area:70,sp:26,kb:5,gold:3000,w:170},
kibori:{n:'木彫りの大グマ',trait:'beast',boss:1,hp:62000,atk:1200,rate:3.2,wind:1,range:95,area:130,sp:14,kb:6,gold:5000,w:200},
};
Object.values(ENEMIES).forEach(d=>{d.fx=d.fx||'claw'});

const CHAPTERS=[
{n:'河口',sub:'海のにおいがする',sky:['#ffcf9c','#ff9d7c'],mtn:'#7d6f8c',water:['#2a8ea3','#176477'],bed:'#7a6a56'},
{n:'定置網',sub:'網の中は静かだ',sky:['#bfe4ec','#e8f3df'],mtn:'#7fa39f',water:['#1f7f95','#115367'],bed:'#6a6355'},
{n:'町',sub:'人が多い',sky:['#a9d3ee','#e0eef2'],mtn:'#94a9b5',water:['#4a8f8c','#2c6263'],bed:'#6f6858'},
{n:'大滝',sub:'登る。跳ぶ。また登る',sky:['#7fc2bf','#d6ecd2'],mtn:'#3f7560',water:['#2aa3a0','#10625f'],bed:'#555b4f'},
{n:'源流',sub:'もうすぐ',sky:['#f5d9b8','#e8a68a'],mtn:'#8b5a55',water:['#49b6c0','#1e7788'],bed:'#6b5a4a'},
];
const W=(e,t,ev,o={})=>({e,t,ev,...o});
const STAGES=[
{ch:0,km:0,n:'河口',len:1000,base:800,reward:120,rules:[W('ugui',3,8),W('ugui',25,10)]},
{ch:0,km:3,n:'海と川のさかい目',len:1050,base:1200,reward:150,rules:[W('ugui',2,6),W('kani',14,16)]},
{ch:0,km:8,n:'カモメの見張り台',len:1150,base:1800,reward:200,rules:[W('ugui',2,7),W('kamome',6,9),W('kani',20,18),W('kamome',0,14,{hp:60,b:3})]},
{ch:0,km:12,n:'トド岩',len:1200,base:3000,reward:320,rules:[W('ugui',2,6),W('kani',8,14),W('azarashi',24,34),W('kamome',30,12),W('todo',0,0,{hp:75,n:1})]},
{ch:1,km:20,n:'定置網の入り口',len:1250,base:3600,reward:300,rules:[W('kamome',2,7),W('kani',6,13),W('mink',14,17),W('azarashi',40,38)]},
{ch:1,km:33,n:'網の迷路',len:1300,base:4600,reward:360,rules:[W('ugui',0,6,{b:2}),W('mink',10,15),W('ryoshi',22,34),W('kamome',0,10,{hp:70,b:2})]},
{ch:1,km:48,n:'番屋の網元',len:1350,base:6500,reward:520,rules:[W('kani',2,10),W('mink',8,14),W('ryoshi',16,26),W('azarashi',30,34),W('amimoto',0,0,{hp:80,n:1})]},
{ch:2,km:64,n:'橋の下の釣り人',len:1350,base:7000,reward:480,rules:[W('karasu',2,8),W('tsuribito',6,22),W('mink',12,16),W('kani',4,12)]},
{ch:2,km:88,n:'河川敷のバーベキュー',len:1400,base:8500,reward:560,rules:[W('karasu',0,7,{b:2}),W('tsuribito',10,20),W('azarashi',24,30),W('ryoshi',30,30),W('itamae',40,34)]},
{ch:2,km:130,n:'回転ずし かわぞこ',len:1450,base:11000,reward:820,rules:[W('karasu',2,9),W('itamae',10,22),W('tsuribito',16,26),W('taisho',0,0,{hp:80,n:1}),W('itamae',0,14,{hp:50})]},
{ch:3,km:152,n:'魚道',len:1450,base:12000,reward:760,rules:[W('konguma',2,12),W('washi',8,20),W('mink',4,10),W('ryoshi',20,30)]},
{ch:3,km:186,n:'滝つぼ',len:1500,base:13000,reward:900,rules:[W('konguma',2,12),W('higuma',16,38),W('washi',10,20),W('itamae',24,30)]},
{ch:3,km:210,n:'滝のヌシ',len:1550,base:20000,reward:1300,rules:[W('konguma',2,10),W('higuma',10,24),W('washi',16,18),W('nushi',0,0,{hp:80,n:1}),W('higuma',0,18,{hp:55})]},
{ch:4,km:236,n:'紅葉の瀬',len:1600,base:24000,reward:1400,rules:[W('higuma',4,20),W('washi',8,14),W('itamae',12,18),W('tsuribito',20,24),W('konguma',0,9,{b:2,hp:70})]},
{ch:4,km:268,n:'母川',len:1700,base:36000,reward:2500,rules:[W('konguma',2,9),W('higuma',6,18),W('washi',10,14),W('kibori',0,0,{hp:85,n:1}),W('nushi',0,60,{hp:40,n:1}),W('higuma',0,14,{hp:45})]},
];

const STOM={max:8,income:l=>14+9*(l-1),cap:l=>500+300*(l-1),cost:l=>40+80*l};
const lvMul=l=>1+.2*(l-1);
const lvCost=l=>Math.round(40*Math.pow(l,1.55));
const META={
wall:{n:'ふ化場の壁',txt:'拠点の体力 +20%',max:10},
flood:{n:'鉄砲水',txt:'たまる時間 -3秒、威力 +50%',max:8},
stom:{n:'オキアミの群れ',txt:'オキアミの収入 +8%',max:10},
};
const metaCost=l=>Math.round(150*Math.pow(l+1,1.4));
function battleCfg(save){
  return{slots:save.team.map(id=>({id,lv:save.own[id]})),
    baseHp:Math.round(1500*(1+.2*save.meta.wall)),
    floodNeed:Math.max(20,50-3*save.meta.flood),
    floodDmg:Math.round(260*(1+.5*save.meta.flood)),
    income:1+.08*save.meta.stom};
}

function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

class Battle{
  constructor(si,lap,cfg,seed){
    const s=STAGES[si];this.s=s;this.si=si;this.lap=lap;this.cfg=cfg;this.L=s.len;this.time=0;this.over=null;
    this.mul=LAPS[lap].m;this.rand=mulberry(seed??(Math.random()*1e9|0));
    this.pbase={isBase:1,side:1,x:this.L-74,w:96,hp:cfg.baseHp,max:cfg.baseHp,shake:0};
    const eb=Math.round(s.base*this.mul);
    this.ebase={isBase:1,side:-1,x:74,w:96,hp:eb,max:eb,shake:0};
    this.money=0;this.stom=1;this.us=[];this.es=[];this.fx=[];this.queue=[];this.wave=null;
    this.slots=cfg.slots.map(x=>({id:x.id,lv:x.lv,def:UNITS[x.id],cd:0}));
    this.flood={c:0,need:cfg.floodNeed,dmg:cfg.floodDmg};
    this.rules=s.rules.map(r=>({...r,on:false,cnt:0,next:0}));
    this.kills=0;
  }
  get income(){return STOM.income(this.stom)*this.cfg.income}
  get cap(){return STOM.cap(this.stom)}
  canDeploy(i){const s=this.slots[i];return s&&!this.over&&s.cd<=0&&this.money>=s.def.cost&&this.us.length<40}
  deploy(i){
    if(!this.canDeploy(i))return false;
    const s=this.slots[i];this.money-=s.def.cost;s.cd=s.def.cd;
    const n=s.def.count||1;
    for(let k=0;k<n;k++)this.addUnit(s.id,s.lv,this.pbase.x-44-k*16);
    this.fx.push({k:'spawn',x:this.pbase.x-44,side:1});
    return true;
  }
  addUnit(id,lv,x){
    const d=UNITS[id],m=lvMul(lv);
    const e=this.make(d,1,x,d.hp*m,d.atk*m);e.shield=!!d.shield;e.lv=lv;e.id=id;
    this.us.push(e);return e;
  }
  addEnemy(id){
    const d=ENEMIES[id],m=this.mul;
    const e=this.make(d,-1,this.ebase.x+50,d.hp*m,d.atk*m);e.id=id;
    this.es.push(e);
    if(d.boss){this.fx.push({k:'boss',name:d.n});for(const u of this.us)this.knock(u);this.fx.push({k:'shock'});}
  }
  make(d,side,x,hp,atk){
    return{def:d,side,dir:-side,x,lane:this.rand()*16|0,hp,maxhp:hp,atk,range:d.range,w:d.w,state:'move',timer:0,kbDone:0,
      walk:this.rand()*6,hurt:0,slow:0,stun:0,anim:0,lunge:0,alive:true,seed:this.rand()};
  }
  canUp(){return this.stom<STOM.max&&this.money>=STOM.cost(this.stom)&&!this.over}
  upStom(){if(!this.canUp())return false;this.money-=STOM.cost(this.stom);this.stom++;return true}
  canFire(){return this.flood.c>=this.flood.need&&!this.over&&!this.wave}
  fire(){if(!this.canFire())return false;this.flood.c=0;this.wave={x:this.pbase.x,hit:new Set()};this.fx.push({k:'wave'});return true}

  nearest(e){
    const d=e.dir,foes=e.side>0?this.es:this.us;let best=null,bd=1e9;
    for(const t of foes){
      if(!t.alive||t.state==='kb')continue;
      const dx=(t.x-e.x)*d;if(dx<-24)continue;
      const g=Math.max(0,dx-t.w/2);
      if(g<=e.range&&g<bd){bd=g;best=t}
    }
    const b=e.side>0?this.ebase:this.pbase,gap=(b.x-e.x)*d-b.w/2;
    if(gap<=e.range&&gap<bd)best=b;
    return best;
  }
  step(dt){
    if(this.over)return;
    this.time+=dt;
    this.money=Math.min(this.cap,this.money+this.income*dt);
    for(const s of this.slots)s.cd=Math.max(0,s.cd-dt);
    this.flood.c=Math.min(this.flood.need,this.flood.c+dt);
    this.pbase.shake=Math.max(0,this.pbase.shake-dt);this.ebase.shake=Math.max(0,this.ebase.shake-dt);
    const pct=this.ebase.hp/this.ebase.max*100;
    for(const r of this.rules){
      if(r.done)continue;
      if(!r.on){if(this.time>=r.t&&pct<=(r.hp??100)){r.on=true;r.next=0}else continue}
      r.next-=dt;
      if(r.next<=0){
        const b=r.b||1;
        for(let i=0;i<b;i++)this.queue.push({t:i*.45,fn:()=>{if(this.es.length<40)this.addEnemy(r.e)}});
        r.cnt++;r.next=r.ev;
        if(r.n&&r.cnt>=r.n)r.done=true;
      }
    }
    for(let i=this.queue.length-1;i>=0;i--){const q=this.queue[i];q.t-=dt;if(q.t<=0){this.queue.splice(i,1);q.fn()}}
    for(const e of this.us)this.act(e,dt);
    for(const e of this.es)this.act(e,dt);
    if(this.wave){
      const w=this.wave;w.x-=900*dt;
      for(const e of this.es)if(e.alive&&!w.hit.has(e)&&e.x>=w.x){
        w.hit.add(e);this.fx.push({k:'hit',x:e.x,y:GROUND-40,big:1});
        this.damage(e,this.flood.dmg*(1+this.mul*.4));if(e.alive)this.knock(e);
      }
      if(w.x<this.ebase.x)this.wave=null;
    }
    this.us=this.us.filter(e=>e.alive);this.es=this.es.filter(e=>e.alive);
    if(this.ebase.hp<=0){this.ebase.hp=0;this.over='win'}
    else if(this.pbase.hp<=0){this.pbase.hp=0;this.over='lose'}
  }
  act(e,dt){
    if(!e.alive)return;
    const d=e.def;e.anim+=dt;e.hurt=Math.max(0,e.hurt-dt);e.lunge=Math.max(0,e.lunge-dt*4);
    if(e.stun>0){e.stun-=dt;return}
    if(e.slow>0)e.slow-=dt;
    const sp=d.sp*(e.slow>0?.4:1);
    if(e.state==='kb'){
      e.timer-=dt;e.x-=e.dir*150*dt*Math.max(.15,e.timer/KB_T);
      e.x=Math.min(this.L-30,Math.max(30,e.x));
      if(e.timer<=0)e.state='move';
      return;
    }
    if(d.roll){
      e.walk+=dt*sp*.09;e.x+=e.dir*sp*dt;
      const edge=this.ebase.x+this.ebase.w/2+10;if(e.x<edge)e.x=edge;
      e.timer-=dt;
      if(e.timer<=0){
        const t=this.nearest(e);
        if(t){this.strike(e,t);e.timer=d.rate}
      }
      return;
    }
    if(e.state==='move'){
      if(this.nearest(e)){e.state='wind';e.timer=d.wind}
      else{e.x+=e.dir*sp*dt;e.walk+=dt*sp*.11}
    }else if(e.state==='wind'){
      e.timer-=dt;
      if(e.timer<=0){this.attack(e);e.state='rec';e.timer=Math.max(.05,d.rate-d.wind);e.lunge=1}
    }else if(e.state==='rec'){
      e.timer-=dt;
      if(e.timer<=0)e.state='move';
    }
  }
  attack(e){
    const d=e.def;
    if(d.heal){
      for(const a of this.us)if(a.alive&&Math.abs(a.x-e.x)<=170){a.hp=Math.min(a.maxhp,a.hp+a.maxhp*d.heal);this.fx.push({k:'heal',x:a.x,side:1})}
      this.fx.push({k:'atk',fx:'steam',x:e.x,tx:e.x,side:e.side});
      return;
    }
    const t=this.nearest(e);
    if(!t)return;
    this.fx.push({k:'atk',fx:d.fx,x:e.x,tx:t.x,side:e.side,lane:e.lane,fly:d.fly||0});
    const delay=Math.abs(t.x-e.x)>70?.2:0;
    const go=()=>{if(e.alive||delay)this.strike(e,t)};
    if(delay)this.queue.push({t:delay,fn:go});else go();
  }
  strike(e,t){
    const d=e.def,foes=e.side>0?this.es:this.us;
    if(d.area){
      const cx=t.x;
      for(const f of foes)if(f.alive&&Math.abs(f.x-cx)-f.w/2<=d.area)this.hit(e,f);
      const b=e.side>0?this.ebase:this.pbase;
      if(Math.abs(b.x-cx)-b.w/2<=d.area)this.hit(e,b);
    }else if(t.isBase||t.alive)this.hit(e,t);
  }
  hit(a,t){
    const d=a.def;let dmg=a.atk;
    if(t.isBase){
      if(a.side<0&&this.over)return;
      t.hp-=dmg;t.shake=.2;this.fx.push({k:'hit',x:t.x+a.dir*-30,y:GROUND-60});return;
    }
    if(t.state==='kb')return;
    if(d.vs&&d.vs[t.def.trait])dmg*=d.vs[t.def.trait];
    const crit=d.crit&&this.rand()<d.crit;
    if(crit)dmg*=2;
    this.fx.push({k:crit?'crit':'hit',x:t.x,y:GROUND-30-(t.def.fly||0),big:dmg>400});
    this.damage(t,dmg);
    if(!t.alive)return;
    if(d.slow&&this.rand()<d.slow.p)t.slow=d.slow.t;
    if(d.stun&&!t.def.boss&&this.rand()<d.stun.p)t.stun=d.stun.t;
    if(d.kbc&&this.rand()<d.kbc)this.knock(t);
  }
  damage(t,dmg){
    if(!t.alive)return;
    t.hp-=dmg;t.hurt=.12;
    if(t.hp<=0){
      if(t.shield){t.shield=false;t.hp=1;this.fx.push({k:'guard',x:t.x});}
      else{this.kill(t);return}
    }
    const kb=t.def.kb,done=Math.min(kb-1,Math.floor((1-t.hp/t.maxhp)*kb));
    if(done>t.kbDone){t.kbDone=done;this.knock(t)}
  }
  knock(t){if(!t.alive)return;t.state='kb';t.timer=KB_T;this.fx.push({k:'kb',x:t.x,y:GROUND-40})}
  kill(t){
    t.alive=false;this.fx.push({k:'die',e:t});
    if(t.side<0){this.kills++;this.money=Math.min(this.cap,this.money+t.def.gold)}
    else if(t.def.onDeath){const o=t.def.onDeath;for(let i=0;i<o.n;i++){const u=this.addUnit(o.id,t.lv,t.x+(i-3)*14);u.state='move'}}
  }
}
return{VH,WATER_Y,GROUND,TRAIT,LAPS,RARE,UNITS,ENEMIES,CHAPTERS,STAGES,STOM,META,lvMul,lvCost,metaCost,battleCfg,Battle};
})();
