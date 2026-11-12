"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
uniform float uTime; uniform float uPx;
attribute float aSeed; attribute float aKind; attribute vec3 aColor;
varying float vKind; varying vec3 vColor; varying float vAlpha;
void main() {
  vec3 p = position;
  float t = uTime * (0.12 + aSeed * 0.22);
  p.y = mod(p.y + t + 9.0, 18.0) - 9.0;
  p.x += sin(t * 1.3 + aSeed * 40.0) * 0.7;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = mix(16.0, 64.0, aSeed) * (aKind > 0.5 ? 0.6 : 1.0) * uPx * (10.0 / -mv.z);
  vKind = aKind; vColor = aColor;
  vAlpha = (0.35 + 0.25 * sin(uTime * (0.5 + aSeed) + aSeed * 20.0)) * smoothstep(9.0, 6.0, abs(p.y));
}`;

const FRAG = /* glsl */ `
varying float vKind; varying vec3 vColor; varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a;
  if (vKind > 0.5) {
    vec2 q = vec2(c.x, -c.y) * 2.7 + vec2(0.0, 0.12);
    float f = pow(dot(q, q) - 1.0, 3.0) - q.x * q.x * q.y * q.y * q.y;
    a = 1.0 - smoothstep(-0.03, 0.03, f);
  } else {
    a = smoothstep(0.5, 0.0, length(c));
    a *= a;
  }
  gl_FragColor = vec4(vColor, a * vAlpha);
}`;

export default function Ambient() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return; // no WebGL: the CSS background alone is fine
    }
    const px = Math.min(devicePixelRatio, 1.5);
    renderer.setPixelRatio(px);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 12;

    const N = 170;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    const kind = new Float32Array(N);
    const col = new Float32Array(N * 3);
    const warm = ["#f3c98b", "#ffe9cf", "#f4b6b2"].map((c) => new THREE.Color(c));
    const rose = ["#e0566f", "#f4a3a8"].map((c) => new THREE.Color(c));
    for (let i = 0; i < N; i++) {
      pos.set([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, -10 + Math.random() * 16], i * 3);
      seed[i] = Math.random();
      kind[i] = Math.random() < 0.16 ? 1 : 0;
      const pal = kind[i] ? rose : warm;
      pal[Math.floor(Math.random() * pal.length)].toArray(col, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aKind", new THREE.BufferAttribute(kind, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPx: { value: px } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geo, mat));

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / innerWidth - 0.5;
      mouse.y = e.clientY / innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();
    const frame = () => {
      mat.uniforms.uTime.value = (performance.now() - t0) / 1000;
      camera.position.x += (mouse.x * 1.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 1.0 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!still) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="ambient" aria-hidden />;
}
