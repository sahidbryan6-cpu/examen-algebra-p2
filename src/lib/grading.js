/**
 * Calificación del examen. JS puro (se prueba con node --test).
 * Estados de una respuesta práctica:
 *   empty      → sin responder
 *   unreadable → no se pudo leer (NO cuenta como error, se pide corregir)
 *   correct    → equivalente y con la forma pedida
 *   incorrect  → no equivalente, o equivalente sin simplificar/factorizar
 */
import { tryParse, equivalent, isSimplified, factoredCheck } from './algebra.js';
import { TOPICS, THEORY, PRACTICE } from '../data/exam.js';

export const UNREADABLE_MSG = 'No pude leer tu respuesta, revisa los paréntesis.';

const FACTOR_REASONS = {
  'no-producto': 'Es equivalente, pero no está factorizada: debe quedar como producto de factores.',
  'factor-trivial': 'Multiplicar por 1 no es factorizar. Busca el factor común real.',
  'no-enteros': 'Es equivalente, pero usa coeficientes enteros dentro del paréntesis.',
  'falta-factor-comun': 'Es equivalente, pero dentro del paréntesis todavía queda un factor común por sacar.',
};

export function gradePractice(ex, input) {
  if (!input || !input.trim()) return { status: 'empty', message: 'Sin responder.' };
  const ast = tryParse(input, ex.expVars);
  if (!ast) return { status: 'unreadable', message: UNREADABLE_MSG };
  const expected = tryParse(ex.answer, ex.expVars);
  let same = false;
  try { same = equivalent(expected, ast); } catch { same = false; }

  if (same) {
    if (ex.form === 'factored') {
      const check = factoredCheck(ast, ex.expVars);
      if (!check.ok) return { status: 'incorrect', message: FACTOR_REASONS[check.reason], errorId: check.reason };
    } else if (!isSimplified(ast, ex.expVars)) {
      return {
        status: 'incorrect', errorId: 'no-simplificada',
        message: 'Es equivalente, pero no está simplificada: quita paréntesis y reduce los términos semejantes.',
      };
    }
    return { status: 'correct', message: '¡Correcto!' };
  }

  // Biblioteca de errores comunes del ejercicio
  for (const [i, e] of (ex.errors ?? []).entries()) {
    const known = tryParse(e.answer, ex.expVars);
    try { if (known && equivalent(known, ast)) return { status: 'incorrect', message: e.msg, errorId: `e${i}` }; } catch { /* sigue */ }
  }
  return { status: 'incorrect', message: ex.hint ? `No es equivalente al resultado. Pista: ${ex.hint}` : 'No es equivalente al resultado.', errorId: 'otro' };
}

export function gradeTheory(q, answer) {
  if (answer === undefined || answer === null) return { status: 'empty' };
  return { status: answer === q.correct ? 'correct' : 'incorrect' };
}

/** Puntajes sobre 10 y por sección. */
export function score(theoryAnswers, practiceInputs) {
  const t = THEORY.map((q) => gradeTheory(q, theoryAnswers[q.id]?.value));
  const p = PRACTICE.map((ex) => gradePractice(ex, practiceInputs[ex.id]?.value ?? ''));
  const tOk = t.filter((r) => r.status === 'correct').length;
  const pOk = p.filter((r) => r.status === 'correct').length;
  const round = (n) => Math.round(n * 10) / 10;
  return {
    theory: { ok: tOk, total: THEORY.length, grade: round((tOk / THEORY.length) * 10), results: t },
    practice: { ok: pOk, total: PRACTICE.length, grade: round((pOk / PRACTICE.length) * 10), results: p },
    global: round(((tOk + pOk) / (THEORY.length + PRACTICE.length)) * 10),
  };
}

/**
 * Tema dominado = acierta su ejercicio práctico y al menos la mitad de sus preguntas teóricas.
 * Devuelve [{ topic, name, mastered, reason, practiceOk, theoryOk, theoryTotal }].
 */
export function diagnose(scored) {
  return TOPICS.map((t) => {
    const pIdx = PRACTICE.findIndex((ex) => ex.topic === t.id);
    const pRes = scored.practice.results[pIdx];
    const qs = THEORY.map((q, i) => ({ q, r: scored.theory.results[i] })).filter(({ q }) => q.topic === t.id);
    const theoryOk = qs.filter(({ r }) => r.status === 'correct').length;
    const practiceOk = pRes.status === 'correct';
    const mastered = practiceOk && theoryOk >= qs.length / 2;
    const reasons = [];
    if (!practiceOk) reasons.push(pRes.status === 'empty' || pRes.status === 'unreadable' ? 'no respondiste el ejercicio práctico' : 'fallaste el ejercicio práctico');
    const preg = qs.length === 1 ? 'pregunta teórica' : 'preguntas teóricas';
    if (theoryOk < qs.length / 2) reasons.push(`acertaste ${theoryOk} de ${qs.length} ${preg}`);
    const reason = mastered
      ? `Resolviste el ejercicio y acertaste ${theoryOk} de ${qs.length} ${preg}.`
      : `Por repasar: ${reasons.join(' y ')}.`;
    return { topic: t.id, name: t.name, mastered, reason, practiceOk, theoryOk, theoryTotal: qs.length, practiceMessage: pRes.message };
  });
}
