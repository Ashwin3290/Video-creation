import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import {
  ALGO_FRAMES,
  ALGORITHMS,
  algoStartFrame,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  TOTAL_FRAMES,
} from "./algorithms";
import { AlgorithmSlide } from "./AlgorithmSlide";
import { Intro } from "./Intro";

export { TOTAL_FRAMES };

// ─── Progress bar shown throughout ───────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = frame / TOTAL_FRAMES;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${pct * 100}%`,
        height: 6,
        background: "linear-gradient(90deg, #6366F1, #818CF8)",
        borderRadius: "0 3px 3px 0",
        zIndex: 100,
      }}
    />
  );
};

// ─── Slide transition overlay ─────────────────────────────────────────────────

const SlideTransition: React.FC<{ startFrame: number; color: string }> = ({
  startFrame,
  color,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  // quick flash-in at start of each slide
  const opacity = Math.max(
    0,
    interpolate(local, [0, 8, 18], [0.55, 0.55, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        opacity,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
};

// ─── Outro ────────────────────────────────────────────────────────────────────

const Outro: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const fadeIn = Math.max(0, Math.min(1, local / 30));
  const fadeOut = Math.max(0, Math.min(1, (OUTRO_FRAMES - local) / 20));
  const opacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(175deg, #080818 0%, #02020A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 32,
          letterSpacing: "0.28em",
          color: "#6366F1",
          textTransform: "uppercase",
        }}
      >
        Summary
      </div>

      <div
        style={{
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 76,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Choose the right tool
      </div>

      {/* comparison mini-table */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "90%",
          marginTop: 16,
        }}
      >
        {[
          { name: "PCA / SVD", tag: "Linear · Fast · Interpretable", color: "#C084FC" },
          { name: "LDA", tag: "Linear · Supervised · Classification", color: "#60A5FA" },
          { name: "SNE", tag: "Non-linear · Local structure", color: "#FCD34D" },
          { name: "t-SNE", tag: "Non-linear · Clear clusters · Viz", color: "#FCA5A5" },
          { name: "UMAP", tag: "Non-linear · Fast · Global + local", color: "#67E8F9" },
        ].map((row) => (
          <div
            key={row.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: "#ffffff06",
              borderRadius: 12,
              padding: "16px 24px",
              border: `1px solid ${row.color}28`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 36,
                color: row.color,
                minWidth: 160,
              }}
            >
              {row.name}
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 30,
                color: "#94A3B8",
                lineHeight: 1.4,
              }}
            >
              {row.tag}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export const DimReduction: React.FC = () => {
  const outroStart = INTRO_FRAMES + ALGORITHMS.length * ALGO_FRAMES;

  return (
    <AbsoluteFill style={{ background: "#02020A" }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES + ALGO_FRAMES}>
        <Intro />
      </Sequence>

      {/* Algorithm slides */}
      {ALGORITHMS.map((algo, i) => {
        const start = algoStartFrame(i);
        return (
          <Sequence
            key={algo.id}
            from={start}
            durationInFrames={ALGO_FRAMES + 10}
          >
            <AlgorithmSlide algo={algo} startFrame={start} />
            <SlideTransition startFrame={start} color={algo.glow} />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={outroStart} durationInFrames={OUTRO_FRAMES}>
        <Outro startFrame={outroStart} />
      </Sequence>

      {/* Progress bar — always on top */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
