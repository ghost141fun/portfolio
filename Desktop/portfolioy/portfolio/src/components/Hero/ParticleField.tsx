"use client";

import { useEffect, useRef } from "react";

// We'll read audio data from a global variable set by the sensory context
// to avoid complex context integration inside a canvas component
declare global {
  interface Window {
    __sensoryAudio?: { level: number; bass: number; mid: number; high: number };
    __sensoryHead?: { x: number; y: number };
  }
}

const VERT = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uAudioLevel;
  uniform float uBass;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  varying float vAlpha;
  varying float vDist;

  // Modulo 289
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 pos = position;

    // Curl-like movement using Simplex noise
    float scale = 0.15;
    float t = uTime * aSpeed * 0.4;
    float n1 = snoise(vec3(pos.x * scale, pos.y * scale, t));
    float n2 = snoise(vec3(pos.y * scale, pos.z * scale, t + 100.0));
    float n3 = snoise(vec3(pos.z * scale, pos.x * scale, t + 200.0));

    float audioFactor = (1.0 + uAudioLevel * 5.0) * (1.0 + uBass * 3.0);
    pos += vec3(n1, n2, n3) * 2.5 * audioFactor;

    // Mouse repulsion (stronger)
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec4 projected = projectionMatrix * mvPos;
    vec2 ndc = (projected.xy / projected.w);
    float dist = length(ndc - uMouse);
    float repulse = smoothstep(uMouseRadius * (1.0 + uAudioLevel), 0.0, dist);
    
    pos += normalize(pos) * repulse * 6.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (450.0 / -mvPosition.z) * (1.0 + repulse * 3.0 + uAudioLevel * 2.0);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 0.2 + repulse * 0.8 + uAudioLevel * 0.5;
    vDist = dist;
  }
`;

const FRAG = `
  uniform vec3 uColor;
  uniform float uAudioLevel;
  varying float vAlpha;
  varying float vDist;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    
    // Softer, more "cinematic" particle
    float core = smoothstep(0.5, 0.0, d);
    float bloom = pow(smoothstep(0.5, 0.0, d), 2.0) * (1.5 + uAudioLevel * 2.0);
    
    float alpha = (core * 0.2 + bloom * 0.8) * vAlpha;
    
    // Shift color based on audio level/intensity
    vec3 col = uColor;
    col += vec3(uAudioLevel * 0.2, uAudioLevel * 0.1, 0.0);
    
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let renderer: any, scene: any, camera: any;
    const mouse = { x: 0, y: 0 };
    const materials: any[] = [];

    const init = async () => {
      const THREE = await import("three");
      const canvas = canvasRef.current!;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 20;

      const COUNT = 2500;
      const positions = new Float32Array(COUNT * 3);
      const sizes = new Float32Array(COUNT);
      const speeds = new Float32Array(COUNT);
      const offsets = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 6 + Math.random() * 12;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
        sizes[i] = 0.4 + Math.random() * 1.8;
        speeds[i] = 0.15 + Math.random() * 0.45;
        offsets[i] = Math.random() * Math.PI * 2;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
      geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

      const createLayer = (color: number, scale: number, rotY: number) => {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uMouseRadius: { value: 0.4 },
            uColor: { value: new THREE.Color(color) },
            uAudioLevel: { value: 0 },
            uBass: { value: 0 },
          },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        materials.push(mat);
        const points = new THREE.Points(geo.clone(), mat);
        points.rotation.y = rotY;
        points.scale.setScalar(scale);
        scene.add(points);
        return points;
      };

      const p1 = createLayer(0xd4ff1e, 1, 0);
      const p2 = createLayer(0xeeeeff, 0.55, Math.PI / 3);
      const p3 = createLayer(0xff9944, 0.35, -Math.PI / 4);

      const onMouse = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        materials.forEach((m) => m.uniforms.uMouse.value.set(mouse.x, mouse.y));
      };
      window.addEventListener("mousemove", onMouse);

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Read audio from global (set by Hero via sensory context)
        const audioLevel = window.__sensoryAudio?.level || 0;
        const bass = window.__sensoryAudio?.bass || 0;

        // Read head position
        const headX = window.__sensoryHead?.x || 0;
        const headY = window.__sensoryHead?.y || 0;

        materials.forEach((m) => {
          m.uniforms.uTime.value = t;
          m.uniforms.uAudioLevel.value = audioLevel;
          m.uniforms.uBass.value = bass;
        });

        // Head tracking rotates camera slightly
        camera.position.x = headX * 3;
        camera.position.y = headY * 2;
        camera.lookAt(0, 0, 0);

        p1.rotation.y = t * 0.015 + audioLevel * 0.5;
        p2.rotation.y = t * -0.012 + Math.PI / 3;
        p3.rotation.y = t * 0.008 - Math.PI / 4;

        renderer.render(scene, camera);
      };
      animate();
    };

    init();
    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}
