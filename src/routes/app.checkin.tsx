import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Check, Flame, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppScreenPlain, ThemeToggle } from "@/components/app/AppShell";
import { Vi } from "@/components/app/Brand";
import { supabase } from "@/integrations/supabase/client";
import { useAppAuth } from "@/lib/app/auth";
import { CHECKIN_COIN_REWARD } from "@/lib/app/progress";

export const Route = createFileRoute("/app/checkin")({
  validateSearch: (search: Record<string, unknown>) => ({
    mood: typeof search["mood"] === "number" ? (search["mood"] as number) : undefined,
  }),
  component: CheckIn,
});

export const MOODS = [
  { icon: "mood1", label: "Bad", value: 1 },
  { icon: "mood2", label: "Low", value: 2 },
  { icon: "mood3", label: "Okay", value: 3 },
  { icon: "mood4", label: "Good", value: 4 },
  { icon: "mood5", label: "Great", value: 5 },
] as const;

const ENERGY = [
  { icon: "energy1", label: "Drained", note: "Running on empty", value: 1 },
  { icon: "energy2", label: "Low", note: "Slow and steady", value: 2 },
  { icon: "energy3", label: "Medium", note: "Enough for today", value: 3 },
  { icon: "energy4", label: "Energised", note: "Ready to move", value: 4 },
  { icon: "energy5", label: "Buzzing", note: "Hard to settle", value: 5 },
] as const;

const SLEEP = [
  { icon: "sleep1", label: "Barely slept", note: "Under 4 hours", value: 1 },
  { icon: "sleep2", label: "Restless", note: "Woke up often", value: 2 },
  { icon: "sleep3", label: "Okay", note: "6.5h · some rest", value: 3 },
  { icon: "sleep4", label: "Good", note: "Mostly restful", value: 4 },
  { icon: "sleep5", label: "Deep rest", note: "Woke up refreshed", value: 5 },
] as const;


export function dayOf(iso: string) {
  return format(new Date(iso), "yyyy-MM-dd");
}

type Step = 0 | 1 | 2 | 3;

const STEP_META = [
  { mascot: "base", title: "How are you feeling today?", sub: "There is no wrong answer. Just what's true right now." },
  { mascot: "energy", title: "How is your energy level?", sub: "Energy tells us how much today can hold." },
  { mascot: "sleep", title: "How did you sleep?", sub: "Rest shapes everything else, gently." },
] as const;

