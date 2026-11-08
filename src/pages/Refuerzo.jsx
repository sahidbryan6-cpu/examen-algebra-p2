import { useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { Badge, Button, Card, Icon } from '../components/ui.jsx';
import { RichText } from '../components/RichText.jsx';
import { MathInput } from '../components/MathInput.jsx';
import { Tex } from '../components/Tex.jsx';
import { EXPLANATIONS, BANK } from '../data/refuerzo.js';
import { PRACTICE } from '../data/exam.js';
import { gradePractice } from '../lib/grading.js';
import { parse, evaluate } from '../lib/algebra.js';
import { dur, ease, item, list, spring } from '../lib/motion.js';

/** Ejercicios de refuerzo de un tema: el práctico fallado (si aplica) + 2 nuevos del banco. */
export function refuerzoExercises(topic, practiceOk) {
  const original = PRACTICE.find((p) => p.topic === topic);
  return [...(practiceOk ? [] : [{ ...original, retry: true }]), ...BANK.filter((b) => b.topic === topic)];
}

/** Después del refuerzo: dominado si acierta el reintento (si lo hay) y al menos 1 de los 2 nuevos. */
export function afterRefuerzo(diagnosis, refuerzo) {
  const out = {};
  for (const d of diagnosis.filter((x) => !x.mastered)) {
    const exs = refuerzoExercises(d.topic, d.practiceOk);
    const res = exs.map((e) => refuerzo?.[e.id]?.status);
    if (res.every((s) => !s)) continue; // aún no intentó nada
    const retryOk = exs[0].retry ? res[0] === 'correct' : true;
    const newOk = exs.filter((e, i) => !e.retry && res[i] === 'correct').length;
    out[d.topic] = { mastered: retryOk && newOk >= 1, done: res.filter(Boolean).length, total: exs.length };
  }
  return out;
}

const fmtNum = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''));

/** Sección con aparición al hacer scroll. */
function Block({ n, title, children }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: dur.screen, ease: ease.out }} className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-serif text-xl font-semibold text-primary"><span className="font-mono text-accent">{n}.</span> {title}</h3>
      <div className="mt-3">{children}</div>
    </motion.section>
  );
}

function Explanation({ topic }) {
  const e = EXPLANATIONS[topic];
  const ex = PRACTICE.find((p) => p.topic === topic);
  const [shown, setShown] = useState(1);
  const vars = Object.entries(e.values);
  const orig = evaluate(parse(ex.original, ex.expVars), e.values);
  const res = evaluate(parse(ex.answer, ex.expVars), e.values);
  const allShown = shown >= e.steps.length;

  return (
    <div className="grid gap-4">
      <Block n={1} title="Idea clave"><p><RichText text={e.idea} /></p></Block>
      <Block n={2} title="Fórmula o regla">
        <div className="overflow-x-auto rounded-xl bg-muted px-4 py-2"><Tex tex={e.rule.tex} display /></div>
        <ul className="mt-3 grid gap-2">
          {e.rule.meaning.map((m, i) => <li key={i} className="flex gap-2"><span className="text-accent">▸</span><RichText text={m} /></li>)}
        </ul>
      </Block>
      <Block n={3} title="Paso a paso">
        <p className="mb-3 text-muted-fg">Ejercicio: <Tex tex={ex.tex} /></p>
        <ol className="grid gap-3">
          <AnimatePresence initial={false}>
            {e.steps.slice(0, shown).map((s, i) => (
              <motion.li key={i} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } }}
                className="rounded-xl border border-border p-4">
                <p className="font-bold"><span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-primary font-mono text-sm text-on-primary">{i + 1}</span><RichText text={s.que} /></p>
                <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-3">
                  <dt className="font-bold text-muted-fg">Por qué puedo</dt><dd><RichText text={s.porque} /></dd>
                  <dt className="font-bold text-muted-fg">Para qué sirve</dt><dd><RichText text={s.para} /></dd>
                </dl>
                <div className="mt-2 overflow-x-auto rounded-lg bg-muted px-3 py-1"><Tex tex={s.tex} display /></div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        {!allShown && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setShown((n) => n + 1)}>Siguiente paso <Icon name="right" /></Button>
            <Button variant="ghost" onClick={() => setShown(e.steps.length)}>Ver todos</Button>
          </div>
        )}
      </Block>
      <Block n={4} title="Verificación con números">
        <p>Sustituyo {vars.map(([k, v], i) => <span key={k}>{i ? ', ' : ''}<Tex tex={`${k}=${v}`} /></span>)} en la expresión original y en el resultado:</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <p className="rounded-lg bg-muted p-3">Original: <Tex tex={`${ex.tex} = ${fmtNum(orig)}`} /></p>
          <p className="rounded-lg bg-muted p-3">Resultado: <Tex tex={`= ${fmtNum(res)}`} /></p>
        </div>
        <p className="mt-2 font-bold text-ok">{Math.abs(orig - res) < 1e-9 ? 'Coinciden: el resultado es correcto.' : 'No coinciden.'}</p>
      </Block>
      <Block n={5} title="Error común y cómo evitarlo"><p><RichText text={e.error} /></p></Block>
      <Block n={6} title="Resumen en una frase"><p className="font-serif text-xl"><RichText text={e.resumen} /></p></Block>
    </div>
  );
}

