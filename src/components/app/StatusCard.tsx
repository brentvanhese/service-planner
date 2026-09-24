import { CheckCircle2, Compass, PartyPopper, Sparkles } from "lucide-react";
import { formatDuration, } from "@/lib/duration";
import { roundTo5, type MonthStats } from "@/lib/stats";
import { Card } from "./StatCard";

export function StatusCard({ stats }: { stats: MonthStats }) {
  const { status, remainingMinutes, perWeekMinutes, perDayMinutes, daysRemaining } = stats;
  const pace =
    daysRemaining >= 7
      ? `About ${formatDuration(roundTo5(perWeekMinutes))} per week will get you there.`
      : `About ${formatDuration(roundTo5(perDayMinutes))} per day will get you there.`;

  const content = {
    reached: { icon: PartyPopper, title: "Goal reached! 🎉", body: "Wonderful work this month. Anything more is a bonus." },
    "on-track": { icon: CheckCircle2, title: "You are on track", body: `You need ${formatDuration(remainingMinutes)} more to reach your goal. ${pace}` },
    behind: { icon: Compass, title: "A little behind your pace", body: `There's still time. You need ${formatDuration(remainingMinutes)} more. ${pace}` },
    "not-started": { icon: Sparkles, title: "A fresh month", body: `Plan a few activities to get started. ${pace}` },
    past: { icon: Compass, title: "Month closed", body: "This month is complete." },
  }[status];
  const Icon = content.icon;

  return (
    <Card className={status === "reached" ? "border-primary/30 bg-accent" : undefined}>
      <div className="flex gap-4" role="status">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-semibold">{content.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{content.body}</p>
        </div>
      </div>
    </Card>
  );
}
