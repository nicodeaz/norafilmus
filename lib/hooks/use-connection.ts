import { useEffect, useState } from 'react';

/**
 * Network Information API — soporte parcial (Chrome/Edge/Android sí,
 * Safari/Firefox no la exponen). Sin ella, todo esto siempre da `false`:
 * fail-open a propósito, nunca fail-closed — preferible mostrar el video de
 * más en un navegador sin la API que dejar a alguien con buena conexión sin
 * él por un falso positivo.
 */
interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
}

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

/**
 * `true` cuando el visitante activó "Ahorro de datos" en el navegador o su
 * conexión reporta 2G/slow-2G — la señal que usa `Hero` para no autoreproducir
 * el video pesado (`hero-loop.mp4`, ~500KB) y quedarse con la imagen estática
 * en su lugar (2026-09-09, pedido explícito: "que poca conectividad no rompa
 * todo el sitio").
 */
function isSlow(conn: NetworkInformationLike | undefined): boolean {
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
}

/** Lectura única, sin re-render — para leer una sola vez dentro de un `useState(() => ...)`, igual que ya se lee `prefers-reduced-motion` a mano en `Preloader`. */
export function isSlowConnection(): boolean {
  return isSlow(getConnection());
}

/** Versión reactiva — se actualiza si el navegador dispara `connection.onchange` (ej. Wi-Fi a datos móviles a mitad de sesión). */
export function useSlowConnection(): boolean {
  const [slow, setSlow] = useState(() => isSlowConnection());

  useEffect(() => {
    const conn = getConnection();
    if (!conn?.addEventListener) return;
    const onChange = () => setSlow(isSlow(conn));
    conn.addEventListener('change', onChange);
    return () => conn.removeEventListener?.('change', onChange);
  }, []);

  return slow;
}
