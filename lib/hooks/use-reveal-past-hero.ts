import { useEffect, useState } from 'react';

/**
 * true cuando el chrome fijo (Header, `SectionNav`) debería mostrarse.
 *
 * Extraído de `Header.tsx` (2026-09-11) al sumar `SectionNav` — los dos
 * necesitan la misma regla ("en `/` recién aparece pasado el 90% del alto
 * del Hero, porque el Hero ya trae su propio wordmark/toggle/redes adentro
 * del viewport y este chrome lo duplicaría antes de eso; en cualquier otra
 * ruta está visible desde el arranque, no hay Hero debajo que compita").
 */
export function useRevealPastHero(isHome: boolean) {
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const threshold = () => window.innerHeight * 0.9;
    const onScroll = () => setVisible(window.scrollY > threshold());
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

  return visible;
}
