const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// h-name: clamp(4rem, min(12vw,15vh), 11rem)
// - Large monitor 1920×1080: min(230px,162px)=162px  → big and premium ✓
// - Laptop 1440×900:          min(172px,135px)=135px  → large ✓
// - Laptop 1280×768:          min(153px,115px)=115px  → fits below nav ✓
// - Mobile: hits 4rem floor
rep('h-name font-size vw+vh combo',
  'font-size:clamp(60px,12vh,150px);font-weight:600;line-height:.95;',
  'font-size:clamp(4rem,min(12vw,15vh),11rem);font-weight:600;line-height:.85;'
);

// h-tag: restore vw-based scaling so it feels proportional to the name
rep('h-tag font-size',
  'font-size:clamp(18px,2vh,24px);',
  'font-size:clamp(1.1rem,2vw,2rem);'
);

fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
