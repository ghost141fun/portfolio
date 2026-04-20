"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutBento.module.css";

const FEATURES = [
  { title: "Visual Storytelling", desc: "Crafting narratives through motion and 3D space — where every pixel moves with purpose.", size: "large", icon: "◈" },
  { title: "Technical Precision", desc: "Expertise in WebGL, GSAP, and Next.js performance optimization.", size: "small", icon: "⬡" },
  { title: "Infinite Motion", desc: "Fluid simulations, reactive particles, and living interfaces.", size: "small", icon: "◉" },
  { title: "Minimalist Philosophy", desc: "Stripping away noise to reveal the essence of digital art.", size: "medium", icon: "△" },
];

const SKILLS = [
  "WebGL", "Three.js", "GSAP", "React", "Next.js", "TypeScript",
  "GLSL", "Motion Design", "Node.js", "Figma", "Blender", "R3F",
];

const STATS = [
  { value: 7, suffix: "+", label: "Years Experience" },
  { value: 40, suffix: "+", label: "Projects Shipped" },
  { value: 15, suffix: "+", label: "Awards Won" },
];

const TIMELINE = [
  { year: "2017", title: "The Spark", desc: "First line of code. Built my first website with raw HTML & CSS — ugly, broken, and absolutely magical." },
  { year: "2019", title: "Going Deep", desc: "Discovered Three.js and WebGL. Fell down the rabbit hole of shader programming and never came back." },
  { year: "2021", title: "Creative Studio", desc: "Joined an award-winning creative agency. Shipped 20+ projects for Fortune 500 brands." },
  { year: "2023", title: "Going Independent", desc: "Launched my own practice. Focused on high-end interactive experiences and experimental web art." },
  { year: "NOW", title: "Obsidian Era", desc: "Building the future of digital craft — where motion, code, and art converge into something unforgettable." },
];

