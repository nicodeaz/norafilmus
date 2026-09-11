import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from './Preloader';
import Grain from './Grain';
import ScrollProgress from './ScrollProgress';
import Header from './Header';
import SectionNav from './SectionNav';
import Footer from './Footer';
import PageCurtain from './PageCurtain';
import VersionBadge from './VersionBadge';
import { LightboxProvider } from './Lightbox';

/**
 * Chrome compartido de sitio — Fase 1 (arquitectura de rutas, 2026-08-28).
 * Antes esto vivía a mano dentro de `Home()` en `App.tsx`; con 6 rutas que
 * necesitan el mismo chrome (Preloader/Grain/ScrollProgress/Header/Footer)
 * pasa a ser un layout de React Router (`<Route element={<SiteLayout />}>`
 * envolviendo todas las rutas menos `NotFound`, que se queda aislada a
 * propósito — ver `App.tsx`).
 *
 * **`Preloader` vuelve 2026-09-04** con el monograma NF (`NFMark`, mismo
 * componente que usa `PageCurtain` en cada cambio de ruta) — se había sacado
 * el 3/9 porque el usuario rechazó el telón de dos hojas que tenía esa
 * versión ("eliminar completamente el telón"), no la idea de una obertura en
 * sí. Pedido explícito de vuelta: "quiero usar un loader en todo el sitio,
 * quiero que el loader sea la n y la f".
 *
 * **`IntroCinematic` se sumó 2026-09-09 y se sacó 2026-09-10** — el usuario
 * la vio integrada y pidió sacarla ("no queda muy bien"). `SiteLayout` volvió
 * a montar siempre `Preloader` — sin la rama condicional que decidía entre
 * los dos. El componente (`IntroCinematic.tsx`) y su clip
 * (`/video/intro-cinematic.mp4`) se borraron enteros en la limpieza del
 * 2026-09-12 — nunca se retomaron; están en el historial de git si hace falta
 * recuperarlos.
 *
 * **`SiteBanner` se sumó 2026-09-09 y se sacó 2026-09-11** (pedido explícito:
 * "sacar el banner que decía que estamos subiendo versiones continuamente").
 * `SiteBanner.tsx` se borró entero en la limpieza del 2026-09-12 por el mismo
 * motivo que `IntroCinematic` — si el sitio necesita otro aviso temporal en
 * el futuro, conviene escribirlo de cero contra el chrome actual en vez de
 * reflotar este.
 *
 * **`SectionNav` se suma 2026-09-11** — reemplaza al nav horizontal que vivía
 * dentro de `Header` (ver su docblock): rail vertical en desktop, rueda fija
 * al pie en mobile. Comparte con `Header` el mismo criterio de aparición
 * (`useRevealPastHero`), así que las dos piezas de chrome entran/salen
 * juntas.
 *
 * **`VersionBadge` se suma 2026-09-11** — número de versión fijo en la
 * esquina inferior derecha, chico, ver su propio docblock.
 */
export default function SiteLayout() {
  const [loading, setLoading] = useState(true);
  const handleLoaded = useCallback(() => setLoading(false), []);
  const location = useLocation();

  // Scroll al tope en cada cambio de ruta — React Router no lo hace solo.
  // Excepción: `/` con un hash pendiente (ej. `/#sobre-mi` clickeado desde
  // otra página) — ese caso lo resuelve el propio `Home` con scrollIntoView,
  // pisarlo acá con scrollTo(0,0) lo rompería.
  useEffect(() => {
    if (location.pathname === '/' && location.hash) return;
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <LightboxProvider>
      {loading && <Preloader onComplete={handleLoaded} />}
      <Grain />
      <ScrollProgress />
      <Header />
      <SectionNav />
      <PageCurtain />
      <Footer />
      <VersionBadge />
    </LightboxProvider>
  );
}
