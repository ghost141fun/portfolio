"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  attribute float aSpeed;
  attribute float aOffset;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    
    // Simpler, more robust motion field
    float t = uTime * 0.3 + aOffset;
    pos.x += sin(t * aSpeed) * 2.0;
    pos.y += cos(t * aSpeed * 0.8) * 2.0;
    pos.z += sin(t * 0.5) * 2.0;

    // React to scroll
    pos.y += uScroll * 0.05;

    // React to mouse
    vec2 m = uMouse * 30.0;
    float dist = distance(pos.xy, m);
    float force = smoothstep(10.0, 0.0, dist);
    pos.xy += normalize(pos.xy - m) * force * 5.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (2.0 + force * 4.0) * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vColor = mix(vec3(0.4, 0.4, 0.4), vec3(0.83, 1.0, 0.12), force);
    vAlpha = 0.15 + force * 0.5;
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float glow = pow(1.0 - r*2.0, 2.0);
    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`;

export default function GlobalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const COUNT = 10000;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const offsets = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
        speeds[i] = 1.0 + Math.random() * 2.0;
        offsets[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const clock = new THREE.Clock();
    let animId: number;
    const mouse = new THREE.Vector2(0, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = t;
      mat.uniforms.uScroll.value = window.scrollY;
      mat.uniforms.uMouse.value.lerp(mouse, 0.1);
      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="global-background-canvas"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        opacity: mounted ? 1 : 0,
        transition: "opacity 2s ease",
      }}
    />
  );
}
