# AUDITORÍA Y ELEVACIÓN — Sitio de Nora Filmus

> **Cómo se usa:** abrí una sesión nueva de Claude Code en `C:\xampp\htdocs\norafilmus` y pegá:
> *"Leé `AUDITORIA.md` entero, después `CLAUDE.md` y `SUPERPROMPT.md`, y arrancá por la Etapa A.
> No escribas una línea de código hasta entregarme el informe de la Etapa A."*
>
> Este documento es la **segunda parte** del contrato: `SUPERPROMPT.md` construyó el sitio (F0–F5 +
> la redirección de dirección artística del 2026-08-17). Esto lo lleva de *"está bien hecho"* a
> *"esto es otra cosa"*. No lo reemplaza: lo continúa.

---

## 0. El pedido, en una frase

El sitio funciona, es honesto y está bien construido — **pero no es una experiencia.** Se lee como un
documento correcto, no como una obra. Hay aire muerto, hay negro sin intención, hay secciones que
entran con el mismo fade que la anterior, y hay decisiones que están *resueltas* pero no *diseñadas*.

El objetivo no es agregar efectos. Es que **cada scroll tenga una razón de ser** y que el sitio se
sienta hecho a mano de principio a fin, sin perder ni un gramo de rigor de contenido.

---

## 1. Rol — sos un jurado de cinco, no un opinador

No actuás como "un asistente que revisa". Actuás como **cinco especialistas mirando lo mismo al mismo
tiempo**, cada uno con veto sobre su dominio. Cada hallazgo del informe se firma con la lente que lo
detectó.

| Lente | Quién es | Qué pregunta hace | Qué le da igual |
|---|---|---|---|
| **DA** — Dirección de arte | Un director de arte de estudio editorial (piensa en programas de teatro, afiches, tapas de libro) | ¿Esta pantalla está *compuesta* o solamente *ordenada*? ¿Dónde está la tensión? | Si es difícil de programar |
| **MOV** — Diseño de movimiento | Alguien que hace motion para cine y web y sabe que el timing es actuación | ¿El movimiento *significa* algo o solo se mueve? ¿Qué pasa entre A y B? | Si "ya hay una animación ahí" |
| **FE** — Front-end de performance | Ingeniero que mide, no que estima: layout thrash, jank, CLS, peso | ¿Esto corre a 60fps en un celular de gama media? ¿Cuánto pesa el gusto? | Si "se ve bien en mi máquina" |
| **A11Y** — Accesibilidad e interacción | Alguien que navega con teclado y lector de pantalla todos los días | ¿Puedo usar esto sin mouse, sin animación y sin ver? | Si arruina un efecto |
| **CONT** — Estrategia de contenido | Editor que piensa en la productora irlandesa que abre el link | ¿En 15 segundos entiendo quién es y por qué me importa? ¿Sobra algo? | La estética, si no comunica |

**Regla del jurado:** un hallazgo que solo firma DA es una opinión. Un hallazgo que firman DA + CONT,
o MOV + FE, es un problema. Priorizá los que firman dos o más lentes.

---

## 2. Qué está en juego y qué no

### 2.1 Intocable (romper esto es fallar la auditoría, no mejorarla)

- **Las 4 reglas de contenido** del docblock de `src/i18n/content.ts` y de `SUPERPROMPT.md` §3:
  dato verificable · rol declarado en cada foto · crédito de fotografía · **cero menores identificables**.
  Ninguna mejora estética justifica tocar una de estas. La sección `Enseñar` sigue sin foto.
- **La paleta**: `ink` / `cream` / `brand-red` (+`red-deep`) y `brand-blue` muy puntual. Nada de tema
  claro, gradientes multicolor, glassmorphism, ni emojis como íconos.
- **El trío tipográfico**: Protest Riot (display) · Newsreader (body) · Quicksand (label) · la firma.
  Se puede ampliar el *uso* (itálicas, versalitas, mezclas, tamaños), no el *inventario*.
