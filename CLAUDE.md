# CLAUDE.md

Documentación de **estado actual** del sitio de Nora Filmus. Este archivo describe cómo es el proyecto HOY — no es un registro cronológico de sesiones. Historial detallado de decisiones (por qué se hizo cada cosa, qué se probó y se descartó) vive en `git log` y, para lo más importante, en la memoria de Claude Code de este proyecto (`MEMORY.md` + `memory/*.md`).

**Auditado y reescrito entero el 2026-09-12** — antes de esta fecha el archivo era un registro cronológico de +9 meses de sesiones (750+ líneas). Si algo de ese historial hace falta (por qué se decidió X en vez de Y), está en `git log --all` y en `memory/`.

## Qué es este proyecto

Sitio de Nora Filmus — actriz, clown, docente de teatro y productora cultural argentina-rumana, radicada en Dublín. Es una **carta de presentación profesional**, dirigida a productoras, festivales e instituciones (sobre todo irlandesas) que puedan contratar a Nora — no una landing de captación de alumnos (eso lo hace el proyecto hermano `nora-landing`).

Dirección artística: **"El Programa"** — el sitio se lee como un programa de teatro. Numerales de Acto en tipografía de afiche, "cast list" para los créditos, espina cronológica en Trayectoria, grano de papel, costuras entre secciones. Un pedido de "rediseño" o "auditoría" se resuelve *dentro* de ese lenguaje (más disciplina, más aire, mejor jerarquía) salvo que se pida explícitamente abandonarlo.

**Estado del sitio: BETA** (`BetaBadge.tsx`, visible junto al logo en Hero/Header/Footer; número de versión real en la esquina inferior derecha vía `VersionBadge.tsx`, `major.minor.patch` de `package.json` + conteo de commits).

**Plan de mejora vigente**: `VISUAL-EXPERIENCE-PLAN.md` (raíz del repo) — plan de 6 fases para llevar el sitio de "portfolio sólido" a "experiencia editorial memorable" sin salir del lenguaje de "El Programa". Algunas de sus fases (Fase 0: sacar la sombra de `Act.tsx`, estado de ruta activa en el nav) ya están hechas; no asumir que el resto también sin confirmar contra el código.

**Ojo — sesiones concurrentes.** Es habitual que haya más de una sesión de Claude Code trabajando sobre este repo en paralelo. Antes de asumir que algo no committeado es propio, correr `git status`/revisar mtimes. Ver memoria `sesiones-concurrentes`.

## Stack

React 19 + Vite 6 + Tailwind CSS 4 (`@tailwindcss/vite`, sin `tailwind.config`, tokens en el `@theme` de `src/index.css`) + `motion` (import de `'motion/react'`, NO GSAP pese al nombre histórico de la carpeta de skills) + `react-router-dom` 7 + `lucide-react` + `clsx`/`tailwind-merge` (`cn()` en `lib/utils.ts`, raíz del repo — no `src/lib/`).

- Alias `@/*` → raíz del proyecto (`vite.config.ts`), no `src/`.
- `npm run dev` — puerto default de Vite (5173).
- `npm run lint` — es `tsc --noEmit` (sin ESLint configurado).
- `npm run build` — `vite build` + `node scripts/generate-page-shells.mjs` (genera un `index.html` propio con `<title>`/`<meta description>` reales por ruta, para SEO sin SSR).
- `npm run preview` — sirve el build de `dist/`.
- `vite.tunnel.config.ts` — config aparte, solo para exponer el dev server por Cloudflare Tunnel cuando hace falta verlo desde otro dispositivo. No tocar `vite.config.ts` para esto.

## Estilos y tipografía — fuente de verdad: `src/index.css` (`@theme`)

