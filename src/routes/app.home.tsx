import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Bell, ChevronRight, Flame, Moon, Sun } from "lucide-react";
import { useState } from "react";

import vi from "@/assets/vi-mascot.png.asset.json";
import { AppScreen } from "@/components/app/AppShell";
import { TODAYS_PLAN } from "@/content/app-onboarding";
import { supabase } from "@/integrations/supabase/client";
import { useAppAuth } from "@/lib/app/auth";
import { stageForPractices } from "@/lib/app/progress";
import { MOODS, dayOf } from "@/routes/app.checkin";

export const Route = createFileRoute("/app/home")({ component: Home });

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", night: false };
  if (hour < 17) return { text: "Good afternoon", night: false };
  return { text: "Good evening", night: true };
}

function Home() {
  const { profile, user } = useAppAuth();
  const firstName = profile?.display_name?.split(" ")[0] || "friend";
  const today = format(new Date(), "yyyy-MM-dd");
  const stage = stageForPractices(profile?.practices_completed ?? 0);
  const { text: hello, night } = greeting();
  const [mood, setMood] = useState<number | null>(null);

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

  const days = new Set(checkins.map((c) => dayOf(c.created_at)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(format(cursor, "yyyy-MM-dd"))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const practices = profile?.practices_completed ?? 0;
  const journeyConcern = profile?.concerns?.[0] ?? "Overthinking";
  const journeyProgress = Math.min(100, (practices % 5) * 20);

  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        {/* Greeting */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-2 text-[24px] font-bold leading-tight">
              {hello}, {firstName}{" "}
              {night ? (
                <Moon className="size-5 text-[var(--app-accent)]" />
              ) : (
                <Sun className="size-5 text-[var(--app-gold)]" />
              )}
            </h2>
            <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
              You’ve got this. We’re here for you.
            </p>
          </div>
          <div className="app-card flex items-center gap-2 px-3 py-2">
            <Flame className="size-5 text-[var(--app-rose)]" />
            <span className="leading-none">
              <strong className="block text-[16px]">{streak}</strong>
              <span className="text-[10px] text-[var(--app-text-dim)]">Day streak</span>
            </span>
          </div>
          <Link to="/app/profile" aria-label="Profile and notifications" className="pt-2">
            <Bell className="size-5 text-[var(--app-text-dim)]" />
          </Link>
        </div>

        {/* Daily check-in */}
        <div className="app-card relative mt-5 overflow-hidden p-5">
          <div className="max-w-[62%]">
            <h3 className="text-[19px] font-bold">Daily Check-in</h3>
            <p className="mt-1 text-[13px] text-[var(--app-text-dim)]">
              {todayCheckin ? "Checked in — thank you for showing up." : "How are you feeling today?"}
            </p>
          </div>
          <img
            src={vi.url}
            alt=""
            className="anim-float pointer-events-none absolute -right-2 top-2 size-28 object-contain"
          />
          <div className="mt-4 flex gap-2">
            {MOODS.map((m) => {
              const on = (todayCheckin?.mood ?? mood) === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={`flex size-10 items-center justify-center rounded-full text-xl transition-all ${on ? "scale-110 bg-[var(--app-accent)]" : "bg-[var(--app-surface-2)]"}`}
                  >
                    {m.emoji}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: on ? "var(--app-text)" : "var(--app-text-dim)" }}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
          <Link
            to="/app/checkin"
            search={{ mood: mood ?? undefined }}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--app-accent)] px-6 text-[14px] font-semibold text-[var(--app-on-accent)]"
          >
            {todayCheckin ? "Update check-in" : "Check in Now"}
          </Link>
        </div>

        {/* Today's plan */}
        <div className="app-card mt-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold">Today’s Plan</h3>
            <Link to="/app/practice" className="flex items-center gap-1 text-[13px] text-[var(--app-accent)]">
              See All <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto pb-1">
            {TODAYS_PLAN.map((item, i) => (
              <Link
                key={item.id}
                to={item.to}
                className="flex min-w-[86px] flex-col items-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-2)] px-3 py-3"
              >
                <span className="text-2xl">{item.emoji}</span>
                <strong className="mt-2 text-[13px]">{item.label}</strong>
                <span className="text-[11px] text-[var(--app-text-dim)]">{item.meta}</span>
                <span
                  className={`mt-2 flex size-4 items-center justify-center rounded-full border text-[9px] ${i < practices % 6 ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-[var(--app-on-accent)]" : "border-[var(--app-text-dim)]"}`}
                >
                  {i < practices % 6 ? "✓" : ""}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue your journey */}
        <div className="app-card mt-4 p-4">
          <p className="text-[15px] font-semibold text-[var(--app-accent)]">Continue Your Journey</p>
          <div className="mt-3 flex items-center gap-3">
            <img src={vi.url} alt="" className="size-14 shrink-0 object-contain" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold capitalize">
                {journeyConcern.replace("-", " ")} · Day {Math.max(1, practices)}
              </p>
              <p className="text-[12px] text-[var(--app-text-dim)]">Understanding mental loops</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
                  <span
                    className="block h-full rounded-full bg-[var(--app-accent)]"
                    style={{ width: `${journeyProgress}%` }}
                  />
                </span>
                <span className="text-[11px] text-[var(--app-text-dim)]">{journeyProgress}%</span>
              </div>
            </div>
          </div>
          <Link
            to="/app/journey"
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-[var(--app-accent)] text-[14px] font-semibold text-[var(--app-on-accent)]"
          >
            Continue Plan
          </Link>
        </div>

        {/* Garden */}
        <div className="app-card mt-4 p-4">
          <h3 className="flex items-center gap-2 text-[17px] font-bold">
            My Garden <span aria-hidden>{stage.emoji}</span>
          </h3>
          <p className="mt-1 text-[13px] text-[var(--app-text-dim)]">
            You planted {practices} positivity 🌱 — nurture your garden, grow your mind.
          </p>
          <p className="mt-1 text-[12px] text-[var(--app-text-dim)]">
            {stage.label} · {profile?.coins ?? 0} coins
          </p>
          <Link
            to="/app/garden"
            className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-[var(--app-accent)] px-5 text-[14px] font-semibold text-[var(--app-on-accent)]"
          >
            Enter Garden
          </Link>
        </div>

        {/* Trio */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/app/care" className="app-card p-4">
            <span className="text-2xl">🛋️</span>
            <strong className="mt-2 block text-[14px]">Talk to Therapist</strong>
            <span className="text-[11px] text-[var(--app-text-dim)]">
              Professional support when you need it.
            </span>
            <span className="mt-3 inline-flex h-8 items-center rounded-full bg-[var(--app-accent)] px-3 text-[12px] font-semibold text-[var(--app-on-accent)]">
              Connect Now
            </span>
          </Link>
          <Link to="/app/gaming" className="app-card p-4">
            <span className="text-2xl">🎮</span>
            <strong className="mt-2 block text-[14px]">Play &amp; Grow</strong>
            <span className="text-[11px] text-[var(--app-text-dim)]">Fun games that help you heal.</span>
            <span className="mt-3 inline-flex h-8 items-center rounded-full bg-[var(--app-accent)] px-3 text-[12px] font-semibold text-[var(--app-on-accent)]">
              Play Now
            </span>
          </Link>
        </div>

        <Link to="/app/via" className="app-card mt-3 flex items-center gap-3 p-4">
          <img src={vi.url} alt="" className="size-14 shrink-0 object-contain" />
          <span className="min-w-0 flex-1">
            <strong className="block text-[14px] text-[var(--app-accent)]">VIA welcomes you! 👋</strong>
            <span className="text-[12px] text-[var(--app-text-dim)]">
              I’m here to listen, guide and support you anytime.
            </span>
          </span>
          <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-[var(--app-accent)] px-4 text-[12px] font-semibold text-[var(--app-on-accent)]">
            Chat Now
          </span>
        </Link>
      </div>
    </AppScreen>
  );
}
