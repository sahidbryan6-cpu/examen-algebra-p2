import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Tex } from './Tex.jsx';
import { lookupTerm } from '../data/glossary.js';
import { dur, ease } from '../lib/motion.js';

/** Término subrayado que abre su definición del glosario (clic, Enter o espacio; Esc cierra). */
function GlossaryTerm({ label, term }) {
  const entry = lookupTerm(term);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  if (!entry) return <span>{label}</span>;
  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="underline decoration-accent decoration-2 underline-offset-4 font-semibold text-fg hover:text-primary"
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="note"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: dur.micro, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: dur.micro } }}
            className="absolute left-0 top-full z-30 mt-2 block w-[min(18rem,80vw)] rounded-xl border border-border bg-card p-3 text-left text-sm font-normal shadow-card"
          >
            <span className="block font-serif text-base font-semibold capitalize text-primary">{term}</span>
            <span className="mt-1 block text-fg">{entry.def}</span>
            <span className="mt-2 block rounded-lg bg-muted px-2 py-1 text-muted-fg">
              Ejemplo: <Tex tex={entry.ex} />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** Texto con $LaTeX$ en línea y [[término]] o [[término|texto visible]] del glosario. */
export function RichText({ text, className = '' }) {
  const parts = String(text).split(/(\$[^$]+\$|\[\[[^\]]+\]\])/g);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('$') && p.endsWith('$') && p.length > 1) return <Tex key={i} tex={p.slice(1, -1)} />;
        if (p.startsWith('[[')) {
          const [term, label] = p.slice(2, -2).split('|');
          return <GlossaryTerm key={i} term={term} label={label ?? term} />;
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}
