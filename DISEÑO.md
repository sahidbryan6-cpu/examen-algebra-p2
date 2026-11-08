# DISEÑO.md — Sistema de diseño del examen

Generado con **UI UX Pro Max 2.13.0** (`--design-system`, consulta "university academic assessment editorial"; la primera consulta proponía un estilo infantil —Comic Neue— y se descartó por no encajar con "sobria").

## Estilo
Swiss Modernism 2.0 aplicado a una plataforma educativa: retícula clara, jerarquía tipográfica fuerte, color con intención.
Carácter propio: **fondo de papel cuadriculado** (24 px) como cuaderno de matemáticas, numeración en monoespaciada color ocre.

## Paleta (tokens en `src/index.css`, modo claro/oscuro automático)
| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--primary` | #1E3A5F | #93B7EA | Títulos, botón principal |
| `--accent` | #A16207 | #E0A73A | Numeración, progreso, subrayado del glosario |
| `--bg` / `--card` | #F6F7F9 / #FFFFFF | #0B1220 / #111A2E | Fondo / superficies |
| `--fg` / `--muted-fg` | #0F172A / #475569 | #E5ECF5 / #A3B3C9 | Texto / secundario (AA ≥ 4.5:1) |
| `--ok` / `--warn` / `--bad` | #15803D / #C2410C / #B91C1C | #4ADE80 / #FB923C / #F87171 | Dominado / por repasar / error |

## Tipografía
- Títulos: **Crimson Pro** (serif académica). Texto: **Atkinson Hyperlegible** (máxima legibilidad). Respuestas: **JetBrains Mono**.
- Base 16 px (17 px en campos para evitar zoom en iOS), interlineado 1.6.

## Espaciado, radios, sombras
- Escala de 4 px (Tailwind): 8 · 12 · 16 · 24 · 32. Márgenes laterales de 16 px en móvil.
- Radios: 12 px (controles), 16 px (tarjetas), pastillas redondas.
- Sombra única `--shadow` (dos capas suaves); en oscuro más profunda.

## Movimiento (`src/lib/motion.js`)
| Qué | Duración / curva |
|---|---|
| Microinteracciones (hover, tap, glosario) | 150 ms · resorte `visualDuration 0.2, bounce 0.3` |
| Cambio de pregunta | 240 ms entrada (desliza 24 px en la dirección del avance) · 180 ms salida |
| Cambio de pantalla | 320 ms entrada · 180 ms salida · `ease [0.22,1,0.36,1]` |
| Listas | escalonado 50 ms (`delayChildren: stagger(0.05)`) |
| Barra de progreso | resorte sin rebote, `scaleX` |
| Notas | conteo de 0.9 s |
- Solo se animan `transform` y `opacity`. Las salidas son más cortas que las entradas.
- **No se anima:** texto mientras se lee, la vista previa matemática (solo un fundido de 150 ms), tablas grandes al cargar.
- `MotionConfig reducedMotion="user"`: con "reducir movimiento" se quitan desplazamientos y layout; el conteo de notas aparece directo.

## Accesibilidad
- Contraste AA en ambos modos; foco visible (3 px, color `--ring`).
- Todo usable con teclado: radios nativos, pestañas con `role="tab"`, glosario con Enter/Espacio y Esc.
- Objetivos táctiles ≥ 44 px (`min-h-11`).
- `aria-live` en la vista previa; errores junto a su campo; enlace "Saltar al contenido".
- `prefers-reduced-motion` respetado (Motion + CSS).
