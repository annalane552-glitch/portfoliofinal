const fs = require('fs');
let html = fs.readFileSync('c:/Users/annal/Documents/Portfolio/index.html', 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: replace a CSS block by its section comment boundary
// ─────────────────────────────────────────────────────────────────────────────
function replaceCSSBlock(html, startComment, endComment, newCSS) {
  const a = html.indexOf(startComment);
  const b = html.indexOf(endComment, a);
  if (a === -1 || b === -1) { console.log('  MISS:', startComment); return html; }
  return html.slice(0, a) + newCSS + '\n\n' + html.slice(b);
}

function replaceHTMLBlock(html, startComment, endComment, newHTML) {
  const a = html.indexOf(startComment);
  const b = html.indexOf(endComment, a);
  if (a === -1 || b === -1) { console.log('  MISS:', startComment); return html; }
  return html.slice(0, a) + newHTML + '\n\n' + html.slice(b);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MODAL CSS — elevated editorial
// ─────────────────────────────────────────────────────────────────────────────
html = replaceCSSBlock(html, '/* ── MODAL ── */', '/* ── STATS ── */', `/* ── MODAL ── */
.m-bg{position:fixed;inset:0;z-index:500;background:rgba(8,0,2,.93);backdrop-filter:blur(32px);display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;pointer-events:none;transition:opacity .4s var(--ease)}
.m-bg.o{opacity:1;pointer-events:all}
.modal{background:var(--cream);border-radius:2rem;width:100%;max-width:1040px;max-height:92vh;overflow-y:auto;overflow-x:hidden;position:relative;transform:translateY(36px) scale(.97);transition:transform .48s var(--ease);scrollbar-width:thin;scrollbar-color:rgba(201,168,76,.25) transparent}
.m-bg.o .modal{transform:none}

/* hero */
.m-hero{border-radius:2rem 2rem 0 0;overflow:hidden;background:var(--cream3)}
.m-hero img{width:100%;height:100%;object-fit:cover;object-position:center 38%;display:block;aspect-ratio:16/6;transition:transform 1s var(--ease)}
.m-hero:hover img{transform:scale(1.025)}

/* body */
.m-body{padding:3.4rem 4rem 4rem}

/* header band */
.m-header{display:flex;flex-direction:column;padding-bottom:2.4rem;border-bottom:1px solid rgba(77,0,17,.07);margin-bottom:0}
.m-tag{font-size:.5rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:.9rem;display:block}
.m-h{font-family:var(--F);font-size:clamp(2.4rem,4.5vw,3.6rem);font-weight:600;color:var(--red);line-height:.93;margin-bottom:2rem;letter-spacing:-.025em}
.m-div{width:44px;height:1.5px;background:var(--gold);margin-bottom:2rem}
.m-pill{display:inline-flex;align-items:baseline;gap:.8rem;background:var(--red);border-radius:50px;padding:.9rem 2.4rem;align-self:flex-start}
.m-pill strong{font-family:var(--F);font-size:2.2rem;font-weight:600;color:var(--gold);letter-spacing:-.03em;line-height:1}
.m-pill span{font-size:.58rem;color:rgba(245,240,232,.6);letter-spacing:.1em;text-transform:uppercase}

/* two-column editorial */
.m-cols{display:grid;grid-template-columns:1fr 1fr;gap:4rem;margin-top:3rem;align-items:start}
.m-cols.m-full{grid-template-columns:1fr;max-width:600px}
.m-section{margin-bottom:2.8rem}
.m-section:last-child{margin-bottom:0}
.m-section-lbl{font-size:.48rem;letter-spacing:.42em;text-transform:uppercase;color:rgba(77,0,17,.28);margin-bottom:.8rem;display:flex;align-items:center;gap:.8rem;font-weight:600}
.m-section-lbl::after{content:'';flex:1;height:1px;background:rgba(77,0,17,.07)}
.m-txt{font-size:.84rem;line-height:2.2;color:var(--mist);margin:0}

/* side image stack */
.m-side-imgs{display:flex;flex-direction:column;gap:1rem;position:sticky;top:2rem}
.m-side-img{border-radius:.9rem;overflow:hidden;background:var(--cream3)}
.m-side-img img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;object-position:center;transition:transform .7s var(--ease)}
.m-side-img:hover img{transform:scale(1.04)}

/* result block */
.m-result{background:var(--red);border-radius:1.4rem;padding:2.6rem 3rem;margin-top:3.4rem;position:relative;overflow:hidden}
.m-result::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 0% 50%,rgba(255,255,255,.06) 0%,transparent 60%)}
.m-result-lbl{font-size:.48rem;letter-spacing:.42em;text-transform:uppercase;color:rgba(201,168,76,.65);font-weight:600;display:block;margin-bottom:1rem;position:relative}
.m-result p{font-size:.9rem;line-height:2.15;color:rgba(245,240,232,.85);position:relative}
.m-result strong{color:#fff;font-weight:600}

/* special — Anna Lane */
.m-special{font-family:var(--F);font-size:clamp(1.6rem,3.2vw,2.2rem);font-weight:400;font-style:italic;color:var(--mist);line-height:1.65;margin-top:1.6rem;padding:2.4rem 0;border-top:1px solid rgba(77,0,17,.07)}

/* close */
.m-close{position:fixed;top:1.6rem;right:1.6rem;width:46px;height:46px;border-radius:50%;background:rgba(245,240,232,.96);backdrop-filter:blur(14px);border:1px solid rgba(77,0,17,.1);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;color:var(--red);transition:all .3s var(--ease);z-index:600;line-height:1}
.m-close:hover{background:var(--red);color:var(--cream);transform:rotate(90deg) scale(1.1)}

@media(max-width:760px){
  .m-body{padding:2rem 1.8rem 2.6rem}
  .m-cols{grid-template-columns:1fr;gap:0}
  .m-cols.m-full{max-width:100%}
  .m-hero img{aspect-ratio:4/3}
  .modal{border-radius:1.4rem;max-height:96vh}
  .m-close{top:.8rem;right:.8rem}
  .m-side-imgs{position:static;flex-direction:row;overflow-x:auto;gap:.6rem;padding-bottom:.5rem;margin-top:2rem}
  .m-side-img{min-width:56%;flex-shrink:0}
}`);
console.log('1. Modal CSS: ' + (html.includes('.m-result::before') ? 'OK' : 'FAIL'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CREDENTIALS CSS — vertical tasting menu card on crimson
// ─────────────────────────────────────────────────────────────────────────────
html = replaceCSSBlock(html, '/* ── CREDENTIALS', '/* ── CONTACT ── */', `/* ── CREDENTIALS — vertical tasting menu card ── */
#credentials{padding:7rem 2.8rem;background:var(--red);overflow:hidden;position:relative}
#credentials::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.05) 0%,transparent 55%)}
.cred-inner{max-width:580px;margin:0 auto;position:relative}

/* intro above card */
.cred-intro{margin-bottom:3rem;text-align:center}
.cred-intro .s-eyebrow{color:rgba(201,168,76,.75)}
.cred-intro .s-heading{color:var(--cream)}
.cred-intro .s-heading em{color:var(--gold)}

/* The physical menu card — cream on crimson */
.menu-card{background:var(--cream);border-radius:.6rem;padding:3.8rem 3.5rem;position:relative;box-shadow:0 24px 64px rgba(0,0,0,.22),0 0 0 1px rgba(201,168,76,.2)}
.menu-card::before{content:'';position:absolute;inset:8px;border:1px solid rgba(77,0,17,.1);border-radius:.2rem;pointer-events:none}

/* Card title */
.menu-ttl{text-align:center;margin-bottom:2.8rem;padding-bottom:2.2rem;border-bottom:1px solid rgba(77,0,17,.1)}
.menu-ttl-eyebrow{font-size:.46rem;letter-spacing:.46em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:.5rem}
.menu-ttl-name{font-family:var(--F);font-size:clamp(1.7rem,3vw,2.2rem);font-style:italic;font-weight:400;color:var(--red);line-height:1.1;margin-bottom:.6rem}
.menu-ttl-desc{font-size:.7rem;line-height:1.85;color:var(--mist);max-width:380px;margin:0 auto}

/* Section header with flanking rules — like a menu category */
.menu-section-hd{display:flex;align-items:center;gap:1rem;margin:2.4rem 0 1.6rem;text-align:center}
.menu-section-hd::before,.menu-section-hd::after{content:'';flex:1;height:1px;background:rgba(77,0,17,.12)}
.menu-section-hd span{font-size:.44rem;letter-spacing:.46em;text-transform:uppercase;color:var(--red);font-weight:600;white-space:nowrap}

/* Individual course row */
.menu-item{padding:1.1rem 0;border-bottom:1px solid rgba(77,0,17,.07);display:flex;align-items:baseline;justify-content:space-between;gap:2rem}
.menu-item:last-of-type{border-bottom:none}
.menu-item-body{flex:1}
.menu-item-num{font-size:.42rem;letter-spacing:.36em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:.2rem}
.menu-item-name{font-family:var(--F);font-size:1.05rem;font-weight:600;color:var(--red);line-height:1.2;margin-bottom:.15rem}
.menu-item-notes{font-size:.62rem;color:var(--mist);font-style:italic;line-height:1.7}
.menu-item-meta{font-size:.44rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(77,0,17,.38);text-align:right;white-space:nowrap;flex-shrink:0}

/* Ornamental divider */
.menu-orn{display:flex;align-items:center;justify-content:center;gap:.9rem;margin:2.4rem 0}
.menu-orn::before,.menu-orn::after{content:'';flex:1;height:1px;background:rgba(77,0,17,.1)}
.menu-orn-glyph{color:var(--gold);font-size:.7rem;letter-spacing:.2em}

/* Tools — inline on the card */
.menu-tools{text-align:center;padding-top:0}
.menu-tools-lbl{font-size:.44rem;letter-spacing:.46em;text-transform:uppercase;color:rgba(77,0,17,.35);display:block;margin-bottom:1.1rem}
.menu-tools-list{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center}
.menu-tool{font-size:.5rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(77,0,17,.45);padding:.35rem .9rem;border:1px solid rgba(77,0,17,.12);border-radius:50px;transition:all .3s;cursor:default}
.menu-tool:hover{background:var(--red);color:var(--cream);border-color:var(--red)}

@media(max-width:640px){
  #credentials{padding:4.5rem 1.4rem}
  .menu-card{padding:2.8rem 2rem}
  .menu-item{flex-wrap:wrap;gap:.5rem}
  .menu-item-meta{width:100%;text-align:left}
}`);
console.log('2. Credentials CSS: ' + (html.includes('.menu-item-body') ? 'OK' : 'FAIL'));

// ─────────────────────────────────────────────────────────────────────────────
// 3. CREDENTIALS HTML — vertical menu card
// ─────────────────────────────────────────────────────────────────────────────
const newCredHTML = `<!-- CREDENTIALS -->
<section id="credentials">
  <div class="cred-inner">
    <div class="cred-intro">
      <span class="s-eyebrow rv">The Cream of the Crop</span>
      <h2 class="s-heading rv d1" style="font-size:clamp(2.4rem,4.5vw,4rem)">Qualifications &amp; <em>Tools.</em></h2>
    </div>

    <div class="menu-card rv d2">

      <!-- Card title — the signature course -->
      <div class="menu-ttl">
        <span class="menu-ttl-eyebrow">The Signature Course</span>
        <p class="menu-ttl-name">Mark Ritson Mini MBA in Marketing</p>
        <p class="menu-ttl-desc">The qualification that teaches brand management the way FMCG actually practises it. Consumer insight, positioning, brand strategy, and commercial rigour — the full flight.</p>
      </div>

      <!-- Course section header -->
      <div class="menu-section-hd"><span>The Courses</span></div>

      <!-- Course 01 -->
      <div class="menu-item rv d1">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 01</span>
          <p class="menu-item-name">BSc Marketing Innovation &amp; Technology</p>
          <p class="menu-item-notes">First Class Honours. Notes of brand theory, consumer behaviour and digital strategy.</p>
        </div>
        <span class="menu-item-meta">2018 · DCU</span>
      </div>

      <!-- Course 02 -->
      <div class="menu-item rv d2">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 02</span>
          <p class="menu-item-name">Meta Certified Media Buying Professional</p>
          <p class="menu-item-notes">Campaign structure, audience targeting, performance optimisation at real budget scale.</p>
        </div>
        <span class="menu-item-meta">Certified · Meta</span>
      </div>

      <!-- Course 03 -->
      <div class="menu-item rv d3">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 03</span>
          <p class="menu-item-name">Google Analytics GA4</p>
          <p class="menu-item-notes">Clean data, sharp attribution. The kind of analytics that makes you stop guessing.</p>
        </div>
        <span class="menu-item-meta">Certified · Google</span>
      </div>

      <!-- Course 04 -->
      <div class="menu-item rv d4">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 04</span>
          <p class="menu-item-name">HubSpot Inbound Marketing</p>
          <p class="menu-item-notes">CRM strategy, lead nurturing, content frameworks. Pairs well with a brand that keeps its customers.</p>
        </div>
        <span class="menu-item-meta">Certified · HubSpot</span>
      </div>

      <!-- Ornamental divider -->
      <div class="menu-orn"><span class="menu-orn-glyph">· · ·</span></div>

      <!-- Tools -->
      <div class="menu-tools rv d2">
        <span class="menu-tools-lbl">The Kitchen Table — Tools &amp; Platforms</span>
        <div class="menu-tools-list">
          <span class="menu-tool">Claude AI</span>
          <span class="menu-tool">ChatGPT</span>
          <span class="menu-tool">Midjourney</span>
          <span class="menu-tool">Adobe Firefly</span>
          <span class="menu-tool">Canva AI</span>
          <span class="menu-tool">Meta AI</span>
          <span class="menu-tool">Monday.com AI</span>
          <span class="menu-tool">Adobe Suite</span>
          <span class="menu-tool">Google Analytics</span>
          <span class="menu-tool">Meta Ads Manager</span>
          <span class="menu-tool">HubSpot</span>
        </div>
      </div>

    </div>
  </div>
</section>

`;
html = replaceHTMLBlock(html, '<!-- CREDENTIALS -->', '<!-- CONTACT -->', newCredHTML);
console.log('3. Credentials HTML: ' + (html.includes('menu-item-body') ? 'OK' : 'FAIL'));

// ─────────────────────────────────────────────────────────────────────────────
// 4. ABOUT CSS — stretch columns to equal height, bigger main photo
// ─────────────────────────────────────────────────────────────────────────────
html = html.replace(
  '.ab-inner{display:grid;grid-template-columns:52% 1fr;gap:4rem;max-width:1300px;margin:0 auto;align-items:start}',
  '.ab-inner{display:grid;grid-template-columns:52% 1fr;gap:4rem;max-width:1300px;margin:0 auto;align-items:stretch}'
);
html = html.replace(
  '.ab-photos{position:relative;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:.5rem}',
  '.ab-photos{position:relative;display:flex;flex-direction:column;gap:.5rem}'
);
html = html.replace(
  '.ab-photo-main{grid-column:1/3;overflow:hidden;border-radius:.9rem;aspect-ratio:16/7}',
  '.ab-photo-main{overflow:hidden;border-radius:.9rem;flex:1;min-height:0}'
);
html = html.replace(
  '.ab-photo-main img{width:100%;height:100%;object-fit:cover;object-position:center 30%;transition:transform 8s var(--ease)}',
  '.ab-photo-main img{width:100%;height:100%;object-fit:cover;object-position:center 25%;transition:transform 8s var(--ease);display:block}'
);
html = html.replace(
  '.ab-photo-sm{overflow:hidden;border-radius:.9rem;aspect-ratio:4/3}',
  '.ab-photo-sm{overflow:hidden;border-radius:.9rem}'
);
html = html.replace(
  '.ab-photo-sm img{width:100%;height:100%;object-fit:cover;transition:transform 8s var(--ease)}',
  '.ab-photo-sm img{width:100%;aspect-ratio:4/3;object-fit:cover;transition:transform 8s var(--ease);display:block}'
);
// Also add a small-photos row wrapper via CSS (they need to be side by side at the bottom)
// We need to target them differently — add a CSS rule to put the two ab-photo-sm in a row
html = html.replace(
  '.ab-photos:hover .ab-photo-main img,\n.ab-photos:hover .ab-photo-sm img{transform:scale(1.04)}',
  '.ab-photos:hover .ab-photo-main img,\n.ab-photos:hover .ab-photo-sm img{transform:scale(1.04)}\n.ab-sm-row{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;flex-shrink:0}'
);
// And make ab-content also stretch
html = html.replace(
  '.ab-content{display:flex;flex-direction:column;justify-content:flex-start;padding-top:.5rem}',
  '.ab-content{display:flex;flex-direction:column;justify-content:flex-start;padding-top:.5rem;align-self:start}'
);
console.log('4. About CSS: ' + (html.includes('.ab-sm-row') ? 'OK' : 'FAIL'));

// ─────────────────────────────────────────────────────────────────────────────
// 5. ABOUT HTML — wrap small photos in .ab-sm-row
// ─────────────────────────────────────────────────────────────────────────────
// Find the about section and wrap the two ab-photo-sm divs in a .ab-sm-row
const aboutStart = html.indexOf('<!-- ABOUT -->');
const aboutEnd = html.indexOf('\n\n<!-- CREDENTIALS -->', aboutStart);
let aboutSection = html.slice(aboutStart, aboutEnd);

// Wrap the two ab-photo-sm divs in ab-sm-row
// They appear as:  <div class="ab-photo-sm"><img ...  and appear consecutively
aboutSection = aboutSection.replace(
  /(<div class="ab-photo-sm">[\s\S]*?<\/div>\s*<div class="ab-photo-sm">[\s\S]*?<\/div>)/,
  '<div class="ab-sm-row">$1</div>'
);

html = html.slice(0, aboutStart) + aboutSection + html.slice(aboutEnd);
console.log('5. About HTML sm-row: ' + (html.includes('ab-sm-row') ? 'OK' : 'FAIL'));

// ─────────────────────────────────────────────────────────────────────────────
// 6. DRAG — ensure draggable=false on card images
// ─────────────────────────────────────────────────────────────────────────────
// Already handled via -webkit-user-drag:none on img global rule + draggable=false in oM()
// Additionally prevent pointer-events on images that shouldn't be interactive
console.log('6. Drag: already handled in previous patch');

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY
// ─────────────────────────────────────────────────────────────────────────────
const checks = [
  ['Modal hero aspect 16/6',       html.includes('aspect-ratio:16/6')],
  ['Modal section-lbl with rule',  html.includes('.m-section-lbl::after')],
  ['Modal side-imgs sticky',       html.includes('position:sticky')],
  ['Modal result radial glow',     html.includes('.m-result::before')],
  ['Cred cream card bg',           html.includes('background:var(--cream)')&&html.includes('.menu-card{background')],
  ['Cred menu-item-body',          html.includes('menu-item-body')],
  ['Cred menu-section-hd rules',   html.includes('.menu-section-hd::before')],
  ['Cred menu-orn HTML',           html.includes('menu-orn-glyph')],
  ['Cred menu-tool (not stamp)',   html.includes('menu-tool')&&!html.includes('.tool-stamp')],
  ['About stretch align',          html.includes('align-items:stretch')],
  ['About flex column photos',     html.includes('display:flex;flex-direction:column;gap:.5rem}')],
  ['About sm-row grid',            html.includes('.ab-sm-row{display:grid')],
  ['About sm-row in HTML',         html.includes('<div class="ab-sm-row">')],
];
checks.forEach(([l,p]) => console.log((p ? 'OK' : 'FAIL') + '  ' + l));

fs.writeFileSync('c:/Users/annal/Documents/Portfolio/index.html', html);
console.log('\nFile written. Size: ' + (html.length/1024/1024).toFixed(1) + ' MB');
