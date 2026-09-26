import { enGB, nl, type Locale } from "date-fns/locale";
import { useAppData } from "./store";
import type { Language } from "./types";

const en = {
  "nav.home": "Home", "nav.plan": "Plan", "nav.service": "Service", "nav.history": "History", "nav.settings": "Settings",
  "ob.welcome": "Welcome to MyService",
  "ob.tagline": "Plan your service. Track your hours. See your progress.",
  "ob.language": "Language",
  "ob.goalTitle": "What is your monthly goal?",
  "ob.goalHint": "You can change this anytime in Settings.",
  "ob.custom": "Custom", "ob.hoursPerMonth": "Hours per month",
  "ob.start": "Get started", "ob.continue": "Continue", "ob.step": "Step {n} of 2",
  "act.door-to-door": "Door-to-door ministry", "act.public": "Public witnessing", "act.informal": "Informal witnessing",
  "act.letter": "Letter writing", "act.telephone": "Telephone witnessing", "act.bible-study": "Bible study",
  "act.ldc": "LDC", "act.other": "Other",
  "dash.thisMonth": "This month", "dash.ringLabel": "{done} of {goal} hours completed", "dash.hours": "hours",
  "dash.remaining": "remaining", "dash.goalComplete": "Goal complete", "dash.day": "day left", "dash.days": "days left",
  "dash.addService": "Add service", "dash.viewPlan": "View plan", "dash.serviceLog": "Service log",
  "stat.completed": "Completed", "stat.planned": "Planned", "stat.remaining": "Remaining", "stat.daysLeft": "Days left",
  "stat.perDay": "Per day", "stat.perWeek": "Per week", "stat.toReach": "to reach goal", "stat.ahead": "{d} still ahead",
  "stat.goal": "Goal", "stat.vsPlan": "vs. plan", "stat.serviceDays": "Service days", "stat.avgDay": "Avg / day",
  "sum.title": "Summary", "sum.completion": "Goal completion",
  "status.paceWeek": "About {d} per week will get you there.", "status.paceDay": "About {d} per day will get you there.",
  "status.reached.t": "Goal reached! 🎉", "status.reached.b": "Wonderful work this month. Anything more is a bonus.",
  "status.ontrack.t": "You are on track", "status.ontrack.b": "You need {d} more to reach your goal. {pace}",
  "status.behind.t": "A little behind your pace", "status.behind.b": "There's still time. You need {d} more. {pace}",
  "status.fresh.t": "A fresh month", "status.fresh.b": "Plan a few activities to get started. {pace}",
  "status.past.t": "Month closed", "status.past.b": "This month is complete.",
  "day.none": "Nothing planned or recorded for this day.", "day.completed": "Completed · {d}", "day.planned": "Planned · {d}",
  "cal.completed": "{d} completed", "cal.planned": "{d} planned",
  "dur.label": "Duration", "dur.quick": "Quick durations", "dur.placeholder": "e.g. 1h 30m",
  "dur.error": "Try something like 45m, 1h or 1h 30m.", "dur.hint": "Type hours and minutes, like 1h 30m.",
  "form.saved": "Changes saved", "form.planned": "Activity planned", "form.added": "Service added",
  "form.deletedPlanned": "Deleted planned activity", "form.deletedService": "Deleted service", "form.undo": "Undo",
  "form.editPlanned": "Edit planned activity", "form.complete": "Mark as completed", "form.completed": "Moved to completed service", "plan.prev": "Previous month", "plan.next": "Next month", "form.editService": "Edit service",
  "form.plan": "Plan service", "form.add": "Add service",
  "form.planDesc": "Planned time is not counted until you record it.", "form.addDesc": "Record time you've completed.",
  "form.date": "Date", "form.start": "Start time", "form.optional": "(optional)", "form.activity": "Activity",
  "form.note": "Note", "form.delete": "Delete", "form.saveChanges": "Save changes", "form.save": "Save",
  "plan.title": "Plan", "plan.plannedMonth": "planned", "plan.goal": "goal", "plan.forDay": "Plan for this day",
  "plan.all": "All planned activities", "plan.empty": "No service planned yet.", "plan.emptyBody": "Plan your first activity.",
  "svc.title": "Service", "svc.thisMonth": "This month", "svc.total": "{d} total",
  "svc.empty": "No service recorded yet.", "svc.emptyBody": "Start tracking your service for this month.",
  "hist.title": "History", "hist.empty": "No months yet", "hist.emptyBody": "Your monthly summaries will appear here.",
  "hist.current": "Current", "hist.unknown": "Unknown month.",
  "set.title": "Settings", "set.goal": "Monthly goal", "set.goalLabel": "Default hours per month", "set.save": "Save",
  "set.apply": "Also apply to {m} (currently {h}h)", "set.prevKeep": "Previous months keep the goal they had.",
  "set.goalError": "Enter a goal between 1 and 200 hours.", "set.goalSaved": "Goal updated",
  "set.appearance": "Appearance", "set.light": "Light", "set.dark": "Dark", "set.system": "System",
  "set.language": "Language", "set.data": "Data",
  "set.dataBody": "Everything is stored only on this device. Export a backup to move to another browser or phone.",
  "set.export": "Export data", "set.import": "Import data", "set.clear": "Clear all data",
  "set.clearTitle": "Clear all data?",
  "set.clearBody": "This permanently removes your goals, plans and service entries from this device. Export a backup first if you want to keep them.",
  "set.cancel": "Cancel", "set.clearAll": "Clear everything", "set.restored": "Data restored",
  "set.readError": "Could not read that file.", "set.sample": "Load sample data (dev only)",
  "set.footer": "MyService · works offline · no account needed",
  "err.notBackup": "This file is not a MyService backup.", "err.damaged": "The backup file is incomplete or damaged.",
};

