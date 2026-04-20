import { type FormEvent, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import PatientCard from "./PatientCard";
import MountLogger from "./MountLogger";
import RenderTriggerPanel from "./RenderTriggerPanel";
import { filterPatients, getInitialPatients } from "../services/patientService";
import type { Patient, PatientStatus } from "../types/patient";
import { PerformanceProvider } from "../context";
import ErrorBoundary from "./ErrorBoundary";

type RenderTrigger = "state" | "props" | "context" | "none";
type NewPatientForm = {
  name: string;
  role: string;
  hydration: string;
  focusLevel: string;
};

function inferStatus(hydration: number): PatientStatus {
  if (hydration < 50) return "critical";
  if (hydration < 65) return "warning";
  return "stable";
}

function validateNewPatient(form: NewPatientForm) {
  const errors: Partial<Record<keyof NewPatientForm, string>> = {};
  const hydrationNumber = Number(form.hydration);
  const focusNumber = Number(form.focusLevel);

  if (!form.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!form.role.trim()) errors.role = "El rol es obligatorio.";
  if (Number.isNaN(hydrationNumber) || hydrationNumber < 0 || hydrationNumber > 100) {
    errors.hydration = "Hydration debe estar entre 0 y 100.";
  }
  if (Number.isNaN(focusNumber) || focusNumber < 0 || focusNumber > 100) {
    errors.focusLevel = "Focus debe estar entre 0 y 100.";
  }

  return errors;
}

function CriticalPanel({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Error simulado en sección crítica del Dashboard.");
  }
  return <p className="text-sm text-slate-600">Panel crítico operativo. Estado: OK.</p>;
}

export default function Dashboard() {
  // Lazy init ensures we compute initial patients once at mount.
  const [patients, setPatients] = useState<Patient[]>(() => getInitialPatients());
  const [search, setSearch] = useState("");
  const [dashboardCounter, setDashboardCounter] = useState(0);
  const [contextVersion, setContextVersion] = useState(1);
  const [lastTrigger, setLastTrigger] = useState<RenderTrigger>("none");
  const [crashCriticalPanel, setCrashCriticalPanel] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState<NewPatientForm>({
    name: "",
    role: "",
    hydration: "70",
    focusLevel: "70"
  });

  // useRef conserva valores entre renders sin disparar re-render al mutar `.current`.
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const dashboardRenderCountRef = useRef(0);
  const nextPatientIdRef = useRef(patients.length + 1);
  dashboardRenderCountRef.current += 1;
  /**
   * Deferred value of the search input that delays updates to prevent excessive re-renders.
   * {@link https://react.dev/reference/react/useDeferredValue}
   * 
   * This allows the UI to remain responsive while the search value is being processed,
   * deferring non-urgent updates until the browser has finished more critical tasks.
   * 
   * @remarks
   * useDeferredValue es un hook de React que crea una versión "diferida" del valor de búsqueda.
   * Esto permite que la interfaz permanezca responsiva mientras se procesan búsquedas complejas,
   * priorizando las actualizaciones urgentes sobre las no urgentes.
   */
  const deferredSearch = useDeferredValue(search);
  const isSearchDeferred = search !== deferredSearch;
  const newPatientErrors = useMemo(() => validateNewPatient(newPatientForm), [newPatientForm]);
  const isNewPatientFormValid = Object.keys(newPatientErrors).length === 0;

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
    // useMemo memoriza el valor y useDeferredValue prioriza el input de texto.
    // Así la UI se siente fluida mientras el filtrado pesado se resuelve en segundo plano.
    return filterPatients(patients, deferredSearch);
  }, [patients, deferredSearch]);

  // Si pasáramos un objeto inline, su referencia cambiaría en cada render y forzaría consumers.
  const performanceContextValue = useMemo(() => ({ contextVersion }), [contextVersion]);

  const handleNewPatientFieldChange = useCallback(
    (field: keyof NewPatientForm, value: string) => {
      setNewPatientForm((current) => ({ ...current, [field]: value }));
    },
    []
  );

  const handleAddPatient = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!isNewPatientFormValid) {
        return;
      }

      const hydration = Number(newPatientForm.hydration);
      const focusLevel = Number(newPatientForm.focusLevel);
      const newPatient: Patient = {
        id: `p-${nextPatientIdRef.current}`,
        name: newPatientForm.name.trim(),
        role: newPatientForm.role.trim(),
        hydration,
        focusLevel,
        status: inferStatus(hydration)
      };

      nextPatientIdRef.current += 1;
      setPatients((currentPatients) => [newPatient, ...currentPatients]);
      setLastTrigger("state");
      setNewPatientForm({
        name: "",
        role: "",
        hydration: "70",
        focusLevel: "70"
      });
    },
    [isNewPatientFormValid, newPatientForm]
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <MountLogger scope="Dashboard" />
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Dev-Health Dashboard</h1>
        <p className="text-slate-600">Fase 4: patrones avanzados, resiliencia y UX concurrente.</p>
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
          {isSearchDeferred && <span className="text-xs text-slate-500">Actualizando resultados...</span>}
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
          <button
            className="rounded-md border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700"
            onClick={() => setCrashCriticalPanel(true)}
          >
            Simular error crítico
          </button>
        </div>
      </div>

      <ErrorBoundary
        title="Sección crítica protegida"
        message="Capturamos un error en tiempo de ejecución para mantener el dashboard operativo."
      >
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-ink">Resiliencia (Error Boundary)</h2>
          <CriticalPanel shouldCrash={crashCriticalPanel} />
        </div>
      </ErrorBoundary>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-ink">Agregar nuevo paciente (formulario controlado)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Cada input vive en estado React para validar en tiempo real y reaccionar inmediatamente.
        </p>

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleAddPatient}>
          <label className="text-sm font-medium text-slate-700">
            Nombre
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={newPatientForm.name}
              onChange={(event) => handleNewPatientFieldChange("name", event.target.value)}
            />
            {newPatientErrors.name && <span className="mt-1 block text-xs text-rose-700">{newPatientErrors.name}</span>}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Rol
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={newPatientForm.role}
              onChange={(event) => handleNewPatientFieldChange("role", event.target.value)}
            />
            {newPatientErrors.role && <span className="mt-1 block text-xs text-rose-700">{newPatientErrors.role}</span>}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Hydration (0-100)
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              type="number"
              min={0}
              max={100}
              value={newPatientForm.hydration}
              onChange={(event) => handleNewPatientFieldChange("hydration", event.target.value)}
            />
            {newPatientErrors.hydration && (
              <span className="mt-1 block text-xs text-rose-700">{newPatientErrors.hydration}</span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Focus (0-100)
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              type="number"
              min={0}
              max={100}
              value={newPatientForm.focusLevel}
              onChange={(event) => handleNewPatientFieldChange("focusLevel", event.target.value)}
            />
            {newPatientErrors.focusLevel && (
              <span className="mt-1 block text-xs text-rose-700">{newPatientErrors.focusLevel}</span>
            )}
          </label>

          <button
            className="md:col-span-2 rounded-md bg-calmBlue px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!isNewPatientFormValid}
          >
            Agregar paciente
          </button>
        </form>
      </div>

      <RenderTriggerPanel
        lastTrigger={lastTrigger}
        dashboardCounter={dashboardCounter}
        dashboardRenderCount={dashboardRenderCountRef.current}
      />

      <ErrorBoundary
        title="Listado de pacientes no disponible"
        message="Hubo un problema en el render del listado, pero el resto del dashboard sigue vivo."
      >
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
      </ErrorBoundary>
    </section>
  );
}
