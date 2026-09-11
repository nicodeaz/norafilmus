<?php
/**
 * Captcha propio (honeypot en el formulario + este desafío matemático
 * firmado) — sin Google reCAPTCHA, decisión del usuario. Mismo esquema
 * conceptual que la versión anterior en Vercel Edge (`api/_lib/captcha.js`,
 * ya borrada): un token sin estado en servidor, con la respuesta y un
 * vencimiento firmados con HMAC-SHA256. `hash_equals()` compara la firma en
 * tiempo constante — una ventaja real sobre la versión JS anterior, que
 * comparaba con `===` normal.
 *
 * Límite ya documentado y aceptado: sin estado en servidor, un token
 * vigente (10 min) podría reenviarse. Combinado con el honeypot alcanza
 * para el volumen de este sitio.
 */
if (!defined('NORA_BOOT')) {
    http_response_code(403);
    exit;
}

const CAPTCHA_TTL_SECONDS = 600;

function captcha_generate(): array
{
    $a = random_int(1, 8);
    $b = random_int(1, 8);
    $payload = nora_base64url_encode(json_encode(['a' => $a + $b, 'e' => time() + CAPTCHA_TTL_SECONDS]));
    $token = $payload . '.' . captcha_sign($payload);

    return ['question' => "$a + $b", 'token' => $token];
}

function captcha_verify(?string $token, $answer): bool
{
    if (!$token || strpos($token, '.') === false) {
        return false;
    }

    [$payload, $signature] = explode('.', $token, 2);
    if (!hash_equals(captcha_sign($payload), $signature)) {
        return false;
    }

    $data = json_decode(nora_base64url_decode($payload), true);
    if (!is_array($data) || !isset($data['e'], $data['a'])) {
        return false;
    }
    if (time() > (int) $data['e']) {
        return false;
    }

    return is_numeric($answer) && (int) $answer === (int) $data['a'];
}

function captcha_sign(string $data): string
{
    return nora_base64url_encode(hash_hmac('sha256', $data, CAPTCHA_SECRET, true));
}

function nora_base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function nora_base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}
