import { fullPitchPoint, normalizeGoalPitchCoordinate } from "@/lib/geometry";
import type { GoalRecord, Language, SequenceEvent } from "@/lib/types";
import { Pitch } from "./Pitch";

export function SequenceMap({
  goal,
  language,
  highlightedEventId,
  onHighlightEvent,
}: {
  goal: GoalRecord | undefined;
  language: Language;
  highlightedEventId: number | null;
  onHighlightEvent: (eventId: number | null) => void;
}) {
  const events = goal?.sequence.events ?? [];
  const ownGoal = goal?.shot.ownGoal === true;

  return (
    <Pitch title={language === "es" ? "Secuencia previa del gol" : "Pre-goal sequence"} fullPitch={true}>
      {goal?.sequence.isFallback ? (
        <text x="45" y="70" fontSize="13" className="sequence-note font-semibold" fill="#ef4444">
          {language === "es" ? "Secuencia incompleta: se muestra el evento disponible." : "Incomplete sequence: showing available event."}
        </text>
      ) : null}
      {events.slice(1).map((event, index) => {
        const previous = events[index];
        return <SequenceArrow key={`${previous.eventId}-${event.eventId}-${index}`} from={previous} to={event} ownGoal={ownGoal} />;
      })}
      {events.map((event, index) => {
        const coordinate = normalizeGoalPitchCoordinate({ x: event.x, y: event.y }, ownGoal);
        const point = fullPitchPoint(coordinate.x, coordinate.y);
        const highlighted = event.eventId === highlightedEventId;
        return (
          <circle
            key={`${event.eventId}-${event.type}-${index}`}
            cx={point.x}
            cy={point.y}
            r={event.isGoal ? 12 : highlighted ? 9 : 6}
            className={event.isGoal ? "sequence-goal selected animate-pulse" : highlighted ? "sequence-node highlighted" : "sequence-node"}
            style={{ cursor: "pointer", strokeWidth: highlighted ? 3 : 1.5 }}
            onClick={() => onHighlightEvent(event.eventId)}
          >
            <title>{`${event.type} · ${event.playerName}`}</title>
          </circle>
        );
      })}
    </Pitch>
  );
}

function SequenceArrow({ from, to, ownGoal }: { from: SequenceEvent; to: SequenceEvent; ownGoal: boolean }) {
  const fromCoordinate = normalizeGoalPitchCoordinate({ x: from.x, y: from.y }, ownGoal);
  const toCoordinate = normalizeGoalPitchCoordinate({ x: to.x, y: to.y }, ownGoal);
  const start = fullPitchPoint(fromCoordinate.x, fromCoordinate.y);
  const end = fullPitchPoint(toCoordinate.x, toCoordinate.y);
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      className="sequence-arrow"
      vectorEffect="non-scaling-stroke"
      strokeWidth={2.5}
    />
  );
}
