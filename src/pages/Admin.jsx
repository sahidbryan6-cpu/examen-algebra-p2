import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Badge, Button, Card, Dialog, Icon, fmtTime } from '../components/ui.jsx';
import { adminSignIn, adminSignOut, deleteAttempt, isRemote, onAdminAuth, subscribeAttempts } from '../lib/backend.js';
import { PRACTICE, THEORY, TOPICS, topicName } from '../data/exam.js';
import { item, list, spring } from '../lib/motion.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const fmtDate = (ms) => (ms ? new Date(ms).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—');

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await adminSignIn(email, password); } catch { setError('Correo o contraseña incorrectos.'); } finally { setBusy(false); }
  };
  return (
    <Card className="mx-auto max-w-md">
      <h1 className="flex items-center gap-2 font-serif text-3xl font-semibold"><Icon name="lock" /> Panel del administrador</h1>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <label className="grid gap-1 font-bold">Correo<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username"
          className="min-h-12 rounded-xl border border-border bg-bg px-4 font-normal focus:border-ring focus:outline-none" /></label>
        <label className="grid gap-1 font-bold">Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
          className="min-h-12 rounded-xl border border-border bg-bg px-4 font-normal focus:border-ring focus:outline-none" /></label>
        {error && <p role="alert" className="text-bad">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</Button>
      </form>
    </Card>
  );
}

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

function toCSV(rows) {
  const head = ['nombre', 'grupo', 'inicio', 'fin', 'duracion_min', 'teorica', 'practica', 'global', 'intentos', 'dispositivo', 'navegador', 'idioma', 'pantalla', 'dominados', 'repasar'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [r.nombre, r.grupo, fmtDate(r.inicio), fmtDate(r.fin), (r.duracionMs / 60000).toFixed(1), r.notas?.teorica, r.notas?.practica, r.notas?.global,
    r.intentos, r.dispositivo?.tipo, r.dispositivo?.navegador, r.dispositivo?.idioma, r.dispositivo?.pantalla, (r.dominados ?? []).join(' '), (r.repasar ?? []).join(' ')].map(esc).join(','));
  return [head.join(','), ...lines].join('\n');
}

function Stats({ rows }) {
  const ink = css('--muted-fg'); const bar = css('--primary'); const accent = css('--accent');
  const opts = (max) => ({
    responsive: true, maintainAspectRatio: false, animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 400 },
    scales: { x: { ticks: { color: ink } }, y: { ticks: { color: ink, precision: 0 }, beginAtZero: true, max } },
    plugins: { tooltip: { enabled: true } },
  });
  const perEx = PRACTICE.map((ex) => rows.filter((r) => r.practica?.find((p) => p.id === ex.id)?.estado === 'correct').length);
  const pct = perEx.map((n) => (rows.length ? Math.round((n / rows.length) * 100) : 0));
  const weak = TOPICS.map((t) => ({ name: t.name, n: rows.filter((r) => r.repasar?.includes(t.id)).length })).sort((a, b) => b.n - a.n);
  const bins = Array.from({ length: 5 }, (_, i) => rows.filter((r) => Math.min(4, Math.floor((r.notas?.global ?? 0) / 2)) === i).length);
  return (
    <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 lg:grid-cols-3">
      <Card variants={item}>
        <h3 className="font-serif text-xl font-semibold">Aciertos por ejercicio (%)</h3>
        <div className="mt-2 h-56"><Bar options={opts(100)} data={{ labels: PRACTICE.map((_, i) => `E${i + 1}`), datasets: [{ label: '% de aciertos', data: pct, backgroundColor: bar, borderRadius: 4 }] }} /></div>
      </Card>
      <Card variants={item}>
        <h3 className="font-serif text-xl font-semibold">Temas más débiles</h3>
        <ol className="mt-3 grid gap-1 text-sm">
          {weak.slice(0, 5).map((w) => <li key={w.name} className="flex justify-between gap-2"><span>{w.name}</span><Badge tone={w.n ? 'warn' : 'muted'}>{w.n} por repasar</Badge></li>)}
        </ol>
      </Card>
      <Card variants={item}>
        <h3 className="font-serif text-xl font-semibold">Distribución de notas</h3>
        <div className="mt-2 h-56"><Bar options={opts()} data={{ labels: ['0–2', '2–4', '4–6', '6–8', '8–10'], datasets: [{ label: 'Alumnos', data: bins, backgroundColor: accent, borderRadius: 4 }] }} /></div>
      </Card>
    </motion.div>
  );
}

