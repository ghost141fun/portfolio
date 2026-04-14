"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

const SOCIALS = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      // Big headline — dramatic char reveal
      const lines = headlineRef.current!.querySelectorAll("[data-line]");
      gsap.fromTo(
        lines,
        { yPercent: 120, rotate: 4, opacity: 0, scale: 0.95 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 82%",
          },
        }
      );

      // Email reveal with underline animation
      gsap.fromTo(
        emailRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: emailRef.current,
            start: "top 85%",
          },
        }
      );

      // Socials stagger from left
      const socialLinks = socialsRef.current!.querySelectorAll("[data-social]");
      gsap.fromTo(
        socialLinks,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: socialsRef.current,
            start: "top 85%",
          },
        }
      );

      // Form fields reveal with blur
      const fields = formRef.current!.querySelectorAll("[data-field]");
      gsap.fromTo(
        fields,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        }
      );

      // Background parallax
      const bgImg = sectionRef.current!.querySelector("[data-bg-img]");
      if (bgImg) {
        gsap.to(bgImg, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    };

    init();

    // Magnetic button effect
    const btn = btnRef.current!;
    const onBtnMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.4;
      const dy = (e.clientY - cy) * 0.4;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onBtnLeave = () => {
      btn.style.transform = "translate(0,0)";
      btn.style.transition = "transform 0.4s var(--ease-out-expo)";
      setTimeout(() => { btn.style.transition = "none"; }, 400);
    };
    btn.addEventListener("mousemove", onBtnMove);
    btn.addEventListener("mouseleave", onBtnLeave);
    return () => {
      btn.removeEventListener("mousemove", onBtnMove);
      btn.removeEventListener("mouseleave", onBtnLeave);
    };
  }, []);

  const handleSubmit = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      {/* Atmospheric background */}
      <div className={styles.bgWrap} aria-hidden="true">
        <img data-bg-img src="/images/contact/atmosphere.png" alt="" className={styles.bgImg} />
        <div className={styles.bgOverlay} />
      </div>

      {/* Floating particles */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 8}s`,
              width: `${1.5 + Math.random() * 3}px`,
              height: `${1.5 + Math.random() * 3}px`,
              opacity: 0.1 + Math.random() * 0.25,
            }}
          />
        ))}
      </div>

      <div className={styles.bgText} aria-hidden="true">CONTACT</div>

      <div className={styles.inner}>
        {/* Left: Big headline */}
        <div className={styles.left}>
          <span className={styles.label}>
            <span className={styles.labelLine} />
            Get in touch
          </span>

          <h2 ref={headlineRef} className={styles.headline}>
            {["Let's build", "something", "unforgettable."].map((line, i) => (
              <span key={i} className={styles.lineClip}>
                <span data-line className={styles.lineInner}>
                  {i === 2 ? <em className={styles.em}>{line}</em> : line}
                </span>
              </span>
            ))}
          </h2>

          <div ref={emailRef} className={styles.email} style={{ opacity: 0 }}>
            <a href="mailto:hello@risabghosh.dev" data-cursor="hover" className={styles.emailLink}>
              hello@risabghosh.dev
            </a>
          </div>

          <div ref={socialsRef} className={styles.socials}>
            {SOCIALS.map((s) => (
              <a key={s.label} data-social href={s.href} className={styles.socialLink} data-cursor="hover">
                <span>{s.label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div ref={formRef} className={styles.right}>
          {sent ? (
            <div className={styles.successMsg}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="23" stroke="var(--accent)" strokeWidth="1" />
                  <path d="M13 24L20 31L35 15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.successText}>Message received.</p>
              <p className={styles.successSub}>I&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div data-field className={styles.field} style={{ opacity: 0 }}>
                <label className={styles.fieldLabel}>Your name</label>
                <input type="text" className={styles.input} placeholder="Jane Smith" />
              </div>
              <div data-field className={styles.field} style={{ opacity: 0 }}>
                <label className={styles.fieldLabel}>Email address</label>
                <input type="email" className={styles.input} placeholder="jane@studio.com" />
              </div>
              <div data-field className={styles.field} style={{ opacity: 0 }}>
                <label className={styles.fieldLabel}>Project type</label>
                <select className={styles.input}>
                  <option value="">Select a type…</option>
                  <option>Website / Portfolio</option>
                  <option>WebGL / Interactive</option>
                  <option>Creative Direction</option>
                  <option>Other</option>
                </select>
              </div>
              <div data-field className={styles.field} style={{ opacity: 0 }}>
                <label className={styles.fieldLabel}>Tell me about your project</label>
                <textarea className={styles.textarea} rows={4} placeholder="A brief description…" />
              </div>
              <div data-field className={styles.btnWrap} style={{ opacity: 0 }}>
                <button ref={btnRef} className={styles.btn} onClick={handleSubmit} disabled={sending} data-cursor="hover">
                  <span className={styles.btnInner}>
                    {sending ? (
                      <span className={styles.spinner} />
                    ) : (
                      <>
                        Send message
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.footerBar}>
        <span>© 2024 Risab Ghosh. All rights reserved.</span>
        <span>Designed & built with precision.</span>
        <span className={styles.footerAccent}>Available for work ↑</span>
      </div>
    </section>
  );
}
