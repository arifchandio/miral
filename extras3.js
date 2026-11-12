/* extras3.js: preview lock, candle wish, mood picker, thank-you card, slideshow, large text */
(function () {
  const H = window.HX; if (!H) return;
  const C = H.C, esc = H.esc, ls = H.ls;
  const X = id => 'x3' + id;
  const addNav = (k, e, l, f, o) => H.addNav(k, e, l, f, X(o));
  const box = (id, html) => {
    if (!$(X(id))) mk(X(id), '<div id="' + X(id) + 'b" style="width:min(88vw,340px);text-align:center"></div>');
    const b = $(X(id) + 'b'); if (html !== undefined) b.innerHTML = html; return b;
  };
  const open = id => opn(X(id));

  /* 1. Hide the two "Preview" buttons. Tap the Settings heading 5 times to show them (for you only). */
  const pv = [$('pvb'), $('pvw')];
  pv.forEach(b => { if (b) b.style.display = 'none'; });
  let taps = 0, tt = 0;
  const stgTitle = [...$('stg').querySelectorAll('h4')][0];
  if (stgTitle) stgTitle.addEventListener('click', () => {
    const n = Date.now(); if (n - tt > 3000) taps = 0; tt = n;
    if (++taps >= 5) { taps = 0; pv.forEach(b => { if (b) b.style.display = ''; }); H.tstS('Preview buttons unlocked'); }
  });

  /* 2. Candle wish: appears after she blows the candles out */
  if (C.candleWish && typeof bl !== 'undefined' && bl) {
    const orig = bl.onclick;
    bl.onclick = function (e) {
      const wasLit = lit;
      if (orig) orig.call(this, e);
      if (wasLit && !lit) setTimeout(() => {
        const w = box('cw', '<div style="font:30px \'Great Vibes\',cursive;color:var(--acc)">' + esc(C.candleWish) + '</div>');
        open('cw'); try { fire(3); } catch (x) {}
      }, 1200);
    };
  }

  /* 3. Mood picker: opens the matching Open When letter */
  if (C.moods && C.moods.length && C.openWhen && C.openWhen.length) {
    addNav('mood', '🌤️', 'How are you feeling?', () => {
      const bd = box('mood', '<p>How are you feeling today?</p>' + C.moods.map((m, i) => `<button data-i="${i}" style="display:block;width:100%;margin:6px 0">${esc(m[0])}</button>`).join(''));
      bd.querySelectorAll('button[data-i]').forEach(b => b.onclick = () => {
        const idx = C.moods[+b.dataset.i][1];
        try { RT.openw ? RT.openw() : openOW(); } catch (e) { try { openOW(); } catch (x) {} }
        setTimeout(() => { const t = document.querySelector('#owl button[data-i="' + idx + '"]'); if (t) t.click(); }, 60);
      });
      open('mood');
    }, 'mood');
  }

  /* 4. Thank-you card */
  if (C.thanks) addNav('thanks', '💛', 'Thank You', () => {
    const t = C.thanks;
    box('ty', '<p style="font:34px \'Great Vibes\',cursive;color:var(--acc);margin:8px 0">' + esc(t.title) + '</p><p>' + esc(t.text) + '</p><p style="opacity:.8">With love, ' + esc(t.from || '') + '</p>');
    open('ty');
  }, 'ty');

  /* 5. Photo slideshow with slow zoom */
  if (typeof BAKED !== 'undefined' && BAKED.length) addNav('slides', '🎞️', 'Photo Slideshow', () => {
    const bd = box('sl', '<div id="slv" style="width:min(84vw,300px);height:min(60vh,380px);border-radius:18px;overflow:hidden;position:relative;margin:0 auto;box-shadow:0 10px 40px #000a"><div id="slp" style="position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 1s;transform:scale(1.12);transition:transform 4.5s linear,opacity 1s"></div></div><p id="slc" style="font:24px \'Great Vibes\',cursive;min-height:34px;margin:12px 0 0"></p>');
    let i = 0, tm = null;
    const show = () => {
      const p = BAKED[i % BAKED.length];
      const el = $('slp'); el.style.opacity = 0;
      setTimeout(() => {
        el.style.backgroundImage = 'url(' + p[0] + ')'; el.style.transform = 'scale(1.12)';
        requestAnimationFrame(() => { el.style.transform = 'scale(1)'; el.style.opacity = 1; });
        $('slc').textContent = p[1] || '';
      }, 350);
      i++;
    };
    show(); tm = setInterval(show, 4500);
    H.onClose($('x3sl'), () => clearInterval(tm));
    open('sl');
  }, 'sl');

  /* 6. Large text option, stored on this phone */
  const big = ls.get('x3big', 0);
  if (big) document.body.classList.add('hbig');
  addNav('display', '🔠', 'Text Size', () => {
    const bd = box('dsp', '<p>Text size</p><button data-s="0">Normal</button> <button data-s="1">Large</button>');
    bd.querySelectorAll('button[data-s]').forEach(b => b.onclick = () => {
      const v = +b.dataset.s; ls.set('x3big', v); document.body.classList.toggle('hbig', !!v);
    });
    open('dsp');
  }, 'dsp');

  /* 7. Cake settles: after the entrance spin, it eases back to its front position and stays still */
  (function settleCake() {
    const go = () => {
      const from = rot, to = 0, dur = 1800, t0 = performance.now();
      window.HHold = true;
      const f = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        rot = from + (to - from) * e;
        if (k < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    };
    const w = setInterval(() => {
      if (document.body.classList.contains('app')) { clearInterval(w); setTimeout(go, 3500); }
    }, 300);
  })();

  H.renderNav();
})();
