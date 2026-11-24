/* Material textures for the profile, copied from the site painters. */
(function () {
  /* ---------- seeded random so textures look the same every load ---------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function sizeCanvas(c) {
    var r = c.getBoundingClientRect();
    var dpr = 2;
    c.width = Math.max(1, Math.round(r.width * dpr));
    c.height = Math.max(1, Math.round(r.height * dpr));
    return { ctx: c.getContext("2d"), w: c.width, h: c.height, dpr: dpr };
  }

  function grain(ctx, w, h, amount, rand) {
    var img = ctx.getImageData(0, 0, w, h);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var n = (rand() - 0.5) * amount;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
  }

  function shade(base, v) {
    return "rgb(" + Math.round(base[0] * v) + "," + Math.round(base[1] * v) + "," + Math.round(base[2] * v) + ")";
  }

  function stone(ctx, x, y, r, sides, rand, base, round) {
    ctx.beginPath();
    var pts = [];
    for (var i = 0; i < sides; i++) {
      var a = (i / sides) * Math.PI * 2 + rand() * 0.5;
      var rr = r * (round ? 0.85 + rand() * 0.25 : 0.6 + rand() * 0.5);
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * (round ? 0.8 : 0.9)]);
    }
    if (round) {
      ctx.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
      for (var j = 1; j <= pts.length; j++) {
        var p = pts[j % pts.length], q = pts[(j + 1) % pts.length];
        ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
      }
    } else {
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
    }
    ctx.closePath();
    var v = 0.75 + rand() * 0.45;
    var g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    g.addColorStop(0, shade(base, v * 1.18));
    g.addColorStop(1, shade(base, v * 0.72));
    ctx.fillStyle = g;
    ctx.shadowColor = "rgba(0,0,0,.45)";
    ctx.shadowBlur = r * 0.35;
    ctx.shadowOffsetY = r * 0.18;
    ctx.fill();
    ctx.shadowColor = "transparent";
  }

  var painters = {
    sand: function (c) {
      var s = sizeCanvas(c), ctx = s.ctx, rand = rng(11);
      ctx.fillStyle = "#C8B288"; ctx.fillRect(0, 0, s.w, s.h);
      for (var i = 0; i < 26; i++) {
        var y = (i / 26) * s.h * 1.2 - s.h * 0.1;
        ctx.beginPath();
        for (var x = 0; x <= s.w; x += 8) {
          var yy = y + Math.sin(x / (60 * s.dpr) + i) * 9 * s.dpr + Math.sin(x / (23 * s.dpr)) * 3 * s.dpr;
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = i % 2 ? "rgba(255,245,220,.18)" : "rgba(90,70,40,.16)";
        ctx.lineWidth = (3 + rand() * 6) * s.dpr;
        ctx.stroke();
      }
      grain(ctx, s.w, s.h, 70, rand);
    },
    aggregate: function (c) {
      var s = sizeCanvas(c), ctx = s.ctx, rand = rng(27);
      ctx.fillStyle = "#5a5b5c"; ctx.fillRect(0, 0, s.w, s.h);
      var n = Math.round((s.w * s.h) / (380 * s.dpr * s.dpr));
      for (var i = 0; i < n; i++) {
        var r = (5 + rand() * 11) * s.dpr;
        stone(ctx, rand() * s.w, rand() * s.h, r, 5 + Math.floor(rand() * 3), rand, [150, 150, 148], false);
      }
      grain(ctx, s.w, s.h, 26, rand);
    },
    gravel: function (c) {
      var s = sizeCanvas(c), ctx = s.ctx, rand = rng(5);
      ctx.fillStyle = "#7d7364"; ctx.fillRect(0, 0, s.w, s.h);
      var n = Math.round((s.w * s.h) / (520 * s.dpr * s.dpr));
      var tones = [[196, 182, 160], [170, 160, 146], [210, 200, 182], [150, 136, 118]];
      for (var i = 0; i < n; i++) {
        var r = (7 + rand() * 9) * s.dpr;
        stone(ctx, rand() * s.w, rand() * s.h, r, 7, rand, tones[Math.floor(rand() * tones.length)], true);
      }
      grain(ctx, s.w, s.h, 22, rand);
    },
    rock: function (c) {
      var s = sizeCanvas(c), ctx = s.ctx, rand = rng(91);
      var bg = ctx.createLinearGradient(0, 0, 0, s.h);
      bg.addColorStop(0, "#2b2e31"); bg.addColorStop(1, "#1b1d1f");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, s.w, s.h);
      var n = Math.max(7, Math.round((s.w * s.h) / (16000 * s.dpr * s.dpr)));
      for (var i = 0; i < n; i++) {
        var r = (34 + rand() * 46) * s.dpr;
        stone(ctx, rand() * s.w, rand() * s.h, r, 6 + Math.floor(rand() * 3), rand, [118, 116, 112], false);
      }
      grain(ctx, s.w, s.h, 30, rand);
    },
    hero: function (c) {
      var s = sizeCanvas(c), ctx = s.ctx, rand = rng(42);
      ctx.fillStyle = "#1c1e20"; ctx.fillRect(0, 0, s.w, s.h);
      var n = Math.round((s.w * s.h) / (900 * s.dpr * s.dpr));
      for (var i = 0; i < n; i++) {
        var x = rand() * s.w, y = rand() * s.h;
        var far = x / s.w;
        var r = (4 + rand() * 14 + far * 16) * s.dpr;
        var sandy = rand() < 0.35;
        stone(ctx, x, y, r, sandy ? 7 : 6, rand, sandy ? [150, 132, 100] : [96, 96, 94], sandy);
      }
      grain(ctx, s.w, s.h, 24, rand);
    },
  };

  document.querySelectorAll("canvas[data-tex]").forEach(function (c) {
    var f = painters[c.getAttribute("data-tex")];
    if (f) f(c);
  });
})();
