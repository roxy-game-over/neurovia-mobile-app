import type { AppIconKey } from "@/components/app/Icons";

export type MindGame = {
  id: string;
  title: string;
  body: string;
  minutes: number;
  category: GameCategoryId;
  icon: AppIconKey;
  coins: number;
  to: string;
  featured?: boolean;
};

export type GameCategoryId = "calm" | "focus" | "memory" | "reframe";

export const GAME_CATEGORIES: {
  id: GameCategoryId;
  label: string;
  body: string;
  icon: AppIconKey;
}[] = [
  { id: "calm", label: "Calm", body: "Settle the body first", icon: "calm" },
  { id: "focus", label: "Focus", body: "Train your attention", icon: "attention" },
  { id: "memory", label: "Memory", body: "Sharpen recall", icon: "memory" },
  { id: "reframe", label: "Reframe", body: "Shift the thought", icon: "reframe" },
];

export const MIND_GAMES: MindGame[] = [
  {
    id: "breath-bloom",
    title: "Breath Bloom",
    body: "Grow a flower by pacing your breath — 4-7-8, one petal at a time.",
    minutes: 4,
    category: "calm",
    icon: "breathe",
    coins: 20,
    to: "/app/practice",
    featured: true,
  },
  {
    id: "thought-sorter",
    title: "Thought Sorter",
    body: "Catch a spiralling thought and sort it into something kinder.",
    minutes: 5,
    category: "reframe",
    icon: "reframe",
    coins: 25,
    to: "/app/practice",
    featured: true,
  },
  {
    id: "ground-in-five",
    title: "Ground in Five",
    body: "A playful 5-4-3-2-1 senses sweep to land back in the room.",
    minutes: 3,
    category: "calm",
    icon: "ground",
    coins: 15,
    to: "/app/practice",
    featured: true,
  },
  {
    id: "focus-timer",
    title: "Two-Minute Start",
    body: "Beat procrastination by starting before you feel ready.",
    minutes: 2,
    category: "focus",
    icon: "attention",
    coins: 15,
    to: "/app/exercises",
  },
  {
    id: "pattern-recall",
    title: "Pattern Recall",
    body: "A gentle working-memory grid that gets one step longer each round.",
    minutes: 4,
    category: "memory",
    icon: "memory",
    coins: 20,
    to: "/app/exercises",
  },
  {
    id: "shape-logic",
    title: "Shape Logic",
    body: "Quiet puzzles that give the anxious mind somewhere useful to go.",
    minutes: 5,
    category: "focus",
    icon: "logic",
    coins: 20,
    to: "/app/exercises",
  },
  {
    id: "mood-weather",
    title: "Mood Weather",
    body: "Name the feeling by matching it to a sky. Emotional vocabulary, playfully.",
    minutes: 3,
    category: "reframe",
    icon: "mood",
    coins: 15,
    to: "/app/checkin",
  },
  {
    id: "garden-keeper",
    title: "Garden Keeper",
    body: "Spend the coins you earned, plant what you unlocked, watch it grow.",
    minutes: 3,
    category: "calm",
    icon: "garden",
    coins: 0,
    to: "/app/garden",
  },
];
