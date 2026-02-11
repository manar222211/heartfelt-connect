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

const SKIN_EMOJIS: Record<string, string> = {
  "🟡": "👤",
  "🟠": "👤",
  "🟤": "👤",
  "⚪": "👤",
  "🔵": "👤",
};

const OUTFIT_EMOJIS: Record<string, string> = {
  casual: "👕",
  formal: "👔",
  sporty: "🏃",
  creative: "🎨",
  cozy: "🧥",
};

const ACCESSORY_EMOJIS: Record<string, string> = {
  none: "",
  glasses: "👓",
  sunglasses: "🕶️",
  hat: "🎩",
  crown: "👑",
  headphones: "🎧",
};

const HAIR_EMOJIS: Record<string, string> = {
  straight: "💇",
  curly: "🦱",
  wavy: "💆",
  short: "✂️",
  bald: "🧑‍🦲",
};

interface AvatarDisplayProps {
  config?: AvatarConfig | null;
  size?: "sm" | "md" | "lg" | "xl";
  blurred?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-10 w-10 text-lg",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-3xl",
  xl: "h-28 w-28 text-5xl",
};

const AvatarDisplay = ({ config, size = "md", blurred = false, className }: AvatarDisplayProps) => {
  const avatar = config || DEFAULT_AVATAR;

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center gradient-love-soft border-2 border-primary/20 overflow-hidden",
        sizeMap[size],
        blurred && "blur-md",
        className
      )}
    >
      <span className="select-none">{avatar.mood}</span>
      {avatar.accessory !== "none" && ACCESSORY_EMOJIS[avatar.accessory] && (
        <span className="absolute -top-0.5 -right-0.5 text-xs">{ACCESSORY_EMOJIS[avatar.accessory]}</span>
      )}
    </div>
  );
};

export { AvatarDisplay, SKIN_EMOJIS, OUTFIT_EMOJIS, ACCESSORY_EMOJIS, HAIR_EMOJIS };
