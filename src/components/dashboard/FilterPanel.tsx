import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { labelFor } from "@/lib/i18n";
import type { GoalFilters, GoalRecord, Language } from "@/lib/types";

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

  return (
    <aside className="filter-panel">
      <h2>{language === "es" ? "Filtros" : "Filters"}</h2>
      <FilterGroup
        title={language === "es" ? "Equipo que marca" : "Scoring team"}
        values={scoringTeams}
        active={filters.scoringTeams}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, scoringTeams: toggle(filters.scoringTeams, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Equipo que encaja" : "Conceding team"}
        values={concedingTeams}
        active={filters.concedingTeams}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, concedingTeams: toggle(filters.concedingTeams, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Portero" : "Goalkeeper"}
        values={goalkeepers}
        active={filters.goalkeepers}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, goalkeepers: toggle(filters.goalkeepers, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Rematador" : "Scorer"}
        values={scorers}
        active={filters.scorers}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, scorers: toggle(filters.scorers, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Patrón de juego" : "Play pattern"}
        values={playPatterns}
        active={filters.playPatterns}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, playPatterns: toggle(filters.playPatterns, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Situación táctica" : "Tactical situation"}
        values={tacticalSituations}
        active={filters.tacticalSituations}
        language={language}
        onToggle={(value) =>
          onFiltersChange({ ...filters, tacticalSituations: toggle(filters.tacticalSituations, value) })
        }
      />
      <FilterGroup
        title={language === "es" ? "Escenario VR" : "VR scenario"}
        values={vrScenarios}
        active={filters.vrScenarios}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, vrScenarios: toggle(filters.vrScenarios, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Remate" : "Finish"}
        values={bodyParts}
        active={filters.bodyParts}
        language={language}
        onToggle={(value) => onFiltersChange({ ...filters, bodyParts: toggle(filters.bodyParts, value) })}
      />
      <FilterGroup
        title={language === "es" ? "Velocidad estimada" : "Estimated speed"}
        values={speedCategories}
        active={filters.shotSpeedCategories}
        language={language}
        onToggle={(value) =>
          onFiltersChange({ ...filters, shotSpeedCategories: toggle(filters.shotSpeedCategories, value) })
        }
      />
      <FilterGroup
        title={language === "es" ? "Tiempo de reacción" : "Reaction time"}
        values={reactionCategories}
        active={filters.reactionTimeCategories}
        language={language}
        onToggle={(value) =>
          onFiltersChange({ ...filters, reactionTimeCategories: toggle(filters.reactionTimeCategories, value) })
        }
      />
      <button
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

function FilterGroup({
  title,
  values,
  active,
  language,
  onToggle,
}: {
  title: string;
  values: string[];
  active: string[];
  language: Language;
  onToggle: (value: string) => void;
}) {
  return (
    <section className="filter-group">
      <h3>{title}</h3>
      <div className="chip-row">
        {values.map((value) => (
          <button key={value} className={active.includes(value) ? "chip active" : "chip"} onClick={() => onToggle(value)}>
            {labelFor(language, value)}
          </button>
        ))}
      </div>
    </section>
  );
}
