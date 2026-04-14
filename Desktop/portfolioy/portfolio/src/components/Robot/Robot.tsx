"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";

/**
 * Robot — A stylized 3D companion that follows the cursor.
 * Built with Three.js primitives for lightweight, dependency-free rendering.
 */
export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let animId: number;
    let renderer: THREE.WebGLRenderer, 
        scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera;
    
    let head: THREE.Group, 
        body: THREE.Mesh, 
        leftEye: THREE.Mesh, 
        rightEye: THREE.Mesh,
        chestLight: THREE.PointLight;

    const init = async () => {
      const canvas = canvasRef.current!;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 15;

      // --- Materials ---
      const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        roughness: 0.1, 
        metalness: 0.9 
      });
      const accentMat = new THREE.MeshStandardMaterial({ 
        color: 0xd4ff1e, 
        emissive: 0xd4ff1e, 
        emissiveIntensity: 2 
      });

      // --- Body ---
      const bodyGeo = new THREE.BoxGeometry(3, 4, 2);
      body = new THREE.Mesh(bodyGeo, metalMat);
      body.position.y = -2;
      scene.add(body);

      // Chest Light
      const lightGeo = new THREE.CircleGeometry(0.4, 32);
      const lightMesh = new THREE.Mesh(lightGeo, accentMat);
      lightMesh.position.set(0, 0, 1.01);
      body.add(lightMesh);
      
      chestLight = new THREE.PointLight(0xd4ff1e, 10, 10);
      chestLight.position.set(0, 0, 1.5);
      body.add(chestLight);

      // --- Head ---
      head = new THREE.Group();
      head.position.y = 1.5;
      scene.add(head);

      const headGeo = new THREE.BoxGeometry(2.5, 1.8, 1.8);
      const headMesh = new THREE.Mesh(headGeo, metalMat);
      head.add(headMesh);

      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.25, 32, 32);
      leftEye = new THREE.Mesh(eyeGeo, accentMat);
      leftEye.position.set(-0.6, 0.2, 0.8);
      head.add(leftEye);

      rightEye = new THREE.Mesh(eyeGeo, accentMat);
      rightEye.position.set(0.6, 0.2, 0.8);
      head.add(rightEye);

      // Antenna
      const antBase = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
      const antMesh = new THREE.Mesh(antBase, metalMat);
      antMesh.position.y = 1.2;
      head.add(antMesh);

      const antTip = new THREE.SphereGeometry(0.12);
      const antTipMesh = new THREE.Mesh(antTip, accentMat);
      antTipMesh.position.y = 1.6;
      head.add(antTipMesh);

      // --- Lighting ---
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      const spot = new THREE.SpotLight(0xffffff, 100);
      spot.position.set(5, 5, 5);
      scene.add(spot);

      // --- Animation Loop ---
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Target rotation for head based on mouse
        const targetRotX = mouse.current.y * 0.4;
        const targetRotY = mouse.current.x * 0.6;

        head.rotation.x += (targetRotX - head.rotation.x) * 0.1;
        head.rotation.y += (targetRotY - head.rotation.y) * 0.1;

        // Floating movement
        const floatY = Math.sin(t * 1.5) * 0.2;
        body.position.y = -2 + floatY;
        head.position.y = 1.5 + floatY;

        // Blinking
        if (Math.sin(t * 0.8) > 0.98) {
          leftEye.scale.y = 0.1;
          rightEye.scale.y = 0.1;
        } else {
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }

        // Chest light pulse
        chestLight.intensity = 5 + Math.sin(t * 3) * 5;

        renderer.render(scene, camera);
      };

      animate();

      const onMouseMove = (e: MouseEvent) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener("resize", onResize);
    };

    init();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  return (
    <div 
      style={{ width: "100%", height: "100%", cursor: "pointer" }}
      onClick={() => setClicked(true)}
      onAnimationEnd={() => setClicked(false)}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
