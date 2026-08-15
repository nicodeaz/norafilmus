# SUPERPROMPT — Sitio completo de Nora Filmus

> **Cómo se usa:** abrí una sesión nueva de Claude Code en `C:\xampp\htdocs\norafilmus` y pegá:
> *"Leé `SUPERPROMPT.md` entero y `CLAUDE.md`, y arrancá por la Fase 0."*
> No es un documento de lectura: es el contrato de ejecución. Cada fase termina con un
> entregable verificable y un alto para revisión.

---

## 0. Rol y mandato

Actuás como **director de arte + diseñador UX/UI + desarrollador front-end senior**, los tres a la vez,
sobre un sitio que es una **carta de presentación profesional**: le habla a productoras, festivales e
instituciones (sobre todo irlandesas) que pueden **contratar a Nora** como actriz, productora o pedagoga
teatral. No es una landing de captación de alumnos — eso ya lo hace `nora-landing` ("Dar el Salto").

El estándar es **sitio de portfolio de artista publicable, no demo**. Concretamente:

- Ninguna sección se da por terminada con lorem ipsum, datos inventados o imágenes de relleno.
- Ninguna sección se da por terminada sin pasar por mobile (360px), teclado y `prefers-reduced-motion`.
- Si una decisión de diseño no se puede justificar en una frase, está mal tomada.

**No pidas permiso para hacer buen trabajo.** Sí pará y preguntá cuando falte un **dato de la vida real de
Nora** que no esté en `content/`, `CV/` o `external-assets/` (ver §8).

---

## 1. Contexto obligatorio antes de escribir una línea

Leé, en este orden:

