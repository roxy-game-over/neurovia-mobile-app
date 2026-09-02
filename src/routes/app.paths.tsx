import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";
import { IconChip, iconForEmoji } from "@/components/app/Icons";
import { Vi } from "@/components/app/Brand";
import { GROWTH_PATHS, readProgress, type PathProgress } from "@/content/growth-paths";

export const Route = createFileRoute("/app/paths")({ component: Paths });

function Paths() {
  const [progress, setProgress] = useState<PathProgress>({});
  useEffect(() => setProgress(readProgress()), []);

  return (
    <AppScreen>
      <ScreenHeader title="Growth paths" subtitle="Short guided journeys, one gentle step at a time." />

      <div className="mx-5 mb-5 flex items-center gap-4 rounded-[24px] bg-[var(--app-surface)] p-4">
        <Vi className="size-16 shrink-0" />
        <p className="text-[13px] leading-relaxed text-[var(--app-text-dim)]">
          Pick the path that matches what's loudest right now. You can switch any time — nothing is lost.
        </p>
      </div>

      <div className="space-y-3 px-5 pb-8">
        {GROWTH_PATHS.map((path) => {
          const state = progress[path.id];
          const pct = state?.completed
            ? 100
            : Math.round(((state?.step ?? 0) / path.steps.length) * 100);
          return (
            <Link
              key={path.id}
              to="/app/path/$pathId"
              params={{ pathId: path.id }}
              className="app-card flex flex-col gap-3 p-4 transition-transform active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <IconChip name={iconForEmoji(path.emoji)} size={48} />
                <span className="min-w-0 flex-1">
                  <strong className="block text-[16px] text-[var(--app-text)]">{path.name}</strong>
                  <span className="block text-[12.5px] text-[var(--app-text-dim)]">{path.tagline}</span>
                </span>
                {state?.completed ? (
                  <CheckCircle2 className="size-5 text-[var(--app-mint)]" />
                ) : (
                  <ArrowRight className="size-5 text-[var(--app-text-dim)]" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] text-[var(--app-text-dim)]">
                  <Clock className="size-3.5" /> {path.days} days
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${pct}%`, background: path.accent }}
                  />
                </span>
                <span className="text-[11px] font-semibold text-[var(--app-text-dim)]">{pct}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppScreen>
  );
}
