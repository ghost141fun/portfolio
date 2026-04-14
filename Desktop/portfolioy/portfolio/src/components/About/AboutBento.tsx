"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutBento.module.css";

const FEATURES = [
  { title: "Visual Storytelling", desc: "Crafting narratives through motion and 3D space.", size: "large" },
  { title: "Technical Precision", desc: "Expertise in WebGL, GSAP, and Next.js performance.", size: "small" },
  { title: "Infinite Motion", desc: "Fluid simulations and reactive particles.", size: "small" },
  { title: "Minimalist Philosophy", desc: "Stripping away the noise to find the essence of design.", size: "medium" },
];

export default function AboutBento() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const cards = sectionRef.current?.querySelectorAll(`.${styles.card}`);
      if (!cards) return;

      gsap.fromTo(cards, 
        { y: 60, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 1.2, 
          ease: "expo.out", 
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          }
        }
      );
    };
    init();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Crafting Digital<br /><span>Obsidian</span></h2>
          <p className={styles.subtitle}>
            A bento-grid exploration of form, function, and motion.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`${styles.card} ${styles[f.size]} glass`}>
              <div className={styles.cardHeader}>
                <span className={styles.num}>{(i + 1).toString().padStart(2, '0')}</span>
                <span className={styles.dot} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
              <div className={styles.glow} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
