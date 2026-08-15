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
 * Adaptado de "minimalist-hero" (21st.dev/@ravikatiyar162), evolucionado
 * lejos de la estructura original: el retrato ahora es una foto de fondo
 * full-bleed (absolute, ignora el padding del hero, ocupa toda la pantalla
 * de alto) en vez de un elemento más del grid — título "Nora FILMUS" + rol +
 * bio a la izquierda, menú a la derecha, ambos en un grid de 2 columnas por
 * encima de la foto. Fondo de puntos (BackgroundDots) detrás de todo.
 *
 * `sticky top-0 z-0`: el Hero queda anclado en su lugar mientras el
 * scroll sigue — la siguiente sección (`AboutMe`, `position: relative`,
 * fondo opaco, z-index más alto) lo tapa deslizándose por encima a medida
 * que se scrollea, en vez de empujarlo hacia arriba como haría un layout
 * normal. No hace falta ninguna imagen ni sección intermedia para el efecto
 * — es el Hero mismo el que se "revela" quedando atrás.
 *
 * Todo el texto sale de `src/i18n/content.ts` (ES/EN). El sitio es una carta
 * de presentación profesional: por eso el rol va explícito arriba de la bio y
 * el correo está entre los links de contacto — sin una dirección a la que
 * escribir, el sitio no puede generar ni un solo trabajo.
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
        'sticky top-0 z-0 flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-ink p-6 sm:p-10 md:p-12',
        className
      )}
    >
      <BackgroundDots />

      {/* Retrato — fondo full-bleed, ignora el padding del hero (absolute + inset-y-0
          se posiciona contra el padding-edge, no el content-edge) para tocar de
          verdad el borde superior e inferior de la pantalla, en vez de quedar
          adentro del padding como un elemento más del flujo. La animación va en
          el wrapper (motion.div): un <picture> en display:contents no se puede
          animar (opacity/transform no aplican a cajas sin box), así que el
          wrapper es el que tiene el tamaño absoluto y el picture/img adentro
          solo heredan alto al 100%. */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_REVEAL, delay: 0.4 }}
        className="absolute inset-y-0 left-1/2 z-10 h-full w-auto max-w-none -translate-x-1/2"
      >
        <Picture
          src="/img/nora-portrait.png"
          alt={t.hero.portraitAlt}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          pictureClassName="block h-full"
          className="h-full w-auto object-contain"
        />
      </motion.div>

      {/* Toggle de idioma, arriba a la derecha — el sitio vive en Dublín y una
          parte de su público (productoras, festivales, instituciones) lo lee
          en inglés. */}
      <div className="relative z-30 flex w-full max-w-7xl justify-end">
        <LanguageToggle />
      </div>

      {/* Contenido: título+bio a la izquierda, menú a la derecha (el retrato ya no es parte del grid, ver arriba) */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-2">
        {/* Título "Nora FILMUS" + rol + bio + link, a la izquierda en desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="z-20 order-1 flex flex-col items-center py-8 text-center md:items-start md:py-0 md:text-left"
        >
          <h1 className="leading-none">
            <span className="block font-signature text-7xl leading-none text-brand-red sm:text-8xl md:text-7xl lg:text-8xl">
              {t.hero.firstName}
            </span>
            <span className="-mt-1 block font-display text-6xl uppercase leading-[0.9] text-cream sm:text-7xl md:-mt-3 md:text-6xl lg:text-7xl">
              {t.hero.lastName}
            </span>
          </h1>

          <p className="mt-4 font-label text-[11px] uppercase tracking-[0.2em] text-brand-red">
            {t.hero.role}
          </p>

          <p className="mx-auto mt-4 max-w-xs font-label text-sm leading-relaxed text-cream/80 md:mx-0">
            {t.hero.bio}
          </p>

          <ButtonLink href="#sobre-mi" variant="secondary" size="sm" className="mt-6">
            {t.hero.cta}
          </ButtonLink>
        </motion.div>

        {/* Menú, a la derecha en desktop — ver PillarMenu.tsx */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="z-20 order-2 flex items-center justify-center py-8 md:justify-end md:py-0"
          aria-label={t.hero.role}
        >
          <PillarMenu items={t.pillars} className="md:w-auto" />
        </motion.nav>
      </div>

      {/* Footer: contacto + ubicación */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="z-30 flex w-full max-w-7xl items-center justify-between pb-2"
      >
        <div className="flex items-center space-x-4">
          {socialLinks.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={label}
              title={label}
              className="text-cream/60 transition-colors duration-300 hover:text-brand-red"
            >
              <Icon className="h-7 w-7 md:h-8 md:w-8" />
            </a>
          ))}
        </div>
        <span className="font-label text-[11px] uppercase tracking-[0.15em] text-cream/50">
          {t.hero.location}
        </span>
      </motion.footer>
    </div>
  );
}
