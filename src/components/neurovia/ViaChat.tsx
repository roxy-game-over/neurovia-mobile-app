import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";

import { VI } from "@/components/app/Brand";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { loadViaConversation, startViaConversation } from "@/lib/via-chat.functions";

const STORAGE_KEY = "neurovia.via.conversation";

const OPENERS = [
  "I can't stop overthinking tonight.",
  "I'm exhausted but I can't sleep.",
  "I keep putting off something important.",
  "I don't know what I'm feeling.",
];

export function ViaChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = window.localStorage.getItem(STORAGE_KEY);
        if (existing) {
          const { messages } = await loadViaConversation({ data: { id: existing } });
          if (cancelled) return;
          setInitial(
            messages.map((m) => ({
              id: m.id,
              role: m.role as UIMessage["role"],
              parts: JSON.parse(m.parts) as UIMessage["parts"],
            })),
          );
          setConversationId(existing);
          return;
        }
        const { id } = await startViaConversation();
        if (cancelled) return;
        window.localStorage.setItem(STORAGE_KEY, id);
        setInitial([]);
        setConversationId(id);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center shadow-soft-sm">
        <p className="text-[15px] text-ink-secondary">
          VI can&apos;t come to the door right now. Please refresh and try again in a moment.
        </p>
      </div>
    );
  }

  if (!conversationId || !initial) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-[28px] bg-white shadow-soft-sm">
        <Shimmer className="text-[15px]">Waking VI…</Shimmer>
      </div>
    );
  }

  return <ChatWindow key={conversationId} conversationId={conversationId} initial={initial} />;
}

function ChatWindow({
  conversationId,
  initial,
}: {
  conversationId: string;
  initial: UIMessage[];
}) {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { conversationId } }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) taRef.current?.focus();
  }, [busy]);

  const send = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
    setText("");
  };

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-soft">
      <div className="flex items-center gap-3 border-b border-[color-mix(in_oklab,var(--purple)_10%,transparent)] px-6 py-4">
        <img src={VI.classic} alt="" aria-hidden="true" width={40} height={40} className="size-10" />
        <div>
          <p className="text-[15px] font-semibold text-ink">VI</p>
          <p className="text-[12px] text-ink-muted">
            A companion, not a therapist. VI never diagnoses.
          </p>
        </div>
      </div>

      <Conversation className="h-[460px]">
        <ConversationContent className="space-y-4 px-6 py-6">
          {messages.length === 0 && (
            <div className="mx-auto max-w-[440px] py-6 text-center">
              <img
                src={VI.classic}
                alt="VI, the Neurovia companion"
                width={140}
                height={150}
                className="anim-float mx-auto w-[120px]"
              />
              <p className="mt-5 font-display text-[26px] text-ink">Hi, I&apos;m VI.</p>
              <p className="mt-2 text-[15px] text-ink-secondary">
                Tell me what&apos;s on your mind — the messy version is fine.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {OPENERS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => send(o)}
                    className="rounded-full border border-[color-mix(in_oklab,var(--purple)_20%,transparent)] px-4 py-2 text-[13px] text-ink-secondary transition-colors hover:border-purple hover:text-purple"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const body = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("")
              .trim();
            if (!body) return null;
            return (
              <Message key={m.id} from={m.role}>
                {m.role === "user" ? (
                  <MessageContent className="max-w-[520px] rounded-[20px] bg-purple px-5 py-3 text-[15px] text-warm-white">
                    {body}
                  </MessageContent>
                ) : (
                  <MessageContent className="max-w-[560px] bg-transparent px-0 text-[15px] text-ink">
                    <MessageResponse>{body}</MessageResponse>
                  </MessageContent>
                )}
              </Message>
            );
          })}

          {status === "submitted" && <Shimmer className="text-[14px]">VI is thinking…</Shimmer>}
          {error && (
            <p role="alert" className="text-[14px] text-[#B4436C]">
              Something interrupted VI. Please send that again.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-[color-mix(in_oklab,var(--purple)_10%,transparent)] px-6 py-5">
        <PromptInput
          onSubmit={(_, e) => {
            e.preventDefault();
            send(text);
          }}
        >
          <PromptInputTextarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say it however it comes out…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!text.trim() || busy} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-3 text-center text-[12px] text-ink-muted">
          If you&apos;re in crisis, call 112 or Tele-MANAS on 14416.{" "}
          VI is here whenever you need a gentle moment.
        </p>
      </div>
    </div>
  );
}
