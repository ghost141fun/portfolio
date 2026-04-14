import { useEffect } from "react";

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let lenis: any;

    const init = async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
      });

      // Integrate with GSAP ScrollTrigger
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, [enabled]);
}
