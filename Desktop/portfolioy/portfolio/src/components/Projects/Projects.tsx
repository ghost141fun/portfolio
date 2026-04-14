"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Projects.module.css";

const PROJECTS = [
  {
    id: "01",
    title: "Luminary",
    category: "WebGL / Interactive",
    year: "2024",
    tags: ["Three.js", "GLSL", "React"],
    color: "#d4ff1e",
    desc: "Immersive 3D product configurator with real-time ray marching and custom PBR shaders.",
    image: "/images/projects/luminary.png",
  },
  {
    id: "02",
    title: "Vanta Studio",
    category: "Creative Direction",
    year: "2023",
    tags: ["GSAP", "Next.js", "Motion"],
    color: "#ff6b35",
    desc: "Award-winning agency website featuring fluid layout transitions and scroll-driven storytelling.",
    image: "/images/projects/vanta.png",
  },
  {
    id: "03",
    title: "Morphic",
    category: "Data Visualization",
    year: "2023",
    tags: ["D3.js", "WebGL", "API"],
    color: "#a78bfa",
    desc: "Real-time generative art platform where market data sculpts evolving 3D landscapes.",
    image: "/images/projects/morphic.png",
  },
  {
    id: "04",
    title: "Epoch",
    category: "Film / Editorial",
    year: "2022",
    tags: ["GLSL", "Canvas", "Audio"],
    color: "#38bdf8",
    desc: "Audio-reactive visual experience for a film score, synchronizing shader animations to waveforms.",
    image: "/images/projects/epoch.png",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const previewPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      // Header dramatic reveal
      const headerChildren = headerRef.current!.children;
      gsap.fromTo(
        headerChildren,
        { opacity: 0, y: 40, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        }
      );

      // Project rows stagger in with scale
      const rows = listRef.current!.querySelectorAll("[data-row]");
      gsap.fromTo(
        rows,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
          },
        }
      );

      // Horizontal line draw
      const lines = listRef.current!.querySelectorAll("[data-line]");
      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.inOut",
          stagger: 0.1,
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
          },
        }
      );

      // Showcase images parallax reveal with scrub
      const showcaseItems = showcaseRef.current!.querySelectorAll("[data-showcase]");
      showcaseItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            clipPath: "inset(30% 10% 30% 10%)",
            scale: 0.85,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );

        // Image inner parallax
        const img = (item as HTMLElement).querySelector("img");
        if (img) {
          gsap.to(img, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          });
        }
      });
    };

    init();

    // Floating preview tracking
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animPreview = () => {
      const speed = 0.08;
      previewPosRef.current.x += (mouseRef.current.x - previewPosRef.current.x) * speed;
      previewPosRef.current.y += (mouseRef.current.y - previewPosRef.current.y) * speed;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate(${previewPosRef.current.x + 24}px, ${previewPosRef.current.y - 120}px)`;
      }
      rafRef.current = requestAnimationFrame(animPreview);
    };
    rafRef.current = requestAnimationFrame(animPreview);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className={styles.section}>
      {/* Background image on hover */}
      <div
        className={styles.bgImage}
        style={{
          opacity: activeIndex !== null ? 0.1 : 0,
          backgroundImage: activeIndex !== null ? `url(${PROJECTS[activeIndex].image})` : "none",
        }}
      />

      {/* Color wash */}
      <div
        className={styles.colorWash}
        style={{
          opacity: activeIndex !== null ? 1 : 0,
          background: activeIndex !== null
            ? `radial-gradient(ellipse 60% 50% at 50% 50%, ${PROJECTS[activeIndex].color}0a, transparent 70%)`
            : "none",
        }}
      />

      {/* Floating preview card */}
      <div
        ref={previewRef}
        className={styles.preview}
        style={{ opacity: activeIndex !== null ? 1 : 0, pointerEvents: "none" }}
      >
        {activeIndex !== null && (
          <div className={styles.previewInner} style={{ borderColor: PROJECTS[activeIndex].color + "40" }}>
            <div className={styles.previewImgWrap}>
              <img src={PROJECTS[activeIndex].image} alt={PROJECTS[activeIndex].title} className={styles.previewImg} />
            </div>
            <div className={styles.previewMeta}>
              <span style={{ color: PROJECTS[activeIndex].color }}>{PROJECTS[activeIndex].category}</span>
              <span>{PROJECTS[activeIndex].year}</span>
            </div>
            <p className={styles.previewDesc}>{PROJECTS[activeIndex].desc}</p>
          </div>
        )}
      </div>

      <div className={styles.inner}>
        <div ref={headerRef} className={styles.header}>
          <span className={styles.label}>
            <span className={styles.labelLine} />
            Selected Work
          </span>
          <h2 className={styles.headline}>
            Projects<em className={styles.em}> & Cases</em>
          </h2>
          <p className={styles.count}>{PROJECTS.length} Projects</p>
        </div>

        {/* Full-width showcase images */}
        <div ref={showcaseRef} className={styles.showcase}>
          {PROJECTS.slice(0, 2).map((project, i) => (
            <div key={project.id} data-showcase className={styles.showcaseItem} data-cursor="view">
              <div className={styles.showcaseImgWrap}>
                <img src={project.image} alt={project.title} className={styles.showcaseImg} />
                <div className={styles.showcaseOverlay} style={{ background: `linear-gradient(to top, ${project.color}15, transparent)` }} />
              </div>
              <div className={styles.showcaseInfo}>
                <span className={styles.showcaseNum}>{project.id}</span>
                <h3 className={styles.showcaseTitle}>{project.title}</h3>
                <span className={styles.showcaseCat}>{project.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Project list */}
        <div ref={listRef} className={styles.list}>
          <div data-line className={styles.divider} />
          {PROJECTS.map((project, i) => (
            <div key={project.id}>
              <div
                data-row
                className={styles.row}
                style={{ opacity: 0 }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                data-cursor="view"
              >
                <div className={styles.rowBg} style={{ backgroundImage: `url(${project.image})` }} />
                <div className={styles.rowLeft}>
                  <span className={styles.rowNum} style={{ "--project-color": project.color } as React.CSSProperties}>
                    {project.id}
                  </span>
                  <div className={styles.rowTitle}>
                    <h3 className={styles.title}>{project.title}</h3>
                    <div className={styles.tags}>
                      {project.tags.map((t) => (
                        <span key={t} className={styles.tag}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.rowRight}>
                  <span className={styles.category}>{project.category}</span>
                  <span className={styles.year}>{project.year}</span>
                  <div className={styles.dot} style={{ background: project.color }} />
                  <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div data-line className={styles.divider} />
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <a href="#contact" className={styles.footerLink} data-cursor="hover">
            Have a project in mind?
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L16 4M16 4H7M16 4V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
