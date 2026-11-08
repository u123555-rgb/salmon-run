window.SALMON_ART=(()=>{
'use strict';
const INK='#17242c';
const P=(c,fill,lw=2.2)=>{if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=INK;c.stroke()}};
const E=(c,x,y,rx,ry,fill,r=0,lw)=>{c.beginPath();c.ellipse(x,y,rx,ry,r,0,6.2832);P(c,fill,lw)};
const rr=(c,x,y,w,h,r,fill,lw)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();P(c,fill,lw)};
const poly=(c,pts,fill,lw)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();P(c,fill,lw)};
const line=(c,pts,lw=2.2,col=INK)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.lineWidth=lw;c.strokeStyle=col;c.lineCap='round';c.stroke()};
const dot=(c,x,y,r=2,col=INK)=>{c.beginPath();c.arc(x,y,r,0,6.2832);c.fillStyle=col;c.fill()};
const legs=(c,p,x1,x2,top,len=9)=>{const s=p.sw*3.5;line(c,[[x1,top],[x1+s,top+len]],2.6);line(c,[[x2,top],[x2-s,top+len]],2.6)};

// キングサーモンの槍。(0,0)が持ち手の後ろで左へ伸びる。しっぽのひれがつば、先に目とカエデの王冠
function kingLance(c,len,w){
  rr(c,-2,-3.5,22,7,3,'#6b4a2c',1.8);line(c,[[4,-3],[4,3]],1.4,'#3a2a1d');line(c,[[10,-3],[10,3]],1.4,'#3a2a1d');
  c.beginPath();c.moveTo(-8,0);c.quadraticCurveTo(-2,-14,4,-w*1.9);c.quadraticCurveTo(-2,0,4,w*1.9);c.quadraticCurveTo(-2,14,-8,0);c.closePath();P(c,'#4f6b62',1.8);
  const cone=()=>{c.beginPath();c.moveTo(-6,-w);c.quadraticCurveTo(-len*.5,-w*.65,-len,0);c.quadraticCurveTo(-len*.5,w*.65,-6,w);c.closePath()};
  cone();c.fillStyle='#f6efe3';c.fill();c.save();cone();c.clip();c.fillStyle='#4f6b62';c.fillRect(-len,-w-2,len,w+1.5);
  c.strokeStyle='#ff7a59';c.lineWidth=w*.3;c.beginPath();c.moveTo(-6,1);c.lineTo(-len,0);c.stroke();
  c.fillStyle='#1f322c';for(let i=0;i<8;i++){c.beginPath();c.arc(-16-i*(len-34)/8,-w*.45+((i*5)%3)*1.8,1.5,0,6.3);c.fill()}c.restore();
  cone();P(c,null,1.8);
  c.beginPath();c.arc(-len*.7,0,w*.6,-1.2,1.2);c.lineWidth=1.4;c.strokeStyle=INK;c.stroke();
  dot(c,-len*.84,-w*.2,2);
  c.save();c.translate(-len*.78,-w*.62);c.rotate(-.08);c.scale(1.3,1.3);poly(c,[[-6,2],[-7,-6],[-3,-2],[0,-7],[3,-2],[7,-6],[6,2]],'#ffd23b',1.2);mapleLeaf(c,0,-1,1.8,'#e3170a');c.restore()}
function fish(c,p,o){
  const L=o.L||56,H=o.H||24,hump=o.hump||0,back=o.back||'#8fa6b4',belly=o.belly||'#f6f1e8',fin=o.fin||back;
  const wag=Math.sin(p.t*(o.ws||10))*(o.wag??.2);
  c.save();c.translate(0,-(o.y??32)+Math.sin(p.t*4)*1.4);
  if(o.tilt)c.rotate(o.tilt);
  c.save();c.translate(L*.41,0);c.rotate(wag);
  c.beginPath();c.moveTo(0,-H*.13);c.quadraticCurveTo(L*.1,-H*.2,L*.25,-H*.58);c.quadraticCurveTo(L*.17,0,L*.25,H*.58);c.quadraticCurveTo(L*.1,H*.2,0,H*.13);c.closePath();P(c,fin);c.restore();
  poly(c,[[-L*.06,-H*.5-hump*.9],[L*.07,-H*.9-hump],[L*.15,-H*.44-hump*.6]],fin);
  poly(c,[[L*.24,-H*.3],[L*.3,-H*.56],[L*.33,-H*.24]],fin);
  poly(c,[[L*.03,H*.42],[L*.15,H*.74],[L*.2,H*.32]],fin);
  const body=()=>{c.beginPath();c.moveTo(-L*.52,H*.04);c.bezierCurveTo(-L*.36,-H*.66-hump,L*.12,-H*.72-hump,L*.44,-H*.1);c.lineTo(L*.44,H*.1);c.bezierCurveTo(L*.12,H*.66,-L*.34,H*.62,-L*.52,H*.04);c.closePath()};
  body();c.fillStyle=belly;c.fill();
  c.save();body();c.clip();
  c.fillStyle=back;c.beginPath();c.moveTo(-L,H*.05);c.quadraticCurveTo(0,H*.28,L,-H*.02);c.lineTo(L,-H*3);c.lineTo(-L,-H*3);c.closePath();c.fill();
  if(o.stripe){c.strokeStyle=o.stripe;c.lineWidth=H*.2;c.beginPath();c.moveTo(-L*.5,H*.06);c.quadraticCurveTo(0,H*.32,L*.5,H*.02);c.stroke()}
  if(o.head){c.fillStyle=o.head;c.beginPath();c.moveTo(-L*.2,-H*2);c.quadraticCurveTo(-L*.12,0,-L*.2,H*2);c.lineTo(-L,H*2);c.lineTo(-L,-H*2);c.closePath();c.fill()}
  if(o.spots){c.fillStyle=o.spots;for(let i=0;i<11;i++){const x=-L*.16+i*L*.058,y=-H*.42+((i*7)%4)*H*.13-(hump*.5*(1-Math.abs(i-5)/5.5));c.beginPath();c.arc(x,y,1.7,0,6.2832);c.fill()}}
  if(o.paint)o.paint(c,L,H);
  c.restore();
  body();P(c,null);
  c.beginPath();c.arc(-L*.22,0,H*.44,-1.15,1.15);c.lineWidth=2;c.strokeStyle=INK;c.stroke();
  const ex=-L*.36,ey=-H*.12;
  // 真の遡上の名札ごとの見た目。1:ねじり鉢巻き 2:リボン
  if(p.acc===1){const A0=[ex-H*.5,-H*.7],A1=[ex+H*.15,-H*.32],A2=[ex+H*.86,-H*.5],qp=t=>[0,1].map(k=>(1-t)*(1-t)*A0[k]+2*t*(1-t)*A1[k]+t*t*A2[k]);
    c.save();body();c.clip();c.lineCap='butt';const bp=()=>{c.beginPath();c.moveTo(...A0);c.quadraticCurveTo(...A1,...A2)};
    c.lineWidth=H*.25+3.6;c.strokeStyle=INK;bp();c.stroke();c.lineWidth=H*.25;c.strokeStyle='#fff';bp();c.stroke();
    for(let i=1;i<=5;i++){const[x,y]=qp(.12+i*.14);line(c,[[x-1.6,y-H*.1],[x+1.6,y+H*.1]],1.8,'#e3170a')}c.restore();
    accKnot(c,A2[0],A2[1],H/24*.9)}
  if(p.acc===2)accBow(c,ex+H*.55,-H*.55,H/24);
  if(o.brow)line(c,[[ex-5,ey-3-o.brow],[ex+5,ey-5+o.brow]],2.4);
  dot(c,ex,ey,o.eye||2.3);
  if(o.hook){c.beginPath();c.moveTo(-L*.44,-H*.3);c.quadraticCurveTo(-L*.62,-H*.2,-L*.56,H*.3);c.quadraticCurveTo(-L*.52,H*.02,-L*.4,H*.02);c.closePath();P(c,o.head||back);line(c,[[-L*.5,H*.34],[-L*.34,H*.2]],2.6);for(let i=0;i<3;i++)line(c,[[-L*.46+i*4,H*.16],[-L*.45+i*4,H*.26]],1.6,'#fff')}
  else line(c,[[-L*.5,H*.1],[-L*.4,H*.17]],2);
  const flap=Math.sin(p.t*7)*.25;
  c.save();c.translate(-L*.14,H*.22);c.rotate(.5+flap);poly(c,[[0,-3],[L*.18,0],[0,4]],fin);c.restore();
  if(o.after)o.after(c,L,H);
  c.restore();
}
function mapleLeaf(c,x,y,r,col){const pts=[[0,-1],[.18,-.55],[.45,-.7],[.38,-.3],[.9,-.42],[.72,-.05],[.95,.1],[.42,.28],[.48,.55],[.08,.4],[.06,.95],[-.06,.95],[-.08,.4],[-.48,.55],[-.42,.28],[-.95,.1],[-.72,-.05],[-.9,-.42],[-.38,-.3],[-.45,-.7],[-.18,-.55]];poly(c,pts.map(q=>[x+q[0]*r,y+q[1]*r]),col,1.2)}
function rice(c,x,y){c.fillStyle='rgba(23,36,44,.22)';c.fillRect(x,y,3,1.5)}
function neta(c,x,y,w,col,scorched){
  c.beginPath();c.moveTo(x-w*.52,y+7);c.quadraticCurveTo(x-w*.48,y-8,x,y-8);c.quadraticCurveTo(x+w*.48,y-8,x+w*.56,y+5);c.quadraticCurveTo(x,y+12,x-w*.52,y+7);c.closePath();P(c,col);
  c.lineWidth=2.4;c.strokeStyle='rgba(255,255,255,.85)';
  for(let i=-1;i<=2;i++){c.beginPath();c.moveTo(x+i*w*.2-3,y-6);c.quadraticCurveTo(x+i*w*.2+5,y,x+i*w*.2-2,y+7);c.stroke()}
  if(scorched){c.fillStyle='rgba(50,24,10,.55)';for(let i=0;i<9;i++){c.beginPath();c.arc(x-w*.4+i*w*.1,y-3+(i*5%4)-2,3-(i%2),0,6.2832);c.fill()}}
}
function person(c,p,o){
  const s=p.sw*6,arm=-(p.atk||0)*.9;
  c.lineCap='round';
  line(c,[[-6,-26],[-6+s,0]],7,INK);line(c,[[6,-26],[6-s,0]],7,INK);
  line(c,[[-6,-26],[-6+s,0]],4,o.pants);line(c,[[6,-26],[6-s,0]],4,o.pants);
  rr(c,-13,-56,26,33,7,o.top);
  if(o.detail)o.detail(c);
  E(c,0,-67,11,11,'#f2cba6');
  dot(c,-6,-68,1.8);line(c,[[-9,-62],[-3,-62]],1.8);
  if(o.head)o.head(c);
  c.save();c.translate(-8,-48);c.rotate(arm);
  line(c,[[0,0],[-14,10]],7,INK);line(c,[[0,0],[-14,10]],4,o.top);
  if(o.hand)o.hand(c);
  c.restore();
}
function bear(c,p,o){
  const f=o.fur,s=p.sw*5,a=p.atk||0;
  line(c,[[20,-24],[20+s,0]],11,INK);line(c,[[20,-24],[20+s,0]],7,f);
  line(c,[[-14,-24],[-14-s,0]],11,INK);line(c,[[-14,-24],[-14-s,0]],7,f);
  c.beginPath();c.moveTo(-30,-40);c.bezierCurveTo(-26,-74,26,-82,40,-50);c.bezierCurveTo(46,-30,38,-16,20,-16);c.lineTo(-18,-16);c.bezierCurveTo(-30,-18,-32,-30,-30,-40);c.closePath();P(c,f);
  if(o.body)o.body(c);
  c.save();c.translate(-22,-58);c.rotate(-a*.5);
  E(c,-10,-17,6,6,f);E(c,8,-19,6,6,f);
  E(c,0,-6,20,18,f);
  E(c,-16,0,11,8,o.snout||'#c9a57b');dot(c,-24,-3,2.8);
  dot(c,-8,-11,2.2);
  if(o.scar)line(c,[[-13,-18],[-3,-6]],2,'#fff');
  line(c,[[-22,4],[-13,6]],2);
  c.restore();
  c.save();c.translate(-22,-34);c.rotate(-.4-a*1.4);
  line(c,[[0,0],[-20,14]],12,INK);line(c,[[0,0],[-20,14]],8,f);
  c.restore();
  if(o.after)o.after(c);
}
function bird(c,p,o){
  const f=Math.sin(p.t*13)*.7,S=o.s||1;
  c.save();c.translate(0,-30-Math.sin(p.t*5)*3);c.scale(S,S);
  poly(c,[[14,-2],[30,-5],[28,5]],o.tail||o.wing);
  E(c,0,0,17,10,o.body);
  c.save();c.translate(2,-4);c.rotate(-f);poly(c,[[-9,0],[22,-3],[6,6]],o.wing);c.restore();
  if(o.neck)line(c,[[-8,-4],[-16,-14]],9,o.headc);
  E(c,-16,-6,8.5,8,o.headc||o.body);
  poly(c,[[-23,-8],[-34,-4],[-22,-2]],o.beak);
  dot(c,-18,-8,1.9);
  line(c,[[-13,-13],[-22,-11]],2.2);
  if(o.tip)poly(c,[[16,-4],[22,-6],[20,0]],o.tip,0);
  if(o.after)o.after(c);
  c.restore();
}

