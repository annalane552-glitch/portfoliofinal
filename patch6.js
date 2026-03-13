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
  console.log('OK  ', label);
  ok++;
}

// Replace specific image in D object (by case study key + array index)
function replaceEntryImg(entryKey, imgIdx, newDataUri) {
  const dStart = html.indexOf('const D={');
  const entryPattern = `\n  ${entryKey}:{`;
  const entryStart = html.indexOf(entryPattern, dStart);
  if (entryStart === -1) { console.log('FAIL replaceImg - entry:', entryKey); fail++; return; }
  const nextEntryIdx = html.indexOf('\n  ', entryStart + entryPattern.length + 3);
  const imgsArrStart = html.indexOf('imgs:[', entryStart);
  if (imgsArrStart === -1 || imgsArrStart > nextEntryIdx) { console.log('FAIL replaceImg - imgs not found:', entryKey); fail++; return; }
  let pos = imgsArrStart + 6;
  let current = 0;
  while (current < imgIdx) {
    const nextUri = html.indexOf('"data:', pos);
    if (nextUri === -1) { console.log('FAIL replaceImg - index OOB:', entryKey, imgIdx); fail++; return; }
    const uriEnd = html.indexOf('"', nextUri + 1);
    pos = uriEnd + 1;
    current++;
  }
  const uriStart = html.indexOf('"data:', pos);
  if (uriStart === -1) { console.log('FAIL replaceImg - URI not found:', entryKey, imgIdx); fail++; return; }
  const uriEnd = html.indexOf('"', uriStart + 1);
  html = html.slice(0, uriStart + 1) + newDataUri + html.slice(uriEnd);
  console.log('OK  ', `${entryKey}.imgs[${imgIdx}] replaced`);
  ok++;
}

// ─────────────────────────────────────────────
// 1. ENCODE IMAGES
// ─────────────────────────────────────────────
console.log('\nEncoding images...');
const hfImg2  = b64('HelloFresh x qantas 2.png');    console.log(' HF2:',  Math.round(hfImg2.length/1024)+'KB');
const un3     = b64('United Nations 3.png');           console.log(' UN3:',  Math.round(un3.length/1024)+'KB');
const un2     = b64('United Nations 2.png');           console.log(' UN2:',  Math.round(un2.length/1024)+'KB');
const pp1     = b64('paddy power 1.png');              console.log(' PP1:',  Math.round(pp1.length/1024)+'KB');
const or1     = b64('me on oracle instagram.png');     console.log(' OR1:',  Math.round(or1.length/1024)+'KB');
const butterMe = b64('butter me.jpg');                 console.log(' Butter:',Math.round(butterMe.length/1024)+'KB');
console.log('');

// ─────────────────────────────────────────────
// 2. REPLACE IMAGES IN D OBJECT
// ─────────────────────────────────────────────
replaceEntryImg('hf', 0, hfImg2);
replaceEntryImg('un', 0, un3);
replaceEntryImg('un', 1, un2);
replaceEntryImg('pp', 0, pp1);
replaceEntryImg('or', 0, or1);

// Add butter image to al (currently imgs:[])
rep('al add butter img',
  'al:{imgs:[],',
  `al:{imgs:["${butterMe}"],`
);

// ─────────────────────────────────────────────
// 3. PER-ENTRY IMAGE DISPLAY PROPS + oM UPDATE
// ─────────────────────────────────────────────
// Add display properties right before oM function
rep('D img meta props',
  '};\n\nfunction oM(id){',
  '};\nD.pp.imgFit="contain";\nD.or.imgPos="center 15%";\n\nfunction oM(id){'
);

// Update oM to use per-entry imgFit/imgPos
rep('oM imgFit/imgPos',
  `side.innerHTML=p.imgs.map(s=>\`<div class="m-side-img"><img src="\${s}" alt="" draggable="false" loading="lazy"></div>\`).join('');`,
  `side.innerHTML=p.imgs.map(s=>{const fit=p.imgFit||'cover';const pos=p.imgPos||'center';return \`<div class="m-side-img"><img src="\${s}" alt="" draggable="false" loading="lazy" style="object-fit:\${fit};object-position:\${pos}"></div>\`;}).join('');`
);

// ─────────────────────────────────────────────
// 4. MODAL TITLE LARGER
// ─────────────────────────────────────────────
rep('Modal title size',
  '.m-h{font-family:var(--F);font-size:clamp(2.4rem,4.2vw,3.4rem);font-weight:600;color:var(--red);line-height:.9;margin-bottom:1.3rem;letter-spacing:-.025em}',
  '.m-h{font-family:var(--F);font-size:clamp(2.6rem,4.6vw,3.8rem);font-weight:600;color:var(--red);line-height:.88;margin-bottom:1.3rem;letter-spacing:-.03em}'
);

// ─────────────────────────────────────────────
// 5. CONTACT — remove subline, update links
// ─────────────────────────────────────────────
rep('Remove ct-subline',
  '\n      <p class="ct-subline">If you\'re building something that needs a marketer who thinks in brands, moves in culture, and measures everything \u2014 let\'s talk.</p>',
  ''
);

rep('LinkedIn URL',
  'href="https://linkedin.com/in/anna-lane"',
  'href="https://linkedin.com/in/annalane1/"'
);

