/** Content source of truth for the Neurovia onboarding flow. */

export type Concern = { id: string; label: string; emoji: string };
export type Goal = { id: string; label: string; emoji: string };

export const CONCERNS: Concern[] = [
  { id: "overthinking", label: "Overthinking", emoji: "🌀" },
  { id: "stress", label: "Stress", emoji: "⚡" },
  { id: "sleep", label: "Sleep", emoji: "🌙" },
  { id: "anxiety", label: "Anxiety", emoji: "😟" },
  { id: "procrastination", label: "Procrastination", emoji: "⏳" },
  { id: "low-confidence", label: "Low Confidence", emoji: "🛡️" },
  { id: "relationships", label: "Relationships", emoji: "💗" },
  { id: "burnout", label: "Burnout", emoji: "🪫" },
  { id: "other", label: "Other", emoji: "💬" },
];

export const GOALS: Goal[] = [
  { id: "reduce-stress", label: "Reduce stress", emoji: "🌿" },
  { id: "better-sleep", label: "Better sleep", emoji: "🛏️" },
  { id: "focus-more", label: "Focus more", emoji: "🎯" },
  { id: "build-habits", label: "Build habits", emoji: "🙂" },
  { id: "better-relationships", label: "Better relationships", emoji: "👥" },
  { id: "feel-confident", label: "Feel confident", emoji: "🏅" },
  { id: "reduce-phone-time", label: "Reduce phone time", emoji: "📱" },
  { id: "find-purpose", label: "Find purpose", emoji: "🧠" },
];

export const WELCOME_PILLARS = [
  { title: "Understand", body: "Understand your mind & emotions", emoji: "🧠" },
  { title: "Build healthy habits", body: "Small daily steps for a better you", emoji: "🌱" },
  { title: "Grow every day", body: "Track progress & stay consistent", emoji: "🪷" },
  { title: "Get the care you deserve", body: "Access support when you need it", emoji: "🤝" },
];

export const VI_PROMISES = [
  { title: "I listen", body: "A safe space to share your thoughts", emoji: "💬" },
  { title: "I guide", body: "Personalized paths for your growth", emoji: "🌿" },
  { title: "I protect", body: "Your privacy and feelings are safe with me", emoji: "🛡️" },
  { title: "I grow with you", body: "Celebrating small wins every day", emoji: "✨" },
];

export const JOURNEY_STAGES = [
  "Concern",
  "Understand",
  "Learn",
  "Practice",
  "Grow",
  "Thrive",
  "Care",
] as const;
