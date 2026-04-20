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

export function filterPatients(patients: Patient[], search: string): Patient[] {
  const normalizedSearch = search.trim().toLowerCase();

  // Simula un cálculo pesado para que se note cuándo useMemo evita recomputarlo.
  let expensiveAccumulator = 0;
  for (let i = 0; i < 10000; i += 1) {
    expensiveAccumulator += (i * 7) % 13;
  }
  void expensiveAccumulator;

  if (!normalizedSearch) {
    return patients;
  }

  return patients.filter((patient) => {
    const haystack = `${patient.name} ${patient.role} ${patient.status}`.toLowerCase();
    return haystack.includes(normalizedSearch);
  });
}
