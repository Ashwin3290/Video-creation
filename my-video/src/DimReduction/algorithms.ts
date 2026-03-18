export interface Algorithm {
  id: string;
  name: string;
  fullName: string;
  credit: string;
  year: string;
  type: "Linear" | "Non-Linear" | "Matrix";
  supervised: boolean;
  color: string;
  glow: string;
  bg: [string, string];
  formulas: { label: string; expr: string }[];
  facts: string[];
  complexity: string;
}

export const ALGORITHMS: Algorithm[] = [
  {
    id: "pca",
    name: "PCA",
    fullName: "Principal Component Analysis",
    credit: "Pearson",
    year: "1901",
    type: "Linear",
    supervised: false,
    color: "#C084FC",
    glow: "#A855F7",
    bg: ["#1A0533", "#09011A"],
    formulas: [
      { label: "Objective — maximize variance", expr: "max  wᵀΣw   s.t.  wᵀw = 1" },
      { label: "Eigenvalue problem", expr: "Σ w  =  λ w" },
      { label: "Covariance matrix", expr: "Σ  =  ¹⁄ₙ  XᵀX" },
    ],
    facts: [
      "Unsupervised · projects to orthogonal axes of max variance",
      "Solves eigendecomposition of the covariance matrix",
      "Linear only · scale-sensitive · fast & deterministic",
    ],
    complexity: "O(nd² + d³)",
  },
  {
    id: "lda",
    name: "LDA",
    fullName: "Linear Discriminant Analysis",
    credit: "Fisher",
    year: "1936",
    type: "Linear",
    supervised: true,
    color: "#60A5FA",
    glow: "#3B82F6",
    bg: ["#03112E", "#010919"],
    formulas: [
      { label: "Rayleigh quotient", expr: "max J(w)  =  wᵀSᴮw / wᵀSᵂw" },
      { label: "Between-class scatter", expr: "Sᴮ = Σₖ nₖ (μₖ−μ)(μₖ−μ)ᵀ" },
      { label: "Within-class scatter", expr: "Sᵂ = Σₖ Σᵢ∈Cₖ (xᵢ−μₖ)(xᵢ−μₖ)ᵀ" },
    ],
    facts: [
      "Supervised · requires class labels at training time",
      "Maximizes inter-class / intra-class scatter ratio",
      "At most C−1 discriminant components (C = classes)",
    ],
    complexity: "O(nd² + d³)",
  },
  {
    id: "svd",
    name: "SVD",
    fullName: "Singular Value Decomposition",
    credit: "Eckart & Young",
    year: "1936",
    type: "Matrix",
    supervised: false,
    color: "#34D399",
    glow: "#10B981",
    bg: ["#011C10", "#010C06"],
    formulas: [
      { label: "Matrix factorization", expr: "A  =  U Σ Vᵀ" },
      { label: "Orthogonality", expr: "UᵀU = I  ·  VᵀV = I" },
      { label: "Rank-k approximation", expr: "Aₖ  =  Uₖ Σₖ Vₖᵀ" },
    ],
    facts: [
      "Generalizes eigendecomposition to rectangular matrices",
      "Optimal low-rank approx by Eckart-Young theorem",
      "Foundation of PCA, LSI/NLP & recommender systems",
    ],
    complexity: "O(min(m,n)·mn)",
  },
  {
    id: "sne",
    name: "SNE",
    fullName: "Stochastic Neighbor Embedding",
    credit: "Hinton & Roweis",
    year: "2002",
    type: "Non-Linear",
    supervised: false,
    color: "#FCD34D",
    glow: "#F59E0B",
    bg: ["#1C1000", "#0E0800"],
    formulas: [
      { label: "High-D Gaussian similarity", expr: "p_{j|i}  =  exp(−‖xᵢ−xⱼ‖²/2σᵢ²) / Zᵢ" },
      { label: "Low-D similarity", expr: "q_{j|i}  =  exp(−‖yᵢ−yⱼ‖²) / Zᵢ" },
      { label: "Cost — KL divergence", expr: "C  =  Σᵢ KL( Pᵢ ‖ Qᵢ )" },
    ],
    facts: [
      "Converts pairwise distances to Gaussian probabilities",
      "Minimizes KL divergence via gradient descent",
      "Suffers from crowding in low dimensions",
    ],
    complexity: "O(n²)",
  },
  {
    id: "tsne",
    name: "t-SNE",
    fullName: "t-Distributed SNE",
    credit: "van der Maaten & Hinton",
    year: "2008",
    type: "Non-Linear",
    supervised: false,
    color: "#FCA5A5",
    glow: "#EF4444",
    bg: ["#1C0303", "#0F0101"],
    formulas: [
      { label: "Student-t in low-D", expr: "qᵢⱼ  =  (1 + ‖yᵢ−yⱼ‖²)⁻¹ / Z" },
      { label: "Symmetrized affinity", expr: "pᵢⱼ  =  (p_{j|i} + p_{i|j}) / 2n" },
      { label: "Gradient", expr: "∂C/∂yᵢ  =  4 Σⱼ (pᵢⱼ−qᵢⱼ)(yᵢ−yⱼ) q̃ᵢⱼ" },
    ],
    facts: [
      "Heavy t-distribution tail solves crowding problem",
      "Produces clean, well-separated cluster plots",
      "Perplexity parameter ≈ effective neighborhood size",
    ],
    complexity: "O(n²) · O(n log n) w/ BH",
  },
  {
    id: "umap",
    name: "UMAP",
    fullName: "Uniform Manifold Approximation",
    credit: "McInnes et al.",
    year: "2018",
    type: "Non-Linear",
    supervised: false,
    color: "#67E8F9",
    glow: "#06B6D4",
    bg: ["#001820", "#00090D"],
    formulas: [
      { label: "Fuzzy membership strength", expr: "wᵢⱼ  =  exp(−max(0, d(i,j)−ρᵢ)/σᵢ)" },
      { label: "Fuzzy union (symmetrize)", expr: "w̃ᵢⱼ  =  wᵢⱼ + wⱼᵢ − wᵢⱼ · wⱼᵢ" },
      { label: "Low-D kernel", expr: "qᵢⱼ  =  (1 + a ‖yᵢ−yⱼ‖²ᵇ)⁻¹" },
    ],
    facts: [
      "Grounded in Riemannian geometry & fuzzy topology",
      "Preserves both local AND global manifold structure",
      "Faster than t-SNE · supports out-of-sample extension",
    ],
    complexity: "≈ O(n^1.14)",
  },
];

// Slide timing constants (all in frames at 30fps)
export const FPS = 30;
export const INTRO_FRAMES = 90;       // 3s
export const ALGO_FRAMES = 270;       // 9s per algorithm
export const OUTRO_FRAMES = 90;       // 3s
export const TOTAL_FRAMES =
  INTRO_FRAMES + ALGORITHMS.length * ALGO_FRAMES + OUTRO_FRAMES;

export function algoStartFrame(index: number): number {
  return INTRO_FRAMES + index * ALGO_FRAMES;
}
