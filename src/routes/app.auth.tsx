import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Heart, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { useState } from "react";

import vi from "@/assets/vi-mascot.png.asset.json";
import { AppScreenPlain } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/auth")({
  component: AppAuth,
});

function AppAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setError(null);
    const result = mode === "signup"
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name }, emailRedirectTo: window.location.origin + "/app" },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) {
      setError(result.error.message.replace("Invalid login credentials", "That email or password doesn’t look right."));
      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage("Check your email to confirm your account, then come back to continue.");
      return;
    }
    void navigate({ to: "/app/onboarding" as never });
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (result?.error) setError(result.error.message);
  }

  return (
    <AppScreenPlain>
      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-12">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] text-[var(--app-text-dim)]"><Heart className="size-4 text-[var(--app-rose)]" /> Neurovia</span>
          <a href="https://neurovia-ai-in.lovable.app" target="_blank" rel="noreferrer" className="text-[14px] text-[var(--app-text-dim)]">Back to site</a>
        </div>
        <div className="flex flex-1 flex-col justify-center py-10">
          <img src={vi.url} alt="VI, your Neurovia companion" className="mx-auto mb-7 size-28 object-contain" />
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--app-accent)]">A gentler way forward</p>
          <h1 className="mt-3 text-center text-[34px] font-bold leading-tight text-[var(--app-text)]">Welcome to<br /><span className="text-[var(--app-accent)]">Neurovia</span></h1>
          <p className="mx-auto mt-4 max-w-[310px] text-center text-[15px] leading-relaxed text-[var(--app-text-dim)]">Understand your mind, build healthy habits, and grow with VI by your side.</p>
          <div className="mt-8 flex rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
            {(["signup", "login"] as const).map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`flex-1 rounded-full py-2.5 text-[14px] font-semibold ${mode === item ? "bg-[var(--app-accent)] text-[var(--app-on-accent)]" : "text-[var(--app-text-dim)]"}`}>{item === "signup" ? "Create account" : "Sign in"}</button>)}
          </div>
          <form onSubmit={submit} className="mt-5 space-y-3">
            {mode === "signup" && <label className="relative block"><span className="sr-only">Your name</span><Heart className="absolute left-4 top-4 size-5 text-[var(--app-text-dim)]" /><input className="app-input pl-12" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required /></label>}
            <label className="relative block"><span className="sr-only">Email address</span><Mail className="absolute left-4 top-4 size-5 text-[var(--app-text-dim)]" /><input className="app-input pl-12" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label className="relative block"><span className="sr-only">Password</span><Lock className="absolute left-4 top-4 size-5 text-[var(--app-text-dim)]" /><input className="app-input pl-12 pr-12" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-[var(--app-text-dim)]">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></label>
            {error && <p role="alert" className="text-[13px] text-[var(--app-rose)]">{error}</p>}
            {message && <p role="status" className="text-[13px] text-[var(--app-mint)]">{message}</p>}
            <Button type="submit" disabled={busy} className="app-btn border-0">{busy ? "One moment…" : mode === "signup" ? "Begin my journey" : "Continue"}<ArrowRight className="size-5" /></Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-[12px] text-[var(--app-text-dim)]"><span className="h-px flex-1 bg-[var(--app-border)]" />or<span className="h-px flex-1 bg-[var(--app-border)]" /></div>
          <Button type="button" variant="outline" onClick={google} className="app-btn-quiet border-[var(--app-border)]"><Chrome className="size-5" /> Continue with Google</Button>
        </div>
        <p className="text-center text-[11px] leading-relaxed text-[var(--app-text-dim)]">By continuing, you agree to Neurovia’s <a href="https://neurovia-ai-in.lovable.app/terms" target="_blank" rel="noreferrer" className="underline">Terms</a> and <a href="https://neurovia-ai-in.lovable.app/privacy" target="_blank" rel="noreferrer" className="underline">Privacy Policy</a>.</p>
      </div>
    </AppScreenPlain>
  );
}
