/* extras6.js: VIP pass with crown, My Wish candle, Photo of the Day, Final Credits */
(function () {
  const H = window.HX; if (!H) return;
  const C = H.C, esc = H.esc, ls = H.ls;
  const X = id => 'x6' + id;
  const box = (id, html) => {
    if (!$(X(id))) mk(X(id), '<div id="' + X(id) + 'b" style="width:min(88vw,340px);text-align:center"></div>');
    const b = $(X(id) + 'b'); if (html !== undefined) b.innerHTML = html; return b;
  };
  const open = id => opn(X(id));
  const photos = (typeof BAKED !== 'undefined' && BAKED.length) ? BAKED : [];

  /* 1. VIP pass: a gold card with her photo and a crown, shown once after the tap-to-open */
  if (photos.length) {
    const vip = document.createElement('div'); vip.id = 'x6vip';
    vip.innerHTML = '<div class="x6c"><div class="x6crown">👑</div><div class="x6ph" style="background-image:url(' + photos[0][0] + ')"></div><small>VIP Birthday Pass</small><b>Hina Naqvi</b><span>Age 26 · All access</span></div>';
    document.body.appendChild(vip);
    vip.onclick = () => { vip.classList.add('gone'); setTimeout(() => vip.remove(), 900); };
    const showVip = () => {
      if (ls.get('x6vip', 0)) { vip.remove(); return; }
      ls.set('x6vip', 1);
      setTimeout(() => vip.classList.add('on'), 200);
      setTimeout(() => { vip.classList.add('gone'); setTimeout(() => vip.remove(), 900); }, 5200);
    };
    const w = setInterval(() => {
      if (document.body.classList.contains('app') && !document.getElementById('x8cur')) { clearInterval(w); setTimeout(showVip, 1500); }
    }, 300);
  }

  /* 2. My Wish: she types a wish before the candles, saved on her phone */
  addNav_('wish', '🌟', 'My Wish', () => {
    const saved = ls.get('x6wish', '');
    const bd = box('wish', '<p>Make a wish before you blow the candles 🕯️</p>' +
      (saved ? '<div class="x6w">' + esc(saved) + '</div><p style="font-size:12px;opacity:.8">Your wish is saved on this phone 🌟</p>' :
        '<input id="x6wi" maxlength="120" placeholder="Your wish..." style="width:100%;padding:10px;border-radius:12px;border:none"><p></p><button id="x6ws">Save my wish</button>'));
    if (!saved) $('x6ws').onclick = () => {
      const v = ($('x6wi').value || '').trim(); if (!v) return;
      ls.set('x6wish', v); try { fire(4); confetti(20); } catch (e) {}
      RT.wish();
    };
    open('wish');
  }, 'wish');

  /* 3. Photo of the Day: one photo per day, with its caption */
  if (photos.length) addNav_('potd', '📷', 'Photo of the Day', () => {
    const d = Math.floor((H.now() - new Date(2026, 10, 17)) / 864e5);
    const i = ((d % photos.length) + photos.length) % photos.length;
    box('potd', '<p style="opacity:.7;font-size:12px;margin:0 0 6px">Day ' + Math.max(1, d + 1) + '</p>' +
      '<div style="width:min(70vw,260px);aspect-ratio:3/4;margin:0 auto;border-radius:18px;border:3px solid #ffd97a;background:center/cover no-repeat url(' + photos[i][0] + ');box-shadow:0 10px 40px #000a"></div>' +
      '<p style="font:22px \'Great Vibes\',cursive;margin:10px 0 0">' + esc(photos[i][1] || '') + '</p>');
    open('potd');
  }, 'potd');

  /* 4. Final credits: scrolls up, like the end of a film */
  if (C.credits && C.credits.length) addNav_('credits', '🎬', 'Final Credits', () => {
    const cr = document.createElement('div'); cr.id = 'x6cr';
    cr.innerHTML = '<div class="x6roll">' + C.credits.map((l, i) => '<p class="' + (i == C.credits.length - 1 ? 'x6end' : '') + '">' + esc(l) + '</p>').join('') + '</div>';
    document.body.appendChild(cr);
    cr.onclick = () => { cr.classList.add('gone'); setTimeout(() => cr.remove(), 800); };
    setTimeout(() => cr.classList.add('run'), 50);
    setTimeout(() => { if (cr.isConnected) { cr.classList.add('gone'); setTimeout(() => cr.remove(), 800); } }, 16000);
  }, 'credits');

  function addNav_(key, emo, label, fn, ovId) {
    H.addNav(key, emo, label, fn, X(ovId));
  }
  H.renderNav();
})();
