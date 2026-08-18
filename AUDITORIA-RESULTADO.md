# AUDITORÍA — Resultado (Etapa A)

**Fecha:** 2026-08-17 · **Commit auditado:** `3aca3d9` ("Redirección de dirección artística: El Programa")
**Método:** Playwright con viewport real (`browser_resize` verificado: `window.innerWidth` sí cambia — se
evitó el gotcha de §3.1), sondas de densidad e instrumentación en producción (`vite preview`, no dev server).
**Cobertura:** las 10 secciones vivas de `App.tsx` · 390 y 1440 medidos · ES y EN · teclado · build de producción.

> **Lo que NO se verificó, y se dice:** 768/1280/1920 no se midieron uno por uno (se derivan de los
> breakpoints entre 390 y 1440, ambos medidos). No se corrió Lighthouse (requiere Chrome headless con
> flags; las métricas de peso y FCP se midieron a mano contra el build de producción). No se perfilaron
> frames caídos con el panel de Performance. `prefers-reduced-motion` se auditó **por código**, no por
> emulación CDP — el hallazgo #3 es de lectura de código, no de observación en pantalla.

---

## Veredicto

El sitio está **bien construido y mal contado**. El contenido es sólido, verificable y honesto; el peso es
excelente (250 KB en producción contra un presupuesto de 1229); la accesibilidad tiene los cimientos puestos.
Pero el concepto "El Programa" **se quedó en el numeral romano**: existe en la marca tipográfica y no en el
ritmo, ni en las transiciones, ni en cómo entra la información.

Y hay algo peor que lo estético: **tres defectos funcionales reales** que hoy están en vivo — un acordeón
que abre tres paneles de un solo click, scroll horizontal en mobile en el idioma por defecto, y siete
controles invisibles en el orden de tabulación. La auditoría empezó buscando dirección de arte y encontró
primero bugs. Eso ordena las prioridades: **no se anima una composición que está rota.**

---

## Notas por sección (1–5)

| Sección | Comp. | Mov. | Dens. | Inter. | Clar. | En una frase |
|---|:--:|:--:|:--:|:--:|:--:|---|
| **Preloader** | 3 | 4 | 2 | **1** | 3 | La curva está bien hecha, pero cobra 3,5 s en cada carga, no se puede saltar y no recuerda la visita previa. |
| **Hero** | 4 | 3 | 4 | 4 | **5** | La mejor sección del sitio: retrato full-bleed, mosaico y firma. El movimiento es solo de entrada. |
| **AboutMe** | **2** | 2 | 3 | 2 | 4 | Columna centrada genérica; el marquee es su único gesto y es el único infinito sin guarda de `reduced-motion`. |
| **Crear (I)** | 3 | 2 | 3 | 3 | 4 | El numeral funciona en desktop; abajo de la foto queda una columna izquierda vacía muy grande. |
| **Enseñar (II)** | 2 | 2 | 3 | **1** | 3 | Acá vive el bug del acordeón, y en mobile "II" y "12" compiten como dos números rojos apilados. |
| **Producir (III)** | 3 | 2 | 3 | 3 | 4 | Tres listas en fila resuelven el volumen, pero es el Acto I espejado: rima de más. |
| **Trayectoria** | **4** | **1** | **2** | 3 | 4 | La espina es la mejor idea compositiva del sitio y la sección con **cero** movimiento y la densidad más baja (27,3%). |
| **Footer** | 2 | 1 | 3 | **1** | 4 | Su nav de 6 links sin `flex-wrap` es lo que rompe el ancho en mobile. |
| **Chrome global** | 3 | 2 | — | **2** | 4 | `ScrollProgress` es correcto; el Header deja 7 controles invisibles tabulables. |
| **NotFound** | 3 | 2 | 3 | 3 | 4 | Aislado a propósito y sin desbordes — pero el Preloader también le cobra 3,5 s a una página de error. |

---

## Instrumentación — los números

### (a) Negro muerto

