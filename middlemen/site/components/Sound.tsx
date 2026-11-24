"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient soundtrack, generated in the browser (no audio file, nothing to license).
 * A slow pad that drifts between two chords. Off until the visitor turns it on,
 * because browsers do not allow sound before a click. Scrolling opens the filter a little.
 */
const CHORDS = [
  [55, 110, 164.81, 220, 261.63, 329.63], // A minor 9 feel
  [43.65, 87.31, 130.81, 174.61, 220, 329.63], // F major 7 feel
];

type Engine = { ctx: AudioContext; master: GainNode; filter: BiquadFilterNode; oscs: OscillatorNode[][]; timer: number };

export default function Sound() {
  const [on, setOn] = useState(false);
  const eng = useRef<Engine | null>(null);

  const build = (): Engine => {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.6;

    // A soft echo for space.
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.46;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    filter.connect(master);
    filter.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);

    // Slow movement on the filter so the pad breathes.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const oscs = CHORDS[0].map((f, i) =>
      [-6, 7].map((detune) => {
        const o = ctx.createOscillator();
        o.type = i < 2 ? "sine" : "triangle";
        o.frequency.value = f;
        o.detune.value = detune;
        const g = ctx.createGain();
        g.gain.value = i < 2 ? 0.2 : 0.07;
        o.connect(g);
        g.connect(filter);
        o.start();
        return o;
      })
    );

    let idx = 0;
    const timer = window.setInterval(() => {
      idx = (idx + 1) % CHORDS.length;
      oscs.forEach((pair, i) => pair.forEach((o) => o.frequency.setTargetAtTime(CHORDS[idx][i], ctx.currentTime, 2.2)));
    }, 14000);

    return { ctx, master, filter, oscs, timer };
  };

  const toggle = async () => {
    if (!eng.current) eng.current = build();
    const e = eng.current;
    const next = !on;
    if (next) await e.ctx.resume();
    e.master.gain.cancelScheduledValues(e.ctx.currentTime);
    e.master.gain.setTargetAtTime(next ? 0.16 : 0, e.ctx.currentTime, next ? 0.9 : 0.25);
    if (!next) window.setTimeout(() => eng.current && !document.querySelector(".sound.on") && eng.current.ctx.suspend(), 900);
    setOn(next);
  };

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const e = eng.current;
      if (!e) return;
      const v = Math.min(1, Math.abs(window.scrollY - last) / 60);
      last = window.scrollY;
      e.filter.frequency.setTargetAtTime(700 + v * 1500, e.ctx.currentTime, 0.12);
      e.filter.frequency.setTargetAtTime(700, e.ctx.currentTime + 0.25, 0.8);
    };
    const onHide = () => {
      if (document.hidden) eng.current?.ctx.suspend();
      else if (document.querySelector(".sound.on")) eng.current?.ctx.resume();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      if (eng.current) {
        window.clearInterval(eng.current.timer);
        eng.current.ctx.close();
        eng.current = null;
      }
    };
  }, []);

  return (
    <button className={`sound ${on ? "on" : ""}`} onClick={toggle} aria-pressed={on} aria-label={on ? "Turn sound off" : "Turn sound on"}>
      <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="mono">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
