import { formatReaction } from "@/lib/format";
import { getDisplayGoalMetrics } from "@/lib/goalMetrics";
import type { GoalRecord, Language } from "@/lib/types";

export function GoalMouth({
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
  // Calculate goalkeeper position if a goal is selected
  const goalkeeperPos = selectedGoal
    ? (() => {
        const gkY = Number(selectedGoal.goalkeeper?.y ?? 50);
        const yMin = 44.6;
        const yMax = 55.4;
        const gkLeftNormalized = Math.max(0, Math.min(100, ((gkY - yMin) / (yMax - yMin)) * 100));
        const gkCx = 20 + (gkLeftNormalized / 100) * 240;
        return {
          cx: gkCx,
          name: selectedGoal.participants.goalkeeperName,
        };
      })()
    : null;

  return (
    <section className="viz-panel flex flex-col items-center">
      <h2 className="w-full text-left">{language === "es" ? "Portería: entrada del gol" : "Goal mouth: goal entry"}</h2>
      <div className="w-full aspect-[3/2] relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4 flex items-center justify-center">
        <svg viewBox="-20 -25 320 155" className="overflow-visible w-full max-h-[90%]">
          <defs>
            <pattern id="netGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 M 0 0 L 0 8" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Netting (Back Layer) */}
          {/* Back Wall */}
          <path d="M 40 35 L 240 35 L 240 100 L 40 100 Z" fill="url(#netGrid)" />
          {/* Left Wall */}
          <path d="M 20 20 L 40 35 L 40 100 L 20 100 Z" fill="url(#netGrid)" />
          {/* Right Wall */}
          <path d="M 260 20 L 240 35 L 240 100 L 260 100 Z" fill="url(#netGrid)" />
          {/* Top Wall (Roof) */}
          <path d="M 20 20 L 260 20 L 240 35 L 40 35 Z" fill="url(#netGrid)" />

          {/* Back Structure Support Lines (Grey) */}
          <path d="M 40 100 L 40 35 L 240 35 L 240 100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Floor Support */}
          <path d="M 20 100 L 40 100" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M 260 100 L 240 100" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Goalkeeper Infographic (drawn behind front frame and dots) */}
          {goalkeeperPos && (
            <g className="goalkeeper-infographic" style={{ transition: "all 0.3s ease" }}>
              {/* Goalkeeper Name Badge */}
              <rect
                x={goalkeeperPos.cx - 45}
                y="-18"
                width="90"
                height="12"
                rx="3"
                fill="#0f172a"
                opacity="0.8"
              />
              <text
                x={goalkeeperPos.cx}
                y="-10"
                textAnchor="middle"
                fontSize="7"
                fill="#ffffff"
                fontWeight="bold"
              >
                {goalkeeperPos.name}
              </text>
              {/* Line connecting badge to head */}
              <line x1={goalkeeperPos.cx} y1="-6" x2={goalkeeperPos.cx} y2="35" stroke="#0f172a" strokeWidth="1" strokeDasharray="2 2" />

              {/* Goalkeeper silhouette image (feet on ground line at y=100) */}
              <image
                href="/goalkeeper.png"
                x={goalkeeperPos.cx - 19.4}
                y={36}
                width={38.9}
                height={64}
                preserveAspectRatio="xMidYMax meet"
              />
            </g>
          )}

          {/* Dots Layer */}
          {goals.map((goal) => {
            const yMin = 44.6;
            const yMax = 55.4;
            const yVal = Number(goal.goalMouth.y ?? 50);
            const zVal = Number(goal.goalMouth.z ?? 0);
            const selected = goal.id === selectedGoal?.id;
            const r = selected ? 3.5 : 1.75;

            // Normalize yVal from [yMin, yMax] to [0, 100]
            const leftNormalized = Math.max(0, Math.min(100, ((yVal - yMin) / (yMax - yMin)) * 100));
            
            // Map x-coordinate and clamp within the posts with margin r
            const cx = Math.max(20 + r, Math.min(260 - r, 20 + (leftNormalized / 100) * 240));

            // Map z-coordinate from [0, 33] (max in dataset is 32.9) to [100, 24] (leaving room below crossbar at 20)
            const cy = Math.max(20 + r, 100 - (zVal / 33) * 76);

            return (
              <g key={goal.id} className="cursor-pointer" onClick={() => onSelectGoal(goal.id)}>
                {/* Invisible large click target */}
                <circle cx={cx} cy={cy} r={7.0} fill="transparent" />
                {/* Visual circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  className={selected ? "mouth-point selected animate-pulse" : "mouth-point"}
                  vectorEffect="non-scaling-stroke"
                >
                  <title>{`${goal.participants.scorerName} · ${goal.match.minute}'`}</title>
                </circle>
              </g>
            );
          })}

          {/* Front Posts Layer (Top Layer) - SVG */}
          {/* Front Frame: Grey Posts */}
          <path
            d="M 20 100 L 20 20 L 260 20 L 260 100"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ground Line Ref */}
          <path d="M 10 100 L 270 100" stroke="#e2e8f0" strokeWidth="1" />
        </svg>
      </div>

      {selectedGoal ? (
        <div className="mt-2 text-xs text-gray-500 font-medium text-center">
          {language === "es" ? "Reacción estimada" : "Estimated reaction"}:{" "}
          <span className="font-bold text-gray-800">
            {formatReaction(getDisplayGoalMetrics(selectedGoal).goalkeeperReactionTimeEstimatedS)}
          </span>
        </div>
      ) : null}
    </section>
  );
}
