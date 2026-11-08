import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Welcome } from './Welcome.jsx';
import { Exam } from './Exam.jsx';
import { Results } from './Results.jsx';
import { Refuerzo, afterRefuerzo } from './Refuerzo.jsx';
import { Final } from './Final.jsx';
import { clearSession, deviceInfo, loadSession, saveSession } from '../lib/session.js';
import { saveAttempt, saveRefuerzo } from '../lib/backend.js';
import { diagnose, score } from '../lib/grading.js';
import { screen } from '../lib/motion.js';
import { THEORY, PRACTICE } from '../data/exam.js';

/** Construye el registro que verá el administrador. */
function buildRecord(session, scored, diagnosis) {
  return {
    version: 1,
    nombre: session.student.name.slice(0, 120),
    grupo: session.student.group.slice(0, 60),
    inicio: session.startedAt,
    fin: session.finishedAt,
    duracionMs: session.finishedAt - session.startedAt,
    notas: { teorica: scored.theory.grade, practica: scored.practice.grade, global: scored.global },
    teoria: THEORY.map((q, i) => ({
      id: q.id, tema: q.topic, respuesta: session.theory?.[q.id]?.value ?? null, correcta: q.correct,
      estado: scored.theory.results[i].status, ms: session.theory?.[q.id]?.ms ?? 0,
    })),
    practica: PRACTICE.map((ex, i) => ({
      id: ex.id, tema: ex.topic, respuesta: (session.practice?.[ex.id]?.value ?? '').slice(0, 300), correcta: ex.answer,
      estado: scored.practice.results[i].status, error: scored.practice.results[i].errorId ?? null,
      mensaje: scored.practice.results[i].message ?? '', ms: session.practice?.[ex.id]?.ms ?? 0,
    })),
    dominados: diagnosis.filter((d) => d.mastered).map((d) => d.topic),
    repasar: diagnosis.filter((d) => !d.mastered).map((d) => d.topic),
    dispositivo: deviceInfo(),
  };
}

/** Flujo del alumno: bienvenida → examen → resultados → refuerzo → final, con guardado automático. */
export function StudentApp() {
  const [session, setSession] = useState(() => loadSession() ?? { stage: 'welcome' });
  const [saveState, setSaveState] = useState(null);

  const update = useCallback((patch) => setSession((s) => ({ ...s, ...patch })), []);
  useEffect(() => { saveSession(session); }, [session]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [session.stage]);

  const scored = useMemo(() => (session.finishedAt ? score(session.theory ?? {}, session.practice ?? {}) : null), [session.finishedAt, session.theory, session.practice]);
  const diagnosis = useMemo(() => (scored ? diagnose(scored) : null), [scored]);

  const submit = async (s) => {
    setSaveState('saving');
    try {
      const sc = score(s.theory ?? {}, s.practice ?? {});
      const id = await saveAttempt(buildRecord(s, sc, diagnose(sc)));
      update({ attemptId: id });
      setSaveState('ok');
    } catch (err) {
      console.warn('No se pudo guardar el intento:', err?.code ?? err?.message);
      setSaveState('error');
    }
  };

  const finish = (patch) => {
    const next = { ...session, ...patch, finishedAt: Date.now(), stage: 'results' };
    setSession(next);
    submit(next);
  };

  const onRefuerzoResult = async (topic, ex, r) => {
    const refuerzo = { ...session.refuerzo, [ex.id]: { value: r.value, status: r.status, ms: r.ms, topic } };
    update({ refuerzo });
    if (session.attemptId) {
      saveRefuerzo(session.attemptId, { tema: topic, ejercicio: ex.id, respuesta: r.value.slice(0, 300), estado: r.status, error: r.errorId ?? null, ms: r.ms })
        .catch((err) => console.warn('No se pudo guardar el refuerzo:', err?.code ?? err?.message));
    }
  };

  let view;
  switch (session.stage) {
    case 'exam':
      view = <Exam session={session} update={update} onFinish={finish} />;
      break;
    case 'results':
      view = <Results session={session} scored={scored} diagnosis={diagnosis} saveState={saveState} onRetrySave={() => submit(session)}
        onRefuerzo={() => update({ stage: 'refuerzo' })} onFinal={() => update({ stage: 'final' })} />;
      break;
    case 'refuerzo':
      view = <Refuerzo diagnosis={diagnosis} session={session} onResult={onRefuerzoResult} onDone={() => update({ stage: 'final' })} />;
      break;
    case 'final':
      view = <Final session={session} scored={scored} diagnosis={diagnosis} after={afterRefuerzo(diagnosis, session.refuerzo)}
        onRestart={() => { clearSession(); setSession({ stage: 'welcome' }); }} />;
      break;
    default:
      view = <Welcome onStart={(student) => update({ stage: 'exam', student, startedAt: Date.now(), index: 0, theory: {}, practice: {}, refuerzo: {} })} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={session.stage} {...screen}>{view}</motion.div>
    </AnimatePresence>
  );
}
