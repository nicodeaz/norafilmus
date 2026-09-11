<?php
/**
 * Config del backend PHP de norafilmus (2026-09-07) — reemplaza a las Edge
 * Functions de Vercel (`api/*.js`, ahora solo `api/geo.js` sobrevive, y
 * queda huérfano si el sitio se termina de migrar). Un solo archivo con
 * constantes, sin secretos reales hardcodeados acá porque esto se commitea.
 *
 * Tres formas de fijar un valor real, en este orden de prioridad:
 *   1. Variable de entorno del hosting (`SetEnv X "..."` en Apache, o el
 *      panel del proveedor — cPanel suele tener una sección
 *      "Environment Variables" en el selector de PHP).
 *   2. `config.local.php` en esta misma carpeta (gitignored, ver
 *      .gitignore) — un archivo que devuelve un array asociativo. Sirve
 *      para probar en local sin tocar variables de entorno de Apache/XAMPP.
 *   3. El default de desarrollo de acá abajo (nunca usar en producción).
 */
if (!defined('NORA_BOOT')) {
    http_response_code(403);
    exit;
}

// Cualquier warning/notice de PHP se imprime como HTML *antes* del JSON de
// respuesta y lo corrompe (confirmado en pruebas locales: un `mail()` sin
// mailserver disponible rompía el JSON de `contact.php` así). Los endpoints
// son JSON puro — los errores van al log del servidor, no a la respuesta.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

$noraLocalOverrides = @include __DIR__ . '/config.local.php';
if (!is_array($noraLocalOverrides)) {
    $noraLocalOverrides = [];
}

function nora_config(string $key, string $default, array $overrides): string
{
    $env = getenv($key);
    if ($env !== false && $env !== '') {
        return $env;
    }
    return $overrides[$key] ?? $default;
}

define('CAPTCHA_SECRET', nora_config('CAPTCHA_SECRET', 'dev-secret-not-for-production', $noraLocalOverrides));

// El correo del formulario de contacto (destinatario/remitente/transporte)
// ya no vive acá — pasó a `mail/config.php` cuando el mail pasó de `mail()`
// nativo a PHPMailer con plantillas de marca (mismo mecanismo que
// `nora-landing/mail/config.php`, ver docblock de ese archivo).
