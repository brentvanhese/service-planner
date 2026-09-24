import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, Plus } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { MonthCalendar } from "@/components/app/MonthCalendar";
import { DayDetail } from "@/components/app/DayDetail";
import { EntryForm } from "@/components/app/EntryForm";
import { EntryList } from "@/components/app/EntryList";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { computeMonthStats, entriesInMonth } from "@/lib/stats";
import { currentMonthId, monthLabel, todayISO } from "@/lib/dates";
import { formatDuration } from "@/lib/duration";
import { useEntryEditor } from "@/hooks/use-entry-editor";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan — MyService" },
      { name: "description", content: "Plan your service activities for the month on a simple calendar." },
      { property: "og:title", content: "Plan — MyService" },
      { property: "og:description", content: "Plan your service activities for the month." },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const data = useAppData();
  const id = currentMonthId();
  const [selected, setSelected] = useState(todayISO());
  const planned = entriesInMonth(data.planned, id);
  const service = entriesInMonth(data.service, id);
  const stats = computeMonthStats(data, id);
  const editor = useEntryEditor();

  return (
    <>
      <PageHeader subtitle={monthLabel(id)} title="Plan"
        action={<Button size="icon" className="size-12 rounded-2xl" aria-label="Plan service" onClick={() => editor.openNew(selected)}><Plus /></Button>} />
      <p className="mb-4 text-sm text-muted-foreground">
        <strong className="text-foreground">{formatDuration(stats.plannedMinutes)}</strong> planned this month
        {" · "}goal {formatDuration(stats.goalMinutes)}
      </p>
      <MonthCalendar monthId={id} planned={planned} service={service} selected={selected} onSelect={setSelected} />
      <div className="mt-6">
        <DayDetail date={selected} planned={planned} service={service} onEditPlanned={editor.openEdit} />
        <Button variant="outline" className="mt-3 h-11 w-full rounded-2xl" onClick={() => editor.openNew(selected)}>
          <Plus /> Plan for this day
        </Button>
      </div>
      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">All planned activities</h2>
        {planned.length ? (
          <EntryList entries={planned} variant="planned" onSelect={editor.openEdit} />
        ) : (
          <EmptyState icon={CalendarPlus} title="No service planned yet." body="Plan your first activity."
            action={{ label: "Plan service", onClick: () => editor.openNew(selected) }} />
        )}
      </section>
      <EntryForm kind="planned" {...editor.formProps} />
    </>
  );
}
