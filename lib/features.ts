/**
 * Flags temporales de "esto todavía no está pronto para producción" — no es
 * un sistema de feature flags general, es la salida documentada para el
 * pedido puntual de 2026-09-09: "en la version de produccion dejemos afuera
 * el timeline de todos lados, menu, etc., hasta que lo tengamos pronto y
 * funcional".
 *
 * **Hardcodeado a `false`, no `import.meta.env.DEV`** (ajuste el mismo día,
 * pedido aparte: "ocultalo ahora para dev también, no quiero confundirme con
 * lo que subo") — la versión anterior mostraba Trayectoria/el formulario en
 * `npm run dev` y los escondía solo en el build de producción, que es
 * exactamente la distinción que generaba la confusión. Ahora dev y prod se
 * ven igual. Para seguir trabajando en Trayectoria o en el formulario
 * localmente, cambiar el `false` de la flag correspondiente a `true` a mano
 * un rato (no commitear ese cambio) y devolverlo a `false` antes de subir.
 * Cuando cada pieza esté lista de verdad, borrar su flag entera y los
 * `_ENABLED &&`/`_ENABLED ?` que la usan (`App.tsx`, `Hero.tsx`,
 * `Header.tsx`, `Footer.tsx` para Trayectoria; `Contacto.tsx` para el
 * formulario) — no hace falta ningún otro cambio.
 */
export const TRAYECTORIA_ENABLED = false;

/**
 * Mismo mecanismo, mismo día (2026-09-09), pedido aparte: "ocultemos el
 * formulario mientras tanto" — el backend PHP (`public/api/contact.php`)
 * está armado pero nunca se verificó una entrega real de mail en un hosting
 * de producción (ver CLAUDE.md, entrada "Pivot: backend PHP propio"). Oculta
 * `ContactForm` en `Contacto.tsx` en dev y en producción por igual (ver nota
 * de arriba). Cuando el mail esté confirmado en producción, borrar este flag
 * y el `CONTACT_FORM_ENABLED &&` que lo usa.
 */
export const CONTACT_FORM_ENABLED = false;

/**
 * Mismo mecanismo, 2026-09-10, pedido aparte: "sacá esto por ahora... luego
 * lo agregamos" — "Dejá tu huella / Firmá el programa" (`SignatureWall`) no
 * tiene la persistencia real todavía lista para producción (ver CLAUDE.md,
 * "Pivot: backend PHP propio" — la escritura a `public/data/signatures.json`
 * es del mismo lote que el formulario, nunca verificada en un hosting real).
 * Oculta `SignatureWall` en `Contacto.tsx`. Cuando esté lista, borrar este
 * flag y el `SIGNATURE_WALL_ENABLED &&` que lo usa.
 */
export const SIGNATURE_WALL_ENABLED = false;