const DRAW={
shake(c,p){fish(c,p,{back:'#8fa6b4',stripe:'#ff9a78'})},
ikura(c,p){const b=Math.abs(p.sw)*7;c.translate(0,-b);
  c.fillStyle='rgba(23,36,44,.0)';E(c,0,-12,11.5,11.5,'#f0431f');
  E(c,1,-11,5,5,'#c52a12',0,0);E(c,-4,-16,2.6,3.6,'#ffd3c2',.5,0);
  dot(c,-5,-11,1.6);dot(c,3,-11,1.6);line(c,[[-3,-6],[1,-6]],1.5)},
aramaki(c,p){c.translate(0,-Math.abs(p.sw)*8);
  fish(c,p,{L:68,H:27,y:42,tilt:-1.5708,back:'#6f8391',belly:'#d7cfbf',wag:.06,ws:6,
    paint(c,L,H){c.fillStyle='#ff8d6b';c.beginPath();c.ellipse(-L*.02,H*.26,L*.25,H*.15,0,0,6.3);c.fill();c.strokeStyle='#17242c';c.lineWidth=1.6;c.stroke()}});
  c.lineWidth=3.4;c.strokeStyle='#c8a33e';c.beginPath();c.moveTo(-12,-74);c.lineTo(12,-68);c.moveTo(-12,-68);c.lineTo(12,-74);c.stroke();
  line(c,[[-1,-71],[-3,-90]],2.4,'#c8a33e');line(c,[[-3,-90],[-13,-83]],2.4,'#c8a33e');line(c,[[-3,-90],[8,-84]],2.4,'#c8a33e')},
nigiri(c,p){c.translate(0,-Math.abs(p.sw)*3);legs(c,p,-10,10,-10,10);
  rr(c,-24,-30,48,22,9,'#fbf7ec');rice(c,-12,-18);rice(c,8,-14);rice(c,-2,-23);rice(c,14,-22);
  neta(c,0,-36,58,'#ff8a5c');dot(c,-16,-37,2.2);line(c,[[-22,-30],[-14,-30]],1.8)},
abari(c,p){c.translate(0,-Math.abs(p.sw)*3);legs(c,p,-10,10,-10,10);
  rr(c,-24,-30,48,22,9,'#fbf7ec');rice(c,-12,-18);rice(c,8,-14);
  neta(c,0,-36,58,'#f48050',1);dot(c,-16,-37,2.2);line(c,[[-22,-30],[-14,-30]],1.8);
  const f=4+Math.sin(p.t*22)*2;
  rr(c,-44,-22,18,9,3,'#8d99a2');
  poly(c,[[-44,-20],[-52-f,-17],[-44,-14]],'#ff9a2e',1.4);poly(c,[[-44,-19],[-49-f*.6,-17],[-44,-15]],'#ffe55c',0)},
oyako(c,p){c.translate(0,-Math.abs(p.sw)*2.5);legs(c,p,-13,13,-8,8);
  c.beginPath();c.moveTo(-29,-34);c.lineTo(29,-34);c.quadraticCurveTo(24,-10,14,-8);c.lineTo(-14,-8);c.quadraticCurveTo(-24,-10,-29,-34);c.closePath();P(c,'#2b1d22');
  line(c,[[-25,-26],[25,-26]],2.2,'#c9301f');
  dot(c,-10,-19,2.2,'#fff');dot(c,4,-19,2.2,'#fff');line(c,[[-6,-14],[-1,-14]],1.8,'#fff');
  E(c,0,-36,29,9,'#fbf7ec');
  neta(c,-10,-44,28,'#ff8a5c');neta(c,12,-43,26,'#ff9770');
  for(const[x,y]of[[-2,-52],[5,-51],[-7,-50],[1,-46],[10,-52],[-13,-52]]){E(c,x,y,3.4,3.4,'#f0431f',0,1.2);dot(c,x-1,y-1,.8,'#ffd3c2')}},
toba(c,p){const w=Math.sin(p.t*5)*5,a=(p.atk||0)*14;
  const path=()=>{c.beginPath();c.moveTo(4,0);c.bezierCurveTo(14+w,-20,-14-w,-40,2-a,-66)};
  c.lineCap='butt';path();c.lineWidth=14;c.strokeStyle=INK;c.stroke();path();c.lineWidth=10;c.strokeStyle='#b5683a';c.stroke();
  path();c.lineWidth=2.4;c.strokeStyle='#e2a075';c.setLineDash([4,5]);c.stroke();c.setLineDash([]);
  E(c,2-a,-68,6,4,'#c8a33e',0,1.6);line(c,[[2-a,-72],[0-a,-80]],2,'#c8a33e');
  dot(c,-3-a*.4,-56,2);dot(c,5-a*.4,-56,2)},
onigiri(c,p){c.translate(0,-20);c.rotate(-(p.roll??p.t*7));
  c.beginPath();c.moveTo(0,-22);c.quadraticCurveTo(6,-22,22,8);c.quadraticCurveTo(25,16,16,16);c.lineTo(-16,16);c.quadraticCurveTo(-25,16,-22,8);c.quadraticCurveTo(-6,-22,0,-22);c.closePath();P(c,'#fbf7ec');
  rr(c,-12,4,24,12,2,'#20302a',1.6);E(c,0,-4,7,6,'#ff8a5c',0,1.6);dot(c,-3,-5,1.3,'#fff');dot(c,3,-3,1,'#fff');
  dot(c,-6,10,1.5,'#fff');dot(c,6,10,1.5,'#fff')},
smoke(c,p){c.translate(0,-Math.abs(p.sw)*2.5);legs(c,p,-10,10,-10,10);
  E(c,0,-13,28,6,'#eef4f2');
  E(c,10,-28,15,12,'#f9a38d',.3);E(c,-9,-28,15,12,'#ff8f73',-.3);E(c,0,-34,14,12,'#ffa78e');
  line(c,[[-6,-38],[5,-30]],1.6,'#fff');line(c,[[-13,-32],[-6,-24]],1.6,'#fff');line(c,[[8,-34],[14,-27]],1.6,'#fff');
  rr(c,-18,-37,14,6,2,INK,0);rr(c,-1,-37,14,6,2,INK,0);line(c,[[-5,-35],[0,-35]],2);
  c.globalAlpha=.5;for(let i=0;i<3;i++){const y=-48-((p.t*16+i*11)%24);E(c,6+Math.sin(p.t*2+i*2)*6+i*5-5,y,4+i,3+i,'#dfe5e4',0,0)}c.globalAlpha=1},
flake(c,p){c.translate(0,-Math.abs(p.sw)*2.5);legs(c,p,-9,9,-9,9);
  rr(c,-16,-44,32,36,6,'#e8f4f2');
  c.fillStyle='#ff8a5c';for(let i=0;i<20;i++){c.fillRect(-13+(i*7)%25,-38+(i*5)%28,4,2.4)}
  rr(c,-16,-44,32,36,6,null);
  rr(c,-18,-53,36,10,3,'#d9331f');
  rr(c,-11,-32,22,14,2,'#fff',1.6);dot(c,-5,-25,1.7);dot(c,5,-25,1.7);line(c,[[-2,-21],[2,-21]],1.5)},
ishikari(c,p){c.translate(0,-Math.abs(p.sw)*2);legs(c,p,-13,13,-9,9);
  E(c,-33,-26,6,4,'#8a6248');E(c,33,-26,6,4,'#8a6248');
  c.beginPath();c.moveTo(-30,-34);c.quadraticCurveTo(-32,-8,0,-8);c.quadraticCurveTo(32,-8,30,-34);c.closePath();P(c,'#8a6248');
  dot(c,-9,-21,2.1,'#fff');dot(c,7,-21,2.1,'#fff');line(c,[[-4,-15],[2,-15]],1.8,'#fff');
  E(c,0,-35,30,9,'#d99a4a');
  rr(c,-18,-42,14,10,2,'#ff8a5c',1.6);rr(c,3,-41,13,9,2,'#f6f1dc',1.6);E(c,-3,-34,8,4,'#7cb35a',.2,1.4);
  c.globalAlpha=.55;c.lineWidth=2.4;c.strokeStyle='#fff';for(let i=0;i<3;i++){const x=-14+i*14,o=(p.t*14+i*9)%18;c.beginPath();c.moveTo(x,-48-o);c.quadraticCurveTo(x+5,-54-o,x,-60-o);c.stroke()}c.globalAlpha=1},
chanchan(c,p){c.translate(0,-Math.abs(p.sw)*2);legs(c,p,-18,18,-12,12);
  rr(c,-38,-22,76,10,2,'#2c3338');
  E(c,0,-26,30,6,'#d7e0a8',0,1.6);E(c,0,-32,27,8,'#ff8a5c');
  for(const x of[-14,0,14])line(c,[[x-3,-37],[x+3,-27]],1.8,'#fff');
  dot(c,-20,-33,2);E(c,-32,-25,4,3,'#f2c84b',0,1.4);E(c,31,-25,4,3,'#7cb35a',0,1.4);
  c.globalAlpha=.5;for(let i=0;i<2;i++){const o=(p.t*18+i*9)%14;line(c,[[-10+i*20,-42-o],[-8+i*20,-48-o]],2,'#fff')}c.globalAlpha=1},
gin(c,p){fish(c,p,{L:52,H:20,back:'#c5d8e0',belly:'#fff',stripe:'#eaf4f7',ws:20,
  after(c,L,H){c.globalAlpha=.55;line(c,[[L*.1,-H*.2],[L*.3,-H*.2]],1.5,'#fff');line(c,[[L*.12,H*.1],[L*.28,H*.1]],1.5,'#fff');c.globalAlpha=1}})},
karafuto(c,p){fish(c,p,{L:60,H:24,hump:15,back:'#7c8f7e',belly:'#efe9dc',spots:'#2f3d33',y:30})},
sakura(c,p){fish(c,p,{L:56,H:24,back:'#f3a9bc',belly:'#fff4f5',stripe:'#ff7f9e'});
  for(let i=0;i<3;i++){const o=(p.t*.7+i*.33)%1;c.globalAlpha=1-o;E(c,16+i*9-o*14,-58+o*46,3.6,2.1,'#ffc6d6',p.t+i,1)}c.globalAlpha=1},
trout(c,p){fish(c,p,{back:'#9fb59b',belly:'#fbf3e3',stripe:'#ee6ea1',spots:'#46584a'})},
beni(c,p){fish(c,p,{L:58,H:25,back:'#df3a2b',belly:'#e8654f',head:'#5f9460',fin:'#5f9460'})},
hanamagari(c,p){fish(c,p,{L:72,H:30,y:36,back:'#5e3d3b',belly:'#8c5c4e',fin:'#3d2a2a',hook:1,hump:4,head:'#5e6f4e',brow:2,
  paint(c,L,H){c.lineWidth=5;for(let i=0;i<6;i++){c.strokeStyle=i%2?'#c13a2a':'#6fae5e';const x=-L*.12+i*L*.09;c.beginPath();c.moveTo(x,-H);c.quadraticCurveTo(x+6,0,x-3,H);c.stroke()}}})},
toki(c,p){fish(c,p,{L:60,H:25,back:'#2f5273',belly:'#e4ecf2',after(c,L,H){E(c,L*.08,-H*.02,10.5,10.5,'#fff7d6');c.save();c.translate(L*.08,-H*.02);c.rotate(p.t*2);line(c,[[0,0],[0,-7.5]],2);c.restore();c.save();c.translate(L*.08,-H*.02);c.rotate(p.t*.2);line(c,[[0,0],[5,0]],2);c.restore()}})},
ashi(c,p){const s=p.sw*12,k=(p.atk||0);
  const leg=(x,o,col)=>{const fx=x+o-k*(x<0?26:0),kx=x+o*.2-5,ky=-22;c.lineCap='round';c.lineJoin='round';
    c.beginPath();c.moveTo(x,-46);c.lineTo(kx,ky);c.lineTo(fx,-4);c.lineWidth=9.5;c.strokeStyle=INK;c.stroke();c.lineWidth=5.4;c.strokeStyle=col;c.stroke();
    rr(c,fx-11,-6,17,7,3,'#fff',1.8);line(c,[[fx-5,-12],[fx+1,-12]],2.4,'#e3170a')};
  leg(5,-s,'#f0c8a0');leg(-3,s,'#f7d6b4');
  fish(c,p,{L:52,H:23,y:60,back:'#8fa6b4',stripe:'#ff9a78',wag:.1})},
king(c,p){fish(c,p,{L:104,H:44,y:50,back:'#5b7c8d',belly:'#f4efe6',stripe:'#ff8e6e',spots:'#21343f',ws:6,wag:.12,
  after(c,L,H){c.save();c.translate(-L*.32,-H*.54);c.rotate(-.14);poly(c,[[-13,4],[-16,-14],[-7,-5],[0,-17],[7,-5],[16,-14],[13,4]],'#ffd23b',2);dot(c,0,-3,2.4,'#e3170a');c.restore()}})},
keiji(c,p){fish(c,p,{L:48,H:21,back:'#d9dfe6',belly:'#fff8ea',stripe:'#ffc66b',ws:16,eye:2});
  for(let i=0;i<3;i++){const a=(p.t*1.6+i*.33)%1;c.globalAlpha=1-Math.abs(a-.5)*2;const x=-26+i*26,y=-54+((i*13)%10),r=5*a+1;poly(c,[[x,y-r],[x+1,y-1],[x+r,y],[x+1,y+1],[x,y+r],[x-1,y+1],[x-r,y],[x-1,y-1]],'#ffe56b',0)}c.globalAlpha=1},
osuke(c,p){const a=p.atk||0;fish(c,p,{L:176,H:58,y:72,back:'#39465f',belly:'#efe6d0',fin:'#d9a62e',stripe:'#d9a62e',ws:4,wag:.08,eye:4,brow:4,hump:4,
  after(c,L,H){c.fillStyle='#f7f7f2';c.strokeStyle=INK;c.lineWidth=2;c.beginPath();c.moveTo(-L*.48,H*.14);c.quadraticCurveTo(-L*.46,H*.8,-L*.28,H*.58);c.quadraticCurveTo(-L*.34,H*.3,-L*.34,H*.2);c.closePath();c.fill();c.stroke();
    if(a>.1){E(c,-L*.47,H*.1,9+a*9,6+a*7,'#6b1c14')}
    E(c,L*.14,-H*.12,11,11,'#efe6d0',0,2);E(c,L*.14,-H*.12,5,5,'#d9a62e',0,1.6)}})},

ugui(c,p){fish(c,p,{L:44,H:17,y:24,back:'#5f7b5a',belly:'#e9d9a8',stripe:'#d9533d',brow:2})},
kani(c,p){const s=p.sw*3;c.translate(0,-Math.abs(p.sw)*1.5);
  for(const k of[-1,1])for(let i=0;i<3;i++)line(c,[[k*14,-14-i*2],[k*26+k*i*2,-6+s*(i%2?1:-1)],[k*30,0]],2.2);
  c.save();c.translate(-22,-24);c.rotate(-(p.atk||0)*.8);E(c,-6,-4,10,8,'#7b5b3c');E(c,-10,-1,5,6,'#3f3528',0,0);c.restore();
  E(c,22,-24,9,7,'#7b5b3c');E(c,0,-16,20,13,'#7b5b3c');
  line(c,[[-6,-27],[-6,-33]],2);line(c,[[6,-27],[6,-33]],2);dot(c,-6,-34,2.2);dot(c,6,-34,2.2);line(c,[[-4,-12],[4,-12]],1.8)},
kamome(c,p){bird(c,p,{body:'#fff',wing:'#b4c1ca',beak:'#f4c21f',tip:'#1d2428'})},
karasu(c,p){bird(c,p,{body:'#262c33',wing:'#171c21',beak:'#3a4048',s:1.08})},
mink(c,p){const b=Math.abs(p.sw)*7;c.translate(0,-b);
  poly(c,[[24,-18],[46,-24],[46,-16],[24,-11]],'#3a2a26');
  rr(c,-24,-30,54,20,10,'#4b3530');
  rr(c,-38,-34,22,17,8,'#4b3530');E(c,-20,-34,3.5,3.5,'#4b3530');dot(c,-31,-28,2,'#fff');dot(c,-37,-24,1.8,'#f4b6a6');
  line(c,[[-14,-12],[-14+p.sw*5,0]],3);line(c,[[18,-12],[18-p.sw*5,0]],3)},
azarashi(c,p){const s=Math.sin(p.t*5)*2;
  c.beginPath();c.moveTo(-34,-22);c.bezierCurveTo(-30,-56+s,20,-48,44,-6);c.lineTo(60,-12);c.lineTo(60,0);c.lineTo(-20,0);c.bezierCurveTo(-34,-2,-38,-12,-34,-22);c.closePath();P(c,'#9ba7ad');
  c.fillStyle='#6c797f';for(const[x,y]of[[-8,-38],[6,-30],[18,-22],[-2,-20],[28,-14]]){c.beginPath();c.arc(x,y,2.6,0,6.3);c.fill()}
  dot(c,-24,-30,2.8);E(c,-32,-24,5,3.6,'#7f8b90',0,1.4);
  line(c,[[-36,-22],[-46,-26]],1.4);line(c,[[-36,-19],[-46,-18]],1.4);
  poly(c,[[-6,-14],[-20,-2],[-2,-3]],'#7f8b90')},
washi(c,p){bird(c,p,{s:1.55,body:'#6b4a33',wing:'#4a3324',tail:'#fff',beak:'#f2c021'})},
tsuribito(c,p){person(c,p,{pants:'#6d7a5a',top:'#8b9c6a',
  detail(c){for(const[x,y]of[[-7,-44],[3,-44],[-7,-36],[3,-36]])rr(c,x,y,6,6,1,'#7b8b5d',1.2)},
  head(c){c.beginPath();c.ellipse(0,-75,17,4,0,0,6.3);P(c,'#d6cda0');rr(c,-9,-85,18,11,5,'#d6cda0')},
  hand(c){const a=(p.atk||0);line(c,[[-14,10],[-34,-30+a*20]],2.6,'#4e3a22')}})},
ryoshi(c,p){person(c,p,{pants:'#e8741c',top:'#e8741c',
  detail(c){line(c,[[-7,-56],[-9,-36]],3,'#2b2b2b');line(c,[[7,-56],[9,-36]],3,'#2b2b2b')},
  head(c){line(c,[[-11,-73],[11,-73]],4.6,'#2b4c8c');line(c,[[9,-73],[17,-78]],3,'#2b4c8c')},
  hand(c){rr(c,-26,8,18,14,4,'#7fa39f',1.8);line(c,[[-22,10],[-12,20]],1,INK);line(c,[[-12,10],[-22,20]],1,INK)}})},
itamae(c,p){person(c,p,{pants:'#3d4a55',top:'#f7f7f2',
  detail(c){line(c,[[0,-56],[7,-40]],2);rr(c,-13,-34,26,5,1,'#2b4c8c',1.4)},
  head(c){rr(c,-11,-84,22,13,4,'#f7f7f2')},
  hand(c){poly(c,[[-14,10],[-20,-4],[-22,-30],[-16,-4],[-12,8]],'#dfe7ec',1.8)}})},
konguma(c,p){c.scale(.62,.62);bear(c,p,{fur:'#8a5a34'})},
higuma(c,p){c.scale(1.2,1.2);bear(c,p,{fur:'#6d4427'})},
todo(c,p){c.scale(2.1,2.1);const s=Math.sin(p.t*4)*2;
  c.beginPath();c.moveTo(-30,-30);c.bezierCurveTo(-30,-74+s,24,-58,46,-6);c.lineTo(62,-12);c.lineTo(62,0);c.lineTo(-22,0);c.bezierCurveTo(-36,-4,-36,-18,-30,-30);c.closePath();P(c,'#a77d4f');
  c.beginPath();c.moveTo(-26,-52);c.bezierCurveTo(-8,-60,8,-46,10,-30);c.bezierCurveTo(-6,-26,-20,-34,-26,-52);c.closePath();P(c,'#7f5a36');
  dot(c,-23,-46,2.4);line(c,[[-29,-53],[-20,-49]],2.2);E(c,-32,-37,7,5,'#8d6a42',0,1.6);
  line(c,[[-36,-36],[-48,-40]],1.3);line(c,[[-36,-33],[-48,-33]],1.3);line(c,[[-36,-30],[-46,-26]],1.3);
  line(c,[[-29,-30],[-27,-23]],2.4,'#fff');line(c,[[-23,-30],[-22,-24]],2.4,'#fff');
  poly(c,[[-8,-14],[-24,-1],[-4,-3]],'#8d6a42')},
amimoto(c,p){c.scale(1.75,1.75);
  line(c,[[12,-50],[12,-104]],3,'#6a4b2d');
  poly(c,[[12,-104],[-26+Math.sin(p.t*3)*2,-100],[-24+Math.sin(p.t*3)*2,-78],[12,-82]],'#e3170a',1.8);
  poly(c,[[-2,-99],[-14,-96],[-13,-86],[-2,-88]],'#fff',0);
  DRAW.ryoshi(c,p)},
taisho(c,p){c.scale(1.95,1.95);DRAW.itamae(c,p);
  line(c,[[-10,-61],[-3,-59]],3.4);line(c,[[3,-59],[10,-61]],3.4)},
nushi(c,p){c.scale(1.95,1.95);bear(c,p,{fur:'#3d2a22',snout:'#8d7056',scar:1})},
kibori(c,p){c.scale(1.95,1.95);const s0={...p,sw:0};
  rr(c,-52,-10,108,12,3,'#8d5e34',2.4);
  c.save();c.translate(0,-9);
  bear(c,s0,{fur:'#b98b55',snout:'#c79c66',
    body(c){c.lineCap='round';c.lineWidth=1.4;c.strokeStyle='rgba(60,34,14,.75)';for(let r=0;r<6;r++)for(let k=0;k<8;k++){const x=-24+k*8.5+(r%2)*4,y=-68+r*9;c.beginPath();c.moveTo(x,y);c.lineTo(x+3,y+5);c.stroke()}},
    after(c){c.save();c.translate(-53,-52);c.rotate(.28);
      c.beginPath();c.moveTo(-30,0);c.quadraticCurveTo(-12,-11,18,-6);c.lineTo(32,-13);c.lineTo(30,0);c.lineTo(33,12);c.lineTo(18,5);c.quadraticCurveTo(-12,12,-30,0);c.closePath();P(c,'#a9834f');
      dot(c,-21,-1,2);c.lineWidth=1.2;c.strokeStyle='rgba(60,34,14,.7)';for(let i=0;i<6;i++){c.beginPath();c.moveTo(-10+i*5,-6);c.lineTo(-7+i*5,5);c.stroke()}c.restore()}});
  c.restore()},
// ユーコン川の敵
wolf(c,p){const s=p.sw*6,b=Math.abs(p.sw)*3;c.translate(0,-b);
  c.beginPath();c.moveTo(26,-30);c.quadraticCurveTo(46,-34,50,-20);c.quadraticCurveTo(40,-24,26,-22);c.closePath();P(c,'#8d949a');
  for(const[x,k]of[[-16,1],[-6,-1],[14,1],[22,-1]])line(c,[[x,-18],[x+s*k,0]],3.4,'#5b6168');
  rr(c,-22,-36,50,20,10,'#9aa1a7');E(c,4,-20,18,4,'#d6dadd',0,0);
  c.save();c.translate(-24,-36);poly(c,[[-2,-10],[2,-22],[8,-8]],'#9aa1a7',2);poly(c,[[6,-10],[12,-20],[14,-6]],'#9aa1a7',2);
  E(c,0,0,13,11,'#9aa1a7');poly(c,[[-8,-2],[-26,4],[-8,8]],'#d6dadd',2);dot(c,-25,4,2.2);dot(c,-4,-3,2);line(c,[[-9,-7],[-1,-5]],2);c.restore()},
hakuto(c,p){bird(c,p,{s:1.5,body:'#3b2a20',wing:'#2a1d16',tail:'#fff',beak:'#f2c021',headc:'#fbf8f0'})},
moose(c,p){const s=p.sw*5;c.scale(1.15,1.15);
  for(const[x,k]of[[-20,1],[-10,-1],[22,1],[30,-1]])line(c,[[x,-34],[x+s*k,0]],4.4,'#3e2a1e');
  c.beginPath();c.moveTo(-26,-40);c.bezierCurveTo(-24,-70,10,-66,38,-52);c.bezierCurveTo(44,-40,38,-30,30,-30);c.lineTo(-22,-30);c.bezierCurveTo(-30,-32,-30,-36,-26,-40);c.closePath();P(c,'#5a3c2a');
  poly(c,[[-24,-40],[-34,-50],[-24,-62],[-8,-60]],'#5a3c2a',2);
  c.save();c.translate(-32,-50);c.scale(.85,.85);
  poly(c,[[6,-6],[-2,-30],[10,-24],[14,-36],[20,-22],[28,-30],[24,-10]],'#d9c6a0',2);poly(c,[[0,-6],[-14,-24],[-18,-12],[-26,-18],[-22,-2]],'#d9c6a0',2);
  c.beginPath();c.moveTo(4,-6);c.quadraticCurveTo(-14,-6,-20,10);c.quadraticCurveTo(-22,20,-12,20);c.quadraticCurveTo(0,16,10,8);c.closePath();P(c,'#6b4a34');
  dot(c,-2,0,2.2);dot(c,-17,14,1.8);line(c,[[0,14],[2,26]],5,'#5a3c2a');c.restore()},
goose(c,p){bird(c,p,{s:1.1,body:'#8b7b6b',wing:'#5e5248',tail:'#1d2428',beak:'#1d2428',headc:'#1d2428',neck:1,
  after(c){E(c,-15,-2,4.5,2.6,'#fff',.3,1)}})},
kinhori(c,p){person(c,p,{pants:'#3c4f7a',top:'#c0392b',
  detail(c){c.strokeStyle='rgba(23,36,44,.45)';c.lineWidth=1.4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-13,-50+i*9);c.lineTo(13,-50+i*9);c.moveTo(-8+i*8,-56);c.lineTo(-8+i*8,-23);c.stroke()}},
  head(c){c.beginPath();c.moveTo(-10,-62);c.quadraticCurveTo(0,-50,10,-62);c.closePath();P(c,'#8a5a34',1.6);c.beginPath();c.ellipse(0,-76,18,4,0,0,6.3);P(c,'#6b4a2c');rr(c,-9,-88,18,13,5,'#6b4a2c')},
  hand(c){E(c,-20,10,11,4,'#8d99a2');for(const x of[-23,-19,-16])dot(c,x,9,1.5,'#ffd23b')}})},
grizzly(c,p){c.scale(1.25,1.25);bear(c,p,{fur:'#8a6a48',snout:'#c9a57b',body(c){c.globalAlpha=.5;for(let i=0;i<7;i++)line(c,[[-18+i*7,-70+Math.abs(i-3)*2],[-15+i*7,-62+Math.abs(i-3)*2]],2,'#e9dcc0');c.globalAlpha=1}})},
oyakata(c,p){c.scale(1.8,1.8);person(c,p,{pants:'#3c4f7a',top:'#8e2f22',
  detail(c){rr(c,-13,-34,26,5,1,'#3a2a1d',1.4);E(c,0,-32,4,3,'#ffd23b',0,1.2)},
  head(c){c.beginPath();c.moveTo(-12,-64);c.quadraticCurveTo(0,-38,12,-64);c.closePath();P(c,'#d9d4c8',1.6);c.beginPath();c.ellipse(0,-76,20,4.5,0,0,6.3);P(c,'#4a3324');rr(c,-10,-90,20,15,5,'#4a3324')},
  hand(c){line(c,[[-14,10],[-30,-22]],2.8,'#6b4a2c');poly(c,[[-38,-18],[-30,-26],[-20,-30],[-28,-20]],'#8d99a2',1.6)}});
  E(c,22,-14,10,12,'#c9a96b',0,1.6);line(c,[[18,-25],[26,-25]],2);dot(c,22,-12,2.4,'#ffd23b')},
captain(c,p){c.scale(1.9,1.9);person(c,p,{pants:'#1f2f4f',top:'#24365c',
  detail(c){for(const y of[-48,-40,-32])dot(c,4,y,1.4,'#ffd23b');line(c,[[-13,-52],[-6,-52]],2.4,'#ffd23b')},
  head(c){c.beginPath();c.moveTo(-10,-62);c.quadraticCurveTo(0,-54,10,-62);c.lineWidth=3;c.strokeStyle='#f2f2ee';c.stroke();rr(c,-12,-84,24,10,3,'#fbf8f0');rr(c,-13,-77,26,4,1,INK,0);E(c,0,-80,3.5,2.6,'#ffd23b',0,1)},
  hand(c){c.save();c.translate(-22,4);c.rotate(p.t*1.2);E(c,0,0,10,10,null);c.lineWidth=2.6;c.strokeStyle='#8a5a34';c.beginPath();c.arc(0,0,9,0,6.3);c.stroke();for(let i=0;i<6;i++){const a=i/6*6.28;line(c,[[0,0],[Math.cos(a)*13,Math.sin(a)*13]],2.2,'#8a5a34')}c.restore()}})},
