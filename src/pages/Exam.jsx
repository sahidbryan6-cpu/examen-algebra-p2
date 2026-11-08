import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Badge, Button, Card, Dialog, Icon, ProgressBar } from '../components/ui.jsx';
import { RichText } from '../components/RichText.jsx';
import { MathInput } from '../components/MathInput.jsx';
import { Tex } from '../components/Tex.jsx';
import { THEORY, PRACTICE, topicName } from '../data/exam.js';
import { slide, spring } from '../lib/motion.js';
import { tryParse } from '../lib/algebra.js';

/** Todas las preguntas en orden: primero teoría, luego práctica. */
export const QUESTIONS = [
  ...THEORY.map((q) => ({ kind: 'theory', id: q.id, q })),
  ...PRACTICE.map((ex) => ({ kind: 'practice', id: ex.id, q: ex })),
];

function TheoryQuestion({ q, value, onChange }) {
  const options = q.type === 'tf' ? ['Verdadero', 'Falso'] : q.options;
  const toValue = (i) => (q.type === 'tf' ? i === 0 : i);
  return (
    <fieldset>
      <legend className="font-serif text-2xl font-semibold leading-snug"><RichText text={q.prompt} /></legend>
      <div className="mt-5 grid gap-3" role="radiogroup">
        {options.map((opt, i) => {
          const selected = value === toValue(i);
          return (
            <motion.label key={i} whileTap={{ scale: 0.99 }} transition={spring.press}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${selected ? 'border-primary bg-muted' : 'border-border hover:bg-muted/60'}`}>
              <input type="radio" name={q.id} checked={selected} onChange={() => onChange(toValue(i))} className="h-5 w-5 accent-[var(--primary)]" />
              <span className="font-mono text-sm text-accent">{String.fromCharCode(65 + i)}</span>
              <RichText text={opt} />
            </motion.label>
          );
        })}
      </div>
    </fieldset>
  );
}

function PracticeQuestion({ q, value, onChange }) {
  return (
    <div>
      <p className="font-serif text-2xl font-semibold"><RichText text={q.statement} /></p>
      <div className="my-4 overflow-x-auto rounded-xl bg-muted px-4 py-3"><Tex tex={q.tex} display /></div>
      {q.form === 'factored' && <p className="mb-3 text-sm text-muted-fg">Escribe el resultado como producto de factores.</p>}
      <MathInput value={value ?? ''} onChange={onChange} expVars={q.expVars} />
    </div>
  );
}

/** Examen: una pregunta por pantalla, progreso, anterior/siguiente, tiempo por pregunta y guardado automático. */
export function Exam({ session, update, onFinish }) {
  const index = session.index ?? 0;
  const current = QUESTIONS[index];
  const [dir, setDir] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const startRef = useRef(Date.now());
  const bucket = current.kind === 'theory' ? 'theory' : 'practice';
  const answer = session[bucket]?.[current.id];

  useEffect(() => { startRef.current = Date.now(); }, [index]);

  /** Suma el tiempo pasado en la pregunta actual y aplica `patch`. */
  const commit = (patch = {}) => {
    const elapsed = Date.now() - startRef.current;
    startRef.current = Date.now();
    const prev = session[bucket]?.[current.id] ?? {};
    update({
      [bucket]: { ...session[bucket], [current.id]: { ...prev, ms: (prev.ms ?? 0) + elapsed } },
      ...patch,
    });
  };

  const setValue = (value) => {
    const prev = session[bucket]?.[current.id] ?? {};
    update({ [bucket]: { ...session[bucket], [current.id]: { ...prev, value } } });
  };

  const go = (delta) => { setDir(delta); commit({ index: index + delta }); };

  const pending = QUESTIONS.filter(({ kind, id, q }) => {
    const a = session[kind === 'theory' ? 'theory' : 'practice']?.[id]?.value;
    if (kind === 'theory') return a === undefined;
    return !a?.trim() || !tryParse(a, q.expVars);
  });

  const finish = () => {
    const elapsed = Date.now() - startRef.current;
    const prev = session[bucket]?.[current.id] ?? {};
    onFinish({ [bucket]: { ...session[bucket], [current.id]: { ...prev, ms: (prev.ms ?? 0) + elapsed } } });
  };

  const isLast = index === QUESTIONS.length - 1;
  const section = current.kind === 'theory' ? 'Parte teórica' : 'Parte práctica';
  const sectionIndex = current.kind === 'theory' ? index + 1 : index - THEORY.length + 1;
  const sectionTotal = current.kind === 'theory' ? THEORY.length : PRACTICE.length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-bold text-primary">{section} · {sectionIndex} de {sectionTotal}</span>
          <span className="text-muted-fg">Pregunta {index + 1} de {QUESTIONS.length}</span>
        </div>
        <ProgressBar value={(index + 1) / QUESTIONS.length} label="Progreso del examen" />
      </div>

      <Card className="overflow-hidden">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="primary">{topicName(current.q.topic)}</Badge>
          {current.kind === 'theory' && <Badge>{current.q.type === 'tf' ? 'Verdadero o falso' : 'Opción múltiple'}</Badge>}
        </div>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div key={current.id} custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
            {current.kind === 'theory'
              ? <TheoryQuestion q={current.q} value={answer?.value} onChange={setValue} />
              : <PracticeQuestion q={current.q} value={answer?.value} onChange={setValue} />}
          </motion.div>
        </AnimatePresence>
      </Card>

      <nav className="mt-4 flex items-center justify-between gap-3" aria-label="Navegación del examen">
        <Button variant="secondary" onClick={() => go(-1)} disabled={index === 0}><Icon name="left" /> Anterior</Button>
        {isLast
          ? <Button onClick={() => (pending.length ? setConfirm(true) : finish())}>Terminar examen <Icon name="check" /></Button>
          : <Button onClick={() => go(1)}>Siguiente <Icon name="right" /></Button>}
      </nav>
      <p className="mt-3 text-center text-sm text-muted-fg">Tu avance se guarda automáticamente.</p>

      <AnimatePresence>
        {confirm && (
          <Dialog open title="¿Terminar el examen?" onClose={() => setConfirm(false)}>
            <p>Tienes {pending.length} {pending.length === 1 ? 'pregunta' : 'preguntas'} sin responder o que no pude leer. Contarán como no respondidas.</p>
            <ul className="mt-2 max-h-40 overflow-auto text-sm text-muted-fg">
              {pending.map((p) => <li key={p.id}>· Pregunta {QUESTIONS.findIndex((x) => x.id === p.id) + 1}</li>)}
            </ul>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirm(false)} autoFocus>Revisar</Button>
              <Button onClick={() => { setConfirm(false); finish(); }}>Terminar de todos modos</Button>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
