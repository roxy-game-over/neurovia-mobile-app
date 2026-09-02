import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

export type AppProfile = {
  id: string;
  display_name: string | null;
  concerns: string[];
  goals: string[];
  theme: string;
  onboarding_completed: boolean;
  coins: number;
  garden_stage: string;
  practices_completed: number;
  date_of_birth: string | null;
  gender: string | null;
  location: string | null;
  consent_accepted: boolean;
};

type AuthCtx = {
  loading: boolean;
  user: User | null;
  session: Session | null;
  profile: AppProfile | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<AppProfile, "id">>) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);

  const loadProfile = useCallback(async (userId: string, displayName: string | null) => {
    const { data } = await supabase.from("app_profiles").select("*").eq("id", userId).maybeSingle();
    if (data) {
      // Backfill a missing display name from auth metadata when we have one.
      if (!data.display_name && displayName) {
        const { data: patched } = await supabase
          .from("app_profiles")
          .update({ display_name: displayName })
          .eq("id", userId)
          .select("*")
          .maybeSingle();
        setProfile((patched as AppProfile) ?? (data as AppProfile));
        return;
      }
      setProfile(data as AppProfile);
      return;
    }
    const { data: created } = await supabase
      .from("app_profiles")
      .insert({ id: userId, display_name: displayName })
      .select("*")
      .maybeSingle();
    setProfile((created as AppProfile) ?? null);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) setProfile(null);
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const user = session?.user;
    if (!user) return;
    const name =
      (user.user_metadata?.["display_name"] as string | undefined) ??
      (user.user_metadata?.["full_name"] as string | undefined) ??
      null;
    void loadProfile(user.id, name);
  }, [session?.user, loadProfile]);

  const refreshProfile = useCallback(async () => {
    const user = session?.user;
    if (!user) return;
    await loadProfile(user.id, null);
  }, [session?.user, loadProfile]);

  const updateProfile = useCallback(
    async (patch: Partial<Omit<AppProfile, "id">>) => {
      const user = session?.user;
      if (!user) return;
      const { data } = await supabase
        .from("app_profiles")
        .update(patch)
        .eq("id", user.id)
        .select("*")
        .maybeSingle();
      if (data) setProfile(data as AppProfile);
    },
    [session?.user],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      loading,
      user: session?.user ?? null,
      session,
      profile,
      refreshProfile,
      updateProfile,
      signOut,
    }),
    [loading, session, profile, refreshProfile, updateProfile, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppAuth must be used inside AppAuthProvider");
  return ctx;
}
