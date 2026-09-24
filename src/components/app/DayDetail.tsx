import { dayLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/duration";
import type { PlannedActivity, ServiceEntry } from "@/lib/types";
import { EntryList } from "./EntryList";
import type { EditableEntry } from "./EntryForm";

interface Props {
  date: string;
  planned: PlannedActivity[];
  service: ServiceEntry[];
  onEditPlanned?: (e: EditableEntry) => void;
  onEditService?: (e: EditableEntry) => void;
}

export function DayDetail({ date, planned, service, onEditPlanned, onEditService }: Props) {
  const p = planned.filter((e) => e.date === date);
  const s = service.filter((e) => e.date === date);
  const total = (xs: { durationMinutes: number }[]) => formatDuration(xs.reduce((a, x) => a + x.durationMinutes, 0));
  return (
    <section aria-live="polite" className="space-y-4">
      <h2 className="text-lg font-semibold">{dayLabel(date)}</h2>
      {p.length === 0 && s.length === 0 && <p className="text-sm text-muted-foreground">Nothing planned or recorded for this day.</p>}
      {s.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Completed · {total(s)}</h3>
          <EntryList entries={s} showDate={false} onSelect={onEditService} />
        </div>
      )}
      {p.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Planned · {total(p)}</h3>
          <EntryList entries={p} showDate={false} variant="planned" onSelect={onEditPlanned} />
        </div>
      )}
    </section>
  );
}