- **Todo el texto en `content.ts`, ES y EN.** Cero strings hardcodeados. Si una idea de diseño necesita
  una palabra nueva, esa palabra nace bilingüe.
- **El reveal del Hero** (`sticky top-0 z-0` tapado por la primera sección) es la firma del sitio.
- No importar nada de `norafilmus-legacy-v1/` ni de `norafilmus_v2/`.

### 2.2 Explícitamente en juego (acá sí quiero propuestas fuertes)

- **La composición de cada sección.** `Act.tsx` es un buen primer paso pero se repite tres veces; que
  sea la misma primitiva no obliga a que se vean iguales.
- **El vocabulario de movimiento entero.** Hoy es: `Reveal` (fade+16px) usado en casi todo, marquee,
  mosaico del `PillarMenu`, cortina del `Preloader`. Es poco para el nivel que se busca.
- **Las transiciones entre secciones.** Hoy no existen: una sección termina y empieza la otra.
- **La densidad y el uso del negro.** El `ink` plano es el 90% de la superficie del sitio.
- **Microinteracciones**: hover, focus, cursor, estados de los acordeones, el toggle de idioma,
  los filtros de `Trayectoria`, el scroll progress.
- **El contrato técnico de `SUPERPROMPT.md` §5**, si hay una razón fuerte. Ver §7.4 acá abajo:
  se puede *proponer* romperlo, no romperlo por las buenas.

---

## 3. Etapa A — Auditoría (primero, y sin tocar código)

**Salida obligatoria antes de escribir una sola línea:** `AUDITORIA-RESULTADO.md` en la raíz del repo.
Nada de "mientras leía lo arreglé". La auditoría es el entregable de esta etapa.

### 3.1 Cobertura — la matriz completa

Se audita **cada sección × cada viewport × cada lente**. Sin huecos, sin "el resto es parecido".

Secciones vivas hoy (confirmar contra `src/App.tsx`, puede haber cambiado — hay sesiones concurrentes):
`Preloader` · `Hero` (+`PillarMenu`, `BackgroundDots`, `LanguageToggle`) · `AboutMe` · `Crear` (Acto I) ·
`Ensenar` (Acto II) · `Producir` (Acto III) · `Trayectoria` · `Footer` · chrome global
(`Header`, `ScrollProgress`, skip link) · `NotFound`.

Viewports obligatorios: **360 · 390 · 768 · 1280 · 1440 · 1920**. Y además: **el scroll completo**, no
capturas sueltas — muchos de los problemas de esta auditoría son de *ritmo*, y el ritmo solo se ve en
la secuencia.

Estados obligatorios: ES **y** EN (el EN es más largo o más corto y rompe composiciones) ·
`prefers-reduced-motion: reduce` · navegación 100% con teclado · primera carga con caché frío.

> **Gotcha del entorno, ya verificado:** `mcp__claude-in-chrome__resize_window` **no cambia el viewport
> real del renderer** (`window.innerWidth` se queda en el tamaño de escritorio). Para los breakpoints usá
> `mcp__playwright__browser_resize`, o Chrome con emulación de dispositivo por CDP. Si verificás mobile
> con la herramienta equivocada, el informe miente — y el rediseño del 2026-08-17 ya quedó con mobile
> sin confirmar por exactamente esto.

### 3.2 Instrumentación — se mide, no se estima

Tres sondas concretas contra el dev server. Los números van al informe.

**(a) Cazador de negro muerto.** El reclamo principal del usuario es "espacios libres y/o en negro".
Convertilo en dato: recorré la página en bandas de 100px y medí qué fracción de cada banda tiene
contenido pintado. Toda banda por debajo del umbral es un hallazgo con su altura exacta y su sección.

