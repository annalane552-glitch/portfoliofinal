const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// 1. Hero — flex-direction:column, justify-content:center, min-height:100vh
rep('hero flex column center',
  '#hero{min-height:100svh;position:relative;overflow:hidden;display:flex;align-items:flex-start;border-radius:0 0 2.5rem 2.5rem}',
  '#hero{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;align-items:stretch;border-radius:0 0 2.5rem 2.5rem}'
);

// 2. h-inner — fixed 8rem top padding so text always clears the fixed nav
rep('h-inner top padding 8rem',
  '.h-inner{position:relative;z-index:2;width:100%;padding:clamp(6rem,14vh,9rem) 4.5rem 5rem;display:flex;justify-content:space-between;align-items:center}',
  '.h-inner{position:relative;z-index:2;width:100%;padding:8rem 4.5rem 5rem;display:flex;justify-content:space-between;align-items:center}'
);

// 3. h-name — scale down with vh-based clamp so it never crowds on short screens
rep('h-name font-size clamp vh',
  'font-size:clamp(6rem,14vw,13rem);',
  'font-size:clamp(3rem,8vh,6rem);'
);

// 4. Responsive overrides — update h-inner to keep 8rem top on all breakpoints
rep('resp 1280 h-inner top',
  '.h-inner{padding:clamp(6rem,14vh,9rem) 3rem 5rem}',
  '.h-inner{padding:8rem 3rem 5rem}'
);

rep('resp 1100 h-inner top',
  '.h-inner{padding:clamp(6rem,13vh,8rem) 2.5rem 4rem}',
  '.h-inner{padding:8rem 2.5rem 4rem}'
);

fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
