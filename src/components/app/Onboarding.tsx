import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSettings, saveMonth } from "@/lib/storage";
import { currentMonthId } from "@/lib/dates";
import { cn } from "@/lib/utils";

const PRESETS = [5, 10, 15, 20, 30];

export function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [goal, setGoal] = useState<number | null>(10);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const value = useCustom ? Number(custom) : goal;
  const valid = value !== null && Number.isFinite(value) && value > 0 && value <= 200;

  const finish = () => {
    if (!valid || value === null) return;
    const id = currentMonthId();
    const [y, m] = id.split("-").map(Number);
    saveMonth({ id, year: y, month: m, goalHours: value });
    saveSettings({ monthlyGoal: value, onboardingCompleted: true });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16">
      {step === 1 ? (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500" aria-labelledby="ob-title">
          <div className="mb-10 flex size-16 items-center justify-center rounded-3xl bg-primary text-2xl font-bold text-primary-foreground shadow-soft">
            M
          </div>
          <h1 id="ob-title" className="text-4xl font-semibold tracking-tight">Welcome to MyService</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Plan your service. Track your hours. See your progress.
          </p>
        </section>
      ) : (
        <section className="animate-in fade-in slide-in-from-right-4 duration-300" aria-labelledby="ob-goal">
          <h1 id="ob-goal" className="text-3xl font-semibold tracking-tight">What is your monthly goal?</h1>
          <p className="mt-2 text-muted-foreground">You can change this anytime in Settings.</p>
          <div role="radiogroup" aria-label="Monthly goal" className="mt-8 grid grid-cols-3 gap-3">
            {PRESETS.map((h) => {
              const active = !useCustom && goal === h;
              return (
                <button
                  key={h}
                  role="radio"
                  aria-checked={active}
                  onClick={() => { setGoal(h); setUseCustom(false); }}
                  className={cn(
                    "h-16 rounded-2xl border text-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card hover:bg-muted",
                  )}
                >
                  {h}h
                </button>
              );
            })}
            <button
              role="radio"
              aria-checked={useCustom}
              onClick={() => setUseCustom(true)}
              className={cn(
                "h-16 rounded-2xl border text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                useCustom ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card hover:bg-muted",
              )}
            >
              Custom
            </button>
          </div>
          {useCustom && (
            <div className="mt-6 space-y-2">
              <Label htmlFor="custom-goal">Hours per month</Label>
              <Input id="custom-goal" type="number" inputMode="decimal" min={1} max={200} autoFocus
                value={custom} onChange={(e) => setCustom(e.target.value)} className="h-12 text-lg" />
            </div>
          )}
        </section>
      )}
      <div className="flex items-center justify-between gap-4 pt-10">
        <div className="flex gap-1.5" aria-label={`Step ${step} of 2`}>
          {[1, 2].map((s) => (
            <span key={s} className={cn("h-1.5 rounded-full transition-all", s === step ? "w-6 bg-primary" : "w-1.5 bg-border")} />
          ))}
        </div>
        {step === 1 ? (
          <Button size="lg" className="h-12 rounded-2xl px-6" onClick={() => setStep(2)}>
            Get started <ArrowRight />
          </Button>
        ) : (
          <Button size="lg" className="h-12 rounded-2xl px-6" disabled={!valid} onClick={finish}>
            Continue <ArrowRight />
          </Button>
        )}
      </div>
    </main>
  );
}
