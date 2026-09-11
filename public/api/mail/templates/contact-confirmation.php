<?php

declare(strict_types=1);

/**
 * Auto-respuesta a quien escribió el formulario — mismo patrón de dos
 * mails por envío que nora-landing (admin notificado + confirmación al
 * visitante), bilingüe según el idioma en el que estaba el sitio al enviar
 * (`data.lang`, agregado en `ContactForm.tsx`).
 *
 * @param array{name:string,email:string,message:string,lang:string} $data
 * @return array{subject:string,html:string,text:string}
 */
function build_contact_confirmation_email(array $data): array
{
    $lang = $data['lang'] === 'en' ? 'en' : 'es';
    $name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
    $messageHtml = nl2br(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8'));

    if ($lang === 'en') {
        $greeting = "Thanks for writing, {$name}.";
        $body1 = 'I got your message and will get back to you as soon as I can — usually within a couple of days.';
        $quoteLabel = 'Your message';
        $subject = 'Got your message — Nora Filmus';
        $footerNote = 'This is an automatic confirmation — no need to reply to it.';
    } else {
        $greeting = "¡Gracias por escribirme, {$name}!";
        $body1 = 'Recibí tu mensaje y te voy a responder lo antes posible — normalmente en un par de días.';
        $quoteLabel = 'Tu mensaje';
        $subject = 'Recibí tu mensaje — Nora Filmus';
        $footerNote = 'Esta es una confirmación automática — no hace falta que la respondas.';
    }

    $body = '<p style="margin:0 0 16px 0;font-size:20px;text-transform:uppercase;letter-spacing:0.5px;">' . htmlspecialchars($greeting, ENT_QUOTES, 'UTF-8') . '</p>';
    $body .= '<p style="margin:0 0 20px 0;">' . htmlspecialchars($body1, ENT_QUOTES, 'UTF-8') . '</p>';
    $body .= email_field_row($quoteLabel, $messageHtml);
    $body .= '<p style="margin:20px 0 0 0;font-size:12px;color:rgba(245,239,230,0.45);">' . htmlspecialchars($footerNote, ENT_QUOTES, 'UTF-8') . '</p>';

    $text = "{$greeting}\n\n{$body1}\n\n{$quoteLabel}:\n{$data['message']}\n";

    return [
        'subject' => $subject,
        'html' => render_email_shell($subject, $body, $lang),
        'text' => $text,
    ];
}
