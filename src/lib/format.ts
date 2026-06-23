import type { Language } from "./types";

export function formatNumber(value: unknown, digits = 2) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "-";
}

export function formatSpeed(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} km/h` : "-";
}

export function formatReaction(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(2)}s` : "-";
}

export function formatDistance(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} m` : "-";
}

export function formatMinute(minute: unknown, second: unknown, language: Language) {
  const suffix = language === "es" ? "min" : "min";
  if (typeof minute !== "number") return "-";
  return typeof second === "number" ? `${minute}:${String(second).padStart(2, "0")} ${suffix}` : `${minute}'`;
}
