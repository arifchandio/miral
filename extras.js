/* ============================================================
   extras.js: cinematic start, synced lyrics, midnight surprise,
   Open-When voice notes, 26 Reasons, Photo Reveal, Catch game,
   Scratch coupons, birthday-week greeting.
   Personal text lives in resources/content.js
   ============================================================ */
(function () {
  const C = window.HINA || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const tstS = m => { try { tst(m); } catch (e) {} };
  const BDAY = new Date(2026, 11, 12, 0, 0, 0);
  // Secret test helper (only you know): open the site with ?fake=2026-12-11T23:59:40
  let OFF = 0;
  try { const f = new URLSearchParams(location.search).get('fake'); if (f) { const t = new Date(f); if (!isNaN(t)) OFF = t - Date.now(); } } catch (e) {}
  const now = () => new Date(Date.now() + OFF);

  /* ---------- helpers ---------- */
  function renderNav() {
    $('dl').innerHTML = NAV.map(n => `<button class="ni" data-p="${n[0]}"><span>${n[1]}</span>${n[2]}</button>${n[0] == 'surprise' ? '<hr>' : ''}`).join('');
  }
  function addNav(key, emo, label, fn, ovId) {
    if (!NAV.some(n => n[0] == key)) NAV.splice(Math.max(0, NAV.findIndex(n => n[0] == 'surprise')), 0, [key, emo, label]);
    RT[key] = fn; MAP[ovId] = key;
    const a = [label, label, label]; a.forEach(y => LTM[y] = a);
    renderNav();
  }
  function onClose(el, fn) {
    new MutationObserver(() => { if (!el.classList.contains('on')) fn(); }).observe(el, { attributes: true, attributeFilter: ['class'] });
  }
  function duck(on) { window.HDuck = !!on; try { aps(); } catch (e) {} }
  function addGame(label, key, fn, ovId) {
    const mg = $('gms').querySelector('.mg');
    mg.insertAdjacentHTML('beforeend', `<button data-x="${key}">${label}</button>`);
    mg.addEventListener('click', e => {
      const b = e.target.closest('[data-x="' + key + '"]'); if (!b) return;
      e.stopPropagation(); $('gms').classList.remove('on'); fn();
    }, true);
    MAP[ovId] = 'games'; try { TABM[ovId] = 'games'; } catch (e) {}
  }

  /* ---------- 0. Secret-question lock (optional, set in content.js) ---------- */
  const SEC = C.secret;
  if (SEC && SEC.question && SEC.answers && SEC.answers.length) {
    const norm = x => String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
    const lk = document.createElement('div'); lk.id = 'lock';
    lk.innerHTML = `<div class="lkc"><div style="font-size:42px">🔒</div><p>${esc(SEC.question)}</p><input id="lki" type="text" autocomplete="off" aria-label="Answer" placeholder="Your answer"><button id="lkb">Open</button><small id="lkm"></small></div>`;
    document.body.appendChild(lk);
    const tryIt = () => {
      if (SEC.answers.some(a => norm(a) === norm($('lki').value))) { lk.classList.add('out'); setTimeout(() => lk.remove(), 700); }
      else { $('lkm').textContent = SEC.hint || 'Not quite, try again.'; lk.classList.remove('shk'); void lk.offsetWidth; lk.classList.add('shk'); }
    };
    $('lkb').onclick = tryIt; $('lki').addEventListener('keydown', e => { if (e.key == 'Enter') tryIt(); });
  }

  /* ---------- 1. Cinematic start (tap to light the candle) ---------- */
  window.__hinaTap = 1;
  try { intro.style.display = 'none'; } catch (e) {}
  const tap = document.createElement('div');
  tap.id = 'tapo'; tap.setAttribute('role', 'button'); tap.tabIndex = 0;
  tap.innerHTML = '<small>A surprise for</small><h2>Hina Naqvi</h2><div class="tc"><i class="tf"></i><b class="tw"></b></div><p>Tap to light the candle</p>';
  document.body.appendChild(tap);
  function begin() {
    if (tap.classList.contains('lit')) return;
    tap.classList.add('lit');
    try { window.HSong && HSong.autoStart(); } catch (e) {}   // must happen inside the tap
    setTimeout(() => { startIntro(); tap.classList.add('out'); setTimeout(() => tap.remove(), 1300); }, 1100);
  }
  tap.addEventListener('click', begin);
  tap.addEventListener('keydown', e => { if (e.key == 'Enter' || e.key == ' ') begin(); });

  /* ---------- 2. Synced lyrics (resources/lyrics.lrc) ---------- */
  const LY = document.createElement('div'); LY.id = 'lyr'; LY.setAttribute('aria-live', 'polite'); document.body.appendChild(LY);
  let L = [], li = -1;
  function parseLrc(t) {
    const out = [];
    String(t).split(/\r?\n/).forEach(l => {
      const m = l.match(/^((?:\[\d+:\d+(?:[.:]\d+)?\])+)(.*)$/); if (!m) return;
      const txt = m[2].trim();
      m[1].replace(/\[(\d+):(\d+(?:[.:]\d+)?)\]/g, (_, a, b) => { out.push([+a * 60 + parseFloat(b.replace(':', '.')), txt]); });
    });
    return out.sort((a, b) => a[0] - b[0]);
  }
  fetch(C.lyrics || 'resources/lyrics.lrc').then(r => r.ok ? r.text() : '').then(t => { L = parseLrc(t); }).catch(() => {});
  setInterval(() => {
    const H = window.HSong;
    if (!L.length || !H || H.song.paused || !H.using()) { if (li != -1) { LY.classList.remove('on'); li = -1; } return; }
    const t = H.song.currentTime + .15; let i = -1;
    for (let k = 0; k < L.length && L[k][0] <= t; k++) i = k;
    if (i !== li) {
      li = i; LY.classList.remove('on');
      setTimeout(() => { const x = i >= 0 ? L[i][1] : ''; LY.textContent = x; LY.classList.toggle('on', !!x); }, 180);
    }
  }, 150);

  /* ---------- 3. Midnight surprise ---------- */
  const mid = document.createElement('div'); mid.id = 'mid';
  mid.innerHTML = '<small>Birthday in</small><b id="midn">10</b><small>seconds</small>';
  document.body.appendChild(mid);
  let prev = null, pend = false;
  function fireMidnight() {
    mid.classList.remove('on');
    try { closeAll(); dro(false); } catch (e) {}
    try { celebrate(); } catch (e) {}
    setTimeout(() => { try { bdayShow(); } catch (e) {} }, 600);
    try { confetti(60); fire(12); } catch (e) {}
  }
  const p2 = n => String(n).padStart(2, '0');
  setInterval(() => {
    const d = BDAY - now(), app = document.body.classList.contains('app');
    const cdEl = $('cd');
    if (cdEl && d > 0 && d < 864e5) {
      const s = Math.floor(d / 1000);
      cdEl.textContent = '🌙 Birthday in ' + p2(Math.floor(s / 3600)) + ':' + p2(Math.floor(s % 3600 / 60)) + ':' + p2(s % 60);
    }
    if (app && d > 0 && d <= 10500) { $('midn').textContent = Math.max(1, Math.ceil(d / 1000)); mid.classList.add('on'); }
    else if (d <= 0 || d > 10500) mid.classList.remove('on');
    if (prev !== null && prev > 0 && d <= 0 && d > -20000) pend = true;
    if (pend && app) { pend = false; fireMidnight(); }
    prev = d;
  }, 250);

  /* ---------- 4. Open When: your text + optional voice note per letter ---------- */
  try {
    if (Array.isArray(C.openWhen) && C.openWhen.length) { OW.length = 0; C.openWhen.forEach(o => OW.push(o)); }
    $('owl').innerHTML = OW.map((o, i) => `<button data-i="${i}" style="text-align:left;padding:14px 18px;border-radius:16px">${esc(o[0])} ${esc(o[1])}</button>`).join('');
    let ow = null;
    const stopOW = () => { if (ow) { ow.pause(); ow = null; } duck(false); };
    $('owl').onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      const o = OW[b.dataset.i], t = $('owt');
      $('owl').style.display = 'none'; t.style.display = 'block';
      t.innerHTML = '<b style="font:32px \'Great Vibes\',cursive;color:#b03a5f">' + esc(o[1]) + '</b><br><br>' + esc(o[2]).replace(/\n/g, '<br>') +
        '<br><span id="owv"></span><br><small style="opacity:.6">(tap to go back)</small>';
      if (o[3]) {
        const a = new Audio(o[3]); a.preload = 'metadata';
        a.addEventListener('loadedmetadata', () => {
          const v = $('owv'); if (!v) return;
          v.innerHTML = '<button class="owp" style="color:#4a2b35;border-color:#b03a5f66;background:#b03a5f18">🎙️ Hear my voice</button>';
          v.firstChild.onclick = ev => {
            ev.stopPropagation();
            if (ow && !ow.paused) { stopOW(); v.firstChild.textContent = '🎙️ Hear my voice'; return; }
            ow = a; duck(true); a.currentTime = 0; a.play().catch(() => tstS('Could not play the voice note'));
            v.firstChild.textContent = '⏸ Pause';
            a.onended = () => { duck(false); if (v.firstChild) v.firstChild.textContent = '🎙️ Hear my voice'; };
          };
        });
        t.dataset.a = '1';
      }
    };
    $('owt').onclick = () => { stopOW(); $('owt').style.display = 'none'; $('owl').style.display = 'flex'; };
    onClose($('ow'), stopOW);
  } catch (e) {}

  /* ---------- 5. 26 Reasons ---------- */
  const RS = (C.reasons || []).slice(0, 26);
  if (RS.length) {
    let ro = ls.get('r26', []);
    mk('r26', '<h4 style="margin:0 0 10px;letter-spacing:.15em;color:var(--acc);font-size:12px;text-transform:uppercase">26 Reasons You Are Special</h4><div id="r26g"></div><p id="r26s" style="font-size:12px;opacity:.8"></p>');
    mk('r26c', '<div class="lt" id="r26t" style="text-align:center;font:18px/1.7 Georgia,serif"></div>');
    const rr = () => {
      const g = $('r26g'); g.innerHTML = '';
      RS.forEach((_, i) => {
        const b = document.createElement('button'), op = ro.includes(i);
        b.className = 'wt ' + (op ? 'op' : 'nw'); b.style.animation = op ? 'none' : '';
        b.innerHTML = `<b>${i + 1}</b><span>${op ? '💖' : '💗'}</span>`;
        b.onclick = () => {
          if (!ro.includes(i)) { ro.push(i); ls.set('r26', ro); }
          $('r26t').innerHTML = `<small style="letter-spacing:.2em;color:#b03a5f">REASON ${i + 1} OF ${RS.length}</small><p style="margin:10px 0 0">${esc(RS[i])}</p>`;
          opn('r26c'); try { sfx('pop'); } catch (e) {}
          if (ro.length == RS.length && !ls.get('r26f', 0)) {
            ls.set('r26f', 1);
            setTimeout(() => { $('r26t').innerHTML = `<p style="margin:0">${esc(C.reasonsFinale || 'Happy Birthday, Hina! 💖')}</p>`; opn('r26c'); try { fire(8); confetti(40); } catch (e) {} }, 2600);
          }
          rr();
        };
        g.appendChild(b);
      });
      $('r26s').textContent = `Opened ${ro.length}/${RS.length}`;
    };
    addNav('reasons', '💗', '26 Reasons', () => { rr(); opn('r26'); }, 'r26');
  }

  /* ---------- 6. Photo Reveal game ---------- */
  const RV = C.reveal || [];
  if (RV.length) {
    mk('rv', '<div id="rvb" style="width:min(88vw,340px);text-align:center"></div>');
    let ri = 0, tries = 0;
    const rvR = () => {
      const r = RV[ri]; tries = 0;
      if (!r) {
        $('rvb').innerHTML = '<div style="font-size:60px">🏆</div><h3>Every photo revealed!</h3><p>The same lovely smile in every photo. 💖</p><button id="rvr">↺ Play again</button>';
        try { fire(6); confetti(30); } catch (e) {}
        $('rvr').onclick = () => { ri = 0; rvR(); }; return;
      }
      const src = BAKED[r.p % BAKED.length][0];
      $('rvb').innerHTML = `<p style="opacity:.7;font-size:12px;margin:0 0 8px">Photo ${ri + 1}/${RV.length}</p><div class="rvp" id="rvp"><div id="rvi"></div></div><div class="rvq">${esc(r.q)}</div><div id="rvo">${r.o.map((o, i) => `<button class="rvo" data-i="${i}">${esc(o)}</button>`).join('')}</div><div id="rvn"></div>`;
      $('rvi').style.backgroundImage = 'url(' + src + ')';
    };
    $('rvb').addEventListener('click', e => {
      const b = e.target.closest('.rvo'); if (!b || b.disabled) return;
      const r = RV[ri], ok = +b.dataset.i == r.a; tries++;
      if (ok || tries >= 2) {
        document.querySelectorAll('.rvo').forEach((x, i) => { x.disabled = true; if (i == r.a) x.classList.add('ok'); });
        if (!ok) b.classList.add('no');
        $('rvi').style.filter = ''; $('rvp').classList.add('s');
        $('rvn').innerHTML = `<p style="font:26px 'Great Vibes',cursive;margin:12px 0 6px;color:var(--acc)">${esc(r.cap || '')}</p><button id="rvx">${ri + 1 < RV.length ? 'Next photo ▶' : 'Finish 🏁'}</button>`;
        $('rvx').onclick = () => { ri++; rvR(); };
        if (ok) { try { confetti(14); sfx('pop'); } catch (e) {} }
      } else {
        b.classList.add('no'); b.disabled = true; $('rvi').style.filter = 'blur(12px)'; tstS('Think again 😄');
      }
    });
    addGame('🔍 Photo Reveal', 'rv', () => { ri = 0; rvR(); opn('rv'); }, 'rv');
  }

  /* ---------- 7. Catch game ---------- */
  const G = C.catchGame;
  if (G) {
    mk('cg', '<div style="text-align:center"><div id="cgh" style="font-size:14px;margin-bottom:8px"></div><div class="cga" id="cga"></div><div class="bn" style="justify-content:center"><button id="cgs">▶ Start</button></div></div>');
    let cT = 0, cS = 0, cI = null, cP = null, cOn = false;
    const hud = () => { $('cgh').textContent = `${G.item} ${cS}/${G.goal}   ·   ⏱ ${Math.max(cT, 0)}s`; };
    const stopC = () => { clearInterval(cI); clearInterval(cP); cOn = false; };
    const endC = () => {
      stopC(); const win = cS >= G.goal;
      $('cga').innerHTML = '<div class="cgm">' + esc(win ? G.win : G.lose) + '</div>';
      if (win) { try { fire(6); confetti(30); } catch (e) {} }
      $('cgs').textContent = '↺ Play again';
    };
    const spawn = () => {
      const d = document.createElement('div'); d.className = 'cgi'; d.textContent = G.item;
      d.style.left = (4 + Math.random() * 78) + '%'; d.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
      d.addEventListener('pointerdown', e => { e.preventDefault(); if (!cOn || !d.isConnected) return; d.remove(); cS++; hud(); try { sfx('pop'); } catch (x) {} });
      d.addEventListener('animationend', () => d.remove());
      $('cga').appendChild(d);
    };
    const startC = () => {
      stopC(); cS = 0; cT = G.secs; cOn = true; $('cga').innerHTML = ''; hud(); $('cgs').textContent = '⏹ Stop';
      cI = setInterval(() => { cT--; hud(); if (cT <= 0) endC(); }, 1000); cP = setInterval(spawn, 650); spawn();
    };
    $('cgs').onclick = () => { if (cOn) { stopC(); $('cgs').textContent = '▶ Start'; $('cga').innerHTML = ''; } else startC(); };
    onClose($('cg'), () => { stopC(); $('cgs').textContent = '▶ Start'; });
    addGame('🎯 ' + esc(G.title || 'Catch game'), 'cg', () => { $('cga').innerHTML = ''; cT = G.secs; cS = 0; hud(); $('cgs').textContent = '▶ Start'; opn('cg'); }, 'cg');
  }

  /* ---------- 8. Scratch coupons ---------- */
  const CP = C.coupons || [];
  if (CP.length) {
    mk('cpn', '<div class="sg" id="cpl" style="align-items:center"></div>');
    const cpR = () => {
      const claimed = ls.get('cpc', []);
      $('cpl').innerHTML = '<h4>Your coupons 🎟️</h4>' + CP.map((c, i) => `<div class="cpw" data-i="${i}"><div class="cpb"><span>${esc(c[0])}</span><div><b>${esc(c[1])}</b><br><small>${esc(c[2] || '')}</small></div></div><canvas width="300" height="96"></canvas></div>`).join('') +
        '<p style="font-size:12px;opacity:.8;text-align:center;margin:8px 0 0">Scratch to reveal, then send me a screenshot 😄</p>';
      $('cpl').querySelectorAll('.cpw').forEach(w => {
        const i = +w.dataset.i, cv = w.querySelector('canvas');
        if (claimed.includes(i)) { cv.remove(); return; }
        const x = cv.getContext('2d'), g = x.createLinearGradient(0, 0, 300, 96);
        g.addColorStop(0, '#e9c46a'); g.addColorStop(.5, '#f6e7b0'); g.addColorStop(1, '#c9962b');
        x.fillStyle = g; x.fillRect(0, 0, 300, 96);
        x.fillStyle = '#7a5a10'; x.font = '600 15px Poppins,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('✨ Scratch here ✨', 150, 48);
        x.globalCompositeOperation = 'destination-out';
        let down = false, n = 0, done = false;
        const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 300 / r.width, (e.clientY - r.top) * 96 / r.height]; };
        const dot = e => {
          const [px, py] = pt(e); x.beginPath(); x.arc(px, py, 16, 0, 6.283); x.fill();
          if (done || ++n % 6) return;
          const d = x.getImageData(0, 0, 300, 96).data; let c = 0, t = 0;
          for (let k = 3; k < d.length; k += 48) { t++; if (d[k] < 20) c++; }
          if (c / t > .5) {
            done = true; cv.style.opacity = 0; setTimeout(() => cv.remove(), 700);
            const cl = ls.get('cpc', []); if (!cl.includes(i)) { cl.push(i); ls.set('cpc', cl); }
            try { confetti(12); fire(2); } catch (x2) {}
          }
        };
        cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); dot(e); });
        cv.addEventListener('pointermove', e => { if (down) dot(e); });
        cv.addEventListener('pointerup', () => down = false); cv.addEventListener('pointercancel', () => down = false);
      });
    };
    addNav('coupons', '🎟️', 'Coupons', () => { cpR(); opn('cpn'); }, 'cpn');
  }

  /* ---------- 9. Birthday-week greeting ---------- */
  try {
    const g0 = grt;
    grt = function () {
      g0();
      const n = now(), e = $('gr'); if (!e) return;
      if (n >= new Date(2026, 11, 6) && n < BDAY) e.textContent += ' · Birthday week 🎉';
      else if (n >= BDAY && n < new Date(2026, 11, 13)) e.textContent += ' · Happy Birthday 🎂';
    };
    grt();
  } catch (e) {}

  try { setLang(); } catch (e) {}
  window.HX = { C, esc, ls, tstS, addNav, addGame, onClose, duck, now, BDAY, renderNav };
})();
