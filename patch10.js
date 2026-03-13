const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, from, to) {
  if (!html.includes(from)) { console.log('FAIL', label); fail++; return; }
  html = html.replace(from, to);
  console.log('OK  ', label); ok++;
}

// ─────────────────────────────────────────────
// 1. Add cursor div after opening <body> tag
// ─────────────────────────────────────────────
if (!html.includes('id="siteCursor"')) {
  const bodyTagEnd = html.indexOf('>', html.indexOf('<body'));
  if (bodyTagEnd !== -1) {
    html = html.slice(0, bodyTagEnd + 1) + '\n<div id="siteCursor"></div>' + html.slice(bodyTagEnd + 1);
    console.log('OK   cursor HTML added'); ok++;
  } else {
    console.log('FAIL cursor HTML'); fail++;
  }
} else {
  console.log('SKIP cursor HTML (already exists)');
}

// ─────────────────────────────────────────────
// 2. Cursor CSS — before </style>
// ─────────────────────────────────────────────
rep('cursor CSS',
  '\n</style>',
  `
/* ── CUSTOM CURSOR ── */
@media(pointer:fine){
  *{cursor:none!important}
  #siteCursor{
    position:fixed;left:0;top:0;
    width:10px;height:10px;border-radius:50%;
    margin:-5px 0 0 -5px;
    pointer-events:none;z-index:99999;
    background:var(--ink);
    will-change:transform;
    transition:background .18s ease,opacity .2s;
  }
  #siteCursor.sc-dark{background:var(--cream)}
  #siteCursor.sc-link{background:var(--gold)}
}
\n</style>`
);

// ─────────────────────────────────────────────
// 3. Cursor JS — before </body>
// ─────────────────────────────────────────────
rep('cursor JS',
  '</body>',
  `<script>
(function(){
  var c=document.getElementById('siteCursor');
  if(!c||!window.matchMedia('(pointer:fine)').matches)return;
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
    var el=document.elementFromPoint(e.clientX,e.clientY);
    if(!el)return;
    var dark=isDark(el);
    c.classList.toggle('sc-dark',dark);
    var isLink=!!(el.closest&&el.closest('a,button,[onclick]'));
    c.classList.toggle('sc-link',isLink);
  });
  document.addEventListener('mouseleave',function(){c.style.opacity='0'});
  document.addEventListener('mouseenter',function(){c.style.opacity='1'});
})();
</script>
</body>`
);

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────
fs.writeFileSync('index.html', html);
console.log(`\n${ok} passed, ${fail} failed`);
console.log('Size:', Math.round(html.length / 1024 / 1024 * 10) / 10 + 'MB');
