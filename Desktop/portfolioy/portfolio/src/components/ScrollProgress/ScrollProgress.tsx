"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / docHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${scrolled})`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={barRef} className={styles.bar} style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
