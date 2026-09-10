import { motion, useReducedMotion } from 'motion/react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Picture from './Picture';

/**
 * Adaptado de "hero-3" / AnimatedMarqueeHero (21st.dev/@ravikatiyar162):
 * pill + titular + bio + CTA, con marquee infinito abajo en vez del
 * carrusel genérico del original.
 *
 * Dos cosas que arregló la auditoría de contenido (2026-08-14) y que no hay
 * que volver a romper:
 *
 * - **La bio va en primera persona.** Antes hablaba de Nora en tercera
 *   ("Empezó a los 14..."), lo que la convertía en una ficha ajena. Nora
 *   escribe en primera en su blog, en su CV y en el panel de Alternativa.
 * - **Cada foto declara el rol.** El marquee mostraba obras donde Nora NO
 *   actúa (`Los golpes de Clara` es un unipersonal de Carolina Guevara que
 *   ella produjo) debajo de un titular sobre su carrera de actriz: el lector
 *   inferría que eran sus papeles. Ahora cada pieza lleva obra + rol real +
 *   crédito de la fotógrafa, y el texto del archivo lo dice explícito.
 *
 * **Costados llenos (2026-08-19).** Era la sección menos densa del sitio
 * (31%, medida en E4) y la única que ninguna etapa había tocado: columna
 * centrada en `max-w-4xl` dentro de un viewport de 1440px dejaba ~270px de
 * negro a cada lado del texto. Dos rieles verticales flanquean el bloque
 * —mismo dispositivo tipográfico que ya usan `Seam`/`Act` (regla + rótulo),
 * girado 90°— con el "36" partido en dos mitades, una por costado, así el
 * numeral llena el alto real de la sección en vez de vivir solo en el
 * eyebrow. Las fichas del archivo también crecieron (`w-40`→`w-56`,
 * `h-56`→`h-72`) para que la fila pese más por card, no por relleno.
 *
 * **El marquee volvió (2026-09-09), pedido explícito del usuario** ("quiero
 * tener eso de vuelta") — se había sacado más temprano el mismo día junto
 * con `ProgramIndex` en el pedido de simplificar la Home. Restaurado igual
 * a como estaba (mismo bloque, mismo guard de `prefers-reduced-motion`).
 *
 * **Telón de fondo, probado y descartado (2026-09-09, mismo día).** Se generaron
 * dos paños de terciopelo con Seedream 5.0 (fal.ai) recortados con alfa real
 * (`fal-ai/imageutils/rembg`) para reemplazar los rieles de abajo, pinneados a
 * cada costado con `whileInView` deslizando desde el borde. El usuario lo vio
 * instalado y no le gustó ("no me gustaron, eliminar todo eso") — se revirtió
 * entero en la misma sesión, volviendo a los rieles originales. No reintentar
 * un telón/imagen generada como fondo de esta sección sin que el usuario lo
 * pida de nuevo (ver memoria `feedback-telon-aboutme-rechazado`). Los PNG
 * (`public/img/aboutme/telon-*.png`) se borraron junto con sus derivados.
 *
 * **De sección centrada, full-width y opaca a columna derecha transparente
 * (2026-09-10).** Pedido explícito del usuario: "todo en una misma sección,
 * about me queda junto con Nora a la izquierda" — la sección ya no puede ser
 * un bloque opaco centrado en todo el ancho, porque ahora VIVE dentro del
 * mismo wrapper `sticky` que trae el panel de video de Nora en `Hero.tsx`
 * (ver su docblock, "Una sola escena..."): Nora termina la transición
 * posicionada a la izquierda y se queda ahí, pegada (sticky), mientras esta
 * sección scrollea a su lado — para que se lean como una sola composición
 * (Nora a la izquierda, este contenido a la derecha) y no como una capa
 * opaca que la tapa, hicieron falta tres cambios:
 * - **`bg-ink` se saca del `<section>`.** Transparente: donde este bloque no
 *   pinta contenido (la mitad izquierda, la que ocupa Nora), se ve lo que
 *   hay detrás — el panel de Nora, sticky, en el `z-0` de `Hero.tsx`. Esta
 *   sección sigue en `z-10` (ya lo estaba) para que su propio contenido
 *   pinte por ENCIMA del panel donde sí hay texto.
 * - **Columna derecha en vez de centrado.** `mx-auto max-w-5xl items-center
 *   text-center` (ocupaba TODO el ancho, de ahí los rieles verticales para
 *   llenar los costados) pasa a `ml-auto` + una columna angosta a la
 *   derecha. Los rieles verticales laterales SE BORRARON enteros: existían
 *   para llenar el vacío horizontal de una sección full-width centrada, que
 *   ya no existe en este layout asimétrico.
 *
 * **`id="sobre-mi"` se queda igual** aunque el componente ya no vive como
 * hijo directo de `Home` sino DENTRO de `Hero.tsx` — un `id` es un atributo
 * del DOM, no le importa la jerarquía de componentes de React, así que
 * `scrollIntoView`/`href="/#sobre-mi"` (Header, Footer, el CTA del propio
 * Hero) siguen funcionando sin tocar nada ahí.
 *
 * **Entrada simétrica a la salida del Hero + centrado + overlap sobre el
 * panel (2026-09-10, mismo día).** Tres pedidos del usuario sobre la
 * versión de arriba:
 *
 * 1. "Que el contenido de about me entre antes... el método inverso de cómo
 *    se desvanece el texto del hero... misma entrada y salida ambos." El
 *    contenido de este componente ya NO anima su propia entrada por
 *    `Reveal`/`whileInView` (se sacaron esos wrappers) — la opacidad de todo
 *    el bloque (`contentRef`, el prop que recibe este componente) la
 *    controla `Hero.tsx` desde el MISMO scroll handler que ya desvanece el
 *    wordmark/bio del Hero.
 * 2. **Todo centrado** (`items-center text-center`, con la doble regla
 *    flanqueando el eyebrow — el mismo tratamiento que tenía ANTES del
 *    layout asimétrico del punto anterior, restaurado porque combina mejor
 *    con texto centrado que una sola regla a la izquierda).
 * 3. **La columna se ensancha para superponerse al panel de Nora a
 *    propósito** (`md:max-w-[64%] lg:max-w-[66%]`, contra el `md:w-[46%]
 *    lg:w-[40%]` del panel) con un `bg-gradient-to-r` oscureciendo el tramo
 *    de superposición. **Revertido el mismo día** (ver la entrada de más
 *    abajo, "Vuelta al container plano...") — el usuario lo vio y pidió
 *    sacarlo: se leía como "una caja negra flotando", no como el mismo tipo
 *    de contenedor que ya usa el propio Hero para su wordmark/bio/slider de
 *    credenciales (que no lleva ningún fondo propio). Ya no está en el
 *    código — el ancho volvió a `md:max-w-[54%] lg:max-w-[58%]` (el mismo
 *    que usa el Hero, sin superposición deliberada) y no hay `bg-gradient`.
 *
 * **De sección normal-flow (aparece scrolleando desde abajo) a capa
 * superpuesta en el mismo sitio (2026-09-10, más tarde el mismo día).**
 * Pedido explícito, tras ver la versión de arriba: "quiero que el container
 * del contenido ya exista detrás con opacidad... no quiero que venga de
 * abajo... si vuelvo al hero, empieza a desaparecer en su lugar, tal cual lo
 * hace el logo Nora y su información en el hero." La entrada por
 * `getBoundingClientRect()` del punto 1 de arriba SEGUÍA moviendo el bloque
 * verticalmente (normal-flow, entraba scrolleando) — lo que pedía el
 * usuario es que NO se mueva en absoluto, que sea un cruce de opacidades
 * puro, en el mismo lugar de pantalla donde el texto del Hero se apaga.
 *
 * - El `<section>` pasa de normal-flow (con su propio alto, después de un
 *   colchón de scroll en `Hero.tsx`) a `absolute inset-0` — vive DENTRO del
 *   mismo `div` `sticky` que el panel de Nora y el texto del Hero, ocupando
 *   exactamente el mismo espacio de pantalla, no una posición más abajo en
 *   el documento.
 * - Centrado verticalmente (`flex flex-col justify-center`) en vez de
 *   `py-20 sm:py-24`: ya no hay "alto de sección" que rellenar con padding,
 *   el contenido simplemente se centra en el viewport de 100vh que comparte
 *   con el Hero.
 * - La opacidad la sigue escribiendo `Hero.tsx` (mismo `contentRef`), pero
 *   ahora con la fórmula MIRROR exacta de la del Hero (`progress / 0.35`
 *   clamped, en vez de una progresión basada en la posición del propio
 *   elemento) — como el elemento ya no se mueve, no hace falta medir su
 *   `getBoundingClientRect()` en cada tick.
 * - `inert` cuando SIGUE sin ser el turno de `AboutMe` (`!contentHidden`,
 *   la bandera que ya existe en `Hero.tsx` para lo opuesto): antes de que
 *   la transición empiece a mostrar `AboutMe`, su CTA/marquee no deberían
 *   ser alcanzables por teclado (mismo patrón que ya usa el propio texto
 *   del Hero al revés).
 * - `Hero.tsx` ganó `TRANSITION_HOLD_VH` (scroll extra DESPUÉS de que la
 *   transición ya terminó): sin esto, apenas termina el cruce de opacidades
 *   el `sticky` se despega y la composición asentada (Nora a la izquierda +
 *   este contenido) dura un instante en pantalla antes de seguir de largo.
 *
 * **Vuelta al container plano, sin fondo — "igual que el container del
 * logo de Nora Filmus, slider de marcas, etc" (2026-09-10, más tarde el
 * mismo día).** El usuario reportó tres cosas sobre la versión de arriba:
 *
 * 1. **"La foto de Nora siempre queda al frente, solo en mobile queda por
 *    detrás."** No era un bug de `z-index` (`AboutMe` ya estaba en `z-10`,
 *    por encima del panel en `z-0` — confirmado con `elementFromPoint`
 *    contra un build de producción). La causa real: el `bg-gradient-to-r`
 *    cubría un ancho PROPORCIONALMENTE angosto en desktop (la columna de
 *    64-66%) pero, al no tener la columna ningún `max-w-*` por debajo de
 *    `md`, en mobile el mismo degradé se estiraba al 100% del ancho —
 *    tapando/oscureciendo mucho más de la foto ahí que en desktop. Se leía
 *    como "en desktop la foto gana, en mobile pierde" sin que cambiara
 *    ningún z-index — cambiaba cuánto tapaba el degradé.
 * 2. **"Los tiempos no son los mismos que el desvanecimiento del Hero."**
 *    La fórmula YA era un espejo exacto (verificado numéricamente: las dos
 *    opacidades suman ~1.0 en cada punto de scroll probado) — lo que se
 *    percibía como "distinto" era consecuencia del punto 1: con el fondo
 *    oscureciendo de forma desigual entre breakpoints, el cruce se LEÍA
 *    distinto aunque la matemática fuera idéntica.
 * 3. **"No quiero una caja negra flotando — que el contenido esté en un
 *    container posicionado a la derecha, igual que el container del logo
 *    de Nora Filmus, el slider de marcas, etc."** Pedido explícito de
 *    replicar el tratamiento que ya usa el bloque de texto del propio Hero:
 *    SIN fondo propio, ancho `md:max-w-[54%] lg:max-w-[58%]` (el mismo que
 *    ya usa el Hero, en vez de los `64%/66%` que se habían ensanchado para
 *    superponerse a propósito).
 *
 * Los tres se resolvieron con UN solo cambio: sacar el `bg-gradient-to-r` y
 * devolver el ancho de la columna al mismo que usa el Hero (`md:max-w-[54%]
 * lg:max-w-[58%]`, sin superposición deliberada al panel). Sin el degradé
 * desigual entre breakpoints, el punto 1 desaparece solo; sin esa
 * asimetría, el cruce de opacidades del punto 2 se percibe limpio (la
 * matemática nunca cambió); y el resultado visual ya es, literalmente,
 * "el mismo tipo de container" que pedía el punto 3 — mismo ancho, mismo
 * fondo (ninguno), mismo criterio de legibilidad contra el panel (el
 * feather del propio panel, no un scrim aparte).
 *
 * **Autoplay probado y revertido de nuevo (2026-09-10/11) — vuelta a
 * `contentRef`.** Hubo un intento intermedio de reemplazar el prop
 * `contentRef` (opacidad escrita a mano por `Hero.tsx` desde su scroll
 * handler) por un prop `visible` booleano + `motion.div`/`animate` propio,
 * atado al mecanismo de autoplay que se probó en `Hero.tsx`. El usuario
 * probó ese autoplay y no le gustó ("no me gustó automático, dejemoslo como
 * estaba antes") — revertido entero. Este componente vuelve a recibir
 * `contentRef` (un `ref` que `Hero.tsx` usa para escribir `style.opacity`
 * a mano, en el mismo callback de scroll que ya desvanece su propio
 * wordmark/bio) tal cual describen las dos entradas de arriba
 * ("De sección normal-flow..." y "Vuelta al container plano...").
 *
 * **Prop `overlay`: dos modos reales, no uno con un caso roto
 * (2026-09-10, auditoría de fluidez/UX).** Hasta ahora este componente
 * asumía SIEMPRE el modo capa (`absolute inset-0`, `bg-ink` ausente,
 * `id="sobre-mi"` acá mismo) — funcionaba en desktop grande, pero se rompía
 * en dos escenarios reales que nunca se habían probado en navegador:
 * `prefers-reduced-motion` (nadie escribía la opacidad → esta sección se
 * pintaba SIEMPRE encima del Hero, las dos opacas, ilegibles) y viewports
 * donde el bloque no entra sin recortarse (mobile, y — sorpresa, medido —
 * el tramo `md` de 768-1023px, donde la columna angosta al 54% produce MÁS
 * saltos de línea que en mobile de una columna).
 *
 * Ahora es explícito: `overlay=true` (lo que `Hero.tsx` pasa solo cuando
 * `enableTransition && overlayFits`, ver su docblock "Auditoría de
 * fluidez...") es el modo capa de siempre. `overlay=false` (default) es una
 * sección NORMAL — `relative w-full bg-ink py-20 sm:py-24`, `id="sobre-mi"`
 * acá mismo, columna centrada `mx-auto max-w-3xl` en vez de `ml-auto` — la
 * misma composición visual que tenía la sección antes de que existiera el
 * concepto de "una sola escena" (ver "De sección centrada..." arriba), para
 * los casos donde superponerla no entra o no aplica.
 *
 * La bio también gana un ancho condicional (`max-w-lg` en modo capa,
 * `max-w-md` en modo flow): en modo capa cada línea extra de la bio suma
 * directo al alto del bloque, que es justo lo que hay que minimizar para
 * que quepa sin recortarse.
 */
