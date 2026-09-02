import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, LogOut, Moon, Pencil, Sun } from "lucide-react";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppShell";
import { useQueryClient } from "@tanstack/react-query";
import { useAppAuth } from "@/lib/app/auth";
import { useAppTheme } from "@/lib/app/theme";
import { stageForPractices } from "@/lib/app/progress";

export const Route = createFileRoute("/app/profile")({ component: Profile });

function Profile() {
  const { profile, user, signOut, updateProfile } = useAppAuth();
  const { theme, toggleTheme } = useAppTheme();
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
      <div className="px-5 pb-8">
        {/* Identity */}
        <div className="app-card flex items-center gap-4 p-5">
          <span className="flex size-16 items-center justify-center rounded-full bg-[var(--app-accent)]/15 text-3xl">🌿</span>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className="app-input flex-1 px-3 py-2 text-[14px]" />
                <button type="button" onClick={() => void saveName()} disabled={saving} className="app-btn border-0 px-3 py-2 text-[13px]">
                  <Check className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="flex items-center gap-2 text-[18px] font-bold">
                  {profile?.display_name || "Friend"}
                  <button type="button" aria-label="Edit name" onClick={() => { setName(profile?.display_name ?? ""); setEditing(true); }}>
                    <Pencil className="size-3.5 text-[var(--app-text-dim)]" />
                  </button>
                </h2>
                <p className="truncate text-[12px] text-[var(--app-text-dim)]">{user?.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="app-card p-4 text-center">
            <p className="text-[22px] font-bold text-[var(--app-accent)]">{profile?.coins ?? 0}</p>
            <p className="text-[11px] text-[var(--app-text-dim)]">Coins</p>
          </div>
          <div className="app-card p-4 text-center">
            <p className="text-[22px] font-bold">{profile?.practices_completed ?? 0}</p>
            <p className="text-[11px] text-[var(--app-text-dim)]">Practices</p>
          </div>
          <div className="app-card p-4 text-center">
            <p className="text-[22px] font-bold">{stage.emoji}</p>
            <p className="text-[11px] text-[var(--app-text-dim)]">{stage.label}</p>
          </div>
        </div>

        {/* Concerns & goals */}
        {(profile?.concerns?.length || profile?.goals?.length) ? (
          <div className="app-card mt-4 p-5">
            {profile?.concerns?.length ? (
              <>
                <p className="text-[12px] font-semibold text-[var(--app-text-dim)]">WHAT BROUGHT YOU HERE</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.concerns.map((c) => (
                    <span key={c} className="rounded-full border border-[var(--app-border)] px-3 py-1 text-[12px]">{c}</span>
                  ))}
                </div>
              </>
            ) : null}
            {profile?.goals?.length ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold text-[var(--app-text-dim)]">YOUR GOALS</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.goals.map((g) => (
                    <span key={g} className="rounded-full bg-[var(--app-accent)]/12 px-3 py-1 text-[12px] text-[var(--app-accent)]">{g}</span>
                  ))}
                </div>
              </div>
            ) : null}
            <Link to="/app/onboarding" className="mt-4 block text-[12px] font-semibold text-[var(--app-accent)]">Update in onboarding →</Link>
          </div>
        ) : null}

        {/* Settings */}
        <div className="app-card mt-4 divide-y divide-[var(--app-border)]">
          <button type="button" onClick={toggleTheme} className="flex w-full items-center gap-3 p-4 text-left">
            {theme === "dark" ? <Sun className="size-4 text-[var(--app-accent)]" /> : <Moon className="size-4 text-[var(--app-accent)]" />}
            <span className="flex-1 text-[14px] font-semibold">Appearance</span>
            <span className="text-[12px] text-[var(--app-text-dim)]">{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
          <Link to="/app/care" className="flex w-full items-center gap-3 p-4">
            <span className="text-base">🫂</span>
            <span className="flex-1 text-[14px] font-semibold">Care</span>
            <span className="text-[12px] text-[var(--app-text-dim)]">Professional support</span>
          </Link>
          <Link to="/app/safety" className="flex w-full items-center gap-3 p-4">
            <span className="text-base">🛡️</span>
            <span className="flex-1 text-[14px] font-semibold">Safety</span>
            <span className="text-[12px] text-[var(--app-text-dim)]">Privacy & boundaries</span>
          </Link>
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
