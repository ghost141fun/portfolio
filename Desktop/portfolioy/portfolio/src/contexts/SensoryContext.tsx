"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface HeadPos {
  x: number;
  y: number;
}

interface AudioData {
  level: number;
  bass: number;
  mid: number;
  high: number;
}

interface SyncData {
  connected: boolean;
  gyro: { alpha: number; beta: number; gamma: number };
  touch: { x: number; y: number };
}

interface SensoryState {
  features: {
    headTracking: boolean;
    audioReactive: boolean;
    domSynth: boolean;
    deviceSync: boolean;
    erosion: boolean;
  };
  headPos: HeadPos;
  audio: AudioData;
  sync: SyncData;
  toggleFeature: (key: keyof SensoryState["features"]) => void;
  setHeadPos: (pos: HeadPos) => void;
  setAudio: (data: AudioData) => void;
  setSync: (data: SyncData) => void;
}

const defaults: SensoryState = {
  features: {
    headTracking: false,
    audioReactive: false,
    domSynth: false,
    deviceSync: false,
    erosion: false,
  },
  headPos: { x: 0, y: 0 },
  audio: { level: 0, bass: 0, mid: 0, high: 0 },
  sync: {
    connected: false,
    gyro: { alpha: 0, beta: 0, gamma: 0 },
    touch: { x: 0, y: 0 },
  },
  toggleFeature: () => {},
  setHeadPos: () => {},
  setAudio: () => {},
  setSync: () => {},
};

const SensoryContext = createContext<SensoryState>(defaults);

export function useSensory() {
  return useContext(SensoryContext);
}

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState(defaults.features);
  const [headPos, setHeadPos] = useState(defaults.headPos);
  const [audio, setAudio] = useState(defaults.audio);
  const [sync, setSync] = useState(defaults.sync);

  const toggleFeature = useCallback(
    (key: keyof typeof features) => {
      setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  return (
    <SensoryContext.Provider
      value={{
        features,
        headPos,
        audio,
        sync,
        toggleFeature,
        setHeadPos,
        setAudio,
        setSync,
      }}
    >
      {children}
    </SensoryContext.Provider>
  );
}
