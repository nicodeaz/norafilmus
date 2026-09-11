<?php
if (!defined('NORA_BOOT')) {
    http_response_code(403);
    exit;
}

/**
 * Saca caracteres de control Unicode (`\p{Cc}`, incluye saltos de línea
 * sueltos que podrían usarse para inyectar headers extra en el mail) y
 * recorta a `$maxLength` en caracteres, no bytes (`mb_substr`, los nombres
 * pueden traer tildes/ñ).
 */
function nora_clean($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $clean = preg_replace('/\p{Cc}/u', '', $value);
    $clean = trim($clean ?? '');

    return mb_substr($clean, 0, $maxLength);
}

function nora_json_body(): ?array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    return is_array($data) ? $data : null;
}

function nora_json_response(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
}

/** Un bot que completa todos los campos del form llena el honeypot también — una persona nunca lo ve. */
function nora_honeypot_tripped(array $body): bool
{
    return trim((string) ($body['honeypot'] ?? '')) !== '';
}
