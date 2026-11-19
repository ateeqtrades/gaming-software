"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * The Between, in 3D: two chrome pillars and a bone point.
 * Emits "mm:3d-ready" after the first frame; plays its assembly when "mm:intro" fires.
 */
export default function Hero3D() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      window.dispatchEvent(new Event("mm:3d-ready"));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 7.2);

    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0xf2f0ec,
      metalness: 1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.25,
    });
    const bone = new THREE.MeshPhysicalMaterial({
      color: 0xece8e1,
      metalness: 0,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      sheen: 0.4,
    });

    // Mark proportions: bars 16 x 76 on a 120 grid, centres 32 units from the middle, point radius 10.
    const S = 1 / 38;
    const barGeo = new RoundedBoxGeometry(16 * S, 76 * S, 16 * S, 6, 0.035);
    const left = new THREE.Mesh(barGeo, chrome);
    const right = new THREE.Mesh(barGeo, chrome);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(10 * S, 64, 64), bone);
    const OFF = 32 * S;

    const mark = new THREE.Group();
    mark.add(left, right, dot);
    const rig = new THREE.Group();
    rig.add(mark);
    scene.add(rig);

    // Soft key and rim so the chrome has edges on a black page.
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0xbfc6d4, 2.2);
    rim.position.set(-4, -1, -3);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

    // Floor glow
    const glowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, "rgba(236,232,225,0.35)");
      grd.addColorStop(1, "rgba(236,232,225,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    })();
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 1.2),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -1.45;
    rig.add(glow);

    // State
    let assemble = reduce ? 1 : 0; // 0 = closed, 1 = assembled
    let assembleTarget = reduce ? 1 : 0;
    let mobile = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollP = 0;

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      mobile = w < 760;
      camera.fov = mobile ? 34 : 30;
      camera.updateProjectionMatrix();
      const wide = camera.aspect > 1.9;
      rig.position.set(mobile ? 0 : wide ? 2.6 : 1.95, mobile ? 0.05 : 0.52, 0);
      rig.scale.setScalar(mobile ? 0.92 : 0.82);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollP = Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.clientHeight)));
    };
    const onIntro = () => {
      assembleTarget = 1;
    };
    // Gentle tilt from the phone when available, without asking for permission.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      mouse.tx = Math.max(-1, Math.min(1, e.gamma / 30));
      mouse.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mm:intro", onIntro);
    window.addEventListener("deviceorientation", onTilt);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    let first = true;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible && !first) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      assemble += (assembleTarget - assemble) * Math.min(1, dt * 2.2);
      const a = ease(Math.min(1, assemble));
      mouse.x += (mouse.tx - mouse.x) * dt * 3;
      mouse.y += (mouse.ty - mouse.y) * dt * 3;

      const spread = OFF * (0.12 + 0.88 * a) + scrollP * 0.35;
      left.position.x = -spread;
      right.position.x = spread;
      dot.scale.setScalar(Math.max(0.0001, Math.min(1, (a - 0.45) / 0.55)));
      dot.position.y = reduce ? 0 : Math.sin(t * 1.4) * 0.05;
      dot.position.z = 0.1 * Math.sin(t * 0.9);

      const idle = reduce ? 0 : Math.sin(t * 0.35) * 0.32;
      mark.rotation.y = idle + mouse.x * 0.45 + scrollP * 1.4 + (1 - a) * -1.2;
      mark.rotation.x = mouse.y * 0.18 + (reduce ? 0 : Math.sin(t * 0.5) * 0.04);
      mark.position.y = reduce ? 0 : Math.sin(t * 0.7) * 0.06 - scrollP * 0.6;
      rig.rotation.z = (1 - a) * 0.25;

      renderer.render(scene, camera);
      if (first) {
        first = false;
        window.dispatchEvent(new Event("mm:3d-ready"));
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mm:intro", onIntro);
      window.removeEventListener("deviceorientation", onTilt);
      barGeo.dispose();
      dot.geometry.dispose();
      glow.geometry.dispose();
      glowTex.dispose();
      chrome.dispose();
      bone.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="hero-3d" aria-hidden="true" />;
}
