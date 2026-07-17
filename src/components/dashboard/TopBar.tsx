"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { formatDistance, formatNumber, formatReaction, formatSpeed } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { t } from "@/lib/i18n";
import { initials, playerFace, teamCrest, teamCrestByName } from "@/lib/images";
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

type SearchSuggestion = {
  key: string;
  value: string;
  label: string;
  detail: string;
  kind: "player" | "team" | "match";
  image: string | null;
  secondaryImage?: string | null;
  fallback: string;
  appearances: number;
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchScore(label: string, query: string, appearances: number) {
  const haystack = normalizeSearch(label);
  const needle = normalizeSearch(query.trim());
  if (!needle) return 0;
  if (haystack === needle) return 2000 + appearances;
  if (haystack.startsWith(needle)) return 1200 + appearances;
  if (haystack.split(/\s+/).some((word) => word.startsWith(needle))) return 900 + appearances;
  if (haystack.includes(needle)) return 600 + appearances;
  return 0;
}

function searchSuggestions(goals: GoalRecord[], query: string, language: Language) {
  const suggestions = new Map<string, SearchSuggestion>();

  const add = (suggestion: Omit<SearchSuggestion, "appearances">) => {
    if (!suggestion.label) return;
    const existing = suggestions.get(suggestion.key);
    suggestions.set(suggestion.key, {
      ...suggestion,
      appearances: (existing?.appearances ?? 0) + 1,
    });
  };

  for (const goal of goals) {
    add({
      key: `player:scorer:${goal.participants.scorerName}`,
      value: goal.participants.scorerName,
      label: goal.participants.scorerName,
      detail: language === "es" ? "Rematador" : "Scorer",
      kind: "player",
      image: playerFace(goal.participants.scorerId),
      fallback: initials(goal.participants.scorerName),
    });
    add({
      key: `player:gk:${goal.participants.goalkeeperName}`,
      value: goal.participants.goalkeeperName,
      label: goal.participants.goalkeeperName,
      detail: language === "es" ? "Portero" : "Goalkeeper",
      kind: "player",
      image: playerFace(goal.participants.goalkeeperId),
      fallback: initials(goal.participants.goalkeeperName),
    });
    add({
      key: `team:scoring:${goal.participants.scoringTeam}`,
      value: goal.participants.scoringTeam,
      label: goal.participants.scoringTeam,
      detail: language === "es" ? "Equipo que marca" : "Scoring team",
      kind: "team",
      image: teamCrest(goal.participants.scoringTeamId) ?? teamCrestByName(goal.participants.scoringTeam),
      fallback: initials(goal.participants.scoringTeam),
    });
    add({
      key: `team:conceding:${goal.participants.concedingTeam}`,
      value: goal.participants.concedingTeam,
      label: goal.participants.concedingTeam,
      detail: language === "es" ? "Equipo que encaja" : "Conceding team",
      kind: "team",
      image: teamCrest(goal.participants.concedingTeamId) ?? teamCrestByName(goal.participants.concedingTeam),
      fallback: initials(goal.participants.concedingTeam),
    });

    const homeTeam = String(goal.match.homeTeam ?? "");
    const awayTeam = String(goal.match.awayTeam ?? "");
    if (homeTeam && awayTeam) {
      add({
        key: `match:${homeTeam}:${awayTeam}`,
        value: `${homeTeam} vs ${awayTeam}`,
        label: `${homeTeam} vs ${awayTeam}`,
        detail: language === "es" ? "Partido" : "Match",
        kind: "match",
        image: teamCrestByName(homeTeam),
        secondaryImage: teamCrestByName(awayTeam),
        fallback: initials(homeTeam),
      });
    }
  }

  return [...suggestions.values()]
    .map((suggestion) => ({ suggestion, score: matchScore(suggestion.label, query, suggestion.appearances) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.suggestion.label.localeCompare(b.suggestion.label))
    .slice(0, 10)
    .map(({ suggestion }) => suggestion);
}

export function TopBar({
  goals,
  suggestionGoals,
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
  suggestionGoals: GoalRecord[];
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
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shooterGoalkeeperDistanceGoals = goalsForShooterGoalkeeperDistance(goals, shotView);
  const suggestions = useMemo(
    () => searchSuggestions(suggestionGoals, search, language),
    [suggestionGoals, search, language],
  );
  const showSuggestions = searchFocused && search.trim().length > 0 && suggestions.length > 0;
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

        <div className="search-box">
          <input
            className="search-input"
            value={search}
            placeholder={language === "es" ? "Buscar jugador, equipo o partido..." : "Search player, team, or match..."}
            onChange={(event) => onSearchChange(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
            aria-label={language === "es" ? "Buscar jugador, equipo o partido" : "Search player, team, or match"}
            aria-expanded={showSuggestions ? "true" : "false"}
            aria-controls="search-suggestions"
            autoComplete="off"
          />

          {showSuggestions ? (
            <div className="search-suggestions" id="search-suggestions" role="listbox">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.key}
                  type="button"
                  className="search-suggestion"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSearchChange(suggestion.value);
                    setSearchFocused(false);
                  }}
                  role="option"
                  aria-selected="false"
                >
                  <span className={`suggestion-media suggestion-${suggestion.kind}`} aria-hidden>
                    {suggestion.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={suggestion.image} alt="" />
                    ) : (
                      <span>{suggestion.fallback}</span>
                    )}
                    {suggestion.kind === "match" && suggestion.secondaryImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={suggestion.secondaryImage} alt="" />
                    ) : null}
                  </span>
                  <span className="suggestion-copy">
                    <span className="suggestion-label">{suggestion.label}</span>
                    <span className="suggestion-detail">{suggestion.detail}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

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
