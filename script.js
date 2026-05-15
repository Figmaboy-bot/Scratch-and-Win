/* ── Coin cursor ── */
function buildSilverCoinCursor() {
  const size = 96;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const x = c.getContext('2d');
  const cx = size / 2, cy = size / 2;
  const r  = size * 0.32;

  x.save();
  x.shadowColor   = 'rgba(0,0,0,0.55)';
  x.shadowBlur    = 9;
  x.shadowOffsetX = 2;
  x.shadowOffsetY = 5;

  x.beginPath();
  x.arc(cx, cy, r, 0, Math.PI * 2);
  const baseG = x.createRadialGradient(cx - r * 0.28, cy - r * 0.32, r * 0.04, cx, cy, r);
  baseG.addColorStop(0,    '#f0f0f0');
  baseG.addColorStop(0.35, '#c8c8c8');
  baseG.addColorStop(0.7,  '#9e9e9e');
  baseG.addColorStop(1,    '#606060');
  x.fillStyle = baseG;
  x.fill();
  x.restore();

  x.beginPath();
  x.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
  const faceG = x.createRadialGradient(cx - r * 0.22, cy - r * 0.3, r * 0.04, cx, cy, r * 0.84);
  faceG.addColorStop(0,    '#ffffff');
  faceG.addColorStop(0.25, '#e2e2e2');
  faceG.addColorStop(0.65, '#b8b8b8');
  faceG.addColorStop(1,    '#888888');
  x.fillStyle = faceG;
  x.fill();

  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    x.save();
    x.strokeStyle = 'rgba(50,50,50,0.22)';
    x.lineWidth   = 1.2;
    x.beginPath();
    x.moveTo(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86);
    x.lineTo(cx + Math.cos(a) * r,        cy + Math.sin(a) * r);
    x.stroke();
    x.restore();
  }

  x.save();
  x.fillStyle = 'rgba(70,70,70,0.72)';
  const sr = r * 0.32, ir = r * 0.14, pts = 5;
  x.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const a   = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? sr : ir;
    i === 0
      ? x.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
      : x.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  x.closePath();
  x.fill();
  x.restore();

  x.save();
  x.beginPath();
  x.arc(cx, cy, r * 0.68, Math.PI * 1.05, Math.PI * 1.65);
  x.strokeStyle = 'rgba(255,255,255,0.75)';
  x.lineWidth   = r * 0.13;
  x.lineCap     = 'round';
  x.stroke();
  x.restore();

  x.save();
  x.beginPath();
  x.arc(cx, cy, r * 0.55, Math.PI * 0.1, Math.PI * 0.38);
  x.strokeStyle = 'rgba(255,255,255,0.3)';
  x.lineWidth   = r * 0.07;
  x.lineCap     = 'round';
  x.stroke();
  x.restore();

  canvas.style.cursor = `url(${c.toDataURL()}) ${Math.round(cx)} ${Math.round(cy)}, crosshair`;
}

/* ── Scratch canvas ── */
const canvas = document.getElementById('scratch-canvas');
const ctx    = canvas.getContext('2d');
const W = 500, H = 300;
canvas.width  = W;
canvas.height = H;

/* ── Dust particle canvas ── */
const pCanvas = document.createElement('canvas');
pCanvas.width  = window.innerWidth;
pCanvas.height = window.innerHeight;
Object.assign(pCanvas.style, {
  position: 'fixed', top: '0', left: '0',
  width: '100vw', height: '100vh',
  zIndex: '9999', pointerEvents: 'none',
});
document.body.appendChild(pCanvas);
const pctx = pCanvas.getContext('2d');

const DUST_COLORS = ['#C8A020','#D4B030','#E0C040','#B89018','#A07010','#CCA828','#E8D060'];
const dustParts   = [];
let dustRunning   = false;
let dustDist      = 0;

function spawnDust(cx, cy) {
  const count = 5 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    dustParts.push({
      x:      cx + (Math.random() - 0.5) * 28,
      y:      cy + Math.random() * 4,
      vx:     (Math.random() - 0.5) * 0.7,
      vy:     0.4 + Math.random() * 1.8,
      g:      0.025 + Math.random() * 0.045,
      wobble: (Math.random() - 0.5) * 0.03,
      a:      0.35 + Math.random() * 0.55,
      decay:  0.006 + Math.random() * 0.01,
      r:      1.5 + Math.random() * 2.5,
      color:  DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
      flake:  Math.random() < 0.45,
      rot:    Math.random() * Math.PI * 2,
      rotV:   (Math.random() - 0.5) * 0.06,
    });
  }
}

function tickDust() {
  pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (let i = dustParts.length - 1; i >= 0; i--) {
    const p = dustParts[i];
    p.vx  += p.wobble;
    p.vx  *= 0.995;
    p.x   += p.vx;
    p.y   += p.vy;
    p.vy  += p.g;
    p.a   -= p.decay;
    p.rot += p.rotV;
    if (p.a <= 0 || p.y > pCanvas.height) { dustParts.splice(i, 1); continue; }
    pctx.save();
    pctx.globalAlpha = p.a;
    pctx.fillStyle   = p.color;
    pctx.translate(p.x, p.y);
    if (p.flake) {
      pctx.rotate(p.rot);
      pctx.fillRect(-p.r, -p.r * 0.3, p.r * 2, p.r * 0.6);
    } else {
      pctx.beginPath();
      pctx.arc(0, 0, p.r * 0.5, 0, Math.PI * 2);
      pctx.fill();
    }
    pctx.restore();
  }
  if (dustParts.length > 0) requestAnimationFrame(tickDust);
  else dustRunning = false;
}

