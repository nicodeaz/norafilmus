import type { Credit } from '@/src/i18n/content';

/**
 * Lista tipo CV de sala: título de grupo + ítems con nombre/detalle/años.
 * Extraída de `Crear.tsx` (F2) para que `Enseñar.tsx` (F3) la reuse tal
 * cual — misma tipografía y espaciado en las dos secciones.
 */
export default function CreditList({ title, items }: { title: string; items: Credit[] }) {
  return (
    <div>
      <h3 className="font-label text-label uppercase tracking-[0.2em] text-brand-red">{title}</h3>
      <ul className="mt-4 flex flex-col gap-4">
        {items.map((c) => (
          <li key={c.work} className="flex items-baseline justify-between gap-4 border-b border-cream/10 pb-3">
            <div className="min-w-0">
              <p className="font-body text-cream">{c.work}</p>
              <p className="mt-0.5 font-label text-xs text-cream/50">{c.detail}</p>
            </div>
            <span className="shrink-0 font-label text-xs text-cream/40">{c.years}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
