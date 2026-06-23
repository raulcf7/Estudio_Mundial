import type { Language } from "./types";

const ui = {
  es: {
    goals: "Goles",
    avgXg: "xG medio",
    avgXgot: "xGOT medio",
    shotMap: "Mapa de tiros",
    goalkeeperMap: "Posición del portero",
    goalMouth: "Portería",
    sequence: "Secuencia previa",
    summary: "Resumen del gol",
    estimated: "Estimado",
  },
  en: {
    goals: "Goals",
    avgXg: "Avg xG",
    avgXgot: "Avg xGOT",
    shotMap: "Shot map",
    goalkeeperMap: "Goalkeeper position",
    goalMouth: "Goal mouth",
    sequence: "Previous sequence",
    summary: "Goal summary",
    estimated: "Estimated",
  },
} as const;

const values: Record<string, Record<Language, string>> = {
  transition_finish: { es: "Finalización en transición", en: "Transition finish" },
  rebound_or_second_action: { es: "Rebote o segunda acción", en: "Rebound or second action" },
  medium_range_shot: { es: "Remate de media distancia", en: "Medium-range shot" },
  cross_remate_a_llegar: { es: "Centro y remate llegando", en: "Cross and arriving finish" },
  close_range_finish: { es: "Finalización cercana", en: "Close-range finish" },
  long_shot: { es: "Remate lejano", en: "Long shot" },
  own_goal: { es: "Autogol", en: "Own goal" },
  one_vs_one: { es: "Uno contra uno", en: "One vs one" },
  penalty: { es: "Penalti", en: "Penalty" },
  cutback_or_pass_back: { es: "Pase atrás o cutback", en: "Cutback or pass back" },
  set_piece_header_or_finish: { es: "Balón parado y remate", en: "Set-piece finish" },
  direct_free_kick: { es: "Tiro libre directo", en: "Direct free kick" },
  shot_reading_and_positioning: { es: "Lectura del remate y posicionamiento", en: "Shot reading and positioning" },
  second_action_response: { es: "Respuesta a segunda acción", en: "Second-action response" },
  transition_and_depth_management: { es: "Transición y gestión de profundidad", en: "Transition and depth management" },
  box_delivery_and_cutback_defending: { es: "Defensa de centro y pase atrás", en: "Box delivery and cutback defending" },
  close_reaction_and_angle_management: { es: "Reacción cercana y gestión del ángulo", en: "Close reaction and angle management" },
  set_piece_and_restart_defending: { es: "Defensa de balón parado", en: "Set-piece and restart defending" },
  manual_review: { es: "Revisión manual", en: "Manual review" },
  low_depth: { es: "Baja profundidad", en: "Low depth" },
  medium_depth: { es: "Profundidad media", en: "Medium depth" },
  high_depth: { es: "Alta profundidad", en: "High depth" },
  on_line: { es: "Sobre línea", en: "On line" },
  high_left: { es: "Alta izquierda", en: "High left" },
  high: { es: "Alta", en: "High" },
  medium: { es: "Media", en: "Medium" },
  low: { es: "Baja", en: "Low" },
  very_high: { es: "Muy alta", en: "Very high" },
  very_short: { es: "Muy corto", en: "Very short" },
  short: { es: "Corto", en: "Short" },
  long: { es: "Largo", en: "Long" },
};

export function t(language: Language, key: keyof typeof ui.es) {
  return ui[language][key];
}

export function labelFor(language: Language, value: string) {
  return values[value]?.[language] ?? value;
}
