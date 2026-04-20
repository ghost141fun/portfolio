"use client";

import { useEffect, useRef } from "react";
import { useSensory } from "@/contexts/SensoryContext";

/**
 * HeadTracker — Uses the webcam to track the user's face position
 * and provides head offset data for 3D parallax effects.
 * Uses lightweight frame-differencing + skin-color centroid detection.
 * No ML libraries needed.
 */
export default function HeadTracker() {
  const { features, setHeadPos } = useSensory();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const smoothPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!features.headTracking) {
      // Cleanup if disabled
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      cancelAnimationFrame(rafRef.current);
      setHeadPos({ x: 0, y: 0 });
      return;
    }

    let active = true;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 160, height: 120, facingMode: "user" },
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.muted = true;
        await video.play();
        videoRef.current = video;

        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 120;
        canvasRef.current = canvas;

        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        const process = () => {
          if (!active) return;

          ctx.drawImage(video, 0, 0, 160, 120);
          const imageData = ctx.getImageData(0, 0, 160, 120);
          const data = imageData.data;

          // Find centroid of skin-colored pixels
          let sumX = 0,
            sumY = 0,
            count = 0;

          for (let y = 0; y < 120; y += 2) {
            for (let x = 0; x < 160; x += 2) {
              const i = (y * 160 + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              // Simple skin color detection (works for various skin tones)
              // Based on RGB ratio rules
              const isSkin =
                r > 60 &&
                g > 40 &&
                b > 20 &&
                r > g &&
                r > b &&
                r - g > 15 &&
                Math.abs(r - g) < 120;

              if (isSkin) {
                sumX += x;
                sumY += y;
                count++;
              }
            }
          }

          if (count > 50) {
            // Normalize to -1..1 (mirrored for natural parallax)
            const cx = sumX / count;
            const cy = sumY / count;
            const rawX = -((cx / 160) * 2 - 1); // Mirror X
            const rawY = (cy / 120) * 2 - 1;

            // Smooth with lerp
            smoothPos.current.x += (rawX - smoothPos.current.x) * 0.08;
            smoothPos.current.y += (rawY - smoothPos.current.y) * 0.08;

            setHeadPos({
              x: smoothPos.current.x,
              y: smoothPos.current.y,
            });
          }

          rafRef.current = requestAnimationFrame(process);
        };

        process();
      } catch (err) {
        console.warn("HeadTracker: webcam access denied", err);
      }
    };

    start();

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [features.headTracking]);

  return null; // Renders nothing — purely logic
}
