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
import type { ThemePreference } from "@/lib/types";
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

const THEMES: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function SettingsPage() {
  const data = useAppData();
  const { settings } = data;
  const monthId = currentMonthId();
  const [goal, setGoal] = useState(String(settings.monthlyGoal));
  const [applyCurrent, setApplyCurrent] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(goal);
    if (!Number.isFinite(value) || value <= 0 || value > 200) return toast.error("Enter a goal between 1 and 200 hours.");
    saveSettings({ monthlyGoal: value });
    if (applyCurrent) saveMonth({ ...ensureMonth(monthId), goalHours: value });
    toast.success("Goal updated");
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
      toast.success("Data restored");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that file.");
    }
  };

  return (
    <>
      <PageHeader title="Settings" />
      <div className="space-y-4">
        <Card>
          <form onSubmit={saveGoal} className="space-y-4">
            <h2 className="font-semibold">Monthly goal</h2>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="goal">Default hours per month</Label>
                <Input id="goal" type="number" inputMode="decimal" min={1} max={200} step="0.5"
                  value={goal} onChange={(e) => setGoal(e.target.value)} className="h-12 text-lg" />
              </div>
              <Button type="submit" className="h-12 rounded-2xl px-6">Save</Button>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="apply" checked={applyCurrent} onCheckedChange={(v) => setApplyCurrent(v === true)} />
              <Label htmlFor="apply" className="font-normal">
                Also apply to {monthLabel(monthId)} (currently {goalHoursFor(data, monthId)}h)
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">Previous months keep the goal they had.</p>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Appearance</h2>
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2 rounded-2xl bg-muted p-1">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button key={value} role="radio" aria-checked={settings.theme === value}
                onClick={() => saveSettings({ theme: value })}
                className={cn("flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  settings.theme === value ? "bg-background shadow-soft" : "text-muted-foreground")}>
                <Icon className="size-4" aria-hidden />{label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Data</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Everything is stored only on this device. Export a backup to move to another browser or phone.
          </p>
          <div className="grid gap-2">
            <Button variant="outline" className="h-12 justify-start rounded-2xl" onClick={doExport}><Download /> Export data</Button>
            <Button variant="outline" className="h-12 justify-start rounded-2xl" onClick={() => fileRef.current?.click()}><Upload /> Import data</Button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" aria-label="Backup file"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ""; }} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-12 justify-start rounded-2xl text-destructive hover:text-destructive"><Trash2 /> Clear all data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes your goals, plans and service entries from this device. Export a backup first if you want to keep them.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={clearAllData}>
                    Clear everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {import.meta.env.DEV && (
              <Button variant="ghost" className="h-10 justify-start rounded-2xl text-muted-foreground" onClick={loadSampleData}>
                Load sample data (dev only)
              </Button>
            )}
          </div>
        </Card>
        <p className="pt-2 text-center text-xs text-muted-foreground">MyService · works offline · no account needed</p>
      </div>
    </>
  );
}
