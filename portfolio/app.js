/* Portfolio: depth-chart hero, scramble type, crosshair cursor, scroll reveals, work list, chat illustration. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap) document.documentElement.classList.add("js");

  /* ---------- content ---------- */
  var WORK = [
    { t: "DXL", k: "Brand experience", y: "2022 to now", role: "Head of Brand Experience", svc: "Brand experience, partnerships, positioning",
      d: "Pakistan's first structured digital-asset education academy, building toward a PVARA-aligned exchange. I shape how the brand shows up for learners and for institutions: PVARA, Sindh Police, Saylani Welfare, BankIslami, Dewan University and HEC.",
      typo: ["DXL", "Digital-asset education · Karachi"] },
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
      ? '<div class="gal' + (w.wide ? " wide" : "") + '">' + w.img.slice(0, w.wide ? 2 : 3).map(function (n) { return '<img src="img/' + n + '.jpg" alt="' + w.t + ' work sample" loading="lazy">'; }).join("") + "</div>"
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

  document.querySelectorAll(".scr").forEach(function (el, i) { scramble(el, 150 + i * 220); });
  gsap.from(".hero .eyebrow, .pitch, .ticket, .tape", { y: 24, opacity: 0, duration: 1, stagger: 0.09, ease: "expo.out", delay: 0.5 });
  gsap.to(".name", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  document.querySelectorAll("h2").forEach(function (h) {
    gsap.to(h.querySelectorAll(".ln > span"), { y: 0, duration: 1.1, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 86%" } });
  });
  ScrollTrigger.batch(".rv", { start: "top 92%", onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", overwrite: true }); } });
  gsap.to(".book-rows i", { scaleX: 1, duration: 1.3, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".book", start: "top 80%" } });
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
