import { normalizeGoalPitchCoordinate, pitchPoint } from "@/lib/geometry";
import { labelFor } from "@/lib/i18n";
import type { GoalRecord, Language } from "@/lib/types";
import { GoalNavigator } from "../dashboard/GoalNavigator";
import { Pitch } from "./Pitch";
import { ShowAllButton } from "./ShowAllButton";

export function ShotMap({
  goals,
  selectedGoalId,
  language,
  onSelectGoal,
  focused = false,
  onShowAll,
  navIndex,
  navTotal,
  onPrevGoal,
  onNextGoal,
}: {
  goals: GoalRecord[];
  selectedGoalId: string;
  language: Language;
  onSelectGoal: (goalId: string) => void;
  focused?: boolean;
  onShowAll?: () => void;
  navIndex: number;
  navTotal: number;
  onPrevGoal: () => void;
  onNextGoal: () => void;
}) {
  const visibleGoals = focused ? goals.filter((goal) => goal.id === selectedGoalId) : goals;
  return (
    <Pitch
      title={language === "es" ? "Campograma de tiros de gol" : "Goal shot map"}
      action={
        <div className="viz-actions">
          {focused && onShowAll ? <ShowAllButton language={language} onClick={onShowAll} /> : null}
          <GoalNavigator
            index={navIndex}
            total={navTotal}
            language={language}
            onPrev={onPrevGoal}
            onNext={onNextGoal}
          />
        </div>
      }
    >
      {/* Trajectories Layer */}
      {visibleGoals.map((goal) => {
        const ownGoal = goal.shot.ownGoal === true;
        const shot = normalizeGoalPitchCoordinate({ x: goal.shot.x, y: goal.shot.y }, ownGoal);
        const start = pitchPoint(shot.x, shot.y);
        const end = pitchPoint(100, Number(goal.goalMouth.y ?? 50));
        const selected = goal.id === selectedGoalId;
        return (
          <line
            key={`traj-${goal.id}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={selected ? "#fb923c" : "#cbd5e1"}
            strokeWidth={selected ? 0.35 : 0.08}
            opacity={selected ? 0.95 : 0.15}
            strokeDasharray={selected ? "none" : "0.5 0.5"}
            className="transition-all duration-300 pointer-events-none"
          />
        );
      })}

      {/* Dots Layer */}
      {visibleGoals.map((goal) => {
        const shot = normalizeGoalPitchCoordinate(
          { x: goal.shot.x, y: goal.shot.y },
          goal.shot.ownGoal === true,
        );
        const point = pitchPoint(shot.x, shot.y);
        const selected = goal.id === selectedGoalId;
        return (
          <g key={goal.id} className="cursor-pointer" onClick={() => onSelectGoal(goal.id)}>
            {/* Invisible large click target */}
            <circle cx={point.x} cy={point.y} r={2.0} fill="transparent" />
            {/* Visual circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r={selected ? 1.3 : 0.8}
              className={selected ? "goal-point selected animate-pulse" : "goal-point"}
              vectorEffect="non-scaling-stroke"
            >
              <title>{`${goal.participants.scorerName} · ${goal.match.minute}' · ${labelFor(
                language,
                String(goal.tags.tacticalSituationPrimary ?? ""),
              )}`}</title>
            </circle>
          </g>
        );
      })}
    </Pitch>
  );
}
