import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Sparkles } from "lucide-react";
import { AppScreen, ScreenHeader } from "@/components/app/AppShell";
import { ViaChat } from "@/components/neurovia/ViaChat";
export const Route = createFileRoute("/app/via")({ component: ViaApp });
function ViaApp() { return <AppScreen><ScreenHeader title="VIA" subtitle="Your companion for the messy moments." right={<span className="flex size-10 items-center justify-center rounded-full bg-[var(--app-surface)] text-[var(--app-accent)]"><Sparkles className="size-5" /></span>} /><div className="mx-5 mb-4 flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4"><MessageCircle className="size-5 text-[var(--app-mint)]" /><p className="text-[12px] text-[var(--app-text-dim)]">VI listens and guides. VI never diagnoses and is not a therapist.</p></div><div className="mx-3"><ViaChat /></div></AppScreen> }
