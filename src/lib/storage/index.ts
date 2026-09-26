import type {
  AppData,
  BackupFile,
  Month,
  MonthId,
  PlannedActivity,
  ServiceEntry,
  UserSettings,
} from "../types";
import { t } from "../i18n";
import { KEYS, newId, notify, readJSON, removeAll, writeJSON } from "./local";

export { subscribe } from "./local";

export const DEFAULT_SETTINGS: UserSettings = {
  monthlyGoal: 10,
  theme: "system",
  onboardingCompleted: false,
};

/* ---------- Settings ---------- */
export const getSettings = (): UserSettings => ({
  ...DEFAULT_SETTINGS,
  ...readJSON<Partial<UserSettings>>(KEYS.settings, {}),
});
export const saveSettings = (patch: Partial<UserSettings>): void =>
  writeJSON(KEYS.settings, { ...getSettings(), ...patch });

/* ---------- Months ---------- */
export const getMonths = (): Record<MonthId, Month> => readJSON(KEYS.months, {});
export const getMonth = (id: MonthId): Month | undefined => getMonths()[id];
export const saveMonth = (month: Month): void =>
  writeJSON(KEYS.months, { ...getMonths(), [month.id]: month });

/** Create the month record (snapshotting the current default goal) if missing. */
export function ensureMonth(id: MonthId): Month {
  const existing = getMonth(id);
  if (existing) return existing;
  const [y = 0, m = 1] = id.split("-").map(Number);
  const month: Month = { id, year: y, month: m, goalHours: getSettings().monthlyGoal };
  saveMonth(month);
  return month;
}

/* ---------- Entries (shared helpers) ---------- */
type EntryInput<T> = Omit<T, "id" | "createdAt" | "updatedAt"> & { id?: string };

function upsert<T extends { id: string; date: string; createdAt: string; updatedAt: string }>(
  key: string,
  input: EntryInput<T>,
): T {
  const list = readJSON<T[]>(key, []);
  const now = new Date().toISOString();
  const existing = input.id ? list.find((e) => e.id === input.id) : undefined;
  const entry = {
    ...input,
    id: existing?.id ?? input.id ?? newId(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  } as T;
  ensureMonth(entry.date.slice(0, 7));
  const next = existing ? list.map((e) => (e.id === entry.id ? entry : e)) : [...list, entry];
  writeJSON(key, next);
  return entry;
}

function remove(key: string, id: string): void {
  writeJSON(
    key,
    readJSON<{ id: string }[]>(key, []).filter((e) => e.id !== id),
  );
}

/* ---------- Planned activities ---------- */
export const getPlannedActivities = (): PlannedActivity[] => readJSON(KEYS.planned, []);
export const savePlannedActivity = (a: EntryInput<PlannedActivity>) =>
  upsert<PlannedActivity>(KEYS.planned, a);
export const deletePlannedActivity = (id: string) => remove(KEYS.planned, id);
export const restorePlannedActivity = (a: PlannedActivity) =>
  writeJSON(KEYS.planned, [...getPlannedActivities(), a]);

/* ---------- Service entries ---------- */
export const getServiceEntries = (): ServiceEntry[] => readJSON(KEYS.service, []);
export const saveServiceEntry = (e: EntryInput<ServiceEntry>) =>
  upsert<ServiceEntry>(KEYS.service, e);
export const deleteServiceEntry = (id: string) => remove(KEYS.service, id);
export const restoreServiceEntry = (e: ServiceEntry) =>
  writeJSON(KEYS.service, [...getServiceEntries(), e]);

/* ---------- Whole-dataset operations ---------- */
export function getAllData(): AppData {
  return {
    settings: getSettings(),
    months: getMonths(),
    planned: getPlannedActivities(),
    service: getServiceEntries(),
  };
}

export function exportBackup(): BackupFile {
  return { app: "MyService", version: 1, exportedAt: new Date().toISOString(), data: getAllData() };
}

export function importBackup(raw: unknown): void {
  const file = raw as Partial<BackupFile>;
  if (!file || file.app !== "MyService" || !file.data) {
    throw new Error(t("err.notBackup"));
  }
  const { settings, months, planned, service } = file.data;
  if (!Array.isArray(planned) || !Array.isArray(service) || typeof months !== "object") {
    throw new Error(t("err.damaged"));
  }
  localStorage.setItem(KEYS.settings, JSON.stringify({ ...DEFAULT_SETTINGS, language: getSettings().language, ...settings, onboardingCompleted: true }));
  localStorage.setItem(KEYS.months, JSON.stringify(months ?? {}));
  localStorage.setItem(KEYS.planned, JSON.stringify(planned));
  localStorage.setItem(KEYS.service, JSON.stringify(service));
  notify();
}

export const clearAllData = (): void => removeAll();