- **Paleta**: `--color-ink: #0F0E0D` (fondo), `--color-cream: #F5EFE6` (texto), `--color-brand-red: #E53935` + `--color-brand-red-deep: #C62828` (acento), `--color-brand-blue: #2E4F8C` (uso libre, no hay un azul de marca "oficial" de Nora en ningún archivo fuente).
- **Fuentes** (Google Fonts CDN en `index.html`, no self-hosted): `--font-display` (Protest Riot — títulos grandes, numerales de Acto), `--font-signature` (Give You Glory — **reservada para la firma/marca**, no para índices editoriales sueltos; es un placeholder gratuito temporal, la fuente real deseada — Nefelibata Script — es paga y no está comprada), `--font-label` (Quicksand — labels/uppercase/tracking), `--font-body` (Newsreader — texto corrido largo).
- **Escala tipográfica**: tokens `--text-display-xl/l/m`, `--text-lead`, `--text-body`, `--text-label` en el mismo `@theme` — las secciones usan esos tamaños, nunca `text-[Npx]` sueltos.
- El sitio **no usa sombras** (`box-shadow`) como recurso — la separación de planos se resuelve con hairlines/opacidad. No agregar `shadow-*` sin verificar contra `.claude/skills/design-system`.
- Reglas de diseño/accesibilidad/performance ya auditadas viven en `.claude/skills/` — **cargar el skill relevante antes de tocar diseño, animación, accesibilidad o performance**, no reinventar de memoria. Ver la lista completa al final de este archivo.

## Arquitectura de rutas y chrome

SPA con React Router (`BrowserRouter` en `main.tsx`). Rutas reales, cada una con su propio chunk (`React.lazy`, ver `src/App.tsx`) y su propio `index.html` generado por `scripts/generate-page-shells.mjs`:

- `/` — Home: `Hero` (portada) fusionada con `AboutMe` en una sola composición scroll-driven (ver abajo). Rutea a `<SiteLayout>`.
- `/crear`, `/ensenar`, `/producir` — los tres Actos (pilares: Actuación, Docencia, Producción).
- `/trayectoria` — **solo en dev** (`TRAYECTORIA_ENABLED = import.meta.env.DEV`, `lib/features.ts`). En build de producción la ruta no se registra (cae al 404), está fuera de todo nav/sitemap/robots.txt hasta que esté terminada. Cuando esté lista: borrar `lib/features.ts` y los `TRAYECTORIA_ENABLED &&`/`?:` que lo usan.
- `/contacto` — formulario de contacto + muro de firmas.
- `*` — `NotFound.tsx`, **fuera** de `SiteLayout` a propósito (pantalla aislada, sin Header/Footer/Preloader).

`SiteLayout.tsx` es el layout route que envuelve todas las rutas reales y monta el chrome compartido: `Preloader` (obertura, monograma NF, una vez por pestaña vía `sessionStorage`), `Grain` (textura `feTurbulence` inline, fixed, una sola instancia), `ScrollProgress` (barra fina arriba), `Header` (logo + toggle de idioma, visible solo tras pasar el Hero en `/`, siempre visible en otras rutas), `SectionNav` (nav real del sitio — rail vertical en desktop, rueda horizontal fija al pie en mobile, calcado de `nora-landing`), `PageCurtain` (telón de transición entre rutas, monograma NF + numeral/eyebrow de la página destino), `Footer`, `VersionBadge`, y el `LightboxProvider` (lightbox global — cualquier componente pide `useLightbox().open(imágenes)`).

**Hero + AboutMe son una sola escena**, no dos secciones apiladas: `AboutMe` se renderiza *dentro* de `Hero.tsx`, superpuesta al mismo panel `sticky` que trae el video de Nora. Al hacer scroll, un mecanismo scroll-scrub (progreso leído a mano de `window.scrollY`, escrito directo a refs — no `useTransform`+`style` de Framer Motion, ver el docblock de `Hero.tsx` para el porqué) mueve el panel de derecha a izquierda mientras cruza la opacidad del wordmark del Hero con el contenido de `AboutMe` en el mismo lugar de pantalla. Se apaga con `prefers-reduced-motion` o ahorro de datos/2G — **excepto el video en sí, que según decisión explícita del usuario nunca se apaga** (ver memoria `hero-video-siempre-visible`); en ese modo `AboutMe` cae a una sección `flow` normal, no superpuesta (prop `overlay` en `AboutMe.tsx`).

## Contenido — `src/i18n/content.ts`

