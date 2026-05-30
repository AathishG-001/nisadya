/* ══ CONFIG — only file you edit each year ══ */
const CONFIG = {
  logos: ["1aIR3Y9QXJZ8E8eG2rquYECnUoL07Mxsz",""],  // Drive File IDs: ["ID1","ID2","ID3"]
  hero: { images: [], videos: [] },
  sheets: { eventsSheetId:"1TuzSodeSOcgWiHBhuqymosAHQMkEuYPXnrlyYz_gVR4", scheduleSheetId:"1TuzSodeSOcgWiHBhuqymosAHQMkEuYPXnrlyYz_gVR4" },
  sheetTabs: { events:"Events", schedule:"Schedule" },
  instagramReels: ["https://www.instagram.com/nisadya.nitt/p/DVOlctWidVl/","https://www.instagram.com/nisadya.nitt/p/DVOk_0ZiTdb/","https://www.instagram.com/nisadya.nitt/p/DVOklPPiYot/"
    // "https://www.instagram.com/reel/REEL_ID/",
  ]
};

/* ── HELPERS ── */
const driveImg = id=>`https://drive.google.com/thumbnail?id=${id}&sz=w800`;
const driveVid = id=>`https://drive.google.com/uc?export=download&id=${id}`;
const sheetUrl = (sid,tab)=>`https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
function parseCSV(txt){
  const rows=[];
  txt.trim().split('\n').forEach((line,i)=>{
    if(!i)return;
    const cols=[];let cur='',q=false;
    for(const ch of line){if(ch==='"'){q=!q;}else if(ch===','&&!q){cols.push(cur.trim());cur='';}else cur+=ch;}
    cols.push(cur.trim());if(cols.some(Boolean))rows.push(cols);
  });
  return rows;
}
function mapEvent(r){return{name:r[0]||'',thumb:r[1]||'',date:r[2]||'',details:r[3]||'',rules:(r[4]||'').split('|').map(s=>s.trim()).filter(Boolean),incharge:r[5]||'',contact:r[6]||'',unstop:r[7]||'#'};}

/* ── PAGE TRANSITION — CSS only, no overlay div ── */
function initPageTransition(){
  // Remove any leftover overlay from old versions
  document.querySelectorAll('.page-transition').forEach(el => el.remove());

  // Intercept internal links — fade body out, then navigate
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href]');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') ||
       href.startsWith('mailto') || href.startsWith('javascript') || href.startsWith('tel')) return;
    e.preventDefault();
    document.body.style.transition = 'opacity 0.35s ease';
    document.body.style.opacity = '0';
    setTimeout(function(){ location.href = href; }, 360);
  });

  // Fade in on arrival
  document.body.style.opacity = '0';
  document.body.style.transition = 'none';
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    });
  });
}

/* ── LOGO ── */
function initLogo(){
  const logos=(CONFIG.logos||[]).filter(Boolean);
  document.querySelectorAll('.logo-area').forEach(el=>{
    el.innerHTML=logos.length
      ?logos.map(id=>`<img src="${driveImg(id)}" class="logo-img" alt="Logo"/>`).join('')
      :'<span class="wordmark">NISADYA</span>';
  });
}

/* ── THEME ── */
function initTheme(){
  const t=localStorage.getItem('nisadya-theme')||'dark';
  document.documentElement.setAttribute('data-theme',t);_syncTheme(t);
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')||'dark';
  const nxt=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',nxt);
  localStorage.setItem('nisadya-theme',nxt);_syncTheme(nxt);
}
function _syncTheme(t){document.querySelectorAll('.theme-btn').forEach(b=>{b.textContent=t==='dark'?'☀️':'🌙';});}

/* ── NAV ── */
function initNav(){
  window.addEventListener('scroll',()=>{
    document.getElementById('navbar')?.classList.toggle('scrolled',scrollY>50);
    // scroll progress
    const bar=document.querySelector('.scroll-progress-bar');
    if(bar){const pct=(scrollY/(document.body.scrollHeight-innerHeight))*100;bar.style.width=pct+'%';}
  });
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active');});
}
function toggleMenu(){
  document.getElementById('ham').classList.toggle('open');
  document.getElementById('mobMenu').classList.toggle('open');
  document.body.style.overflow=document.getElementById('mobMenu').classList.contains('open')?'hidden':'';
}

/* ── CURSOR ── */
function initCursor(){
  const dot=document.querySelector('.cur-dot'),ring=document.querySelector('.cur-ring');
  if(!dot||!ring)return;
  let mx=-300,my=-300,rx=-300,ry=-300,started=false;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(!started){started=true;dot.classList.add('on');ring.classList.add('on');}
  });
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.tilt,.event-card,.btn,.ig-cell'))ring.classList.add('h');});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.tilt,.event-card,.btn,.ig-cell'))ring.classList.remove('h');});
  (function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;dot.style.left=mx+'px';dot.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
}

/* ── REVEAL ── */
function initReveal(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:.08});
  document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>obs.observe(el));
}
function reObserve(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:.06});
  document.querySelectorAll('.rv:not(.on),.rvl:not(.on),.rvr:not(.on)').forEach(el=>obs.observe(el));
}

/* ── 3D TILT ── */
function initTilt(){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale3d(1.03,1.03,1.03)`;
      const s=card.querySelector('.tilt-shine');
      if(s){s.style.setProperty('--mx',`${(x+.5)*100}%`);s.style.setProperty('--my',`${(y+.5)*100}%`);}
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='perspective(900px) rotateY(0) rotateX(0) scale3d(1,1,1)';});
  });
}

