import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import vi from "@/assets/vi-mascot.png.asset.json";
import { AppScreenPlain } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { CONCERNS, GOALS, VI_PROMISES, WELCOME_PILLARS } from "@/content/app-onboarding";
import { useAppAuth } from "@/lib/app/auth";

export const Route = createFileRoute("/app/onboarding")({ component: Onboarding });

function Progress({ step }: { step: number }) {
  return <div className="flex items-center justify-center gap-2">{[1, 2, 3, 4].map((n) => <span key={n} className={`h-2.5 rounded-full transition-all ${n === step ? "w-8 bg-[var(--app-accent)]" : n < step ? "w-2.5 bg-[var(--app-accent)]" : "w-2.5 bg-[var(--app-border)]"}`} />)}</div>;
}

function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useAppAuth();
  const [step, setStep] = useState(1);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const toggle = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((old) => old.includes(value) ? old.filter((item) => item !== value) : [...old, value]);
  async function finish() {
    setSaving(true);
    await updateProfile({ concerns, goals, onboarding_completed: true });
    setSaving(false);
    void navigate({ to: "/app/home" as never, replace: true });
  }
  return <AppScreenPlain><div className="flex flex-1 flex-col px-5 pb-7 pt-7">
    <div className="flex items-center justify-between"><button type="button" aria-label="Previous step" onClick={() => setStep((n) => Math.max(1, n - 1))} className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"><ArrowLeft className="size-5" /></button><span className="text-[13px] font-semibold tracking-[0.12em] text-[var(--app-accent)]">ONBOARDING</span><span className="w-10 text-right text-[13px] text-[var(--app-text-dim)]">{step}/4</span></div>
    <div className="mt-6"><Progress step={step} /></div>
    <div className="flex-1 pt-10">
      {step === 1 && <section className="text-center"><img src={vi.url} alt="VI holding a heart" className="mx-auto size-44 object-contain" /><h1 className="mt-5 text-[34px] font-bold leading-tight">Hi, I’m <span className="text-[var(--app-accent)]">VI</span> <span aria-hidden>💜</span></h1><p className="mx-auto mt-4 max-w-[320px] text-[15px] leading-relaxed text-[var(--app-text-dim)]">Your AI companion for mental wellness. I’m here to listen, support you, and walk with you every step of the way.</p><div className="mt-8 grid grid-cols-2 gap-3">{WELCOME_PILLARS.map((item) => <div key={item.title} className="app-card p-4 text-left"><span className="text-2xl">{item.emoji}</span><p className="mt-3 text-[13px] font-semibold">{item.title}</p><p className="mt-1 text-[11px] leading-snug text-[var(--app-text-dim)]">{item.body}</p></div>)}</div></section>}
      {step === 2 && <section><p className="text-center text-[14px] text-[var(--app-accent)]">Let’s make this personal</p><h1 className="mt-3 text-[34px] font-bold leading-tight">What brings you<br /><span className="text-[var(--app-accent)]">here today?</span></h1><p className="mt-3 text-[15px] text-[var(--app-text-dim)]">Choose more than one if it feels right.</p><div className="mt-7 grid grid-cols-2 gap-3">{CONCERNS.map((item) => <Choice key={item.id} label={item.label} emoji={item.emoji} selected={concerns.includes(item.id)} onClick={() => toggle(item.id, setConcerns)} />)}</div></section>}
      {step === 3 && <section><p className="text-center text-[14px] text-[var(--app-accent)]">Your direction matters</p><h1 className="mt-3 text-[34px] font-bold leading-tight">What are your<br /><span className="text-[var(--app-accent)]">goals?</span></h1><p className="mt-3 text-[15px] text-[var(--app-text-dim)]">Choose what you’d like to improve.</p><div className="mt-7 grid grid-cols-2 gap-3">{GOALS.map((item) => <Choice key={item.id} label={item.label} emoji={item.emoji} selected={goals.includes(item.id)} onClick={() => toggle(item.id, setGoals)} />)}</div></section>}
      {step === 4 && <section><div className="text-center"><img src={vi.url} alt="VI with a growing seedling" className="mx-auto size-40 object-contain" /><h1 className="mt-3 text-[34px] font-bold leading-tight">Let’s start your<br /><span className="text-[var(--app-accent)]">journey</span></h1><p className="mt-3 text-[15px] text-[var(--app-text-dim)]">Small steps today, a better you tomorrow. <span aria-hidden>💜</span></p></div><div className="mt-7 space-y-3">{VI_PROMISES.map((item) => <div key={item.title} className="app-card flex items-center gap-4 p-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-xl">{item.emoji}</span><div><p className="font-semibold">{item.title}</p><p className="text-[13px] text-[var(--app-text-dim)]">{item.body}</p></div><Check className="ml-auto size-4 text-[var(--app-mint)]" /></div>)}</div><div className="mt-4 flex items-center gap-2 rounded-2xl bg-[var(--app-surface)] p-4 text-[12px] text-[var(--app-text-dim)]"><ShieldCheck className="size-5 shrink-0 text-[var(--app-mint)]" />Your privacy and feelings stay safe with Neurovia.</div></section>}
    </div>
    <div className="pt-8"><Button type="button" disabled={saving || (step === 2 && concerns.length === 0) || (step === 3 && goals.length === 0)} onClick={() => step === 4 ? void finish() : setStep((n) => n + 1)} className="app-btn border-0">{saving ? "Saving your path…" : step === 4 ? "Start my journey" : "Continue"}{step === 4 ? <Sparkles className="size-5" /> : <ArrowRight className="size-5" />}</Button><p className="mt-3 text-center text-[11px] text-[var(--app-text-dim)]">You can change this anytime in Profile.</p></div>
  </div></AppScreenPlain>;
}

function Choice({ label, emoji, selected, onClick }: { label: string; emoji: string; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`app-card flex min-h-[90px] items-center gap-3 p-4 text-left transition-all ${selected ? "border-[var(--app-accent)] bg-[var(--app-surface-2)]" : ""}`}><span className="text-2xl">{emoji}</span><span className="text-[13px] font-semibold leading-tight">{label}</span><span className={`ml-auto flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[var(--app-accent)] bg-[var(--app-accent)]" : "border-[var(--app-text-dim)]"}`}>{selected && <Check className="size-3 text-[var(--app-on-accent)]" />}</span></button>;
}
