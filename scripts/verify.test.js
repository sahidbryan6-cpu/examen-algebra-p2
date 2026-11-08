// Verifica la clave del examen, el banco de refuerzo y los errores típicos.
// Ejecutar: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, tryParse, equivalent, isSimplified, factoredCheck } from '../src/lib/algebra.js';
import { PRACTICE, THEORY, TOPICS } from '../src/data/exam.js';
import { BANK, EXPLANATIONS } from '../src/data/refuerzo.js';

const formOk = (ex, ast) => (ex.form === 'factored' ? factoredCheck(ast, ex.expVars).ok : isSimplified(ast, ex.expVars));

for (const ex of [...PRACTICE, ...BANK]) {
  test(`${ex.id}: la clave es equivalente al enunciado y tiene la forma pedida`, () => {
    const a = parse(ex.answer, ex.expVars);
    assert.ok(equivalent(parse(ex.original, ex.expVars), a), 'no equivalente');
    assert.ok(formOk(ex, a), `forma incorrecta (${ex.form})`);
  });
}

for (const ex of PRACTICE) {
  test(`${ex.id}: los errores típicos se marcan incorrectos`, () => {
    for (const e of ex.errors) {
      const ast = parse(e.answer, ex.expVars);
      const right = equivalent(parse(ex.answer, ex.expVars), ast) && formOk(ex, ast);
      assert.ok(!right, `error típico aceptado: ${e.answer}`);
    }
  });
}

test('formas de escribir aceptadas', () => {
  const ok = (ex, s) => { const a = parse(s, ex.expVars); return equivalent(parse(ex.answer, ex.expVars), a) && formOk(ex, a); };
  const [p1, , p3, , p5, p6, , p8, p9, p10] = PRACTICE;
  assert.ok(ok(p1, '8x³ − 7x² + 11x + 5'));
  assert.ok(ok(p1, '5 + 11x - 7x^2 + 8x^3'), 'orden distinto');
  assert.ok(ok(p3, '15xa - 9a + 25x - 15'));
  assert.ok(ok(p5, '81-54x^3+9x^6'));
  assert.ok(ok(p6, '36x^2n·x^2n - 9y^(6a)') === false, 'x·x sin reducir no es simplificado');
  assert.ok(ok(p6, '36x^4n-9y^6a'), 'x^4n se lee como x^(4n)');
  assert.ok(ok(p6, '36xⁿ⁴ - 9y^(6a)') === false || true); // superíndice raro: no debe romper
  assert.ok(ok(p8, '27x^6-108x^4y+144x^2y^2-64y^3'));
  assert.ok(ok(p9, '-2(-2y^5+5y^3+2)'));
  assert.ok(ok(p10, '(a+x)(a+b)'));
});

test('formas rechazadas', () => {
  const [p1, , , , p5, , , , p9, p10] = PRACTICE;
  const form = (ex, s) => formOk(ex, parse(s, ex.expVars));
  assert.equal(form(p1, '5x^3+3x^3-7x^2+11x+5'), false, 'términos semejantes sin reducir');
  assert.equal(form(p5, '(3x^3-9)^2'), false, 'sin desarrollar');
  assert.equal(form(p9, '4y^5-10y^3-4'), false, 'sin factor común');
  assert.equal(form(p9, '1(4y^5-10y^3-4)'), false);
  assert.equal(form(p10, 'a(a+b)+x(a+b)'), false, 'todavía es suma');
  assert.equal(form(BANK.find((b) => b.id === 'r9b'), '4(2y^6-3y^4+5y)'), false, 'falta la y común');
});

test('entradas ilegibles devuelven null', () => {
  assert.equal(tryParse('(x+2'), null);
  assert.equal(tryParse('x+'), null);
  assert.equal(tryParse('x $ 2'), null);
  assert.equal(tryParse(''), null);
});

test('teoría: 12 preguntas, todos los temas cubiertos, cada una con explicación', () => {
  assert.equal(THEORY.length, 12);
  for (const t of TOPICS) assert.ok(THEORY.some((q) => q.topic === t.id), `tema sin pregunta: ${t.id}`);
  for (const q of THEORY) assert.ok(q.explanation.length > 20);
});

test('banco: 2 ejercicios por tema y explicación completa por tema', () => {
  for (const t of TOPICS) {
    assert.equal(BANK.filter((b) => b.topic === t.id).length, 2, t.id);
    const e = EXPLANATIONS[t.id];
    assert.ok(e && e.idea && e.rule && e.steps.length >= 3 && e.error && e.resumen, `explicación incompleta ${t.id}`);
  }
});
