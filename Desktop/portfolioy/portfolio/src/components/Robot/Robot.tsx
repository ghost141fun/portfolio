"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./Robot.module.css";

const MESSAGES = [
  { text: "HELLO — I'M UNIT-RG", sub: "Your digital guide through this portfolio" },
  { text: "SCROLL DOWN ↓", sub: "Explore selected works & case studies" },
  { text: "CRAFTED WITH CODE", sub: "WebGL · Three.js · GSAP · Next.js" },
  { text: "LET'S BUILD TOGETHER", sub: "Click Contact to start a project" },
];

export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [msgIdx, setMsgIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % MESSAGES.length);
        setShowBubble(true);
      }, 400);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let animId: number;
    let renderer: any, scene: any, camera: any;
    let head: any, bodyGroup: any, leftEye: any, rightEye: any;
    let leftArm: any, rightArm: any;
    let chestRing: any, chestCore: any, chestPointLight: any;
    let leftLeg: any, rightLeg: any;
    let antennaTip: any;

    const init = () => {
      const canvas = canvasRef.current!;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.shadowMap.enabled = true;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(36, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.set(0, 0.5, 18);

      const metal = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.15, metalness: 0.95 });
      const metalDark = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.2, metalness: 0.9 });
      const accentMat = new THREE.MeshStandardMaterial({ color: 0xd4ff1e, emissive: 0xd4ff1e, emissiveIntensity: 3, roughness: 0.3 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0xd4ff1e, emissive: 0xd4ff1e, emissiveIntensity: 8, roughness: 0 });
      const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 });

      bodyGroup = new THREE.Group();
      bodyGroup.position.y = -1.8;
      scene.add(bodyGroup);

      const torsoGeo = new THREE.BoxGeometry(2.8, 3.8, 1.6);
      const bodyMesh = new THREE.Mesh(torsoGeo, metal);
      bodyMesh.castShadow = true;
      bodyGroup.add(bodyMesh);

      const chestPanelGeo = new THREE.BoxGeometry(1.8, 2.0, 0.1);
      const chestPanel = new THREE.Mesh(chestPanelGeo, panelMat);
      chestPanel.position.set(0, 0.2, 0.85);
      bodyGroup.add(chestPanel);

      const ringGeo = new THREE.TorusGeometry(0.45, 0.06, 16, 64);
      chestRing = new THREE.Mesh(ringGeo, accentMat);
      chestRing.position.set(0, 0.3, 0.92);
      bodyGroup.add(chestRing);

      const coreGeo = new THREE.SphereGeometry(0.28, 32, 32);
      chestCore = new THREE.Mesh(coreGeo, eyeMat);
      chestCore.position.set(0, 0.3, 0.92);
      bodyGroup.add(chestCore);

      const shoulGeo = new THREE.BoxGeometry(0.5, 0.6, 1.8);
      const lShoulder = new THREE.Mesh(shoulGeo, metalDark);
      lShoulder.position.set(-1.65, 1.4, 0);
      bodyGroup.add(lShoulder);
      const rShoulder = lShoulder.clone();
      rShoulder.position.set(1.65, 1.4, 0);
      bodyGroup.add(rShoulder);

      for (let i = 0; i < 4; i++) {
        const ventGeo = new THREE.BoxGeometry(0.05, 0.3, 1.62);
        const vent = new THREE.Mesh(ventGeo, accentMat);
        vent.position.set(-1.42, -0.4 + i * 0.25, 0);
        bodyGroup.add(vent);
        const ventR = vent.clone();
        ventR.position.x = 1.42;
        bodyGroup.add(ventR);
      }

      const makeArm = (side: number) => {
        const armGroup = new THREE.Group();
        armGroup.position.set(side * 2.0, 0.8, 0);
        bodyGroup.add(armGroup);
        const upper = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.8, 0.65), metal);
        upper.position.y = -0.9;
        armGroup.add(upper);
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), metalDark);
        elbow.position.y = -1.8;
        armGroup.add(elbow);
        const forearmGroup = new THREE.Group();
        forearmGroup.position.y = -1.8;
        armGroup.add(forearmGroup);
        const lower = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.6, 0.55), metal);
        lower.position.y = -0.8;
        forearmGroup.add(lower);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), metalDark);
        hand.position.y = -1.65;
        forearmGroup.add(hand);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.57, 0.08, 0.57), accentMat);
        stripe.position.y = -0.4;
        forearmGroup.add(stripe);
        return { armGroup, forearmGroup };
      };

      const la = makeArm(-1);
      const ra = makeArm(1);
      leftArm = la;
      rightArm = ra;

      const makeLeg = (side: number) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 0.85, -1.9, 0);
        bodyGroup.add(legGroup);
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.6, 0.75), metal);
        thigh.position.y = -0.8;
        legGroup.add(thigh);
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), metalDark);
        knee.position.y = -1.6;
        legGroup.add(knee);
        const shin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.4, 0.65), metal);
        shin.position.y = -2.4;
        legGroup.add(shin);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 1.1), metalDark);
        foot.position.set(0, -3.25, 0.1);
        legGroup.add(foot);
        return legGroup;
      };

      leftLeg = makeLeg(-1);
      rightLeg = makeLeg(1);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.6, 12), metalDark);
      neck.position.y = 1.9;
      bodyGroup.add(neck);

      const headGroup = new THREE.Group();
      headGroup.position.y = 0.3;
      scene.add(headGroup);
      head = headGroup;

      headGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.8), metal));

      const visorMat = new THREE.MeshStandardMaterial({ color: 0x1a2a00, emissive: 0x223300, emissiveIntensity: 1, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.85 });
      const visor = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 0.12), visorMat);
      visor.position.set(0, 0.15, 0.92);
      headGroup.add(visor);

      leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), eyeMat);
      leftEye.position.set(-0.5, 0.15, 0.91);
      headGroup.add(leftEye);
      rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), eyeMat);
      rightEye.position.set(0.5, 0.15, 0.91);
      headGroup.add(rightEye);

      const eyeRingGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 32);
      const leftEyeRing = new THREE.Mesh(eyeRingGeo, accentMat);
      leftEyeRing.position.set(-0.5, 0.15, 0.88);
      headGroup.add(leftEyeRing);
      const rightEyeRing = leftEyeRing.clone();
      rightEyeRing.position.set(0.5, 0.15, 0.88);
      headGroup.add(rightEyeRing);

      const mouth = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.12), accentMat);
      mouth.position.set(0, -0.42, 0.92);
      headGroup.add(mouth);

      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.8), metalDark);
      earL.position.set(-1.27, 0, 0.1);
      headGroup.add(earL);
      const earR = earL.clone();
      earR.position.set(1.27, 0, 0.1);
      headGroup.add(earR);

      const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.0, 8), metalDark);
      antBase.position.y = 1.4;
      headGroup.add(antBase);
      antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), eyeMat.clone());
      antennaTip.position.y = 1.95;
      headGroup.add(antennaTip);

      scene.add(new THREE.AmbientLight(0x111111, 2));
      const mainLight = new THREE.DirectionalLight(0xffffff, 8);
      mainLight.position.set(5, 10, 8);
      scene.add(mainLight);
      const rimLight = new THREE.DirectionalLight(0xd4ff1e, 4);
      rimLight.position.set(-6, 2, -4);
      scene.add(rimLight);
      
      // Fix for fill light addition
      const fillLight = new THREE.PointLight(0x0033ff, 2, 30);
      fillLight.position.set(0, -5, 6);
      scene.add(fillLight);

      chestPointLight = new THREE.PointLight(0xd4ff1e, 15, 8);
      chestPointLight.position.set(0, -0.5, 1.5);
      bodyGroup.add(chestPointLight);

      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const mx = mouse.current.x;
        const my = mouse.current.y;

        head.rotation.y += (mx * 0.6 - head.rotation.y) * 0.08;
        head.rotation.x += (-my * 0.35 - head.rotation.x) * 0.08;
        bodyGroup.rotation.y += (mx * 0.12 - bodyGroup.rotation.y) * 0.04;

        const bob = Math.sin(t * 1.8) * 0.18;
        bodyGroup.position.y = -1.8 + bob;
        head.position.y = 0.3 + bob;

        leftArm.armGroup.rotation.z = 0.2 + Math.sin(t * 1.2) * 0.08;
        rightArm.armGroup.rotation.z = -(0.2 + Math.sin(t * 1.2 + Math.PI) * 0.08);
        leftArm.forearmGroup.rotation.x = 0.1 + Math.sin(t * 0.9) * 0.06;
        rightArm.forearmGroup.rotation.x = 0.1 + Math.sin(t * 0.9 + 1) * 0.06;

        if (Math.sin(t * 0.3) > 0.6) {
          rightArm.armGroup.rotation.z = THREE.MathUtils.lerp(rightArm.armGroup.rotation.z, -1.1, 0.04);
          rightArm.forearmGroup.rotation.x = THREE.MathUtils.lerp(rightArm.forearmGroup.rotation.x, -0.4, 0.04);
        }

        leftLeg.rotation.x = Math.sin(t * 0.8) * 0.04;
        rightLeg.rotation.x = -Math.sin(t * 0.8) * 0.04;

        const blinkVal = Math.sin(t * 0.9);
        if (blinkVal > 0.97) {
          leftEye.scale.y = 0.05;
          rightEye.scale.y = 0.05;
        } else {
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }

        leftEye.position.x = -0.5 + Math.sin(t * 2.1) * 0.04;
        rightEye.position.x = 0.5 + Math.sin(t * 2.1) * 0.04;

        const pulse = 1 + Math.sin(t * 4) * 0.12;
        chestRing.scale.setScalar(pulse);
        chestCore.scale.setScalar(0.8 + Math.sin(t * 5) * 0.2);
        chestPointLight.intensity = 10 + Math.sin(t * 4) * 8;
        antennaTip.material.emissiveIntensity = 4 + Math.sin(t * 6) * 3;

        renderer.render(scene, camera);
      };
      animate();

      const onMouseMove = (e: MouseEvent) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        const c = canvasRef.current!;
        if (!c) return;
        camera.aspect = c.clientWidth / c.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(c.clientWidth, c.clientHeight);
      };
      window.addEventListener("resize", onResize);
    };

    init();
    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  const msg = MESSAGES[msgIdx];

  return (
    <div
      ref={containerRef}
      className={`${styles.robotWrapper} ${hovered ? styles.hovered : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`${styles.bubble} ${showBubble ? styles.bubbleVisible : ""}`}>
        <div className={styles.bubbleText}>{msg.text}</div>
        <div className={styles.bubbleSub}>{msg.sub}</div>
        <div className={styles.bubbleTail} />
      </div>

      <div className={styles.scanLines} aria-hidden="true" />
      <div className={styles.hudRing} aria-hidden="true" />
      <div className={styles.hudRing2} aria-hidden="true" />

      <div className={styles.corner} data-pos="tl" />
      <div className={styles.corner} data-pos="tr" />
      <div className={styles.corner} data-pos="bl" />
      <div className={styles.corner} data-pos="br" />

      <div className={styles.statusBar}>
        <span className={styles.statusDot} />
        <span>UNIT-RG ONLINE</span>
      </div>

      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
