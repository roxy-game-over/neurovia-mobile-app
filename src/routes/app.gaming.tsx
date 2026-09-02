import { createFileRoute, Link } from "@tanstack/react-router";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/gaming")({ component: Gaming });

const GAMES = [
  {
    title: "Breath Bloom",
    body: "Grow a flower by pacing your breath. 4-7-8, one petal at a time.",
    emoji: "🪷",
    to: "/app/practice",
  },
  {
    title: "Thought Sorter",
    body: "Catch a spiralling thought and reframe it into something kinder.",
    emoji: "🌀",
    to: "/app/practice",
  },
  {
    title: "Ground in Five",
    body: "A playful 5-4-3-2-1 senses sweep to land back in the room.",
    emoji: "🖐️",
    to: "/app/practice",
  },
  {
    title: "Garden Keeper",
    body: "Spend your coins, plant what you earned, watch your garden grow.",
    emoji: "🌱",
    to: "/app/garden",
  },
];

function Gaming() {
  return (
    <AppScreen>
      <ScreenHeader title="Play & Grow" subtitle="Fun little games that help you heal." />
      <div className="space-y-3 px-5 pb-8">
        {GAMES.map((game) => (
          <Link key={game.title} to={game.to} className="app-card flex items-center gap-4 p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-2xl">
              {game.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[15px]">{game.title}</strong>
              <span className="text-[12.5px] leading-snug text-[var(--app-text-dim)]">{game.body}</span>
            </span>
          </Link>
        ))}
      </div>
    </AppScreen>
  );
}
