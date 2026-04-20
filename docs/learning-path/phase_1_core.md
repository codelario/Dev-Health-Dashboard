# Phase 1 - Core (Resumen Ejecutivo)

## Estado de la fase
**Phase 1: Terminada.**

Criterio de finalizacion aplicado:
1. Fundamentos implementados en codigo (`props`, `state`, `useEffect`, one-way data flow).
2. Conceptos documentados con mental model y ejemplos.
3. Checklist de entrevista cubierto.
4. Preguntas de validacion disponibles.

Antes de avanzar a la siguiente fase, hacemos siempre este checkpoint:
1. Confirmar dudas puntuales.
2. Elegir si profundizar algun tema.
3. Si no hay dudas, avanzar a la siguiente fase.

## Objetivo
Construir una base solida de React entendiendo que pasa internamente cuando cambian `state` y `props`.

## Lo implementado
- `Dashboard` como source of truth de pacientes.
- `PatientCard` con props + estado local (`notesVisible`).
- `useMountLogger` para observar mount/unmount con `useEffect`.
- Actualizaciones inmutables de estado en listas.

## Mapa rapido de archivos
- `src/components/Dashboard.tsx`: estado principal + render de lista.
- `src/components/PatientCard.tsx`: presentacion + estado UI local.
- `src/hooks/useMountLogger.ts`: efecto con cleanup.
- `src/services/patientService.ts`: datos iniciales.
- `src/types/patient.ts`: contrato tipado.

## Documentacion detallada de Phase 1
1. `phase_1_stack_foundation.md`: Vite, arranque, arquitectura, TS, Tailwind.
2. `phase_1_react_runtime.md`: JSX, Virtual DOM, diff, reconciliation, keys.
3. `phase_1_hooks_state_effects.md`: `useState`, batching, inmutabilidad, `useEffect`.
4. `glossary.md`: glosario de chequeo rapido.
5. `exam_qna_phase_1.md`: preguntas de examen con respuesta y explicacion.

## Checklist de dominio (entrevista)
- Explicar por que `key` estable evita bugs en listas.
- Justificar por que el estado se actualiza de forma inmutable.
- Diferenciar claramente `props` vs `state`.
- Describir el ciclo: render -> diff -> commit -> effect.
