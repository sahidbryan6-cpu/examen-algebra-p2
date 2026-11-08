/** Guardado automático del avance del alumno en este navegador + datos del dispositivo. */
const KEY = 'examen-p2-sesion-v1';

export function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
export function saveSession(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* modo privado: sigue sin guardar */ }
}
export function clearSession() {
  try { localStorage.removeItem(KEY); } catch { /* nada */ }
}

/** Dispositivo, navegador, idioma y pantalla (sin huellas ni datos personales). */
export function deviceInfo() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Otro';
  const tipo = /iPad|Tablet/i.test(ua) ? 'Tableta' : /Mobi|Android|iPhone/i.test(ua) ? 'Móvil' : 'Escritorio';
  return { tipo, navegador: browser, idioma: navigator.language, pantalla: `${screen.width}×${screen.height}` };
}
