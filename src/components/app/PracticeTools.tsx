import { ArrowLeft, ArrowRight, Check, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAppAuth } from "@/lib/app/auth";
import { practiceRewardPatch, PRACTICE_COIN_REWARD } from "@/lib/app/progress";

type ToolProps = { onBack: () => void };

function ToolShell({
  title,
  subtitle,
  onBack,
  children,
}: ToolProps & { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-[var(--app-text-dim)]"
      >
        <ArrowLeft className="size-4" /> All practices
      </button>
      <h2 className="text-[26px] font-bold leading-tight">{title}</h2>
      <p className="mt-1 text-[14px] text-[var(--app-text-dim)]">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Marks a practice complete: awards coins, grows the garden. */
export function usePracticeReward() {
  const { user, profile, updateProfile } = useAppAuth();
  const [awarded, setAwarded] = useState(false);
  const award = useCallback(async () => {
    if (!user || !profile || awarded) return;
    setAwarded(true);
    await updateProfile(practiceRewardPatch(profile));
  }, [user, profile, awarded, updateProfile]);
  return { awarded, award };
}

function DoneCard({ coins }: { coins: number }) {
  return (
    <div className="app-card mt-5 flex items-center gap-3 border-[var(--app-mint)]/40 p-4">
      <span className="flex size-10 items-center justify-center rounded-full bg-[var(--app-mint)]/15 text-[var(--app-mint)]">
        <Check className="size-5" />
      </span>
      <p className="text-[13px] leading-snug">
      <strong className="block">Practice complete</strong>
        <span className="text-[var(--app-text-dim)]">+{coins} garden coins. Your garden noticed.</span>
      </p>
    </div>
  );
}

/* ---------------- Box breathing (4 in / 4 hold / 6 out / 4 rest) ---------------- */

const BREATH_PHASES = [
  { label: "Breathe in", seconds: 4 },
  { label: "Hold", seconds: 4 },
  { label: "Breathe out", seconds: 6 },
  { label: "Rest", seconds: 4 },
];

export function BoxBreathing({ onBack }: ToolProps) {
  const { awarded, award } = usePracticeReward();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState<number>(BREATH_PHASES[0]!.seconds);
  const [cycles, setCycles] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        setPhase((p) => {
          const next = (p + 1) % BREATH_PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          return next;
        });
        return BREATH_PHASES[(phase + 1) % BREATH_PHASES.length]!.seconds;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, phase]);

  useEffect(() => {
    if (cycles >= 3 && !awarded) void award();
  }, [cycles, awarded, award]);

  const current = BREATH_PHASES[phase]!;
  const scale = current.label === "Breathe in" ? 1.25 : current.label === "Breathe out" ? 0.85 : current.label === "Hold" ? 1.25 : 0.85;

  return (
    <ToolShell title="Box breathing" subtitle="Four gentle sides of a breath. Three cycles is enough." onBack={onBack}>
      <div className="app-card flex flex-col items-center p-8">
        <div
          className="flex size-44 items-center justify-center rounded-full bg-[var(--app-accent)]/15 transition-transform ease-in-out"
          style={{ transform: `scale(${running ? scale : 1})`, transitionDuration: `${current.seconds}s` }}
        >
          <div className="flex size-32 flex-col items-center justify-center rounded-full bg-[var(--app-accent)] text-[var(--app-on-accent)]">
            <span className="text-3xl font-bold tabular-nums">{running ? left : "—"}</span>
            <span className="text-[12px]">{running ? current.label : "Ready"}</span>
          </div>
        </div>
        <p className="mt-6 text-[13px] text-[var(--app-text-dim)]">
          Cycle {Math.min(cycles + (running ? 1 : 0), 3)} of 3 · in 4 · hold 4 · out 6 · rest 4
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            type="button"
            className="app-btn border-0"
            onClick={() => {
              if (!running && cycles >= 3) {
                setCycles(0);
                setPhase(0);
                setLeft(BREATH_PHASES[0]!.seconds);
              }
              setRunning((r) => !r);
            }}
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause" : cycles >= 3 ? "Again" : "Begin"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-[var(--app-border)]"
            onClick={() => {
              setRunning(false);
              setPhase(0);
              setLeft(BREATH_PHASES[0]!.seconds);
              setCycles(0);
            }}
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
      </div>
      {awarded && <DoneCard coins={PRACTICE_COIN_REWARD} />}
    </ToolShell>
  );
}

