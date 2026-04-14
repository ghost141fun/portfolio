"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSensory } from "@/contexts/SensoryContext";
import styles from "./Hero.module.css";
import ParticleField from "./ParticleField";
import CyberCore from "./CyberCore";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const { features, headPos, audio } = useSensory();

  // Head tracking parallax — moves the inner content opposite to head direction
  useEffect(() => {
    if (!features.headTracking || !innerRef.current) return;
    const el = innerRef.current;
    const x = headPos.x * 25;
    const y = headPos.y * 15;
    el.style.transform = `translate(${x}px, ${y}px)`;

    // Move orbs in opposite direction for depth
    if (orbRef.current) {
      orbRef.current.style.transform = `translate(${-x * 1.5}px, ${-y * 1.5}px)`;
    }
    if (orb2Ref.current) {
      orb2Ref.current.style.transform = `translate(${-x * 0.8}px, ${-y * 0.8}px)`;
    }
  }, [headPos, features.headTracking]);

  // Audio reactive — pulse orbs and vibrate elements based on audio level
  useEffect(() => {
    if (!features.audioReactive) return;

    // Pulse orb size based on bass
    if (orbRef.current) {
      const scale = 1 + audio.bass * 1.5;
      orbRef.current.style.width = `${350 * scale}px`;
      orbRef.current.style.height = `${350 * scale}px`;
      orbRef.current.style.opacity = `${0.5 + audio.bass * 0.5}`;
    }

    // Vibrate headline on loud sounds
    if (headlineRef.current && audio.level > 0.4) {
      const jitter = (audio.level - 0.4) * 8;
      headlineRef.current.style.transform = `translate(${
        (Math.random() - 0.5) * jitter
      }px, ${(Math.random() - 0.5) * jitter}px)`;
    } else if (headlineRef.current) {
      headlineRef.current.style.transform = "";
    }
  }, [audio, features.audioReactive]);

  // --- Erosion Mode: Make headline letters draggable & destructible ---
  const setupErosion = useCallback(() => {
    if (!features.erosion || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll("[data-word]");
    words.forEach((wordEl) => {
      const text = wordEl.textContent || "";
      // Wrap each char in a draggable span
      wordEl.innerHTML = text
        .split("")
        .map(
          (char, i) =>
            `<span data-erosion-char style="display:inline-block;cursor:grab;transition:transform 0.1s;position:relative">${char}</span>`
        )
        .join("");

      // Attach drag events to each char
      wordEl
        .querySelectorAll("[data-erosion-char]")
        .forEach((charEl) => {
          let isDragging = false;
          let startX = 0,
            startY = 0;
          let offsetX = 0,
            offsetY = 0;
          const el = charEl as HTMLElement;
          const origRect = el.getBoundingClientRect();

          el.addEventListener("mousedown", (e: any) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = 0;
            offsetY = 0;
            el.style.zIndex = "100";
            el.style.cursor = "grabbing";
            el.style.transition = "none";
            e.preventDefault();
          });

          const onMove = (e: MouseEvent) => {
            if (!isDragging) return;
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            el.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.15}deg)`;
          };

          const onUp = () => {
            if (!isDragging) return;
            isDragging = false;
            const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (dist > 80) {
              // ERODE: destroy the letter
              el.style.transition =
                "transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease";
              el.style.transform = `translate(${offsetX * 2}px, ${
                offsetY * 2
              }px) rotate(${offsetX * 0.5}deg) scale(0.1)`;
              el.style.opacity = "0";
              el.style.filter = "blur(8px)";

              // Spawn dust particles at the char position
              spawnErosionParticles(
                startX + offsetX,
                startY + offsetY
              );

              setTimeout(() => {
                el.style.display = "none";
              }, 600);
            } else {
              // Spring back
              el.style.transition =
                "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
              el.style.transform = "translate(0, 0) rotate(0deg)";
              el.style.cursor = "grab";
              el.style.zIndex = "1";
            }
          };

          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });
    });
  }, [features.erosion]);

  useEffect(() => {
    // Short delay to let GSAP animations finish
    const timer = setTimeout(setupErosion, 3000);
    return () => clearTimeout(timer);
  }, [setupErosion]);

  // Spawn erosion dust particles
  const spawnErosionParticles = (x: number, y: number) => {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        opacity: 1;
        transition: all ${0.4 + Math.random() * 0.6}s ease-out;
      `;
      document.body.appendChild(p);

      requestAnimationFrame(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 80;
        p.style.transform = `translate(${Math.cos(angle) * dist}px, ${
          Math.sin(angle) * dist
        }px)`;
        p.style.opacity = "0";
        p.style.width = "1px";
        p.style.height = "1px";
      });

      setTimeout(() => p.remove(), 1200);
    }
  };

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({ delay: 0.2 });
      const headline = headlineRef.current!;
      const words = headline.querySelectorAll("[data-word]");

      tl.fromTo(
        words,
        { yPercent: 140, rotate: 6, opacity: 0, scale: 0.9 },
        { yPercent: 0, rotate: 0, opacity: 1, scale: 1, duration: 1.6, ease: "power4.out", stagger: 0.12 }
      )
        .fromTo(subRef.current, { opacity: 0, y: 40, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }, "-=1.0")
        .fromTo(metaRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, "-=1.2")
        .fromTo(marqueeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .fromTo(scrollHintRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 }, "-=1.5");

      // Animate CyberCore entry
      gsap.fromTo("#cyber-core", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "expo.out" }, "-=2");

      // Scroll parallax
      gsap.to(bgRef.current, { scale: 1.15, opacity: 0.15, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 } });
      gsap.to(headline, { yPercent: -40, scale: 0.92, opacity: 0.3, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.2 } });
      gsap.to(subRef.current, { yPercent: -30, opacity: 0, filter: "blur(4px)", ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "15% top", end: "60% top", scrub: 1 } });
      gsap.to(metaRef.current, { x: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "20% top", end: "60% top", scrub: 1 } });
      gsap.to(gridRef.current, { yPercent: -15, opacity: 0, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(marqueeRef.current?.querySelector("[data-marquee-track]"), { x: "-=200", ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.5 } });
    };
    init();
  }, []);

  const scrollToWork = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const MARQUEE_ITEMS = ["WEBGL", "THREE.JS", "GSAP", "REACT", "NEXT.JS", "TYPESCRIPT", "GLSL", "MOTION DESIGN", "CREATIVE DIRECTION", "NODE.JS", "BLENDER", "FIGMA", "SHADERS", "R3F"];

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
      <div ref={bgRef} className={styles.bgImage}>
        <img src="/images/hero/bg.png" alt="" aria-hidden="true" className={styles.bgImg} />
      </div>
      <div className={styles.gradientMesh} aria-hidden="true" />
      <div ref={gridRef} className={styles.gridLines} aria-hidden="true" style={{ opacity: 0 }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={`v${i}`} className={styles.gridLineV} style={{ left: `${(i + 1) * 16.66}%` }} />)}
        {Array.from({ length: 4 }).map((_, i) => <div key={`h${i}`} className={styles.gridLineH} style={{ top: `${(i + 1) * 25}%` }} />)}
      </div>
      <ParticleField />
      <div id="cyber-core" style={{ opacity: 0 }}>
        <CyberCore />
      </div>
      <div ref={orbRef} className={styles.orb} aria-hidden="true" />
      <div ref={orb2Ref} className={styles.orb2} aria-hidden="true" />
      <div className={styles.lineLeft} aria-hidden="true" />
      <div className={styles.lineRight} aria-hidden="true" />

      <div ref={innerRef} className={styles.inner} style={{ transition: "transform 0.15s ease-out" }}>
        <div ref={metaRef} className={styles.meta} style={{ opacity: 0 }}>
          <span className={styles.metaLine} />
          <span>Creative Developer</span>
          <span className={styles.sep}>·</span>
          <span>WebGL / Motion</span>
          <span className={styles.sep}>·</span>
          <span className={styles.metaPulse}>●</span>
          <span>Open to work</span>
        </div>

        <h1 ref={headlineRef} className={styles.headline}>
          {[
            { text: "CRAFTING", italic: false },
            { text: "DIGITAL", italic: true },
            { text: "WORLDS", italic: false },
            { text: "IN CODE", italic: false },
          ].map((w, i) => (
            <span key={i} className={styles.wordClip}>
              <span data-word className={`${styles.word} ${w.italic ? styles.wordItalic : ""}`} style={{ display: "inline-block", opacity: 0 }}>
                {w.text}
              </span>
            </span>
          ))}
        </h1>

        {/* Erosion hint */}
        {features.erosion && (
          <div className={styles.erosionHint}>
            <span className={styles.erosionPulse}>⚡</span>
            Drag letters to erode them
          </div>
        )}

        <div className={styles.bottom}>
          <p ref={subRef} className={styles.sub} style={{ opacity: 0 }}>
            I build immersive digital experiences at the<br />
            intersection of design, technology, and art.
          </p>
          <div className={styles.cta}>
            <button className={styles.ctaBtn} onClick={scrollToWork} data-cursor="hover">
              <span className={styles.ctaBtnInner}>
                <span>View Selected Work</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div ref={marqueeRef} className={styles.marqueeStrip} style={{ opacity: 0 }} aria-hidden="true">
        <div data-marquee-track className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item}<span className={styles.marqueeDot} /></span>
          ))}
        </div>
      </div>

      <div ref={scrollHintRef} className={styles.scrollHint} style={{ opacity: 0 }}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
      <div className={styles.yearMarker}>© 2024</div>
    </section>
  );
}