ogrizzly(c,p){c.scale(2.15,2.15);bear(c,p,{fur:'#6f5236',snout:'#b58f66',scar:1,body(c){c.globalAlpha=.55;for(let i=0;i<8;i++)line(c,[[-20+i*7,-72+Math.abs(i-3.5)*2],[-17+i*7,-63+Math.abs(i-3.5)*2]],2,'#efe3c8');c.globalAlpha=1}})},
// 合体キャラ
// ユーコン川の仲間
// 背の低いツナ缶型。ふたに顔(白目なし)、側面のラベルいっぱいに大きな鮭の絵柄
can(c,p){c.translate(0,-Math.abs(p.sw)*3);legs(c,p,-14,14,-9,9);
  const R=27,top=-38,bot=-12,ry=8,PI=Math.PI;
  c.beginPath();c.moveTo(-R,top);c.lineTo(-R,bot);c.ellipse(0,bot,R,ry,0,PI,0,true);c.lineTo(R,top);c.closePath();P(c,'#c3ced4');
  // ラベル(缶の丸みに沿って上下のふちが曲がる)
  const lab=()=>{c.beginPath();c.moveTo(-R,top+2);c.ellipse(0,top+2,R,ry,0,PI,0,true);c.lineTo(R,bot-2);c.ellipse(0,bot-2,R,ry,0,0,PI,false);c.closePath()};
  lab();c.fillStyle='#d9331f';c.fill();
  c.save();lab();c.clip();
  // 右へ泳ぐ大きな鮭。背は銀、腹は鮭色。ラベルからはみ出す尾と鼻先は缶の丸みで隠れる
  c.save();c.translate(0,-16.5);
  poly(c,[[-19,0],[-30,-9],[-26,0],[-30,9]],'#a9bcc5',1.3);
  poly(c,[[-4,-8],[2,-13],[6,-7.5]],'#a9bcc5',1.3);
  const body=()=>{c.beginPath();c.moveTo(-21,0);c.quadraticCurveTo(-6,-12,14,-6);c.quadraticCurveTo(24,-2.5,25,1);c.quadraticCurveTo(20,6,6,7.5);c.quadraticCurveTo(-10,7.5,-21,0);c.closePath()};
  body();c.fillStyle='#ff8a5c';c.fill();
  c.save();body();c.clip();c.fillStyle='#a9bcc5';c.fillRect(-24,-14,52,14.5);c.globalAlpha=.5;for(const[x,y]of[[-10,-5],[-4,-7],[2,-5],[8,-6],[-6,-2.5],[4,-2.5]])dot(c,x,y,.9,'#5c6f78');c.globalAlpha=1;c.restore();
  body();c.lineWidth=1.3;c.strokeStyle=INK;c.stroke();
  c.beginPath();c.moveTo(13,-5);c.quadraticCurveTo(10.5,0,13,5);c.lineWidth=1.2;c.stroke();
  dot(c,18.5,-1.8,1.5);
  c.restore();
  c.restore();
  lab();c.lineWidth=1.3;c.strokeStyle=INK;c.stroke();
  c.globalAlpha=.3;line(c,[[-R+4,top+7],[-R+4,bot]],2.4,'#fff');c.globalAlpha=1;
  // ふた。プルタブは右奥、顔は真ん中
  E(c,0,top,R,ry,'#e6ecef');c.beginPath();c.ellipse(0,top,R-4,ry-2,0,0,6.3);c.lineWidth=1.2;c.strokeStyle='#9aa7ae';c.stroke();
  E(c,15,top-2.5,4.5,1.8,null,0,1.3);dot(c,10.5,top-2,1.1,'#9aa7ae');
  dot(c,-7,top,2);dot(c,7,top,2);
  c.beginPath();c.arc(0,top+1.2,2.6,.3,PI-.3);c.lineWidth=1.6;c.strokeStyle=INK;c.stroke()},
bcroll(c,p){c.translate(0,-21);c.rotate(-(p.roll??p.t*7));
  E(c,0,0,21,21,'#20302a');E(c,0,0,17,17,'#fbf7ec',0,1.2);rice(c,-11,-6);rice(c,7,9);rice(c,-4,11);
  E(c,0,0,8.5,8.5,'#a5552c',0,1.4);line(c,[[-5,-3],[4,-5]],1.4,'#e2a075');line(c,[[-4,3],[5,1]],1.4,'#e2a075');
  E(c,7,-9,3.4,2.4,'#7cb35a',.4,1);dot(c,-7,6,1.7);dot(c,3,9,1.7)},
maple(c,p){c.translate(0,-Math.abs(p.sw)*3);legs(c,p,-11,11,-10,10);
  c.beginPath();c.moveTo(-28,-22);c.quadraticCurveTo(-24,-42,4,-40);c.quadraticCurveTo(30,-38,28,-20);c.quadraticCurveTo(0,-10,-28,-22);c.closePath();P(c,'#d9682e');
  c.globalAlpha=.55;line(c,[[-16,-34],[-6,-24]],3,'#ffcf7a');line(c,[[0,-36],[10,-25]],3,'#ffcf7a');c.globalAlpha=1;
  for(const x of[-14,0,14])line(c,[[x-4,-36],[x+4,-24]],2.2,'#6b2f14');
  mapleLeaf(c,6,-48,10,'#e3170a');
  dot(c,-18,-28,2);line(c,[[-24,-22],[-17,-21]],1.6)},
candy(c,p){c.translate(0,-Math.abs(p.sw)*6);legs(c,p,-7,7,-8,8);
  poly(c,[[-14,-26],[-28,-36],[-24,-26],[-28,-16]],'#ffe1c0',1.6);poly(c,[[14,-26],[28,-36],[24,-26],[28,-16]],'#ffe1c0',1.6);
  rr(c,-15,-36,30,20,8,'#e0662c');
  c.globalAlpha=.6;line(c,[[-9,-32],[-3,-20]],2.6,'#ffcf7a');line(c,[[3,-32],[9,-20]],2.6,'#ffcf7a');c.globalAlpha=1;
  dot(c,-7,-27,1.8);dot(c,3,-27,1.8);line(c,[[-4,-22],[0,-22]],1.5)},
steel(c,p){fish(c,p,{L:64,H:26,back:'#6f8796',belly:'#eef2f2',stripe:'#e07aa0',spots:'#33454f',
  after(c,L,H){c.beginPath();c.arc(-L*.34,-H*.06,H*.5,3.3,6.1);c.closePath();P(c,'#b9c6ce',2);line(c,[[-L*.34-H*.5,-H*.1],[-L*.34+H*.48,-H*.1]],2.6,'#8a99a2');
    for(let i=0;i<3;i++)dot(c,-L*.34-H*.3+i*H*.3,-H*.3,1.3,'#5c6a72');dot(c,-L*.36,-H*.02,2.3)}})},
cedar(c,p){const b=Math.sin(p.t*8)*2;
  c.globalAlpha=.7;for(let i=0;i<4;i++)E(c,30+i*8,-4-(i%2)*4,5,3,'#e9f7f4',0,0);c.globalAlpha=1;
  c.beginPath();c.moveTo(-40,-16+b);c.quadraticCurveTo(-44,-24+b,-36,-24+b);c.lineTo(34,-22+b);c.quadraticCurveTo(40,-18+b,34,-12+b);c.lineTo(-34,-10+b);c.closePath();P(c,'#b0683a');
  line(c,[[-28,-17+b],[24,-16+b]],1.2,'rgba(60,30,10,.55)');
  E(c,2,-30+b,25,9,'#f08a5c');for(const x of[-10,2,14])line(c,[[x-3,-37+b],[x+3,-24+b]],2,'#7a3a18');
  line(c,[[16,-38+b],[26,-44+b]],1.8,'#4f7a3a');dot(c,-15,-31+b,2);line(c,[[-22,-27+b],[-15,-26+b]],1.5)},
yking(c,p){fish(c,p,{L:110,H:46,y:52,back:'#4f6b62',belly:'#f6efe3',stripe:'#ff7a59',spots:'#1f322c',ws:6,wag:.12,
  after(c,L,H){c.globalAlpha=.4;line(c,[[-L*.1,-H*.36],[L*.2,-H*.3]],3,'#fff');c.globalAlpha=1;
    c.save();c.translate(-L*.31,-H*.55);c.rotate(-.14);poly(c,[[-13,4],[-16,-14],[-7,-5],[0,-17],[7,-5],[16,-14],[13,4]],'#ffd23b',2);mapleLeaf(c,0,-4,4,'#e3170a');c.restore()}})},
// キング・オブ・キングス。和柄とカエデのマントをはおったマスノスケが、キングサーモンそのものを槍にして構える
kok(c,p){fish(c,p,{L:136,H:56,y:64,back:'#5b7c8d',belly:'#f4efe6',stripe:'#ff8e6e',spots:'#21343f',ws:6,wag:.1,eye:3,
  after(c,L,H){const sw=Math.sin(p.t*3)*3,PI=Math.PI;
    // マント
    c.beginPath();c.moveTo(-L*.2,-H*.5);c.quadraticCurveTo(L*.05,-H*.78,L*.3,-H*.4);c.quadraticCurveTo(L*.5,-H*.1+sw,L*.56,H*.32+sw);c.quadraticCurveTo(L*.3,H*.05,L*.08,H*.12);c.quadraticCurveTo(-L*.08,-H*.06,-L*.2,-H*.5);c.closePath();P(c,'#c42a1c',2);
    c.save();c.clip();c.strokeStyle='rgba(255,210,59,.55)';c.lineWidth=1.4;for(let y=-H;y<H;y+=7)for(let x=-L*.3;x<L*.6;x+=12){c.beginPath();c.arc(x+((y/7)%2?6:0),y,5,PI,PI*2);c.stroke()}c.restore();
    mapleLeaf(c,L*.24,-H*.14,7,'#ffd23b');
    c.beginPath();c.moveTo(-L*.22,-H*.5);c.quadraticCurveTo(L*.05,-H*.84,L*.32,-H*.42);c.lineWidth=7;c.strokeStyle='#fbf8f0';c.lineCap='round';c.stroke();
    for(const t of[.15,.4,.65,.9]){const x=-L*.22+t*L*.54,y=-H*.5-Math.sin(t*3.14)*H*.24;dot(c,x,y,1.2)}
    // 王冠(マスノスケの赤い宝石と、キングサーモンのカエデ)
    c.save();c.translate(-L*.3,-H*.62);c.rotate(-.12);poly(c,[[-17,5],[-20,-16],[-9,-6],[0,-21],[9,-6],[20,-16],[17,5]],'#ffd23b',2.2);dot(c,-5,-1,2.6,'#e3170a');mapleLeaf(c,6,-1,3.6,'#e3170a');c.restore();
    // やる気のある太い眉。鼻先側を下げる
    const ex=-L*.36,ey=-H*.12;c.beginPath();c.moveTo(ex-10,ey-3);c.quadraticCurveTo(ex,ey-9,ex+10,ey-12);c.lineWidth=5.5;c.strokeStyle=INK;c.lineCap='round';c.stroke();
    // 槍になったキングサーモン
    c.save();c.translate(-L*.02,H*.74);c.rotate(.05);kingLance(c,L*1.15,15);c.restore();
    // 威厳のある髭。くるんと巻いた口ひげと、下へ伸びるあごひげ
    const mx=-L*.47,my=H*.13;
    c.beginPath();c.moveTo(mx-2,my+2);c.quadraticCurveTo(mx-6,my+12,mx-3,my+24);c.quadraticCurveTo(mx+1,my+19,mx+4,my+26);c.quadraticCurveTo(mx+8,my+18,mx+13,my+20);c.quadraticCurveTo(mx+10,my+10,mx+12,my+2);c.closePath();P(c,'#f2efe8',1.8);
    line(c,[[mx+2,my+8],[mx+1,my+18]],1.1,'#b9b3a6');line(c,[[mx+7,my+8],[mx+8,my+17]],1.1,'#b9b3a6');
    for(const sx of[-1,1]){c.beginPath();c.moveTo(mx+3,my);c.quadraticCurveTo(mx+3+sx*9,my+5,mx+3+sx*13,my-2);c.quadraticCurveTo(mx+3+sx*15,my-6,mx+3+sx*11,my-6);c.lineWidth=4;c.strokeStyle=INK;c.lineCap='round';c.stroke();c.lineWidth=2.2;c.strokeStyle='#f2efe8';c.stroke()}
    // 胸びれで槍をにぎる
    c.save();c.translate(-L*.14,H*.22);c.rotate(.75);poly(c,[[0,-4],[L*.17,0],[0,5]],'#5b7c8d');c.restore()}})},

dribble(c,p){DRAW.ashi(c,p);if(!(p.lunge>0)){c.save();c.translate(-34,0);c.scale(.62,.62);DRAW.onigiri(c,{...p,roll:(p.roll||0)*1.4});c.restore()}},
kohaku(c,p){fish(c,p,{L:62,H:27,back:'#f2efe6',belly:'#fff',fin:'#c9c3b4',
  paint(c,L,H){c.fillStyle='#df3a2b';c.fillRect(-L,-H*3,L,H*6)},
  after(c,L,H){line(c,[[0,-H*.62],[0,H*.62]],3,'#c8a33e');E(c,0,-H*.7,4,3,'#e3170a',0,1.2);E(c,0,H*.7,4,3,'#fff',0,1.2)}})},
mabushi(c,p){
  // 転がるたびに後ろへ飛び散るフレーク
  for(let i=0;i<9;i++){const a=(p.t*1.6+i/9)%1;c.globalAlpha=1-a;c.fillStyle='#ff8a5c';c.fillRect(12+a*30+(i*13)%9,-20-Math.sin(a*3.1)*30-(i%3)*4,4,2.4);c.globalAlpha=1}
  c.save();DRAW.onigiri(c,p);c.restore();
  c.save();c.translate(0,-20);c.rotate(-(p.roll??p.t*7));
  for(let i=0;i<16;i++){const q=i/16*6.2832;c.save();c.translate(Math.cos(q)*19,Math.sin(q)*16+1);c.rotate(q);c.fillStyle='#ff8a5c';c.fillRect(-2.6,-1.3,5.2,2.6);c.restore()}
  c.restore()},
};
// 魚でない仲間の、頭のてっぺん(x,y)と大きさ。鉢巻きとリボンをここに描く
const ACC_AT={ikura:[-1,-22,.62],nigiri:[-12,-43,.8],abari:[-12,-43,.8],oyako:[-3,-50,1],toba:[1,-63,.6],onigiri:[0,-19,.8],smoke:[-4,-45,.85],flake:[0,-51,.8],
  ishikari:[-1,-41,1],chanchan:[-16,-38,.8],can:[0,-43,.9],bcroll:[0,-19,.8],maple:[-10,-39,.8],candy:[-2,-35,.7],cedar:[-15,-33,.7]};
function accKnot(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);
  poly(c,[[0,0],[13,-9],[11,-2]],'#fff',1.6);poly(c,[[0,1],[12,7],[8,10]],'#fff',1.6);line(c,[[5,-4],[9,-5]],1.4,'#e3170a');E(c,0,0,4.2,4.2,'#fff',0,1.6);c.restore()}
function accBow(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.rotate(.25);
  poly(c,[[0,0],[-10,-8],[-11,6]],'#ff5c86',1.7);poly(c,[[0,0],[10,-8],[11,6]],'#ff5c86',1.7);
  dot(c,-7,-2,1.3,'#fff');dot(c,7,0,1.3,'#fff');dot(c,-5,3,1,'#fff');E(c,0,0,3.6,3.6,'#e3170a',0,1.7);c.restore()}
function accBand(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);
  rr(c,-15,-3.5,30,7,3.5,'#fff',1.8);for(let i=0;i<4;i++)line(c,[[-11+i*7.5,-3],[-8+i*7.5,3]],1.7,'#e3170a');c.restore();accKnot(c,x+15*s,y,s)}
function drawActor(c,id,p){(DRAW[id]||DRAW.shake)(c,p);const a=p.acc&&ACC_AT[id];if(a){if(p.acc===1)accBand(c,a[0],a[1]+3*a[2],a[2]);else accBow(c,a[0]+9*a[2],a[1],a[2])}}

