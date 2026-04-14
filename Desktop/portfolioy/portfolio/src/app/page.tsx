"use client";

import { useState, useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import Loader from "@/components/Loader/Loader";
import Nav from "@/components/Nav/Nav";
import ZenithHero from "@/components/Hero/ZenithHero";
import AboutBento from "@/components/About/AboutBento";
import ProjectGallery from "@/components/Projects/ProjectGallery";
import ContactFooter from "@/components/Contact/ContactFooter";
import SectionDivider from "@/components/SectionDivider/SectionDivider";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  useLenis(isLoaded);

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.remove("loading");
    }
  }, [isLoaded]);

  return (
    <>
      <Loader onComplete={() => setIsLoaded(true)} />
      
      <main style={{ 
        opacity: isLoaded ? 1 : 0, 
        transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: isLoaded ? "auto" : "none"
      }}>
        <Nav />
        <ZenithHero />
        <SectionDivider />
        <AboutBento />
        <SectionDivider />
        <ProjectGallery />
        <SectionDivider />
        <ContactFooter />
      </main>
    </>
  );
}
