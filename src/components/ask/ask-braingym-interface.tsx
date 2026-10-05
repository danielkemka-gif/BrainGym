"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { SocraticThinkingCards } from "@/app/api/ai/ask/route";
import { saveGoal } from "@/lib/goals/goals-engine";
import { ContextualGuidanceBanner } from "@/components/layout/contextual-guidance-banner";
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
  Zap,
  PlusCircle,
  Compass as CompassIcon,
  X,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: SocraticThinkingCards;
}

const CATEGORY_PROMPTS = [
  { label: "💰 Money & Business", prompt: "I want to make ₦5 million before the end of the year." },
  { label: "💼 Career", prompt: "How do I prepare for a high-paying job interview?" },
  { label: "⚖️ Decisions", prompt: "Should I start a business or keep my 9-to-5 job?" },
  { label: "🎯 Goals", prompt: "I need a 30-day execution plan to acquire 10 new customers." },
  { label: "🧠 Personal Growth", prompt: "I am overwhelmed and need a daily productivity plan." },
  { label: "📚 Learning", prompt: "How do I create a deep-focus study plan for my exams?" },
  { label: "❤️ Relationships", prompt: "How should I approach a difficult conversation with my partner?" },
  { label: "💡 Ideas", prompt: "Give me 3 low-risk business ideas I can launch with my skills." },
];

const DISCOVERY_DOMAINS = [
  {
    title: "Money & Income",
    icon: "💰",
    question: "I want to increase my income or build a new cash flow stream.",
  },
  {
    title: "Business & Sales",
    icon: "📈",
    question: "I have a business bottleneck and need more paying customers.",
  },
  {
    title: "Career & Work",
    icon: "💼",
    question: "I'm evaluating a career transition or seeking a promotion.",
  },
  {
    title: "Difficult Decision",
    icon: "⚖️",
    question: "I have two options and need help evaluating the trade-offs.",
  },
  {
    title: "Education & Study",
    icon: "📚",
    question: "I'm preparing for exams and need a high-retention study strategy.",
  },
  {
    title: "Productivity & Focus",
    icon: "⚡",
    question: "I'm procrastinating on important projects and need momentum.",
  },
  {
    title: "Relationships & Communication",
    icon: "❤️",
    question: "I need guidance on handling a difficult or sensitive conversation.",
  },
  {
    title: "Something Else",
    icon: "💡",
    question: "I have an idea or situation I want to break down step by step.",
  },
];

/**
 * Formatter for Akuche responses: handles headings, formulas, bold text, and action lists.
 */
function FormattedAkucheContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-foreground/95 break-words whitespace-pre-wrap">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        if (trimmed === "---") {
          return <hr key={idx} className="my-2.5 border-border/60" />;
        }

        if (trimmed.startsWith("### ")) {
          const title = trimmed.replace("### ", "");
          const isNextMove = title.toLowerCase().includes("next move");
          const isTodayAction = title.toLowerCase().includes("today's action") || title.toLowerCase().includes("today action");
          const isNumbers = title.toLowerCase().includes("number");
          const isDecision = title.toLowerCase().includes("option") || title.toLowerCase().includes("decision") || title.toLowerCase().includes("assessment");
          const isQuestions = title.toLowerCase().includes("question");

          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 pt-2 pb-0.5 font-black tracking-tight ${
                isNextMove
                  ? "text-primary text-sm sm:text-base"
                  : isTodayAction
                  ? "text-emerald-600 dark:text-emerald-400 text-sm sm:text-base"
                  : isNumbers
                  ? "text-blue-600 dark:text-blue-400 text-xs sm:text-sm"
                  : isDecision
                  ? "text-amber-600 dark:text-amber-400 text-xs sm:text-sm"
                  : isQuestions
                  ? "text-purple-600 dark:text-purple-400 text-xs sm:text-sm"
                  : "text-foreground text-xs sm:text-sm"
              }`}
            >
              {isNextMove && <Zap className="h-4 w-4 shrink-0 text-primary" />}
              {isTodayAction && <Target className="h-4 w-4 shrink-0 text-emerald-500" />}
              {isNumbers && <Calculator className="h-4 w-4 shrink-0" />}
              {isDecision && <Compass className="h-4 w-4 shrink-0" />}
              {isQuestions && <HelpCircle className="h-4 w-4 shrink-0" />}
              <span>{title}</span>
            </div>
          );
        }

        if (trimmed.startsWith("#### ")) {
          return (
            <h5 key={idx} className="font-bold text-foreground text-xs pt-1.5 flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
              {trimmed.replace("#### ", "")}
            </h5>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 py-0.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px] mt-0.5">
                {numberedMatch[1]}
              </span>
              <div className="flex-1 leading-snug break-words">{renderInlineFormatted(numberedMatch[2])}</div>
            </div>
          );
        }

        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const text = trimmed.replace(/^[\*\-\•]\s+/, "");
          const isSubBullet = line.startsWith("  ") || line.startsWith("\t");
          return (
            <div key={idx} className={`flex items-start gap-2 ${isSubBullet ? "pl-5" : "pl-1"} py-0.5`}>
              <span className="text-primary font-black mt-0.5 shrink-0">•</span>
              <div className="flex-1 leading-snug break-words">{renderInlineFormatted(text)}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed break-words">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineFormatted(text: string) {
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useI18n();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Discovery Modal ("I'M NOT SURE WHAT I NEED")
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

  // Mission Completion Modal State
  const [activeMission, setActiveMission] = useState<{ title: string; steps: string[] } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultInput, setResultInput] = useState("");
  const [reflectionInput, setReflectionInput] = useState("");
  const [savingResult, setSavingResult] = useState(false);

  // Turn into Plan Modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planAction, setPlanAction] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Handle URL query parameter `?prompt=...` on mount
  useEffect(() => {
    const promptParam = searchParams?.get("prompt");
    if (promptParam && promptParam.trim()) {
      handleSend(promptParam.trim());
    }
  }, [searchParams]);

  // Synchronous auto-resize on input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    const el = e.target;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 140);
    el.style.height = `${Math.max(newHeight, 40)}px`;
  };

  // Initialize Speech Recognition
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

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
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
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: "user_" + Date.now(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
    setLoading(true);

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
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

  const handleCreatePlanFromChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    await saveGoal({
      title: planTitle.trim(),
      currentSituation: "Initiated from Ask Akuche thinking session",
      target: 10,
      currentProgress: 1,
      unit: "milestones",
      nextAction: planAction.trim() || "Complete Step 1 today",
      isActive: true,
    });

    setShowPlanModal(false);
    setPlanTitle("");
    setPlanAction("");
    router.push("/dashboard/journal");
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-3 pb-36 space-y-4">
      {/* Contextual Guidance Banner for Section 17 */}
      <ContextualGuidanceBanner
        featureKey="ask"
        title="Ask anything important to you"
        description="Tell Akuche what you're trying to understand, solve, decide or accomplish. Move from Question → Clarity → Plan → Action."
      />

      {/* 1. CLEAN DOORWAY HEADER */}
      {messages.length === 0 && (
        <div className="text-center pt-2 pb-1 space-y-1.5">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            ASK AKUCHE
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            What are you trying to understand, solve, decide or achieve?
          </p>

          <button
            onClick={() => setShowDiscoveryModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3.5 py-1 text-xs font-bold transition active:scale-95 touch-manipulation"
          >
            <CompassIcon className="h-3.5 w-3.5" />
            <span>I'M NOT SURE WHAT I NEED</span>
          </button>
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
              className={`rounded-2xl sm:rounded-3xl px-4 py-3.5 text-xs sm:text-sm max-w-[95%] sm:max-w-[90%] leading-relaxed break-words whitespace-pre-wrap ${
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

            {/* Action Conversion Loop Buttons (Section 7) */}
            {msg.role === "assistant" && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2 pl-1">
                <button
                  onClick={() => {
                    setPlanTitle("My 30-Day Execution Plan");
                    setPlanAction("Execute Step 1 before 6 PM");
                    setShowPlanModal(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-[11px] font-bold transition active:scale-95 touch-manipulation"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>CREATE MY PLAN</span>
                </button>
                <button
                  onClick={() => {
                    setPlanTitle("Achieve Target Goal");
                    setPlanAction("Complete today's milestone");
                    setShowPlanModal(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-muted hover:bg-accent text-foreground px-3 py-1.5 text-[11px] font-bold transition active:scale-95 touch-manipulation"
                >
                  <Target className="h-3.5 w-3.5 text-emerald-500" />
                  <span>SET A GOAL</span>
                </button>
              </div>
            )}

            {/* Structured Socratic Thinking Cards */}
            {msg.cards && (
              <div className="w-full mt-3 space-y-3">
                {/* WHAT WE KNOW */}
                {msg.cards.whatWeKnow && msg.cards.whatWeKnow.length > 0 && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 sm:p-4 text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-blue-600 dark:text-blue-400 block mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      WHAT WE KNOW
                    </span>
                    <ul className="space-y-1 text-foreground/90 pl-1">
                      {msg.cards.whatWeKnow.map((k, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span className="break-words">{k}</span>
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
                      WHAT WE DON'T KNOW
                    </span>
                    <ul className="space-y-1 text-foreground/90 pl-1">
                      {msg.cards.whatWeDontKnow.map((dk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span className="break-words">{dk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ASSUMPTIONS & RISKS */}
                {((msg.cards.assumptions && msg.cards.assumptions.length > 0) ||
                  (msg.cards.risks && msg.cards.risks.length > 0)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.cards.assumptions && msg.cards.assumptions.length > 0 && (
                      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs">
                        <span className="font-extrabold uppercase tracking-wider text-[10px] text-purple-600 dark:text-purple-400 block mb-1">
                          YOUR ASSUMPTIONS
                        </span>
                        <ul className="space-y-0.5 text-foreground/90 font-medium">
                          {msg.cards.assumptions.map((a, i) => (
                            <li key={i} className="break-words">• {a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {msg.cards.risks && msg.cards.risks.length > 0 && (
                      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
                        <span className="font-extrabold uppercase tracking-wider text-[10px] text-rose-600 dark:text-rose-400 block mb-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          POTENTIAL RISKS
                        </span>
                        <ul className="space-y-0.5 text-foreground/90 font-medium">
                          {msg.cards.risks.map((r, i) => (
                            <li key={i} className="break-words">• {r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* TODAY'S ACTION ASSIGNMENT (SECTION 10) */}
                {msg.cards.mission && (
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-5 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-black text-primary-foreground shadow-sm">
                        <Target className="h-3.5 w-3.5" />
                        TODAY'S ACTION ASSIGNMENT
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {msg.cards.mission.deadline}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-foreground mb-2">
                      {msg.cards.mission.title}
                    </h4>

                    {msg.cards.mission.whyItMatters && (
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        <strong className="text-foreground">Why it matters:</strong> {msg.cards.mission.whyItMatters}
                      </p>
                    )}

                    <div className="space-y-2 mb-3.5 text-xs text-foreground/90">
                      {msg.cards.mission.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-card/80 p-2.5 rounded-xl border border-border/60">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="font-medium pt-0.5 leading-snug break-words">{step}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleMarkMissionCompleted(msg.cards!.mission!)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-xs sm:text-sm font-bold shadow-sm transition hover:bg-primary/90 active:scale-95 min-h-[48px] touch-manipulation"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark as Completed & Log Result
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

      {/* 3. SUGGESTED PROMPTS CATEGORY CHIPS (SECTION 19) */}
      {messages.length === 0 && (
        <div className="space-y-2.5 pt-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
            Suggested starting prompts:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {CATEGORY_PROMPTS.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSend(item.prompt)}
                className="rounded-xl border border-border/80 bg-card/80 hover:bg-card hover:border-primary/40 px-3 py-2 text-xs font-semibold text-foreground transition active:scale-95 touch-manipulation text-left shadow-sm"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. FIXED BOTTOM INPUT BAR (AUTO-EXPANDING MULTILINE TEXTAREA) */}
      <div className="fixed inset-x-0 bottom-16 lg:bottom-4 z-30 px-3 sm:px-4">
        <div className="mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-xl flex items-end gap-2">
          {/* Voice Input Button (Section 20) */}
          {speechSupported && (
            <button
              onClick={toggleVoiceInput}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition touch-manipulation mb-0.5 ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={isListening ? "Listening..." : "Talk to Akuche"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}

          {/* Auto-expanding Multiline Textarea — Text wraps into row 2 & row 3 immediately at the edge */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                if (typeof window !== "undefined" && window.innerWidth > 768) {
                  e.preventDefault();
                  handleSend();
                }
              }
            }}
            placeholder={
              isListening
                ? "Listening... speak clearly"
                : "Ask anything you're trying to understand, solve, decide or accomplish..."
            }
            className="flex-1 min-w-0 resize-none bg-transparent px-2.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[40px] max-h-[140px] overflow-y-auto leading-relaxed break-words whitespace-pre-wrap"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
              overflowX: "hidden",
            }}
          />

          {/* Send Action Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40 active:scale-95 touch-manipulation mb-0.5 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 5. "I'M NOT SURE WHAT I NEED" DISCOVERY MODAL (SECTION 22) */}
      {showDiscoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h3 className="text-base font-black text-foreground">
                  I'm Not Sure What I Need
                </h3>
                <p className="text-xs text-muted-foreground">
                  «That's okay. Tell me what is currently happening in your life.»
                </p>
              </div>
              <button
                onClick={() => setShowDiscoveryModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DISCOVERY_DOMAINS.map((domain, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowDiscoveryModal(false);
                    handleSend(domain.question);
                  }}
                  className="text-left p-3 rounded-2xl border border-border/80 bg-card hover:bg-card hover:border-primary/50 transition active:scale-95 touch-manipulation space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{domain.icon}</span>
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition">
                      {domain.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                    {domain.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TURN THIS INTO A PLAN MODAL (SECTION 7) */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Turn This Into a Plan</span>
              </h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlanFromChat} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Generate ₦5 million before December"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  First Immediate Action (Today)
                </label>
                <input
                  type="text"
                  value={planAction}
                  onChange={(e) => setPlanAction(e.target.value)}
                  placeholder="e.g. Send 5 WhatsApp messages to warm leads"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none min-h-[44px]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-accent transition min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition min-h-[44px]"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. RESULTS & REFLECTION MODAL */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-foreground mb-1">
              Results & Action Loop
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
                  placeholder="e.g. Sent 5 WhatsApp pitches, 2 prospective clients replied"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  What did you learn from this outcome?
                </label>
                <textarea
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="e.g. Prospects responded faster when I mentioned their specific industry pain point..."
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
