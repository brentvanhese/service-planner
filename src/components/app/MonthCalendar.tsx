import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { monthIdToDate, toISODate, todayISO } from "@/lib/dates";
import { formatDuration } from "@/lib/duration";
import type { MonthId, PlannedActivity, ServiceEntry } from "@/lib/types";
import { dateLocale, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  monthId: MonthId;
  planned: PlannedActivity[];
  service: ServiceEntry[];
  selected?: string;
  onSelect: (date: string) => void;
}


export function MonthCalendar({ monthId, planned, service, selected, onSelect }: Props) {
  const start = monthIdToDate(monthId);
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(start), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(start), { weekStartsOn: 1 }),
  });
  const totals = (list: { date: string; durationMinutes: number }[]) =>
    list.reduce<Record<string, number>>((acc, e) => ((acc[e.date] = (acc[e.date] ?? 0) + e.durationMinutes), acc), {});
  const done = totals(service);
  const plan = totals(planned);
  const today = todayISO();
  const weekdays = days.slice(0, 7).map((d) => format(d, "EEEEE", { locale: dateLocale() }));

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-3 shadow-soft">
      <div className="grid grid-cols-7 pb-1 text-center text-xs font-medium text-muted-foreground" aria-hidden>
        {weekdays.map((d, i) => <span key={i} className="py-2">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label={format(start, "MMMM yyyy", { locale: dateLocale() })}>
        {days.map((d) => {
          const iso = toISODate(d);
          const inMonth = isSameMonth(d, start);
          const hasDone = !!done[iso];
          const hasPlan = !!plan[iso];
          const label = [format(d, "EEEE d MMMM", { locale: dateLocale() }),
            hasDone && t("cal.completed", { d: formatDuration(done[iso]) }),
            hasPlan && t("cal.planned", { d: formatDuration(plan[iso]) })].filter(Boolean).join(", ");
          return (
            <button key={iso} type="button" disabled={!inMonth} onClick={() => onSelect(iso)}
              aria-label={label} aria-pressed={selected === iso}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !inMonth && "invisible",
                selected === iso ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                hasDone && selected !== iso && "bg-accent font-semibold",
                iso === today && selected !== iso && "ring-1 ring-primary/50",
              )}>
              {d.getDate()}
              <span className="absolute bottom-1.5 flex gap-0.5" aria-hidden>
                {hasDone && <span className={cn("size-1.5 rounded-full", selected === iso ? "bg-primary-foreground" : "bg-primary")} />}
                {hasPlan && <span className={cn("size-1.5 rounded-full border", selected === iso ? "border-primary-foreground" : "border-primary")} />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Completed</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-primary" />Planned</span>
      </div>
    </div>
  );
}
