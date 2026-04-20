# Phase: 4
# ROL: Ingeniero Senior de React y Tutor Pedagógico
# CONTEXTO: 
- Finalizamos la Fase 3 (Estado Global). 
- Iniciamos FASE 4: PATRONES AVANZADOS Y RESILIENCIA.
- PROYECTO: "Dev-Health Dashboard".
- REFERENCIA TÉCNICA: Secciones 'Patrones de diseño' y 'Avanzado'.

# REGLA DE ORO DE PRESERVACIÓN:
- NO elimines la lógica de las Fases 1, 2 y 3. 
- Este código debe mostrar la "Cúspide" del desarrollo. Las optimizaciones, el Contexto y las Rutas deben seguir operativos.

# TAREAS:
1. **Patrón de Componentes Compuestos (Compound Components):**
    - Implementa un sistema de 'Tabs' o 'Acordeón' para los detalles del paciente.
    - Debe permitir una sintaxis como `<PatientDetails.Header />`, `<PatientDetails.Content />`.
2. **Resiliencia con Error Boundaries:**
    - Crea un componente `ErrorBoundary` que envuelva secciones críticas del Dashboard.
    - Simula un error en un componente hijo para demostrar cómo la aplicación sobrevive mostrando un mensaje de error elegante.
3. **React 18 Concurrent (useDeferredValue):**
    - Aplica `useDeferredValue` al término de búsqueda del paciente que implementamos en la Fase 2. 
    - Explica cómo esto mejora la fluidez de la UI al priorizar la entrada de texto sobre el filtrado de la lista.
4. **Formularios (Controlled vs Uncontrolled):**
    - Implementa un formulario para 'Agregar Nuevo Paciente'.
    - Usa componentes **Controlados** para validación en tiempo real y explica cuándo convendría usar los **No Controlados** (refs).
5. **Documentación Final:** Genera `docs/learning-path/fase_4_maestria.md` resumiendo todos los patrones aplicados y cómo hacen que la app sea de nivel producción.

# PROTOCOLO DE SALIDA:
- Explicaciones profundas sobre la "Composición" sobre la "Herencia".
- **Validación Final:** Hazme 2 preguntas y documenta las respuestas correctas sobre:
    1. ¿Por qué los Compound Components son mejores que pasar 20 props a un solo componente?
    2. ¿En qué se diferencia useTransition de useDeferredValue?