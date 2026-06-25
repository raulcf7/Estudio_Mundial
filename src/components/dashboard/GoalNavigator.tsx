"use client";

import type { Language } from "@/lib/types";

/** Prev/next navigation across the currently available (filtered) goals. */
export function GoalNavigator({
  index,
  total,
  language,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  language: Language;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (total <= 1) return null;
  const position = index < 0 ? 1 : index + 1;
  return (
    <div className="goal-nav" role="group" aria-label={language === "es" ? "Navegar goles" : "Navigate goals"}>
      <button
        type="button"
        className="goal-nav-btn"
        onClick={onPrev}
        aria-label={language === "es" ? "Gol anterior" : "Previous goal"}
      >
        ‹
      </button>
      <span className="goal-nav-count">
        {position}
        <span className="goal-nav-sep">/</span>
        {total}
      </span>
      <button
        type="button"
        className="goal-nav-btn"
        onClick={onNext}
        aria-label={language === "es" ? "Gol siguiente" : "Next goal"}
      >
        ›
      </button>
    </div>
  );
}
