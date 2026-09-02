import type { AppIconKey } from "@/components/app/Icons";

/** The seed → tree journey shown on the Garden screen. */
export const GROWTH_JOURNEY: {
  id: string;
  label: string;
  body: string;
  threshold: number;
  icon: AppIconKey;
}[] = [
  { id: "seed", label: "Seed", body: "Where everyone begins.", threshold: 0, icon: "seed" },
  { id: "sprout", label: "Sprout", body: "First green after three practices.", threshold: 3, icon: "seed" },
  { id: "sapling", label: "Sapling", body: "Roots take hold.", threshold: 8, icon: "tree" },
  { id: "flowering", label: "Flowering", body: "Your effort starts to show.", threshold: 15, icon: "meditate" },
  { id: "strong_tree", label: "Strong tree", body: "Steady, even on hard days.", threshold: 25, icon: "tree" },
  { id: "blooming", label: "Blooming", body: "Growth you can feel.", threshold: 40, icon: "meditate" },
  { id: "sanctuary", label: "Sanctuary", body: "A place that's entirely yours.", threshold: 60, icon: "garden" },
];

/** Spaces you can build inside your garden with coins. */
export const GARDEN_SPACES: {
  id: string;
  label: string;
  body: string;
  cost: number;
  icon: AppIconKey;
}[] = [
  { id: "pond", label: "Still Pond", body: "A quiet water for breathing practices.", cost: 120, icon: "water" },
  { id: "pavilion", label: "Pavilion", body: "Shelter for journalling on heavy days.", cost: 200, icon: "journal" },
  { id: "grove", label: "Lantern Grove", body: "Soft lights for your wind-down ritual.", cost: 280, icon: "sleep" },
  { id: "meadow", label: "Open Meadow", body: "Room for mind games and play.", cost: 350, icon: "games" },
];

/** Seeds and decorations from the garden shop. */
export const GARDEN_SHOP: {
  id: string;
  label: string;
  body: string;
  cost: number;
  icon: AppIconKey;
}[] = [
  { id: "calm-seed", label: "Calm Seed", body: "Blooms lavender when you check in.", cost: 40, icon: "seed" },
  { id: "focus-fern", label: "Focus Fern", body: "Unfurls with every finished practice.", cost: 60, icon: "garden" },
  { id: "sleep-moonflower", label: "Moonflower", body: "Opens only after an evening wind-down.", cost: 80, icon: "sleep" },
  { id: "gratitude-rose", label: "Gratitude Rose", body: "Grows from journal entries.", cost: 100, icon: "journal" },
];

/** Outfits for VI, unlocked by streaks and coins. */
export const VI_OUTFITS: {
  id: string;
  label: string;
  body: string;
  cost: number;
  mood: "base" | "meditate" | "read" | "garden" | "game" | "care";
}[] = [
  { id: "everyday", label: "Everyday VI", body: "The one you met on day one.", cost: 0, mood: "base" },
  { id: "gardener", label: "Gardener", body: "Watering can and all.", cost: 90, mood: "garden" },
  { id: "reader", label: "Reader", body: "Round glasses, open book.", cost: 120, mood: "read" },
  { id: "player", label: "Player", body: "Controller in both hands.", cost: 150, mood: "game" },
  { id: "monk", label: "Stillness", body: "Cross-legged, eyes closed.", cost: 180, mood: "meditate" },
];