/* ── MAGNETIC ── */
function initMagnetic(){
  document.querySelectorAll('.mag').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.35}px,${(e.clientY-r.top-r.height/2)*.35}px)`;});
    btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
  });
}

/* ── PARALLAX ── */
function initParallax(){
  const els=document.querySelectorAll('[data-parallax]');
  if(!els.length)return;
  window.addEventListener('scroll',()=>{els.forEach(el=>{el.style.transform=`translateY(${scrollY*(parseFloat(el.dataset.parallax)||.3)}px)`;});});
}

/* ── HORIZONTAL SCROLL TEXT ── */
function initScrollText(){
  const els=document.querySelectorAll('.scroll-text');
  if(!els.length)return;
  window.addEventListener('scroll',()=>{
    els.forEach(el=>{
      const rect=el.closest('section')?.getBoundingClientRect();
      if(!rect)return;
      const prog=1-(rect.bottom/(innerHeight+rect.height));
      el.style.transform=`translateX(${prog*-200}px)`;
    });
  });
}

/* ── COUNTER ANIMATION ── */
function animateCounters(){
  document.querySelectorAll('.counter').forEach(el=>{
    const target=parseFloat(el.dataset.target);const suffix=el.dataset.suffix||'';
    let start=0;const dur=1800;const step=timestamp=>{
      if(!start)start=timestamp;
      const prog=Math.min((timestamp-start)/dur,1);
      const val=Math.floor(prog*target);
      el.textContent=val+(prog===1?suffix:'');
      if(prog<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ── SEARCH ── */
const STATIC_IDX=[
  {tag:'Home',title:'Nisadya – National Management Conclave',snippet:'500+ participants, 30+ colleges, 10+ events, 2 days.',url:'index.html'},
  {tag:'About',title:'What is Nisadya?',snippet:'Annual national management fest by DoMS, NIT Tiruchirappalli.',url:'about.html'},
  {tag:'About',title:'NIT Tiruchirappalli',snippet:'Established 1964. Premier technical institution.',url:'about.html'},
  {tag:'About',title:'Department of Management Studies',snippet:'Rigorous MBA. Vittiya finance club. Nisadya national fest.',url:'about.html'},
  {tag:'Events',title:'Browse All Events',snippet:'Competitions, case studies, finance, marketing, strategy.',url:'events.html'},
  {tag:'Schedule',title:'Event Schedule – Day 1 & Day 2',snippet:'Full programme with venues and timings for both days.',url:'schedule.html'},
  {tag:'Contact',title:'Location – NIT Tiruchirappalli',snippet:'NH 67, Thuvakudi, Tiruchirappalli – 620 015, Tamil Nadu.',url:'contact.html'},
  {tag:'Instagram',title:'@nisadya.nitt',snippet:'Official Instagram. Reels, highlights, BTS from Nisadya.',url:'instagram.html'},
];
window.SEARCH_IDX=[...STATIC_IDX];
function addSearchItems(items){window.SEARCH_IDX=[...STATIC_IDX,...items];}
function initSearch(){
  const inp=document.getElementById('srchInp');if(!inp)return;
  inp.addEventListener('input',e=>_doSearch(e.target.value));
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openSearch();}if(e.key==='Escape')closeSearch();});
  document.getElementById('srchOverlay')?.addEventListener('click',e=>{if(e.target===document.getElementById('srchOverlay'))closeSearch();});
}
function openSearch(){document.getElementById('srchOverlay').classList.add('open');document.getElementById('srchInp').focus();document.body.style.overflow='hidden';}
function closeSearch(){document.getElementById('srchOverlay').classList.remove('open');document.getElementById('srchInp').value='';document.getElementById('srchResults').innerHTML='';document.body.style.overflow='';}
function _hi(txt,q){return txt.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'gi'),'<mark>$1</mark>');}
function _doSearch(q){
  const res=document.getElementById('srchResults'),ql=q.trim().toLowerCase();
  if(!ql){res.innerHTML='<div class="srch-hint">Type to search…</div>';return;}
  const hits=window.SEARCH_IDX.filter(i=>i.title.toLowerCase().includes(ql)||i.snippet.toLowerCase().includes(ql)||(i.tag||'').toLowerCase().includes(ql));
  if(!hits.length){res.innerHTML=`<div class="srch-empty">No results for "${q}"</div>`;return;}
  res.innerHTML=hits.map(i=>`<a href="${i.url}" class="srch-item" onclick="closeSearch()"><div class="srch-tag">${i.tag}</div><div class="srch-title">${_hi(i.title,q)}</div><div class="srch-snip">${_hi(i.snippet,q)}</div></a>`).join('');
}

/* ── NAV + FOOTER HTML ── */
function renderNav(p){
  return`
