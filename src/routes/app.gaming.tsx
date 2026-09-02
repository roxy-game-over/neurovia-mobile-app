import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { VI } from "@/components/app/Brand";
import { AppIcon, IconChip } from "@/components/app/Icons";
import { GAME_CATEGORIES, MIND_GAMES, type GameCategoryId } from "@/content/app-play";
import { useAppAuth } from "@/lib/app/auth";

export const Route = createFileRoute("/app/gaming")({ component: GameZone });

function GameZone() {
  const { profile } = useAppAuth();
  const [category, setCategory] = useState<GameCategoryId | "all">("all");

  const coins = profile?.coins ?? 0;
  const practices = profile?.practices_completed ?? 0;
  const featured = MIND_GAMES.filter((g) => g.featured);
  const list = category === "all" ? MIND_GAMES : MIND_GAMES.filter((g) => g.category === category);

  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        {/* Header */}
        <div className="app-card relative overflow-hidden p-5">
          <div className="max-w-[64%]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--app-accent)]">
              Game Zone
            </p>
            <h1 className="mt-1 text-[24px] font-bold leading-tight">Play your way calmer.</h1>
            <p className="mt-1.5 text-[13px] leading-snug text-[var(--app-text-dim)]">
              Minutes, not hours. Every finished game waters a seed in your Garden.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--app-surface-2)] px-3 py-1.5 text-[12px] font-semibold">
              <AppIcon name="spark" size={14} /> {coins} coins
            </span>
          </div>
          <img
            src={VI.game}
            alt=""
            loading="lazy"
            className="anim-float pointer-events-none absolute -bottom-3 -right-4 size-32 object-contain"
          />
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Games played", value: practices, icon: "games" },
            { label: "Coins earned", value: coins, icon: "spark" },
            { label: "Minutes played", value: practices * 4, icon: "progress" },
          ].map((s) => (
            <div key={s.label} className="app-card flex flex-col items-center gap-1 px-2 py-3.5">
              <AppIcon name={s.icon as "games"} size={17} />
              <strong className="text-[18px] leading-none">{s.value}</strong>
              <span className="text-center text-[10.5px] leading-tight text-[var(--app-text-dim)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Featured */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[17px] font-bold">Featured Games</h2>
          <span className="text-[12px] text-[var(--app-text-dim)]">{featured.length} picked for you</span>
        </div>
        <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {featured.map((game) => (
            <Link
              key={game.id}
              to={game.to}
              className="app-card flex min-w-[210px] max-w-[210px] flex-col p-4"
            >
              <IconChip name={game.icon} size={44} />
              <strong className="mt-3 text-[15px]">{game.title}</strong>
              <span className="mt-1 text-[12px] leading-snug text-[var(--app-text-dim)]">{game.body}</span>
              <span className="mt-3 flex items-center gap-2 text-[11px] text-[var(--app-text-dim)]">
                <span className="rounded-full bg-[var(--app-surface-2)] px-2 py-0.5">{game.minutes} min</span>
                {game.coins > 0 && (
                  <span className="rounded-full bg-[var(--app-accent)]/14 px-2 py-0.5 font-semibold text-[var(--app-accent)]">
                    +{game.coins} coins
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>

        {/* Categories */}
        <h2 className="mt-6 text-[17px] font-bold">Categories</h2>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-semibold ${
              category === "all"
                ? "border-transparent bg-[var(--app-accent)] text-[var(--app-on-accent)]"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-dim)]"
            }`}
          >
            All
          </button>
          {GAME_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold ${
                category === c.id
                  ? "border-transparent bg-[var(--app-accent)] text-[var(--app-on-accent)]"
                  : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-dim)]"
              }`}
            >
              <AppIcon name={c.icon} size={14} /> {c.label}
            </button>
          ))}
        </div>

        {/* All games */}
        <div className="mt-4 space-y-3">
          {list.map((game) => (
            <Link key={game.id} to={game.to} className="app-card flex items-center gap-3.5 p-4">
              <IconChip name={game.icon} size={46} />
              <span className="min-w-0 flex-1">
                <strong className="block text-[15px]">{game.title}</strong>
                <span className="block text-[12px] leading-snug text-[var(--app-text-dim)]">
                  {game.body}
                </span>
                <span className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--app-text-dim)]">
                  <span className="rounded-full bg-[var(--app-surface-2)] px-2 py-0.5">
                    {game.minutes} min
                  </span>
                  {game.coins > 0 && (
                    <span className="rounded-full bg-[var(--app-accent)]/14 px-2 py-0.5 font-semibold text-[var(--app-accent)]">
                      +{game.coins}
                    </span>
                  )}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-[var(--app-text-dim)]" />
            </Link>
          ))}
        </div>
      </div>
    </AppScreen>
  );
}
