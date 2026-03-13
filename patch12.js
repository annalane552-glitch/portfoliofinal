const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// ─────────────────────────────────────────────
// 1. Remove old #cur / #cur-ring CSS block
// ─────────────────────────────────────────────
rep('Remove old cursor CSS',
  '#cur{position:fixed;width:8px;height:8px;background:var(--red);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s;mix-blend-mode:multiply}\n#cur-ring{position:fixed;width:32px;height:32px;border:1.5px solid rgba(77,0,17,.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .4s var(--ease),height .4s var(--ease),border-color .3s}\nbody:has(a:hover) #cur,body:has(button:hover) #cur,body:has(.p-card:hover) #cur{width:18px;height:18px;background:var(--gold)}\nbody:has(a:hover) #cur-ring,body:has(button:hover) #cur-ring,body:has(.p-card:hover) #cur-ring{width:48px;height:48px;border-color:var(--gold)}\n@media(max-width:768px){#cur,#cur-ring{display:none}body{cursor:auto}}\n\n',
  ''
);

// ─────────────────────────────────────────────
// 2. Replace my patch10 cursor CSS with new load-safe version
//    (cursor:none only applied via .js-cursor class added by JS after load)
// ─────────────────────────────────────────────
rep('Replace cursor CSS',
  '/* ── CUSTOM CURSOR ── */\n@media(pointer:fine){\n  *{cursor:none!important}\n  #siteCursor{\n    position:fixed;left:0;top:0;\n    width:10px;height:10px;border-radius:50%;\n    margin:-5px 0 0 -5px;\n    pointer-events:none;z-index:99999;\n    background:var(--ink);\n    will-change:transform;\n    transition:background .18s ease,opacity .2s;\n  }\n  #siteCursor.sc-dark{background:var(--cream)}\n  #siteCursor.sc-link{background:var(--gold)}\n}\n',
  `/* ── CUSTOM CURSOR ── */
@media(pointer:fine){
  .js-cursor *{cursor:none!important}
  #cur{
    position:fixed;left:0;top:0;
    width:10px;height:10px;border-radius:50%;
    margin:-5px 0 0 -5px;
    pointer-events:none;z-index:99999;
    background:var(--ink);
    will-change:transform;
    transition:background .2s ease,opacity .15s;
    opacity:0;
  }
  #cur.c-ready{opacity:1}
  #cur.c-dark{background:var(--cream)}
  #cur.c-link{background:var(--gold)}
}
`
);

// ─────────────────────────────────────────────
// 3. Replace cursor HTML — remove siteCursor div, keep single #cur
// ─────────────────────────────────────────────
rep('Replace cursor HTML',
  '<div id="siteCursor"></div>\n<div id="cur"></div><div id="cur-ring"></div>',
  '<div id="cur"></div>'
);

// ─────────────────────────────────────────────
// 4. Remove old cursor JS (the infinite RAF loop)
// ─────────────────────────────────────────────
rep('Remove old cursor JS',
  "/* CURSOR */\nconst cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');\nlet mx=0,my=0,rx=0,ry=0;\ndocument.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});\n(function tick(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)})();\n\n",
  ''
);

// ─────────────────────────────────────────────
// 5. Replace patch10 cursor script with clean load-deferred version
// ─────────────────────────────────────────────
rep('Replace cursor JS',
  "<script>\n(function(){\n  var c=document.getElementById('siteCursor');\n  if(!c||!window.matchMedia('(pointer:fine)').matches)return;\n  function isDark(el){\n    var node=el;\n    while(node&&node.nodeType===1){\n      var bg=getComputedStyle(node).backgroundColor;\n      var m=bg.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)(?:\\s*,\\s*([\\d.]+))?/);\n      if(m){\n        var a=m[4]!==undefined?parseFloat(m[4]):1;\n        if(a>0.05){\n          var lum=0.299*(+m[1])+0.587*(+m[2])+0.114*(+m[3]);\n          return lum<110;\n        }\n      }\n      node=node.parentElement;\n    }\n    return false;\n  }\n  document.addEventListener('mousemove',function(e){\n    c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';\n    var el=document.elementFromPoint(e.clientX,e.clientY);\n    if(!el)return;\n    var dark=isDark(el);\n    c.classList.toggle('sc-dark',dark);\n    var isLink=!!(el.closest&&el.closest('a,button,[onclick]'));\n    c.classList.toggle('sc-link',isLink);\n  });\n  document.addEventListener('mouseleave',function(){c.style.opacity='0'});\n  document.addEventListener('mouseenter',function(){c.style.opacity='1'});\n})();\n</script>\n",
  `<script>
window.addEventListener('load',function(){
  if(!window.matchMedia('(pointer:fine)').matches)return;
  var c=document.getElementById('cur');
  if(!c)return;
  // Only hide OS cursor after page is fully loaded
  document.body.classList.add('js-cursor');
  c.classList.add('c-ready');
  var lastCheck=0,lastDark=false,lastLink=false;
  function isDark(el){
    var node=el;
    while(node&&node.nodeType===1){
      var bg=getComputedStyle(node).backgroundColor;
      var m=bg.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)(?:\\s*,\\s*([\\d.]+))?/);
      if(m){
        var a=m[4]!==undefined?parseFloat(m[4]):1;
        if(a>0.05){
          var lum=0.299*(+m[1])+0.587*(+m[2])+0.114*(+m[3]);
          return lum<110;
        }
      }
      node=node.parentElement;
    }
    return false;
  }
  document.addEventListener('mousemove',function(e){
    c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';
    // Throttle the expensive getComputedStyle check to every 120ms
    var now=Date.now();
    if(now-lastCheck>120){
      lastCheck=now;
      var el=document.elementFromPoint(e.clientX,e.clientY);
      if(el){
        lastDark=isDark(el);
        lastLink=!!(el.closest&&el.closest('a,button,[onclick]'));
      }
    }
    c.classList.toggle('c-dark',lastDark);
    c.classList.toggle('c-link',lastLink);
  });
  document.addEventListener('mouseleave',function(){c.style.opacity='0'});
  document.addEventListener('mouseenter',function(){c.style.opacity='1'});
});
</script>
`
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
