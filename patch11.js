const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// ─────────────────────────────────────────────
// 1. Hero section — centre content vertically
//    was: align-items:flex-end (pushes to bottom)
//    now: align-items:center
// ─────────────────────────────────────────────
rep('hero align-items center',
  '#hero{min-height:100svh;position:relative;overflow:hidden;display:flex;align-items:flex-end;border-radius:0 0 2.5rem 2.5rem}',
  '#hero{min-height:100svh;position:relative;overflow:hidden;display:flex;align-items:center;border-radius:0 0 2.5rem 2.5rem}'
);

// ─────────────────────────────────────────────
// 2. h-inner — remove large padding-bottom used for positioning,
//    use equal vertical padding instead, centre children
// ─────────────────────────────────────────────
rep('h-inner padding + align center',
  '.h-inner{position:relative;z-index:2;width:100%;padding:0 4.5rem 5.5rem;display:flex;justify-content:space-between;align-items:flex-end}',
  '.h-inner{position:relative;z-index:2;width:100%;padding:6rem 4.5rem 5rem;display:flex;justify-content:space-between;align-items:center}'
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
