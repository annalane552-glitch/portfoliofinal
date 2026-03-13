const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');
const orig = html;
let ok = 0, fail = 0;

function check(label, cond) {
  if (cond) { console.log('OK ', label); ok++; }
  else       { console.log('FAIL', label); fail++; }
}

// ── EXTRACT BUTTER IMG FROM ct-bg ──
const ctBgStart = html.indexOf('<div class="ct-bg">');
const imgSrcStart = html.indexOf('src="', ctBgStart) + 5;
const imgSrcEnd = html.indexOf('"', imgSrcStart);
const butterSrc = html.slice(imgSrcStart, imgSrcEnd);
check('Butter img extracted', butterSrc.startsWith('data:image'));

// ── ENCODE PDF ──
const pdfBuf = fs.readFileSync(path.join(__dirname, 'Anna Lane Resume.pdf'));
const pdfB64 = pdfBuf.toString('base64');
const pdfHref = `data:application/pdf;base64,${pdfB64}`;
check('PDF encoded', pdfB64.length > 100);
console.log('  PDF size:', Math.round(pdfBuf.length / 1024) + 'KB');

// ── 1. CONTACT CSS REPLACEMENT ──
const OLD_CT_CSS = `#contact{position:relative;overflow:hidden;background:var(--ink)}
.ct-bg{position:absolute;inset:0;z-index:0}
.ct-bg img{width:100%;height:100%;object-fit:cover;object-position:center;opacity:.28;filter:saturate(.35)}
.ct-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,0,10,.88) 0%,rgba(26,0,10,.72) 55%,rgba(26,0,10,.6) 100%)}
.ct-inner{position:relative;z-index:1;min-height:75vh;display:flex;flex-direction:column;justify-content:space-between;padding:5rem 5rem 4rem}
.ct-statement{max-width:820px}
.ct-eyebrow{font-size:.6rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);font-weight:600;display:block;margin-bottom:1.6rem;opacity:.8}
.ct-headline{font-family:var(--F);font-size:clamp(3.5rem,7vw,7rem);font-weight:500;font-style:italic;color:#fff;line-height:.9;letter-spacing:-.02em;margin-bottom:2rem;text-shadow:0 2px 40px rgba(0,0,0,.3)}
.ct-subline{font-size:.78rem;color:rgba(245,240,232,.65);line-height:1.9;max-width:440px}
.ct-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:3rem;flex-wrap:wrap;padding-top:3rem;border-top:1px solid rgba(245,240,232,.1)}
.ct-details{display:flex;gap:4rem;flex-wrap:wrap}
.ct-item{display:flex;flex-direction:column;gap:.35rem;transition:opacity .3s}
.ct-item:hover{opacity:.7}
.ct-lbl{font-size:.5rem;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);font-weight:600}
.ct-val{font-family:var(--F);font-size:1.05rem;color:#fff}
.ct-val:hover{color:var(--gold)}
.ct-cta{display:inline-flex;align-items:center;gap:.8rem;border:1px solid rgba(245,240,232,.25);color:var(--cream);padding:1rem 2.4rem;border-radius:50px;font-size:.62rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;position:relative;overflow:hidden;transition:color .4s var(--ease),border-color .4s;white-space:nowrap;flex-shrink:0}
.ct-cta::before{content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.ct-cta:hover{color:var(--red-d);border-color:var(--gold)}.ct-cta:hover::before{transform:scaleX(1)}
.ct-cta span{position:relative;z-index:1}
@media(max-width:800px){.ct-inner{padding:3.5rem 2rem 3rem}.ct-bottom{flex-direction:column;align-items:flex-start}.ct-details{gap:2rem}}`;

