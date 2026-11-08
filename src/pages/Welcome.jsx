import { useState } from 'react';
import { motion } from 'motion/react';
import { Button, Card, Icon } from '../components/ui.jsx';
import { item, list } from '../lib/motion.js';
import { TOPICS, THEORY, PRACTICE } from '../data/exam.js';
import { isRemote } from '../lib/backend.js';

/** Bienvenida: nombre obligatorio (mín. 3 caracteres), grupo opcional y aviso de privacidad. */
export function Welcome({ onStart }) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = name.trim().length >= 3;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (valid) onStart({ name: name.trim(), group: group.trim() });
  };

  return (
    <motion.div variants={list} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <motion.header variants={item} className="pt-2">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">Portafolio 2 · Álgebra</p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-[1.05] text-primary sm:text-6xl">
          Polinomios, productos notables y factorización
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted-fg">
          {THEORY.length} preguntas teóricas y {PRACTICE.length} ejercicios prácticos. Al terminar verás tu diagnóstico por tema
          y un refuerzo paso a paso de lo que necesites repasar.
        </p>
        <motion.ul variants={list} className="mt-6 hidden flex-wrap gap-2 sm:flex" aria-label="Temas del examen">
          {TOPICS.map((t, i) => (
            <motion.li variants={item} key={t.id} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
              <span className="font-mono text-accent">{String(i + 1).padStart(2, '0')}</span> {t.name}
            </motion.li>
          ))}
        </motion.ul>
      </motion.header>

      <Card variants={item}>
        <form onSubmit={submit} noValidate className="grid gap-4">
          <h2 className="font-serif text-2xl font-semibold">Antes de empezar</h2>
          <div>
            <label htmlFor="nombre" className="mb-1 block font-bold">Nombre completo <span className="text-bad" aria-hidden="true">*</span></label>
            <input id="nombre" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)}
              autoComplete="name" required minLength={3} aria-invalid={touched && !valid} aria-describedby="nombre-error"
              className="min-h-12 w-full rounded-xl border border-border bg-bg px-4 text-[17px] focus:border-ring focus:outline-none" />
            {touched && !valid && <p id="nombre-error" className="mt-1 text-sm text-bad">Escribe tu nombre completo (mínimo 3 caracteres).</p>}
          </div>
          <div>
            <label htmlFor="grupo" className="mb-1 block font-bold">Grupo <span className="font-normal text-muted-fg">(opcional)</span></label>
            <input id="grupo" value={group} onChange={(e) => setGroup(e.target.value)} autoComplete="off"
              className="min-h-12 w-full rounded-xl border border-border bg-bg px-4 text-[17px] focus:border-ring focus:outline-none" />
          </div>
          <p className="flex gap-2 rounded-xl bg-warn-bg p-3 text-sm text-fg" role="note">
            <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
            Tus respuestas y resultados serán visibles para el administrador.
          </p>
          <p className="text-sm text-muted-fg">Tu avance se guarda solo en este dispositivo mientras respondes: si cierras la página, podrás continuar.</p>
          {!isRemote && (
            <p className="rounded-xl bg-bad-bg p-3 text-sm text-bad" role="note">
              Modo de prueba: los resultados todavía no se envían al profesor.
            </p>
          )}
          <Button type="submit" className="w-full">Comenzar examen <Icon name="right" /></Button>
        </form>
      </Card>
    </motion.div>
  );
}