```js
// Ejecutar en la consola del dev server (o vía browser_evaluate / javascript_tool)
(() => {
  const nodes = [...document.querySelectorAll('main *')].filter(el => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    const paints = el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    return paints || el.tagName === 'IMG' || s.backgroundImage !== 'none' ||
           (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== getComputedStyle(document.body).backgroundColor);
  });
  const top = window.scrollY, H = document.body.scrollHeight, band = 100, out = [];
  const boxes = nodes.map(el => { const r = el.getBoundingClientRect(); return { t: r.top + top, b: r.bottom + top, l: r.left, r: r.right }; });
  for (let y = 0; y < H; y += band) {
    const hits = boxes.filter(b => b.b > y && b.t < y + band);
    const cover = hits.length ? Math.max(...hits.map(b => b.r)) - Math.min(...hits.map(b => b.l)) : 0;
    out.push({ y, piezas: hits.length, anchoCubierto: Math.round(cover) });
  }
  const muertas = out.filter(o => o.piezas === 0);
  console.table(muertas);
  console.log('bandas totales', out.length, '· vacías', muertas.length,
              '· px muertos', muertas.length * band, `(${(muertas.length / out.length * 100).toFixed(1)}%)`);
})();
```

**(b) Inventario de movimiento.** Listá *toda* animación del sitio con: qué la dispara, qué propiedades
anima, duración, ease, y si respeta `prefers-reduced-motion`. Si dos cosas distintas usan la misma
animación, es un síntoma (hoy: `Reveal` en todo). Marcá cada una como **estructural** (comunica algo),
**decorativa** (linda) o **ruido** (no aporta y cuesta).

**(c) Peso y fluidez.** `npm run build` y el desglose del bundle · peso transferido de la primera vista
(presupuesto vigente: **≤1.2 MB**, `SUPERPROMPT.md` §5.2) · Lighthouse mobile y desktop, las cuatro
métricas · CLS real durante el scroll · frames caídos durante el `Preloader`, el marquee y el mosaico
del `PillarMenu` (Performance panel, no impresiones).

### 3.3 Los sospechosos conocidos — verificalos, no los asumas

Esta lista sale de leer el código, no de mirar el sitio. Cada punto se **confirma o se descarta con
evidencia** en el informe. Y si el problema real es otro, el informe manda, no esta lista.

1. **El negro es plano y constante.** `bg-ink` sólido en `AboutMe`, los tres Actos, `Trayectoria` y
   `Footer`. `BackgroundDots` vive solo en el Hero. No hay variación de valor, textura, grano, viñeta ni
   profundidad en ~90% de la superficie. → *¿Cómo se construye profundidad sin agregar un color?*
2. **Un solo gesto de entrada para todo.** `Reveal` = `opacity 0→1` + `y 16→0`, 0.6s, mismo ease, en
   cada pieza de cada sección. Correcto y monótono. → *¿Qué merece entrar distinto, y por qué?*
3. **Cero transición entre secciones.** Las secciones se apilan; el único momento de transición real del
   sitio es el Hero sticky. → *¿Y si cada acto entrara como entra un acto?*
4. **Tres actos que riman de más.** `Act.tsx` con `align` alternado es variedad de layout, no de
   *composición*. Acto I y Acto III siguen leyéndose como la misma página dos veces.
5. **El numeral romano es el único gesto tipográfico grande** fuera del Hero. Hay una display de
   carácter (Protest Riot) usada casi solo para titulares centrados de una línea.
6. **`Trayectoria` es la sección con más contenido y la menos diseñada** en proporción: 34 hitos, un
   filtro, cero animación por ítem (decisión consciente en su momento — reevaluarla ahora).
7. **`CreditList` es el corazón interactivo del sitio** (tres secciones lo usan) y su interacción es un
   acordeón. → *¿Es la mejor forma de mostrar un cast list?*
8. **Mobile sin verificar** desde la redirección del 2026-08-17. Los `md:` de `Act.tsx` y la espina de
   `Trayectoria` están escritos con criterio pero nunca vistos en una pantalla angosta real.
9. **Huecos de contenido que se leen como huecos de diseño:** faltan `#presente` (F6 — **el sitio
   todavía no tiene una sola imagen actual de Nora**), `#contacto` (F7), `/cv` (F7) y `/archivo` (F8).
   La sensación de "le faltan cosas" puede ser, en parte, exactamente esto. Decilo en el informe si es así.
