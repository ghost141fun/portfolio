"use client";

import { useEffect, useRef, useState } from "react";

export default function ControllerPage({
  params,
}: {
  params: { id: string };
}) {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [gyro, setGyro] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const connRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const { Peer } = await import("peerjs");
        const peer = new Peer();

        peer.on("open", () => {
          if (!active) return;

          const conn = peer.connect(params.id);
          connRef.current = conn;

          conn.on("open", () => {
            if (!active) return;
            setStatus("connected");

            // Gyroscope / Device Orientation
            const handleOrientation = (e: DeviceOrientationEvent) => {
              const data = {
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0,
              };
              setGyro(data);
              conn.send({ type: "gyro", gyro: data });
            };

            // Request permission (iOS 13+)
            if (
              typeof (DeviceOrientationEvent as any)
                .requestPermission === "function"
            ) {
              (DeviceOrientationEvent as any)
                .requestPermission()
                .then((perm: string) => {
                  if (perm === "granted") {
                    window.addEventListener(
                      "deviceorientation",
                      handleOrientation
                    );
                  }
                });
            } else {
              window.addEventListener(
                "deviceorientation",
                handleOrientation
              );
            }

            // Touch events
            let lastTouch = { x: 0, y: 0 };

            const handleTouchMove = (e: TouchEvent) => {
              e.preventDefault();
              const touch = e.touches[0];
              const x =
                (touch.clientX / window.innerWidth) * 2 - 1;
              const y =
                (touch.clientY / window.innerHeight) * 2 - 1;
              lastTouch = { x, y };
              conn.send({ type: "touch", touch: { x, y } });
            };

            document.addEventListener("touchmove", handleTouchMove, {
              passive: false,
            });
          });

          conn.on("error", () => setStatus("error"));
          conn.on("close", () => setStatus("error"));
        });

        peer.on("error", () => setStatus("error"));
      } catch (e) {
        setStatus("error");
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {status === "connecting" && (
          <>
            <div style={spinnerContainerStyle}>
              <div style={spinnerStyle} />
            </div>
            <h1 style={titleStyle}>Connecting…</h1>
            <p style={descStyle}>
              Establishing link to{" "}
              <span style={codeStyle}>{params.id}</span>
            </p>
          </>
        )}

        {status === "connected" && (
          <>
            <div style={iconStyle}>
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  stroke="#d4ff1e"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 28L24 35L39 19"
                  stroke="#d4ff1e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 style={titleStyle}>Connected</h1>
            <p style={descStyle}>
              You are controlling the desktop portfolio.
            </p>

            {/* Gyro visualization */}
            <div style={gyroStyle}>
              <div style={gyroBarWrap}>
                <span style={gyroLabel}>α</span>
                <div style={gyroTrack}>
                  <div
                    style={{
                      ...gyroBar,
                      width: `${
                        Math.abs(((gyro.alpha % 360) / 360) * 100)
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div style={gyroBarWrap}>
                <span style={gyroLabel}>β</span>
                <div style={gyroTrack}>
                  <div
                    style={{
                      ...gyroBar,
                      width: `${Math.abs((gyro.beta / 180) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div style={gyroBarWrap}>
                <span style={gyroLabel}>γ</span>
                <div style={gyroTrack}>
                  <div
                    style={{
                      ...gyroBar,
                      width: `${Math.abs((gyro.gamma / 90) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={touchPadStyle}>
              <p style={touchLabel}>Swipe here to navigate</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 style={titleStyle}>Connection Lost</h1>
            <p style={descStyle}>
              The desktop session may have ended. Reload to try
              again.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Inline styles for the standalone phone page (no CSS modules needed)
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#060606",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  fontFamily:
    "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  color: "#f2ede8",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  textAlign: "center",
};

const spinnerContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 24,
};

const spinnerStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  border: "2px solid rgba(255,255,255,0.1)",
  borderTopColor: "#d4ff1e",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const iconStyle: React.CSSProperties = {
  marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 400,
  letterSpacing: "0.04em",
  marginBottom: 12,
};

const descStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#777777",
  lineHeight: 1.6,
  marginBottom: 32,
};

const codeStyle: React.CSSProperties = {
  color: "#d4ff1e",
  fontFamily: "monospace",
};

const gyroStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 32,
  padding: "20px 24px",
  background: "rgba(17,17,17,0.5)",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.06)",
};

const gyroBarWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const gyroLabel: React.CSSProperties = {
  fontSize: 14,
  color: "#d4ff1e",
  fontFamily: "monospace",
  width: 20,
};

const gyroTrack: React.CSSProperties = {
  flex: 1,
  height: 4,
  background: "rgba(255,255,255,0.06)",
  borderRadius: 2,
  overflow: "hidden",
};

const gyroBar: React.CSSProperties = {
  height: "100%",
  background: "#d4ff1e",
  borderRadius: 2,
  transition: "width 0.1s",
};

const touchPadStyle: React.CSSProperties = {
  width: "100%",
  height: 200,
  border: "1px dashed rgba(212,255,30,0.2)",
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const touchLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#777",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};
