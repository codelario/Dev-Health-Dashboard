# Preguntas Tipo Examen - Phase 1 (con respuesta)

## 1) Diferencia entre `props` y `state`
**Respuesta corta:** `props` configuran desde afuera; `state` guarda memoria interna.

**Explicacion:**
- `props` vienen del padre y deben tratarse como read-only.
- `state` pertenece al componente y cambia con su setter (`useState`).

## 2) Por que el estado debe actualizarse de forma inmutable
**Respuesta corta:** React detecta cambios por referencia.

**Explicacion:**
- Si mutas un objeto existente, la referencia puede no cambiar.
- Si creas uno nuevo (`map`, spread), React detecta mejor que cambio y reconcilia de forma predecible.

## 3) Que hace `key` en listas y por que no usar index (si se reordena)
**Respuesta corta:** `key` define identidad estable entre renders.

**Explicacion:**
- Con `key` estable (`id`), React preserva el componente correcto.
- Con `index`, reordenamientos pueden mezclar estado local entre items.

## 4) Que significa que JSX sea “azucar sintactica”
**Respuesta corta:** JSX se transpila a llamadas JS (`createElement` o runtime JSX).

**Explicacion:**
- JSX no modifica DOM directo.
- Describe UI; React luego hace render/diff/commit.

## 5) Explica el ciclo `render -> diff -> commit`
**Respuesta corta:** React recalcula UI, compara contra la anterior y aplica solo cambios minimos al DOM.

**Explicacion:**
1. Render: ejecuta componentes.
2. Diff: compara arboles.
3. Commit: actualiza DOM real.

## 6) Que problema resuelve la updater function en `setState`
**Respuesta corta:** evita usar estado stale cuando hay actualizaciones encadenadas o batched.

**Explicacion:**
- `setX(prev => prev + 1)` garantiza partir del ultimo valor en cola.

## 7) Para que sirve `useEffect`
**Respuesta corta:** para efectos secundarios post-commit.

**Explicacion:**
- Ejemplos: fetch, logs, suscripciones, timers.
- Puede devolver cleanup para liberar recursos.

## 8) Cuando se ejecuta el cleanup de `useEffect`
**Respuesta corta:** en unmount y antes de rerun cuando cambian dependencias.

**Explicacion:**
- Evita fugas (event listeners, intervals, subscripciones).

## 9) Que aporta Vite en desarrollo
**Respuesta corta:** arranque rapido y HMR eficiente.

**Explicacion:**
- Sirve modulos bajo demanda, no bundlea todo al inicio.

## 10) Que cambia React 18 con batching automatico
**Respuesta corta:** agrupa mas actualizaciones para reducir renders innecesarios.

**Explicacion:**
- Mejora performance y consistencia de UI durante eventos.

## 11) Pregunta de chequeo rapido (la que ya vimos)
**Pregunta:** Por que `setPatients(current => ...)` es mas seguro que depender de variables cerradas?

**Respuesta:** porque usa el estado mas reciente de la cola de updates, evitando condiciones de carrera y stale closures.

## 12) Pregunta de chequeo rapido (la que ya vimos)
**Pregunta:** Que bug puede aparecer si usas `index` como key y reordenas la lista?

**Respuesta:** React puede asociar estado local al item incorrecto, mostrando datos o UI mezclada.

## Mini rubrica para autoevaluacion
- **Nivel basico:** respondes definiciones.
- **Nivel intermedio:** explicas causa-efecto en runtime.
- **Nivel entrevista senior:** conectas concepto + decision de arquitectura + tradeoff.

---

# Fase 2 - Rendimiento y Optimizacion

## 13) Diferencia entre `useMemo` y `useCallback`
**Respuesta corta:** `useMemo` memoiza valores, `useCallback` memoiza funciones.

**Explicacion:**
- `useMemo` evita recalculos costosos cuando no cambian dependencias.
- `useCallback` evita crear una nueva referencia de funcion cuando no cambian dependencias.

## 14) Que es igualdad referencial y por que importa
**Respuesta corta:** es comparar si dos referencias apuntan al mismo objeto/funcion.

**Explicacion:**
- React y `React.memo` dependen de comparaciones por referencia.
- Aunque dos objetos tengan mismo contenido, si son nuevas referencias se consideran distintos.

## 15) ¿Por qué es una mala idea envolver ABSOLUTAMENTE TODOS los componentes en `React.memo`?
**Respuesta:** porque `React.memo` tambien tiene costo (comparacion de props y complejidad extra). Si el componente es barato o cambia siempre, memoizar no aporta y puede empeorar rendimiento/mantenibilidad.

## 16) ¿En qué escenario específico el uso de `useCallback` sería totalmente inútil o incluso perjudicial?
**Respuesta:** cuando la funcion no se pasa a hijos memorizados ni se usa como dependencia donde importe la identidad. En ese caso solo agrega sobrecarga y ruido.

## 17) ¿Para qué sirve `createContext` y qué papel cumple el `Provider`?
**Respuesta corta:** `createContext` crea el canal de dato compartido y el `Provider` publica el valor para su subárbol.

**Explicacion:**
- `createContext` define la estructura del contexto.
- `Provider` entrega `value` a los componentes descendientes.
- Si `value` cambia, los consumidores de ese contexto se actualizan.

## 18) ¿Para qué se usa `useContext`?
**Respuesta corta:** para leer el valor del contexto más cercano.

**Explicacion:**
- Evita pasar props por múltiples capas cuando varios componentes necesitan el mismo dato.
- Es ideal para datos transversales como tema, usuario o idioma.

## 19) Diferencia entre Context API y librerías de estado global (ej. Zustand)
**Respuesta corta:** Context es nativo y simple; Zustand ofrece mejor granularidad para apps con estado global más grande y dinámico.

**Explicacion:**
- Context API funciona muy bien para dominios acotados (auth, tema, idioma).
- Cuando el `value` del Provider cambia, consumidores de ese contexto re-renderizan.
- Zustand permite suscripción por selector/slice, reduciendo renders innecesarios en escenarios de alta frecuencia.

## 20) ¿Qué reglas debe seguir un Custom Hook para ser válido?
**Respuesta corta:** debe seguir las Rules of Hooks y comenzar con `use`.

**Explicacion:**
- Debe comenzar con `use` (por convención y tooling).
- Solo puede llamarse en nivel superior de componente/hook (no en `if`, loops, callbacks).
- Debe mantener orden de llamadas estable entre renders.
- Puede componer otros hooks respetando exactamente estas reglas.
