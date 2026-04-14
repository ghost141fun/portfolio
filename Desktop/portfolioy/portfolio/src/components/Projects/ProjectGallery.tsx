"use client";

import { useEffect, useRef } from "react";
import styles from "./ProjectGallery.module.css";

const PROJECTS = [
  { id: 1, title: "Lumina", category: "Interactive Install", image: "/images/projects/luminary.png" },
  { id: 2, title: "Vortex", category: "Generative Art", image: "/images/projects/vanta.png" },
  { id: 3, title: "Nexus", category: "WebGL Experience", image: "/images/projects/morphic.png" },
  { id: 4, title: "Aether", category: "Digital Product", image: "/images/projects/epoch.png" },
];

export default function ProjectGallery() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const items = containerRef.current?.querySelectorAll(`.${styles.item}`);
      if (!items) return;

      items.forEach((item) => {
        const img = item.querySelector("img");
        if (!img) return;

        gsap.fromTo(img, 
          { scale: 1.2, filter: "grayscale(1) brightness(0.5)" },
          { 
            scale: 1,
            filter: "grayscale(0) brightness(1)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );

        gsap.fromTo(item.querySelector(`.${styles.info}`),
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          }
        );
      });
    };
    init();
  }, []);

  return (
    <section ref={containerRef} id="projects" className={styles.gallery}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Selected<br /><span>Works</span></h2>
          <span className={styles.count}>[04]</span>
        </div>

        <div className={styles.list}>
          {PROJECTS.map((p) => (
            <div key={p.id} className={styles.item} data-cursor="hover">
              <div className={styles.mediaWrap}>
                <div className={styles.media}>
                  {/* For demo, using a colored placeholder if image fails */}
                  <div className={styles.placeholder} style={{ background: `var(--gray-mid)` }} />
                  <img src={p.image} alt={p.title} className={styles.img} />
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.id}>0{p.id}</div>
                <h3 className={styles.projectTitle}>{p.title}</h3>
                <p className={styles.category}>{p.category}</p>
                <div className={styles.view}>
                  <span>Explore</span>
                  <div className={styles.viewLine} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
