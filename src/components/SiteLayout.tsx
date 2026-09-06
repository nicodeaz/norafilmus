import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from './Preloader';
import Grain from './Grain';
import ScrollProgress from './ScrollProgress';
import Header from './Header';
import Footer from './Footer';
import PageCurtain from './PageCurtain';

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
    <>
      {loading && <Preloader onComplete={handleLoaded} />}
      <Grain />
      <ScrollProgress />
      <Header />
      <PageCurtain />
      <Footer />
    </>
  );
}
