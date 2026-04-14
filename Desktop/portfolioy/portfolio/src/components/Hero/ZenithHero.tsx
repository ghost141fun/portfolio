"use client";

import { useEffect, useRef } from "react";
import styles from "./ZenithHero.module.css";

export default function ZenithHero() {
  const containerRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const gsap = gsapMod.default;

      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(
        [title1Ref.current, title2Ref.current],
        { yPercent: 100, rotate: 10, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, duration: 1.8, ease: "expo.out", stagger: 0.15 }
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=1.2"
      );

      // Mouse parallax for text
      const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to([title1Ref.current, title2Ref.current], {
          x: xPos * 0.5,
          y: yPos * 0.5,
          duration: 1.5,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    };
    init();
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.meta} ref={subRef} style={{ opacity: 0 }}>
          <span>Creative Portfolio — 2024</span>
          <span className={styles.divider} />
          <span>Available for work</span>
        </div>

        <h1 className={styles.title}>
          <span className="revealText">
            <span ref={title1Ref} style={{ opacity: 0 }}>OBSIDIAN</span>
          </span>
          <br />
          <span className="revealText">
            <span ref={title2Ref} className={styles.outline} style={{ opacity: 0 }}>EXPERIENCE</span>
          </span>
        </h1>

        <div className={styles.bottom}>
          <p className={styles.desc}>
            Crafting high-end digital experiences at the intersection of motion, design, and code.
          </p>
          <div className={styles.scroll}>
            <div className={styles.scrollLine} />
            <span>Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}
