# Fase 3 - Estado Global, Navegación y Hooks Personalizados

> Guía de estudio detallada para NotebookLM:
> `docs/learning-path/fase_3_guia_estudio_notebooklm.md`
>
> Mini diagrama AuthContext/Provider/useAuth:
> sección `3) Context API en esta fase (sesión)` de la guía anterior.

## Estado de la fase
**Fase 3: Implementada.**

Objetivos cubiertos:
1. Router profesional con rutas `/login`, `/dashboard`, `/paciente/:id`.
2. `Layout` persistente para navegación constante.
3. `AuthContext` para sesión simulada sin prop drilling.
4. `useAuth` y `useLocalStorage` como hooks reutilizables.
5. `ProtectedRoute` para seguridad de acceso.
6. Coexistencia sin romper optimizaciones de Fase 2 (`useMemo`, `useCallback`, `React.memo`, `useRef`).

## 1) Arquitectura de navegación
```mermaid
flowchart TD
  A[BrowserRouter] --> B[Layout]
  B --> C[/login]
  B --> D[ProtectedRoute]
  D --> E[/dashboard]
  D --> F[/paciente/:id]
```

- `Layout` siempre está presente y envuelve el contenido con `Outlet`.
- `ProtectedRoute` corta el acceso a rutas privadas si no hay sesión.

## 2) Context API para sesión (fin y por qué)
### Problema que resuelve
Sin Context, tendríamos que pasar `user`, `login`, `logout` por props a múltiples capas (prop drilling).

### Solución aplicada
- `AuthContext` centraliza estado de sesión.
- `AuthProvider` publica `value` para todo el árbol.
- `useAuth` permite consumir sesión desde cualquier componente descendiente.

### Analogía simple
- `AuthProvider` = portería del edificio que publica quién está autorizado.
- `useAuth` = cada oficina consulta a portería en vez de preguntarle al jefe de cada piso.

## 3) Custom Hooks implementados
### `useLocalStorage`
Encapsula persistencia de estado en `localStorage` para no repetir lógica de lectura/escritura.

### `useAuth`
Encapsula consumo seguro de `AuthContext` y falla temprano si se usa fuera de `AuthProvider`.

### Reglas que hacen válido a un Custom Hook
1. Debe empezar con prefijo `use`.
2. Solo puede llamarse en el nivel superior de un componente/hook (no dentro de `if`, loops o callbacks).
3. Puede usar otros hooks internamente respetando esas mismas reglas.
4. Debe ser determinista en orden de llamadas entre renders.

## 4) Seguridad de rutas con `ProtectedRoute`
Flujo:
1. El usuario intenta entrar a `/dashboard` o `/paciente/:id`.
2. `ProtectedRoute` verifica `isAuthenticated`.
3. Si no está autenticado: redirige a `/login`.
4. Si está autenticado: renderiza `Outlet`.

## 5) Coexistencia con optimizaciones locales (Fase 2)
- `Dashboard` mantiene `useMemo` para `filterPatients`.
- `Dashboard` mantiene `useCallback` para callbacks enviados a `PatientCard`.
- `PatientCard` mantiene `React.memo`.
- `Dashboard` mantiene `useRef` para foco inicial y contador de renders.

Conclusión: agregamos estado global y routing **sin desmontar** optimizaciones locales previas.

## 6) Impacto de Context API en rendimiento
Context no es "gratis":
- Cuando cambia el `value` del Provider, los consumidores de ese contexto re-renderizan.
- Si el `value` se recrea innecesariamente, puede provocar renders evitables.

Buenas prácticas:
1. Mantener el `value` estable con `useMemo` cuando corresponda.
2. Separar contextos por dominio (Auth, Theme, Feature Flags) para limitar alcance.
3. Evitar meter estado de alta frecuencia en un contexto único global.

## 7) Cuándo considerar alternativas como Zustand
Usa Context API cuando:
- La complejidad es baja/media.
- El dominio es claro y acotado (sesión, tema, idioma).

Considera Zustand cuando:
- Hay muchos estados globales con cambios frecuentes.
- Necesitas suscripciones granulares por selector (menos re-renders).
- Quieres un store central con API simple y menos boilerplate que Redux.

## 8) Cuadro comparativo: Context API vs Zustand
| Criterio | Context API | Zustand |
|---|---|---|
| Curva inicial | Muy baja (nativo React) | Baja |
| Granularidad de render | Menor (depende del `value` del Provider) | Alta (selectores por slice) |
| Escalabilidad de estado global | Media | Alta |
| Boilerplate | Bajo | Bajo |
| Caso ideal | Auth, tema, idioma | Apps con estado global grande/dinámico |

## 9) Archivos creados/modificados en Fase 3
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/PatientDetailPage.tsx`
- `src/context/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/hooks/useLocalStorage.ts`
- `src/components/PatientCard.tsx` (enlace a detalle)
- `package.json` (`react-router-dom`)

## Preguntas de validación (con respuesta)
### 1) Diferencia entre Context API y otras librerías de estado global
**Respuesta:** Context API es nativo y excelente para dominios acotados, pero puede disparar más renders al cambiar `value` del Provider. Librerías como Zustand permiten suscripciones granulares por selector y escalan mejor cuando el estado global crece y cambia con alta frecuencia.

### 2) Reglas que debe seguir un Custom Hook para ser válido
**Respuesta:** debe empezar con `use`, llamarse solo en nivel superior (sin condicionales/bucles), mantener orden estable de hooks entre renders y poder componerse con otros hooks respetando esas reglas.
