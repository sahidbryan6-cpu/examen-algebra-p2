/**
 * Componentes base adaptados a los tokens del sistema de diseño.
 * (Magic de 21st.dev no estaba disponible: sin API key. Se construyeron a mano con el mismo sistema.)
 */
import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { dur, spring } from '../lib/motion.js';

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:brightness-110',
  secondary: 'bg-card text-fg border border-border hover:bg-muted',
  ghost: 'bg-transparent text-primary hover:bg-muted',
  danger: 'bg-bad text-white hover:brightness-110',
};

/** Botón con resorte en hover/tap. Mínimo 44 px de alto. */
export function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <motion.button
      whileHover={props.disabled ? undefined : { y: -1 }}
      whileTap={props.disabled ? undefined : { scale: 0.97 }}
      transition={spring.press}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-base font-bold transition-colors disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <motion.section className={`rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7 ${className}`} {...props}>
      {children}
    </motion.section>
  );
}

/** Barra de progreso animada con scaleX (no anima width). */
export function ProgressBar({ value, label }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
      className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <motion.div className="h-full origin-left rounded-full bg-accent" initial={false} animate={{ scaleX: value }} transition={spring.bar} />
    </div>
  );
}

const TONES = {
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  bad: 'bg-bad-bg text-bad',
  muted: 'bg-muted text-muted-fg',
  primary: 'bg-muted text-primary',
};
export function Badge({ tone = 'muted', children, className = '' }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold ${TONES[tone]} ${className}`}>{children}</span>;
}

/** Número que cuenta hasta `to` (con 1 decimal). Con movimiento reducido aparece directo. */
export function CountUp({ to, decimals = 1, className = '' }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? to : 0);
  const text = useTransform(mv, (v) => v.toFixed(decimals));
  useEffect(() => {
    if (reduce) { mv.set(to); return undefined; }
    const controls = animate(mv, to, { duration: dur.count, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [to, reduce, mv]);
  return <motion.span className={className} aria-label={to.toFixed(decimals)}>{text}</motion.span>;
}

/** Icono SVG simple (sin emoji). */
export function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    check: 'M5 13l4 4L19 7',
    x: 'M6 6l12 12M18 6L6 18',
    left: 'M15 18l-6-6 6-6',
    right: 'M9 18l6-6-6-6',
    clock: 'M12 7v5l3 2M12 21a9 9 0 110-18 9 9 0 010 18z',
    alert: 'M12 9v4m0 4h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
    book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM20 17v4H6.5',
    lock: 'M7 11V7a5 5 0 0110 0v4M5 11h14v10H5z',
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

/** Diálogo modal accesible (Esc cierra, foco al primer botón). */
export function Dialog({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <motion.div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card"
        initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={spring.press}>
        <h2 className="font-serif text-2xl font-semibold">{title}</h2>
        <div className="mt-3">{children}</div>
      </motion.div>
    </motion.div>
  );
}

export const fmtTime = (ms) => {
  const s = Math.round((ms ?? 0) / 1000);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`;
};
