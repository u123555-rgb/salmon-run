window.SALMON=(()=>{
'use strict';
const VH=330,WATER_Y=205,GROUND=282,KB_T=.55;
const GOD_CD=120,GOD_SWEEP=1,GOD_RISE=600; // 守護神は2分に1回。天の川の列が川の端から端まで走る秒数と、のぼる鮭の速さ
// 守護神の3回の攻撃が始まる時刻(呼んでからの秒)。並・上・特上の順。画面の音もこの表で先に予約する
const GOD_HITS=[[1.5,2.2,2.9],[1.4,2.2,3],[1.2,2.3,3.4]];
const TRAIT={fish:'川魚',shell:'カニ',bird:'鳥',beast:'ケモノ',human:'ヒト'};
const LAPS=[{n:'1回目の遡上',m:1,r:1},{n:'4年後の遡上',m:2.5,r:2},{n:'8年後の遡上',m:6,r:3.5},{n:'12年後の遡上(ハード)',m:9,r:5,hard:1,need:2},
// ユーコン川は別の川で、専用のタブから行く。8年後の遡上をクリアするとひらく。fastは絶食ルール
{n:'ユーコン川',btn:'1回目の遡上',m:6,r:4,yukon:1,need:2,fast:1},
// ユーコン川の4年後。ユーコン川を全部クリアするとひらく。絶食のまま、敵の数は12年後と同じく2倍
{n:'ユーコン川 4年後(ハード)',btn:'4年後の遡上(ハード)',m:12,r:7,yukon:1,hard:1,need:4,fast:1}];
// ハードのボスの守護神。体力が30%を切るとよび、体力が50%まで戻る。usesは1戦でよべる回数、lifeは技が続く秒数
const BGOD={
todo:{n:'流氷の大トド',uses:1,life:3.6},
amimoto:{n:'大漁旗の神さま',uses:1,life:3.6},
taisho:{n:'板前の神さま',uses:1,life:3.4},
nushi:{n:'滝の竜神',uses:2,life:3.6},
kibori:{n:'おみやげの大群',uses:3,life:3.8},
};
const GOD_ACT=[3.4,3.5,4.8],FLOE_V=700,SEAL=20,CLASH_T=4; // こちらの守護神が効いている秒数、流氷の速さ、封印の秒数、押し合いの秒数
const CLASH_RATE={todo:4,amimoto:4.5,taisho:5,nushi:5.5,kibori:6}; // 押し合いでボスが1秒に押す回数。これより多く連打すると勝ち
const RARE={N:'基本',R:'白皿',SR:'金皿',UR:'黒皿'};
// 真のサーモン大遡上(トライアル版)。既存の川の15ステージを8年後の強さで、限られた群れでのぼりきる
const TRIAL={lap:2,budget:10000,kinds:10,bonus:30000};
// 名前。種類ごとに順番につける。足りなくなったら二世、三世…
const NICK={shake:'白鮭',ikura:'イクラ',aramaki:'新巻',nigiri:'握り',abari:'炙り',oyako:'親子丼',toba:'とば',hanamagari:'鼻曲がり',gin:'銀鮭',karafuto:'樺太',sakura:'桜鱒',onigiri:'おにぎり',smoke:'スモーク',trout:'トラウト',flake:'フレーク',beni:'紅鮭',ishikari:'石狩',chanchan:'ちゃんちゃん',ashi:'脚',toki:'時鮭',king:'マスノスケ',keiji:'鮭児',osuke:'大助',can:'缶',bcroll:'ロール',maple:'メープル',candy:'キャンディ',steel:'スチール',cedar:'シーダー',yking:'キング'};
const GIVEN='太郎 次郎 花子 三郎 桃子 四郎 梅子 五郎 菊子 六郎 松子 七郎 竹子 八郎 鶴子 九郎 亀子 十郎 百合子 小太郎'.split(' ');
const KAN=n=>{const d='〇一二三四五六七八九';if(n<10)return d[n];const t=n/10|0,o=n%10;return(t>1?d[t]:'')+'十'+(o?d[o]:'')};
// 名札ごとの見た目。「〜子」はリボン(2)、男の子の名前は、そのまま(0)とねじり鉢巻き(1)が交互。大助は代ごとに交互
function accOf(id,i){
  if(id==='osuke')return i%2;
  const g=i%GIVEN.length;if(GIVEN[g].endsWith('子'))return 2;
  return GIVEN.slice(0,g).filter(n=>!n.endsWith('子')).length%2;
}
function nameOf(id,i){
  const base=NICK[id]||UNITS[id].n;
  if(id==='osuke')return`${base}${KAN(i+1)}世`;
  if(id==='ikura')return`イクラ三兄弟 ${GIVEN[i%GIVEN.length]}組${i>=GIVEN.length?KAN((i/GIVEN.length|0)+1)+'世':''}`;
  return base+GIVEN[i%GIVEN.length]+(i>=GIVEN.length?KAN((i/GIVEN.length|0)+1)+'世':'');
}

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

king:{n:'マスノスケ',r:'UR',via:'gacha',cost:900,cd:22,hp:4600,atk:460,rate:2.2,wind:.6,range:115,area:90,sp:26,kb:2,w:90,fx:'bite',
  txt:'キングサーモンの日本での呼び名がマスノスケ。日本の鮭の王。王冠は自前。'},
keiji:{n:'鮭児',r:'UR',via:'gacha',cost:700,cd:20,hp:980,atk:560,rate:1,wind:.3,range:62,sp:92,kb:3,w:40,crit:.5,fx:'bite',
  txt:'一万匹に一匹といわれる幻の若い鮭。脂のりが異常。'},
osuke:{n:'鮭の大助',r:'UR',via:'gacha',cost:1500,cd:40,hp:6500,atk:1300,rate:7.2,wind:1,range:300,area:300,sp:14,kb:2,w:130,kbc:.5,fx:'shout',
  txt:'東北の言い伝えの鮭の王。「鮭の大助、今のぼる」と叫ぶ。'},

// ユーコン川で出会う仲間。yukon:1 はユーコン川がひらくまで回転レーンに流れてこない。yclearはユーコン川のステージ番号
can:{n:'サーモン缶',r:'N',via:{yclear:0},yukon:1,cost:260,cd:10,hp:2400,atk:30,rate:2,wind:.5,range:34,sp:18,kb:2,w:44,onDeath:{id:'shake',n:2},fx:'bite',
  txt:'アラスカの缶詰工場生まれ。とにかくかたい。倒れるとフタが開いて、シロザケが飛び出す。'},
bcroll:{n:'BCロール',r:'N',via:{yclear:4},yukon:1,cost:240,cd:6,hp:380,atk:70,rate:.6,wind:.1,range:30,sp:90,kb:2,w:42,roll:1,fx:'bite',
  txt:'バンクーバー生まれの、焼いた鮭の皮を巻いた寿司。カナダに入ったとたん転がってきた。'},
maple:{n:'メープル鮭',r:'R',via:'gacha',yukon:1,cost:230,cd:7,hp:300,atk:50,rate:1.8,wind:.5,range:140,area:50,sp:34,kb:3,w:44,slow:{p:1,t:3.5},fx:'syrup',
  txt:'メープルシロップをぬって焼いたカナダの鮭。シロップを投げて、敵をべたべたにする。'},
candy:{n:'サーモンキャンディ',r:'R',via:'gacha',yukon:1,cost:90,cd:3,hp:140,atk:30,rate:.9,wind:.25,range:32,sp:60,kb:2,w:34,haste:1,fx:'bite',
  txt:'甘く仕上げた燻製の鮭。まわりの仲間がひとかけらずつもらって、足が速くなる。'},
steel:{n:'スチールヘッド',r:'SR',via:'gacha',yukon:1,cost:380,cd:10,hp:900,atk:150,rate:1.6,wind:.45,range:40,sp:44,kb:3,w:54,kbc:.5,revive:1,fx:'bite',
  txt:'海に下ったニジマス。頭は鋼のようにかたい。卵を産んでも生きのびる体で、一度倒れても起き上がる。'},
cedar:{n:'シーダープランク鮭',r:'SR',via:'gacha',yukon:1,cost:420,cd:11,hp:700,atk:120,rate:.9,wind:.1,range:34,area:60,sp:80,kb:3,w:72,roll:1,kbc:.35,fx:'plank',
  txt:'杉の板にのせて焼かれた鮭。板ごと波に乗って、敵の列に突っこむ。'},
yking:{n:'キングサーモン',r:'UR',via:'gacha',yukon:1,cost:1000,cd:24,hp:5600,atk:420,rate:2,wind:.6,range:110,area:80,sp:28,kb:2,w:96,fat:600,fx:'bite',
  txt:'ユーコン川を3,000kmのぼる鮭の王。体にたくわえた脂は世界一。倒れると、その脂がオキアミになる。'},
};

// 合体。出撃の値札を2つ同時に押した時だけ、2体が1体になる
// 体力と1秒あたりのダメージは元の2体の合計にそろえ、特技を1つ足す(ドリブル:範囲シュート、紅白:オキアミ1.5倍、まぶし:転がりながら範囲)
const FUSE={
dribble:{n:'鮭ドリブル',of:['ashi','onigiri'],hp:640,atk:218,rate:1.4,wind:.35,range:125,area:50,sp:66,kb:4,w:52,kbc:.3,fx:'shoot',
  txt:'脚サーモンが鮭おにぎりをドリブルする。シュートしたおにぎりは足元に戻ってくる。'},
kohaku:{n:'紅白鮭合戦',of:['beni','shake'],hp:590,atk:125,rate:1.1,wind:.3,range:42,sp:50,kb:3,w:50,crit:.3,goldUp:1.5,fx:'bite',
  txt:'紅と白がそろってめでたい。場にいる間、敵を倒した時のオキアミが1.5倍になる。'},
mabushi:{n:'鮭まぶしおにぎり',of:['flake','onigiri'],hp:430,atk:45,rate:.5,wind:.1,range:30,sp:90,kb:2,w:40,roll:1,area:70,fx:'scatter',
  txt:'鮭フレークをまとって転がる。飛び散ったフレークがまわりの敵にも当たる。'},
kok:{n:'キング・オブ・キングス',of:['king','yking'],hp:10200,atk:880,rate:2,wind:.6,range:115,area:100,sp:27,kb:2,w:120,fat:600,kbc:.2,fx:'bite',
  txt:'日本の王マスノスケと、ユーコンの王キングサーモン。同じ種類の王が2匹そろった。倒れると脂がオキアミになる。'},
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
// ユーコン川の敵
wolf:{n:'オオカミ',trait:'beast',hp:600,atk:80,rate:.8,wind:.25,range:30,sp:84,kb:2,gold:120,w:58},
hakuto:{n:'ハクトウワシ',trait:'bird',hp:1100,atk:170,rate:1.8,wind:.55,range:110,area:50,sp:50,kb:2,gold:380,w:62,fly:60,fx:'swoop'},
moose:{n:'ムース',trait:'beast',hp:4000,atk:50,rate:2.4,wind:.8,range:40,sp:16,kb:2,gold:500,w:98},
goose:{n:'カナダガン',trait:'bird',hp:380,atk:55,rate:.55,wind:.15,range:26,sp:70,kb:1,gold:90,w:42,fly:18},
kinhori:{n:'砂金掘り',trait:'human',hp:1300,atk:120,rate:1.6,wind:.5,range:44,sp:34,kb:2,gold:380,w:42},
grizzly:{n:'グリズリー',trait:'beast',hp:7200,atk:460,rate:2.2,wind:.7,range:48,area:50,sp:30,kb:3,gold:1200,w:104},
oyakata:{n:'砂金掘りの親方',trait:'human',boss:1,hp:28000,atk:560,rate:2,wind:.6,range:70,area:70,sp:24,kb:5,gold:2200,w:100},
captain:{n:'外輪船の船長',trait:'human',boss:1,hp:40000,atk:640,rate:2.8,wind:.8,range:150,area:110,sp:18,kb:5,gold:2600,w:110,fx:'splash'},
ogrizzly:{n:'ユーコンの大グリズリー',trait:'beast',boss:1,hp:70000,atk:1300,rate:3,wind:1,range:95,area:130,sp:16,kb:6,gold:5000,w:210},
};
Object.values(ENEMIES).forEach(d=>{d.fx=d.fx||'claw'});

const CHAPTERS=[
{n:'河口',sub:'海のにおいがする',sky:['#ffcf9c','#ff9d7c'],mtn:'#7d6f8c',water:['#2a8ea3','#176477'],bed:'#7a6a56'},
{n:'定置網',sub:'網の中は静かだ',sky:['#bfe4ec','#e8f3df'],mtn:'#7fa39f',water:['#1f7f95','#115367'],bed:'#6a6355'},
{n:'町',sub:'人が多い',sky:['#a9d3ee','#e0eef2'],mtn:'#94a9b5',water:['#4a8f8c','#2c6263'],bed:'#6f6858'},
{n:'大滝',sub:'登る。跳ぶ。また登る',sky:['#7fc2bf','#d6ecd2'],mtn:'#3f7560',water:['#2aa3a0','#10625f'],bed:'#555b4f'},
{n:'源流',sub:'もうすぐ',sky:['#f5d9b8','#e8a68a'],mtn:'#8b5a55',water:['#49b6c0','#1e7788'],bed:'#6b5a4a'},
// ここからユーコン川
{n:'ベーリング海',sub:'ここはどこだ',sky:['#cfe3ee','#f3efe2'],mtn:'#8fa3ad',water:['#3b7d93','#1c4f62'],bed:'#6b6a62'},
{n:'白夜の川',sub:'夜が来ない',sky:['#ffd9a8','#f6efe0'],mtn:'#6d7f6a',water:['#4b8c8f','#25595e'],bed:'#6d6455'},
{n:'国境',sub:'ようこそカナダへ',sky:['#a8d4f0','#e6f2f4'],mtn:'#7a8e86',water:['#4a8d9a','#255967'],bed:'#73654f'},
{n:'外輪船の川',sub:'金を夢見た川',sky:['#b9dcef','#eef0e2'],mtn:'#6a7c63',water:['#3f8b95','#1f5b63'],bed:'#6a5d4b'},
{n:'ホワイトホース',sub:'もうすぐ',sky:['#ffd0a0','#f2e6d6'],mtn:'#5f6f7a',water:['#4fb3bf','#1f7685'],bed:'#655a4c'},
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
// ユーコン川。gimはステージのしかけ(wheel:魚車が仲間をすくう、cold:仲間の足が遅い、paddle:外輪船の波、rapids:急流)
const YUKON=[
{ch:5,km:0,n:'ベーリング海の河口',len:1300,base:5000,reward:600,rules:[W('kamome',2,8),W('azarashi',10,26),W('kamome',0,12,{hp:60,b:3})]},
{ch:5,km:150,n:'魚車の村',len:1350,base:6500,reward:700,gim:'wheel',rules:[W('goose',2,9),W('kamome',4,12),W('wolf',16,18),W('azarashi',24,30)]},
{ch:6,km:800,n:'白夜の川',len:1400,base:8000,reward:800,rules:[W('wolf',2,7),W('hakuto',10,18),W('wolf',0,9,{hp:70,b:2}),W('grizzly',40,50)]},
{ch:6,km:1300,n:'北極圏の線',len:1400,base:9500,reward:850,gim:'cold',rules:[W('moose',2,20),W('wolf',6,10),W('hakuto',14,18)]},
{ch:7,km:1900,n:'国境',len:1450,base:11000,reward:950,rules:[W('goose',0,6,{b:2}),W('moose',10,24),W('kinhori',18,20),W('goose',0,10,{hp:60,b:3})]},
{ch:7,km:2100,n:'ゴールドラッシュの町',len:1500,base:16000,reward:1400,rules:[W('kinhori',2,12),W('wolf',6,12),W('goose',10,14),W('oyakata',0,0,{hp:80,n:1}),W('kinhori',0,10,{hp:50,b:2})]},
{ch:8,km:2400,n:'外輪船の航路',len:1550,base:15400,reward:1600,gim:'paddle',rules:[W('kinhori',2,12),W('hakuto',8,16),W('grizzly',20,34),W('captain',0,0,{hp:80,n:1})]},
{ch:8,km:2600,n:'ファイブフィンガー急流',len:1550,base:24000,reward:1500,gim:'rapids',rules:[W('grizzly',4,22),W('wolf',2,8),W('moose',10,22),W('hakuto',16,18)]},
{ch:9,km:2900,n:'ラバージ湖',len:1600,base:28000,reward:1700,rules:[W('hakuto',2,8),W('hakuto',0,12,{hp:70,b:3}),W('grizzly',10,22),W('goose',4,10)]},
{ch:9,km:3000,n:'ホワイトホースの魚道',len:1700,base:28000,reward:3000,rules:[W('wolf',2,9),W('grizzly',6,18),W('hakuto',10,14),W('ogrizzly',0,0,{hp:85,n:1}),W('captain',0,60,{hp:45,n:1}),W('grizzly',0,14,{hp:45})]},
];
const stagesOf=lap=>LAPS[lap]&&LAPS[lap].yukon?YUKON:STAGES;
// しかけが起きる間隔(秒)
const GIM_EVERY={wheel:9,paddle:12,rapids:10};

const STOM={max:8,income:l=>14+9*(l-1),cap:l=>500+300*(l-1),cost:l=>40+80*l};
const lvMul=l=>1+.2*(l-1);
const lvCost=l=>Math.round(40*Math.pow(l,1.55));
const META={
wall:{n:'群れのきずな',txt:'群れの体力 +20%',max:10},
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
    const s=stagesOf(lap)[si];this.s=s;this.si=si;this.lap=lap;this.cfg=cfg;this.L=s.len;this.time=0;this.over=null;
    this.mul=LAPS[lap].m;this.rand=mulberry(seed??(Math.random()*1e9|0));
    this.pbase={isBase:1,side:1,x:this.L-74,w:96,hp:cfg.baseHp,max:cfg.baseHp,shake:0};
    const eb=Math.round(s.base*this.mul);
    this.ebase={isBase:1,side:-1,x:74,w:96,hp:eb,max:eb,shake:0};
    this.money=0;this.stom=1;this.us=[];this.es=[];this.fx=[];this.queue=[];this.wave=null;
    this.slots=cfg.slots.map(x=>({id:x.id,lv:x.lv,def:UNITS[x.id],cd:0,pool:x.pool?[...x.pool]:null}));
    // 真の遡上。仲間の数がかぎられていて、やられた仲間は戻らない
    this.trial=!!cfg.trial;this.fallen=[];
    this.flood={c:0,need:cfg.floodNeed,dmg:cfg.floodDmg};
    this.rules=s.rules.map(r=>({...r,on:false,cnt:0,next:0}));
    this.kills=0;this.lastHit=null;this.god={cd:0,act:0};
    this.hard=!!LAPS[lap].hard;this.bgod=null;this.clash=null;this.seal=0;
    this.fast=!!LAPS[lap].fast;this.gimT=GIM_EVERY[s.gim]||0;
    // 絶食ルール:胃袋は最大まで広げた状態で満腹から始まる。たまる速さは胃袋Lv1の半分のまま
    if(this.fast){this.stom=STOM.max;this.money=this.cap}
  }
  get income(){return this.fast?STOM.income(1)*this.cfg.income*.5:STOM.income(this.stom)*this.cfg.income}
  get cap(){return STOM.cap(this.stom)}
  canDeploy(i){const s=this.slots[i];return s&&!this.over&&!this.clash&&s.cd<=0&&this.money>=s.def.cost&&this.us.length<40&&!(s.pool&&!s.pool.length)}
  deploy(i){
    if(!this.canDeploy(i))return false;
    const s=this.slots[i];this.money-=s.def.cost;s.cd=s.def.cd;
    const n=s.def.count||1;s.last=[];s.at=this.time;
    // 名札。同じ組で出た仲間(イクラ三兄弟)は同じ名札を持ち、全員やられた時に力尽きる
    const crew=s.pool?[{s:i,nm:s.pool.shift()}]:null;
    for(let k=0;k<n;k++){const u=this.addUnit(s.id,s.lv,this.pbase.x-44-k*16);if(crew){u.crew=crew;u.acc=accOf(s.id,crew[0].nm)}s.last.push(u)}
    this.fx.push({k:'spawn',x:this.pbase.x-44,side:1});
    return true;
  }
  // 2つの値札の仲間が合体できるなら、その合体の名前を返す
  fuseOf(a,b){const x=this.slots[a]?.id,y=this.slots[b]?.id;if(!x||!y||x===y)return null;for(const[k,f]of Object.entries(FUSE))if(f.of.includes(x)&&f.of.includes(y))return k;return null}
  // 値札aを押した直後に値札bが押された時。aで出たばかりの仲間を引っこめて、合体した1体を出す
  fuse(a,b,fid){
    const sa=this.slots[a],sb=this.slots[b];
    if(!this.canDeploy(b)||!sa.last||this.time-sa.at>.5||!sa.last.every(u=>u.alive))return false;
    this.money-=sb.def.cost;sb.cd=sb.def.cd;
    const ca=sa.last[0].crew;
    for(const u of sa.last)u.alive=false;this.us=this.us.filter(u=>u.alive);sa.last=null;
    const x=this.pbase.x-44,f=this.addUnit(fid,Math.round((sa.lv+sb.lv)/2),x);this.fx.push({k:'fuse',x,id:fid});
    // 合体した1体は、2匹ぶんの名札を持つ
    if(sb.pool)f.crew=[...(ca||[]),{s:b,nm:sb.pool.shift()}];
    return true;
  }
  addUnit(id,lv,x){
    const d=UNITS[id]||FUSE[id],m=lvMul(lv);
    const e=this.make(d,1,x,d.hp*m,d.atk*m);e.shield=!!d.shield;e.revive=!!d.revive;e.lv=lv;e.id=id;
    this.us.push(e);return e;
  }
  addEnemy(id){
    const d=ENEMIES[id],m=this.mul;
    const e=this.make(d,-1,this.ebase.x+50,d.hp*m,d.atk*m);e.id=id;
    if(this.hard&&BGOD[id])e.bg=BGOD[id].uses;
    this.es.push(e);
    if(d.boss){this.fx.push({k:'boss',name:d.n});for(const u of this.us)this.knock(u);this.fx.push({k:'shock'});}
  }
  make(d,side,x,hp,atk){
    return{def:d,side,dir:-side,x,lane:this.rand()*16|0,hp,maxhp:hp,atk,range:d.range,w:d.w,state:'move',timer:0,kbDone:0,
      walk:this.rand()*6,hurt:0,slow:0,stun:0,anim:0,lunge:0,alive:true,seed:this.rand()};
  }
  canUp(){return this.stom<STOM.max&&this.money>=STOM.cost(this.stom)&&!this.over}
  upStom(){if(!this.canUp())return false;this.money-=STOM.cost(this.stom);this.stom++;return true}
  // 鮭の守護神。広告のあとに呼ぶ。kindは0並 1上 2特上。姿が見えてから少しして効く
  canGod(){return this.god.cd<=0&&!this.over&&!(this.seal>0)&&!this.clash}
  summon(kind){
    if(!this.canGod())return false;
    this.god.cd=GOD_CD;
    // ボスの守護神が出ている最中なら、守護神どうしの押し合いになる
    if(this.bgod){this.clash={b:this.bgod,pk:kind,first:'b'};this.fx.push({k:'clash'});return true}
    this.startGod(kind);return true;
  }
  startGod(kind){
    this.god.act=GOD_ACT[kind];this.fx.push({k:'god',kind,t:this.time});
    const later=(t,fn)=>this.queue.push({t,fn,tag:'p'});
    const hitAll=(r,fn)=>{for(const e of this.es){if(!e.alive)continue;const boss=!!e.def.boss;this.fx.push({k:'hit',x:e.x,y:GROUND-40-(e.def.fly||0),big:1});this.damage(e,e.maxhp*r[boss?1:0]);if(e.alive&&fn)fn(e,boss)}};
    // 並:3連の波。1回ごとに押し返す
    if(kind===0)for(let i=0;i<3;i++)later(GOD_HITS[0][i],()=>{this.fx.push({k:'godhit',kind});hitAll([.4/3,.04],e=>this.knock(e))});
    // 上:流星が3回に分けて当たる。最初の1回で時が止まる
    if(kind===1){later(GOD_HITS[1][0],()=>{this.money=this.cap});for(let i=0;i<3;i++)later(GOD_HITS[1][i],()=>{this.fx.push({k:'godhit',kind});hitAll([.1,.035],(e,boss)=>{if(i===0)e.stun=boss?2.5:5})})}
    // 特上:鮭が川から空へのぼる列が、手前から敵の方へ3回走る。当たった敵は消える(ボスは削る)
    if(kind===2){
      later(GOD_HITS[2][0],()=>{this.fx.push({k:'godhit',kind});for(const u of this.us)u.hp=u.maxhp});
      const from=this.pbase.x,span=from-this.ebase.x;
      for(let i=0;i<3;i++)later(GOD_HITS[2][i],()=>{
        this.fx.push({k:'sweep'});
        // 列が来たら敵の真下から鮭がのぼり、その鮭が体に届いた時に当たる
        for(const e of this.es)later(Math.max(0,(from-e.x)/span)*GOD_SWEEP,()=>{
          if(!e.alive)return;this.fx.push({k:'riser',x:e.x});
          later((60+(e.def.fly||0))/GOD_RISE,()=>{if(e.alive)this.damage(e,e.maxhp*(e.def.boss?.12:1))});
        });
        later(GOD_SWEEP,()=>{this.ebase.hp-=this.ebase.max*.05;this.ebase.shake=.3});
      });
    }
  }
  // ハードのボスが追い詰められた時。こちらの守護神が効いている最中なら押し合いになる
  bossGod(e){
    e.bg--;e.pend=false;
    const g={who:e,id:e.id,act:BGOD[e.id].life};
    if(this.god.act>0){this.clash={b:g,pk:-1,first:'p'};this.fx.push({k:'clash'});return}
    this.startBGod(g);
  }
  startBGod(g){
    const e=g.who,kb=e.def.kb;this.bgod=g;
    if(e.alive){e.hp=Math.max(e.hp,e.maxhp*.5);e.kbDone=Math.min(kb-1,Math.floor(.5*kb));this.fx.push({k:'word',x:e.x,s:'回復',col:'#8dff9c'})}
    this.fx.push({k:'bgod',id:g.id,x:e.x,name:e.def.n,god:BGOD[g.id].n,t:this.time});
    const later=(t,fn)=>this.queue.push({t,fn,tag:'b'});
    const allies=()=>this.us.filter(u=>u.alive&&u.state!=='air');
    // 前にいる仲間ほど敵に近い(xが小さい)。先頭からn体
    const front=n=>allies().sort((a,b)=>a.x-b.x).slice(0,n);
    const hurt=(u,r)=>{this.fx.push({k:'hit',x:u.x,y:GROUND-34,big:1});u.by=g.id;this.damage(u,u.maxhp*r)};
    const bx=e.x;
    switch(g.id){
      // 大トドが腹ばいで落ち、流氷が手前へすべる。当たった仲間は凍って止まる
      case'todo':later(1.3,()=>{this.fx.push({k:'bghit',id:g.id});
        for(const u of allies())later(Math.max(0,u.x-bx)/FLOE_V,()=>{if(!u.alive)return;hurt(u,.25);if(u.alive){u.stun=4;u.ice=1}})});break;
      // 大きな網で前の仲間をすくい、群れのところまで放り投げる。落ちた時にダメージ
      case'amimoto':later(1.9,()=>{this.fx.push({k:'bghit',id:g.id});
        for(const u of front(8)){u.state='air';u.by=g.id;u.air={t:0,d:1.1,x0:u.x,x1:this.pbase.x-44}}});break;
      // すし皿がつぎつぎ飛んできて、前の仲間に当たる
      case'taisho':for(let i=0;i<4;i++)later(1.3+i*.4,()=>{this.fx.push({k:'bghit',id:g.id});for(const u of front(6))hurt(u,.18)});break;
      // 水の柱と竜神が手前へ進みながら3回体当たり。そのたびに押し返す
      case'nushi':for(let i=0;i<3;i++)later(1.3+i*.7,()=>{this.fx.push({k:'bghit',id:g.id});for(const u of allies()){hurt(u,.12);if(u.alive)this.knock(u)}});break;
      // 木彫りの熊が空から降ってくる。しばらく鉄砲水と守護神が使えない
      case'kibori':later(1.2,()=>{this.seal=SEAL});
        for(let i=0;i<3;i++)later(1.4+i*.7,()=>{this.fx.push({k:'bghit',id:g.id});for(const u of allies())hurt(u,.12);this.pbase.hp-=this.pbase.max*.04;this.pbase.shake=.3});break;
    }
  }
  // 押し合いの決着。勝てばボスの守護神を打ち消し、負ければこちらの守護神が消える
  resolveClash(win){
    const c=this.clash;if(!c)return;this.clash=null;
    if(win){
      if(c.first==='b'){this.queue=this.queue.filter(q=>q.tag!=='b');this.bgod=null;this.startGod(c.pk)}
    }else if(c.first==='p'){this.queue=this.queue.filter(q=>q.tag!=='p');this.god.act=0;this.startBGod(c.b)}
    this.fx.push({k:'clashEnd',win,first:c.first});
  }
  canFire(){return this.flood.c>=this.flood.need&&!this.over&&!this.wave&&!(this.seal>0)&&!this.clash}
  fire(){if(!this.canFire())return false;this.flood.c=0;this.wave={x:this.pbase.x,hit:new Set()};this.fx.push({k:'wave'});return true}

  nearest(e){
    const d=e.dir,foes=e.side>0?this.es:this.us;let best=null,bd=1e9;
    for(const t of foes){
      if(!t.alive||t.state==='kb'||t.state==='air')continue;
      const dx=(t.x-e.x)*d;if(dx<-24)continue;
      const g=Math.max(0,dx-t.w/2);
      if(g<=e.range&&g<bd){bd=g;best=t}
    }
    const b=e.side>0?this.ebase:this.pbase,gap=(b.x-e.x)*d-b.w/2;
    if(gap<=e.range&&gap<bd)best=b;
    return best;
  }
  step(dt){
    if(this.over||this.clash)return;
    this.time+=dt;
    this.money=Math.min(this.cap,this.money+this.income*dt);
    for(const s of this.slots)s.cd=Math.max(0,s.cd-dt);
    this.flood.c=Math.min(this.flood.need,this.flood.c+dt);
    this.god.cd=Math.max(0,this.god.cd-dt);this.god.act=Math.max(0,this.god.act-dt);this.seal=Math.max(0,this.seal-dt);
    if(this.bgod&&(this.bgod.act-=dt)<=0)this.bgod=null;
    // 守護神を待っているボス(別のボスの守護神が出ていた)がいれば、空いた時によぶ
    if(!this.bgod&&!this.clash){const w=this.es.find(e=>e.alive&&e.pend);if(w){this.bossGod(w);if(this.clash)return}}
    this.pbase.shake=Math.max(0,this.pbase.shake-dt);this.ebase.shake=Math.max(0,this.ebase.shake-dt);
    if(this.gimT&&(this.gimT-=dt)<=0){this.gimT=GIM_EVERY[this.s.gim];this.gimmick()}
    const pct=this.ebase.hp/this.ebase.max*100;
    for(const r of this.rules){
      if(r.done)continue;
      if(!r.on){if(this.time>=r.t&&pct<=(r.hp??100)){r.on=true;r.next=0}else continue}
      r.next-=dt;
      if(r.next<=0){
        const b=(r.b||1)*(this.hard&&!ENEMIES[r.e].boss?2:1),cap=this.hard?60:40;
        for(let i=0;i<b;i++)this.queue.push({t:i*.45,fn:()=>{if(this.es.length<cap)this.addEnemy(r.e)}});
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
    // 真の遡上で、出せる仲間も川にいる仲間もいなくなったら負け
    else if(this.trial&&!this.us.length&&this.slots.every(s=>!s.pool.length)){this.over='lose';this.wiped=true}
  }
  // 川にいて生きている名札。勝った時に群れへ戻る
  survivors(){const m=new Set();for(const u of this.us)if(u.alive&&u.crew)for(const c of u.crew)m.add(c);return[...m]}
  // ステージのしかけ
  gimmick(){
    const allies=this.us.filter(u=>u.alive&&u.state!=='air');
    if(this.s.gim==='wheel'){
      // 魚車が先頭の仲間をすくい上げ、群れのところまで放る
      const u=allies.sort((a,b)=>a.x-b.x)[0];if(!u)return;
      this.fx.push({k:'gim',s:'魚車にすくわれた!',x:u.x});u.state='air';u.air={t:0,d:1,x0:u.x,x1:this.pbase.x-44,dmg:.15};
    }else if(this.s.gim==='paddle'){
      this.fx.push({k:'gim',s:'外輪船の波!'});for(const u of allies){this.damage(u,u.maxhp*.06);if(u.alive)this.knock(u,1)}
    }else if(this.s.gim==='rapids'){
      this.fx.push({k:'gim',s:'急流!'});for(const u of allies)this.knock(u,1);for(const e of this.es)if(e.alive&&!e.def.boss)this.knock(e,1);
    }
  }
  act(e,dt){
    if(!e.alive)return;
    const d=e.def;e.anim+=dt;e.hurt=Math.max(0,e.hurt-dt);e.lunge=Math.max(0,e.lunge-dt*4);
    if(e.stun>0){e.stun-=dt;if(e.stun<=0)e.ice=0;return}
    // 網で放り投げられている間。落ちた所でダメージを受ける
    if(e.state==='air'){const a=e.air;a.t+=dt;const q=Math.min(1,a.t/a.d);e.x=a.x0+(a.x1-a.x0)*q;
      if(q>=1){const r=a.dmg??.35;e.state='move';e.air=null;this.fx.push({k:'hit',x:e.x,y:GROUND-30,big:1});this.damage(e,e.maxhp*r)}return}
    if(e.slow>0)e.slow-=dt;
    if(e.haste>0)e.haste-=dt;
    const sp=d.sp*(e.slow>0?.4:1)*(e.haste>0?1.35:1)*(e.side>0&&this.s.gim==='cold'?.8:1);
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
        if(t){if(d.area)this.fx.push({k:'atk',fx:d.fx,x:e.x,tx:t.x,side:e.side,lane:e.lane,fly:0});this.strike(e,t);e.timer=d.rate}
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
    if(d.haste)for(const a of this.us)if(a.alive&&Math.abs(a.x-e.x)<=140){if(!(a.haste>0))this.fx.push({k:'haste',x:a.x});a.haste=4}
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
      t.hp-=dmg;t.shake=.2;if(a.side<0)this.lastHit=a.id;this.fx.push({k:'hit',x:t.x+a.dir*-30,y:GROUND-60});return;
    }
    if(t.state==='kb'||t.state==='air')return;
    if(d.vs&&d.vs[t.def.trait])dmg*=d.vs[t.def.trait];
    const crit=d.crit&&this.rand()<d.crit;
    if(crit)dmg*=2;
    this.fx.push({k:crit?'crit':'hit',x:t.x,y:GROUND-30-(t.def.fly||0),big:dmg>400});
    if(a.side<0)t.by=a.id;
    this.damage(t,dmg);
    if(!t.alive)return;
    if(d.slow&&this.rand()<d.slow.p)t.slow=d.slow.t;
    if(d.stun&&!t.def.boss&&this.rand()<d.stun.p)t.stun=d.stun.t;
    if(d.kbc&&this.rand()<d.kbc)this.knock(t);
  }
  damage(t,dmg){
    if(!t.alive)return;
    t.hp-=dmg;t.hurt=.12;
    // ハードのボスは体力が30%を切ると守護神をよぶ。よべる回数が残っている間は倒れない
    if(t.bg>0&&t.hp<t.maxhp*.3){t.hp=Math.max(t.hp,1);if(!t.pend){t.pend=true;if(!this.bgod&&!this.clash)this.bossGod(t)}}
    if(t.hp<=0){
      if(t.revive){t.revive=false;t.hp=t.maxhp*.5;t.kbDone=0;this.fx.push({k:'revive',x:t.x});this.knock(t);return}
      if(t.shield){t.shield=false;t.hp=1;this.fx.push({k:'guard',x:t.x});}
      else{this.kill(t);return}
    }
    const kb=t.def.kb,done=Math.min(kb-1,Math.floor((1-t.hp/t.maxhp)*kb));
    if(done>t.kbDone){t.kbDone=done;this.knock(t)}
  }
  knock(t,quiet){if(!t.alive)return;t.state='kb';t.timer=KB_T;if(!quiet)this.fx.push({k:'kb',x:t.x,y:GROUND-40})}
  kill(t){
    t.alive=false;this.fx.push({k:'die',e:t});
    // 名札の仲間が全員やられたら、その仲間は力尽きる
    if(t.crew)for(const c of t.crew)if(!this.us.some(u=>u.alive&&u.crew&&u.crew.includes(c))){const s=this.slots[c.s];this.fallen.push(c);this.lastFall=t.by;this.fx.push({k:'fallen',s:c.s,id:s.id,nm:c.nm,by:t.by})}
    if(t.side<0){this.kills++;this.money=Math.min(this.cap,this.money+t.def.gold*(this.us.some(u=>u.alive&&u.def.goldUp)?1.5:1))}
    else{if(t.def.fat){this.money=Math.min(this.cap,this.money+t.def.fat);this.fx.push({k:'fat',x:t.x,n:t.def.fat})}}
    if(t.side>0&&t.def.onDeath){const o=t.def.onDeath;for(let i=0;i<o.n;i++){const u=this.addUnit(o.id,t.lv,t.x+(i-3)*14);u.state='move'}}
  }
}
return{TRIAL,nameOf,accOf,YUKON,stagesOf,VH,WATER_Y,GROUND,GOD_HITS,GOD_SWEEP,BGOD,FLOE_V,CLASH_T,CLASH_RATE,TRAIT,LAPS,RARE,UNITS,FUSE,ENEMIES,CHAPTERS,STAGES,STOM,META,lvMul,lvCost,metaCost,battleCfg,Battle};
})();
