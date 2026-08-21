import { useLanguage } from '@/src/i18n/LanguageContext';
import Picture from './Picture';
import Reveal from './Reveal';

/**
 * Presente (F6, 2026-08-19) — cierra el arco de "El Programa" con el work
 * más reciente, después de Trayectoria (que termina en el presente pero solo
 * en texto) y antes del Footer. Como Trayectoria, no es uno de los tres
 * Actos: sin numeral, sin foto ancla única — acá la foto ES el contenido.
 *
 * Las seis fotos son de la sesión de estudio de Nora (2026-03-08, fotógrafa
 * Paula — la misma del retrato del Hero, ver `hero.portraitCredit`), dos de
 * cada registro: book de estudio, clown, editorial. El crédito va una sola
 * vez para toda la sección (`presente.credit`) en vez de repetirse por
 * ítem, porque las seis comparten fotógrafa y fecha — a diferencia del
 * archivo de `AboutMe`, donde cada pieza es de una obra y un fotógrafo
 * distintos.
 *
 * La grilla usa un offset vertical por columna (`i % 3`) en vez de filas
 * parejas: da una pared de fotos tipo contact sheet, no un grid genérico de
 * 3×2. Mismo criterio de asimetría que ya usan `Act` (numeral que sangra) y
 * `Trayectoria` (espina de ancho completo) — evita la cuarta sección
 * centrada y simétrica seguida.
 */
export default function Presente() {
  const { t } = useLanguage();
  const { presente } = t;

  return (
    <section id="presente" className="relative w-full overflow-hidden bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <Reveal as="div" className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {presente.eyebrow}
          </span>
        </Reveal>

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-4 text-display-l font-display uppercase leading-[0.95] text-cream"
        >
          {presente.titleLead} <span className="text-brand-red">{presente.titleAccent}</span>
        </Reveal>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <Reveal as="p" delay={0.15} className="max-w-[60ch] text-body font-body leading-relaxed text-cream/80">
            {presente.body}
          </Reveal>
          <Reveal as="p" delay={0.2} className="shrink-0 font-label text-xs uppercase tracking-[0.15em] text-cream/40">
            {presente.credit}
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {presente.items.map((item, i) => (
            <Reveal
              key={item.src}
              as="figure"
              delay={0.05 * i}
              className={i % 3 === 1 ? 'sm:-mt-10' : i % 3 === 2 ? 'sm:mt-10' : undefined}
            >
              <Picture
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 640px) 30vw, 45vw"
                pictureClassName="block"
                className="aspect-[3/4] w-full rounded-lg object-cover"
              />
              <figcaption className="mt-2 font-label text-[10px] uppercase tracking-[0.15em] text-cream/40">
                {item.label}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
