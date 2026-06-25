import { formatDistance, formatNumber, formatReaction, formatSpeed } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { labelFor, t } from "@/lib/i18n";
import { initials, playerFace, teamCrestByName } from "@/lib/images";
import type { GoalRecord, Language } from "@/lib/types";

function Crest({ src, name, size = "md" }: { src: string | null; name: string; size?: "xs" | "md" | "lg" }) {
  const cls = `crest crest-${size}`;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={cls} src={src} alt={name} />;
  }
  return (
    <span className={`${cls} crest-fallback`} aria-hidden>
      {initials(name)}
    </span>
  );
}

function PlayerChip({
  role,
  name,
  face,
}: {
  role: string;
  name: string;
  face: string | null;
}) {
  return (
    <div className="player-chip">
      <div className="avatar">
        {face ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={face} alt={name} />
        ) : (
          <span className="avatar-fallback">{initials(name)}</span>
        )}
      </div>
      <div className="player-chip-text">
        <span className="player-chip-role">{role}</span>
        <span className="player-chip-name">{name}</span>
      </div>
    </div>
  );
}

export function GoalSummary({ goal, language }: { goal: GoalRecord | undefined; language: Language }) {
  if (!goal) {
    return <aside className="summary-panel">{language === "es" ? "Sin goles filtrados" : "No filtered goals"}</aside>;
  }

  const displayMetrics = getDisplayGoalMetrics(goal);
  const p = goal.participants;
  const homeName = String(goal.match.homeTeam ?? "");
  const awayName = String(goal.match.awayTeam ?? "");

  return (
    <aside className="summary-panel">
      <h2>{t(language, "summary")}</h2>

      <div className="match-head">
        <div className="match-team">
          <Crest src={teamCrestByName(homeName)} name={homeName} size="lg" />
          <span className="match-team-name">{homeName}</span>
        </div>
        <div className="match-score">
          {goal.match.finalHomeGoals}
          <span className="match-score-sep">-</span>
          {goal.match.finalAwayGoals}
        </div>
        <div className="match-team match-team-away">
          <span className="match-team-name">{awayName}</span>
          <Crest src={teamCrestByName(awayName)} name={awayName} size="lg" />
        </div>
      </div>

      <div className="player-cards">
        <PlayerChip
          role={language === "es" ? "Rematador" : "Scorer"}
          name={p.scorerName}
          face={playerFace(p.scorerId)}
        />
        <PlayerChip
          role={language === "es" ? "Portero" : "Goalkeeper"}
          name={p.goalkeeperName}
          face={playerFace(p.goalkeeperId)}
        />
      </div>

      <dl>
        <dt>{language === "es" ? "Minuto" : "Minute"}</dt>
        <dd>{String(goal.match.minute ?? "-")}&apos;</dd>
        <dt>{language === "es" ? "Equipo que marca" : "Scoring team"}</dt>
        <dd>{p.scoringTeam}</dd>
        <dt>{language === "es" ? "Equipo que encaja" : "Conceding team"}</dt>
        <dd>{p.concedingTeam}</dd>
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
