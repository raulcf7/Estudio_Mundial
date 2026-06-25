import type { ReactNode } from "react";

export function Pitch({
  children,
  title,
  fullPitch = false,
  action,
}: {
  children: ReactNode;
  title: string;
  fullPitch?: boolean;
  action?: ReactNode;
}) {
  if (fullPitch) {
    return (
      <section className="viz-panel">
        <div className="viz-head">
          <h2>{title}</h2>
          {action}
        </div>
        <div className="w-full aspect-[1000/680] relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <svg viewBox="0 0 1000 680" role="img" aria-label={title} className="pitch-svg absolute inset-0 w-full h-full">
            {/* Outer boundary */}
            <rect x="32" y="32" width="936" height="616" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            {/* Halfway line */}
            <line x1="500" y1="32" x2="500" y2="648" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            {/* Center circle */}
            <circle cx="500" cy="340" r="72" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            <circle cx="500" cy="340" r="2.5" fill="#cbd5e1" />
            
            {/* Left Penalty Area */}
            <rect x="32" y="190" width="150" height="300" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            <rect x="32" y="265" width="54" height="150" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            <circle cx="142" cy="340" r="2.5" fill="#cbd5e1" />
            <path d="M 182 280 A 72 72 0 0 1 182 400" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            
            {/* Right Penalty Area */}
            <rect x="818" y="190" width="150" height="300" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            <rect x="914" y="265" width="54" height="150" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />
            <circle cx="858" cy="340" r="2.5" fill="#cbd5e1" />
            <path d="M 818 280 A 72 72 0 0 0 818 400" fill="none" className="pitch-line" style={{ strokeWidth: 1.5 }} />

            {/* Goal Mouths */}
            <line x1="32" y1="306" x2="32" y2="374" className="pitch-line" style={{ strokeWidth: 2.5, stroke: "#94a3b8" }} />
            <line x1="968" y1="306" x2="968" y2="374" className="pitch-line" style={{ strokeWidth: 2.5, stroke: "#94a3b8" }} />
            
            {children}
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section className="viz-panel">
      <div className="viz-head">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="w-full aspect-[3/2] relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <svg viewBox="0 7.5 68 45" role="img" aria-label={title} className="pitch-svg absolute inset-0 w-full h-full">
          {/* Pitch Outline / Halfway Line (at Y=0, above the viewBox start 7.5, so hidden/cropped unless we draw something) */}
          <path d="M 0 0 L 68 0" fill="none" className="pitch-line" />
          <circle cx="34" cy="0" r="9.15" fill="none" className="pitch-line" />
          <circle cx="34" cy="0" r="0.4" fill="#cbd5e1" />

          {/* Penalty Box (16.5m deep, 40.3m wide) */}
          {/* Top Y: 52.5 - 16.5 = 36 */}
          {/* X: 13.85 to 54.15 */}
          <path d="M 13.85 52.5 L 13.85 36 L 54.15 36 L 54.15 52.5" fill="none" className="pitch-line" />

          {/* Goal Box (5.5m deep, 18.32m wide) */}
          {/* Top Y: 52.5 - 5.5 = 47 */}
          {/* X: 24.84 to 43.16 */}
          <path d="M 24.84 52.5 L 24.84 47 L 43.16 47 L 43.16 52.5" fill="none" className="pitch-line" />

          {/* Penalty Spot (11m from goal) */}
          {/* Y: 52.5 - 11 = 41.5 */}
          <circle cx="34" cy="41.5" r="0.4" fill="#cbd5e1" />

          {/* Penalty Arc (Radius 9.15m from spot, clipped) */}
          {/* Intersection with box line (y=36). dy = 5.5. dx = sqrt(9.15^2 - 5.5^2) = 7.31 */}
          {/* Start X: 34 - 7.31 = 26.69. End X: 34 + 7.31 = 41.31 */}
          <path d="M 26.69 36 A 9.15 9.15 0 0 1 41.31 36" fill="none" className="pitch-line" />

          {/* Goal Mouth (7.32m wide) */}
          {/* X: 30.34 to 37.66 */}
          <path d="M 30.34 52.5 L 37.66 52.5" className="pitch-line" style={{ strokeWidth: 1 }} />
          
          {children}
        </svg>
      </div>
    </section>
  );
}
