'use client';

import { useEffect, useState } from 'react';

/**
 * true solo en dispositivos con hover real (mouse/trackpad) — táctil dispara
 * un `:hover` fantasma al tocar que queda pegado hasta tocar otro lado, así
 * que los efectos hover-only (scale lift) van atrás de este hook.
 */
export function useHoverCapable() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return canHover;
}
