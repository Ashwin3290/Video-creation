import React, { useMemo } from "react";
import { interpolate, random } from "remotion";

const W = 980;
const H = 560;
const CX = W / 2;
const CY = H / 2;

// ── helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

// ── PCA ──────────────────────────────────────────────────────────────────────
// Elliptical point cloud with animated PC arrows

const PCAViz: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  const pts = useMemo(() => {
    const a = 190;
    const b = 75;
    const rot = Math.PI / 4;
    return Array.from({ length: 38 }, (_, i) => {
      const t = random(`pca-t-${i}`) * Math.PI * 2;
      const r = 0.35 + random(`pca-r-${i}`) * 0.65;
      const x0 = Math.cos(t) * r * a;
      const y0 = Math.sin(t) * r * b;
      return {
        x: CX + x0 * Math.cos(rot) - y0 * Math.sin(rot),
        y: CY + x0 * Math.sin(rot) + y0 * Math.cos(rot),
      };
    });
  }, []);

  const ptO = clamp01(interpolate(progress, [0, 0.25], [0, 1]));
  const pc1 = clamp01(interpolate(progress, [0.25, 0.55], [0, 230]));
  const pc2 = clamp01(interpolate(progress, [0.45, 0.75], [0, 95]));
  const c45 = Math.cos(Math.PI / 4);
  const s45 = Math.sin(Math.PI / 4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {/* subtle axes */}
      <line x1={0} y1={CY} x2={W} y2={CY} stroke="#ffffff12" strokeWidth={1} />
      <line x1={CX} y1={0} x2={CX} y2={H} stroke="#ffffff12" strokeWidth={1} />

      {/* data points */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={8}
          fill={color}
          opacity={ptO * (0.35 + random(`pca-a-${i}`) * 0.55)}
        />
      ))}

      {/* PC1 — major axis */}
      <line
        x1={CX - pc1 * c45}
        y1={CY - pc1 * s45}
        x2={CX + pc1 * c45}
        y2={CY + pc1 * s45}
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={ptO}
      />
      {pc1 > 10 && (
        <text
          x={CX + pc1 * c45 + 14}
          y={CY + pc1 * s45 + 10}
          fill="white"
          fontSize={34}
          fontWeight="bold"
          fontFamily="monospace"
          opacity={ptO}
        >
          PC1
        </text>
      )}

      {/* PC2 — minor axis */}
      <line
        x1={CX - pc2 * s45}
        y1={CY + pc2 * c45}
        x2={CX + pc2 * s45}
        y2={CY - pc2 * c45}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="10 5"
        opacity={ptO}
      />
      {pc2 > 10 && (
        <text
          x={CX + pc2 * s45 + 14}
          y={CY - pc2 * c45}
          fill={color}
          fontSize={30}
          fontWeight="bold"
          fontFamily="monospace"
          opacity={ptO}
        >
          PC2
        </text>
      )}

      {/* variance label */}
      {progress > 0.6 && (
        <text
          x={20}
          y={H - 18}
          fill="#ffffff60"
          fontSize={26}
          fontFamily="monospace"
          opacity={clamp01(interpolate(progress, [0.6, 0.8], [0, 1]))}
        >
          Explained variance: PC1 ≈ 85% · PC2 ≈ 12%
        </text>
      )}
    </svg>
  );
};

// ── LDA ──────────────────────────────────────────────────────────────────────
// Two labeled clusters + discriminant direction

