"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

const TRAIL_COUNT = 6;

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterLink = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!target || typeof (target as Element).closest !== "function") return;
      const el = (target as Element).closest("[data-cursor]");
      if (!el) return;
      const type = el.getAttribute("data-cursor") || "hover";
      dot.setAttribute("data-state", type);
      ring.setAttribute("data-state", type);
      if (type === "view") {
        label.textContent = "VIEW";
        label.style.opacity = "1";
      }
    };

    const onLeaveLink = () => {
      dot.setAttribute("data-state", "");
      ring.setAttribute("data-state", "");
      label.style.opacity = "0";
    };

    // Smooth ring follow + trail
    const animate = () => {
      const speed = 0.1;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * speed;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * speed;

      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;

      // Trail effect — each follows the one before it
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const target = i === 0 ? pos.current : trailPositions.current[i - 1];
        const trailSpeed = 0.15 - i * 0.015;
        trailPositions.current[i].x += (target.x - trailPositions.current[i].x) * trailSpeed;
        trailPositions.current[i].y += (target.y - trailPositions.current[i].y) * trailSpeed;
        if (trailRefs.current[i]) {
          trailRefs.current[i].style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px) translate(-50%, -50%)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnterLink, true);
    document.addEventListener("mouseleave", onLeaveLink, true);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnterLink, true);
      document.removeEventListener("mouseleave", onLeaveLink, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className={styles.trail}
          style={{ opacity: 0.15 - i * 0.02, width: `${3 - i * 0.3}px`, height: `${3 - i * 0.3}px` }}
          aria-hidden="true"
        />
      ))}
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={labelRef} className={styles.label} aria-hidden="true">VIEW</div>
    </>
  );
}
