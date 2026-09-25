import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, History, Home, Plus, Settings } from "lucide-react";
import { useAppData, useHydrated } from "@/lib/store";
import { ensureMonth } from "@/lib/storage";
import { currentMonthId } from "@/lib/dates";
import { useApplyTheme } from "@/hooks/use-theme";
import { registerServiceWorker } from "@/lib/pwa";
import { Onboarding } from "./Onboarding";
import { t, useLanguage } from "@/lib/i18n";

const NAV = [
  { to: "/", label: "nav.home", icon: Home },
  { to: "/plan", label: "nav.plan", icon: CalendarDays },
  { to: "/service", label: "nav.service", icon: Plus, primary: true },
  { to: "/history", label: "nav.history", icon: History },
  { to: "/settings", label: "nav.settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const { settings } = useAppData();
  useApplyTheme(settings.theme);
  const lang = useLanguage();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (hydrated && settings.onboardingCompleted) ensureMonth(currentMonthId());
  }, [hydrated, settings.onboardingCompleted]);

  if (!hydrated) return <div className="min-h-dvh bg-background" aria-busy="true" />;
  if (!settings.onboardingCompleted) return <Onboarding key={lang} />;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main key={lang} className="mx-auto w-full max-w-2xl px-4 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
        {children}
      </main>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      >
        <ul className="mx-auto grid max-w-2xl grid-cols-5 px-2">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="group flex h-16 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[status=active]:text-foreground"
              >
                {"primary" in rest ? (
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition-transform group-active:scale-95">
                    <Icon className="size-5" aria-hidden />
                  </span>
                ) : (
                  <Icon className="size-5 transition-transform group-active:scale-90" aria-hidden />
                )}
                <span className={"primary" in rest ? "sr-only" : undefined}>{t(label)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex items-end justify-between gap-4">
      <div>
        {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      </div>
      {action}
    </header>
  );
}
