import { useEffect, useState, type FormEvent } from 'react';
import { PenLine } from 'lucide-react';
import { useCaptcha } from '@/lib/hooks/use-captcha';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { Button } from './Button';
import CaptchaField from './CaptchaField';
import { TextField } from './FormField';
import Reveal from './Reveal';

interface Signature {
  id: string;
  name: string;
  message: string;
  date: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * "Firmá el programa" (2026-09-07) — la huella pública que pidió el usuario:
 * nombre + mensaje corto, sin foto ni firma dibujada (decisión tomada en la
 * conversación, no un dibujo a mano tipo canvas). Envía a `/api/sign.php`,
 * que escribe la firma en `public/data/signatures.json` con `flock()` —
 * backend PHP propio (ver docblock de `public/api/sign.php`), reemplaza al
 * esquema anterior de commitear a GitHub vía Vercel Edge. Esta pieza lee ese
 * mismo archivo con un fetch estático, no vía la API — a diferencia del
 * esquema anterior (que necesitaba esperar un redeploy), acá la escritura es
 * instantánea, así que después de firmar se refetchea la lista y la firma
 * nueva aparece sin recargar la página.
 *
 * El nombre de cada firma se muestra en `font-signature` (Give You Glory) —
 * la única fuente del sitio reservada para contenido de firma real, no copy
 * suelto (ver `design-system`); acá es exactamente ese caso de uso.
 *
 * El botón de envío lleva `PenLine` de lucide. Pasó brevemente (2026-09-09 a
 * 2026-09-12) por `NoraSignatureIcon`, un ícono de marca generado con IA; el
 * usuario pidió sacar todo ese set del sitio, así que vuelve al genérico.
 */
export default function SignatureWall() {
  const { t } = useLanguage();
  const { wall, form } = t.contacto;
  const { captcha, refresh } = useCaptcha();
  const [status, setStatus] = useState<Status>('idle');
  const [answer, setAnswer] = useState('');
  const [signatures, setSignatures] = useState<Signature[] | null>(null);

  function fetchSignatures() {
    fetch('/data/signatures.json', { cache: 'no-store' })
      .then((res) => (res.ok ? (res.json() as Promise<Signature[]>) : Promise.resolve([])))
      .then((data) => setSignatures(Array.isArray(data) ? [...data].reverse() : []))
      .catch(() => setSignatures([]));
  }

  useEffect(fetchSignatures, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captcha || status === 'sending') return;

    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    setStatus('sending');

    try {
      const res = await fetch('/api/sign.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          message: data.get('message'),
          honeypot: data.get('company'),
          token: captcha.token,
          answer,
        }),
      });
      if (!res.ok) throw new Error('sign_failed');
      setStatus('success');
      formEl.reset();
      setAnswer('');
      fetchSignatures();
    } catch {
      setStatus('error');
      setAnswer('');
      refresh();
    }
  }

  return (
    <div>
      <Reveal as="div" className="flex items-center gap-3">
        <span className="h-px w-8 bg-brand-red" aria-hidden />
        <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">{wall.eyebrow}</span>
      </Reveal>

      <Reveal as="h2" delay={0.05} className="mt-4 text-display-m font-display uppercase leading-[0.95] text-cream">
        {wall.title}
      </Reveal>

      <Reveal as="p" delay={0.1} className="mt-4 max-w-[60ch] text-body font-body leading-relaxed text-cream/80">
        {wall.body}
      </Reveal>

      {status === 'success' ? (
        <p role="status" className="mt-8 font-label text-sm text-cream/70">
          {wall.success}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end" noValidate>
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="sign-company">Company</label>
            <input id="sign-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <TextField
            id="name"
            label={wall.nameLabel}
            type="text"
            required
            maxLength={40}
            placeholder={wall.namePlaceholder}
            className="flex-1"
          />
          <TextField
            id="message"
            label={wall.messageLabel}
            type="text"
            required
            maxLength={140}
            placeholder={wall.messagePlaceholder}
            className="flex-[2]"
          />

          <div className="flex items-end gap-4">
            <CaptchaField
              id="sign-captcha"
              label={form.captchaLabel}
              question={captcha?.question}
              value={answer}
              onChange={setAnswer}
            />
            <Button type="submit" disabled={!captcha || status === 'sending'}>
              <PenLine className="h-4 w-4" aria-hidden />
              {status === 'sending' ? wall.sending : wall.submit}
            </Button>
          </div>
        </form>
      )}

      {status === 'error' && (
        <p role="alert" className="mt-3 font-label text-xs text-brand-red">
          {wall.error}
        </p>
      )}

      <div className="mt-12">
        {signatures === null ? null : signatures.length === 0 ? (
          <p className="font-label text-xs text-cream/50">{wall.empty}</p>
        ) : (
          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((s) => (
              <li key={s.id} className="border-b border-cream/10 pb-4">
                <p className="font-body italic leading-snug text-cream/80">&ldquo;{s.message}&rdquo;</p>
                <p className="mt-2 font-signature text-2xl leading-none text-brand-red">{s.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
