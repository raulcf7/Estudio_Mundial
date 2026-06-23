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
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">FIFA World Cup 2026</p>
        <h1>Goalkeeper Goal Visualizer</h1>
      </div>
      <input
        className="search-input"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label={language === "es" ? "Buscar jugador, equipo o partido" : "Search player, team, or match"}
      />
      <div className="language-toggle">
        <button className={language === "es" ? "active" : ""} onClick={() => onLanguageChange("es")}>
          ES
        </button>
        <button className={language === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>
          EN
        </button>
      </div>
      <div className="kpi-strip">
        <span>
          {t(language, "goals")}: <strong>{goals.length}</strong>
        </span>
        <span>
          {t(language, "avgXg")}: <strong>{formatNumber(average(goals, (goal) => goal.shot.xg))}</strong>
        </span>
        <span>
          {t(language, "avgXgot")}: <strong>{formatNumber(average(goals, (goal) => goal.shot.xgot))}</strong>
        </span>
        <span>
          {language === "es" ? "Vel." : "Speed"}:{" "}
          <strong>{formatSpeed(average(goals, (goal) => goal.metrics.shotSpeedEstimatedKmh))}</strong>
        </span>
        <span>
          {language === "es" ? "Reaccion" : "Reaction"}:{" "}
          <strong>{formatReaction(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperReactionTimeEstimatedS))}</strong>
        </span>
        <span>
          {language === "es" ? "Lanz.-porteria" : "Shooter-goal"}:{" "}
          <strong>{formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).shotDistanceToGoalM))}</strong>
        </span>
        <span>
          {language === "es" ? "Lanz.-portero" : "Shooter-GK"}:{" "}
          <strong>{formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperDistanceToShooterM))}</strong>
        </span>
        <span>
          {language === "es" ? "Portero-porteria" : "GK-goal"}:{" "}
          <strong>{formatDistance(average(goals, (goal) => getDisplayGoalMetrics(goal).goalkeeperDistanceToGoalLineM))}</strong>
        </span>
      </div>
    </header>
  );
}
