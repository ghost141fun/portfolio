"use client";

import { useEffect, useRef } from "react";
import styles from "./About.module.css";

const SKILLS = [
  "WebGL", "Three.js", "GSAP", "React", "Next.js",
  "TypeScript", "GLSL Shaders", "Motion Design", "Node.js",
  "Creative Direction", "Figma", "Blender",
];

const STATS = [
  { value: 7, suffix: "+", label: "Years of experience" },
  { value: 40, suffix: "+", label: "Projects delivered" },
  { value: 15, suffix: "+", label: "Awards & features" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      // Headline word-by-word reveal
      const lines = headlineRef.current!.querySelectorAll("[data-line]");
      gsap.fromTo(
        lines,
        { yPercent: 120, opacity: 0, rotate: 3 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        }
      );

      // Paragraph word-by-word fade
      const paraWords = paraRef.current!.querySelectorAll("[data-w]");
      gsap.fromTo(
        paraWords,
        { opacity: 0.1 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.03,
          scrollTrigger: {
            trigger: paraRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 1,
          },
        }
      );

      // Quote dramatic reveal
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
          },
        }
      );

      // Stats counter animation
      const statEls = statsRef.current!.querySelectorAll("[data-stat-value]");
      statEls.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") || "0");
        const suffix = el.getAttribute("data-suffix") || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = Math.round(obj.val).toString().padStart(2, "0") + suffix;
          },
        });
      });

      // Stats stagger
      gsap.fromTo(
        statsRef.current!.querySelectorAll("[data-stat]"),
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 82%",
          },
        }
      );

      // Image cinematic reveal
      gsap.fromTo(
        imgRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.8,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top 80%",
          },
        }
      );

      // Image parallax on scroll
      const imgInner = imgRef.current?.querySelector("img");
      if (imgInner) {
        gsap.to(imgInner, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Floating skills reveal
      const skillItems = skillsRef.current!.querySelectorAll("[data-skill]");
      gsap.fromTo(
        skillItems,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: {
            each: 0.06,
            from: "random",
          },
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 85%",
          },
        }
      );
    };

    init();

    // Image tilt on mouse move
    const imgWrap = imgRef.current;
    if (imgWrap) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = imgWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        imgWrap.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      };
      const onMouseLeave = () => {
        imgWrap.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
        imgWrap.style.transition = "transform 0.6s ease";
        setTimeout(() => { imgWrap.style.transition = "none"; }, 600);
      };
      imgWrap.addEventListener("mousemove", onMouseMove);
      imgWrap.addEventListener("mouseleave", onMouseLeave);
      return () => {
        imgWrap.removeEventListener("mousemove", onMouseMove);
        imgWrap.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, []);

  // Split paragraph text into words for scroll-driven reveal
  const paraText = "I'm a creative developer with 7+ years of experience building award-winning digital experiences. I specialize in WebGL, real-time 3D rendering, and motion design — bridging the gap between engineering precision and artistic vision. Currently open to exciting collaborations and full-time opportunities at studios and agencies pushing the boundaries of the web.";
  const paraWords = paraText.split(" ");

  return (
    <section ref={sectionRef} id="about" className={styles.section}>
      {/* Ambient glows */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.ambientGlow2} aria-hidden="true" />

      {/* Marquee strip */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marqueeInner}>
          {[...SKILLS, ...SKILLS, ...SKILLS].map((s, i) => (
            <span key={i} className={styles.marqueeItem}>
              {s} <span className={styles.marqueeDiv}>·</span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left col */}
        <div className={styles.left}>
          <span className={styles.label}>
            <span className={styles.labelLine} />
            About me
          </span>

          <h2 ref={headlineRef} className={styles.headline}>
            {["Obsessed with", "the craft of", "digital art."].map((line, i) => (
              <span key={i} className={styles.lineClip}>
                <span data-line className={styles.lineInner} style={{ opacity: 0 }}>
                  {i === 2 ? (
                    <><em className={styles.em}>{line.split(" ")[0]}</em>{" "}{line.split(" ").slice(1).join(" ")}</>
                  ) : line}
                </span>
              </span>
            ))}
          </h2>

          {/* Philosophy quote */}
          <div ref={quoteRef} className={styles.quote} style={{ opacity: 0 }}>
            <div className={styles.quoteMark}>&ldquo;</div>
            <p className={styles.quoteText}>
              The best digital experiences don&apos;t just display — they breathe,
              move, and respond. That&apos;s what I build.
            </p>
          </div>

          {/* Floating skill tags */}
          <div ref={skillsRef} className={styles.skillCloud}>
            {SKILLS.map((skill, i) => (
              <span key={i} data-skill className={styles.skillTag} style={{ animationDelay: `${i * 0.3}s` }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className={styles.right}>
          {/* Portrait image with tilt */}
          <div ref={imgRef} className={styles.imgWrap} data-cursor="hover">
            <div className={styles.imgBorder} />
            <div className={styles.imgGlow} />
            <img
              src="/images/about/portrait.png"
              alt="Risab Ghosh — Creative Developer"
              className={styles.img}
            />
            <span className={styles.imgLabel}>RISAB GHOSH — 2024</span>
          </div>

          {/* Paragraph with word-level scroll reveal */}
          <p ref={paraRef} className={styles.para}>
            {paraWords.map((word, i) => (
              <span key={i} data-w className={styles.paraWord}>
                {word}{" "}
              </span>
            ))}
          </p>

          {/* Stats with counter animation */}
          <div ref={statsRef} className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} data-stat className={styles.stat}>
                <span
                  data-stat-value
                  data-target={s.value}
                  data-suffix={s.suffix}
                  className={styles.statValue}
                >
                  00{s.suffix}
                </span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
