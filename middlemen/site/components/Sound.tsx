"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site soundtrack. On by default: it starts as soon as the browser allows, which for most
 * browsers means the visitor's first click, tap or key press. The button turns it off and on.
 */
const SRC = "/audio/theme.mp3";
const VOLUME = 0.45;

/** A short vinyl-style crackle, made in the browser, played just before the music comes in. */
function crackle(seconds = 5) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const n = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.02; // surface hiss
      if (Math.random() < 0.0016) {
        // a pop: a sharp click that dies away in a few milliseconds
        const amp = 0.35 + Math.random() * 0.65;
        const len = 20 + Math.floor(Math.random() * 90);
        for (let k = 0; k < len && i + k < n; k++) d[i + k] += (Math.random() * 2 - 1) * amp * Math.exp(-k / (len / 4));
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.95, ctx.currentTime + 0.06);
    g.gain.setValueAtTime(0.95, ctx.currentTime + seconds - 2.4);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds);
    src.connect(hp);
    hp.connect(g);
    g.connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    /* no Web Audio: skip the crackle */
  }
}

export default function Sound() {
  const [on, setOn] = useState(true); // what the visitor wants
  const [playing, setPlaying] = useState(false); // what is actually happening
  const audio = useRef<HTMLAudioElement | null>(null);
  const wanted = useRef(true);
  const fade = useRef(0);
  const crackled = useRef(false);

  const fadeTo = (target: number, then?: () => void, step = 0.03) => {
    const a = audio.current;
    if (!a) return;
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const d = target - a.volume;
      if (Math.abs(d) < step) {
        a.volume = target;
        window.clearInterval(fade.current);
        then?.();
      } else a.volume = Math.max(0, Math.min(1, a.volume + Math.sign(d) * step));
    }, 40);
  };

  const start = async () => {
    const a = audio.current;
    if (!a || !wanted.current) return false;
    try {
      a.volume = 0;
      await a.play();
      setPlaying(true);
      if (!crackled.current) {
        crackled.current = true;
        crackle();
        window.setTimeout(() => wanted.current && fadeTo(VOLUME, undefined, 0.006), 2400); // crackle alone first, then the song rises over about three seconds
      } else fadeTo(VOLUME);
      return true;
    } catch {
      return false; // blocked until the visitor interacts
    }
  };

  useEffect(() => {
    const a = new Audio(SRC);
    a.loop = true;
    a.preload = "auto";
    audio.current = a;

    const events = ["pointerdown", "keydown", "touchend"] as const;
    const unlock = async () => {
      if (await start()) events.forEach((e) => window.removeEventListener(e, unlock));
    };
    start().then((ok) => {
      if (!ok) events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    });

    const onHide = () => {
      if (document.hidden) a.pause();
      else if (wanted.current && a.currentTime > 0) a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock));
      document.removeEventListener("visibilitychange", onHide);
      window.clearInterval(fade.current);
      a.pause();
      audio.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (on && !playing) {
      start(); // browser was still blocking sound; this tap is the permission it needs
      return;
    }
    const next = !on;
    wanted.current = next;
    setOn(next);
    if (next) start();
    else {
      setPlaying(false);
      fadeTo(0, () => audio.current?.pause());
    }
  };

  const label = !on ? "Sound off" : playing ? "Sound on" : "Tap for sound";
  return (
    <button
      className={`sound ${on && playing ? "on" : ""}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
    >
      <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="mono">{label}</span>
    </button>
  );
}
