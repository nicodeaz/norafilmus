import type { ChangeEvent } from 'react';
import { FIELD_CLASS } from './FormField';

interface CaptchaFieldProps {
  id: string;
  label: string;
  question: string | undefined;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo del captcha propio (`useCaptcha`, ver docblock) — comparte markup
 * entre `ContactForm` y `SignatureWall` en vez de repetirse. La pregunta
 * (números + operador) no se traduce: es lenguaje matemático, no copy.
 */
export default function CaptchaField({ id, label, question, value, onChange }: CaptchaFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div>
      <label htmlFor={id} className="font-label text-xs uppercase tracking-[0.15em] text-cream/60">
        {label} {question ?? '···'} =
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        value={value}
        onChange={handleChange}
        className={`${FIELD_CLASS} w-20`}
      />
    </div>
  );
}
