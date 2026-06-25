"use client";

import { useEffect, useState } from "react";
import { formatDistance, formatNumber, formatReaction, formatSpeed } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { t } from "@/lib/i18n";
import type { GoalRecord, Language } from "@/lib/types";

function average(goals: GoalRecord[], selector: (goal: GoalRecord) => unknown) {
  const values = goals
    .map(selector)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <span>
      {label}
      <strong>{value}</strong>
    </span>
  );
}

export function TopBar({
  goals,
  language,
  onLanguageChange,
  search,
  onSearchChange,
}: {
  goals: GoalRecord[];
  language: Language;
  onLanguageChange: (language: Language) => void;
  search: string;
  onSearchChange: (search: string) => void;
}) {
  // Subtle scroll-aware elevation for the sticky header
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="top-bar"
      style={{
        position: "sticky",
        top: 12,
        zIndex: 30,
        transition: "box-shadow 0.3s var(--ease), transform 0.3s var(--ease)",
        boxShadow: scrolled ? "var(--shadow-lift)" : "var(--shadow-md)",
      }}
    >
      <div className="brand-lockup">
        <img src="/brand/logo-h-color.svg" alt="BeFootball Academy" />
        <span className="brand-divider" aria-hidden />
        <img src="/fifa-world-cup-2026.png" alt="FIFA World Cup 2026" className="wc-logo" />
        <div className="brand-text">
          <p className="eyebrow">FIFA World Cup 2026</p>
          <h1>Goal Performance</h1>
        </div>
      </div>

      <input
        className="search-input"
        value={search}
        placeholder={language === "es" ? "Buscar jugador, equipo o partido…" : "Search player, team, or match…"}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label={language === "es" ? "Buscar jugador, equipo o partido" : "Search player, team, or match"}
      />

      <div className="language-toggle" role="group" aria-label="Language">
        <button className={language === "es" ? "active" : ""} onClick={() => onLanguageChange("es")}>
          ES
        </button>
        <button className={language === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>
          EN
        </button>
      </div>

      <div className="kpi-strip">
        <Kpi label={t(language, "goals")} value={goals.length} />
        <Kpi label={t(language, "avgXg")} value={formatNumber(average(goals, (goal) => goal.shot.xg))} />
        <Kpi label={t(language, "avgXgot")} value={formatNumber(average(goals, (goal) => goal.shot.xgot))} />
        <Kpi
          label={language === "es" ? "Vel." : "Speed"}
          value={formatSpeed(average(goals, (goal) => goal.metrics.shotSpeedEstimatedKmh))}
        />
        <Kpi
          label={language === "es" ? "Reacción" : "Reaction"}
          value={formatReaction(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperReactionTimeEstimatedS))}
        />
        <Kpi
          label={language === "es" ? "Lanz.-portería" : "Shooter-goal"}
          value={formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).shotDistanceToGoalM))}
        />
        <Kpi
          label={language === "es" ? "Lanz.-portero" : "Shooter-GK"}
          value={formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperDistanceToShooterM))}
        />
        <Kpi
          label={language === "es" ? "Portero-portería" : "GK-goal"}
          value={formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperDistanceToGoalLineM))}
        />
      </div>
    </header>
  );
}
