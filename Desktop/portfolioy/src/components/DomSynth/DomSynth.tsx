"use client";

import { useEffect, useRef } from "react";
import { useSensory } from "@/contexts/SensoryContext";

/**
 * DomSynth — Maps the DOM layout to a generative audio synthesizer.
 * Scroll position drives oscillator frequencies. Scroll velocity drives volume.
 * Each section creates a unique harmonic drone. The page literally has a sound.
 */
export default function DomSynth() {
  const { features } = useSensory();
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    osc3: OscillatorNode;
    gain: GainNode;
    filter: BiquadFilterNode;
    delay: DelayNode;
    delayGain: GainNode;
  } | null>(null);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!features.domSynth) {
      if (nodesRef.current) {
        nodesRef.current.osc1.stop();
        nodesRef.current.osc2.stop();
        nodesRef.current.osc3.stop();
        nodesRef.current = null;
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
        ctxRef.current = null;
      }
      return;
    }

    // Create audio graph
    const audioCtx = new AudioContext();
    ctxRef.current = audioCtx;

    // Oscillators — sine for warmth, triangle for texture, sawtooth for edge
    const osc1 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 80;

    const osc2 = audioCtx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 120;

    const osc3 = audioCtx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 200;

    // Low-pass filter for warmth
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 2;

    // Main gain (volume)
    const gain = audioCtx.createGain();
    gain.gain.value = 0;

    // Delay for spatial reverb effect
    const delay = audioCtx.createDelay(1);
    delay.delayTime.value = 0.3;
    const delayGain = audioCtx.createGain();
    delayGain.gain.value = 0.3;

    // Connect: oscillators → filter → gain → destination
    //                                  └→ delay → delayGain → destination
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    nodesRef.current = { osc1, osc2, osc3, gain, filter, delay, delayGain };

    // Scroll handler — maps scroll to frequencies
    const onScroll = () => {
      if (!nodesRef.current || !ctxRef.current) return;

      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 1);
      lastTimeRef.current = now;

      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Scroll velocity
      const velocity = Math.abs(scrollY - lastScrollRef.current) / dt;
      lastScrollRef.current = scrollY;

      const clampedVelocity = Math.min(velocity, 3);
      const { osc1, osc2, osc3, gain, filter } = nodesRef.current;
      const t = ctxRef.current.currentTime;

      // Map progress to frequencies (pentatonic-ish scale for pleasantness)
      const baseFreq = 60 + progress * 140; // 60Hz → 200Hz
      osc1.frequency.setTargetAtTime(baseFreq, t, 0.3);
      osc2.frequency.setTargetAtTime(baseFreq * 1.5, t, 0.3); // Perfect fifth
      osc3.frequency.setTargetAtTime(baseFreq * 2, t, 0.5); // Octave

      // Velocity → volume (silent when not scrolling)
      const targetGain = Math.min(clampedVelocity * 0.015, 0.04);
      gain.gain.setTargetAtTime(targetGain, t, 0.1);

      // Velocity → filter opening
      filter.frequency.setTargetAtTime(
        300 + clampedVelocity * 600,
        t,
        0.15
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (nodesRef.current) {
        nodesRef.current.osc1.stop();
        nodesRef.current.osc2.stop();
        nodesRef.current.osc3.stop();
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
      }
    };
  }, [features.domSynth]);

  return null;
}
