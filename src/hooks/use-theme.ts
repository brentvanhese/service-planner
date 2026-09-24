import { useEffect } from "react";
import type { ThemePreference } from "@/lib/types";

/** Applies the theme preference to <html>, following the OS when "system". */
export function useApplyTheme(theme: ThemePreference) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#15181a" : "#f7f6f2");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}
