"use client";

import { useEffect, useRef, useState } from "react";
import { useSensory, SyncData } from "@/contexts/SensoryContext";
import styles from "./DeviceSync.module.css";

/**
 * DeviceSync — Creates a WebRTC peer and displays a QR code.
 * Users scan with their phone to establish a direct connection.
 * The phone sends gyroscope + touch data to control the desktop site.
 */
export default function DeviceSync() {
  const { features, setSync } = useSensory();
  const peerRef = useRef<any>(null);
  const connRef = useRef<any>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!features.deviceSync) {
      if (connRef.current) connRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
      peerRef.current = null;
      connRef.current = null;
      setConnected(false);
      setPeerId("");
      setSync({
        connected: false,
        gyro: { alpha: 0, beta: 0, gamma: 0 },
        touch: { x: 0, y: 0 },
      });
      return;
    }

    let active = true;

    const init = async () => {
      try {
        const { Peer } = await import("peerjs");
        const id = "rg-" + Math.random().toString(36).substring(2, 8);
        const peer = new Peer(id);

        peer.on("open", (openId: string) => {
          if (!active) return;
          peerRef.current = peer;
          setPeerId(openId);
        });

        peer.on("connection", (conn: any) => {
          if (!active) return;
          connRef.current = conn;

          conn.on("open", () => {
            setConnected(true);
            setSync((prev: SyncData) => ({ ...prev, connected: true }));
          });

          conn.on("data", (data: any) => {
            if (data.type === "gyro") {
              setSync((prev: SyncData) => ({
                ...prev,
                connected: true,
                gyro: data.gyro,
              }));
            } else if (data.type === "touch") {
              setSync((prev: SyncData) => ({
                ...prev,
                connected: true,
                touch: data.touch,
              }));
            }
          });

          conn.on("close", () => {
            setConnected(false);
            setSync({
              connected: false,
              gyro: { alpha: 0, beta: 0, gamma: 0 },
              touch: { x: 0, y: 0 },
            });
          });
        });

        peer.on("error", (err: any) => {
          console.warn("DeviceSync error:", err);
          setError("Connection failed");
        });
      } catch (err) {
        console.warn("DeviceSync: PeerJS failed", err);
        setError("WebRTC not supported");
      }
    };

    init();

    return () => {
      active = false;
      if (connRef.current) connRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [features.deviceSync]);

  if (!features.deviceSync) return null;

  // Build controller URL
  const controllerUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/controller/${peerId}`
      : "";

  const qrUrl = peerId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(controllerUrl)}&bgcolor=060606&color=d4ff1e`
    : "";

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {connected ? (
          <div className={styles.connected}>
            <div className={styles.connIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="var(--accent)"
                  strokeWidth="1"
                />
                <path
                  d="M14 24L21 31L34 17"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={styles.connTitle}>Device Connected</h3>
            <p className={styles.connDesc}>
              Your phone is now controlling this site.
              <br />
              Tilt and swipe to interact.
            </p>
          </div>
        ) : (
          <>
            <h3 className={styles.title}>Connect Your Catalyst</h3>
            <p className={styles.desc}>
              Scan with your phone to control this site
            </p>
            <div className={styles.qrWrap}>
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QR code"
                  className={styles.qr}
                  width={180}
                  height={180}
                />
              ) : (
                <div className={styles.qrLoading}>
                  <div className={styles.spinner} />
                  <span>Generating link…</span>
                </div>
              )}
            </div>
            {peerId && (
              <p className={styles.roomCode}>
                Room: <span className={styles.code}>{peerId}</span>
              </p>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