Fuente de verdad de TODO el texto y material del sitio, en ES y EN (`SiteContent` obliga a que los dos idiomas tengan la misma forma). Idioma manejado por `LanguageContext.tsx` (localStorage + heurística de `navigator.language`, sin librería de i18n).

**Cuatro reglas que no se rompen al editar este archivo** (están también en su propio docblock):

1. **Todo dato es verificable** contra `content/` o `CV/`. Nada de cifras redondeadas ni obras donde Nora no participó.
2. **El rol de Nora se declara siempre.** Varias obras del archivo son producciones donde ella NO actúa (`Los golpes de Clara` es un unipersonal de Carolina Guevara que Nora produjo). Ya pasó una vez que se publicó sin aclarar el rol.
3. **Las fotos ajenas van con crédito** (Russarabian, Finoli, Ugolino, Colo Gens, Paula, etc.).
4. **Nada de menores identificables.** El material de docencia viene del Programa Adolescencia (adolescentes en situación de vulnerabilidad); no se publica una cara sin consentimiento escrito. Cuando hay multitud/grupo con menores y el encuadre lo permite, la alternativa validada es **blurrear las caras de los chicos** (nunca las de Nora ni de otros adultos) en vez de descartar la foto entera — ver los créditos de Enseñar que ya usan este mecanismo.

## Backend — PHP propio (Apache), no Vercel

El hosting real es **Apache/PHP tradicional** (tipo cPanel/VPS) — el proyecto vive literalmente en `C:\xampp\htdocs\norafilmus`. No hay Edge Functions de Vercel: si aparece un `vercel.json` o algo bajo `api/` (raíz, no `public/api/`) en el working tree, es de una sesión que no leyó esta nota — confirmar antes de asumir que sigue vigente.

`public/api/` (vive en `public/` a propósito: Vite lo copia a `dist/api/` en cada build sin paso manual):

- `config.php` — constantes (`CAPTCHA_SECRET`, `CONTACT_TO_EMAIL`, etc.) con override por variable de entorno del hosting → `config.local.php` (gitignored) → default de desarrollo.
- `captcha.php` (+ `_lib/captcha.php`) — desafío matemático simple, firmado HMAC-SHA256, sin estado en servidor (limitación conocida y documentada: no reemplaza reCAPTCHA contra un atacante dedicado, alcanza combinado con honeypot para el volumen de este sitio).
- `contact.php` — valida honeypot + captcha, manda mail por **PHPMailer** (`public/api/mail/`, mismo mecanismo y misma cáscara visual — `EmailTemplate.php` — que usa `nora-landing/mail/`), dos templates (`contact-notification.php` a Nora, `contact-confirmation.php` al visitante, bilingüe).
- `sign.php` — el "muro de firmas" (`SignatureWall.tsx`, en `/contacto`): nombre + mensaje corto, se guarda con `flock()` en `public/data/signatures.json` (cap de 500). El frontend refetchea ese JSON estático después de firmar.
- `public/.htaccess` — SPA fallback a `index.html`, fuerza HTTPS, cache de imágenes/JS/CSS, `AddType` para `.avif`/`.webp`/`.woff2`.

**Variables de entorno que necesita producción** (Vercel-style o `.env` de PHP, según lo defina el hosting final): `RESEND_API_KEY` **ya no aplica** (se abandonó Resend en el pivot a PHP) — lo que hace falta es que el hosting tenga un MTA real para que `mail()`/PHPMailer entreguen de verdad (en XAMPP local casi nunca lo hay, `contact.php` maneja ese fallo sin romper el JSON de respuesta), más `CAPTCHA_SECRET` random en producción (si no, cae a un default de desarrollo inseguro), y opcionalmente credenciales SMTP (`SMTP_HOST/PORT/ENCRYPTION/USERNAME/PASSWORD`, `MAIL_FROM_*`, `ADMIN_EMAIL`) si no se usa `mail()` nativo.

**No verificado todavía**: entrega real de un mail a una bandeja de entrada real (solo se confirmó que el error se maneja bien cuando el mailserver no existe) — falta un hosting de producción real para esa prueba.

