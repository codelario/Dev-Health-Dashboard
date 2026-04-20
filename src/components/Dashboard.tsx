import { useState } from "react";
import PatientCard from "./PatientCard";
import MountLogger from "./MountLogger";
import { getInitialPatients } from "../services/patientService";
import type { Patient } from "../types/patient";

export default function Dashboard() {
  // Lazy init ensures we compute initial patients once at mount.
  const [patients, setPatients] = useState<Patient[]>(() => getInitialPatients());

  const handleHydrationBoost = (patientId: string) => {
    // Immutable update: we return new objects only where data changed.
    // React then uses referential checks to find what needs reconciling.
    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              hydration: Math.min(patient.hydration + 5, 100),
              status: patient.hydration + 5 < 50 ? "critical" : patient.hydration + 5 < 65 ? "warning" : "stable"
            }
          : patient
      )
    );
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <MountLogger scope="Dashboard" />
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Dev-Health Dashboard</h1>
        <p className="text-slate-600">Phase 1: Fundamentals, one-way data flow, and critical Hooks.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          // `key` gives React stable identity for each card across renders.
          <PatientCard key={patient.id} patient={patient} onHydrationBoost={handleHydrationBoost} />
        ))}
      </div>
    </section>
  );
}
