/* extras2.js: English-only extra features, all text comes from resources/content.js */
(function () {
  const H = window.HX; if (!H) return;
  const C = H.C, esc = H.esc, ls = H.ls;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const X = id => 'x2' + id;
  const open = id => opn(X(id));
  const addNav = (k, e, l, f, o) => H.addNav(k, e, l, f, X(o));
  const addGame = (l, k, f, o) => H.addGame(l, k, f, X(o));
  const box = (id, html) => {
    if (!$(X(id))) mk(X(id), '<div id="' + X(id) + 'b" style="width:min(88vw,340px);text-align:center"></div>');
    const b = $(X(id) + 'b'); if (html !== undefined) b.innerHTML = html; return b;
  };
  const btn = (t, id) => `<button id="${id}">${t}</button>`;
  const big = (t) => `<p style="font:30px 'Great Vibes',cursive;color:var(--acc);margin:10px 0">${esc(t)}</p>`;
  const fx = () => { try { confetti(24); fire(3); } catch (e) {} };

  /* ---------- 1. Quiz: how well do you know Arif? ---------- */
  if (C.arifQuiz && C.arifQuiz.length) {
    const Q = C.arifQuiz, sender = C.sender || 'Arif';
    const b = box('aq', '');
    let i = 0, sc = 0;
    const show = () => {
      if (i >= Q.length) { b.innerHTML = big(`You scored ${sc}/${Q.length}`) + `<p>${sc == Q.length ? 'You know me perfectly! 💖' : 'Not bad! Let me teach you the rest over chai. ☕'}</p>` + btn('↺ Play again', 'aqr'); $('aqr').onclick = () => { i = 0; sc = 0; show(); }; return; }
      const q = Q[i];
      b.innerHTML = `<p style="opacity:.7;font-size:12px">Question ${i + 1}/${Q.length}</p><div class="rvq">${esc(q.q)}</div>` + q.o.map((o, k) => `<button class="rvo" data-k="${k}">${esc(o)}</button>`).join('');
      b.querySelectorAll('.rvo').forEach(x => x.onclick = () => {
        const ok = +x.dataset.k == q.a; if (ok) sc++;
        b.querySelectorAll('.rvo').forEach((y, k) => { y.disabled = true; if (k == q.a) y.classList.add('ok'); });
        if (!ok) x.classList.add('no');
        b.insertAdjacentHTML('beforeend', `<p>${ok ? 'Correct! 🎉' : 'Nope, it was ' + esc(q.o[q.a]) + '.'}</p>${btn(i + 1 < Q.length ? 'Next ▶' : 'See score', 'aqn')}`);
        $('aqn').onclick = () => { i++; show(); };
      });
    };
    addGame('🧠 Quiz: How well do you know ' + esc(sender) + '?', 'aq', () => { i = 0; sc = 0; show(); open('aq'); }, 'aq');
  }

  /* ---------- 2. Word game (5 letters, 6 tries) ---------- */
  if (C.wordGame && C.wordGame.words && C.wordGame.words.length) {
    const W = C.wordGame.words.map(w => w.toUpperCase()), HN = C.wordGame.hints || [];
    const bd = box('wg', '');
    let word, idx, row, cur, over, msg = '';
    const paint = () => {
      let h = `<p style="font-size:12px;opacity:.8">Hint: ${esc(HN[idx] || '')}</p><div id="wgrid" style="display:grid;gap:6px;margin:10px auto;width:max-content">`;
      for (let r = 0; r < 6; r++) { h += '<div style="display:flex;gap:6px">'; for (let c = 0; c < 5; c++) { const ch = (r < row.length) ? row[r][c] : (r == row.length && c < cur.length ? cur[c] : ''); const st = r < row.length ? row[r].st[c] : ''; h += `<span style="width:40px;height:40px;line-height:40px;border-radius:8px;font-weight:700;background:${st == 'y' ? '#2ecc71' : st == 'm' ? '#f1c40f' : st == 'n' ? '#7f8c8d' : '#ffffff22'}">${esc(ch || '')}</span>`; } h += '</div>'; }
      h += `</div><input id="wgi" maxlength="5" autocomplete="off" placeholder="Type a 5-letter word" style="text-transform:uppercase;width:70%;padding:8px;border-radius:10px;border:none;text-align:center"> ${btn('Enter', 'wgs')}<div id="wgm" style="min-height:22px;margin-top:6px;font-size:13px">${esc(msg)}</div>`;
      bd.innerHTML = h;
      $('wgi').oninput = e => { cur = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); e.target.value = cur; };
      $('wgi').onkeydown = e => { if (e.key == 'Enter') submit(); };
      $('wgs').onclick = submit;
    };
    const submit = () => {
      if (over) return;
      const g = ($('wgi').value || '').toUpperCase();
      if (g.length != 5) { msg = 'Use exactly 5 letters'; paint(); return; }
      const st = [...g].map((ch, k) => ch == word[k] ? 'y' : word.includes(ch) ? 'm' : 'n');
      row.push({ g, st }); cur = '';
      msg = ''; if (g == word) { over = true; msg = 'You got it! 🎉'; fx(); }
      else if (row.length >= 6) { over = true; msg = 'The word was ' + word; }
      paint();
    };
    addGame('🔤 Word game', 'wg', () => {
      const i = Math.floor(Math.random() * W.length); idx = i; word = W[i]; row = []; cur = ''; over = false; msg = ''; paint(); open('wg');
    }, 'wg');
  }

  /* ---------- 3. Treasure hunt ---------- */
  if (C.treasure && C.treasure.clues) {
    const T = C.treasure, bd = box('tr', '');
    let k = 0;
    const show = () => {
      if (k >= T.clues.length) { bd.innerHTML = big('Treasure found!') + `<p>${esc(T.prize)}</p>`; fx(); return; }
      bd.innerHTML = `<p style="opacity:.7;font-size:12px">Clue ${k + 1}/${T.clues.length}</p><p>${esc(T.clues[k].text)}</p><input id="tri" autocomplete="off" placeholder="Your answer" style="padding:8px;border-radius:10px;border:none"> ${btn('Check', 'trb')}<div id="trm" style="min-height:22px;margin-top:6px;font-size:13px"></div>`;
      const go = () => { if ($('tri').value.trim().toLowerCase() == T.clues[k].answer.toLowerCase()) { k++; show(); } else $('trm').textContent = 'Not that one, think again!'; };
      $('trb').onclick = go; $('tri').onkeydown = e => { if (e.key == 'Enter') go(); };
    };
    addGame('🗺️ Treasure hunt', 'tr', () => { k = 0; show(); open('tr'); }, 'tr');
  }

  /* ---------- 4. This or That ---------- */
  if (C.thisOrThat && C.thisOrThat.length) {
    const P = C.thisOrThat, bd = box('tot', ''); let i = 0, picks = [];
    const show = () => {
      if (i >= P.length) { bd.innerHTML = big('Your picks') + picks.map(p => `<p style="margin:4px 0">${esc(p)}</p>`).join('') + btn('↺ Again', 'totr'); $('totr').onclick = () => { i = 0; picks = []; show(); }; return; }
      bd.innerHTML = `<p style="opacity:.7;font-size:12px">${i + 1}/${P.length}</p>` + P[i].map((o, k) => `<button class="rvo" data-k="${k}" style="font-size:18px">${esc(o)}</button>`).join('');
      bd.querySelectorAll('.rvo').forEach(x => x.onclick = () => { picks.push(P[i][+x.dataset.k]); i++; show(); });
    };
    addGame('⚖️ This or That', 'tot', () => { i = 0; picks = []; show(); open('tot'); }, 'tot');
  }

  /* ---------- 5. Compliment jar, fortune cookie, blessing card ---------- */
  if (C.compliments && C.compliments.length) {
    addNav('jar', '🫙', 'Compliment Jar', () => {
      const bd = box('jar', '');
      bd.innerHTML = '<p style="opacity:.8">Tap the jar for a compliment</p><div style="font-size:90px;cursor:pointer" id="jarb">🫙</div><p id="jart" style="font:22px/1.5 Georgia,serif;min-height:80px"></p>';
      $('jarb').onclick = () => { $('jart').textContent = pick(C.compliments); try { sfx('pop'); } catch (e) {} };
      open('jar');
    }, 'jar');
  }
  if (C.fortunes && C.fortunes.length) {
    addNav('fort', '🥠', 'Fortune Cookie', () => {
      const bd = box('fort', '');
      bd.innerHTML = '<div style="font-size:90px;cursor:pointer" id="fortb">🥠</div><p>Tap to open your fortune</p><p id="fortt" style="font:22px/1.5 Georgia,serif;min-height:80px"></p>';
      $('fortb').onclick = () => { $('fortt').textContent = pick(C.fortunes); };
      open('fort');
    }, 'fort');
  }
  if (C.blessings && C.blessings.length) {
    addNav('bless', '🌸', 'Blessing Card', () => {
      const bd = box('bless', '');
      const t = pick(C.blessings);
      bd.innerHTML = '<canvas id="blc" width="600" height="600" style="width:100%;border-radius:16px;box-shadow:0 8px 30px #0008"></canvas><p style="font-size:12px;opacity:.8">Long-press the card to save it</p>' + btn('↻ Another blessing', 'blr');
      const c = $('blc'), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 600, 600);
      g.addColorStop(0, '#2a0a22'); g.addColorStop(1, '#6b1f4a'); x.fillStyle = g; x.fillRect(0, 0, 600, 600);
      x.fillStyle = '#ffd97a'; x.textAlign = 'center'; x.font = '70px "Great Vibes", cursive'; x.fillText('For Hina', 300, 170);
      x.fillStyle = '#fff3f7'; x.font = '34px Georgia, serif'; const words = t.split(' '); let line = '', y = 300;
      words.forEach(w => { const test = line + w + ' '; if (x.measureText(test).width > 500) { x.fillText(line, 300, y); line = w + ' '; y += 48; } else line = test; });
      x.fillText(line, 300, y);
      $('blr').onclick = () => { const f = NAV.find(n => n[0] == 'bless'); if (f) RT.bless(); };
      open('bless');
    }, 'bless');
  }

  /* ---------- 6. Bucket list, bingo, schedule, year in review, sparks, wish wall ---------- */
  const listView = (id, items, title, store) => {
    const bd = box(id, '');
    const done = ls.get(store, []);
    const paint = () => {
      bd.innerHTML = `<h4 style="margin:0 0 8px;letter-spacing:.12em;color:var(--acc);font-size:12px;text-transform:uppercase">${esc(title)}</h4><p style="font-size:12px;opacity:.8">Ticked ${done.length}/${items.length}</p>` +
        items.map((t, i) => `<button class="wt ${done.includes(i) ? 'op' : 'nw'}" data-i="${i}" style="display:block;width:100%;text-align:left;margin:4px 0;padding:10px 12px">${done.includes(i) ? '✅' : '⬜'} ${esc(t)}</button>`).join('');
      bd.querySelectorAll('button[data-i]').forEach(b => b.onclick = () => { const i = +b.dataset.i, p = done.indexOf(i); if (p < 0) { done.push(i); fx(); } else done.splice(p, 1); ls.set(store, done); paint(); });
    };
    paint(); open(id);
  };
  if (C.bucket && C.bucket.length) addNav('bucket', '✅', '26 Things To Do', () => listView('bkt', C.bucket, '26 things to do at 26', 'bkt'), 'bkt');
  if (C.bingo && C.bingo.length) addNav('bingo', '🎲', 'Birthday Bingo', () => {
    const cells = shuffle(C.bingo).slice(0, 9), got = ls.get('bng', []);
    const bd = box('bng', '');
    const paint = () => { bd.innerHTML = '<h4 style="margin:0 0 8px;letter-spacing:.12em;color:var(--acc);font-size:12px;text-transform:uppercase">Birthday Bingo</h4><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">' + cells.map((c, i) => `<button data-i="${i}" style="min-height:70px;font-size:12px;padding:6px;background:${got.includes(i) ? '#2ecc71aa' : '#ffffff18'}">${esc(c)}</button>`).join('') + '</div><p style="font-size:12px">Tap each one as it happens today</p>'; bd.querySelectorAll('button[data-i]').forEach(b => b.onclick = () => { const i = +b.dataset.i, p = got.indexOf(i); if (p < 0) { got.push(i); fx(); } else got.splice(p, 1); ls.set('bng', got); paint(); }); };
    paint(); open('bng');
  }, 'bng');
  if (C.schedule && C.schedule.length) addNav('sched', '📅', 'Birthday Plan', () => {
    const bd = box('sch', '<h4 style="margin:0 0 8px;letter-spacing:.12em;color:var(--acc);font-size:12px;text-transform:uppercase">Plan for the day</h4>' + C.schedule.map(s => `<p style="text-align:left;margin:8px 0"><b>${esc(s[0])}</b><br>${esc(s[1])}</p>`).join(''));
    open('sch');
  }, 'sch');
  if (C.yearInReview && C.yearInReview.length) addNav('yir', '🎞️', 'Year in Review', () => {
    let k = 0; const bd = box('yir', ''); const show = () => { const s = C.yearInReview[k]; bd.innerHTML = `<p style="opacity:.7;font-size:12px">${k + 1}/${C.yearInReview.length}</p>${big(s[0])}<p>${esc(s[1])}</p>${btn(k + 1 < C.yearInReview.length ? 'Next ▶' : '↺ Start over', 'yirn')}`; $('yirn').onclick = () => { k = (k + 1) % C.yearInReview.length; show(); }; }; show(); open('yir');
  }, 'yir');
  if (C.sparks && C.sparks.length) addNav('sparks', '✨', 'Daily Spark', () => {
    const d = Math.floor((H.now() - new Date(2026, 10, 17)) / 864e5); const idx = ((d % C.sparks.length) + C.sparks.length) % C.sparks.length;
    box('spk', '<p style="opacity:.7;font-size:12px">Today\'s small idea</p>' + big('Day ' + Math.max(1, d + 1)) + `<p>${esc(C.sparks[idx])}</p>`); open('spk');
  }, 'spk');
  if (C.wishWall && C.wishWall.length) addNav('wall', '💌', 'Wish Wall', () => {
    box('wall', '<h4 style="margin:0 0 8px;letter-spacing:.12em;color:var(--acc);font-size:12px;text-transform:uppercase">Wishes from everyone</h4>' + C.wishWall.map(w => `<div class="rc" style="margin:8px 0;padding:12px;border-radius:14px;background:#ffffff14;text-align:left"><b>${esc(w.from)}</b><p style="margin:6px 0 0">${esc(w.text)}</p></div>`).join(''));
    open('wall');
  }, 'wall');

  /* ---------- 7. Chat replay ---------- */
  if (C.chat && C.chat.length) addNav('chat', '💬', 'Message From Arif', () => {
    const bd = box('cht', '<div id="chl" style="text-align:left;min-height:200px;display:flex;flex-direction:column;gap:8px"></div>' + btn('Next message ▶', 'chn'));
    let k = 0; const chl = $('chl');
    const next = () => { if (k >= C.chat.length) { $('chn').textContent = '↺ Start over'; k = -1; return; } if (k < 0) { chl.innerHTML = ''; k = 0; $('chn').textContent = 'Next message ▶'; } const m = document.createElement('div'); m.textContent = C.chat[k++]; m.style.cssText = 'background:#ffffff22;padding:10px 14px;border-radius:14px;max-width:85%;animation:none'; chl.appendChild(m); };
    $('chn').onclick = next; next(); open('cht');
  }, 'cht');

  /* ---------- 8. Reply button and QR card ---------- */
  if (C.reply && C.reply.phone) addNav('reply', '💬', 'Reply to ' + (C.sender || 'Arif'), () => {
    const url = 'https://wa.me/' + C.reply.phone + '?text=' + encodeURIComponent(C.reply.text || '');
    box('rpl', `<p>Send a thank-you on WhatsApp</p><a href="${url}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 20px;border-radius:14px;background:#25D366;color:#fff;text-decoration:none">Open WhatsApp</a>`);
    open('rpl');
  }, 'rpl');
  if (window.HQR) addNav('qr', '📱', 'Share QR', () => {
    const bd = box('qr', '<canvas id="qrc" style="border-radius:12px;background:#fff;width:70vw;max-width:260px;height:auto"></canvas><p style="font-size:12px;opacity:.8">Scan to open this page</p>');
    const u = location.href.split('#')[0];
    HQR.draw($('qrc'), u, 520) || (bd.innerHTML = '<p>This link is too long for a QR code.</p>');
    open('qr');
  }, 'qr');

  /* ---------- 9. Gift unlock ---------- */
  if (C.gift && C.gift.unlock) addNav('gift', '🎁', C.gift.title || 'Your Gift', () => {
    const unlockAt = new Date(C.gift.unlock + 'T00:00:00');
    const left = unlockAt - H.now();
    box('gft', left > 0
      ? `<p>🔒 Unlocks on ${esc(C.gift.unlock)}</p><p style="opacity:.8">Patience, good things take time.</p>`
      : `<p style="font:28px 'Great Vibes',cursive">${esc(C.gift.clue)}</p>`);
    open('gft');
  }, 'gft');

  H.renderNav();
  try { setLang(); } catch (e) {}
})();
