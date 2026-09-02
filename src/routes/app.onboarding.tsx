import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

import { VI } from "@/components/app/Brand";
import { AppScreenPlain, Wordmark } from "@/components/app/AppShell";
import { IconChip, iconForEmoji } from "@/components/app/Icons";
import { Button } from "@/components/ui/button";
import {
  CONCERNS,
  GOALS,
  JOURNEY_FEATURES,
  TOGETHER_WE_CAN,
  VI_PROMISES,
  WELCOME_PILLARS,
} from "@/content/app-onboarding";
import { useAppAuth } from "@/lib/app/auth";

export const Route = createFileRoute("/app/onboarding")({ component: Onboarding });

const STEPS = 5;

function Dots({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: STEPS }, (_, i) => {
        const n = i + 1;
        return (
          <span
            key={n}
            className={`rounded-full transition-all ${n === step ? "size-3 ring-2 ring-[var(--app-accent)] ring-offset-2 ring-offset-[var(--app-bg)] bg-[var(--app-accent)]" : n < step ? "size-2.5 bg-[var(--app-accent)]" : "size-2.5 bg-[var(--app-border)]"}`}
          />
        );
      })}
    </div>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useAppAuth();
  const [step, setStep] = useState(1);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((old) => (old.includes(value) ? old.filter((item) => item !== value) : [...old, value]));

  async function finish() {
    setSaving(true);
    await updateProfile({ concerns, goals, onboarding_completed: true });
    setSaving(false);
    void navigate({ to: "/app/home" as never, replace: true });
  }

  const cta =
    step === 1 ? "Let’s Begin" : step === STEPS ? "Start My Journey" : "Continue";
  const blocked =
    (step === 3 && concerns.length === 0) || (step === 4 && goals.length === 0) || saving;

  return (
    <AppScreenPlain>
      <div className="flex flex-1 flex-col px-5 pb-7 pt-7">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => setStep((n) => Math.max(1, n - 1))}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-[13px] font-semibold tracking-[0.12em] text-[var(--app-accent)]">
            ONBOARDING FLOW
          </span>
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-full border border-[var(--app-border)] px-4 py-2 text-[13px]"
            >
              Skip
            </button>
          ) : (
            <span className="w-10 text-right text-[13px] text-[var(--app-text-dim)]">{step}/{STEPS}</span>
          )}
        </div>

        <div className="mt-6">
          <Dots step={step} />
        </div>

        <div className="flex-1 pt-8">
          {step === 1 && (
            <section className="text-center">
              <Wordmark />
              <p className="mt-2 text-[16px] font-medium text-[var(--app-accent)]">Decoding the Mind, Gently</p>
              <p className="mt-5 text-[17px] text-[var(--app-text)]">AI Mental Wellness Companion</p>
              <p className="text-[16px] text-[var(--app-text-dim)]">
                From <span className="text-[var(--app-rose)]">concern</span> to{" "}
                <span className="text-[var(--app-mint)]">care</span>.
              </p>
              <img src={VI.base} alt="VI holding a heart" className="anim-float mx-auto my-6 size-56 object-contain" />
              <div className="app-card space-y-4 p-4 text-left">
                {WELCOME_PILLARS.map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <IconChip name={iconForEmoji(item.emoji)} size={44} />
                    <div>
                      <p className="text-[14px] font-semibold">{item.title}</p>
                      <p className="text-[13px] text-[var(--app-text-dim)]">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h1 className="text-[34px] font-bold leading-tight">
                Hi, I’m <span className="text-[var(--app-accent)]">VI</span>
              </h1>
              <p className="mt-2 text-[18px] font-semibold text-[var(--app-accent)]">
                Your AI companion for mental wellness.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--app-text-dim)]">
                I’m here to listen, support you, and walk with you every step of the way.
              </p>
              <div className="relative mt-5">
                <img src={VI.base} alt="VI waving" className="anim-float mx-auto size-48 object-contain" />
                <p className="app-card absolute right-0 top-0 max-w-[52%] p-3 text-[13px]">
                  I’m excited to be part of your journey!
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {VI_PROMISES.map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-surface-2)] text-lg">
                      {item.emoji}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold">{item.title}</p>
                      <p className="text-[13px] text-[var(--app-text-dim)]">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="app-card mt-5 p-4">
                <p className="text-[14px] font-semibold text-[var(--app-accent)]">Together, we can…</p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {TOGETHER_WE_CAN.map((item) => (
                    <div key={item.label}>
                      <IconChip name={iconForEmoji(item.emoji)} size={44} round className="mx-auto" />
                      <p className="mt-2 text-[11px] leading-tight text-[var(--app-text-dim)]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h1 className="text-[34px] font-bold leading-tight">
                What brings you<br />
                here <span className="text-[var(--app-accent)]">today?</span>
              </h1>
              <p className="mt-3 text-[15px] text-[var(--app-text-dim)]">You can choose more than one.</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {CONCERNS.map((item) => (
                  <Choice
                    key={item.id}
                    label={item.label}
                    emoji={item.emoji}
                    selected={concerns.includes(item.id)}
                    onClick={() => toggle(item.id, setConcerns)}
                  />
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h1 className="text-[34px] font-bold leading-tight">
                What are your<br />
                <span className="text-[var(--app-accent)]">goals?</span>
              </h1>
              <p className="mt-3 text-[15px] text-[var(--app-text-dim)]">
                Choose what you would like to improve.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {GOALS.map((item) => (
                  <Choice
                    key={item.id}
                    label={item.label}
                    emoji={item.emoji}
                    selected={goals.includes(item.id)}
                    onClick={() => toggle(item.id, setGoals)}
                  />
                ))}
              </div>
            </section>
          )}

          {step === 5 && (
            <section>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h1 className="text-[32px] font-bold leading-tight">
                    Let’s start your<br />
                    <span className="text-[var(--app-accent)]">journey</span>
                  </h1>
                  <p className="mt-3 text-[15px] leading-snug text-[var(--app-text-dim)]">
                    Small steps today,<br />a better you tomorrow.
                  </p>
                </div>
                <img src={VI.base} alt="VI with a seedling" className="anim-float size-36 object-contain" />
              </div>
              <div className="mt-6 space-y-3">
                {JOURNEY_FEATURES.map((item) => (
                  <div key={item.title} className="app-card flex items-center gap-4 p-4">
                    <IconChip name={iconForEmoji(item.emoji)} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold">{item.title}</p>
                      <p className="text-[12.5px] leading-snug text-[var(--app-text-dim)]">{item.body}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-[var(--app-text-dim)]" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pt-8">
          <Button
            type="button"
            disabled={blocked}
            onClick={() => (step === STEPS ? void finish() : setStep((n) => n + 1))}
            className="app-btn border-0"
          >
            {saving ? "Saving your path…" : cta}
            {step === STEPS ? <Sparkles className="size-5" /> : <ArrowRight className="size-5" />}
          </Button>
          <p className="mt-3 text-center text-[11px] text-[var(--app-text-dim)]">
            You can change this anytime in Profile.
          </p>
        </div>
      </div>
    </AppScreenPlain>
  );
}

function Choice({
  label,
  emoji,
  selected,
  onClick,
}: {
  label: string;
  emoji: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`app-card flex min-h-[90px] items-center gap-3 p-4 text-left transition-all ${selected ? "border-[var(--app-accent)] bg-[var(--app-surface-2)]" : ""}`}
    >
      <IconChip name={iconForEmoji(emoji)} size={38} />
      <span className="text-[13px] font-semibold leading-tight">{label}</span>
      <span
        className={`ml-auto flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[var(--app-accent)] bg-[var(--app-accent)]" : "border-[var(--app-text-dim)]"}`}
      >
        {selected && <Check className="size-3 text-[var(--app-on-accent)]" />}
      </span>
    </button>
  );
}
