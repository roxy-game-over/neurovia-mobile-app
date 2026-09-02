import {
  Activity,
  BookOpen,
  Brain,
  ChartLine,
  Cloudy,
  Compass,
  Droplets,
  Flower2,
  Gamepad2,
  Grid2x2,
  Hand,
  HeartHandshake,
  Leaf,
  LifeBuoy,
  Lock,
  type LucideIcon,
  Moon,
  NotebookPen,
  Palette,
  Puzzle,
  Shapes,
  ShieldCheck,
  ShoppingBag,
  Sparkle,
  Sprout,
  Stethoscope,
  Target,
  Timer,
  TreeDeciduous,
  TrendingUp,
  UserRound,
  Waves,
  Wind,
} from "lucide-react";

/**
 * Neurovia uses drawn iconography — never emoji — inside the app surfaces.
 * Every icon key maps to a lucide glyph plus a brand tint token.
 */
export const APP_ICONS = {
  breathe: { icon: Wind, tint: "var(--app-mint)" },
  journal: { icon: NotebookPen, tint: "var(--app-gold)" },
  meditate: { icon: Flower2, tint: "var(--app-accent)" },
  sleep: { icon: Moon, tint: "var(--app-accent)" },
  focus: { icon: Target, tint: "var(--app-rose)" },
  ground: { icon: Hand, tint: "var(--app-mint)" },
  reframe: { icon: Brain, tint: "var(--app-accent)" },
  library: { icon: BookOpen, tint: "var(--app-gold)" },
  exercises: { icon: Puzzle, tint: "var(--app-mint)" },
  insights: { icon: ChartLine, tint: "var(--app-rose)" },
  space: { icon: UserRound, tint: "var(--app-accent)" },
  paths: { icon: Compass, tint: "var(--app-accent)" },
  garden: { icon: Leaf, tint: "var(--app-mint)" },
  games: { icon: Gamepad2, tint: "var(--app-gold)" },
  memory: { icon: Grid2x2, tint: "var(--app-accent)" },
  logic: { icon: Shapes, tint: "var(--app-mint)" },
  calm: { icon: Waves, tint: "var(--app-mint)" },
  attention: { icon: Timer, tint: "var(--app-gold)" },
  mood: { icon: Cloudy, tint: "var(--app-rose)" },
  progress: { icon: TrendingUp, tint: "var(--app-mint)" },
  seed: { icon: Sprout, tint: "var(--app-mint)" },
  tree: { icon: TreeDeciduous, tint: "var(--app-mint)" },
  water: { icon: Droplets, tint: "var(--app-mint)" },
  shop: { icon: ShoppingBag, tint: "var(--app-gold)" },
  outfit: { icon: Palette, tint: "var(--app-rose)" },
  psychologist: { icon: HeartHandshake, tint: "var(--app-accent)" },
  psychiatrist: { icon: Stethoscope, tint: "var(--app-mint)" },
  crisis: { icon: LifeBuoy, tint: "var(--app-rose)" },
  safety: { icon: ShieldCheck, tint: "var(--app-mint)" },
  locked: { icon: Lock, tint: "var(--app-text-dim)" },
  spark: { icon: Sparkle, tint: "var(--app-gold)" },
  energy: { icon: Activity, tint: "var(--app-gold)" },
} satisfies Record<string, { icon: LucideIcon; tint: string }>;

export type AppIconKey = keyof typeof APP_ICONS;

/** A tinted, rounded icon chip used across cards, tiles and list rows. */
export function IconChip({
  name,
  size = 44,
  className = "",
  round = false,
}: {
  name: AppIconKey;
  size?: number;
  className?: string;
  round?: boolean;
}) {
  const { icon: Icon, tint } = APP_ICONS[name];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${round ? "rounded-full" : "rounded-2xl"} ${className}`}
      style={{
        width: size,
        height: size,
        background: `color-mix(in oklab, ${tint} 16%, transparent)`,
        color: tint,
      }}
    >
      <Icon style={{ width: size * 0.46, height: size * 0.46 }} strokeWidth={1.9} />
    </span>
  );
}

/** Bare tinted glyph without the chip background. */
export function AppIcon({
  name,
  size = 18,
  className = "",
}: {
  name: AppIconKey;
  size?: number;
  className?: string;
}) {
  const { icon: Icon, tint } = APP_ICONS[name];
  return <Icon className={className} style={{ width: size, height: size, color: tint }} strokeWidth={1.9} />;
}

/**
 * Legacy content lists still carry an emoji field. Map it to a drawn icon so no
 * emoji ever renders in the product surface.
 */
const EMOJI_TO_ICON: Record<string, AppIconKey> = {
  "🌀": "reframe",
  "⚡": "energy",
  "🌙": "sleep",
  "😟": "mood",
  "⏳": "attention",
  "🛡️": "safety",
  "🛡": "safety",
  "💗": "psychologist",
  "🪫": "energy",
  "💬": "space",
  "🌿": "garden",
  "🛏️": "sleep",
  "🛏": "sleep",
  "🎯": "focus",
  "🙂": "mood",
  "👥": "psychologist",
  "🏅": "spark",
  "📱": "attention",
  "🧠": "reframe",
  "🌱": "seed",
  "🪷": "meditate",
  "🤝": "psychologist",
  "✨": "spark",
  "⭐": "spark",
  "📊": "insights",
  "🔒": "locked",
  "❗": "crisis",
  "🫁": "breathe",
  "🧘": "meditate",
  "✍️": "journal",
  "📖": "library",
  "🪞": "space",
  "🌊": "calm",
  "🫧": "calm",
  "🧭": "paths",
  "🚪": "crisis",
  "🧹": "safety",
  "🕯️": "sleep",
  "📥": "journal",
  "🎮": "games",
  "🌳": "tree",
  "🌸": "meditate",
  "🌺": "meditate",
  "🏡": "garden",
  "🌰": "seed",
  "🖐️": "ground",
  "🫂": "psychologist",
  "🧑‍⚕️": "psychologist",
  "🩺": "psychiatrist",
  "👀": "attention",
  "✋": "ground",
  "👂": "calm",
  "👅": "mood",
  "🏷️": "logic",
  "🪜": "memory",
};

export function iconForEmoji(emoji?: string): AppIconKey {
  return (emoji && EMOJI_TO_ICON[emoji]) || "spark";
}
