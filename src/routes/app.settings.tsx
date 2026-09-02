import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { AppIcon, IconChip } from "@/components/app/Icons";
import { useAppAuth } from "@/lib/app/auth";
import { useAppTheme } from "@/lib/app/theme";

export const Route = createFileRoute("/app/settings")({ component: Settings });

const SITE = "https://www.neurovia-ai.in";

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-[var(--app-accent)]" : "bg-[var(--app-surface-2)]"
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-[var(--app-text)] transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Settings() {
  const { profile, user } = useAppAuth();
  const { theme, toggleTheme } = useAppTheme();
  const [reminders, setReminders] = useState(true);
  const [checkinNudge, setCheckinNudge] = useState(true);
  const [gardenUpdates, setGardenUpdates] = useState(false);

  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        <Link
          to="/app/profile"
          className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-[var(--app-text-dim)]"
        >
          <ArrowLeft className="size-4" /> Profile
        </Link>

        <h1 className="text-[26px] font-bold leading-tight">Settings</h1>
        <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">
          Your account, your data, your pace.
        </p>

        {/* Account */}
        <h2 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-dim)]">
          Account
        </h2>
        <div className="app-card mt-2 divide-y divide-[var(--app-border)]">
          <Row label="Name" value={profile?.display_name || "—"} />
          <Row label="Email" value={user?.email ?? "—"} />
          <Row label="Date of birth" value={profile?.date_of_birth || "—"} />
          <Row label="Gender" value={profile?.gender || "—"} />
          <Row label="Location" value={profile?.location || "—"} />
        </div>

        {/* Appearance */}
        <h2 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-dim)]">
          Appearance
        </h2>
        <button
          type="button"
          onClick={toggleTheme}
          className="app-card mt-2 flex w-full items-center gap-3.5 p-4 text-left"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-accent)]/14 text-[var(--app-accent)]">
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </span>
          <span className="flex-1 text-[14px] font-semibold">Theme</span>
          <span className="text-[12px] text-[var(--app-text-dim)]">
            {theme === "dark" ? "Night" : "Day"}
          </span>
        </button>

        {/* Notifications */}
        <h2 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-dim)]">
          Notifications
        </h2>
        <div className="app-card mt-2 divide-y divide-[var(--app-border)]">
          <SwitchRow
            icon="breathe"
            label="Daily practice reminder"
            meta="One nudge a day, never more."
            on={reminders}
            onToggle={() => setReminders((v) => !v)}
          />
          <SwitchRow
            icon="mood"
            label="Check-in nudge"
            meta="A gentle prompt if you haven't checked in."
            on={checkinNudge}
            onToggle={() => setCheckinNudge((v) => !v)}
          />
          <SwitchRow
            icon="garden"
            label="Garden updates"
            meta="When a seed you planted grows."
            on={gardenUpdates}
            onToggle={() => setGardenUpdates((v) => !v)}
          />
        </div>

        {/* Support & legal */}
        <h2 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-dim)]">
          Support &amp; legal
        </h2>
        <div className="app-card mt-2 divide-y divide-[var(--app-border)]">
          <Link to="/app/safety" className="flex items-center gap-3.5 p-4">
            <IconChip name="safety" size={38} />
            <span className="flex-1 text-[14px] font-semibold">Safety &amp; boundaries</span>
            <ChevronRight className="size-4 text-[var(--app-text-dim)]" />
          </Link>
          <Link to="/app/care" className="flex items-center gap-3.5 p-4">
            <IconChip name="crisis" size={38} />
            <span className="flex-1 text-[14px] font-semibold">Crisis support</span>
            <ChevronRight className="size-4 text-[var(--app-text-dim)]" />
          </Link>
          <a href={`${SITE}/privacy`} target="_blank" rel="noreferrer" className="flex items-center gap-3.5 p-4">
            <IconChip name="locked" size={38} />
            <span className="flex-1 text-[14px] font-semibold">Privacy Policy</span>
            <ChevronRight className="size-4 text-[var(--app-text-dim)]" />
          </a>
          <a href={`${SITE}/terms`} target="_blank" rel="noreferrer" className="flex items-center gap-3.5 p-4">
            <IconChip name="library" size={38} />
            <span className="flex-1 text-[14px] font-semibold">Terms of Use</span>
            <ChevronRight className="size-4 text-[var(--app-text-dim)]" />
          </a>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--app-text-dim)]">
          <AppIcon name="spark" size={12} /> Neurovia — decoding the mind, gently.
        </p>
      </div>
    </AppScreen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="flex-1 text-[14px] font-semibold">{label}</span>
      <span className="max-w-[55%] truncate text-[12.5px] text-[var(--app-text-dim)]">{value}</span>
    </div>
  );
}

function SwitchRow({
  icon,
  label,
  meta,
  on,
  onToggle,
}: {
  icon: "breathe" | "mood" | "garden";
  label: string;
  meta: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 p-4">
      <IconChip name={icon} size={38} />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">{label}</span>
        <span className="block text-[11.5px] text-[var(--app-text-dim)]">{meta}</span>
      </span>
      <Toggle on={on} onToggle={onToggle} label={label} />
    </div>
  );
}
