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

/** "Together, we can…" strip on the Meet VI screen. */
export const TOGETHER_WE_CAN = [
  { label: "Understand your mind", emoji: "💗" },
  { label: "Build healthy habits", emoji: "🪷" },
  { label: "Overcome challenges", emoji: "🌱" },
  { label: "Create a life you love", emoji: "⭐" },
];

/** Final onboarding screen: what the journey gives you. */
export const JOURNEY_FEATURES = [
  { title: "Personalized experience", body: "Content and tools tailored just for you.", emoji: "⭐" },
  { title: "Scientifically backed", body: "Evidence-based methods to support your mind.", emoji: "🧠" },
  { title: "Track your progress", body: "Monitor your growth and celebrate wins.", emoji: "📊" },
  { title: "Build healthy habits", body: "Daily practices for a balanced mind.", emoji: "🪷" },
  { title: "Support when you need it", body: "Guided support and a caring community.", emoji: "🤝" },
  { title: "Your privacy matters", body: "Your data is safe and always protected.", emoji: "🔒" },
];

/** Wellbeing notice shown before account consent. */
export const WELLBEING_NOTICES = [
  {
    title: "Neurovia is here to support you",
    body: "We provide tools for self-reflection, well-being and personal growth.",
    emoji: "🛡️",
  },
  {
    title: "Not a replacement for therapy",
    body: "We are not a substitute for professional medical or mental health care.",
    emoji: "💗",
  },
  {
    title: "Your privacy is our priority",
    body: "Your data is encrypted and never shared without your permission.",
    emoji: "🔒",
  },
  {
    title: "In case of crisis",
    body: "If you are in immediate danger, please seek help right away.",
    emoji: "❗",
  },
];

export const CONSENT_ITEMS = [
  "I understand Neurovia is not a substitute for professional medical advice.",
  "I will not rely on Neurovia for emergency or crisis situations.",
  "I understand my data is used to personalize my experience.",
  "I am 18 years or older.",
  "I agree to the Terms of Use and Privacy Policy.",
];

export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

/** Today's plan strip on the home dashboard. */
export const TODAYS_PLAN = [
  { id: "breathe", label: "Breathe", meta: "5 min", icon: "breathe", to: "/app/practice" },
  { id: "journal", label: "Journal", meta: "10 min", icon: "journal", to: "/app/practice" },
  { id: "meditate", label: "Meditate", meta: "10 min", icon: "meditate", to: "/app/practice" },
  { id: "sleep", label: "Sleep", meta: "8 hrs", icon: "sleep", to: "/app/practice" },
  { id: "focus", label: "Focus", meta: "25 min", icon: "focus", to: "/app/practice" },
] as const;

export const JOURNEY_STAGES = [
  "Concern",
  "Understand",
  "Learn",
  "Practice",
  "Grow",
  "Thrive",
  "Care",
] as const;
