"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Loader.module.css";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBotRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("loading");

    const runLoader = () => {

      const counter = counterRef.current!;
      const bar = barRef.current!;
      const loader = loaderRef.current!;
      const top = overlayTopRef.current!;
      const bot = overlayBotRef.current!;
      const name = nameRef.current!;
      const tagline = taglineRef.current!;

      // Intro: reveal name chars
      const nameChars = name.querySelectorAll("[data-char]");
      const tagChars = tagline.querySelectorAll("[data-char]");

      gsap.set(nameChars, { yPercent: 110, opacity: 0 });
      gsap.set(tagChars, { yPercent: 100, opacity: 0 });

      const intro = gsap.timeline();
      intro
        .to(nameChars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.04,
        })
        .to(
          tagChars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.02,
          },
          "-=0.3"
        );

      // Count up 0 → 100 over 2.2s
      const obj = { val: 0 };
      const tl = gsap.timeline({
        delay: 0.8,
        onComplete: () => {
          // Dramatic exit
          const exit = gsap.timeline({
            onComplete: () => {
              loader.style.display = "none";
              document.body.classList.remove("loading");
              onComplete();
            },
          });
          exit
            .to(bar, {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.5,
              ease: "power3.inOut",
            })
            .to(
              counter.parentElement!,
              { opacity: 0, y: -20, duration: 0.3 },
              "-=0.3"
            )
            .to(name, { opacity: 0, y: -10, duration: 0.3 }, "-=0.2")
            .to(tagline, { opacity: 0, y: -10, duration: 0.2 }, "-=0.2")
            .to(
              top,
              { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
              "-=0.1"
            )
            .to(
              bot,
              { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
              "<"
            );
        },
      });

      tl.to(obj, {
        val: 100,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(obj.val);
          counter.textContent = String(v).padStart(3, "0");
          bar.style.transform = `scaleX(${v / 100})`;
        },
      });
    };

    runLoader();
  }, []);

  const nameText = "RISAB GHOSH";
  const tagText = "CREATIVE DEVELOPER";

  return (
    <div ref={loaderRef} className={styles.loader} aria-hidden="true">
      <div ref={overlayTopRef} className={styles.half} />
      <div
        ref={overlayBotRef}
        className={`${styles.half} ${styles.halfBot}`}
      />

      {/* Shimmer background */}
      <div className={styles.shimmer} />

      <div className={styles.content}>
        {/* Name reveal */}
        <div ref={nameRef} className={styles.name}>
          {nameText.split("").map((char, i) => (
            <span key={i} data-char className={styles.nameChar}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div ref={taglineRef} className={styles.tagline}>
          {tagText.split("").map((char, i) => (
            <span key={i} data-char className={styles.tagChar}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Progress */}
        <div className={styles.barTrack}>
          <div
            ref={barRef}
            className={styles.bar}
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p className={styles.counter}>
          <span ref={counterRef}>000</span>
          <span className={styles.pct}>%</span>
        </p>
      </div>

      <div className={styles.wordmark}>© 2024</div>
    </div>
  );
}
