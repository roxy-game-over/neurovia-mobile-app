import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Flame } from "lucide-react";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";
import { Vi } from "@/components/app/Brand";
import { IconChip, type AppIconKey } from "@/components/app/Icons";

export const Route = createFileRoute("/app/exercises")({ component: Exercises });

const GROUPS: {
  name: string;
  items: { title: string; mins: number; icon: AppIconKey; level: string }[];
}[] = [
  {
    name: "Calm the body",
    items: [
      { title: "Box breathing", mins: 1, icon: "breathe", level: "Beginner" },
      { title: "5-4-3-2-1 grounding", mins: 2, icon: "ground", level: "Beginner" },
      { title: "Progressive release", mins: 5, icon: "meditate", level: "Steady" },
    ],
  },
  {
    name: "Train attention",
    items: [
      { title: "Single-point focus", mins: 3, icon: "focus", level: "Steady" },
      { title: "Thought labelling", mins: 4, icon: "logic", level: "Steady" },
      { title: "Memory ladder", mins: 3, icon: "memory", level: "Challenge" },
    ],
  },
  {
    name: "Soften the mind",
    items: [
      { title: "Thought reframe", mins: 3, icon: "reframe", level: "Steady" },
      { title: "Self-compassion break", mins: 3, icon: "psychologist", level: "Beginner" },
      { title: "Wind-down sequence", mins: 4, icon: "sleep", level: "Beginner" },
    ],
  },
];

function Exercises() {
  return (
    <AppScreen>
      <ScreenHeader title="Mind exercises" subtitle="Small reps that build a steadier mind." />

      <div className="mx-5 mb-5 flex items-center gap-4 rounded-[24px] bg-[var(--app-surface)] p-4">
        <Vi mood="meditate" className="size-16 shrink-0" />
        <div>
          <p className="text-[14px] font-semibold text-[var(--app-text)]">Daily rep</p>
          <p className="text-[12.5px] text-[var(--app-text-dim)]">
            Two minutes of grounding is enough to change the next hour.
          </p>
        </div>
      </div>

      <div className="space-y-6 px-5 pb-8">
        {GROUPS.map((group) => (
          <section key={group.name}>
            <h2 className="mb-2.5 text-[15px] font-semibold text-[var(--app-text)]">{group.name}</h2>
            <div className="space-y-2.5">
              {group.items.map((item) => (
                <Link
                  key={item.title}
                  to="/app/practice"
                  className="app-card flex items-center gap-4 p-4 transition-transform active:scale-[0.99]"
                >
                  <IconChip name={item.icon} size={48} />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[15px] text-[var(--app-text)]">{item.title}</strong>
                    <span className="flex items-center gap-2 text-[11.5px] text-[var(--app-text-dim)]">
                      <Clock className="size-3.5" /> {item.mins} min
                      <Flame className="size-3.5" /> {item.level}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppScreen>
  );
}