function OptionRow({
  items,
  selected,
  onSelect,
}: {
  items: readonly { icon: AppIconKey; label: string; note?: string; value: number }[];
  selected: number | null;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="mt-6 space-y-2.5">
      {items.map((item) => {
        const active = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelect(item.value)}
            className="flex w-full items-center gap-4 rounded-[20px] border p-3.5 text-left transition-all active:scale-[0.99]"
            style={{
              borderColor: active ? "var(--app-accent)" : "var(--app-border)",
              background: active ? "color-mix(in oklab, var(--app-accent) 14%, transparent)" : "var(--app-surface)",
            }}
          >
            <IconChip name={item.icon} size={44} />

            <span className="min-w-0 flex-1">
              <strong className="block text-[15px] text-[var(--app-text)]">{item.label}</strong>
              {item.note && (
                <span className="block text-[12px] text-[var(--app-text-dim)]">{item.note}</span>
              )}
            </span>
            <span
              className="flex size-6 items-center justify-center rounded-full border"
              style={{
                borderColor: active ? "var(--app-accent)" : "var(--app-border)",
                background: active ? "var(--app-accent)" : "transparent",
              }}
            >
              {active && <Check className="size-3.5 text-[var(--app-on-accent)]" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CheckIn() {
  const { mood: initialMood } = Route.useSearch();
  const navigate = useNavigate();
  const { profile, user, updateProfile } = useAppAuth();
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: checkins = [] } = useQuery({
    queryKey: ["check_ins", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(14);
      return data ?? [];
    },
  });

  const todayCheckin = checkins.find((c) => dayOf(c.created_at) === today);
  const [step, setStep] = useState<Step>(0);
  const [mood, setMood] = useState<number | null>(initialMood ?? null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const days = new Set(checkins.map((c) => dayOf(c.created_at)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(format(cursor, "yyyy-MM-dd"))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const value = step === 0 ? mood : step === 1 ? energy : sleep;

  async function save() {
    if (!user || mood === null) return;
    setSaving(true);
    if (todayCheckin) {
      await supabase
        .from("check_ins")
        .update({ mood, sleep, energy, note: note || null })
        .eq("id", todayCheckin.id);
    } else {
      await supabase
        .from("check_ins")
        .insert({ user_id: user.id, mood, sleep, energy, note: note || null });
      await updateProfile({ coins: (profile?.coins ?? 0) + CHECKIN_COIN_REWARD });
    }
    await queryClient.invalidateQueries({ queryKey: ["check_ins", user.id] });
    setSaving(false);
    setStep(3);
  }

  if (step === 3) {
    return (
      <AppScreenPlain>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Vi mood="celebrate" className="size-56" />
          <h1 className="mt-4 text-[28px] font-bold text-[var(--app-text)]">Check-in complete</h1>
          <p className="mt-2 text-[15px] text-[var(--app-text-dim)]">
            Thank you for showing up for yourself today.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--app-accent)]/15 px-3 py-1.5 text-[13px] font-bold text-[var(--app-accent)]">
              <Sparkles className="size-4" /> +{CHECKIN_COIN_REWARD} coins
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--app-mint)]/15 px-3 py-1.5 text-[13px] font-bold text-[var(--app-mint)]">
              <Flame className="size-4" /> {Math.max(streak, 1)} day streak
            </span>
          </div>
          <button
            type="button"
            onClick={() => void navigate({ to: "/app/home" as never })}
            className="app-btn mt-10"
          >
            Back to home <ArrowRight className="size-5" />
          </button>
        </div>
      </AppScreenPlain>
    );
  }

  const meta = STEP_META[step]!;

  return (
    <AppScreenPlain>
      <div className="flex items-center justify-between px-5 pt-6">
        <button
          type="button"
          aria-label="Back"
          onClick={() =>
            step === 0 ? void navigate({ to: "/app/home" as never }) : setStep((step - 1) as Step)
          }
          className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === step ? 26 : 10,
                background: i <= step ? "var(--app-accent)" : "var(--app-border)",
              }}
            />
          ))}
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-8 pt-2">
        <Vi mood={meta.mascot} className="mx-auto size-40" />
        <h1 className="mt-2 text-center text-[24px] font-bold leading-tight text-[var(--app-text)]">
          {meta.title}
        </h1>
        <p className="mt-1.5 text-center text-[14px] text-[var(--app-text-dim)]">{meta.sub}</p>

        {step === 0 && <OptionRow items={MOODS} selected={mood} onSelect={setMood} />}
        {step === 1 && <OptionRow items={ENERGY} selected={energy} onSelect={setEnergy} />}
        {step === 2 && (
          <>
            <OptionRow items={SLEEP} selected={sleep} onSelect={setSleep} />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Anything you want VI to know? (optional)"
              className="app-input mt-3 h-auto resize-none py-3.5"
            />
          </>
        )}

        {todayCheckin && step === 0 && (
          <p className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-[var(--app-surface-2)] p-3 text-[13px] text-[var(--app-text-dim)]">
            <Check className="size-3.5 text-[var(--app-mint)]" /> You already checked in today — you can update it.
          </p>
        )}

        <div className="mt-auto pt-8">
          <button
            type="button"
            disabled={value === null || saving}
            onClick={() => (step === 2 ? void save() : setStep((step + 1) as Step))}
            className="app-btn"
          >
            {saving ? "Saving…" : step === 2 ? "Finish check-in" : "Continue"}
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </AppScreenPlain>
  );
}
