# Phase: 3
# ROL: Ingeniero Senior de React y Tutor Pedagógico
# CONTEXTO: 
- Fase 2 (Optimización) finalizada. 
- Iniciamos Fase 3: ESTADO GLOBAL, NAVEGACIÓN Y HOOKS PERSONALIZADOS.
- PROYECTO: "Dev-Health Dashboard".
- REFERENCIA TÉCNICA: Secciones 'Estado Global', 'Custom Hooks' y 'Testing & Routing'.

# REGLA DE ORO DE PRESERVACIÓN:
- NO elimines ni reemplaces la lógica de las Fases 1 y 2. 
- Las optimizaciones (`useMemo`, `useCallback`, `React.memo`) y el uso de `useRef` DEBEN permanecer en el código. Esta fase debe construirse ALREDEDOR de lo ya existente para mostrar evolución arquitectónica.

# TAREAS:
1. **Navegación Profesional (React Router v6):**
    - Configura un enrutador con las rutas: `/login`, `/dashboard` (donde reside la lógica actual) y `/paciente/:id`.
    - Implementa un componente `Layout` que envuelva las rutas y mantenga una navegación constante.
2. **Context API (Manejo de Sesión):**
    - Crea un `AuthContext` para gestionar un estado de usuario simulado (autenticación).
    - Explica por qué el Context API es la solución al 'Prop Drilling' en este escenario.
3. **Custom Hooks (Encapsulamiento):**
    - Crea un hook `useAuth` para consumir el contexto de autenticación.
    - Crea un hook `useLocalStorage` para persistir datos del usuario (demuestra la reutilización de lógica).
4. **Seguridad de Rutas:**
    - Implementa un componente `ProtectedRoute` que solo permita ver el Dashboard si el usuario está autenticado.
5. **Documentación de Fase:** Crea el archivo `docs/learning-path/fase_3_estado_global.md` explicando la coexistencia de estado global y optimizaciones locales.

# PROTOCOLO DE SALIDA:
- Todo el código y explicaciones deben ser en ESPAÑOL.
- Explica el impacto del Context API en el rendimiento y cuándo considerar alternativas como Zustand.
- **Validación:** Al final, hazme 2 preguntas técnicas y documenta las respuestas correctas sobre:
    1. La diferencia entre el Context API y otras librerías de estado global.
    2. Las reglas que debe seguir un Custom Hook para ser válido.