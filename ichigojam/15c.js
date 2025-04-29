const f = Math.floor;

function read(txt){
 let i = 0;
 const data = [];
 txt.replace(/\r\n|\r/g,"\n");
 
 function line(){
  let num = 0;
  const prgm = [];
  let n;
  while(!(Number.isNaN(n = Number(txt.charAt(i))) 
       || txt.charAt(i - 1) == " ")){
   if(txt.charAt(i) != " ") num = num * 10 + n;
   i++;
  }
  while(!"\n".includes(txt.charAt(i))){
   prgm.push(txt.charCodeAt(i));
   i++;
  }
  prgm.push(0);
  if(prgm.length % 2 == 0) prgm.push(0);
  return [num % 256, f(num / 256), prgm.length - 1].concat(prgm);
 }
 
 while(txt.charAt(i) != ""){
  data.push(...line());
 }
 return data.map(n =>"無有濃網薄羽壁化消水改垂丸塗白全分書家頭足知柿終除／＼脱左右上下 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ{|}~削⠀⠁⠈⠉⠂⠃⠊⠋⠐⠑⠘⠙⠒⠓⠚⠛点横縦＋⫞⊦⫠⫟╭╮╰╯◤◥◣◢￥。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワンﾞﾟ←→↑↓すはくだ抜円十握犬宇音渦ろ船波ぷ撲金箱段扉人大走［赱］苺".charAt(n)).join("");
}

document.getElementById("conv").addEventListener("click", ()=>{
 document.getElementById("output").value = read(document.getElementById("input").value);
 document.getElementById("copy").disabled = false;
 document.getElementById("copy").addEventListener("click", e =>{
  navigator.clipboard.writeText(document.getElementById("output").value);
  e.target.textContent += "✔";
 });
});
