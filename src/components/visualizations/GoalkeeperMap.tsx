import { normalizeGoalPitchCoordinate, pitchPoint } from "@/lib/geometry";
import type { GoalRecord, Language } from "@/lib/types";
import { Pitch } from "./Pitch";

export function GoalkeeperMap({
  goals,
  selectedGoal,
  language,
  onSelectGoal,
}: {
  goals: GoalRecord[];
  selectedGoal: GoalRecord | undefined;
  language: Language;
  onSelectGoal: (goalId: string) => void;
}) {
  const selectedShotCoordinate = selectedGoal
    ? normalizeGoalPitchCoordinate({ x: selectedGoal.shot.x, y: selectedGoal.shot.y }, selectedGoal.shot.ownGoal === true)
    : null;
  const selectedShot = selectedShotCoordinate ? pitchPoint(selectedShotCoordinate.x, selectedShotCoordinate.y) : null;
  const selectedGk = selectedGoal ? pitchPoint(Number(selectedGoal.goalkeeper.x ?? 0), Number(selectedGoal.goalkeeper.y ?? 0)) : null;

  return (
    <Pitch title={language === "es" ? "Posición del portero en cada gol" : "Goalkeeper position per goal"}>
      {selectedShot && selectedGk ? (
        <line
          x1={selectedShot.x}
          y1={selectedShot.y}
          x2={selectedGk.x}
          y2={selectedGk.y}
          className="selected-link"
          vectorEffect="non-scaling-stroke"
          strokeWidth={2}
        />
      ) : null}
      {goals.map((goal) => {
        const point = pitchPoint(Number(goal.goalkeeper.x ?? 0), Number(goal.goalkeeper.y ?? 0));
        const selected = goal.id === selectedGoal?.id;
        return (
          <g key={goal.id} className="cursor-pointer" onClick={() => onSelectGoal(goal.id)}>
            {/* Invisible large click target */}
            <circle cx={point.x} cy={point.y} r={2.0} fill="transparent" />
            {/* Visual circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r={selected ? 1.3 : 0.8}
              className={selected ? "gk-point selected animate-pulse" : "gk-point"}
              vectorEffect="non-scaling-stroke"
            >
              <title>{`${goal.participants.goalkeeperName} · ${goal.participants.concedingTeam}`}</title>
            </circle>
          </g>
        );
      })}
    </Pitch>
  );
}