function sign(c,txt,x,y,w,h,bg,fg,fs){rr(c,x-w/2,y-h/2,w,h,2,bg,2);c.fillStyle=fg;c.font=`${fs}px 'Dela Gothic One','Hiragino Sans',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(txt,x,y+1)}
// 遡上してきた鮭の群れ。体力が減ると数が減る
const SCHOOL=(()=>{const R=seeded(731),a=[];for(let i=0;i<38;i++)a.push({r:i,x:(R()-.5)*122,y:-8-R()*72,s:.58+R()*.5,p:R()*6.28,k:R()*3|0});return a.sort((p,q)=>p.y-q.y)})();
const SCHOOL_COL=['#8fa6b4','#a3b6c1','#7c94a3'];
function schoolFish(c,f,t){
  const x=f.x+Math.sin(t*1.3+f.p)*5,y=f.y+Math.sin(t*2.1+f.p*2)*2.6,w=Math.sin(t*9+f.p)*3;
  c.save();c.translate(x,y);c.scale(f.s,f.s);
  poly(c,[[14,-2],[27,-8+w],[23,0],[27,8+w],[14,2]],SCHOOL_COL[f.k],1.6);
  E(c,0,0,20,8,SCHOOL_COL[f.k],0,1.7);
  line(c,[[-13,2],[13,2]],2.2,'#ff9a78');
  dot(c,-13,-1.6,1.5);
  c.restore();
}
function drawSchool(c,t,g,ratio){
  c.save();c.translate(0,g);
  rr(c,-3,-108,6,106,1,'#5d4630',1.8);
  sign(c,'鮭の群れ',0,-112,74,22,'#fff','#17242c',12);
  E(c,0,-44,72,44,'rgba(10,52,66,.3)',0,0);
  const n=Math.max(4,Math.ceil(SCHOOL.length*Math.max(0,ratio)));
  for(const f of SCHOOL)if(f.r<n)schoolFish(c,f,t);
  c.restore();
}
const EBASE=[
(c,t)=>{ // トド岩
  c.beginPath();c.moveTo(-68,6);c.lineTo(-58,-52);c.lineTo(-30,-74);c.lineTo(-6,-118);c.lineTo(24,-96);c.lineTo(44,-58);c.lineTo(66,-30);c.lineTo(72,6);c.closePath();P(c,'#7c7f83');
  line(c,[[-20,-70],[-4,-40],[-16,-10]],1.6);line(c,[[28,-70],[20,-34]],1.6);
  line(c,[[-6,-118],[-6,-160]],3,'#5d4630');
  poly(c,[[-6,-160],[34+Math.sin(t*4)*3,-152],[-6,-136]],'#e3170a',2);
},
(c,t)=>{ // 番屋
  for(const x of[-46,44])line(c,[[x,-60],[x,6]],6,'#3a2a1d');
  rr(c,-60,-92,120,60,2,'#5b4331',2.4);
  poly(c,[[-72,-90],[0,-132],[72,-90]],'#3d4348',2.4);
  sign(c,'番屋',0,-66,62,22,'#fff','#17242c',14);
  for(let i=0;i<5;i++){const x=-52+i*26;line(c,[[x,-40],[x+13,-22],[x+26,-40]],1.3);E(c,x,-38,4.5,4.5,'#ff8a2e',0,1.5)}
},
(c,t)=>{ // 回転ずし
  rr(c,-66,-98,132,104,3,'#f2ece0',2.4);
  rr(c,-72,-124,144,28,2,'#d9331f',2.4);
  c.fillStyle='#fff';c.font="15px 'Dela Gothic One','Hiragino Sans',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('回転ずし',0,-109);
  rr(c,-52,-82,104,34,2,'#9fd3df',2);
  for(let i=0;i<4;i++){const x=-44+((t*30+i*28)%96);E(c,x,-54,8,2.8,'#fff',0,1.2);E(c,x,-57,5,2.6,'#ff8a5c',0,1)}
  rr(c,-16,-40,32,46,1,'#3d4a55',2);
},
(c,t)=>{ // 滝
  c.beginPath();c.moveTo(-80,6);c.lineTo(-74,-206);c.lineTo(70,-206);c.lineTo(84,6);c.closePath();P(c,'#4d5b52');
  c.save();c.beginPath();c.rect(-30,-206,78,212);c.clip();
  c.fillStyle='#d9f2f2';c.fillRect(-30,-206,78,212);
  c.strokeStyle='#8fd3d6';c.lineWidth=3;for(let i=0;i<8;i++){const x=-26+i*11;for(let k=0;k<4;k++){const y=-206+((t*200+i*37+k*60)%240);c.beginPath();c.moveTo(x,y);c.lineTo(x,y+26);c.stroke()}}
  c.restore();
  line(c,[[-30,-206],[-30,6]],2.4);line(c,[[48,-206],[48,6]],2.4);
},
(c,t)=>{ // 木彫り工房
  rr(c,-62,-92,124,98,2,'#a9744a',2.4);
  c.lineWidth=2;c.strokeStyle='rgba(23,36,44,.5)';for(let i=1;i<6;i++){c.beginPath();c.moveTo(-62,-92+i*16);c.lineTo(62,-92+i*16);c.stroke()}
  poly(c,[[-76,-88],[0,-140],[76,-88]],'#64442c',2.4);
  sign(c,'木彫り工房',0,-74,90,22,'#fff','#17242c',12);
  rr(c,-14,-40,28,46,1,'#3a2a1d',2);
  c.globalAlpha=.6;for(let i=0;i<3;i++){const o=(t*9+i*14)%40;E(c,36+i*3,-126-o,5+i,4+i,'#e8e8e4',0,0)}c.globalAlpha=1;
},
(c,t)=>{ // 魚車(フィッシュホイール)。かごが回って魚をすくう
  rr(c,-70,-12,140,14,2,'#7a5434',2.2);
  for(const x of[-48,48])line(c,[[x,-12],[x*.2,-104]],5,'#5b3d26');
  c.save();c.translate(0,-70);c.rotate(-t*.8);
  for(let i=0;i<4;i++){c.save();c.rotate(i*1.5708);line(c,[[0,0],[0,-62]],4,'#5b3d26');
    if(i%2){rr(c,-20,-74,40,22,3,'#c9a96b',2);c.strokeStyle='rgba(23,36,44,.55)';c.lineWidth=1;for(let k=1;k<5;k++){c.beginPath();c.moveTo(-20+k*8,-74);c.lineTo(-20+k*8,-52);c.stroke()}}
    else rr(c,-18,-70,36,14,2,'#9c7a50',2);c.restore()}
  E(c,0,0,8,8,'#3a2a1d');c.restore();
},
(c,t)=>{ // 丸太小屋
  for(let i=0;i<6;i++)rr(c,-62,-14-i*13,124,13,6,i%2?'#8a5a34':'#9c6a3e',1.8);
  poly(c,[[-74,-88],[0,-128],[74,-88]],'#4a5a3a',2.4);
  rr(c,-14,-48,28,48,1,'#3a2a1d',2);rr(c,26,-62,22,18,1,'#ffd98a',2);
  rr(c,34,-136,12,30,1,'#6f6f6f',2);c.globalAlpha=.6;for(let i=0;i<3;i++){const o=(t*9+i*14)%40;E(c,40+i*3,-142-o,5+i,4+i,'#e8e8e4',0,0)}c.globalAlpha=1;
},
(c,t)=>{ // 国境の関所
  for(const x of[-56,56])rr(c,x-6,-110,12,116,1,'#6b4a2c',2);
  rr(c,-64,-118,128,22,2,'#6b4a2c',2);sign(c,'国境',0,-107,70,18,'#fff','#17242c',13);
  line(c,[[-50,-60],[60,-48+Math.sin(t*2)*2]],6,INK);line(c,[[-50,-60],[60,-48+Math.sin(t*2)*2]],3.4,'#e3170a');
  line(c,[[40,-118],[40,-176]],3,'#5d4630');
  rr(c,40,-176,48,26,1,'#fff',2);c.fillStyle='#e3170a';c.fillRect(41,-175,11,24);c.fillRect(76,-175,11,24);mapleLeaf(c,64,-163,8,'#e3170a');
},
(c,t)=>{ // 外輪船
  c.beginPath();c.moveTo(-84,-30);c.lineTo(78,-30);c.lineTo(66,4);c.lineTo(-74,4);c.closePath();P(c,'#f4f1e8');
  rr(c,-62,-62,124,32,2,'#f4f1e8',2.2);rr(c,-40,-86,80,24,2,'#f4f1e8',2.2);
  for(let i=0;i<6;i++)rr(c,-54+i*20,-56,10,12,1,'#7fb7c9',1.4);
  rr(c,-6,-128,14,42,1,'#2b2b2b',2);rr(c,-9,-130,20,6,1,'#e3170a',1.6);
  c.globalAlpha=.6;for(let i=0;i<3;i++){const o=(t*12+i*14)%44;E(c,2+i*4,-136-o,6+i,5+i,'#d8dedd',0,0)}c.globalAlpha=1;
  c.save();c.translate(92,-22);c.rotate(-t*2);E(c,0,0,26,26,'#c0392b');for(let i=0;i<8;i++){c.save();c.rotate(i*.785);rr(c,-3,-26,6,26,1,'#7a1f16',1.2);c.restore()}E(c,0,0,6,6,'#2b2b2b');c.restore();
  sign(c,'KLONDIKE号',0,-16,84,16,'#24365c','#fff',10);
},
(c,t)=>{ // クマの岩穴
  c.beginPath();c.moveTo(-80,6);c.lineTo(-70,-70);c.lineTo(-30,-112);c.lineTo(20,-120);c.lineTo(62,-86);c.lineTo(82,6);c.closePath();P(c,'#7b7f80');
  c.beginPath();c.moveTo(-34,6);c.quadraticCurveTo(-34,-62,4,-62);c.quadraticCurveTo(40,-62,40,6);c.closePath();P(c,'#2a2622');
  dot(c,-6,-34,2.6,'#ffd23b');dot(c,12,-34,2.6,'#ffd23b');
  line(c,[[-58,-60],[-40,-30]],1.6);line(c,[[46,-80],[56,-40]],1.6);
  sign(c,'クマの巣',0,-136,70,20,'#fff','#17242c',12);
},
];
function drawEnemyBase(c,ch,t,g){c.save();c.translate(0,g);EBASE[ch](c,t);c.restore()}

// ボスに負けた時の場面。幅400×高さ210で描く
const still=t=>({t,sw:0,atk:0,roll:0});
function actorAt(c,id,x,y,s,p,sy=s){c.save();c.translate(x,y);c.scale(s,sy);drawActor(c,id,p);c.restore()}
function say(c,s,x,y,w,tx,ty,fs=14){
  c.beginPath();c.moveTo(tx-7,y+24);c.lineTo(ty&&tx,ty);c.lineTo(tx+7,y+24);c.closePath();P(c,'#fffdf4',2);
  rr(c,x,y,w,26,8,'#fffdf4',2);
  c.fillStyle='#fffdf4';c.fillRect(tx-5,y+22,10,3);
  c.fillStyle=INK;c.font=`${fs}px 'Yusei Magic','Hiragino Maru Gothic ProN',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(s,x+w/2,y+14);
}
function sweat(c,x,y,t,seed=0){const a=(t*1.4+seed)%1;c.globalAlpha=1-a;E(c,x+a*7,y+a*12,2.2,3.4,'#8fdcf0',.5,1);c.globalAlpha=1}
function sceneBack(c,top,bottom,y,ground){
  const g=c.createLinearGradient(0,0,0,y);g.addColorStop(0,top);g.addColorStop(1,bottom);c.fillStyle=g;c.fillRect(0,0,400,210);
  c.fillStyle=ground;c.fillRect(0,y,400,210-y);
}
const LOSE_SCENES={
// トド親分:鮭たちが座布団に
todo(c,t){
  sceneBack(c,'#ffcf9c','#ff9d7c',150,'#2a8ea3');
  c.beginPath();c.moveTo(62,210);c.lineTo(92,176);c.lineTo(310,172);c.lineTo(350,210);c.closePath();P(c,'#7c7f83');
  for(const[x,o]of[[118,0],[176,1],[234,2],[290,3]])actorAt(c,'shake',x,197+Math.sin(t*3+o)*1,1.15,{...still(t),t:t+o},.46);
  actorAt(c,'todo',200,170+Math.sin(t*1.7)*1.6,.6,still(0));
  for(let i=0;i<3;i++){const a=(t*.45+i/3)%1;c.globalAlpha=1-a;c.fillStyle='#fffdf4';c.font=`${13+a*12}px 'Dela Gothic One',sans-serif`;c.textAlign='center';c.fillText('Z',118-a*24+i*6,86-a*52);c.globalAlpha=1}
  say(c,'ぐえっ',18,136,62,62,176);
  sweat(c,104,168,t);sweat(c,300,168,t,.5);
},
// 網元:まとめて網の中
amimoto(c,t){
  sceneBack(c,'#bfe4ec','#e8f3df',148,'#1f7f95');
  c.fillStyle='#6a4b2d';c.fillRect(0,176,400,34);line(c,[[0,176],[400,176]],2.4);
  line(c,[[34,176],[34,12],[142,12]],6,INK);line(c,[[34,176],[34,12],[142,12]],3,'#8d6a42');
  c.save();c.translate(142,12);c.rotate(Math.sin(t*1.8)*.05);
  line(c,[[0,0],[0,26]],3);
  const bag=()=>{c.beginPath();c.ellipse(0,92,72,64,0,0,6.2832)};
  bag();c.fillStyle='rgba(31,127,149,.3)';c.fill();
  c.save();bag();c.clip();
  for(const[id,x,y,r,s,o]of[['shake',-30,106,.4,.72,0],['shake',28,98,-.5,.72,1],['ikura',-6,146,0,.72,2],['shake',0,132,.15,.66,3],['ikura',38,146,0,.62,4],['ikura',-40,142,0,.6,5]]){
    c.save();c.translate(x,y+Math.sin(t*5+o)*1.5);c.rotate(r+Math.sin(t*4+o)*.07);c.scale(s,s);drawActor(c,id,{...still(t+o),sw:0});c.restore()}
  c.lineWidth=1.5;c.strokeStyle='rgba(255,255,255,.8)';
  for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(i*19-120,0);c.lineTo(i*19+120,190);c.moveTo(i*19+120,0);c.lineTo(i*19-120,190);c.stroke()}
  c.restore();
  bag();P(c,null,2.6);rr(c,-10,23,20,9,3,'#c8a33e',1.8);
  c.restore();
  actorAt(c,'amimoto',322,177,.74,still(t));
  say(c,'大漁じゃ!',232,16,104,300,56);
},
// 回転ずしの大将:お皿の上へ
taisho(c,t){
  c.fillStyle='#f2ece0';c.fillRect(0,0,400,210);
  c.fillStyle='#d9331f';c.fillRect(0,0,400,14);line(c,[[0,14],[400,14]],2.4);
  actorAt(c,'taisho',326,160,.62,still(t));
  rr(c,16,26,142,32,3,'#ffe63b',2.4);c.fillStyle='#e3170a';c.font="15px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('本日のおすすめ',87,43);
  c.fillStyle='#8a5a34';c.fillRect(0,160,400,50);line(c,[[0,160],[400,160]],2.4);
  c.fillStyle='#494350';c.fillRect(0,144,400,20);line(c,[[0,144],[400,144]],2);line(c,[[0,164],[400,164]],2);
  for(let i=0;i<4;i++){
    const x=450-((t*26+i*135)%540);
    E(c,x,154,50,10,'#fff',0,2.2);
    rr(c,x-30,124,60,26,10,'#fbf7ec',2);
    actorAt(c,'shake',x-1,158,.92,still(t+i));
    sweat(c,x-34,106,t,i*.3);
  }
  say(c,'へい、おまち!',196,44,120,300,92);
},
// 滝のヌシ:おなかの中
nushi(c,t){
  sceneBack(c,'#7fc2bf','#d6ecd2',170,'#6f9a62');
  for(const x of[28,364])poly(c,[[x-24,172],[x,92],[x+24,172]],'#2f6650',2);
  line(c,[[0,170],[400,170]],2);
  actorAt(c,'nushi',252,184,.82,still(0));
  c.save();c.translate(177,101);c.rotate(Math.sin(t*7)*.28+.12);poly(c,[[3,-5],[-16,-14],[-11,0],[-16,14],[3,5]],'#8fa6b4',2);c.restore();
  const bx=268,by=124;
  E(c,bx,by,38,30,'#201512',0,2.4);
  c.save();c.beginPath();c.ellipse(bx,by,36,28,0,0,6.2832);c.clip();
  actorAt(c,'shake',bx+Math.sin(t*2)*4,by+18,.62,still(t));
  c.restore();
  say(c,'ごちそうさま',28,50,112,128,92);
  say(c,'まっくらだよー',286,48,108,300,92,13);
  c.globalAlpha=.55+.45*Math.sin(t*3);c.fillStyle='#fffdf4';c.strokeStyle=INK;c.lineWidth=3;c.lineJoin='round';c.font="15px 'Dela Gothic One',sans-serif";c.textAlign='center';c.strokeText('ケプッ',122,132);c.fillText('ケプッ',122,132);c.globalAlpha=1;
},
// 木彫りの大グマ:くわえられたまま、おみやげに
kibori(c,t){
  c.fillStyle='#efe3cf';c.fillRect(0,0,400,210);
  c.strokeStyle='rgba(120,80,40,.18)';c.lineWidth=2;for(let i=1;i<7;i++){c.beginPath();c.moveTo(0,i*30);c.lineTo(400,i*30);c.stroke()}
  rr(c,16,14,122,28,2,'#fff',2.2);c.fillStyle=INK;c.font="14px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('川のおみやげ',77,29);
  c.fillStyle='#8d5e34';c.fillRect(0,176,400,34);line(c,[[0,176],[400,176]],2.4);
  actorAt(c,'kibori',206,176,.74,still(0));
  c.save();c.translate(322,118);c.rotate(Math.sin(t*1.6)*.05);
  line(c,[[0,-26],[-22,-58]],1.6);rr(c,-30,-26,64,30,3,'#ffe63b',2.2);
  c.fillStyle='#e3170a';c.font="14px 'Yusei Magic',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('3,980円',2,-10);c.restore();
  say(c,'…うごけない',22,60,100,102,110);
},
};
// ひな。口をぱくぱくさせて待っている
function chick(c,x,y,t,o,dir=1){
  const b=Math.sin(t*7+o),open=4+Math.abs(b)*7;
  c.save();c.translate(x,y+b*2);c.scale(dir,1);
  E(c,0,6,17,18,'#f4d35e',0,2);
  poly(c,[[-9,-9],[-6,-20],[-1,-10]],'#f4d35e',1.6);
  E(c,0,-12,13,13,'#f4d35e',0,2);
  poly(c,[[-9,-13],[-26,-15-open],[-11,-9]],'#ff9a2e',1.8);
  poly(c,[[-9,-9],[-25,-7+open],[-11,-7]],'#ff9a2e',1.8);
  poly(c,[[-10,-12],[-22,-13-open*.5],[-22,-9+open*.5],[-10,-9]],'#e3372a',0);
  dot(c,-3,-16,2.1);
  c.restore();
}
// 親鳥に運ばれて、ひなの待つ巣へ
function nest(c,t,bird,s){
  sceneBack(c,'#a9d3ee','#e0eef2',210,'#e0eef2');
  c.beginPath();c.moveTo(0,210);c.lineTo(0,120);c.lineTo(66,146);c.lineTo(120,176);c.lineTo(300,182);c.lineTo(400,150);c.lineTo(400,210);c.closePath();P(c,'#8e8778');
  E(c,190,158,118,26,'#6e4c33',0,2.4);
  actorAt(c,'shake',192,160,1.05,still(t));
  chick(c,104,126,t,0,-1);chick(c,290,128,t,1.7);chick(c,252,116,t,3.1);
  sweat(c,160,112,t);sweat(c,220,108,t,.5);
  c.beginPath();c.moveTo(66,150);c.quadraticCurveTo(190,206,316,150);c.quadraticCurveTo(310,196,190,198);c.quadraticCurveTo(72,196,66,150);c.closePath();P(c,'#8a6248',2.4);
  c.lineWidth=2;c.strokeStyle='#5a3d29';c.lineCap='round';for(let i=0;i<11;i++){const x=88+i*21;c.beginPath();c.moveTo(x-9,172+(i%3)*5);c.lineTo(x+10,167+((i+1)%3)*6);c.stroke()}
  actorAt(c,bird,346,92,s,still(t));
  say(c,'ごはんー!',16,44,88,84,86);
  say(c,'ごはんじゃないよ!',118,14,146,196,56,13);
}
function table(c,y){
  for(let i=0;i<9;i++){c.fillStyle=i%2?'#fff':'#e8574a';c.fillRect(40+i*36,y,36,30)}
  c.lineWidth=2.2;c.strokeStyle=INK;c.strokeRect(40,y,324,30);
}
// クマのピクニック
function picnic(c,t,bear,s){
  sceneBack(c,'#a9d3ee','#d6ecd2',150,'#6f9a62');
  poly(c,[[350,150],[376,70],[400,150]],'#2f6650',2);poly(c,[[8,150],[34,84],[60,150]],'#2f6650',2);
  actorAt(c,bear,288,166,s,{...still(0),atk:.1});
  table(c,160);
  E(c,142,162,66,11,'#fff',0,2.2);
  actorAt(c,'shake',142,178,1,still(t));
  sweat(c,100,126,t);
  say(c,'いただきまーす',196,26,118,276,66);
}
Object.assign(LOSE_SCENES,{
kamome(c,t){nest(c,t,'kamome',1)},
karasu(c,t){nest(c,t,'karasu',1)},
washi(c,t){nest(c,t,'washi',.72)},
konguma(c,t){picnic(c,t,'konguma',1.4)},
higuma(c,t){picnic(c,t,'higuma',.8)},
// ミンクの巣穴
mink(c,t){
  c.fillStyle='#7a5a3e';c.fillRect(0,0,400,210);
  c.fillStyle='#6f9a62';c.fillRect(0,0,400,24);line(c,[[0,24],[400,24]],2.4);
  E(c,200,120,186,76,'#3a2a22',0,2.4);
  line(c,[[40,128],[300,128]],4,'#8d6a42');
  [58,134,210].forEach((x,i)=>{actorAt(c,i===1?'shake':'gin',x+Math.sin(t*2+i)*1,128,.78,still(t+i));sweat(c,x+26,74,t,i*.3)});
  rr(c,104,142,120,26,2,'#fff',2);c.fillStyle=INK;c.font="13px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('冬のたくわえ',164,156);
  actorAt(c,'mink',326,186,1.05,{...still(t),sw:Math.sin(t*3)});
  say(c,'きれいにならんだ',232,44,130,316,82,13);
},
// アザラシの鼻の上
azarashi(c,t){
  sceneBack(c,'#bfe4ec','#e8f3df',150,'#1f7f95');
  c.beginPath();c.moveTo(120,210);c.lineTo(150,172);c.lineTo(350,170);c.lineTo(380,210);c.closePath();P(c,'#7c7f83');
  actorAt(c,'azarashi',256,176,1.1,still(t));
  const y=86-Math.abs(Math.sin(t*3))*16;
  c.save();c.translate(214,y);c.rotate(t*5);c.translate(0,32);drawActor(c,'shake',still(t));c.restore();
  for(let i=0;i<3;i++){const a=(t*1.3+i*.33)%1;c.globalAlpha=1-a;c.lineWidth=2;c.strokeStyle='#fffdf4';c.beginPath();c.arc(214,y,26+a*12,i*2.1+t*3,i*2.1+t*3+1);c.stroke();c.globalAlpha=1}
  say(c,'めがまわるー',32,44,104,120,86);
},
// モクズガニのハサミ
kani(c,t){
  sceneBack(c,'#2a8ea3','#176477',176,'#7a6a56');
  actorAt(c,'shake',162+Math.sin(t*12)*1.5,188,1.45,still(t));
  actorAt(c,'kani',282,194,2.1,{...still(t),atk:.1});
  for(let i=0;i<2;i++){const a=(t*1.7+i*.5)%1;c.globalAlpha=1-a;c.fillStyle='#ffe63b';c.font="18px 'Dela Gothic One',sans-serif";c.textAlign='center';c.fillText('!',196+i*20,104-a*26);c.globalAlpha=1}
  say(c,'いたたた!',26,32,94,98,74);
},
// 小さなウグイの通せんぼ
ugui(c,t){
  sceneBack(c,'#2a8ea3','#176477',176,'#7a6a56');
  for(const[x,y,o]of[[58,120,0],[60,168,1],[116,96,2],[118,144,3],[120,190,4],[176,120,5],[178,168,6]]){c.save();c.translate(x,y+Math.sin(t*3+o)*2);c.scale(-.9,.9);drawActor(c,'ugui',still(t+o));c.restore()}
  actorAt(c,'shake',312,176,1.3,still(t));
  actorAt(c,'ikura',248,190,.6,still(t));
  sweat(c,262,112,t);
  say(c,'ここは通さないよ',22,18,132,110,58,13);
  say(c,'えー…',284,60,62,308,98);
},
// 釣り人との記念写真
tsuribito(c,t){
  sceneBack(c,'#a9d3ee','#e0eef2',160,'#6f9a62');
  c.fillStyle='#2a8ea3';c.fillRect(0,132,400,28);
  actorAt(c,'tsuribito',292,188,1.05,still(0));
  line(c,[[244,104],[244,116]],1.6,'#f7f7f2');
  c.save();c.translate(244,118);c.rotate(Math.sin(t*2.4)*.08-1.5708);c.scale(.95,.95);c.translate(0,32);drawActor(c,'shake',still(t));c.restore();
  const f=(t*.6)%1;if(f<.12){c.fillStyle=`rgba(255,255,255,${.85*(1-f/.12)})`;c.fillRect(0,0,400,210)}
  c.lineWidth=4;c.strokeStyle='#fffdf4';for(const[x,y,a,b]of[[12,12,1,1],[388,12,-1,1],[12,198,1,-1],[388,198,-1,-1]]){c.beginPath();c.moveTo(x+a*26,y);c.lineTo(x,y);c.lineTo(x,y+b*26);c.stroke()}
  c.fillStyle='#fffdf4';c.strokeStyle=INK;c.lineWidth=3;c.lineJoin='round';c.font="15px 'Dela Gothic One',sans-serif";c.textAlign='center';c.strokeText('カシャッ',86,44);c.fillText('カシャッ',86,44);
  say(c,'今日の大物!',44,72,104,132,110);
},
// 漁師の箱づめ
ryoshi(c,t){
  sceneBack(c,'#bfe4ec','#e8f3df',148,'#1f7f95');
  c.fillStyle='#6a4b2d';c.fillRect(0,176,400,34);line(c,[[0,176],[400,176]],2.4);
  [84,146,208].forEach((x,i)=>{c.save();c.translate(x,112+Math.sin(t*2+i)*1.5);c.rotate(1.5708);c.scale(.82,.82);c.translate(0,32);drawActor(c,'shake',still(t+i));c.restore();sweat(c,x+18,76,t,i*.3)});
  for(let i=0;i<8;i++)rr(c,54+i*24,112+(i%2)*5,20,16,3,'#d9f2f2',1.6);
  rr(c,44,122,216,58,3,'#f7f7f2',2.6);
  rr(c,104,136,96,30,2,'#e3170a',2);c.fillStyle='#fff';c.font="18px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('特選',152,152);
  actorAt(c,'ryoshi',332,178,1.1,still(0));
  say(c,'つめたーい',32,20,92,104,60);
},
// 板前の塩
itamae(c,t){
  c.fillStyle='#f2ece0';c.fillRect(0,0,400,210);
  c.fillStyle='#d9331f';c.fillRect(0,0,400,12);line(c,[[0,12],[400,12]],2.4);
  actorAt(c,'itamae',322,160,1,still(0));
  c.fillStyle='#8a5a34';c.fillRect(0,160,400,50);line(c,[[0,160],[400,160]],2.4);
  rr(c,52,146,212,18,3,'#e5c79a',2.2);
  actorAt(c,'shake',156,172,1.3,still(t));
  c.save();c.translate(214,62);c.rotate(.7+Math.sin(t*9)*.09);rr(c,-12,-18,24,34,3,'#fffdf4',2.2);c.fillStyle='#e3170a';c.font="12px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('塩',0,0);c.restore();
  c.fillStyle='#fff';c.strokeStyle='rgba(23,36,44,.45)';c.lineWidth=.8;
  for(let i=0;i<14;i++){const a=(t*1.4+i*.17)%1,x=198-a*60+Math.sin(i*2.4)*16,y=78+a*62;c.fillRect(x,y,3,3);c.strokeRect(x,y,3,3)}
  say(c,'しょっぱい!',24,34,102,92,76);
},
});
function drawLoseScene(c,id,t){c.save();LOSE_SCENES[id](c,t);c.restore()}