const LDAViz: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  const clsA = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: CX - 170 + (random(`lda-ax-${i}`) - 0.5) * 140,
        y: CY + 50 + (random(`lda-ay-${i}`) - 0.5) * 160,
      })),
    []
  );
  const clsB = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: CX + 170 + (random(`lda-bx-${i}`) - 0.5) * 140,
        y: CY - 50 + (random(`lda-by-${i}`) - 0.5) * 160,
      })),
    []
  );

  const ptO = clamp01(interpolate(progress, [0, 0.25], [0, 1]));
  const lineP = clamp01(interpolate(progress, [0.3, 0.65], [0, 1]));
  const projP = clamp01(interpolate(progress, [0.55, 0.85], [0, 1]));

  // LDA direction: roughly from clsA centroid to clsB centroid
  const dx = 340;
  const dy = -100;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;

  // discriminant boundary (perpendicular to LDA direction, through midpoint)
  const bx = CX;
  const by = CY;
  const bScale = 220;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {/* Class A */}
      {clsA.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={9}
          fill="#60A5FA"
          opacity={ptO * 0.85}
        />
      ))}
      {/* Class B */}
      {clsB.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={9}
          fill="#FB923C"
          opacity={ptO * 0.85}
        />
      ))}

      {/* class labels */}
      {ptO > 0.5 && (
        <>
          <text
            x={CX - 220}
            y={CY + 190}
            fill="#60A5FA"
            fontSize={30}
            fontWeight="bold"
            fontFamily="sans-serif"
            opacity={ptO}
          >
            Class A
          </text>
          <text
            x={CX + 130}
            y={CY - 155}
            fill="#FB923C"
            fontSize={30}
            fontWeight="bold"
            fontFamily="sans-serif"
            opacity={ptO}
          >
            Class B
          </text>
        </>
      )}

      {/* LDA direction arrow */}
      <line
        x1={CX - ux * 220 * lineP}
        y1={CY - uy * 220 * lineP}
        x2={CX + ux * 220 * lineP}
        y2={CY + uy * 220 * lineP}
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={lineP}
      />

      {/* Decision boundary */}
      <line
        x1={bx - uy * bScale * projP}
        y1={by + ux * bScale * projP}
        x2={bx + uy * bScale * projP}
        y2={by - ux * bScale * projP}
        stroke={color}
        strokeWidth={3}
        strokeDasharray="12 6"
        opacity={projP}
      />
      {projP > 0.5 && (
        <text
          x={bx + uy * bScale + 10}
          y={by - ux * bScale - 10}
          fill={color}
          fontSize={28}
          fontFamily="monospace"
          opacity={projP}
        >
          boundary
        </text>
      )}
      {lineP > 0.4 && (
        <text
          x={CX + ux * 230}
          y={CY + uy * 230}
          fill="white"
          fontSize={30}
          fontWeight="bold"
          fontFamily="monospace"
          opacity={lineP}
        >
          w*
        </text>
      )}
    </svg>
  );
};

// ── SVD ──────────────────────────────────────────────────────────────────────
// Block diagram: A = U × Σ × Vᵀ

