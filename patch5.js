const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label);
  ok++;
}

// ─────────────────────────────────────────────
// 1. MODAL CSS — full replacement
// ─────────────────────────────────────────────
const OLD_MODAL_CSS_START = `/* ── MODAL ── */
.m-bg{position:fixed;inset:0;z-index:500;background:rgba(8,0,2,.93);backdrop-filter:blur(32px);display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;pointer-events:none;transition:opacity .4s var(--ease)}
.m-bg.o{opacity:1;pointer-events:all}
.modal{background:var(--cream);border-radius:2rem;width:100%;max-width:1040px;max-height:92vh;overflow-y:auto;overflow-x:hidden;position:relative;transform:translateY(36px) scale(.97);transition:transform .48s var(--ease);scrollbar-width:thin;scrollbar-color:rgba(201,168,76,.25) transparent}
.m-bg.o .modal{trans`;

// Find full modal CSS block and replace to next section comment
const mCssStart = html.indexOf('/* ── MODAL ── */');
const mCssEnd = html.indexOf('/* ──', mCssStart + 20);
const oldModalCss = html.slice(mCssStart, mCssEnd);

const NEW_MODAL_CSS = `/* ── MODAL ── */
.m-bg{position:fixed;inset:0;z-index:500;background:rgba(8,0,2,.88);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;pointer-events:none;transition:opacity .4s var(--ease)}
.m-bg.o{opacity:1;pointer-events:all}
.modal{background:var(--cream);border-radius:1.6rem;width:100%;max-width:1000px;max-height:88vh;overflow:hidden;position:relative;transform:translateY(28px) scale(.97);transition:transform .48s var(--ease);display:flex;flex-direction:column}
.m-bg.o .modal{transform:none}
.m-layout{display:grid;grid-template-columns:1fr 220px;flex:1;min-height:0;overflow:hidden}
.m-layout.no-imgs{grid-template-columns:1fr}
.m-left{padding:2.6rem 3rem 2.6rem;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column;gap:1.4rem}
.m-left::-webkit-scrollbar{display:none}
.m-right{background:var(--red);display:flex;flex-direction:column;gap:.5rem;padding:.6rem;overflow:hidden}
.m-right:empty,.m-layout.no-imgs .m-right{display:none}
.m-header{border-bottom:1px solid rgba(77,0,17,.08);padding-bottom:1.4rem}
.m-tag{font-size:.47rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);font-weight:600;display:block;margin-bottom:.65rem}
.m-h{font-family:var(--F);font-size:clamp(2rem,3.6vw,2.9rem);font-weight:600;color:var(--red);line-height:.93;margin-bottom:1.3rem;letter-spacing:-.025em}
.m-div{width:34px;height:1.5px;background:var(--gold);margin-bottom:1.3rem}
.m-pill{display:inline-flex;align-items:baseline;gap:.7rem;background:var(--red);border-radius:50px;padding:.7rem 1.8rem;align-self:flex-start}
.m-pill strong{font-family:var(--F);font-size:1.8rem;font-weight:600;color:var(--gold);letter-spacing:-.03em;line-height:1}
.m-pill span{font-size:.52rem;color:rgba(245,240,232,.6);letter-spacing:.1em;text-transform:uppercase}
.m-section{margin-top:1.2rem}
.m-section-lbl{font-size:.45rem;letter-spacing:.36em;text-transform:uppercase;color:var(--gold);margin-bottom:.55rem;display:flex;align-items:center;gap:.6rem;font-weight:600;opacity:.85}
.m-section-lbl::after{content:'';flex:1;height:1px;background:rgba(77,0,17,.08)}
.m-txt{font-size:.83rem;line-height:1.95;color:var(--mist);margin:0}
.m-result{background:var(--red);border-radius:1.1rem;padding:1.7rem 2rem;position:relative;overflow:hidden;margin-top:1.4rem}
.m-result::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 0% 50%,rgba(255,255,255,.06) 0%,transparent 60%)}
.m-result-lbl{font-size:.45rem;letter-spacing:.36em;text-transform:uppercase;color:rgba(201,168,76,.75);font-weight:600;display:block;margin-bottom:.7rem;position:relative}
.m-result p{font-size:.83rem;line-height:1.95;color:rgba(245,240,232,.87);position:relative;margin:0}
.m-result strong{color:#fff}
.m-side-img{border-radius:.5rem;overflow:hidden;flex:1;min-height:0;background:var(--red-d)}
.m-side-img img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;transition:transform .7s var(--ease)}
.m-side-img:hover img{transform:scale(1.06)}
.m-special{font-family:var(--F);font-size:clamp(1.5rem,3vw,2rem);font-weight:400;font-style:italic;color:var(--mist);line-height:1.65;margin:0;padding-top:1.4rem;border-top:1px solid rgba(77,0,17,.07)}
.m-close{position:fixed;top:1.6rem;right:1.6rem;width:44px;height:44px;border-radius:50%;background:rgba(245,240,232,.96);backdrop-filter:blur(14px);border:1px solid rgba(77,0,17,.1);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;color:var(--red);transition:all .3s var(--ease);z-index:600;line-height:1}
.m-close:hover{background:var(--red);color:var(--cream);transform:rotate(90deg) scale(1.1)}
@media(max-width:760px){
  .m-layout{grid-template-columns:1fr}
  .m-right{flex-direction:row;max-height:130px;overflow-x:auto;overflow-y:hidden;padding:.5rem}
  .m-side-img{min-width:44%;flex:none}
  .m-left{padding:2rem 1.6rem}
  .modal{border-radius:1.2rem;max-height:94vh}
  .m-close{top:.8rem;right:.8rem}}
`;

