import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Trash2 } from "lucide-react";

// iOS Safari gives native date/time inputs an intrinsic min-width that overflows grid cells.
const dtInput = "h-12 w-full min-w-0 max-w-full appearance-none text-left [&::-webkit-date-and-time-value]:text-left";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ACTIVITY_TYPES, activityLabel } from "@/lib/activities";
import { todayISO } from "@/lib/dates";
import {
  deletePlannedActivity, deleteServiceEntry, restorePlannedActivity, restoreServiceEntry,
  savePlannedActivity, saveServiceEntry,
} from "@/lib/storage";
import type { ActivityType, EntryKind, PlannedActivity, ServiceEntry } from "@/lib/types";
import { t } from "@/lib/i18n";
import { DurationField } from "./DurationField";

export type EditableEntry = PlannedActivity | ServiceEntry;

interface Props {
  kind: EntryKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: EditableEntry | null;
  defaultDate?: string | undefined;
}

export function EntryForm({ kind, open, onOpenChange, entry, defaultDate }: Props) {
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState<ActivityType>("door-to-door");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(entry?.date ?? defaultDate ?? todayISO());
    setStartTime((entry && "startTime" in entry && entry.startTime) || "");
    setDuration(entry?.durationMinutes ?? 60);
    setType(entry?.activityType ?? "door-to-door");
    setNote(entry?.note ?? "");
  }, [open, entry, defaultDate]);

  const planned = kind === "planned";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || duration <= 0) return;
    const base = { id: entry?.id, date, durationMinutes: duration, activityType: type, note: note.trim() || undefined };
    if (planned) savePlannedActivity({ ...base, startTime: startTime || undefined });
    else saveServiceEntry(base);
    toast.success(entry ? t("form.saved") : planned ? t("form.planned") : t("form.added"));
    onOpenChange(false);
  };

  /** Converts the planned activity (with current form values) into a completed service entry. */
  const complete = () => {
    if (!entry || !date || duration <= 0) return;
    saveServiceEntry({ date, durationMinutes: duration, activityType: type, note: note.trim() || undefined });
    deletePlannedActivity(entry.id);
    toast.success(t("form.completed"));
    onOpenChange(false);
  };

  const remove = () => {
    if (!entry) return;
    if (planned) deletePlannedActivity(entry.id);
    else deleteServiceEntry(entry.id);
    const snapshot = entry;
    toast(planned ? t("form.deletedPlanned") : t("form.deletedService"), {
      action: {
        label: t("form.undo"),
        onClick: () => (planned ? restorePlannedActivity(snapshot as PlannedActivity) : restoreServiceEntry(snapshot)),
      },
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg">
        <form onSubmit={submit} className="overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl">
              {entry ? (planned ? t("form.editPlanned") : t("form.editService")) : planned ? t("form.plan") : t("form.add")}
            </DrawerTitle>
            <DrawerDescription>
              {planned ? t("form.planDesc") : t("form.addDesc")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-5 px-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={planned ? "min-w-0 space-y-2" : "col-span-2 min-w-0 space-y-2"}>
                <Label htmlFor="date">{t("form.date")}</Label>
                <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={dtInput} />
              </div>
              {planned && (
                <div className="min-w-0 space-y-2">
                  <Label htmlFor="start">{t("form.start")} <span className="text-muted-foreground">{t("form.optional")}</span></Label>
                  <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={dtInput} />
                </div>
              )}
            </div>
            <DurationField value={duration} onChange={setDuration} />
            <div className="space-y-2">
              <Label htmlFor="type">{t("form.activity")}</Label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value as ActivityType)}
                className="h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {ACTIVITY_TYPES.map((a) => <option key={a.value} value={a.value}>{activityLabel(a.value)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">{t("form.note")} <span className="text-muted-foreground">{t("form.optional")}</span></Label>
              <Textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
            </div>
          </div>
          <DrawerFooter className="gap-3">
            {planned && entry && (
              <Button type="button" variant="secondary" size="lg" className="h-12 w-full rounded-2xl" onClick={complete}>
                <CheckCircle2 /> {t("form.complete")}
              </Button>
            )}
            <div className="flex gap-3">
              {entry && (
                <Button type="button" variant="outline" size="lg" className="h-12 rounded-2xl" onClick={remove} aria-label={t("form.delete")}>
                  <Trash2 />
                </Button>
              )}
              <Button type="submit" size="lg" className="h-12 flex-1 rounded-2xl">
                {entry ? t("form.saveChanges") : t("form.save")}
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
