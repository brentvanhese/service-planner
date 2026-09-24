import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDuration, parseDuration } from "@/lib/duration";
import { cn } from "@/lib/utils";

const QUICK = [30, 60, 90, 120, 180];

export function DurationField({ value, onChange }: { value: number; onChange: (m: number) => void }) {
  const [text, setText] = useState(formatDuration(value));
  const [error, setError] = useState(false);
  useEffect(() => setText(value ? formatDuration(value) : ""), [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration</Label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick durations">
        {QUICK.map((m) => (
          <button key={m} type="button" onClick={() => { onChange(m); setError(false); }}
            aria-pressed={value === m}
            className={cn("h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === m ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted")}>
            {formatDuration(m)}
          </button>
        ))}
      </div>
      <Input id="duration" value={text} placeholder="e.g. 1h 30m"
        aria-invalid={error} aria-describedby="duration-hint"
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const m = parseDuration(text);
          if (m && m > 0 && m <= 24 * 60) { onChange(m); setError(false); } else setError(true);
        }}
        className="h-12" />
      <p id="duration-hint" className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
        {error ? "Try something like 45m, 1h or 1h 30m." : "Type hours and minutes, like 1h 30m."}
      </p>
    </div>
  );
}