export default function AboutBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current!;

    // ── TAG + TITLE CHAR-BY-CHAR REVEAL ──
    const tag = section.querySelector(`.${styles.tag}`);
    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, x: -30, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" }
        }
      );
    }

    const titleChars = titleRef.current?.querySelectorAll("[data-char]");
    if (titleChars) {
      gsap.fromTo(titleChars,
        { yPercent: 120, opacity: 0, rotate: 8, scale: 0.8 },
        { yPercent: 0, opacity: 1, rotate: 0, scale: 1,
          duration: 1.4, ease: "expo.out", stagger: 0.03,
          scrollTrigger: { trigger: titleRef.current, start: "top 82%" }
        }
      );
    }

    // ── SUBTITLE REVEAL ──
    const subtitle = section.querySelector(`.${styles.subtitle}`);
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 20, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: subtitle, start: "top 88%" }
        }
      );
    }

    // ═══════════════════════════════════════════════════════════
    // ── STORY SECTION ANIMATIONS ──
    // ═══════════════════════════════════════════════════════════

    // ── QUOTE — DRAMATIC BLUR REVEAL ──
    if (quoteRef.current) {
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 40, scale: 0.96, filter: "blur(10px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 1.6, ease: "power3.out",
          scrollTrigger: { trigger: quoteRef.current, start: "top 85%" }
        }
      );
    }

    // ── PARAGRAPH — WORD-BY-WORD SCROLL REVEAL ──
    const paraWords = paraRef.current?.querySelectorAll("[data-w]");
    if (paraWords) {
      gsap.fromTo(paraWords,
        { opacity: 0.08 },
        { opacity: 1, duration: 0.4, stagger: 0.02,
          scrollTrigger: {
            trigger: paraRef.current,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 1,
          }
        }
      );
    }



    // ── TIMELINE — STAGGER ENTRY ──
    const timelineItems = timelineRef.current?.querySelectorAll("[data-tl-item]");
    if (timelineItems) {
      timelineItems.forEach((item, i) => {
        const el = item as HTMLElement;
        gsap.fromTo(el,
          { opacity: 0, x: -40, filter: "blur(4px)" },
          { opacity: 1, x: 0, filter: "blur(0px)",
            duration: 1.2, ease: "expo.out", delay: i * 0.1,
            scrollTrigger: { trigger: timelineRef.current, start: "top 78%" }
          }
        );
      });

      // ── TIMELINE LINE DRAW ──
      const tlLine = timelineRef.current?.querySelector(`.${styles.timelineLine}`);
      if (tlLine) {
        gsap.fromTo(tlLine,
          { scaleY: 0 },
          { scaleY: 1, duration: 2, ease: "power3.inOut",
            scrollTrigger: { trigger: timelineRef.current, start: "top 80%", end: "bottom 60%", scrub: 1 }
          }
        );
      }
    }

    // ═══════════════════════════════════════════════════════════
    // ── BENTO CARDS — DRAMATIC STAGGER ──
    // ═══════════════════════════════════════════════════════════
    const cards = cardsRef.current?.querySelectorAll(`.${styles.card}`);
    if (cards) {
      cards.forEach((card, i) => {
        const cardEl = card as HTMLElement;

        gsap.fromTo(cardEl,
          { y: 80 + i * 20, opacity: 0, scale: 0.92, rotateX: 8, filter: "blur(4px)" },
          { y: 0, opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)",
            duration: 1.4, ease: "expo.out", delay: i * 0.12,
            scrollTrigger: { trigger: cardsRef.current, start: "top 78%" }
          }
        );

        const borderTrace = cardEl.querySelector(`.${styles.borderTrace}`) as HTMLElement;
        if (borderTrace) {
          gsap.fromTo(borderTrace,
            { strokeDashoffset: 1000 },
            { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut",
              delay: 0.5 + i * 0.2,
              scrollTrigger: { trigger: cardEl, start: "top 80%" }
            }
          );
        }

        const onMove = (e: MouseEvent) => {
          const rect = cardEl.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(cardEl, { rotateY: x * 12, rotateX: -y * 12, duration: 0.6, ease: "power2.out" });
          const glow = cardEl.querySelector(`.${styles.glow}`) as HTMLElement;
          if (glow) {
            glow.style.left = `${(x + 0.5) * 100}%`;
            glow.style.top = `${(y + 0.5) * 100}%`;
          }
        };
        const onLeave = () => {
          gsap.to(cardEl, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
        };
        cardEl.addEventListener("mousemove", onMove);
        cardEl.addEventListener("mouseleave", onLeave);
      });
    }

    // ── STATS COUNTER ANIMATION ──
    const statEls = statsRef.current?.querySelectorAll(`.${styles.stat}`);
    if (statEls) {
      statEls.forEach((stat, i) => {
        const valEl = stat.querySelector(`.${styles.statValue}`) as HTMLElement;
        const target = parseInt(valEl?.getAttribute("data-target") || "0");
        const suffix = valEl?.getAttribute("data-suffix") || "";

        gsap.fromTo(stat,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1,
            duration: 1, ease: "back.out(1.7)", delay: i * 0.15,
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" }
          }
        );

        if (valEl) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2.5, ease: "power2.out",
            delay: i * 0.2,
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
            onUpdate: () => {
              valEl.textContent = Math.round(obj.val).toString().padStart(2, "0") + suffix;
            },
          });
        }
      });
    }

    // ── MARQUEE ENTRANCE ──
    if (marqueeRef.current) {
      gsap.fromTo(marqueeRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: marqueeRef.current, start: "top 90%" }
        }
      );
    }

    // ── FLOATING PARTICLES ──
    const particleContainer = section.querySelector(`.${styles.particles}`) as HTMLElement;
    if (particleContainer) {
      for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = styles.particle;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        p.style.animationDuration = `${4 + Math.random() * 8}s`;
        p.style.width = `${1 + Math.random() * 3}px`;
        p.style.height = p.style.width;
        particleContainer.appendChild(p);
      }
    }
  }, []);

  // Split title into chars
  const titleText = "Crafting Digital Obsidian";
  const titleWords = titleText.split(" ");

  // Story paragraph — word-level split for scroll reveal
  const storyText = "I'm a creative developer obsessed with the space where engineering meets art. For 7+ years I've been crafting award-winning digital experiences — from immersive WebGL worlds and real-time 3D simulations to fluid motion systems that make interfaces feel alive. I believe the best digital work doesn't just display information — it breathes, responds, and creates an emotional connection. Every project is an opportunity to push the boundaries of what the web can do. Currently open to ambitious collaborations and full-time opportunities at studios and agencies that refuse to settle for ordinary.";
  const storyWords = storyText.split(" ");

  return (
    <section ref={sectionRef} id="about" className={styles.about}>
      {/* Ambient floating particles */}
      <div className={styles.particles} aria-hidden="true" />

      {/* Grid overlay */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Ambient gradient orbs */}
      <div className={styles.ambientOrb1} aria-hidden="true" />
      <div className={styles.ambientOrb2} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.tag}>[ EXPLORATION ]</div>
          <h2 ref={titleRef} className={styles.title}>
            {titleWords.map((word, wi) => (
              <span key={wi} className={styles.titleWord}>
                {word.split("").map((char, ci) => (
                  <span key={ci} data-char className={`${styles.titleChar} ${word === "Obsidian" ? styles.accent : ""}`}>
                    {char}
                  </span>
                ))}
                {wi < titleWords.length - 1 && <span data-char className={styles.titleChar}>&nbsp;</span>}
              </span>
            ))}
          </h2>
          <p className={styles.subtitle}>
            A bento-grid exploration of form, function, and motion.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            STORY SECTION — The narrative heart of the About
           ═══════════════════════════════════════════════════════ */}
        <div ref={storyRef} className={styles.story}>
          {/* Left: Quote + Paragraph */}
          <div className={styles.storyLeft}>
            {/* Philosophy quote */}
            <div ref={quoteRef} className={styles.quote} style={{ opacity: 0 }}>
              <div className={styles.quoteMark}>&ldquo;</div>
              <p className={styles.quoteText}>
                The best digital experiences don&apos;t just display —
                they breathe, move, and respond. That&apos;s what I build.
              </p>
              <div className={styles.quoteBar} />
            </div>

            {/* Paragraph with word-by-word scroll reveal */}
            <p ref={paraRef} className={styles.para}>
              {storyWords.map((word, i) => (
                <span key={i} data-w className={styles.paraWord}>
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>


        </div>

        {/* ═══════════════════════════════════════════════════════
            TIMELINE — The journey
           ═══════════════════════════════════════════════════════ */}
        <div ref={timelineRef} className={styles.timeline}>
          <div className={styles.timelineHeader}>
            <div className={styles.tag}>[ JOURNEY ]</div>
            <h3 className={styles.timelineTitle}>The Path So Far</h3>
          </div>

          <div className={styles.timelineGrid}>
            {/* Vertical connecting line */}
            <div className={styles.timelineLine} />

            {TIMELINE.map((item, i) => (
              <div key={i} data-tl-item className={styles.timelineItem}>
                <div className={styles.timelineDot}>
                  <span className={styles.timelineDotInner} />
                </div>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h4 className={styles.timelineItemTitle}>{item.title}</h4>
                  <p className={styles.timelineItemDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div ref={cardsRef} className={styles.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`${styles.card} ${styles[f.size]} glass`} data-cursor="hover" style={{ perspective: "800px" }}>
              <div className={styles.cardScan} />
              <svg className={styles.borderTrace} viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="0.5" y="0.5" width="99" height="99" rx="0" fill="none"
                  stroke="rgba(212,255,30,0.3)" strokeWidth="0.5"
                  strokeDasharray="400" strokeDashoffset="400" />
              </svg>
              <div className={styles.cardHeader}>
                <span className={styles.num}>{(i + 1).toString().padStart(2, '0')}</span>
                <span className={styles.cardIcon}>{f.icon}</span>
                <span className={styles.dot} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
              <div className={styles.glow} />
              <div className={styles.cardParticles} aria-hidden="true">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className={styles.cardParticle}
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      animationDelay: `${j * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 4}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div ref={statsRef} className={styles.statsRow}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue} data-target={s.value} data-suffix={s.suffix}>
                00{s.suffix}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
              <div className={styles.statLine} />
            </div>
          ))}
        </div>

        {/* Skill Marquee */}
        <div ref={marqueeRef} className={styles.marqueeWrap} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[...SKILLS, ...SKILLS, ...SKILLS].map((s, i) => (
              <span key={i} className={styles.marqueeItem}>
                {s} <span className={styles.marqueeDot}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
