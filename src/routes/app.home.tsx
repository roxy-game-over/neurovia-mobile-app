import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight, Check, Flame } from "lucide-react";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppAuth } from "@/lib/app/auth";
import { CHECKIN_COIN_REWARD, stageForPractices } from "@/lib/app/progress";

export const Route = createFileRoute("/app/home")({ component: Home });

const MOODS = [
  { emoji: "😞", label: "Low", value: 1 },
  { emoji: "😕", label: "Meh", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😄", label: "Great", value: 5 },
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

function dayOf(iso: string) {
  return format(new Date(iso), "yyyy-MM-dd");
}

function Home() {
  const { profile, user, updateProfile } = useAppAuth();
  const queryClient = useQueryClient();
  const firstName = profile?.display_name?.split(" ")[0] || "friend";
  const today = format(new Date(), "yyyy-MM-dd");
  const stage = stageForPractices(profile?.practices_completed ?? 0);

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
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Count consecutive days ending today/yesterday
  const days = new Set(checkins.map((c) => dayOf(c.created_at)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(format(cursor, "yyyy-MM-dd"))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  async function saveCheckin() {
    if (!user || mood === null || sleep === null || energy === null) return;
    setSaving(true);
    if (todayCheckin) {
      await supabase.from("check_ins").update({ mood, sleep, energy }).eq("id", todayCheckin.id);
    } else {
      await supabase.from("check_ins").insert({ user_id: user.id, mood, sleep, energy });
      await updateProfile({ coins: (profile?.coins ?? 0) + CHECKIN_COIN_REWARD });
    }
    await queryClient.invalidateQueries({ queryKey: ["check_ins", user.id] });
    setSaving(false);
  }

  const complete = todayCheckin || (mood !== null && sleep && energy && false);

  return (
    <AppScreen>
      <div className="px-5 pb-8">
        <h2 className="text-[26px] font-bold leading-tight">Hi, {firstName}.</h2>
        <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
          {format(new Date(), "EEEE, MMMM d")} · a good day for one small thing.
        </p>

        {/* Daily check-in */}
        <div className="app-card mt-6 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold">Daily check-in</h3>
            {streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--app-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[var(--app-accent)]">
                <Flame className="size-3" /> {streak} day{streak === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {todayCheckin ? (
            <div className="mt-4 rounded-2xl bg-[var(--app-surface-2)] p-4 text-center">
              <span className="text-3xl">{MOODS.find((m) => m.value === todayCheckin.mood)?.emoji ?? "🌿"}</span>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px] text-[var(--app-text-dim)]">
                <Check className="size-3.5 text-[var(--app-mint)]" /> Checked in — {SLEEP.find((s) => s.value === todayCheckin.sleep)?.label ?? "—"} sleep, {ENERGY.find((e) => e.value === todayCheckin.energy)?.label ?? "—"} energy
              </p>
            </div>
          ) : (
            <>
              <p className="mt-4 text-[13px] font-semibold text-[var(--app-text-dim)]">How are you feeling?</p>
              <div className="mt-2 flex justify-between">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    aria-label={m.label}
                    className={`flex size-11 items-center justify-center rounded-full text-2xl transition-all ${mood === m.value ? "scale-110 bg-[var(--app-accent)]/20 ring-2 ring-[var(--app-accent)]" : "bg-[var(--app-surface-2)]"}`}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-[13px] font-semibold text-[var(--app-text-dim)]">How did you sleep?</p>
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
              <button
                type="button"
                disabled={mood === null || !sleep || !energy || saving}
                onClick={() => void saveCheckin()}
                className="app-btn mt-5 w-full border-0 disabled:opacity-40"
              >
                {saving ? "Saving…" : `Check in · +${CHECKIN_COIN_REWARD} coins`}
              </button>
            </>
          )}
        </div>

        {/* Garden snapshot */}
        <Link to="/app/garden" className="app-card mt-4 flex items-center gap-4 p-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--app-mint)]/12 text-2xl">{stage.emoji}</span>
          <span className="min-w-0 flex-1">
            <strong className="block text-[15px]">Garden · {stage.label}</strong>
            <span className="text-[12px] text-[var(--app-text-dim)]">{profile?.practices_completed ?? 0} practices · {profile?.coins ?? 0} coins</span>
          </span>
          <ArrowRight className="size-4 text-[var(--app-text-dim)]" />
        </Link>

        {/* Quick actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/app/practice" className="app-card p-4">
            <span className="text-2xl">🫁</span>
            <strong className="mt-2 block text-[14px]">Practice</strong>
            <span className="text-[11px] text-[var(--app-text-dim)]">Breathe, ground, reframe</span>
          </Link>
          <Link to="/app/via" className="app-card p-4">
            <span className="text-2xl">💬</span>
            <strong className="mt-2 block text-[14px]">Talk to VIA</strong>
            <span className="text-[11px] text-[var(--app-text-dim)]">Your companion is here</span>
          </Link>
        </div>

        <Link
          to="/app/care"
          className="mt-4 block rounded-2xl border border-[var(--app-border)] bg-[var(--app-accent)]/8 p-4 text-center text-[13px] text-[var(--app-text-dim)]"
        >
          In a heavy moment? <strong className="text-[var(--app-text)]">Reach Care</strong> — you don't have to carry it alone.
        </Link>
        {complete && null}
      </div>
    </AppScreen>
  );
}
