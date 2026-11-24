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
    let wide = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const wipe = document.querySelector<HTMLElement>(".bone-wipe");
    const zoomEl = document.querySelector<HTMLElement>(".zoom");

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      mobile = w < 760;
      wide = camera.aspect > 1.9;
      camera.fov = mobile ? 38 : 30;
      camera.updateProjectionMatrix();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
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
    window.addEventListener("mm:intro", onIntro);
    window.addEventListener("deviceorientation", onTilt);

    const clock = new THREE.Clock();
    let raf = 0;
    let first = true;
    let parked = false;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Scroll story: 0 to .4 the mark travels to the centre and turns once; .4 to 1 the pillars part
      // and the point grows until it fills the screen, which becomes the next (bone) section.
      // The zone ends when the next section's top edge reaches the bottom of the screen.
      const zone = zoomEl ? zoomEl.offsetTop + zoomEl.offsetHeight - window.innerHeight : window.innerHeight;
      const sp = reduce ? 0 : clamp(window.scrollY / Math.max(1, zone));
      const past = window.scrollY > zone + window.innerHeight * 2.5;
      if (wipe) wipe.style.opacity = past ? "0" : String(clamp((sp - 0.8) / 0.14));
      if (sp >= 1 && !first) {
        if (!parked) { parked = true; renderer.domElement.style.visibility = "hidden"; }
        return;
      }
      if (parked) { parked = false; renderer.domElement.style.visibility = "visible"; }

      const k1 = smooth(clamp(sp / 0.4));
      const k2 = clamp((sp - 0.4) / 0.6);
      const k2e = k2 * k2;

      assemble += (assembleTarget - assemble) * Math.min(1, dt * 2.2);
      const a = ease(Math.min(1, assemble));
      mouse.x += (mouse.tx - mouse.x) * dt * 3;
      mouse.y += (mouse.ty - mouse.y) * dt * 3;

      const bx = mobile ? 0 : wide ? 2.6 : 1.95;
      const by = mobile ? 1.55 : 0.52;
      const bs = mobile ? 0.6 : 0.82;
      rig.position.set(lerp(bx, 0, k1), lerp(by, 0, k1), 0);
      rig.scale.setScalar(lerp(bs, mobile ? 0.9 : 1.25, k1));

      const spread = OFF * (0.12 + 0.88 * a) + k2e * 7.5;
      left.position.x = -spread;
      right.position.x = spread;
      left.rotation.y = k2e * 1.2;
      right.rotation.y = -k2e * 1.2;
      const dotIn = Math.max(0.0001, Math.min(1, (a - 0.45) / 0.55));
      dot.scale.setScalar(dotIn * (1 + k2e * k2 * 15));
      dot.position.y = reduce ? 0 : Math.sin(t * 1.4) * 0.05 * (1 - k2);
      dot.position.z = 0.1 * Math.sin(t * 0.9) * (1 - k2);

      const calm = 1 - k1;
      const idle = reduce ? 0 : Math.sin(t * 0.35) * 0.32 * calm;
      mark.rotation.y = idle + mouse.x * 0.45 * (1 - k2) + k1 * Math.PI * 2 + (1 - a) * -1.2;
      mark.rotation.x = mouse.y * 0.18 * (1 - k2) + (reduce ? 0 : Math.sin(t * 0.5) * 0.04 * calm);
      mark.position.y = reduce ? 0 : Math.sin(t * 0.7) * 0.06 * calm;
      rig.rotation.z = (1 - a) * 0.25;
      glow.visible = k1 < 0.6;
      (glow.material as THREE.MeshBasicMaterial).opacity = 1 - k1 / 0.6;

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
      window.removeEventListener("pointermove", onMove);
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
