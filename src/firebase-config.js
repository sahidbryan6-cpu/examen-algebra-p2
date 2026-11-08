/**
 * Configuración web de Firebase (es pública: la protegen las reglas de Firestore).
 * Mientras sea null, la app funciona en "modo local": guarda en este navegador.
 * Para activarla, pega aquí el objeto de Consola Firebase → Configuración del proyecto → Tus apps → SDK.
 */
export const firebaseConfig = null;

/** UID del administrador (Authentication → Usuarios). Lo usan las reglas, no el cliente. */
export const ADMIN_EMAIL = '';
