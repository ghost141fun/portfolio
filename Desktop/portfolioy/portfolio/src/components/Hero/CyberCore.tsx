"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uAudioLevel;
  uniform float uBass;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  // Simple Noise function
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
    vNormal = normal;
    vPosition = position;
    
    // Displacement based on noise + audio
    float noise = snoise(position * 0.5 + uTime * 0.2);
    vNoise = noise;
    
    float pulse = 1.0 + uBass * 1.5;
    vec3 newPos = position + normal * noise * (0.8 + uAudioLevel * 3.0) * pulse;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uAudioLevel;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  void main() {
    // Fresnel effect
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
    
    // Core color
    vec3 color = uColor;
    
    // Add glow based on noise and audio
    float glow = (vNoise * 0.5 + 0.5) * (0.2 + uAudioLevel * 0.8);
    color += uColor * glow * 2.0;
    
    // Final alpha based on fresnel and general brightness
    float alpha = 0.3 + fresnel * 0.7 + uAudioLevel * 0.5;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function CyberCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
    let core: THREE.Mesh, outer: THREE.Mesh;

    const init = () => {
      
      const canvas = canvasRef.current!;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 12;

      const geometry = new THREE.IcosahedronGeometry(3, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xd4ff1e) },
          uAudioLevel: { value: 0 },
          uBass: { value: 0 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        wireframe: false,
        side: THREE.DoubleSide,
      });

      core = new THREE.Mesh(geometry, material);
      scene.add(core);

      // Outer wireframe shell
      const outerGeo = new THREE.IcosahedronGeometry(3.1, 8);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xd4ff1e,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      outer = new THREE.Mesh(outerGeo, outerMat);
      scene.add(outer);

      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const audio = window.__sensoryAudio || { level: 0, bass: 0, mid: 0, high: 0 };

        material.uniforms.uTime.value = t;
        material.uniforms.uAudioLevel.value = audio.level;
        material.uniforms.uBass.value = audio.bass;

        core.rotation.y = t * 0.2;
        core.rotation.z = t * 0.15;
        
        outer.rotation.y = -t * 0.3;
        outer.rotation.x = t * 0.1;
        outer.scale.setScalar(1 + audio.level * 0.5);

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener("resize", handleResize);
    };

    init();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 2 }}>
      <canvas
        ref={canvasRef}
        style={{ width: "800px", height: "800px", opacity: 0.8 }}
      />
    </div>
  );
}
