import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Primer formulario del sitio (`/contacto`, 2026-09-07) — el sitio no tenía
 * ningún `<input>` hasta ahora. Estilo "renglón subrayado" (borde inferior,
 * sin caja/sombra) en vez de un input boxeado tipo SaaS — coherente con
 * `premium-ui`/`design-system`: el sitio no usa `box-shadow` como recurso, y
 * un input de línea lee más "programa de teatro/formulario en papel" que un
 * control de formulario genérico.
 */
export const FIELD_CLASS =
  'mt-1 w-full border-b border-cream/20 bg-transparent py-3 font-label text-sm text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-brand-red';

interface FieldLabelProps {
  id: string;
  label: string;
  className?: string;
}

export function TextField({
  id,
  label,
  className,
  ...rest
}: FieldLabelProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="font-label text-xs uppercase tracking-[0.15em] text-cream/60">
        {label}
      </label>
      <input id={id} name={id} className={FIELD_CLASS} {...rest} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  className,
  ...rest
}: FieldLabelProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="font-label text-xs uppercase tracking-[0.15em] text-cream/60">
        {label}
      </label>
      <textarea id={id} name={id} className={cn(FIELD_CLASS, 'resize-none')} {...rest} />
    </div>
  );
}
