import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSettings, saveMonth } from "@/lib/storage";
import { currentMonthId } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { LANGUAGES, t, useLanguage } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const PRESETS = [15, 30, 50];

export function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [goal, setGoal] = useState<number | null>(15);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const lang = useLanguage();
  const value = useCustom ? Number(custom) : goal;
  const valid = value !== null && Number.isFinite(value) && value > 0 && value <= 200;

  const finish = () => {
    if (!valid || value === null) return;
    const id = currentMonthId();
    const [y = 0, m = 1] = id.split("-").map(Number);
    saveMonth({ id, year: y, month: m, goalHours: value });
    saveSettings({ monthlyGoal: value, onboardingCompleted: true, language: lang });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16">
      {step === 1 ? (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500" aria-labelledby="ob-title">
          <img src={logo} alt="" width={80} height={80} className="mb-10 size-20 rounded-3xl bg-white shadow-soft" />
          <h1 id="ob-title" className="text-4xl font-semibold tracking-tight">{t("ob.welcome")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("ob.tagline")}
          </p>
          <div className="mt-10">
            <p className="mb-2 text-sm font-medium text-muted-foreground">{t("ob.language")}</p>
            <div role="radiogroup" aria-label={t("ob.language")} className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
              {LANGUAGES.map(({ value: v, label }) => (
                <button key={v} role="radio" aria-checked={lang === v} lang={v}
                  onClick={() => saveSettings({ language: v })}
                  className={cn("h-11 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    lang === v ? "bg-background shadow-soft" : "text-muted-foreground")}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="animate-in fade-in slide-in-from-right-4 duration-300" aria-labelledby="ob-goal">
          <h1 id="ob-goal" className="text-3xl font-semibold tracking-tight">{t("ob.goalTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("ob.goalHint")}</p>
          <div role="radiogroup" aria-label={t("ob.goalTitle")} className="mt-8 grid grid-cols-2 gap-3">
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
              {t("ob.custom")}
            </button>
          </div>
          {useCustom && (
            <div className="mt-6 space-y-2">
              <Label htmlFor="custom-goal">{t("ob.hoursPerMonth")}</Label>
              <Input id="custom-goal" type="number" inputMode="decimal" min={1} max={200} autoFocus
                value={custom} onChange={(e) => setCustom(e.target.value)} className="h-12 text-lg" />
            </div>
          )}
        </section>
      )}
      <div className="flex items-center justify-between gap-4 pt-10">
        <div className="flex gap-1.5" aria-label={t("ob.step", { n: step })}>
          {[1, 2].map((s) => (
            <span key={s} className={cn("h-1.5 rounded-full transition-all", s === step ? "w-6 bg-primary" : "w-1.5 bg-border")} />
          ))}
        </div>
        {step === 1 ? (
          <Button size="lg" className="h-12 rounded-2xl px-6" onClick={() => setStep(2)}>
            {t("ob.start")} <ArrowRight />
          </Button>
        ) : (
          <Button size="lg" className="h-12 rounded-2xl px-6" disabled={!valid} onClick={finish}>
            {t("ob.continue")} <ArrowRight />
          </Button>
        )}
      </div>
    </main>
  );
}
