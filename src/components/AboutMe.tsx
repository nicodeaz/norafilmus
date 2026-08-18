import { motion, useReducedMotion } from 'motion/react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Picture from './Picture';
import Reveal from './Reveal';

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
 *   infería que eran sus papeles. Ahora cada pieza lleva obra + rol real +
 *   crédito de la fotógrafa, y el texto del archivo lo dice explícito.
 */
export default function AboutMe() {
  const { t } = useLanguage();
  const { about } = t;
  const reduced = useReducedMotion();

  return (
    <section id="sobre-mi" className="relative z-10 w-full overflow-hidden bg-ink py-20 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Reveal as="div" y={10} className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {about.eyebrow}
          </span>
          <span className="h-px w-8 bg-brand-red" aria-hidden />
        </Reveal>

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-6 font-display text-5xl uppercase leading-[0.95] text-cream sm:text-6xl md:text-7xl"
        >
          {about.titleLead}
          <br />
          <span className="text-brand-red">{about.titleAccent}</span>
        </Reveal>

        <Reveal
          as="div"
          delay={0.2}
          className="mt-6 max-w-xl space-y-4 font-label text-sm leading-relaxed text-cream/70"
        >
          <p>{about.body1}</p>
          <p>{about.body2}</p>
        </Reveal>

        <motion.a
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: reduced ? 0 : 0.3, duration: reduced ? 0.2 : undefined }}
          href={LINKS.email}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 font-label text-xs font-medium uppercase tracking-[0.15em] text-cream transition-colors duration-300 hover:bg-brand-red-deep"
        >
          <Mail className="h-4 w-4" />
          {about.cta}
        </motion.a>
      </div>

      {/* Archivo */}
      <div className="mx-auto mt-20 max-w-4xl px-6 text-center">
        <h3 className="font-label text-[11px] uppercase tracking-[0.2em] text-cream/50">
          {about.galleryTitle}
        </h3>
        <p className="mt-2 font-label text-xs text-cream/40">{about.galleryNote}</p>
      </div>

      {/* Con `prefers-reduced-motion` el marquee no corre y la fila pasa a ser
          scrolleable a mano: era la ÚNICA animación infinita del sitio y la
          única sin guarda — todo lo demás (BackgroundDots, PillarMenu,
          Preloader, Reveal, CreditList, Trayectoria) ya la respetaba
          (auditoría E1/H4). Sin `repeat: Infinity` no hace falta duplicar la
          galería, así que en ese modo se renderiza una sola vez. */}
      <div
        className={cn(
          'relative mt-8 w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
          reduced ? 'overflow-x-auto' : 'overflow-hidden'
        )}
      >
        <motion.div
          className="flex w-max gap-4"
          animate={reduced ? undefined : { x: ['0%', '-50%'] }}
          transition={reduced ? undefined : { duration: 34, ease: 'linear', repeat: Infinity }}
        >
          {(reduced ? about.gallery : [...about.gallery, ...about.gallery]).map((item, i) => (
            <figure key={i} className="w-36 flex-shrink-0 sm:w-48">
              <Picture
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 640px) 192px, 144px"
                pictureClassName="block"
                className="h-48 w-full rounded-lg object-cover sm:h-64"
              />
              <figcaption className="mt-2 font-label text-[10px] leading-snug text-cream/50">
                <span className="block text-cream/70">{item.work}</span>
                <span className="block text-brand-red">{item.role}</span>
                {item.credit ? (
                  <span className="block text-cream/25">Foto: {item.credit}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
