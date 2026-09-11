<?php
/**
 * GET — genera un desafío de captcha propio (ver `_lib/captcha.php`). Lo
 * consumen `ContactForm` y `SignatureWall` (hook `useCaptcha`,
 * `lib/hooks/use-captcha.ts`) al montar y después de cada intento de envío.
 *
 * En `npm run dev` (Vite en :5173) este archivo NO se ejecuta — Vite sirve
 * cualquier cosa en `public/` como archivo estático, así que devuelve el
 * código PHP crudo como texto, no el JSON. Mismo límite que ya tenía
 * `api/geo.js` en la era Vercel. Para probar de verdad hace falta pegarle a
 * este mismo proyecto servido por Apache/PHP (en este entorno, ya corre en
 * XAMPP: http://localhost/norafilmus/public/api/captcha.php).
 */
define('NORA_BOOT', true);
require __DIR__ . '/config.php';
require __DIR__ . '/_lib/captcha.php';
require __DIR__ . '/_lib/util.php';

nora_json_response(200, captcha_generate());
