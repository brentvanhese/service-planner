import { endOfMonth, getDaysInMonth, parseISO } from "date-fns";
import { monthIdToDate, todayISO } from "./dates";
import type { AppData, MonthId, PlannedActivity, ServiceEntry } from "./types";

export type MonthStatus = "reached" | "on-track" | "behind" | "not-started" | "past";

export interface MonthStats {
  monthId: MonthId;
  goalMinutes: number;
  completedMinutes: number;
  plannedMinutes: number;
  plannedRemainingMinutes: number;
  remainingMinutes: number;
  progress: number; // 0..n (1 = 100%)
  daysRemaining: number; // including today, 0 for past months
  perDayMinutes: number;
  perWeekMinutes: number;
  serviceDays: number;
  avgPerServiceDay: number;
  status: MonthStatus;
  isCurrent: boolean;
  isPast: boolean;
}

const sum = (xs: { durationMinutes: number }[]) => xs.reduce((a, x) => a + x.durationMinutes, 0);

export function goalHoursFor(data: AppData, id: MonthId): number {
  return data.months[id]?.goalHours ?? data.settings.monthlyGoal;
}

export function entriesInMonth<T extends PlannedActivity | ServiceEntry>(list: T[], id: MonthId): T[] {
  return list.filter((e) => e.date.startsWith(id));
}

export function computeMonthStats(data: AppData, id: MonthId, today = todayISO()): MonthStats {
  const service = entriesInMonth(data.service, id);
  const planned = entriesInMonth(data.planned, id);
  const goalMinutes = goalHoursFor(data, id) * 60;
  const completedMinutes = sum(service);
  const plannedMinutes = sum(planned);
  const plannedRemainingMinutes = sum(planned.filter((p) => p.date >= today));
  const remainingMinutes = Math.max(0, goalMinutes - completedMinutes);

  const start = monthIdToDate(id);
  const totalDays = getDaysInMonth(start);
  const todayMonth = today.slice(0, 7);
  const isCurrent = todayMonth === id;
  const isPast = todayMonth > id;
  const dayOfMonth = parseISO(today).getDate();
  const daysRemaining = isCurrent
    ? endOfMonth(start).getDate() - dayOfMonth + 1
    : isPast
      ? 0
      : totalDays;

  const perDayMinutes = daysRemaining > 0 ? remainingMinutes / daysRemaining : 0;
  const perWeekMinutes = perDayMinutes * 7;
  const serviceDays = new Set(service.map((s) => s.date)).size;

  let status: MonthStatus;
  if (goalMinutes > 0 && completedMinutes >= goalMinutes) status = "reached";
  else if (isPast) status = "past";
  else if (completedMinutes === 0 && plannedMinutes === 0) status = "not-started";
  else {
    const elapsed = isCurrent ? (dayOfMonth - 1) / totalDays : 0;
    const expected = goalMinutes * elapsed;
    const coveredByPlan = completedMinutes + plannedRemainingMinutes >= goalMinutes;
    status = completedMinutes >= expected * 0.9 || coveredByPlan ? "on-track" : "behind";
  }

  return {
    monthId: id,
    goalMinutes,
    completedMinutes,
    plannedMinutes,
    plannedRemainingMinutes,
    remainingMinutes,
    progress: goalMinutes > 0 ? completedMinutes / goalMinutes : 0,
    daysRemaining,
    perDayMinutes,
    perWeekMinutes,
    serviceDays,
    avgPerServiceDay: serviceDays ? completedMinutes / serviceDays : 0,
    status,
    isCurrent,
    isPast,
  };
}

/** All months that have data, newest first. */
export function knownMonthIds(data: AppData): MonthId[] {
  const ids = new Set<MonthId>(Object.keys(data.months));
  [...data.service, ...data.planned].forEach((e) => ids.add(e.date.slice(0, 7)));
  return [...ids].sort().reverse();
}

/** Round minutes to nearest 5 for friendly guidance. */
export const roundTo5 = (m: number) => Math.ceil(m / 5) * 5;
