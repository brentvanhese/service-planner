import { ChevronRight, Clock } from "lucide-react";
import { activityLabel } from "@/lib/activities";
import { dayLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/duration";
import type { EditableEntry } from "./EntryForm";

interface Props {
  entries: EditableEntry[];
  onSelect?: ((e: EditableEntry) => void) | undefined;
  showDate?: boolean;
  variant?: "planned" | "service";
}

export function EntryList({ entries, onSelect, showDate = true, variant = "service" }: Props) {
  const sorted = [...entries].sort((a, b) =>
    b.date.localeCompare(a.date) || ("startTime" in a && "startTime" in b ? (a.startTime ?? "").localeCompare(b.startTime ?? "") : 0),
  );
  return (
    <ul className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
      {sorted.map((e) => (
        <li key={e.id}>
          <button type="button" onClick={() => onSelect?.(e)} disabled={!onSelect}
            className="flex min-h-16 w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted focus-visible:outline-none disabled:cursor-default">
            <span className={variant === "planned"
              ? "size-2.5 shrink-0 rounded-full border-2 border-primary"
              : "size-2.5 shrink-0 rounded-full bg-primary"} aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{activityLabel(e.activityType)}</span>
              <span className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                {showDate && dayLabel(e.date)}
                {"startTime" in e && e.startTime && <><Clock className="size-3" aria-hidden />{e.startTime}</>}
                {e.note && <span className="truncate">· {e.note}</span>}
              </span>
            </span>
            <span className="font-semibold tabular-nums">{formatDuration(e.durationMinutes)}</span>
            {onSelect && <ChevronRight className="size-4 text-muted-foreground" aria-hidden />}
          </button>
        </li>
      ))}
    </ul>
  );
}
