"use client";

import { useEffect, useRef } from "react";
import styles from "./SectionDivider.module.css";

export default function SectionDivider() {
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const el = dividerRef.current!;
      const line = el.querySelector("[data-divider-line]");
      const glow = el.querySelector("[data-divider-glow]");

      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );

      if (glow) {
        gsap.fromTo(
          glow,
          { opacity: 0, scaleX: 0.3 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      }
    };

    init();
  }, []);

  return (
    <div ref={dividerRef} className={styles.divider}>
      <div data-divider-glow className={styles.glow} />
      <div data-divider-line className={styles.line} />
    </div>
  );
}
