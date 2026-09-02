import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppScreen } from "@/components/app/AppShell";
import { IconChip, iconForEmoji } from "@/components/app/Icons";

export const Route = createFileRoute("/app/safety")({ component: Safety });

const PRINCIPLES = [
  { emoji: "🔒", title: "Your words stay yours", body: "Journal entries, check-ins, and conversations are private to your account and protected by row-level security. We never sell personal data." },
  { emoji: "🧭", title: "VIA is a companion, not a clinician", body: "VIA listens, reflects, and guides practices. It does not diagnose, prescribe, or replace professional care — and it will say so." },
  { emoji: "🚪", title: "Heavy moments route to humans", body: "When things feel beyond self-help, Neurovia points you to crisis lines and (soon) verified professionals, not more content." },
  { emoji: "🧹", title: "You can leave cleanly", body: "Your data belongs to you. Contact help@neurovia-ai.in any time to export or delete your account and everything attached to it." },
];

function Safety() {
  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        <Link to="/app/profile" className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-[var(--app-text-dim)]">
          <ArrowLeft className="size-4" /> Profile
        </Link>
        <h2 className="text-[26px] font-bold leading-tight">Safety</h2>
        <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
          The boundaries Neurovia is built on — so you always know where you stand.
        </p>

        <div className="mt-6 space-y-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="app-card p-5">
              <IconChip name={iconForEmoji(p.emoji)} size={42} />
              <h3 className="mt-2 text-[15px] font-bold">{p.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--app-text-dim)]">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="app-card mt-4 p-5">
          <h3 className="text-[15px] font-bold">Read the fine print</h3>
          <div className="mt-3 space-y-2 text-[13px] font-semibold text-[var(--app-accent)]">
            <a href="https://neurovia-ai-in.lovable.app/privacy" target="_blank" rel="noreferrer" className="block">Privacy policy →</a>
            <a href="https://neurovia-ai-in.lovable.app/terms" target="_blank" rel="noreferrer" className="block">Terms & conditions →</a>
            <a href="https://neurovia-ai-in.lovable.app/disclaimer" target="_blank" rel="noreferrer" className="block">Mental wellness disclaimer →</a>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
