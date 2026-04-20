# Fase 3 - Guía de Estudio (Formato NotebookLM)

## 0) Cómo usar esta guía
Objetivo: entender **qué hace cada pieza** de la Fase 3 y **por qué existe**.

Orden recomendado de estudio:
1. Mapa general de arquitectura.
2. Conceptos de Router (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `Navigate`).
3. Contexto de sesión (`createContext`, `Provider`, `useContext`).
4. Hooks personalizados (`useAuth`, `useLocalStorage`).
5. Seguridad (`ProtectedRoute`).
6. Flujo runtime completo (sin login -> login -> dashboard -> detalle).

---

## 1) Mapa general de la Fase 3
```mermaid
flowchart TD
  A[main.tsx] --> B[App.tsx]
  B --> C[AuthProvider]
  C --> D[BrowserRouter]
  D --> E[Routes]
  E --> F[Layout]
  F --> G[/login]
  F --> H[ProtectedRoute]
  H --> I[/dashboard]
  H --> J[/paciente/:id]
```

Idea clave:
- `AuthProvider` publica sesión global.
- `BrowserRouter` gestiona navegación por URL.
- `Layout` mantiene navegación visual persistente.
- `ProtectedRoute` protege rutas privadas.

---

## 2) Router: qué es cada elemento

### `BrowserRouter`
Qué hace:
- Conecta React con el historial del navegador.
- Permite navegación SPA sin recargar toda la página.

Analogía:
- Es el "GPS" central que interpreta la URL actual.

Dónde está:
- `src/App.tsx`

### `Routes`
Qué hace:
- Contenedor que evalúa las rutas hijas y renderiza la que coincide.

Dónde está:
- `src/App.tsx`

### `Route`
Qué hace:
- Declara mapeo `path -> element`.

Ejemplos reales:
- `/login` -> `LoginPage`
- `/dashboard` -> `DashboardPage`
- `/paciente/:id` -> `PatientDetailPage`

Dónde está:
- `src/App.tsx`

### `Outlet`
Qué hace:
- Marcador de posición donde se pinta la ruta hija activa.

Analogía:
- Es el hueco de una plantilla donde cambia el contenido.

Dónde está:
- `src/components/Layout.tsx`
- `src/components/ProtectedRoute.tsx`

### `Navigate`
Qué hace:
- Redirección programática declarativa.

Ejemplo real:
- Si no está autenticado en `ProtectedRoute`, redirige a `/login`.

Dónde está:
- `src/components/ProtectedRoute.tsx`
- `src/App.tsx` (fallback `*`)

### `NavLink`
Qué hace:
- Link con estado activo para estilos de navegación.

Dónde está:
- `src/components/Layout.tsx`

### `useNavigate`
Qué hace:
- Navegación imperativa desde eventos/lógica.

Dónde está:
- `src/pages/LoginPage.tsx`

### `useLocation`
Qué hace:
- Permite leer la ubicación actual y datos de navegación (`state`).

Dónde está:
- `src/components/ProtectedRoute.tsx`
- `src/pages/LoginPage.tsx`

### `useParams`
Qué hace:
- Lee parámetros dinámicos de URL (`:id`).

Dónde está:
- `src/pages/PatientDetailPage.tsx`

---

## 3) Context API en esta fase (sesión)

### Problema: prop drilling
Sin contexto, tendríamos que pasar `user`, `isAuthenticated`, `login`, `logout` por múltiples componentes intermedios.

### Solución aplicada
- `createContext` define el canal compartido.
- `AuthProvider` publica el `value` de sesión.
- `useAuth` consume ese valor donde se necesite.

Analogía:
- `AuthProvider` = central de seguridad del edificio.
- `useAuth` = cualquier oficina consulta la central directamente.

### Context vs Provider (sin confusión)
| Término | Qué es | Qué hace | Ejemplo en este proyecto |
|---|---|---|---|
| `Context` | Objeto de React creado con `createContext` | Define el tipo/canal de dato compartido | `AuthContext` en `src/context/AuthContext.tsx` |
| `Provider` | Componente asociado al Context | Publica el `value` actual a todo el subárbol | `<AuthContext.Provider value={...}>` dentro de `AuthProvider` |

Regla mental:
- `Context` = el **canal**.
- `Provider` = la **fuente** que emite el dato por ese canal.

### Mini diagrama: AuthContext en ejecución
```mermaid
flowchart TD
  A[createContext(AuthContext)] --> B[AuthProvider]
  B -->|value: user, isAuthenticated, login, logout| C[Árbol de la app]
  C --> D[useAuth en Layout]
  C --> E[useAuth en ProtectedRoute]

  D --> F[Mostrar usuario / Logout en navbar]
  E --> G{isAuthenticated?}
  G -->|No| H[Navigate a /login]
  G -->|Sí| I[Render Outlet rutas privadas]
```

Qué debes recordar:
1. `createContext` no guarda estado por sí solo; solo define el canal.
2. El estado real vive dentro de `AuthProvider` (con `useLocalStorage`).
3. `useAuth` lee ese estado en cualquier componente descendiente.
4. Si cambia `user`, cambia `value` y se actualizan consumidores.