const SVDViz: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  const fadeIn = clamp01(interpolate(progress, [0, 0.3], [0, 1]));
  const blockIn = clamp01(interpolate(progress, [0.15, 0.5], [0, 1]));
  const sigmaIn = clamp01(interpolate(progress, [0.3, 0.65], [0, 1]));
  const vtIn = clamp01(interpolate(progress, [0.5, 0.8], [0, 1]));

  // A matrix: 5 rows × 7 cols
  const rows = 5;
  const cols = 7;
  const cellW = 52;
  const cellH = 52;
  const gap = 4;

  // U: 5×5, Sigma: 5×7 (diagonal), VT: 7×7
  const uCols = 5;
  const sigRows = 5;
  const sigCols = 7;
  const vtRows = 7;

  const yMid = CY - 20;

  // positions
  const aX = 40;
  const aY = yMid - (rows * (cellH + gap)) / 2;

  const eqX = aX + cols * (cellW + gap) + 25;
  const uX = eqX + 55;
  const uY = yMid - (rows * (cellH + gap)) / 2;

  const multX1 = uX + uCols * (cellW + gap) + 20;
  const sX = multX1 + 40;
  const sY = yMid - (sigRows * (cellH + gap)) / 2;

  const multX2 = sX + sigCols * (cellW + gap) + 20;
  const vtX = multX2 + 40;
  const vtY = yMid - (vtRows * (cellH + gap)) / 2;

  // color map by position
  const heatColor = (v: number) => {
    const h = Math.round(v * 200 + 160);
    return `hsl(${h}, 70%, 55%)`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {/* A matrix */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const v = random(`svd-a-${r}-${c}`);
          return (
            <rect
              key={`a-${r}-${c}`}
              x={aX + c * (cellW + gap)}
              y={aY + r * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={4}
              fill={heatColor(v)}
              opacity={fadeIn * 0.9}
            />
          );
        })
      )}
      <text
        x={aX + (cols * (cellW + gap)) / 2 - 12}
        y={aY - 18}
        fill="white"
        fontSize={34}
        fontWeight="bold"
        fontFamily="monospace"
        opacity={fadeIn}
        textAnchor="middle"
      >
        A
      </text>

      {/* = */}
      <text
        x={eqX}
        y={yMid + 14}
        fill="white"
        fontSize={48}
        fontFamily="monospace"
        opacity={blockIn}
      >
        =
      </text>

      {/* U matrix */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: uCols }, (_, c) => {
          const v = random(`svd-u-${r}-${c}`);
          return (
            <rect
              key={`u-${r}-${c}`}
              x={uX + c * (cellW + gap)}
              y={uY + r * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={4}
              fill="#A78BFA"
              opacity={blockIn * (0.3 + v * 0.6)}
            />
          );
        })
      )}
      <text
        x={uX + (uCols * (cellW + gap)) / 2}
        y={uY - 18}
        fill="#A78BFA"
        fontSize={32}
        fontWeight="bold"
        fontFamily="monospace"
        opacity={blockIn}
        textAnchor="middle"
      >
        U
      </text>

      {/* × */}
      <text
        x={multX1}
        y={yMid + 14}
        fill="white"
        fontSize={40}
        fontFamily="monospace"
        opacity={sigmaIn}
      >
        ×
      </text>

      {/* Σ matrix (diagonal) */}
      {Array.from({ length: sigRows }, (_, r) =>
        Array.from({ length: sigCols }, (_, c) => {
          const isDiag = r === c;
          return (
            <rect
              key={`s-${r}-${c}`}
              x={sX + c * (cellW + gap)}
              y={sY + r * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={4}
              fill={isDiag ? color : "#ffffff08"}
              opacity={sigmaIn * (isDiag ? 0.9 : 0.5)}
            />
          );
        })
      )}
      <text
        x={sX + (sigCols * (cellW + gap)) / 2}
        y={sY - 18}
        fill={color}
        fontSize={32}
        fontWeight="bold"
        fontFamily="monospace"
        opacity={sigmaIn}
        textAnchor="middle"
      >
        Σ
      </text>

      {/* × */}
      <text
        x={multX2}
        y={yMid + 14}
        fill="white"
        fontSize={40}
        fontFamily="monospace"
        opacity={vtIn}
      >
        ×
      </text>

      {/* Vᵀ matrix */}
      {Array.from({ length: vtRows }, (_, r) =>
        Array.from({ length: vtRows }, (_, c) => {
          const v = random(`svd-v-${r}-${c}`);
          return (
            <rect
              key={`v-${r}-${c}`}
              x={vtX + c * (cellW + gap)}
              y={vtY + r * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={4}
              fill="#F472B6"
              opacity={vtIn * (0.25 + v * 0.65)}
            />
          );
        })
      )}
      <text
        x={vtX + (vtRows * (cellW + gap)) / 2}
        y={vtY - 18}
        fill="#F472B6"
        fontSize={32}
        fontWeight="bold"
        fontFamily="monospace"
        opacity={vtIn}
        textAnchor="middle"
      >
        Vᵀ
      </text>

      {/* rank-k annotation */}
      {progress > 0.75 && (
        <text
          x={20}
          y={H - 18}
          fill="#ffffff55"
          fontSize={26}
          fontFamily="monospace"
          opacity={clamp01(interpolate(progress, [0.75, 0.9], [0, 1]))}
        >
          Keep top-k singular values → best rank-k approximation
        </text>
      )}
    </svg>
  );
};

