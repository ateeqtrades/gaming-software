/* Syed Ahmad Hassan. Portfolio interactions. No build step. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(pointer: fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };

  /* ---------- content ---------- */
  var WORK = [
    { t: "DXL", k: "Brand experience", y: "2026", role: "Head of Brand Experience", svc: "Brand experience, partnerships, launch content", tags: ["grow", "create"],
      d: "An institute in Karachi teaching crypto, forex, PSX, international equities, Web3 and AI as one connected pathway. I joined in August 2026 with the brand starting from scratch, and shape how it shows up for learners and for the institutions we work with: BankIslami, Dewan Group, Saylani Welfare, PVARA, Sindh Police and HEC. Below: the leadership business card and the nine-post launch grid.",
      img: ["dxl-card", "dxl-1", "dxl-2", "dxl-3", "dxl-4", "dxl-5", "dxl-6", "dxl-7", "dxl-8", "dxl-9"], cover: "dxl-grid" },
    { t: "Middlemen", k: "Brand identity and websites", y: "2026", role: "Co-Founder", svc: "Brand identity, website, client sites", tags: ["create", "build"], w: true,
      d: "A business-introductions service I co-founded. I directed the identity and the website, and the same for our first client, Bagh Mining & Minerals.",
      img: ["middlemen-0", "middlemen-1", "bagh-0"] },
    { t: "Gaming Zone Manager", k: "Software, built with AI", y: "2026", role: "Product and build", svc: "Web app: server, staff dashboard, PC agent", tags: ["build"], w: true,
      d: "Software for running a gaming zone: a live floor map of every PC and console, prepaid and pay-per-minute sessions, member balances, remote lock and unlock of each PC, and revenue reports. I built it with AI tools.",
      img: ["gamezone-0"] },
    { t: "Cosmic Computers", k: "Social and Meta ads", y: "2025", role: "Marketing Head", svc: "Content strategy, shoots, editing, design, Meta ads", tags: ["grow", "create"],
      d: "End-to-end social for a PC-hardware brand. I shot, edited and designed the content, and ran the Meta campaigns that turned it into leads and sales for a Pakistani audience.",
      img: ["cosmic-1", "cosmic-2", "cosmic-3"] },
    { t: "AI Content", k: "AI UGC and product video", y: "2021 to 2026", role: "Editor and producer", svc: "Nano Banana, Kling, Sora, Veo, Higgsfield", tags: ["create"],
      d: "UGC-style videos, product ads and visuals made with AI tools from concept to edit. Faster production and more creative variations than a traditional shoot allows.",
      img: ["ai-1", "ai-2", "ai-3"] },
    { t: "Moorish Construction", k: "Brand identity", y: "2025", role: "Creative direction", svc: "Brand design", tags: ["create"], w: true,
      d: "Led the brand design alone, end to end: positioning, visual language and messaging for a construction and real estate company that needed to look as reliable as it builds.",
      img: ["moorish-0", "moorish-1", "moorish-3"] }
  ];
  var REEL = [
    { v: "ai-1", a: "9/16", c: "AI Content", s: "UGC-style video, made with AI tools" },
    { i: "cosmic-1", a: "4/5", c: "Cosmic Computers", s: "Social content, 2025" },
    { v: "cosmic-reel", a: "9/16", c: "Cosmic Computers", s: "Reel, shot and edited" },
    { i: "dxl-grid", a: "4/5", c: "DXL", s: "Instagram launch grid, 2026" },
    { i: "middlemen-0", a: "16/10", c: "Middlemen", s: "Brand and website, 2026" },
    { i: "gamezone-0", a: "16/10", c: "Gaming Zone Manager", s: "Web app, built with AI, 2026" },
    { v: "ai-2", a: "9/16", c: "AI Content", s: "Product ad, made with AI tools" },
    { i: "cosmic-2", a: "5/4", c: "Cosmic Computers", s: "Campaign creative" },
    { i: "moorish-0", a: "16/10", c: "Moorish Construction", s: "Brand identity, 2025" },
    { i: "ai-2", a: "4/5", c: "AI Content", s: "AI product visuals" },
    { i: "bagh-0", a: "16/10", c: "Bagh Mining & Minerals", s: "Website, via Middlemen, 2026" }
  ];
  var ROLES = [
    { y: "2026 to now", t: "Head of Brand Experience", o: "DXL", live: true, b: [
      "Lead the brand for an institute in Karachi teaching crypto, forex, PSX, Web3 and AI as one connected pathway. Joined August 2026, with the brand starting from scratch.",
      "Made the launch campaign, the logo sting and the leadership business cards, and wrote the launch plan.",
      "Work with BankIslami, Dewan Group, Saylani Welfare, PVARA, Sindh Police and HEC on partnerships and joint programmes.",
      "Own how the brand shows up across content, events and partnerships." ] },
    { y: "2026 to now", t: "Co-Founder", o: "Middlemen", live: true, b: [
      "Co-founded a business-introductions company connecting Pakistani exporters with overseas buyers.",
      "Built the brand, the websites and the outbound sales pipeline from zero." ] },
    { y: "2025", t: "Marketing Head", o: "Cosmic Computers", b: [
      "Ran social media, Meta ads and content strategy for a PC-hardware brand.",
      "Shot, edited and designed the creative, then tested it in paid campaigns." ] },
    { y: "2024 to 2025", t: "Business Development Executive", o: "DSG Energy", b: [
      "Managed content, teams and budgets at large scale.",
      "Business development: prospecting, client conversations and partnerships." ] },
    { y: "2022 to 2025", t: "Community Lead", o: "Crypto Beast", b: [
      "Led a crypto-trading community on Telegram and Discord: moderation, daily engagement and AMAs." ] },
    { y: "2022 to 2024", t: "Digital Marketing Specialist", o: "IndusTech.pk & TOS.pk", b: [
      "Digital marketing, social content and campaigns." ] },
    { y: "2021", t: "Freelance Designer", o: "Where it started", b: [
      "Brand and social design for early clients." ] }
  ];
  var STAGES = [
    { n: "Awareness", h: "Get seen by the right people", b: [
      "Paid on Meta, TikTok and Google, with AI-made creative so every audience gets tested against many variations",
      "Creators and KOLs chosen for trust with their audience, not follower count",
      "Global campaigns localised into Urdu and English that sound like Pakistan" ] },
    { n: "Activation", h: "Turn interest into a first action", b: [
      "University tours and on-ground events with a QR-to-signup loop, so offline turns into measurable online users",
      "Short education content that removes the fear before the first step",
      "Landing pages and onboarding tested one variable at a time" ] },
    { n: "Retention", h: "Give them a reason to stay", b: [
      "Community channels run daily: answers, AMAs, moderation",
      "Lifecycle messages tied to what the user actually did",
      "Local partnerships that make the product useful in daily life" ] },
    { n: "Advocacy", h: "Make users the channel", b: [
      "Referral programmes with clear, honest rewards",
      "Ambassadors from campuses and communities",
      "User-made content fed back into paid creative" ] }
  ];
  var MODES = {
    create: { c: [255, 91, 46], l: "I make it.", s: "Identities, content, reels and AI-made video." },
    grow: { c: [185, 242, 58], l: "I grow it.", s: "Paid social, content strategy and community." },
    build: { c: [134, 114, 255], l: "I build it.", s: "Apps, games and websites, made with AI." }
  };

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.11 });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  var go = function (sel) {
    var el = $(sel); if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.2 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault(); go(a.getAttribute("href"));
  });

  /* ---------- loader ---------- */
  (function () {
    var el = $("#loader"), n = $("#load-n"), t0 = performance.now(), D = 1100;
    if (reduce) { el.remove(); return; }
    (function tick(t) {
      var p = clamp((t - t0) / D, 0, 1);
      n.textContent = ("00" + Math.round(p * 100)).slice(-3);
      if (p < 1) requestAnimationFrame(tick);
      else { el.classList.add("done"); setTimeout(function () { el.remove(); }, 1000); }
    })(t0);
  })();

  /* ---------- pointer ---------- */
  var P = { x: innerWidth / 2, y: innerHeight / 2, live: false, t: 0 };
  addEventListener("pointermove", function (e) { if (e.pointerType === "touch") return; P.x = e.clientX; P.y = e.clientY; P.live = true; P.t = performance.now(); }, { passive: true });
  if (fine) (function () {
    var cur = $("#cur"), lab = $("span", cur), x = P.x, y = P.y;
    (function f() { x += (P.x - x) * 0.22; y += (P.y - y) * 0.22; cur.style.transform = "translate(" + x + "px," + y + "px)"; requestAnimationFrame(f); })();
    document.addEventListener("pointerover", function (e) {
      var c = e.target.closest("[data-cur]"), h = e.target.closest("a,button,input,.panel");
      cur.classList.toggle("lab", !!c); cur.classList.toggle("hov", !c && !!h);
      if (c) lab.textContent = c.getAttribute("data-cur");
    });
  })();

  /* ---------- modes ---------- */
  var mode = "create", line = $("#mode-line"), sub = $("#mode-sub");
  function setMode(m) {
    if (m === mode || !MODES[m]) return;
    mode = m; document.documentElement.setAttribute("data-mode", m);
    $$(".modes button").forEach(function (b) { b.classList.toggle("on", b.dataset.mode === m); });
    $$(".panel").forEach(function (p) { p.classList.toggle("on", p.dataset.mode === m); });
    line.textContent = MODES[m].l; sub.textContent = MODES[m].s;
  }
  $$(".modes button").forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
  $$(".panel").forEach(function (p) {
    p.classList.toggle("on", p.dataset.mode === mode);
    var pick = function () { setMode(p.dataset.mode); };
    p.addEventListener("click", pick); p.addEventListener("focus", pick);
    if (fine) p.addEventListener("pointerenter", pick);
    p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
  });

  /* ---------- hero field: a dot grid that bends away from the pointer ---------- */
  (function () {
    var cv = $("#field"), hero = $("#hero"), g = cv.getContext("2d"), W, H, dpr, on = true, col = MODES.create.c.slice();
    var size = function () { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
    size(); addEventListener("resize", size);
    new IntersectionObserver(function (e) { on = e[0].isIntersecting; }).observe(hero);
    var px = W * 0.7, py = H * 0.4;
    function draw(t) {
      requestAnimationFrame(draw);
      if (!on) return;
      var r = cv.getBoundingClientRect(), tx, ty;
      if (P.live && t - P.t < 4000) { tx = P.x - r.left; ty = P.y - r.top; }
      else { tx = W * (0.5 + 0.34 * Math.cos(t / 2300)); ty = H * (0.48 + 0.3 * Math.sin(t / 1700)); }
      px += (tx - px) * 0.08; py += (ty - py) * 0.08;
      var c = MODES[mode].c; for (var k = 0; k < 3; k++) col[k] += (c[k] - col[k]) * 0.08;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      var gap = W < 700 ? 24 : 30, R = Math.max(180, Math.min(W, H) * 0.38);
      for (var y = gap / 2; y < H; y += gap) for (var x = gap / 2; x < W; x += gap) {
        var dx = x - px, dy = y - py, d = Math.sqrt(dx * dx + dy * dy), f = Math.max(0, 1 - d / R), e = f * f;
        var ox = d ? dx / d * e * 26 : 0, oy = d ? dy / d * e * 26 : 0;
        var wob = reduce ? 0 : Math.sin(x * 0.02 + y * 0.016 + t / 1400) * 0.5 + 0.5;
        var a = 0.1 + wob * 0.07 + e * 0.9, s = 1 + e * 2.4;
        g.fillStyle = "rgba(" + Math.round(237 + (col[0] - 237) * f) + "," + Math.round(234 + (col[1] - 234) * f) + "," + Math.round(228 + (col[2] - 228) * f) + "," + a + ")";
        g.fillRect(x + ox - s / 2, y + oy - s / 2, s, s);
      }
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- variable type: letters swell toward the pointer ---------- */
  $$(".vf").forEach(function (el) {
    var chars = [];
    $$(".vl", el).forEach(function (ln) {
      var txt = ln.textContent; ln.textContent = "";
      txt.split("").forEach(function (ch) {
        var s = document.createElement("span");
        if (ch === " ") s.className = "sp"; else { s.className = "ch"; s.textContent = ch; chars.push({ el: s, k: 0 }); }
        s.setAttribute("aria-hidden", "true"); ln.appendChild(s);
      });
    });
    if (reduce) return;
    var on = false; new IntersectionObserver(function (e) { on = e[0].isIntersecting; }).observe(el);
    (function f(t) {
      requestAnimationFrame(f);
      if (!on) return;
      var box = el.getBoundingClientRect(), x, y, R = Math.max(170, innerWidth * 0.2);
      if (P.live && t - P.t < 4000) { x = P.x; y = P.y; }
      else { x = box.left + box.width * (0.5 + 0.5 * Math.sin(t / 1500)); y = box.top + box.height * (0.5 + 0.3 * Math.cos(t / 1100)); }
      var rects = chars.map(function (c) { return c.el.getBoundingClientRect(); });
      chars.forEach(function (c, i) {
        var r = rects[i], dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
        var k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R); k = k * k * (3 - 2 * k);
        c.k += (k - c.k) * 0.16;
        c.el.style.setProperty("--w", Math.round(430 + c.k * 370));
        c.el.style.setProperty("--d", (75 + c.k * 22).toFixed(1));
        c.el.style.setProperty("--k", (c.k * c.k).toFixed(3));
      });
    })(0);
  });

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
  var watch = function (r) { $$(".rv", r).forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); }); };

  /* ---------- tilt ---------- */
  function tilt(el, deg) {
    if (!fine || reduce) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", ((x - 0.5) * deg).toFixed(2) + "deg"); el.style.setProperty("--rx", ((0.5 - y) * deg).toFixed(2) + "deg");
      el.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
  }
  $$(".panel").forEach(function (p) { tilt(p, 0); });

  /* ---------- reel ---------- */
  (function () {
    var reel = $("#reel"), sec = $("#proof");
    reel.innerHTML = REEL.map(function (r) {
      var media = r.v
        ? '<video muted loop playsinline preload="none" poster="media/' + r.v + '.jpg" src="media/' + r.v + '.mp4"></video>'
        : '<img loading="lazy" src="img/' + r.i + '.jpg" alt="' + esc(r.c + ": " + r.s) + '">';
      return '<figure class="shot" style="aspect-ratio:' + r.a + '"' + (r.v ? ' data-cur="Playing"' : "") + ">" + media +
        (r.k ? '<span class="tag">Personal concept</span>' : "") +
        "<figcaption><b>" + esc(r.c) + '</b><span class="m">' + esc(r.s) + "</span></figcaption></figure>";
    }).join("");
    $$(".shot", reel).forEach(function (s) { tilt(s, 7); });
    var vio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); } else e.target.pause(); }); }, { threshold: 0.4 });
    $$("video", reel).forEach(function (v) { vio.observe(v); });

    var mq = matchMedia("(pointer: fine) and (min-width: 900px)"), over = 0;
    function measure() {
      if (!mq.matches) { sec.style.height = ""; reel.style.transform = ""; over = 0; return; }
      over = Math.max(0, reel.scrollWidth - innerWidth);
      sec.style.height = innerHeight + over + "px"; place();
    }
    function place() {
      if (!over) return;
      var p = clamp((scrollY - sec.offsetTop) / over, 0, 1);
      reel.style.transform = "translate3d(" + (-p * over).toFixed(1) + "px,0,0)";
    }
    measure(); addEventListener("resize", measure); addEventListener("load", measure);
    addEventListener("scroll", place, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  })();

  /* ---------- work ---------- */
  (function () {
    var box = $("#cards"), sheet = $("#sheet"), inner = $("#sheet-in"), last = null;
    box.innerHTML = WORK.map(function (w, i) {
      return '<button type="button" class="card rv' + (w.w ? " w" : "") + '" data-i="' + i + '" data-tags="' + w.tags.join(" ") + '" data-cur="Open">' +
        '<img loading="lazy" src="img/' + (w.cover || w.img[0]) + '.jpg" alt="">' +
        '<span class="card-y m"><span>' + esc(w.y) + "</span><span>" + (w.concept ? "Personal concept" : esc(w.role)) + "</span></span>" +
        '<span class="card-t"><b>' + esc(w.t) + '</b><span class="m">' + esc(w.k) + "</span></span></button>";
    }).join("");
    $$(".card", box).forEach(function (c) { tilt(c, 6); c.addEventListener("click", function () { open(+c.dataset.i, c); }); });
    $$("#filters button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
        var f = b.dataset.f;
        $$(".card", box).forEach(function (c) { c.classList.toggle("off", f !== "all" && c.dataset.tags.split(" ").indexOf(f) < 0); });
        if (f !== "all") setMode(f);
      });
    });
    function open(i, from) {
      var w = WORK[i]; last = from;
      inner.innerHTML = "<div>" + (w.concept ? '<span class="m concept">Personal concept · not client work</span>' : "") + "<h2>" + esc(w.t) + "</h2></div>" +
        '<div class="sheet-meta"><p>' + esc(w.d) + "</p><dl>" +
        '<div><dt class="m">Year</dt><dd>' + esc(w.y) + "</dd></div>" +
        '<div><dt class="m">Role</dt><dd>' + esc(w.role) + "</dd></div>" +
        '<div><dt class="m">Scope</dt><dd>' + esc(w.svc) + "</dd></div></dl></div>" +
        '<div class="sheet-imgs">' + w.img.map(function (m) { return '<img src="img/' + m + '.jpg" alt="' + esc(w.t) + '">'; }).join("") + "</div>";
      sheet.hidden = false; inner.scrollTop = 0; if (lenis) lenis.stop(); document.body.style.overflow = "hidden"; $("#sheet-x").focus();
    }
    var TILES = ["Something is being built in Karachi", "The world is moving fast. So is Pakistan", "3rd", "Adoption is not the problem. Structure is", "The mark", "Trading is a skill", "Web3 is a lens", "Every market. One pathway", "Every seat here is earned"];
    var tiles = $("#tiles");
    // Instagram shows the newest post first, so the grid reads 9 to 1.
    tiles.innerHTML = TILES.map(function (t, i) { return { t: t, n: i + 1 }; }).reverse().map(function (x) {
      return '<button type="button" class="tile" data-cur="Open" aria-label="Post ' + x.n + ": " + esc(x.t) + '"><img loading="lazy" src="img/dxl-' + x.n + '.jpg" alt=""><span class="m">0' + x.n + " · " + esc(x.t) + "</span></button>";
    }).join("");
    $$(".tile", tiles).forEach(function (t) { tilt(t, 10); t.addEventListener("click", function () { open(0, t); }); });
    $("#dxl-open").addEventListener("click", function (e) { open(0, e.currentTarget); });
    function close() { if (sheet.hidden) return; sheet.hidden = true; if (lenis) lenis.start(); document.body.style.overflow = ""; if (last) last.focus(); }
    $("#sheet-x").addEventListener("click", close);
    addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  })();

  /* ---------- dxl showcase ---------- */
  (function () {
    var coin = $("#coin"), sec = $("#dxl");
    if (fine && !reduce) sec.addEventListener("pointermove", function (e) {
      var r = coin.getBoundingClientRect(), x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      coin.style.setProperty("--ry", clamp(x * 46, -24, 24).toFixed(1) + "deg"); coin.style.setProperty("--rx", clamp(-y * 40, -20, 20).toFixed(1) + "deg");
    });
    var br = $("#browser"), img = $("img", br), view = $(".view", br);
    if (fine) br.addEventListener("pointermove", function (e) {
      var r = view.getBoundingClientRect(), p = clamp((e.clientY - r.top) / r.height, 0, 1);
      img.style.setProperty("--y", (-p * Math.max(0, img.offsetHeight - r.height)).toFixed(0) + "px");
    });
    tilt($("#bcard"), 12);
    var note = $("#sw-note"), base = note.textContent;
    $$("#sw button").forEach(function (b) {
      b.addEventListener("click", function () {
        var hex = b.dataset.hex, ok = function () { note.textContent = "Copied " + hex; setTimeout(function () { note.textContent = base; }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(hex).then(ok, ok); else ok();
      });
    });
    var lines = ["Web3 is a lens.", "Every seat here is earned.", "Every market. One pathway.", "Adoption is not the problem. Structure is.", "Trading is a skill."], vi = 0, v = $("#voice");
    if (!reduce) setInterval(function () {
      v.classList.add("out");
      setTimeout(function () { vi = (vi + 1) % lines.length; v.textContent = lines[vi]; v.classList.remove("out"); }, 420);
    }, 2800);
  })();

  /* ---------- experience ---------- */
  (function () {
    var box = $("#roles");
    box.innerHTML = ROLES.map(function (r, i) {
      return '<div class="role' + (i === 0 ? " open" : "") + '"><button type="button" class="role-h" aria-expanded="' + (i === 0) + '">' +
        '<span class="m' + (r.live ? " live" : "") + '">' + esc(r.y) + "</span><b>" + esc(r.t) + '</b><span class="org">' + esc(r.o) + '</span><span class="pm">+</span></button>' +
        '<div class="role-b"><div><ul>' + r.b.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div></div>";
    }).join("");
    $$(".role", box).forEach(function (r) {
      $(".role-h", r).addEventListener("click", function () {
        var was = r.classList.contains("open");
        $$(".role", box).forEach(function (x) { x.classList.remove("open"); $(".role-h", x).setAttribute("aria-expanded", "false"); });
        if (!was) { r.classList.add("open"); $(".role-h", r).setAttribute("aria-expanded", "true"); }
      });
    });
  })();

  /* ---------- growth lab ---------- */
  (function () {
    var tabs = $("#stages"), body = $("#stage-body");
    tabs.innerHTML = STAGES.map(function (s, i) { return '<button type="button" role="tab" data-i="' + i + '"><span class="m">0' + (i + 1) + "</span><b>" + s.n + "</b></button>"; }).join("");
    function show(i) {
      var s = STAGES[i];
      $$("button", tabs).forEach(function (b, j) { b.classList.toggle("on", j === i); b.setAttribute("aria-selected", j === i); });
      body.innerHTML = "<h3>" + esc(s.h) + "</h3><ul>" + s.b.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    $$("button", tabs).forEach(function (b) { b.addEventListener("click", function () { show(+b.dataset.i); }); });
    show(0);

    var S = [
      { id: "budget", l: "Monthly ad budget", min: 100000, max: 10000000, step: 100000, v: 1000000, f: function (v) { return "PKR " + v.toLocaleString("en-US"); } },
      { id: "cpc", l: "Cost per click", min: 5, max: 100, step: 1, v: 20, f: function (v) { return "PKR " + v; } },
      { id: "su", l: "Clicks that sign up", min: 1, max: 30, step: 1, v: 8, f: function (v) { return v + "%"; } },
      { id: "ac", l: "Sign-ups that take a first action", min: 5, max: 80, step: 1, v: 35, f: function (v) { return v + "%"; } },
      { id: "re", l: "Still active after 30 days", min: 5, max: 80, step: 1, v: 30, f: function (v) { return v + "%"; } }
    ];
    var sl = $("#sliders"), out = $("#sim-out");
    sl.innerHTML = S.map(function (s) { return '<div class="sl"><label for="s-' + s.id + '"><span>' + s.l + '</span><output id="o-' + s.id + '"></output></label><input type="range" id="s-' + s.id + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + s.v + '"></div>'; }).join("");
    out.innerHTML = ["Clicks", "Sign-ups", "Active users", "Retained at 30 days"].map(function (n) { return '<div class="bar-row"><i></i><span>' + n + "</span><b>0</b></div>"; }).join("") +
      '<div class="kpi"><div><span class="m">Cost per active user</span><b id="k1"></b></div><div><span class="m">Cost per retained user</span><b id="k2"></b></div></div>';
    var rows = $$(".bar-row", out), n = function (v) { return Math.round(v).toLocaleString("en-US"); };
    function calc() {
      var v = {}; S.forEach(function (s) { var el = $("#s-" + s.id); v[s.id] = +el.value; $("#o-" + s.id).textContent = s.f(v[s.id]); el.style.setProperty("--p", ((v[s.id] - s.min) / (s.max - s.min) * 100) + "%"); });
      var c = v.budget / v.cpc, a = [c, c * v.su / 100, c * v.su / 100 * v.ac / 100, c * v.su / 100 * v.ac / 100 * v.re / 100];
      rows.forEach(function (r, i) { $("b", r).textContent = n(a[i]); $("i", r).style.setProperty("--w", Math.max(3, Math.pow(a[i] / a[0], 0.36) * 100) + "%"); });
      $("#k1").textContent = "PKR " + n(v.budget / a[2]); $("#k2").textContent = "PKR " + n(v.budget / a[3]);
    }
    sl.addEventListener("input", calc); calc();
  })();

  /* ---------- the case: one row lit at a time ---------- */
  (function () {
    var ol = $("#args"), items = $$("li", ol);
    var light = function (li) { ol.classList.toggle("dim", !!li); items.forEach(function (x) { x.classList.toggle("lit", x === li); }); };
    if (fine) { items.forEach(function (li) { li.addEventListener("pointerenter", function () { light(li); }); }); ol.addEventListener("pointerleave", function () { light(null); }); }
    else addEventListener("scroll", function () {
      var mid = innerHeight * 0.5, best = null, bd = 1e9, r = ol.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return light(null);
      items.forEach(function (li) { var b = li.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = li; } });
      light(best);
    }, { passive: true });
  })();

  /* ---------- contact ---------- */
  var copyMail = function () {
    var b = $("#mail"), done = function () { b.classList.add("ok"); setTimeout(function () { b.classList.remove("ok"); }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText("s.syedahmadhassan@gmail.com").then(done, function () { location.href = "mailto:s.syedahmadhassan@gmail.com"; });
    else location.href = "mailto:s.syedahmadhassan@gmail.com";
  };
  $("#mail").addEventListener("click", copyMail);

  /* ---------- progress ---------- */
  var prog = $("#prog");
  addEventListener("scroll", function () { prog.style.transform = "scaleX(" + clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight), 0, 1) + ")"; }, { passive: true });

  /* ---------- menu ---------- */
  (function () {
    var pal = $("#pal"), q = $("#pal-q"), list = $("#pal-list"), sel = 0, shown = [];
    var ITEMS = [
      { n: "What I do", k: "Go", f: function () { go("#what"); } }, { n: "DXL, right now", k: "Go", f: function () { go("#dxl"); } }, { n: "Evidence", k: "Go", f: function () { go("#proof"); } },
      { n: "Selected work", k: "Go", f: function () { go("#work"); } }, { n: "Experience", k: "Go", f: function () { go("#xp"); } },
      { n: "How I'd grow a brand", k: "Go", f: function () { go("#lab"); } }, { n: "Why hire me", k: "Go", f: function () { go("#why"); } },
      { n: "Contact", k: "Go", f: function () { go("#contact"); } },
      { n: "Copy email address", k: "Do", f: function () { go("#contact"); copyMail(); } },
      { n: "Download résumé", k: "Do", f: function () { window.open("Syed_Ahmad_Hassan_Resume.pdf", "_blank"); } },
      { n: "Message on WhatsApp", k: "Do", f: function () { window.open("https://wa.me/923082612601", "_blank"); } },
      { n: "Mode: Create", k: "Look", f: function () { setMode("create"); } }, { n: "Mode: Grow", k: "Look", f: function () { setMode("grow"); } }, { n: "Mode: Build", k: "Look", f: function () { setMode("build"); } }
    ];
    function render() {
      var s = q.value.trim().toLowerCase();
      shown = ITEMS.filter(function (i) { return i.n.toLowerCase().indexOf(s) >= 0; }); sel = clamp(sel, 0, Math.max(0, shown.length - 1));
      list.innerHTML = shown.map(function (i, j) { return '<li data-j="' + j + '"' + (j === sel ? ' class="sel"' : "") + "><span>" + i.n + '</span><span class="m">' + i.k + "</span></li>"; }).join("");
      var el = $(".sel", list); if (el) el.scrollIntoView({ block: "nearest" });
    }
    function open() { pal.hidden = false; q.value = ""; sel = 0; render(); if (lenis) lenis.stop(); if (fine) q.focus(); }
    function close() { if (pal.hidden) return; pal.hidden = true; if (lenis && $("#sheet").hidden) lenis.start(); }
    function run(j) { var it = shown[j]; close(); if (it) it.f(); }
    $("#menu-btn").addEventListener("click", open);
    pal.addEventListener("click", function (e) { var li = e.target.closest("li"); if (li) run(+li.dataset.j); else if (e.target === pal) close(); });
    list.addEventListener("pointermove", function (e) { var li = e.target.closest("li"); if (li && +li.dataset.j !== sel) { sel = +li.dataset.j; render(); } });
    q.addEventListener("input", function () { sel = 0; render(); });
    addEventListener("keydown", function (e) {
      var typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey || !typing) && pal.hidden) { e.preventDefault(); open(); return; }
      if (pal.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
      else if (e.key === "Enter") { e.preventDefault(); run(sel); }
    });
  })();

  watch(document);
})();
