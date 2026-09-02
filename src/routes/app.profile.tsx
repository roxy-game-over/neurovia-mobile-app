import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, LogOut, Pencil } from "lucide-react";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { VI } from "@/components/app/Brand";
import { AppIcon, IconChip } from "@/components/app/Icons";
import { useAppAuth } from "@/lib/app/auth";
import { stageForPractices } from "@/lib/app/progress";

export const Route = createFileRoute("/app/profile")({ component: Profile });

const LINKS = [
  { to: "/app/insights", icon: "insights" as const, label: "Insights", meta: "Mood, energy & sleep trends" },
  { to: "/app/personality", icon: "space" as const, label: "My Space", meta: "Concerns, goals & VIA tone" },
  { to: "/app/garden", icon: "garden" as const, label: "My Garden", meta: "Your growth, plant by plant" },
  { to: "/app/care", icon: "psychologist" as const, label: "Care", meta: "Therapists & crisis support" },
  { to: "/app/settings", icon: "safety" as const, label: "Settings", meta: "Account, privacy & appearance" },
];

function Profile() {
  const { profile, user, signOut, updateProfile } = useAppAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const stage = stageForPractices(profile?.practices_completed ?? 0);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);

  async function saveName() {
    if (!name.trim()) return;
    setSaving(true);
    await updateProfile({ display_name: name.trim() });
    setSaving(false);
    setEditing(false);
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/app/auth", replace: true });
  }

  return (
    <AppScreen>
      <div className="px-5 pb-8 pt-6">
        {/* Identity */}
        <div className="app-card flex items-center gap-4 p-5">
          <img
            src={VI.base}
            alt=""
            loading="lazy"
            className="size-16 shrink-0 rounded-full bg-[var(--app-accent)]/12 object-contain p-1"
          />
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="app-input flex-1 px-3 py-2 text-[14px]"
                />
                <button
                  type="button"
                  onClick={() => void saveName()}
                  disabled={saving}
                  className="app-btn border-0 px-3 py-2 text-[13px]"
                >
                  <Check className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="flex items-center gap-2 text-[18px] font-bold">
                  {profile?.display_name || "Friend"}
                  <button
                    type="button"
                    aria-label="Edit name"
                    onClick={() => {
                      setName(profile?.display_name ?? "");
                      setEditing(true);
                    }}
                  >
                    <Pencil className="size-3.5 text-[var(--app-text-dim)]" />
                  </button>
                </h1>
                <p className="truncate text-[12px] text-[var(--app-text-dim)]">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--app-mint)]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--app-mint)]">
                  <AppIcon name="tree" size={12} /> {stage.label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Coins", value: profile?.coins ?? 0, icon: "spark" as const },
            { label: "Practices", value: profile?.practices_completed ?? 0, icon: "progress" as const },
            { label: "Concerns", value: profile?.concerns?.length ?? 0, icon: "reframe" as const },
          ].map((s) => (
            <div key={s.label} className="app-card flex flex-col items-center gap-1 px-2 py-3.5">
              <AppIcon name={s.icon} size={17} />
              <strong className="text-[20px] leading-none">{s.value}</strong>
              <span className="text-[10.5px] text-[var(--app-text-dim)]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Concerns & goals */}
        {profile?.concerns?.length || profile?.goals?.length ? (
          <div className="app-card mt-4 p-5">
            {profile?.concerns?.length ? (
              <>
                <p className="text-[12px] font-semibold text-[var(--app-text-dim)]">
                  WHAT BROUGHT YOU HERE
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.concerns.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[var(--app-border)] px-3 py-1 text-[12px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
            {profile?.goals?.length ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold text-[var(--app-text-dim)]">YOUR GOALS</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.goals.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-[var(--app-accent)]/12 px-3 py-1 text-[12px] text-[var(--app-accent)]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <Link
              to="/app/onboarding"
              className="mt-4 block text-[12px] font-semibold text-[var(--app-accent)]"
            >
              Update in onboarding →
            </Link>
          </div>
        ) : null}

        {/* Links */}
        <div className="mt-4 space-y-2.5">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="app-card flex items-center gap-3.5 p-4">
              <IconChip name={l.icon} size={42} />
              <span className="min-w-0 flex-1">
                <strong className="block text-[14.5px]">{l.label}</strong>
                <span className="block text-[11.5px] text-[var(--app-text-dim)]">{l.meta}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-[var(--app-text-dim)]" />
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--app-border)] py-3.5 text-[14px] font-semibold text-[var(--app-text-dim)]"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </AppScreen>
  );
}
