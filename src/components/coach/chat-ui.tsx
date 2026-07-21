"use client";

import { useState, useRef, useEffect } from "react";
import { PLANS } from "@/lib/paystack/plans";

interface Message {
  id: string;
  role: "user" | "coach";
  content: string;
}

const SUGGESTIONS = [
  "What activities should I do today based on my goals?",
  "How can I improve my memory?",
  "What's the best way to build a consistent brain training habit?",
  "Which activities help with focus and concentration?",
  "Can you create a weekly plan for me?",
  "Explain how the Pomodoro technique works.",
];

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "coach",
      content:
        "Hi! I'm your BrainGym AI Coach. I can recommend activities, answer questions about brain training, and help you reach your cognitive goals. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [checkingUpgrade, setCheckingUpgrade] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "premium_required") {
          setShowUpgrade(true);
          throw new Error("Premium subscription required to chat with AI Coach.");
        }
        throw new Error(errData.error ?? "Failed to get response");
      }

      const data = await res.json();
      const coachMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: data.reply,
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col space-y-4">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card"
              }`}
            >
              {msg.role === "coach" && (
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs">
                    🧠
                  </div>
                  <span className="text-xs font-medium text-primary">AI Coach</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-border bg-card px-4 py-3">
              <div className="mb-1.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs">
                  🧠
                </div>
                <span className="text-xs font-medium text-primary">AI Coach</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showUpgrade && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">Premium Feature</h3>
          <p className="mb-1 text-sm text-muted-foreground">
            AI Coach chats are available exclusively to Premium members.
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            {PLANS.premium.name} — ₦{(PLANS.premium.amount / 100).toLocaleString()}/month
          </p>
          <button
            onClick={async () => {
              setCheckingUpgrade(true);
              try {
                const res = await fetch("/api/paystack/initialize", { method: "POST" });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              } catch { /* */ }
              setCheckingUpgrade(false);
            }}
            disabled={checkingUpgrade}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {checkingUpgrade ? "Redirecting..." : "Upgrade to Premium"}
          </button>
        </div>
      )}

      {messages.length === 1 && !showUpgrade && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={sending}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {!showUpgrade && (
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI Coach anything..."
            rows={1}
            disabled={sending}
            className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
