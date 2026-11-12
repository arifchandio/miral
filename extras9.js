/* extras9.js: heart reactions on every photo, and "Our Favourite" photo with a golden frame */
(function () {
  const H = window.HX; if (!H) return;
  const ls = H.ls, esc = H.esc;
  const photos = (typeof BAKED !== 'undefined' && BAKED.length) ? BAKED : [];
  if (!photos.length) return;
  const X = id => 'x9' + id;
  const box = (id, html) => {
    if (!$(X(id))) mk(X(id), '<div id="' + X(id) + 'b" style="width:min(90vw,360px);text-align:center"></div>');
    const b = $(X(id) + 'b'); if (html !== undefined) b.innerHTML = html; return b;
  };
  const open = id => opn(X(id));
  const counts = () => { const c = ls.get('x9c', null); return Array.isArray(c) && c.length == photos.length ? c : photos.map(() => 0); };
  const liked = () => ls.get('x9l', []);
  const favIndex = () => { const c = counts(); let b = 0; c.forEach((v, i) => { if (v > c[b]) b = i; }); return c[b] > 0 ? b : -1; };

  function paint() {
    const c = counts(), l = liked(), f = favIndex();
    const fav = f >= 0 ? '<div class="x9fav"><small>⭐ Our Favourite</small><div class="x9fp" style="background-image:url(' + photos[f][0] + ')"></div><p>' + esc(photos[f][1] || '') + ' · 💖 ' + c[f] + '</p></div>' : '<p style="font-size:13px;opacity:.8">Tap the hearts on your favourite photos. The one with the most hearts becomes "Our Favourite".</p>';
    const grid = photos.map((p, i) =>
      '<div class="x9card"><div class="x9ph" style="background-image:url(' + p[0] + ')"></div>' +
      '<button class="x9h" data-i="' + i + '" ' + (l.includes(i) ? 'disabled' : '') + '>' + (l.includes(i) ? '💖' : '🤍') + ' ' + c[i] + '</button></div>').join('');
    box('r', '<h4 style="margin:0 0 8px;letter-spacing:.12em;color:var(--acc);font-size:12px;text-transform:uppercase">Photo Reactions</h4>' + fav + '<div class="x9grid">' + grid + '</div>');
    $(X('r') + 'b').querySelectorAll('.x9h').forEach(b => b.onclick = () => {
      const i = +b.dataset.i; if (liked().includes(i)) return;
      const cc = counts(); cc[i]++; ls.set('x9c', cc);
      ls.set('x9l', liked().concat([i]));
      try { sfx('pop'); } catch (e) {}
      paint();
    });
  }

  H.addNav('reactions', '💖', 'Photo Reactions', () => { paint(); open('r'); }, X('r'));
  H.renderNav();
})();
