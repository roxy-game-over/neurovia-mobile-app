import { createFileRoute } from "@tanstack/react-router";
import { Check, Heart, Sparkles, Target } from "lucide-react";
import { useState } from "react";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";
import { Vi } from "@/components/app/Brand";
import { CONCERNS, GOALS } from "@/content/app-onboarding";
import { useAppAuth } from "@/lib/app/auth";

export const Route = createFileRoute("/app/personality")({ component: Personality });

const TONES = [
  { id: "gentle", label: "Gentle", note: "Soft, warm, unhurried" },
  { id: "direct", label: "Direct", note: "Clear and practical" },
  { id: "playful", label: "Playful", note: "Light, with a little humour" },
] as const;

function Chips({
  items,
  selected,
  onToggle,
}: {
  items: { id: string; label: string; emoji?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className="flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
            style={{
              borderColor: active ? "var(--app-accent)" : "var(--app-border)",
              background: active
                ? "color-mix(in oklab, var(--app-accent) 16%, transparent)"
                : "transparent",
              color: active ? "var(--app-accent)" : "var(--app-text-dim)",
            }}
          >
            {item.emoji && <span>{item.emoji}</span>}
            {item.label}
            {active && <Check className="size-3.5" />}
          </button>
        );
      })}
    </div>
  );
}

function Personality() {
  const { profile, updateProfile } = useAppAuth();
  const [concerns, setConcerns] = useState<string[]>(profile?.concerns ?? []);
  const [goals, setGoals] = useState<string[]>(profile?.goals ?? []);
  const [tone, setTone] = useState<string>("gentle");
  const [saved, setSaved] = useState(false);

  function toggle(list: string[], set: (v: string[]) => void, id: string) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
    setSaved(false);
  }

  async function save() {
    await updateProfile({ concerns, goals });
    setSaved(true);
  }

  return (
    <AppScreen>
      <ScreenHeader title="Personality space" subtitle="Shape how VI shows up for you." />

      <div className="mx-5 flex items-center gap-4 rounded-[24px] bg-[var(--app-surface)] p-4">
        <Vi className="size-16 shrink-0" />
        <p className="text-[13px] leading-relaxed text-[var(--app-text-dim)]">
          The more I know about what you carry and where you're heading, the better I can meet you there.
        </p>
      </div>

      <section className="mt-6 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[var(--app-text)]">
          <Heart className="size-4 text-[var(--app-rose)]" /> What you're carrying
        </h2>
        <Chips items={CONCERNS} selected={concerns} onToggle={(id) => toggle(concerns, setConcerns, id)} />
      </section>

      <section className="mt-6 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[var(--app-text)]">
          <Target className="size-4 text-[var(--app-mint)]" /> What you're working toward
        </h2>
        <Chips items={GOALS} selected={goals} onToggle={(id) => toggle(goals, setGoals, id)} />
      </section>

      <section className="mt-6 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[var(--app-text)]">
          <Sparkles className="size-4 text-[var(--app-accent)]" /> How VI should speak
        </h2>
        <div className="space-y-2.5">
          {TONES.map((t) => {
            const active = tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className="flex w-full items-center gap-3 rounded-[20px] border p-4 text-left"
                style={{
                  borderColor: active ? "var(--app-accent)" : "var(--app-border)",
                  background: active
                    ? "color-mix(in oklab, var(--app-accent) 12%, transparent)"
                    : "var(--app-surface)",
                }}
              >
                <span className="min-w-0 flex-1">
                  <strong className="block text-[15px] text-[var(--app-text)]">{t.label}</strong>
                  <span className="text-[12px] text-[var(--app-text-dim)]">{t.note}</span>
                </span>
                {active && <Check className="size-4 text-[var(--app-accent)]" />}
              </button>
            );
          })}
        </div>
      </section>

      <div className="px-5 pb-10 pt-7">
        <button type="button" onClick={() => void save()} className="app-btn">
          {saved ? "Saved" : "Save preferences"}
        </button>
      </div>
    </AppScreen>
  );
}
