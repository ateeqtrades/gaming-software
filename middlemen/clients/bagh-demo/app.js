/* Bagh demo: procedural material studies, the sea route map, reveals and the quote form. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (!hasGsap) document.documentElement.classList.add("no-js");

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
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
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

  function paintAll() {
    var hero = document.querySelector(".hero-tex");
    if (hero) painters.hero(hero);
    document.querySelectorAll(".prod").forEach(function (p) {
      var c = p.querySelector(".prod-tex");
      var f = painters[p.getAttribute("data-tex")];
      if (c && f) f(c);
    });
  }

  /* ---------- dotted map ---------- */
  var LAND = [
    [[50, 30], [50, 29.5], [50.5, 29], [51.5, 27.9], [54, 26.6], [56.3, 27.1], [57.3, 25.9], [58.8, 25.6], [61.6, 25.2], [64, 25.3], [66.5, 25.4], [67, 24.8], [68.9, 22.3], [70, 20.9], [72.6, 21.1], [72.8, 19], [73, 17], [73.7, 15.4], [74.4, 13.3], [74.9, 12], [75.5, 11], [76.2, 9.9], [77, 8.3], [77.5, 8.1], [78.2, 8.9], [79.3, 10.3], [79.9, 12], [80.3, 13.5], [80.2, 15.9], [82.3, 16.6], [85, 19.5], [85, 30]],
    [[50, 26.5], [51.5, 25], [52, 24], [54, 24.2], [55.5, 25.5], [56.3, 26.3], [56.35, 25.1], [56.6, 24.4], [57.6, 23.7], [58.6, 23.6], [59.8, 22.5], [59.3, 21.4], [58.5, 20.4], [57.8, 19], [56.8, 18.4], [55.3, 17.6], [54, 16.9], [52.2, 15.6], [50, 15]],
    [[79.9, 9.8], [80.2, 9.8], [81, 8.6], [81.8, 7.5], [81.6, 6.4], [80.6, 5.9], [80, 6.4], [79.8, 7.5], [79.8, 8.6]],
  ];
  function inPoly(pt, poly) {
    var x = pt[0], y = pt[1], inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function drawMap() {
    var g = document.querySelector(".map-dots");
    if (!g) return;
    var ns = "http://www.w3.org/2000/svg";
    var frag = document.createDocumentFragment();
    var step = 0.62;
    for (var lat = 29.7; lat > 0.2; lat -= step) {
      for (var lon = 50.2; lon < 85; lon += step) {
        var land = LAND.some(function (p) { return inPoly([lon, lat], p); });
        // Maldives atolls: a thin chain of dots
        var atoll = lon > 72.6 && lon < 73.9 && lat > 0.3 && lat < 7.2 && Math.abs(Math.sin(lat * 3.1)) > 0.3;
        var c = document.createElementNS(ns, "circle");
        c.setAttribute("cx", (((lon - 50) / 35) * 1000).toFixed(1));
        c.setAttribute("cy", (((30 - lat) / 30) * 860).toFixed(1));
        c.setAttribute("r", land || atoll ? "4.2" : "1.8");
        if (land || atoll) c.setAttribute("class", "land");
        frag.appendChild(c);
      }
    }
    g.appendChild(frag);
  }

  /* ---------- form ---------- */
  function form() {
    document.querySelectorAll(".chip").forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.classList.toggle("on");
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
    var t = document.getElementById("q-tonnes");
    var est = document.getElementById("estimate");
    function update() {
      var v = parseInt((t.value || "").replace(/[^0-9]/g, ""), 10);
      if (!v) { est.innerHTML = "Enter tonnes to see barge count"; return; }
      var barges = Math.max(1, Math.ceil(v / 5000));
      est.innerHTML = "About <b>" + barges + "</b> barge sailing" + (barges > 1 ? "s" : "") + " at 5,000 t each";
    }
    t.addEventListener("input", update);
    update();
    document.getElementById("q-form").addEventListener("submit", function (e) {
      e.preventDefault();
      document.getElementById("q-ok").hidden = false;
    });
    var sheet = document.getElementById("sheet");
    document.querySelectorAll(".spec-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        document.getElementById("sheet-t").textContent = b.getAttribute("data-sheet");
        sheet.hidden = false;
      });
    });
    sheet.addEventListener("click", function (e) {
      if (e.target === sheet || e.target.hasAttribute("data-close")) sheet.hidden = true;
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") sheet.hidden = true; });
  }

  /* ---------- motion ---------- */
  function motion() {
    if (!hasGsap) return;
    gsap.registerPlugin(ScrollTrigger);
    var route = document.querySelector(".r-main");
    var barge = document.querySelector(".barge");
    var len = route.getTotalLength();
    if (reduce) {
      var end = route.getPointAtLength(len);
      barge.setAttribute("cx", end.x); barge.setAttribute("cy", end.y);
      return;
    }

    gsap.from(".hero h1, .hero .eyebrow, .hero .lede, .hero-ctas", { y: 30, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", delay: 0.1 });
    gsap.from(".hero-tex", { scale: 1.08, duration: 2.4, ease: "expo.out" });

    document.querySelectorAll(".sec-head, .prod, .docs li, .steps li, .cargo-cell, .q-form, .q-big").forEach(function (el) {
      el.classList.add("rv");
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    route.style.strokeDasharray = len;
    route.style.strokeDashoffset = len;
    var tl = gsap.timeline({ scrollTrigger: { trigger: ".route", start: "top 65%", end: "center 45%", scrub: 0.8 } });
    tl.to(route, { strokeDashoffset: 0, ease: "none" }, 0);
    var prog = { p: 0 };
    tl.to(prog, {
      p: 1, ease: "none",
      onUpdate: function () {
        var pt = route.getPointAtLength(prog.p * len);
        barge.setAttribute("cx", pt.x); barge.setAttribute("cy", pt.y);
      },
    }, 0);

    document.querySelectorAll("[data-count]").forEach(function (el) {
      var to = parseInt(el.getAttribute("data-count"), 10);
      var o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 1.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString("en-US"); },
      });
    });

    var uses = document.querySelectorAll(".uses-list span");
    uses.forEach(function (u, i) {
      ScrollTrigger.create({
        trigger: ".uses", start: "top " + (80 - i * 7) + "%",
        onEnter: function () { u.classList.add("on"); }, onLeaveBack: function () { u.classList.remove("on"); },
      });
    });
  }

  function init() {
    drawMap();
    paintAll();
    form();
    motion();
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(paintAll, 200); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