## Componentes — inventario real

`.claude/skills/component-library` tiene el inventario completo con qué hace cada uno — **cargarlo antes de construir cualquier UI nueva**, no asumir que hace falta un componente nuevo. Piezas centrales para orientarse:

- **Chrome de sitio**: `SiteLayout`, `Header`, `SectionNav`, `Footer`, `Preloader`, `PageCurtain`, `Grain`, `ScrollProgress`, `VersionBadge`, `BetaBadge`.
- **Home**: `Hero` (incluye `AboutMe` fusionada — ver arriba —, `BlurWords` para el reveal de texto, `BackgroundDots`).
- **Actos** (`/crear`, `/ensenar`, `/producir`): `Act.tsx` (primitiva compartida — numeral romano, foto o `aside`, `VerticalPhotoSlider` para la galería de archivo), `CreditList.tsx` (acordeón "cast list", variantes `cast`/`notebook`/`dossier` según el Acto), `VerticalPhotoSlider.tsx` (slider vertical con loop infinito CSS puro, abre `Lightbox` al click).
- **Trayectoria** (dev-only): `Trayectoria.tsx` — espina continua, hitos alternados, filtro por categoría.
- **Contacto**: `Contacto.tsx`, `ContactForm.tsx`/`FormField.tsx`/`CaptchaField.tsx`, `SignatureWall.tsx`.
- **Transversales**: `Lightbox.tsx` (provider global), `Picture.tsx` (sirve AVIF/WebP + fallback desde `src/generated/image-manifest.json`), `Reveal.tsx` (wrapper de entrada por scroll), `ErrorBoundary.tsx` (envuelve el `<Suspense>` de cada ruta en `PageCurtain`, fallback "no se pudo cargar" + reintentar — importante porque cada ruta es un chunk lazy y una conexión cortada puede fallar la descarga).
- **Sin íconos de marca propios** (borrados 2026-09-12, pedido explícito del usuario): existió un set de SVGs generados con IA en `src/components/icons/nora/` (máscaras, claqueta, cortina, spotlight, ticket, firma, estrella) usado en `Act.tsx`/`PageCurtain.tsx`/`Footer.tsx`/`SignatureWall.tsx`. El usuario pidió sacarlo entero del sitio — todos esos puntos de uso volvieron a íconos genéricos de `lucide-react` (o, en el caso del flourish decorativo de `Footer.tsx`, se sacaron sin reemplazo). No reflotar ese set sin que se pida de nuevo — está en el historial de git si hace falta.

**Componentes que existieron y se borraron por no tener ningún uso** (2026-09-12): `ProgramIndex.tsx`, `Highlights.tsx`, `SiteBanner.tsx`, `IntroCinematic.tsx`, `PillarMenu.tsx`. Están en el historial de git si hace falta recuperar alguno — no reflotarlos por comodidad sin confirmar que el enfoque actual (`SectionNav` para nav, `VerticalPhotoSlider` para archivo) no ya lo resuelve.

## Pipeline de imágenes y scripts

Todo en `scripts/`, se corren a mano (no forman parte de `npm run build` salvo `generate-page-shells.mjs`):