function emitDust(cx, cy) {
  const rect = canvas.getBoundingClientRect();
  const vx = rect.left + cx * (rect.width  / W);
  const vy = rect.top  + cy * (rect.height / H);
  spawnDust(vx, vy);
  if (!dustRunning) { dustRunning = true; requestAnimationFrame(tickDust); }
}

/* ── Gold texture ── */
const goldImg = new Image();
goldImg.src = 'Image/gold-texture.png';
goldImg.onload = function () {
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(goldImg, 0, 0, W, H);

  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle    = 'rgba(80,45,0,0.72)';
  ctx.font         = '600 14px "Inter Tight", sans-serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🪙  Scratch here to reveal your prize', W / 2, H / 2);

  ctx.globalCompositeOperation = 'destination-out';
};

buildSilverCoinCursor();

/* ── Scratch mechanic ── */
let painting = false;
let lastPos  = null;
let revealed = false;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const src  = e.touches ? e.touches[0] : e;
  return {
    x: (src.clientX - rect.left) * (W / rect.width),
    y: (src.clientY - rect.top)  * (H / rect.height),
  };
}

function roughStamp(cx, cy) {
  const verts  = 9 + Math.floor(Math.random() * 5);
  const baseR  = 24;
  const jitter = 11;
  ctx.beginPath();
  for (let i = 0; i <= verts; i++) {
    const angle = (i / verts) * Math.PI * 2;
    const r = baseR + (Math.random() - 0.5) * jitter * 2;
    i === 0
      ? ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
      : ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();

  if (Math.random() < 0.3) {
    const a = Math.random() * Math.PI * 2;
    const l = 7 + Math.random() * 14;
    ctx.lineWidth = 1 + Math.random() * 2.5;
    ctx.lineCap   = 'butt';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l);
    ctx.stroke();
  }
}

function scratchTo(pos) {
  if (!lastPos) {
    roughStamp(pos.x, pos.y);
    emitDust(pos.x, pos.y);
    dustDist = 0;
  } else {
    const dx    = pos.x - lastPos.x;
    const dy    = pos.y - lastPos.y;
    const dist  = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(dist / 5));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      roughStamp(lastPos.x + dx * t, lastPos.y + dy * t);
    }
    dustDist += dist;
    if (dustDist >= 8) {
      emitDust(pos.x, pos.y);
      dustDist = 0;
    }
  }
  lastPos = pos;
}

let revealTimer = null;
function scheduleRevealCheck() {
  clearTimeout(revealTimer);
  revealTimer = setTimeout(checkReveal, 120);
}

function checkReveal() {
  if (revealed) return;
  const data  = ctx.getImageData(0, 0, W, H).data;
  let cleared = 0, total = 0;
  for (let i = 3; i < data.length; i += 24) {
    if (data[i] < 128) cleared++;
    total++;
  }
  if (cleared / total > 0.99) autoReveal();
}

function autoReveal() {
  revealed = true;
  canvas.style.transition  = 'opacity 0.7s ease';
  canvas.style.opacity     = '0';
  setTimeout(() => { canvas.style.pointerEvents = 'none'; }, 700);
}

canvas.addEventListener('mousedown',  (e) => { painting = true; lastPos = null; scratchTo(getPos(e)); });
canvas.addEventListener('mousemove',  (e) => { if (!painting) return; scratchTo(getPos(e)); scheduleRevealCheck(); });
canvas.addEventListener('mouseup',    ()  => { painting = false; lastPos = null; checkReveal(); });
canvas.addEventListener('mouseleave', ()  => { painting = false; lastPos = null; });

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); painting = true; lastPos = null; scratchTo(getPos(e)); }, { passive: false });
canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (!painting) return; scratchTo(getPos(e)); scheduleRevealCheck(); }, { passive: false });
canvas.addEventListener('touchend',   ()  => { painting = false; lastPos = null; checkReveal(); });

/* ── Copy promo ── */
const COPY_PATHS  = `<rect x="7" y="5" width="10" height="12" rx="1.5" stroke="#00932a" stroke-width="1.5"/><path d="M13 5V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3" stroke="#00932a" stroke-width="1.5" stroke-linecap="round"/>`;
const CHECK_PATHS = `<circle cx="10" cy="10" r="7.5" stroke="#00932a" stroke-width="1.5"/><path d="M6.5 10.5l2.5 2.5 5-5" stroke="#00932a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

let copyTimer = null;
function copyCode() {
  navigator.clipboard.writeText('AMZ8942').then(() => {
    document.getElementById('copy-icon').innerHTML = CHECK_PATHS;
    const t = document.getElementById('toast');
    t.classList.add('show');
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      t.classList.remove('show');
      document.getElementById('copy-icon').innerHTML = COPY_PATHS;
    }, 2000);
  });
}
