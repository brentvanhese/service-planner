import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ACTIVITY_TYPES } from "@/lib/activities";
import { todayISO } from "@/lib/dates";
import {
  deletePlannedActivity, deleteServiceEntry, restorePlannedActivity, restoreServiceEntry,
  savePlannedActivity, saveServiceEntry,
} from "@/lib/storage";
import type { ActivityType, EntryKind, PlannedActivity, ServiceEntry } from "@/lib/types";
import { DurationField } from "./DurationField";

export type EditableEntry = PlannedActivity | ServiceEntry;

interface Props {
  kind: EntryKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: EditableEntry | null;
  defaultDate?: string;
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
  const noun = planned ? "planned activity" : "service";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || duration <= 0) return;
    const base = { id: entry?.id, date, durationMinutes: duration, activityType: type, note: note.trim() || undefined };
    if (planned) savePlannedActivity({ ...base, startTime: startTime || undefined });
    else saveServiceEntry(base);
    toast.success(entry ? "Changes saved" : planned ? "Activity planned" : "Service added");
    onOpenChange(false);
  };

  const remove = () => {
    if (!entry) return;
    if (planned) deletePlannedActivity(entry.id);
    else deleteServiceEntry(entry.id);
    const snapshot = entry;
    toast(`Deleted ${noun}`, {
      action: {
        label: "Undo",
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
              {entry ? `Edit ${noun}` : planned ? "Plan service" : "Add service"}
            </DrawerTitle>
            <DrawerDescription>
              {planned ? "Planned time is not counted until you record it." : "Record time you've completed."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-5 px-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={planned ? "space-y-2" : "col-span-2 space-y-2"}>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="h-12" />
              </div>
              {planned && (
                <div className="space-y-2">
                  <Label htmlFor="start">Start time <span className="text-muted-foreground">(optional)</span></Label>
                  <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-12" />
                </div>
              )}
            </div>
            <DurationField value={duration} onChange={setDuration} />
            <div className="space-y-2">
              <Label htmlFor="type">Activity</Label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value as ActivityType)}
                className="h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {ACTIVITY_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
            </div>
          </div>
          <DrawerFooter className="flex-row gap-3">
            {entry && (
              <Button type="button" variant="outline" size="lg" className="h-12 rounded-2xl" onClick={remove} aria-label={`Delete ${noun}`}>
                <Trash2 />
              </Button>
            )}
            <Button type="submit" size="lg" className="h-12 flex-1 rounded-2xl">
              {entry ? "Save changes" : "Save"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
