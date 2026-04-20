import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [name, setName] = useState("Dev Engineer");
  const [email, setEmail] = useState("dev@example.com");

  const from = (location.state as LocationState | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(name, email);
    navigate(from, { replace: true });
  };

  return (
    <section className="mx-auto max-w-md px-4 py-10">
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-600">Simulamos autenticación para proteger rutas en Fase 3.</p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Nombre
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <button className="w-full rounded-md bg-calmBlue px-3 py-2 text-sm font-medium text-white" type="submit">
            Entrar
          </button>
        </form>
      </article>
    </section>
  );
}
