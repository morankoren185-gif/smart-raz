"use client";

import type { AppProgress } from "@/lib/progress/storage";
import { addPlayMinutes, useAppProgress, useProgressRefresh } from "@/lib/progress/storage";
import { createContext, useContext, useEffect, useMemo } from "react";

type ProgressContextValue = {
  progress: AppProgress;
  refresh: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

/** ספירת דקות משוערת כשהכרטיסייה פעילה — למסך הורה */
export function ProgressAndTimeProvider({ children }: { children: React.ReactNode }) {
  const progress = useAppProgress();
  const refresh = useProgressRefresh();

  useEffect(() => {
    let accMs = 0;
    const tick = () => {
      if (typeof document === "undefined") return;
      if (document.visibilityState !== "visible") return;
      accMs += 30000;
      if (accMs >= 60000) {
        addPlayMinutes(1);
        accMs -= 60000;
      }
    };
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo(() => ({ progress, refresh }), [progress, refresh]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgressContext must be used within ProgressAndTimeProvider");
  }
  return ctx;
}
