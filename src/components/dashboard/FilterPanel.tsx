"use client";

import { useState } from "react";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { labelFor } from "@/lib/i18n";
import { initials, playerFaceByName, teamCrestByName } from "@/lib/images";
import type { GoalFilters, GoalRecord, Language } from "@/lib/types";

type IconKind = "team" | "player" | "none";

function uniqueValues(goals: GoalRecord[], selector: (goal: GoalRecord) => unknown) {
  return [...new Set(goals.map(selector).map(String).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function FilterPanel({
  goals,
  filters,
  language,
  onFiltersChange,
}: {
  goals: GoalRecord[];
  filters: GoalFilters;
  language: Language;
  onFiltersChange: (filters: GoalFilters) => void;
}) {
  const scoringTeams = uniqueValues(goals, (goal) => goal.participants.scoringTeam);
  const concedingTeams = uniqueValues(goals, (goal) => goal.participants.concedingTeam);
  const goalkeepers = uniqueValues(goals, (goal) => goal.participants.goalkeeperName);
  const scorers = uniqueValues(goals, (goal) => goal.participants.scorerName);
  const playPatterns = uniqueValues(goals, (goal) => goal.shot.playPattern);
  const tacticalSituations = uniqueValues(goals, (goal) => goal.tags.tacticalSituationPrimary);
  const vrScenarios = uniqueValues(goals, (goal) => goal.tags.vrScenarioFamily);
  const bodyParts = uniqueValues(goals, (goal) => goal.shot.bodyPart);
  const speedCategories = uniqueValues(goals, (goal) => goal.metrics.shotSpeedCategory);
  const reactionCategories = uniqueValues(goals, (goal) => getDisplayGoalMetrics(goal).reactionTimeCategory);

  const activeCount =
    filters.scoringTeams.length +
    filters.concedingTeams.length +
    filters.goalkeepers.length +
    filters.scorers.length +
    filters.playPatterns.length +
    filters.tacticalSituations.length +
    filters.vrScenarios.length +
    filters.bodyParts.length +
    filters.shotSpeedCategories.length +
    filters.reactionTimeCategories.length;

  return (
    <aside className="filter-panel">
      <h2>
        {language === "es" ? "Filtros" : "Filters"}
        {activeCount > 0 ? <span className="filter-total">{activeCount}</span> : null}
      </h2>

      <FilterDropdown
        title={language === "es" ? "Equipo que marca" : "Scoring team"}
        values={scoringTeams}
        active={filters.scoringTeams}
        language={language}
        icon="team"
        onToggle={(value) => onFiltersChange({ ...filters, scoringTeams: toggle(filters.scoringTeams, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Equipo que encaja" : "Conceding team"}
        values={concedingTeams}
        active={filters.concedingTeams}
        language={language}
        icon="team"
        onToggle={(value) => onFiltersChange({ ...filters, concedingTeams: toggle(filters.concedingTeams, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Portero" : "Goalkeeper"}
        values={goalkeepers}
        active={filters.goalkeepers}
        language={language}
        icon="player"
        onToggle={(value) => onFiltersChange({ ...filters, goalkeepers: toggle(filters.goalkeepers, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Rematador" : "Scorer"}
        values={scorers}
        active={filters.scorers}
        language={language}
        icon="player"
        onToggle={(value) => onFiltersChange({ ...filters, scorers: toggle(filters.scorers, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Patrón de juego" : "Play pattern"}
        values={playPatterns}
        active={filters.playPatterns}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, playPatterns: toggle(filters.playPatterns, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Situación táctica" : "Tactical situation"}
        values={tacticalSituations}
        active={filters.tacticalSituations}
        language={language}
        onToggle={(value) =>
          onFiltersChange({ ...filters, tacticalSituations: toggle(filters.tacticalSituations, value) })
        }
      />
      <FilterDropdown
        title={language === "es" ? "Escenario VR" : "VR scenario"}
        values={vrScenarios}
        active={filters.vrScenarios}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, vrScenarios: toggle(filters.vrScenarios, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Remate" : "Finish"}
        values={bodyParts}
        active={filters.bodyParts}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, bodyParts: toggle(filters.bodyParts, value) })}
      />
      <FilterDropdown
        title={language === "es" ? "Velocidad estimada" : "Estimated speed"}
        values={speedCategories}
        active={filters.shotSpeedCategories}
        language={language}
        onToggle={(value) =>
          onFiltersChange({ ...filters, shotSpeedCategories: toggle(filters.shotSpeedCategories, value) })
        }
      />
      <FilterDropdown
        title={language === "es" ? "Tiempo de reacción" : "Reaction time"}
        values={reactionCategories}
        active={filters.reactionTimeCategories}
        language={language}
        onToggle={(value) =>
          onFiltersChange({ ...filters, reactionTimeCategories: toggle(filters.reactionTimeCategories, value) })
        }
      />

      <button
        type="button"
        className="clear-button"
        onClick={() =>
          onFiltersChange({
            ...filters,
            scoringTeams: [],
            concedingTeams: [],
            goalkeepers: [],
            scorers: [],
            playPatterns: [],
            tacticalSituations: [],
            vrScenarios: [],
            bodyParts: [],
            shotSpeedCategories: [],
            reactionTimeCategories: [],
            warningsOnly: false,
          })
        }
      >
        {language === "es" ? "Limpiar filtros" : "Clear filters"}
      </button>
    </aside>
  );
}

function FilterDropdown({
  title,
  values,
  active,
  language,
  icon = "none",
  onToggle,
}: {
  title: string;
  values: string[];
  active: string[];
  language: Language;
  icon?: IconKind;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeN = active.length;

  const iconFor = (value: string): string | null => {
    if (icon === "team") return teamCrestByName(value);
    if (icon === "player") return playerFaceByName(value);
    return null;
  };

  return (
    <section className={`filter-dd${open ? " open" : ""}`}>
      <button
        type="button"
        className="filter-dd-header"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="filter-dd-title">{title}</span>
        {activeN > 0 ? <span className="filter-dd-count">{activeN}</span> : null}
        <span className="filter-dd-chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <div className="filter-dd-body">
          {values.map((value) => {
            const isActive = active.includes(value);
            const img = iconFor(value);
            return (
              <button
                key={value}
                type="button"
                className={isActive ? "filter-option active" : "filter-option"}
                onClick={() => onToggle(value)}
              >
                <span className="filter-check" aria-hidden />
                {icon === "team" && img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="opt-crest" src={img} alt="" aria-hidden />
                ) : null}
                {icon === "player" ? (
                  img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="opt-face" src={img} alt="" aria-hidden />
                  ) : (
                    <span className="opt-face opt-face-fallback" aria-hidden>
                      {initials(value)}
                    </span>
                  )
                ) : null}
                <span className="filter-option-label">{labelFor(language, value)}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
