import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode
} from "react";
import type { Patient } from "../types/patient";

type DetailTab = "overview" | "health" | "notes";

interface PatientDetailsContextValue {
  patient: Patient;
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;
}

const PatientDetailsContext = createContext<PatientDetailsContextValue | undefined>(undefined);

function usePatientDetailsContext() {
  const context = useContext(PatientDetailsContext);
  if (!context) {
    throw new Error("PatientDetails compound components deben usarse dentro de <PatientDetails>");
  }
  return context;
}

function PatientDetailsRoot({ patient, children }: { patient: Patient; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const value = useMemo(
    () => ({
      patient,
      activeTab,
      setActiveTab
    }),
    [patient, activeTab]
  );

  return (
    <PatientDetailsContext.Provider value={value}>
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{children}</article>
    </PatientDetailsContext.Provider>
  );
}

function Header() {
  const { patient } = usePatientDetailsContext();
  return (
    <header className="mb-4 border-b border-slate-200 pb-4">
      <h1 className="text-2xl font-bold text-ink">{patient.name}</h1>
      <p className="text-sm text-slate-600">{patient.role}</p>
    </header>
  );
}

function Tabs({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap gap-2">{children}</div>;
}

function Tab({ id, children }: { id: DetailTab; children: ReactNode }) {
  const { activeTab, setActiveTab } = usePatientDetailsContext();
  const isActive = activeTab === id;

  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-medium ${
        isActive ? "bg-calmBlue text-white" : "border border-slate-300 text-slate-700"
      }`}
      onClick={() => setActiveTab(id)}
      type="button"
    >
      {children}
    </button>
  );
}

function Content({ children }: { children: ReactNode }) {
  const { activeTab } = usePatientDetailsContext();

  return (
    <section className="space-y-3 text-slate-700">
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return null;
        }

        const typedChild = child as ReactElement<{ when: DetailTab }>;
        if (typedChild.props.when !== activeTab) {
          return null;
        }

        return cloneElement(typedChild);
      })}
    </section>
  );
}

function Panel({ when: _when, children }: { when: DetailTab; children: ReactNode }) {
  return <div>{children}</div>;
}

export const PatientDetails = Object.assign(PatientDetailsRoot, {
  Header,
  Tabs,
  Tab,
  Content,
  Panel
});