type Key = keyof typeof en;

const nlDict: Record<Key, string> = {
  "nav.home": "Start", "nav.plan": "Plannen", "nav.service": "Dienst", "nav.history": "Geschiedenis", "nav.settings": "Instellingen",
  "ob.welcome": "Welkom bij MyService",
  "ob.tagline": "Plan je dienst. Houd je uren bij. Zie je voortgang.",
  "ob.language": "Taal",
  "ob.goalTitle": "Wat is je maanddoel?",
  "ob.goalHint": "Je kunt dit altijd wijzigen in Instellingen.",
  "ob.custom": "Anders", "ob.hoursPerMonth": "Uren per maand",
  "ob.start": "Aan de slag", "ob.continue": "Doorgaan", "ob.step": "Stap {n} van 2",
  "act.door-to-door": "Van huis tot huis", "act.public": "Openbare getuigenis", "act.informal": "Informele getuigenis",
  "act.letter": "Brieven schrijven", "act.telephone": "Telefonische getuigenis", "act.bible-study": "Bijbelstudie",
  "act.ldc": "LDC", "act.other": "Overig",
  "dash.thisMonth": "Deze maand", "dash.ringLabel": "{done} van {goal} uur voltooid", "dash.hours": "uur",
  "dash.remaining": "resterend", "dash.goalComplete": "Doel bereikt", "dash.day": "dag over", "dash.days": "dagen over",
  "dash.addService": "Dienst toevoegen", "dash.viewPlan": "Planning bekijken", "dash.serviceLog": "Dienstlogboek",
  "stat.completed": "Voltooid", "stat.planned": "Gepland", "stat.remaining": "Resterend", "stat.daysLeft": "Dagen over",
  "stat.perDay": "Per dag", "stat.perWeek": "Per week", "stat.toReach": "om je doel te halen", "stat.ahead": "nog {d} te gaan",
  "stat.goal": "Doel", "stat.vsPlan": "t.o.v. plan", "stat.serviceDays": "Dienstdagen", "stat.avgDay": "Gem. / dag",
  "sum.title": "Overzicht", "sum.completion": "Doel behaald",
  "status.paceWeek": "Met ongeveer {d} per week kom je er.", "status.paceDay": "Met ongeveer {d} per dag kom je er.",
  "status.reached.t": "Doel bereikt! 🎉", "status.reached.b": "Prachtig werk deze maand. Alles erbij is mooi meegenomen.",
  "status.ontrack.t": "Je ligt op schema", "status.ontrack.b": "Je hebt nog {d} nodig om je doel te halen. {pace}",
  "status.behind.t": "Iets achter op schema", "status.behind.b": "Er is nog tijd. Je hebt nog {d} nodig. {pace}",
  "status.fresh.t": "Een nieuwe maand", "status.fresh.b": "Plan een paar activiteiten om te beginnen. {pace}",
  "status.past.t": "Maand afgesloten", "status.past.b": "Deze maand is voorbij.",
  "day.none": "Niets gepland of genoteerd voor deze dag.", "day.completed": "Voltooid · {d}", "day.planned": "Gepland · {d}",
  "cal.completed": "{d} voltooid", "cal.planned": "{d} gepland",
  "dur.label": "Duur", "dur.quick": "Snelle keuzes", "dur.placeholder": "bv. 1u 30m",
  "dur.error": "Probeer iets als 45m, 1u of 1u 30m.", "dur.hint": "Typ uren en minuten, zoals 1u 30m.",
  "form.saved": "Wijzigingen opgeslagen", "form.planned": "Activiteit gepland", "form.added": "Dienst toegevoegd",
  "form.deletedPlanned": "Geplande activiteit verwijderd", "form.deletedService": "Dienst verwijderd", "form.undo": "Ongedaan maken",
  "form.editPlanned": "Geplande activiteit bewerken", "form.complete": "Markeren als voltooid", "form.completed": "Verplaatst naar voltooide dienst", "plan.prev": "Vorige maand", "plan.next": "Volgende maand", "form.editService": "Dienst bewerken",
  "form.plan": "Dienst plannen", "form.add": "Dienst toevoegen",
  "form.planDesc": "Geplande tijd telt pas mee als je hem noteert.", "form.addDesc": "Noteer tijd die je hebt besteed.",
  "form.date": "Datum", "form.start": "Starttijd", "form.optional": "(optioneel)", "form.activity": "Activiteit",
  "form.note": "Notitie", "form.delete": "Verwijderen", "form.saveChanges": "Wijzigingen opslaan", "form.save": "Opslaan",
  "plan.title": "Plannen", "plan.plannedMonth": "gepland", "plan.goal": "doel", "plan.forDay": "Plannen voor deze dag",
  "plan.all": "Alle geplande activiteiten", "plan.empty": "Nog geen dienst gepland.", "plan.emptyBody": "Plan je eerste activiteit.",
  "svc.title": "Dienst", "svc.thisMonth": "Deze maand", "svc.total": "{d} totaal",
  "svc.empty": "Nog geen dienst genoteerd.", "svc.emptyBody": "Begin met het bijhouden van je dienst deze maand.",
  "hist.title": "Geschiedenis", "hist.empty": "Nog geen maanden", "hist.emptyBody": "Je maandoverzichten verschijnen hier.",
  "hist.current": "Huidig", "hist.unknown": "Onbekende maand.",
  "set.title": "Instellingen", "set.goal": "Maanddoel", "set.goalLabel": "Standaard uren per maand", "set.save": "Opslaan",
  "set.apply": "Ook toepassen op {m} (nu {h}u)", "set.prevKeep": "Vorige maanden behouden hun doel.",
  "set.goalError": "Vul een doel in tussen 1 en 200 uur.", "set.goalSaved": "Doel bijgewerkt",
  "set.appearance": "Weergave", "set.light": "Licht", "set.dark": "Donker", "set.system": "Systeem",
  "set.language": "Taal", "set.data": "Gegevens",
  "set.dataBody": "Alles wordt alleen op dit toestel bewaard. Exporteer een back-up om naar een andere browser of telefoon te verhuizen.",
  "set.export": "Gegevens exporteren", "set.import": "Gegevens importeren", "set.clear": "Alle gegevens wissen",
  "set.clearTitle": "Alle gegevens wissen?",
  "set.clearBody": "Dit verwijdert je doelen, planning en dienst definitief van dit toestel. Exporteer eerst een back-up als je ze wilt bewaren.",
  "set.cancel": "Annuleren", "set.clearAll": "Alles wissen", "set.restored": "Gegevens hersteld",
  "set.readError": "Kan dit bestand niet lezen.", "set.sample": "Voorbeeldgegevens laden (alleen dev)",
  "set.footer": "MyService · werkt offline · geen account nodig",
  "err.notBackup": "Dit bestand is geen MyService-back-up.", "err.damaged": "Het back-upbestand is onvolledig of beschadigd.",
};

const DICTS: Record<Language, Record<Key, string>> = { en, nl: nlDict };
export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "nl", label: "Nederlands" },
];

export function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of langs) {
    const code = l?.toLowerCase().slice(0, 2);
    if (code === "nl") return "nl";
    if (code === "en") return "en";
  }
  return "en";
}

export const resolveLanguage = (pref?: Language): Language => pref ?? detectLanguage();

let current: Language = "en";
export const getLanguage = () => current;
export const setCurrentLanguage = (l: Language) => {
  current = l;
  if (typeof document !== "undefined") document.documentElement.lang = l;
};
export const dateLocale = (): Locale => (current === "nl" ? nl : enGB);

export function t(key: Key, vars?: Record<string, string | number>): string {
  let s = DICTS[current][key] ?? en[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

/** Resolves the active language from settings and keeps the module-level language in sync. */
export function useLanguage(): Language {
  const { settings } = useAppData();
  const lang = resolveLanguage(settings.language);
  setCurrentLanguage(lang);
  return lang;
}
