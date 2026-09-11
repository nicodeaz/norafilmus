<?php
/**
 * POST — "Firmá el programa" (`SignatureWall.tsx`). Guarda cada firma en
 * `../data/signatures.json` con `flock()` para evitar que dos firmas
 * simultáneas se pisen. Reemplaza al esquema anterior en Vercel (commit
 * directo a GitHub vía su API de contenidos, que además disparaba un
 * redeploy real por cada firma) — acá una firma nueva es instantánea, sin
 * esperar ningún redeploy: el mismo archivo que este script escribe es el
 * que `SignatureWall` lee con `fetch('/data/signatures.json')`.
 */
define('NORA_BOOT', true);
require __DIR__ . '/config.php';
require __DIR__ . '/_lib/captcha.php';
require __DIR__ . '/_lib/util.php';

const MAX_SIGNATURES = 500;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    nora_json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$body = nora_json_body();
if ($body === null) {
    nora_json_response(400, ['ok' => false, 'error' => 'invalid_json']);
    exit;
}

if (nora_honeypot_tripped($body)) {
    nora_json_response(200, ['ok' => true]);
    exit;
}

if (!captcha_verify($body['token'] ?? null, $body['answer'] ?? null)) {
    nora_json_response(400, ['ok' => false, 'error' => 'captcha_invalid']);
    exit;
}

$name = nora_clean($body['name'] ?? '', 40);
$message = nora_clean($body['message'] ?? '', 140);

if (!$name || !$message) {
    nora_json_response(400, ['ok' => false, 'error' => 'invalid_fields']);
    exit;
}

$path = __DIR__ . '/../data/signatures.json';
$fp = fopen($path, 'c+');
if ($fp === false) {
    nora_json_response(500, ['ok' => false, 'error' => 'storage_unavailable']);
    exit;
}

if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    nora_json_response(503, ['ok' => false, 'error' => 'storage_busy']);
    exit;
}

$size = filesize($path);
$raw = $size > 0 ? fread($fp, $size) : '[]';
$list = json_decode($raw, true);
if (!is_array($list)) {
    $list = [];
}

$list[] = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'message' => $message,
    'date' => date('Y-m-d'),
];

if (count($list) > MAX_SIGNATURES) {
    $list = array_slice($list, -MAX_SIGNATURES);
}

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

nora_json_response(200, ['ok' => true]);
