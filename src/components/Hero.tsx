import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { EASE_REVEAL, easeInOutSine, easeInQuad, easeOutQuad } from '@/lib/ease';
import { TRAYECTORIA_ENABLED } from '@/lib/features';
import { useSlowConnection } from '@/lib/hooks/use-connection';
import { cn } from '@/lib/utils';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import AboutMe from './AboutMe';
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

// Ver docblock "Transición de foco..." (2026-09-10).
const TRANSITION_VIDEO_SRC = '/video/hero-transition.mp4';
const TRANSITION_FALLBACK_DURATION = 5.04;
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
/** Tramo donde el loop se funde con el clip de transición. */
const PANEL_CROSSFADE_END = 0.08;
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
 */
export default function Hero({ className }: HeroProps) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const slowConnection = useSlowConnection();
  // Poca conectividad (ahorro de datos / 2G) — mismo criterio que
  // `reduced`: se sirve el poster estático en vez de bajar los ~520KB de
  // `hero-loop.mp4` (2026-09-09, "que poca conectividad no rompa todo el
  // sitio"). Ver lib/hooks/use-connection.ts.
  const showStaticPanel = reduced || slowConnection;
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
  const enableTransition = !reduced && !slowConnection;

  // La superposición ya NO depende del tamaño de viewport (ver el docblock
  // de arriba, "Tercera vuelta..." — cualquier umbral deja a alguien
  // afuera). Las únicas razones reales para el modo `flow` son
  // `prefers-reduced-motion` y ahorro de datos, las mismas que ya apagan
  // `enableTransition`.
  const overlayAbout = enableTransition;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const scrubVideoRef = useRef<HTMLVideoElement>(null);
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
      if (loopVideoRef.current) {
        loopVideoRef.current.style.opacity = String(Math.max(0, 1 - p / PANEL_CROSSFADE_END));
      }
      const video = scrubVideoRef.current;
      if (video) {
        video.style.opacity = String(Math.min(1, p / PANEL_CROSSFADE_END));
        const duration = video.duration || TRANSITION_FALLBACK_DURATION;
        const t = p * duration;
        // Un `seek` por frame con saltos grandes es la fuente real del
        // tartamudeo del clip: con el progreso ya amortiguado los saltos son
        // chicos, y por debajo de medio frame no vale la pena pedir otro.
        if (Math.abs(video.currentTime - t) > VIDEO_SEEK_EPSILON) video.currentTime = t;
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
      if (Math.abs(diff) < SMOOTH_SNAP_EPSILON) {
        current = target;
        render(current);
        running = false;
        lastTs = 0;
        return;
      }
      current += diff * (1 - Math.pow(1 - SCROLL_SMOOTHING, dt / 16.67));
      render(current);
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
          {showStaticPanel ? (
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
          ) : (
            <>
              <video
                ref={loopVideoRef}
                className="absolute inset-0 h-full w-full object-cover object-[62%_18%]"
                src="/video/hero-loop.mp4"
                poster="/img/hero-loop-poster.jpg"
                preload="auto"
                autoPlay
                loop
                muted
                playsInline
              />
              {enableTransition && (
                <video
                  ref={scrubVideoRef}
                  aria-hidden
                  style={{ opacity: 0 }}
                  className="absolute inset-0 h-full w-full object-cover object-[62%_18%]"
                  src={TRANSITION_VIDEO_SRC}
                  preload="auto"
                  muted
                  playsInline
                />
              )}
            </>
          )}
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
          className="relative z-30 flex w-full flex-col gap-4 px-6 pt-6 sm:px-10 md:px-12"
        >
        <div className="flex w-full items-center justify-between">
          <span className="font-label text-[11px] uppercase tracking-[0.25em] text-cream/50">
            {t.hero.location}
          </span>
          <LanguageToggle />
        </div>
      </div>

      {/* ── Cuerpo: nombre a escala de afiche + bloque de texto ─────────── */}
      {/* `justify-start` + un pt chico y no `justify-center`: centrado dejaba
          la franja superior del viewport al 11% de ocupación (medido). */}
      <div
        ref={bodyRef}
        inert={heroInert}
        className="relative z-30 flex flex-grow flex-col justify-start px-6 pt-[3vh] sm:px-10 md:max-w-[54%] md:px-12 md:pt-[2vh] lg:max-w-[58%]"
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_REVEAL, delay: 0.55 }}
          className="pointer-events-none relative z-10"
        >
          <TiltLogo reduced={!!reduced} />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_REVEAL, delay: 0.75 }}
          className="relative z-30 mt-6 md:mt-8"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-brand-red" aria-hidden />
            <p className="font-label text-[11px] uppercase tracking-[0.2em]">
              {roleParts.map((part, i) => (
                <span key={part}>
                  {i > 0 && <span className="text-brand-red/50"> · </span>}
                  <span className={i === 1 ? 'text-brand-red' : 'text-cream'}>{part}</span>
                </span>
              ))}
            </p>
          </div>

          {/* Bio y CTA en fila (desde md): el bloque se ensancha bajo el
              titular en vez de quedar como una columna angosta a la
              izquierda, que era parte del vacío medido. */}
          <div className="mt-4 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
            {/* `text-lead` (auditoría 2026-08-31, design-system): antes vivía en
                `text-sm` de font-label, la misma voz que un label de 11px — para
                el único párrafo de bio del Hero hacía falta un escalón propio,
                no compartir tamaño con "DUBLÍN, IRLANDA". */}
            <p className="max-w-sm font-label text-lead text-cream/80">{t.hero.bio}</p>
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
                la bio sería el mismo desvío que ya se corrigió una vez. */}
            <ButtonLink
              to={TRAYECTORIA_ENABLED ? '/trayectoria' : '/#sobre-mi'}
              variant="primary"
              size="md"
              className="shrink-0"
            >
              {TRAYECTORIA_ENABLED ? t.hero.cta : t.nav.about}
            </ButtonLink>
          </div>
        </motion.div>

        {/* Fila de credenciales: logos monocromos, fija.
            **2026-09-10**: dejó de ser un slider en loop infinito — el
            usuario lo pidió fijo, sin las tiras de `backdrop-blur` en los
            bordes (ver docblock viejo en el historial de git si hace falta
            recuperar el mecanismo del slider). Ahora es una fila estática
            que envuelve (`flex-wrap`) en vez de desbordar/animar.
            **Centrada en mobile, mismo día** (pedido explícito): el resto del
            Hero queda alineado a la izquierda a propósito (afiche), pero acá
            la fila envuelve en 2-3 líneas en pantallas angostas y quedaba con
            un borde irregular pegado a la izquierda — `justify-center` desde
            mobile, vuelve a `justify-start` en `md` (fila de una sola línea,
            no hace falta centrar lo que ya no envuelve). */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="mt-10 w-full max-w-xl border-t border-cream/10 pt-5 md:mt-14"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start">
            {credentialLogos.map(({ name, logo }) => (
              <li key={name} className="flex shrink-0 items-center">
                <img
                  src={logo.src}
                  alt={name}
                  width={logo.width}
                  height={logo.height}
                  loading="eager"
                  decoding="async"
                  className="h-5 w-auto object-contain opacity-60 sm:h-6"
                />
              </li>
            ))}
          </ul>
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
          <div className="flex items-center justify-center">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={label}
                title={label}
                className="inline-flex h-11 w-11 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red"
              >
                <Icon className="h-5 w-5" />
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

/**
 * Efecto 3D del wordmark (2026-09-09, pedido explícito del usuario). No es
 * un `rotate3d` decorativo fijo — es un tilt real que sigue al cursor
 * (`perspective` en el contenedor + `rotateX`/`rotateY` en la imagen,
 * suavizado con `useSpring`, mismo patrón que ya usa `TimelinePhoto` en
 * `Trayectoria.tsx`): el wordmark responde como un objeto físico con
 * volumen, no un póster plano. Sin sombra — `design-system` no usa
 * `box-shadow` como recurso — la sensación de profundidad la da
 * exclusivamente la perspectiva/rotación, no un shadow debajo.
 *
 * El `<motion.h1>` que lo envuelve sigue `pointer-events-none` (es texto
 * decorativo, no interactivo) — este componente reactiva `pointer-events`
 * solo en su propia caja para poder leer el mouse, sin volver clickeable
 * nada del resto del Hero.
 */
function TiltLogo({ reduced }: { reduced: boolean }) {
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 150, damping: 16, mass: 0.5 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 150, damping: 16, mass: 0.5 });

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * 18);
    rotateXRaw.set(-py * 14);
  }

  function handlePointerLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  }

  return (
    <div
      className="pointer-events-auto inline-block"
      style={{ perspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div style={reduced ? undefined : { rotateX, rotateY }}>
        <Picture
          src="/img/nora-firma-roja.png"
          alt="Nora Filmus"
          className="w-[clamp(220px,52vw,680px)]"
          sizes="680px"
        />
      </motion.div>
    </div>
  );
}
