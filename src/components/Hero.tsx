import { motion } from 'motion/react';
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

  const socialLinks = [
    { label: t.social.instagram, href: LINKS.instagram, icon: Instagram, external: true },
    { label: t.social.linkedin, href: LINKS.linkedin, icon: Linkedin, external: true },
    { label: t.social.email, href: LINKS.email, icon: Mail, external: false },
  ];

  return (
    <div
      className={cn(
        'sticky top-0 z-0 flex h-screen w-full flex-col overflow-hidden bg-ink',
        className
      )}
    >
      <BackgroundDots />

      {/* ── Figura ───────────────────────────────────────────────────────
          Anclada abajo y a la derecha, con tope de alto para dejar aire
          sobre la cabeza (ver docblock). `z-20` la pone por delante del
          nombre, que pasa por detrás. */}
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
          pictureClassName="block h-full"
          className="h-full w-auto object-contain object-bottom"
        />
        {/* Crédito del retrato — regla 3 de content.ts. Pegado al borde de la
            figura, en vertical, para no competir con el nombre que pasa por
            detrás ni con la banda de pie. */}
        <span className="pointer-events-none absolute bottom-2 right-1 font-label text-[9px] uppercase tracking-[0.15em] text-cream/50 [writing-mode:vertical-rl]">
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
            <p className="max-w-xs font-label text-sm leading-relaxed text-cream/80">
              {t.hero.bio}
            </p>
            {/* Fase 2 (2026-08-28): antes apuntaba a `#sobre-mi` pese a decir
                "Ver trayectoria" — un desvío que sobrevivió porque `/trayectoria`
                no existía como página propia hasta la Fase 1. Ya existe. */}
            <ButtonLink to="/trayectoria" variant="secondary" size="md" className="shrink-0">
              {t.hero.cta}
            </ButtonLink>
          </div>
        </motion.div>

        {/* Tira de credenciales: nombres reconocibles y nada más. Ocupa la
            zona baja-izquierda —que quedaba vacía al subir el bloque de
            texto— con contenido real en vez de aire, y es lo que hace que
            alguien entienda el nivel sin leer la bio. */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="mt-10 flex max-w-xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-cream/10 pt-4 md:mt-14"
        >
          {t.hero.credentials.map((c) => (
            <li
              key={c}
              className="font-label text-[10px] uppercase tracking-[0.18em] text-cream/50"
            >
              {c}
            </li>
          ))}
        </motion.ul>
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
