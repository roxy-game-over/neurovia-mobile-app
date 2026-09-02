export type PathStep = {
  title: string;
  kind: "learn" | "practice" | "reflect";
  minutes: number;
  body: string;
  prompt?: string;
};

export type GrowthPath = {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  accent: string;
  days: number;
  focus: string[];
  steps: PathStep[];
};

export const GROWTH_PATHS: GrowthPath[] = [
  {
    id: "overthinking",
    name: "Quiet the Overthinking",
    tagline: "Loosen the loops your mind keeps running.",
    emoji: "🌀",
    accent: "var(--app-accent)",
    days: 7,
    focus: ["Rumination", "Worry spirals", "Decision fatigue"],
    steps: [
      {
        title: "Name the loop",
        kind: "learn",
        minutes: 3,
        body: "Overthinking feels like problem-solving, but it repeats instead of resolving. The first shift is simply noticing: 'I am in a loop' — not 'something is wrong with me'.",
      },
      {
        title: "Two-minute brain dump",
        kind: "practice",
        minutes: 2,
        body: "Empty every circling thought onto the page without editing. Loops lose force once they are outside your head.",
      },
      {
        title: "One honest reflection",
        kind: "reflect",
        minutes: 2,
        body: "Look back at what you wrote.",
        prompt: "Which thought repeated the most, and what is it trying to protect you from?",
      },
    ],
  },
  {
    id: "stress",
    name: "Steady Under Stress",
    tagline: "Come back to your body when pressure builds.",
    emoji: "🌊",
    accent: "var(--app-mint)",
    days: 5,
    focus: ["Overwhelm", "Pressure", "Tight chest"],
    steps: [
      {
        title: "How stress lands in you",
        kind: "learn",
        minutes: 3,
        body: "Stress is your body preparing, not failing. Learning your early signals — jaw, shoulders, breath — gives you a choice before the surge.",
      },
      {
        title: "Box breathing",
        kind: "practice",
        minutes: 2,
        body: "In 4 · hold 4 · out 6 · rest 4. Six rounds is enough to tell your nervous system it is safe.",
      },
      {
        title: "Your earliest signal",
        kind: "reflect",
        minutes: 2,
        body: "Notice what changed after the breathing.",
        prompt: "Where does stress show up in your body first?",
      },
    ],
  },
  {
    id: "sleep",
    name: "Kinder Nights",
    tagline: "A gentler landing at the end of the day.",
    emoji: "🌙",
    accent: "var(--app-rose)",
    days: 7,
    focus: ["Racing thoughts", "Late scrolling", "Restless sleep"],
    steps: [
      {
        title: "Why the mind wakes at night",
        kind: "learn",
        minutes: 3,
        body: "Night is the first quiet moment of the day, so the mind uses it to catch up. A wind-down gives it that space earlier.",
      },
      {
        title: "Wind-down sequence",
        kind: "practice",
        minutes: 4,
        body: "Dim the light, slow the breath, and let tomorrow wait on paper instead of in your head.",
      },
      {
        title: "Tomorrow, parked",
        kind: "reflect",
        minutes: 2,
        body: "Write the one thing your mind wants to keep holding.",
        prompt: "What can wait until tomorrow?",
      },
    ],
  },
  {
    id: "confidence",
    name: "Quiet Confidence",
    tagline: "Speak to yourself the way you would to a friend.",
    emoji: "🌱",
    accent: "var(--app-accent)",
    days: 10,
    focus: ["Self-criticism", "Comparison", "Self-doubt"],
    steps: [
      {
        title: "The inner critic's job",
        kind: "learn",
        minutes: 3,
        body: "The critic is trying to keep you safe from rejection. You do not have to fight it — you can answer it.",
      },
      {
        title: "Reframe one thought",
        kind: "practice",
        minutes: 3,
        body: "Take the harshest sentence you told yourself today and write the version you would offer a friend.",
      },
      {
        title: "Evidence of you",
        kind: "reflect",
        minutes: 2,
        body: "Small proof counts.",
        prompt: "What is one thing you handled this week that past-you would be proud of?",
      },
    ],
  },
];

export function pathById(id: string) {
  return GROWTH_PATHS.find((p) => p.id === id);
}

const KEY = "neurovia:path-progress";

export type PathProgress = Record<string, { step: number; completed: boolean; reflection?: string }>;

export function readProgress(): PathProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as PathProgress;
  } catch {
    return {};
  }
}

export function writeProgress(next: PathProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
