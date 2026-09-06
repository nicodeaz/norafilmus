import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { EASE_REVEAL } from '@/lib/ease';
import { cn } from '@/lib/utils';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import BackgroundDots from './BackgroundDots';
import { ButtonLink } from './Button';
import LanguageToggle from './LanguageToggle';
import Picture from './Picture';
import PillarMenu from './PillarMenu';

interface HeroProps {
  className?: string;
}

/**
 * Logos oficiales de la tira de credenciales (2026-08-31, reemplaza al texto
 * plano que había antes). Generados por `scripts/build-credential-logos.mjs`
 * a partir de fuentes archivadas en `external-assets/brand/credentials/` —
 * siluetas monocromas en cream, sin los colores propios de cada marca (ver
 * docblock del script). Es un lookup por nombre, no un campo de
 * `content.ts`: el logo es el mismo objeto visual en los dos idiomas, a
 * diferencia del resto del contenido bilingüe del archivo.
 */
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
 */
export default function Hero({ className }: HeroProps) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  const socialLinks = [
    { label: t.social.instagram, href: LINKS.instagram, icon: Instagram, external: true },
    { label: t.social.linkedin, href: LINKS.linkedin, icon: Linkedin, external: true },
    { label: t.social.email, href: LINKS.email, icon: Mail, external: false },
  ];

  const credentialLogos = t.hero.credentials
    .map((name) => ({ name, logo: CREDENTIAL_LOGOS[name] }))
    .filter((c): c is { name: string; logo: (typeof CREDENTIAL_LOGOS)[string] } => Boolean(c.logo));

  return (
    <div
      className={cn(
        'sticky top-0 z-0 flex h-screen w-full flex-col overflow-hidden bg-ink',
        className
      )}
    >
      <BackgroundDots />

      {/* ── Luz de escena ambiente (2026-09-04, "living photo") ──────────
          Capa independiente DETRÁS de la figura: un resplandor rojo tenue
          que deriva de posición e intensidad muy lentamente (15s), como una
          luz de escenario que respira. La figura nunca se mueve — es esta
          capa la que da la sensación de escena viva, separada del cuerpo de
          Nora (parallax de profundidad real entre dos capas, no un
          translate/scale del bloque entero de la foto). Sin `filter`/
          `backdrop-blur`: un `radial-gradient` ya lee como luz suave sin el
          costo de repintado que tuvo `PhotoMarquee` (revertido el mismo día
          por lento — ver docblock de más arriba). Antes de la figura en el
          DOM → detrás en stacking (mismo z como BackgroundDots, gana por
          orden), `z-10` explícito para quedar entre los puntos (z-0) y la
          figura (`z-20`). */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 z-10 h-[50vh] w-[55vw] max-w-[480px] md:right-[8vw] md:h-[80vh] md:w-[40vw]"
        style={{
          background: 'radial-gradient(closest-side, rgba(229,57,53,0.18), rgba(229,57,53,0) 72%)',
        }}
        animate={
          reduced
            ? undefined
            : { x: [0, 16, -8, 0], y: [0, -12, 8, 0], opacity: [0.5, 0.8, 0.6, 0.5] }
        }
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Figura ───────────────────────────────────────────────────────
          Anclada abajo y a la derecha, con tope de alto para dejar aire
          sobre la cabeza (ver docblock). `z-20` la pone por delante del
          nombre, que pasa por detrás. Una sola foto estática — sin ancho
          propio (`w-auto`, shrink-to-fit a través de `picture`), un solo
          nivel de `position:absolute` (a diferencia del rotador que estuvo
          acá 3/9–4/9, que necesitaba dos niveles anidados para el crossfade
          y por eso forzaba `aspect-[3/4]` explícito — ver memoria
          `sharp-vs-onnxruntime-y-shrink-to-fit` si esto vuelve a cambiar). */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_REVEAL, delay: 0.35 }}
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[52vh] md:right-[11vw] md:h-[90vh]"
      >
        <Picture
          src="/img/nora-portrait.webp"
          alt={t.hero.portraitAlt}
          sizes="(min-width: 768px) 460px, 78vw"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          pictureClassName="block h-full w-auto"
          className="h-full w-auto object-contain object-bottom"
        />
        {/* Barrido de luz sobre la silueta — enmascarado al alfa exacto de
            la foto (`mask-image` con el mismo src: el canal alfa del cutout
            hace de máscara nativa). Un barrido diagonal muy tenue la cruza
            cada ~8.9s (2.4s de recorrido + 6.5s de pausa), como una luz de
            escenario rozándola — movimiento DENTRO de la fotografía, nunca
            del bloque completo (el `<Picture>` de al lado no se transforma).
            `mix-blend-mode: soft-light` para que tome el tono de piel/ropa
            en vez de blanquear un rectángulo; vive en un descendiente del
            Hero, no le rompe el `sticky` a ningún ancestro (ver memoria
            `sticky-roto-por-transform-y-overflow` — ese gotcha es al revés,
            de ancestro a descendiente). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light"
          style={{
            WebkitMaskImage: 'url(/img/nora-portrait.webp)',
            maskImage: 'url(/img/nora-portrait.webp)',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <motion.div
            className="absolute inset-[-30%]"
            style={{
              background:
                'linear-gradient(115deg, transparent 42%, rgba(245,239,230,0.22) 50%, transparent 58%)',
            }}
            animate={reduced ? undefined : { x: ['-45%', '45%'] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 6.5, ease: 'easeInOut' }}
          />
        </div>
        {/* Crédito del retrato — regla 3 de content.ts. Pegado al borde de la
            figura, en vertical, para no competir con el nombre que pasa por
            detrás ni con la banda de pie. */}
        <span className="pointer-events-none absolute bottom-2 right-1 z-10 font-label text-[9px] uppercase tracking-[0.15em] text-cream/50 [writing-mode:vertical-rl]">
          Foto: {t.hero.portraitCredit}
        </span>
      </motion.div>

      {/* Velo sobre la figura en mobile: ahí el texto se apoya encima de la
          remera blanca y el cream es ilegible sin esto. Va en degradé y no
          plano — el texto vive arriba a la izquierda y la figura abajo a la
          derecha, así que el velo tapa donde hay que leer y la suelta donde
          está ella (con `ink/70` plano quedaba apagada por completo). En
          desktop no hace falta: el texto vive a la izquierda de la figura. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-ink via-ink/85 to-ink/25 md:hidden"
      />

      {/* ── Barra superior ──────────────────────────────────────────────── */}
      <div className="relative z-30 flex w-full items-center justify-between px-6 pt-6 sm:px-10 md:px-12">
        <span className="font-label text-[11px] uppercase tracking-[0.25em] text-cream/50">
          {t.hero.location}
        </span>
        <LanguageToggle />
      </div>

      {/* ── Cuerpo: nombre a escala de afiche + bloque de texto ─────────── */}
      {/* `justify-start` + un pt chico y no `justify-center`: centrado dejaba
          la franja superior del viewport al 11% de ocupación (medido). */}
      <div className="relative z-30 flex flex-grow flex-col justify-start px-6 pt-[3vh] sm:px-10 md:px-12 md:pt-[2vh]">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_REVEAL, delay: 0.55 }}
          className="pointer-events-none relative z-10"
        >
          <Picture
            src="/img/nora-firma-roja.png"
            alt="Nora Filmus"
            className="w-[clamp(220px,52vw,680px)]"
            sizes="680px"
          />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_REVEAL, delay: 0.75 }}
          className="relative z-30 mt-6 md:mt-8"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-brand-red" aria-hidden />
            <p className="font-label text-[11px] uppercase tracking-[0.2em] text-brand-red">
              {t.hero.role}
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
                del wordmark que la rodea. */}
            <ButtonLink to="/trayectoria" variant="primary" size="md" className="shrink-0">
              {t.hero.cta}
            </ButtonLink>
          </div>
        </motion.div>

        {/* Tira de credenciales: nombres reconocibles y nada más. Ocupa la
            zona baja-izquierda —que quedaba vacía al subir el bloque de
            texto— con contenido real en vez de aire, y es lo que hace que
            alguien entienda el nivel sin leer la bio.
            Slider infinito (2026-09-01): mismo patrón que el marquee de
            `AboutMe` (duplicar el array + `x: ['0%','-50%']` en loop lineal,
            máscara de fade en los bordes) — con `prefers-reduced-motion` no
            corre y la fila pasa a scrollear a mano en vez de animar. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="relative mt-10 w-full max-w-xl border-t border-cream/10 pt-5 md:mt-14 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
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

      {/* ── Banda de pie: pilares + contacto ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.95 }}
        className="relative z-30 w-full border-t border-cream/10 px-6 py-4 sm:px-10 md:px-12"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <nav aria-label={t.hero.role} className="min-w-0 flex-grow">
            <PillarMenu items={t.pillars} orientation="inline" />
          </nav>

          {/* -mr-2.5 compensa el padding táctil: el ícono no cambia de
              tamaño, la caja llega a 44px (auditoría E1/H5). */}
          <div className="-mb-1 -mr-2.5 flex shrink-0 items-center self-start md:self-end">
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
        </div>
      </motion.div>
    </div>
  );
}
