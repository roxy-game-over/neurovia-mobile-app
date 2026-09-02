import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Creates a fresh VIA conversation and returns its id. */
export const startViaConversation = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("via_conversations")
    .insert({})
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id as string };
});

/** Loads the stored messages for one conversation id. */
export const loadViaConversation = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("via_messages")
      .select("id, role, parts")
      .eq("conversation_id", data.id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const messages = (rows ?? []).map((r) => ({
      id: String(r.id),
      role: String(r.role),
      parts: JSON.stringify(r.parts),
    }));
    return { messages };
  });
