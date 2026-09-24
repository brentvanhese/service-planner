/** ISO calendar date, e.g. "2026-09-24" */
export type ISODate = string;
/** Month identifier, e.g. "2026-09" */
export type MonthId = string;

export type ThemePreference = "light" | "dark" | "system";

export type ActivityType =
  | "door-to-door"
  | "public"
  | "informal"
  | "letter"
  | "telephone"
  | "bible-study"
  | "ldc"
  | "other";

export interface UserSettings {
  monthlyGoal: number; // hours
  theme: ThemePreference;
  onboardingCompleted: boolean;
}

export interface Month {
  id: MonthId;
  year: number;
  month: number; // 1-12
  goalHours: number;
}

interface BaseEntry {
  id: string;
  date: ISODate;
  durationMinutes: number;
  activityType: ActivityType;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannedActivity extends BaseEntry {
  startTime?: string; // "HH:mm"
}

export type ServiceEntry = BaseEntry;

export type EntryKind = "planned" | "service";

export interface AppData {
  settings: UserSettings;
  months: Record<MonthId, Month>;
  planned: PlannedActivity[];
  service: ServiceEntry[];
}

export interface BackupFile {
  app: "MyService";
  version: 1;
  exportedAt: string;
  data: AppData;
}
