addEventListener("load",()=>{
 const txt=document.getElementById("txt");
 const trm=document.getElementById("trm");
 const wrp=document.getElementById("trmwrap");
 const win=document.getElementById("trmwin");

 let written="";
 let undo="";
 let processing=false;
 
 const applyTxt=()=>{
  if(txt.value.startsWith(written)){
   undo=txt.value;
  }
  else {
   txt.value=undo;
   txt.selectionStart=txt.selectionEnd=written.length;
   return false;
  }

  let dec="";

  if(txt.selectionStart==txt.selectionEnd){
   if(txt.selectionStart<written.length) txt.selectionStart=txt.selectionEnd=written.length;
  }

  for(let i=0;i<=txt.value.length;i++){
   const ltr=txt.value.charAt(i);
   
   if(i==txt.selectionStart){
    dec+="<span class=\"cursor\">";
    if(ltr=="" || ltr=="\n") dec+=" ";
   }
   
   if(ltr=="\n") dec+="<br>";
   else dec+=ltr;

   if(i==txt.selectionEnd) dec+="</span>";
  }

  dec+="<br><br><br><br><br><br><br><br><br>";
  
  trm.innerHTML=dec;
  wrp.style.height=trm.clientHeight+"px";
  return true;
 };

 const scrollWin=()=>win.scroll(0,trm.clientHeight-win.clientHeight);
 
 ["keydown","touchend","mouseup","mousemove","keyup"]
  .forEach(ev=>txt.addEventListener(ev,applyTxt));

 ["input","keydown"]
  .forEach(ev=>txt.addEventListener(ev,scrollWin));

 txt.addEventListener('input',async (ev)=>{
  if((!processing) && txt.value.startsWith(written) && ev.inputType=="insertLineBreak"){
   let bf=written;
   txt.value=txt.value.slice(0,txt.selectionStart-1)+txt.value.slice(txt.selectionStart)+"\n";
   written=txt.value;
   processing=true;
   write(await send(txt.value.slice(bf.length).trim()));
   processing=false;
   write("\nftp >");
  }
  applyTxt();
 });

 const write=(str)=>{
  written=txt.value+str;
  txt.value=written;
  txt.selectionStart=txt.selectionEnd=written.length;
 };

 write("Google Drive FTP by @ryqjufq0xfffrog\n");
 write("ftp >");
});

function send(com){
 /// dummy :-)
 return new Promise(resolv=>{
  console.log(com);
  setTimeout(resolv,5000,com.split('').map(v=>v+v).join(''));
 });
}
