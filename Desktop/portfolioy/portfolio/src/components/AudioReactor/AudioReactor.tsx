"use client";

import { useEffect, useRef } from "react";
import { useSensory } from "@/contexts/SensoryContext";

/**
 * AudioReactor — Listens to ambient microphone input and provides
 * amplitude + frequency band data (bass/mid/high) for reactive visuals.
 * The entire site breathes with the user's environment.
 */
export default function AudioReactor() {
  const { features, setAudio } = useSensory();
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!features.audioReactive) {
      cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
        ctxRef.current = null;
      }
      setAudio({ level: 0, bass: 0, mid: 0, high: 0 });
      return;
    }

    let active = true;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false },
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const audioCtx = new AudioContext();
        ctxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        source.connect(analyser);
        // Don't connect to destination — we don't want to play back mic audio

        const bufferLength = analyser.frequencyBinCount; // 128
        const dataArray = new Uint8Array(bufferLength);

        const process = () => {
          if (!active) return;

          analyser.getByteFrequencyData(dataArray);

          // Overall level (average amplitude)
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const level = sum / bufferLength / 255;

          // Bass (0-15), Mid (16-80), High (81-127)
          let bassSum = 0,
            midSum = 0,
            highSum = 0;
          for (let i = 0; i < 16; i++) bassSum += dataArray[i];
          for (let i = 16; i < 80; i++) midSum += dataArray[i];
          for (let i = 80; i < bufferLength; i++) highSum += dataArray[i];

          const bass = bassSum / 16 / 255;
          const mid = midSum / 64 / 255;
          const high = highSum / 48 / 255;

          setAudio({ level, bass, mid, high });

          rafRef.current = requestAnimationFrame(process);
        };

        process();
      } catch (err) {
        console.warn("AudioReactor: mic access denied", err);
      }
    };

    start();

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
      }
    };
  }, [features.audioReactive]);

  return null;
}
