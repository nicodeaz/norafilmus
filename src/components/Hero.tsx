import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { EASE_REVEAL, easeInOutSine, easeInQuad, easeOutQuad } from '@/lib/ease';
import { TRAYECTORIA_ENABLED } from '@/lib/features';
import { cn } from '@/lib/utils';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import AboutMe from './AboutMe';
import BetaBadge from './BetaBadge';
import { ButtonLink } from './Button';
import LanguageToggle from './LanguageToggle';
import Picture from './Picture';

interface HeroProps {
  className?: string;
}

const CREDENTIAL_LOGOS: Record<string, { src: string; width: number; height: number }> = {
  Netflix: { src: '/img/credentials/netflix.png', width: 740, height: 200 },
  'Star+': { src: '/img/credentials/star-plus.png', width: 701, height: 199 },
  HBO: { src: '/img/credentials/hbo.png', width: 485, height: 200 },
  'Teatro Colón': { src: '/img/credentials/teatro-colon.png', width: 1517, height: 200 },
  "St. Patrick's Festival": {
    src: '/img/credentials/st-patricks-festival.png',
    width: 2212,
    height: 200,
  },
};

// Ver docblock "Un solo video, no dos..." (2026-09-11) — reemplaza los
// antiguos hero-loop.mp4 + hero-transition.mp4 por un único archivo
// concatenado (mismo encuadre, misma sesión: el frame final del loop y el
// frame inicial de la transición son casi idénticos, así que el corte en el
// límite es imperceptible). 122 y 121 son la cantidad de frames real de cada
// clip origen a 24fps (medido con ffprobe antes de concatenar) — no un
// número aproximado.
//
// **Bug real, encontrado el mismo día de armar el archivo (2026-09-11):**
// la primera versión de `hero-scene.mp4` se re-codificó sin fijar el
// intervalo de keyframes — el default de libx264 (`-g 250`) es más largo
// que el video ENTERO (243 frames), así que terminó con **un solo keyframe,
// en t=0**. El usuario reportó "hago scroll, la imagen queda fija, después
// de unos segundos se actualiza" — exactamente el síntoma de seekear un
// video sin keyframes cercanos: cada `currentTime = t` que escribe
// `render()` obligaba a decodificar TODO desde el principio hasta el punto
// pedido, y con el scroll pidiendo decenas de seeks por segundo la cola se
// acumulaba varios segundos. Confirmado con `ffprobe -skip_frame nokey`
// (1 sola línea de salida en el archivo roto) y con seeks aleatorios
// medidos por `performance.now()` (2-18ms una vez corregido, contra
// varios segundos antes). Se re-codificó con `-g 12 -keyint_min 12
// -sc_threshold 0` (keyframe cada ~0,5s, 21 en total) — sube el archivo de
// 1,6MB a 2,65MB, un costo real pero necesario: sin keyframes frecuentes,
// un video pensado para scrubbearse por scroll es directamente inutilizable,
// sin importar cuán bien esté el resto del mecanismo. Cualquier futuro
// video de este sitio pensado para `currentTime` manual (no reproducción
// lineal) tiene que fijar un GOP chico a propósito, nunca confiar en el
// default del encoder.
const HERO_VIDEO_SRC = '/video/hero-scene.mp4';
const LOOP_DURATION = 122 / 24;
const TRANSITION_DURATION = 121 / 24;
const TRANSITION_EXTRA_VH = 100;

// ── Auditoría de fluidez (2026-09-10) — ver docblock "Auditoría..."
/**
 * Amortiguación del progreso, por frame de 16,67ms. El scroll llega en
 * saltos discretos (una muesca de rueda = ~100px = ~96px de panel de una
 * sola vez, medido); esto interpola hacia ese objetivo en vez de aplicarlo
 * en seco. Más bajo = más suave y más "pesado"; más alto = más pegado al
 * dedo. 0.14 es el punto donde el panel se siente una cámara y todavía
 * responde al gesto.
 */
const SCROLL_SMOOTHING = 0.14;
/** Diferencia por debajo de la cual se pega al objetivo y se corta el rAF. */
const SMOOTH_SNAP_EPSILON = 0.0004;
/**
 * Un salto mayor a esto no se interpola: es un ancla (`#sobre-mi`), una
 * restauración de scroll del navegador o un `scrollTo` — amortiguarlo se
 * vería como una deriva lenta y rara después de un click.
 */
const SMOOTH_JUMP_THRESHOLD = 0.3;
/** Medio frame a 24fps: por debajo de esto, `currentTime` no se toca. */
const VIDEO_SEEK_EPSILON = 1 / 48;
/**
 * Tercera vuelta sobre esta condición, y la última — se saca del todo
 * (2026-09-11). Historia real, porque vale la pena entender por qué se
 * llega acá antes de volver a poner un umbral:
 *
 * 1ª vuelta: la capa superpuesta se activaba solo con `min-height:820px` —
 * un iPad/ventana de 768×900 se recortaba 50-60px (bug real, medido).
 * 2ª vuelta: se sumó `min-width:1024px` para resolver eso — pero a
 * exactamente 1024px de ancho el bloque en español todavía mide 766px, así
 * que el umbral se subió a `min-width:1152px`. Esto dejaba afuera del modo
 * capa a resoluciones de escritorio MUY comunes (1366×768, 1280×800) — el
 * usuario lo reportó una vez ("en resoluciones más chicas queda AboutMe en
 * dos partes") y se corrigió subiendo el umbral.
 * 3ª vuelta: el usuario mandó una captura real de su propia ventana —
 * **874×807px** (un PNG width=874/height=807 leído de los bytes IHDR, no
 * una resolución de monitor: es una ventana de Chrome no maximizada) — y
 * reportó EL MISMO problema, "no queda como en la versión de escritorio".
 * 874px de ancho está por debajo de CUALQUIER umbral que se probó hasta
 * acá. La conclusión real: **no existe un número de umbral que no deje a
 * alguien afuera** — cualquier ventana más angosta que el umbral de turno
 * va a mostrar exactamente este mismo reclamo, es un problema estructural
 * del enfoque "por debajo de X, layout distinto", no del valor de X.
 *
 * La solución no es subir el número una cuarta vez: es sacar la condición
 * de tamaño por completo. La superposición ahora se activa siempre que
 * `enableTransition` sea `true` (o sea, siempre, salvo
 * `prefers-reduced-motion`/ahorro de datos — las dos únicas razones
 * REALES, no de tamaño, para no correr el mecanismo). Para que esto no
 * reintroduzca el recorte de la 1ª vuelta, `AboutMe.tsx` deja de tener
 * tamaños fijos en su modo capa — la tipografía y el espaciado ahora son
 * fluidos, atados a `svh` (ver su docblock, "Tipografía fluida..."): en vez
 * de cortarse cuando no entra, el bloque se ACHICA hasta entrar. Sigue
 * habiendo un piso de legibilidad (no se achica infinito), pero cualquier
 * ventana de uso real —por angosta o baja que sea— ve la composición
 * junta, nunca partida en dos.
 */
// Scroll extra DESPUÉS de que la transición ya terminó (progress=1), antes
// de que el `sticky` se despegue y el Footer empiece a entrar.
//
// **Bajado de 100 a 18 (2026-09-11), bug real reportado por el usuario:**
// "tengo 8 scrolls hacia abajo sin que haga nada, el sitio queda estático".
// 100vh eran, literalmente, una pantalla entera de scroll muerto — a ~100px
// por muesca de rueda, exactamente las ~8-9 muescas que reportó. La
// intención original ("darle tiempo al usuario de mirar la composición
// asentada") sonaba razonable en abstracto pero en la práctica se sentía
// como que el sitio se colgó, no como una pausa deliberada: no hay contenido
// nuevo que revelar durante el hold, solo la misma pantalla sin reaccionar
// al gesto. Un poco de margen SÍ hace falta — la amortiguación del scroll
// (`SCROLL_SMOOTHING`) tarda unos ~300-600ms en converger al 100% incluso
// después de que el `target` crudo ya llegó a progress=1, así que sin ALGO
// de hold el `sticky` podría despegarse mientras `AboutMe` todavía está
// terminando de asentar su opacidad. 18vh (~160px, menos de 2 muescas) cubre
// ese margen de sobra sin leerse como una pantalla muerta.
const TRANSITION_HOLD_VH = 18;
// Punto de la transición (0→1) donde el Hero termina de apagarse y AboutMe
// arranca a aparecer — antes eran las mismas ventanas (0→0.35) y las dos
// cosas pasaban casi juntas; el usuario pidió correr la aparición de
// AboutMe a la mitad ("se empieza a ver visible en la mitad de la
// animación, me parece que está apareciendo muy pronto").
const CROSSFADE_MIDPOINT = 0.5;

