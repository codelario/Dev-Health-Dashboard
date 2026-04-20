import type { Patient } from "../types/patient";

export function getInitialPatients(): Patient[] {
  return [
    {
      id: "p-1",
      name: "Avery Stone",
      role: "Frontend Engineer",
      hydration: 78,
      focusLevel: 72,
      status: "stable"
    },
    {
      id: "p-2",
      name: "Jules Kim",
      role: "DevOps Engineer",
      hydration: 55,
      focusLevel: 61,
      status: "warning"
    },
    {
      id: "p-3",
      name: "Noa Patel",
      role: "Product Engineer",
      hydration: 40,
      focusLevel: 45,
      status: "critical"
    }
  ];
}
