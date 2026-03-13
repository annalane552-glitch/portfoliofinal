const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

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
// 1. CREDENTIALS CSS — revert to centred
// ─────────────────────────────────────────────
rep('Cred CSS revert',
  `#credentials{padding:0;background:var(--red);overflow:hidden}\n.cred-split{display:grid;grid-template-columns:1fr 1fr;min-height:85vh}\n.cred-photo{overflow:hidden}\n.cred-photo img{width:100%;height:100%;object-fit:cover;object-position:center 30%;display:block}\n.cred-panel{display:flex;align-items:center;justify-content:center;padding:5rem 4rem}\n.cred-inner{width:100%;position:relative}\n@media(max-width:900px){.cred-split{grid-template-columns:1fr}.cred-photo{min-height:60vw}.cred-panel{padding:3.5rem 2rem}}`,
  `#credentials{padding:7rem 2.8rem;background:var(--red);overflow:hidden;position:relative}\n#credentials::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.05) 0%,transparent 55%)}\n.cred-inner{max-width:580px;margin:0 auto;position:relative}`
);

// ─────────────────────────────────────────────
// 2. CREDENTIALS HTML — remove split wrapper, restore centred
// ─────────────────────────────────────────────
const credSecStart = html.indexOf('<section id="credentials">');
const credSecEnd = html.indexOf('</section>', credSecStart) + '</section>'.length;
const menuCardStart = html.indexOf('<div class="menu-card', credSecStart);
const menuCardEnd = findClosingDiv(html, menuCardStart);

if (credSecStart !== -1 && menuCardStart !== -1 && menuCardEnd !== -1) {
  const menuCardHtml = html.slice(menuCardStart, menuCardEnd);
  const newCred = `<section id="credentials">
  <div class="cred-inner">
    ${menuCardHtml}
  </div>
</section>`;
  html = html.slice(0, credSecStart) + newCred + html.slice(credSecEnd);
  console.log('OK   Cred HTML centred'); ok++;
} else {
  console.log('FAIL Cred HTML revert'); fail++;
}

// ─────────────────────────────────────────────
// 3. PADDY POWER BANNER — show full image (contain)
// ─────────────────────────────────────────────
rep('PP banner contain',
  '.m-banner img{width:100%;display:block;aspect-ratio:3/1;object-fit:cover;object-position:center}',
  '.m-banner img{width:100%;display:block;max-height:280px;object-fit:contain;background:var(--red-d)}'
);

// ─────────────────────────────────────────────
// 4. SECTION LABELS BIGGER
// ─────────────────────────────────────────────
rep('m-section-lbl size',
  '.m-section-lbl{font-size:.45rem;letter-spacing:.36em;text-transform:uppercase;color:var(--gold);margin-bottom:.55rem;display:flex;align-items:center;gap:.6rem;font-weight:600;opaci',
  '.m-section-lbl{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;display:flex;align-items:center;gap:.6rem;font-weight:600;opaci'
);

rep('m-result-lbl size',
  '.m-result-lbl{font-size:.45rem;letter-spacing:.36em;text-transform:uppercase;color:rgba(201,168,76,.75);font-weight:600;display:block;margin-bottom:.7',
  '.m-result-lbl{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,168,76,.75);font-weight:600;display:block;margin-bottom:.7'
);

// ─────────────────────────────────────────────
// 5. ORACLE — wide panel
// ─────────────────────────────────────────────
// Add wide-panel CSS after .m-layout.no-imgs rule
rep('Add wide-panel CSS',
  '.m-layout.no-imgs{grid-template-columns:1fr}',
  '.m-layout.no-imgs{grid-template-columns:1fr}\n.m-layout.wide-panel{grid-template-columns:1fr 400px}'
);

// Add D.or.widePanel flag
rep('D.or.widePanel',
  'D.or.imgPos="center 15%";',
  'D.or.imgPos="center 15%";\nD.or.widePanel=true;'
);

// Update oM to apply/remove wide-panel class
rep('oM wide-panel',
  `  document.getElementById('mT').textContent=p.t;`,
  `  layout&&(p.widePanel?layout.classList.add('wide-panel'):layout.classList.remove('wide-panel'));
  document.getElementById('mT').textContent=p.t;`
);

// ─────────────────────────────────────────────
// 6. ANNA LANE — hide pill for special cases
// ─────────────────────────────────────────────
// In oM, hide/show pill based on special flag
rep('oM hide pill for special',
  `  const cs=document.getElementById('mCaseStudy');
  const sp=document.getElementById('mSpecial');
  if(p.special){`,
  `  const pill=document.querySelector('.m-pill');
  if(pill) pill.style.display=p.special?'none':'';
  const cs=document.getElementById('mCaseStudy');
  const sp=document.getElementById('mSpecial');
  if(p.special){`
);

// ─────────────────────────────────────────────
// 7. TASTING MENU COPY BIGGER
// ─────────────────────────────────────────────
rep('menu-item-notes bigger',
  '.menu-item-notes{font-size:.62rem;color:var(--mist);font-style:italic;line-height:1.7}',
  '.menu-item-notes{font-size:.78rem;color:var(--mist);font-style:italic;line-height:1.7}'
);

rep('menu-item-num bigger',
  '.menu-item-num{font-size:.42rem;letter-spacing:.36em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:.2rem}',
  '.menu-item-num{font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:.2rem}'
);

rep('menu-section-hd bigger',
  '.menu-section-hd span{font-size:.44rem;letter-spacing:.46em;text-transform:uppercase;color:var(--red);font-weight:600;white-space:nowrap}',
  '.menu-section-hd span{font-size:.64rem;letter-spacing:.32em;text-transform:uppercase;color:var(--red);font-weight:600;white-space:nowrap}'
);

rep('menu-item-name bigger',
  '.menu-item-name{font-family:var(--F);font-size:1.05rem;font-weight:600;color:var(--red);line-height:1.2;margin-bottom:.15rem}',
  '.menu-item-name{font-family:var(--F);font-size:1.2rem;font-weight:600;color:var(--red);line-height:1.2;margin-bottom:.15rem}'
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
