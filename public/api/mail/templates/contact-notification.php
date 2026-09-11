<?php

declare(strict_types=1);

/**
 * Mail a Nora cuando alguien manda el formulario de `/contacto` — mismo
 * patrón que `build_admin_notification_email()` de nora-landing.
 *
 * @param array{name:string,email:string,message:string} $data
 * @return array{subject:string,html:string,text:string}
 */
function build_contact_notification_email(array $data): array
{
    $name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');
    $messageHtml = nl2br(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8'));

    $body = '<p style="margin:0 0 20px 0;font-size:20px;text-transform:uppercase;letter-spacing:0.5px;">Nuevo mensaje de contacto</p>';
    $body .= email_field_row('Nombre', $name);
    $body .= email_field_row('Email', '<a href="mailto:' . $email . '" style="color:#F5EFE6;">' . $email . '</a>');
    $body .= email_field_row('Mensaje', $messageHtml);
    $body .= email_button('mailto:' . $email, 'Responder por correo');
    $body .= '<p style="margin:20px 0 0 0;font-size:12px;color:rgba(245,239,230,0.45);">Enviado desde el formulario de norafilmus.com/contacto.</p>';

    $text = "Nuevo mensaje de contacto\n"
        . "Nombre: {$data['name']}\n"
        . "Email: {$data['email']}\n\n"
        . "{$data['message']}\n";

    return [
        'subject' => "Nuevo mensaje de norafilmus.com: {$data['name']}",
        'html' => render_email_shell('Nuevo mensaje de contacto - ' . $data['name'], $body, 'es'),
        'text' => $text,
    ];
}