rep('Email Gmail link',
  'href="mailto:annalane552@gmail.com" class="ct-val"',
  'href="https://mail.google.com/mail/?view=cm&to=annalane552@gmail.com" target="_blank" class="ct-val"'
);

// ─────────────────────────────────────────────
// 6. ABOUT — move "Cream of the Crop" eyebrow
// ─────────────────────────────────────────────
// Remove from credentials intro
rep('Remove eyebrow from cred',
  '\n      <span class="s-eyebrow rv">The Cream of the Crop</span>\n      <h2',
  '\n      <h2'
);

// Add above I'm Anna in about content
rep('Add eyebrow above ab-name',
  '<h2 class="ab-name rv d1">I\'m Anna.</h2>',
  '<span class="s-eyebrow rv">The Cream of the Crop</span>\n    <h2 class="ab-name rv d1">I\'m Anna.</h2>'
);

// ─────────────────────────────────────────────
// 7. CREDENTIALS — replace full menu card
// ─────────────────────────────────────────────
// Find menu card start and end using div depth counting
const credSectionStart = html.indexOf('<section id="credentials">');
const menuCardStart = html.indexOf('<div class="menu-card rv d2">', credSectionStart);

function findClosingDiv(h, startIdx) {
  let depth = 0, i = startIdx;
  while (i < h.length) {
    if (h.slice(i, i+4) === '<div') { depth++; i += 4; }
    else if (h.slice(i, i+6) === '</div>') { depth--; if (depth === 0) return i + 6; i += 6; }
    else { i++; }
  }
  return -1;
}

const menuCardEnd = findClosingDiv(html, menuCardStart);

if (menuCardStart !== -1 && menuCardEnd !== -1) {
  const NEW_MENU_CARD = `<div class="menu-card rv d2">

      <div class="menu-ttl">
        <p class="menu-card-title">Tasting Menu</p>
      </div>

      <div class="menu-section-hd"><span>The Signature Course</span></div>

      <div class="menu-item rv d1">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 01</span>
          <p class="menu-item-name">Mini MBA in Marketing</p>
          <p class="menu-item-notes">Mark Ritson. Evidence-based brand strategy, positioning, segmentation and commercial marketing planning.</p>
        </div>
      </div>

      <div class="menu-item rv d2">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 02</span>
          <p class="menu-item-name">BSc Marketing Innovation &amp; Technology</p>
          <p class="menu-item-notes">Dublin City University, First Class Honours.</p>
        </div>
      </div>

      <div class="menu-item rv d3">
        <div class="menu-item-body">
          <span class="menu-item-num">Course 03</span>
          <p class="menu-item-name">Adobe Design Certification</p>
          <p class="menu-item-notes">Professional training in visual communication, layout, and brand asset creation.</p>
        </div>
      </div>

      <div class="menu-orn"><span class="menu-orn-glyph">\u00b7 \u00b7 \u00b7</span></div>

      <div class="menu-section-hd"><span>Chef\u2019s Special</span></div>

      <div class="menu-item rv d1">
        <div class="menu-item-body">
          <p class="menu-item-name">This Portfolio</p>
          <p class="menu-item-notes">Built from scratch using HTML and CSS, with AI assisting development.</p>
        </div>
      </div>

    </div>`;

  html = html.slice(0, menuCardStart) + NEW_MENU_CARD + html.slice(menuCardEnd);
  console.log('OK   Menu card replaced');
  ok++;
} else {
  console.log('FAIL Menu card — bounds not found');
  fail++;
}

// Add menu-card-title CSS (find credentials CSS block)
const credCssIdx = html.indexOf('.menu-ttl{');
if (credCssIdx !== -1) {
  const insertAfter = html.indexOf('}', credCssIdx) + 1;
  const newCss = `\n.menu-card-title{font-family:var(--F);font-size:clamp(2rem,3.4vw,2.8rem);font-weight:500;font-style:italic;color:var(--red);text-align:center;margin-bottom:1.8rem;letter-spacing:-.01em;line-height:1}`;
  html = html.slice(0, insertAfter) + newCss + html.slice(insertAfter);
  console.log('OK   menu-card-title CSS added');
  ok++;
} else {
  console.log('FAIL menu-card-title CSS');
  fail++;
}

// ─────────────────────────────────────────────
// 8. PAGE TITLE — fix em dash
// ─────────────────────────────────────────────
rep('Page title em dash',
  '<title>Anna Lane \u2014 The Gold Standard in Marketing</title>',
  '<title>Anna Lane | The Gold Standard in Marketing</title>'
);

// ─────────────────────────────────────────────
// 9. GLOBAL EM DASH REPLACE in visible text
// (space-emdash-space → comma-space)
// ─────────────────────────────────────────────
const beforeEm = html;
html = html.replace(/ \u2014 /g, ', ');
const emReplaced = (beforeEm.match(/ \u2014 /g) || []).length;
console.log('OK   Em dashes replaced:', emReplaced);
ok++;

// ─────────────────────────────────────────────
// 10. CREDENTIALS — also remove meta dates from items
// ─────────────────────────────────────────────
// menu-item-meta spans already removed since we replaced the entire menu card

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