---

## 4) File-by-file: qué hace cada archivo nuevo/modificado

## `src/App.tsx`
Responsabilidad:
- Componer proveedores globales y routing principal.

Qué hace:
1. Envuelve todo con `AuthProvider`.
2. Monta `BrowserRouter`.
3. Define rutas públicas/privadas.
4. Define fallback `* -> /dashboard`.

## `src/components/Layout.tsx`
Responsabilidad:
- Estructura visual persistente.

Qué hace:
1. Header/nav siempre visibles.
2. Usa `useAuth` para mostrar usuario y logout.
3. Usa `Outlet` para renderizar contenido de la ruta activa.

## `src/components/ProtectedRoute.tsx`
Responsabilidad:
- Guard de autenticación.

Qué hace:
1. Lee `isAuthenticated`.
2. Si `false`, redirige a `/login` y guarda origen en `state.from`.
3. Si `true`, renderiza `Outlet`.

## `src/context/AuthContext.tsx`
Responsabilidad:
- Estado global de sesión.

Qué hace:
1. Define tipo `AuthUser`.
2. Define contrato del contexto (`user`, `isAuthenticated`, `login`, `logout`).
3. Persiste usuario con `useLocalStorage`.
4. Publica `value` memoizado con `useMemo`.

## `src/hooks/useAuth.ts`
Responsabilidad:
- Hook de consumo seguro del contexto.

Qué hace:
1. Llama `useContext(AuthContext)`.
2. Lanza error claro si se usa fuera de `AuthProvider`.

## `src/hooks/useLocalStorage.ts`
Responsabilidad:
- Reutilizar lógica de persistencia.

Qué hace:
1. Lee valor inicial desde `localStorage`.
2. Escribe cambios en `localStorage` cuando cambia estado.
3. Devuelve API tipo `useState` (`[value, setValue]`).

## `src/pages/LoginPage.tsx`
Responsabilidad:
- Pantalla pública de login simulado.

Qué hace:
1. Captura nombre/email.
2. Ejecuta `login(name, email)`.
3. Navega a `from` (si venía de ruta protegida) o `/dashboard`.
4. Si ya está autenticado, redirige automáticamente a `/dashboard`.

## `src/pages/DashboardPage.tsx`
Responsabilidad:
- Adaptador de ruta para reutilizar `Dashboard` existente.

Qué hace:
- Renderiza `<Dashboard />` sin alterar su lógica previa.

Por qué existe (aunque parezca opcional):
1. Mantiene separación entre capa de routing (`pages`) y capa de feature (`components`).
2. Facilita escalar luego con loaders, guards, tracking o layout específico de página sin tocar `Dashboard`.
3. Hace más consistente la arquitectura: cada ruta apunta a una `Page`.

Si el proyecto fuera muy pequeño, también sería válido rutear directo a `Dashboard`.

## `src/pages/PatientDetailPage.tsx`
Responsabilidad:
- Vista de detalle por parámetro de URL.

Qué hace:
1. Lee `id` con `useParams`.
2. Busca paciente por id.
3. Renderiza detalle o estado "no encontrado".

## `src/components/PatientCard.tsx` (modificado)
Cambio de Fase 3:
- Se añadió `Link` a `/paciente/:id`.

Importante:
- Se mantiene `React.memo` y lógica de performance de Fase 2.

## `package.json` (modificado)
Cambio de Fase 3:
- Se agregó dependencia `react-router-dom`.

---

## 5) Flujo runtime (paso a paso)

## Escenario A: usuario no autenticado entra a `/dashboard`
1. `ProtectedRoute` detecta `isAuthenticated = false`.
2. Redirige a `/login`.
3. Guarda origen en `state.from = "/dashboard"`.

## Escenario B: usuario hace login
1. `LoginPage` llama `login(name, email)`.
2. `AuthContext` guarda usuario en estado + localStorage.
3. `navigate(from)` envía al destino original (o `/dashboard`).

## Escenario C: usuario navega al detalle
1. Desde `PatientCard`, click en "Ver detalle".
2. URL cambia a `/paciente/p-1` (ejemplo).
3. `PatientDetailPage` lee `id` y muestra datos.

---

## 6) Coexistencia con Fase 2 (importante para entrevista)
En esta fase NO se reemplazó la optimización local:
- `useMemo` para filtro costoso en `Dashboard`.
- `useCallback` para callbacks estables.
- `React.memo` en `PatientCard`.
- `useRef` para foco y contador de renders.

Mensaje de arquitectura:
- Estado global (Auth + Router) y optimizaciones locales pueden coexistir sin conflicto.

---

## 7) Impacto de rendimiento: Context vs Zustand

## Context API
Ventaja:
- Nativo, simple, ideal para auth/tema/idioma.

Riesgo:
- Si cambia el `value`, consumidores re-renderizan.

## Zustand
Ventaja:
- Suscripción granular por selector (mejor control de renders).

