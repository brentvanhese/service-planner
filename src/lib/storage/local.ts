/** Low-level typed localStorage access plus change notifications. */
const PREFIX = "myservice:v1:";

export const KEYS = {
  settings: `${PREFIX}settings`,
  months: `${PREFIX}months`,
  planned: `${PREFIX}planned`,
  service: `${PREFIX}service`,
} as const;

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key.startsWith(PREFIX)) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function notify(): void {
  listeners.forEach((l) => l());
}

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
  notify();
}

export function removeAll(): void {
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  notify();
}

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
