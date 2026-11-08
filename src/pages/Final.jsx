import { motion } from 'motion/react';
import { Badge, Button, Card, CountUp } from '../components/ui.jsx';
import { item, list } from '../lib/motion.js';

/** Pantalla final: nota global y tabla antes/después por tema. */
export function Final({ session, scored, diagnosis, after, onRestart }) {
  return (
    <motion.div variants={list} initial="hidden" animate="show" className="mx-auto grid max-w-3xl gap-6">
      <motion.header variants={item} className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">Examen terminado</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-primary sm:text-5xl">Gracias, {session.student.name.split(' ')[0]}</h1>
        <p className="mt-3 font-serif text-6xl font-bold"><CountUp to={scored.global} /><span className="text-3xl text-muted-fg">/10</span></p>
        <p className="text-muted-fg">Tus resultados ya están registrados.</p>
      </motion.header>
      <Card variants={item}>
        <h2 className="font-serif text-2xl font-semibold">Antes y después del refuerzo</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-border text-muted-fg"><th className="py-2 pr-2">Tema</th><th className="py-2 pr-2">Antes</th><th className="py-2">Después</th></tr></thead>
            <tbody>
              {diagnosis.map((d) => (
                <tr key={d.topic} className="border-b border-border/60">
                  <td className="py-2 pr-2 font-bold">{d.name}</td>
                  <td className="py-2 pr-2"><Badge tone={d.mastered ? 'ok' : 'warn'}>{d.mastered ? 'Dominado' : 'Por repasar'}</Badge></td>
                  <td className="py-2">
                    {d.mastered ? <span className="text-muted-fg">—</span>
                      : after[d.topic] ? <Badge tone={after[d.topic].mastered ? 'ok' : 'warn'}>{after[d.topic].mastered ? 'Dominado' : 'Sigue por repasar'}</Badge>
                        : <span className="text-muted-fg">Sin refuerzo</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <motion.div variants={item} className="flex justify-center">
        <Button variant="secondary" onClick={onRestart}>Salir y borrar mi avance de este dispositivo</Button>
      </motion.div>
    </motion.div>
  );
}