interface AboutMeProps {
  /**
   * `true` — capa superpuesta al panel de Nora, dentro del `sticky` del
   * Hero: la composición de una sola escena (ver docblock). `Hero.tsx`
   * escribe la opacidad por scroll vía `contentRef`.
   *
   * `false` (default) — sección normal, en el flujo, después del Hero. Es
   * el modo de `prefers-reduced-motion`/ahorro de datos y el de cualquier
   * viewport que no da el alto: superpuesta acá el bloque se recortaba
   * arriba y abajo contra el `overflow-hidden` del sticky, sin manera de
   * scrollear (medido: un iPhone SE perdía 106px por lado, y un portátil de
   * 13" 30px). En reduced-motion era peor todavía: sin transición nadie
   * escribía la opacidad, así que Hero y AboutMe se pintaban SUPERPUESTOS
   * y opacos a la vez, los dos ilegibles.
   */
  overlay?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  inert?: boolean;
}

export default function AboutMe({ overlay = false, contentRef, inert }: AboutMeProps) {
  const { t } = useLanguage();
  const { about } = t;
  const reduced = useReducedMotion();

  return (
    <section
      // En modo capa el ancla la resuelve un marcador propio en `Hero.tsx`
      // (posicionado donde termina la transición) — acá el `id` apuntaría
      // siempre al tope de la página, ver su comentario.
      id={overlay ? undefined : 'sobre-mi'}
      className={cn(
        'z-10 flex flex-col justify-center overflow-hidden',
        overlay ? 'absolute inset-0' : 'relative w-full bg-ink py-20 sm:py-24'
      )}
      inert={inert}
    >
        <div
          ref={contentRef}
          className={cn(
            'relative flex w-full flex-col items-center px-6 text-center sm:px-10 md:px-12',
            overlay
              ? 'ml-auto md:max-w-[54%] lg:max-w-[58%]'
              : 'mx-auto max-w-3xl'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-brand-red" aria-hidden />
            <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
              {about.eyebrow}
            </span>
            <span className="h-px w-8 bg-brand-red" aria-hidden />
          </div>

          <h2 className="mt-2 font-display text-4xl uppercase leading-[0.95] text-cream sm:text-5xl md:text-6xl">
            {about.titleLead}
            <br />
            <span className="text-brand-red">{about.titleAccent}</span>
          </h2>

          {/* Auditoría 2026-08-31: `max-w-xl` (36rem) a varias líneas escanea
              mal — el antipatrón clásico de párrafo demasiado ancho. `max-w-md`
              (28rem) acorta la línea; `text-lead` reemplaza el `text-sm` de
              font-label, que compartía tamaño con un label de 11px para el
              bloque de texto más largo de la sección.
              **2026-09-10:** vertical compacto (`space-y-4`→`space-y-1`,
              `mt-6`→`mt-3`) — este bloque ahora vive centrado en un solo
              viewport de 100vh junto al resto del contenido (ver docblock,
              "De sección normal-flow..."), no tiene el alto libre de una
              sección propia para desperdiciar en aire vertical. Ajustado dos
              veces: la primera pasada (`mt-4`/`space-y-2`) todavía se
              recortaba en laptops de 800px de alto (13"), medido con
              Playwright — ver docblock. */}
          {/* En modo capa la bio va un escalón más ancha (`max-w-lg`, 512px
              ≈ 60 caracteres por línea a 17px — dentro del rango legible de
              45–75, y bastante por debajo del `max-w-xl` que la auditoría
              del 2026-08-31 descartó por ancho). No es cosmético: son ~2
              líneas menos, y con eso el bloque entero baja de 827px a ~771 y
              entra en un viewport de 800 — o sea, un portátil de 13" conserva
              la composición superpuesta en vez de caer a la sección normal. */}
          <div
            className={cn(
              'mt-2 space-y-1 font-label text-lead text-cream/80',
              overlay ? 'max-w-lg' : 'max-w-md'
            )}
          >
            <p>{about.body1}</p>
            <p>{about.body2}</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href={LINKS.email}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 font-label text-xs font-medium uppercase tracking-[0.15em] text-cream transition-colors duration-300 hover:bg-brand-red-deep"
            >
              <Mail className="h-4 w-4" />
              {about.cta}
            </a>
          </div>

          {/* Con `prefers-reduced-motion` el marquee no corre y la fila pasa a ser
              scrolleable a mano: era la ÚNICA animación infinita del sitio y la
              única sin guarda — todo lo demás (BackgroundDots, PillarMenu,
              Preloader, CreditList, Trayectoria) ya la respetaba (auditoría
              E1/H4). Sin `repeat: Infinity` no hace falta duplicar la
              galería, así que en ese modo se renderiza una sola vez.
              **2026-09-10:** `mt-16`→`mt-4` y las fichas se achican dos veces
              (`h-56 sm:h-72`→`h-28 sm:h-36`→`h-24 sm:h-32`) — mismo motivo
              que arriba, este bloque ahora comparte un solo viewport con
              todo lo demás. */}
          <div
            className={cn(
              'relative mt-3 w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
              reduced ? 'overflow-x-auto' : 'overflow-hidden'
            )}
          >
            <motion.div
              className="flex w-max gap-4"
              animate={reduced ? undefined : { x: ['0%', '-50%'] }}
              transition={reduced ? undefined : { duration: 34, ease: 'linear', repeat: Infinity }}
            >
              {(reduced ? about.gallery : [...about.gallery, ...about.gallery]).map((item, i) => (
                <figure key={i} className="w-24 flex-shrink-0 sm:w-28">
                  <Picture
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 640px) 112px, 96px"
                    pictureClassName="block"
                    className="h-24 w-full rounded-lg object-cover sm:h-28"
                  />
                  <figcaption className="mt-2 font-label text-[10px] leading-snug text-cream/50">
                    <span className="block text-cream/70">{item.work}</span>
                    <span className="block text-brand-red">{item.role}</span>
                    {item.credit ? (
                      <span className="block text-cream/50">Foto: {item.credit}</span>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </div>
        </div>
    </section>
  );
}
