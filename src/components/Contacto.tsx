import { Instagram, Linkedin, Mail } from 'lucide-react';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Reveal from './Reveal';

/**
 * Contacto (F7) — ruta `/contacto`, cierre del sitio. El correo/redes ya
 * vivían como íconos en el Hero y en `Footer` (`LINKS`/`social`, reusados
 * tal cual acá, sin datos nuevos) pero nunca tuvieron una página propia que
 * los presente como CTA — SUPERPROMPT.md §05: "sin esto el sitio no genera
 * un solo trabajo".
 *
 * El mail va a escala de titular, como un CTA real en vez de un ícono
 * chico — es el dato que más le importa a quien llega hasta acá.
 */
export default function Contacto() {
  const { t } = useLanguage();
  const { contacto } = t;

  return (
    <section className="relative w-full overflow-hidden bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <Reveal as="div" className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {contacto.eyebrow}
          </span>
        </Reveal>

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-4 text-display-l font-display uppercase leading-[0.95] text-cream"
        >
          {contacto.titleLead} <span className="text-brand-red">{contacto.titleAccent}</span>
        </Reveal>

        <Reveal as="p" delay={0.15} className="mt-6 max-w-[60ch] text-body font-body leading-relaxed text-cream/80">
          {contacto.body}
        </Reveal>

        <Reveal as="div" delay={0.2} className="mt-12">
          <a
            href={LINKS.email}
            className="group inline-flex items-center gap-4 font-display text-4xl uppercase leading-none text-cream transition-colors duration-300 hover:text-brand-red sm:text-6xl"
          >
            <Mail className="h-8 w-8 shrink-0 text-brand-red transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-10 sm:w-10" />
            {LINKS.email.replace('mailto:', '')}
          </a>
        </Reveal>

        <Reveal as="div" delay={0.3} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-label text-xs uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
          >
            <Instagram className="h-4 w-4" />
            {t.social.instagram}
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-label text-xs uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
          >
            <Linkedin className="h-4 w-4" />
            {t.social.linkedin}
          </a>
          <span className="font-label text-xs uppercase tracking-[0.15em] text-cream/50">
            {t.hero.location}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
