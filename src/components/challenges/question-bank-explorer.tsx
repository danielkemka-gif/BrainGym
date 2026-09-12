"use client";

import { useState } from "react";
import {
  COGNITIVE_DOMAINS,
  getFull5000Questions,
  getQuestionsByDomain,
  searchQuestions,
  getTotalQuestionCount,
} from "@/lib/questions-bank";
import { CognitiveChallenge, ChallengeOption } from "@/lib/challenges-engine/types";
import {
  Search,
  Brain,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Filter,
} from "lucide-react";

export function QuestionBankExplorer() {
  const [selectedDomainKey, setSelectedDomainKey] = useState<string>("logic");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<CognitiveChallenge | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalCount = getTotalQuestionCount();

  // Filtered list
  const activeQuestions = searchQuery.trim()
    ? searchQuestions(searchQuery, 100)
    : getQuestionsByDomain(selectedDomainKey, 500, 0);

  const totalPages = Math.ceil(activeQuestions.length / PAGE_SIZE);
  const paginatedQuestions = activeQuestions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSelectOption = (opt: ChallengeOption) => {
    if (selectedOptionId) return;
    setSelectedOptionId(opt.id);
    setIsCorrect(opt.isCorrect);
  };

  const handleResetModal = () => {
    setSelectedQuestion(null);
    setSelectedOptionId(null);
    setIsCorrect(null);
  };

  return (
    <div className="rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-7 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary">
              5,000+ COGNITIVE QUESTION REPOSITORY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
            Explore 5,000+ BrainGym Questions
          </h2>
          <p className="text-xs text-muted-foreground">
            Search, practice, and challenge your brain across 10 core life and cognitive domains.
          </p>
        </div>

        <span className="rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black text-primary shrink-0">
          {totalCount.toLocaleString()}+ Questions Live
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by topic, keyword, formula, or life scenario (e.g. Negotiation, Syllogism, Cash Runway, Dopamine)..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-background text-xs sm:text-sm font-medium text-foreground focus:border-primary focus:outline-none transition shadow-sm"
        />
      </div>

      {/* 10 Domain Filter Pills */}
      {!searchQuery && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {COGNITIVE_DOMAINS.map((domain) => {
            const isSelected = selectedDomainKey === domain.key;
            return (
              <button
                key={domain.key}
                onClick={() => {
                  setSelectedDomainKey(domain.key);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shrink-0 transition active:scale-95 ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20 font-black"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{domain.emoji}</span>
                <span>{domain.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {paginatedQuestions.map((q, idx) => (
          <div
            key={q.id}
            onClick={() => {
              setSelectedQuestion(q);
              setSelectedOptionId(null);
              setIsCorrect(null);
            }}
            className="rounded-2xl border border-border/80 bg-background/60 hover:bg-muted/60 p-4 transition cursor-pointer space-y-2 hover:border-primary/50 group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-primary bg-primary/10 rounded-md px-2 py-0.5">
                  {q.category}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  Skill: {q.cognitiveSkill}
                </span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border rounded-full px-2 py-0.5">
                +{q.xpReward} XP
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition leading-relaxed">
              {q.question}
            </p>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span className="italic">{q.options?.length || 4} Multiple Choice Options (A, B, C, D)</span>
              <span className="text-primary font-bold group-hover:underline inline-flex items-center gap-1">
                <span>Practice Question</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
          <span className="text-muted-foreground">
            Showing Page {currentPage} of {totalPages} ({activeQuestions.length} questions)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-border bg-background px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-muted"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-border bg-background px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-muted"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Interactive Practice Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                {selectedQuestion.category} · {selectedQuestion.cognitiveSkill}
              </span>
              <button
                onClick={handleResetModal}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-foreground leading-relaxed">
                {selectedQuestion.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {selectedQuestion.options?.map((opt, idx) => {
                const letters = ["A", "B", "C", "D"];
                const isSelected = selectedOptionId === opt.id;
                let btnClass = "border-border bg-background text-foreground";
                let badgeClass = "bg-muted text-foreground border-border";

                if (selectedOptionId !== null) {
                  if (isSelected && opt.isCorrect) {
                    btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold";
                    badgeClass = "bg-emerald-500 text-white border-emerald-500";
                  } else if (isSelected && !opt.isCorrect) {
                    btnClass = "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400";
                    badgeClass = "bg-rose-500 text-white border-rose-500";
                  } else if (opt.isCorrect) {
                    btnClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                    badgeClass = "bg-emerald-500/80 text-white border-emerald-500";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={selectedOptionId !== null}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left rounded-2xl border p-3.5 text-xs sm:text-sm font-medium transition active:scale-[0.99] flex items-start gap-3 ${btnClass}`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-black ${badgeClass}`}>
                      {letters[idx] || "A"}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.label}</span>
                    {selectedOptionId !== null && opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-1 mt-0.5" />}
                    {selectedOptionId !== null && isSelected && !opt.isCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-1 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {selectedOptionId && (
              <div className="rounded-2xl bg-muted/70 p-4 text-xs text-muted-foreground leading-relaxed border-l-2 border-primary space-y-1 animate-in fade-in">
                <span className="font-bold text-foreground block">Educational Takeaway:</span>
                <p>{selectedQuestion.educationalWhy}</p>
              </div>
            )}

            <button
              onClick={handleResetModal}
              className="w-full rounded-2xl bg-primary text-white py-3 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition"
            >
              {selectedOptionId ? "Done / Close" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
