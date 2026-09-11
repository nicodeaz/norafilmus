<?php

declare(strict_types=1);

// Static, stable-URL assets (public/email/*) — Vite copia public/ tal cual a
// dist/ en cada build, así que esta ruta relativa a la raíz del sitio nunca
// cambia entre deploys (a diferencia de dist/assets/*.js, que sí lleva hash
// y rompería un mail ya enviado). Ajustar el dominio acá cuando el hosting
// de producción esté definido — hoy asume el mismo que ya usa el resto del
// sitio para SEO (scripts/generate-page-shells.mjs, SITE_URL).
const EMAIL_ASSETS_BASE_URL = 'https://norafilmus.com/email';

/**
 * Cáscara de mail con la identidad de Nora — mismo mecanismo que
 * nora-landing/mail/templates/EmailTemplate.php (misma paleta: bg #0F0E0D,
 * texto #F5EFE6, acento #E53935 — src/index.css), adaptada:
 *
 * - Un solo header (el isotipo/firma manuscrita, `nora-firma-roja.png` ya
 *   procesado a `public/email/header.png`), sin variantes por idioma ni por
 *   "taller" — norafilmus no tiene ese concepto, es un solo sitio.
 * - Pie con Instagram + LinkedIn (los canales reales de norafilmus, según
 *   `LINKS`/`social` en content.ts) en vez de WhatsApp + Instagram.
 * - Sin la línea de crédito "Built by Okto" del pie de nora-landing — es
 *   branding propio del desarrollador en ese proyecto, no se replicó acá
 *   sin que el usuario lo pida.
 */
function render_email_shell(string $preheader, string $bodyHtml, string $lang = 'es'): string
{
    $preheader = htmlspecialchars($preheader, ENT_QUOTES, 'UTF-8');
    $lang = $lang === 'en' ? 'en' : 'es';

    $headerImg = EMAIL_ASSETS_BASE_URL . '/header.png';
    $headerAlt = htmlspecialchars('Nora Filmus', ENT_QUOTES, 'UTF-8');
    $instagramIcon = EMAIL_ASSETS_BASE_URL . '/icon-instagram.png';
    $linkedinIcon = EMAIL_ASSETS_BASE_URL . '/icon-linkedin.png';

    return <<<HTML
<!DOCTYPE html>
<html lang="{$lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>{$preheader}</title>
</head>
<body style="margin:0;padding:0;background-color:#0F0E0D;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{$preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F0E0D;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#161413;border:1px solid rgba(245,239,230,0.12);border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:36px 32px 20px 32px;text-align:center;background-color:#0F0E0D;font-size:0;line-height:0;">
            <img src="{$headerImg}" width="220" alt="{$headerAlt}" style="display:inline-block;width:220px;max-width:60%;height:auto;border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 32px 32px;font-family:Georgia,'Times New Roman',serif;color:#F5EFE6;font-size:15px;line-height:1.6;background-color:#161413;">
            {$bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 24px 32px;text-align:center;background-color:#0F0E0D;border-top:1px solid rgba(245,239,230,0.1);">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 14px auto;">
              <tr>
                <td style="padding:0 7px;">
                  <a href="https://www.instagram.com/noraritafilmus/"><img src="{$instagramIcon}" width="40" height="40" alt="Instagram" style="display:block;border:0;border-radius:999px;"></a>
                </td>
                <td style="padding:0 7px;">
                  <a href="https://www.linkedin.com/in/nora-filmus-ab353013/"><img src="{$linkedinIcon}" width="40" height="40" alt="LinkedIn" style="display:block;border:0;border-radius:999px;"></a>
                </td>
              </tr>
            </table>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;">
              <a href="https://norafilmus.com" style="color:#E53935;text-decoration:none;font-weight:bold;">norafilmus.com</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
}

/** Fila reutilizable "label chico arriba, valor abajo" — igual que en nora-landing. */
function email_field_row(string $label, string $valueHtml): string
{
    return <<<HTML
    <div style="margin:0 0 14px 0;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(245,239,230,0.5);margin:0 0 3px 0;">{$label}</div>
      <div style="font-size:16px;">{$valueHtml}</div>
    </div>
    HTML;
}

/** Botón píldora rojo sólido — acción principal (ej. "Responder por correo"). */
function email_button(string $href, string $label): string
{
    $href = htmlspecialchars($href, ENT_QUOTES, 'UTF-8');
    $label = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');

    return <<<HTML
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px 0;">
      <tr>
        <td style="border-radius:999px;background-color:#E53935;">
          <a href="{$href}" style="display:inline-block;padding:12px 26px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:999px;">{$label}</a>
        </td>
      </tr>
    </table>
    HTML;
}

/** Botón píldora con contorno — acción secundaria. */
function email_button_outline(string $href, string $label): string
{
    $href = htmlspecialchars($href, ENT_QUOTES, 'UTF-8');
    $label = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');

    return <<<HTML
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 4px 0;">
      <tr>
        <td style="border-radius:999px;border:1px solid rgba(245,239,230,0.35);">
          <a href="{$href}" style="display:inline-block;padding:11px 25px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#F5EFE6;text-decoration:none;border-radius:999px;">{$label}</a>
        </td>
      </tr>
    </table>
    HTML;
}
