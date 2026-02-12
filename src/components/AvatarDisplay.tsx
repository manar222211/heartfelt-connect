import { cn } from "@/lib/utils";

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  outfit: string;
  accessory: string;
  mood: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "🟡",
  hairStyle: "straight",
  hairColor: "brown",
  eyeStyle: "normal",
  outfit: "casual",
  accessory: "none",
  mood: "😊",
};

const SKIN_COLORS: Record<string, string> = {
  "🟡": "#FFD93D",
  "🟠": "#F4A261",
  "🟤": "#A0522D",
  "⚪": "#FFF0E0",
  "🔵": "#89CFF0",
};

const HAIR_COLOR_MAP: Record<string, string> = {
  brown: "#5C4033",
  black: "#1a1a2e",
  blonde: "#F5D060",
  red: "#C0392B",
  pink: "#FF69B4",
  blue: "#3498DB",
};

const EYE_VARIANTS: Record<string, { left: string; right: string }> = {
  normal: { left: "●", right: "●" },
  wink: { left: "●", right: "‿" },
  stars: { left: "★", right: "★" },
  hearts: { left: "♥", right: "♥" },
};

const MOUTH_MAP: Record<string, string> = {
  "😊": "M 35,58 Q 50,70 65,58",
  "😎": "M 38,60 Q 50,66 62,60",
  "🥰": "M 35,56 Q 50,72 65,56",
  "😜": "M 35,58 Q 50,70 65,58",
  "🤗": "M 32,56 Q 50,74 68,56",
  "😇": "M 38,58 Q 50,66 62,58",
  "🥺": "M 38,62 Q 50,56 62,62",
  "✨": "M 36,58 Q 50,68 64,58",
  "💖": "M 35,56 Q 50,72 65,56",
  "🌟": "M 36,58 Q 50,70 64,58",
};

const ACCESSORY_RENDER: Record<string, (size: number) => React.ReactNode> = {
  none: () => null,
  glasses: (s) => (
    <g>
      <circle cx={s * 0.38} cy={s * 0.42} r={s * 0.1} fill="none" stroke="#333" strokeWidth="2" />
      <circle cx={s * 0.62} cy={s * 0.42} r={s * 0.1} fill="none" stroke="#333" strokeWidth="2" />
      <line x1={s * 0.48} y1={s * 0.42} x2={s * 0.52} y2={s * 0.42} stroke="#333" strokeWidth="2" />
    </g>
  ),
  sunglasses: (s) => (
    <g>
      <rect x={s * 0.27} y={s * 0.36} width={s * 0.2} height={s * 0.14} rx="3" fill="#1a1a2e" opacity="0.85" />
      <rect x={s * 0.53} y={s * 0.36} width={s * 0.2} height={s * 0.14} rx="3" fill="#1a1a2e" opacity="0.85" />
      <line x1={s * 0.47} y1={s * 0.42} x2={s * 0.53} y2={s * 0.42} stroke="#1a1a2e" strokeWidth="2" />
    </g>
  ),
  hat: (s) => (
    <g>
      <ellipse cx={s * 0.5} cy={s * 0.18} rx={s * 0.32} ry={s * 0.06} fill="#333" />
      <rect x={s * 0.32} y={s * 0.04} width={s * 0.36} height={s * 0.15} rx="4" fill="#333" />
    </g>
  ),
  crown: (s) => (
    <g>
      <polygon
        points={`${s * 0.3},${s * 0.2} ${s * 0.35},${s * 0.06} ${s * 0.42},${s * 0.16} ${s * 0.5},${s * 0.02} ${s * 0.58},${s * 0.16} ${s * 0.65},${s * 0.06} ${s * 0.7},${s * 0.2}`}
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="1"
      />
    </g>
  ),
  headphones: (s) => (
    <g>
      <path d={`M ${s * 0.22},${s * 0.4} Q ${s * 0.22},${s * 0.12} ${s * 0.5},${s * 0.12} Q ${s * 0.78},${s * 0.12} ${s * 0.78},${s * 0.4}`} fill="none" stroke="#555" strokeWidth="3" />
      <rect x={s * 0.16} y={s * 0.36} width={s * 0.1} height={s * 0.14} rx="3" fill="#555" />
      <rect x={s * 0.74} y={s * 0.36} width={s * 0.1} height={s * 0.14} rx="3" fill="#555" />
    </g>
  ),
};

const HAIR_RENDER: Record<string, (color: string, s: number) => React.ReactNode> = {
  straight: (c, s) => (
    <g>
      <ellipse cx={s * 0.5} cy={s * 0.22} rx={s * 0.32} ry={s * 0.18} fill={c} />
      <rect x={s * 0.18} y={s * 0.22} width={s * 0.08} height={s * 0.3} rx="4" fill={c} />
      <rect x={s * 0.74} y={s * 0.22} width={s * 0.08} height={s * 0.3} rx="4" fill={c} />
    </g>
  ),
  curly: (c, s) => (
    <g>
      <ellipse cx={s * 0.5} cy={s * 0.2} rx={s * 0.35} ry={s * 0.2} fill={c} />
      <circle cx={s * 0.2} cy={s * 0.3} r={s * 0.08} fill={c} />
      <circle cx={s * 0.8} cy={s * 0.3} r={s * 0.08} fill={c} />
      <circle cx={s * 0.18} cy={s * 0.42} r={s * 0.06} fill={c} />
      <circle cx={s * 0.82} cy={s * 0.42} r={s * 0.06} fill={c} />
    </g>
  ),
  wavy: (c, s) => (
    <g>
      <ellipse cx={s * 0.5} cy={s * 0.22} rx={s * 0.33} ry={s * 0.19} fill={c} />
      <path d={`M ${s * 0.18},${s * 0.28} Q ${s * 0.15},${s * 0.45} ${s * 0.22},${s * 0.52}`} stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d={`M ${s * 0.82},${s * 0.28} Q ${s * 0.85},${s * 0.45} ${s * 0.78},${s * 0.52}`} stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" />
    </g>
  ),
  short: (c, s) => (
    <ellipse cx={s * 0.5} cy={s * 0.24} rx={s * 0.3} ry={s * 0.15} fill={c} />
  ),
  bald: () => null,
};

