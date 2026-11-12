/* extras7.js: red-carpet photo flash, and the wish is made before the candles are blown out */
(function () {
  const H = window.HX; if (!H) return;
  const ls = H.ls, C = H.C, esc = H.esc;
  const photos = (typeof BAKED !== 'undefined' && BAKED.length) ? BAKED : [];

  /* 1. Red carpet: photos flash one after another, like paparazzi */
  if (photos.length) H.addNav('carpet', '📸', 'Red Carpet', () => {
    const old = document.getElementById('x7carpet'); if (old) old.remove();
    const el = document.createElement('div'); el.id = 'x7carpet';
    el.innerHTML = '<div class="x7bg"></div><div class="x7fl"></div><div class="x7cap"><small>Arriving tonight</small><b id="x7n"></b><span id="x7t"></span></div><div class="x7hint">Tap to close</div>';
    document.body.appendChild(el);
    let i = 0, tm = null;
    const step = () => {
      const p = photos[i % photos.length];
      el.querySelector('.x7bg').style.backgroundImage = 'url(' + p[0] + ')';
      const fl = el.querySelector('.x7fl'); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
      el.querySelector('#x7t').textContent = p[1] || '';
      el.querySelector('#x7n').textContent = 'Hina Naqvi';
      i++;
      try { sfx('pop'); } catch (e) {}
    };
    step(); tm = setInterval(step, 1800);
    const close = () => { clearInterval(tm); el.classList.add('gone'); setTimeout(() => el.remove(), 700); };
    el.onclick = close;
  }, 'x7carpet');

  /* 2. Wish first: tapping "Blow out" with no saved wish opens My Wish. After saving, tap Blow out again. */
  try {
    const wrapped = bl.onclick;
    bl.onclick = function (e) {
      const wished = !!ls.get('x6wish', '');
      if (!wished && lit) {
        RT.wish && RT.wish();
        return;
      }
      if (wrapped) wrapped.call(this, e);
    };
  } catch (e) {}

  H.renderNav();
})();
