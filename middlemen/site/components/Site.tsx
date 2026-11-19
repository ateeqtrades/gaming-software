"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { Mark, Wordmark, WordmarkSlice } from "./Mark";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SIDES = ["Buyers", "Partners", "Capital", "Distribution", "Talent", "The room"];

const PILLARS = [
  {
    k: "Connect",
    t: "Introductions",
    d: "We put you in front of the people who move your business: buyers, distributors, partners, investors and talent. Warm, vetted and on the record.",
  },
  {
    k: "Close",
    t: "Sales",
    d: "We open pipeline and take it to signature. We are paid like a partner, on outcomes, not hours.",
  },
  {
    k: "Build",
    t: "Infrastructure",
    d: "The website, the brand and the content a deal needs to land. Built in house, only for the businesses we represent.",
  },
];

const STEPS = [
  { t: "Brief", d: "One conversation. What you sell, who needs it, what a win looks like." },
  { t: "Map", d: "We map the market and the people in it, and choose who to call first." },
  { t: "Introduce", d: "Warm introductions, with the material that makes the first meeting count." },
  { t: "Close", d: "We stay in the room through pricing, paperwork and the first order." },
];

const SECTORS = [
  "Construction & materials",
  "Trade & export",
  "Real estate",
  "Consumer brands",
  "Technology",
  "Hospitality",
  "Manufacturing",
  "Logistics",
  "Food & agriculture",
  "Professional services",
];

const MEN = [
  { n: "Dayan Khan", i: "DK", r: "Founding Partner" },
  { n: "Syed Ahmad Hassan", i: "SAH", r: "Founding Partner" },
];

const NEEDS = ["Buyers", "Partners", "Capital", "Distribution", "A website", "Something else"];

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tnum">{t} PKT</span>;
}

