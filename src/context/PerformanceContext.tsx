import { createContext, useContext, type ReactNode } from "react";

interface PerformanceContextValue {
  contextVersion: number;
}

const PerformanceContext = createContext<PerformanceContextValue | undefined>(undefined);

export function PerformanceProvider({
  value,
  children
}: {
  value: PerformanceContextValue;
  children: ReactNode;
}) {
  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformanceContext(): PerformanceContextValue {
  const ctx = useContext(PerformanceContext);
  if (!ctx) {
    // Falla temprano: evita usar el hook fuera del Provider y facilita debugging.
    throw new Error("usePerformanceContext must be used inside PerformanceProvider");
  }
  return ctx;
}
