const fs = require('fs');
const h = fs.readFileSync('index.html','utf8');

// Find all media queries
let pos = 0;
while(true) {
  pos = h.indexOf('@media', pos);
  if(pos===-1) break;
  const ctx = h.slice(pos-80, pos);
  const notBase64 = ctx.indexOf('base64') === -1;
  if(notBase64) {
    console.log('---');
    console.log(h.slice(pos, pos+300));
  }
  pos++;
}