/**
 * Hero — **afiche de teatro** (recompuesto 2026-08-18).
 *
 * La versión anterior era un retrato centrado con dos columnas de texto
 * flotando a los costados: medido, **55,4 % del viewport quedaba vacío**, con
 * la ocupación por franja vertical en 36 / 17 / 83 / 87 / 21 / 22 % — o sea
 * todo el peso en el centro (la figura) y los bordes casi sin nada. El pedido
 * del usuario fue exactamente ese: "muchísimo espacio libre".
 *
 * Lo que cambia, y por qué:
 *
 * - **El nombre pasa a escala de afiche y cruza por DETRÁS de la figura.** El
 *   retrato es un recorte con alfa, así que tipografía y cuerpo pueden ocupar
 *   el mismo plano — que es lo que hace un afiche y lo que acá no pasaba. El
 *   `FILMUS` se estira hasta el borde derecho y llena la franja central, que
 *   era la que estaba vacía a los costados de la figura.
 * - **La figura se ancla abajo y se alinea a la derecha**, con aire sobre la
 *   cabeza: el recorte de `nora-portrait.webp` viene trimeado al ras del pelo
 *   (`sharp.trim()`), así que a `h-full` la cabeza tocaba el borde superior y
 *   se leía como cortada. Ahora la imagen mide menos que el viewport y respira.
 * - **La figura es una sola foto estática de Nora, sin fondo**
 *   (`/img/nora-portrait.webp`, `object-contain object-bottom`, sin marco).
 *   Pasó brevemente por un efecto halftone (1/9), por un rotador de las 28
 *   fotos de `external-assets/polas/` (3/9–4/9) y por `PhotoMarquee` (una
 *   pared diagonal de 12 fotos de `/img/presente/` con tres filas animadas
 *   en loop infinito + una capa de `backdrop-blur-md` sobre buena parte del
 *   viewport, probada y revertida el mismo 4/9 — el usuario reportó el sitio
 *   "lentísimo" con esto puesto, muy probablemente el `backdrop-blur`
 *   corriendo sobre un área grande del Hero en cada frame de las tres
 *   animaciones simultáneas; el componente se borró entero, no quedó sin
 *   usar — si se retoma, evitar `backdrop-blur` de área grande). Volvió a
 *   una sola foto estática
 *   **2026-09-04**, recortada de `DSC01552.jpg` (mismo lote/sesión, mismo
 *   fotógrafo) en vez de `DSC01503.jpg`, que era la fuente original del
 *   17/8. Mismo tratamiento de siempre: alfa real
 *   (`@imgly/background-removal-node`, modelo local, no una API) +
 *   `sharp.trim()` al bounding box, corrido en dos procesos Node separados
 *   (sharp y onnxruntime no cargan juntos en el mismo proceso en este
 *   Windows — ver memoria `sharp-vs-onnxruntime-y-shrink-to-fit`). Mismo
 *   crédito de siempre (`hero.portraitCredit`, "Paula").
 * - **Los pilares bajan a una banda al pie, en horizontal** (`orientation="inline"`
 *   de `PillarMenu`), con una hairline arriba. Llenan el ancho del pie, se leen
 *   como navegación y ya no flotan chicos en la esquina derecha.
 * - Contacto y ubicación van en esa misma banda: una sola línea de pie en vez
 *   de dos elementos sueltos en esquinas opuestas.
 *
 * `sticky top-0 z-0`: el Hero queda anclado mientras el scroll sigue y
 * `AboutMe` lo tapa deslizándose por encima. Es la firma del sitio y no se
 * toca.
 *
 * Todo el texto sale de `src/i18n/content.ts` (ES/EN).
 *
 * **La figura recortada se va, entra una foto real de cuerpo/escena
 * (2026-09-06).** Pedido explícito del usuario, iterado en vivo en la misma
 * sesión — versión final, reemplaza dos intentos intermedios que no llegaron
 * a commitear:
 *
 * 1. Primero se probó el recorte nuevo que trajo el usuario
 *    (`DSC01552-removebg-preview.png`, exportado con remove.bg) en el mismo
 *    lugar que ocupaba `nora-portrait.webp` — recorte prolijo pero source de
 *    408×612 (preview gratuito del servicio), muy por debajo de los
 *    ~700–900px de alto a los que se ve la figura en pantallas grandes.
 * 2. Después se agregó una capa de fondo atmosférica aparte (foto real
 *    desenfocada/oscurecida detrás de esa figura, con spotlight que sigue al
 *    mouse) — calcada del `Hero.tsx` de `nora-landing`. Funcionaba, pero con
 *    las dos capas puestas juntas se veían **dos caras de Nora a la vez**
 *    (la figura nítida de un lado, un fantasma en escala de grises del otro)
 *    — se corrigió oscureciendo el fondo, pero el usuario resolvió el
 *    problema de raíz pidiendo sacar la figura entera.
 *
 * 3. Con la figura ya afuera, el usuario pidió calcar el fondo de
 *    `nora-landing` **exactamente**, no una variación propia — así que la
 *    versión con `mask-image` de borde izquierdo (feather sobre una foto
 *    pegada a la derecha, sin spotlight, con Ken Burns) que hubo acá un rato
 *    también se reemplazó.
 *
 * **Versión final:** la figura recortada (`nora-portrait.webp`) y la luz de
 * escena ambiente que vivía detrás suyo se borraron del todo (esa luz era
 * funcional a la figura — sin figura, un resplandor rojo suelto no tenía
 * trabajo que hacer). El fondo es un calco 1:1 del mecanismo de
 * `nora-landing/src/components/Hero.tsx`: foto a pantalla completa
 * (`/img/hero-fondo.jpg`, de `external-assets/Norah_/DSC01809.jpg` — misma
 * sesión y fotógrafa que el retrato viejo, "Foto: Paula") en dos capas —
 * color abajo, escala de grises arriba enmascarada con un spotlight que
 * sigue al mouse (mismo tracking por variables CSS que `BackgroundDots`) —
 * más los mismos dos velos en gradiente (horizontal para el bloque de texto,
 * vertical para tope/pie) con los mismos stops de opacidad. Sin Ken Burns:
 * `nora-landing` no lo tiene, y iguales pixel a pixel era el pedido.
 *
 * **Ajustes finos, mismo día:** la cara quedaba del lado izquierdo del
 * cuadro porque el contenedor (viewport entero) siempre es más ancho que la
 * fuente escalada a cubrir el alto — no hay recorte horizontal real, así que
 * `object-position` en X no mueve nada (ver comentario inline). Se espeja la
 * imagen entera (`-scale-x-100`) para que la cara quede a la derecha, que es
 * lo que pidió el usuario. `BackgroundDots` se sacó del Hero (pidió llevarlo
 * "al resto de la home" — ver `AboutMe.tsx`/`ProgramIndex.tsx`).
 *
 * **El fondo de foto a pantalla completa se reemplaza por un video en loop,
 * confinado a un panel a la derecha (2026-09-09).** Pedido explícito del
 * usuario: "Nora a la derecha dando lugar al texto Nora Filmus y lo que hay
 * debajo". El fondo full-bleed de arriba (con el spotlight que sigue al
 * mouse) ocupaba todo el ancho y competía con el wordmark/bio que van
 * encima — funcionaba con foto estática pero no tenía sentido mantenerlo al
 * pasar a video, que ahora es el protagonista visual, no una textura de
 * fondo.
 *
 * El clip (`/video/hero-loop.mp4`, 5s, sin audio, loop nativo) se generó con
 * **Kling v3 Pro** (fal.ai) a partir de una foto real de Nora
 * (`external-assets/Norah_/DSC01809.jpg`, misma sesión/fotógrafa que
 * `hero-fondo.jpg`): viento sutil en el pelo, sonrisa cálida de labios
 * cerrados (pedido explícito: "no muestra dientes, sonrisa más tranqui") y
 * primer/último frame casi idénticos para que el loop no salte. **Se probó
 * primero con Seedance 2.5** (la opción "más avanzada" que había pedido el
 * usuario) pero ByteDance rechazó la foto real con
 * `content_policy_violation` / `partner_validation_failed` — su filtro de
 * identidad bloquea cualquier rostro humano fotorrealista reconocible en
 * video, a diferencia de su propio modelo de imagen (Seedream), que la
 * misma foto sí pasó sin problema. Intentar esquivar ese filtro (por
 * ejemplo re-procesando la foto para que no matchee como "real") se
 * descartó a propósito — cruza la línea de evadir un sistema de protección
 * de identidad. Kling no tiene ese bloqueo y además sale ~4× más barato
 * ($0.112/s contra $0.47/s de Seedance a 720p).
 *
 * El panel usa `mask-image` (feather horizontal, no un borde duro) para que
 * el video se funda en el `bg-ink` de la izquierda en vez de leerse como un
 * recuadro pegado — mismo recurso que ya usa `BackgroundDots`/el mosaico de
 * `PillarMenu`, nunca un `box-shadow` (`design-system` lo prohíbe). Respeta
 * `useReducedMotion()` Y `useSlowConnection()` (2026-09-09, ver
 * `lib/hooks/use-connection.ts`): con reduce-motion o con ahorro de
 * datos/2G se sirve el primer frame como imagen estática (`Picture`, con
 * sus propios derivados AVIF/WebP) en vez del `<video autoPlay>` — evita
 * bajar los ~520KB de `hero-loop.mp4` quien ya pidió gastar menos datos.
 * **No verificado en el navegador automatizado de
 * este entorno** (`mcp__claude-in-chrome`/Playwright no reproducen video,
 * `readyState` se queda en 0 — ver skill `performance`) — el usuario ya vio
 * el clip final fuera de este flujo antes de integrarlo acá, pero conviene
 * confirmar el timing/encuadre en un navegador real después de este cambio.
 *
 * **Bug real, corregido 2026-09-10:** el `<video>` tenía `preload="none"`
 * junto con `autoPlay` — el usuario reportó "en el teléfono no se reproduce
 * solo y aparece el botón de play". `preload="none"` le dice al navegador
 * que no baje ni un byte hasta que se pida play explícitamente; en Safari
 * de iOS (y en menor medida Chrome Android) eso puede pisar el pedido de
 * `autoplay` — el video nunca llega a bufferizar lo suficiente y queda en
 * pausa mostrando el poster + el botón de play nativo. Ya no hacía falta:
 * la decisión de "no bajar el video" ya la toma `showStaticPanel` (arriba)
 * ANTES de renderizar este `<video>` — cuando sí se renderiza, es porque se
 * quiere que autoplayee, así que `preload="auto"` es lo correcto acá, no un
 * desperdicio de datos.
 *
 * **Mobile: vuelve a mostrarse (2026-09-09), pedido explícito** ("quiero que
 * el video se vea también en la vista mobile") — antes (`hidden md:block`)
 * se ocultaba por completo porque a `<md` el layout es una sola columna y el
 * panel de altura completa quedaba detrás del bloque de texto. En vez de
 * ocultarlo, ahora el panel es más ancho en mobile (`w-[62%]`, va angostando
 * por breakpoint hasta `lg:w-[40%]`) y el `mask-image` come más terreno
 * (`black_38%` en mobile contra `black_24%` en desktop) — el texto tiene más
 * ink de sobra detrás suyo cuanto más angosta la pantalla, para que la
 * mayor superposición relativa en mobile no le gane legibilidad al texto.
 *
 * **Dos revisiones del clip, mismo día:** (1) el usuario pidió que la
 * expresión se mantenga IDÉNTICA a la de la foto de referencia de punta a
 * punta — la primera versión hacía crecer una sonrisa a mitad de clip, que
 * se sacó del prompt; ahora la única sonrisa es la mueca ya presente en la
 * foto original, sin dientes, más un parpadeo natural. (2) el usuario
 * proveyó después un export del mismo clip en mucha mejor calidad
 * (2160×3302, 60fps, sin comprimir, vía `Nora-intro-nuevo.mp4` en su
 * escritorio) para reemplazar la descarga comprimida original de fal.ai —
 * se re-optimizó desde esa fuente (840w, 24fps, crf 24) en vez de la
 * primera pasada.
 *
 * **Transición de foco: Nora se mueve de derecha a izquierda al hacer scroll
 * (2026-09-10).** Pedido explícito del usuario: al scrollear desde el Hero,
 * antes de que se revele `AboutMe`, quería "como un enfoque a Nora" que
 * termina con la figura reposicionada a la izquierda. Se resolvió con un
 * segundo clip (`/video/hero-transition.mp4`, Kling v3 Pro, mismo mecanismo
 * que `hero-loop.mp4`) generado con `start_image_url`/`end_image_url` a
 * partir de dos fotos reales de una sesión nueva (`DSC01809.jpg`/`DSC01824.jpg`,
 * carpeta `noravid` del escritorio del usuario) — el prompt le pide a Kling
 * un dolly/push-in continuo, sin cortes, para que lea como una sola toma
 * embebida. El propio encuadre de las fotos no cruza de derecha a izquierda
 * (Kling no reposiciona el sujeto dentro del cuadro de forma confiable); el
 * movimiento de "derecha a izquierda" lo hace el PANEL como pieza de layout
 * (`x` motion value), no el contenido del video — el push-in del clip vende
 * el "enfoque", el `x` del panel vende el "se mueve".
 *
 * **Segunda vuelta el mismo día: se probó un autoplay bloqueado (scroll-lock
 * + el clip jugando solo, sin scrubbing) y el usuario reportó "no quedó" —
 * revertido.** El pedido, en sus propias palabras: "entrás a la página,
 * estás en el hero, hacés scroll y vas a la sección about me, mientras vemos
 * la transición de Nora posicionándose a la izquierda — en definitiva el
 * hero Nora está a la derecha, y en about me Nora a la izquierda, así de
 * fácil". Eso es exactamente scroll-scrub: la posición del panel y el avance
 * del video van DIRECTO de la mano del scroll del usuario, sin intermediar
 * ningún bloqueo/autoplay — la versión que sigue documentada acá abajo es
 * esta, la del scroll-scrub, no la del autoplay bloqueado (que se sacó
 * entera del código: sin `wheel`/`touch`/`keydown` interceptados, sin
 * `document.body.style.overflow`, sin `window.scrollTo` programático).
 *
 * **Mecánica (scroll-scrub).** El Hero (un solo `div` `sticky h-screen`)
 * ahora vive envuelto en un contenedor con `TRANSITION_EXTRA_VH` de alto
 * extra (`calc(100vh + 100vh)`) — el `sticky` interno se mantiene pegado
 * durante TODO ese alto extra, dándole a la transición su propio tramo de
 * scroll antes de que `AboutMe` (que sigue en el flujo normal justo después)
 * empiece a cubrir al Hero como ya hacía. `useScroll({ target: wrapperRef,
 * offset: ['start start','end end'] })` da un `scrollYProgress` 0→1 que dura
 * exactamente ese tramo — a progress 1 el `sticky` se despega solo y
 * `AboutMe` curtain-revela como siempre, sin código nuevo para esa parte.
 *
 * Con ese progress, un único `useMotionValueEvent(scrollYProgress, 'change',
 * ...)` escribe TODO a mano sobre refs de DOM — nada de `useTransform`
 * ligado por `style` para los valores continuos (ver el gotcha real más
 * abajo, "Por qué no `useTransform`+`style`", que explica por qué):
 * - `panelRef.style.transform = translateX(-progress * shiftPx)` — `shiftPx
 *   = window.innerWidth - panel.offsetWidth`, medido con `ResizeObserver`
 *   sobre el panel en vez de replicar a mano el ancho responsive del panel
 *   por breakpoint, que ya vive en clases Tailwind (`w-[62%] sm:w-[52%]...`).
 *   `translateX`, no `left`/`width`: solo dispara compositor, no layout — la
 *   lección de `PhotoMarquee` (ver arriba, revertido por lento) fue
 *   justamente evitar trabajo de layout/pintado por frame en el Hero.
 * - `loopVideoRef`/`scrubVideoRef.style.opacity`: crossfade en los primeros
 *   progress 0→0.08 entre el `<video>` de loop (autoplay, arriba) y el de
 *   transición (pausado, debajo) — sin esto, arrancar a "pausar" el loop en
 *   seco se sentía como un salto. El scrub video arranca en `opacity: 0`
 *   puesto por JSX (no por el callback: a progress exactamente 0 el
 *   callback ni se dispara todavía, un evento `'change'` no se auto-dispara
 *   al montar).
 * - `scrubVideoRef.currentTime = progress * duration` — scrub real, el
 *   usuario controla el avance con la rueda, no el framerate del video. Es
 *   justo lo que la primera versión de esta feature hacía y lo que la
 *   segunda (autoplay bloqueado) sacó — y lo que el usuario pidió de vuelta.
 * - `topBarRef`/`bodyRef`/`footerFadeRef.style.opacity`: el wordmark/bio/
 *   credenciales/menú (todo lo que hoy vive a la izquierda) se desvanece en
 *   progress 0→0.35 — sin esto, cuando el panel llega a la izquierda
 *   quedaría DEBAJO del texto (ese bloque tiene `z-30`, el panel no tiene
 *   z-index propio) y el reposicionamiento no se vería. Pasado ese punto
 *   (`contentHidden`, sí por `setState` — ver abajo) esos tres bloques
 *   también llevan `inert` (mismo patrón que `Header.tsx`/H3 de la auditoría
 *   de producción) para que no queden focusables invisibles.
 * - `panelOnLeft` (bandera discreta en progress 0.5, por `setState`): flipea
 *   la dirección del `mask-image` del panel vía clase de Tailwind — un
 *   cambio de clase NECESITA re-render de React, no hay forma de escribirlo
 *   a mano como las de arriba. El feather siempre tiene que mirar hacia el
 *   lado "interior" (el que se funde con el `ink`) y el borde duro hacia el
 *   borde de pantalla — en reposo (derecha) el feather mira a la izquierda;
 *   cruzado al lado izquierdo, tiene que mirar a la derecha, si no el corte
 *   duro cae en el medio de la composición en vez de en el borde real de la
 *   pantalla.
 *
 * `contentHidden`/`panelOnLeft` son las ÚNICAS dos cosas que pasan por
 * `setState` en todo este mecanismo — son cambios de clase/atributo
 * discretos, no algo que tenga sentido interpolar continuo, así que el
 * costo de un re-render puntual al cruzar el umbral es aceptable.
 *
 * **Por qué no `useTransform`+`style` para lo continuo — el bug real que
 * forzó a escribir todo a mano, documentado acá porque vale la pena para
 * cualquier futuro efecto scroll-driven de este sitio.** El primer intento
 * ataba el `transform` del panel y el `currentTime` del video a
 * `scrollYProgress` vía `useTransform(...)` + `style={{x: ...}}`. Se veía
 * bien en las primeras pruebas, pero un hook de debug temporal
 * (`window.__heroDebug`, nunca commiteado) mostró que el valor aplicado al
 * DOM podía quedar **clavado a mitad de scroll**: `contentHidden`/
 * `panelOnLeft` llaman `setState`, lo que re-renderiza el componente, lo que
 * recrea cada `useTransform(...)` declarado inline en el cuerpo del render
 * (no estaban memoizados) — si esa recreación coincidía con un instante en
 * que `scrollYProgress` todavía se estaba actualizando (varios frames de
 * rAF por scroll), la instancia NUEVA nacía con el progreso intermedio de
 * ESE momento exacto y no se refrescaba más. El parámetro que recibía el
 * propio `useMotionValueEvent`, en cambio, siempre llegaba preciso en todas
 * las pruebas — por eso todo lo continuo se calcula a mano a partir de ese
 * parámetro (sin pasar por ningún `useTransform` intermedio) y se escribe
 * directo con `ref.current.style...`.
 *
 * Todo el mecanismo se apaga entero (`enableTransition = !reduced &&
 * !slowConnection`) con `prefers-reduced-motion` O ahorro de datos/2G — en
 * ese caso el wrapper no gana alto extra, el clip de transición ni se pide,
 * y el Hero se comporta exactamente como antes de este cambio (sin
 * scroll-jacking para quien pidió menos movimiento, sin bajar ~1,2MB más
 * para quien pidió gastar menos datos). Ídem `showStaticPanel` (`reduced ||
 * slowConnection`, ya existente): son mutuamente excluyentes con
 * `enableTransition`, así que nunca compiten por el mismo panel.
 *
 * **Los dos bordes del panel se difuminan siempre, no uno solo que flipea
 * (2026-09-10).** Versión anterior: `mask-image` de un solo lado (el
 * "interior", el que da contra el `ink`) que cambiaba de dirección a mitad
 * de la transición (`panelOnLeft`, un `setState`) — el usuario reportó que
 * en algunos frames se veía "un borde lineal" (el lado duro/opaco del
 * panel, que en reposo cae siempre contra el borde de pantalla, cruzaba por
 * el MEDIO de la composición mientras el panel viajaba, antes de llegar a
 * su destino). Reemplazado por una única máscara simétrica (`transparent,
 * black X%, black (100-X)%, transparent`, mismo recurso que ya usa el
 * marquee de `AboutMe`) que difumina los DOS bordes todo el tiempo — sin
 * flip, sin `setState`, sin la noción de "lado duro". Se simplificó de paso:
 * ya no hace falta la bandera `panelOnLeft` para nada.
 *
 * **Una sola escena: `AboutMe` se superpone AL PANEL, cruce de opacidades en
 * el mismo lugar, no una sección que se scrollea aparte (2026-09-10, dos
 * vueltas el mismo día).** Pedido original: "todo en una misma sección...
 * about me queda junto con Nora a la izquierda" — la primera solución hizo
 * que `AboutMe` viviera como hijo normal-flow de `wrapperRef` (después de un
 * colchón de scroll), con su propia entrada por `getBoundingClientRect()`.
 * El usuario la vio y pidió una más simple: "quiero que el container del
 * contenido ya exista detrás con opacidad... no quiero que venga de
 * abajo... si vuelvo al hero, empieza a desaparecer en su lugar, tal cual lo
 * hace el logo Nora y su información en el hero" — un cruce de opacidades
 * puro, en el MISMO sitio de pantalla, sin que nada se traslade
 * verticalmente. Versión final (la que sigue en el código):
 * - `<AboutMe />` se renderiza DENTRO del `div` `sticky` (no en `Home`,
 *   `App.tsx` — ver su docblock), como capa superpuesta (`absolute inset-0`,
 *   ver `AboutMe.tsx`) al panel de Nora y al texto del Hero — comparten
 *   exactamente el mismo espacio de pantalla.
 * - `wrapperRef` vuelve a tener una altura FIJA (`calc(100vh + N vh)`,
 *   `N = TRANSITION_EXTRA_VH + TRANSITION_HOLD_VH`) — ya no hace falta que
 *   crezca con el contenido de `AboutMe` (ese contenido ya no es normal-flow,
 *   no aporta altura). `TRANSITION_HOLD_VH` es scroll EXTRA después de que
 *   la transición ya terminó (progress=1): sin él, el `sticky` se despega en
 *   el acto apenas termina el cruce y la composición asentada dura un
 *   instante en pantalla — con el hold, el usuario tiene un tramo para
 *   quedarse mirándola.
 * - La opacidad de `AboutMe` (`aboutContentRef`, prop `contentRef`) usa la
 *   fórmula ESPEJO exacta de la que ya apaga el texto del Hero: en vez de
 *   `Math.max(0, 1 - progress/0.35)` (empieza en 1, llega a 0), es
 *   `Math.min(progress/0.35, 1)` (empieza en 0, llega a 1) — mismo
 *   `progress`, mismo umbral, un cruce de verdad, no dos animaciones
 *   independientes que casualmente coinciden en el tiempo. `AboutMe.tsx`
 *   también gana `inert` (`!contentHidden`) para que su CTA/marquee no sean
 *   alcanzables por teclado antes de que les toque aparecer.
 *
 * **Problema real encontrado en la propia verificación, no pedido por el
 * usuario:** al centrar el contenido de `AboutMe` en un solo viewport de
 * 100vh (ya no tiene el alto libre de una sección propia), el bloque
 * completo medía 1114px de alto contra un viewport de 900px — se recortaba
 * contra el `overflow-hidden` del `sticky`. Se compactó en `AboutMe.tsx`
 * (título más chico, `mt-*`/`space-y-*` reducidos, fichas del marquee más
 * chicas) hasta 859px — cabe holgado a 900/850px, con un recorte marginal
 * (~30px por lado) solo en laptops de 800px de alto, medido con Playwright
 * en varias alturas de viewport.
 *
 * **Vuelta al container plano, sin fondo (2026-09-10, más tarde el mismo
 * día).** Tres reportes del usuario: (1) "la foto de Nora siempre queda al
 * frente, solo en mobile queda por detrás" — no era un bug de z-index, era
 * el `bg-gradient-to-r` cubriendo un ancho desigual entre breakpoints
 * (columna angosta en desktop, 100% en mobile por falta de `max-w-*`); (2)
 * "los tiempos no son los mismos que el desvanecimiento del Hero" —
 * consecuencia del mismo degradé desigual, la fórmula ya era un espejo
 * exacto; (3) "no quiero una caja negra flotando — que el contenido esté en
 * un container posicionado a la derecha, igual que el container del logo de
 * Nora Filmus, el slider de marcas, etc." Los tres se resolvieron sacando el
 * `bg-gradient-to-r` y devolviendo el ancho de la columna al mismo que usa
 * el Hero (`md:max-w-[54%] lg:max-w-[58%]`, sin superposición deliberada al
 * panel) — ver el docblock de `AboutMe.tsx` para el detalle completo.
 *
 * **AboutMe aparecía muy pronto — cruce secuencial en vez de simultáneo
 * (2026-09-10, mismo día).** Las dos ventanas (Hero apagándose, `AboutMe`
 * prendiéndose) usaban el mismo rango `0→0.35` — casi se superponían en el
 * tiempo. Se reemplazó por un cruce SECUENCIAL, partido exacto al medio
 * (`CROSSFADE_MIDPOINT = 0.5`): el Hero se apaga entero en la primera mitad
 * de la transición (`1 - progress/0.5`, llega a 0 exactamente en
 * progress=0.5) y `AboutMe` no empieza a aparecer hasta ahí
 * (`(progress - 0.5) / 0.5`, sigue en 0 hasta la mitad, llega a 1 al final).
 * Sin superposición temporal entre las dos.
 *
 * **Autoplay probado una segunda vez (2026-09-10/11) y revertido de nuevo —
 * "no me gustó automático, dejemoslo como estaba antes".** Con `AboutMe` ya
 * viviendo como capa superpuesta (ver arriba), se intentó de nuevo la idea
 * de "se dispara sola al primer scroll y corre de punta a punta" (wheel/
 * touch/keydown interceptados, `document.body.style.overflow` bloqueado,
 * `panelRef`/contenido animando por tiempo con `motion` en vez de por
 * scroll). El usuario lo probó y no le gustó — igual que la primera vez
 * que se probó autoplay. Revertido entero: no hay wheel/touch/keydown
 * interceptados, no hay bloqueo de scroll, todo vuelve a ser scroll-scrub
 * puro, la versión documentada arriba ("Mecánica (scroll-scrub)") y la que
 * sigue en el código. Si en algún momento se vuelve a pedir "automático",
 * más vale confirmar con el usuario exactamente qué se espera ver ANTES de
 * reimplementarlo — dos intentos seguidos rechazados con la misma idea
 * sugiere que "automático" no es lo que realmente se busca, aunque así se
 * lo pida con esa palabra.
 *
 * **Verificado con scroll programático real** (Playwright contra un build
 * de producción, `vite preview` — no `mcp__claude-in-chrome`, que no
 * reproduce video, ver skill `performance`): en `scrollY=0/150/315/450/900/
 * 1800`, la opacidad de `AboutMe` + la del texto del Hero suman ~1.0 en cada
 * punto (`0+1`, `0.476+0.524`, `1+0`, sostenido `1+0` durante todo el hold)
 * — el cruce es exacto y simétrico. Captura de pantalla a mitad de camino
 * confirma visualmente el wordmark "Nora Filmus" y el título/bio de
 * `AboutMe` semi-transparentes, superpuestos en el mismo lugar, sin ningún
 * desplazamiento vertical. Sin overflow horizontal a 1440 ni 390.
 *
 * **No verificado**: cómo se siente el gesto real de scroll de punta a
 * punta con el video reproduciendo de verdad (mismo límite de siempre con
 * video en este entorno) — el usuario debería confirmarlo en un navegador
 * real, en particular el timing/ritmo (`TRANSITION_EXTRA_VH`/
 * `TRANSITION_HOLD_VH = 100` cada uno son un punto de partida, no una
 * medición) y la legibilidad del texto de `AboutMe` sobre el panel en
 * mobile (ahí se superponen — mismo trade-off que ya acepta el propio texto
 * del Hero en esa misma vista, no algo nuevo de este cambio, pero vale la
 * pena que el usuario lo mire).
 *
 * **Auditoría de fluidez/UX (2026-09-10, pedido explícito: "audit la
 * transición para que quede súper smooth, tiempos, ux/ui en desktop y
 * mobile, tenés libertad absoluta").** Cuatro problemas reales, los cuatro
 * medidos en navegador antes de tocar código (Playwright contra un build de
 * producción, incluyendo la primera emulación real de
 * `prefers-reduced-motion` que este mecanismo tuvo — hasta ahora solo se
 * había verificado "por código"):
 *
 * 1. **La escalera, la causa real de "no queda smooth".** El progreso se
 *    aplicaba en seco al `scrollY` crudo: una sola muesca de rueda (~100px)
 *    movía el panel **96px de una sola vez, en un frame**. Medido antes del
 *    fix: delta constante de -96.3px por muesca, cero frames intermedios —
 *    era literalmente una escalera, no un movimiento de cámara, sin importar
 *    qué curva de easing llevara el `translateX`. Se resolvió con
 *    amortiguación exponencial (`SCROLL_SMOOTHING`, independiente del
 *    framerate — `1 - (1-k)^(dt/16.67)`) que persigue el `target` en vez de
 *    aplicarlo: el rAF corre SOLO mientras hay distancia por recorrer y se
 *    corta solo en reposo (`SMOOTH_SNAP_EPSILON`). Medido después: la misma
 *    muesca ahora se reparte en ~35-49 frames con un salto máximo de
 *    2-2.7px — 35-48× menos por frame. `SMOOTH_JUMP_THRESHOLD` evita
 *    amortiguar los saltos GRANDES (un ancla, una restauración de scroll del
 *    navegador): esos deben verse instantáneos, no deriva lenta.
 * 2. **`prefers-reduced-motion` rompía la composición entera — bug real, no
 *    cosmético.** Nunca se había podido emular en este proyecto (limitación
 *    documentada varias veces en `CLAUDE.md`); en cuanto se probó, apareció:
 *    con reduced-motion nadie escribía la opacidad de `AboutMe` (el efecto
 *    entero está gateado por `enableTransition = !reduced && !slow`), así
 *    que `AboutMe` (`opacity` inicial 1, `absolute inset-0`) se pintaba
 *    SIEMPRE, superpuesto y opaco sobre el Hero — dos secciones enteras
 *    ilegibles, una encima de la otra. La causa de fondo: el prop `overlay`
 *    de `AboutMe` (ver su docblock) ahora es explícito — con
 *    `enableTransition=false` la sección se renderiza en modo `flow`
 *    (normal, después del Hero, con su propio `bg-ink`), nunca en modo capa.
 * 3. **El ancla `#sobre-mi` (Header, Footer, el CTA del propio Hero) no
 *    hacía nada — bug real.** El `id="sobre-mi"` vivía en la sección
 *    superpuesta (`absolute inset-0` dentro del `sticky`), que está SIEMPRE
 *    en el viewport sin importar el scroll — `scrollIntoView` no tenía a
 *    dónde ir. Confirmado: `scrollY` se quedaba en 0 y la opacidad en 0
 *    tras "navegar" ahí. Se resolvió con un marcador de 1×1px, posicionado
 *    en el punto exacto donde `TRANSITION_EXTRA_VH` termina (donde la
 *    composición ya está asentada) — ese es el destino real del ancla en
 *    modo capa; en modo `flow` el `id` vuelve a vivir en la propia
 *    `<section>` de `AboutMe`, que si es una sección normal.
 * 4. **Recorte en viewports intermedios — bug real, encontrado midiendo, no
 *    a ojo.** El bloque de `AboutMe` (ya compactado en F9-adyacente) sigue
 *    midiendo 695-960px según ancho/idioma, y vive en un `overflow-hidden`
 *    sin scroll propio. Un umbral de solo-alto (800px) dejaba pasar
 *    portátiles de 13" con éxito pero un iPad/ventana de 768×900 se
 *    recortaba 50-60px — el ancho angosto de `md` (768-1023px, columna al
 *    54%) empuja MÁS saltos de línea que un mobile de una sola columna. El
 *    fix real fue doble: (a) `OVERLAY_MEDIA_QUERY` ahora pide ancho Y alto
 *    (`min-width:1024px and min-height:820px` — recién en `lg` la columna
 *    ensancha lo suficiente para estabilizar el bloque bajo 770px en los dos
 *    idiomas, medido en 26 combinaciones de viewport×idioma tras el fix, 0
 *    recortes); (b) la bio de `AboutMe` en modo capa gana un escalón de
 *    ancho (`max-w-lg`, 512px ≈60 caracteres/línea, contra `max-w-md` en
 *    modo flow) para bajar 2 líneas de la columna angosta. Consecuencia
 *    aceptada a propósito: 1366×768 (portátil muy común) cae a modo `flow`
 *    por 52px de alto — conservador, pero la transición de Nora se sigue
 *    viendo igual en ese modo, solo que `AboutMe` no queda superpuesta.
 *
 * **Otros cambios de pulido, mismo pase:**
 * - El panel de video gana `will-change: transform` — se mueve en cada
 *   frame de la transición y lleva una `mask-image`; sin la promoción a
 *   capa propia el compositor tiene que recomponer esa máscara en cada
 *   frame junto con el resto de la página.
 * - El progreso se mide contra el alto REAL del `sticky` (`stickyRef`, que
 *   es `100svh`), no `window.innerHeight`: en mobile ese valor cambia varios
 *   px cuando la barra de URL se esconde al primer scroll, y con
 *   `window.innerHeight` el progreso pegaba un salto pequeño a mitad de
 *   gesto justo en ese momento. `svh` (small viewport height, estable) en
 *   vez de `vh`/`dvh` en el alto del wrapper por el mismo motivo — `dvh`
 *   cambiaría DURANTE el scroll y haría bailar la altura total del wrapper.
 * - `easeInOutSine`/`easeInQuad`/`easeOutQuad` (`lib/ease.ts`, nuevos): el
 *   viaje del panel va eased (cámara que acelera y se asienta, no un slider
 *   lineal) y el cruce Hero↔AboutMe usa curvas que se sostienen y caen
 *   rápido / suben rápido y se asientan hacia el punto medio — con las dos
 *   rampas lineales de antes había un tramo de pantalla casi vacía
 *   alrededor de `CROSSFADE_MIDPOINT`.
 * - El seek del video de transición ahora tiene un umbral mínimo
 *   (`VIDEO_SEEK_EPSILON`, medio frame a 24fps): pedir `currentTime` en CADA
 *   frame de rAF, incluso por una fracción de frame de video, es trabajo de
 *   decodificación de sobra: con el progreso ya amortiguado los saltos son
 *   chicos y la mayoría caen por debajo del umbral.
 * - `heroInert`/`aboutInert` ya no dependen de un único booleano de "cruzó
 *   la mitad" (`contentHidden`, de la versión anterior) sino de la opacidad
 *   real de cada lado (`<0.05`) — más preciso, y necesario ahora que las dos
 *   curvas de opacidad son eased y no lineales (cruzan el 50% de progreso
 *   sin estar todavía al 50% de opacidad visual).
 *
 * **Verificado con Playwright contra un build de producción**, incluyendo
 * por primera vez `page.emulateMedia({ reducedMotion: 'reduce' })` (nunca
 * antes se había podido probar esto en este proyecto — documentado como
 * limitación en varias entradas de `CLAUDE.md`, resultó ser un entorno que
 * SÍ lo soporta, solo faltaba pedirlo): fluidez de rueda (35-49 frames por
 * muesca, salto máx 2-2.7px), reduced-motion (Hero legible, sin
 * superposición), ancla `#sobre-mi` (scrollY y opacidad correctos), gesto
 * táctil en mobile (sin overflow horizontal), y 26 combinaciones de
 * viewport×idioma sin recorte. `npm run lint`/`npm run build` limpios.
 *
 * **No verificado**: el gesto real de rueda/trackpad/touch con el video
 * reproduciendo de verdad en un navegador real (límite de siempre con video
 * en este entorno) — la mecánica y los números están confirmados, pero el
 * "se siente bien" final lo tiene que dar el usuario.
 *
 * **El rail de `SectionNav` se ve desde el principio en desktop (2026-09-11),
 * el contenido corre un poco a la derecha para hacerle lugar.** Pedido
 * explícito: "en la home, resoluciones de escritorio, hacemos que el menú se
 * vea desde el principio... movete un poco el contenedor del hero con texto a
 * la derecha". El rail vertical de `SectionNav.tsx` vivía oculto en `/` hasta
 * pasar el Hero (mismo criterio que `Header`, para no duplicar el
 * wordmark/toggle que el propio Hero ya trae) — ahora se muestra siempre en
 * desktop (`lg:`, ver su docblock), así que compite por el mismo borde
 * izquierdo que ya usaba `topBarRef`/`bodyRef` (`px-6 sm:px-10 md:px-12`). Se
 * agregó `lg:pl-28` a esos dos bloques (ubicación+toggle arriba, wordmark+
 * bio+credenciales abajo) — no a la banda de pie (los íconos de contacto van
 * centrados, no pegados al borde, así que no colisionan). El rail mide,
 * desde el borde real de pantalla, `left-6` (24px) + punto + gap + el label
 * del ítem activo siempre expandido (hasta 8rem) — `lg:pl-28` (112px) da
 * margen de sobra sin exagerar el corrimiento ("un poco", no una columna
 * nueva).
 *
 * **Legibilidad en mobile — de halo blanco a scrim con blur (2026-09-11/12).**
 * Primero fue `.text-shadow-legible` (un `text-shadow` blanco alrededor del
 * glifo); se sacó a pedido explícito ("saca el text shadow de los textos en
 * la home") y se reemplazó por `.text-legible-blur` (`src/index.css`,
 * `backdrop-filter: blur(3px)`, sin fondo de color — "apenas blur, que sea
 * legible el texto, no quiero que contraste con todo"), `rounded-lg` en
 * cada uso salvo el toggle de idioma (`rounded-full`, es un control) —
 * mismo alcance: el toggle de idioma, la fila de rol y la bio del Hero,
 * para el tramo donde ese texto pisa el panel de video en mobile (medido
 * con Playwright a 390px, sin `max-w-*` por debajo de `md`). Mismo
 * tratamiento en `AboutMe.tsx` modo `overlay` (ver su docblock) — ahí
 * queda solo en bio/`figcaption`, eyebrow y `h2` van sin blur.
 *
 * **Probado un chip por palabra (`BlurWords.tsx`) el 2026-09-12 y
 * revertido el mismo día** — pedido explícito ("que el blur salga de cada
 * palabra") con un `flex flex-wrap` por palabra en vez del `<p>` de texto
 * corrido de siempre. El usuario lo probó y pidió volver atrás en la misma
 * sesión: además de que la animación de scroll Hero→AboutMe se sintió
 * rota, el texto se leyó "justificado" (el flex-wrap con gap fijo entre
 * palabras no es `text-align: justify` real, pero a simple vista lee
 * distinto de un párrafo normal — líneas de largo parejo, espaciado
 * mecánico). No volver a intentar esta variante sin que el usuario lo
 * pida de nuevo — un chip por bloque (lo que hay ahora) es lo validado.
 *
 * **Un solo video, no dos — el "segundo video" que nunca se reproducía
 * (2026-09-11/12), tras varias sesiones parchando síntomas sin éxito.** El
 * reporte real del usuario: "no se ejecuta el segundo video, queda la
 * imagen fija" (Safari Y Chrome de un iPhone — mismo motor WebKit los dos).
 * La arquitectura anterior tenía DOS elementos `<video>`: uno en loop
 * (`hero-loop.mp4`, confiable, autoplay normal) y uno de transición
 * (`hero-transition.mp4`) que **nunca llegaba a reproducirse de verdad** —
 * solo se lo "cebaba" con un `play()` seguido de un `pause()` inmediato
 * (`prime()`, ver abajo lo que queda de esa función en el historial de git),
 * y recién si ese cebado confirmaba éxito se le permitía subir de opacidad y
 * recibir `currentTime` por scroll. El cebado era exactamente el eslabón
 * frágil: lo bloqueaba Bajo Consumo (Low Power Mode no deja correr `play()`
 * sin gesto real), competía con el `currentTime` que el propio scroll
 * escribía en el mismo instante, y en general dependía de que un `<video>`
 * jamás reproducido aceptara pintar un frame vía seek — que es precisamente
 * lo que WebKit se niega a hacer (comportamiento real de la spec, no un bug
 * de Safari: un decoder que nunca arrancó no tiene nada que pintar). De ahí
 * la sucesión de parches de sesiones anteriores (fallback de imagen "nunca
 * más negro", reintento por gesto, aislar el seek en try/catch) — todos
 * atacaban el síntoma, ninguno la causa.
 *
 * La solución no es un cebado más prolijo: es que no haga falta cebar nada.
 * `hero-loop.mp4` y `hero-transition.mp4` se concatenaron (ffmpeg, mismo
 * códec/resolución/fps normalizados, `scripts` no lo automatiza — se corrió
 * a mano una vez en un scratchpad) en un único archivo,
 * `/video/hero-scene.mp4` (10,125s, 243 frames a 24fps: 122 del loop +
 * 121 de la transición, medido con ffprobe). Un solo `<video>` que arranca
 * en autoplay apenas carga la página: para cuando el usuario llega a la
 * parte de transición, ese decoder lleva rato pintando frames reales de
 * verdad — seekear más adelante en un video que ya está vivo no dispara el
 * bug de WebKit, porque ya pintó al menos un frame por las buenas.
 *
 * **Mecánica nueva, más simple que la anterior:**
 * - En reposo (`p === 0`), el video reproduce normal desde `currentTime=0`;
 *   un listener de `timeupdate` lo resetea a `0` en cuanto llega a
 *   `LOOP_DURATION` — un loop manual del PRIMER tramo nada más, ya que el
 *   atributo `loop` de HTML loopearía el archivo entero (loop + transición).
 * - Apenas `p > 0` (arrancó el scroll), se pausa el video y se toma control
 *   total de `currentTime = LOOP_DURATION + p * TRANSITION_DURATION` — igual
 *   que antes, pero sobre el mismo elemento que ya viene reproduciendo, no
 *   sobre uno nuevo sin cebar. Al volver a `p === 0` se resume el `play()`
 *   normal y el loop manual retoma solo.
 * - Sin crossfade entre dos videos (no hace falta: es uno solo, no hay nada
 *   que fundir) — se borra `PANEL_CROSSFADE_END` y toda la opacidad cruzada
 *   que antes vivía en `render()`.
 * - El respaldo "nunca más negro" se simplifica a una sola bandera
 *   (`videoReadyRef`, se pone en `true` para siempre en el primer `onPlaying`
 *   real): mientras siga en `false`, dos capas de `<Picture>` (poster del
 *   loop o de la transición, según la fase) quedan debajo cubriendo — ya no
 *   hace falta un `scrubReadyRef` aparte ni el cebado con try/catch que
 *   competía con el propio scroll.
 *
 * Verificado por frame extraído con `ffprobe`/`ffmpeg` (no reproducible en
 * el navegador automatizado de este entorno, ver skill `performance`): el
 * frame justo antes del corte (t=4.9s) y justo después (t=5.1s) son
 * prácticamente el mismo encuadre — el corte no se nota — y el frame a
 * mitad de la transición (t=7s) muestra el push-in avanzando como se
 * esperaba. **No verificado todavía**: el gesto real de scroll en un
 * navegador real con el video reproduciendo de verdad — el usuario debería
 * confirmar que el "segundo video" ahora sí se ve, en particular en el
 * iPhone donde se reportó el bug original.
 */
