import type { ActivityType } from "./types";

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "door-to-door", label: "Door-to-door ministry" },
  { value: "public", label: "Public witnessing" },
  { value: "informal", label: "Informal witnessing" },
  { value: "letter", label: "Letter writing" },
  { value: "telephone", label: "Telephone witnessing" },
  { value: "bible-study", label: "Bible study" },
  { value: "ldc", label: "LDC" },
  { value: "other", label: "Other" },
];

export function activityLabel(type: ActivityType): string {
  return ACTIVITY_TYPES.find((a) => a.value === type)?.label ?? "Other";
}
