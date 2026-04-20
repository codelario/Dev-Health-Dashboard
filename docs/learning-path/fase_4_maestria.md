# Fase 4 - Maestría: Patrones Avanzados y Resiliencia

> Cierre previo a la siguiente fase:
> `docs/learning-path/pre_phase_5_checklist.md`

## Estado de la fase
**Fase 4: Implementada.**

Se mantuvo intacta la base de Fases 1-3:
- Optimización local (`useMemo`, `useCallback`, `React.memo`, `useRef`).
- Estado global de sesión (`AuthContext`, `useAuth`).
- Navegación y rutas protegidas (React Router v6).

## 1) Composición sobre herencia (idea central)
En React moderno, preferimos **componer** piezas pequeñas en lugar de crear jerarquías rígidas por herencia.

Por qué:
1. Reutilización más flexible.
2. Menor acoplamiento.
3. APIs más expresivas.

En esta fase lo aplicamos con Compound Components en detalle de paciente.

## 2) Compound Components (`PatientDetails`)
Archivo principal: `src/components/PatientDetails.tsx`.

Sintaxis lograda:
```tsx
<PatientDetails patient={patient}>
  <PatientDetails.Header />
  <PatientDetails.Tabs>
    <PatientDetails.Tab id="overview">Resumen</PatientDetails.Tab>
    <PatientDetails.Tab id="health">Métricas</PatientDetails.Tab>
  </PatientDetails.Tabs>
  <PatientDetails.Content>
    <PatientDetails.Panel when="overview">...</PatientDetails.Panel>
    <PatientDetails.Panel when="health">...</PatientDetails.Panel>
  </PatientDetails.Content>
</PatientDetails>
```

Qué resuelve:
- Evita un componente monolítico con docenas de props.
- Permite una API declarativa y legible por estructura.
- Cada subcomponente conoce el estado compartido mediante contexto interno.

## 3) Resiliencia con `ErrorBoundary`
Archivo: `src/components/ErrorBoundary.tsx`.

Qué hace:
1. Captura errores de render en subárboles críticos.
2. Muestra fallback elegante.
3. Evita que toda la app caiga por un error puntual.

Dónde se aplicó:
- Sección crítica del dashboard (con simulación de error).
- Bloque del listado principal.

Simulación:
- Botón `Simular error crítico` fuerza excepción en componente hijo para demostrar recuperación visual.

## 4) React 18 Concurrent con `useDeferredValue`
Aplicación: `Dashboard` sobre término de búsqueda.

Antes:
- El filtro pesado corría inmediatamente con cada tecla.

Ahora:
- `search` actualiza input rápido.
- `deferredSearch` difiere el trabajo pesado (`filterPatients`).
- La UI prioriza la escritura del usuario y mantiene fluidez.

Resultado:
- Mejor percepción de 60fps cuando hay cálculos costosos en render.

## 5) Formulario controlado: agregar paciente
Aplicación: `Dashboard`.

Características implementadas:
1. Inputs controlados por estado React.
2. Validación en tiempo real (`name`, `role`, rangos 0-100).
3. Botón deshabilitado cuando hay errores.
4. Alta de paciente con estado inmutable.

### ¿Cuándo usar no controlados (uncontrolled con refs)?
Útiles cuando:
- El formulario es simple y no requiere validación instantánea.
- Se prioriza minimizar renders por cada tecla.
- Se integra con librerías de formularios que trabajan por referencia al DOM.

Tradeoff:
- Controlado: más control y validación instantánea.
- No controlado: menos wiring en casos sencillos.

## 6) Impacto global de la fase en arquitectura
Esta fase eleva la app a nivel producción al combinar:
1. Diseño de API de componentes (compound).
2. Tolerancia a fallos (error boundaries).
3. Priorización de updates de UI (deferred rendering).
4. Gestión robusta de entrada de usuario (formulario controlado).
5. Coexistencia con routing y estado global previos.

## 7) Cuadro comparativo: patrones aplicados
| Patrón/Herramienta | Objetivo | Beneficio principal | Riesgo si se abusa |
|---|---|---|---|
| Compound Components | API declarativa y composable | Menos prop drilling interno y mejor legibilidad | Complejidad extra si el caso es simple |
| Error Boundary | Aislar fallos de render | Resiliencia y continuidad de la app | Falsa sensación de cobertura total (no captura todo) |
| useDeferredValue | Diferir cálculos costosos no urgentes | Input más fluido | Complejidad mental si no hay costo real |
| Form controlado | Validación y sincronización en tiempo real | UX y reglas de negocio claras | Más renders/wiring en formularios enormes |

## 8) Validación final (con respuesta)
### 1) ¿Por qué los Compound Components son mejores que pasar 20 props a un solo componente?
**Respuesta:** porque exponen una API basada en estructura (composición) que reduce acoplamiento, evita prop explosion, mejora legibilidad y facilita escalar el componente en piezas independientes con responsabilidades claras.

### 2) ¿En qué se diferencia `useTransition` de `useDeferredValue`?
**Respuesta:** `useTransition` marca actualizaciones de estado como no urgentes desde el punto donde disparas `setState`; `useDeferredValue` difiere un valor derivado ya existente. En resumen: `useTransition` controla prioridad de updates al origen, `useDeferredValue` posterga consumo/render de un valor.
