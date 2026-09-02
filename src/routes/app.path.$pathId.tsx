import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Award, BookOpen, Check, Clock, Heart, PenLine, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { AppScreenPlain } from "@/components/app/AppShell";
import { Vi, Wordmark } from "@/components/app/Brand";
import { pathById, readProgress, writeProgress } from "@/content/growth-paths";
import { useAppAuth } from "@/lib/app/auth";
import { PRACTICE_COIN_REWARD } from "@/lib/app/progress";

export const Route = createFileRoute("/app/path/$pathId")({ component: PathScreen });

const KIND_ICON = { learn: BookOpen, practice: Heart, reflect: PenLine } as const;

function PathScreen() {
  const { pathId } = useParams({ from: "/app/path/$pathId" });
  const navigate = useNavigate();
  const { profile, updateProfile } = useAppAuth();
  const path = pathById(pathId);

  const [stage, setStage] = useState<"overview" | "step" | "complete">("overview");
  const [index, setIndex] = useState(0);
  const [reflection, setReflection] = useState("");
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const saved = readProgress()[pathId];
    if (saved) {
      setIndex(Math.min(saved.step, (path?.steps.length ?? 1) - 1));
      setReflection(saved.reflection ?? "");
    }
  }, [pathId, path]);

  if (!path) {
    return (
      <AppScreenPlain>
        <div className="flex flex-1 items-center justify-center px-6 text-center text-[var(--app-text-dim)]">
          <p>That path isn't available.</p>
        </div>
      </AppScreenPlain>
    );
  }

  const step = path.steps[index]!;
  const StepIcon = KIND_ICON[step.kind];

  function persist(nextStep: number, completed = false) {
    const all = readProgress();
    all[pathId] = { step: nextStep, completed, reflection };
    writeProgress(all);
  }

  async function finish() {
    persist(path!.steps.length, true);
    if (!claimed) {
      setClaimed(true);
      await updateProfile({
        coins: (profile?.coins ?? 0) + PRACTICE_COIN_REWARD * 2,
        practices_completed: (profile?.practices_completed ?? 0) + 1,
      });
    }
    setStage("complete");
  }

  if (stage === "overview") {
    return (
      <AppScreenPlain>
        <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
          <button
            type="button"
            aria-label="Back"
            onClick={() => void navigate({ to: "/app/paths" as never })}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"
          >
            <ArrowLeft className="size-5" />
          </button>

          <span
            className="mx-auto mt-6 flex size-20 items-center justify-center rounded-[28px] text-4xl"
            style={{ background: `color-mix(in oklab, ${path.accent} 16%, transparent)` }}
          >
            {path.emoji}
          </span>
          <h1 className="mt-4 text-center text-[26px] font-bold leading-tight text-[var(--app-text)]">
            {path.name}
          </h1>
          <p className="mt-2 text-center text-[15px] text-[var(--app-text-dim)]">{path.tagline}</p>

          <div className="mt-5 flex justify-center gap-2">
            {path.focus.map((f) => (
              <span
                key={f}
                className="rounded-full border border-[var(--app-border)] px-3 py-1 text-[11px] text-[var(--app-text-dim)]"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mt-7 space-y-2.5">
            {path.steps.map((s, i) => {
              const Icon = KIND_ICON[s.kind];
              return (
                <div key={s.title} className="app-card flex items-center gap-3.5 p-3.5">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-[var(--app-accent)]">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[14px] text-[var(--app-text)]">{s.title}</strong>
                    <span className="text-[11.5px] capitalize text-[var(--app-text-dim)]">
                      {s.kind} · {s.minutes} min
                    </span>
                  </span>
                  {i < index && <Check className="size-4 text-[var(--app-mint)]" />}
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8">
            <button type="button" onClick={() => setStage("step")} className="app-btn">
              {index > 0 ? "Continue path" : "Start this path"} <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </AppScreenPlain>
    );
  }

  if (stage === "complete") {
    return (
      <AppScreenPlain>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <Vi mood="celebrate" className="size-52" />
          <h1 className="mt-3 text-[28px] font-bold text-[var(--app-text)]">Path complete</h1>
          <p className="mt-2 text-[15px] text-[var(--app-text-dim)]">
            You finished <strong className="text-[var(--app-text)]">{path.name}</strong>. That's real work.
          </p>

          <div className="app-card mt-7 w-full p-6">
            <Award className="mx-auto size-9 text-[var(--app-accent)]" />
            <Wordmark className="mt-3" size={22} />
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[var(--app-text-dim)]">
              Certificate of completion
            </p>
            <p className="mt-2 text-[19px] font-bold text-[var(--app-text)]">{path.name}</p>
            <p className="mt-1 text-[13px] text-[var(--app-text-dim)]">
              {profile?.display_name ?? "You"} · {path.days}-day path
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--app-accent)]/15 px-3 py-1.5 text-[12px] font-bold text-[var(--app-accent)]">
                <Sparkles className="size-3.5" /> +{PRACTICE_COIN_REWARD * 2} coins
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--app-mint)]/15 px-3 py-1.5 text-[12px] font-bold text-[var(--app-mint)]">
                🌱 Garden grew
              </span>
            </div>
          </div>

          <div className="mt-7 w-full space-y-3">
            <button
              type="button"
              onClick={() => void navigate({ to: "/app/paths" as never })}
              className="app-btn"
            >
              Choose your next path <ArrowRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => void navigate({ to: "/app/garden" as never })}
              className="app-btn-quiet"
            >
              See my garden
            </button>
          </div>
        </div>
      </AppScreenPlain>
    );
  }

  const last = index === path.steps.length - 1;

  return (
    <AppScreenPlain>
      <div className="flex items-center justify-between px-5 pt-6">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (index === 0 ? setStage("overview") : setIndex(index - 1))}
          className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {path.steps.map((s, i) => (
            <span
              key={s.title}
              className="h-1.5 rounded-full"
              style={{
                width: i === index ? 26 : 10,
                background: i <= index ? path.accent : "var(--app-border)",
              }}
            />
          ))}
        </div>
        <span className="flex items-center gap-1 rounded-full border border-[var(--app-border)] px-2.5 py-1 text-[11px] text-[var(--app-text-dim)]">
          <Clock className="size-3" /> {step.minutes}m
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-[var(--app-accent)]">
          <StepIcon className="size-5" />
        </span>
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--app-text-dim)]">
          Step {index + 1} of {path.steps.length} · {step.kind}
        </p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight text-[var(--app-text)]">
          {step.title}
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--app-text-dim)]">{step.body}</p>

        {step.kind === "reflect" && (
          <div className="mt-5">
            <p className="text-[14px] font-semibold text-[var(--app-text)]">{step.prompt}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              placeholder="Write as much or as little as you like…"
              className="app-input mt-3 h-auto resize-none py-3.5"
            />
          </div>
        )}

        {step.kind === "practice" && (
          <div className="mt-6 flex flex-col items-center">
            <Vi className="size-40" />
            <p className="mt-2 text-[13px] text-[var(--app-text-dim)]">VI is doing this one with you.</p>
          </div>
        )}

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => {
              if (last) return void finish();
              persist(index + 1);
              setIndex(index + 1);
            }}
            className="app-btn"
          >
            {last ? "Complete path" : "Continue"} <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </AppScreenPlain>
  );
}
