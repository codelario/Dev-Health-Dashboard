# Phase 1.0 - Stack Foundation (Vite + TS + Tailwind)

## 1) Que es Vite y por que lo usamos
**Concepto:** Vite es un bundler/dev server moderno.

**Como funciona:**
- En desarrollo, no bundlea todo al inicio. Sirve modulos ES bajo demanda.
- Solo transforma el archivo que cambiaste (HMR rapido).
- En build, usa Rollup para generar assets optimizados.

**Por que importa para entrevistas:**
- Explica latencia baja en `pnpm dev`.
- Muestra criterio de DX (developer experience) y performance en tooling.

## 2) Flujo de arranque real del proyecto
```mermaid
flowchart LR
  A[index.html] --> B[src/main.tsx]
  B --> C[ReactDOM.createRoot]
  C --> D[React.StrictMode]
  D --> E[App]
  E --> F[Dashboard]
```

- `index.html` solo tiene `<div id="root"></div>`.
- `main.tsx` monta React en ese nodo.
- `StrictMode` (solo dev) ayuda a detectar efectos inseguros.

## 3) Arquitectura de carpetas
```mermaid
graph TD
  SRC[src/] --> C1[components/]
  SRC --> C2[hooks/]
  SRC --> C3[services/]
  SRC --> C4[types/]
  SRC --> C5[context/]

  C1 --> X1[UI + composicion]
  C2 --> X2[Logica reutilizable]
  C3 --> X3[Acceso a datos]
  C4 --> X4[Contratos TypeScript]
  C5 --> X5[Estado global futura fase]
```

## 4) TypeScript: configuracion clave (`tsconfig.app.json`)
- `strict: true`: evita errores comunes antes de runtime.
- `jsx: react-jsx`: transforma JSX sin importar `React` en cada archivo.
- `noEmit: true`: TS se usa para type-check; Vite hace el build.

## 5) Tailwind en este proyecto
- `tailwind.config.cjs` define donde escanear clases.
- `src/index.css` inyecta `@tailwind base/components/utilities`.
- Las clases utilitarias en JSX se convierten en CSS final solo si se usan.
