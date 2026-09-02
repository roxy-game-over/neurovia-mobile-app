import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Phone } from "lucide-react";

import { AppScreen } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/care")({ component: Care });

const CRISIS_LINES = [
  { name: "Tele-MANAS (India)", detail: "14416 · 24×7, free, multilingual" },
  { name: "KIRAN Helpline", detail: "1800-599-0019 · 24×7 mental health support" },
  { name: "AASRA", detail: "+91-9820466726 · 24×7 suicide prevention" },
  { name: "Emergency", detail: "112 · immediate danger" },
];

function Care() {
  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        <Link to="/app/profile" className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-[var(--app-text-dim)]">
          <ArrowLeft className="size-4" /> Profile
        </Link>
        <h2 className="text-[26px] font-bold leading-tight">Care</h2>
        <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
          Self-help has a ceiling. Knowing when to reach for a person is a skill, not a failure.
        </p>

        <div className="app-card mt-6 p-5">
          <span className="text-3xl">🫂</span>
          <h3 className="mt-3 text-[18px] font-bold">Professional care — coming soon</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--app-text-dim)]">
            We're onboarding verified psychologists and psychiatrists so you can move from
            self-practice to personal, professional care without leaving Neurovia. Waitlist
            members get first access.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-[var(--app-surface-2)] p-3">
              <span className="text-xl">🧑‍⚕️</span>
              <div className="flex-1"><p className="text-[13px] font-semibold">Psychologists</p><p className="text-[11px] text-[var(--app-text-dim)]">Therapy & counselling sessions</p></div>
              <span className="rounded-full bg-[var(--app-accent)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--app-accent)]">SOON</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[var(--app-surface-2)] p-3">
              <span className="text-xl">🩺</span>
              <div className="flex-1"><p className="text-[13px] font-semibold">Psychiatrists</p><p className="text-[11px] text-[var(--app-text-dim)]">Clinical & medical support</p></div>
              <span className="rounded-full bg-[var(--app-accent)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--app-accent)]">SOON</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--app-accent)]/40 bg-[var(--app-accent)]/8 p-5">
          <h3 className="flex items-center gap-2 text-[16px] font-bold"><Phone className="size-4 text-[var(--app-accent)]" /> If it's heavy right now</h3>
          <p className="mt-1 text-[12px] text-[var(--app-text-dim)]">Free, confidential, and answered by a human.</p>
          <div className="mt-3 space-y-2">
            {CRISIS_LINES.map((l) => (
              <div key={l.name} className="rounded-xl bg-[var(--app-surface)] p-3">
                <p className="text-[13px] font-semibold">{l.name}</p>
                <p className="text-[12px] text-[var(--app-text-dim)]">{l.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--app-text-dim)]">
          Neurovia supports mental wellness but is not a medical service and does not replace professional care.
        </p>
      </div>
    </AppScreen>
  );
}
