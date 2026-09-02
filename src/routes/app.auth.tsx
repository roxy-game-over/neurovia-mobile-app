import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Apple, ArrowLeft, ArrowRight, Chrome, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

import { VI } from "@/components/app/Brand";
import { AppScreenPlain, Wordmark } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/auth")({
  component: AppAuth,
});

const SITE = "https://neurovia-ai-in.lovable.app";

function AppAuth() {
  const navigate = useNavigate();
  const [view, setView] = useState<"choices" | "email">("choices");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setError(null);
    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin + "/app" },
          })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) {
      setError(
        result.error.message.replace(
          "Invalid login credentials",
          "That email or password doesn’t look right.",
        ),
      );
      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage("Check your email to confirm your account, then come back to continue.");
      return;
    }
    void navigate({ to: "/app/account" as never });
  }

  async function oauth(provider: "google" | "apple") {
    setError(null);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/app",
    });
    if (result?.error) setError(result.error.message);
  }

  return (
    <AppScreenPlain>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-12">
        {view === "email" && (
          <button
            type="button"
            aria-label="Back"
            onClick={() => setView("choices")}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-text)]"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}

        <div className="flex flex-1 flex-col justify-center">
          <Wordmark />
          <p className="mt-2 text-center text-[16px] font-medium text-[var(--app-accent)]">
            Decoding the Mind, Gently
          </p>

          <img
            src={VI.base}
            alt="VI, your Neurovia companion"
            className="anim-float mx-auto my-7 size-52 object-contain"
          />

          <h1 className="text-center text-[22px] font-semibold text-[var(--app-text)]">
            AI Mental Wellness Companion
          </h1>
          <p className="mt-1 text-center text-[17px] text-[var(--app-text-dim)]">
            From <span className="text-[var(--app-rose)]">concern</span> to{" "}
            <span className="text-[var(--app-mint)]">care</span>.
          </p>

          {view === "choices" ? (
            <div className="mt-8 space-y-3">
              <button type="button" onClick={() => void oauth("google")} className="app-btn-quiet">
                <Chrome className="size-5 text-[var(--app-accent)]" /> Continue with Google
              </button>
              <button type="button" onClick={() => void oauth("apple")} className="app-btn-quiet">
                <Apple className="size-5 text-[var(--app-text)]" /> Continue with Apple
              </button>
              <button type="button" onClick={() => setView("email")} className="app-btn-quiet">
                <Mail className="size-5 text-[var(--app-mint)]" /> Continue with Email
              </button>

              {error && (
                <p role="alert" className="text-center text-[13px] text-[var(--app-rose)]">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="mt-8 flex rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
                {(["signup", "login"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`flex-1 rounded-full py-2.5 text-[14px] font-semibold ${mode === item ? "bg-[var(--app-accent)] text-[var(--app-on-accent)]" : "text-[var(--app-text-dim)]"}`}
                  >
                    {item === "signup" ? "Create account" : "Sign in"}
                  </button>
                ))}
              </div>
              <form onSubmit={submit} className="mt-5 space-y-3">
                <label className="relative block">
                  <span className="sr-only">Email address</span>
                  <Mail className="absolute left-4 top-4 size-5 text-[var(--app-text-dim)]" />
                  <input
                    className="app-input pl-12"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="relative block">
                  <span className="sr-only">Password</span>
                  <Lock className="absolute left-4 top-4 size-5 text-[var(--app-text-dim)]" />
                  <input
                    className="app-input pl-12 pr-12"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-[var(--app-text-dim)]"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </label>
                {error && (
                  <p role="alert" className="text-[13px] text-[var(--app-rose)]">
                    {error}
                  </p>
                )}
                {message && (
                  <p role="status" className="text-[13px] text-[var(--app-mint)]">
                    {message}
                  </p>
                )}
                <Button type="submit" disabled={busy} className="app-btn border-0">
                  {busy ? "One moment…" : mode === "signup" ? "Create account" : "Continue"}
                  <ArrowRight className="size-5" />
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[12px] leading-relaxed text-[var(--app-text-dim)]">
          By continuing, you agree to our{" "}
          <a href={`${SITE}/terms`} target="_blank" rel="noreferrer" className="underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href={`${SITE}/privacy`} target="_blank" rel="noreferrer" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </AppScreenPlain>
  );
}
