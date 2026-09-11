import { Component, type ReactNode } from 'react';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Red de seguridad contra el fallo más probable con poca conectividad
 * (2026-09-09, pedido explícito: "que poca conectividad no rompa todo el
 * sitio"): cada Acto/página vive en su propio chunk (`React.lazy`, F9 —
 * ver `App.tsx`), y si la conexión se corta a mitad de esa descarga, Vite
 * tira un error real ("Failed to fetch dynamically imported module") que
 * antes no capturaba nadie — sin un `ErrorBoundary`, React desmonta el
 * árbol entero y deja la pantalla en blanco, sin ningún mensaje ni forma de
 * reintentar sin recargar a ciegas.
 *
 * Vive alrededor del `<Suspense>` de `PageCurtain.tsx` (no más arriba, en
 * `App.tsx`): así un chunk que falla solo tapa el CONTENIDO de la página —
 * `Header`/`Footer`/`PageCurtain` siguen montados, el sitio no se ve roto
 * del todo. `PageCurtain` lo remonta con `key={shownPath}` en cada cambio de
 * ruta, así que un error en `/crear` no deja `/ensenar` atascada después si
 * la conexión vuelve.
 *
 * Clase, no hook: no existe `useErrorBoundary` en React todavía —
 * `componentDidCatch`/`getDerivedStateFromError` siguen siendo el único
 * mecanismo real. El fallback en sí (`ConnectionErrorFallback`) es una
 * función aparte para poder usar `useLanguage()` adentro.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary] no se pudo cargar la página:', error);
  }

  render() {
    if (this.state.hasError) return <ConnectionErrorFallback />;
    return this.props.children;
  }
}

function ConnectionErrorFallback() {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-ink px-6 text-center"
    >
      <p className="font-display text-2xl text-cream sm:text-3xl">{t.connectionError.title}</p>
      <p className="max-w-sm font-label text-sm text-cream/70">{t.connectionError.body}</p>
      {/* Recarga completa a propósito, no un `retry` in-place del chunk:
          `import()` de un chunk que ya falló una vez no vuelve a
          intentarlo solo, y una recarga también agarra un deploy nuevo si
          los hashes de los assets cambiaron mientras tanto. */}
      <Button type="button" onClick={() => window.location.reload()} className="mt-2">
        {t.connectionError.retry}
      </Button>
    </div>
  );
}
