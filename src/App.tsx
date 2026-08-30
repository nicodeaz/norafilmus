import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import ProgramIndex from './components/ProgramIndex';
import NotFound from './components/NotFound';
import SiteLayout from './components/SiteLayout';
import { useLanguage } from './i18n/LanguageContext';

// Cada Acto/pieza de archivo va en su propio chunk — F9 (peso de assets):
// un solo bundle de 507KB para 7 rutas cuando Home (el 90% de las visitas
// según la arquitectura de "hub") solo necesita Hero+AboutMe+ProgramIndex.
// `PageCurtain` ya cubre el swap de página con el telón, así que el
// `Suspense` que envuelve las rutas no necesita fallback propio.
const CrearPage = lazy(() => import('./pages/CrearPage'));
const EnsenarPage = lazy(() => import('./pages/EnsenarPage'));
const ProducirPage = lazy(() => import('./pages/ProducirPage'));
const TrayectoriaPage = lazy(() => import('./pages/TrayectoriaPage'));
const PresentePage = lazy(() => import('./pages/PresentePage'));
const ArchivoPage = lazy(() => import('./pages/ArchivoPage'));
const ContactoPage = lazy(() => import('./pages/ContactoPage'));

/**
 * Home — Fase 1 (arquitectura de rutas, 2026-08-28). Antes concatenaba el
 * sitio entero (Hero → About → Crear → Enseñar → Producir → Trayectoria →
 * Presente → Footer): el usuario pidió que la home sirva para NAVEGAR hacia
 * el resto del contenido, no para contenerlo todo. Cada Acto/pieza de
 * archivo pasó a su propia ruta (`src/pages/*Page.tsx`) — Home queda en
 * Hero (portada) + AboutMe ("quién es"), que es lo que corresponde a un
 * hub de navegación, no un resumen comprimido del sitio entero.
 *
 * `Preloader`/`Grain`/`ScrollProgress`/`Header`/`Footer` se movieron a
 * `SiteLayout` (chrome compartido por todas las rutas menos `NotFound`).
 *
 * `ProgramIndex` (Fase 2, 2026-08-28) cierra Home: la lista de las 5 páginas
 * a igual peso, el "índice de programa" que las tres IAs consultadas
 * señalaron como el hueco real de dejar la home en solo Hero+About — antes
 * Trayectoria/Presente solo existían como texto chico en Header/Footer.
 */
function Home() {
  const location = useLocation();

  // Si se llega acá con un hash pendiente (ej. "Sobre mí" clickeado desde
  // `/producir`, que navega a `/#sobre-mi`), bajar hasta esa sección en vez
  // de quedarse arriba — `SiteLayout` no hace `scrollTo(0,0)` en este caso
  // a propósito, ver su propio docblock.
  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <>
      <Hero />
      <AboutMe />
      <ProgramIndex />
    </>
  );
}

function App() {
  const { t } = useLanguage();

  return (
    <>
      {/* Skip link — SUPERPROMPT.md §05. Invisible hasta que se le da foco
          con teclado (Tab); es el primer elemento focusable de la página, así
          que un lector de pantalla o un usuario de teclado no tiene que
          recorrer el Hero entero (retrato, 3 pilares, footer) para llegar al
          contenido. Apunta a `#main`, que abajo tiene `tabIndex={-1}` para
          que el foco realmente se mueva ahí y no solo haga scroll. */}
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[200] focus-visible:rounded focus-visible:bg-brand-red focus-visible:px-4 focus-visible:py-2 focus-visible:font-label focus-visible:text-sm focus-visible:font-medium focus-visible:uppercase focus-visible:tracking-[0.1em] focus-visible:text-cream"
      >
        {t.skipLink}
      </a>

      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={null}>
          <Routes>
            {/* `NotFound` se queda fuera del layout a propósito — pantalla
                aislada, sin Header/Footer/obertura (docblock de NotFound.tsx). */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/crear" element={<CrearPage />} />
              <Route path="/ensenar" element={<EnsenarPage />} />
              <Route path="/producir" element={<ProducirPage />} />
              <Route path="/trayectoria" element={<TrayectoriaPage />} />
              <Route path="/presente" element={<PresentePage />} />
              <Route path="/archivo" element={<ArchivoPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
