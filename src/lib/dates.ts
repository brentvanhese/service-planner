import { format, parseISO } from "date-fns";
import type { ISODate, MonthId } from "./types";

export const toISODate = (d: Date): ISODate => format(d, "yyyy-MM-dd");
export const todayISO = (): ISODate => toISODate(new Date());
export const monthIdOf = (date: ISODate): MonthId => date.slice(0, 7);
export const currentMonthId = (): MonthId => monthIdOf(todayISO());

export function monthIdToDate(id: MonthId): Date {
  return parseISO(`${id}-01`);
}

export function monthLabel(id: MonthId): string {
  return format(monthIdToDate(id), "MMMM yyyy");
}

export function dayLabel(date: ISODate): string {
  return format(parseISO(date), "EEE d MMM");
}
