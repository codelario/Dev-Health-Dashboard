import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PatientCard from "./PatientCard";
import MountLogger from "./MountLogger";
import RenderTriggerPanel from "./RenderTriggerPanel";
import { filterPatients, getInitialPatients } from "../services/patientService";
import type { Patient } from "../types/patient";
import { PerformanceProvider } from "../context";

type RenderTrigger = "state" | "props" | "context" | "none";

export default function Dashboard() {
  // Lazy init ensures we compute initial patients once at mount.
  const [patients, setPatients] = useState<Patient[]>(() => getInitialPatients());
  const [search, setSearch] = useState("");
  const [dashboardCounter, setDashboardCounter] = useState(0);
  const [contextVersion, setContextVersion] = useState(1);
  const [lastTrigger, setLastTrigger] = useState<RenderTrigger>("none");

  // useRef conserva valores entre renders sin disparar re-render al mutar `.current`.
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const dashboardRenderCountRef = useRef(0);
  dashboardRenderCountRef.current += 1;

  useEffect(() => {
    // Escape hatch: acceso imperativo al DOM para auto-foco.
    searchInputRef.current?.focus();
  }, []);

  // useCallback mantiene estable la referencia de esta función.
  // Esto ayuda a que React.memo en PatientCard no invalide por "función nueva" en cada render del padre.
  const handleHydrationBoost = useCallback((patientId: string) => {
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
    setLastTrigger("props");
  }, []);

  // Mismo criterio: callback estable para evitar renders por cambios referenciales innecesarios.
  const removePatient = useCallback((patientId: string) => {
    setPatients((currentPatients) => currentPatients.filter((patient) => patient.id !== patientId));
    setLastTrigger("props");
  }, []);

  const filteredPatients = useMemo(() => {
    // useMemo memoriza el valor final y evita recalcular el filtro costoso
    // en renders donde no cambiaron `patients` ni `search`.
    return filterPatients(patients, search);
  }, [patients, search]);

  // Si pasáramos un objeto inline, su referencia cambiaría en cada render y forzaría consumers.
  const performanceContextValue = useMemo(() => ({ contextVersion }), [contextVersion]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <MountLogger scope="Dashboard" />
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Dev-Health Dashboard</h1>
        <p className="text-slate-600">Phase 2: Performance, render control, and advanced hooks.</p>
      </header>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-ink">Search + Performance Controls</h2>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            ref={searchInputRef}
            className="w-full rounded-md border border-slate-300 px-3 py-2 md:max-w-sm"
            placeholder="Search patient by name, role or status"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setLastTrigger("state");
            }}
          />
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium"
            onClick={() => {
              setDashboardCounter((current) => current + 1);
              setLastTrigger("state");
            }}
          >
            Increment parent counter
          </button>
          <button
            className="rounded-md border border-cyan-300 px-3 py-2 text-sm font-medium text-cyan-700"
            onClick={() => {
              setContextVersion((current) => current + 1);
              setLastTrigger("context");
            }}
          >
            Update context version
          </button>
        </div>
      </div>

      <RenderTriggerPanel
        lastTrigger={lastTrigger}
        dashboardCounter={dashboardCounter}
        dashboardRenderCount={dashboardRenderCountRef.current}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* El Provider envuelve a las tarjetas para demostrar que Context también dispara re-render. */}
        <PerformanceProvider value={performanceContextValue}>
          {filteredPatients.map((patient) => (
            // `key` gives React stable identity for each card across renders.
            <PatientCard
              key={patient.id}
              patient={patient}
              onHydrationBoost={handleHydrationBoost}
              onDeletePatient={removePatient}
            />
          ))}
        </PerformanceProvider>
      </div>
    </section>
  );
}
