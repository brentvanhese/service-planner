import { addDays, subMonths } from "date-fns";
import { toISODate, monthIdOf } from "./dates";
import { saveMonth, savePlannedActivity, saveServiceEntry } from "./storage";
import type { ActivityType } from "./types";

/** Development helper: fills in realistic entries for this and the previous two months. */
export function loadSampleData() {
  const today = new Date();
  const types: ActivityType[] = ["door-to-door", "public", "informal", "letter", "bible-study"];
  for (let back = 2; back >= 0; back--) {
    const ref = subMonths(today, back);
    const id = monthIdOf(toISODate(ref));
    const [y, m] = id.split("-").map(Number);
    saveMonth({ id, year: y, month: m, goalHours: back === 2 ? 10 : 12 });
    const first = new Date(y, m - 1, 1);
    for (let d = 1; d < 28; d += 3 + (d % 2)) {
      const date = toISODate(addDays(first, d));
      const entry = { date, durationMinutes: 60 + (d % 3) * 30, activityType: types[d % types.length] };
      if (date <= toISODate(today)) saveServiceEntry(entry);
      if (back === 0) savePlannedActivity({ ...entry, startTime: "09:30" });
    }
  }
}