La sonda del documento (§3.2a) da **7,6 %** de bandas totalmente vacías, y **subestima**: una banda con una
sola línea de 11 px cuenta como "viva". Se midió además la métrica que importa —**densidad de tinta**, área
pintada ÷ área de banda— y con umbral de 12 %:

| Métrica | Valor |
|---|---|
| Altura total (1440×900) | 7854 px |
| Negro efectivamente muerto | **1500 px = 19,1 %** |
| Tramos ≥300 px | 2 — `y 2000–2300` (borde AboutMe→Acto I) y `y 4900–5200` (borde Acto II→Acto III) |

**Densidad media por sección:** Producir 37,9 % · Crear 36,8 % · Enseñar 36,2 % · sobre-mí 30,9 % ·
Footer 29,5 % · **Trayectoria 27,3 %**.

Los dos tramos de 300 px son exactamente el `py-24 md:py-36` de una sección sumado al de la siguiente
(144 + 144 = 288 px). **El "espacio en negro" que se percibe no está repartido: está concentrado en los
bordes entre secciones**, que es justo donde hoy no pasa nada.

### (b) Inventario de movimiento

| Gesto | Dónde | Dispara | Anima | Dur. | `reduced-motion` | Clase |
|---|---|---|---|---|:--:|---|
| `Reveal` (fade + y16) | **15 usos**: Act ×6 (×3 actos), Trayectoria ×5, AboutMe ×3, Footer ×1 | scroll | `opacity`, `y` | 0.6 s | ✅ | Estructural → hoy **ruido por repetición** |
| Marquee archivo | AboutMe | autoplay ∞ | `x` | 34 s | ❌ **no** | Decorativa |
| Mosaico 3×3 | PillarMenu | hover/focus | `opacity`, `scale` | 0.3 s | ✅ | Estructural |
| Cortina + curva | Preloader | carga | `y`, path `d` | 0.8/0.7 s | ✅ | Estructural |
| Entrada retrato | Hero | carga | `opacity`, `y` | 1 s | ❌ | Estructural |
| Reveal del header | Header | scroll | `opacity`, `y` | 0.3 s | ❌ | Estructural |
| Barra de progreso | ScrollProgress | scroll | `scaleX` | — | ❌ (aceptable: es indicador) | Decorativa |
| Puntos con spotlight | BackgroundDots | mousemove | `mask` | — | ✅ | Decorativa |
| Ripple / press | Button | pointer | `scale` | 1.6 s | ✅ | Decorativa |
| Acordeón | CreditList, Trayectoria | click | `grid-template-rows` | 0.3 s | ✅ | Estructural |

**Diagnóstico:** 15 de ~20 gestos del sitio son el mismo `Reveal`. Todo lo que está debajo del Hero entra
exactamente igual. Además hay **8 duraciones distintas** (0.3 / 0.5 / 0.6 / 0.7 / 0.8 / 1 / 1.6 / 34) sin
sistema que las relacione.

### (c) Peso y fluidez — **esto está bien, no lo toquen**

| Métrica | Valor | Presupuesto | Estado |
|---|---|---|---|
| Primera vista (producción) | **250 KB** | ≤1229 KB | ✅ holgadísimo |
| Bundle JS | 464 KB crudo / **145 KB gzip** | — | ⚠️ un solo chunk, sin code-splitting |
| CSS | 35 KB / 7 KB gzip | — | ✅ |
| FCP (local, producción) | 260 ms | — | ✅ |
| `dist/` completo | 7,5 MB | — | ℹ️ son los derivados de imagen; no se transfieren |

---

## Hallazgos

### Bloque 1 — Defectos funcionales (arreglar antes que cualquier cosa estética)

**H1 · [A11Y + FE + CONT] · Severidad ALTA · Un click abre tres paneles.**
`src/components/CreditList.tsx:22,31` usa `key={c.work}` y `openWork === c.work`, pero en
`ensenar.coordCredits` hay **tres créditos llamados "Programa Adolescencia"** (una entrada por institución).
React tira `Encountered two children with the same key` en cada carga, y al hacer click en uno **los tres
quedan `aria-expanded="true"` a la vez** (verificado en el DOM, no supuesto).
*Por qué importa:* pasa en la sección de la credencial más larga de Nora (12 años), y quien lo ve piensa que
el sitio está roto — porque lo está. *Propuesta:* identidad por índice o por `work+years`. *Costo: S.*

