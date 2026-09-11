# Nora Filmus — plan integral de experiencia visual

Este documento define la ejecución para llevar el sitio desde un portfolio
artístico sólido a una experiencia editorial digital memorable, manteniendo la
dirección artística **El Programa**.

## Objetivo

La visita debe tener una dramaturgia clara: reconocer a Nora, entender sus tres
prácticas, explorar el programa, leer su trayectoria y llegar a Contacto con una
invitación clara a trabajar con ella.

## Principios

- Mantener ink/cream/rojo, numerales, costuras, grano, cast list y espina.
- No convertir el sitio en una landing genérica.
- No sumar sombras, cursores custom, GSAP ni blur de área grande.
- Reusar primitivas existentes antes de crear componentes nuevos.
- Toda imagen nueva pasa por el pipeline y tiene crédito verificable.
- Toda animación respeta reduced motion.
- Toda interacción funciona con teclado, foco visible y touch target mínimo.
- No inventar contenido, roles, años, fotos ni créditos.

## Fases

### Fase 0 — Alinear sistema

Revisar tokens, contraste, radios, sombras, fuentes, foco, `inert`, targets,
reduced motion y uso de `Picture`. Eliminar la sombra de `Act.tsx`, reservar
`font-signature` para la marca y añadir estado activo al Header.

### Fase 1 — Obertura y Home

Separar visualmente presencia, presentación y programa en el Hero. Reducir la
competencia entre fotografía, logo, bio, credenciales, pilares y redes. Revisar
la tira de credenciales para que se sienta editorial y no corporativa. Refinar
AboutMe y convertir ProgramIndex en un índice teatral completo, especialmente
en mobile.

### Fase 2 — Diferenciación material de rutas

- `/crear`: afiche, escena, marco duro y cast list.
- `/ensenar`: cuaderno, anotaciones, renglón y proceso.
- `/producir`: dossier, índices y expediente.
- `/trayectoria`: archivo vivo, espina y etapas narrativas.
- `/contacto`: cierre real del programa, email protagonista y formulario como
  ficha de producción.

Cada ruta debe ser reconocible por su composición, no solo por su ícono, sin
romper la identidad común.

### Fase 3 — Jerarquía de contenido

Seleccionar 2–3 créditos principales por Acto con datos verificables. Mostrar
rol y tipo de trabajo con mayor claridad, indicar funcionalmente qué créditos
tienen foto/video y conservar el acordeón para el detalle completo.

### Fase 4 — Navegación y microinteracciones

Añadir estado de ruta activa, retorno claro al programa, transiciones con
función real y estados hover/focus equivalentes. Mantener el monograma NF como
hilo conductor, pero diferenciar el loader inicial de la transición de página.

### Fase 5 — Responsive, accesibilidad y performance

Verificar 390, 640, 768, 1024 y 1440px con viewport real. Revisar overflow,
contraste, foco, labels bilingües, targets, reduced motion, LCP y TBT en build
de producción. No sacrificar decisiones de marca sin medir antes y después.

### Fase 6 — Auditoría final

Recorrer Home y todas las rutas de punta a punta, revisar desktop, mobile,
teclado y reduced motion, comparar contra este plan, documentar decisiones no
obvias y actualizar `CLAUDE.md` con el estado real.

## Orden de implementación

1. Fase 0: correcciones sistémicas de bajo riesgo.
2. Fase 1: Hero, AboutMe y ProgramIndex.
3. Fase 2: rutas y Contacto.
4. Fase 3: créditos.
5. Fase 4: navegación y motion.
6. Fase 5: responsive, accesibilidad y performance.
7. Fase 6: auditoría y documentación.

Cada fase debe cerrar con revisión de diff, lint, build y recorrido visual antes
de abrir la siguiente.

## Primera entrega

- Eliminar la sombra contradictoria de `Act.tsx`.
- Reservar `font-signature` para la marca y no para índices editoriales nuevos.
- Añadir estado de ruta activa al Header.
- Revisar contraste y targets en los componentes tocados.
- Validar con `npm run lint` y `npm run build`.

## Registro

| Fecha | Decisión |
|---|---|
| 2026-09-07 | Se conserva “El Programa” como dirección artística central. |
| 2026-09-07 | No se agregan sombras, cursores custom, GSAP ni blur de área grande. |
| 2026-09-07 | Se empieza por correcciones sistémicas antes de rediseñar el Home. |
