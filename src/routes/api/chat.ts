import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are VI (also called VIA), the mental wellness companion inside Neurovia.

Voice: warm, unhurried, plain-spoken, never clinical, never preachy. Short paragraphs.
What you do: listen first, reflect back what you heard, gently explain what may be happening
in the mind or body (overthinking loops, stress response, sleep debt, burnout, procrastination,
low confidence), then offer ONE small next step — a 2-minute box breathing round, a 5-4-3-2-1
grounding, a one-line journal, a reframe, or an evening wind-down.

Boundaries: you are not a therapist and you never diagnose. If someone describes crisis, self-harm
or danger, say so plainly, encourage contacting local emergency services (in India: 112, or
Tele-MANAS on 14416) and a real professional.

Neurovia context: it bridges concern -> understand -> learn -> practise -> grow -> thrive -> care.
Practices grow a Garden; professional care is coming soon. When it fits naturally (and at most once
in a while), invite the person to join the waitlist to get early access with 500 gold coins.
Keep replies under about 140 words.`;

type Body = { messages?: unknown; conversationId?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, conversationId } = (await request.json()) as Body;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI is not configured", { status: 500 });

        const gateway = createLovableAiGatewayProvider(apiKey);
        const original = messages as UIMessage[];

        let result;
        try {
          result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system: SYSTEM,
            messages: await convertToModelMessages(original),
          });
        } catch (e) {
          return new Response(e instanceof Error ? e.message : "AI request failed", {
            status: 500,
          });
        }

        return result.toUIMessageStreamResponse({
          originalMessages: original,
          onFinish: async ({ responseMessage }) => {
            if (typeof conversationId !== "string" || !conversationId) return;
            try {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
              const last = original[original.length - 1];
              const rows: Array<{ conversation_id: string; role: string; parts: never }> = [];
              if (last?.role === "user") {
                rows.push({
                  conversation_id: conversationId,
                  role: "user",
                  parts: last.parts as never,
                });
              }
              rows.push({
                conversation_id: conversationId,
                role: "assistant",
                parts: responseMessage.parts as never,
              });
              const { error } = await supabaseAdmin.from("via_messages").insert(rows);
              if (error) console.error("via_messages insert failed", error.message);
              await supabaseAdmin
                .from("via_conversations")
                .update({ last_active_at: new Date().toISOString() })
                .eq("id", conversationId);
            } catch (e) {
              console.error("chat persistence error", e);
            }
          },
        });
      },
    },
  },
});
