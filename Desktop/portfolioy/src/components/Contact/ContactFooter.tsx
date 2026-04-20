"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactFooter.module.css";

const SOCIALS = [
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function ContactFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const footer = footerRef.current!;

    // ── TAG REVEAL ──
    const tag = footer.querySelector(`.${styles.tag}`);
    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, x: -30, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: footer, start: "top 85%" }
        }
      );
    }

    // ── TITLE — PER-CHAR DRAMATIC REVEAL ──
    const chars = titleRef.current?.querySelectorAll("[data-char]");
    if (chars) {
      gsap.fromTo(chars,
        { yPercent: 140, opacity: 0, rotate: 10, scale: 0.7, filter: "blur(6px)" },
        { yPercent: 0, opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)",
          duration: 1.6, ease: "expo.out", stagger: 0.025,
          scrollTrigger: { trigger: titleRef.current, start: "top 90%" }
        }
      );
    }

    // ── EMAIL — SLIDE + GLOW ──
    if (emailRef.current) {
      gsap.fromTo(emailRef.current,
        { opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 1.4, ease: "power3.out", delay: 0.3,
          scrollTrigger: { trigger: emailRef.current, start: "top 90%" }
        }
      );

      // ── MAGNETIC EMAIL ──
      const el = emailRef.current;
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.15;
        const dy = (e.clientY - cy) * 0.15;
        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    }

    // ── SOCIAL LINKS — STAGGER ──
    const socialLinks = socialsRef.current?.querySelectorAll("[data-social]");
    if (socialLinks) {
      gsap.fromTo(socialLinks,
        { opacity: 0, x: -20, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)",
          duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: socialsRef.current, start: "top 90%" }
        }
      );
    }

    // ── BOTTOM COLUMNS — SLIDE UP ──
    const cols = bottomRef.current?.querySelectorAll(`.${styles.column}`);
    if (cols) {
      gsap.fromTo(cols,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: bottomRef.current, start: "top 92%" }
        }
      );
    }

    // ── CONTINUOUS AMBIENT: AURORA GRADIENT ──
    const aurora = footer.querySelector(`.${styles.aurora}`) as HTMLElement;
    if (aurora) {
      gsap.to(aurora, {
        backgroundPosition: "200% 50%",
        duration: 15,
        repeat: -1,
        ease: "none",
      });
    }
  }, []);

  // Split title into chars
  const titleLine1 = "Let's Build Something";
  const titleLine2 = "Irresistible";

  return (
    <footer ref={footerRef} id="contact" className={styles.footer}>
      {/* Aurora gradient background */}
      <div className={styles.aurora} aria-hidden="true" />

      {/* Grid overlay */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Floating particles */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${4 + Math.random() * 8}s`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Scan line */}
      <div className={styles.scanLine} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.tag}>[ TERMINAL_CONTACT ]</div>

          <h2 ref={titleRef} className={styles.title}>
            <span className={styles.titleLine}>
              {titleLine1.split("").map((char, i) => (
                <span key={i} data-char className={styles.titleChar}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <br />
            <span className={styles.titleLine}>
              {titleLine2.split("").map((char, i) => (
                <span key={i} data-char className={`${styles.titleChar} ${styles.accentChar}`}>
                  {char}
                </span>
              ))}
            </span>
          </h2>

          <a ref={emailRef} href="mailto:risabghosh12@gmail.com" className={styles.email} data-cursor="hover">
            <span className={styles.emailGlow} />
            risabghosh12@gmail.com
          </a>
        </div>

        <div ref={bottomRef} className={styles.bottom}>
          <div className={styles.column}>
            <span className={styles.label}>Core_Network</span>
            <div ref={socialsRef} className={styles.links}>
              {SOCIALS.map((s) => (
                <a key={s.label} data-social href={s.href} className={styles.link} data-cursor="hover">
                  <span className={styles.linkText}>{s.label}</span>
                  <span className={styles.linkArrow}>↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <span className={styles.label}>Base_Station</span>
            <p className={styles.text}>Based in Earth — 00° N, 00° E</p>
          </div>

          <div className={styles.column}>
            <span className={styles.label}>System_Logs</span>
            <p className={styles.text}>© 2024 Obsidian Noir Portfolio.<br />v.4.0.0_OBSIDIAN</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
