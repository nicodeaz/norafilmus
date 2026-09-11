<?php
/**
 * POST — formulario de `/contacto` (`ContactForm.tsx`). Manda por PHPMailer
 * usando la misma identidad de marca y el mismo mecanismo de configuración
 * que `nora-landing/mail/` (2026-09-07, a pedido del usuario: "quiero que
 * usemos mismos mecanismos para enviar mails y configuraciones") — ver
 * `mail/config.php` y `mail/templates/EmailTemplate.php` para el detalle.
 * Reemplaza al `mail()` nativo que tenía esta misma ruta hasta esta sesión.
 *
 * Dos mails por envío, mismo patrón de dos mails que nora-landing (admin +
 * confirmación), pero con una diferencia real a propósito: nora-landing
 * persiste la reserva en un archivo ANTES de mandar mail (`Storage::append`),
 * así que si el mail falla igual devuelve éxito — el dato no se perdió. Acá
 * no hay ninguna persistencia del mensaje de contacto: si el mail al admin
 * falla, el mensaje se perdió de verdad, así que se lo reporta como error.
 * La confirmación al visitante sí es best-effort (si falla, Nora ya tiene el
 * mensaje — no tiene sentido decirle al visitante que algo salió mal).
 */
define('NORA_BOOT', true);
require __DIR__ . '/config.php';
require __DIR__ . '/_lib/captcha.php';
require __DIR__ . '/_lib/util.php';
require __DIR__ . '/mail/config.php';
require __DIR__ . '/mail/vendor/autoload.php';
require __DIR__ . '/mail/templates/EmailTemplate.php';
require __DIR__ . '/mail/templates/contact-notification.php';
require __DIR__ . '/mail/templates/contact-confirmation.php';

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;

function build_contact_mailer(array $config): PHPMailer
{
    $mail = new PHPMailer(true);

    if ($config['mail_transport'] === 'smtp') {
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = $config['smtp_encryption'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['smtp_port'];
    } else {
        $mail->isMail();
    }

    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_address'], $config['from_name']);

    return $mail;
}

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

$name = nora_clean($body['name'] ?? '', 80);
$email = nora_clean($body['email'] ?? '', 120);
$message = nora_clean($body['message'] ?? '', 2000);
$lang = ($body['lang'] ?? 'es') === 'en' ? 'en' : 'es';

if (!$name || !$email || !$message || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    nora_json_response(400, ['ok' => false, 'error' => 'invalid_fields']);
    exit;
}

$data = ['name' => $name, 'email' => $email, 'message' => $message, 'lang' => $lang];
$mailConfig = load_contact_mail_config();

$notification = build_contact_notification_email($data);
$adminMail = build_contact_mailer($mailConfig);
$adminMail->addAddress($mailConfig['admin_email']);
$adminMail->addReplyTo($email, $name);
$adminMail->isHTML(true);
$adminMail->Subject = $notification['subject'];
$adminMail->Body = $notification['html'];
$adminMail->AltBody = $notification['text'];

try {
    $adminMail->send();
} catch (PHPMailerException $e) {
    error_log('[api/contact] admin notification failed: ' . $e->getMessage());
    nora_json_response(502, ['ok' => false, 'error' => 'send_failed']);
    exit;
}

try {
    $confirmation = build_contact_confirmation_email($data);
    $userMail = build_contact_mailer($mailConfig);
    $userMail->addAddress($email, $name);
    $userMail->isHTML(true);
    $userMail->Subject = $confirmation['subject'];
    $userMail->Body = $confirmation['html'];
    $userMail->AltBody = $confirmation['text'];
    $userMail->send();
} catch (PHPMailerException $e) {
    error_log('[api/contact] confirmation failed: ' . $e->getMessage());
}

nora_json_response(200, ['ok' => true]);
