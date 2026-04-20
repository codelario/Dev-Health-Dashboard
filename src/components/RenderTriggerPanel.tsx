type RenderTrigger = "state" | "props" | "context" | "none";

interface RenderTriggerPanelProps {
  lastTrigger: RenderTrigger;
  dashboardCounter: number;
  dashboardRenderCount: number;
}

const triggerDescriptions: Record<RenderTrigger, string> = {
  state: "STATE: El estado del Dashboard cambió, por eso el padre se redibuja.",
  props: "PROPS: Se actualizó un paciente, cambió su prop y su tarjeta se vuelve a renderizar.",
  context: "CONTEXT: Cambió el valor del Provider; los consumidores se renderizan aunque tengan React.memo.",
  none: "Sin interacción reciente. Usa los botones para observar el motivo del próximo render."
};

export default function RenderTriggerPanel({
  lastTrigger,
  dashboardCounter,
  dashboardRenderCount
}: RenderTriggerPanelProps) {
  return (
    <aside className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-ink">Disparadores de Re-render</h2>
      <p className="mt-2 text-sm text-slate-700">{triggerDescriptions[lastTrigger]}</p>

      <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
        <p>
          Parent counter (State): <strong>{dashboardCounter}</strong>
        </p>
        <p>
          Dashboard render count (ref): <strong>{dashboardRenderCount}</strong>
        </p>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Mira la consola: si aumentas solo el contador del padre, las `PatientCard` memoizadas no deberían loguear
        render nuevo.
      </p>
    </aside>
  );
}