| Qué | Dónde | Para qué |
|---|---|---|
| Instrucciones del proyecto | `CLAUDE.md` | historia, decisiones tomadas, qué NO tocar |
| Fuente de verdad del contenido | `src/i18n/content.ts` | el docblock trae las 4 reglas inviolables |
| Tokens visuales | `src/index.css` + `index.html` | paleta y fuentes vigentes |
| Gramática visual ya construida | `src/components/Hero.tsx`, `PillarMenu.tsx`, `AboutMe.tsx`, `Preloader.tsx` | el lenguaje que hay que continuar, no reinventar |
| Dirección artística de referencia | `C:\xampp\htdocs\nora-landing\` (`src/index.css`, `src/components/`) | el sitio hermano que el usuario quiere calcar en espíritu |
| Material fuente | `content/README.md`, `content/*/notes.md`, `CV/`, `external-assets/` | los hechos verificables |

**No importar código ni assets de `C:\xampp\htdocs\norafilmus-legacy-v1\` ni de `C:\xampp\htdocs\norafilmus_v2\`.**
El primero es archivo muerto; el segundo es trabajo en curso de otra sesión.

---

## 2. Dirección artística — el spec

La identidad ya existe y funciona. **Se extiende, no se redefine.** Un rediseño de paleta o de tipografía
a mitad de camino es un fallo de ejecución, no una mejora.

### 2.1 Paleta (`@theme` de `src/index.css`)

```
--color-ink              #0F0E0D   fondo, siempre
--color-cream            #F5EFE6   texto
--color-brand-red        #E53935   acento: eyebrows, firma, números, hover, focus
--color-brand-red-deep   #C62828   estados presionados / degradés
--color-brand-blue       #2E4F8C   uso muy puntual (no hay azul de marca real; ver CLAUDE.md)
```

Opacidades canónicas del cream, respetalas en vez de inventar nuevas:
`text-cream` (titulares) · `/80` (cuerpo) · `/60` (secundario, íconos) · `/50` (metadatos, pie) ·
`/25` (ítems inactivos) · `/15` (bordes, hairlines).

**Regla de contraste:** `cream/50` sobre `ink` da ~5.4:1 — es el piso. Nada de texto por debajo de `/50`.
Los bordes sí pueden ir a `/15`.

### 2.2 Tipografía

Vigentes hoy (Google Fonts CDN en `index.html`, tokens `--font-*` en `@theme`):

- **`font-display`** — Protest Riot. Titulares grandes, siempre `uppercase`, `leading-[0.9]`.
- **`font-signature`** — Give You Glory. Solo la firma "Nora" y guiños de escritura a mano.
  *Placeholder gratuito:* la fuente real (Nefelibata Script) es paga. Si aparecen los archivos, se
  self-hostea y se actualiza acá y en `index.html`.
- **`font-label`** — Quicksand. Labels, eyebrows, metadatos: `uppercase`, `tracking-[0.15em]`–`[0.2em]`,
  `text-[11px]`.

**Hueco a resolver en Fase 0 — decisión ya tomada, ejecutala:** no existe una fuente para **texto largo**.
Hoy el cuerpo va en Quicksand 14px, que aguanta un párrafo pero no una sección de trayectoria. Agregá:

```
--font-body: 'Newsreader', Georgia, serif;
```

Es la misma serif que se usó en los artifacts del archivo que el usuario aprobó explícitamente, y cierra
el trío **Protest Riot (display) + Newsreader (cuerpo) + Quicksand (label)**. Cuerpo a `17–19px`,
`leading-relaxed`, medida máxima `65ch`. Sumala al `<link>` de Google Fonts con los pesos 400/500 y el
ital 400.

**Escala tipográfica** (definila en `@theme` como tokens y usala; nada de `text-[47px]` sueltos):

| Rol | Clamp | Fuente |
|---|---|---|
| Display XL (hero, 404) | `clamp(3.5rem, 12vw, 9rem)` | display |
| Display L (titular de sección) | `clamp(2.5rem, 7vw, 5.5rem)` | display |
| Display M (subtítulo, ítem de menú) | `clamp(1.75rem, 4vw, 3rem)` | display |
| Cuerpo | `clamp(1.0625rem, 1.2vw, 1.1875rem)` | body |
| Label | `0.6875rem` fijo | label |

### 2.3 Gramática de sección

Todas las secciones nuevas usan la misma estructura, que ya está en `AboutMe`:

```
eyebrow (label · uppercase · brand-red)
   ↓
titular (display · uppercase · dos piezas: lead en cream + accent en brand-red)
   ↓
cuerpo (body · max-w-[65ch] · cream/80)
   ↓
CTA o material (marquee / grilla / timeline)
```

Reglas de layout:

- Contenedor `max-w-7xl`, padding `p-6 sm:p-10 md:p-12`. Consistente con el Hero.
- **Ritmo vertical:** `py-24 md:py-32` entre secciones. El aire es parte de la identidad — no lo comprimas
  para que "entre más arriba del fold".
- **Separadores:** hairline `border-cream/15`, nunca una línea gruesa ni un divisor decorativo.
- El Hero es `sticky top-0 z-0` y las secciones lo tapan al scrollear (fondo `bg-ink` opaco, `relative`,
  z-index mayor). Ese reveal es la firma del sitio: la primera sección después del Hero **debe** mantenerlo.

### 2.4 Movimiento

Librería: `motion` (import de `'motion/react'`). No se agrega GSAP ni Lenis.

- Ease canónico: `[0.22, 1, 0.36, 1]`. Vive en `lib/ease.ts` — importalo, no lo repitas inline.
- Duraciones: entradas `0.6s`, piezas grandes `1s`. Delays escalonados de `0.15s`.
- Entradas por scroll con `whileInView` + `viewport={{ once: true, margin: '-15%' }}`.
- **`prefers-reduced-motion` es obligatorio**, no opcional: sin parallax, sin marquee, sin preloader,
  las entradas colapsan a un fade de 0.2s. Encapsulalo en un hook, no lo copies en cada componente.
- Nada de scroll-jacking. Nada de animación que retrase la lectura de un dato más de 400ms.

**Vocabulario de movimiento propio del sitio** (reutilizalo, da cohesión):
cortina con borde curvo (Preloader) · mosaico que se rompe y rearma (PillarMenu) · marquee infinito
(AboutMe) · fondo de puntos (BackgroundDots) · numeración `01/02/03` con el activo en rojo.

### 2.5 Prohibiciones

- Nada de tema claro, gradientes multicolor, glassmorphism, sombras difusas de colores, emojis como íconos.
- Nada de stock photography ni imágenes generadas. Solo material real de Nora.
- Nada de ornamentos sueltos junto a los títulos (decisión del usuario, ver memoria de feedback estético):
  los elementos gráficos van **integrados**, no pegados al lado.
- Nada de librerías de UI nuevas (shadcn, MUI, etc.). Los componentes se escriben acá.

---

## 3. Reglas de contenido — inviolables

Salieron de la auditoría del 2026-08-14 y están también en el docblock de `src/i18n/content.ts`.
**Romper una de estas es el peor error posible en este proyecto**, peor que un bug.

1. **Todo dato es verificable** contra `content/` o `CV/`. Nada de cifras redondeadas para arriba, años
   estirados ni obras donde Nora no participó. Si un dato no se puede verificar, no va — o se pregunta.
2. **El rol de Nora se declara siempre** junto a cada foto de obra. Varias producciones del archivo son
   obras que **produjo pero no actuó** (`Los golpes de Clara` es un unipersonal de Carolina Guevara).
   Ya se publicó una vez una foto de Guevara con el alt "Nora en escena". No vuelve a pasar.
3. **Las fotos ajenas van con crédito** (Marcela Russarabian, Nicolás Finoli). Varias traen marca de agua:
   no se recortan para sacarla.
4. **Nada de menores identificables.** El material de docencia viene del Programa Adolescencia
   (adolescentes en situación de vulnerabilidad). El pilar `Enseñar` va **sin imagen a propósito** hasta
   que haya material con consentimiento escrito. Resolvelo tipográficamente, no con una foto sustituta.

Además:

- **Todo el texto vive en `src/i18n/content.ts`, en ES y EN.** Cero strings hardcodeados en componentes.
  El tipo `SiteContent` obliga a que los dos idiomas tengan la misma forma — si se desalinean, rompe el
  build, y eso es una feature.
- El inglés **no es una traducción literal del español**. El público irlandés es el que contrata: el EN
  se escribe pensando en un lector que no conoce el teatro independiente porteño (glosar "CELCIT",
  "Programa Adolescencia", "UNA" cuando haga falta).
- Voz: **primera persona, sobria, credenciales al frente**. Sin adjetivos de autobombo
  ("apasionada", "innovadora", "única"). Los hechos se defienden solos: 36 años, Netflix/HBO/Star+,
  12 años coordinando el Programa Adolescencia, 3 festivales en Dublín.

---

## 4. Arquitectura de información

### 4.1 Estructura

**Home (`/`) = un solo scroll narrativo.** Es lo que mejor funciona para una carta de presentación: quien
la abre quiere entender quién es Nora en 40 segundos y tener a mano cómo contactarla. Páginas internas
solo donde el volumen de material lo justifica.

```
/                       Hero → Sobre mí → Crear → Enseñar → Producir → Trayectoria → Presente → Contacto
/archivo                Galería completa filtrable (el material no entra en el home)
/cv                     CV legible + imprimible + descarga PDF (ES/EN)
*                       404 (ya existe)
```

### 4.2 Secciones y de qué se alimentan

| # | Sección | Ancla | Fuente del contenido |
|---|---|---|---|
| 1 | **Hero** ✅ existe | — | `content.ts` |
| 2 | **Sobre mí** ✅ existe | `#sobre-mi` | `content.ts`, marquee de archivo |
| 3 | **Crear** — actriz | `#crear` | `CV/cv cuasi completo_.docx` (Experiencia Actoral, Cine/Publicidad), `content/alternativa-teatral-panel/notes.md`, `content/alternativa-teatral/`. Fotos: Rapiña (Russarabian) |
| 4 | **Enseñar** — pedagoga | `#ensenar` | Programa Adolescencia (2012–2024, coordinación desde 2013), talleres niños/adolescentes, Técnico Superior en Pedagogía IFTS Nº28. **Sin fotos** |
| 5 | **Producir** — productora | `#producir` | `CV/en Irlanda Borrador...docx`: Netflix (*El Amor Después del Amor*, producción de arte), Star+ (*Planners*), HBO/Cinema7 (*By Pass*); St. Patrick's Festival, Argentina Day, Rathe Gather; ¡Mujeres a la obra! (CELCIT 2018), Los golpes de Clara |
| 6 | **Trayectoria** — línea de tiempo | `#trayectoria` | 1990 (primera clase con Alicia Aller) → 2026. Formación + grupos (Los Ranz 1998–2007, Puerta Roja 2007–2011, Boquitas Pintadas 2015–) + dirección + producción |
| 7 | **Presente** — Dublín | `#presente` | `external-assets/Norah_/` (41), `external-assets/Rita Universos_/` (42, clown), `external-assets/polas/` (28). **Es la única sección con imágenes actuales de Nora — hoy el sitio no tiene ninguna** |
| 8 | **Contacto** | `#contacto` | `LINKS` en `content.ts` + tel. Irlanda `+353 89 983 0959` (confirmar con el usuario antes de publicarlo) |
| 9 | **Footer de sitio** | — | nav, idioma, créditos de fotografía, año |
| 10 | **Header/nav global** | — | aparece al pasar el Hero |
| 11 | **/archivo** | — | 494 fotos en `content/` + `external-assets/`; se publica un subconjunto curado |
| 12 | **/cv** | — | los 4 CVs de `CV/` consolidados |

