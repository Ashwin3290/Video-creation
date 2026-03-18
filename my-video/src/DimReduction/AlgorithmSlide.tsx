import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Algorithm } from "./algorithms";
import { ScatterViz } from "./ScatterViz";

// ─── helpers ──────────────────────────────────────────────────────────────────

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

// ─── Formula row ──────────────────────────────────────────────────────────────

const FormulaRow: React.FC<{
  label: string;
  expr: string;
  color: string;
  opacity: number;
  offsetY: number;
}> = ({ label, expr, color, opacity, offsetY }) => (
  <div
    style={{
      opacity,
      transform: `translateY(${offsetY}px)`,
      marginBottom: 22,
      borderLeft: `5px solid ${color}`,
      paddingLeft: 28,
    }}
  >
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 32,
        color: color,
        letterSpacing: "0.04em",
        marginBottom: 6,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
        letterSpacing: "0.06em",
        lineHeight: 1.35,
        wordBreak: "break-word",
      }}
    >
      {expr}
    </div>
  </div>
);

// ─── Fact bullet ──────────────────────────────────────────────────────────────

const FactBullet: React.FC<{
  text: string;
  color: string;
  opacity: number;
  offsetX: number;
}> = ({ text, color, opacity, offsetX }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 22,
      opacity,
      transform: `translateX(${offsetX}px)`,
      marginBottom: 26,
    }}
  >
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: color,
        marginTop: 10,
        flexShrink: 0,
        boxShadow: `0 0 12px ${color}`,
      }}
    />
    <div
      style={{
        fontFamily: "sans-serif",
        fontSize: 46,
        color: "#E2E8F0",
        lineHeight: 1.45,
        fontWeight: 400,
      }}
    >
      {text}
    </div>
  </div>
);

// ─── Main slide ───────────────────────────────────────────────────────────────

export const AlgorithmSlide: React.FC<{
  algo: Algorithm;
  startFrame: number;
}> = ({ algo, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // ── timing (out of 270 frames = 9s) ──
  // 0-40:   header slides in
  // 30-150: formulas stagger in
  // 140-230: facts stagger in
  // 20-270:  scatter viz progress 0→1

  const headerSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 80, mass: 0.8 },
    durationInFrames: 40,
  });

  const headerY = interpolate(headerSpring, [0, 1], [-80, 0]);
  const headerO = clamp01(interpolate(localFrame, [0, 30], [0, 1]));

  // formula stagger: 3 formulas, each offset by 18 frames
  const formulaOpacities = algo.formulas.map((_, i) => {
    const start = 30 + i * 22;
    return clamp01(interpolate(localFrame, [start, start + 28], [0, 1]));
  });
  const formulaOffsets = algo.formulas.map((_, i) => {
    const start = 30 + i * 22;
    const p = clamp01(interpolate(localFrame, [start, start + 28], [0, 1]));
    return interpolate(p, [0, 1], [40, 0]);
  });

  // facts stagger: 3 facts, each offset by 20 frames
  const factOpacities = algo.facts.map((_, i) => {
    const start = 145 + i * 22;
    return clamp01(interpolate(localFrame, [start, start + 30], [0, 1]));
  });
  const factOffsets = algo.facts.map((_, i) => {
    const start = 145 + i * 22;
    const p = clamp01(interpolate(localFrame, [start, start + 30], [0, 1]));
    return interpolate(p, [0, 1], [-60, 0]);
  });

  // viz progress
  const vizProgress = clamp01(interpolate(localFrame, [20, 270], [0, 1]));

  // background gradient color stops
  const [bg0, bg1] = algo.bg;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${bg0} 0%, ${bg1} 100%)`,
        padding: "0 52px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* subtle glow orb behind content */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${algo.glow}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── HEADER ── */}
      <div
        style={{
          paddingTop: 90,
          transform: `translateY(${headerY}px)`,
          opacity: headerO,
        }}
      >
        {/* tags row */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Tag
            label={algo.type}
            color={algo.color}
            bg={`${algo.glow}22`}
          />
          <Tag
            label={algo.supervised ? "Supervised" : "Unsupervised"}
            color={algo.supervised ? "#FB923C" : "#34D399"}
            bg={algo.supervised ? "#FB923C18" : "#34D39918"}
          />
          <Tag
            label={algo.year}
            color="#94A3B8"
            bg="#94A3B812"
          />
        </div>

        {/* big name */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 148,
            color: algo.color,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            marginBottom: 12,
            textShadow: `0 0 60px ${algo.glow}60`,
          }}
        >
          {algo.name}
        </div>

        {/* full name + credit */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 42,
            color: "#94A3B8",
            letterSpacing: "0.01em",
            marginBottom: 8,
          }}
        >
          {algo.fullName}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 30,
            color: `${algo.color}99`,
          }}
        >
          {algo.credit} · Complexity: {algo.complexity}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${algo.color}88 0%, transparent 100%)`,
          margin: "32px 0 36px",
          opacity: headerO,
        }}
      />

      {/* ── FORMULA BOX ── */}
      <div
        style={{
          background: "#ffffff07",
          border: `1px solid ${algo.color}30`,
          borderRadius: 20,
          padding: "36px 40px 28px",
          marginBottom: 32,
        }}
      >
        {algo.formulas.map((f, i) => (
          <FormulaRow
            key={i}
            label={f.label}
            expr={f.expr}
            color={algo.color}
            opacity={formulaOpacities[i]}
            offsetY={formulaOffsets[i]}
          />
        ))}
      </div>

      {/* ── VISUALIZATION ── */}
      <div
        style={{
          height: 560,
          background: "#ffffff05",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 32,
          border: `1px solid ${algo.color}18`,
        }}
      >
        <ScatterViz
          algId={algo.id}
          progress={vizProgress}
          color={algo.color}
        />
      </div>

      {/* ── FACTS ── */}
      <div style={{ paddingBottom: 60 }}>
        {algo.facts.map((f, i) => (
          <FactBullet
            key={i}
            text={f}
            color={algo.color}
            opacity={factOpacities[i]}
            offsetX={factOffsets[i]}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Small tag badge ──────────────────────────────────────────────────────────

const Tag: React.FC<{ label: string; color: string; bg: string }> = ({
  label,
  color,
  bg,
}) => (
  <div
    style={{
      fontFamily: "monospace",
      fontSize: 28,
      fontWeight: 700,
      color,
      background: bg,
      border: `1px solid ${color}44`,
      borderRadius: 8,
      padding: "6px 18px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    {label}
  </div>
);
