# Pre Fase 5 - Checklist de Cierre (Fase 4)

## Objetivo
Dejar documentados los límites, tradeoffs y riesgos antes de avanzar a la siguiente fase.

## 1) Error Boundary: límites reales
Qué sí captura:
- Errores durante render, lifecycle y constructores en subárboles.

Qué no captura:
- Errores en handlers de eventos.
- Errores asíncronos fuera del ciclo de render (promesas, timeouts).
- Errores del propio boundary.

Recomendación:
- Ubicar boundaries por dominio crítico (dashboard, paneles de datos, módulos de terceros).

## 2) `useDeferredValue`: cuándo usarlo
Útil cuando:
- Hay cálculo pesado ligado a input (filtros, listas grandes, búsquedas complejas).
- Se percibe lag al tipear.

No aporta mucho cuando:
- El cálculo es barato.
- El árbol es pequeño y no hay latencia perceptible.

Validación práctica:
- Medir sensación de input fluido + profiling de renders.

## 3) `useDeferredValue` vs `useTransition` (regla corta)
- `useDeferredValue`: difiere consumo/render de un valor derivado.
- `useTransition`: marca actualizaciones de estado como no urgentes desde origen.

## 4) Controlled vs Uncontrolled (decisión rápida)
Usar **controlled** si necesitas:
- Validación en tiempo real.
- UI reactiva por campo (errores, deshabilitar submit, previews).
- Reglas de negocio inmediatas.

Usar **uncontrolled** si necesitas:
- Formularios simples.
- Menos wiring.
- Integración centrada en refs o lectura al submit.

## 5) Compound Components: beneficios y costo
Beneficios:
- API declarativa y expresiva.
- Menos prop explosion.
- Mejor composición.

Costos:
- Más abstracción interna.
- Tipado más avanzado en TypeScript.
- Curva de aprendizaje del patrón.

## 6) Observabilidad mínima recomendada
- Log estructurado en `ErrorBoundary` (mensaje, stack, contexto).
- Eventos de auth (login/logout, redirecciones por ruta protegida).
- Métricas básicas de UX (latencia de input en búsquedas y render count en vistas críticas).

## 7) Riesgos técnicos actuales a tener en cuenta
1. `PatientDetailPage` obtiene datos desde `getInitialPatients()` (fuente estática), no desde estado compartido vivo.
2. ErrorBoundary muestra fallback pero no integra aún servicio de reporting (Sentry, Datadog).
3. Falta suite de tests para rutas protegidas, formulario y compound components.

## 8) Siguientes refactors recomendados (cuando toque)
1. Unificar fuente de pacientes (store/context) para que dashboard y detalle compartan el mismo estado real.
2. Agregar telemetría de errores y trazas de navegación.
3. Incorporar pruebas de integración para flujos críticos.
