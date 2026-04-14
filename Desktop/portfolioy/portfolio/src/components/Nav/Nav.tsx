"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nav.module.css";

const links = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

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
    // Otherwise, allow normal Next.js Link behavior or direct navigation
  };

  return (
    <nav
      ref={navRef}
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
    >
      <a href="#" className={styles.logo} data-cursor="hover">
        <span className={styles.logoMark}>RG</span>
        <span className={styles.logoFull}>Risab Ghosh</span>
      </a>

      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={styles.link}
              data-cursor="hover"
              onClick={(e) => handleNav(e, link.href)}
            >
              <span className={styles.linkInner}>{link.label}</span>
              <span className={styles.linkInner} aria-hidden="true">
                {link.label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.status}>
        <span className={styles.statusDot} />
        <span>Available for work</span>
      </div>
    </nav>
  );
}
