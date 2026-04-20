import { Link, useParams } from "react-router-dom";
import { getInitialPatients } from "../services/patientService";
import { PatientDetails } from "../components/PatientDetails";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const patient = getInitialPatients().find((item) => item.id === id);

  if (!patient) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-10">
        <article className="rounded-xl border border-rose-200 bg-rose-50 p-6">
          <h1 className="text-xl font-bold text-rose-800">Paciente no encontrado</h1>
          <Link className="mt-4 inline-block text-sm font-medium text-calmBlue" to="/dashboard">
            Volver al dashboard
          </Link>
        </article>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <PatientDetails patient={patient}>
        <PatientDetails.Header />

        <PatientDetails.Tabs>
          <PatientDetails.Tab id="overview">Resumen</PatientDetails.Tab>
          <PatientDetails.Tab id="health">Métricas</PatientDetails.Tab>
          <PatientDetails.Tab id="notes">Recomendaciones</PatientDetails.Tab>
        </PatientDetails.Tabs>

        <PatientDetails.Content>
          <PatientDetails.Panel when="overview">
            <p>
              <strong>ID:</strong> {patient.id}
            </p>
            <p>
              <strong>Nombre:</strong> {patient.name}
            </p>
            <p>
              <strong>Rol:</strong> {patient.role}
            </p>
          </PatientDetails.Panel>

          <PatientDetails.Panel when="health">
            <p>
              <strong>Hydration:</strong> {patient.hydration}%
            </p>
            <p>
              <strong>Focus:</strong> {patient.focusLevel}%
            </p>
            <p>
              <strong>Status:</strong> {patient.status}
            </p>
          </PatientDetails.Panel>

          <PatientDetails.Panel when="notes">
            <p>1. Mantener pausas activas cada 60 minutos para evitar fatiga cognitiva.</p>
            <p>2. Revisar hidratación al iniciar y cerrar la jornada.</p>
            <p>3. Registrar foco percibido para detectar patrones semanales.</p>
          </PatientDetails.Panel>
        </PatientDetails.Content>

        <Link className="mt-5 inline-block rounded-md border border-slate-300 px-3 py-2 text-sm font-medium" to="/dashboard">
          Volver
        </Link>
      </PatientDetails>
    </section>
  );
}