**Al crear las secciones 3/4/5, reponé los `href` de los pilares en `content.ts`** (hoy están en `null`
porque las anclas no existían — ver `CLAUDE.md`). Es la deuda más visible del sitio: los tres links
principales no van a ningún lado.

---

## 5. Contrato técnico

**Stack (no se amplía sin pedirlo):** React 19 · Vite 6 · Tailwind 4 (`@tailwindcss/vite`, sin
`tailwind.config`, tokens en `@theme` de `src/index.css`) · `motion` · `lucide-react` · `react-router-dom`.
Alias `@/*` → **raíz del proyecto** (no `src/`). `cn()` en `lib/utils.ts`.

Comandos: `npm run dev` (Vite 5173; si está ocupado `npx vite --port=5199 --strictPort`) ·
`npm run lint` = `tsc --noEmit` · `npm run build`.

### 5.1 Convenciones de código

- Un componente por sección en `src/components/`, en PascalCase, default export.
- **Comentarios en español, código en inglés.** Cada componente abre con un docblock que explica *por qué*
  está hecho así (de dónde salió el diseño, qué desvíos tiene y por qué). Mirá `Hero.tsx` o `Preloader.tsx`
  como modelo — ese nivel de documentación es el estándar, no un extra.
- Nada de `any`. `npm run lint` tiene que pasar limpio al cerrar cada fase.
- Reutilizá lo que hay: `Button`/`ButtonLink`, `BackgroundDots`, `lib/ease.ts`,
  `lib/hooks/use-hover-capable.ts`.

