"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site soundtrack. On by default: it starts as soon as the browser allows, which for most
 * browsers means the visitor's first click, tap or key press. The button turns it off and on.
 */
const SRC = "/audio/theme.mp3";
const VOLUME = 0.45;

/** The ambient pad: a soft chord that swells in, opens up, then hands over to the song. Made in the browser. */
function padIntro(seconds = 7.5) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const t0 = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.exponentialRampToValueAtTime(0.34, t0 + 1.6);
    master.gain.setValueAtTime(0.34, t0 + seconds - 3.6);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(380, t0);
    filter.frequency.exponentialRampToValueAtTime(2400, t0 + seconds * 0.6); // the pad opens up as it swells
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.46;
    const fb = ctx.createGain();
    fb.gain.value = 0.4;
    const wet = ctx.createGain();
    wet.gain.value = 0.4;
    filter.connect(master);
    filter.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);
    [55, 110, 164.81, 220, 261.63, 329.63].forEach((f, i) =>
      [-6, 7].forEach((detune) => {
        const o = ctx.createOscillator();
        o.type = i < 2 ? "sine" : "triangle";
        o.frequency.value = f;
        o.detune.value = detune;
        const g = ctx.createGain();
        g.gain.value = i < 2 ? 0.2 : 0.07;
        o.connect(g);
        g.connect(filter);
        o.start(t0);
        o.stop(t0 + seconds + 0.2);
      })
    );
    window.setTimeout(() => ctx.close(), (seconds + 1) * 1000);
  } catch {
    /* no Web Audio: skip the intro */
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
        padIntro();
        window.setTimeout(() => wanted.current && fadeTo(VOLUME, undefined, 0.005), 3200); // crackle alone first, then the song rises over about three seconds
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
