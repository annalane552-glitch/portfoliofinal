const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// ─────────────────────────────────────────────
// 1. PADDY POWER — remove banner, use right panel instead
// ─────────────────────────────────────────────
rep('PP: banner → widePanel',
  'D.pp.banner=true;D.pp.imgFit="contain";',
  'D.pp.widePanel=true;D.pp.imgFit="contain";D.pp.imgBg="var(--ink)";'
);

// Apply imgBg to the right panel in oM
rep('oM apply imgBg',
  `layout&&(p.widePanel?layout.classList.add('wide-panel'):layout.classList.remove('wide-panel'));`,
  `layout&&(p.widePanel?layout.classList.add('wide-panel'):layout.classList.remove('wide-panel'));
  const mRight=document.getElementById('mSideImgs');
  if(mRight) mRight.style.background=p.imgBg||'';`
);

// ─────────────────────────────────────────────
// 2. DOWNLOAD CV BUTTON — cream solid, gold on hover
// ─────────────────────────────────────────────
rep('CT-CTA cream default',
  `border:1px solid rgba(245,240,232,.25);color:var(--cream);padding:1rem 2.4rem;border-radius:50px;font-size:.62rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;position:relative;overflow:hidden;transition:color .4s var(--ease),border-color .4s;white-space:nowrap;align-self:flex-start}`,
  `border:1.5px solid var(--cream);background:var(--cream);color:var(--ink);padding:1rem 2.4rem;border-radius:50px;font-size:.62rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;position:relative;overflow:hidden;transition:color .4s var(--ease),border-color .4s;white-space:nowrap;align-self:flex-start}`
);

// ─────────────────────────────────────────────
// 3. ABOUT — vertically centre text column
// ─────────────────────────────────────────────
rep('ab-inner align-items centre',
  'align-items:start}',
  'align-items:center}'
);

rep('ab-content align-self auto',
  'justify-content:center;padding-top:0;align-self:start}',
  'justify-content:center;padding-top:0;align-self:auto}'
);

// ─────────────────────────────────────────────
// 4. COMPREHENSIVE RESPONSIVE CSS — insert before </style>
// ─────────────────────────────────────────────
const RESPONSIVE_CSS = `

/* ── RESPONSIVE SUPPLEMENT ── */

/* Large screens / external monitors — keep as-is, these are baseline */

/* Laptop / mid monitor (≤1280px) */
@media(max-width:1280px){
  .ct-left{padding:4.5rem 4rem}
  .h-inner{padding:0 3rem 4.5rem}
  .h-scroll{right:3rem}
}

/* Laptop (≤1100px) */
@media(max-width:1100px){
  #work{padding:5rem 2rem}
  #stats{padding:5rem 2rem}
  #about{padding:5rem 2rem}
  #credentials{padding:5rem 2rem}
  .ct-left{padding:4rem 3rem}
  .h-inner{padding:0 2.5rem 4rem}
  .m-layout{grid-template-columns:1fr 240px}
  .m-layout.wide-panel{grid-template-columns:1fr 340px}
  .m-left{padding:2.2rem 2.4rem}
  .ab-inner{gap:2.5rem}
}

/* Tablet (≤860px) */
@media(max-width:860px){
  .ct-headline{font-size:clamp(2.4rem,6vw,4rem)}
  .menu-card-title{font-size:clamp(1.6rem,5vw,2.4rem)}
  .ab-name{font-size:clamp(3.5rem,9vw,6rem)}
  .h-inner{padding:0 2rem 3.5rem}
  .m-layout.wide-panel{grid-template-columns:1fr 280px}
}

/* Mobile large (≤600px) */
@media(max-width:600px){
  #work{padding:3.5rem 1.2rem}
  #stats{padding:3.5rem 1.2rem}
  #about{padding:3.5rem 1.2rem}
  #credentials{padding:3.5rem 1.2rem}
  .p-intro{margin-bottom:2.2rem}
  .ct-left{padding:3rem 1.5rem}
  .ct-right{min-height:45vw}
  .ct-val{font-size:.92rem}
  .ab-name{font-size:clamp(3rem,10vw,5rem)}
  .menu-card{padding:2.2rem 1.8rem}
  .menu-card-title{font-size:clamp(1.5rem,6vw,2.2rem)}
  .m-h{font-size:clamp(2rem,7vw,3.2rem)}
  .m-left{padding:1.8rem 1.6rem}
  .m-result{padding:1.4rem 1.6rem}
  .m-pill{padding:.6rem 1.4rem}
  .m-pill strong{font-size:1.4rem}
  .m-banner img{max-height:200px}
  .ab-inner{gap:2rem}
  .ab-photo-main{aspect-ratio:3/2}
}

/* Mobile small (≤480px) */
@media(max-width:480px){
  #hero{border-radius:0}
  .h-inner{padding:0 1.2rem 3rem}
  .h-scroll{display:none}
  .h-badge{width:80px;height:80px}
  #work{padding:2.8rem .9rem}
  #stats{padding:2.8rem .9rem}
  #about{padding:2.8rem .9rem}
  #credentials{padding:2.8rem .9rem}
  .ct-left{padding:2.5rem 1.2rem}
  .s-heading{font-size:clamp(2rem,8vw,3.2rem)}
  .s-sub{font-size:.72rem}
  .ab-sm-row{gap:.3rem}
  .ab-photos{gap:.3rem}
  .menu-card{padding:2rem 1.4rem}
  .menu-section-hd{margin:1.6rem 0 1.1rem}
  .m-close{top:.6rem;right:.6rem;width:38px;height:38px}
  .ct-headline{font-size:clamp(2rem,9vw,3rem)}
  .m-layout{grid-template-columns:1fr}
  .m-right{display:none}
  .p-card{border-radius:.9rem}
  footer p{font-size:.48rem}
  .m-h{font-size:clamp(1.9rem,8vw,2.8rem)}
  .m-txt{font-size:.78rem}
}`;

rep('Add responsive CSS',
  '\n</style>',
  RESPONSIVE_CSS + '\n</style>'
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
