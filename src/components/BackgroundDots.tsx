import { useEffect, useRef } from 'react';

interface BackgroundDotsProps {
  className?: string;
}

const DOT_IMAGE_BASE = 'radial-gradient(rgba(0, 0, 0, 1) 1.5px, transparent 1.5px)';
const DOT_IMAGE_LIT = 'radial-gradient(rgba(229, 57, 53, 1) 1.5px, transparent 1.5px)';
const DOT_SIZE = '28px 28px';

/**
 * Grid de puntos repetido vía `radial-gradient` en `background-image` —
 * recreado a mano en vez de instalar "Background Plus" de 21st.dev/@reuno-ui
 * (el código fuente de ese componente está atrás de un plan pago). Puntos en
 * vez de cruces a pedido del usuario.
 *
 * Dos capas: una negra (casi invisible sobre el fondo ink) siempre presente,
 * y otra roja idéntica, recortada con un `mask-image` radial que sigue al
 * mouse (posición en `--x`/`--y`, actualizada por ref para no re-renderizar
 * en cada mousemove) — los puntos se "iluminan" en rojo donde pasa el cursor.
 * Desactivado bajo `prefers-reduced-motion`, mismo criterio que el resto del
 * sitio (ver Lenis en CLAUDE.md).
 */
export default function BackgroundDots({ className = '' }: BackgroundDotsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      spotlight.style.setProperty('--x', `${e.clientX - rect.left}px`);
      spotlight.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: DOT_IMAGE_BASE, backgroundSize: DOT_SIZE }}
      />
      <div
        ref={spotlightRef}
        className="absolute inset-0"
        style={{
          backgroundImage: DOT_IMAGE_LIT,
          backgroundSize: DOT_SIZE,
          WebkitMaskImage:
            'radial-gradient(160px 160px at var(--x, -9999px) var(--y, -9999px), black 0%, transparent 100%)',
          maskImage:
            'radial-gradient(160px 160px at var(--x, -9999px) var(--y, -9999px), black 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
