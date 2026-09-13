(() => {
  const C = CONFIG;
  const $ = id => document.getElementById(id);

  $("openingTitle").textContent = C.openingTitle || C.recipientName;
  $("openingSubtitleTitle").textContent = C.openingSubtitleTitle || "";
  $("openingSubtitle").textContent = C.openingSubtitle;
  $("passwordHint").textContent = C.passwordHint;

  $("birthdaySmall").textContent=C.birthdaySmall; $("birthdayTitle").textContent=C.birthdayTitle;
  $("birthdayName").textContent=C.birthdayName; $("birthdayText").textContent=C.birthdayText;
  $("bouquetSmall").textContent=C.bouquetSmall; $("bouquetTitle").textContent=C.bouquetTitle;
  $("bouquetText").textContent=C.bouquetText; $("bouquetMessage").textContent=C.bouquetMessage;
  $("memoriesSmall").textContent=C.memoriesSmall; $("memoriesTitle").textContent=C.memoriesTitle;
  $("playlistSmall").textContent=C.playlistSmall; $("playlistTitle").textContent=C.playlistTitle;
  $("letterSmall").textContent=C.letterSmall; $("letterTitle").textContent=C.letterTitle;
  $("letterText").textContent=C.letterText; $("finalSmall").textContent=C.finalSmall;
  $("finalTitle").textContent=C.finalTitle; $("finalText").textContent=C.finalText;
  $("finalSignature").textContent=C.finalSignature;

  // Password dots are generated from the actual password length.
  const password = String(C.password);
  const dots = $("pinDots");
  for(let i=0;i<password.length;i++){
    const dot=document.createElement("span");
    dot.className="pin-dot";
    dots.appendChild(dot);
  }

  let entered="";
  let busy=false;
  const error=$("pinError");

  function updateDots(){
    [...dots.children].forEach((d,i)=>d.classList.toggle("filled",i<entered.length));
  }
  function showError(){
    error.textContent="Wrong password ♡ Try again!";
    error.classList.add("show");
    if(navigator.vibrate) navigator.vibrate([60,40,60]);
    setTimeout(()=>error.classList.remove("show"),1500);
  }
  function unlock(){
    if(busy)return;
    busy=true;
    $("lock").classList.add("fade-out");
    setTimeout(()=>{
      $("lock").classList.add("hidden");
      $("birthday").classList.remove("hidden");
      busy=false;
      spawnHearts(18);
    },450);
  }
  function press(k){
    if(k==="clear"){entered="";error.classList.remove("show");updateDots();return;}
    if(k==="back"){entered=entered.slice(0,-1);error.classList.remove("show");updateDots();return;}
    if(!/^\d$/.test(k) || entered.length>=password.length)return;
    entered+=k; updateDots();
    if(entered.length===password.length){
      if(entered===password) unlock();
      else{
        showError();
        setTimeout(()=>{entered="";updateDots();},650);
      }
    }
  }
  $("keypad").addEventListener("click",e=>{
    const b=e.target.closest("button"); if(b) press(b.dataset.key);
  });

  document.querySelectorAll("[data-next]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=btn.dataset.next;
    document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
    $(id).classList.remove("hidden");
    window.scrollTo(0,0);
    spawnHearts(8);
  }));

  let mi=0;
  function renderMemory(){
    const item=C.memories[mi] || {};
    $("memoryImage").src="assets/images/"+item.image;
    $("memoryCaption").textContent=item.caption||"♡";
    $("memoryCounter").textContent=`${mi+1} / ${C.memories.length}`;
  }
  $("prevPhoto").onclick=()=>{mi=(mi-1+C.memories.length)%C.memories.length;renderMemory()};
  $("nextPhoto").onclick=()=>{mi=(mi+1)%C.memories.length;renderMemory()};
  renderMemory();

  const audio=$("audio"), list=$("songList");
  C.songs.forEach((s,i)=>{
    const row=document.createElement("div"); row.className="song";
    row.innerHTML=`<div><strong>${escapeHtml(s.title)}</strong><small style="display:block;color:#cdbdca;margin-top:3px">${escapeHtml(s.artist)}</small></div><button>▶</button>`;
    row.addEventListener("click",()=>playSong(i));
    list.appendChild(row);
  });
  let current=-1;
  function playSong(i){
    const s=C.songs[i]; current=i;
    audio.src="assets/music/"+s.file; audio.play().catch(()=>{});
    $("songTitle").textContent=s.title; $("songArtist").textContent=s.artist; $("playBtn").textContent="Ⅱ";
    [...list.children].forEach((x,j)=>x.classList.toggle("active",j===i));
  }
  $("playBtn").onclick=()=>{
    if(!audio.src && C.songs.length) return playSong(0);
    if(audio.paused){audio.play();$("playBtn").textContent="Ⅱ"}else{audio.pause();$("playBtn").textContent="▶"}
  };
  audio.onended=()=>{if(current+1<C.songs.length)playSong(current+1);else $("playBtn").textContent="▶"};

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
  function spawnHearts(count){
    const p=$("particles");
    for(let i=0;i<count;i++){
      const e=document.createElement("span");e.className="particle";e.textContent=Math.random()>.25?"♡":"✦";
      e.style.left=(Math.random()*100)+"%";e.style.top=(70+Math.random()*30)+"%";
      e.style.fontSize=(12+Math.random()*18)+"px";e.style.animationDuration=(3+Math.random()*4)+"s";
      p.appendChild(e);setTimeout(()=>e.remove(),7500);
    }
  }
  spawnHearts(12);
})();