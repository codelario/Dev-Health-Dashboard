export type PatientStatus = "stable" | "warning" | "critical";

export interface Patient {
  id: string;
  name: string;
  role: string;
  hydration: number;
  focusLevel: number;
  status: PatientStatus;
}