function Detail({ r, onClose }) {
  const name = (id) => topicName(id);
  return (
    <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={spring.layout}
      className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl overflow-y-auto border-l border-border bg-card p-5 shadow-card" aria-label={`Detalle de ${r.nombre}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-semibold">{r.nombre}</h2>
          <p className="text-sm text-muted-fg">{r.grupo || 'Sin grupo'} · {fmtDate(r.inicio)} · {fmtTime(r.duracionMs)}</p>
        </div>
        <Button variant="secondary" onClick={onClose} aria-label="Cerrar detalle"><Icon name="x" /></Button>
      </div>
      <p className="mt-3 flex flex-wrap gap-2">
        <Badge tone="primary">Teórica {r.notas?.teorica}</Badge><Badge tone="primary">Práctica {r.notas?.practica}</Badge><Badge tone="primary">Global {r.notas?.global}</Badge>
      </p>
      <h3 className="mt-5 font-serif text-xl font-semibold">Temas</h3>
      <p className="mt-1 text-sm"><strong className="text-ok">Dominados:</strong> {(r.dominados ?? []).map(name).join(', ') || '—'}</p>
      <p className="text-sm"><strong className="text-warn">Por repasar:</strong> {(r.repasar ?? []).map(name).join(', ') || '—'}</p>
      <h3 className="mt-5 font-serif text-xl font-semibold">Práctica</h3>
      <div className="overflow-x-auto">
        <table className="mt-2 w-full text-left text-sm">
          <thead><tr className="text-muted-fg"><th className="pr-2">#</th><th className="pr-2">Escribió</th><th className="pr-2">Correcta</th><th className="pr-2">Estado</th><th className="pr-2">Error</th><th>Tiempo</th></tr></thead>
          <tbody>{(r.practica ?? []).map((p, i) => (
            <tr key={p.id} className="border-t border-border/60 align-top">
              <td className="py-1 pr-2">{i + 1}</td><td className="py-1 pr-2 font-mono">{p.respuesta || '—'}</td><td className="py-1 pr-2 font-mono">{p.correcta}</td>
              <td className="py-1 pr-2"><Badge tone={p.estado === 'correct' ? 'ok' : 'bad'}>{p.estado === 'correct' ? 'Bien' : p.estado === 'empty' ? 'Vacío' : 'Mal'}</Badge></td>
              <td className="py-1 pr-2">{p.estado !== 'correct' ? p.mensaje?.replace(/\$|\[\[|\]\]/g, '') : ''}</td><td className="py-1">{fmtTime(p.ms)}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <h3 className="mt-5 font-serif text-xl font-semibold">Teoría</h3>
      <ul className="mt-2 grid gap-1 text-sm">{(r.teoria ?? []).map((t, i) => {
        const q = THEORY.find((x) => x.id === t.id);
        const show = (v) => (v === null || v === undefined ? '—' : q?.type === 'tf' ? (v ? 'Verdadero' : 'Falso') : String.fromCharCode(65 + v));
        return <li key={t.id} className="flex flex-wrap gap-2"><span className="w-6">{i + 1}.</span>Respondió {show(t.respuesta)} · correcta {show(t.correcta)} <Badge tone={t.estado === 'correct' ? 'ok' : 'bad'}>{t.estado === 'correct' ? 'Bien' : 'Mal'}</Badge> {fmtTime(t.ms)}</li>;
      })}</ul>
      <h3 className="mt-5 font-serif text-xl font-semibold">Refuerzo</h3>
      {(r.refuerzos ?? []).length === 0 ? <p className="text-sm text-muted-fg">Sin intentos de refuerzo.</p> : (
        <ul className="mt-2 grid gap-1 text-sm">{r.refuerzos.map((f, i) => (
          <li key={i}>{name(f.tema)} · {f.ejercicio} · <span className="font-mono">{f.respuesta}</span> <Badge tone={f.estado === 'correct' ? 'ok' : 'bad'}>{f.estado === 'correct' ? 'Bien' : 'Mal'}</Badge></li>
        ))}</ul>
      )}
    </motion.aside>
  );
}

/** Panel del administrador (#/admin): requiere inicio de sesión con Firebase Authentication. */
export function Admin() {
  const [user, setUser] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('');
  const [sort, setSort] = useState({ key: 'inicio', dir: -1 });
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { let off = () => {}; onAdminAuth(setUser).then((f) => { off = f; }); return () => off(); }, []);
  useEffect(() => {
    if (!user) return undefined;
    let off = () => {};
    subscribeAttempts(setRows, (e) => setError(e?.code === 'permission-denied' ? 'Tu cuenta no tiene permiso de administrador.' : 'No se pudieron leer los datos.')).then((f) => { off = f; });
    return () => off();
  }, [user]);

  const withAttempts = useMemo(() => {
    const count = {};
    rows.forEach((r) => { const k = r.nombre?.toLowerCase().trim(); count[k] = (count[k] ?? 0) + 1; });
    return rows.map((r) => ({ ...r, intentos: count[r.nombre?.toLowerCase().trim()] }));
  }, [rows]);
  const groups = [...new Set(withAttempts.map((r) => r.grupo).filter(Boolean))].sort();
  const view = useMemo(() => {
    const get = (r) => (sort.key === 'global' ? r.notas?.global : sort.key === 'nombre' ? r.nombre?.toLowerCase() : sort.key === 'duracion' ? r.duracionMs : r.inicio);
    return withAttempts
      .filter((r) => (!q || r.nombre?.toLowerCase().includes(q.toLowerCase())) && (!group || r.grupo === group))
      .sort((a, b) => (get(a) > get(b) ? 1 : get(a) < get(b) ? -1 : 0) * sort.dir);
  }, [withAttempts, q, group, sort]);

  if (user === undefined) return <p className="text-center text-muted-fg">Cargando…</p>;
  if (!user) return <Login />;

  const th = (key, label) => (
    <th className="py-2 pr-3"><button className="min-h-11 font-bold hover:text-primary" onClick={() => setSort((s) => ({ key, dir: s.key === key ? -s.dir : -1 }))}>
      {label}{sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}</button></th>
  );

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">Administrador</p>
          <h1 className="font-serif text-4xl font-bold text-primary">Resultados del grupo</h1>
          <p className="text-muted-fg">{withAttempts.length} registros · se actualiza en tiempo real</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => download('resultados.csv', toCSV(view), 'text/csv;charset=utf-8')}>Exportar CSV</Button>
          <Button variant="secondary" onClick={() => download('resultados.json', JSON.stringify(view, null, 2), 'application/json')}>Exportar JSON</Button>
          {isRemote && <Button variant="ghost" onClick={adminSignOut}>Cerrar sesión</Button>}
        </div>
      </header>
      {!isRemote && <p className="rounded-xl bg-warn-bg p-3 text-sm">Modo local: Firebase aún no está configurado. Solo ves los intentos hechos en este navegador.</p>}
      {error && <p role="alert" className="rounded-xl bg-bad-bg p-3 text-bad">{error}</p>}

      <Stats rows={withAttempts} />

      <Card>
        <div className="flex flex-wrap gap-3">
          <input type="search" placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar por nombre"
            className="min-h-11 flex-1 rounded-xl border border-border bg-bg px-4 focus:border-ring focus:outline-none" />
          <select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Filtrar por grupo" className="min-h-11 rounded-xl border border-border bg-bg px-3">
            <option value="">Todos los grupos</option>{groups.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead><tr className="border-b border-border text-muted-fg">
              {th('nombre', 'Nombre')}<th className="pr-3">Grupo</th>{th('inicio', 'Inicio')}<th className="pr-3">Fin</th>{th('duracion', 'Duración')}
              <th className="pr-3">Teo.</th><th className="pr-3">Prác.</th>{th('global', 'Global')}<th className="pr-3">Intentos</th><th className="pr-3">Dispositivo</th><th className="pr-3">Idioma</th><th className="pr-3">Pantalla</th><th />
            </tr></thead>
            <LayoutGroup>
              <tbody>
                <AnimatePresence initial={false}>
                  {view.map((r) => (
                    <motion.tr layout transition={spring.layout} key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-border/60">
                      <td className="py-2 pr-3"><button className="min-h-11 text-left font-bold text-primary underline-offset-4 hover:underline" onClick={() => setSelected(r)}>{r.nombre}</button></td>
                      <td className="pr-3">{r.grupo || '—'}</td><td className="pr-3">{fmtDate(r.inicio)}</td><td className="pr-3">{fmtDate(r.fin)}</td><td className="pr-3">{fmtTime(r.duracionMs)}</td>
                      <td className="pr-3">{r.notas?.teorica}</td><td className="pr-3">{r.notas?.practica}</td><td className="pr-3 font-bold">{r.notas?.global}</td><td className="pr-3">{r.intentos}</td>
                      <td className="pr-3">{r.dispositivo?.tipo} · {r.dispositivo?.navegador}</td><td className="pr-3">{r.dispositivo?.idioma}</td><td className="pr-3">{r.dispositivo?.pantalla}</td>
                      <td><Button variant="ghost" onClick={() => setToDelete(r)} aria-label={`Borrar ${r.nombre}`}><Icon name="x" /></Button></td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </LayoutGroup>
          </table>
          {view.length === 0 && <p className="py-6 text-center text-muted-fg">Todavía no hay registros.</p>}
        </div>
      </Card>

      <AnimatePresence>{selected && <Detail r={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      <AnimatePresence>
        {toDelete && (
          <Dialog open title="¿Borrar este registro?" onClose={() => setToDelete(null)}>
            <p>Se borrará el intento de <strong>{toDelete.nombre}</strong> y sus refuerzos. No se puede deshacer.</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setToDelete(null)} autoFocus>Cancelar</Button>
              <Button variant="danger" onClick={async () => { await deleteAttempt(toDelete.id); setToDelete(null); setSelected(null); }}>Borrar</Button>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
