"use client";

import { useEffect, useRef } from "react";
import styles from "./ContactFooter.module.css";

export default function ContactFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const title = footerRef.current?.querySelector(`.${styles.title}`);
      if (!title) return;

      gsap.fromTo(title,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 1.5, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
          }
        }
      );
    };
    init();
  }, []);

  return (
    <footer ref={footerRef} id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Let's Build Something<br /><span>Irresistible</span></h2>
          <a href="mailto:hello@obsidian.noir" className={styles.email} data-cursor="hover">
            hello@obsidian.noir
          </a>
        </div>

        <div className={styles.bottom}>
          <div className={styles.column}>
            <span className={styles.label}>Social</span>
            <div className={styles.links}>
              <a href="#" className={styles.link} data-cursor="hover">Twitter</a>
              <a href="#" className={styles.link} data-cursor="hover">Instagram</a>
              <a href="#" className={styles.link} data-cursor="hover">Dribbble</a>
              <a href="#" className={styles.link} data-cursor="hover">GitHub</a>
            </div>
          </div>

          <div className={styles.column}>
            <span className={styles.label}>Location</span>
            <p className={styles.text}>Based in Earth — 00° N, 00° E</p>
          </div>

          <div className={styles.column}>
            <span className={styles.label}>Legal</span>
            <p className={styles.text}>© 2024 Obsidian Noir Portfolio</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