if (mCssStart !== -1 && mCssEnd !== -1) {
  html = html.slice(0, mCssStart) + NEW_MODAL_CSS + html.slice(mCssEnd);
  console.log('OK   Modal CSS replaced');
  ok++;
} else {
  console.log('FAIL Modal CSS — markers not found');
  fail++;
}

// ─────────────────────────────────────────────
// 2. MODAL HTML — remove hero, new two-column layout
// ─────────────────────────────────────────────
const OLD_MODAL_HTML = `<div class="m-bg" id="mBg" onclick="bC(event)">
  <div class="modal">
    <button class="m-close" onclick="cM()">✕</button>
    <div class="m-hero" id="mHero"></div>
    <div class="m-body">
      <div class="m-header">
        <span class="m-tag" id="mT"></span>
        <h2 class="m-h" id="mH"></h2>
        <div class="m-div"></div>
        <div class="m-pill"><strong id="mS"></strong><span id="mSL"></span></div>
      </div>
      <div id="mCaseStudy">
        <div class="m-cols" id="mCols">
          <div class="m-col-left">
            <div class="m-section">
              <span class="m-section-lbl">The Challenge</span>
              <p class="m-txt" id="mChallenge"></p>
            </div>
            <div class="m-section">
              <span class="m-section-lbl">What I Did</span>
              <p class="m-txt" id="mWhat"></p>
            </div>
          </div>
          <div class="m-side-imgs" id="mSideImgs"></div>
        </div>
        <div class="m-result" id="mResultBlock">
          <span class="m-result-lbl">The Result</span>
          <p id="mResult"></p>
        </div>
      </div>
      <div id="mSpecial" style="display:none">
        <p class="m-special" id="mSpecialTxt"></p>
      </div>
    </div>
  </div>
</div>`;

const NEW_MODAL_HTML = `<div class="m-bg" id="mBg" onclick="bC(event)">
  <div class="modal">
    <button class="m-close" onclick="cM()">✕</button>
    <div class="m-layout" id="mLayout">
      <div class="m-left">
        <div class="m-header">
          <span class="m-tag" id="mT"></span>
          <h2 class="m-h" id="mH"></h2>
          <div class="m-div"></div>
          <div class="m-pill"><strong id="mS"></strong><span id="mSL"></span></div>
        </div>
        <div id="mCaseStudy">
          <div class="m-section">
            <span class="m-section-lbl">The Challenge</span>
            <p class="m-txt" id="mChallenge"></p>
          </div>
          <div class="m-section">
            <span class="m-section-lbl">What I Did</span>
            <p class="m-txt" id="mWhat"></p>
          </div>
          <div class="m-result" id="mResultBlock">
            <span class="m-result-lbl">The Result</span>
            <p id="mResult"></p>
          </div>
        </div>
        <div id="mSpecial" style="display:none">
          <p class="m-special" id="mSpecialTxt"></p>
        </div>
      </div>
      <div class="m-right" id="mSideImgs"></div>
    </div>
  </div>
</div>`;

rep('Modal HTML', OLD_MODAL_HTML, NEW_MODAL_HTML);

