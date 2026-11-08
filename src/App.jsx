import { lazy, Suspense } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { StudentApp } from './pages/StudentApp.jsx';

// El panel (con gráficas) solo se descarga al abrir #/admin.
const Admin = lazy(() => import('./pages/Admin.jsx').then((m) => ({ default: m.Admin })));

/** HashRouter para que funcione en GitHub Pages sin configuración del servidor. */
export default function App() {
  return (
    <HashRouter>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:p-2">Saltar al contenido</a>
      <header className="border-b border-border/70 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-serif text-xl font-bold text-primary">Álgebra <span className="font-mono text-sm font-normal text-accent">P2</span></Link>
          <span className="text-sm text-muted-fg">Portafolio 2</span>
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Routes>
          <Route path="/admin" element={<Suspense fallback={<p className="text-center text-muted-fg">Cargando…</p>}><Admin /></Suspense>} />
          <Route path="*" element={<StudentApp />} />
        </Routes>
      </main>
    </HashRouter>
  );
}