- `optimize-images.mjs` — pipeline principal: AVIF+WebP en 480/960/1440w recortado al ancho real, manifest en `src/generated/image-manifest.json`. Acepta jpg/png/webp como fuente. Correrlo después de agregar cualquier imagen nueva a `public/img/`.
- `generate-favicons.mjs` — favicons desde `external-assets/brand/nf-monograma.png`.
- `generate-og-image.mjs` — OG image 1200×630 para redes/SEO.
- `generate-sitemap.mjs` — `public/sitemap.xml` (excluye `/trayectoria` mientras esté gateada).
- `generate-page-shells.mjs` — `<title>`/`<meta description>` reales por ruta, corre en cada `npm run build`.
- `extract-wordmark-alpha.mjs` — extrae canal alfa real de la firma manuscrita de Nora (`max(r,g,b)`, no luminancia — el rojo pesa poco en luminancia estándar y salía casi transparente).
- `build-credential-logos.mjs` — siluetas monocromas (recoloreadas a `--color-cream`) de los logos de la tira de credenciales del Hero (Netflix/HBO/Star+/Teatro Colón/St. Patrick's Festival).

Instalar `ffmpeg-static`/`ffprobe-static` en un **scratchpad fuera del repo** para procesar video (nunca en `package.json` del proyecto) — ver memoria `video-processing-this-env`.

## Recursos (contenido real, no código)

`content/`, `CV/`, `external-assets/` — material fuente (fotos de archivo, CVs, research). **Nunca se edita ahí directamente** — solo se copian/procesan archivos hacia `public/`/`src/assets/`. `content/README.md` explica la organización. Ver memoria `rm-content-folder-caution`: nunca borrar en estas carpetas sin diffear/verificar primero, ya se perdió un archivo así una vez.

## Pendientes reales (bloqueados por Nora, no por trabajo de este lado)

- Bios largas/cortas ES/EN definitivas (hay una versión integrada, pero puede haber ajustes).
- Confirmar el año exacto de la función de "Los golpes de Clara" que Nora produjo sola (hoy puesto como 2020 por inferencia, marcado "CHEQUEAR" en `content.ts`).
- Fotos de Irlanda/actuación actual adicionales, si aparecen.
- Confirmar grafía "Rathe Gather" vs. "Rather Gather" Festivalito.
- `/trayectoria` — falta terminarla y sacarla de detrás del flag `TRAYECTORIA_ENABLED`.
- Verificar entrega real de mail en un hosting de producción (SPF/DKIM si cae en spam).

## Gotchas operativos vigentes (para cualquier sesión de Claude Code)

- **`mcp__playwright__browser_resize` sí cambia el viewport real; `mcp__claude-in-chrome__resize_window` NO** (`window.innerWidth` no se mueve). Usar Playwright para verificar breakpoints.
- **`mcp__claude-in-chrome` no reproduce `<video>` de forma confiable** (`readyState` se queda en 0) y además congela `requestAnimationFrame` en pestañas backgrounded (rompe cualquier animación de `motion`, que corre sobre rAF) — para verificar animación real usar Playwright con scroll programático; para revisar el resultado de un video generado, extraer frames sueltos con `ffmpeg -ss <t> -vframes 1`, no intentar reproducirlo.
- **`position: sticky` no pinnea** si algún ancestro tiene `transform` (ej. `Reveal`) o `overflow` distinto de `visible` — diagnosticar con `getComputedStyle`/`getBoundingClientRect`, no adivinar.
- Escribir un rango de caracteres de control (`\x00-\x1F`) dentro de un `new_string` de la herramienta `Edit` puede dejar bytes de control reales embebidos en el archivo en vez de texto literal (`Read` los normaliza al mostrarlos, así que no se ve en el diff) — evitar `\x`/`\u00` literal ahí, usar un loop sobre `codePointAt()` si hace falta ese rango.
- El logo/wordmark del sitio es la **firma manuscrita** (`public/img/nora-firma-roja.png` + `nf-monograma.png` para el loader/favicons) — no el lockup geométrico viejo, que ya no existe en el repo.

## Skills del proyecto

Cargar el skill relevante **antes** de tocar la zona que cubre, no reinventar de memoria:

- `design-system` — tokens reales y piso de contraste no negociable.
- `premium-ui` — nivel de pulido sin volverse una landing de SaaS genérica.
- `component-library` — inventario de `src/components/` antes de crear algo nuevo.
- `gsap-motion` — animación con `motion` (nombre de carpeta histórico, no hay GSAP).
- `accessibility` — contraste, foco, touch targets, `inert`, ya auditados.
- `performance` — presupuesto real, pipeline de imágenes, por qué el Lighthouse de performance no persigue 95+ a rajatabla (obertura en video + Home animado son decisiones de marca ya iteradas, no descuido).
- `nextjs-best-practices` — nombre histórico, el proyecto es Vite + React Router, no Next.js.
- `ui-review` — checklist de cierre antes de dar por terminado cualquier cambio visual.