const NEW_CT_CSS = `#contact{background:var(--ink);overflow:hidden}
.ct-inner{display:grid;grid-template-columns:1fr 1fr;min-height:78vh}
.ct-left{padding:6rem 5rem;display:flex;flex-direction:column;justify-content:center;gap:2.4rem}
.ct-right{overflow:hidden}
.ct-right img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
.ct-eyebrow{font-size:.6rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);font-weight:600;display:block;opacity:.8}
.ct-headline{font-family:var(--F);font-size:clamp(3rem,5.5vw,6rem);font-weight:500;font-style:italic;color:#fff;line-height:.9;letter-spacing:-.02em;margin:0}
.ct-subline{font-size:.78rem;color:rgba(245,240,232,.65);line-height:1.9;max-width:400px;margin:0}
.ct-details{display:flex;flex-direction:column;gap:1.4rem;padding-top:1.6rem;border-top:1px solid rgba(245,240,232,.1)}
.ct-item{display:flex;flex-direction:column;gap:.3rem;transition:opacity .3s}
.ct-item:hover{opacity:.7}
.ct-lbl{font-size:.5rem;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);font-weight:600}
.ct-val{font-family:var(--F);font-size:1.05rem;color:#fff}
.ct-val:hover{color:var(--gold)}
.ct-cta{display:inline-flex;align-items:center;gap:.8rem;border:1px solid rgba(245,240,232,.25);color:var(--cream);padding:1rem 2.4rem;border-radius:50px;font-size:.62rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;position:relative;overflow:hidden;transition:color .4s var(--ease),border-color .4s;white-space:nowrap;align-self:flex-start}
.ct-cta::before{content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.ct-cta:hover{color:var(--red-d);border-color:var(--gold)}.ct-cta:hover::before{transform:scaleX(1)}
.ct-cta span{position:relative;z-index:1}
@media(max-width:900px){.ct-inner{grid-template-columns:1fr}.ct-right{min-height:50vw}.ct-left{padding:4rem 2rem}}`;

check('Contact CSS old found', html.includes(OLD_CT_CSS));
if (html.includes(OLD_CT_CSS)) {
  html = html.replace(OLD_CT_CSS, NEW_CT_CSS);
  check('Contact CSS replaced', html.includes(NEW_CT_CSS));
} else {
  console.log('FAIL Contact CSS replace');
  fail++;
}

// ── 2. CONTACT HTML REPLACEMENT ──
const ctHtmlStart = html.indexOf('<section id="contact">');
const ctHtmlEnd = html.indexOf('</section>', ctHtmlStart) + '</section>'.length;
const ctHtmlOld = html.slice(ctHtmlStart, ctHtmlEnd);

const NEW_CT_HTML = `<section id="contact">
  <div class="ct-inner">
    <div class="ct-left rv">
      <span class="ct-eyebrow">Get in touch</span>
      <h2 class="ct-headline">Still here?<br>You must have<br>good taste.</h2>
      <p class="ct-subline">If you're building something that needs a marketer who thinks in brands, moves in culture, and measures everything — let's talk.</p>
      <div class="ct-details">
        <div class="ct-item">
          <span class="ct-lbl">Email</span>
          <a href="mailto:annalane552@gmail.com" class="ct-val">annalane552@gmail.com</a>
        </div>
        <div class="ct-item">
          <span class="ct-lbl">LinkedIn</span>
          <a href="https://linkedin.com/in/anna-lane" target="_blank" class="ct-val">linkedin.com/in/anna-lane</a>
        </div>
        <div class="ct-item">
          <span class="ct-lbl">Based</span>
          <span class="ct-val" style="cursor:default">Sydney, NSW</span>
        </div>
      </div>
      <a href="${pdfHref}" download="Anna Lane Resume.pdf" class="ct-cta" id="cvBtn"><span>↓ Download CV</span></a>
    </div>
    <div class="ct-right">
      <img src="${butterSrc}" alt="Anna Lane — A Cultured Butter">
    </div>
  </div>
</section>`;

check('Contact HTML old found', ctHtmlOld.includes('ct-bg'));
html = html.slice(0, ctHtmlStart) + NEW_CT_HTML + html.slice(ctHtmlEnd);
check('Contact HTML replaced', html.includes('ct-left') && html.includes('ct-right'));

// ── 3. ABOUT — FIX PHOTO PROPORTIONS ──
const OLD_AB_MAIN = `.ab-photo-main{overflow:hidden;border-radius:.9rem;flex:1;min-height:0}
.ab-photo-main img{width:100%;height:100%;object-fit:cover;object-position:center 25%;transition:transform 8s var(--ease);display:block}`;

const NEW_AB_MAIN = `.ab-photo-main{overflow:hidden;border-radius:.9rem;aspect-ratio:4/3}
.ab-photo-main img{width:100%;height:100%;object-fit:cover;object-position:center 25%;transition:transform 8s var(--ease);display:block}`;

check('About main photo CSS found', html.includes(OLD_AB_MAIN));
if (html.includes(OLD_AB_MAIN)) {
  html = html.replace(OLD_AB_MAIN, NEW_AB_MAIN);
  check('About main photo CSS replaced', html.includes(NEW_AB_MAIN));
} else {
  console.log('FAIL About main photo CSS');
  fail++;
}

// ── WRITE ──
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('File written. Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
