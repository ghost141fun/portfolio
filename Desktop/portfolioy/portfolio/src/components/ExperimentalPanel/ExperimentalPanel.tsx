"use client";

import { useState } from "react";
import { useSensory } from "@/contexts/SensoryContext";
import styles from "./ExperimentalPanel.module.css";

const FEATURES = [
  {
    key: "headTracking" as const,
    label: "Head Tracking",
    desc: "Webcam parallax",
    icon: "👁",
  },
  {
    key: "audioReactive" as const,
    label: "Audio Reactive",
    desc: "Mic-driven visuals",
    icon: "🎤",
  },
  {
    key: "domSynth" as const,
    label: "DOM Synth",
    desc: "Generative audio",
    icon: "🎵",
  },
  {
    key: "deviceSync" as const,
    label: "Device Sync",
    desc: "Phone controller",
    icon: "📱",
  },
  {
    key: "erosion" as const,
    label: "Erosion Mode",
    desc: "Drag to destroy",
    icon: "💥",
  },
];

export default function ExperimentalPanel() {
  const { features, toggleFeature } = useSensory();
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(features).filter(Boolean).length;

  return (
    <div className={styles.wrap}>
      {/* Toggle button */}
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen(!open)}
        data-cursor="hover"
        aria-label="Toggle experimental features"
      >
        <span className={styles.triggerIcon}>⚗</span>
        {activeCount > 0 && (
          <span className={styles.badge}>{activeCount}</span>
        )}
      </button>

      {/* Panel */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        <div className={styles.panelHeader}>
          <div>
            <h3 className={styles.panelTitle}>Experimental Lab</h3>
            <p className={styles.panelDesc}>
              Bleeding-edge sensory features
            </p>
          </div>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            LIVE
          </div>
        </div>

        <div className={styles.features}>
          {FEATURES.map((f) => (
            <button
              key={f.key}
              className={`${styles.feature} ${
                features[f.key] ? styles.featureActive : ""
              }`}
              onClick={() => toggleFeature(f.key)}
              data-cursor="hover"
            >
              <span className={styles.featureIcon}>{f.icon}</span>
              <div className={styles.featureText}>
                <span className={styles.featureLabel}>{f.label}</span>
                <span className={styles.featureDesc}>{f.desc}</span>
              </div>
              <div
                className={`${styles.toggle} ${
                  features[f.key] ? styles.toggleOn : ""
                }`}
              >
                <div className={styles.toggleDot} />
              </div>
            </button>
          ))}
        </div>

        <p className={styles.panelNote}>
          ⚠ Some features require camera/mic permissions
        </p>
      </div>
    </div>
  );
}