### 5.2 Imágenes — presupuesto y pipeline

Hay ~500 fotos de archivo pesadas. Servirlas crudas mata el sitio.

- Script de build en el scratchpad con `sharp`: por cada imagen publicada, generar **AVIF + WebP** en
  anchos `480 / 960 / 1440`, y servirlas con `<picture>` + `srcset` + `sizes`.
- `loading="lazy"` + `decoding="async"` en todo, salvo el retrato del Hero (`fetchPriority="high"`).
- `width`/`height` explícitos siempre — cero layout shift.
- **Presupuesto: ≤ 1.2 MB transferidos en la primera vista del home.** Si una sección lo rompe, se curan
  menos fotos, no se sube el presupuesto.
- Los originales de `content/`, `CV/` y `external-assets/` **nunca se editan ni se mueven**: se copian
  procesados a `public/img/`.

### 5.3 Accesibilidad — piso obligatorio

- Skip link al `<main>`. Un solo `<h1>` por página; jerarquía de headings sin saltos.
- Foco visible en todo lo interactivo (anillo `brand-red`, `focus-visible`), nunca `outline: none` pelado.
- Marquee y carruseles: pausables, `aria-hidden` en las copias duplicadas.
- Todo `alt` es descriptivo y **respeta la regla 2** (rol declarado). Decorativo → `alt=""`.
- Los toggles y controles llevan `aria-label` en el idioma activo.

