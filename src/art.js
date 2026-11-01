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
  if(o.brow)line(c,[[ex-5,ey-3-o.brow],[ex+5,ey-5+o.brow]],2.4);
  dot(c,ex,ey,o.eye||2.3);
  if(o.hook){c.beginPath();c.moveTo(-L*.44,-H*.3);c.quadraticCurveTo(-L*.62,-H*.2,-L*.56,H*.3);c.quadraticCurveTo(-L*.52,H*.02,-L*.4,H*.02);c.closePath();P(c,o.head||back);line(c,[[-L*.5,H*.34],[-L*.34,H*.2]],2.6);for(let i=0;i<3;i++)line(c,[[-L*.46+i*4,H*.16],[-L*.45+i*4,H*.26]],1.6,'#fff')}
  else line(c,[[-L*.5,H*.1],[-L*.4,H*.17]],2);
  const flap=Math.sin(p.t*7)*.25;
  c.save();c.translate(-L*.14,H*.22);c.rotate(.5+flap);poly(c,[[0,-3],[L*.18,0],[0,4]],fin);c.restore();
  if(o.after)o.after(c,L,H);
  c.restore();
}
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
  E(c,-16,-6,8.5,8,o.body);
  poly(c,[[-23,-8],[-34,-4],[-22,-2]],o.beak);
  dot(c,-18,-8,1.9);
  line(c,[[-13,-13],[-22,-11]],2.2);
  if(o.tip)poly(c,[[16,-4],[22,-6],[20,0]],o.tip,0);
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
};
function drawActor(c,id,p){(DRAW[id]||DRAW.shake)(c,p)}

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

function seeded(a){return()=>{a=(a*1664525+1013904223)|0;return(a>>>0)/4294967296}}
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
  if(ch===3){ridge(70,50,pal.mtn+'99',46);ridge(120,50,pal.mtn,38)}
  else if(ch===4){ridge(90,70,'#d9dfe6',90);ridge(140,40,pal.mtn,46)}
  else if(ch===2){ridge(150,26,pal.mtn,60)}
  else ridge(160,34,pal.mtn,70);
  // 岸
  n.fillStyle=ch===2?'#b7b0a0':'#6f9a62';n.fillRect(0,WATER_Y-16,L,18);
  n.strokeStyle=INK;n.lineWidth=2;n.beginPath();n.moveTo(0,WATER_Y-16);n.lineTo(L,WATER_Y-16);n.stroke();
  const props={
    0(x){const k=R();if(k<.5){n.fillStyle='#fff';n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x,WATER_Y-96,18,80);n.strokeRect(x,WATER_Y-96,18,80);n.fillStyle='#e3170a';n.fillRect(x,WATER_Y-72,18,18);n.strokeRect(x,WATER_Y-72,18,18);n.beginPath();n.rect(x-3,WATER_Y-110,24,14);n.fillStyle='#ffe56b';n.fill();n.stroke()}else{for(let i=0;i<4;i++){n.strokeStyle='#4f6b45';n.lineWidth=2;n.beginPath();n.moveTo(x+i*5,WATER_Y-16);n.lineTo(x+i*7-6,WATER_Y-40);n.stroke()}}},
    1(x){n.strokeStyle='#3a2a1d';n.lineWidth=4;n.beginPath();n.moveTo(x,WATER_Y);n.lineTo(x,WATER_Y-76);n.stroke();n.strokeStyle='rgba(23,36,44,.45)';n.lineWidth=1;for(let i=0;i<9;i++){n.beginPath();n.moveTo(x,WATER_Y-74+i*9);n.lineTo(x+120,WATER_Y-70+i*9);n.moveTo(x+i*15,WATER_Y-74);n.lineTo(x+i*15,WATER_Y-2);n.stroke()}n.fillStyle='#ff8a2e';n.strokeStyle=INK;n.lineWidth=1.6;for(let i=0;i<5;i++){n.beginPath();n.arc(x+i*30,WATER_Y-74,5,0,6.3);n.fill();n.stroke()}},
    2(x){const k=R();if(k<.34){n.fillStyle='#8e9aa3';n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x-10,WATER_Y-74,10,74);n.strokeRect(x-10,WATER_Y-74,10,74);n.fillRect(x+230,WATER_Y-74,10,74);n.strokeRect(x+230,WATER_Y-74,10,74);n.fillRect(x-40,WATER_Y-90,310,16);n.strokeRect(x-40,WATER_Y-90,310,16)}else{const h=34+R()*50,w=40+R()*40;const cols=['#d9cfc0','#b9c6cf','#d7b8a4','#c6c9a8'];n.fillStyle=cols[R()*4|0];n.strokeStyle=INK;n.lineWidth=2;n.fillRect(x,WATER_Y-16-h,w,h);n.strokeRect(x,WATER_Y-16-h,w,h);n.fillStyle='#7fb7c9';for(let i=0;i<3;i++){n.fillRect(x+8+i*14,WATER_Y-10-h+6,8,8)}}},
    3(x){n.fillStyle='#2f6650';n.strokeStyle=INK;n.lineWidth=2;for(let i=0;i<3;i++){const h=46+R()*26;n.beginPath();n.moveTo(x+i*14-14,WATER_Y-16);n.lineTo(x+i*14,WATER_Y-16-h);n.lineTo(x+i*14+14,WATER_Y-16);n.closePath();n.fill();n.stroke()}},
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
return{INK,drawActor,drawSchool,drawEnemyBase,drawLoseScene,makeBackground,DRAW,E,rr,poly,line,dot};
})();
