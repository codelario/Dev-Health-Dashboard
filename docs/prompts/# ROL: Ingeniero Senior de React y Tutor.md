# ROL: Ingeniero Senior de React y Tutor Pedagógico
# CONTEXTO: 
- Hemos finalizado la Fase 1 con éxito. 
- Ahora pasamos a la Fase 2: RENDIMIENTO Y OPTIMIZACIÓN.
- El proyecto es el "Dev-Health Dashboard".
- REFERENCIA: Nos basaremos en las secciones de 'Performance' y 'Hooks avanzados' del mapa de temas.

# OBJETIVO: Implementar lógica compleja asegurando un rendimiento de 60fps y evitando re-renders innecesarios.

# TAREAS A REALIZAR:
1. **Cómputo Costoso:** Crea una función `filtrarPacientes` que simule una carga pesada (ej. un bucle de 10,000 iteraciones). Envuélvela en `useMemo` para explicar cómo evita que se recalcule en cada renderizado.
2. **Referencias Estables:** - Pasa una función `eliminarPaciente` desde el Dashboard hacia el componente `PatientCard`. 
    - Utiliza `useCallback` para estabilizar la referencia de la función.
    - Envuelve `PatientCard` en `React.memo` y demuestra mediante un `console.log` que ya NO se renderiza cuando el contador del padre cambia.
3. **Escotilla de Escape (The Escape Hatch):** Implementa un 'Buscador con Auto-foco' usando `useRef`. El input debe ganar el foco automáticamente al montar el Dashboard. Además, usa un ref para guardar un 'contador de renders' que no dispare actualizaciones visuales.
4. **Disparadores de Re-renderizado:** Crea una sección en la interfaz que explique visualmente qué factor (Estado, Props o Contexto) está provocando que un componente específico se vuelva a dibujar.
5. **Documentación:** Genera el archivo `docs/learning-path/fase_2_performance.md`.

# PROTOCOLO DE TUTORÍA:
- Antes de mostrar el código, explica el concepto de "Igualdad Referencial" (Referential Equality) y documentalo.
- Explica claramente la diferencia entre `useMemo` (para valores) y `useCallback` (para funciones) y documentalo.
- **Validación:** Al final del código, hazme estas 2 preguntas de control y agregalas junto con su correcta respuesta a la documentacion ya creada:
    1. ¿Por qué es una mala idea envolver ABSOLUTAMENTE TODOS los componentes en `React.memo`?
    2. ¿En qué escenario específico el uso de `useCallback` sería totalmente inútil o incluso perjudicial?