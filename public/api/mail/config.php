<?php

declare(strict_types=1);

/**
 * Config del mail de contacto — mismo mecanismo y las mismas variables que
 * `nora-landing/mail/config.php` (MAIL_TRANSPORT, SMTP_*, MAIL_FROM_*, ADMIN_EMAIL),
 * a pedido explícito del usuario: "quiero que usemos mismos mecanismos para
 * enviar mails y configuraciones". Carga `mail/.env` (nunca commiteado) con
 * el mismo parser casero, cayendo a variables de entorno reales si no hay
 * `.env` (hosting con panel propio para setearlas).
 *
 * Vive en `public/api/mail/` — no como `mail/` en la raíz del proyecto como
 * en nora-landing — a propósito: acá Vite copia todo `public/` a `dist/` en
 * cada build, así que este subárbol entero (config, templates, vendor de
 * Composer) viaja junto con el resto del sitio en un solo deploy. En
 * nora-landing `mail/` se sube a mano por separado del build del frontend;
 * eso es un paso extra que este proyecto no necesita repetir.
 */
function load_contact_mail_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $env = [];
    $envPath = __DIR__ . '/.env';

    if (is_file($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            if (strlen($value) >= 2 && $value[0] === $value[-1] && ($value[0] === '"' || $value[0] === "'")) {
                $value = substr($value, 1, -1);
            }
            $env[$key] = $value;
        }
    }

    $get = static function (string $key, string $default = '') use ($env): string {
        if (array_key_exists($key, $env)) {
            return $env[$key];
        }
        $fromEnv = getenv($key);
        return $fromEnv !== false ? $fromEnv : $default;
    };

    $config = [
        'mail_transport' => strtolower($get('MAIL_TRANSPORT', 'mail')),
        'smtp_host' => $get('SMTP_HOST'),
        'smtp_port' => (int) $get('SMTP_PORT', '587'),
        'smtp_encryption' => strtolower($get('SMTP_ENCRYPTION', 'tls')),
        'smtp_username' => $get('SMTP_USERNAME'),
        'smtp_password' => $get('SMTP_PASSWORD'),
        'from_address' => $get('MAIL_FROM_ADDRESS', 'no-reply@norafilmus.com'),
        'from_name' => $get('MAIL_FROM_NAME', 'Nora Filmus'),
        'admin_email' => $get('ADMIN_EMAIL', 'norafilmus@gmail.com'),
    ];

    return $config;
}
