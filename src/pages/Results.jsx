import { motion } from 'motion/react';
import { Badge, Button, Card, CountUp, Icon, fmtTime } from '../components/ui.jsx';
import { RichText } from '../components/RichText.jsx';
import { item, list, spring } from '../lib/motion.js';
import { QUESTIONS } from './Exam.jsx';
import { topicName } from '../data/exam.js';

const STATUS = {
  correct: { tone: 'ok', text: 'Correcta' },
  incorrect: { tone: 'bad', text: 'Incorrecta' },
  empty: { tone: 'muted', text: 'Sin responder' },
  unreadable: { tone: 'warn', text: 'No legible' },
};

function Grade({ label, value, detail }) {
  return (
    <motion.div variants={item} className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-fg">{label}</p>
      <p className="mt-1 font-serif text-5xl font-bold text-primary"><CountUp to={value} /><span className="text-2xl text-muted-fg">/10</span></p>
      <p className="text-sm text-muted-fg">{detail}</p>
    </motion.div>
  );
}

/** Diagnóstico por tema: aparece al hacer scroll. */
export function Diagnosis({ diagnosis, after }) {
  const good = diagnosis.filter((d) => d.mastered);
  const bad = diagnosis.filter((d) => !d.mastered);
  const Column = ({ title, rows, tone }) => (
    <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
      className={`rounded-2xl border p-5 ${tone === 'ok' ? 'border-ok/40 bg-ok-bg' : 'border-warn/40 bg-warn-bg'}`}>
      <h3 className={`font-serif text-2xl font-semibold ${tone === 'ok' ? 'text-ok' : 'text-warn'}`}>{title}</h3>
      {rows.length === 0 && <p className="mt-2 text-muted-fg">Ninguno.</p>}
      <ul className="mt-3 grid gap-3">
        {rows.map((d) => (
          <motion.li layout variants={item} key={d.topic} className="rounded-xl bg-card p-3">
            <p className="flex flex-wrap items-center gap-2 font-bold">
              <Icon name={tone === 'ok' ? 'check' : 'alert'} className={`h-5 w-5 ${tone === 'ok' ? 'text-ok' : 'text-warn'}`} />
              {d.name}
              {after?.[d.topic] && (
                <Badge tone={after[d.topic].mastered ? 'ok' : 'warn'}>Después del refuerzo: {after[d.topic].mastered ? 'dominado' : 'sigue por repasar'}</Badge>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-fg">{d.reason}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Column title="Temas que dominas" rows={good} tone="ok" />
      <Column title="Temas que debes repasar" rows={bad} tone="warn" />
    </div>
  );
}

/** Resultados: notas con conteo animado, tiempos, revisión de respuestas y diagnóstico. */
export function Results({ session, scored, diagnosis, onRefuerzo, onFinal, saveState, onRetrySave }) {
  const total = (session.finishedAt ?? Date.now()) - session.startedAt;
  const toReview = diagnosis.filter((d) => !d.mastered).length;
  const rows = QUESTIONS.map((qq, i) => {
    const isT = qq.kind === 'theory';
    const r = isT ? scored.theory.results[i] : scored.practice.results[i - scored.theory.results.length];
    const ans = session[isT ? 'theory' : 'practice']?.[qq.id];
    return { n: i + 1, qq, r, ms: ans?.ms ?? 0 };
  });

  return (
    <div className="grid gap-8">
      <header>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">Resultados</p>
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">{session.student.name}</h1>
        <p className="mt-1 flex items-center gap-2 text-muted-fg"><Icon name="clock" /> Tiempo total: {fmtTime(total)}</p>
        {saveState === 'error' && (
          <p className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-bad-bg p-3 text-bad">
            No se pudieron enviar tus resultados. <Button variant="secondary" onClick={onRetrySave}>Reintentar envío</Button>
          </p>
        )}
        {saveState === 'saving' && <p className="mt-3 text-muted-fg">Enviando resultados…</p>}
      </header>

      <motion.div variants={list} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-3">
        <Grade label="Teórica" value={scored.theory.grade} detail={`${scored.theory.ok} de ${scored.theory.total} correctas`} />
        <Grade label="Práctica" value={scored.practice.grade} detail={`${scored.practice.ok} de ${scored.practice.total} correctos`} />
        <Grade label="Global" value={scored.global} detail="Promedio de ambas partes" />
      </motion.div>

      <section aria-labelledby="diag">
        <h2 id="diag" className="mb-4 font-serif text-3xl font-semibold">Diagnóstico</h2>
        <Diagnosis diagnosis={diagnosis} />
      </section>

      <div className="flex flex-wrap gap-3">
        {toReview > 0
          ? <Button onClick={onRefuerzo}><Icon name="book" /> Ir al refuerzo ({toReview} {toReview === 1 ? 'tema' : 'temas'})</Button>
          : <Button onClick={onFinal}>Finalizar <Icon name="right" /></Button>}
        {toReview > 0 && <Button variant="ghost" onClick={onFinal}>Terminar sin refuerzo</Button>}
      </div>

      <Card>
        <h2 className="font-serif text-2xl font-semibold">Revisión de tus respuestas</h2>
        <ol className="mt-4 grid gap-3">
          {rows.map(({ n, qq, r, ms }) => (
            <motion.li layout transition={spring.layout} key={qq.id} className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-accent">{String(n).padStart(2, '0')}</span>
                <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].text}</Badge>
                <span className="text-sm text-muted-fg">{topicName(qq.q.topic)} · {fmtTime(ms)}</span>
              </div>
              {qq.kind === 'practice' && r.status !== 'correct' && r.message && (
                <p className="mt-2 text-sm"><RichText text={r.message} /></p>
              )}
              {qq.kind === 'theory' && r.status !== 'correct' && (
                <p className="mt-2 text-sm"><RichText text={qq.q.explanation} /></p>
              )}
            </motion.li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