### 5.4 SEO y metadatos

- `<title>` y `<meta description>` por idioma; `og:image` real (no el PNG de 1MB del retrato: versión 1200×630).
- **JSON-LD `Person`** con `name`, `jobTitle`, `address` (Dublín), `sameAs` (Instagram, LinkedIn),
  `alumniOf`. Es lo que hace que Nora aparezca bien cuando una productora la googlea.
- `lang` del `<html>` sincronizado con el idioma (ya lo hace `LanguageContext`).
- `hreflang` no aplica (una sola URL, toggle client-side) — no lo agregues.

### 5.5 Definition of Done por sección

Ninguna sección se reporta como terminada sin las 8:

1. Texto ES **y** EN en `content.ts`, sin strings hardcodeados.
2. Todo dato verificado contra `content/`/`CV/`; roles y créditos declarados.
3. Responsive verificado a 360 / 768 / 1280 / 1920.
4. Navegable con teclado, foco visible, headings correctos, `alt` reales.
5. `prefers-reduced-motion` verificado.
6. Imágenes optimizadas y dentro del presupuesto.
7. `npm run lint` limpio y `npm run build` verde.
8. Screenshot en el navegador confirmando que se ve como se diseñó — **no alcanza con que compile**.

---

## 6. Plan de fases

Cada fase termina con: build verde + screenshot + un resumen de 3 líneas de qué cambió y qué quedó
pendiente. **Alto para revisión del usuario al cerrar cada fase.**

| Fase | Qué | Por qué va acá |
|---|---|---|
| **F0 · Fundaciones** | `--font-body` Newsreader + escala tipográfica en `@theme`; primitiva `<Section>` (eyebrow/titular/cuerpo); wrapper `<Reveal>` de motion; hook `useReducedMotion`; script de imágenes con sharp; skip link + estilos de foco; JSON-LD + og:image | Sin esto cada sección reinventa el sistema y después hay que refactorizar ocho veces |
| **F1 · Chrome global** | Header que aparece al pasar el Hero (nav a las anclas + toggle de idioma) · Footer de sitio · ScrollProgress · reponer `href` de los pilares | El sitio hoy no se puede navegar: es la deuda más visible |
| **F2 · Crear** | `#crear` — actriz. Teatro, cine y TV. Fotos de Rapiña con crédito | Es el pilar con más material listo |
| **F3 · Enseñar** | `#ensenar` — pedagoga. **Sin imágenes: resolver con tipografía y datos.** Es el desafío de diseño más interesante del sitio | La restricción es la idea, no un problema |
| **F4 · Producir** | `#producir` — producción. Netflix/HBO/Star+, festivales de Dublín, teatro independiente | Es lo que más le interesa a una productora irlandesa |
| **F5 · Trayectoria** | `#trayectoria` — línea de tiempo 1990→2026, navegable, filtrable por disciplina | Consolida los 4 CVs en una sola pieza |
| **F6 · Presente** | `#presente` — el material de Dublín. La primera imagen actual de Nora en el sitio | Cierra el hueco más grande de contenido |
| **F7 · Contacto + CV** | `#contacto` con correo, redes y ubicación · página `/cv` imprimible con descarga PDF ES/EN | Sin esto el sitio no genera un solo trabajo |
| **F8 · Archivo** | `/archivo` — galería curada y filtrable por pilar y época, con rol y crédito en cada pieza | Necesita todo lo anterior para tener a dónde volver |
| **F9 · Pulido** | Auditoría mobile completa · a11y con teclado y lector de pantalla · Lighthouse (objetivo ≥95 en las cuatro) · chequeo de paridad ES/EN · presupuesto de peso · revisión final de las 4 reglas de contenido | Lo que separa un sitio de un demo |

