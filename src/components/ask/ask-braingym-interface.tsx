"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { SocraticThinkingCards } from "@/app/api/ai/ask/route";
import { saveGoal } from "@/lib/goals/goals-engine";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Compass,
  Layers,
  Calculator,
  ChevronRight,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: SocraticThinkingCards;
}

const EXAMPLE_PROMPTS = [
  "I want to make ₦5 million before the end of next month.",
  "I need 10 high-paying clients for my service business.",
  "Should I borrow money to start a new shop?",
  "I can't concentrate when studying for exams.",
];

/**
 * High-precision formatter for Ask Akuche Socratic responses.
 * Parses markdown headings, bold text, lists, formulas, and highlights.
 */
function FormattedAkucheContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-foreground/95">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section Dividers
        if (trimmed === "---") {
          return <hr key={idx} className="my-2.5 border-border/60" />;
        }

        // H3 Headings (e.g. ### The Numbers, ### What I Understand)
        if (trimmed.startsWith("### ")) {
          const title = trimmed.replace("### ", "");
          const isNumbers = title.toLowerCase().includes("number");
          const isToday = title.toLowerCase().includes("today") || title.toLowerCase().includes("action");
          const isOptions = title.toLowerCase().includes("option") || title.toLowerCase().includes("path");
          const isQuestions = title.toLowerCase().includes("question");

          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 pt-2 pb-0.5 font-black tracking-tight ${
                isToday
                  ? "text-primary text-sm sm:text-base"
                  : isNumbers
                  ? "text-blue-600 dark:text-blue-400 text-xs sm:text-sm"
                  : isOptions
                  ? "text-amber-600 dark:text-amber-400 text-xs sm:text-sm"
                  : isQuestions
                  ? "text-purple-600 dark:text-purple-400 text-xs sm:text-sm"
                  : "text-foreground text-xs sm:text-sm"
              }`}
            >
              {isNumbers && <Calculator className="h-4 w-4 shrink-0" />}
              {isToday && <Target className="h-4 w-4 shrink-0" />}
              {isOptions && <Compass className="h-4 w-4 shrink-0" />}
              {isQuestions && <HelpCircle className="h-4 w-4 shrink-0" />}
              <span>{title}</span>
            </div>
          );
        }

        // H4 Headings (e.g. #### Pipeline Conversion Mathematics)
        if (trimmed.startsWith("#### ")) {
          return (
            <h5 key={idx} className="font-bold text-foreground text-xs pt-1.5 flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
              {trimmed.replace("#### ", "")}
            </h5>
          );
        }

        // Numbered list items (e.g. 1. Action step)
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const text = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 py-0.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px] mt-0.5">
                {num}
              </span>
              <div className="flex-1 leading-snug">{renderInlineFormatted(text)}</div>
            </div>
          );
        }

        // Bullet points (e.g. * Target: ₦5m or - Item)
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const text = trimmed.replace(/^[\*\-\•]\s+/, "");
          const isSubBullet = line.startsWith("  ") || line.startsWith("\t");
          return (
            <div key={idx} className={`flex items-start gap-2 ${isSubBullet ? "pl-5" : "pl-1"} py-0.5`}>
              <span className="text-primary font-black mt-0.5 shrink-0">•</span>
              <div className="flex-1 leading-snug">{renderInlineFormatted(text)}</div>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Formats inline bold (**text**), italics (*text*), and math ($formula$)
 */
function renderInlineFormatted(text: string) {
  // Split by bold (**bold**)
  const parts = text.split(/(\*\*[^*]+\*\*|\$[^\$]+\$)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return (
        <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function AskBrainGymInterface() {
  const { user } = useAuth();
  const { t, isRtl } = useI18n();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Mission Completion Modal State
  const [activeMission, setActiveMission] = useState<{ title: string; steps: string[] } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultInput, setResultInput] = useState("");
  const [reflectionInput, setReflectionInput] = useState("");
  const [savingResult, setSavingResult] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on mobile & desktop
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Voice input error:", err);
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: "user_" + Date.now(),
      role: "user",
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: "asst_" + Date.now(),
        role: "assistant",
        content: data.reply || "Let's work through this step by step.",
        cards: data.structuredCards || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          role: "assistant",
          content: "Let's focus on breaking this dilemma down into what we know, what we don't know, and your next immediate step.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleMarkMissionCompleted = (mission: { title: string; steps: string[] }) => {
    setActiveMission(mission);
    setShowResultModal(true);
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultInput.trim()) return;
    setSavingResult(true);

    await saveGoal({
      title: activeMission?.title || "Real-Life Problem Mission",
      currentSituation: resultInput,
      target: 10,
      currentProgress: 1,
      unit: "milestones",
      nextAction: "Continue next cycle based on reflection",
      isActive: true,
    });

    setSavingResult(false);
    setShowResultModal(false);
    setResultInput("");
    setReflectionInput("");
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-4 pb-28 space-y-6">
      {/* 1. CLEAN DOORWAY HEADER */}
      {messages.length === 0 && (
        <div className="text-center pt-4 pb-2 space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t.ask_header_title || "What are you dealing with?"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t.ask_header_subtext || "Ask a question. Describe a problem. Or tell AKUCHE what you're trying to achieve."}
          </p>
        </div>
      )}

      {/* 2. CONVERSATION STREAM */}
      <div className="space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`rounded-2xl sm:rounded-3xl px-4 py-3.5 text-xs sm:text-sm max-w-[95%] sm:max-w-[90%] leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-card border border-border/80 text-foreground font-normal shadow-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <FormattedAkucheContent content={msg.content} />
              ) : (
                msg.content
              )}
            </div>

            {/* Structured Socratic Cards (if available) */}
            {msg.cards && (
              <div className="w-full mt-3 space-y-3">
                {/* WHAT WE KNOW */}
                {msg.cards.whatWeKnow && msg.cards.whatWeKnow.length > 0 && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 sm:p-4 text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-blue-600 dark:text-blue-400 block mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t.ask_card_know || "WHAT WE KNOW"}
                    </span>
                    <ul className="space-y-1 text-foreground/90 pl-1">
                      {msg.cards.whatWeKnow.map((k, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* WHAT WE DON'T KNOW */}
                {msg.cards.whatWeDontKnow && msg.cards.whatWeDontKnow.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 sm:p-4 text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400 block mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5" />
                      {t.ask_card_dont_know || "WHAT WE DON'T KNOW"}
                    </span>
                    <ul className="space-y-1 text-foreground/90 pl-1">
                      {msg.cards.whatWeDontKnow.map((dk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{dk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* YOUR ASSUMPTIONS & RISKS */}
                {((msg.cards.assumptions && msg.cards.assumptions.length > 0) ||
                  (msg.cards.risks && msg.cards.risks.length > 0)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.cards.assumptions && msg.cards.assumptions.length > 0 && (
                      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs">
                        <span className="font-extrabold uppercase tracking-wider text-[10px] text-purple-600 dark:text-purple-400 block mb-1">
                          {t.ask_card_assumptions || "YOUR ASSUMPTIONS"}
                        </span>
                        <ul className="space-y-0.5 text-foreground/90 font-medium">
                          {msg.cards.assumptions.map((a, i) => (
                            <li key={i}>• {a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {msg.cards.risks && msg.cards.risks.length > 0 && (
                      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
                        <span className="font-extrabold uppercase tracking-wider text-[10px] text-rose-600 dark:text-rose-400 block mb-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {t.ask_card_risks || "POTENTIAL RISKS"}
                        </span>
                        <ul className="space-y-0.5 text-foreground/90 font-medium">
                          {msg.cards.risks.map((r, i) => (
                            <li key={i}>• {r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* TODAY'S MISSION (ACTION CONVERSION) */}
                {msg.cards.mission && (
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-5 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-black text-primary-foreground shadow-sm">
                        <Target className="h-3.5 w-3.5" />
                        {t.ask_card_mission || "TODAY'S MISSION"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {msg.cards.mission.deadline}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-foreground mb-2.5">
                      {msg.cards.mission.title}
                    </h4>

                    <div className="space-y-2 mb-3.5 text-xs text-foreground/90">
                      {msg.cards.mission.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-card/80 p-2.5 rounded-xl border border-border/60">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="font-medium pt-0.5 leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleMarkMissionCompleted(msg.cards!.mission!)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t.ask_mission_complete || "Mark as Completed & Log Result"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-3 text-xs text-muted-foreground w-fit animate-pulse">
            <Sparkles className="h-4 w-4 text-primary animate-spin" />
            <span>AKUCHE is diagnosing your challenge and reverse-engineering the steps...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 3. SUBTLE PROMPT CHIPS */}
      {messages.length === 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
            Or try one of these real scenarios:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="rounded-xl border border-border/80 bg-card/80 hover:bg-card hover:border-primary/40 px-3 py-2 text-xs font-medium text-foreground transition active:scale-95 touch-manipulation text-left"
              >
                «{prompt}»
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. FIXED BOTTOM INPUT BAR (SMARTPHONE OPTIMIZED) */}
      <div className="fixed inset-x-0 bottom-16 lg:bottom-4 z-30 px-3 sm:px-4">
        <div className="mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-xl flex items-center gap-2">
          {/* Voice Input Button */}
          {speechSupported && (
            <button
              onClick={toggleVoiceInput}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition touch-manipulation ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={isListening ? "Listening..." : "Speak question"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isListening
                ? t.ask_voice_listening || "Listening... speak now"
                : t.ask_input_placeholder || "Type your question, financial goal, or problem..."
            }
            className="flex-1 bg-transparent px-2.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[44px]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40 active:scale-95 touch-manipulation"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 5. RESULTS & REFLECTION MODAL */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-foreground mb-1">
              {t.ask_results_loop_title || "Results & Action Loop"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Mission: <strong className="text-foreground">{activeMission?.title}</strong>
            </p>

            <form onSubmit={handleSaveResult} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  What happened / What did you accomplish?
                </label>
                <input
                  type="text"
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  placeholder="e.g. Completed 5 calls, 2 interested prospects booked"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {t.ask_results_reflection_prompt || "What did you learn from this outcome?"}
                </label>
                <textarea
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="e.g. Direct follow-up had higher engagement than email..."
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-accent transition min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResult}
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 min-h-[44px]"
                >
                  {savingResult ? "Recording..." : "Log & Set as Active Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
