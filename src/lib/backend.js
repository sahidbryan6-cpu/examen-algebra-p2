/**
 * Persistencia de resultados.
 * - Con firebaseConfig: Firestore (el alumno solo CREA; el admin autenticado lee/lista/borra).
 * - Sin firebaseConfig: modo local (localStorage de este navegador), útil para pruebas.
 * Firebase se carga con import() dinámico para no pesar cuando no se usa.
 */
import { firebaseConfig } from '../firebase-config.js';

export const isRemote = Boolean(firebaseConfig);
const LOCAL_KEY = 'examen-p2-registros';

let fb = null;
async function firebase() {
  if (fb) return fb;
  const [{ initializeApp }, fs, auth] = await Promise.all([
    import('firebase/app'), import('firebase/firestore'), import('firebase/auth'),
  ]);
  const app = initializeApp(firebaseConfig);
  fb = { fs, auth, db: fs.getFirestore(app), au: auth.getAuth(app) };
  return fb;
}

const readLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? []; } catch { return []; } };
const writeLocal = (rows) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(rows)); } catch { /* sin almacenamiento */ } };
const listeners = new Set();
const notify = () => listeners.forEach((cb) => cb(readLocal()));

/** Guarda el intento completo. Devuelve su id. */
export async function saveAttempt(data) {
  if (isRemote) {
    const { fs, db } = await firebase();
    const ref = await fs.addDoc(fs.collection(db, 'intentos'), { ...data, creado: fs.serverTimestamp() });
    return ref.id;
  }
  const id = `local-${Date.now().toString(36)}`;
  writeLocal([...readLocal(), { ...data, id, creado: Date.now(), refuerzos: [] }]);
  notify();
  return id;
}

/** Guarda un intento de refuerzo como documento nuevo (el alumno no puede editar el intento). */
export async function saveRefuerzo(attemptId, data) {
  if (isRemote) {
    const { fs, db } = await firebase();
    await fs.addDoc(fs.collection(db, 'intentos', attemptId, 'refuerzos'), { ...data, creado: fs.serverTimestamp() });
    return;
  }
  writeLocal(readLocal().map((r) => (r.id === attemptId ? { ...r, refuerzos: [...(r.refuerzos ?? []), { ...data, creado: Date.now() }] } : r)));
  notify();
}

/* ---------- Administrador ---------- */

export async function onAdminAuth(cb) {
  if (!isRemote) { cb({ local: true }); return () => {}; }
  const { auth, au } = await firebase();
  return auth.onAuthStateChanged(au, (user) => cb(user ? { email: user.email } : null));
}

export async function adminSignIn(email, password) {
  const { auth, au } = await firebase();
  await auth.signInWithEmailAndPassword(au, email, password);
}

export async function adminSignOut() {
  if (!isRemote) return;
  const { auth, au } = await firebase();
  await auth.signOut(au);
}

/** Suscripción en tiempo real a todos los intentos (con sus refuerzos). */
export async function subscribeAttempts(cb, onError) {
  if (!isRemote) {
    listeners.add(cb);
    cb(readLocal());
    const onStorage = (e) => { if (e.key === LOCAL_KEY) cb(readLocal()); };
    window.addEventListener('storage', onStorage);
    return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage); };
  }
  const { fs, db } = await firebase();
  const q = fs.query(fs.collection(db, 'intentos'), fs.orderBy('creado', 'desc'));
  return fs.onSnapshot(q, async (snap) => {
    const rows = await Promise.all(snap.docs.map(async (d) => {
      const refs = await fs.getDocs(fs.collection(db, 'intentos', d.id, 'refuerzos'));
      const data = d.data();
      return { ...data, id: d.id, creado: data.creado?.toMillis?.() ?? null, refuerzos: refs.docs.map((r) => r.data()) };
    }));
    cb(rows);
  }, onError);
}

export async function deleteAttempt(id) {
  if (!isRemote) { writeLocal(readLocal().filter((r) => r.id !== id)); notify(); return; }
  const { fs, db } = await firebase();
  const refs = await fs.getDocs(fs.collection(db, 'intentos', id, 'refuerzos'));
  await Promise.all(refs.docs.map((r) => fs.deleteDoc(r.ref)));
  await fs.deleteDoc(fs.doc(db, 'intentos', id));
}