const OUTFIT_RENDER: Record<string, (s: number) => React.ReactNode> = {
  casual: (s) => <rect x={s * 0.3} y={s * 0.76} width={s * 0.4} height={s * 0.22} rx="6" fill="#4A90D9" />,
  formal: (s) => (
    <g>
      <rect x={s * 0.28} y={s * 0.76} width={s * 0.44} height={s * 0.22} rx="6" fill="#2C3E50" />
      <polygon points={`${s * 0.46},${s * 0.76} ${s * 0.5},${s * 0.88} ${s * 0.54},${s * 0.76}`} fill="#E74C3C" />
    </g>
  ),
  sporty: (s) => <rect x={s * 0.3} y={s * 0.76} width={s * 0.4} height={s * 0.22} rx="6" fill="#27AE60" />,
  creative: (s) => (
    <g>
      <rect x={s * 0.3} y={s * 0.76} width={s * 0.4} height={s * 0.22} rx="6" fill="#8E44AD" />
      <circle cx={s * 0.42} cy={s * 0.84} r="2" fill="#F39C12" />
      <circle cx={s * 0.58} cy={s * 0.86} r="2" fill="#E74C3C" />
    </g>
  ),
  cozy: (s) => <rect x={s * 0.28} y={s * 0.74} width={s * 0.44} height={s * 0.24} rx="8" fill="#D4A574" />,
};

interface AvatarDisplayProps {
  config?: AvatarConfig | null;
  size?: "sm" | "md" | "lg" | "xl";
  blurred?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: "h-10 w-10", svgSize: 40 },
  md: { container: "h-14 w-14", svgSize: 56 },
  lg: { container: "h-20 w-20", svgSize: 80 },
  xl: { container: "h-28 w-28", svgSize: 112 },
};

const AvatarDisplay = ({ config, size = "md", blurred = false, className }: AvatarDisplayProps) => {
  const avatar = config || DEFAULT_AVATAR;
  const { container, svgSize } = sizeMap[size];
  const s = 100; // SVG viewBox size

  const skinColor = SKIN_COLORS[avatar.skinTone] || SKIN_COLORS["🟡"];
  const hairColor = HAIR_COLOR_MAP[avatar.hairColor] || HAIR_COLOR_MAP.brown;
  const eyes = EYE_VARIANTS[avatar.eyeStyle] || EYE_VARIANTS.normal;
  const mouth = MOUTH_MAP[avatar.mood] || MOUTH_MAP["😊"];

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden",
        container,
        blurred && "blur-md",
        className
      )}
      style={{ background: `linear-gradient(135deg, hsl(330 50% 90%), hsl(280 40% 88%))` }}
    >
      <svg
        viewBox={`0 0 ${s} ${s}`}
        width={svgSize}
        height={svgSize}
        className="select-none"
      >
        {/* Face */}
        <circle cx={s * 0.5} cy={s * 0.44} r={s * 0.28} fill={skinColor} />
        {/* Body */}
        {OUTFIT_RENDER[avatar.outfit]?.(s)}
        {/* Hair */}
        {HAIR_RENDER[avatar.hairStyle]?.(hairColor, s)}
        {/* Eyes */}
        {avatar.eyeStyle !== "hearts" && avatar.eyeStyle !== "stars" ? (
          <>
            <circle cx={s * 0.4} cy={s * 0.4} r={s * 0.035} fill="#1a1a2e" />
            <circle cx={s * 0.6} cy={s * 0.4} r={avatar.eyeStyle === "wink" ? 0 : s * 0.035} fill="#1a1a2e" />
            {avatar.eyeStyle === "wink" && (
              <path d={`M ${s * 0.55},${s * 0.4} Q ${s * 0.6},${s * 0.44} ${s * 0.65},${s * 0.4}`} stroke="#1a1a2e" strokeWidth="2" fill="none" />
            )}
            {/* Eye shine */}
            <circle cx={s * 0.41} cy={s * 0.39} r={s * 0.012} fill="white" />
          </>
        ) : (
          <>
            <text x={s * 0.36} y={s * 0.44} fontSize={s * 0.09} textAnchor="middle" fill="#E74C3C">{eyes.left}</text>
            <text x={s * 0.64} y={s * 0.44} fontSize={s * 0.09} textAnchor="middle" fill="#E74C3C">{eyes.right}</text>
          </>
        )}
        {/* Cheeks (blush) */}
        <circle cx={s * 0.3} cy={s * 0.5} r={s * 0.04} fill="#FFB6C1" opacity="0.5" />
        <circle cx={s * 0.7} cy={s * 0.5} r={s * 0.04} fill="#FFB6C1" opacity="0.5" />
        {/* Mouth */}
        <path d={mouth} stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Accessory */}
        {ACCESSORY_RENDER[avatar.accessory]?.(s)}
      </svg>
    </div>
  );
};

export { AvatarDisplay, SKIN_COLORS, HAIR_COLOR_MAP, OUTFIT_RENDER, HAIR_RENDER, ACCESSORY_RENDER };
