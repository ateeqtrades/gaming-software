/* Portfolio: depth-chart hero, scramble type, crosshair cursor, scroll reveals, work list, chat illustration. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap) document.documentElement.classList.add("js");

  /* ---------- content ---------- */
  var WORK = [
    { t: "DXL", k: "Brand experience", y: "2026", role: "Head of Brand Experience", svc: "Brand experience, partnerships, launch content",
      d: "A digital-asset education academy in Karachi, building toward a PVARA-aligned exchange. I joined in 2026 to shape how the brand shows up, for learners and for institutions such as PVARA, Sindh Police, Saylani Welfare, BankIslami, Dewan University and HEC.",
      img: ["dxl-grid"], one: true },
    { t: "Middlemen", k: "Brand identity and websites", y: "2026", role: "Co-Founder", svc: "Brand identity, website, client sites",
      d: "A business-introductions service I co-founded. I directed the identity and the website, and the same for our first client, Bagh Mining & Minerals.",
      img: ["middlemen-0", "bagh-0"], wide: true },
    { t: "Gaming Zone Manager", k: "Software, built with AI", y: "2026", role: "Product and build", svc: "Web app: server, staff dashboard, PC agent",
      d: "Software for running a gaming zone: a live floor map of every PC and console, prepaid and pay-per-minute sessions, member balances, remote lock and unlock of each PC, and revenue reports. I built it with AI tools.",
      img: ["gamezone-0"], wide: true, one: true },
    { t: "Cosmic Computers", k: "Social and Meta ads", y: "2025", role: "Marketing Head", svc: "Content strategy, shoots, editing, design, Meta ads",
      d: "End-to-end social for a PC-hardware brand. I shot, edited and designed the content, and ran the Meta campaigns that turned it into leads and sales for a Pakistani audience.",
      img: ["cosmic-1", "cosmic-2", "cosmic-3"] },
    { t: "AI Content Production", k: "AI UGC and product video", y: "2021 to 2026", role: "Editor and producer", svc: "AI creatives with Nano Banana, Kling, Sora, Veo, Higgsfield",
      d: "UGC-style videos, product ads and visuals made with AI tools from concept to edit. Faster production and more creative variations than a traditional shoot allows.",
      img: ["ai-1", "ai-2", "ai-3"] },
    { t: "Moorish Construction", k: "Brand identity", y: "2025", role: "Creative direction", svc: "Brand design",
      d: "Led the brand design alone, end to end: positioning, visual language and messaging for a construction and real estate company that needed to look as reliable as it builds.",
      img: ["moorish-0", "moorish-1", "moorish-3"], wide: true },
    { t: "H23", k: "Web3 agency identity", y: "2023", role: "Creative direction", svc: "Brand design", concept: true,
      d: "A self-initiated identity for a fictional Web3 agency. Not client work. I made it to practise building a brand for blockchain, crypto and NFTs: monochrome, clean lines, high-tech without the clichés.",
      img: ["h23-0", "h23-1", "h23-2"], wide: true },
    { t: "Glod Water", k: "Luxury packaging and identity", y: "2022", role: "Creative director", svc: "Brand design, product rendering", concept: true,
      d: "A self-initiated luxury water brand. Not client work. Logo, packaging and renders for a product that sells indulgence as much as hydration.",
      img: ["glod-3", "glod-1", "glod-0"] },
  ];

  /* The evidence reel: v = video, a = aspect ratio */
  var REEL = [
    { v: "ai-1", a: "9/16", c: "AI Content Production", s: "UGC-style video, made with AI tools" },
    { i: "cosmic-1", a: "4/5", c: "Cosmic Computers", s: "Social content, 2025" },
    { v: "cosmic-reel", a: "9/16", c: "Cosmic Computers", s: "Reel, shot and edited" },
    { i: "dxl-grid", a: "4/5", c: "DXL", s: "Instagram launch grid, 2026" },
    { i: "middlemen-0", a: "16/10", c: "Middlemen", s: "Brand and website, 2026" },
    { i: "gamezone-0", a: "16/10", c: "Gaming Zone Manager", s: "Web app, built with AI, 2026" },
    { v: "ai-2", a: "9/16", c: "AI Content Production", s: "Product ad, made with AI tools" },
    { i: "cosmic-2", a: "5/4", c: "Cosmic Computers", s: "Campaign creative" },
    { i: "moorish-0", a: "16/10", c: "Moorish Construction", s: "Brand identity, 2025" },
    { i: "ai-2", a: "4/5", c: "AI Content Production", s: "AI product visuals" },
    { i: "bagh-0", a: "16/10", c: "Bagh Mining & Minerals", s: "Website, via Middlemen, 2026" },
    { i: "h23-0", a: "1/1", c: "H23", s: "Concept identity, 2023", k: true },
    { i: "glod-3", a: "2/3", c: "Glod Water", s: "Concept packaging, 2022", k: true },
  ];

  var CHAT = [
    { c: "pin", n: "Pinned · Ahmad", x: "AMA tonight, 8 pm PKT. Drop your questions here first." },
    { n: "Member", x: "Is it too late to enter this move?" },
    { c: "me", n: "Ahmad · Admin", x: "Nobody here can promise you that. Check your risk first, then decide." },
    { n: "Member", x: "New here. Where do I start?" },
    { c: "me", n: "Ahmad · Admin", x: "Welcome. Read the pinned guide, then ask anything. No question is too basic." },
    { n: "Member", x: "DM me for guaranteed signals" },
    { c: "pin", n: "Moderation", x: "Removed: signal spam. Second warning is a ban." },
    { n: "Member", x: "Good AMA last week, more of those please" },
  ];

  /* ---------- work list ---------- */
  var list = document.getElementById("list");
  WORK.forEach(function (w, i) {
    var el = document.createElement("article");
    el.className = "item rv";
    var gal = w.img
      ? '<div class="gal' + (w.wide ? " wide" : "") + (w.one ? " one" : "") + '">' + w.img.slice(0, w.one ? 1 : w.wide ? 2 : 3).map(function (n) { return '<img src="img/' + n + '.jpg" alt="' + w.t + ' work sample" loading="lazy">'; }).join("") + "</div>"
      : '<div class="typo"><b>' + w.typo[0] + "</b><span>" + w.typo[1] + "</span></div>";
    el.innerHTML =
      '<button class="item-h" type="button" aria-expanded="false"' + (w.img ? ' data-peek="img/' + w.img[0] + '.jpg"' : "") + ">" +
      '<span class="m n">0' + (i + 1) + "</span><h3>" + w.t + (w.concept ? '<span class="concept">CONCEPT</span>' : "") + "</h3>" +
      '<span class="m k">' + w.k + '</span><span class="m y">' + w.y + '</span><span class="pm" aria-hidden="true">+</span></button>' +
      '<div class="item-b"><div><div class="detail"><div><p>' + w.d + '</p><div class="meta"><div><span class="m">Role</span><span>' + w.role +
      '</span></div><div><span class="m">Scope</span><span>' + w.svc + '</span></div><div><span class="m">Type</span><span>' +
      (w.concept ? "Personal concept project" : "Real engagement") + "</span></div></div></div>" + gal + "</div></div></div>";
    list.appendChild(el);
    var btn = el.querySelector(".item-h");
    btn.addEventListener("click", function () {
      var open = el.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (hasGsap) setTimeout(function () { ScrollTrigger.refresh(); }, 750);
    });
  });

  /* ---------- evidence reel ---------- */
  (function () {
    var reel = document.getElementById("reel");
    REEL.forEach(function (r) {
      var f = document.createElement("figure");
      f.className = "clip";
      f.style.setProperty("--a", r.a);
      var media = r.v
        ? '<video muted loop playsinline preload="none" poster="media/' + r.v + '.jpg"><source src="media/' + r.v + '.mp4" type="video/mp4"></video><span class="m play">Video</span>'
        : '<img src="img/' + r.i + '.jpg" alt="' + r.c + ": " + r.s + '" loading="lazy" draggable="false">';
      f.innerHTML = '<div class="clip-m">' + media + "</div><figcaption><b>" + r.c + (r.k ? '<span class="concept">CONCEPT</span>' : "") + '</b><span class="m">' + r.s + "</span></figcaption>";
      reel.appendChild(f);
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting && !reduce) e.target.play().catch(function () {}); else e.target.pause(); });
    }, { threshold: 0.5 });
    reel.querySelectorAll("video").forEach(function (v) { io.observe(v); });
    // drag to scroll with a mouse
    var down = false, sx = 0, sl = 0, moved = false;
    reel.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = reel.scrollLeft; reel.classList.add("grab"); });
    window.addEventListener("pointermove", function (e) { if (!down) return; if (Math.abs(e.clientX - sx) > 4) moved = true; reel.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener("pointerup", function () { down = false; reel.classList.remove("grab"); });
  })();

  /* ---------- clock + block height ---------- */
  var clock = document.getElementById("clock"), block = document.getElementById("block");
  var fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  var tick = function () { clock.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 1000);
  var dockLinks = [].slice.call(document.querySelectorAll(".dock a"));
  var secs = dockLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var onScroll = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    block.textContent = String(Math.round((window.scrollY / Math.max(1, max)) * 999999)).padStart(6, "0");
    var mid = window.scrollY + window.innerHeight * 0.5, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    dockLinks.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
    document.querySelector(".dock").classList.toggle("show", window.scrollY > window.innerHeight * 0.5);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- copy email ---------- */
  var mail = document.getElementById("mail"), ok = document.getElementById("mail-ok");
  mail.addEventListener("click", function () {
    var done = function () { ok.classList.add("on"); setTimeout(function () { ok.classList.remove("on"); }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText("s.syedahmadhassan@gmail.com").then(done, function () { window.location.href = "mailto:s.syedahmadhassan@gmail.com"; });
    else window.location.href = "mailto:s.syedahmadhassan@gmail.com";
  });

  /* ---------- hero depth chart (canvas) ---------- */
  (function () {
    var c = document.querySelector(".depth"), ctx = c.getContext("2d"), w = 0, h = 0, mx = 0.5, t = 0, raf;
    var size = function () { var d = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    var steps = 46;
    var draw = function () {
      ctx.clearRect(0, 0, w, h);
      var mid = w * (0.5 + (mx - 0.5) * 0.12), base = h * 0.98;
      [["rgba(14,159,110,", -1], ["rgba(229,72,77,", 1]].forEach(function (side) {
        ctx.beginPath(); ctx.moveTo(mid, base);
        var acc = 0;
        for (var i = 0; i <= steps; i++) {
          var n = Math.sin(i * 0.7 + t * 0.6 + side[1]) * 0.5 + Math.sin(i * 0.23 - t * 0.35) * 0.5;
          acc += (0.9 + n * 0.7) * (h * 0.012) * (1 + i / steps);
          var x = mid + side[1] * (i / steps) * (w * 0.62), y = base - acc;
          ctx.lineTo(x, ctx.__py === undefined ? y : ctx.__py); ctx.lineTo(x, y); ctx.__py = y;
        }
        ctx.__py = undefined;
        ctx.lineTo(mid + side[1] * w * 0.62, base); ctx.closePath();
        ctx.fillStyle = side[0] + "0.07)"; ctx.fill();
        ctx.strokeStyle = side[0] + "0.5)"; ctx.lineWidth = 1; ctx.stroke();
      });
      ctx.strokeStyle = "rgba(11,12,14,.07)"; ctx.lineWidth = 1;
      for (var g = 1; g < 6; g++) { ctx.beginPath(); ctx.moveTo(0, (h / 6) * g); ctx.lineTo(w, (h / 6) * g); ctx.stroke(); }
    };
    var loop = function () { t += 0.016; draw(); raf = requestAnimationFrame(loop); };
    size(); draw();
    window.addEventListener("resize", function () { size(); draw(); });
    window.addEventListener("pointermove", function (e) { mx = e.clientX / window.innerWidth; });
    if (!reduce) new IntersectionObserver(function (en) { cancelAnimationFrame(raf); if (en[0].isIntersecting) loop(); }).observe(c);
  })();

  /* ---------- crosshair + image peek ---------- */
  if (fine && !reduce) {
    var cx = document.querySelector(".cx"), cy = document.querySelector(".cy"), cl = document.querySelector(".cl"), peek = document.querySelector(".peek"), pimg = peek.querySelector("img");
    window.addEventListener("pointermove", function (e) {
      cx.style.transform = "translateY(" + e.clientY + "px)"; cy.style.transform = "translateX(" + e.clientX + "px)";
      cl.style.top = e.clientY + "px"; cl.textContent = ((1 - e.clientY / window.innerHeight) * 100).toFixed(2);
      peek.style.left = e.clientX + 190 + "px"; peek.style.top = e.clientY + "px";
    });
    document.querySelectorAll("[data-peek]").forEach(function (b) {
      b.addEventListener("pointerenter", function () { if (b.parentNode.classList.contains("open")) return; pimg.src = b.getAttribute("data-peek"); peek.classList.add("on"); peek.style.scale = "1"; });
      b.addEventListener("pointerleave", function () { peek.classList.remove("on"); peek.style.scale = ".6"; });
      b.addEventListener("click", function () { peek.classList.remove("on"); });
    });
  }

  /* ---------- chat illustration ---------- */
  (function () {
    var feed = document.getElementById("feed"), i = 0;
    if (!feed) return;
    var add = function () {
      var m = CHAT[i % CHAT.length]; i++;
      var el = document.createElement("div");
      el.className = "msg " + (m.c || "");
      el.innerHTML = "<b>" + m.n + "</b>" + m.x;
      feed.appendChild(el);
      if (hasGsap && !reduce) gsap.from(el, { y: 18, opacity: 0, duration: 0.5, ease: "power3.out" });
      while (feed.children.length > 6) feed.removeChild(feed.firstChild);
    };
    for (var k = 0; k < 4; k++) add();
    if (!reduce) new IntersectionObserver(function (en) { clearInterval(feed.__t); if (en[0].isIntersecting) feed.__t = setInterval(add, 1900); }).observe(feed);
  })();

  /* ---------- scramble the name ---------- */
  var scramble = function (el, delay) {
    var text = el.textContent, chars = "▲▼◆01$#%/\\<>+=", frame = 0, total = 26;
    var run = function () {
      var out = "";
      for (var i = 0; i < text.length; i++) {
        if (text[i] === " ") { out += " "; continue; }
        out += frame > (i / text.length) * total * 0.8 + 6 ? text[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out; frame++;
      if (frame <= total + 6) setTimeout(run, 42); else el.textContent = text;
    };
    setTimeout(run, delay);
  };

  /* ---------- motion ---------- */
  if (!hasGsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Lenis !== "undefined") {
    var lenis = new Lenis({ lerp: 0.11 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (tm) { lenis.raf(tm * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']"); if (!a) return;
      var el = document.querySelector(a.getAttribute("href")); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { duration: 1.3 });
    });
    document.addEventListener("keydown", function (e) {
      if (e.target.closest("input,textarea") || e.metaKey || e.ctrlKey) return;
      var n = parseInt(e.key, 10); if (n >= 1 && n <= dockLinks.length) lenis.scrollTo(secs[n - 1], { duration: 1.3 });
    });
  }

  // Layout shifts as lazy images and fonts arrive, so keep the scroll triggers in step with it.
  var rt; var refresh = function () { clearTimeout(rt); rt = setTimeout(function () { ScrollTrigger.refresh(); }, 200); };
  window.addEventListener("load", refresh);
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(document.body);

  document.querySelectorAll(".scr").forEach(function (el, i) { scramble(el, 150 + i * 220); });
  gsap.from(".hero .eyebrow, .pitch, .ticket, .tape", { y: 24, opacity: 0, duration: 1, stagger: 0.09, ease: "expo.out", delay: 0.5 });
  gsap.to(".name", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  document.querySelectorAll("h2").forEach(function (h) {
    gsap.to(h.querySelectorAll(".ln > span"), { y: 0, duration: 1.1, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 86%" } });
  });
  ScrollTrigger.batch(".rv", { start: "top 92%", onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", overwrite: true }); } });
  gsap.from(".does li", { y: 20, opacity: 0, duration: 0.7, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: ".does", start: "top 90%" } });
  gsap.utils.toArray(".row").forEach(function (r) {
    gsap.to(r.querySelector(".track i"), { scaleX: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: r, start: "top 88%" } });
  });
  gsap.from(".mkt b", { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".mkt", start: "top 85%" } });
  ScrollTrigger.create({ onUpdate: function (s) { gsap.to(".tools-in span", { skewX: gsap.utils.clamp(-16, 16, s.getVelocity() / -160), duration: 0.3, overwrite: true }); } });
  ScrollTrigger.addEventListener("scrollEnd", function () { gsap.to(".tools-in span", { skewX: 0, duration: 0.6, overwrite: true }); });

  if (fine) document.querySelectorAll(".mag").forEach(function (m) {
    var x = gsap.quickTo(m, "x", { duration: 0.5, ease: "power3" }), y = gsap.quickTo(m, "y", { duration: 0.5, ease: "power3" });
    m.addEventListener("pointermove", function (e) { var r = m.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.12); y((e.clientY - r.top - r.height / 2) * 0.2); });
    m.addEventListener("pointerleave", function () { x(0); y(0); });
  });
})();
