/* Tiny QR code generator (byte mode, error correction M, versions 1-10).
   Based on the public algorithm described in the QR Code specification. No external libraries. */
(function (root) {
  const ECC_PER_BLOCK = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26];   // level M, index = version
  const NUM_BLOCKS = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  const bit = (x, i) => ((x >>> i) & 1) != 0;

  function rawModules(v) {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
    return r;
  }
  const dataCodewords = v => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK[v] * NUM_BLOCKS[v];

  function gfMul(x, y) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; }
  function rsDivisor(deg) {
    const r = new Array(deg).fill(0); r[deg - 1] = 1; let root = 1;
    for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { r[j] = gfMul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; } root = gfMul(root, 2); }
    return r;
  }
  function rsRemainder(data, div) {
    const r = new Array(div.length).fill(0);
    data.forEach(b => { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= gfMul(c, f); }); });
    return r;
  }

  function encode(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let ver = 0;
    for (let v = 1; v <= 10; v++) {
      const cc = v < 10 ? 8 : 16;
      if (4 + cc + bytes.length * 8 <= dataCodewords(v) * 8) { ver = v; break; }
    }
    if (!ver) return null;
    const bits = [];
    const push = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    push(4, 4); push(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => push(b, 8));
    const cap = dataCodewords(ver) * 8;
    push(0, Math.min(4, cap - bits.length)); push(0, (8 - bits.length % 8) % 8);
    for (let pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) push(pad, 8);
    const data = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; data.push(b); }

    // split into blocks + ECC, then interleave
    const nb = NUM_BLOCKS[ver], el = ECC_PER_BLOCK[ver], raw = Math.floor(rawModules(ver) / 8);
    const nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), div = rsDivisor(el), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) {
      const d = data.slice(k, k + shortLen - el + (i < nShort ? 0 : 1)); k += d.length;
      blocks.push(d.concat(rsRemainder(d, div)));
      if (i < nShort) blocks[i].splice(d.length, 0, null);   // placeholder keeps columns aligned
    }
    const out = [];
    for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i != shortLen - el || j >= nShort) out.push(b[i]); });
    const final = out.filter(x => x !== null);
    return { ver, codewords: final };
  }

  function build(text) {
    const enc = encode(text); if (!enc) return null;
    const ver = enc.ver, size = ver * 4 + 17;
    const M = Array.from({ length: size }, () => new Array(size).fill(false));
    const F = Array.from({ length: size }, () => new Array(size).fill(false));
    const setF = (x, y, d) => { M[y][x] = d; F[y][x] = true; };
    for (let i = 0; i < size; i++) { setF(6, i, i % 2 == 0); setF(i, 6, i % 2 == 0); }
    const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy; if (x >= 0 && x < size && y >= 0 && y < size) setF(x, y, d != 2 && d != 4); } };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    if (ver > 1) {
      const n = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2, pos = [6];
      for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if ((i == 0 && j == 0) || (i == 0 && j == n - 1) || (i == n - 1 && j == 0)) continue;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
      }
    }
    const formatBits = mask => {   // error correction level M = 0
      const d = (0 << 3) | mask; let rem = d;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const bits = ((d << 10) | rem) ^ 0x5412;
      for (let i = 0; i <= 5; i++) setF(8, i, bit(bits, i));
      setF(8, 7, bit(bits, 6)); setF(8, 8, bit(bits, 7)); setF(7, 8, bit(bits, 8));
      for (let i = 9; i < 15; i++) setF(14 - i, 8, bit(bits, i));
      for (let i = 0; i < 8; i++) setF(size - 1 - i, 8, bit(bits, i));
      for (let i = 8; i < 15; i++) setF(8, size - 15 + i, bit(bits, i));
      setF(8, size - 8, true);
    };
    formatBits(0);   // reserve the format areas so data skips them
    if (ver >= 7) {
      let rem = ver; for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      const bits = (ver << 12) | rem;
      for (let i = 0; i < 18; i++) { const b = bit(bits, i), a = size - 11 + i % 3, c = Math.floor(i / 3); setF(a, c, b); setF(c, a, b); }
    }
    // zigzag data placement
    const cw = enc.codewords; let k = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right == 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) == 0, y = up ? size - 1 - vert : vert;
        if (!F[y][x] && k < cw.length * 8) { M[y][x] = bit(cw[k >>> 3], 7 - (k & 7)); k++; }
      }
    }
    const applyMask = m => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      let inv; switch (m) { case 0: inv = (x + y) % 2 == 0; break; case 1: inv = y % 2 == 0; break; case 2: inv = x % 3 == 0; break; case 3: inv = (x + y) % 3 == 0; break;
        case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0; break; case 5: inv = x * y % 2 + x * y % 3 == 0; break; case 6: inv = (x * y % 2 + x * y % 3) % 2 == 0; break; default: inv = ((x + y) % 2 + x * y % 3) % 2 == 0; }
      if (inv && !F[y][x]) M[y][x] = !M[y][x]; } };
    const penalty = () => {
      let p = 0;
      for (let t = 0; t < 2; t++) for (let a = 0; a < size; a++) { let run = 1; for (let b = 1; b < size; b++) { const cur = t ? M[b][a] : M[a][b], prev = t ? M[b - 1][a] : M[a][b - 1]; if (cur == prev) { run++; if (run == 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) if (M[y][x] == M[y][x + 1] && M[y][x] == M[y + 1][x] && M[y][x] == M[y + 1][x + 1]) p += 3;
      let dark = 0; M.forEach(r => r.forEach(v => { if (v) dark++; }));
      p += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
      return p;
    };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) { applyMask(m); formatBits(m); const p = penalty(); if (p < bestP) { bestP = p; best = m; } applyMask(m); }
    applyMask(best); formatBits(best);
    return { size, get: (x, y) => M[y][x] };
  }

  /* draw(canvas, text, px) paints the QR (with a 4-module quiet zone) and returns true on success */
  function draw(canvas, text, px) {
    const q = build(text); if (!q) return false;
    const n = q.size + 8, s = Math.floor(px / n), W = n * s;
    canvas.width = canvas.height = W;
    const x = canvas.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, W); x.fillStyle = '#000';
    for (let r = 0; r < q.size; r++) for (let c = 0; c < q.size; c++) if (q.get(c, r)) x.fillRect((c + 4) * s, (r + 4) * s, s, s);
    return true;
  }
  root.HQR = { build, draw };
})(typeof window !== 'undefined' ? window : globalThis);
