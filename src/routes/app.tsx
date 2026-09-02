import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { AppAuthProvider, useAppAuth } from "@/lib/app/auth";
import { AppThemeProvider, useAppTheme } from "@/lib/app/theme";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Neurovia App — Your mind, one gentle step at a time" },
      {
        name: "description",
        content:
          "The Neurovia mobile app: sign in, choose what brings you here, and start your journey from concern to care with VI, your AI companion.",
      },
      { property: "og:title", content: "Neurovia App — Your mind, one gentle step at a time" },
      {
        property: "og:description",
        content: "Onboarding, Journey, Garden, Practice, VIA and Care — the Neurovia experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppThemeProvider>
      <AppAuthProvider>
        <AppFrame />
      </AppAuthProvider>
    </AppThemeProvider>
  );
}

function AppFrame() {
  const { theme } = useAppTheme();
  return (
    <div className="nv-app min-h-[100dvh]" data-app-theme={theme}>
      <div className="mx-auto w-full max-w-[430px] min-h-[100dvh] shadow-[0_0_80px_rgba(0,0,0,0.25)]">
        <AuthGate>
          <Outlet />
        </AuthGate>
      </div>
    </div>
  );
}

/**
 * Client-side gate for the app shell: unauthenticated visitors land on
 * /app/auth, authenticated members who have not finished onboarding land on
 * /app/onboarding.
 */
function AuthGate({ children }: { children: ReactNode }) {
  const { loading, user, profile } = useAppAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isAuthRoute = pathname.startsWith("/app/auth");
  const isOnboarding = pathname.startsWith("/app/onboarding");
  const isAccount = pathname.startsWith("/app/account");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      if (!isAuthRoute) void navigate({ to: "/app/auth" as never, replace: true });
      return;
    }
    if (!profile) return;
    if (!profile.consent_accepted && !isAccount) {
      void navigate({ to: "/app/account" as never, replace: true });
      return;
    }
    if (profile.consent_accepted && !profile.onboarding_completed && !isOnboarding) {
      void navigate({ to: "/app/onboarding" as never, replace: true });
      return;
    }
    if (profile.consent_accepted && profile.onboarding_completed && (isAuthRoute || isOnboarding || isAccount)) {
      void navigate({ to: "/app/home" as never, replace: true });
    }
  }, [loading, user, profile, isAuthRoute, isOnboarding, isAccount, navigate]);

  if (loading || (user && !profile)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--app-bg)]">
        <p className="text-[14px] text-[var(--app-text-dim)]">Opening Neurovia…</p>
      </div>
    );
  }

  return <>{children}</>;
}
