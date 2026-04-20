# Glosario de React + Stack (Chequeo Rapido)

## A
- **Autoprefixer**: plugin de PostCSS que agrega prefijos CSS para compatibilidad cross-browser.

## B
- **Batching**: agrupacion de multiples actualizaciones de estado en un mismo ciclo para reducir renders.
- **Build**: proceso de generar artefactos optimizados para produccion.

## C
- **Cleanup (`useEffect`)**: funcion de limpieza que React ejecuta antes de rerun del efecto o al desmontar.
- **Commit Phase**: etapa donde React aplica cambios reales al DOM.
- **Component**: funcion (o clase) que devuelve UI declarativa en React.
- **Context API**: mecanismo de React para compartir datos entre componentes sin prop drilling.
- **createContext**: funcion que crea un contexto y su estructura de Provider/Consumer.

## D
- **Diffing**: comparacion entre arbol previo y nuevo para detectar cambios minimos.
- **DOM**: estructura de nodos que representa la UI en el navegador.

## E
- **Effect**: logica secundaria (API calls, subscriptions, logs, timers) que no pertenece al render puro.

## H
- **HMR (Hot Module Replacement)**: reemplazo de modulos en caliente sin recargar la pagina completa.
- **Hook**: API de React para agregar estado/ciclo de vida/logica reutilizable en componentes funcionales.

## I
- **Immutable Update**: actualizar creando nuevas referencias (arrays/objetos) en vez de mutar las existentes.

## J
- **JSX**: sintaxis declarativa que se transpila a llamadas de creacion de elementos React.

## K
- **`key`**: identificador estable en listas para preservar identidad entre renders.

## L
- **Lazy Initialization (`useState`)**: pasar una funcion al estado inicial para ejecutarla solo una vez al montar.

## M
- **Mount**: momento en que un componente se inserta por primera vez en el arbol.

## O
- **One-way Data Flow**: flujo unidireccional de datos: padre -> hijo por props; hijo notifica por callbacks.

## P
- **Provider (Context Provider)**: componente que publica el `value` del contexto a su subárbol.
- **Props**: datos de entrada de un componente, de solo lectura para quien los recibe.
- **PostCSS**: herramienta de transformacion de CSS usada por Tailwind/Autoprefixer.

## R
- **React Element**: objeto JS que describe que UI se quiere renderizar.
- **React.memo**: HOC que evita re-render de un componente si sus props mantienen igualdad superficial.
- **Reconciliation**: algoritmo de React para decidir que actualizar en el DOM.
- **Referential Equality**: dos referencias apuntan al mismo objeto/funcion en memoria (`a === b`).
- **Render Phase**: ejecucion de componentes para construir el nuevo arbol de elementos.

## S
- **State**: memoria interna del componente que persiste entre renders.
- **StrictMode**: modo de desarrollo para detectar patrones inseguros.

## T
- **Tailwind CSS**: framework utility-first para estilado basado en clases.
- **TypeScript**: superset tipado de JavaScript para detectar errores temprano.

## U
- **useCallback**: memoiza la referencia de una funcion entre renders cuando sus dependencias no cambian.
- **useContext**: lee el valor del contexto más cercano provisto por un Provider.
- **useMemo**: memoiza un valor computado para evitar recalculos costosos innecesarios.
- **useRef**: guarda un valor mutable persistente entre renders sin disparar render al cambiarlo.
- **Unmount**: momento en que el componente se elimina del arbol.
- **Updater Function**: forma de `setState(prev => next)` que usa estado previo confiable.

## V
- **Virtual DOM**: representacion en memoria del arbol UI que React compara en cada update.
- **Vite**: herramienta de desarrollo/build moderna, rapida en dev y optimizada en produccion.
