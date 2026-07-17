import { formatDistance, formatNumber, formatReaction, formatSpeed } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import { labelFor, t } from "@/lib/i18n";
import { initials, playerFace, teamCrestByName } from "@/lib/images";
import type { CSSProperties } from "react";
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

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scoreFromRange(value: unknown, min: number, max: number, inverted = false) {
  const number = finiteNumber(value);
  if (number === null) return null;
  const score = ((number - min) / (max - min)) * 100;
  return Math.round(clamp(inverted ? 100 - score : score, 0, 100));
}

function scoreFromProbability(value: unknown) {
  const number = finiteNumber(value);
  return number === null ? null : Math.round(clamp(number * 100, 0, 100));
}

function metricTone(score: number | null) {
  if (score === null) return { hue: 42, color: "#5b6b62" };
  const hue = Math.round((clamp(score, 0, 100) / 100) * 128);
  return {
    hue,
    color: `hsl(${hue} 72% 31%)`,
  };
}

function MetricLadder({
  value,
  score,
  detail,
}: {
  value: string;
  score: number | null;
  detail?: string;
}) {
  const tone = metricTone(score);
  const width = `${score ?? 0}%`;
  const style = {
    "--metric-hue": tone.hue,
    "--metric-color": tone.color,
    "--metric-score": width,
    display: "grid",
    gap: 5,
    width: "100%",
    minWidth: 0,
    padding: 8,
    border: `1px solid ${tone.color}`,
    borderRadius: 10,
    background: `linear-gradient(90deg, hsl(${tone.hue} 72% 92% / 0.9), #fff 78%)`,
    boxShadow: `inset 3px 0 0 ${tone.color}, 0 1px 2px rgba(3, 15, 9, 0.06)`,
  } as CSSProperties;

  return (
    <span className={`metric-ladder${score === null ? " metric-ladder-empty" : ""}`} style={style}>
      <span
        className="metric-ladder-top"
        style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, minWidth: 0 }}
      >
        <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</strong>
        <span
          style={{
            flex: "none",
            minWidth: 30,
            borderRadius: 999,
            padding: "2px 7px",
            background: tone.color,
            color: "#fff",
            fontSize: 11,
            fontWeight: 900,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {score === null ? "--" : score}
        </span>
      </span>
      <span
        className="metric-ladder-track"
        aria-hidden
        style={{
          display: "block",
          height: 7,
          overflow: "hidden",
          borderRadius: 999,
          background: "linear-gradient(90deg, #d93025 0%, #f59e0b 45%, #f7e25f 62%, #4caf50 82%, #11843b 100%)",
        }}
      >
        <span
          style={{
            display: "block",
            width,
            height: "100%",
            borderRadius: "inherit",
            background: tone.color,
          }}
        />
      </span>
      {detail ? (
        <span
          className="metric-ladder-detail"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#5b6b62",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {detail}
        </span>
      ) : null}
    </span>
  );
}

export function GoalSummary({ goal, language }: { goal: GoalRecord | undefined; language: Language }) {
  if (!goal) {
    return <aside className="summary-panel">{language === "es" ? "Sin tiros filtrados" : "No filtered shots"}</aside>;
  }

  const displayMetrics = getDisplayGoalMetrics(goal);
  const p = goal.participants;
  const homeName = String(goal.match.homeTeam ?? "");
  const awayName = String(goal.match.awayTeam ?? "");
  const isGoal = goal.shot.isGoal === true;
  const xgScore = scoreFromProbability(goal.shot.xg);
  const xgotScore = scoreFromProbability(goal.shot.xgot);
  const speedScore = scoreFromRange(goal.metrics.shotSpeedEstimatedKmh, 50, 110);
  const reactionScore = scoreFromRange(displayMetrics.goalkeeperReactionTimeEstimatedS, 0.25, 1.2, true);

  return (
    <aside className="summary-panel">
      <h2>
        {isGoal
          ? t(language, "summary")
          : language === "es"
            ? "Resumen del tiro"
            : "Shot summary"}
      </h2>

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
        <dd className="metric-pair" style={{ display: "grid", gap: 7 }}>
          <MetricLadder value={`xG ${formatNumber(goal.shot.xg)}`} score={xgScore} />
          <MetricLadder value={`xGOT ${formatNumber(goal.shot.xgot)}`} score={xgotScore} />
        </dd>
        <dt>{language === "es" ? "Entrada porteria" : "Goal entry"}</dt>
        <dd>{labelFor(language, String(goal.goalMouth.finishCornerCategory ?? ""))}</dd>
        <dt>{language === "es" ? "Velocidad estimada" : "Estimated speed"}</dt>
        <dd>
          <MetricLadder
            value={formatSpeed(goal.metrics.shotSpeedEstimatedKmh)}
            score={speedScore}
            detail={labelFor(language, String(goal.metrics.shotSpeedCategory ?? ""))}
          />
        </dd>
        <dt>{language === "es" ? "Tiempo de reaccion estimado" : "Estimated reaction time"}</dt>
        <dd>
          <MetricLadder
            value={formatReaction(displayMetrics.goalkeeperReactionTimeEstimatedS)}
            score={reactionScore}
            detail={labelFor(language, displayMetrics.reactionTimeCategory)}
          />
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
