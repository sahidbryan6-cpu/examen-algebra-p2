import { useId, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { tryParse, toTex } from '../lib/algebra.js';
import { UNREADABLE_MSG } from '../lib/grading.js';
import { Tex } from './Tex.jsx';
import { dur } from '../lib/motion.js';

const TOOLS = [
  { label: 'x²', insert: '^2', aria: 'Elevar al cuadrado' },
  { label: 'xⁿ', insert: '^()', caret: -1, aria: 'Exponente' },
  { label: '( )', insert: '()', caret: -1, aria: 'Paréntesis' },
  { label: '^', insert: '^', aria: 'Potencia' },
  { label: '·', insert: '·', aria: 'Multiplicar' },
];

/** Campo de respuesta con botones de ayuda y vista previa en vivo con KaTeX. */
export function MathInput({ value, onChange, expVars = [], label = 'Tu respuesta' }) {
  const ref = useRef(null);
  const id = useId();
  const ast = value.trim() ? tryParse(value, expVars) : null;
  const unreadable = value.trim() && !ast;

  const insert = ({ insert: text, caret = 0 }) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const pos = start + text.length + caret;
      el?.focus();
      el?.setSelectionRange(pos, pos);
    });
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-bold">{label}</label>
      <input
        ref={ref}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode="text"
        placeholder="Ej.: 8x^3 - 7x^2 + 11x + 5"
        aria-describedby={`${id}-preview`}
        className="min-h-12 w-full rounded-xl border border-border bg-bg px-4 font-mono text-[17px] text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap gap-2" role="toolbar" aria-label="Símbolos">
        {TOOLS.map((t) => (
          <motion.button key={t.label} type="button" aria-label={t.aria} onClick={() => insert(t)}
            whileTap={{ scale: 0.94 }}
            className="min-h-11 min-w-11 rounded-lg border border-border bg-card px-3 font-mono text-lg text-fg hover:bg-muted">
            {t.label}
          </motion.button>
        ))}
      </div>
      <div id={`${id}-preview`} aria-live="polite" className="mt-3 min-h-14 rounded-xl border border-dashed border-border bg-muted/50 px-4 py-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-fg">Vista previa</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={unreadable ? 'bad' : 'ok'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur.micro }}
            className="overflow-x-auto">
            {unreadable ? (
              <p className="text-warn">{UNREADABLE_MSG}</p>
            ) : ast ? (
              <Tex tex={toTex(ast)} display />
            ) : (
              <p className="text-muted-fg">Escribe tu respuesta. Acepta x^2, x², 2x, x^(2n) y cualquier orden.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
