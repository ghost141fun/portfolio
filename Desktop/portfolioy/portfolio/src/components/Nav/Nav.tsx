"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Nav.module.css";

const links = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const sysRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // ── ENTRY ANIMATION ──
  useEffect(() => {
    const nav = navRef.current!;
    const logo = logoRef.current;
    const linkEls = linksRef.current?.querySelectorAll("li");
    const sys = sysRef.current;

    // Set initial invisible state
    gsap.set([logo, sys], { opacity: 0, y: -20 });
    if (linkEls) gsap.set(linkEls, { opacity: 0, y: -15 });

    const tl = gsap.timeline({ delay: 2.5 });

    tl.to(logo, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

    if (linkEls) {
      tl.to(linkEls, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08
      }, "-=0.5");
    }

    tl.to(sys, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3");
  }, []);

  // ── SCROLL BEHAVIOR ──
  useEffect(() => {
    let lastY = 0;
    const nav = navRef.current!;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y > 80 && y > lastY) {
        nav.style.transform = "translateY(-100%)";
      } else {
        nav.style.transform = "translateY(0)";
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("/#") && window.location.pathname === "/") {
      e.preventDefault();
      const target = document.querySelector(href.substring(1));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
    >
      <a ref={logoRef} href="#" className={styles.logo} data-cursor="hover">
        <span className={styles.logoMark}>[RG]</span>
        <span className={styles.logoFull}>RISAB_GHOSH</span>
      </a>

      <ul ref={linksRef} className={styles.links}>
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={styles.link}
              data-cursor="hover"
              onClick={(e) => handleNav(e, link.href)}
            >
              <span className={styles.linkInner}>{link.label}</span>
              <span className={styles.linkUnderline} />
            </a>
          </li>
        ))}
      </ul>

      <div ref={sysRef} className={styles.sysInfo}>
        <span>v.4.0.0</span>
        <span className={styles.statusDot} />
      </div>
    </nav>
  );
}
