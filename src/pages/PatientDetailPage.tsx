import { Link, useParams } from "react-router-dom";
import { getInitialPatients } from "../services/patientService";

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
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Detalle de paciente</h1>
        <div className="mt-4 space-y-2 text-slate-700">
          <p>
            <strong>ID:</strong> {patient.id}
          </p>
          <p>
            <strong>Nombre:</strong> {patient.name}
          </p>
          <p>
            <strong>Rol:</strong> {patient.role}
          </p>
          <p>
            <strong>Hydration:</strong> {patient.hydration}%
          </p>
          <p>
            <strong>Focus:</strong> {patient.focusLevel}%
          </p>
          <p>
            <strong>Status:</strong> {patient.status}
          </p>
        </div>

        <Link className="mt-5 inline-block rounded-md border border-slate-300 px-3 py-2 text-sm font-medium" to="/dashboard">
          Volver
        </Link>
      </article>
    </section>
  );
}
