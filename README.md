# Examen de Álgebra · Portafolio 2

Examen interactivo (Vite + React + Tailwind + Motion + KaTeX) con calificación automática por equivalencia algebraica,
diagnóstico por tema, refuerzo paso a paso y panel de administrador (`#/admin`).

> La **parte teórica (12 preguntas)** y el **banco de refuerzo (20 ejercicios)** no venían en el portafolio: los generó Claude.
> La parte práctica y su clave se copiaron del portafolio y se verifican con pruebas automáticas.

## Comandos
| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Verifica las 10 claves, los 20 ejercicios del banco, los errores típicos y la calificación |
| `npm run build` | Genera `dist/` (lo publica GitHub Actions al hacer push a `main`) |
| `node scripts/qa-e2e.mjs <url> <carpeta>` | QA con Playwright: flujo completo a 375/1280 px y con movimiento reducido |

## Activar Firebase (guardar resultados para el administrador)
1. Crea un proyecto en https://console.firebase.google.com (plan gratuito) → Firestore (modo producción) y Authentication → Correo/contraseña.
2. En Authentication crea **un** usuario: el correo del administrador y su contraseña (la contraseña nunca va en el código).
   Luego en *Settings → User actions* desactiva **Enable create (sign-up)**.
3. Pega la configuración web en `src/firebase-config.js` (es pública; la protegen las reglas).
4. En `firestore.rules` reemplaza `__ADMIN_EMAIL__` y publícalas: `npx firebase-tools deploy --only firestore:rules`.
5. Haz push: GitHub Actions publica la nueva versión.

**Reglas:** el alumno solo puede *crear* su intento y sus refuerzos (con datos validados); nadie puede editarlos;
solo el administrador autenticado puede leer, listar y borrar. Todo lo demás está cerrado.

## Cambiar velocidad o estilo de las animaciones
Todo está en `src/lib/motion.js`:
- `dur` — duraciones en segundos (p. ej. `screen: 0.32` → cambio de pantalla).
- `spring.press` — resorte de botones (`bounce` más alto = más rebote).
- `slide` — distancia del deslizamiento entre preguntas (24 px).
- `list` — retraso del escalonado (`stagger(0.05)`).
Con "reducir movimiento" activado en el sistema, Motion quita los desplazamientos automáticamente.

## Estructura
- `src/data/` — examen, refuerzo y glosario (contenido separado del código).
- `src/lib/algebra.js` — lector de expresiones y equivalencia numérica (6+ puntos aleatorios, tolerancia 1e-9).
- `src/lib/grading.js` — calificación, biblioteca de errores comunes y diagnóstico.
- `src/pages/` — pantallas del alumno y panel de administrador.
- `DISEÑO.md` — sistema de diseño (UI UX Pro Max).
