const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// 1. Hero container — height:100vh, flex column center, 80px top padding
rep('hero container',
  '#hero{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;align-items:stretch;border-radius:0 0 2.5rem 2.5rem}',
  '#hero{height:100vh;min-height:600px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;padding-top:80px;border-radius:0 0 2.5rem 2.5rem}'
);

// 2. h-inner — remove padding-top (hero itself now handles it), keep side/bottom padding
rep('h-inner padding',
  '.h-inner{position:relative;z-index:2;width:100%;padding:8rem 4.5rem 5rem;display:flex;justify-content:space-between;align-items:center}',
  '.h-inner{position:relative;z-index:2;width:100%;padding:2rem 4.5rem 4rem;display:flex;justify-content:space-between;align-items:center}'
);

// 3. h-name — clamp(60px, 12vh, 150px), line-height 0.95, clean margin
rep('h-name font-size',
  'font-size:clamp(3rem,8vh,6rem);font-weight:600;line-height:.82;color:var(--red);letter-spacing:-.03em;margin-bottom:1.6rem;',
  'font-size:clamp(60px,12vh,150px);font-weight:600;line-height:.95;color:var(--red);letter-spacing:-.03em;margin:0 0 1.5rem 0;'
);

// 4. h-tag tagline — clamp(18px, 2vh, 24px)
rep('h-tag font-size',
  'font-size:clamp(1.4rem,2.6vw,2.2rem);',
  'font-size:clamp(18px,2vh,24px);'
);

// 5. Responsive overrides — remove the padding-top overrides on h-inner
//    (hero container handles top clearance now, not h-inner)
rep('resp 1280 h-inner',
  '.h-inner{padding:8rem 3rem 5rem}',
  '.h-inner{padding:2rem 3rem 4rem}'
);

rep('resp 1100 h-inner',
  '.h-inner{padding:8rem 2.5rem 4rem}',
  '.h-inner{padding:2rem 2.5rem 3.5rem}'
);

fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