// 鮭の守護神。雲に乗った金の鮭。kindは0並 1上 2特上
function drawGuardian(c,t,kind){
  c.save();c.rotate(t*.35);
  for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.fillStyle=kind===2?`hsla(${i*30+t*140},95%,72%,.6)`:'rgba(255,238,140,.55)';c.beginPath();c.moveTo(0,0);c.lineTo(-16,-170);c.lineTo(16,-170);c.closePath();c.fill()}
  c.restore();
  c.beginPath();c.ellipse(0,-8,92,92,0,0,6.2832);c.lineWidth=7;c.strokeStyle=kind===2?`hsl(${t*140%360},95%,70%)`:'#ffe66b';c.stroke();
  for(const[x,y,r]of[[-96,70,26],[-58,80,32],[-14,84,34],[32,82,32],[76,76,28],[108,66,20]])E(c,x,y+Math.sin(t*2+x)*2,r,r*.62,'#fffdf4',0,2);
  c.save();c.scale(2,2);
  fish(c,{t},{L:96,H:38,y:0,back:kind===2?'#ff7a3d':'#f2b632',belly:'#fff4c8',fin:'#ff8a5c',stripe:'#ffd84d',ws:3,wag:.1,eye:3.2,brow:-2,
    after(c,L,H){
      for(const[x,y,r]of[[-.44,.42,.07],[-.36,.52,.08],[-.28,.44,.07]])E(c,L*x,H*y,L*r,L*r*.8,'#fffdf4',0,1.4);
      if(kind>=1)for(let i=0;i<5;i++){E(c,-L*.34+i*6.5,-H*.62-(i%2)*3,3.6,3.6,'#f0431f',0,1.1);dot(c,-L*.34+i*6.5-1,-H*.62-(i%2)*3-1,.8,'#ffd3c2')}
    }});
  c.restore();
}

