import type { AppProfile } from "@/lib/app/auth";

export const GARDEN_STAGES = [
  { id: "seed", label: "Seed", threshold: 0, emoji: "🌰" },
  { id: "sprout", label: "Sprout", threshold: 3, emoji: "🌱" },
  { id: "sapling", label: "Sapling", threshold: 8, emoji: "🌿" },
  { id: "flowering", label: "Flowering", threshold: 15, emoji: "🌸" },
  { id: "strong_tree", label: "Strong tree", threshold: 25, emoji: "🌳" },
  { id: "blooming", label: "Blooming", threshold: 40, emoji: "🌺" },
  { id: "sanctuary", label: "Sanctuary", threshold: 60, emoji: "🏡" },
] as const;

export type GardenStage = {
  id: string;
  label: string;
  threshold: number;
  emoji: string;
};

export function stageForPractices(count: number): GardenStage {
  let stage: GardenStage = GARDEN_STAGES[0];
  for (const s of GARDEN_STAGES) {
    if (count >= s.threshold) stage = s;
  }
  return stage;
}

export function nextStage(count: number): GardenStage | null {
  const current = stageForPractices(count);
  const idx = GARDEN_STAGES.findIndex((s) => s.id === current.id);
  if (idx < 0 || idx >= GARDEN_STAGES.length - 1) return null;
  return GARDEN_STAGES[idx + 1] ?? null;
}

export const PRACTICE_COIN_REWARD = 20;
export const CHECKIN_COIN_REWARD = 10;

/**
 * Returns the profile patch to apply when a practice is completed:
 * +coins, +1 practice, and a garden stage upgrade when a threshold is crossed.
 */
export function practiceRewardPatch(
  profile: AppProfile,
): Partial<Omit<AppProfile, "id">> & { practices_completed: number } {
  const practices = (profile.practices_completed ?? 0) + 1;
  const stage = stageForPractices(practices);
  return {
    practices_completed: practices,
    coins: (profile.coins ?? 0) + PRACTICE_COIN_REWARD,
    garden_stage: stage.label,
  };
}
