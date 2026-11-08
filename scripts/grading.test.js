import test from 'node:test';
import assert from 'node:assert/strict';
import { gradePractice, score, diagnose, UNREADABLE_MSG } from '../src/lib/grading.js';
import { PRACTICE, THEORY } from '../src/data/exam.js';

const p = (id) => PRACTICE.find((e) => e.id === id);

test('estados de gradePractice', () => {
  assert.equal(gradePractice(p('p1'), '').status, 'empty');
  const u = gradePractice(p('p1'), '(8x^3-7x^2');
  assert.equal(u.status, 'unreadable');
  assert.equal(u.message, UNREADABLE_MSG);
  assert.equal(gradePractice(p('p5'), '9x⁶ − 54x³ + 81').status, 'correct');
  const e5 = gradePractice(p('p5'), '9x^6+81');
  assert.equal(e5.status, 'incorrect');
  assert.match(e5.message, /doble producto/);
  assert.match(gradePractice(p('p2'), '7x^3+2x^2-2').message, /todos los signos/);
  assert.match(gradePractice(p('p6'), '36x^(4n)+36x^(2n)y^(3a)-9y^(6a)').message, /término central/);
  assert.match(gradePractice(p('p8'), '27x^6-64y^3').message, /intermedios/);
  assert.match(gradePractice(p('p9'), '4y^5-10y^3-4').message, /factorizada/);
  assert.equal(gradePractice(p('p1'), '8x^3-7x^2+11x+5+0x').status, 'incorrect');
});

test('score y diagnose: todo bien → todos dominados', () => {
  const th = Object.fromEntries(THEORY.map((q) => [q.id, { value: q.correct }]));
  const pr = Object.fromEntries(PRACTICE.map((e) => [e.id, { value: e.answer }]));
  const s = score(th, pr);
  assert.equal(s.global, 10);
  assert.ok(diagnose(s).every((d) => d.mastered));
});

test('diagnose: falla práctica de t5 → t5 por repasar', () => {
  const th = Object.fromEntries(THEORY.map((q) => [q.id, { value: q.correct }]));
  const pr = Object.fromEntries(PRACTICE.map((e) => [e.id, { value: e.answer }]));
  pr.p5 = { value: '9x^6+81' };
  const d = diagnose(score(th, pr));
  const t5 = d.find((x) => x.topic === 't5');
  assert.equal(t5.mastered, false);
  assert.match(t5.reason, /fallaste/);
});
