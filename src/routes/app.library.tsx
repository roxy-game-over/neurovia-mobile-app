import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Search } from "lucide-react";
import { useState } from "react";

import { AppScreen, ScreenHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/library")({ component: Library });

const CATEGORIES = ["All", "Anxiety", "Sleep", "Focus", "Relationships", "Self-worth"] as const;

const ARTICLES = [
  { title: "Why your mind loops at night", cat: "Sleep", mins: 4, emoji: "🌙" },
  { title: "Anxiety is not a character flaw", cat: "Anxiety", mins: 5, emoji: "🫧" },
  { title: "The 90-second wave", cat: "Anxiety", mins: 3, emoji: "🌊" },
  { title: "Attention is a muscle, not a mood", cat: "Focus", mins: 6, emoji: "🎯" },
  { title: "Saying no without the guilt hangover", cat: "Relationships", mins: 5, emoji: "🤝" },
  { title: "Talking to yourself like someone you love", cat: "Self-worth", mins: 4, emoji: "💗" },
  { title: "Rest is a skill you can practise", cat: "Sleep", mins: 4, emoji: "🛏️" },
  { title: "When comparison hijacks your day", cat: "Self-worth", mins: 5, emoji: "🪞" },
];

function Library() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const list = ARTICLES.filter(
    (a) =>
      (cat === "All" || a.cat === cat) && a.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppScreen>
      <ScreenHeader title="Wellness library" subtitle="Short, science-backed reads. No jargon." />

      <div className="px-5">
        <label className="relative block">
          <span className="sr-only">Search articles</span>
          <Search className="absolute left-4 top-4 size-5 text-[var(--app-text-dim)]" />
          <input
            className="app-input pl-12"
            placeholder="Search the library"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className="shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold"
              style={{
                borderColor: cat === c ? "var(--app-accent)" : "var(--app-border)",
                background: cat === c ? "var(--app-accent)" : "transparent",
                color: cat === c ? "var(--app-on-accent)" : "var(--app-text-dim)",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3 px-5 pb-8">
        {list.map((a) => (
          <article key={a.title} className="app-card flex items-center gap-4 p-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--app-accent)]/12 text-2xl">
              {a.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[15px] text-[var(--app-text)]">{a.title}</strong>
              <span className="flex items-center gap-2 text-[11.5px] text-[var(--app-text-dim)]">
                <BookOpen className="size-3.5" /> {a.cat}
                <Clock className="size-3.5" /> {a.mins} min read
              </span>
            </span>
          </article>
        ))}
        {list.length === 0 && (
          <p className="py-10 text-center text-[13px] text-[var(--app-text-dim)]">
            Nothing here yet — try another search.
          </p>
        )}
      </div>
    </AppScreen>
  );
}
