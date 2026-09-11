import { Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useCaptcha } from '@/lib/hooks/use-captcha';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { Button } from './Button';
import CaptchaField from './CaptchaField';
import { TextAreaField, TextField } from './FormField';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Formulario de `/contacto` (2026-09-07) — envía a `/api/contact.php`, que
 * manda dos mails con PHPMailer y la identidad de marca de
 * `public/api/mail/templates/` (mismo mecanismo que `nora-landing/mail/` —
 * ver docblock de `public/api/contact.php`). Captcha propio vía
 * `useCaptcha` (honeypot + desafío firmado, sin Google reCAPTCHA). En local
 * (`npm run dev`, Vite) los endpoints PHP no se ejecutan: el botón queda
 * deshabilitado hasta que `captcha` resuelve — probar de punta a punta
 * necesita el proyecto servido por Apache+PHP (XAMPP en este entorno).
 *
 * Manda `lang` (el idioma actual del sitio, no del formulario) para que la
 * confirmación automática que recibe quien escribió salga en su idioma.
 */
export default function ContactForm() {
  const { t, lang } = useLanguage();
  const { form } = t.contacto;
  const { captcha, refresh } = useCaptcha();
  const [status, setStatus] = useState<Status>('idle');
  const [answer, setAnswer] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captcha || status === 'sending') return;

    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    setStatus('sending');

    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          honeypot: data.get('website'),
          lang,
          token: captcha.token,
          answer,
        }),
      });
      if (!res.ok) throw new Error('send_failed');
      setStatus('success');
      formEl.reset();
      setAnswer('');
    } catch {
      setStatus('error');
      setAnswer('');
      refresh();
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="font-label text-sm text-cream/70">
        {form.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Honeypot: un bot que completa todos los campos del form llena esto
          también — una persona nunca lo ve ni lo tabula (sr-only + tabIndex -1). */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <TextField
        id="name"
        label={form.nameLabel}
        type="text"
        required
        maxLength={80}
        placeholder={form.namePlaceholder}
      />
      <TextField
        id="email"
        label={form.emailLabel}
        type="email"
        required
        maxLength={120}
        placeholder={form.emailPlaceholder}
      />
      <TextAreaField
        id="message"
        label={form.messageLabel}
        required
        maxLength={2000}
        rows={5}
        placeholder={form.messagePlaceholder}
      />

      <CaptchaField
        id="contact-captcha"
        label={form.captchaLabel}
        question={captcha?.question}
        value={answer}
        onChange={setAnswer}
      />

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" disabled={!captcha || status === 'sending'}>
          <Send className="h-4 w-4" aria-hidden />
          {status === 'sending' ? form.sending : form.submit}
        </Button>
        {status === 'error' && (
          <span role="alert" className="font-label text-xs text-brand-red">
            {form.error}
          </span>
        )}
      </div>
    </form>
  );
}