export default function Hero({ className }: HeroProps) {
  const { t } = useLanguage();
  // Sigue usado por el marquee de credenciales, más abajo (se apaga con
  // reduced-motion, un ajuste chico y aislado). Pedido explícito del usuario
  // (2026-09-12): "no quiero ninguna regla que no muestre el video o la
  // transición — siempre quiero verlos, aunque el loader tarde un poco más".
  // Antes, `showStaticPanel`/`enableTransition` (ver abajo) se apagaban con
  // `prefers-reduced-motion` O ahorro de datos/2G — reportó que desde su
  // iPhone no veía ni el video ni la transición, lo más probable con
  // "Reducir movimiento" activado en Accesibilidad. Se sacó esa condición
  // del video/transición del Hero por completo (sigue respetándose en el
  // resto del sitio, como este mismo marquee).
  const reduced = useReducedMotion();
  const credentialLogos = t.hero.credentials
    .map((name) => ({ name, logo: CREDENTIAL_LOGOS[name] }))
    .filter((credential): credential is { name: string; logo: (typeof CREDENTIAL_LOGOS)[string] } =>
      Boolean(credential.logo)
    );

  // `hero.role` es "Actriz · Productora · Pedagoga teatral" (ES) / "Actress ·
  // Producer · Theatre educator" (EN) — mismo orden en los dos idiomas.
  // Pedido explícito (2026-09-10): 1° y 3° en `cream`, solo el del medio
  // ("Productora"/"Producer") se queda en `brand-red`.
  const roleParts = t.hero.role.split(' · ');

  const socialLinks = [
    { label: t.social.instagram, href: LINKS.instagram, icon: Instagram, external: true },
    { label: t.social.linkedin, href: LINKS.linkedin, icon: Linkedin, external: true },
    { label: t.social.email, href: LINKS.email, icon: Mail, external: false },
  ];

  // ── Transición de foco (2026-09-10, scroll-scrub amortiguado) — ver docblock
  // Pedido explícito del usuario (2026-09-12): siempre encendida, sin
  // apagarse con `prefers-reduced-motion` ni ahorro de datos — antes era
  // `!reduced && !slowConnection`. Queda como constante (no un booleano
  // hardcodeado en cada punto de uso) para no tener que tocar el resto del
  // mecanismo, que sigue leyendo esta variable en todos lados.
  const enableTransition = true;

  // La superposición ya NO depende del tamaño de viewport (ver el docblock
  // de arriba, "Tercera vuelta..." — cualquier umbral deja a alguien
  // afuera). Tampoco depende ya de `prefers-reduced-motion`/ahorro de datos
  // (ver arriba) — sigue siendo simplemente un alias de `enableTransition`.
  const overlayAbout = enableTransition;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Ver docblock "Un solo video, no dos..." (2026-09-11/12) — reemplazan
  // `loopVideoRef`/`scrubVideoRef`/`scrubReadyRef`/`transitionFallbackRef`
  // de la versión con dos `<video>` separados.
  const loopFallbackRef = useRef<HTMLDivElement>(null);
  const transitionFallbackRef = useRef<HTMLDivElement>(null);
  const videoReadyRef = useRef(false);
  const videoModeRef = useRef<'loop' | 'scrub'>('loop');
  const topBarRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerFadeRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  // `inert` de cada lado. Son banderas discretas (atributo, no interpolable)
  // y por eso sí pasan por `setState` — guardadas con un ref para no
  // programar un render por frame de scroll.
  const [heroInert, setHeroInert] = useState(false);
  const [aboutInert, setAboutInert] = useState(true);
  const heroInertRef = useRef(false);
  const aboutInertRef = useRef(true);

  // Confirma que el video pintó al menos un frame DE VERDAD (evento
  // `playing`, no "ya le pedimos que arranque") — una vez en `true` queda
  // así para siempre: el mismo decoder ya demostró que puede pintar, así
  // que un seek posterior (el scrub de más abajo) no va a mostrar negro. Es
  // la única bandera de respaldo que hace falta ahora — ver docblock.
  const handleVideoPlaying = () => {
    videoReadyRef.current = true;
    if (videoRef.current) videoRef.current.style.opacity = '1';
    if (loopFallbackRef.current) loopFallbackRef.current.style.opacity = '0';
    if (transitionFallbackRef.current) transitionFallbackRef.current.style.opacity = '0';
  };

  // Reportado por el usuario (2026-09-11): en mobile el panel se quedaba en
  // la foto fija con el ícono nativo de play — el `autoplay` del HTML no
  // arrancó. Bajo Consumo (Low Power Mode) en iOS bloquea el autoplay SIN
  // gesto del usuario, pero NO bloquea `play()` disparado por una
  // interacción real (toque/click/tecla) — de ahí que el primer gesto real
  // del visitante (en cualquier parte de la página, no hace falta que sea
  // sobre el panel) reintente `.play()` mientras el video siga sin
  // confirmar que puede pintar algo.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    let attempts = 0;

    function tryPlay() {
      attempts += 1;
      video!.play().catch(() => {
        if (cancelled || attempts >= 3) return;
        window.setTimeout(tryPlay, 300);
      });
    }
    tryPlay();

    function onGesture() {
      if (!videoReadyRef.current) tryPlay();
    }
    window.addEventListener('touchstart', onGesture, { passive: true });
    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture);

    return () => {
      cancelled = true;
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, []);

  // Loop manual del primer tramo (`0 → LOOP_DURATION`): el atributo `loop`
  // de HTML loopearía el archivo ENTERO (loop + transición pegados), así
  // que hay que cortarlo a mano en el límite exacto. Solo actúa mientras
  // `videoModeRef` siga en `'loop'` — durante el scroll el video está
  // pausado (ver `render()` más abajo) y no emite `timeupdate`, así que
  // este listener nunca compite con el seek que hace el scroll.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function onTimeUpdate() {
      if (videoModeRef.current !== 'loop') return;
      if (video!.currentTime >= LOOP_DURATION - VIDEO_SEEK_EPSILON) {
        try {
          video!.currentTime = 0;
        } catch {
          // Silencioso a propósito — mismo motivo que el seek de `render()`.
        }
      }
    }
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  useEffect(() => {
    if (!enableTransition) {
      // Sin transición no hay nada que apagar: los dos lados quedan
      // operables (en ese modo AboutMe es una sección normal, no una capa).
      setHeroInert(false);
      setAboutInert(false);
      heroInertRef.current = false;
      aboutInertRef.current = false;
      return;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // El Hero se apaga en la primera mitad solo cuando AboutMe va a ocupar
    // su lugar en la misma pantalla. Si AboutMe llega scrolleando (viewport
    // bajo), apagar el Hero a mitad de camino dejaría medio recorrido con la
    // pantalla vacía — ahí se desvanece recién sobre el final.
    const heroFadeEnd = overlayAbout ? CROSSFADE_MIDPOINT : 1;

    let target = 0;
    let current = 0;
    let rafId = 0;
    let running = false;
    let lastTs = 0;
    let wrapperTop = 0;
    let runwayPx = 1;
    let shiftPx = 0;

    // Medido una vez (y en `resize`), no por frame: `getBoundingClientRect`
    // en cada tick fuerza un layout sincrónico justo antes de escribir
    // estilos. Además `runwayPx` sale del alto REAL del sticky (que es
    // `100svh`) y no de `window.innerHeight`: en mobile ese valor cambia
    // cuando se esconde la barra de URL, y el progreso pegaba un salto a
    // mitad de gesto.
    function measure() {
      const rect = wrapper!.getBoundingClientRect();
      wrapperTop = rect.top + window.scrollY;
      const screenPx = stickyRef.current?.offsetHeight || window.innerHeight;
      runwayPx = Math.max(1, screenPx * (TRANSITION_EXTRA_VH / 100));
      shiftPx = window.innerWidth - (panelRef.current?.offsetWidth || 0);
    }

    function readTarget() {
      target = Math.min(Math.max((window.scrollY - wrapperTop) / runwayPx, 0), 1);
    }

    function render(p: number) {
      // El viaje del panel va eased, no lineal: una cámara acelera y se
      // asienta, un slider no.
      const travel = easeInOutSine(p);
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(${-travel * shiftPx}px,0,0)`;
      }
      // Ver docblock "Un solo video, no dos..." — `p > 0` es "arrancó el
      // scroll", sin importar cuán poco: ahí se pausa el video y se toma
      // control de `currentTime`; en `p === 0` se lo suelta de vuelta a
      // reproducción normal y el loop manual (efecto de `timeupdate`, más
      // arriba) retoma solo. El cambio de modo es edge-triggered (compara
      // contra `videoModeRef`) para no llamar `play()`/`pause()` en cada
      // frame mientras `p` se mueve dentro de la misma zona.
      const inScrub = p > 0;
      const video = videoRef.current;
      if (video) {
        if (inScrub && videoModeRef.current !== 'scrub') {
          videoModeRef.current = 'scrub';
          video.pause();
        } else if (!inScrub && videoModeRef.current !== 'loop') {
          videoModeRef.current = 'loop';
          // Vuelve a 0 ANTES de reproducir — si se dejara el `currentTime`
          // donde quedó el scrub (adentro del tramo de transición), se vería
          // un flash de esa toma hasta que el `timeupdate` de más arriba lo
          // corrigiera en el próximo tick.
          try {
            video.currentTime = 0;
          } catch {
            // Silencioso a propósito — mismo motivo que el seek de abajo.
          }
          video.play().catch(() => {});
        }
        // Aislado en su propio try/catch (bug real, 2026-09-11): escribir
        // `currentTime` mientras el navegador tiene el video en un estado
        // transitorio (seeking, o un `play()` en curso) puede tirar
        // `InvalidStateError` en WebKit. Sin este aislamiento, ese throw
        // salía de `render()` sin ejecutar nada de lo que sigue (hero/
        // AboutMe) y — peor — mataba el `rAF` de `frame()` para siempre (ver
        // ahí abajo): toda la composición se congelaba a mitad de camino.
        // El seek es el único paso realmente frágil de todo `render()`; el
        // resto (transform del panel, opacidad de hero/about) no debe
        // depender de que este paso puntual funcione.
        if (inScrub) {
          try {
            const t = LOOP_DURATION + p * TRANSITION_DURATION;
            // Un `seek` por frame con saltos grandes es la fuente real del
            // tartamudeo del clip: con el progreso ya amortiguado los
            // saltos son chicos, y por debajo de medio frame no vale la
            // pena pedir otro.
            if (Math.abs(video.currentTime - t) > VIDEO_SEEK_EPSILON) video.currentTime = t;
          } catch {
            // Silencioso a propósito — ver comentario arriba.
          }
        }
      }
      // Respaldo "nunca más negro" (ver docblock, 2026-09-12): mientras el
      // video no confirmó que puede pintar (`videoReadyRef`), una de las dos
      // fotos de abajo queda opaca según la fase — una vez confirmado, las
      // dos quedan en 0 para siempre (`handleVideoPlaying` ya las apagó).
      if (!videoReadyRef.current) {
        if (loopFallbackRef.current) loopFallbackRef.current.style.opacity = inScrub ? '0' : '1';
        if (transitionFallbackRef.current) {
          transitionFallbackRef.current.style.opacity = inScrub ? '1' : '0';
        }
      }

      // Cruce secuencial (el Hero termina de apagarse y recién ahí aparece
      // AboutMe, pedido explícito del usuario) pero con las dos curvas
      // eased hacia el punto medio: el Hero se sostiene y cae rápido al
      // final, AboutMe sube rápido y se asienta. Con las dos rampas
      // lineales había un tramo de pantalla casi vacía alrededor del medio.
      const heroOpacity = 1 - easeInQuad(Math.min(Math.max(p / heroFadeEnd, 0), 1));
      if (topBarRef.current) topBarRef.current.style.opacity = String(heroOpacity);
      if (bodyRef.current) bodyRef.current.style.opacity = String(heroOpacity);
      if (footerFadeRef.current) footerFadeRef.current.style.opacity = String(heroOpacity);

      let aboutOpacity = 1;
      if (overlayAbout && aboutContentRef.current) {
        const inT = (p - CROSSFADE_MIDPOINT) / (1 - CROSSFADE_MIDPOINT);
        aboutOpacity = easeOutQuad(Math.min(Math.max(inT, 0), 1));
        aboutContentRef.current.style.opacity = String(aboutOpacity);
      }

      // `inert` sigue a lo que se VE, no a un umbral de scroll aparte: lo
      // que está por debajo del 5% de opacidad no debería ser tabulable.
      const nextHeroInert = heroOpacity < 0.05;
      if (nextHeroInert !== heroInertRef.current) {
        heroInertRef.current = nextHeroInert;
        setHeroInert(nextHeroInert);
      }
      const nextAboutInert = overlayAbout ? aboutOpacity < 0.05 : false;
      if (nextAboutInert !== aboutInertRef.current) {
        aboutInertRef.current = nextAboutInert;
        setAboutInert(nextAboutInert);
      }
    }

    // Amortiguación exponencial independiente del framerate: el mismo gesto
    // se siente igual a 60 y a 120Hz. El rAF corre solo mientras haya
    // distancia que recorrer — en reposo no queda ningún loop vivo.
    function frame(ts: number) {
      const dt = lastTs ? Math.min(ts - lastTs, 64) : 16.67;
      lastTs = ts;
      const diff = target - current;
      const snapped = Math.abs(diff) < SMOOTH_SNAP_EPSILON;
      if (snapped) {
        current = target;
      } else {
        current += diff * (1 - Math.pow(1 - SCROLL_SMOOTHING, dt / 16.67));
      }
      // Red de seguridad, además del try/catch propio del seek de video
      // dentro de `render()`: si algo ahí adentro tirara de todas formas, no
      // debe matar este `rAF` — es exactamente lo que congeló la transición
      // entera el 2026-09-11 (ver el comentario en `render()`).
      try {
        render(current);
      } catch {
        // Silencioso a propósito.
      }
      if (snapped) {
        running = false;
        lastTs = 0;
        return;
      }
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(frame);
    }

    function onScroll() {
      readTarget();
      if (Math.abs(target - current) > SMOOTH_JUMP_THRESHOLD) current = target;
      start();
    }

    function onResize() {
      measure();
      readTarget();
      current = target;
      render(current);
    }

    measure();
    readTarget();
    current = target;
    render(current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // El alto del panel/columna puede cambiar sin que cambie el viewport
    // (cambio de idioma, fuentes que terminan de cargar) — `shiftPx` sale
    // del ancho real del panel, así que conviene re-medir.
    const observer = new ResizeObserver(onResize);
    if (panelRef.current) observer.observe(panelRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [enableTransition, overlayAbout]);

  return (
    <>
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={
        enableTransition
          ? {
              // `svh` y no `vh`: en mobile `100vh` es el viewport CON la
              // barra de URL escondida, así que el sticky queda más alto que
              // lo visible y el pie se va detrás de la barra. `svh` (small
              // viewport) es estable — `dvh` cambiaría durante el scroll y
              // haría saltar la composición entera.
              height: `calc(100svh + ${
                TRANSITION_EXTRA_VH + (overlayAbout ? TRANSITION_HOLD_VH : 0)
              }svh)`,
            }
          : undefined
      }
    >
      <div
        ref={stickyRef}
        className={cn(
          'sticky top-0 z-0 flex h-[100svh] w-full flex-col overflow-hidden bg-ink',
          className
        )}
      >
        {/* ── Video del Hero: Nora a la derecha ───────────────────────────
            Ver docblock (2026-09-09). Panel angosto, `mask-image` en vez de
            un borde duro para que se funda en el `bg-ink` de los dos lados
            SIEMPRE — ya no un solo borde que se funde y el otro duro, ni una
            dirección que flipea a mitad de camino (pedido explícito
            2026-09-10: "que tenga los bordes difuminados, ambos bordes,
            hasta que termine la animación" — un borde duro cruzando el medio
            de la composición mientras el panel viaja se leía como un salto).
            Al scrollear, el efecto de arriba escribe el `translateX` a mano
            (ver docblock "Transición de foco..."). */}
        <div
          ref={panelRef}
          aria-hidden
          // Promoción a capa propia: el panel lleva un video enmascarado y
          // se mueve en cada frame de la transición — sin esto el compositor
          // repinta la máscara junto con el resto de la pantalla.
          style={enableTransition ? { willChange: 'transform' } : undefined}
          className="absolute inset-y-0 right-0 w-[62%] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:w-[52%] sm:[mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)] md:w-[46%] md:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] md:[-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] lg:w-[40%]"
        >
          <>
            {/* Dos capas de respaldo (imagen real, liviana, AVIF/WebP vía
                `<Picture>`) — SIEMPRE una de las dos visible mientras el
                video no confirmó que puede pintar (`videoReadyRef`, ver
                docblock "Un solo video, no dos..."). Van PRIMERO en el DOM
                (capa de más atrás): si el video nunca se vuelve visible,
                una de estas dos fotos queda como el estado final en vez de
                un hueco negro — la del loop mientras `p=0`, la de la
                transición mientras `p>0`. */}
            <div ref={loopFallbackRef} aria-hidden className="absolute inset-0" style={{ opacity: 1 }}>
              <Picture
                src="/img/hero-loop-poster.jpg"
                alt=""
                sizes="46vw"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                pictureClassName="absolute inset-0 block h-full w-full"
                className="h-full w-full object-cover object-[62%_18%]"
              />
            </div>
            <div ref={transitionFallbackRef} aria-hidden className="absolute inset-0" style={{ opacity: 0 }}>
              <Picture
                src="/img/hero-transition-poster.jpg"
                alt=""
                sizes="46vw"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                pictureClassName="absolute inset-0 block h-full w-full"
                className="h-full w-full object-cover object-[62%_18%]"
              />
            </div>
            <video
              ref={videoRef}
              aria-hidden
              style={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full object-cover object-[62%_18%]"
              src={HERO_VIDEO_SRC}
              preload="auto"
              autoPlay
              muted
              playsInline
              onPlaying={handleVideoPlaying}
            />
          </>
          {/* Velos — legibilidad del pie (banda de pilares) y del borde superior. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/25" />
          {/* Crédito de la foto fuente — regla 3 de content.ts. */}
          <span className="pointer-events-none absolute bottom-2 right-1 font-label text-[9px] uppercase tracking-[0.15em] text-cream/50 [writing-mode:vertical-rl]">
            Foto: {t.hero.portraitCredit}
          </span>
        </div>

        {/* ── Barra superior: utilidad + menú del Hero centrado ───────────────
            El menú (antes en la banda de pie) sube acá 2026-09-09, a pedido
            explícito ("centrarlo y fix arriba"): con el Hero `sticky top-0
            h-screen`, todo lo que vive en su barra superior ya se comporta como
            fijo mientras el Hero está en pantalla — no hace falta un
            `position: fixed` aparte, que hubiera competido con el `Header`
            global (que ya se ocupa de la navegación fija una vez que se
            scrollea más allá del Hero). */}
        <div
          ref={topBarRef}
          inert={heroInert}
          className="relative z-30 flex w-full flex-col gap-4 px-6 pt-6 sm:px-10 md:px-12 lg:pl-28"
        >
        <div className="flex w-full items-center justify-between">
          <span className="text-legible-blur rounded-lg px-1.5 py-0.5 font-label text-[11px] uppercase tracking-[0.25em] text-cream/50">
            {t.hero.location}
          </span>
          <LanguageToggle className="text-legible-blur rounded-full" />
        </div>
      </div>

      {/* ── Cuerpo: nombre a escala de afiche + bloque de texto ───────────
          `justify-center` (2026-09-11, pedido explícito: "centrar el
          container del logo, el slider, el botón") — reemplaza al
          `justify-start`+`pt` que hubo acá desde el rediseño de afiche del
          18/8 ("centrado dejaba la franja superior al 11% de ocupación").
          Esa medición es de una composición vieja (sin el panel de video a
          la derecha ni el rail de `SectionNav` a la izquierda, ver más
          arriba) — con el layout de hoy, el bloque quedaba pegado arriba con
          un vacío grande abajo, y encima desalineado del rail (fijo al 50%
          vertical de pantalla). Centrarlo alinea las dos piezas.

          `items-center text-center` (mismo turno, pedido de seguida: "centrar
          el contenido de este div") — hasta acá solo se había centrado el
          BLOQUE en el eje vertical; el contenido adentro (logo, rol, bio,
          CTA, slider de credenciales) seguía pegado al borde izquierdo por el
          `align-items: stretch` default de flex. Mismo tratamiento que ya usa
          `AboutMe.tsx` en modo capa (`items-center text-center`, ver su
          docblock "Todo centrado").

          **Solo desde `md` (2026-09-11, pedido explícito: "versiones de
          teléfono que aparezca a la izquierda y en de escritorio centrado")**
          — en mobile no hay rail de `SectionNav` con el que alinearse (esa
          pieza es `lg:flex`) ni el vacío horizontal que la centrada resuelve
          en pantallas anchas, así que vuelve al `items-start text-left`
          original ahí; centrado recién de `md` para arriba. */}
      <div
        ref={bodyRef}
        inert={heroInert}
        className="relative z-30 flex flex-grow flex-col items-start justify-center px-6 text-left sm:px-10 md:max-w-[54%] md:items-center md:px-12 md:text-center lg:max-w-[58%] lg:pl-28"
      >
        {/* Sombra + halo del logo (2026-09-11, pedido explícito): el PNG no
            se toca, todo el efecto es `filter: drop-shadow()` sobre el
            `<img>` mismo vía la clase `.hero-logo-frame` (`src/index.css`)
            — respeta el alfa real de la firma, a diferencia de un
            `box-shadow` que dibujaría un rectángulo. La entrada suma un
            canal de `blur` al fade/slide que ya tenía (`y` bajó de 24 a 18,
            duración de 0.7 a 1.1s, mismo `EASE_REVEAL` que ya es el
            cubic-bezier(0.22,1,0.36,1) pedido). `pointer-events-auto` +
            `group` acá (el h1 es decorativo, no gana semántica interactiva
            — es solo para que el hover CSS de `.hero-logo-frame` pueda
            leerse: nada más se apoya en este bloque, no hay riesgo de tapar
            otro control). */}
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE_REVEAL, delay: 0.55 }}
          className="group relative z-10 pointer-events-auto"
        >
          <Picture
            src="/img/nora-firma-roja.png"
            alt="Nora Filmus"
            className="hero-logo-frame w-[clamp(220px,52vw,680px)]"
            sizes="680px"
          />
          {/* Etiqueta de estado del sitio (2026-09-11, pedido explícito):
              "esta versión sea BETA" — colgada del borde del logo como un
              corner tag, mismo dispositivo que Header/Footer pero acá sin
              fila propia para no sumar un renglón más al bloque del Hero,
              que ya audita alto disponible con cuidado (ver docblock del
              cruce Hero→AboutMe más abajo). */}
          <BetaBadge className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/2" />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_REVEAL, delay: 0.75 }}
          className="relative z-30 mt-6 md:mt-8"
        >
          <div className="flex items-center justify-start gap-3 md:justify-center">
            <span className="h-px w-8 shrink-0 bg-brand-red" aria-hidden />
            <p className="text-legible-blur rounded-lg px-1.5 py-0.5 font-label text-[11px] font-bold uppercase tracking-[0.2em]">
              {roleParts.map((part, i) => (
                <span key={part}>
                  {i > 0 && <span className="text-brand-red/50"> · </span>}
                  <span className={i === 1 ? 'text-brand-red' : 'text-cream'}>{part}</span>
                </span>
              ))}
            </p>
            <span className="h-px w-8 shrink-0 bg-brand-red" aria-hidden />
          </div>

          {/* Bio y CTA en columna, siempre (2026-09-11, pedido explícito: "el
              botón de sobre mí en la línea siguiente, no pegado a la
              descripción") — antes pasaban a fila desde `md`, con el botón al
              lado del párrafo; ahora el CTA cae siempre debajo, con su propio
              margen. */}
          <div className="mt-4 flex flex-col items-start gap-6 md:items-center">
            {/* `text-lead` (auditoría 2026-08-31, design-system): antes vivía en
                `text-sm` de font-label, la misma voz que un label de 11px — para
                el único párrafo de bio del Hero hacía falta un escalón propio,
                no compartir tamaño con "DUBLÍN, IRLANDA". */}
            <p className="text-legible-blur max-w-sm rounded-lg px-1.5 py-0.5 font-label text-lead text-cream/80">
              {t.hero.bio}
            </p>
            {/* Dos botones (2026-09-12, pedido explícito: "el botón de sobre
                mí no hace nada... quiero poner uno que diga hablemos") — antes
                era un solo CTA acá. El primero se queda igual que estaba
                (mismo destino/label, ver comentario debajo); el segundo
                ("Hablemos"/"Let's talk") es nuevo, siempre apunta a
                `/contacto` — una vía de conversión directa que no depende de
                `TRAYECTORIA_ENABLED`. `variant="secondary"` para no competir
                con el primero (que sigue en `primary`, rojo sólido). */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Fase 2 (2026-08-28): antes apuntaba a `#sobre-mi` pese a decir
                  "Ver trayectoria" — un desvío que sobrevivió porque `/trayectoria`
                  no existía como página propia hasta la Fase 1. Ya existe.
                  Variante `primary` (auditoría 2026-08-31): es la única acción del
                  Hero — en `secondary` (borde fino) perdía contra el rojo saturado
                  del wordmark que la rodea.
                  2026-09-09: mientras Trayectoria está fuera de producción (ver
                  `TRAYECTORIA_ENABLED`), el CTA vuelve a apuntar a `#sobre-mi` —
                  mismo destino que tenía antes de que existiera la página. El
                  label cambia con el destino (reusa `t.nav.about`, sin agregar
                  copy nueva a content.ts): repetir "Ver trayectoria" apuntando a
                  la bio sería el mismo desvío que ya se corrigió una vez.
                  Verificado con scroll programático (Playwright contra un build
                  de producción, 2026-09-12): el click navega a `/#sobre-mi`,
                  `scrollY` avanza hasta el marcador y `AboutMe` cruza a opacidad
                  1 — funciona en desktop, mobile y navegando desde otra página
                  (`/crear` → `/#sobre-mi`). */}
              <ButtonLink
                to={TRAYECTORIA_ENABLED ? '/trayectoria' : '/#sobre-mi'}
                variant="primary"
                size="md"
                className="shrink-0"
              >
                {TRAYECTORIA_ENABLED ? t.hero.cta : t.nav.about}
              </ButtonLink>
              <ButtonLink to="/contacto" variant="secondary" size="md" className="shrink-0">
                {t.hero.contactCta}
              </ButtonLink>
            </div>
          </div>
        </motion.div>

        {/* Fila de credenciales: slider infinito, de vuelta (2026-09-11).
            El 2026-09-10 se había pedido pasar a fila fija; el usuario ahora
            pidió volver al slider — mismo mecanismo del marquee de `AboutMe`
            (duplicar el array, `x: ['0%','-50%']` en loop lineal) y de la
            versión que hubo acá antes del 10/9. Con `prefers-reduced-motion`
            no corre y la fila cae a `overflow-x-auto` (scroll manual) en vez
            de animar — mismo criterio de H4 (auditoría 2026-08-18). */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="relative mt-10 w-full max-w-xl border-t border-cream/10 pt-5 md:mt-14 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div className={cn('w-full', reduced ? 'overflow-x-auto' : 'overflow-hidden')}>
            <motion.ul
              className="flex w-max items-center gap-x-8"
              animate={reduced ? undefined : { x: ['0%', '-50%'] }}
              transition={reduced ? undefined : { duration: 18, ease: 'linear', repeat: Infinity }}
            >
              {(reduced ? credentialLogos : [...credentialLogos, ...credentialLogos]).map(
                ({ name, logo }, i) => (
                  <li key={`${name}-${i}`} className="flex shrink-0 items-center">
                    <img
                      src={logo.src}
                      alt={name}
                      width={logo.width}
                      height={logo.height}
                      loading={i < credentialLogos.length ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-5 w-auto object-contain opacity-60 sm:h-6"
                    />
                  </li>
                )
              )}
            </motion.ul>
          </div>
        </motion.div>
      </div>

      {/* ── Banda de pie: pilares (solo mobile) + contacto ────────────────
          Los pilares se fueron a la barra superior en desktop (ver arriba)
          — acá vuelven, pero SOLO en mobile y solo los 3 pilares (no
          Trayectoria/Contacto, que en la barra de arriba se agregan para
          desktop): "quiero que tenga solo tres ítems como antes". El
          wrapper exterior (sin `animate` propio) es el que lleva el
          desvanecimiento por scroll — la entrada al montar sigue viviendo en
          el `motion.div` interior, sin pisarse entre sí (ver docblock). */}
      <div ref={footerFadeRef} inert={heroInert}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="relative z-30 w-full border-t border-cream/10 px-6 py-3 sm:px-10 md:px-12"
        >
          {/* Íconos a ~2× (2026-09-11, pedido explícito, primero se probó 3×
              y el usuario pidió bajarlo): 20px→40px, la caja de touch target
              crece con ellos (44px ya era piso de accesibilidad, no techo —
              sigue cumpliéndose de sobra). */}
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={label}
                title={label}
                className="inline-flex h-14 w-14 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red"
              >
                <Icon className="h-10 w-10" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* `AboutMe` superpuesto (`absolute inset-0`, ver su propio
          componente), invisible hasta que el scroll handler de arriba le
          sube la opacidad — no es un hijo normal-flow que aparece
          scrolleando desde abajo (ver docblock "Una sola escena...").
          Solo en este modo: si el viewport es bajo o no hay transición,
          AboutMe se renderiza como sección normal DESPUÉS del wrapper. */}
      {overlayAbout && (
        <AboutMe overlay contentRef={aboutContentRef} inert={aboutInert} />
      )}
      </div>

      {/* Destino real del ancla `#sobre-mi` (Header, Footer y el CTA del
          propio Hero). Sin esto, `scrollIntoView` sobre la sección
          superpuesta apuntaba al tope de la página —`absolute inset-0`
          dentro de un `sticky` está SIEMPRE en el viewport— y el link no
          hacía nada: medido, scrollY quedaba en 0 y AboutMe en opacity 0.
          Este marcador de 1px vive donde la transición termina, así que
          `block: 'start'` cae exactamente en la composición asentada. */}
      {overlayAbout && (
        <div
          id="sobre-mi"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${TRANSITION_EXTRA_VH}svh` }}
        />
      )}
    </div>

    {!overlayAbout && <AboutMe />}
    </>
  );
}

