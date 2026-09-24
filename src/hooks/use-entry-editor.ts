import { useCallback, useState } from "react";
import type { EditableEntry } from "@/components/app/EntryForm";

/** Local state for opening the add/edit entry drawer. */
export function useEntryEditor() {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState<EditableEntry | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  const openNew = useCallback((date?: string) => {
    setEntry(null);
    setDefaultDate(date);
    setOpen(true);
  }, []);
  const openEdit = useCallback((e: EditableEntry) => {
    setEntry(e);
    setOpen(true);
  }, []);

  return { openNew, openEdit, formProps: { open, onOpenChange: setOpen, entry, defaultDate } };
}
