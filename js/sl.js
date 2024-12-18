///--- SL.js ---/// simulate SL command in UNIX

/* Copyright 1993,1998,2014 Toyoda Masashi (mtoyoda@acm.org)
** 
** Everyone is permitted to do anything on this program including copying,
** modifying, and improving, unless you try to pretend that you wrote it.
** i.e., the above copyright notice has to appear in all copies.
** THE AUTHOR DISCLAIMS ANY RESPONSIBILITY WITH REGARD TO THIS SOFTWARE.
*/


const smk=[["(   )", "(    )", "(    )", "(   )", "(  )",
            "(  )" , "( )"   , "( )"   , "()"   , "()"  ,
            "O"    , "O"     , "O"     , "O"    , "O"   ,
            " "],
           ["(@@@)", "(@@@@)", "(@@@@)", "(@@@)", "(@@)",
            "(@@)" , "(@)"   , "(@)"   , "@@"   , "@@"  ,
            "@"    , "@"     , "@"     , "@"    , "@"   ,
            " "]];

const D51_1="      ====        ________                ___________  ";
const D51_2="  _D _|  |_______/        \\__I_I_____===__|_________| ";
const D51_3="   |(_)---  |   H\\________/ |   |        =|___ ___|      _________________         ";
const D51_4="   /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A  ";
const D51_5="  |      |  |   H  |__--------------------| [___] |   =|                        |  ";
const D51_6="  | ________|___H__/__|_____/[][]~\\_______|       |   -|________________________|_ ";
const D51_7="  |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_ ";

const wheel1=[
 "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
 "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
 "__/ =| o |=-O=====O=====O=====O \\ ____Y___________|__",
 "__/ =| o |=-~O=====O=====O=====O\\ ____Y___________|__",
 "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
 "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__"
];
const coal8="|__________________________|_ ";
const wheel2=[
 " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
 " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
 " |/-=|___|=O=====O=====O=====O   |_____/~\\___/        ",
 " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
 " |/-=|___|=   O=====O=====O=====O|_____/~\\___/        ",
 " |/-=|___|=    ||    ||    ||    |_____/~\\___/        "
];
const coal9="  |_D__D__D_|  |_D__D__D_|   ";
const wheel3=[
 "  \\_/      \\O=====O=====O=====O_/      \\_/            ",
 "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ",
 "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ",
 "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ",
 "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ",
 "  \\_/      \\_O=====O=====O=====O/      \\_/            "
];
const coal10="   \\_/   \\_/    \\_/   \\_/    ";

const indent="                                                                                            ";

let smoke=["","","","","",""];
let S=[];
let dy=[2,  1, 1, 1, 0, 0, 0, 0, 0, 0,
        0,  0, 0, 0, 0, 0];
let dx=[-2, -1, 0, 1, 1, 1, 1, 1, 2, 2,
        2,  2, 2, 3, 3, 3];

let start;
let sum=0;
let prev=-1;

function mvaddstr(obj){
 if(obj.x>0){
  while(smoke[obj.y].length<obj.x) smoke[obj.y]+=" ";
  smoke[obj.y]+=smk[obj.kind][obj.ptrn];
 }
}

function frame(now){
 let timer=Math.floor((performance.now()-start)/45);
 let scroll=Math.floor(timer);
 if(scroll>prev){
  let str=(smoke[0]).slice(8)+"\n"+
      (smoke[1]).slice(8)+"\n"+
      (smoke[2]).slice(8)+"\n"+
      (smoke[3]).slice(8)+"\n"+
      (smoke[4]).slice(8)+"\n"+
      (smoke[5]).slice(8)+"\n"+
      (indent+D51_1).slice(scroll)+"\n"+
      (indent+D51_2).slice(scroll)+"\n"+
      (indent+D51_3).slice(scroll)+"\n"+
      (indent+D51_4).slice(scroll)+"\n"+
      (indent+D51_5).slice(scroll)+"\n"+
      (indent+D51_6).slice(scroll)+"\n"+
      (indent+D51_7).slice(scroll)+"\n"+
      (indent+wheel1[5-scroll%6]+coal8).slice(scroll)+"\n"+
      (indent+wheel2[5-scroll%6]+coal9).slice(scroll)+"\n"+
      (indent+wheel3[5-scroll%6]+coal10).slice(scroll)+"\n";
  
  document.getElementById("sl").innerHTML=str;
  
  if(scroll%4==0){
   smoke=["","","","","",""];

   for(let i=sum-1;i>=0;i--){
    S[i].x += dx[S[i].ptrn];
    S[i].y -= dy[S[i].ptrn];
    S[i].ptrn += (S[i].ptrn<15)?1:0;
    
    mvaddstr(S[i]);
   }
   S[sum]={"x":104-scroll,"y":5,"ptrn":0,"kind":sum%2};
   mvaddstr(S[sum]);
   sum++;
  }
  prev=scroll;
 }
 if(timer<190){
  requestAnimationFrame(frame);
 }else{
  ///document.getElementById("run").disabled=false;
  startAnime();
 }
}

///  document.getElementById("run").addEventListener("click",startAnime);
function startAnime(){
 ///document.getElementById("run").disabled=true;
 
 sum=0;
 prev=-1;
 S=[];
 start=performance.now();
 requestAnimationFrame(frame);
}

addEventListener("load",startAnime);
addEventListener("load",resize);

addEventListener("resize",resize);

function resize(){
 const wh=Math.min(window.innerWidth,window.innerHeight);
 document.getElementById('sl').style.width=wh*0.95+"px";
 document.getElementById('sl').style["font-size"]=wh*0.021+"px";
}
