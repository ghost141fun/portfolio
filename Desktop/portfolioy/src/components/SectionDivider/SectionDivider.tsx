"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SectionDivider.module.css";

export default function SectionDivider() {
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = dividerRef.current!;
    const line = el.querySelector("[data-divider-line]");
    const glow = el.querySelector("[data-divider-glow]");
    const pulse = el.querySelector("[data-divider-pulse]");
    const particles = el.querySelectorAll("[data-divider-particle]");

    // Line draw
    gsap.fromTo(line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );

    // Glow expand
    if (glow) {
      gsap.fromTo(glow,
        { opacity: 0, scaleX: 0.3 },
        { opacity: 1, scaleX: 1, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    }

    // Pulse travel along line (repeating)
    if (pulse) {
      gsap.fromTo(pulse,
        { left: "0%", opacity: 0 },
        { left: "100%", opacity: 1, duration: 3, ease: "power1.inOut",
          repeat: -1, repeatDelay: 1,
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    }

    // Particles scatter from center
    if (particles.length) {
      gsap.fromTo(particles,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)",
          stagger: { each: 0.05, from: "center" },
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    }
  }, []);

  return (
    <div ref={dividerRef} className={styles.divider}>
      {/* Scattered particles along the line */}
      <div className={styles.particleRow} aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} data-divider-particle className={styles.lineParticle}
            style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Main glow */}
      <div data-divider-glow className={styles.glow} />

      {/* Main line */}
      <div data-divider-line className={styles.line} />

      {/* Traveling pulse */}
      <div data-divider-pulse className={styles.pulse} />

      {/* Edge markers */}
      <div className={styles.edgeL}>◄</div>
      <div className={styles.edgeR}>►</div>
    </div>
  );
}
