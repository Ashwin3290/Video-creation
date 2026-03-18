import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ALGORITHMS } from "./algorithms";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 70, mass: 0.9 },
    durationInFrames: 45,
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.6, 1]);
  const titleO = clamp01(interpolate(frame, [0, 25], [0, 1]));

  const subtitleO = clamp01(interpolate(frame, [30, 55], [0, 1]));
  const subtitleY = interpolate(
    clamp01(interpolate(frame, [30, 55], [0, 1])),
    [0, 1],
    [30, 0]
  );

  const chipsO = clamp01(interpolate(frame, [48, 72], [0, 1]));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(175deg, #080818 0%, #02020A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* background grid */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.07 }}
        viewBox="0 0 1080 1920"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`h-${i}`} x1={0} y1={i * 100} x2={1080} y2={i * 100} stroke="white" strokeWidth={1} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1920} stroke="white" strokeWidth={1} />
        ))}
      </svg>

      {/* glow orb */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #6366f128 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* top label */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: "0.28em",
          color: "#6366F1",
          textTransform: "uppercase",
          marginBottom: 40,
          opacity: subtitleO,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Machine Learning · Data Science
      </div>

      {/* main title */}
      <div
        style={{
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 118,
          color: "#FFFFFF",
          textAlign: "center",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          transform: `scale(${titleScale})`,
          opacity: titleO,
          marginBottom: 20,
        }}
      >
        Dimensionality
      </div>
      <div
        style={{
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 118,
          color: "#818CF8",
          textAlign: "center",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          transform: `scale(${titleScale})`,
          opacity: titleO,
          marginBottom: 48,
          textShadow: "0 0 80px #6366f155",
        }}
      >
        Reduction
      </div>

      {/* subtitle */}
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 50,
          color: "#94A3B8",
          textAlign: "center",
          lineHeight: 1.5,
          opacity: subtitleO,
          transform: `translateY(${subtitleY}px)`,
          marginBottom: 80,
          maxWidth: 900,
        }}
      >
        How to compress high-dimensional data while preserving structure
      </div>

      {/* algorithm chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          justifyContent: "center",
          opacity: chipsO,
          transform: `translateY(${interpolate(chipsO, [0, 1], [20, 0])}px)`,
        }}
      >
        {ALGORITHMS.map((a) => (
          <div
            key={a.id}
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 34,
              color: a.color,
              background: `${a.glow}18`,
              border: `1.5px solid ${a.color}55`,
              borderRadius: 10,
              padding: "10px 24px",
              letterSpacing: "0.06em",
            }}
          >
            {a.name}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
