import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";

import { AppScreen } from "@/components/app/AppShell";
import { useAppAuth } from "@/lib/app/auth";
import { GARDEN_STAGES, nextStage, stageForPractices } from "@/lib/app/progress";

export const Route = createFileRoute("/app/garden")({ component: Garden });

function Garden() {
  const { profile } = useAppAuth();
  const practices = profile?.practices_completed ?? 0;
  const stage = stageForPractices(practices);
  const next = nextStage(practices);
  const progressToNext = next
    ? Math.min(1, (practices - stage.threshold) / (next.threshold - stage.threshold))
    : 1;

  return (
    <AppScreen>
      <div className="px-5 pb-8">
        <h2 className="text-[26px] font-bold leading-tight">Your garden</h2>
        <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
          Your garden grows when you do. Complete practices to unlock each stage.
        </p>

        <div className="app-card mt-6 flex flex-col items-center p-8 text-center">
          <span className="text-6xl">{stage.emoji}</span>
          <h3 className="mt-4 text-[24px] font-bold">{stage.label}</h3>
          <p className="mt-1 text-[13px] text-[var(--app-text-dim)]">
            {practices} {practices === 1 ? "practice" : "practices"} completed
          </p>
          {next ? (
            <div className="mt-5 w-full">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--app-surface-2)]">
                <div
                  className="h-full rounded-full bg-[var(--app-accent)] transition-all"
                  style={{ width: `${Math.round(progressToNext * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[12px] text-[var(--app-text-dim)]">
                {next.threshold - practices} more {next.threshold - practices === 1 ? "practice" : "practices"} to reach <strong className="text-[var(--app-text)]">{next.label}</strong>
              </p>
            </div>
          ) : (
            <p className="mt-4 text-[13px] text-[var(--app-mint)]">Your sanctuary is complete. Keep tending it.</p>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {GARDEN_STAGES.map((s) => {
            const unlocked = practices >= s.threshold;
            const isCurrent = s.id === stage.id;
            return (
              <div
                key={s.id}
                className={`app-card flex items-center gap-4 p-4 ${isCurrent ? "border-[var(--app-accent)]/50" : ""}`}
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-xl">
                  {unlocked ? s.emoji : <Lock className="size-4 text-[var(--app-text-dim)]" />}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[14px]">{s.label}</strong>
                  <span className="text-[11px] text-[var(--app-text-dim)]">
                    {s.threshold === 0 ? "Where everyone begins" : `Unlocks at ${s.threshold} practices`}
                  </span>
                </span>
                {isCurrent ? (
                  <span className="rounded-full bg-[var(--app-accent)]/15 px-2.5 py-1 text-[10px] font-bold text-[var(--app-accent)]">NOW</span>
                ) : unlocked ? (
                  <Check className="size-4 text-[var(--app-mint)]" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </AppScreen>
  );
}
