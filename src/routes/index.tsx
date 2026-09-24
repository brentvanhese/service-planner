import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { ProgressRing } from "@/components/app/ProgressRing";
import { Stat } from "@/components/app/StatCard";
import { StatusCard } from "@/components/app/StatusCard";
import { EntryForm } from "@/components/app/EntryForm";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { computeMonthStats, roundTo5 } from "@/lib/stats";
import { currentMonthId, monthLabel } from "@/lib/dates";
import { formatDuration, formatHours } from "@/lib/duration";
import { useEntryEditor } from "@/hooks/use-entry-editor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyService — Your month at a glance" },
      { name: "description", content: "See your monthly service hours, goal progress and whether you're on track." },
      { property: "og:title", content: "MyService — Your month at a glance" },
      { property: "og:description", content: "Plan your service. Track your hours. See your progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const data = useAppData();
  const id = currentMonthId();
  const s = computeMonthStats(data, id);
  const editor = useEntryEditor();

  return (
    <>
      <PageHeader subtitle="This month" title={monthLabel(id)} />
      <section className="flex flex-col items-center rounded-3xl border border-border/60 bg-card px-5 py-8 shadow-soft">
        <ProgressRing progress={s.progress} label={`${formatHours(s.completedMinutes)} of ${formatHours(s.goalMinutes)} hours completed`}>
          <span className="text-4xl font-semibold tabular-nums tracking-tight">
            {formatHours(s.completedMinutes)}
            <span className="text-xl text-muted-foreground"> / {formatHours(s.goalMinutes)}</span>
          </span>
          <span className="text-sm text-muted-foreground">hours</span>
          <span className="mt-2 rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary tabular-nums">
            {Math.round(s.progress * 100)}%
          </span>
        </ProgressRing>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {s.remainingMinutes > 0 ? <><strong className="text-foreground">{formatDuration(s.remainingMinutes)}</strong> remaining</> : "Goal complete"}
          {" · "}{s.daysRemaining} {s.daysRemaining === 1 ? "day" : "days"} left
        </p>
        <Button className="mt-5 h-12 w-full max-w-xs rounded-2xl" onClick={() => editor.openNew()}>
          <Plus /> Add service
        </Button>
      </section>

      <div className="mt-4"><StatusCard stats={s} /></div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Completed" value={formatDuration(s.completedMinutes)} />
        <Stat label="Planned" value={formatDuration(s.plannedMinutes)} hint={`${formatDuration(s.plannedRemainingMinutes)} still ahead`} />
        <Stat label="Remaining" value={formatDuration(s.remainingMinutes)} />
        <Stat label="Days left" value={s.daysRemaining} />
        <Stat label="Per day" value={formatDuration(roundTo5(s.perDayMinutes))} hint="to reach goal" />
        <Stat label="Per week" value={formatDuration(roundTo5(s.perWeekMinutes))} hint="to reach goal" />
      </dl>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-12 rounded-2xl"><Link to="/plan">View plan</Link></Button>
        <Button asChild variant="outline" className="h-12 rounded-2xl"><Link to="/service">Service log</Link></Button>
      </div>

      <EntryForm kind="service" {...editor.formProps} />
    </>
  );
}
