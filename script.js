let entered="",scene=1,memory=0,song=0;
const $=x=>document.getElementById(x);
const audio=$("audio");

$("openingTitle").textContent=CONFIG.openingTitle;
$("openingName").textContent=CONFIG.recipientName;
$("openingSubtitle").textContent=CONFIG.openingSubtitle;
$("hint").textContent=CONFIG.passwordHint;
$("birthdaySmall").textContent=CONFIG.birthdaySmall;
$("birthdayTitle").textContent=CONFIG.birthdayTitle;
$("birthdayName").textContent=CONFIG.birthdayName;
$("birthdayText").textContent=CONFIG.birthdayText;
$("bouquetSmall").textContent=CONFIG.bouquetSmall;
$("bouquetTitle").textContent=CONFIG.bouquetTitle;
$("bouquetText").textContent=CONFIG.bouquetText;
$("bouquetMessage").textContent=CONFIG.bouquetMessage;
$("memoriesSmall").textContent=CONFIG.memoriesSmall;
$("memoriesTitle").textContent=CONFIG.memoriesTitle;
$("playlistSmall").textContent=CONFIG.playlistSmall;
$("playlistTitle").textContent=CONFIG.playlistTitle;
$("letterSmall").textContent=CONFIG.letterSmall;
$("letterTitle").textContent=CONFIG.letterTitle;
$("letterText").textContent=CONFIG.letterText;
$("sender").textContent=CONFIG.senderName;
$("finalSmall").textContent=CONFIG.finalSmall;
$("finalTitle").textContent=CONFIG.finalTitle;
$("finalText").textContent=CONFIG.finalText;
$("finalSignature").textContent=CONFIG.finalSignature;

document.querySelectorAll(".keypad button").forEach(b=>b.onclick=()=>{
  const k=b.dataset.key;
  if(k==="clear") entered="";
  else if(k==="back") entered=entered.slice(0,-1);
  else if(entered.length<CONFIG.password.length) entered+=k;
  renderPin();
  if(entered===CONFIG.password) unlock();
});
function renderPin(){
  [...$("pin").children].forEach((x,i)=>x.classList.toggle("filled",i<entered.length));
}
function unlock(){
  $("lock").style.display="none";
  $("loader").classList.remove("hidden");
  setTimeout(()=>{
    $("loader").style.display="none";
    $("site").classList.remove("hidden");
    showScene(1); startFloaters();
  },1200);
}
function showScene(n){
  scene=n;
  document.querySelectorAll(".scene").forEach((s,i)=>s.style.display=(i===n-1?"grid":"none"));
  $("progress").style.width=((n-1)/5*100)+"%";
  if(n===3) renderMemory();
  if(n===4) renderSongs();
  window.scrollTo({top:0,behavior:"instant"});
}
function nextScene(){showScene(Math.min(6,scene+1))}
function replay(){location.reload()}

function flowerBurst(){
  for(let i=0;i<22;i++) setTimeout(()=>{
    const x=document.createElement("span"); x.className="float";
    x.textContent=["🌸","🌷","✿","✦","♡"][Math.floor(Math.random()*5)];
    x.style.left=Math.random()*100+"vw"; x.style.bottom="-20px";
    x.style.fontSize=(14+Math.random()*20)+"px";
    x.style.animationDuration=(2.5+Math.random()*2.5)+"s";
    document.body.appendChild(x); setTimeout(()=>x.remove(),6000);
  },i*50);
}
function startFloaters(){setInterval(()=>{if(scene>=1){const x=document.createElement("span");x.className="float";x.textContent=Math.random()>.5?"✦":"♡";x.style.left=Math.random()*100+"vw";x.style.bottom="-20px";x.style.animationDuration=(4+Math.random()*4)+"s";x.style.opacity=".45";document.body.appendChild(x);setTimeout(()=>x.remove(),9000)}},900)}

function renderMemory(){
  const m=CONFIG.memories[memory];
  $("memoryImg").src="assets/images/"+m.image;
  $("memoryCaption").textContent=m.caption;
  $("memoryDots").innerHTML=CONFIG.memories.map((_,i)=>`<span class="dot ${i===memory?"on":""}"></span>`).join("");
}
function memoryNext(){memory=(memory+1)%CONFIG.memories.length;renderMemory()}
function memoryPrev(){memory=(memory-1+CONFIG.memories.length)%CONFIG.memories.length;renderMemory()}
let touchX=0;
$("polaroid").addEventListener("touchstart",e=>touchX=e.changedTouches[0].clientX,{passive:true});
$("polaroid").addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45){dx<0?memoryNext():memoryPrev()}},{passive:true});

function renderSongs(){
 const s=CONFIG.songs[song];
 $("trackTitle").textContent=s.title;
 $("artist").textContent=s.artist;
 audio.src="assets/music/"+s.file;
 $("tracks").innerHTML=CONFIG.songs.map((x,i)=>`<div class="track ${i===song?"active":""}" onclick="chooseSong(${i})">♫ <b>${x.title}</b> <span>— ${x.artist}</span></div>`).join("");
 $("seek").value=0;
}
function chooseSong(i){song=i;renderSongs();playSong()}
function playSong(){audio.play().then(()=>{$("play").textContent="Ⅱ";$("vinyl").classList.add("playing")}).catch(()=>{})}
function toggleSong(){
 if(audio.paused) playSong();
 else {audio.pause();$("play").textContent="▶";$("vinyl").classList.remove("playing")}
}
function nextSong(){song=(song+1)%CONFIG.songs.length;renderSongs()}
function prevSong(){song=(song-1+CONFIG.songs.length)%CONFIG.songs.length;renderSongs()}
function fmt(t){if(!isFinite(t))return"0:00";return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0")}
audio.addEventListener("loadedmetadata",()=>{$("duration").textContent=fmt(audio.duration)});
audio.addEventListener("timeupdate",()=>{if(audio.duration){$("seek").value=audio.currentTime/audio.duration*100;$("current").textContent=fmt(audio.currentTime)}});
$("seek").oninput=()=>{if(audio.duration)audio.currentTime=$("seek").value/100*audio.duration};
audio.addEventListener("ended",()=>{nextSong();playSong()});
