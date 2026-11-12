/* extras8.js: entrance curtain. After the candle intro, gold curtains part to reveal a beating heart, then the site opens. */
(function () {
  const H = window.HX; if (!H) return;
  const w = setInterval(() => {
    if (!document.body.classList.contains('app')) return;
    clearInterval(w); run();
  }, 200);

  function run() {
    const el = document.createElement('div'); el.id = 'x8cur';
    el.innerHTML =
      '<div class="x8l"></div><div class="x8r"></div>' +
      '<div class="x8c"><svg class="x8heart" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="x8g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#ffd97a"/><stop offset="1" stop-color="#e0458b"/></linearGradient></defs><path fill="url(#x8g)" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.2 0 3.6 1.3 5.4 3.1 1.8-1.8 3.2-3.1 5.4-3.1 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>' +
      '<p class="x8t">Happy 26th Birthday</p><p class="x8n">Hina Naqvi</p><small class="x8s">tap to skip</small></div>';
    document.body.appendChild(el);

    let done = false;
    const finish = () => {
      if (done) return; done = true;
      el.classList.add('open');
      setTimeout(() => { try { confetti(50); fire(6); } catch (e) {} }, 1600);
      setTimeout(() => el.remove(), 2900);
    };
    el.addEventListener('click', finish);
    setTimeout(finish, 3400);
  }
})();
