"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site soundtrack. On by default: it starts as soon as the browser allows, which for most
 * browsers means the visitor's first click, tap or key press. The button turns it off and on.
 */
const SRC = "/audio/theme.mp3";
const VOLUME = 0.45;

export default function Sound() {
  const [on, setOn] = useState(true); // what the visitor wants
  const [playing, setPlaying] = useState(false); // what is actually happening
  const audio = useRef<HTMLAudioElement | null>(null);
  const wanted = useRef(true);
  const fade = useRef(0);

  const fadeTo = (target: number, then?: () => void) => {
    const a = audio.current;
    if (!a) return;
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const d = target - a.volume;
      if (Math.abs(d) < 0.03) {
        a.volume = target;
        window.clearInterval(fade.current);
        then?.();
      } else a.volume = Math.max(0, Math.min(1, a.volume + Math.sign(d) * 0.03));
    }, 40);
  };

  const start = async () => {
    const a = audio.current;
    if (!a || !wanted.current) return false;
    try {
      a.volume = 0;
      await a.play();
      setPlaying(true);
      fadeTo(VOLUME);
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