Cuándo considerar:
- Estado global grande, dinámico y de alta frecuencia.

### ¿Qué es Zustand?
**Definición:**
Zustand es una librería de manejo de estado global para React basada en stores pequeños, con API simple y suscripciones por selector.

**¿Para qué sirve?**
1. Centralizar estado global sin prop drilling.
2. Reducir re-renders con suscripción granular (cada componente lee solo el slice que necesita).
3. Escalar mejor cuando el estado global crece o cambia muy seguido.

**Caso de uso típico:**
- Dashboard con múltiples paneles (filtros, métricas en tiempo real, preferencias de usuario, selección activa) donde distintos componentes consumen partes distintas del estado.

**Ejemplo básico de uso (conceptual):**
```ts
import { create } from "zustand";

interface AuthStore {
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (name, email) => set({ user: { name, email } }),
  logout: () => set({ user: null })
}));
```

Consumo por selector:
```ts
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
```

Idea clave:
- Con selectors, un componente no se re-renderiza por cambios de partes del store que no consume.

### ¿Qué es Redux?
**Definición:**
Redux es una librería de manejo de estado global con arquitectura predecible basada en un store central, acciones y reducers.

**¿Para qué sirve?**
1. Centralizar estado complejo en aplicaciones grandes.
2. Mantener flujos de actualización explícitos y auditables.
3. Integrar middleware para side effects (por ejemplo, async con thunk/toolkit).

**Caso de uso típico:**
- Aplicaciones enterprise con múltiples dominios de estado (auth, permisos, catálogo, carrito, notificaciones), reglas de negocio estrictas y necesidad de trazabilidad.

**Ejemplo básico de uso (conceptual con Redux Toolkit):**
```ts
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { name: string; email: string } | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    }
  }
});

export const { login, logout } = authSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer } });
```

Consumo conceptual en componente:
```ts
const user = useSelector((state: RootState) => state.auth.user);
const dispatch = useDispatch();
dispatch(login({ name: "Dev", email: "dev@example.com" }));
```

Idea clave:
- Redux prioriza consistencia y trazabilidad del flujo de estado, a cambio de más estructura/boilerplate.

---

## 8) Cuadro comparativo rápido
| Tema | Context API | Zustand | Redux |
|---|---|---|---|
| Complejidad inicial | Baja | Baja | Media |
| Dependencia externa | No | Sí | Sí |
| Granularidad de render | Media | Alta | Alta (con selectors) |
| Boilerplate | Bajo | Bajo | Medio/Alto (menor con Toolkit) |
| Trazabilidad del flujo | Media | Media | Alta |
| Caso ideal | Auth/tema/idioma | Estado global amplio y frecuente | Apps grandes con reglas estrictas y necesidad de auditoría |

---

## 9) Mini glosario de Fase 3
- `BrowserRouter`: integra URL + historial con React.
- `Routes`: evalúa rutas.
- `Route`: mapea URL a componente.
- `Outlet`: renderiza la ruta hija activa.
- `Navigate`: redirección declarativa.
- `NavLink`: link con estado activo.
- `useNavigate`: navegación por código.
- `useLocation`: lectura de ubicación/estado de navegación.
- `useParams`: lectura de parámetros dinámicos.
- `createContext`: crea canal de datos compartidos.
- `Provider`: publica valor del contexto.
- `useContext`: consume valor del contexto.

---

## 10) Preguntas de repaso (con respuesta)
1. ¿Por qué `ProtectedRoute` usa `Outlet`?
Respuesta: para actuar como "envoltorio" que decide si renderiza o redirige la ruta hija.

2. ¿Qué ventaja aporta `useLocalStorage` respecto a escribir `localStorage` en cada componente?
Respuesta: centraliza lógica reutilizable, evita duplicación y mantiene una interfaz consistente.

3. ¿Qué diferencia práctica hay entre `Navigate` y `useNavigate`?
Respuesta: `Navigate` es redirección declarativa en JSX; `useNavigate` es navegación imperativa desde código/eventos.

---

## 11) FAQ de decisiones de arquitectura (esta fase)

### 1) ¿Por qué crear `DashboardPage` en lugar de usar `Dashboard` directo en `App.tsx`?
Respuesta corta:
- Es una decisión de arquitectura para escalar mejor, no una obligación técnica.

Respuesta completa:
1. `Dashboard` queda enfocado en UI/lógica de dominio.
2. `DashboardPage` queda como frontera de ruta.
3. Si mañana agregamos lógica exclusiva de ruta (analytics, carga, permisos finos), la ponemos en `DashboardPage` sin ensuciar `Dashboard`.

### 2) ¿Por qué crear `useAuth` si se puede usar `useContext(AuthContext)` directamente?
Respuesta corta:
- Porque `useAuth` encapsula y estandariza el acceso.

Respuesta completa:
1. Centraliza la validación (error claro si no hay Provider).
2. Evita repetir imports/boilerplate en cada componente.
3. Si cambia la implementación interna del contexto, actualizas un solo lugar.
