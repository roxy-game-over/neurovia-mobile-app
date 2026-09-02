import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, subDays } from "date-fns";
import { Battery, Flame, Moon, Smile, TrendingUp } from "lucide-react";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";
import { Vi } from "@/components/app/Brand";
import { supabase } from "@/integrations/supabase/client";
import { useAppAuth } from "@/lib/app/auth";
import { dayOf } from "@/routes/app.checkin";

export const Route = createFileRoute("/app/insights")({ component: Insights });

function avg(list: (number | null)[]) {
  const vals = list.filter((v): v is number => typeof v === "number");
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function Insights() {
  const { user, profile } = useAppAuth();

  const { data: checkins = [] } = useQuery({
    queryKey: ["check_ins", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(30);
      return data ?? [];
    },
  });

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = format(date, "yyyy-MM-dd");
    const entry = checkins.find((c) => dayOf(c.created_at) === key);
    return { key, label: format(date, "EEEEE"), mood: entry?.mood ?? null };
  });

  const moodAvg = avg(checkins.map((c) => c.mood));
  const energyAvg = avg(checkins.map((c) => c.energy));
  const sleepAvg = avg(checkins.map((c) => c.sleep));

  const stats = [
    { icon: Smile, label: "Average mood", value: moodAvg ? `${moodAvg.toFixed(1)}/5` : "—", tint: "var(--app-accent)" },
    { icon: Battery, label: "Average energy", value: energyAvg ? `${energyAvg.toFixed(1)}/5` : "—", tint: "var(--app-mint)" },
    { icon: Moon, label: "Average sleep", value: sleepAvg ? `${sleepAvg.toFixed(1)}/5` : "—", tint: "var(--app-rose)" },
    { icon: Flame, label: "Check-ins logged", value: String(checkins.length), tint: "var(--app-accent)" },
  ];

  return (
    <AppScreen>
      <ScreenHeader title="Insights" subtitle="Patterns, not verdicts." />

      <div className="mx-5 rounded-[24px] bg-[var(--app-surface)] p-5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--app-text)]">
          <TrendingUp className="size-4 text-[var(--app-accent)]" /> Mood this week
        </div>
        <div className="mt-5 flex h-32 items-end justify-between gap-2">
          {last7.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
              <span
                className="w-full rounded-t-xl"
                style={{
                  height: `${((d.mood ?? 0) / 5) * 100}%`,
                  minHeight: 6,
                  background: d.mood
                    ? "linear-gradient(180deg, var(--app-accent), var(--app-accent-strong))"
                    : "var(--app-surface-2)",
                }}
              />
              <span className="text-[10px] text-[var(--app-text-dim)]">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-5">
        {stats.map(({ icon: Icon, label, value, tint }) => (
          <div key={label} className="app-card p-4">
            <Icon className="size-[18px]" style={{ color: tint }} />
            <p className="mt-2 text-[22px] font-bold text-[var(--app-text)]">{value}</p>
            <p className="text-[12px] text-[var(--app-text-dim)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-4 flex items-center gap-4 rounded-[24px] bg-[var(--app-surface)] p-4">
        <Vi className="size-16 shrink-0" />
        <p className="text-[13px] leading-relaxed text-[var(--app-text-dim)]">
          {checkins.length < 3
            ? "A few more check-ins and I'll start noticing your patterns with you."
            : `You've grown ${profile?.practices_completed ?? 0} practices worth of garden. Your steadiest days follow the nights you rested well.`}
        </p>
      </div>
      <div className="pb-8" />
    </AppScreen>
  );
}
