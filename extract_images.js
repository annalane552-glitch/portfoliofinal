const fs = require('fs');
const path = require('path');

console.log('Reading index.html...');
let html = fs.readFileSync('index.html', 'utf8');
console.log('Original size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB\n');

const imgDir = path.join(__dirname, 'Images');

// Map: dedup key -> saved relative path
const seen = new Map();
let counter = 0;

const IMAGE_RE = /data:(image\/[a-zA-Z+\-]+);base64,([A-Za-z0-9+/]+=*)/g;

// ─────────────────────────────────────────────
// PASS 1 — find all unique image data URIs and save as files
// ─────────────────────────────────────────────
console.log('Pass 1: extracting images...');
let m;
while ((m = IMAGE_RE.exec(html)) !== null) {
  const mime = m[1];
  const b64  = m[2];

  // Dedup key: mime + length + first 200 chars of b64
  const key = `${mime}|${b64.length}|${b64.slice(0, 200)}`;

  if (!seen.has(key)) {
    const ext = mime.split('/')[1]
      .replace('jpeg', 'jpg')
      .replace('svg+xml', 'svg')
      .replace('x-png', 'png')
      .replace('vnd.microsoft.icon', 'ico');

    counter++;

    // Try to infer a meaningful name from surrounding context
    // Look 300 chars before the match for clues
    const before = html.slice(Math.max(0, m.index - 300), m.index);
    let name = '';
    // D object key (case study id)
    const dKeyMatch = before.match(/\n  ([a-z]{2,4}):\{[^\n]*$/);
    if (dKeyMatch) name = dKeyMatch[1] + '_';
    // alt attribute
    const altMatch = before.match(/alt="([^"]{1,40})"/);
    if (!name && altMatch) name = altMatch[1].replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 20) + '_';
    // class clue
    const clsMatch = before.match(/class="([a-z-]+)"/g);
    if (!name && clsMatch) {
      const cls = clsMatch[clsMatch.length - 1].replace(/class="|"/g, '');
      name = cls.replace(/[^a-z0-9]/gi, '_').slice(0, 20) + '_';
    }

    const filename = `extracted_${String(counter).padStart(2, '0')}_${name || ''}${ext === 'jpg' ? 'photo' : 'img'}.${ext}`;
    const filepath  = path.join(imgDir, filename);

    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(filepath, buf);

    seen.set(key, `Images/${filename}`);
    console.log(`  Saved: ${filename}  (${Math.round(buf.length / 1024)}KB)`);
  }
}

console.log(`\n${seen.size} unique images extracted. (${counter - seen.size} were duplicates)\n`);

// ─────────────────────────────────────────────
// PASS 2 — replace every data URI with its file path
// ─────────────────────────────────────────────
console.log('Pass 2: replacing data URIs in HTML...');
let replacedCount = 0;

// Reset regex (exec loop resets lastIndex to 0 on null, so replace is safe)
html = html.replace(IMAGE_RE, (fullMatch, mime, b64) => {
  const key = `${mime}|${b64.length}|${b64.slice(0, 200)}`;
  const relPath = seen.get(key);
  if (relPath) { replacedCount++; return relPath; }
  return fullMatch;
});

console.log(`Replaced ${replacedCount} occurrences.\n`);

fs.writeFileSync('index.html', html);
const newSize = Math.round(html.length / 1024 / 1024 * 10) / 10;
console.log('Done. New HTML size:', newSize + 'MB');