10. **Microinteracciones sin diseñar:** hover de links del `Header`/`Footer`, estados del
    `LanguageToggle`, los filtros de `Trayectoria`, el `ScrollProgress` (¿aporta o es cliché?), el cursor.
11. **Paridad ES/EN visual**, no solo textual: mismo diseño con textos de largo distinto.
12. **El `Preloader` cobra un peaje** de segundos en cada carga. → *¿Se gana lo que cuesta? ¿Qué ve
    alguien que llega por segunda vez?*

### 3.4 Formato del informe (`AUDITORIA-RESULTADO.md`)

- **Veredicto en 5 líneas.** Qué es hoy el sitio y qué le falta para ser lo que se busca. Sin diplomacia.
- **Nota por sección, 1–5**, en cinco ejes (composición · movimiento · densidad · interacción · claridad),
  con **una frase de justificación por nota**. Una tabla, se lee de un vistazo.
- **Hallazgos numerados**, cada uno con: `[lente(s)] · [severidad B/M/A] · evidencia (captura, número o
  `archivo:línea`) · por qué importa · qué se propone · costo estimado (S/M/L)`.
- **Los 5 momentos que faltan.** No hallazgos: oportunidades. Los cinco instantes que hoy no existen y
  que harían que alguien se acuerde del sitio.
- **Lo que ya está bien y no hay que tocar.** Explícito. Evita que el rediseño rompa lo que funciona.

**Alto obligatorio.** Terminado el informe, parás y se lo mostrás al usuario. La Etapa B no arranca sin
que el usuario elija qué entra.

---

## 4. Etapa B — Plan de elevación

Del informe sale un plan de fases `E1…En`, no una lista de tareas. Cada fase:

- un **nombre y una tesis** (qué cambia de la experiencia, no qué archivos toca);
- los hallazgos que cierra (por número);
- entregable verificable + captura;
- estimación honesta.

**Ordenadas por impacto ÷ costo, no por comodidad.** Y el orden lo confirma el usuario antes de empezar.

Regla de secuencia: lo que arregla **estructura** (composición, ritmo, densidad) va antes que lo que
arregla **superficie** (transiciones, microinteracciones). Animar una composición floja la deja floja
y en movimiento.

---

## 5. Etapa C — Ejecución

Se ejecuta fase por fase, con alto y revisión del usuario al cerrar cada una. Por fase:

1. `npm run lint` limpio (`tsc --noEmit`) y `npm run build` verde.
2. Verificación **visual en navegador real** a 360 / 768 / 1440. No alcanza con que compile — y
   acordate del gotcha de `resize_window` (§3.1).
3. `prefers-reduced-motion` verificado a mano en esa fase.
4. Teclado: recorrido completo con Tab sin trampas de foco, foco siempre visible.
5. Las 4 reglas de contenido intactas (revisión explícita, no supuesto).
6. Presupuesto de peso re-medido si la fase agregó material.
7. `CLAUDE.md` → "Estado actual" actualizado con lo que realmente pasó.
8. Un commit por fase, mensaje en español, descriptivo. Sin push salvo pedido.

**Sesiones concurrentes:** el usuario corre varias sesiones sobre este repo. Antes de editar un archivo
que no creaste en esta sesión: `git status` + mtime, y releelo si cambió. Nunca `git checkout --` ni
`git reset --hard` sobre trabajo ajeno.

**Reporte honesto:** si una fase queda a medias se dice qué falta y por qué. Si algo no se pudo
verificar, se dice que no se verificó — no se reporta como hecho.

---

## 6. El estándar de "experiencia única"

Para que no sea una palabra vacía, así se evalúa. Un sitio de este nivel cumple las seis:

1. **Tiene un concepto y se nota sin explicarlo.** Acá el concepto ya existe: **"El Programa"** — el sitio
   se lee como un programa de teatro (Actos, cast list, paper trail). La pregunta de la auditoría no es
   *cuál es el concepto*, es **¿está llevado hasta el final o se quedó en el numeral romano?**