**H2 · [FE + DA] · Severidad ALTA · Scroll horizontal en mobile, peor en español.**
El nav del `Footer` (`Footer.tsx`, `<nav className="flex items-center gap-6">`) tiene 6 links y
`flex-wrap: nowrap`. A 390 px mide **469 px en ES** y 421 en EN → el documento scrollea de lado:
**+103 px en ES, +55 px en EN**. El español es el idioma por defecto, así que el caso peor es el que ve
todo el mundo. *Propuesta:* `flex-wrap` + separadores, o nav en dos filas en mobile. *Costo: S.*

**H3 · [A11Y] · Severidad ALTA · Siete controles invisibles en el orden de tabulación.**
`Header.tsx` se oculta con `opacity: 0` + `pointer-events-none`, pero `visibility` sigue en `visible`: sus
**7 links/botones siguen siendo focusables** a scroll 0. Quien navega con Tab desde el skip link recorre 7
controles que no ve (y el anillo de foco no aparece en ningún lado). *Propuesta:* `inert` o
`visibility:hidden` cuando está oculto. *Costo: S.*

**H4 · [A11Y] · Severidad ALTA · El marquee no respeta `prefers-reduced-motion`.**
`AboutMe.tsx:84` — `repeat: Infinity`, 34 s, sin guarda. Es la **única animación infinita del sitio** y la
única sin protección; el resto del sitio sí la respeta (`BackgroundDots`, `PillarMenu`, `Preloader`,
`Reveal`, `Trayectoria`, `CreditList`, `Button`). Contradice §7.2 del propio contrato.
*Propuesta:* `useReducedMotion()` → marquee estático con scroll manual. *Costo: S.*
*(Menor, mismo origen: `Hero` y `Header` también animan sin guarda — impacto bajo porque son de entrada.)*

**H5 · [A11Y + FE] · Severidad MEDIA · 31 de 67 objetivos táctiles por debajo de 44 px.**
En 390 px: toggle de idioma **19×17 px**, íconos sociales 28×28, filtros de Trayectoria 22 px de alto,
links del Header 17 px. *Propuesta:* padding táctil sin cambiar la caja visual. *Costo: S–M.*

**H6 · [FE] · Severidad BAJA · `favicon.ico` 404** en cada carga. *Costo: S.*

### Bloque 2 — Composición y ritmo (el corazón del pedido)

**H7 · [DA + MOV] · Severidad ALTA · Los bordes entre secciones son el negro muerto.**
Evidencia: los dos únicos tramos ≥300 px sin tinta caen exactamente en `AboutMe→Acto I` y `Acto II→Acto III`.
No es que sobre aire adentro de las secciones: **falta algo en las costuras**. Hoy una sección termina y
empieza la otra, sin transición (confirmado: no hay ningún gesto entre secciones en el inventario).
*Propuesta:* que el borde sea un evento — hairline roja que se dibuja, o el numeral del acto siguiente
asomando antes de que la sección tome el viewport. Es el cambio con mejor impacto ÷ costo del informe.
*Costo: M.*

**H8 · [MOV] · Severidad ALTA · Un solo gesto para todo el sitio.**
15 usos de `Reveal` cubren prácticamente todo el contenido bajo el Hero. Cada Acto dispara 6 fades
idénticos; ×3 actos = 18 entradas iguales. *Por qué importa:* cuando todo entra igual, el movimiento deja
de comunicar jerarquía y pasa a ser un tic. *Propuesta:* reservar `Reveal` para el cuerpo; darle a los
titulares de acto un revelado por máscara línea a línea (`clip-path`/`overflow` + `y`), y al numeral +
foto un parallax leve con `useScroll`/`useTransform` (solo `transform`, cumple §7.2). *Costo: M.*

