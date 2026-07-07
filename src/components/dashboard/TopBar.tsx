"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatDistance, formatNumber, formatReaction, formatSpeed } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { t } from "@/lib/i18n";
import { average, goalsForShooterGoalkeeperDistance } from "@/lib/topBarMetrics";
import type { GoalRecord, Language, ShotOutcomeView, ShotView } from "@/lib/types";

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
  shotView,
  onShotViewChange,
  shotOutcomeView,
  onShotOutcomeViewChange,
}: {
  goals: GoalRecord[];
  language: Language;
  onLanguageChange: (language: Language) => void;
  search: string;
  onSearchChange: (search: string) => void;
  shotView: ShotView;
  onShotViewChange: (shotView: ShotView) => void;
  shotOutcomeView: ShotOutcomeView;
  onShotOutcomeViewChange: (shotOutcomeView: ShotOutcomeView) => void;
}) {
  // Subtle scroll-aware elevation for the sticky header.
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shooterGoalkeeperDistanceGoals = goalsForShooterGoalkeeperDistance(goals, shotView);
  const languageToggle = (
    <div className="language-toggle language-floating" role="group" aria-label="Language">
      <button
        className={language === "es" ? "active" : ""}
        onClick={() => onLanguageChange("es")}
        aria-label="Espanol"
        title="Espanol"
      >
        <span className="flag-icon flag-es" aria-hidden="true" />
      </button>
      <button
        className={language === "en" ? "active" : ""}
        onClick={() => onLanguageChange("en")}
        aria-label="English"
        title="English"
      >
        <span className="flag-icon flag-gb" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <>
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
          placeholder={language === "es" ? "Buscar jugador, equipo o partido..." : "Search player, team, or match..."}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label={language === "es" ? "Buscar jugador, equipo o partido" : "Search player, team, or match"}
        />

        <div className="top-controls">
          <div className="shot-view-toggle" role="group" aria-label={language === "es" ? "Tipo de tiros" : "Shot type"}>
            <button className={shotView === "goals" ? "active" : ""} onClick={() => onShotViewChange("goals")}>
              {language === "es" ? "Solo goles" : "Goals"}
            </button>
            <button className={shotView === "all" ? "active" : ""} onClick={() => onShotViewChange("all")}>
              {language === "es" ? "Todos los tiros" : "All shots"}
            </button>
          </div>

          {shotView === "all" ? (
            <div
              className="shot-outcome-toggle"
              role="group"
              aria-label={language === "es" ? "Resultado de tiros" : "Shot outcome"}
            >
              <button
                className={shotOutcomeView === "all" ? "active" : ""}
                onClick={() => onShotOutcomeViewChange("all")}
              >
                {language === "es" ? "Todos" : "All"}
              </button>
              <button
                className={shotOutcomeView === "nonGoals" ? "active" : ""}
                onClick={() => onShotOutcomeViewChange("nonGoals")}
              >
                {language === "es" ? "No goles" : "No goals"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="kpi-strip">
          <Kpi label={shotView === "goals" ? t(language, "goals") : t(language, "shots")} value={goals.length} />
          <Kpi label={t(language, "avgXg")} value={formatNumber(average(goals, (goal) => goal.shot.xg))} />
          <Kpi label={t(language, "avgXgot")} value={formatNumber(average(goals, (goal) => goal.shot.xgot))} />
          <Kpi
            label={language === "es" ? "Vel." : "Speed"}
            value={formatSpeed(average(goals, (goal) => goal.metrics.shotSpeedEstimatedKmh))}
          />
          <Kpi
            label={language === "es" ? "Reaccion" : "Reaction"}
            value={formatReaction(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperReactionTimeEstimatedS))}
          />
          <Kpi
            label={language === "es" ? "Lanz.-porteria" : "Shooter-goal"}
            value={formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).shotDistanceToGoalM))}
          />
          <Kpi
            label={language === "es" ? "Lanz.-portero" : "Shooter-GK"}
            value={formatDistance(
              average(
                shooterGoalkeeperDistanceGoals,
                (goal) => getDisplayGoalMetrics(goal).goalkeeperDistanceToShooterM,
              ),
            )}
          />
          <Kpi
            label={language === "es" ? "Portero-porteria" : "GK-goal"}
            value={formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperDistanceToGoalLineM))}
          />
        </div>
      </header>

      {mounted ? createPortal(languageToggle, document.body) : null}
    </>
  );
}