export default function Site() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [needs, setNeeds] = useState<string[]>(["Buyers"]);
  const [sent, setSent] = useState<"" | "intro" | "drop">("");
  const [menu, setMenu] = useState(false);
  const [dock, setDock] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const intro = document.getElementById("intro");
      const past = window.scrollY > window.innerHeight * 0.9;
      const atForm = intro ? intro.getBoundingClientRect().top < window.innerHeight : false;
      const st = document.querySelector(".bt-stage")?.getBoundingClientRect();
      const inStage = st ? st.top < window.innerHeight * 0.5 && st.bottom > window.innerHeight * 0.5 : false;
      setDock(past && !atForm && !inStage);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menu);
    if (menu) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [menu]);

  useIso(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    let fitWords = () => {};
    const ctx = gsap.context(() => {
      /* ---------- Loader + hero intro ---------- */
      const heroSplit = new SplitText(".hero-h .line", { type: "chars", charsClass: "ch" });
      if (reduce) {
        gsap.set(".loader", { display: "none" });
        window.dispatchEvent(new Event("mm:intro"));
      } else {
        lenis?.stop();
        gsap.set(heroSplit.chars, { yPercent: 110 });
        gsap.set(".hero-fade", { y: 24, opacity: 0 });
        gsap.set(".nav", { yPercent: -100 });

        const countEl = document.querySelector(".ld-count");
        const barEl = document.querySelector<HTMLElement>(".ld-bar i");
        const prog = { v: 0 };
        const paint = () => {
          if (countEl) countEl.textContent = String(Math.round(prog.v)).padStart(3, "0");
          if (barEl) barEl.style.transform = `scaleX(${prog.v / 100})`;
        };
        gsap
          .timeline({ defaults: { ease: "expo.inOut" } })
          .from(".ld-mark .mk-l", { x: 20, duration: 1.2 }, 0.1)
          .from(".ld-mark .mk-r", { x: -20, duration: 1.2 }, 0.1)
          .from(".ld-mark .mk-d", { scale: 0, transformOrigin: "60px 60px", duration: 0.9, ease: "back.out(2.4)" }, 0.9)
          .from(".ld-word span", { yPercent: 110, duration: 1, stagger: 0.04, ease: "expo.out" }, 0.5)
          .from(".ld-meta", { opacity: 0, duration: 0.8 }, 0.4)
          .fromTo(".ld-wm", { yPercent: 18, opacity: 0, scale: 1.06 }, { yPercent: 0, opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" }, 0)
          .to(".ld-wm", { scale: 1.03, duration: 3, ease: "none" }, 1.6);

        // Run to 85% on time, then wait for the 3D scene (or 3s) before finishing.
        const toEighty = gsap.to(prog, { v: 85, duration: 1.5, ease: "power2.out", onUpdate: paint });
        let ready = false;
        const onReady = () => (ready = true);
        window.addEventListener("mm:3d-ready", onReady, { once: true });
        const started = performance.now();
        const finish = () => {
          gsap
            .timeline({ defaults: { ease: "expo.inOut" } })
            .to(prog, { v: 100, duration: 0.5, ease: "power2.inOut", onUpdate: paint })
            .to(".ld-inner", { opacity: 0, y: -16, duration: 0.6 }, "+=0.15")
            .to(".ld-top", { yPercent: -100, duration: 1.2 }, "<0.2")
            .to(".ld-bot", { yPercent: 100, duration: 1.2 }, "<")
            .add(() => window.dispatchEvent(new Event("mm:intro")), "<0.1")
            .set(".loader", { display: "none" })
            .to(heroSplit.chars, { yPercent: 0, duration: 1.2, stagger: 0.022, ease: "expo.out" }, "-=0.75")
            .to(".hero-fade", { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out" }, "-=0.9")
            .to(".nav", { yPercent: 0, duration: 1, ease: "expo.out" }, "<")
            .add(() => {
              gsap.set(".nav", { clearProps: "transform" });
              lenis?.start();
            });
        };
        const wait = () => {
          if ((ready && !toEighty.isActive()) || performance.now() - started > 2600) finish();
          else gsap.delayedCall(0.1, wait);
        };
        gsap.delayedCall(1.6, wait);
      }

      if (reduce) return;

      /* ---------- Nav hide on scroll down ---------- */
      ScrollTrigger.create({
        start: 120,
        onUpdate: (s) => document.querySelector(".nav")?.classList.toggle("nav-hide", s.direction === 1),
      });

      /* ---------- Hero parallax ---------- */
      gsap.to(".hero-h", {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      /* ---------- Manifesto: words light up ---------- */
      const man = new SplitText(".manifesto p", { type: "words", wordsClass: "w" });
      gsap.fromTo(
        man.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 45%", scrub: true },
        }
      );

      /* ---------- The Between: pinned signature moment ----------
         Everything is positioned from the exact centre of the stage in px, so it lines up at any size. */
      const stage = document.querySelector<HTMLElement>(".bt-stage")!;
      const words = gsap.utils.toArray<HTMLElement>(".bt-word");
      const geo = () => {
        const w = stage.clientWidth;
        const cs = getComputedStyle(stage);
        const bw = parseFloat(cs.getPropertyValue("--bw")) || 40;
        const gut = w < 700 ? 30 : 0;
        const spread = w < 700 ? w / 2 - gut - bw / 2 : Math.min(w * 0.34, 560);
        return { w, bw, spread, gap: spread * 2 - bw };
      };
      fitWords = () => {
        const { gap, w, spread } = geo();
        stage.style.setProperty("--spread", `${spread}px`);
        const target = gap * (w < 700 ? 0.8 : 0.78);
        words.forEach((el) => {
          el.style.fontSize = "100px";
          const nat = el.scrollWidth || 1;
          el.style.fontSize = `${Math.min((100 * target) / nat, w < 700 ? 120 : 190)}px`;
        });
      };
      fitWords();
      ScrollTrigger.addEventListener("refreshInit", fitWords);

      const STEP = 0.55;
      const W0 = 1.35;
      const bt = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".between",
          start: "top top",
          end: () => `+=${window.innerHeight * (2.2 + words.length * 0.5)}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            let i = 0;
            let best = -1;
            words.forEach((w, k) => {
              const o = parseFloat(getComputedStyle(w).opacity);
              if (o > best + 0.01) {
                best = o;
                i = k;
              }
            });
            const n = document.querySelector(".bt-n");
            if (n) n.textContent = String(i + 1).padStart(2, "0");
          },
        },
      });
      bt.fromTo(".bt-l", { x: () => -geo().bw / 2 }, { x: () => -geo().spread, ease: "power3.inOut", duration: 1 }, 0)
        .fromTo(".bt-r", { x: () => geo().bw / 2 }, { x: () => geo().spread, ease: "power3.inOut", duration: 1 }, 0)
        .fromTo(".bt-bar", { scaleY: 0.55 }, { scaleY: 1, ease: "power3.inOut", duration: 1 }, 0)
        .fromTo(".bt-lab", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.75)
        .fromTo(".bt-dot", { scale: 0 }, { scale: 1, ease: "back.out(2.2)", duration: 0.35 }, 0.85)
        .fromTo(".bt-glow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5 }, 0.85)
        .fromTo(".bt-line", { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 0.35 }, 1.05)
        .fromTo(".bt-meta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, 1.1);
      words.forEach((w, i) => {
        const at = W0 + i * STEP;
        bt.fromTo(
          w,
          { yPercent: 40, opacity: 0, filter: "blur(10px)" },
          { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: STEP * 0.4, ease: "power2.out" },
          at
        );
        if (i < words.length - 1)
          bt.to(w, { yPercent: -40, opacity: 0, filter: "blur(10px)", duration: STEP * 0.4, ease: "power2.in" }, at + STEP * 0.6);
      });
      const end = W0 + words.length * STEP;
      bt.fromTo(".bt-cap", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, end - STEP * 0.4)
        .to(".bt-dot", { scale: 1.35, duration: 0.4, ease: "power2.inOut" }, end - STEP * 0.4)
        .to({}, { duration: 0.3 });

      /* ---------- Section headings reveal ---------- */
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        const s = new SplitText(el, { type: "lines", linesClass: "rl", mask: "lines" });
        gsap.from(s.lines, {
          yPercent: 105,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".fade").forEach((el) => {
        gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      /* ---------- Pillars light up as they cross the middle of the screen (touch) ---------- */
      gsap.utils.toArray<HTMLElement>(".pillar").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 62%", end: "bottom 38%", toggleClass: "active" });
      });

      /* ---------- Process line ---------- */
      gsap.fromTo(
        ".steps-line i",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 60%", scrub: true } }
      );

      /* ---------- Founders ---------- */
      gsap.from(".man", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.4,
        stagger: 0.15,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ".men", start: "top 75%" },
      });

      /* ---------- Footer wordmark ---------- */
      gsap.fromTo(
        ".foot-wm",
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "bottom bottom", scrub: true } }
      );
    }, root);

    /* ---------- Anchor links through Lenis ---------- */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id.length > 1 ? document.querySelector(id) : null;
      if (!el) return;
      e.preventDefault();
      document.documentElement.classList.remove("menu-open");
      lenis?.start();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
      else el.scrollIntoView();
    };
    document.addEventListener("click", onClick);

    /* ---------- Cursor + magnetic buttons (fine pointers only) ---------- */
    const fine = window.matchMedia("(pointer: fine)").matches && !reduce;
    const cleanups: (() => void)[] = [];
    if (fine) {
      const c = document.querySelector<HTMLElement>(".cursor")!;
      const xTo = gsap.quickTo(c, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(c, "y", { duration: 0.35, ease: "power3" });
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        const hot = (e.target as HTMLElement).closest("a,button,label,.pillar,.man,input,textarea");
        c.classList.toggle("cursor-hot", !!hot);
      };
      window.addEventListener("pointermove", move);
      cleanups.push(() => window.removeEventListener("pointermove", move));

      document.querySelectorAll<HTMLElement>(".magnet").forEach((m) => {
        const mx = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
        const my = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
        const mv = (e: PointerEvent) => {
          const r = m.getBoundingClientRect();
          mx((e.clientX - (r.left + r.width / 2)) * 0.3);
          my((e.clientY - (r.top + r.height / 2)) * 0.3);
        };
        const lv = () => {
          mx(0);
          my(0);
        };
        m.addEventListener("pointermove", mv);
        m.addEventListener("pointerleave", lv);
        cleanups.push(() => {
          m.removeEventListener("pointermove", mv);
          m.removeEventListener("pointerleave", lv);
        });
      });
    }

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", fitWords);
      ctx.revert();
      lenis?.destroy();
      document.removeEventListener("click", onClick);
      cleanups.forEach((f) => f());
    };
  }, []);

  const toggleNeed = (n: string) =>
    setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  return (
    <div ref={root}>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" aria-hidden="true" />

      {/* Loader */}
      <div className="loader" aria-hidden="true">
        <div className="ld-top" />
        <div className="ld-bot" />
        <div className="ld-inner">
          <div className="ld-row ld-meta mono">
            <span>Middlemen</span>
            <span>Pakistan → Worldwide</span>
          </div>
          <div className="ld-center">
            <div className="ld-back" aria-hidden="true">
              <Wordmark className="ld-wm ld-full" />
              <div className="ld-wm ld-stack">
                <WordmarkSlice from={-30} to={5334} className="ld-l1" />
                <WordmarkSlice from={5334} to={8513} className="ld-l2" />
              </div>
            </div>
            <Mark className="ld-mark" title="" />
            <div className="ld-word" aria-hidden="true">
              {"WE KNOW PEOPLE".split("").map((c, i) => (
                <span key={i}>{c === " " ? "\u00a0" : c}</span>
              ))}
            </div>
          </div>
          <div className="ld-foot">
            <div className="ld-bar"><i /></div>
            <div className="ld-row mono">
              <span className="ld-meta">Opening the room</span>
              <span className="ld-count tnum">000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <header className="nav">
        <div className="wrap nav-in">
          <a href="#top" className="brand" aria-label="Middlemen, back to top">
            <Mark className="brand-mark" />
            <span>MIDDLEMEN</span>
          </a>
          <nav aria-label="Main">
            <ul>
              <li><a href="#what">What we do</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#men">The Men</a></li>
              <li><a href="#drop">Drop 01</a></li>
            </ul>
          </nav>
          <a href="#intro" className="btn btn-sm magnet nav-cta">Request an introduction</a>
          <button
            className={`burger ${menu ? "open" : ""}`}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <div className={`menu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div className="wrap menu-in">
          <span className="mono muted">Menu</span>
          <ul>
            {[
              ["#what", "What we do"],
              ["#how", "How it works"],
              ["#men", "The Men"],
              ["#drop", "Drop 01"],
              ["#intro", "Request an introduction"],
            ].map(([h, l], i) => (
              <li key={h} style={{ transitionDelay: menu ? `${0.08 + i * 0.05}s` : "0s" }}>
                <a href={h} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
                  <span className="mono">0{i + 1}</span>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-foot mono muted">
            <span>hello@middlemen.group</span>
            <span>Pakistan · Worldwide</span>
          </div>
        </div>
      </div>

      <a href="#intro" className={`dock ${dock ? "show" : ""}`}>
        <Mark className="dock-mark" title="" />
        Request an introduction
      </a>

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <Hero3D />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="wrap hero-in">
            <div className="hero-meta hero-fade mono">
              <span>Deal house</span>
              <span>Pakistan → Worldwide</span>
              <Clock />
            </div>
            <h1 className="hero-h" aria-label="We know people.">
              <span className="line" aria-hidden="true">WE KNOW</span>
              <span className="line" aria-hidden="true">PEOPLE.</span>
            </h1>
            <div className="hero-foot">
              <p className="hero-fade lede">
                Middlemen sits between businesses and what they need next. Buyers, partners, capital and the right rooms.
                Based in Pakistan, working across the globe.
              </p>
              <div className="hero-fade hero-ctas">
                <a href="#intro" className="btn magnet">Request an introduction</a>
                <a href="#what" className="link">See what we do</a>
              </div>
            </div>
          </div>
          <div className="scroll-cue hero-fade mono" aria-hidden="true"><i /> Scroll</div>
        </section>

        {/* Manifesto */}
        <section className="manifesto">
          <div className="wrap">
            <span className="kicker mono">The idea</span>
            <p>
              Every business is one introduction away from its next chapter. Most never get it. They sell to the people they
              already know and wait for the rest to find them. We are the people in the middle. We know who needs what, we make
              the call, and we stay until it closes.
            </p>
          </div>
        </section>

        {/* The Between */}
        <section className="between" aria-label="You, us, and the market">
          <div className="bt-stage">
            <div className="bt-glow" aria-hidden="true" />
            <div className="bt-words" aria-hidden="true">
              {SIDES.map((w) => (
                <span key={w} className="bt-word">{w}</span>
              ))}
            </div>
            <div className="bt-line bt-line-l" aria-hidden="true" />
            <div className="bt-line bt-line-r" aria-hidden="true" />
            <div className="bt-bar bt-l" aria-hidden="true"><span className="bt-lab mono">You</span></div>
            <div className="bt-bar bt-r" aria-hidden="true"><span className="bt-lab mono">The market</span></div>
            <div className="bt-dot" aria-hidden="true"><i /></div>
            <div className="bt-meta mono" aria-hidden="true">
              <span>What we bring</span>
              <span><span className="bt-n tnum">01</span> / {String(SIDES.length).padStart(2, "0")}</span>
            </div>
            <p className="bt-cap">
              Every deal has two sides. <b>We are the point between them.</b>
            </p>
            <p className="sr-only">We connect you to buyers, partners, capital, distribution, talent and the room.</p>
          </div>
        </section>

        {/* What we do */}
        <section className="what" id="what">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker mono">What we do</span>
              <h2 className="reveal">Three jobs. One side of the table: yours.</h2>
            </div>
            <div className="pillars">
              {PILLARS.map((p, i) => (
                <article className="pillar" key={p.k}>
                  <span className="mono p-i">0{i + 1}</span>
                  <h3>{p.k}</h3>
                  <div className="p-body">
                    <span className="mono p-t">{p.t}</span>
                    <p>{p.d}</p>
                  </div>
                  <span className="p-arrow" aria-hidden="true">→</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how" id="how">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker mono">How a mandate runs</span>
              <h2 className="reveal">From first call to first order.</h2>
            </div>
            <div className="steps">
              <div className="steps-line" aria-hidden="true"><i /></div>
              {STEPS.map((s, i) => (
                <div className="step fade" key={s.t}>
                  <span className="step-dot" aria-hidden="true" />
                  <span className="mono step-n">Step {i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors */}
        <section className="sectors" aria-label="Sectors we work in">
          <div className="marquee">
            <div className="mq-track">
              {[...SECTORS, ...SECTORS].map((s, i) => (
                <span key={i} className="mq-item">
                  {s}
                  <Mark className="mq-mark" title="" />
                </span>
              ))}
            </div>
          </div>
          <div className="marquee rev">
            <div className="mq-track">
              {[...SECTORS.slice().reverse(), ...SECTORS.slice().reverse()].map((s, i) => (
                <span key={i} className="mq-item ghost">
                  {s}
                  <Mark className="mq-mark" title="" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* The Men */}
        <section className="men-sec" id="men">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker mono">The Men</span>
              <h2 className="reveal">Two names you will hear again.</h2>
            </div>
            <div className="men">
              {MEN.map((m) => (
                <article className="man" key={m.n}>
                  <div className="man-img">
                    <span className="man-init">{m.i}</span>
                    <Mark className="man-mark" title="" />
                  </div>
                  <div className="man-meta">
                    <h3>{m.n}</h3>
                    <span className="mono">{m.r}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Drop */}
        <section className="drop" id="drop">
          <div className="wrap drop-in">
            <div className="drop-copy">
              <span className="kicker mono">Drop 01</span>
              <h2 className="reveal">Members first.</h2>
              <p className="lede fade">
                Heavyweight hoodie, tee and cap. Tonal embroidery on the front, the line on the back. A small numbered run, and
                the list hears first.
              </p>
              {sent === "drop" ? (
                <p className="ok mono" role="status">You are on the list.</p>
              ) : (
                <form
                  className="drop-form fade"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent("drop");
                  }}
                >
                  <label htmlFor="drop-email" className="sr-only">Email</label>
                  <input id="drop-email" type="email" required placeholder="Your email" autoComplete="email" />
                  <button className="btn magnet" type="submit">Join the list</button>
                </form>
              )}
            </div>
            <div className="drop-art fade" aria-hidden="true">
              <svg viewBox="0 0 300 320" className="hoodie">
                <path d="M98 58Q150 40 202 58L262 92L292 232L256 242L240 156V302H60V156L44 242L8 232L38 92Z" className="h-body" />
                <path d="M108 60Q150 6 192 60Q150 86 108 60Z" className="h-hood" />
                <path d="M138 72V118M162 72V118" className="h-str" />
                <rect x="96" y="214" width="108" height="56" rx="6" className="h-pkt" />
                <g transform="translate(139 128) scale(.18)" className="h-mark">
                  <rect x="20" y="22" width="16" height="76" />
                  <rect x="84" y="22" width="16" height="76" />
                  <circle cx="60" cy="60" r="10" />
                </g>
              </svg>
              <span className="mono drop-no">No. 001 / 150</span>
            </div>
          </div>
        </section>

        {/* Intro request */}
        <section className="intro" id="intro">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker mono">Request an introduction</span>
              <h2 className="reveal">Tell us who you need to meet.</h2>
            </div>
            {sent === "intro" ? (
              <div className="ok-box" role="status">
                <Mark className="ok-mark" title="" />
                <p>Received. One of us will reply within two working days.</p>
              </div>
            ) : (
              <form
                className="intro-form fade"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent("intro");
                }}
              >
                <div className="row2">
                  <div className="field">
                    <label htmlFor="f-name">Your name</label>
                    <input id="f-name" required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-co">Company</label>
                    <input id="f-co" required autoComplete="organization" />
                  </div>
                </div>
                <div className="row2">
                  <div className="field">
                    <label htmlFor="f-mail">Email</label>
                    <input id="f-mail" type="email" required autoComplete="email" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-where">Where you operate</label>
                    <input id="f-where" placeholder="Country or city" />
                  </div>
                </div>
                <fieldset className="field">
                  <legend>What do you need?</legend>
                  <div className="chips">
                    {NEEDS.map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={`chip ${needs.includes(n) ? "on" : ""}`}
                        aria-pressed={needs.includes(n)}
                        onClick={() => toggleNeed(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="field">
                  <label htmlFor="f-msg">The short version</label>
                  <textarea id="f-msg" rows={4} placeholder="What you sell, and who you want in the room." />
                </div>
                <div className="form-foot">
                  <span className="mono muted">Or write to hello@middlemen.group</span>
                  <button className="btn btn-lg magnet" type="submit">Send request</button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-top">
            <p className="foot-line">We know people.</p>
            <div className="foot-cols mono">
              <div>
                <span className="muted">Write</span>
                <span>hello@middlemen.group</span>
              </div>
              <div>
                <span className="muted">Follow</span>
                <span>Instagram · LinkedIn · X</span>
              </div>
              <div>
                <span className="muted">Based</span>
                <span>Pakistan. Working worldwide.</span>
              </div>
            </div>
          </div>
          <Wordmark className="foot-wm" />
          <div className="foot-base mono muted">
            <span>© 2026 Middlemen</span>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
