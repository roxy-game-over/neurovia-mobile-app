import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Phone } from "lucide-react";

import { AppScreen } from "@/components/app/AppShell";
import { VI } from "@/components/app/Brand";
import { AppIcon, IconChip } from "@/components/app/Icons";

export const Route = createFileRoute("/app/care")({ component: Care });

const CRISIS_LINES = [
  { name: "Tele-MANAS (India)", detail: "14416 · 24×7, free, multilingual", tel: "14416" },
  { name: "KIRAN Helpline", detail: "1800-599-0019 · 24×7 mental health support", tel: "18005990019" },
  { name: "AASRA", detail: "+91-9820466726 · 24×7 suicide prevention", tel: "+919820466726" },
  { name: "Emergency", detail: "112 · immediate danger", tel: "112" },
];

const SUPPORT = [
  {
    icon: "chat" as const,
    title: "VIA companion",
    body: "Your AI companion — always awake, always kind.",
    meta: "Available now",
    to: "/app/via",
    live: true,
  },
  {
    icon: "psychologist" as const,
    title: "Psychologist",
    body: "Talk therapy and counselling sessions, booked in-app.",
    meta: "Coming soon",
    to: "/app/care",
    live: false,
  },
  {
    icon: "psychiatrist" as const,
    title: "Psychiatrist",
    body: "Medical and clinical support when the day asks for more.",
    meta: "Coming soon",
    to: "/app/care",
    live: false,
  },
  {
    icon: "safety" as const,
    title: "Safety plan",
    body: "Your boundaries, your privacy, your escape hatch.",
    meta: "Available now",
    to: "/app/safety",
    live: true,
  },
];

function Care() {
  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        <Link
          to="/app/home"
          className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-[var(--app-text-dim)]"
        >
          <ArrowLeft className="size-4" /> Home
        </Link>

        {/* Header */}
        <div className="app-card relative overflow-hidden p-5">
          <div className="max-w-[62%]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--app-accent)]">
              Care
            </p>
            <h1 className="mt-1 text-[24px] font-bold leading-tight">And real people when you need them.</h1>
            <p className="mt-1.5 text-[13px] leading-snug text-[var(--app-text-dim)]">
              Self-help has a ceiling. Knowing when to reach for a person is a skill, not a failure.
            </p>
          </div>
          <img
            src={VI.care}
            alt=""
            loading="lazy"
            className="anim-float pointer-events-none absolute -bottom-3 -right-4 size-32 object-contain"
          />
        </div>

        {/* Support around you */}
        <h2 className="mt-6 text-[17px] font-bold">Support around you</h2>
        <div className="mt-3 space-y-3">
          {SUPPORT.map((s) => (
            <Link key={s.title} to={s.to} className="app-card flex items-center gap-3.5 p-4">
              <IconChip name={s.icon === "chat" ? "psychologist" : s.icon} size={46} />
              <span className="min-w-0 flex-1">
                <strong className="block text-[15px]">{s.title}</strong>
                <span className="block text-[12px] leading-snug text-[var(--app-text-dim)]">{s.body}</span>
              </span>
              {s.live ? (
                <ChevronRight className="size-4 shrink-0 text-[var(--app-text-dim)]" />
              ) : (
                <span className="shrink-0 rounded-full bg-[var(--app-accent)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--app-accent)]">
                  SOON
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Crisis */}
        <div className="mt-6 rounded-2xl border border-[var(--app-rose)]/45 bg-[var(--app-rose)]/8 p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-bold">
            <AppIcon name="crisis" size={17} /> If it&apos;s heavy right now
          </h2>
          <p className="mt-1 text-[12px] text-[var(--app-text-dim)]">
            Free, confidential, and answered by a human.
          </p>
          <div className="mt-3 space-y-2">
            {CRISIS_LINES.map((l) => (
              <a
                key={l.name}
                href={`tel:${l.tel}`}
                className="flex items-center gap-3 rounded-xl bg-[var(--app-surface)] p-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold">{l.name}</span>
                  <span className="block text-[12px] text-[var(--app-text-dim)]">{l.detail}</span>
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-rose)]/16 text-[var(--app-rose)]">
                  <Phone className="size-4" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--app-text-dim)]">
          Neurovia supports mental wellness but is not a medical service and does not replace
          professional care.
        </p>
      </div>
    </AppScreen>
  );
}
