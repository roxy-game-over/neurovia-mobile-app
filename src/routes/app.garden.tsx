import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { VI } from "@/components/app/Brand";
import { AppIcon, IconChip } from "@/components/app/Icons";
import { GARDEN_SHOP, GARDEN_SPACES, GROWTH_JOURNEY, VI_OUTFITS } from "@/content/app-garden";
import { useAppAuth } from "@/lib/app/auth";
import { nextStage, stageForPractices } from "@/lib/app/progress";

export const Route = createFileRoute("/app/garden")({ component: Garden });

type Tab = "journey" | "spaces" | "shop" | "outfits";

const TABS: { id: Tab; label: string }[] = [
  { id: "journey", label: "Journey" },
  { id: "spaces", label: "Spaces" },
  { id: "shop", label: "Shop" },
  { id: "outfits", label: "Outfits" },
];

function Garden() {
  const { profile } = useAppAuth();
  const [tab, setTab] = useState<Tab>("journey");

  const practices = profile?.practices_completed ?? 0;
  const coins = profile?.coins ?? 0;
  const stage = stageForPractices(practices);
  const next = nextStage(practices);
  const progress = next
    ? Math.min(1, (practices - stage.threshold) / (next.threshold - stage.threshold))
    : 1;

  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        {/* Garden scene */}
        <div
          className="relative overflow-hidden rounded-[28px] border border-[var(--app-border)] p-5"
          style={{
            background:
              "linear-gradient(165deg, color-mix(in oklab, var(--app-accent) 22%, var(--app-surface)), color-mix(in oklab, var(--app-mint) 18%, var(--app-surface)))",
          }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--app-text)]/70">
            My Garden
          </p>
          <h1 className="mt-1 text-[26px] font-bold leading-tight">{stage.label}</h1>
          <p className="mt-1 max-w-[62%] text-[13px] leading-snug text-[var(--app-text)]/75">
            Your garden grows when you do. Every practice, check-in and game waters a seed.
          </p>
          <img
            src={VI.garden}
            alt="VI watering a seedling"
            loading="lazy"
            className="anim-float pointer-events-none absolute -bottom-4 -right-4 size-36 object-contain"
          />
          <div className="mt-4 max-w-[62%]">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--app-bg)]/40">
              <div
                className="h-full rounded-full bg-[var(--app-text)]/80 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-[var(--app-text)]/75">
              {next
                ? `${next.threshold - practices} more to reach ${next.label}`
                : "Your sanctuary is complete. Keep tending it."}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Seeds watered", value: practices, icon: "water" as const },
            { label: "Coins", value: coins, icon: "spark" as const },
            { label: "Stage", value: `${GROWTH_JOURNEY.findIndex((s) => s.id === stage.id) + 1}/7`, icon: "tree" as const },
          ].map((s) => (
            <div key={s.label} className="app-card flex flex-col items-center gap-1 px-2 py-3.5">
              <AppIcon name={s.icon} size={17} />
              <strong className="text-[18px] leading-none">{s.value}</strong>
              <span className="text-center text-[10.5px] leading-tight text-[var(--app-text-dim)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-semibold ${
                tab === t.id
                  ? "border-transparent bg-[var(--app-accent)] text-[var(--app-on-accent)]"
                  : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-dim)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "journey" && (
          <div className="mt-4 space-y-2">
            {GROWTH_JOURNEY.map((s) => {
              const unlocked = practices >= s.threshold;
              const isCurrent = s.id === stage.id;
              return (
                <div
                  key={s.id}
                  className={`app-card flex items-center gap-3.5 p-4 ${isCurrent ? "border-[var(--app-accent)]/60" : ""}`}
                >
                  {unlocked ? (
                    <IconChip name={s.icon} size={44} />
                  ) : (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-surface-2)]">
                      <Lock className="size-4 text-[var(--app-text-dim)]" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[14.5px]">{s.label}</strong>
                    <span className="block text-[11.5px] text-[var(--app-text-dim)]">
                      {s.threshold === 0 ? s.body : `${s.body} · unlocks at ${s.threshold} practices`}
                    </span>
                  </span>
                  {isCurrent ? (
                    <span className="rounded-full bg-[var(--app-accent)]/15 px-2.5 py-1 text-[10px] font-bold text-[var(--app-accent)]">
                      NOW
                    </span>
                  ) : unlocked ? (
                    <Check className="size-4 text-[var(--app-mint)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {tab === "spaces" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {GARDEN_SPACES.map((s) => {
              const affordable = coins >= s.cost;
              return (
                <div key={s.id} className="app-card flex flex-col p-4">
                  <IconChip name={s.icon} size={40} />
                  <strong className="mt-2.5 text-[14px]">{s.label}</strong>
                  <span className="mt-1 text-[11.5px] leading-snug text-[var(--app-text-dim)]">
                    {s.body}
                  </span>
                  <button
                    type="button"
                    disabled={!affordable}
                    className={`mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold ${
                      affordable
                        ? "bg-[var(--app-accent)] text-[var(--app-on-accent)]"
                        : "bg-[var(--app-surface-2)] text-[var(--app-text-dim)]"
                    }`}
                  >
                    {affordable ? "Build" : "Locked"} · {s.cost}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "shop" && (
          <div className="mt-4 space-y-3">
            {GARDEN_SHOP.map((s) => {
              const affordable = coins >= s.cost;
              return (
                <div key={s.id} className="app-card flex items-center gap-3.5 p-4">
                  <IconChip name={s.icon} size={44} />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[14.5px]">{s.label}</strong>
                    <span className="block text-[11.5px] text-[var(--app-text-dim)]">{s.body}</span>
                  </span>
                  <button
                    type="button"
                    disabled={!affordable}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold ${
                      affordable
                        ? "bg-[var(--app-accent)] text-[var(--app-on-accent)]"
                        : "bg-[var(--app-surface-2)] text-[var(--app-text-dim)]"
                    }`}
                  >
                    {s.cost} coins
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "outfits" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {VI_OUTFITS.map((o) => {
              const owned = coins >= o.cost || o.cost === 0;
              return (
                <div key={o.id} className="app-card flex flex-col items-center p-4 text-center">
                  <img src={VI[o.mood]} alt={o.label} loading="lazy" className="size-20 object-contain" />
                  <strong className="mt-2 text-[13.5px]">{o.label}</strong>
                  <span className="mt-0.5 text-[11px] leading-snug text-[var(--app-text-dim)]">
                    {o.body}
                  </span>
                  <span
                    className={`mt-2.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      owned
                        ? "bg-[var(--app-mint)]/16 text-[var(--app-mint)]"
                        : "bg-[var(--app-surface-2)] text-[var(--app-text-dim)]"
                    }`}
                  >
                    {o.cost === 0 ? "Owned" : owned ? `Unlock · ${o.cost}` : `${o.cost} coins`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppScreen>
  );
}
