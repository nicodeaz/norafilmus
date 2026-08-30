'use client';
// Adaptado de beui.dev/components/motion/button (open source, MIT-ish) —
// misma mecánica (press scale, hover lift, ripple opcional, respeta
// prefers-reduced-motion), recoloreado a la paleta/tipografía de Nora en vez
// del theme shadcn genérico (bg-primary/bg-card/etc.) que traía.

import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { EASE_OUT, SPRING_PRESS } from '@/lib/ease';
import { useHoverCapable } from '@/lib/hooks/use-hover-capable';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pressScale?: number;
  /** Ripple estilo Material desde el punto de presión. Apagado por default. */
  ripple?: boolean;
  children?: ReactNode;
}

export interface ButtonLinkProps extends Omit<HTMLMotionProps<'a'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pressScale?: number;
  children?: ReactNode;
  /** Ruta interna — si se pasa, navega con `react-router` (SPA, dispara `PageCurtain`) en vez de un `<a href>` con recarga completa. */
  to?: string;
}

type Ripple = { id: number; x: number; y: number; size: number };

const BASE_CLASS =
  'inline-flex items-center justify-center font-label font-semibold uppercase tracking-wide select-none transition-colors disabled:pointer-events-none disabled:opacity-50';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-red text-cream hover:bg-brand-red/90',
  secondary: 'border border-cream/25 bg-cream/5 text-cream hover:border-brand-red/60 hover:text-brand-red',
  ghost: 'text-cream/70 hover:text-brand-red hover:bg-brand-red/10',
  outline: 'border border-brand-red bg-transparent text-brand-red hover:bg-brand-red/10',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[11px] gap-1.5 rounded-full',
  md: 'h-11 px-6 text-xs gap-2 rounded-full',
  lg: 'h-14 px-8 text-sm gap-2.5 rounded-full',
  icon: 'h-10 w-10 rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    pressScale = 0.93,
    ripple = false,
    className,
    children,
    onPointerDown,
    ...rest
  },
  ref
) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (ripple && !reduce) {
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const id = nextId.current++;
        setRipples((prev) => [
          ...prev,
          { id, x: event.clientX - rect.left, y: event.clientY - rect.top, size },
        ]);
      }
      onPointerDown?.(event);
    },
    [ripple, reduce, onPointerDown]
  );

  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={reduce ? undefined : { scale: pressScale }}
      whileHover={reduce || !canHover ? undefined : { scale: 1.02 }}
      transition={SPRING_PRESS}
      onPointerDown={handlePointerDown}
      className={cn(BASE_CLASS, ripple && 'relative overflow-hidden', VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
      {...rest}
    >
      {ripple && !reduce ? (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                className="absolute rounded-full bg-current"
                style={{ left: r.x, top: r.y, width: r.size, height: r.size, x: '-50%', y: '-50%' }}
                initial={{ scale: 0.05, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: EASE_OUT }}
                onAnimationComplete={() => setRipples((prev) => prev.filter((x) => x.id !== r.id))}
              />
            ))}
          </AnimatePresence>
        </span>
      ) : null}
      {children}
    </motion.button>
  );
});

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant = 'primary', size = 'md', pressScale = 0.93, className, children, to, ...rest },
  ref
) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const motionProps = {
    whileTap: reduce ? undefined : { scale: pressScale },
    whileHover: reduce || !canHover ? undefined : { scale: 1.02 },
    transition: SPRING_PRESS,
    className: cn(BASE_CLASS, VARIANT_CLASS[variant], SIZE_CLASS[size], className),
  };

  if (to) {
    // Sin `motion.create(Link)` a propósito: el gesto `whileTap` de motion
    // escucha `pointerdown`/`pointerup` y en ese camino se comía el click de
    // navegación de `Link` — se probó y confirmó (el click programático
    // funcionaba, el click real/simulado no). Se pierde el press-scale acá,
    // pero la navegación tiene que ser infalible.
    return (
      <Link
        ref={ref}
        to={to}
        className={motionProps.className}
        {...(rest as ComponentPropsWithoutRef<'a'>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <motion.a ref={ref} {...motionProps} {...rest}>
      {children}
    </motion.a>
  );
});
