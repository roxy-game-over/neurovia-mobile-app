import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Check, Flame } from "lucide-react";
import { useState } from "react";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";
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
  { emoji: "🙁", label: "Bad", value: 1 },
  { emoji: "😐", label: "Okay", value: 2 },
  { emoji: "🙂", label: "Good", value: 3 },
  { emoji: "😊", label: "Great", value: 4 },
  { emoji: "😄", label: "Amazing", value: 5 },
] as const;

const SLEEP = [
  { emoji: "😴", label: "Restful", value: 3 },
  { emoji: "🥱", label: "Broken", value: 2 },
  { emoji: "🌙", label: "Short", value: 1 },
] as const;

const ENERGY = [
  { emoji: "🔋", label: "Charged", value: 3 },
  { emoji: "🪫", label: "Low", value: 1 },
  { emoji: "⚡", label: "Wired", value: 2 },
] as const;

export function dayOf(iso: string) {
  return format(new Date(iso), "yyyy-MM-dd");
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
  const [mood, setMood] = useState<number | null>(initialMood ?? null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
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
    void navigate({ to: "/app/home" as never });
  }

  return (
    <AppScreen>
      <ScreenHeader
        title="Daily Check-in"
        subtitle="How are you feeling today?"
        right={
          streak > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-[var(--app-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[var(--app-accent)]">
              <Flame className="size-3" /> {streak}
            </span>
          ) : undefined
        }
      />

      <div className="px-5 pb-8">
        {todayCheckin && (
          <p className="mb-4 flex items-center justify-center gap-1.5 rounded-2xl bg-[var(--app-surface-2)] p-3 text-[13px] text-[var(--app-text-dim)]">
            <Check className="size-3.5 text-[var(--app-mint)]" /> You already checked in today — you can update it.
          </p>
        )}

        <div className="app-card p-5">
          <p className="text-[13px] font-semibold text-[var(--app-text-dim)]">Mood</p>
          <div className="mt-3 flex justify-between">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-full text-2xl transition-all ${mood === m.value ? "scale-110 bg-[var(--app-accent)] ring-2 ring-[var(--app-accent)]" : "bg-[var(--app-surface-2)]"}`}
                >
                  {m.emoji}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: mood === m.value ? "var(--app-text)" : "var(--app-text-dim)" }}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-semibold text-[var(--app-text-dim)]">How did you sleep?</p>
          <div className="mt-2 flex gap-2">
            {SLEEP.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSleep(s.value)}
                className={`flex-1 rounded-xl border px-2 py-2 text-[12px] transition-all ${sleep === s.value ? "border-[var(--app-accent)] bg-[var(--app-accent)]/12 font-semibold" : "border-[var(--app-border)]"}`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[13px] font-semibold text-[var(--app-text-dim)]">Energy right now?</p>
          <div className="mt-2 flex gap-2">
            {ENERGY.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => setEnergy(e.value)}
                className={`flex-1 rounded-xl border px-2 py-2 text-[12px] transition-all ${energy === e.value ? "border-[var(--app-accent)] bg-[var(--app-accent)]/12 font-semibold" : "border-[var(--app-border)]"}`}
              >
                {e.emoji} {e.label}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="text-[13px] font-semibold text-[var(--app-text-dim)]">Anything on your mind?</span>
            <textarea
              className="app-input mt-2 h-24 resize-none py-3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional — a line for future you."
            />
          </label>

          <button
            type="button"
            disabled={mood === null || saving}
            onClick={() => void save()}
            className="app-btn mt-5 w-full border-0 disabled:opacity-40"
          >
            {saving ? "Saving…" : todayCheckin ? "Update check-in" : `Check in · +${CHECKIN_COIN_REWARD} coins`}
          </button>
        </div>
      </div>
    </AppScreen>
  );
}
