const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function b64(filename) {
  const buf = fs.readFileSync(path.join(__dirname, 'Images', filename));
  const ext = path.extname(filename).toLowerCase().slice(1);
  const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

function findClosingDiv(h, startIdx) {
  let depth = 0, i = startIdx;
  while (i < h.length) {
    if (h.slice(i, i+4) === '<div') { depth++; i += 4; }
    else if (h.slice(i, i+6) === '</div>') { depth--; if (depth === 0) return i + 6; i += 6; }
    else { i++; }
  }
  return -1;
}

// ─────────────────────────────────────────────
// 1. EXTRACT BUTTER ME from D.al.imgs[0] (avoid double-encoding)
// ─────────────────────────────────────────────
const alEntry = html.indexOf('\n  al:{');
const alImgsStart = html.indexOf('imgs:[', alEntry);
const alUri1Start = html.indexOf('"data:', alImgsStart) + 1;
const alUri1End = html.indexOf('"', alUri1Start);
const butterB64 = html.slice(alUri1Start, alUri1End);
console.log('Butter extracted from D.al:', butterB64.slice(0,30)+'...');
ok++;

// ─────────────────────────────────────────────
// 2. ENCODE BUTTER ME for card image (small, already 225KB so OK)
// ─────────────────────────────────────────────
const butterCardB64 = b64('butter me.jpg');
console.log('Butter card encoded:', Math.round(butterCardB64.length/1024)+'KB');

// ─────────────────────────────────────────────
// 3. ANNA LANE CARD IMAGE — replace in work grid
// ─────────────────────────────────────────────
const alCardIdx = html.indexOf('onclick="oM(\'al\')"');
const alImgSrcStart = html.indexOf('src="', alCardIdx) + 5;
const alImgSrcEnd = html.indexOf('"', alImgSrcStart);
if (alImgSrcStart > 5 && alImgSrcStart < alImgSrcEnd) {
  html = html.slice(0, alImgSrcStart) + butterCardB64 + html.slice(alImgSrcEnd);
  console.log('OK   al card image replaced'); ok++;
} else { console.log('FAIL al card image'); fail++; }

// ─────────────────────────────────────────────
// 4. ANNA LANE specialTxt update
// ─────────────────────────────────────────────
rep('AL specialTxt',
  `specialTxt:"This one's best discussed over coffee."}`,
  `specialTxt:"This one's best discussed over coffee, or toast."}`
);

// ─────────────────────────────────────────────
// 5. MODAL — add banner div + widen right panel + bigger heading
// ─────────────────────────────────────────────
// Add m-banner div before m-layout
rep('Modal add banner div',
  '    <div class="m-layout" id="mLayout">',
  '    <div class="m-banner" id="mBanner"></div>\n    <div class="m-layout" id="mLayout">'
);

// Widen right panel: 220px → 280px
rep('Widen right panel',
  'grid-template-columns:1fr 220px',
  'grid-template-columns:1fr 280px'
);

// Bigger modal heading
rep('Bigger m-h',
  '.m-h{font-family:var(--F);font-size:clamp(2.6rem,4.6vw,3.8rem);font-weight:600;color:var(--red);line-height:.88;margin-bottom:1.3rem;letter-spacing:-.03em}',
  '.m-h{font-family:var(--F);font-size:clamp(3rem,5.5vw,4.4rem);font-weight:600;color:var(--red);line-height:.87;margin-bottom:1.3rem;letter-spacing:-.03em}'
);

// Add .m-banner CSS right after .m-close:hover rule
rep('Add m-banner CSS',
  '.m-close:hover{background:var(--red);color:var(--cream);transform:rotate(90deg) scale(1.1)}',
  `.m-close:hover{background:var(--red);color:var(--cream);transform:rotate(90deg) scale(1.1)}
.m-banner{display:none;border-radius:1.6rem 1.6rem 0 0;overflow:hidden;background:var(--cream3)}
.m-banner.active{display:block}
.m-banner img{width:100%;display:block;aspect-ratio:3/1;object-fit:cover;object-position:center}`
);

// ─────────────────────────────────────────────
// 6. oM() — handle banner flag
// ─────────────────────────────────────────────
const OLD_OM = `function oM(id){
  const p=D[id];
  const left=document.querySelector('.m-left');
  if(left) left.scrollTop=0;
  const layout=document.getElementById('mLayout');
  const side=document.getElementById('mSideImgs');
  if(p.imgs&&p.imgs.length>0){
    side.innerHTML=p.imgs.map(s=>{const fit=p.imgFit||'cover';const pos=p.imgPos||'center';return \`<div class="m-side-img"><img src="\${s}" alt="" draggable="false" loading="lazy" style="object-fit:\${fit};object-position:\${pos}"></div>\`;}).join('');
    layout&&layout.classList.remove('no-imgs');
  } else {
    side.innerHTML='';
    layout&&layout.classList.add('no-imgs');
  }`;

const NEW_OM = `function oM(id){
  const p=D[id];
  const left=document.querySelector('.m-left');
  if(left) left.scrollTop=0;
  const layout=document.getElementById('mLayout');
  const side=document.getElementById('mSideImgs');
  const banner=document.getElementById('mBanner');
  if(p.banner&&p.imgs&&p.imgs.length>0){
    banner.innerHTML=\`<img src="\${p.imgs[0]}" alt="" draggable="false">\`;
    banner.classList.add('active');
    side.innerHTML='';
    layout&&layout.classList.add('no-imgs');
  } else {
    banner.innerHTML='';
    banner.classList.remove('active');
    if(p.imgs&&p.imgs.length>0){
      side.innerHTML=p.imgs.map(s=>{const fit=p.imgFit||'cover';const pos=p.imgPos||'center';return \`<div class="m-side-img"><img src="\${s}" alt="" draggable="false" loading="lazy" style="object-fit:\${fit};object-position:\${pos}"></div>\`;}).join('');
      layout&&layout.classList.remove('no-imgs');
    } else {
      side.innerHTML='';
      layout&&layout.classList.add('no-imgs');
    }
  }`;

rep('oM banner', OLD_OM, NEW_OM);

// Add D.pp.banner after existing D meta props
rep('D.pp.banner',
  'D.pp.imgFit="contain";',
  'D.pp.banner=true;D.pp.imgFit="contain";'
);

// ─────────────────────────────────────────────
// 7. ABOUT — push text down to better centre
// ─────────────────────────────────────────────
rep('ab-content padding',
  '.ab-content{display:flex;flex-direction:column;justify-content:flex-start;padding-top:.5rem;align-self:start}',
  '.ab-content{display:flex;flex-direction:column;justify-content:center;padding-top:0;align-self:start}'
);
// Change ab-inner align-items to flex-start so photos don't stretch weird
rep('ab-inner align',
  'align-items:center}',
  'align-items:start}'
);

// ─────────────────────────────────────────────
// 8. CREDENTIALS — full editorial split redesign
// ─────────────────────────────────────────────

// 8a. Replace credentials CSS block
rep('Cred #credentials rule',
  '#credentials{padding:7rem 2.8rem;background:var(--red);overflow:hidden;position:relative}\n#credentials::before{content:\'\';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.05) 0%,transparent 55%)}\n.cred-inner{max-width:580px;margin:0 auto;position:relative}',
  `#credentials{padding:0;background:var(--red);overflow:hidden}
.cred-split{display:grid;grid-template-columns:1fr 1fr;min-height:85vh}
.cred-photo{overflow:hidden}
.cred-photo img{width:100%;height:100%;object-fit:cover;object-position:center 30%;display:block}
.cred-panel{display:flex;align-items:center;justify-content:center;padding:5rem 4rem}
.cred-inner{width:100%;position:relative}
@media(max-width:900px){.cred-split{grid-template-columns:1fr}.cred-photo{min-height:60vw}.cred-panel{padding:3.5rem 2rem}}`
);

// 8b. Add max-width to .menu-card
rep('menu-card max-width',
  '.menu-card{background:var(--cream);border-radius:.6rem;padding:3.8rem 3.5rem;position:relative;box-shadow:0 24px 64px rgba(0,0,0,.22),0 0 0 1px rgba(201,168,76,.2)}',
  '.menu-card{background:var(--cream);border-radius:.6rem;padding:3.8rem 3.5rem;position:relative;box-shadow:0 24px 64px rgba(0,0,0,.32),0 0 0 1px rgba(201,168,76,.25);max-width:520px;width:100%;margin:0 auto}'
);

// Fix media query for credentials (old one references #credentials padding)
rep('Cred media query old',
  '@media(max-width:640px){\n  #credentials{padding:4.5rem 1.4rem}\n  .menu-card{padding:2.8rem 2rem}\n  .menu-item{flex-wrap:wrap;gap:.5rem}\n  .menu-item-meta{width:100%;text-align:left}\n}',
  '@media(max-width:640px){\n  .menu-card{padding:2.8rem 2rem}\n  .menu-item{flex-wrap:wrap;gap:.5rem}\n  .menu-item-meta{width:100%;text-align:left}\n}'
);

// 8c. Replace credentials HTML — split layout with photo
const credSecStart = html.indexOf('<section id="credentials">');
const credSecEnd = html.indexOf('</section>', credSecStart) + '</section>'.length;

// Extract just the menu-card from current HTML (we already have new content in it)
const menuCardStart = html.indexOf('<div class="menu-card', credSecStart);
const menuCardEnd = findClosingDiv(html, menuCardStart);

if (credSecStart !== -1 && credSecEnd !== -1 && menuCardStart !== -1 && menuCardEnd !== -1) {
  let menuCardHtml = html.slice(menuCardStart, menuCardEnd);
  // Change the rv d2 class to just rv (no delay since it's the only animated element)
  menuCardHtml = menuCardHtml.replace('class="menu-card rv d2"', 'class="menu-card rv"');

  const newCredentials = `<section id="credentials">
  <div class="cred-split">
    <div class="cred-photo rv-l">
      <img src="${butterB64}" alt="" loading="lazy">
    </div>
    <div class="cred-panel">
      <div class="cred-inner">
        ${menuCardHtml}
      </div>
    </div>
  </div>
</section>`;

  html = html.slice(0, credSecStart) + newCredentials + html.slice(credSecEnd);
  console.log('OK   Credentials editorial split done'); ok++;
} else {
  console.log('FAIL Credentials split — bounds not found', credSecStart, credSecEnd, menuCardStart, menuCardEnd);
  fail++;
}

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