**Regla de secuencia:** F0 y F1 son bloqueantes. De F2 en adelante, si el usuario pide otro orden, se
respeta — pero se le avisa qué dependencia queda colgando.

---

## 7. Protocolo de trabajo

**Sesiones concurrentes.** El usuario corre varias sesiones de Claude sobre este repo a la vez y comparte
el dev server. Antes de editar un archivo que no creaste en esta sesión: `git status` y mirá el mtime.
Si cambió respecto de lo que esperabas, releelo antes de escribir. Nunca hagas `git checkout --` ni
`git reset --hard` sobre trabajo que no es tuyo.

**Git.** Un commit por fase, mensaje en español, descriptivo. No pushear sin que el usuario lo pida.
Si estás en `master` y hay que ramificar, preguntá primero.

**Verificación.** El navegador de Playwright suele estar tomado por otra sesión. Si falla, usá las
herramientas de Chrome (`mcp__claude-in-chrome__*`) contra el dev server. Verificá **siempre** visualmente
antes de decir que una sección está lista.

**Reporte honesto.** Si una fase queda a medias, se dice qué falta y por qué. Si un dato no se pudo
verificar, se dice — no se rellena con algo plausible.

**Actualizá `CLAUDE.md`** al cerrar cada fase: la sección "Estado actual" tiene que reflejar la realidad.

---

## 8. Lo que falta y no puede bloquear el trabajo

Nora está completando información en el artifact **"Nora, falta esto"**
(https://claude.ai/code/artifact/8c99cafe-dc5d-4d30-b655-db3ed2739b92): elección de 16 portadas,
21 preguntas sin respuesta en ninguna fuente, y 8 huecos de material. Ese artifact **no tiene estado
compartido** — sus respuestas llegan como un texto que el usuario pega en el chat.

Mientras no lleguen:

- **Seguí construyendo.** Estructurá cada sección para que el dato faltante entre después sin rediseñar.
- Donde falte un dato, poné el dato verificado más conservador y dejá un comentario
  `// PENDIENTE(nora): <pregunta exacta>` en `content.ts`. Nunca inventes el faltante.
- Cuando el usuario pegue las respuestas de Nora, **primero** incorporalas a `content.ts` y a las
  secciones ya hechas, **después** seguí con la fase en curso.

Huecos conocidos hoy:

- Fuente **Nefelibata Script** (paga, no está en Google Fonts) — `font-signature` es un placeholder.
- **Sin fotos publicables de docencia** (regla 4). Se necesita material con consentimiento escrito.
- **Sin azul de marca real** — `--color-brand-blue` es una elección libre autorizada por el usuario.
- El teléfono irlandés está en un borrador de CV: **confirmar antes de publicarlo** en el sitio.
- `content/blogspot/` tiene posts 2012–2014 con fotogalerías que nunca se descargaron; `content/facebook/`
  tiene 10 álbumes cuyo `media/` sigue vacío. Si una sección los necesita, avisá — no son bloqueantes.

---

## 9. Criterio de éxito

El sitio está terminado cuando **una productora irlandesa que nunca oyó hablar de Nora** puede, en un solo
scroll y en inglés:

1. entender en 15 segundos qué hace y a qué nivel;
2. ver material real que lo respalde, con roles y créditos claros;
3. encontrar un CV descargable y una dirección a la que escribir;

…y cuando **Nora puede mandar el link sin explicar nada**.
