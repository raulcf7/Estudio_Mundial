import { formatDistance, formatNumber, formatReaction, formatSpeed } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { labelFor, t } from "@/lib/i18n";
import type { GoalRecord, Language } from "@/lib/types";

export function GoalSummary({ goal, language }: { goal: GoalRecord | undefined; language: Language }) {
  if (!goal) {
    return <aside className="summary-panel">{language === "es" ? "Sin goles filtrados" : "No filtered goals"}</aside>;
  }

  const displayMetrics = getDisplayGoalMetrics(goal);

  return (
    <aside className="summary-panel">
      <h2>{t(language, "summary")}</h2>
      <p className="match-line">
        {goal.match.homeTeam} {goal.match.finalHomeGoals}-{goal.match.finalAwayGoals} {goal.match.awayTeam}
      </p>
      <dl>
        <dt>{language === "es" ? "Minuto" : "Minute"}</dt>
        <dd>{String(goal.match.minute ?? "-")}&apos;</dd>
        <dt>{language === "es" ? "Rematador" : "Scorer"}</dt>
        <dd>{goal.participants.scorerName}</dd>
        <dt>{language === "es" ? "Portero" : "Goalkeeper"}</dt>
        <dd>{goal.participants.goalkeeperName}</dd>
        <dt>{language === "es" ? "Equipo que marca" : "Scoring team"}</dt>
        <dd>{goal.participants.scoringTeam}</dd>
        <dt>{language === "es" ? "Equipo que encaja" : "Conceding team"}</dt>
        <dd>{goal.participants.concedingTeam}</dd>
        <dt>{language === "es" ? "Tipo de remate" : "Finish type"}</dt>
        <dd>
          {String(goal.shot.bodyPart ?? "-")} - {String(goal.shot.playPattern ?? "-")}
        </dd>
        <dt>{language === "es" ? "Situacion" : "Situation"}</dt>
        <dd>{labelFor(language, String(goal.tags.tacticalSituationPrimary ?? ""))}</dd>
        <dt>{language === "es" ? "Escenario VR" : "VR scenario"}</dt>
        <dd>{labelFor(language, String(goal.tags.vrScenarioFamily ?? ""))}</dd>
        <dt>xG / xGOT</dt>
        <dd>
          {formatNumber(goal.shot.xg)} / {formatNumber(goal.shot.xgot)}
        </dd>
        <dt>{language === "es" ? "Entrada porteria" : "Goal entry"}</dt>
        <dd>{labelFor(language, String(goal.goalMouth.finishCornerCategory ?? ""))}</dd>
        <dt>{language === "es" ? "Velocidad estimada" : "Estimated speed"}</dt>
        <dd>
          {formatSpeed(goal.metrics.shotSpeedEstimatedKmh)} -{" "}
          {labelFor(language, String(goal.metrics.shotSpeedCategory ?? ""))}
        </dd>
        <dt>{language === "es" ? "Tiempo de reaccion estimado" : "Estimated reaction time"}</dt>
        <dd>
          {formatReaction(displayMetrics.goalkeeperReactionTimeEstimatedS)} -{" "}
          {labelFor(language, displayMetrics.reactionTimeCategory)}
        </dd>
        <dt>{language === "es" ? "Lanzador-porteria" : "Shooter-goal distance"}</dt>
        <dd>{formatDistance(displayMetrics.shotDistanceToGoalM)}</dd>
        <dt>{language === "es" ? "Lanzador-portero" : "Shooter-goalkeeper distance"}</dt>
        <dd>{formatDistance(displayMetrics.goalkeeperDistanceToShooterM)}</dd>
        <dt>{language === "es" ? "Portero-porteria" : "Goalkeeper-goal distance"}</dt>
        <dd>{formatDistance(displayMetrics.goalkeeperDistanceToGoalLineM)}</dd>
        <dt>{language === "es" ? "Eventos secuencia" : "Sequence events"}</dt>
        <dd>{goal.sequence.events.length}</dd>
        <dt>{language === "es" ? "Fuente" : "Source"}</dt>
        <dd>{String(goal.rawRefs.sourceFile ?? "")}</dd>
      </dl>
    </aside>
  );
}
