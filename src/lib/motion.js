/**
 * Reglas de movimiento (DISEÑO.md §Movimiento). Cambia aquí la velocidad o el estilo de TODO el sitio.
 * - Solo se animan transform (x, y, scale, scaleX) y opacity.
 * - Las salidas son más cortas que las entradas.
 * - <MotionConfig reducedMotion="user"> (main.jsx) quita transform/layout si el sistema pide reducir movimiento.
 */
import { stagger } from 'motion/react';

export const ease = {
  out: [0.22, 1, 0.36, 1], // entradas: rápido al principio, suave al llegar
  in: [0.4, 0, 1, 1], // salidas
};

export const dur = { micro: 0.15, base: 0.24, screen: 0.32, exit: 0.18, count: 0.9 };

export const spring = {
  press: { type: 'spring', visualDuration: 0.2, bounce: 0.3 }, // botones (hover/tap)
  layout: { type: 'spring', visualDuration: 0.35, bounce: 0.12 }, // reordenar tablas y tarjetas
  bar: { type: 'spring', visualDuration: 0.45, bounce: 0 }, // barra de progreso
};

/** Cambio de pantalla (bienvenida → examen → resultados…). */
export const screen = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: dur.screen, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: dur.exit, ease: ease.in } },
};

/** Cambio de pregunta: entra desde el lado hacia donde avanzas. `custom` = +1 / -1. */
export const slide = {
  enter: (d) => ({ opacity: 0, x: 24 * d }),
  center: { opacity: 1, x: 0, transition: { duration: dur.base, ease: ease.out } },
  exit: (d) => ({ opacity: 0, x: -16 * d, transition: { duration: dur.exit, ease: ease.in } }),
};

/** Listas con entrada escalonada. */
export const list = { hidden: {}, show: { transition: { delayChildren: stagger(0.05) } } };
export const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } },
};