// ── SNE ───────────────────────────────────────────────────────────────────────
// Points in 4 clusters, neighbors connected with faint lines

const SNEViz: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  const clusterCenters = [
    { x: CX - 210, y: CY - 110 },
    { x: CX + 210, y: CY - 110 },
    { x: CX - 160, y: CY + 140 },
    { x: CX + 170, y: CY + 130 },
  ];
  const clusterColors = ["#60A5FA", "#FB923C", "#34D399", "#F472B6"];

  const pts = useMemo(() => {
    return clusterCenters.flatMap((c, ci) =>
      Array.from({ length: 14 }, (_, i) => ({
        cx: c.x + (random(`sne-x-${ci}-${i}`) - 0.5) * 160,
        cy: c.y + (random(`sne-y-${ci}-${i}`) - 0.5) * 140,
        color: clusterColors[ci],
        ci,
        i,
      }))
    );
  }, []);

  const ptO = clamp01(interpolate(progress, [0, 0.25], [0, 1]));
  const lineO = clamp01(interpolate(progress, [0.2, 0.55], [0, 0.25]));
  const circleO = clamp01(interpolate(progress, [0.45, 0.75], [0, 1]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {/* neighbor lines within each cluster */}
      {pts.map((a, ai) =>
        pts.map((b, bi) => {
          if (bi <= ai || a.ci !== b.ci) return null;
          const d = Math.hypot(a.cx - b.cx, a.cy - b.cy);
          if (d > 110) return null;
          return (
            <line
              key={`${ai}-${bi}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke={a.color}
              strokeWidth={1.5}
              opacity={lineO * (1 - d / 110)}
            />
          );
        })
      )}

      {/* cluster boundary circles */}
      {clusterCenters.map((c, ci) => (
        <circle
          key={`ring-${ci}`}
          cx={c.x}
          cy={c.y}
          r={100}
          fill="none"
          stroke={clusterColors[ci]}
          strokeWidth={2}
          strokeDasharray="8 5"
          opacity={circleO * 0.4}
        />
      ))}

      {/* data points */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={8}
          fill={p.color}
          opacity={ptO * 0.85}
        />
      ))}

      {/* label */}
      {progress > 0.6 && (
        <text
          x={20}
          y={H - 18}
          fill="#ffffff55"
          fontSize={26}
          fontFamily="monospace"
          opacity={clamp01(interpolate(progress, [0.6, 0.8], [0, 1]))}
        >
          {"Nearby points in high-D → high p(j|i) probability"}
        </text>
      )}
    </svg>
  );
};

// ── t-SNE ─────────────────────────────────────────────────────────────────────
// Well-separated clusters (better than SNE)

const TSNEViz: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  // 5 clean, separated clusters arranged in a circle
  const k = 5;
  const R = 180;
  const clusterColors = ["#60A5FA", "#FB923C", "#34D399", "#F472B6", "#FCD34D"];
  const centers = Array.from({ length: k }, (_, i) => {
    const a = (i / k) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
  });

  const pts = useMemo(() => {
    return centers.flatMap((c, ci) =>
      Array.from({ length: 12 }, (_, i) => {
        const startX = CX + (random(`tsne-sx-${ci}-${i}`) - 0.5) * 800;
        const startY = CY + (random(`tsne-sy-${ci}-${i}`) - 0.5) * 500;
        return {
          sx: startX,
          sy: startY,
          tx: c.x + (random(`tsne-tx-${ci}-${i}`) - 0.5) * 75,
          ty: c.y + (random(`tsne-ty-${ci}-${i}`) - 0.5) * 75,
          color: clusterColors[ci],
        };
      })
    );
  }, []);

  const morph = clamp01(interpolate(progress, [0.05, 0.7], [0, 1]));
  const ptO = clamp01(interpolate(progress, [0, 0.15], [0, 1]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={lerp(p.sx, p.tx, morph)}
          cy={lerp(p.sy, p.ty, morph)}
          r={8}
          fill={p.color}
          opacity={ptO * 0.88}
        />
      ))}

      {/* cluster labels when settled */}
      {morph > 0.7 &&
        centers.map((c, ci) => (
          <text
            key={ci}
            x={c.x}
            y={c.y - 55}
            fill={clusterColors[ci]}
            fontSize={26}
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
            opacity={clamp01(interpolate(morph, [0.7, 0.9], [0, 1]))}
          >
            C{ci + 1}
          </text>
        ))}

      {progress > 0.7 && (
        <text
          x={20}
          y={H - 18}
          fill="#ffffff55"
          fontSize={26}
          fontFamily="monospace"
          opacity={clamp01(interpolate(progress, [0.7, 0.85], [0, 1]))}
        >
          t-distribution tail → repels dissimilar points more strongly
        </text>
      )}
    </svg>
  );
};

// ── UMAP ─────────────────────────────────────────────────────────────────────
// S-curve manifold: points transition from random → manifold shape

const UMAPViz: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  const N = 60;
  const pts = useMemo(() => {
    return Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1); // 0..1 along the manifold
      // S-curve target positions
      const angle = t * Math.PI * 1.5;
      const tz =
        t < 0.5
          ? CX - 250 + t * 450 + Math.cos(angle) * 35
          : CX - 250 + t * 450 + Math.cos(angle) * 35;
      const ty = CY + Math.sin(angle * 2) * 160 * (t < 0.5 ? 1 : -1);
      return {
        sx: 80 + random(`umap-sx-${i}`) * (W - 160),
        sy: 60 + random(`umap-sy-${i}`) * (H - 120),
        tx: tz,
        ty,
        t,
      };
    });
  }, []);

  const morph = clamp01(interpolate(progress, [0.05, 0.72], [0, 1]));
  const ptO = clamp01(interpolate(progress, [0, 0.15], [0, 1]));

  // Hue along manifold
  const ptColor = (t: number) => `hsl(${170 + t * 140}, 80%, 60%)`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {/* connect sequential manifold points when mostly settled */}
      {morph > 0.55 &&
        pts.map((p, i) => {
          if (i === 0) return null;
          const prev = pts[i - 1];
          const cx1 = lerp(p.sx, p.tx, morph);
          const cy1 = lerp(p.sy, p.ty, morph);
          const cx2 = lerp(prev.sx, prev.tx, morph);
          const cy2 = lerp(prev.sy, prev.ty, morph);
          return (
            <line
              key={`l-${i}`}
              x1={cx2}
              y1={cy2}
              x2={cx1}
              y2={cy1}
              stroke={ptColor(p.t)}
              strokeWidth={2}
              opacity={clamp01(interpolate(morph, [0.55, 0.75], [0, 0.5]))}
            />
          );
        })}

      {pts.map((p, i) => (
        <circle
          key={i}
          cx={lerp(p.sx, p.tx, morph)}
          cy={lerp(p.sy, p.ty, morph)}
          r={8}
          fill={ptColor(p.t)}
          opacity={ptO * 0.9}
        />
      ))}

      {progress > 0.68 && (
        <text
          x={20}
          y={H - 18}
          fill="#ffffff55"
          fontSize={26}
          fontFamily="monospace"
          opacity={clamp01(interpolate(progress, [0.68, 0.85], [0, 1]))}
        >
          Fuzzy topology preserves manifold geometry
        </text>
      )}
    </svg>
  );
};

// ── Dispatcher ────────────────────────────────────────────────────────────────

export const ScatterViz: React.FC<{
  algId: string;
  progress: number;
  color: string;
}> = ({ algId, progress, color }) => {
  switch (algId) {
    case "pca":
      return <PCAViz progress={progress} color={color} />;
    case "lda":
      return <LDAViz progress={progress} color={color} />;
    case "svd":
      return <SVDViz progress={progress} color={color} />;
    case "sne":
      return <SNEViz progress={progress} color={color} />;
    case "tsne":
      return <TSNEViz progress={progress} color={color} />;
    case "umap":
      return <UMAPViz progress={progress} color={color} />;
    default:
      return null;
  }
};
