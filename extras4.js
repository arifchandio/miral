/* extras4.js: removes Sky Lanterns; adds red-carpet opening text, golden touch trail,
   midnight banner + breaking-news ticker, and the 12 December surprise curtain. */
(function () {
  const H = window.HX; if (!H) return;
  const C = H.C, esc = H.esc, ls = H.ls;
  const BDAY = H.BDAY, now = H.now;

  /* 1. Remove Sky Lanterns everywhere it appears */
  try {
    const i = NAV.findIndex(n => n[0] == 'lantern'); if (i > -1) NAV.splice(i, 1);
    delete RT.lantern;
    document.querySelectorAll('[data-p="lantern"]').forEach(e => e.remove());
    const ln = document.getElementById('ln'); if (ln) ln.remove();
    H.renderNav();
  } catch (e) {}

  /* 2. Red-carpet opening: gold spotlight behind the title */
  const tap = document.getElementById('tapo');
  if (tap) { const sp = document.createElement('div'); sp.className = 'hspot'; tap.prepend(sp); }

  /* 3. Golden touch trail */
  let last = 0;
  document.addEventListener('pointermove', e => {
    const n = Date.now(); if (n - last < 45) return; last = n;
    const d = document.createElement('i'); d.className = 'htrail';
    d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px';
    document.body.appendChild(d); setTimeout(() => d.remove(), 800);
  }, { passive: true });

  /* 4. Midnight banner and breaking-news ticker (12 Dec, while the site is open) */
  const tk = document.createElement('div'); tk.id = 'htk';
  tk.innerHTML = '<div class="htkt">' + (C.ticker || []).map(t => '<span>' + esc(t) + '</span>').join('<b>✦</b>') + '</div>';
  document.body.appendChild(tk);
  const banner = document.createElement('div'); banner.id = 'hban';
  banner.innerHTML = '<div><small>Happy</small><b>26th Birthday</b><span>Hina Naqvi</span></div>';
  document.body.appendChild(banner);
  const onDay = () => { const d = now(); return d >= BDAY && d < new Date(2026, 11, 13); };
  let shown = false;
  const show = () => {
    if (shown) return; shown = true;
    banner.classList.add('on'); try { confetti(60); fire(10); } catch (e) {}
    setTimeout(() => banner.classList.remove('on'), 6000);
  };
  // when the clock hits midnight on the 12th, show the banner once
  setInterval(() => { if (onDay() && !ls.get('hban', 0)) { ls.set('hban', 1); show(); } }, 1000);

  /* 5. Surprise curtain: opens on the birthday, once per visit */
  const S = C.surprise;
  if (S && S.text) {
    const cur = document.createElement('div'); cur.id = 'hcur';
    cur.innerHTML = '<div class="hcl"></div><div class="hcr"></div><div class="hcm"><small>A special message</small><h3>' + esc(S.title || '') + '</h3><p>' + esc(S.text) + '</p><button id="hcb">Open ✦</button></div>';
    document.body.appendChild(cur);
    const openCur = () => {
      if (cur.classList.contains('open')) return;
      cur.classList.add('open'); try { sfx('pop'); } catch (e) {}
      setTimeout(() => cur.remove(), 2200);
    };
    document.getElementById('hcb').onclick = () => { openCur(); };
    const chk = setInterval(() => {
      if (onDay() && document.body.classList.contains('app') && !ls.get('hcur', 0)) {
        ls.set('hcur', 1); clearInterval(chk); cur.classList.add('show');
      }
    }, 1000);
    // not birthday yet: remove curtain so it never blocks the site
    if (!onDay()) cur.remove();
  }
  setInterval(() => { if (onDay()) tk.classList.add('on'); }, 2000);
})();
