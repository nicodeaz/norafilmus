import { useCallback, useEffect, useState } from 'react';

interface Captcha {
  question: string;
  token: string;
}

/**
 * Captcha propio del sitio (`public/api/_lib/captcha.php`) — honeypot +
 * desafío matemático firmado, sin Google reCAPTCHA ni cuenta externa
 * (decisión del usuario, 2026-09-07). Pide un desafío nuevo al montar y
 * cada vez que `refresh()` se llama (después de cada intento de envío,
 * éxito o error, ya que el token es de un solo uso conceptual — ver
 * docblock de `_lib/captcha.php`).
 *
 * Backend PHP, no una Edge Function de Vercel (cambio 2026-09-07, a pedido
 * del usuario — "armar un pequeño server PHP y manejamos todo ahí"). En
 * `npm run dev` (Vite en :5173) `/api/captcha.php` no se ejecuta — Vite
 * sirve `public/` tal cual, así que devuelve el código fuente en vez de
 * JSON, y `captcha` queda en `null` (formularios deshabilitados). Probar el
 * flujo real requiere servir el proyecto con Apache+PHP — en este entorno
 * ya corre vía XAMPP en `http://localhost/norafilmus/`.
 */
export function useCaptcha() {
  const [captcha, setCaptcha] = useState<Captcha | null>(null);

  const refresh = useCallback(() => {
    fetch('/api/captcha.php')
      .then((res) => (res.ok ? (res.json() as Promise<Captcha>) : Promise.reject()))
      .then(setCaptcha)
      .catch(() => setCaptcha(null));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { captcha, refresh };
}