function ExerciseCard({ ex, result, onSubmit }) {
  const [value, setValue] = useState(result?.value ?? '');
  const [feedback, setFeedback] = useState(result ?? null);
  const start = useRef(Date.now());

  const check = () => {
    const r = gradePractice(ex, value);
    if (r.status === 'empty' || r.status === 'unreadable') { setFeedback(r); return; }
    const out = { ...r, value, ms: Date.now() - start.current };
    setFeedback(out);
    onSubmit(ex, out);
  };

  return (
    <Card variants={item}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="primary">{ex.retry ? 'Otro intento del examen' : 'Ejercicio nuevo'}</Badge>
        {result && <Badge tone={result.status === 'correct' ? 'ok' : 'bad'}>{result.status === 'correct' ? 'Correcto' : 'Incorrecto'}</Badge>}
      </div>
      <p className="mt-3 font-serif text-xl font-semibold"><RichText text={ex.statement} /></p>
      <div className="my-3 overflow-x-auto rounded-xl bg-muted px-4 py-2"><Tex tex={ex.tex} display /></div>
      <MathInput value={value} onChange={setValue} expVars={ex.expVars} />
      <div className="mt-3"><Button onClick={check}>Comprobar</Button></div>
      <AnimatePresence>
        {feedback && feedback.status !== 'empty' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring.press}
            className={`mt-3 rounded-xl p-3 ${feedback.status === 'correct' ? 'bg-ok-bg text-ok' : feedback.status === 'unreadable' ? 'bg-warn-bg text-warn' : 'bg-bad-bg text-bad'}`}>
            <RichText text={feedback.message} />
          </motion.div>
        )}
      </AnimatePresence>
      {result && ex.steps && (
        <details className="mt-3 rounded-xl border border-border p-3">
          <summary className="cursor-pointer font-bold">Ver solución paso a paso</summary>
          <ol className="mt-2 grid gap-1">
            {ex.steps.map((s, i) => <li key={i} className="overflow-x-auto"><span className="font-mono text-accent">{i + 1}.</span> <Tex tex={s} /></li>)}
          </ol>
        </details>
      )}
    </Card>
  );
}

/** Refuerzo: pestañas por tema por repasar, explicación completa y ejercicios calificados. */
export function Refuerzo({ diagnosis, session, onResult, onDone }) {
  const topics = diagnosis.filter((d) => !d.mastered);
  const [active, setActive] = useState(topics[0]?.topic);
  const after = afterRefuerzo(diagnosis, session.refuerzo);
  const current = topics.find((t) => t.topic === active) ?? topics[0];

  return (
    <div className="grid gap-6">
      <header>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">Refuerzo</p>
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">Repasemos paso a paso</h1>
        <p className="mt-2 text-muted-fg">Lee la explicación y resuelve los ejercicios. Se califican igual que el examen.</p>
      </header>

      <LayoutGroup>
        <div role="tablist" aria-label="Temas por repasar" className="flex gap-1 overflow-x-auto border-b border-border pb-px">
          {topics.map((t) => (
            <button key={t.topic} role="tab" aria-selected={t.topic === current.topic} onClick={() => setActive(t.topic)}
              className={`relative min-h-11 shrink-0 px-4 py-2 text-left font-bold ${t.topic === current.topic ? 'text-primary' : 'text-muted-fg hover:text-fg'}`}>
              {t.name}
              {after[t.topic]?.mastered && <Icon name="check" className="ml-1 inline h-4 w-4 text-ok" />}
              {t.topic === current.topic && <motion.span layoutId="tab-underline" transition={spring.layout} className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        <motion.div key={current.topic} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } }}
          exit={{ opacity: 0, transition: { duration: dur.exit } }} className="grid gap-6">
          <p className="rounded-xl bg-warn-bg p-3 text-sm">Antes: <strong>por repasar</strong> — {current.reason.replace('Por repasar: ', '')}</p>
          <Explanation topic={current.topic} />
          <h2 className="font-serif text-3xl font-semibold">Ahora tú</h2>
          <motion.div variants={list} initial="hidden" animate="show" className="grid gap-4">
            {refuerzoExercises(current.topic, current.practiceOk).map((ex) => (
              <ExerciseCard key={ex.id} ex={ex} result={session.refuerzo?.[ex.id]} onSubmit={(e, r) => onResult(current.topic, e, r)} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end"><Button onClick={onDone}>Terminar refuerzo <Icon name="right" /></Button></div>
    </div>
  );
}
