import viArtist from "@/assets/vi-artist.png.asset.json";
import viCelebration from "@/assets/vi-celebration.png.asset.json";
import viClassic from "@/assets/vi-classic.png.asset.json";
import viCozy from "@/assets/vi-cozy.png.asset.json";
import viDoctor from "@/assets/vi-doctor.png.asset.json";
import viExplorer from "@/assets/vi-explorer.png.asset.json";
import viGamer from "@/assets/vi-gamer.png.asset.json";
import viHeart from "@/assets/vi-heart.png.asset.json";
import viHoodie from "@/assets/vi-hoodie.png.asset.json";
import viMeditator from "@/assets/vi-meditator.png.asset.json";
import viNight from "@/assets/vi-night.png.asset.json";
import viScientist from "@/assets/vi-scientist.png.asset.json";
import viSleepy from "@/assets/vi-sleepy.png.asset.json";
import viSports from "@/assets/vi-sports.png.asset.json";
import viStudent from "@/assets/vi-student.png.asset.json";
import viSuper from "@/assets/vi-super.png.asset.json";
import viTraveler from "@/assets/vi-traveler.png.asset.json";

/**
 * VI mascot poses — the official Neurovia character sheet.
 * Semantic keys map onto the pose that fits each surface.
 */
export const VI = {
  base: viHeart.url,
  heart: viHeart.url,
  classic: viClassic.url,
  chat: viClassic.url,
  energy: viSports.url,
  sports: viSports.url,
  sleep: viSleepy.url,
  sleepy: viSleepy.url,
  celebrate: viCelebration.url,
  celebration: viCelebration.url,
  game: viGamer.url,
  gamer: viGamer.url,
  read: viStudent.url,
  student: viStudent.url,
  meditate: viMeditator.url,
  meditator: viMeditator.url,
  care: viDoctor.url,
  doctor: viDoctor.url,
  garden: viExplorer.url,
  explorer: viExplorer.url,
  think: viScientist.url,
  scientist: viScientist.url,
  hoodie: viHoodie.url,
  cozy: viCozy.url,
  artist: viArtist.url,
  night: viNight.url,
  super: viSuper.url,
  traveler: viTraveler.url,
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
      width={512}
      height={512}
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
