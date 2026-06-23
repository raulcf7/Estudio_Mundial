"use client";

import { useEffect, useMemo, useState } from "react";
import { GoalkeeperMap } from "@/components/visualizations/GoalkeeperMap";
import { GoalMouth } from "@/components/visualizations/GoalMouth";
import { SequenceMap } from "@/components/visualizations/SequenceMap";
import { ShotMap } from "@/components/visualizations/ShotMap";
import { applyFilters, nextSelectedGoalId } from "@/lib/filtering";
import type { GoalFilters, GoalRecord, Language } from "@/lib/types";
import { FilterPanel } from "./FilterPanel";
import { GoalSummary } from "./GoalSummary";
import { TopBar } from "./TopBar";

const defaultFilters: GoalFilters = {
  search: "",
  scoringTeams: [],
  concedingTeams: [],
  goalkeepers: [],
  scorers: [],
  bodyParts: [],
  playPatterns: [],
  tacticalSituations: [],
  vrScenarios: [],
  goalkeeperDepths: [],
  goalMouthHeights: [],
  finishCorners: [],
  shotSpeedCategories: [],
  reactionTimeCategories: [],
  minuteRange: [0, 130],
  warningsOnly: false,
};

export function GoalDashboard({ goals }: { goals: GoalRecord[] }) {
  const [language, setLanguage] = useState<Language>("es");
  const [filters, setFilters] = useState<GoalFilters>(defaultFilters);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id ?? "");
  const [highlightedEventId, setHighlightedEventId] = useState<number | null>(null);

  const filteredGoals = useMemo(() => applyFilters(goals, filters), [goals, filters]);
  const activeGoalId = nextSelectedGoalId(filteredGoals, selectedGoalId);
  const selectedGoal = filteredGoals.find((goal) => goal.id === activeGoalId) ?? filteredGoals[0] ?? goals[0];

  useEffect(() => {
    if (activeGoalId !== selectedGoalId) {
      setSelectedGoalId(activeGoalId);
    }
  }, [activeGoalId, selectedGoalId]);

  return (
    <main className="dashboard-shell">
      <TopBar
        goals={filteredGoals}
        language={language}
        onLanguageChange={setLanguage}
        search={filters.search}
        onSearchChange={(search) => setFilters((current) => ({ ...current, search }))}
      />
      <section className="dashboard-grid">
        <FilterPanel goals={goals} filters={filters} language={language} onFiltersChange={setFilters} />
        <section className="visual-stack" aria-label="Visualizaciones de goles">
          <ShotMap goals={filteredGoals} selectedGoalId={activeGoalId} language={language} onSelectGoal={setSelectedGoalId} />
          <GoalkeeperMap goals={filteredGoals} selectedGoal={selectedGoal} language={language} onSelectGoal={setSelectedGoalId} />
          <GoalMouth goals={filteredGoals} selectedGoal={selectedGoal} language={language} onSelectGoal={setSelectedGoalId} />
          <SequenceMap
            goal={selectedGoal}
            language={language}
            highlightedEventId={highlightedEventId}
            onHighlightEvent={setHighlightedEventId}
          />
        </section>
        <GoalSummary goal={selectedGoal} language={language} />
      </section>
    </main>
  );
}