**H9 · [DA] · Severidad MEDIA · Los tres Actos riman de más.**
`align` alternado es variedad de layout, no de composición: Acto I y Acto III son la misma página espejada.
Y en Acto II el numeral **"II" compite con el "12"** de la estadística — dos números rojos apilados que en
mobile se leen como un error de numeración (captura `audit-390-ensenar.png`). *Propuesta:* que cada acto
tenga una **estructura** distinta, no un lado distinto; y que en el Acto II el "12" *sea* el numeral en vez
de convivir con él. *Costo: M–L.*

**H10 · [DA] · Severidad MEDIA · La columna izquierda de cada Acto se vacía.**
En desktop, bajo el numeral+foto queda una región vacía grande mientras la columna de texto sigue
(captura `audit-1440-hueco.png`). Es el costo no resuelto de la asimetría. *Propuesta:* que el material
(créditos) suba a ocupar esa columna, o que la foto ancle abajo. *Costo: M.*

**H11 · [DA + MOV] · Severidad MEDIA · Trayectoria: la mejor composición, sin una sola animación.**
Densidad 27,3 % (la más baja) y cero movimiento por ítem — decisión consciente en su momento, hoy es la
oportunidad más clara: la espina **pide** dibujarse con el scroll. *Propuesta:* `scaleY` de la línea atado a
`useScroll`, hitos entrando escalonados. Barato y es el momento memorable más obvio disponible. *Costo: S–M.*

**H12 · [DA] · Severidad MEDIA · El numeral se rompe en mobile.**
`clamp(6rem, 22vw, 13rem)` → en 390 px da **96 px**: el "I" se lee como un guioncito rojo accidental
(captura `audit-390-crear.png`). El dispositivo que sostiene todo el concepto desaparece justo donde más
gente lo va a ver. *Propuesta:* en mobile el numeral pasa a ser gran marca de fondo (detrás del texto, muy
bajo contraste) o crece de verdad. *Costo: S.*

**H13 · [DA] · Severidad MEDIA · El `ink` es plano en el 100 % de la superficie bajo el Hero.**
`BackgroundDots` vive solo en el Hero. No hay grano, viñeta ni fuente de luz en el resto.
*Propuesta:* grano SVG sutil + una viñeta radial por sección, con `opacity` muy baja. Resuelve el "negro
muerto" percibido sin agregar un color ni romper la paleta. Cuidado con el repaint. *Costo: S.*

### Bloque 3 — Interacción y contenido

**H14 · [CONT + MOV] · Severidad MEDIA · El Preloader cobra 3,5 s a todo el mundo, siempre.**
Derivado de constantes hardcodeadas (`Preloader.tsx`): 900 + 6×150 + 600 = 2400 ms hasta ocultarse,
+300 ms de delay +800 ms de salida = **3500 ms**. Sin forma de saltarlo, sin memoria de visita previa
(nada en `localStorage`), y **corre también sobre el 404**. *Por qué importa:* la productora irlandesa que
abre el link espera 3,5 s antes de ver un dato. *Propuesta:* mantenerlo en la primera visita, acortarlo a
~1,2 s, saltarlo con cualquier tecla/click, y no correrlo en el 404. *Costo: S.*

**H15 · [DA + CONT] · Severidad MEDIA (revisada a la baja) · El presente de Nora está casi ausente.**

> ⚠️ **Corregido durante la auditoría.** Este hallazgo se escribió como "el sitio no tiene una sola imagen
> actual de Nora" — cierto en el commit auditado (`3aca3d9`). **Mientras se auditaba, una sesión concurrente
> reemplazó el retrato del Hero** por un recorte de `DSC01503` (sesión de book actual), junto con cambios en
> `optimize-images.mjs` (acepta `.webp` como fuente), `generate-og-image.mjs` e `index.html`. Está en el
> working tree, **sin commitear**. La severidad baja de ALTA a MEDIA y el hallazgo se reescribe.