/* ---------------- Grounding 5-4-3-2-1 ---------------- */

const GROUNDING_STEPS = [
  { count: 5, sense: "things you can see", emoji: "👀" },
  { count: 4, sense: "things you can touch", emoji: "✋" },
  { count: 3, sense: "things you can hear", emoji: "👂" },
  { count: 2, sense: "things you can smell", emoji: "🌸" },
  { count: 1, sense: "thing you can taste", emoji: "👅" },
];

export function Grounding({ onBack }: ToolProps) {
  const { awarded, award } = usePracticeReward();
  const [step, setStep] = useState(0);
  const [tapped, setTapped] = useState(0);
  const current = GROUNDING_STEPS[step]!;
  const done = step >= GROUNDING_STEPS.length;

  useEffect(() => {
    if (done && !awarded) void award();
  }, [done, awarded, award]);

  return (
    <ToolShell title="Grounding" subtitle="5-4-3-2-1. Come back to the room around you." onBack={onBack}>
      {!done ? (
        <div className="app-card flex flex-col items-center p-8 text-center">
          <span className="text-4xl">{current.emoji}</span>
          <p className="mt-4 text-[15px] text-[var(--app-text-dim)]">Name</p>
          <h3 className="mt-1 text-[24px] font-bold">
            {current.count} {current.sense}
          </h3>
          <div className="mt-6 flex gap-2">
            {Array.from({ length: current.count }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Noted ${i + 1}`}
                onClick={() => {
                  const next = Math.max(tapped, i + 1);
                  setTapped(next);
                  if (next >= current.count) {
                    setTimeout(() => {
                      setStep((s) => s + 1);
                      setTapped(0);
                    }, 350);
                  }
                }}
                className={`size-11 rounded-full border text-[15px] font-bold transition-all ${
                  i < tapped
                    ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-[var(--app-on-accent)]"
                    : "border-[var(--app-border)] text-[var(--app-text-dim)]"
                }`}
              >
                {i < tapped ? <Check className="mx-auto size-4" /> : i + 1}
              </button>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-[var(--app-text-dim)]">
            Step {step + 1} of {GROUNDING_STEPS.length} · tap each circle as you notice one
          </p>
        </div>
      ) : (
        <div className="app-card p-8 text-center">
          <span className="text-4xl">🌿</span>
          <h3 className="mt-4 text-[22px] font-bold">You're here.</h3>
          <p className="mt-2 text-[14px] text-[var(--app-text-dim)]">
            You just walked your mind back to the present. That took real effort.
          </p>
          <Button type="button" className="app-btn mt-6 border-0" onClick={() => { setStep(0); setTapped(0); }}>
            <RotateCcw className="size-4" /> Go again
          </Button>
        </div>
      )}
      {awarded && <DoneCard coins={PRACTICE_COIN_REWARD} />}
    </ToolShell>
  );
}

/* ---------------- One-line journal ---------------- */

export function OneLineJournal({ onBack }: ToolProps) {
  const { user } = useAppAuth();
  const { awarded, award } = usePracticeReward();
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!user || !text.trim()) return;
    setSaving(true);
    await supabase.from("journal_entries").insert({ user_id: user.id, kind: "journal", content: text.trim() });
    setSaving(false);
    setSaved(true);
    void award();
  }

  return (
    <ToolShell title="One-line journal" subtitle="One honest sentence is a whole practice." onBack={onBack}>
      <div className="app-card p-6">
        <p className="text-[13px] text-[var(--app-text-dim)]">Right now, my mind feels like…</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={280}
          placeholder="a browser with forty tabs open…"
          className="app-input mt-4 w-full resize-none"
        />
        <Button type="button" disabled={!text.trim() || saving || saved} onClick={() => void save()} className="app-btn mt-4 border-0">
          {saved ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
          {saved ? "Kept safe" : saving ? "Saving…" : "Keep this line"}
        </Button>
        {saved && (
          <p className="mt-3 text-[12px] text-[var(--app-text-dim)]">
            Saved privately to your journal. Only you can read it.
          </p>
        )}
      </div>
      {awarded && <DoneCard coins={PRACTICE_COIN_REWARD} />}
    </ToolShell>
  );
}

/* ---------------- Thought reframe ---------------- */

export function ThoughtReframe({ onBack }: ToolProps) {
  const { user } = useAppAuth();
  const { awarded, award } = usePracticeReward();
  const [step, setStep] = useState(0);
  const [thought, setThought] = useState("");
  const [reframe, setReframe] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!user) return;
    setSaving(true);
    await supabase.from("journal_entries").insert({
      user_id: user.id,
      kind: "reframe",
      content: JSON.stringify({ thought: thought.trim(), reframe: reframe.trim() }),
    });
    setSaving(false);
    setStep(3);
    void award();
  }

  return (
    <ToolShell title="Thought reframe" subtitle="Loosen one mental loop, kindly." onBack={onBack}>
      <div className="app-card p-6">
        {step === 0 && (
          <>
            <p className="text-[15px] font-semibold">What's the thought that keeps circling?</p>
            <p className="mt-1 text-[12px] text-[var(--app-text-dim)]">Write it exactly as it sounds in your head.</p>
            <textarea value={thought} onChange={(e) => setThought(e.target.value)} rows={3} placeholder="I'll never catch up…" className="app-input mt-4 w-full resize-none" />
            <Button type="button" disabled={!thought.trim()} onClick={() => setStep(1)} className="app-btn mt-4 border-0">Next <ArrowRight className="size-4" /></Button>
          </>
        )}
        {step === 1 && (
          <>
            <p className="text-[15px] font-semibold">Read it once, slowly.</p>
            <blockquote className="mt-4 rounded-2xl border-l-4 border-[var(--app-accent)] bg-[var(--app-surface-2)] p-4 text-[15px] italic">"{thought}"</blockquote>
            <p className="mt-4 text-[13px] text-[var(--app-text-dim)]">Is this a fact, or a feeling wearing a fact's clothes? What would you say to a friend who thought this?</p>
            <Button type="button" onClick={() => setStep(2)} className="app-btn mt-5 border-0">I'm ready to reframe <ArrowRight className="size-4" /></Button>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-[15px] font-semibold">Now write a kinder, truer version.</p>
            <p className="mt-1 text-[12px] text-[var(--app-text-dim)]">Not positive — just fair.</p>
            <textarea value={reframe} onChange={(e) => setReframe(e.target.value)} rows={3} placeholder="I'm behind, but I'm still moving…" className="app-input mt-4 w-full resize-none" />
            <Button type="button" disabled={!reframe.trim() || saving} onClick={() => void save()} className="app-btn mt-4 border-0">
              {saving ? "Saving…" : "Complete the reframe"} <Check className="size-4" />
            </Button>
          </>
        )}
        {step === 3 && (
          <div className="text-center">
            <span className="text-4xl">🪷</span>
            <h3 className="mt-4 text-[20px] font-bold">From loop to understanding</h3>
            <div className="mt-5 space-y-3 text-left">
              <div className="rounded-2xl bg-[var(--app-surface-2)] p-4"><p className="text-[11px] text-[var(--app-text-dim)]">THE LOOP</p><p className="mt-1 text-[14px] italic">"{thought}"</p></div>
              <div className="rounded-2xl border border-[var(--app-mint)]/40 p-4"><p className="text-[11px] text-[var(--app-mint)]">THE REFRAME</p><p className="mt-1 text-[14px]">"{reframe}"</p></div>
            </div>
            <Button type="button" className="app-btn mt-6 border-0" onClick={() => { setStep(0); setThought(""); setReframe(""); }}>
              <RotateCcw className="size-4" /> Reframe another
            </Button>
          </div>
        )}
      </div>
      {awarded && <DoneCard coins={PRACTICE_COIN_REWARD} />}
    </ToolShell>
  );
}

/* ---------------- Wind-down ---------------- */

const WINDDOWN_STEPS = [
  { title: "Dim the day", body: "Lower the lights around you. Let your eyes soften.", seconds: 30, emoji: "🕯️" },
  { title: "Put the day down", body: "Name one thing that's done — finished or not, it's done for today.", seconds: 30, emoji: "📥" },
  { title: "Unclench", body: "Jaw, shoulders, hands. Let each one drop, one breath at a time.", seconds: 40, emoji: "🌊" },
  { title: "A slower breath", body: "In for 4, out for 8. Let the out-breath be the longer one.", seconds: 40, emoji: "🌙" },
];

export function WindDown({ onBack }: ToolProps) {
  const { awarded, award } = usePracticeReward();
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState<number>(WINDDOWN_STEPS[0]!.seconds);
  const [started, setStarted] = useState(false);
  const done = step >= WINDDOWN_STEPS.length;

  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        setStep((p) => {
          const next = p + 1;
          if (next < WINDDOWN_STEPS.length) setLeft(WINDDOWN_STEPS[next]!.seconds);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, done]);

  useEffect(() => {
    if (done && !awarded) void award();
  }, [done, awarded, award]);

  const current = done ? null : WINDDOWN_STEPS[step]!;

  return (
    <ToolShell title="Wind-down" subtitle="A 2-minute landing strip for the end of the day." onBack={onBack}>
      <div className="app-card flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
        {!started ? (
          <>
            <span className="text-4xl">🌙</span>
            <h3 className="mt-4 text-[22px] font-bold">Four quiet steps</h3>
            <p className="mt-2 max-w-[260px] text-[13px] text-[var(--app-text-dim)]">Each one moves on its own. All you have to do is follow.</p>
            <Button type="button" className="app-btn mt-6 border-0" onClick={() => setStarted(true)}><Play className="size-4" /> Begin winding down</Button>
          </>
        ) : done ? (
          <>
            <span className="text-4xl">✨</span>
            <h3 className="mt-4 text-[22px] font-bold">The day is put away.</h3>
            <p className="mt-2 max-w-[260px] text-[13px] text-[var(--app-text-dim)]">Rest is not a reward. It's part of the work. Good night.</p>
            <Button type="button" className="app-btn mt-6 border-0" onClick={() => { setStarted(false); setStep(0); setLeft(WINDDOWN_STEPS[0]!.seconds); }}>
              <RotateCcw className="size-4" /> Again tomorrow
            </Button>
          </>
        ) : (
          <>
            <span className="text-4xl">{current!.emoji}</span>
            <h3 className="mt-4 text-[22px] font-bold">{current!.title}</h3>
            <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-[var(--app-text-dim)]">{current!.body}</p>
            <p className="mt-6 text-3xl font-bold tabular-nums text-[var(--app-accent)]">{left}s</p>
            <p className="mt-2 text-[12px] text-[var(--app-text-dim)]">Step {step + 1} of {WINDDOWN_STEPS.length}</p>
          </>
        )}
      </div>
      {awarded && <DoneCard coins={PRACTICE_COIN_REWARD} />}
    </ToolShell>
  );
}
