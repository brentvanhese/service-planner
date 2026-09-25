import { CheckCircle2, Compass, PartyPopper, Sparkles } from "lucide-react";
import { formatDuration, } from "@/lib/duration";
import { roundTo5, type MonthStats } from "@/lib/stats";
import { t } from "@/lib/i18n";
import { Card } from "./StatCard";

export function StatusCard({ stats }: { stats: MonthStats }) {
  const { status, remainingMinutes, perWeekMinutes, perDayMinutes, daysRemaining } = stats;
  const pace =
    daysRemaining >= 7
      ? t("status.paceWeek", { d: formatDuration(roundTo5(perWeekMinutes)) })
      : t("status.paceDay", { d: formatDuration(roundTo5(perDayMinutes)) });

  const content = {
    reached: { icon: PartyPopper, title: t("status.reached.t"), body: t("status.reached.b") },
    "on-track": { icon: CheckCircle2, title: t("status.ontrack.t"), body: t("status.ontrack.b", { d: formatDuration(remainingMinutes), pace }) },
    behind: { icon: Compass, title: t("status.behind.t"), body: t("status.behind.b", { d: formatDuration(remainingMinutes), pace }) },
    "not-started": { icon: Sparkles, title: t("status.fresh.t"), body: t("status.fresh.b", { pace }) },
    past: { icon: Compass, title: t("status.past.t"), body: t("status.past.b") },
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
