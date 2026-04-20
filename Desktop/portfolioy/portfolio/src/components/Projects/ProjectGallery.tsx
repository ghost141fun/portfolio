"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProjectGallery.module.css";

const PROJECTS = [
  { id: 1, title: "Codex Teams", category: "Collaborative Workspace", tech: "React / Node.js / Socket.io", image: "/images/projects/codex-teams.png", color: "#d4ff1e" },
  { id: 2, title: "Codex Tracking", category: "Project Management", tech: "Next.js / Prisma / PostgreSQL", image: "/images/projects/codex-tracking.jpg", color: "#ff6b35" },
  { id: 3, title: "Nexus", category: "WebGL Experience", tech: "React / R3F / Postprocessing", image: "/images/projects/morphic.png", color: "#a78bfa" },
  { id: 4, title: "Codex Connect", category: "Social Platform", tech: "Next.js / Tailwind / Supabase", image: "/images/projects/codex-connect.jpg", color: "#38bdf8" },
];

export default function ProjectGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── HEADER DRAMATIC REVEAL ──
    const tag = headerRef.current?.querySelector(`.${styles.tag}`);
    const titleChars = headerRef.current?.querySelectorAll("[data-char]");
    const count = headerRef.current?.querySelector(`.${styles.count}`);

    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, x: -40, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%" }
        }
      );
    }

    if (titleChars) {
      gsap.fromTo(titleChars,
        { yPercent: 130, opacity: 0, rotate: 6, scale: 0.85 },
        { yPercent: 0, opacity: 1, rotate: 0, scale: 1,
          duration: 1.6, ease: "expo.out", stagger: 0.04,
          scrollTrigger: { trigger: headerRef.current, start: "top 80%" }
        }
      );
    }

    if (count) {
      gsap.fromTo(count,
        { opacity: 0, x: 30 },
        { opacity: 0.3, x: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 78%" }
        }
      );
    }

    // ── PROJECT ITEMS — CINEMATIC STAGGER ──
    const items = listRef.current?.querySelectorAll(`.${styles.item}`);
    if (items) {
      items.forEach((item, i) => {
        const el = item as HTMLElement;
        const img = el.querySelector("img");
        const info = el.querySelector(`.${styles.info}`);
        const mediaWrap = el.querySelector(`.${styles.mediaWrap}`);
        const numberEl = el.querySelector(`.${styles.id}`);
        const viewLine = el.querySelector(`.${styles.viewLine}`);

        // ── IMAGE CINEMATIC REVEAL ──
        if (mediaWrap) {
          gsap.fromTo(mediaWrap,
            { clipPath: i % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)", scale: 1.1 },
            { clipPath: "inset(0 0% 0 0%)", scale: 1,
              duration: 1.8, ease: "power4.inOut",
              scrollTrigger: { trigger: el, start: "top 80%" }
            }
          );
        }

        // ── IMAGE PARALLAX ──
        if (img) {
          gsap.fromTo(img,
            { scale: 1.3, filter: "grayscale(1) brightness(0.3)" },
            { scale: 1, filter: "grayscale(0) brightness(1)",
              scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: 1 }
            }
          );

          // Continuous parallax on scroll
          gsap.to(img, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 2 }
          });
        }

        // ── INFO PANEL REVEAL ──
        if (info) {
          gsap.fromTo(info,
            { x: i % 2 === 0 ? -60 : 60, opacity: 0, filter: "blur(4px)" },
            { x: 0, opacity: 1, filter: "blur(0px)",
              duration: 1.4, ease: "expo.out", delay: 0.3,
              scrollTrigger: { trigger: el, start: "top 75%" }
            }
          );
        }

        // ── NUMBER GLITCH REVEAL ──
        if (numberEl) {
          gsap.fromTo(numberEl,
            { opacity: 0, scale: 3, filter: "blur(8px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)",
              duration: 0.8, ease: "back.out(2)",
              scrollTrigger: { trigger: el, start: "top 78%" }
            }
          );
        }

        // ── VIEW LINE ANIMATION ──
        if (viewLine) {
          gsap.fromTo(viewLine,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: "power3.inOut", delay: 0.5,
              scrollTrigger: { trigger: el, start: "top 75%" }
            }
          );
        }

        // ── HOVER: MAGNETIC TILT ──
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(el, {
            rotateY: x * 6, rotateX: -y * 4,
            duration: 0.8, ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            rotateY: 0, rotateX: 0,
            duration: 1, ease: "elastic.out(1, 0.4)",
          });
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
      });
    }
  }, []);

  // Split title chars
  const titleText = "Selected Works";

  return (
    <section ref={containerRef} id="projects" className={styles.gallery}>
      {/* Ambient orb */}
      <div className={styles.ambientOrb} aria-hidden="true" />

      <div className={styles.inner}>
        <div ref={headerRef} className={styles.header}>
          <div>
            <div className={styles.tag}>[ ARCHIVE_04 ]</div>
            <h2 className={styles.title}>
              {titleText.split("").map((char, i) => (
                <span key={i} data-char className={`${styles.titleChar} ${char === " " ? styles.titleSpace : ""} ${i > 8 ? styles.titleAccent : ""}`}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
          </div>
          <span className={styles.count}>2022 — 2024</span>
        </div>

        <div ref={listRef} className={styles.list}>
          {PROJECTS.map((p, i) => (
            <div key={p.id} className={styles.item} data-cursor="hover" style={{ perspective: "1200px" }}>
              {/* Color wash on hover */}
              <div className={styles.colorWash} style={{ background: `radial-gradient(ellipse at center, ${p.color}08, transparent 70%)` }} />

              <div className={styles.mediaWrap}>
                <div className={styles.glitchBox} />
                <div className={styles.media}>
                  <img src={p.image} alt={p.title} className={styles.img} />
                  <div className={styles.overlay} />
                  {/* Corner brackets */}
                  <div className={styles.mediaBracketTL} />
                  <div className={styles.mediaBracketBR} />
                </div>
              </div>

              <div className={styles.info}>
                <div className={styles.id} style={{ color: p.color }}>[ 0{p.id} ]</div>
                <h3 className={styles.projectTitle}>{p.title}</h3>
                <p className={styles.category}>{p.category}</p>
                <div className={styles.techStack}>{p.tech}</div>
                <div className={styles.view}>
                  <span>Explore Case Study</span>
                  <div className={styles.viewLine} style={{ transformOrigin: "left center" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
