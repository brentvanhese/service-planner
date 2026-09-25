import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDuration, parseDuration } from "@/lib/duration";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const QUICK = [30, 60, 90, 120, 180];

export function DurationField({ value, onChange }: { value: number; onChange: (m: number) => void }) {
  const [text, setText] = useState(formatDuration(value));
  const [error, setError] = useState(false);
  useEffect(() => setText(value ? formatDuration(value) : ""), [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="duration">{t("dur.label")}</Label>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("dur.quick")}>
        {QUICK.map((m) => (
          <button key={m} type="button" onClick={() => { onChange(m); setError(false); }}
            aria-pressed={value === m}
            className={cn("h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === m ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted")}>
            {formatDuration(m)}
          </button>
        ))}
      </div>
      <Input id="duration" value={text} placeholder={t("dur.placeholder")}
        aria-invalid={error} aria-describedby="duration-hint"
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const m = parseDuration(text);
          if (m && m > 0 && m <= 24 * 60) { onChange(m); setError(false); } else setError(true);
        }}
        className="h-12" />
      <p id="duration-hint" className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
        {error ? t("dur.error") : t("dur.hint")}
      </p>
    </div>
  );
}
