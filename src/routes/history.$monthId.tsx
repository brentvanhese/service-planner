import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { MonthSummary } from "@/components/app/MonthSummary";
import { MonthCalendar } from "@/components/app/MonthCalendar";
import { DayDetail } from "@/components/app/DayDetail";
import { useAppData } from "@/lib/store";
import { computeMonthStats, entriesInMonth } from "@/lib/stats";
import { t } from "@/lib/i18n";
import { monthLabel } from "@/lib/dates";

export const Route = createFileRoute("/history/$monthId")({
  head: () => ({
    meta: [
      { title: "Month summary — MyService" },
      { name: "description", content: "Detailed summary of a month of service: goal, completed and planned hours." },
      { property: "og:title", content: "Month summary — MyService" },
      { property: "og:description", content: "Detailed monthly service summary." },
    ],
  }),
  component: MonthDetail,
});

function MonthDetail() {
  const { monthId } = Route.useParams();
  const data = useAppData();
  const [selected, setSelected] = useState<string>();
  const valid = /^\d{4}-\d{2}$/.test(monthId);

  if (!valid) return <p className="text-muted-foreground">{t("hist.unknown")}</p>;
  const stats = computeMonthStats(data, monthId);

  return (
    <>
      <Link to="/history" className="-ml-2 mb-2 inline-flex h-10 items-center gap-1 rounded-xl px-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> {t("hist.title")}
      </Link>
      <PageHeader title={monthLabel(monthId)} />
      <MonthSummary stats={stats} />
      <div className="mt-6">
        <MonthCalendar monthId={monthId} planned={entriesInMonth(data.planned, monthId)}
          service={entriesInMonth(data.service, monthId)} selected={selected} onSelect={setSelected} />
      </div>
      {selected && (
        <div className="mt-6">
          <DayDetail date={selected} planned={data.planned} service={data.service} />
        </div>
      )}
    </>
  );
}
