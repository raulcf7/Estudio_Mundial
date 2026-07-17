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
  shotView: "goals",
  shotOutcomeView: "all",
  minuteRange: [0, 130],
  warningsOnly: false,
};

export function GoalDashboard({ goals: rawGoals }: { goals: GoalRecord[] }) {
  // The dataset can contain duplicate goal ids (two different goals sharing the
  // same matchId-eventId). Duplicate React keys break reconciliation and leave a
  // "ghost" dot stuck on the maps, so we make every id unique up front.
  const goals = useMemo(() => {
    const seen = new Set<string>();
    return rawGoals.map((goal) => {
      if (!seen.has(goal.id)) {
        seen.add(goal.id);
        return goal;
      }
      let uniqueId = goal.id;
      let suffix = 2;
      while (seen.has(uniqueId)) uniqueId = `${goal.id}__${suffix++}`;
      seen.add(uniqueId);
      return { ...goal, id: uniqueId };
    });
  }, [rawGoals]);

  const [language, setLanguage] = useState<Language>("es");
  const [filters, setFilters] = useState<GoalFilters>(defaultFilters);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id ?? "");
  const [highlightedEventId, setHighlightedEventId] = useState<number | null>(null);
  // When a goal is actively clicked, the maps focus on just that goal.
  const [focusGoal, setFocusGoal] = useState(false);

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setFocusGoal(true);
  };
  const showAllGoals = () => setFocusGoal(false);

  const filteredGoals = useMemo(() => applyFilters(goals, filters), [goals, filters]);
  const activeGoalId = nextSelectedGoalId(filteredGoals, selectedGoalId);
  const selectedGoal = filteredGoals.find((goal) => goal.id === activeGoalId) ?? filteredGoals[0] ?? goals[0];
  const activeIndex = filteredGoals.findIndex((goal) => goal.id === activeGoalId);

  const stepGoal = (delta: number) => {
    if (filteredGoals.length === 0) return;
    const base = activeIndex < 0 ? 0 : activeIndex;
    const nextIndex = (base + delta + filteredGoals.length) % filteredGoals.length;
    setSelectedGoalId(filteredGoals[nextIndex].id);
  };

  useEffect(() => {
    if (activeGoalId !== selectedGoalId) {
      setSelectedGoalId(activeGoalId);
    }
  }, [activeGoalId, selectedGoalId]);

  return (
    <main className="dashboard-shell">
      <TopBar
        goals={filteredGoals}
        suggestionGoals={goals}
        language={language}
        onLanguageChange={setLanguage}
        search={filters.search}
        onSearchChange={(search) => setFilters((current) => ({ ...current, search }))}
        shotView={filters.shotView}
        onShotViewChange={(shotView) => setFilters((current) => ({ ...current, shotView }))}
        shotOutcomeView={filters.shotOutcomeView}
        onShotOutcomeViewChange={(shotOutcomeView) => setFilters((current) => ({ ...current, shotOutcomeView }))}
      />
      <section className="dashboard-grid">
        <FilterPanel goals={goals} filters={filters} language={language} onFiltersChange={setFilters} />
        <section className="visual-stack" aria-label="Visualizaciones de goles">
          <ShotMap
            goals={filteredGoals}
            selectedGoalId={activeGoalId}
            language={language}
            onSelectGoal={handleSelectGoal}
            focused={focusGoal}
            onShowAll={showAllGoals}
            navIndex={activeIndex}
            navTotal={filteredGoals.length}
            onPrevGoal={() => stepGoal(-1)}
            onNextGoal={() => stepGoal(1)}
          />
          <GoalkeeperMap
            goals={filteredGoals}
            selectedGoal={selectedGoal}
            language={language}
            onSelectGoal={handleSelectGoal}
            focused={focusGoal}
            onShowAll={showAllGoals}
          />
          <GoalMouth
            goals={filteredGoals}
            selectedGoal={selectedGoal}
            language={language}
            onSelectGoal={handleSelectGoal}
            focused={focusGoal}
            onShowAll={showAllGoals}
          />
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
