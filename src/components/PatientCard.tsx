import { memo, useRef, useState } from "react";
import type { Patient } from "../types/patient";
import { usePerformanceContext } from "../context";

interface PatientCardProps {
  patient: Patient;
  onHydrationBoost: (patientId: string) => void;
  onDeletePatient: (patientId: string) => void;
}

function PatientCard({ patient, onHydrationBoost, onDeletePatient }: PatientCardProps) {
  // Leer contexto aquí nos permite demostrar que cambios de Context atraviesan React.memo.
  const { contextVersion } = usePerformanceContext();

  // Contador de renders para observar en consola qué tarjetas se re-renderizan.
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  console.log(`[render] PatientCard ${patient.id} #${renderCountRef.current}`);

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
        <p className="col-span-2 text-xs text-slate-500">
          Context version: <strong>{contextVersion}</strong>
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

        <button
          className="rounded-md border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700"
          onClick={() => onDeletePatient(patient.id)}
        >
          Remove
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

// React.memo hace shallow compare de props; evita render si las referencias de props no cambiaron.
const MemoizedPatientCard = memo(PatientCard);
MemoizedPatientCard.displayName = "PatientCard";

export default MemoizedPatientCard;
