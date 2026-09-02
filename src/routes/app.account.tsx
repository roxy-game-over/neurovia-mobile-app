import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";

import vi from "@/assets/vi-mascot.png.asset.json";
import { AppScreenPlain } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { CONSENT_ITEMS, GENDERS, WELLBEING_NOTICES } from "@/content/app-onboarding";
import { useAppAuth } from "@/lib/app/auth";

export const Route = createFileRoute("/app/account")({ component: AccountSetup });

const SITE = "https://neurovia-ai-in.lovable.app";

function Bars({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex flex-1 items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{ background: i < step ? "var(--app-accent)" : "var(--app-border)" }}
        />
      ))}
    </div>
  );
}

function ageFrom(dob: string) {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age < 130 ? String(age) : "";
}

function AccountSetup() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAppAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [dob, setDob] = useState(profile?.date_of_birth ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [agreed, setAgreed] = useState<boolean[]>(CONSENT_ITEMS.map(() => false));
  const [saving, setSaving] = useState(false);

  const allAgreed = agreed.every(Boolean);

  async function finish() {
    setSaving(true);
    await updateProfile({
      display_name: name.trim() || null,
      date_of_birth: dob || null,
      gender: gender || null,
      location: location.trim() || null,
      consent_accepted: true,
    });
    setSaving(false);
    void navigate({ to: "/app/onboarding" as never, replace: true });
  }

  return (
    <AppScreenPlain>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => (step === 1 ? void navigate({ to: "/app/auth" as never }) : setStep(step - 1))}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"
          >
            <ArrowLeft className="size-5" />
          </button>
          <Bars step={step} total={3} />
        </div>

        {step === 1 && (
          <section className="flex-1 pt-7">
            <h1 className="text-[30px] font-bold leading-tight">Create your account</h1>
            <p className="mt-1 text-[15px] text-[var(--app-text-dim)]">Let’s get to know you better</p>
            <img src={vi.url} alt="" className="mx-auto my-6 size-28 rounded-full object-contain" />

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-[var(--app-text-dim)]">Full Name</span>
                <input
                  className="app-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-[var(--app-text-dim)]">Email</span>
                <input className="app-input opacity-70" value={user?.email ?? ""} readOnly />
              </label>
              <div className="flex gap-3">
                <label className="block flex-1">
                  <span className="mb-1.5 block text-[13px] text-[var(--app-text-dim)]">Date of Birth</span>
                  <input
                    className="app-input"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </label>
                <label className="block w-24">
                  <span className="mb-1.5 block text-[13px] text-[var(--app-text-dim)]">Age</span>
                  <input className="app-input px-3 opacity-70" value={ageFrom(dob)} readOnly placeholder="—" />
                </label>
              </div>
              <div>
                <span className="mb-1.5 block text-[13px] text-[var(--app-text-dim)]">Gender</span>
                <div className="grid grid-cols-2 gap-3">
                  {GENDERS.map((g) => {
                    const on = gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-[14px] font-medium ${on ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-[var(--app-on-accent)]" : "border-[var(--app-border)] text-[var(--app-text)]"}`}
                      >
                        {g}
                        {on && <Check className="size-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="relative block">
                <span className="mb-1.5 block text-[13px] text-[var(--app-text-dim)]">Location (City)</span>
                <input
                  className="app-input pr-12"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
                <MapPin className="absolute right-4 bottom-4 size-5 text-[var(--app-text-dim)]" />
              </label>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flex-1 pt-10">
            <div className="text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-2xl">
                🛡️
              </span>
              <h1 className="mt-4 text-[30px] font-bold leading-tight">Your wellbeing matters</h1>
              <p className="mt-2 text-[15px] text-[var(--app-text-dim)]">
                Before you begin, please read this important information.
              </p>
            </div>
            <div className="mt-7 space-y-3">
              {WELLBEING_NOTICES.map((item) => (
                <div key={item.title} className="app-card flex items-start gap-4 p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-surface-2)] text-xl">
                    {item.emoji}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-[var(--app-text-dim)]">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flex-1 pt-8">
            <h1 className="text-[30px] font-bold leading-tight">Please read and agree</h1>
            <p className="mt-2 text-[15px] text-[var(--app-text-dim)]">
              Your consent helps us create a safe and supportive experience for you.
            </p>
            <div className="mt-6 space-y-3">
              {CONSENT_ITEMS.map((text, i) => {
                const on = agreed[i];
                return (
                  <button
                    key={text}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAgreed((old) => old.map((v, idx) => (idx === i ? !v : v)))}
                    className={`app-card flex w-full items-center gap-4 p-4 text-left ${on ? "border-[var(--app-accent)]" : ""}`}
                  >
                    <span className="flex-1 text-[14px] leading-snug">
                      {i === CONSENT_ITEMS.length - 1 ? (
                        <>
                          I agree to the{" "}
                          <a href={`${SITE}/terms`} target="_blank" rel="noreferrer" className="text-[var(--app-accent)] underline">
                            Terms of Use
                          </a>{" "}
                          and{" "}
                          <a href={`${SITE}/privacy`} target="_blank" rel="noreferrer" className="text-[var(--app-accent)] underline">
                            Privacy Policy
                          </a>
                          .
                        </>
                      ) : (
                        text
                      )}
                    </span>
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-[var(--app-accent)] bg-[var(--app-accent)]" : "border-[var(--app-text-dim)]"}`}
                    >
                      {on && <Check className="size-3.5 text-[var(--app-on-accent)]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="pt-8">
          {step === 1 && (
            <>
              <Button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="app-btn border-0"
              >
                Continue
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[var(--app-text-dim)]">
                <Lock className="size-3.5" /> Your data is safe with us.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <Button type="button" onClick={() => setStep(3)} className="app-btn border-0">
                I Understand
              </Button>
              <button
                type="button"
                onClick={() => void navigate({ to: "/app/safety" as never })}
                className="mt-3 w-full text-center text-[14px] text-[var(--app-accent)]"
              >
                Learn more about safety
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <Button
                type="button"
                disabled={!allAgreed || saving}
                onClick={() => void finish()}
                className="app-btn border-0"
              >
                {saving ? "Saving…" : "I Agree & Continue"}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[var(--app-text-dim)]">
                <ShieldCheck className="size-3.5 text-[var(--app-mint)]" /> You can review this anytime in Profile.
              </p>
            </>
          )}
        </div>
      </div>
    </AppScreenPlain>
  );
}
