/* extras5.js: removes the song and voice note, adds Hina Naqvi Day badge,
   applause on big moments, and an autograph wall (saved as a picture). */
(function () {
  const H = window.HX; if (!H) return;
  const C = H.C, esc = H.esc, ls = H.ls, now = H.now, BDAY = H.BDAY;
  const X = id => 'x5' + id;
  const box = (id, html) => {
    if (!$(X(id))) mk(X(id), '<div id="' + X(id) + 'b" style="width:min(88vw,340px);text-align:center"></div>');
    const b = $(X(id) + 'b'); if (html !== undefined) b.innerHTML = html; return b;
  };

  /* 1. Remove the song and voice note: no music, no lyrics, no voice button */
  try {
    window.HSong = null;                 // stops the song from starting on tap
    music = function () {};              // stops the built-in tune too
    const mu = document.getElementById('mu'); if (mu) mu.style.display = 'none';
    const st = document.createElement('style');
    st.textContent = '#mu,#lyr{display:none!important}label:has(input[data-k="music"]){display:none!important}';
    document.head.appendChild(st);
    document.querySelectorAll('[data-p="voice"]').forEach(e => e.remove());
    const vn = document.getElementById('vn'); if (vn) vn.remove();
  } catch (e) {}

  /* 2. Hina Naqvi Day badge on her birthday */
  const d = now(), onDay = d >= BDAY && d < new Date(2026, 11, 13);
  if (onDay) {
    const b = document.createElement('div'); b.id = 'x5badge';
    b.textContent = '👑 Hina Naqvi Day';
    b.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top,0px) + 14px);left:50%;transform:translateX(-50%);z-index:20;padding:6px 16px;border-radius:999px;background:linear-gradient(90deg,#b8862b,#ffe9a8,#c9962b);color:#2a1a05;font:600 12px Poppins,sans-serif;letter-spacing:.12em;text-transform:uppercase;box-shadow:0 0 18px #ffd97a88;pointer-events:none';
    document.body.appendChild(b);
  }

  /* 3. Applause, synthesized (no audio file needed) */
  let actx = null;
  function clap() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t0 = actx.currentTime;
      for (let k = 0; k < 14; k++) {
        const len = 0.06, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 3);
        const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
        f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 1200; f.Q.value = 0.8;
        g.gain.value = 0.35 + Math.random() * 0.2;
        src.buffer = buf; src.connect(f); f.connect(g); g.connect(actx.destination);
        src.start(t0 + k * 0.09 + Math.random() * 0.03);
      }
    } catch (e) {}
  }
  // applause when the midnight banner or the surprise curtain appears
  const hban = document.getElementById('hban');
  if (hban) new MutationObserver(() => { if (hban.classList.contains('on')) clap(); }).observe(hban, { attributes: true, attributeFilter: ['class'] });
  const hcur = document.getElementById('hcur');
  if (hcur) new MutationObserver(() => { if (hcur.classList.contains('open')) clap(); }).observe(hcur, { attributes: true, attributeFilter: ['class'] });

  /* 4. Autograph wall: she signs with her finger, then saves it as a picture */
  H.addNav('autograph', '✍️', 'Autograph Wall', () => {
    const bd = box('ag', '<p style="margin:0 0 8px">Sign your name, Hina ✨</p><canvas id="x5cv" width="600" height="300" style="width:100%;background:#fff8ea;border-radius:14px;touch-action:none"></canvas><div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><button id="x5c">Clear</button><button id="x5s">Save</button></div><p id="x5m" style="font-size:12px;opacity:.8;min-height:18px"></p>');
    const cv = $('x5cv'), x = cv.getContext('2d');
    x.lineWidth = 4; x.lineCap = 'round'; x.strokeStyle = '#4a2b35';
    let drawing = false, lx = 0, ly = 0;
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 300 / r.height]; };
    cv.onpointerdown = e => { drawing = true; cv.setPointerCapture(e.pointerId); [lx, ly] = pos(e); };
    cv.onpointermove = e => { if (!drawing) return; const [px, py] = pos(e); x.beginPath(); x.moveTo(lx, ly); x.lineTo(px, py); x.stroke(); [lx, ly] = [px, py]; };
    cv.onpointerup = cv.onpointercancel = () => { drawing = false; };
    $('x5c').onclick = () => { x.clearRect(0, 0, 600, 300); $('x5m').textContent = ''; };
    $('x5s').onclick = () => {
      const a = document.createElement('a'); a.download = 'hina-autograph.png'; a.href = cv.toDataURL('image/png');
      document.body.appendChild(a); a.click(); a.remove();
      $('x5m').textContent = 'Saved! Long-press the image if your browser asks.';
    };
    opn(X('ag'));
  }, 'x5ag');

  H.renderNav();
})();