// エンディング。高さ360、幅Wの画面に描く。産卵→ふ化→川くだり→海の順
const ED={W:640,lap:0};
const esm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const efade=(t,a,b,f=.6)=>Math.max(0,Math.min(1,(t-a)/f,(b-t)/f));
const hz=i=>{const s=Math.sin(i*127.1)*43758.5453;return s-Math.floor(s)};
function hexMix(a,b,k){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')}
function ecap(c,s,y,a,fs=22){
  if(a<=0)return;fs=Math.min(fs,(ED.W-32)/s.length);
  c.save();c.globalAlpha=a;c.font=`${fs}px 'Yusei Magic','Hiragino Maru Gothic ProN',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
  c.lineWidth=5;c.strokeStyle=INK;c.strokeText(s,ED.W/2,y);c.fillStyle='#fffdf4';c.fillText(s,ED.W/2,y);c.restore();
}
// 吹き出し。しっぽの先(tx,ty)が箱より下でも上でもよい
function ebub(c,s,cx,y,tx,ty,a=1,fs=14){
  if(a<=0)return;
  const w=s.length*fs+20,x=Math.max(6,Math.min(ED.W-w-6,cx-w/2)),bx=Math.max(x+14,Math.min(x+w-14,tx)),down=ty>y+13,by=down?y+24:y+2;
  c.save();c.globalAlpha=a;
  c.beginPath();c.moveTo(bx-7,by);c.lineTo(tx,ty);c.lineTo(bx+7,by);c.closePath();P(c,'#fffdf4',2);
  rr(c,x,y,w,26,8,'#fffdf4',2);c.fillStyle='#fffdf4';c.fillRect(bx-5,down?y+22:y+1,10,3);
  c.fillStyle=INK;c.font=`${fs}px 'Yusei Magic','Hiragino Maru Gothic ProN',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(s,x+w/2,y+14);
  c.restore();
}
function eword(c,s,x,y,a,fs=15,col='#fffdf4'){
  if(a<=0)return;c.save();c.globalAlpha=a;c.font=`${fs}px 'Dela Gothic One',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
  c.lineWidth=3;c.strokeStyle=INK;c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);c.restore();
}
// 鮭の子ども。右を向いて泳ぐ。yolkはおなかの栄養の袋
function efry(c,x,y,t,s=1,yolk=0){
  c.save();c.translate(x,y);c.scale(-s,s);
  if(yolk>0)E(c,-2,6,9*yolk,6*yolk,'#ffa94d',0,1.6);
  fish(c,{t},{L:30,H:12,y:0,back:'#a7b58f',belly:'#f6f1e2',wag:.35,ws:14,eye:2.7,
    paint(c,L){c.fillStyle='rgba(74,92,64,.5)';for(let i=0;i<5;i++){c.beginPath();c.ellipse(-L*.22+i*L*.13,-1,2.2,3.8,0,0,6.3);c.fill()}}});
  c.restore();
}
function eegg(c,x,y,r,eyes,wob,t){
  c.save();c.translate(x,y);c.rotate(Math.sin(t*22)*wob*.3);
  E(c,0,0,r,r,'#ff8a3d',0,1.8);E(c,-r*.35,-r*.38,r*.3,r*.2,'#ffd9b8',-.6,0);
  if(eyes>0){c.globalAlpha=eyes;dot(c,-r*.28,r*.08,r*.15);dot(c,r*.28,r*.08,r*.15);c.globalAlpha=1}
  c.restore();
}
function echef(c,p,big){person(c,p,{pants:'#3d4a55',top:'#f7f7f2',
  detail(c){line(c,[[0,-56],[7,-40]],2);rr(c,-13,-34,26,5,1,'#2b4c8c',1.4)},
  head(c){rr(c,-11,-84,22,13,4,'#f7f7f2');if(big){line(c,[[-10,-61],[-3,-59]],3.4);line(c,[[3,-59],[10,-61]],3.4)}},
  hand(c){line(c,[[-14,10],[-15,-26]],2.4,'#8d6a42');poly(c,[[-15,-26],[-40,-21],[-15,-12]],'#e3170a',1.6)}})}
function eact(c,id,x,y,s,p,flip){c.save();c.translate(x,y);c.scale(flip?-s:s,s);drawActor(c,id,p);c.restore()}
const EGGS=(()=>{const R=seeded(2611),a=[];for(let i=0;i<14;i++)a.push({x:(R()-.5)*92,y:(R()-.5)*12});return a})();
const FRY=(()=>{const R=seeded(5303),a=[];for(let i=0;i<10;i++)a.push({x:(R()-.5)*150,y:(R()-.5)*62,p:R()*6.28});return a})();

function edSpawn(c,t){
  const W=ED.W,cx=W/2;
  let g=c.createLinearGradient(0,0,0,112);g.addColorStop(0,'#f5d9b8');g.addColorStop(1,'#e8a68a');c.fillStyle=g;c.fillRect(0,0,W,112);
  c.fillStyle='#8b5a55';c.beginPath();c.moveTo(0,112);for(let x=0;x<=W+30;x+=30)c.lineTo(x,72-Math.sin(x*.013)*20-Math.abs(Math.sin(x*.041))*12);c.lineTo(W+30,112);c.closePath();c.fill();
  c.fillStyle='#6f9a62';c.fillRect(0,98,W,16);line(c,[[0,98],[W,98]],2);
  const cols=['#d9402a','#e8842e','#e9b53a'];
  for(let x=30,k=0;x<W;x+=140,k++){line(c,[[x,104],[x,62]],5,'#4c3425');for(let i=0;i<5;i++)E(c,x+Math.sin(i*2.3+k)*18,50-Math.cos(i*1.9+k)*12,14+(i%3)*3,13,cols[(i+k)%3],0,1.8)}
  for(let i=0;i<9;i++){const y=(t*22+i*61)%100,x=(i*113)%W+Math.sin(t*1.3+i)*14;c.save();c.translate(x,y);c.rotate(t*2+i);E(c,0,0,5,3,cols[i%3],0,1.2);c.restore()}
  g=c.createLinearGradient(0,112,0,300);g.addColorStop(0,'#49b6c0');g.addColorStop(1,'#1e7788');c.fillStyle=g;c.fillRect(0,112,W,190);
  c.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<4;i++){const x=W*(.1+i*.25)+Math.sin(t*.6+i)*16;c.beginPath();c.moveTo(x,112);c.lineTo(x+34,112);c.lineTo(x+90,300);c.lineTo(x+40,300);c.closePath();c.fill()}
  c.fillStyle='#6b5a4a';c.fillRect(0,298,W,62);line(c,[[0,298],[W,298]],2);
  const pc=['#9c8d7a','#857766','#b3a692','#6f6355'];
  for(let i=0;i<W/9;i++){const r=2.5+hz(i+.7)*4;E(c,i*9+hz(i)*6,306+hz(i+.3)*50,r*1.5,r,pc[hz(i+.9)*4|0],0,r>5?1.2:0)}
  E(c,cx+10,302,64,9,'#5a4a3c',0,0);
  EGGS.forEach((e,i)=>{const s=esm((t-6-i*.16)/.25);if(s>0)eegg(c,cx+10+e.x,300+e.y,6*s,0,0,t)});
  // 掘ると砂がまう
  if(t>4.2&&t<7)for(let k=0;k<8;k++){const a=((t-4.2)*1.3+k/8)%1;c.globalAlpha=(1-a)*.55*efade(t,4.2,7,.4);E(c,cx+40+Math.sin(k*2.1)*34,292-a*44,6+a*10,5+a*8,'#c9b9a0',0,0);c.globalAlpha=1}
  const k=esm(t/4.2),dig=efade(t,4.4,6.6,.4),near=esm((t-9.5)/1.5)*10;
  c.save();c.translate(W+160-(W+160-(cx+44))*k,272+Math.sin(t*1.5)*3);c.rotate(.22*dig);c.scale(.95,.95);drawActor(c,'shake',still(t*(1+dig*2)));c.restore();
  actorAt(c,'hanamagari',W+80-(W+80-(cx-50))*k+near,272+Math.sin(t*1.5+1)*3,1,still(t));
  for(let i=0;i<6;i++){const a=(t*.5+i/6)%1;c.globalAlpha=(1-a)*.7;E(c,cx-40+i*18+Math.sin(t*2+i)*4,230-a*110,2+i%3,2+i%3,'rgba(255,255,255,.5)',0,1);c.globalAlpha=1}
  ecap(c,'268km。生まれた川に、帰ってきた。',336,efade(t,.6,5.2));
  ecap(c,'川底に、たくさんの卵を産んだ。',336,efade(t,5.8,9.6));
  ecap(c,'あとは、川にまかせよう。',336,efade(t,10.2,13.6));
}
function edHatch(c,u){
  const W=ED.W,cx=W/2,win=1-esm((u-4.6)/1.6);
  let g=c.createLinearGradient(0,0,0,110);g.addColorStop(0,hexMix('#bfe6f0','#cfd9e2',win));g.addColorStop(1,hexMix('#eef6d8','#eef3f6',win));c.fillStyle=g;c.fillRect(0,0,W,110);
  c.fillStyle=hexMix('#7fb36a','#f4f7f9',win);c.fillRect(0,92,W,18);line(c,[[0,92],[W,92]],2);
  if(win<1)for(let x=40,i=0;x<W;x+=120,i++)for(let k=0;k<3;k++)E(c,x+k*9,94-((i+k)%2)*3,4*(1-win),3*(1-win),['#f6b6c8','#fff27a','#ffd1dc'][(i+k)%3],0,1.2);
  g=c.createLinearGradient(0,110,0,300);g.addColorStop(0,hexMix('#5cc3c9','#2c5f78',win));g.addColorStop(1,hexMix('#2a8ea3','#163a4c',win));c.fillStyle=g;c.fillRect(0,110,W,192);
  if(win>0){c.globalAlpha=win*.9;rr(c,-4,104,W+8,14,3,'#e6f3f8',2);c.globalAlpha=1;
    for(let i=0;i<46;i++){c.globalAlpha=win;dot(c,(i*71.3)%W+Math.sin(u+i)*10,(u*30+i*37)%106,1.6+i%2,'#fff');c.globalAlpha=1}}
  else{c.fillStyle='rgba(255,255,255,.1)';for(let i=0;i<4;i++){const x=W*(.1+i*.25)+Math.sin(u*.6+i)*16;c.beginPath();c.moveTo(x,110);c.lineTo(x+34,110);c.lineTo(x+90,300);c.lineTo(x+40,300);c.closePath();c.fill()}}
  c.fillStyle='#6b5a4a';c.fillRect(0,298,W,62);line(c,[[0,298],[W,298]],2);
  const pc=['#9c8d7a','#857766','#b3a692','#6f6355'];
  for(let i=0;i<W/14;i++){const r=4+hz(i+.7)*6;E(c,i*14+hz(i)*8,312+hz(i+.3)*44,r*1.5,r,pc[hz(i+.9)*4|0],0,1.2)}
  EGGS.slice(0,12).forEach((e,i)=>{
    const ex=cx+e.x*2.6,ey=286+e.y*1.4,h=7+i*.13;
    if(u<h){eegg(c,ex,ey,13,esm((u-2.5)/1.5),u>6?Math.min(1,u-6):0,u);return}
    const a=(u-h)/.6;
    if(a<1){c.save();c.globalAlpha=1-a;for(const s of[-1,1]){c.save();c.translate(ex+s*a*14,ey+a*6);c.rotate(s*a*.8);c.beginPath();c.arc(0,0,13,s<0?1.5708:-1.5708,s<0?4.7124:1.5708);c.closePath();P(c,'#ffc49a',1.6);c.restore()}c.restore()}
    const rise=esm((u-9.2-i*.05)/2.4),tx=cx-90+(i%6)*36,ty=196+(i>>1)%3*20;
    efry(c,ex+(tx-ex)*rise+Math.sin(u*2+i)*5*rise,ey+(ty-ey)*rise-(1-rise)*3,u*1.7+i,1.1,1-esm((u-9.6)/2));
    if(i%3===0)eword(c,'ぴちっ',ex,ey-24-a*10,1-Math.min(1,a/1.2),13);
  });
  ecap(c,'冬がきて、',336,efade(u,.6,4.4));
  ecap(c,'春がきた。',336,efade(u,5.2,8.3));
  ecap(c,'ちいさな子どもたちが、生まれた。',40,efade(u,8.7,11.8));
}

// 川くだり。上流から順に、源流・大滝・町・定置網・河口
const ED_SEG=760,ED_LEN=ED_SEG*5,ED_BANK=178,ED_SURF=196,ED_BED=324;
const ED_PAL=[
{sky:['#bfe6f0','#f3f0d0'],mtn:'#7aa36a',water:['#49b6c0','#1e7788'],bed:'#6b5a4a',bank:'#7fb36a'},
{sky:['#9fd8d0','#e2f2d8'],mtn:'#3f7560',water:['#2aa3a0','#10625f'],bed:'#555b4f',bank:'#6f9a62'},
{sky:['#a9d3ee','#e0eef2'],mtn:'#94a9b5',water:['#4a8f8c','#2c6263'],bed:'#6f6858',bank:'#b7b0a0'},
{sky:['#bfe4ec','#e8f3df'],mtn:'#7fa39f',water:['#1f7f95','#115367'],bed:'#6a6355',bank:'#6f9a62'},
{sky:['#ffd6a6','#ffb38a'],mtn:'#7d6f8c',water:['#2a8ea3','#176477'],bed:'#7a6a56',bank:'#d8c697'},
];
// 見せ場では川の流れをゆるめる
const ED_SLOW=[[1000,.35,180],[1320,.74,240],[1740,.4,200],[2060,.4,200],[2600,.45,240],[3320,.45,300]];
const ED_CAM=(()=>{const a=[0];let x=0;while(x<ED_LEN){let v=120;for(const[s,k,w]of ED_SLOW)v*=1-k*Math.exp(-(((x+300-s)/w)**2));x+=v/30;a.push(Math.min(x,ED_LEN))}return a})();
const ED_RIVER=(ED_CAM.length-1)/30;
function camAt(u){const i=Math.max(0,u*30),j=Math.floor(i);if(j>=ED_CAM.length-1)return ED_LEN;return ED_CAM[j]+(ED_CAM[j+1]-ED_CAM[j])*(i-j)}
// その場所が子どもたちの真上に来る時刻
function crossAt(wx,fx){const x=wx-fx;if(x<=0)return x/120;let lo=0,hi=ED_CAM.length-1;if(ED_CAM[hi]<x)return 1e9;while(lo<hi){const m=(lo+hi)>>1;if(ED_CAM[m]<x)lo=m+1;else hi=m}return lo/30}
function palAt(wx){
  const s=Math.max(0,Math.min(4.999,wx/ED_SEG)),i=s|0,k=esm((s-i-.8)/.2),a=ED_PAL[i],b=ED_PAL[Math.min(4,i+1)],m=(p,q)=>hexMix(p,q,k);
  return{sky:[m(a.sky[0],b.sky[0]),m(a.sky[1],b.sky[1])],mtn:m(a.mtn,b.mtn),water:[m(a.water[0],b.water[0]),m(a.water[1],b.water[1])],bed:m(a.bed,b.bed),bank:m(a.bank,b.bank)};
}
const ED_KEEP=[330,620,900,1000,1320,1640,1770,1900,2060,2540,2640,2900,3260,3380,3660];
const ED_PROPS=(()=>{const R=seeded(4021),a=[];for(let x=40;x<ED_LEN;x+=90+R()*110){const r=R(),r2=R();if(!ED_KEEP.some(k=>Math.abs(k-x)<120))a.push({x,r,r2})}return a})();
function edProp(c,x,seg,p){
  const g=ED_BANK;
  switch(seg){
    case 0:{line(c,[[x,g+4],[x,g-40]],5,'#4c3425');for(let i=0;i<5;i++)E(c,x+Math.sin(i*2.1+p.r*9)*20,g-50-Math.cos(i*1.7+p.r*5)*14,15+i%3*3,14,['#f6b6c8','#ffd1dc','#9fd47a'][(i+(p.r*3|0))%3],0,1.8);break}
    case 1:for(let i=0;i<3;i++){const h=40+((p.r*7+i*.37)%1)*30;poly(c,[[x+i*14-14,g+2],[x+i*14,g-h],[x+i*14+14,g+2]],'#2f6650',2)}break;
    case 2:{const h=40+p.r*50,w=40+p.r2*36;rr(c,x,g-h,w,h+2,1,['#d9cfc0','#b9c6cf','#d7b8a4','#c6c9a8'][p.r2*4|0],2);c.fillStyle='#7fb7c9';for(let i=0;i<Math.floor((w-6)/15);i++)c.fillRect(x+6+i*15,g-h+8,8,8);break}
    case 3:{line(c,[[x,g+2],[x,g-46]],4,'#3a2a1d');line(c,[[x+60,g+2],[x+60,g-46]],4,'#3a2a1d');c.lineWidth=1;c.strokeStyle='rgba(23,36,44,.45)';c.beginPath();for(let i=0;i<5;i++){c.moveTo(x,g-44+i*9);c.lineTo(x+60,g-44+i*9)}for(let i=0;i<=6;i++){c.moveTo(x+i*10,g-44);c.lineTo(x+i*10,g-8)}c.stroke();break}
    default:for(let i=0;i<4;i++)line(c,[[x+i*5,g+2],[x+i*7-6,g-22-p.r*12]],2,'#5d7b4f');
  }
}
// 岸より奥にある大きなもの
const ED_BACK=[
{x:900,w:80,f(c,x,u){rr(c,x-64,40,128,ED_BANK-36,4,'#4d5b52',2.4);c.save();c.beginPath();c.rect(x-24,40,48,ED_BANK-38);c.clip();c.fillStyle='#d9f2f2';c.fillRect(x-24,40,48,ED_BANK);c.strokeStyle='#8fd3d6';c.lineWidth=3;for(let i=0;i<5;i++)for(let k=0;k<3;k++){const y=40+((u*160+i*37+k*60)%180);c.beginPath();c.moveTo(x-20+i*10,y);c.lineTo(x-20+i*10,y+22);c.stroke()}c.restore();line(c,[[x-24,40],[x-24,ED_BANK]],2.2);line(c,[[x+24,40],[x+24,ED_BANK]],2.2);for(let i=0;i<4;i++)E(c,x-24+i*16,ED_BANK-2+Math.sin(u*9+i)*2,11,7,'#f7fdfc',0,1.6)}},
{x:2060,w:110,f(c,x,u){rr(c,x-96,ED_BANK-92,192,94,2,'#f2ece0',2.4);rr(c,x-104,ED_BANK-114,208,26,2,'#d9331f',2.4);c.fillStyle='#fff';c.font="15px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('回転ずし',x,ED_BANK-100);
  rr(c,x-84,ED_BANK-76,76,34,2,'#9fd3df',2);for(let i=0;i<3;i++){const px=x-80+((u*24+i*26)%72);E(c,px,ED_BANK-48,7,2.4,'#fff',0,1.2);E(c,px,ED_BANK-51,4.5,2.4,'#ff8a5c',0,1)}
  rr(c,x+16,ED_BANK-74,56,76,1,'#2b4c8c',2);line(c,[[x+44,ED_BANK-74],[x+44,ED_BANK-40]],1.6,'#fff')}},
{x:3660,w:30,f(c,x){rr(c,x-12,ED_BANK-112,24,114,2,'#fffdf4',2.2);for(const y of[ED_BANK-86,ED_BANK-46])rr(c,x-12,y,24,16,0,'#e3170a',2);rr(c,x-15,ED_BANK-128,30,18,3,'#ffe56b',2.2);poly(c,[[x-18,ED_BANK-128],[x,ED_BANK-144],[x+18,ED_BANK-128]],'#e3170a',2)}},
];
// 水の中や水面にあるもの
const ED_FRONT=[
{x:1770,w:150,f(c,x){for(const px of[x-110,x+104])rr(c,px,150,14,ED_BED-148,1,'#8e9aa3',2);rr(c,x-130,148,260,14,2,'#8e9aa3',2.2);line(c,[[x-130,136],[x+130,136]],3,'#5d6870');for(let i=0;i<=8;i++)line(c,[[x-130+i*32.5,136],[x-130+i*32.5,148]],2.4,'#5d6870')}},
{x:2540,w:90,f(c,x){poly(c,[[x-82,192],[x+82,192],[x+64,214],[x-64,214]],'#8d5e34',2.4);line(c,[[x-70,198],[x+70,198]],1.6,'#5d3d22')}},
{x:3260,w:90,f(c,x){poly(c,[[x-84,216],[x-62,178],[x-22,162],[x+30,166],[x+70,186],[x+88,216]],'#7c7f83',2.4)}},
{x:3380,w:60,f(c,x){poly(c,[[x-56,216],[x-34,188],[x+30,186],[x+58,216]],'#8b8e92',2.4)}},
];
// 今まで戦った相手。xは場所、lは子どもたちの真上に来てからの秒数
const ED_CAMEOS=[
{x:330,f(c,x,l,u){
  actorAt(c,'kibori',x,190,.42,still(0));
  c.save();c.translate(x+104,188);line(c,[[0,0],[0,-34]],3,'#5d4630');rr(c,-50,-58,100,24,3,'#fffdf4',2);c.fillStyle=INK;c.font="11px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('いってらっしゃい',0,-45);c.restore();
  ebub(c,'……(見守ってる)',x-10,70,x-14,110,efade(l,-3.4,1.6,.4))}},
{x:620,f(c,x,l){
  line(c,[[x+10,188],[x+10,96]],7,'#4c3425');line(c,[[x+10,130],[x+44,112]],4,'#4c3425');line(c,[[x+10,114],[x-30,100]],4,'#4c3425');
  for(let i=0;i<6;i++)E(c,x+14+Math.sin(i*2.2)*36,80-Math.cos(i*1.6)*16,20,15,['#f6b6c8','#ffd1dc','#9fd47a'][i%3],0,1.8);
  eact(c,'washi',x-24,112,.8,{t:.12,sw:0,atk:0,roll:0},l>.6);
  ebub(c,'大きくなれよ',x-40,14,x-30,62,efade(l,-2.6,2.6,.4))}},
{x:1000,f(c,x,l,u){
  eact(c,'nushi',x,190,.48,{t:u,sw:0,atk:l>0?.3+.3*Math.sin(u*5):0,roll:0},l>.6);
  ebub(c,'ゆっくり いきな',x,66,x-12,104,efade(l,-2.6,2.6,.4))}},
// 子グマが食べようとして、親グマが止める
{x:1320,f(c,x,l,u){
  const reach=l<-.1?esm((l+2.9)/.8):1-esm((l+.1)/.3),paw=esm((l+.35)/.35)*(1-esm((l-2.5)/.4)),wave=l>3.2,w=wave?.45+.45*Math.sin(u*7):0;
  c.save();c.translate(x,190);c.rotate(-.2*reach);c.scale(wave?-1.5:1.5,1.5*(1-.07*paw));drawActor(c,'konguma',{t:u,sw:0,atk:wave?w:.8*reach,roll:0});c.restore();
  if(reach>.5){const a=(u*1.6)%1;c.globalAlpha=1-a;E(c,x-40,146+a*16,2.2,3.2,'#bfe9f5',0,1);c.globalAlpha=1}
  eact(c,'higuma',x+96,190,.85,{t:u,sw:0,atk:wave?.45+.45*Math.sin(u*7+1):0,roll:0},wave);
  if(paw>0){const sx=x+74,sy=156,px=sx+(x-18-sx)*paw,py=sy+(108-sy)*paw;line(c,[[sx,sy],[px,py]],13,INK);line(c,[[sx,sy],[px,py]],9,'#6d4427');E(c,px,py,10,7,'#6d4427',0,2)}
  eword(c,'ぽん',x-30,92-Math.max(0,l)*16,efade(l,0,.8,.15),16,'#ffe63b');
  if(l>.4&&l<3)sweat(c,x-4,112,u);
  ebub(c,'おいしそう…',x-60,56,x-34,112,efade(l,-2.7,-.1,.3));
  ebub(c,'こら。見守るんだよ',x+120,34,x+76,112,efade(l,.4,2.9,.3));
  ebub(c,'はーい…',x-74,72,x-36,110,efade(l,1.5,3.2,.3));
  ebub(c,'いってらっしゃーい!',x+10,52,x+2,106,efade(l,3.6,9,.4))}},
{x:1730,f(c,x,l){
  eact(c,'tsuribito',x,148,.9,still(0),l>.6);
  const fl=efade(l,-.5,.3,.12);if(fl>0){c.globalAlpha=fl;E(c,x-8,70,22,22,'#fffbe0',0,0);c.globalAlpha=1}
  eword(c,'カシャッ',x-46,56,efade(l,-.5,.8,.15));
  ebub(c,'元気でな!',x+12,20,x-2,56,efade(l,.4,3.4,.3))}},
{x:1840,f(c,x,l){eact(c,'karasu',x,151,.8,{t:.1,sw:0,atk:0,roll:0},l>.6);ebub(c,'カァ(またね)',x,96,x-4,128,efade(l,-1.6,2.2,.3))}},
{x:2060,f(c,x,l,u){
  const fl=l>.6,wv=k=>.35+.35*Math.sin(u*6+k);
  c.save();c.translate(x-40,188);c.scale(fl?-1.3:1.3,1.3);echef(c,{t:u,sw:0,atk:wv(0)},1);c.restore();
  c.save();c.translate(x+50,188);c.scale(fl?-1:1,1);echef(c,{t:u,sw:0,atk:wv(2)},0);c.restore();
  ebub(c,'でっかくなって帰ってこいよ!',x-40,10,x-52,42,efade(l,-2.6,1.8,.3));
  ebub(c,'いってらっしゃい!',x+70,58,x+48,94,efade(l,.8,4.4,.3))}},
{x:2540,f(c,x,l,u){
  eact(c,'ryoshi',x-36,193,.85,{t:u,sw:0,atk:l<-1?.4+.3*Math.sin(u*5):0,roll:0},l>.6);
  eact(c,'amimoto',x+28,193,.5,still(u),l>.6);
  eact(c,'kamome',x+74,206,.7,{t:.1,sw:0,atk:0,roll:0},l>.6);
  ebub(c,'よいしょー',x-70,64,x-44,98,efade(l,-3.6,-1.2,.3));
  ebub(c,'通っていいぞ!',x+30,8,x+22,44,efade(l,-2.2,2.4,.3))}},
{x:2640,f(c,x,l){
  const lift=esm((l+3.6)/1.4),bot=ED_BED+4-lift*(ED_BED+4-210);
  c.save();c.globalAlpha=.85;c.lineWidth=1.4;c.strokeStyle='rgba(255,255,255,.75)';c.beginPath();
  for(let y=ED_SURF+4;y<bot;y+=12){c.moveTo(x,y);c.lineTo(x+40,y)}for(let k=0;k<=4;k++){c.moveTo(x+k*10,ED_SURF+2);c.lineTo(x+k*10,bot)}c.stroke();c.restore();
  line(c,[[x,bot],[x+40,bot]],2.4,'#c8a33e');
  for(const px of[x-6,x+46])line(c,[[px,150],[px,ED_BED+6]],5,'#3a2a1d');
  for(let k=0;k<3;k++)E(c,x+k*20,ED_SURF,5,5,'#ff8a2e',0,1.6);
  line(c,[[x-6,154],[x-60,150]],1.6,'#d6cda0')}},
{x:2900,f(c,x,l,u){eact(c,'mink',x,188,1,{t:u,sw:Math.sin(u*8),atk:0,roll:0},l>.6);ebub(c,'げんきでねー',x,124,x-10,154,efade(l,-2,2.4,.3))}},
{x:3260,f(c,x,l,u){eact(c,'todo',x,168,.42,still(u),l>.6);ebub(c,'達者でな',x-10,68,x-10,108,efade(l,-2.4,2.2,.3))}},
{x:3380,f(c,x,l,u){eact(c,'azarashi',x,190,.85,still(u),l>.6);eword(c,'パチパチ',x,140-Math.abs(Math.sin(u*6))*6,efade(l,-1.2,3,.3))}},
{x:3320,f(c,x,l,u,fx){const sx=l<2.5?Math.max(x,fx+40):fx+40+(l-2.5)*140,y=64+Math.sin(u*3)*6;eact(c,'kamome',sx,y+30,.9,{t:u,sw:0,atk:0,roll:0},1);ebub(c,'いってらっしゃーい!',sx,4,sx-6,40,efade(l,-1.2,2.4,.3))}},
{x:3440,f(c,x,l,u,fx){
  const b=l<0?x:l<4.5?fx:fx-(l-4.5)*80;
  for(let i=0;i<5;i++)eact(c,'ugui',b-40+i*26+Math.sin(u*2+i)*4,312+(i%2)*14,.7,{t:u+i,sw:0,atk:0,roll:0},1);
  ebub(c,'またね!',b+10,326,b,318,efade(l,.4,2.3,.3));
  ebub(c,'おおきくなってね',b+10,326,b,318,efade(l,2.5,5,.3))}},
{x:3560,f(c,x,l,u){eact(c,'kani',x,342,1,{t:u,sw:Math.sin(u*6)*.5,atk:.5+.5*Math.sin(u*7),roll:0},l>.6);ebub(c,'バンザーイ!',x+40,270,x+6,300,efade(l,-1.8,2.4,.3))}},
];
function edRiver(c,u){
  const W=ED.W,cam=camAt(u),fx=W*.42,pal=palAt(cam+W/2);
  let g=c.createLinearGradient(0,0,0,ED_SURF);g.addColorStop(0,pal.sky[0]);g.addColorStop(1,pal.sky[1]);c.fillStyle=g;c.fillRect(0,0,W,ED_SURF);
  c.fillStyle=pal.mtn;c.beginPath();c.moveTo(0,ED_SURF);for(let x=0;x<=W+20;x+=20){const q=x+cam*.25;c.lineTo(x,132-22*Math.sin(q*.011)-14*Math.sin(q*.031+1))}c.lineTo(W+20,ED_SURF);c.closePath();c.fill();
  const vis=(x,w)=>x-cam>-w-40&&x-cam<W+w+40;
  for(const b of ED_BACK)if(vis(b.x,b.w))b.f(c,b.x-cam,u);
  c.fillStyle=pal.bank;c.fillRect(0,ED_BANK,W,ED_SURF-ED_BANK);line(c,[[0,ED_BANK],[W,ED_BANK]],2);
  for(const p of ED_PROPS)if(vis(p.x,70))edProp(c,p.x-cam,Math.min(4,p.x/ED_SEG|0),p);
  g=c.createLinearGradient(0,ED_SURF,0,ED_BED);g.addColorStop(0,pal.water[0]);g.addColorStop(1,pal.water[1]);c.fillStyle=g;c.fillRect(0,ED_SURF,W,ED_BED-ED_SURF+2);
  c.fillStyle=pal.bed;c.fillRect(0,ED_BED,W,360-ED_BED);line(c,[[0,ED_BED],[W,ED_BED]],2);
  const pc=['#9c8d7a','#857766','#b3a692','#6f6355'];
  for(let i=Math.floor(cam/16);i*16<cam+W+16;i++){const r=2+hz(i+.7)*4;E(c,i*16-cam+hz(i)*8,ED_BED+8+hz(i+.3)*28,r*1.5,r,pc[hz(i+.9)*4|0],0,r>4.5?1.2:0)}
  c.lineWidth=1.6;c.strokeStyle='rgba(255,255,255,.25)';for(let i=0;i<14;i++){const x=((i*173-u*40-cam)%(W+80)+W+80)%(W+80)-40,y=ED_SURF+16+(i*29)%100;c.beginPath();c.moveTo(x,y);c.lineTo(x+18+i%3*7,y);c.stroke()}
  for(const b of ED_FRONT)if(vis(b.x,b.w))b.f(c,b.x-cam,u);
  for(const m of ED_CAMEOS)if(vis(m.x,240))m.f(c,m.x-cam,u-crossAt(m.x,fx),u,fx);
  FRY.forEach((f,i)=>efry(c,fx+f.x+Math.sin(u*1.3+f.p)*8,258+f.y+Math.sin(u*1.9+f.p*2)*5,u*1.6+f.p,1));
  c.lineWidth=2.5;c.strokeStyle='rgba(255,255,255,.75)';c.beginPath();for(let x=0;x<=W+14;x+=14){const y=ED_SURF+Math.sin((x+cam)*.035+u*2)*2.4;x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
  sign(c,`海まで あと${Math.max(0,Math.round(268*(1-cam/ED_LEN)))}km`,74,346,128,22,'#fffdf4',INK,12);
  ecap(c,'春の川を、海へ。',40,efade(u,.6,4));
}
function edSea(c,v){
  const W=ED.W,H0=176;
  let g=c.createLinearGradient(0,0,0,H0);g.addColorStop(0,'#f59e8b');g.addColorStop(1,'#ffe0b0');c.fillStyle=g;c.fillRect(0,0,W,H0);
  c.save();c.beginPath();c.rect(0,0,W,H0);c.clip();E(c,W*.66,H0+4,48,48,'#fff0c4',0,0);c.restore();
  c.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<4;i++){const x=((i*211+v*8)%(W+160))-80,y=40+i*24;c.beginPath();c.ellipse(x,y,46,8,0,0,6.3);c.ellipse(x+18,y-6,24,8,0,0,6.3);c.fill()}
  g=c.createLinearGradient(0,H0,0,360);g.addColorStop(0,'#3f9ec0');g.addColorStop(1,'#0f4a66');c.fillStyle=g;c.fillRect(0,H0,W,184);
  line(c,[[0,H0],[W,H0]],2);
  c.lineWidth=2.4;c.strokeStyle='rgba(255,240,196,.7)';for(let i=0;i<9;i++){const y=H0+8+i*i*2.4,w=40-i*3+Math.sin(v*3+i)*6;c.beginPath();c.moveTo(W*.66-w,y);c.lineTo(W*.66+w,y);c.stroke()}
  const k=esm(v/10.5);
  FRY.forEach((f,i)=>{const s=1-.78*k;c.globalAlpha=1-esm((v-10)/2);efry(c,W*.28+f.x+(W*.42-f.x*.75)*k+Math.sin(v*1.3+f.p)*6*s,262+f.y-(70+f.y*.85)*k,v*1.8+f.p,s);c.globalAlpha=1});
  c.fillStyle='#e8d3a0';c.beginPath();c.moveTo(0,292);c.quadraticCurveTo(W*.2,296,W*.34,360);c.lineTo(0,360);c.closePath();P(c,'#e8d3a0',2);
  const wv=k=>.45+.45*Math.sin(v*6+k);
  eact(c,'higuma',W*.08,340,.62,{t:v,sw:0,atk:wv(0),roll:0},1);
  eact(c,'konguma',W*.17,346,1.15,{t:v,sw:0,atk:wv(1.5),roll:0},1);
  ebub(c,'いってらっしゃーい!',W*.2,250,W*.17,290,efade(v,1.4,6.6,.4));
  eact(c,'kamome',W*.86+Math.sin(v*.7)*20,124+Math.sin(v*2.2)*8,.75,{t:v,sw:0,atk:0,roll:0},1);
  ecap(c,'いってらっしゃい。',60,efade(v,1,5));
  ecap(c,ED.lap<3?'4年後、この子たちが帰ってくる。':'川は、これからもつづいていく。',60,efade(v,5.4,10.2));
  if(v>10.6&&ED.lap!==2){
    const a=esm((v-10.6)/.5),s=1+.3*(1-esm((v-10.6)/.4));
    c.save();c.globalAlpha=a;c.translate(W/2,98);c.scale(s,s);c.rotate(-.04);c.font="56px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
    c.fillStyle=INK;c.fillText('おわり',4,5);c.lineWidth=8;c.strokeStyle=INK;c.strokeText('おわり',0,0);c.fillStyle='#ff8a5c';c.fillText('おわり',0,0);c.restore();
    ecap(c,'あそんでくれて、ありがとう。',150,esm((v-11.4)/.6),20);
  }
}
// 8年後のエンディングだけ、最後にボスたちが「次こそ」と決意する場面をつけて、12年後(ハード)につなぐ
const VOWS=[['todo','次こそ、のがさんぞ!',.5],['amimoto','次は、もっと大きな網を用意する',.62],['taisho','次は特上のネタにしてやる!',.62],['nushi','滝を、もっと高くしておこう',.42],['kibori','次こそ、本物の鮭をくわえる',.4]];
function edVow(c,v){
  const W=ED.W;
  let g=c.createLinearGradient(0,0,0,250);g.addColorStop(0,'#2b2350');g.addColorStop(1,'#a8577a');c.fillStyle=g;c.fillRect(0,0,W,360);
  E(c,W*.82,66,24,24,'#fff3c4',0,0);E(c,W*.82+9,60,20,20,'#2b2350',0,0);
  for(let i=0;i<24;i++){c.globalAlpha=.4+.4*Math.sin(v*2+i);dot(c,hz(i)*W,hz(i+.5)*150,1.4,'#fffdf4')}c.globalAlpha=1;
  c.fillStyle='#4a3a5a';c.fillRect(0,250,W,110);line(c,[[0,250],[W,250]],2);
  c.fillStyle='#24506a';c.fillRect(0,318,W,42);line(c,[[0,318],[W,318]],2);
  const on=i=>efade(v,1+i*2.1,3.3+i*2.1,.3),all=efade(v,11.3,14.3,.4);
  // しゃべっているボスの足元だけ明るくする
  VOWS.forEach(([id,s,k],i)=>{const x=W*(.13+i*.185),sp=on(i);
    if(sp>0){c.save();c.globalAlpha=.35*sp;E(c,x,300,58,14,'#fff3c4',0,0);c.restore()}
    eact(c,id,x,302-sp*6,k,{t:v+i,sw:0,atk:sp>.5?.5+.5*Math.sin(v*8):0,roll:0},1);
    ebub(c,s,x,150-(i%2)*34,x,240-(i%2)*20,sp,Math.min(14,(W-40)/(s.length+2)))});
  ebub(c,'12年後、かならず捕まえる!',W/2,120,W/2,210,all,18);
  ecap(c,'ボスたちは、それぞれの守護神にたのみに行った。',40,efade(v,12.6,16,.5),18);
  if(v>14.2){const a=esm((v-14.2)/.5),sc=1+.3*(1-esm((v-14.2)/.4));
    c.save();c.globalAlpha=a;c.translate(W/2,130);c.scale(sc,sc);c.rotate(-.04);c.font="52px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
    c.fillStyle=INK;c.fillText('つづく',4,5);c.lineWidth=8;c.strokeStyle=INK;c.strokeText('つづく',0,0);c.fillStyle='#ff8a5c';c.fillText('つづく',0,0);c.restore();
    ecap(c,'「12年後の遡上(ハード)」がひらいた',186,esm((v-14.8)/.6),18)}
}

// ユーコン川の導入。嵐で流され、ユーコン川へ帰るキングサーモンたちに出会う
const YI_T=[7.5,14,28.5],YI_LEN=34.5;
function seaBack(c,top,bot,wy,t,amp,col){
  const W=ED.W;let g=c.createLinearGradient(0,0,0,wy);g.addColorStop(0,top);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(0,0,W,360);
  c.beginPath();c.moveTo(0,360);for(let x=0;x<=W+10;x+=10)c.lineTo(x,wy+Math.sin(x*.02+t*1.6)*amp+Math.sin(x*.047-t*2.3)*amp*.5);c.lineTo(W,360);c.closePath();c.fillStyle=col;c.fill();c.lineWidth=2.4;c.strokeStyle=INK;c.stroke();
}
function edYIntro(c,t){
  const W=ED.W;
  if(t<YI_T[0]){
    // 嵐の海
    const fl=(t>2&&t<2.25)||(t>4.6&&t<4.8);
    seaBack(c,fl?'#c9d6e2':'#1b2633','#3b4f5e',170,t,24,'#2c5a6b');
    c.strokeStyle='rgba(220,235,245,.45)';c.lineWidth=1.6;for(let i=0;i<40;i++){const x=(hz(i)*W+t*160)%W,y=(hz(i+.3)*360+t*520)%360;c.beginPath();c.moveTo(x,y);c.lineTo(x-8,y+18);c.stroke()}
    for(let i=0;i<9;i++){const a=t*1.4+i*.7,x=W*.15+i*W*.08+Math.sin(a)*30,y=230+Math.sin(a*1.3+i)*40;c.save();c.translate(x,y);c.rotate(Math.sin(a*2)*1.2);eact(c,i%3?'shake':'gin',0,0,.42,{t:t*3+i,sw:0,atk:0,roll:0},1);c.restore()}
    for(let i=0;i<6;i++){const x=hz(i+2)*W,y=200+Math.sin(t*2+i)*16;E(c,x,y,22,8,'#e9f7f4',0,0)}
    ecap(c,'ある年、海で大きな嵐が来た。',46,efade(t,.6,7),22);
  }else if(t<YI_T[1]){
    const v=t-YI_T[0];
    seaBack(c,'#cfe3ee','#f3efe2',190,v,5,'#3b7d93');
    for(const[id,x,y,k]of[['shake',.32,262,.6],['sakura',.47,286,.55],['gin',.6,258,.55],['ikura',.42,312,.9]]){eact(c,id,W*x,y,k,{t:v+x*9,sw:0,atk:0,roll:0},1);eword(c,'?',W*x+(id==='ikura'?0:-6),y-(id==='ikura'?34:52)-Math.abs(Math.sin(v*3+x*9))*6,efade(v,.8+x,9),18,'#ffe63b')}
    ecap(c,'気がつくと、知らない海。',46,efade(v,.4,3.4),22);
    ecap(c,'生まれた川へ帰る道が、わからない。',46,efade(v,3.6,6.4),22);
  }else if(t<YI_T[2]){
    const v=t-YI_T[1],cx=esm(v/2.4);
    seaBack(c,'#cfe3ee','#f3efe2',190,v,5,'#3b7d93');
    eact(c,'shake',W*.28,262,.6,{t:v,sw:0,atk:0,roll:0},1);eact(c,'sakura',W*.18,286,.55,{t:v+1,sw:0,atk:0,roll:0},1);eact(c,'ikura',W*.24,316,.9,{t:v+2,sw:0,atk:0,roll:0},1);
    eact(c,'yking',W*(1.1-.42*cx),272,.62,{t:v,sw:0,atk:0,roll:0});eact(c,'steel',W*(1.2-.42*cx),318,.56,{t:v+1,sw:0,atk:0,roll:0});
    const kx=W*.68;
    ebub(c,'迷子かい?',kx,150,kx-20,222,efade(v,2.6,4.8,.3),16);
    ebub(c,'おれたちは、ユーコン川へ帰るところだ',kx-40,150,kx-20,222,efade(v,5,7.4,.3),15);
    ebub(c,'いっしょに来るかい?',kx,150,kx-20,222,efade(v,7.6,9.4,.3),16);
    ebub(c,'うん!',W*.28,170,W*.26,230,efade(v,8.8,10,.3),16);
    // ユーコン川ではオキアミがたまりにくいことを、物語の中で先に伝えておく
    ebub(c,'川に入ったら、もう何も食べないんだ',kx-40,150,kx-20,222,efade(v,10.3,12.4,.3),15);
    ebub(c,'おなかいっぱいにしてから行くぞ!',kx-30,150,kx-20,222,efade(v,12.6,14.3,.3),15);
  }else{
    const v=t-YI_T[2];
    let g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,'#1f5b63');g.addColorStop(1,'#0d3440');c.fillStyle=g;c.fillRect(0,0,W,360);
    ecap(c,'めざすは、3,000km先。',110,efade(v,.3,6,.4),22);
    if(v>1.4){const a=esm((v-1.4)/.5),sc=1+.3*(1-esm((v-1.4)/.4));c.save();c.globalAlpha=a;c.translate(W/2,190);c.scale(sc,sc);c.rotate(-.04);c.font="46px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
      c.fillStyle=INK;c.fillText('ユーコン川へ',4,5);c.lineWidth=8;c.strokeStyle=INK;c.strokeText('ユーコン川へ',0,0);c.fillStyle='#ff8a5c';c.fillText('ユーコン川へ',0,0);c.restore()}
  }
}
// ユーコン川のエンディング。日本生まれの鮭たちが、雄大なユーコン川をながめる
const YE_T=8.5,YE_LEN=29;
function yukonView(c,v){
  const W=ED.W,pan=v*3;
  let g=c.createLinearGradient(0,0,0,200);g.addColorStop(0,'#f7c48a');g.addColorStop(1,'#ffe9c8');c.fillStyle=g;c.fillRect(0,0,W,360);
  E(c,W*.7-pan*.2,150,34,34,'#ffb35c',0,0);c.globalAlpha=.4;E(c,W*.7-pan*.2,150,58,58,'#ffe0aa',0,0);c.globalAlpha=1;
  const ridge=(y,amp,col,seed,snow)=>{c.beginPath();c.moveTo(0,200);for(let x=-20;x<=W+20;x+=22){const h=y-amp*hz(Math.floor((x+pan*(seed%3+1)*.3)/22)+seed);c.lineTo(x,h)}c.lineTo(W,200);c.closePath();c.fillStyle=col;c.fill();
    if(snow){c.save();c.clip();c.fillStyle='rgba(255,255,255,.85)';c.fillRect(0,0,W,y-amp*.62);c.restore()}};
  ridge(150,70,'#8e9fb3',3,1);ridge(178,46,'#6f8796',7,0);ridge(200,24,'#4f6b5a',11,0);
  c.fillStyle='#55704f';c.fillRect(0,198,W,90);
  // 遠くへ細くなっていく川
  c.beginPath();c.moveTo(W*.5,198);c.quadraticCurveTo(W*.62,220,W*.42,240);c.quadraticCurveTo(W*.2,262,W*.36,300);c.lineTo(W*.86,300);c.quadraticCurveTo(W*.5,262,W*.62,238);c.quadraticCurveTo(W*.74,218,W*.53,198);c.closePath();
  c.fillStyle='#4fb3bf';c.fill();c.lineWidth=2;c.strokeStyle=INK;c.stroke();
  c.globalAlpha=.6;for(let i=0;i<6;i++){const y=212+i*14;line(c,[[W*.46+i*6,y],[W*.5+i*9,y]],1.6,'#fff')}c.globalAlpha=1;
  for(let i=0;i<26;i++){const x=hz(i+9)*W,y=204+hz(i+4)*70,h=8+hz(i+1)*16;if(Math.abs(x-W*(.5+.25*(y-200)/100))<W*.14*(y-190)/100)continue;c.fillStyle='#2f4f3a';c.beginPath();c.moveTo(x,y-h);c.lineTo(x+h*.3,y);c.lineTo(x-h*.3,y);c.closePath();c.fill()}
  c.fillStyle='#2a8ea3';c.fillRect(0,300,W,60);line(c,[[0,300],[W,300]],2.4);
}
function edYukon(c,t){
  const W=ED.W;
  if(t<YE_T){
    // 魚道をのぼりきる
    let g=c.createLinearGradient(0,0,0,240);g.addColorStop(0,'#ffd0a0');g.addColorStop(1,'#f2e6d6');c.fillStyle=g;c.fillRect(0,0,W,360);
    for(let i=0;i<7;i++){const x=W*.1+i*W*.12,y=300-i*22;rr(c,x,y,W*.12+2,360-y,0,'#9c6a3e',2);c.fillStyle='#4fb3bf';c.fillRect(x+2,y+3,W*.12-2,8)}
    const k=esm(t/6);for(const[id,o,s]of[['shake',0,.5],['ikura',.06,.8],['aramaki',.12,.38],['yking',.2,.5]]){const q=Math.max(0,Math.min(1,k*1.2-o)),x=W*(.12+q*.74),y=300-q*132-30;eact(c,id,x,y,s,{t:t+o*9,sw:Math.sin(t*6+o*20)*.5,atk:0,roll:t*4},1)}
    ecap(c,'3,000km。ユーコン川を、のぼりきった。',46,efade(t,.6,8,.5),20);
  }else if(t<YE_LEN-4){
    const v=t-YE_T;yukonView(c,v);
    const P0={t:v,sw:0,atk:0,roll:0};
    eact(c,'shake',W*.2,344,.85,P0,1);eact(c,'ikura',W*.1,354,1.1,{...P0,t:v+1},1);eact(c,'gin',W*.3,356,.7,{...P0,t:v+3},1);eact(c,'yking',W*.46,350,.7,{...P0,t:v+2},1);
    ebub(c,'大きいなあ…',W*.2,250,W*.2,300,efade(v,1,3.6,.3),16);
    ebub(c,'いい川だろう',W*.46,250,W*.44,298,efade(v,3.8,6.2,.3),16);
    ebub(c,'ぼくの生まれた川も、いい川なんだ',W*.26,250,W*.2,298,efade(v,6.4,9.2,.3),15);
    ebub(c,'いつか、案内してくれよ',W*.46,250,W*.44,298,efade(v,9.4,12,.3),15);
    ecap(c,'日本生まれの鮭たちは、雄大なユーコン川をながめていた。',36,efade(v,12.2,YE_LEN-4-YE_T,.5),18);
  }else{
    const v=t-(YE_LEN-4);yukonView(c,v+YE_LEN);
    c.fillStyle=`rgba(13,30,38,${Math.min(.55,v*.4)})`;c.fillRect(0,0,W,360);
    const a=esm(v/.6);c.save();c.globalAlpha=a;c.translate(W/2,170);c.rotate(-.04);c.font="52px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
    c.fillStyle=INK;c.fillText('おわり',4,5);c.lineWidth=8;c.strokeStyle=INK;c.strokeText('おわり',0,0);c.fillStyle='#ff8a5c';c.fillText('おわり',0,0);c.restore();
  }
}
const ED_T2=14,ED_T3=26,ED_T4=ED_T3+ED_RIVER,ENDING_LEN=ED_T4+13,ED_T5=ED_T4+11,VOW_LEN=18;

// オープニング。春に生まれる→海へ→4年後→待ちかまえる者たち→乗り越えて行くぞ→タイトル
const OP_T=[6.5,13,19.5,28.5,35.5],OP_LEN=41;
const OP_EGGS=[[-60,4],[-34,-6],[-10,6],[14,-4],[38,6],[62,-6],[-22,-16],[26,-16]];
const OP_SCHOOL=[[0,0],[-70,-26],[-74,30],[-140,-6],[60,-34],[66,28],[-150,44],[-200,-30]];
function opRiverBed(c,t,top,bot){
  const W=ED.W;let g=c.createLinearGradient(0,112,0,300);g.addColorStop(0,top);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(0,112,W,190);
  c.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<4;i++){const x=W*(.1+i*.25)+Math.sin(t*.6+i)*16;c.beginPath();c.moveTo(x,112);c.lineTo(x+34,112);c.lineTo(x+90,300);c.lineTo(x+40,300);c.closePath();c.fill()}
  c.fillStyle='#6b5a4a';c.fillRect(0,298,W,62);line(c,[[0,298],[W,298]],2);
  const pc=['#9c8d7a','#857766','#b3a692','#6f6355'];
  for(let i=0;i<W/14;i++){const r=4+hz(i+.7)*6;E(c,i*14+hz(i)*8,312+hz(i+.3)*44,r*1.5,r,pc[hz(i+.9)*4|0],0,1.2)}
}
// 1 ある春、川で生まれる(秋に産まれた卵が冬にかえり、春に石の中から出てくる)
function opBorn(c,t){
  const W=ED.W,cx=W/2;
  let g=c.createLinearGradient(0,0,0,112);g.addColorStop(0,'#bfe6f0');g.addColorStop(1,'#eef6d8');c.fillStyle=g;c.fillRect(0,0,W,112);
  c.fillStyle='#8fb39a';c.beginPath();c.moveTo(0,112);for(let x=0;x<=W+30;x+=30)c.lineTo(x,72-Math.sin(x*.013)*20-Math.abs(Math.sin(x*.041))*12);c.lineTo(W+30,112);c.closePath();c.fill();
  c.fillStyle='#7fb36a';c.fillRect(0,98,W,16);line(c,[[0,98],[W,98]],2);
  for(let x=24,i=0;x<W;x+=46,i++)E(c,x,100-(i%2)*3,4,3,['#f6b6c8','#fff27a','#ffffff'][i%3],0,1.2);
  const cols=['#f6b6c8','#ffd1dc','#f9a3bd'];
  for(let x=60,k=0;x<W;x+=160,k++){line(c,[[x,104],[x,62]],5,'#4c3425');for(let i=0;i<5;i++)E(c,x+Math.sin(i*2.3+k)*18,50-Math.cos(i*1.9+k)*12,14+(i%3)*3,13,cols[(i+k)%3],0,1.8)}
  for(let i=0;i<7;i++){const y=(t*22+i*61)%100,x=(i*113)%W+Math.sin(t*1.3+i)*14;c.save();c.translate(x,y);c.rotate(t*2+i);E(c,0,0,4,2.6,cols[i%3],0,1);c.restore()}
  opRiverBed(c,t,'#5cc3c9','#2a8ea3');
  OP_EGGS.forEach(([dx,dy],i)=>{
    const ex=cx+dx*1.6,ey=280+dy,h=3.1+i*.17;
    if(t<h){eegg(c,ex,ey,13,esm((t-1)/1.2),t>2.4?Math.min(1,t-2.4):0,t);return}
    const a=(t-h)/.6;
    if(a<1){c.save();c.globalAlpha=1-a;for(const sd of[-1,1]){c.save();c.translate(ex+sd*a*14,ey+a*6);c.rotate(sd*a*.8);c.beginPath();c.arc(0,0,13,sd<0?1.5708:-1.5708,sd<0?4.7124:1.5708);c.closePath();P(c,'#ffc49a',1.6);c.restore()}c.restore()}
    const rise=esm((t-h-.2)/1.6),tx=cx-110+(i%4)*70,ty=190+(i>>2)*34;
    efry(c,ex+(tx-ex)*rise+Math.sin(t*2+i)*5*rise,ey+(ty-ey)*rise-(1-rise)*3,t*1.7+i,1.1,1-rise*.8);
    if(i%3===0)eword(c,'ぴちっ',ex,ey-26-a*10,1-Math.min(1,a/1.2),13);
  });
  ecap(c,'ある春、川で小さな命が生まれた。',336,efade(t,.5,6.2));
}
// 2 川を下って海へ。進むほど景色が海になり、子どもたちは大きくなる
function opDown(c,v){
  const W=ED.W,k=esm((v-.6)/5);
  let g=c.createLinearGradient(0,0,0,130);g.addColorStop(0,hexMix('#bfe6f0','#cfe3ee',k));g.addColorStop(1,hexMix('#eef6d8','#f3efe2',k));c.fillStyle=g;c.fillRect(0,0,W,130);
  // 川岸の山は遠ざかって消える
  c.globalAlpha=1-k;c.fillStyle='#6f9a62';c.beginPath();c.moveTo(0,130);for(let x=0;x<=W+30;x+=30)c.lineTo(x,96-Math.sin((x+v*60)*.012)*18-Math.abs(Math.sin((x+v*60)*.037))*10);c.lineTo(W+30,130);c.closePath();c.fill();c.globalAlpha=1;
  g=c.createLinearGradient(0,130,0,360);g.addColorStop(0,hexMix('#49b6c0','#3b7d93',k));g.addColorStop(1,hexMix('#1e7788','#123848',k));c.fillStyle=g;c.fillRect(0,128,W,232);
  c.beginPath();c.moveTo(0,130);for(let x=0;x<=W+10;x+=10)c.lineTo(x,130+Math.sin(x*.03+v*2)*(2+k*4));c.lineWidth=2.4;c.strokeStyle=INK;c.stroke();
  // 流れのすじ(左へ流れて、前へ進んで見える)
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;for(let i=0;i<12;i++){const x=W-((v*170+i*97)%(W+80)),y=150+(i*53)%190;c.beginPath();c.moveTo(x,y);c.lineTo(x+26,y);c.stroke()}
  OP_SCHOOL.forEach(([dx,dy],i)=>{
    const x=W*.52+dx*(.8+k*.5)+Math.sin(v*1.3+i)*6,y=236+dy*(.9+k*.4)+Math.sin(v*2+i)*4,a=esm((k-.45)/.2);
    if(a<1){c.save();c.globalAlpha=1-a;efry(c,x,y,v*1.7+i,1.1+k*1.6,0);c.restore()}
    if(a>0){c.save();c.globalAlpha=a;eact(c,'shake',x,y+20,.5+k*.35,still(v+i),true);c.restore()}
  });
  ecap(c,'川を下り、広い海へ。',336,efade(v,.5,6.2));
}
// 3 4年後の海。先頭の鮭が何かに気づき、みんなで生まれた川の方へふり返る
function opSea(c,v){
  const W=ED.W;seaBack(c,'#cfe3ee','#f3efe2',120,v,5,'#2f6f86');
  c.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<5;i++){const x=W*(.05+i*.22)+Math.sin(v*.5+i)*12;c.beginPath();c.moveTo(x,128);c.lineTo(x+30,128);c.lineTo(x+80,360);c.lineTo(x+36,360);c.closePath();c.fill()}
  OP_SCHOOL.forEach(([dx,dy],i)=>{
    const turn=esm((v-3.9-(i===0?0:.25+i*.08))/.35),x=W*.52+dx*1.25+Math.sin(v*1.1+i)*5-(1-turn)*v*3,y=250+dy*1.3+Math.sin(v*1.8+i)*4;
    c.save();c.translate(x,y+26);c.scale((turn*2-1)*.85,.85);drawActor(c,'shake',still(v*(1-turn*.6)+i));c.restore();
  });
  const lx=W*.52,ly=250;
  eword(c,'!',lx-6,ly-58-Math.abs(Math.sin(v*9))*4,efade(v,3.3,4.5,.15),30,'#ffe63b');
  ecap(c,'4年後。',60,efade(v,.4,3.2),30);
  ebub(c,'……帰らなきゃ。',lx-30,ly-104,lx-14,ly-46,efade(v,4.4,6.3,.25),16);
}
// 4 川で待ちかまえる者たち。4つのコマが順に出る
function opPanel(c,i,v){
  const W=ED.W,pw=(W-36)/2,ph=128,px=12+(i%2)*(pw+12),py=14+(i>>1)*(ph+12),a=esm((v-i*1.9)/.35);
  if(a<=0)return;
  c.save();c.translate(px+(1-a)*(i%2?40:-40),py);c.globalAlpha=a;
  rr(c,0,0,pw,ph,4,'#fffdf4',3);c.save();c.beginPath();c.rect(3,3,pw-6,ph-6);c.clip();
  const lt=v-i*1.9,cxp=pw/2;
  if(i===0){ // トドとカモメの予約席
    let g=c.createLinearGradient(0,0,0,ph);g.addColorStop(0,'#bfe4ec');g.addColorStop(1,'#e8f3df');c.fillStyle=g;c.fillRect(0,0,pw,ph);
    c.fillStyle='#1f7f95';c.fillRect(0,96,pw,40);
    c.beginPath();c.moveTo(20,ph);c.lineTo(40,96);c.lineTo(200,92);c.lineTo(230,ph);c.closePath();P(c,'#7c7f83',2);
    actorAt(c,'todo',150,104,-.5,still(lt),.5);
    // ナイフとフォークを立てて持つ
    line(c,[[96,104],[96,58]],3,'#9aa7ae');for(const dx of[-4,0,4])line(c,[[96+dx,58],[96+dx,48]],1.6,'#9aa7ae');
    line(c,[[204,104],[204,56]],3,'#9aa7ae');poly(c,[[201,56],[204,40],[208,56]],'#dfe7ec',1.2);
    actorAt(c,'kamome',236,94+Math.sin(lt*6)*2,-.85,still(lt),.85);actorAt(c,'kamome',266,96+Math.sin(lt*6+1)*2,-.85,still(lt+1),.85);
    rr(c,12,10,96,24,3,'#e3170a',2);c.fillStyle='#fff';c.font="13px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.fillText('鮭 予約席',60,23);
  }else if(i===1){ // 釣り人が竿をふる
    let g=c.createLinearGradient(0,0,0,ph);g.addColorStop(0,'#a9d3ee');g.addColorStop(1,'#e0eef2');c.fillStyle=g;c.fillRect(0,0,pw,ph);
    c.fillStyle='#6f9a62';c.fillRect(0,100,pw,30);c.fillStyle='#2a8ea3';c.fillRect(0,84,pw,18);
    const sw=Math.sin(lt*7);actorAt(c,'tsuribito',cxp-30,122,-1.05,{...still(lt),atk:.5+sw*.5},1.05);
    eword(c,'ブンッ',cxp+70,44+sw*4,Math.max(0,sw),18,'#ffe63b');
    ebub(c,'今年こそ大物!',cxp-60,8,cxp-34,40,1,13);
  }else if(i===2){ // 板前が包丁をとぐ
    c.fillStyle='#f2ece0';c.fillRect(0,0,pw,ph);c.fillStyle='#d9331f';c.fillRect(0,0,pw,10);
    c.fillStyle='#8a5a34';c.fillRect(0,100,pw,30);line(c,[[0,100],[pw,100]],2.2);
    rr(c,cxp-74,90,70,12,2,'#7d8a8f',2);
    const sw=Math.sin(lt*10);actorAt(c,'itamae',cxp+24,124,1.05,{...still(lt),atk:.3+sw*.35});
    c.save();c.translate(cxp-40+sw*14,86);c.rotate(-.1);poly(c,[[-18,-2],[18,-4],[22,0],[-18,2]],'#dfe7ec',1.4);rr(c,22,-3,12,6,2,'#6b4a2c',1.2);c.restore();
    for(let k=0;k<4;k++){const q=(lt*3+k*.25)%1;c.globalAlpha=a*(1-q);dot(c,cxp-40+sw*14+(k-1.5)*8,84-q*20,1.4,'#ffe63b');c.globalAlpha=a}
    eword(c,'シャッシャッ',cxp-40,40,1,17,'#ffe63b');
  }else{ // ヒグマのよだれ
    let g=c.createLinearGradient(0,0,0,ph);g.addColorStop(0,'#a9d3ee');g.addColorStop(1,'#d6ecd2');c.fillStyle=g;c.fillRect(0,0,pw,ph);
    poly(c,[[pw-60,104],[pw-34,30],[pw-8,104]],'#2f6650',2);poly(c,[[8,104],[34,40],[60,104]],'#2f6650',2);c.fillStyle='#6f9a62';c.fillRect(0,100,pw,30);
    actorAt(c,'higuma',cxp+10,128,.75,still(lt));
    const q=(lt*.9)%1;line(c,[[cxp-40,70],[cxp-40,70+q*22]],2.4,'#9fe0f0');E(c,cxp-40,72+q*24,3.4,4.6,'#9fe0f0',0,1.4);
    ebub(c,'じゅるり…',cxp-70,10,cxp-34,44,1,14);
  }
  c.restore();c.restore();
}
function opWait(c,v){
  const W=ED.W;let g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,'#1f5b63');g.addColorStop(1,'#0d3440');c.fillStyle=g;c.fillRect(0,0,W,360);
  for(let i=0;i<4;i++)opPanel(c,i,v);
  ecap(c,'でも、川では食いしんぼうたちが待っていた。',322,efade(v,.4,8.8),20);
}
// 5 敵がならぶ川を、群れが次々に跳びこえていく。前向きに、行くぞ!
const OP_FOES=[['todo',.2,-.36,.36],['tsuribito',.38,-.95,.95],['itamae',.55,-.95,.95],['higuma',.73,-.6,.6]];
function opRise(c,v){
  const W=ED.W;
  let g=c.createLinearGradient(0,0,0,200);g.addColorStop(0,'#a9d3ee');g.addColorStop(1,'#e0eef2');c.fillStyle=g;c.fillRect(0,0,W,200);
  c.fillStyle='#7fa38a';c.beginPath();c.moveTo(0,200);for(let x=0;x<=W+30;x+=30)c.lineTo(x,150-Math.sin(x*.012)*22-Math.abs(Math.sin(x*.035))*12);c.lineTo(W+30,200);c.closePath();c.fill();
  c.fillStyle='#6f9a62';c.fillRect(0,192,W,26);line(c,[[0,192],[W,192]],2);
  g=c.createLinearGradient(0,216,0,360);g.addColorStop(0,'#49b6c0');g.addColorStop(1,'#1e7788');c.fillStyle=g;c.fillRect(0,216,W,144);
  c.beginPath();c.moveTo(0,218);for(let x=0;x<=W+10;x+=10)c.lineTo(x,218+Math.sin(x*.03+v*2)*2);c.lineWidth=2.4;c.strokeStyle=INK;c.stroke();
  // 川ぞいに待ちかまえる者たち(右から来る鮭の方を向く)
  OP_FOES.forEach(([id,fx,sx,sy],i)=>{const x=W*fx,surprised=v>3+i*.18;
    actorAt(c,id,x+(surprised?Math.sin(v*30)*1.5:0),226,sx,still(v+i),sy);
    eword(c,'!',x,120-(i===0?-20:0),surprised?efade(v,3+i*.18,6.4,.15):0,26,'#ffe63b')});
  // 群れ。はじめは右の水面で構え、先頭から順に跳びこえる
  for(let i=0;i<7;i++){const st=2.6+i*.28,q=Math.max(0,Math.min(1,(v-st)/1.5));
    const x0=W*(.84+(i%3)*.05),y0=268+(i%2)*22,x=x0+(-90-x0)*q,y=y0-Math.pow(Math.sin(q*Math.PI),.5)*(176+(i%3)*12);
    c.save();c.translate(x,y+(q>0?0:Math.sin(v*3+i)*3));c.rotate(q>0&&q<1?.75-1.5*q:0);c.scale(.62,.62);c.translate(0,30);drawActor(c,i===0?'hanamagari':'shake',still(v+i));c.restore();
    if(q>0&&q<.12){c.globalAlpha=.8;E(c,x0,258,16,4,'#e9f7f4',0,1.4);c.globalAlpha=1}}
  ebub(c,'みんな、行くぞ!',W*.8,150,W*.85,232,efade(v,.3,2.6,.2),16);
  ebub(c,'おー!',W*.86,312,W*.86,294,efade(v,1.5,2.8,.2),15);
  ecap(c,'食いしんぼうたちを乗り越えて、生まれた川へ帰れるか!?',40,efade(v,.4,6.6),21);
}
// 6 タイトル。鮭の群れが跳ねて、題字が出る
function opTitle(c,v){
  const W=ED.W;seaBack(c,'#ffcf9c','#ff9d7c',230,v,4,'#2a8ea3');
  c.fillStyle='#7d6f8c';c.beginPath();c.moveTo(0,232);for(let x=0;x<=W+30;x+=30)c.lineTo(x,196-Math.sin(x*.011)*24-Math.abs(Math.sin(x*.033))*14);c.lineTo(W+30,232);c.closePath();c.fill();
  seaBack(c,'rgba(0,0,0,0)','rgba(0,0,0,0)',232,v,4,'#2a8ea3');
  for(let i=0;i<7;i++){const ph=((v*.8+i*.37)%1.6)/1.6;if(ph>.85)continue;const q=ph/.85,x=W*(.12+i*.13)+q*40,y=236-Math.sin(q*Math.PI)*(90+(i%3)*30);
    c.save();c.translate(x,y);c.rotate(-.9+q*1.8);c.scale(-.6,.6);c.translate(0,30);drawActor(c,i%3?'shake':'gin',still(v+i));c.restore();
    if(q<.12||q>.88){c.globalAlpha=.8;E(c,W*(.12+i*.13)+(q<.5?0:40),238,14,4,'#e9f7f4',0,1.4);c.globalAlpha=1}}
  const a=esm((v-1)/.5),sc=1+.35*(1-esm((v-1)/.45));
  if(a>0){c.save();c.globalAlpha=a;c.translate(W/2,118);c.scale(sc,sc);c.rotate(-.035);c.font="64px 'Dela Gothic One',sans-serif";c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
    c.fillStyle=INK;c.fillText('サーモン大遡上',5,6);c.lineWidth=9;c.strokeStyle=INK;c.strokeText('サーモン大遡上',0,0);c.fillStyle='#ff8a5c';c.fillText('サーモン大遡上',0,0);c.restore()}
  ecap(c,'めざせ、268km先の生まれた川!',300,efade(v,2,6.2),22);
}
function edOpen(c,t){
  if(t<OP_T[0])opBorn(c,t);else if(t<OP_T[1])opDown(c,t-OP_T[0]);else if(t<OP_T[2])opSea(c,t-OP_T[1]);else if(t<OP_T[3])opWait(c,t-OP_T[2]);else if(t<OP_T[4])opRise(c,t-OP_T[3]);else opTitle(c,t-OP_T[4]);
}
const endingLen=lap=>lap==='open'?OP_LEN:lap==='yintro'?YI_LEN:lap==='yukon'?YE_LEN:lap===2?ED_T5+VOW_LEN:ENDING_LEN;
function drawEnding(c,t,W,lap){
  ED.W=W;ED.lap=lap;c.save();
  if(lap==='yintro'||lap==='yukon'||lap==='open'){
    const cuts=lap==='open'?OP_T:lap==='yintro'?YI_T:[YE_T,YE_LEN-4];
    (lap==='open'?edOpen:lap==='yintro'?edYIntro:edYukon)(c,t);
    let k=1-t/.9;for(const b of cuts)k=Math.max(k,1-Math.abs(t-b)/.7);
    if(k>0){c.fillStyle=`rgba(13,30,38,${Math.min(1,k*1.25)})`;c.fillRect(0,0,W,360)}
    c.restore();return;
  }
  const vow=lap===2&&t>=ED_T5;
  if(t<ED_T2)edSpawn(c,t);else if(t<ED_T3)edHatch(c,t-ED_T2);else if(t<ED_T4)edRiver(c,t-ED_T3);else if(!vow)edSea(c,t-ED_T4);else edVow(c,t-ED_T5);
  // 場面の切り替えは暗転でつなぐ
  let k=1-t/.9;for(const b of lap===2?[ED_T2,ED_T3,ED_T4,ED_T5]:[ED_T2,ED_T3,ED_T4])k=Math.max(k,1-Math.abs(t-b)/.7);
  if(k>0){c.fillStyle=`rgba(13,30,38,${Math.min(1,k*1.25)})`;c.fillRect(0,0,W,360)}
  c.restore();
}

function seeded(a){return()=>{a=(a*1664525+1013904223)|0;return(a>>>0)/4294967296}}
// 北の森のトウヒ。細長い三角を重ねる
function spruce(n,x,y,h,R){n.fillStyle=R()<.5?'#2f4f3a':'#3a5c42';n.strokeStyle=INK;n.lineWidth=1.8;const w=h*.22;for(let i=0;i<4;i++){const t=y-h+i*h*.22;n.beginPath();n.moveTo(x,t);n.lineTo(x+w*(.5+i*.25),t+h*.34);n.lineTo(x-w*(.5+i*.25),t+h*.34);n.closePath();n.fill();n.stroke()}n.fillStyle='#4a3324';n.fillRect(x-2,y-6,4,6)}
function makeBackground(ch,L,VH,WATER_Y,GROUND,chapters){
  const pal=chapters[ch],S=2;
  const far=document.createElement('canvas'),near=document.createElement('canvas');
  far.width=near.width=L*S;far.height=near.height=VH*S;
  const f=far.getContext('2d'),n=near.getContext('2d');f.scale(S,S);n.scale(S,S);
  const R=seeded(ch*97+13);
  let g=f.createLinearGradient(0,0,0,WATER_Y);g.addColorStop(0,pal.sky[0]);g.addColorStop(1,pal.sky[1]);f.fillStyle=g;f.fillRect(0,0,L,VH);
  if(ch===0){f.fillStyle='#fff0c4';f.beginPath();f.arc(L*.3,120,46,0,6.3);f.fill()}
  f.fillStyle='rgba(255,255,255,.7)';
  for(let i=0;i<L/170;i++){const x=R()*L,y=30+R()*90,w=40+R()*70;f.beginPath();f.ellipse(x,y,w,9+R()*6,0,0,6.3);f.ellipse(x+w*.4,y-8,w*.5,10,0,0,6.3);f.fill()}
  const ridge=(base,amp,col,step)=>{f.fillStyle=col;f.beginPath();f.moveTo(0,WATER_Y);let y=base;for(let x=0;x<=L+step;x+=step){y=base-R()*amp;f.lineTo(x,y)}f.lineTo(L,WATER_Y);f.closePath();f.fill()};
  if(ch===6){f.fillStyle='#ffb35c';f.beginPath();f.arc(L*.62,WATER_Y-40,58,0,6.3);f.fill();f.fillStyle='rgba(255,224,170,.5)';f.beginPath();f.arc(L*.62,WATER_Y-40,84,0,6.3);f.fill()}
  if(ch>=5){
    if(ch===9||ch===7){ridge(80,70,'#e7edf1',80);ridge(140,40,pal.mtn,52)}
    else if(ch===8){ridge(110,50,pal.mtn+'99',48);ridge(140,30,pal.mtn,40)}
    else ridge(165,26,pal.mtn,80);
  }
  else if(ch===3){ridge(70,50,pal.mtn+'99',46);ridge(120,50,pal.mtn,38)}
  else if(ch===4){ridge(90,70,'#d9dfe6',90);ridge(140,40,pal.mtn,46)}
  else if(ch===2){ridge(150,26,pal.mtn,60)}
  else ridge(160,34,pal.mtn,70);
  // 岸
  n.fillStyle=ch===2?'#b7b0a0':ch===5?'#8fa37a':'#6f9a62';n.fillRect(0,WATER_Y-16,L,18);
  n.strokeStyle=INK;n.lineWidth=2;n.beginPath();n.moveTo(0,WATER_Y-16);n.lineTo(L,WATER_Y-16);n.stroke();
  const props={
    0(x){const k=R();if(k<.5){n.fillStyle='#fff';n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x,WATER_Y-96,18,80);n.strokeRect(x,WATER_Y-96,18,80);n.fillStyle='#e3170a';n.fillRect(x,WATER_Y-72,18,18);n.strokeRect(x,WATER_Y-72,18,18);n.beginPath();n.rect(x-3,WATER_Y-110,24,14);n.fillStyle='#ffe56b';n.fill();n.stroke()}else{for(let i=0;i<4;i++){n.strokeStyle='#4f6b45';n.lineWidth=2;n.beginPath();n.moveTo(x+i*5,WATER_Y-16);n.lineTo(x+i*7-6,WATER_Y-40);n.stroke()}}},
    1(x){n.strokeStyle='#3a2a1d';n.lineWidth=4;n.beginPath();n.moveTo(x,WATER_Y);n.lineTo(x,WATER_Y-76);n.stroke();n.strokeStyle='rgba(23,36,44,.45)';n.lineWidth=1;for(let i=0;i<9;i++){n.beginPath();n.moveTo(x,WATER_Y-74+i*9);n.lineTo(x+120,WATER_Y-70+i*9);n.moveTo(x+i*15,WATER_Y-74);n.lineTo(x+i*15,WATER_Y-2);n.stroke()}n.fillStyle='#ff8a2e';n.strokeStyle=INK;n.lineWidth=1.6;for(let i=0;i<5;i++){n.beginPath();n.arc(x+i*30,WATER_Y-74,5,0,6.3);n.fill();n.stroke()}},
    2(x){const k=R();if(k<.34){n.fillStyle='#8e9aa3';n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x-10,WATER_Y-74,10,74);n.strokeRect(x-10,WATER_Y-74,10,74);n.fillRect(x+230,WATER_Y-74,10,74);n.strokeRect(x+230,WATER_Y-74,10,74);n.fillRect(x-40,WATER_Y-90,310,16);n.strokeRect(x-40,WATER_Y-90,310,16)}else{const h=34+R()*50,w=40+R()*40;const cols=['#d9cfc0','#b9c6cf','#d7b8a4','#c6c9a8'];n.fillStyle=cols[R()*4|0];n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x,WATER_Y-16-h,w,h);n.strokeRect(x,WATER_Y-16-h,w,h);n.fillStyle='#7fb7c9';for(let i=0;i<3;i++){n.fillRect(x+8+i*14,WATER_Y-10-h+6,8,8)}}},
    3(x){n.fillStyle='#2f6650';n.strokeStyle=INK;n.lineWidth=2;for(let i=0;i<3;i++){const h=46+R()*26;n.beginPath();n.moveTo(x+i*14-14,WATER_Y-16);n.lineTo(x+i*14,WATER_Y-16-h);n.lineTo(x+i*14+14,WATER_Y-16);n.closePath();n.fill();n.stroke()}},
    5(x){const k=R();if(k<.45){n.strokeStyle='#6b4a2c';n.lineWidth=3;n.beginPath();n.moveTo(x,WATER_Y-16);n.lineTo(x,WATER_Y-62);n.moveTo(x+70,WATER_Y-16);n.lineTo(x+70,WATER_Y-62);n.moveTo(x-6,WATER_Y-58);n.lineTo(x+76,WATER_Y-58);n.stroke();n.fillStyle='#d9472b';n.strokeStyle=INK;n.lineWidth=1.4;for(let i=0;i<6;i++){n.beginPath();n.rect(x+4+i*11,WATER_Y-56,7,22);n.fill();n.stroke()}}else{n.fillStyle='#a8957a';n.strokeStyle=INK;n.lineWidth=2;n.beginPath();n.ellipse(x,WATER_Y-19,34,5,-.05,0,6.3);n.fill();n.stroke()}},
    6(x){spruce(n,x,WATER_Y-16,40+R()*30,R)},
    7(x){spruce(n,x,WATER_Y-16,46+R()*34,R);if(R()<.4)spruce(n,x+22,WATER_Y-16,34+R()*20,R)},
    8(x){if(R()<.35){const w=46,h=40+R()*16,cols=['#c9a96b','#b5835a','#d7c3a0'];n.fillStyle=cols[R()*3|0];n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x,WATER_Y-16-h,w,h);n.strokeRect(x,WATER_Y-16-h,w,h);n.fillRect(x-4,WATER_Y-16-h-14,w+8,14);n.strokeRect(x-4,WATER_Y-16-h-14,w+8,14);n.fillStyle='#7fb7c9';n.fillRect(x+8,WATER_Y-10-h+10,10,12);n.fillRect(x+28,WATER_Y-10-h+10,10,12)}else spruce(n,x,WATER_Y-16,44+R()*30,R)},
    9(x){spruce(n,x,WATER_Y-16,50+R()*36,R);spruce(n,x+20,WATER_Y-16,36+R()*24,R)},
    4(x){n.strokeStyle='#4c3425';n.lineWidth=5;n.beginPath();n.moveTo(x,WATER_Y-16);n.lineTo(x,WATER_Y-56);n.stroke();const c=['#d9402a','#e8842e','#e9b53a'];for(let i=0;i<5;i++){n.fillStyle=c[R()*3|0];n.strokeStyle=INK;n.lineWidth=1.8;n.beginPath();n.arc(x+(R()-.5)*44,WATER_Y-62-R()*30,17+R()*6,0,6.3);n.fill();n.stroke()}},
  }[ch];
  for(let x=170;x<L-170;x+=ch===1?230:130+R()*130)props(x);
  g=n.createLinearGradient(0,WATER_Y,0,GROUND+10);g.addColorStop(0,pal.water[0]);g.addColorStop(1,pal.water[1]);
  n.fillStyle=g;n.fillRect(0,WATER_Y,L,GROUND-WATER_Y+12);
  n.fillStyle=pal.bed;n.fillRect(0,GROUND+8,L,VH-GROUND);
  n.strokeStyle=INK;n.lineWidth=2;n.beginPath();n.moveTo(0,GROUND+8);for(let x=0;x<=L;x+=24)n.lineTo(x,GROUND+8+Math.sin(x*.05)*2.2);n.stroke();
  for(let i=0;i<L/7;i++){const x=R()*L,y=GROUND+14+R()*34,r=2+R()*5;n.fillStyle=['#9c8d7a','#857766','#b3a692','#6f6355'][R()*4|0];n.beginPath();n.ellipse(x,y,r*1.5,r,0,0,6.3);n.fill();if(r>4.5){n.lineWidth=1.2;n.strokeStyle='rgba(23,36,44,.5)';n.stroke()}}
  return{far,near,pal};
}
return{INK,drawActor,drawSchool,drawEnemyBase,drawLoseScene,drawGuardian,drawEnding,ENDING_LEN,endingLen,makeBackground,DRAW,E,rr,poly,line,dot};
})();