// ─────────────────────────────────────────────
// 3. oM() function — updated for new layout
// ─────────────────────────────────────────────
const OLD_OM = `function oM(id){
  const p=D[id];
  document.querySelector('.modal').scrollTop=0;

  /* hero image */
  const hero=document.getElementById('mHero');
  if(p.imgs&&p.imgs.length>0){
    hero.style.display='';
    hero.innerHTML=\`<img src="\${p.imgs[0]}" alt="" draggable="false">\`;
  } else {
    hero.style.display='none';
  }

  /* side images */
  const side=document.getElementById('mSideImgs');
  const cols=document.getElementById('mCols');
  if(p.imgs&&p.imgs.length>1){
    side.style.display='';
    side.innerHTML=p.imgs.slice(1).map(s=>\`<div class="m-side-img"><img src="\${s}" alt="" draggable="false" loading="lazy"></div>\`).join('');
    cols&&cols.classList.remove('m-full');
  } else {
    side.style.display='none';
    cols&&cols.classList.add('m-full');
  }

  document.getElementById('mT').textContent=p.t;
  document.getElementById('mH').textContent=p.h;
  document.getElementById('mS').textContent=p.stat;
  document.getElementById('mSL').textContent=p.statLabel||'';

  const cs=document.getElementById('mCaseStudy');
  const sp=document.getElementById('mSpecial');
  if(p.special){
    cs.style.display='none';sp.style.display='block';
    document.getElementById('mSpecialTxt').textContent=p.specialTxt;
  } else {
    cs.style.display='block';sp.style.display='none';
    document.getElementById('mChallenge').textContent=p.challenge;
    document.getElementById('mWhat').textContent=p.what;
    document.getElementById('mResult').innerHTML=p.result;
  }
  document.getElementById('mBg').classList.add('o');
  document.body.style.overflow='hidden';
}`;

const NEW_OM = `function oM(id){
  const p=D[id];
  const left=document.querySelector('.m-left');
  if(left) left.scrollTop=0;
  const layout=document.getElementById('mLayout');
  const side=document.getElementById('mSideImgs');
  if(p.imgs&&p.imgs.length>0){
    side.innerHTML=p.imgs.map(s=>\`<div class="m-side-img"><img src="\${s}" alt="" draggable="false" loading="lazy"></div>\`).join('');
    layout&&layout.classList.remove('no-imgs');
  } else {
    side.innerHTML='';
    layout&&layout.classList.add('no-imgs');
  }
  document.getElementById('mT').textContent=p.t;
  document.getElementById('mH').textContent=p.h;
  document.getElementById('mS').textContent=p.stat;
  document.getElementById('mSL').textContent=p.statLabel||'';
  const cs=document.getElementById('mCaseStudy');
  const sp=document.getElementById('mSpecial');
  if(p.special){
    cs.style.display='none';sp.style.display='block';
    document.getElementById('mSpecialTxt').textContent=p.specialTxt;
  } else {
    cs.style.display='block';sp.style.display='none';
    document.getElementById('mChallenge').textContent=p.challenge;
    document.getElementById('mWhat').textContent=p.what;
    document.getElementById('mResult').innerHTML=p.result;
  }
  document.getElementById('mBg').classList.add('o');
  document.body.style.overflow='hidden';
}`;

rep('oM function', OLD_OM, NEW_OM);

// ─────────────────────────────────────────────
// 4. "Butter" → gold in work section title
// ─────────────────────────────────────────────
rep('Butter gold',
  `My Bread<br>&amp; <em>Butter.</em>`,
  `My Bread<br>&amp; <em><span style="color:var(--gold)">Butter.</span></em>`
);

// ─────────────────────────────────────────────
// 5. "good taste" → gold in contact headline
// ─────────────────────────────────────────────
rep('"good taste" gold',
  `You must have<br>good taste.</h2>`,
  `You must have<br><span style="color:var(--gold)">good taste.</span></h2>`
);

// ─────────────────────────────────────────────
// 6. Remove dates from card categories
// ─────────────────────────────────────────────
const before = html;
// Match " · YYYY–YYYY" or " · YYYY-YYYY" (en-dash or hyphen)
html = html.replace(/\s·\s\d{4}[–\-—]\d{4}/g, '');
const datesRemoved = before !== html;
console.log(datesRemoved ? 'OK   Card dates removed' : 'FAIL Card dates — no matches');
if (datesRemoved) ok++; else fail++;

// ─────────────────────────────────────────────
// 7. About — centre face in main photo
// ─────────────────────────────────────────────
rep('About face position',
  'object-position:center 18%',
  'object-position:center 35%'
);

// ─────────────────────────────────────────────
// 8. About — centre text column against images
// ─────────────────────────────────────────────
rep('About align-items',
  'align-items:stretch}',
  'align-items:center}'
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
