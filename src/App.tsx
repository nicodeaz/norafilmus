import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Crear from './components/Crear';
import Ensenar from './components/Ensenar';
import Footer from './components/Footer';
import Producir from './components/Producir';
import Header from './components/Header';
import NotFound from './components/NotFound';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import { useLanguage } from './i18n/LanguageContext';

/**
 * Header/ScrollProgress son overlays fixed y Footer cierra la página — los
 * tres viven solo acá, no en `NotFound`: el 404 es una pantalla aislada a
 * propósito (ver su propio docblock), sin chrome de sitio.
 */
function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <Hero />
      <AboutMe />
      <Crear />
      <Ensenar />
      <Producir />
      <Footer />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const handleLoaded = useCallback(() => setLoading(false), []);
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
        {loading && <Preloader onComplete={handleLoaded} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
