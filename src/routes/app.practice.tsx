import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { IconChip, iconForEmoji } from "@/components/app/Icons";
import {
  BoxBreathing,
  Grounding,
  OneLineJournal,
  ThoughtReframe,
  WindDown,
} from "@/components/app/PracticeTools";
import { PRACTICE_COIN_REWARD } from "@/lib/app/progress";

export const Route = createFileRoute("/app/practice")({ component: Practice });

const TOOLS = [
  { id: "breathing", name: "Box breathing", desc: "In 4 · hold 4 · out 6 · rest 4", emoji: "🫁", time: "1 min" },
  { id: "grounding", name: "Grounding", desc: "5-4-3-2-1, back to the room", emoji: "🌿", time: "2 min" },
  { id: "journal", name: "One-line journal", desc: "One honest sentence", emoji: "✍️", time: "1 min" },
  { id: "reframe", name: "Thought reframe", desc: "Loosen one mental loop", emoji: "🪷", time: "3 min" },
  { id: "winddown", name: "Wind-down", desc: "A landing strip for the day", emoji: "🌙", time: "2 min" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

function Practice() {
  const [active, setActive] = useState<ToolId | null>(null);

  if (active === "breathing") return <AppScreen><BoxBreathing onBack={() => setActive(null)} /></AppScreen>;
  if (active === "grounding") return <AppScreen><Grounding onBack={() => setActive(null)} /></AppScreen>;
  if (active === "journal") return <AppScreen><OneLineJournal onBack={() => setActive(null)} /></AppScreen>;
  if (active === "reframe") return <AppScreen><ThoughtReframe onBack={() => setActive(null)} /></AppScreen>;
  if (active === "winddown") return <AppScreen><WindDown onBack={() => setActive(null)} /></AppScreen>;

  return (
    <AppScreen>
      <div className="px-5 pb-8">
        <h2 className="text-[26px] font-bold leading-tight">Small practices, real shifts</h2>
        <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
          Every completed practice earns +{PRACTICE_COIN_REWARD} garden coins and grows your garden.
        </p>
        <div className="mt-6 space-y-3">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActive(tool.id)}
              className="app-card flex w-full items-center gap-4 p-4 text-left transition-transform active:scale-[0.98]"
            >
              <IconChip name={iconForEmoji(tool.emoji)} size={48} />
              <span className="min-w-0 flex-1">
                <strong className="block text-[15px]">{tool.name}</strong>
                <span className="block text-[12px] text-[var(--app-text-dim)]">{tool.desc}</span>
              </span>
              <span className="rounded-full border border-[var(--app-border)] px-2.5 py-1 text-[11px] text-[var(--app-text-dim)]">
                {tool.time}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AppScreen>
  );
}
