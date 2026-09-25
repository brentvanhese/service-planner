import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, History } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/EmptyState";
import { useAppData } from "@/lib/store";
import { computeMonthStats, knownMonthIds } from "@/lib/stats";
import { currentMonthId, monthLabel } from "@/lib/dates";
import { t } from "@/lib/i18n";
import { formatDuration } from "@/lib/duration";

export const Route = createFileRoute("/history/")({
  head: () => ({
    meta: [
      { title: "History — MyService" },
      { name: "description", content: "Review your previous months of service and goal completion." },
      { property: "og:title", content: "History — MyService" },
      { property: "og:description", content: "Review previous months of service." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const data = useAppData();
  const current = currentMonthId();
  const ids = knownMonthIds(data).filter((id) => id <= current);

  return (
    <>
      <PageHeader title={t("hist.title")} />
      {ids.length === 0 ? (
        <EmptyState icon={History} title={t("hist.empty")} body={t("hist.emptyBody")} />
      ) : (
        <ul className="space-y-3">
          {ids.map((id) => {
            const s = computeMonthStats(data, id);
            const pct = Math.round(s.progress * 100);
            return (
              <li key={id}>
                <Link to="/history/$monthId" params={{ monthId: id }}
                  className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{monthLabel(id)}{id === current && <span className="ml-2 text-xs font-medium text-primary">{t("hist.current")}</span>}</p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {formatDuration(s.completedMinutes)} / {formatDuration(s.goalMinutes)}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                  <span className="text-xl font-semibold tabular-nums">{pct}%</span>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