Con ese cambio el sitio ya tiene **una** imagen actual, y es la más visible: el retrato del Hero. Lo que
sigue faltando: las tres secciones de Acto siguen ilustradas **solo con archivo** (Rapiña 2017–2019,
Los golpes de Clara), no existe `#presente` (F6), y quedan **~111 fotos actuales sin usar** en
`external-assets/Norah_/` (41), `Rita Universos_/` (42, clown) y `polas/` (28).
*Por qué importa:* parte de la sensación de "le falta algo" **no es diseño, es contenido**. *Costo: M.*

*Nota de método:* las capturas de este informe son del commit `3aca3d9` y por lo tanto muestran el retrato
anterior. El resto de los hallazgos no se ve afectado por ese cambio (ninguno depende del retrato).

**H16 · [CONT] · Severidad MEDIA · Faltan las salidas del embudo.**
No hay `#contacto` (F7), ni `/cv` descargable (F7), ni `/archivo` (F8). El correo aparece como ícono en el
footer del Hero y como CTA en AboutMe. El sitio existe para que contraten a Nora y hoy no tiene una
sección de contacto. *Costo: M.*

**H17 · [MOV] · Severidad BAJA · Los estados cambian, no transicionan.**
Toggle de idioma, filtros de Trayectoria y `aria-pressed` cambian de golpe. *Costo: S.*

**H18 · [FE] · Severidad BAJA · Bundle en un solo chunk** (145 KB gzip). Con el peso total tan holgado no
es urgente, pero cuando entren F6/F8 (galerías) va a importar. *Costo: S.*

---

## Los 5 momentos que faltan

1. **La costura entre actos.** Hoy el borde es el vacío más grande del sitio (H7). Debería ser el momento
   en que el sitio *pasa de página*: la hairline roja cruzando, el numeral siguiente asomando.
2. **La espina de Trayectoria dibujándose.** 36 años trazándose con el scroll. La composición ya está —
   le falta el gesto (H11).
3. **El titular de cada acto entrando desde abajo de la línea.** Es el gesto más barato que separa un sitio
   editorial de un sitio con texto (H8).
4. **El presente de Nora.** No es un efecto: es la primera foto actual, en Dublín, con la que el visitante
   entiende que esto es alguien que trabaja hoy (H15).
5. **La llegada.** El Preloader entrega el Hero ya armado. Si el Hero *se armara* —retrato, firma, pilares
   entrando en secuencia— los 3,5 s dejarían de ser un peaje y pasarían a ser la obertura (H14).

---

## Lo que ya está bien y no hay que tocar

- **El peso.** 250 KB en primera vista contra 1229 de presupuesto, FCP 260 ms. El pipeline AVIF/WebP con
  manifest funciona. Cualquier propuesta que agregue material se mide contra esto.
- **El Hero completo** — retrato full-bleed, `PillarMenu` con mosaico, `BackgroundDots`, el reveal sticky.
  Es la mejor sección y es la firma del sitio.
- **La espina de Trayectoria como composición** (le falta movimiento, no rediseño).
- **Los cimientos de accesibilidad**: skip link primero en el orden, `:focus-visible` global sin `@layer`,
  cero trampas de foco, acordeones cerrados sin focusables ocultos.
- **El rigor de contenido.** Las 4 reglas se revisaron explícitamente y **están intactas**: no hay dato sin
  fuente, cada foto declara el rol, los créditos de fotografía están, y `Enseñar` sigue sin foto.
- **El 404**, aislado a propósito y sin desbordes.
- **La disciplina de `content.ts`**: cero strings hardcodeados, ES y EN con la misma forma.

---

## Cómo leer esto

Los hallazgos **H1–H6 no son opinables**: son defectos verificados con evidencia en el DOM. Se arreglan
primero, y son todos de costo S. Recién después tiene sentido discutir composición y movimiento —
animar una sección con scroll horizontal roto y un acordeón que abre de a tres no la mejora.

La regla de §4 aplica sin excepción: **estructura antes que superficie.**
