"use client";

import { useEffect, useRef } from "react";
import styles from "./ZenithHero.module.css";
import dynamic from "next/dynamic";

const Robot = dynamic(() => import("@/components/Robot/Robot"), { ssr: false });

export default function ZenithHero() {
  const containerRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const robotWrapRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const dataStreamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states via GSAP (not inline styles) so autoAlpha works cleanly
      gsap.set([title1Ref.current, title2Ref.current, subRef.current, robotWrapRef.current], { autoAlpha: 0 });
      gsap.set(gridRef.current, { scaleY: 0, autoAlpha: 0 });
      gsap.set(dataStreamRef.current, { autoAlpha: 0 });
      // Set starting transform values for entrance
      gsap.set(title1Ref.current, { yPercent: 120, rotate: 8, skewX: -6 });
      gsap.set(title2Ref.current, { yPercent: 140, rotate: -5, skewX: 4 });
      gsap.set(subRef.current, { y: 30, filter: "blur(6px)" });
      gsap.set(robotWrapRef.current, { x: 80, scale: 0.8 });

      // ── ENTRANCE TIMELINE ─────────────────────────────────
      const tl = gsap.timeline({ 
        delay: 0.3,
        onComplete: () => {
          // ── SCROLL PARALLAX (Enabled after entrance) ─────────
          // Using fromTo ensures that we always start from the "visible" state
          // after the entrance animation has landed.
          
          gsap.fromTo(title1Ref.current, 
            { yPercent: 0, autoAlpha: 1, scale: 1 },
            {
              yPercent: -35, autoAlpha: 0.2, scale: 0.93,
              ease: "none",
              scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
            }
          );

          gsap.fromTo(title2Ref.current, 
            { yPercent: 0, autoAlpha: 1, scale: 1 },
            {
              yPercent: -45, autoAlpha: 0.15, scale: 0.9,
              ease: "none",
              scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
            }
          );

          gsap.fromTo(subRef.current, 
            { y: 0, autoAlpha: 1, filter: "blur(0px)" },
            {
              yPercent: -20, autoAlpha: 0,
              ease: "none",
              scrollTrigger: { trigger: containerRef.current, start: "20% top", end: "70% top", scrub: true, invalidateOnRefresh: true },
            }
          );

          gsap.fromTo(robotWrapRef.current, 
            { y: 0, autoAlpha: 1, scale: 1 },
            {
              y: -80, autoAlpha: 0,
              ease: "none",
              scrollTrigger: { trigger: containerRef.current, start: "10% top", end: "60% top", scrub: true, invalidateOnRefresh: true },
            }
          );
        }
      });

      tl.to(gridRef.current, { scaleY: 1, autoAlpha: 1, duration: 1.2, ease: "expo.out" });
      tl.to(dataStreamRef.current, { autoAlpha: 1, duration: 0.6 }, "-=0.8");
      tl.to(
        title1Ref.current,
        { yPercent: 0, rotate: 0, autoAlpha: 1, skewX: 0, duration: 1.4, ease: "expo.out" },
        "-=0.5"
      );
      tl.to(glitchRef.current, { autoAlpha: 1, duration: 0.05 })
        .to(glitchRef.current, { autoAlpha: 0, duration: 0.05 })
        .to(glitchRef.current, { autoAlpha: 1, duration: 0.08, x: -3 })
        .to(glitchRef.current, { autoAlpha: 0, duration: 0.05, x: 0 });
      tl.to(
        title2Ref.current,
        { yPercent: 0, rotate: 0, autoAlpha: 1, skewX: 0, duration: 1.4, ease: "expo.out" },
        "-=1.0"
      );
      tl.to(
        subRef.current,
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out" },
        "-=0.9"
      );
      tl.to(
        robotWrapRef.current,
        { autoAlpha: 1, x: 0, scale: 1, duration: 1.2, ease: "back.out(1.2)" },
        "-=0.8"
      );

      // ── CONTINUOUS GLITCH EFFECT ───────────────────────────
      const glitch = () => {
        if (!title1Ref.current) return;
        const el = title1Ref.current;
        const randomX = (Math.random() - 0.5) * 8;
        const duration = 0.04 + Math.random() * 0.06;

        gsap.timeline()
          .to(el, { x: randomX, skewX: randomX * 0.8, filter: `hue-rotate(${Math.random() * 60}deg)`, duration })
          .to(el, { x: -randomX * 0.5, skewX: 0, filter: "hue-rotate(0deg)", duration })
          .to(el, { x: 0, duration: duration * 0.5 });

        // Schedule next glitch randomly
        setTimeout(glitch, 2000 + Math.random() * 5000);
      };
      setTimeout(glitch, 3000);

      // ── MOUSE PARALLAX ─────────────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 60;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;

        gsap.to(title1Ref.current, { x: xPos * 0.3, y: yPos * 0.2, duration: 2, ease: "power2.out" });
        gsap.to(title2Ref.current, { x: xPos * 0.5, y: yPos * 0.35, duration: 2, ease: "power2.out" });
        gsap.to(subRef.current, { x: xPos * 0.1, y: yPos * 0.1, duration: 2, ease: "power2.out" });
        gsap.to(robotWrapRef.current, { x: xPos * -0.08, y: yPos * -0.06, duration: 2.5, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMouseMove);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        // Clean up ScrollTriggers
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    };
    init();
  }, []);

  // ── Noise canvas animation ──────────────────────────────────
  useEffect(() => {
    const canvas = noiseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const draw = () => {
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      
      // Restore safety check for 0-sized canvas
      if (!w || !h) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 6;
      }
      ctx.putImageData(img, 0, 0);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Data stream text
  const DATA_CHARS = "01アイウエオカキクケコABCDEF01234GLITCH//NULL>_SYSTEM";
  const dataStreamItems = Array.from({ length: 12 }, (_, i) => ({
    x: 5 + i * 8.2,
    delay: i * 0.15,
    text: DATA_CHARS.slice(i * 4, i * 4 + 20),
  }));

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Animated noise grain canvas */}
      <canvas ref={noiseRef} className={styles.noise} aria-hidden="true" />

      {/* Grid lines */}
      <div ref={gridRef} className={styles.grid} aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v${i}`} className={styles.gridV} style={{ left: `${(i + 1) * 11.1}%` }} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`h${i}`} className={styles.gridH} style={{ top: `${(i + 1) * 16.6}%` }} />
        ))}
      </div>

      {/* Data streams (falling characters) */}
      <div ref={dataStreamRef} className={styles.dataStream} aria-hidden="true">
        {dataStreamItems.map((col, i) => (
          <div
            key={i}
            className={styles.dataCol}
            style={{
              left: `${col.x}%`,
              animationDelay: `${col.delay}s`,
              animationDuration: `${6 + (i % 4)}s`,
            }}
          >
            {col.text.split("").map((c, j) => (
              <span key={j} style={{ animationDelay: `${j * 0.08}s` }}>{c}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Horizontal scan line sweeping down */}
      <div ref={scanRef} className={styles.scanLine} aria-hidden="true" />

      {/* Gradient orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />

      {/* Glitch overlay */}
      <div ref={glitchRef} className={styles.glitchLayer} aria-hidden="true" />

      {/* Edge lines */}
      <div className={styles.lineL} aria-hidden="true" />
      <div className={styles.lineR} aria-hidden="true" />

      {/* ── CONTENT ── */}
      <div className={styles.inner}>
        {/* Meta row */}
        <div ref={subRef} className={`${styles.meta} ${styles.hiddenInit}`}>
          <span className={styles.metaDash} />
          <span>Creative Portfolio</span>
          <span className={styles.metaSep}>·</span>
          <span>2024</span>
          <span className={styles.metaSep}>·</span>
          <span className={styles.metaPulse}>●</span>
          <span>Available for work</span>
        </div>

        {/* Main title */}
        <h1 className={styles.title}>
          <span className={styles.clip}>
            <span ref={title1Ref} className={`${styles.word} ${styles.hiddenInit}`}>
              OBSIDIAN
            </span>
          </span>
          <br />
          <span className={styles.clip}>
            <span ref={title2Ref} className={`${styles.word} ${styles.wordOutline} ${styles.hiddenInit}`}>
              EXPERIENCE
            </span>
          </span>
        </h1>

        {/* Bottom row */}
        <div className={styles.bottom}>
          <p className={styles.desc}>
            Crafting high-end digital experiences at the intersection of<br />
            motion, design, and code.
          </p>
          <div className={styles.scroll}>
            <div className={styles.scrollBar} />
            <span>Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* ── ROBOT GUIDE ── */}
      <div ref={robotWrapRef} className={`${styles.robotZone} ${styles.hiddenInit}`}>
        <Robot />
      </div>

      {/* Corner markers */}
      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerTR} aria-hidden="true" />
      <div className={styles.cornerBL} aria-hidden="true" />

      {/* Year */}
      <div className={styles.year}>© 2024</div>
    </section>
  );
}