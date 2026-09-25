import { formatDuration } from "@/lib/duration";
import type { MonthStats } from "@/lib/stats";
import { t } from "@/lib/i18n";
import { Card, Stat } from "./StatCard";

export function MonthSummary({ stats }: { stats: MonthStats }) {
  const diff = stats.completedMinutes - stats.plannedMinutes;
  return (
    <Card>
      <h2 className="mb-4 font-semibold">{t("sum.title")}</h2>
      <dl className="grid grid-cols-2 gap-3">
        <Stat label={t("stat.goal")} value={formatDuration(stats.goalMinutes)} />
        <Stat label={t("stat.completed")} value={formatDuration(stats.completedMinutes)} />
        <Stat label={t("stat.planned")} value={formatDuration(stats.plannedMinutes)} />
        <Stat label={t("stat.vsPlan")} value={`${diff >= 0 ? "+" : "−"}${formatDuration(Math.abs(diff))}`} />
        <Stat label={t("stat.serviceDays")} value={stats.serviceDays} />
        <Stat label={t("stat.avgDay")} value={formatDuration(stats.avgPerServiceDay)} />
      </dl>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary/10 p-4">
        <span className="text-sm font-medium">{t("sum.completion")}</span>
        <span className="text-2xl font-semibold tabular-nums text-primary">{Math.round(stats.progress * 100)}%</span>
      </div>
    </Card>
  );
}
