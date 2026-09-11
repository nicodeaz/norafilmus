import { cn } from '@/lib/utils';

/**
 * Marca de estado del sitio (2026-09-11, pedido explícito del usuario): "a
 * partir de ahora esta versión sea BETA, antes de la versión 1 ALFA
 * completa" — un indicador visible para cualquier visitante de que el sitio
 * sigue en construcción, no solo una nota interna. Deliberadamente discreto
 * (pill chica, borde fino) para no competir con el logo al que acompaña en
 * los tres lugares donde aparece el wordmark (`Header`/`Footer`/`Hero`) — es
 * información de estado, no un CTA ni un acento decorativo.
 *
 * Sin traducción por idioma: "Beta" se lee igual en ES/EN, no hace falta
 * sumar una entrada a `content.ts` para una sola palabra ya universal.
 */
export default function BetaBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-brand-red/40 px-2 py-0.5 font-label text-[10px] font-bold uppercase leading-none tracking-[0.2em] text-brand-red',
        className
      )}
    >
      Beta
    </span>
  );
}