2. **El movimiento es actuación, no decoración.** Cada animación tiene intención, timing y peso. Un
   objeto que entra tiene inercia. Nada dura 0.6s porque sí.
3. **Hay al menos un momento que se recuerda.** Uno solo, bien hecho, vale más que veinte efectos.
4. **La densidad respira pero no se vacía.** El aire es composición; el aire sin razón es un hueco.
   La diferencia se ve en si el ojo *va a algún lado* o se queda flotando.
5. **Es impecable en los bordes.** Hover, focus, estados vacíos, 360px, teclado, `reduced-motion`, EN.
   Ahí es donde se distingue el trabajo terminado del trabajo entregado.
6. **Nunca le cuesta al lector.** Ni un dato tarda más de 400ms en poder leerse por culpa de una
   animación. Cero scroll-jacking. Si el efecto pelea con la lectura, gana la lectura — el sitio existe
   para que contraten a Nora.

---

## 7. Movimiento — el marco para proponer

### 7.1 Presupuesto de movimiento

**Máximo un gesto protagonista por sección.** El resto acompaña. Si todo se mueve, nada se mueve.

### 7.2 Reglas duras (no negociables)

- Animar **solo `transform` y `opacity`** en cualquier cosa atada al scroll o que corra por más de
  200ms. `width`/`height`/`top`/`left`/`filter` en scroll = jank garantizado en mobile.
- Ease canónico `EASE_REVEAL` de `lib/ease.ts` como default. Un ease distinto es una decisión que se
  justifica en el docblock, no una variación al azar.
- `prefers-reduced-motion` en **todo** lo nuevo, siempre, sin excepción.
- Cero scroll-jacking, cero scroll hijacked horizontal que atrape al usuario, cero autoplay con sonido.
- Nada que dependa de hover para funcionar (hay `lib/hooks/use-hover-capable.ts` — usalo).
- **Gotcha documentado:** el `useReducedMotion` de `motion/react` rompe la cadena de `setTimeout` del
  `Preloader`. Si tocás el `Preloader`, probá el flujo completo del loader antes de darlo por bueno.

### 7.3 Direcciones a explorar (sugerencias, no órdenes — el informe decide)

Todas son implementables con `motion` + CSS, sin librerías nuevas:

- **Tipografía como material:** revelado por máscara (`clip-path` / `overflow-hidden` + `y`) línea por
  línea o palabra por palabra en los titulares de acto — no fade, *entrada desde debajo de una línea*.
  Es el gesto más barato y el que más eleva un sitio editorial.
- **Parallax de capas con `useScroll` + `useTransform`** entre el numeral romano, la foto y el texto:
  el numeral se mueve más lento que la columna. Da profundidad al negro plano sin agregar un color.
- **Transición entre actos:** una hairline roja que se dibuja de borde a borde al entrar cada acto, o el
  numeral del acto siguiente asomando antes de que la sección tome el viewport.
- **Textura en el `ink`:** grano SVG muy sutil, viñeta radial, o una sola fuente de luz — resuelve el
  "negro muerto" sin romper la paleta. Barato y transformador. Cuidado con el peso y con el repaint.
- **`CreditList` con vista previa al hover** en desktop (la imagen del crédito siguiendo el puntero,
  con `clamp` en `useMousePositionRef` — gotcha ya conocido) y acordeón en touch.
- **`Trayectoria` con la línea dibujándose con el scroll** (`scaleY` atado a `useScroll`) y los hitos
  entrando escalonados desde el lado de su disciplina.
- **Cursor propio** solo si sostiene el concepto (ej. lee "ver" sobre una foto). Si es un puntito que
  sigue al mouse, es ruido: no va.
- **Transiciones de estado del `LanguageToggle` y de los filtros** — hoy cambian, no transicionan.
- **Momento de llegada:** hoy el `Preloader` entrega el Hero ya armado. ¿Y si el Hero *se arma*?

