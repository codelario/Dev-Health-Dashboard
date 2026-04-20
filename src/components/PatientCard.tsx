import { useState } from "react";
import type { Patient } from "../types/patient";

interface PatientCardProps {
  patient: Patient;
  onHydrationBoost: (patientId: string) => void;
}

export default function PatientCard({ patient, onHydrationBoost }: PatientCardProps) {
  // Lazy initializer: this callback only runs on first mount.
  // It avoids recomputing initial values during future renders.
  const [notesVisible, setNotesVisible] = useState<boolean>(() => false);

  const statusStyles: Record<Patient["status"], string> = {
    stable: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-rose-100 text-rose-700"
  };

  return (
    <article className="rounded-xl bg-cardBg p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">{patient.name}</h3>
          <p className="text-sm text-slate-600">{patient.role}</p>
        </div>

        {/*
          If `patient.status` changes, React compares old/new JSX trees.
          Reconciliation patches only this badge text/classes instead of reloading the whole page.
        */}
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[patient.status]}`}>
          {patient.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <p>
          Hydration: <strong>{patient.hydration}%</strong>
        </p>
        <p>
          Focus: <strong>{patient.focusLevel}%</strong>
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="rounded-md bg-calmBlue px-3 py-2 text-sm font-medium text-white"
          onClick={() => onHydrationBoost(patient.id)}
        >
          +5 Hydration
        </button>

        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium"
          onClick={() => setNotesVisible((current) => !current)}
        >
          {notesVisible ? "Hide" : "Show"} Notes
        </button>
      </div>

      {/*
        Local state change (`notesVisible`) re-renders this component only.
        Parent list items keep identity via `key`, so unaffected cards stay stable.
      */}
      {notesVisible && <p className="mt-3 text-sm text-slate-600">Keep breaks regular to sustain focus.</p>}
    </article>
  );
}