<div class="scroll-progress"><div class="scroll-progress-bar"></div></div>
<nav id="navbar">
  <a href="index.html" class="nav-logo"><div class="logo-area"></div></a>
  <ul class="nav-links">
    <li><a href="index.html" ${p==='index'?'class="active"':''}>Home</a></li>
    <li><a href="about.html" ${p==='about'?'class="active"':''}>About</a></li>
    <li><a href="events.html" ${p==='events'?'class="active"':''}>Events</a></li>
    <li><a href="schedule.html" ${p==='schedule'?'class="active"':''}>Schedule</a></li>
    <li><a href="instagram.html" ${p==='instagram'?'class="active"':''}>Instagram</a></li>
    <li><a href="contact.html" ${p==='contact'?'class="active"':''}>Contact</a></li>
  </ul>
  <div class="nav-r">
    <button class="nav-icon theme-btn" onclick="toggleTheme()"></button>
    <button class="nav-icon" onclick="openSearch()" title="Ctrl+K">🔍</button>
    <a href="events.html" class="nav-cta">Register Now</a>
    <div class="ham" id="ham" onclick="toggleMenu()"><span></span><span></span><span></span></div>
  </div>
</nav>
<div class="mob-menu" id="mobMenu">
  <a href="index.html" onclick="toggleMenu()">Home</a>
  <a href="about.html" onclick="toggleMenu()">About</a>
  <a href="events.html" onclick="toggleMenu()">Events</a>
  <a href="schedule.html" onclick="toggleMenu()">Schedule</a>
  <a href="instagram.html" onclick="toggleMenu()">Instagram</a>
  <a href="contact.html" onclick="toggleMenu()">Contact</a>
</div>
<div class="srch-overlay" id="srchOverlay">
  <div class="srch-box"><div class="srch-wrap"><span class="si">🔍</span><input class="srch-inp" id="srchInp" type="text" placeholder="Search events, schedule, about…" autocomplete="off"/><button class="srch-x" onclick="closeSearch()">✕</button></div></div>
  <div class="srch-results" id="srchResults"><div class="srch-hint">Type to search…</div></div>
</div>
<div class="cur-dot"></div>
<div class="cur-ring"></div>`;
}
function renderFooter(){
  return`<footer>
  <div class="ft-logo">NISADYA</div>
  <div class="ft-tag">Department of Management Studies · NIT Tiruchirappalli</div>
  <ul class="ft-links">
    <li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li>
    <li><a href="events.html">Events</a></li><li><a href="schedule.html">Schedule</a></li>
    <li><a href="instagram.html">Instagram</a></li><li><a href="contact.html">Contact</a></li>
  </ul>
  <div class="ft-copy">© 2025 Nisadya · Department of Management Studies · NIT Tiruchirappalli</div>
</footer>`;
}
function boot(page,pageInit){
  document.getElementById('nav-root').innerHTML=renderNav(page);
  document.getElementById('foot-root').innerHTML=renderFooter();
  initTheme();initLogo();initNav();initReveal();initCursor();
  initTilt();initMagnetic();initParallax();initSearch();initPageTransition();initScrollText();
  if(pageInit)pageInit();
}
