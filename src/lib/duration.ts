import { getLanguage } from "./i18n";

/** Format minutes as "1h 30m", "45m", "2h" (Dutch uses "u"). */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const r = m % 60;
  const H = getLanguage() === "nl" ? "u" : "h";
  if (h === 0) return `${r}m`;
  if (r === 0) return `${h}${H}`;
  return `${h}${H} ${r}m`;
}

/** Format minutes as decimal hours, e.g. "8.5". */
export function formatHours(minutes: number): string {
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h}` : h.toFixed(1);
}

/** Parse "1h 30m", "90m", "1.5", "2 hours", "30 minutes" into minutes. */
export function parseDuration(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  const hm = s.match(/^(?:(\d+(?:[.,]\d+)?)\s*(?:h(?:ours?|rs?)?|u(?:ur)?))?\s*(?:(\d+)\s*m(?:in(?:uten|utes?)?)?)?$/);
  if (hm && (hm[1] || hm[2])) {
    const h = hm[1] ? parseFloat(hm[1].replace(",", ".")) : 0;
    const m = hm[2] ? parseInt(hm[2], 10) : 0;
    return Math.round(h * 60 + m);
  }
  const num = s.match(/^(\d+(?:[.,]\d+)?)$/);
  if (num) return Math.round(parseFloat(num[1].replace(",", ".")) * 60);
  return null;
}
