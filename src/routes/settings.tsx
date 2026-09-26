import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Monitor, Moon, Sun, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/app/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppData } from "@/lib/store";
import { clearAllData, ensureMonth, exportBackup, importBackup, saveMonth, saveSettings } from "@/lib/storage";
import { currentMonthId, monthLabel } from "@/lib/dates";
import { goalHoursFor } from "@/lib/stats";
import { loadSampleData } from "@/lib/sample-data";
import type { Language, ThemePreference } from "@/lib/types";
import { LANGUAGES, t, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MyService" },
      { name: "description", content: "Set your monthly goal, theme, and back up or restore your data." },
      { property: "og:title", content: "Settings — MyService" },
      { property: "og:description", content: "Goals, preferences and data backup." },
    ],
  }),
  component: SettingsPage,
});

const THEMES: { value: ThemePreference; label: "set.light" | "set.dark" | "set.system"; icon: typeof Sun }[] = [
  { value: "light", label: "set.light", icon: Sun },
  { value: "dark", label: "set.dark", icon: Moon },
  { value: "system", label: "set.system", icon: Monitor },
];

function SettingsPage() {
  const data = useAppData();
  const { settings } = data;
  const lang = useLanguage();
  const monthId = currentMonthId();
  const [goal, setGoal] = useState(String(settings.monthlyGoal));
  const [applyCurrent, setApplyCurrent] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(goal);
    if (!Number.isFinite(value) || value <= 0 || value > 200) { toast.error(t("set.goalError")); return; }
    saveSettings({ monthlyGoal: value });
    if (applyCurrent) saveMonth({ ...ensureMonth(monthId), goalHours: value });
    toast.success(t("set.goalSaved"));
  };

  const doExport = () => {
    const blob = new Blob([JSON.stringify(exportBackup(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `myservice-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file: File) => {
    try {
      importBackup(JSON.parse(await file.text()));
      toast.success(t("set.restored"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("set.readError"));
    }
  };

  return (
    <>
      <PageHeader title={t("set.title")} />
      <div className="space-y-4">
        <Card>
          <form onSubmit={saveGoal} className="space-y-4">
            <h2 className="font-semibold">{t("set.goal")}</h2>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="goal">{t("set.goalLabel")}</Label>
                <Input id="goal" type="number" inputMode="decimal" min={1} max={200} step="0.5"
                  value={goal} onChange={(e) => setGoal(e.target.value)} className="h-12 text-lg" />
              </div>
              <Button type="submit" className="h-12 rounded-2xl px-6">{t("set.save")}</Button>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="apply" checked={applyCurrent} onCheckedChange={(v) => setApplyCurrent(v === true)} />
              <Label htmlFor="apply" className="font-normal">
                {t("set.apply", { m: monthLabel(monthId), h: goalHoursFor(data, monthId) })}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">{t("set.prevKeep")}</p>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">{t("set.appearance")}</h2>
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2 rounded-2xl bg-muted p-1">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button key={value} role="radio" aria-checked={settings.theme === value}
                onClick={() => saveSettings({ theme: value })}
                className={cn("flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  settings.theme === value ? "bg-background shadow-soft" : "text-muted-foreground")}>
                <Icon className="size-4" aria-hidden />{t(label)}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">{t("set.language")}</h2>
          <div role="radiogroup" aria-label={t("set.language")} className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
            {LANGUAGES.map(({ value, label }) => (
              <button key={value} role="radio" aria-checked={lang === value} lang={value}
                onClick={() => saveSettings({ language: value as Language })}
                className={cn("flex h-11 items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  lang === value ? "bg-background shadow-soft" : "text-muted-foreground")}>
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">{t("set.data")}</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            {t("set.dataBody")}
          </p>
          <div className="grid gap-2">
            <Button variant="outline" className="h-12 justify-start rounded-2xl" onClick={doExport}><Download /> {t("set.export")}</Button>
            <Button variant="outline" className="h-12 justify-start rounded-2xl" onClick={() => fileRef.current?.click()}><Upload /> {t("set.import")}</Button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" aria-label="Backup file"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ""; }} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-12 justify-start rounded-2xl text-destructive hover:text-destructive"><Trash2 /> {t("set.clear")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("set.clearTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("set.clearBody")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("set.cancel")}</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={clearAllData}>
                    {t("set.clearAll")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {import.meta.env.DEV && (
              <Button variant="ghost" className="h-10 justify-start rounded-2xl text-muted-foreground" onClick={loadSampleData}>
                {t("set.sample")}
              </Button>
            )}
          </div>
        </Card>
        <p className="pt-2 text-center text-xs text-muted-foreground">{t("set.footer")}</p>
      </div>
    </>
  );
}
