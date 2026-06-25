import type { Language } from "@/lib/types";

/** Pill button shown on the maps while focused on a single goal. */
export function ShowAllButton({ language, onClick }: { language: Language; onClick: () => void }) {
  return (
    <button type="button" className="viz-action" onClick={onClick}>
      <span aria-hidden>↩</span>
      {language === "es" ? "Ver todos" : "Show all"}
    </button>
  );
}
