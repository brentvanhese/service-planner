import { useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS, getAllData, subscribe } from "./storage";
import type { AppData } from "./types";

const EMPTY: AppData = { settings: DEFAULT_SETTINGS, months: {}, planned: [], service: [] };

let cache: AppData | null = null;
let unsubscribeCache: (() => void) | null = null;

function getSnapshot(): AppData {
  if (!cache) {
    cache = getAllData();
    if (!unsubscribeCache) unsubscribeCache = subscribe(() => (cache = null));
  }
  return cache;
}

/** Reactive, read-only view of all locally stored data. */
export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

const noopSubscribe = () => () => {};
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
