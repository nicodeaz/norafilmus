import { lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import NotFound from './components/NotFound';
import SiteLayout from './components/SiteLayout';
import { useLanguage } from './i18n/LanguageContext';
import { TRAYECTORIA_ENABLED } from '@/lib/features';

// Cada Acto/pieza de archivo va en su propio chunk — F9 (peso de assets):
// un solo bundle de 507KB para 7 rutas cuando Home (el 90% de las visitas
// según la arquitectura de "hub") solo necesita Hero+AboutMe+ProgramIndex.
// El `<Suspense>` que cubre estos lazy() NO vive acá (bug real 2026-09-07,
// ver docblock de PageCurtain.tsx): envolver `<Routes>` entero suspendía
// `SiteLayout` completo —`PageCurtain` incluido— cada vez que un chunk
// tardaba en cargar, dejando el telón de transición trabado para siempre.
// Vive ceñido a `{shown}` dentro de `PageCurtain`, no acá arriba.
const CrearPage = lazy(() => import('./pages/CrearPage'));
const EnsenarPage = lazy(() => import('./pages/EnsenarPage'));
const ProducirPage = lazy(() => import('./pages/ProducirPage'));
const TrayectoriaPage = lazy(() => import('./pages/TrayectoriaPage'));
const ContactoPage = lazy(() => import('./pages/ContactoPage'));

/**
 * Home — Fase 1 (arquitectura de rutas, 2026-08-28). Antes concatenaba el
 * sitio entero (Hero → About → Crear → Enseñar → Producir → Trayectoria →
 * Footer): el usuario pidió que la home sirva para NAVEGAR hacia el resto
 * del contenido, no para contenerlo todo. Cada Acto pasó a su propia ruta
 * (`src/pages/*Page.tsx`) — Home queda en Hero (portada) + AboutMe ("quién
 * es"), que es lo que corresponde a un hub de navegación, no un resumen
 * comprimido del sitio entero.
 *
 * `Preloader`/`Grain`/`ScrollProgress`/`Header`/`Footer` se movieron a
 * `SiteLayout` (chrome compartido por todas las rutas menos `NotFound`).
 *
 * `ProgramIndex` (Fase 2, 2026-08-28) cerraba Home con la lista de páginas a
 * igual peso — sacada de acá el 2026-09-09 a pedido del usuario. La reemplazó
 * `Highlights` ese mismo día (boxes con ícono por pilar) y al día siguiente
 * (2026-09-10) también se sacó ("quiero que saquemos la parte de EL PROGRAMA
 * en la home"). Auditoría de limpieza del 2026-09-12: ninguno de los dos
 * componentes volvió a montarse en ningún lado desde entonces, así que se
 * borraron enteros (`ProgramIndex.tsx`/`Highlights.tsx`) en vez de seguir
 * guardados "por si se retoma" — están en el historial de git si hace falta
 * recuperarlos. `Presente` y `Archivo` se sacaron del sitio 2026-09-04 (a
 * pedido del usuario) — ver `content.ts` y `VerticalPhotoSlider.tsx`, que
 * reemplaza a `Archivo` dentro de Crear/Enseñar/Producir.
 *
 * **`<AboutMe />` se sacó de acá (2026-09-10), pedido explícito del
 * usuario** ("todo en una misma sección, about me queda junto con Nora a la
 * izquierda") — pasó a renderizarse DENTRO de `Hero.tsx` (ver su docblock,
 * "Una sola escena..."), como hijo del mismo wrapper `sticky` que ya trae el
 * panel de video de Nora, para que el panel se quede pegado (sticky) durante
 * todo el scroll de `AboutMe` en vez de que `AboutMe` la tape como una
 * sección aparte.
 *
 * **`<HomeModalities />` se probó y se sacó el mismo día (2026-09-12)** — las
 * tres tarjetas de modalidad de trabajo se habían movido acá desde el pie de
 * `Ensenar.tsx` (Acto II), pero el usuario pidió revertirlo ("sacar los
 * boxes de la home... vuelve a la sección enseñar como antes"). Volvieron a
 * `Ensenar.tsx` con su tratamiento original (sin ícono ni caja — ver su
 * propio docblock); `HomeModalities.tsx` se borró entero, no queda usado en
 * ningún lado.
 */
function Home() {
  const location = useLocation();

  // Si se llega acá con un hash pendiente (ej. "Sobre mí" clickeado desde
  // `/producir`, que navega a `/#sobre-mi`), bajar hasta esa sección en vez
  // de quedarse arriba — `SiteLayout` no hace `scrollTo(0,0)` en este caso
  // a propósito, ver su propio docblock.
  //
  // Dos guardas nuevas (2026-09-06, bug real que tumbaba el sitio entero):
  // el slider de `AboutMe` ahora navega a hashes tipo
  // `/crear#Chicha%2C%20Carmen...` (créditos de `CreditList`, con comas y
  // dos puntos) — `PageCurtain` sigue mostrando `Home` un instante mientras
  // tapa el swap de página, así que este efecto llega a correr con
  // `location` ya apuntando a `/crear` pero el componente todavía siendo
  // `Home`. `document.querySelector('#Chicha, Carmen...')` con eso adentro
  // no es un selector CSS válido y tiraba una excepción sin capturar que
  // rompía el árbol de React entero (pantalla negra). `pathname !== '/'`
  // corta ese caso (este hash no es para Home) y el `try/catch` es defensa
  // extra para cualquier hash futuro que tampoco sea un selector simple.
  useEffect(() => {
    if (!location.hash || location.pathname !== '/') return;
    try {
      const target = document.querySelector(location.hash);
      if (!target) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    } catch {
      // Hash no pensado para Home (ver arriba) — no hacer nada.
    }
  }, [location.hash, location.pathname]);

  return <Hero />;
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
        <Routes>
          {/* `NotFound` se queda fuera del layout a propósito — pantalla
              aislada, sin Header/Footer/obertura (docblock de NotFound.tsx). */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/crear" element={<CrearPage />} />
            <Route path="/ensenar" element={<EnsenarPage />} />
            <Route path="/producir" element={<ProducirPage />} />
            {/* Trayectoria: fuera de producción hasta que esté pronta y
                funcional — ver lib/features.ts. La ruta sigue viva en dev
                para seguir trabajándola; en build de producción cae al 404. */}
            {TRAYECTORIA_ENABLED && <Route path="/trayectoria" element={<TrayectoriaPage />} />}
            <Route path="/contacto" element={<ContactoPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
