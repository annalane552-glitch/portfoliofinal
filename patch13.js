const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// ─────────────────────────────────────────────
// 1. HERO — switch from flex-centre to flex-start + explicit top padding
//    Centres were collapsing on short laptop screens and hitting the nav
// ─────────────────────────────────────────────
rep('hero align-items flex-start',
  '#hero{min-height:100svh;position:relative;overflow:hidden;display:flex;align-items:center;border-radius:0 0 2.5rem 2.5rem}',
  '#hero{min-height:100svh;position:relative;overflow:hidden;display:flex;align-items:flex-start;border-radius:0 0 2.5rem 2.5rem}'
);

// h-inner: generous top padding clears fixed nav, balanced bottom
rep('h-inner padding top clearance',
  '.h-inner{position:relative;z-index:2;width:100%;padding:6rem 4.5rem 5rem;display:flex;justify-content:space-between;align-items:center}',
  '.h-inner{position:relative;z-index:2;width:100%;padding:clamp(6rem,14vh,9rem) 4.5rem 5rem;display:flex;justify-content:space-between;align-items:center}'
);

// ─────────────────────────────────────────────
// 2. RESPONSIVE CSS — fix h-inner overrides that zeroed top padding
// ─────────────────────────────────────────────
rep('resp 1280 h-inner fix',
  '.h-inner{padding:0 3rem 4.5rem}',
  '.h-inner{padding:clamp(6rem,14vh,9rem) 3rem 5rem}'
);

rep('resp 1100 h-inner fix',
  '.h-inner{padding:0 2.5rem 4rem}',
  '.h-inner{padding:clamp(6rem,13vh,8rem) 2.5rem 4rem}'
);

// ─────────────────────────────────────────────
// 3. CURSOR — swap window.load → DOMContentLoaded
//    load waits for all images (40MB); DOMContentLoaded fires in <1 second
//    Also: only reveal cursor dot after first mousemove (no stuck dot at 0,0)
// ─────────────────────────────────────────────
rep('cursor DOMContentLoaded',
  `window.addEventListener('load',function(){
  if(!window.matchMedia('(pointer:fine)').matches)return;
  var c=document.getElementById('cur');
  if(!c)return;
  // Only hide OS cursor after page is fully loaded
  document.body.classList.add('js-cursor');
  c.classList.add('c-ready');
  var lastCheck=0,lastDark=false,lastLink=false;`,
  `document.addEventListener('DOMContentLoaded',function(){
  if(!window.matchMedia('(pointer:fine)').matches)return;
  var c=document.getElementById('cur');
  if(!c)return;
  document.body.classList.add('js-cursor');
  var shown=false,lastCheck=0,lastDark=false,lastLink=false;`
);

// Only show dot after first mousemove (prevents stuck dot at 0,0)
rep('cursor show on first move',
  `  document.addEventListener('mousemove',function(e){
    c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';`,
  `  document.addEventListener('mousemove',function(e){
    c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';
    if(!shown){shown=true;c.classList.add('c-ready');}`,
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
