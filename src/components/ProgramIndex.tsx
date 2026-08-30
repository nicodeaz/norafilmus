import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

interface IndexItem {
  key: string;
  label: string;
  href: string;
  /** Descriptor de una línea — solo los 3 Actos lo traen (su `eyebrow` real, ej. "Actuación"). Trayectoria/Presente se explican solos por el nombre. */
  descriptor?: string;
}

/**
 * Índice de programa — Fase 2 del rediseño de fondo (2026-08-28).
 *
 * Cierra el hueco que señalaron las tres IAs consultadas (ver CLAUDE.md,
 * "Rediseño de fondo — auditoría cruzada + Fase 1"): con las 5 páginas ya
 * viviendo en rutas propias (Fase 1), Home necesitaba un momento propio que
 * las presente como destinos reales — antes Trayectoria/Presente solo
 * aparecían como texto chico en Header/Footer, sin la misma presencia que
 * los 3 pilares del Hero. Esto no reemplaza al `PillarMenu` del Hero (que
 * sigue siendo la puerta de entrada rápida arriba del todo): es el "índice
 * de programa" que un programa de teatro real trae adentro, con las 5
 * páginas a igual peso.
 *
 * Deliberadamente NO reusa `PillarMenu` (mosaico + estado activo compartido):
 * ese componente está atado al tipo `Pillar` (imagen/crédito), y Trayectoria/
 * Presente no tienen esa forma en `content.ts`. Acá cada fila es su propio
 * link con su propio hover — más simple, y es la variedad compositiva que ya
 * usan Hero/AboutMe/Trayectoria entre sí (ninguna sección repite el layout
 * de la anterior).
 */
export default function ProgramIndex() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  const items: IndexItem[] = [
    ...t.pillars.map((p) => ({
      key: p.key,
      label: p.label,
      href: p.href!,
      descriptor:
        p.key === 'crear' ? t.crear.eyebrow : p.key === 'ensenar' ? t.ensenar.eyebrow : t.producir.eyebrow,
    })),
    { key: 'trayectoria', label: t.nav.trayectoria, href: '/trayectoria' },
    { key: 'presente', label: t.nav.presente, href: '/presente' },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <Reveal as="div" className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {t.programIndex.eyebrow}
          </span>
        </Reveal>

        <ul className="mt-8 border-t border-cream/10">
          {items.map((item, index) => (
            <Reveal key={item.key} as="li" delay={reduced ? 0 : index * 0.06}>
              <Link
                to={item.href}
                className="group flex items-baseline justify-between gap-6 border-b border-cream/10 py-6 outline-none md:py-8"
              >
                <span className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-label text-xs text-cream/25 transition-colors duration-300 group-hover:text-brand-red group-focus-visible:text-brand-red md:text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-4xl uppercase leading-none text-cream/70 transition-colors duration-300 group-hover:text-cream group-focus-visible:text-cream sm:text-5xl md:text-7xl">
                    {item.label}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-4">
                  {item.descriptor && (
                    <span
                      className={cn(
                        'hidden font-label text-xs uppercase tracking-[0.2em] text-cream/25',
                        'transition-colors duration-300 group-hover:text-brand-red/70 sm:inline'
                      )}
                    >
                      {item.descriptor}
                    </span>
                  )}
                  {/* Fase 6 — la flecha entra desde la izquierda en hover/focus,
                      la versión "IR →" del cursor contextual que sugerían las
                      IAs consultadas, sin trackear mouse (más robusto, funciona
                      igual con teclado). */}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 -translate-x-2 text-brand-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
