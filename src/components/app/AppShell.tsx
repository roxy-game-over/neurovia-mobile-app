import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, type LucideIcon } from "lucide-react";
import { Home, Route as RouteIcon, Sprout, HeartPulse, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";

import { useAppTheme } from "@/lib/app/theme";

export type Destination = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const DESTINATIONS: Destination[] = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/journey", label: "Journey", icon: RouteIcon },
  { to: "/app/garden", label: "Garden", icon: Sprout },
  { to: "/app/practice", label: "Practice", icon: HeartPulse },
  { to: "/app/via", label: "VIA", icon: Sparkles },
  { to: "/app/profile", label: "Profile", icon: User },
];

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)]"
    >
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pt-6 pb-4">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-[var(--app-text)]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {right}
        <ThemeToggle />
      </div>
    </header>
  );
}

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-20 border-t border-[var(--app-border)] bg-[var(--app-bg-deep)] px-2 pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch justify-between">
        {DESTINATIONS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium"
                style={{ color: active ? "var(--app-accent)" : "var(--app-text-dim)" }}
              >
                <Icon className="size-[20px]" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Standard destination screen: scrollable body + persistent tab bar. */
export function AppScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--app-bg)]">
      <div className="flex-1 pb-6">{children}</div>
      <TabBar />
    </div>
  );
}

/** Full-bleed screen without navigation (auth, onboarding). */
export function AppScreenPlain({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh] flex-col bg-[var(--app-bg)]">{children}</div>;
}

export function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="app-card mx-5 mb-4 p-5">
      {title && (
        <h2 className="mb-3 text-[15px] font-semibold text-[var(--app-text)]">{title}</h2>
      )}
      {children}
    </div>
  );
}

export function ComingSoon({ note }: { note: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-[var(--app-border)] px-4 py-6 text-center text-[13px] text-[var(--app-text-dim)]">
      {note}
    </p>
  );
}
