import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { EntryForm } from "@/components/app/EntryForm";
import { EntryList } from "@/components/app/EntryList";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { entriesInMonth } from "@/lib/stats";
import { currentMonthId, monthLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/duration";
import { t } from "@/lib/i18n";
import { useEntryEditor } from "@/hooks/use-entry-editor";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Service log — MyService" },
      { name: "description", content: "Quickly record completed service and review this month's entries." },
      { property: "og:title", content: "Service log — MyService" },
      { property: "og:description", content: "Record completed service in seconds." },
    ],
  }),
  component: ServicePage,
});

function ServicePage() {
  const data = useAppData();
  const id = currentMonthId();
  const entries = entriesInMonth(data.service, id);
  const total = entries.reduce((a, e) => a + e.durationMinutes, 0);
  const editor = useEntryEditor();

  return (
    <>
      <PageHeader subtitle={monthLabel(id)} title={t("svc.title")} />
      <Button size="lg" className="h-14 w-full rounded-2xl text-base shadow-soft" onClick={() => editor.openNew()}>
        <Plus /> {t("form.add")}
      </Button>
      <section className="mt-8 space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">{t("svc.thisMonth")}</h2>
          <span className="text-sm text-muted-foreground tabular-nums">{t("svc.total", { d: formatDuration(total) })}</span>
        </div>
        {entries.length ? (
          <EntryList entries={entries} onSelect={editor.openEdit} />
        ) : (
          <EmptyState icon={ClipboardList} title={t("svc.empty")} body={t("svc.emptyBody")}
            action={{ label: t("form.add"), onClick: () => editor.openNew() }} />
        )}
      </section>
      <EntryForm kind="service" {...editor.formProps} />
    </>
  );
}
