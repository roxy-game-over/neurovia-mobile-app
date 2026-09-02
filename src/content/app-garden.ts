import type { ViMood } from "@/components/app/Brand";
import type { AppIconKey } from "@/components/app/Icons";

/** The seed → sanctuary journey, exactly as described on neurovia-ai.in. */
export const GROWTH_JOURNEY: {
  id: string;
  label: string;
  body: string;
  threshold: number;
  icon: AppIconKey;
}[] = [
  { id: "seed", label: "Seed", body: "First check-in", threshold: 0, icon: "seed" },
  { id: "sprout", label: "Sprout", body: "3 days in a row", threshold: 3, icon: "seed" },
  { id: "sapling", label: "Sapling", body: "10 practices done", threshold: 10, icon: "tree" },
  { id: "flowering", label: "Flowering", body: "First path finished", threshold: 15, icon: "meditate" },
  { id: "strong_tree", label: "Strong Tree", body: "30 days of care", threshold: 30, icon: "tree" },
  { id: "blooming", label: "Blooming", body: "Two concerns moving", threshold: 45, icon: "meditate" },
  { id: "sanctuary", label: "Sanctuary", body: "Your garden, fully yours", threshold: 60, icon: "garden" },
];

/** Places to return to — each corner of the Garden is a real part of the app. */
export const GARDEN_SPACES: {
  id: string;
  label: string;
  body: string;
  cost: number;
  icon: AppIconKey;
}[] = [
  { id: "via-home", label: "VIA's Home", body: "Sit down and talk it out", cost: 0, icon: "space" },
  { id: "meditation", label: "Meditation Garden", body: "Breathing and stillness", cost: 0, icon: "meditate" },
  { id: "reading", label: "Reading Nook", body: "Lessons from your paths", cost: 200, icon: "library" },
  { id: "tea", label: "Tea Garden", body: "Mind games and small play", cost: 280, icon: "games" },
  { id: "observatory", label: "Observatory", body: "See your patterns from above", cost: 350, icon: "insights" },
  { id: "grove", label: "Memory Grove", body: "Reflections you kept", cost: 420, icon: "journal" },
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
  mood: ViMood;
}[] = [
  { id: "classic", label: "Classic", body: "The one you met on day one.", cost: 0, mood: "classic" },
  { id: "cozy", label: "Cozy", body: "Blanket and a warm cup.", cost: 80, mood: "cozy" },
  { id: "explorer", label: "Explorer", body: "Hat on, garden ahead.", cost: 110, mood: "explorer" },
  { id: "student", label: "Student", body: "Round glasses, open book.", cost: 130, mood: "student" },
  { id: "meditator", label: "Stillness", body: "Cross-legged, eyes closed.", cost: 150, mood: "meditator" },
  { id: "artist", label: "Artist", body: "Palette, apron, brush.", cost: 170, mood: "artist" },
  { id: "scientist", label: "Scientist", body: "Goggles and a flask.", cost: 190, mood: "scientist" },
  { id: "night", label: "Night Mode", body: "A lantern for late hours.", cost: 210, mood: "night" },
  { id: "super", label: "Super", body: "Cape up on hard days.", cost: 240, mood: "super" },
  { id: "celebration", label: "Celebration", body: "Balloon, confetti, streak intact.", cost: 260, mood: "celebration" },
];