### 7.4 Cómo se propone romper el contrato técnico

`SUPERPROMPT.md` §5 dice: sin GSAP, sin Lenis, sin librerías de UI nuevas. Si el informe concluye que
una de esas es necesaria (scroll suave real, timelines complejos), **no la instales**: escribí en el
informe un ítem con `qué se gana · qué pesa en KB · qué se puede hacer sin ella · qué se pierde si no`,
y que el usuario decida. Una dependencia nueva es una decisión del proyecto, no de la fase.

---

## 8. Preguntas para el usuario — solo estas, y todas juntas

Al cerrar la Etapa A, en una sola tanda (no de a una, no bloqueantes salvo la última):

1. **Alcance:** ¿esta auditoría cubre solo lo construido (F0–F5) o también arranca F6 Presente / F7
   Contacto+CV / F8 Archivo? *(El sitio no tiene una sola foto actual de Nora — F6 puede ser la mejora
   de experiencia más grande disponible, y es contenido, no efectos.)*
2. **Apetito:** ¿pulido quirúrgico sobre lo que hay, o se aceptan rediseños completos de sección?
3. **Dependencias:** ¿autoriza evaluar una librería nueva si el informe la justifica (§7.4)?
4. **Prioridad:** si hubiera que elegir uno — *impresionar* a una productora irlandesa en 15 segundos,
   o que Nora pueda mandar el link sin explicar nada. Los dos se pueden, pero uno ordena las decisiones.
5. **Material:** ¿llegaron las respuestas de Nora del artifact *"Nora, falta esto"*? Varias mejoras de
   contenido dependen de eso (`SUPERPROMPT.md` §8).

---

## 9. Cómo correr esto — herramientas recomendadas

- **Etapa A, las cinco lentes:** conviene correr las lentes **en paralelo con subagentes** (DA+CONT en
  uno, MOV+FE en otro, A11Y en otro) y consolidar. El agente `elite-architect-perfectionist` está
  disponible para las lentes DA/FE. *Requiere que el usuario lo pida explícitamente.*
- **Navegador:** `mcp__playwright__browser_*` para viewports y medición (`browser_resize` sí funciona);
  `mcp__claude-in-chrome__*` como alternativa si Playwright está tomado por otra sesión. Para las sondas
  de §3.2: `browser_evaluate` / `javascript_tool`.
- **Revisión de código:** `/code-review high` sobre el diff de cada fase de ejecución. Para una pasada
  profunda del sitio entero, el usuario puede correr `/code-review ultra` (es user-triggered, no lo
  lances vos).
- **Informe presentable:** publicá `AUDITORIA-RESULTADO.md` como **Artifact** (con las capturas
  embebidas) para que el usuario lo lea cómodo y lo pueda compartir. Cargá la skill `artifact-design`
  antes de escribirlo.
- **Mockups antes de programar:** para las secciones con rediseño completo, la skill `design` arma un
  canvas multi-artboard — más barato iterar ahí que en React.
- **`prefers-reduced-motion`:** emulación por CDP (`Emulation.setEmulatedMedia`), no confíes en el
  setting del sistema.

---

## 10. Criterio de éxito de esta auditoría

No es "se ve más lindo". Es esto, y se verifica:

1. El usuario abre el sitio y **no encuentra un solo espacio en negro que no esté ahí a propósito** —
   y puede decir para qué está cada uno que quedó.
2. Un scroll completo tiene **al menos un momento que se recuerda** y ninguno que moleste.
3. Las cinco notas por sección de §3.4 suben, y el informe final muestra el antes/después.
4. Lighthouse **≥95 en las cuatro** categorías, mobile incluido, con todo el movimiento nuevo adentro.
5. 360px, teclado y `reduced-motion` **verificados de verdad**, no supuestos.
6. Las 4 reglas de contenido siguen intactas — y se dice explícitamente que se revisaron.
7. `CLAUDE.md` refleja el estado real al terminar.
