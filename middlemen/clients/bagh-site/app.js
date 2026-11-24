/* Bagh demo: procedural material studies, the sea route map, reveals and the quote form. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  document.documentElement.classList.add(hasGsap ? "js" : "no-js");

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
    var dpr = c.classList.contains("bg-tex") ? 1 : Math.min(window.devicePixelRatio || 1, 2);
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
    document.querySelectorAll(".bg-tex").forEach(function (c) {
      var f = painters[c.getAttribute("data-tex")];
      if (f) f(c);
    });
    document.querySelectorAll(".prow").forEach(function (p) {
      var c = p.querySelector(".p-tex");
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
        if (land || atoll) {
          var cc = "";
          if (atoll) cc = " c-mv";
          else if (inPoly([lon, lat], LAND[2])) cc = " c-lk";
          else if (inPoly([lon, lat], LAND[1]) && lon > 51.4 && lon < 56.3 && lat > 22.6) cc = " c-ae";
          else if (inPoly([lon, lat], LAND[1]) && lon >= 55.4 && lat > 16.5) cc = " c-om";
          else if (lon > 61.4 && lon < 71.2 && lat > 23.8) cc = " c-pk";
          c.setAttribute("class", "land" + cc);
        }
        frag.appendChild(c);
      }
    }
    g.appendChild(frag);
  }

  /* ---------- form: builds a WhatsApp message ---------- */
  var WA = "923082612601";
  function form() {
    var chips = document.querySelectorAll(".chip");
    chips.forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.classList.toggle("on");
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
    document.querySelectorAll("[data-pick]").forEach(function (a) {
      a.addEventListener("click", function () {
        chips.forEach(function (c) {
          if (c.textContent === a.getAttribute("data-pick")) { c.classList.add("on"); c.setAttribute("aria-pressed", "true"); }
        });
      });
    });
    var val = function (id) { return (document.getElementById(id).value || "").trim(); };
    document.getElementById("q-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var picked = [].filter.call(chips, function (c) { return c.classList.contains("on"); }).map(function (c) { return c.textContent; });
      var note = document.getElementById("q-note");
      if (!picked.length) { note.textContent = "Please choose at least one product."; note.style.color = "#E2D3B0"; return; }
      var lines = ["Hello Bagh Mining & Minerals, I would like a quotation.", "", "Products: " + picked.join(", ")];
      if (val("q-tonnes")) lines.push("Quantity: " + val("q-tonnes") + " tonnes");
      if (val("q-island")) lines.push("Delivery: " + val("q-island"));
      if (val("q-co")) lines.push("Company: " + val("q-co"));
      if (val("q-name")) lines.push("Name: " + val("q-name"));
      note.textContent = "WhatsApp opened in a new tab. Press send there. Or email contact@baghmineral.com.";
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- motion ---------- */
  function motion() {
    var nav = document.querySelector(".nav");
    var wa = document.querySelector(".wa");
    var hero = document.querySelector(".hero");
    var last = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var past = y > hero.offsetHeight - 90;
      nav.classList.toggle("solid", past);
      nav.classList.toggle("hide", past && y > last && y > hero.offsetHeight + 200);
      wa.classList.toggle("show", y > 500);
      last = y;
    }, { passive: true });

    var NS = "http://www.w3.org/2000/svg";
    var DEST = [
      { id: "mv", name: "Malé, Maldives", tag: "Primary route", km: "2,400", x: 672, y: 738, lx: 22, ly: 7, d: "M485 147 C 400 360, 520 600, 672 738" },
      { id: "lk", name: "Colombo, Sri Lanka", tag: "On request", km: "2,420", x: 853, y: 661, lx: -16, ly: -18, d: "M485 147 C 410 400, 640 660, 853 661" },
      { id: "ae", name: "Dubai, UAE", tag: "On request", km: "1,180", x: 151, y: 136, lx: 14, ly: -18, d: "M485 147 C 400 250, 250 250, 151 136" },
      { id: "om", name: "Muscat, Oman", tag: "On request", km: "880", x: 240, y: 183, lx: 16, ly: 32, d: "M485 147 C 420 215, 310 225, 240 183" },
    ];
    var gR = document.querySelector(".routes"), gD = document.querySelector(".dests");
    var barge = document.querySelector(".barge");
    var mapEl = document.querySelector(".hero-map");
    DEST.forEach(function (o) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", o.d); p.setAttribute("class", "rt rt-" + o.id);
      gR.appendChild(p); o.path = p; o.len = p.getTotalLength();
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "dest d-" + o.id); g.setAttribute("transform", "translate(" + o.x + " " + o.y + ")");
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", "Show route to " + o.name);
      g.innerHTML = '<circle class="hit" r="34"/><circle class="ring" r="7"/><circle class="core" r="7"/><text class="lbl" x="' + o.lx + '" y="' + o.ly + '"' + (o.lx < 0 ? ' text-anchor="end"' : "") + ">" + o.name.split(",")[0].toUpperCase() + "</text>";
      gD.appendChild(g); o.g = g;
    });
    var active = DEST[0], prog = { p: 0 }, tween = null;
    var place = function (p) { var pt = active.path.getPointAtLength(p * active.len); barge.setAttribute("cx", pt.x); barge.setAttribute("cy", pt.y); };
    var card = { tag: document.querySelector(".mc-tag"), name: document.querySelector(".mc-name"), km: document.querySelector(".mc-km") };
    var run = function () {
      if (tween) tween.kill();
      if (reduce || !hasGsap) { place(1); return; }
      tween = gsap.fromTo(prog, { p: 0 }, { p: 1, duration: 2.6 + active.len / 260, ease: "power1.inOut", repeat: -1, repeatDelay: 0.9, onUpdate: function () { place(prog.p); } });
    };
    var select = function (o, animate) {
      active = o;
      DEST.forEach(function (x) { x.g.classList.toggle("on", x === o); x.path.classList.toggle("on", x === o); });
      mapEl.setAttribute("data-on", o.id);
      card.tag.textContent = o.tag; card.name.textContent = o.name; card.km.textContent = o.km + " km from Karachi";
      if (animate && hasGsap && !reduce) gsap.fromTo(o.path, { strokeDashoffset: o.len }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" });
      run();
    };
    var back;
    DEST.forEach(function (o) {
      o.path.style.strokeDasharray = o.len;
      var go = function () { clearTimeout(back); if (active !== o) select(o, true); };
      o.g.addEventListener("pointerenter", go); o.g.addEventListener("click", go); o.g.addEventListener("focus", go);
      o.g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      o.g.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") back = setTimeout(function () { select(DEST[0], true); }, 2600); });
    });
    select(DEST[0], false);
    var route = DEST[0].path, len = DEST[0].len;
    if (!hasGsap || reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    var lenis = null;
    if (typeof window.Lenis !== "undefined") {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.addEventListener("click", function (e) {
        var a = e.target.closest("a[href^='#']");
        if (!a) return;
        var el = document.querySelector(a.getAttribute("href"));
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { duration: 1.5 });
      });
      lenis.stop();
    }

    // Intro: loader, then the route draws and the headline rises.
    route.style.strokeDashoffset = len; if (tween) tween.pause();
    gsap.set(".map-dots", { opacity: 0 });
    gsap.set(".pin, .lbl, .dest", { opacity: 0 });
    gsap.set(barge, { opacity: 0 });
    var loop = function () { run(); };
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".ld-mark rect", { y: 14, opacity: 0, duration: 0.7, stagger: 0.12 })
      .to(".ld-line i", { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0.2)
      .to(".loader", { yPercent: -100, duration: 1, ease: "expo.inOut" }, 1.35)
      .set(".loader", { display: "none" })
      .to(".map-dots", { opacity: 1, duration: 1.6 }, 1.6)
      .to(".hero .ln > span", { y: 0, duration: 1.3, stagger: 0.1 }, 1.75)
      .to(".hero .hf", { opacity: 1, duration: 1.2, stagger: 0.08 }, 2.1)
      .to(".pin, .lbl, .dest", { opacity: 1, duration: 0.8, stagger: 0.08 }, 2.2)
      .to(route, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" }, 2.3)
      .add(function () { if (lenis) lenis.start(); }, 2.4)
      .to(barge, { opacity: 1, duration: 0.4 }, 4.6)
      .add(loop, 4.6);

    if (window.innerWidth > 760) gsap.to(".hero-map", { yPercent: -12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-in", { yPercent: -8, opacity: 0.25, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

    document.querySelectorAll("section:not(.hero) h2").forEach(function (h) {
      gsap.to(h.querySelectorAll(".ln > span"), { y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 86%" } });
    });
    ScrollTrigger.batch(".rv", {
      start: "top 90%",
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", overwrite: true }); },
    });
    gsap.fromTo(".bar-a", { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".bar", start: "top 88%" } });
    document.querySelectorAll(".bg-tex:not(.hero-stones)").forEach(function (c) {
      gsap.fromTo(c, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: c.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.to(".steps-line i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 80%", end: "top 35%", scrub: true } });
    document.querySelectorAll(".yard img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.fromTo(".foot-big", { xPercent: 6 }, { xPercent: -4, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "bottom bottom", scrub: true } });

    document.querySelectorAll("[data-count]").forEach(function (el) {
      var to = parseInt(el.getAttribute("data-count"), 10), o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString("en-US"); } });
    });

    if (window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll(".magnet").forEach(function (m) {
        var x = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1,0.5)" }), y = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1,0.5)" });
        m.addEventListener("pointermove", function (e) { var r = m.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.25); });
        m.addEventListener("pointerleave", function () { x(0); y(0); });
      });
    }
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
