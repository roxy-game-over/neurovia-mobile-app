import viBase from "@/assets/vi-base.png.asset.json";
import viCare from "@/assets/vi-care.png.asset.json";
import viCelebrate from "@/assets/vi-celebrate.png.asset.json";
import viChat from "@/assets/vi-chat.png.asset.json";
import viEnergy from "@/assets/vi-energy.png.asset.json";
import viGame from "@/assets/vi-game.png.asset.json";
import viGarden from "@/assets/vi-garden.png.asset.json";
import viMeditate from "@/assets/vi-meditate.png.asset.json";
import viRead from "@/assets/vi-read.png.asset.json";
import viSleep from "@/assets/vi-sleep.png.asset.json";
import viThink from "@/assets/vi-think.png.asset.json";

export const VI = {
  base: viBase.url,
  energy: viEnergy.url,
  sleep: viSleep.url,
  celebrate: viCelebrate.url,
  game: viGame.url,
  read: viRead.url,
  meditate: viMeditate.url,
  care: viCare.url,
  garden: viGarden.url,
  think: viThink.url,
  chat: viChat.url,
} as const;

export type ViMood = keyof typeof VI;

export function Vi({
  mood = "base",
  className = "",
  float = true,
}: {
  mood?: ViMood;
  className?: string;
  float?: boolean;
}) {
  return (
    <img
      src={VI[mood]}
      alt="VI, your Neurovia companion"
      loading="lazy"
      width={1024}
      height={1024}
      className={`${float ? "anim-float " : ""}object-contain ${className}`}
    />
  );
}

/** The Neurovia leaf mark — a soft two-lobed leaf with a stem. */
export function LeafMark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} style={style} fill="none">
      <path
        d="M12 2.8c5.2 3.2 8 7.2 8 11.1a8 8 0 1 1-16 0c0-3.9 2.8-7.9 8-11.1Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M12 6.5v12" stroke="var(--app-bg)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Neurovia wordmark: lowercase serif-free wordmark in the app text colour with
 * the `o` and `ia` in brand violet and the leaf mark as a lockup accent.
 */
export function Wordmark({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <p
        className="font-bold leading-none tracking-[-0.03em] text-[var(--app-text)]"
        style={{ fontSize: size }}
      >
        neur
        <span className="text-[var(--app-accent)]">o</span>v<span className="text-[var(--app-accent)]">ia</span>
      </p>
      <LeafMark
        className="-mt-2 text-[var(--app-mint)]"
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
    </div>
  );
}
