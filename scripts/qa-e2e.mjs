// QA de extremo a extremo con Playwright (navegador aislado, sin cuentas).
// Uso: node scripts/qa-e2e.mjs <url> <carpeta-capturas>
// Recorre: bienvenida → examen (con errores a propósito) → resultados → refuerzo → final → #/admin.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire('C:/Users/bsguq/sistema-ia/package.json');
const { chromium } = require('playwright');
const URL = process.argv[2] ?? 'http://127.0.0.1:4173/';
const OUT = process.argv[3] ?? 'qa-capturas';
mkdirSync(OUT, { recursive: true });

const problems = [];
const check = (cond, msg) => { console.log(`${cond ? 'OK ' : 'FALLA'} ${msg}`); if (!cond) problems.push(msg); };

async function run(width, reducedMotion) {
  const tag = `${width}${reducedMotion ? '-reduce' : ''}`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: reducedMotion ? 'reduce' : 'no-preference', locale: 'es-MX' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  const noHScroll = async (where) => check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `[${tag}] sin scroll horizontal en ${where}`);

  await page.goto(URL);
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.screenshot({ path: `${OUT}/${tag}-1-bienvenida.png`, fullPage: true });
  await noHScroll('bienvenida');

  // Validación del nombre
  await page.getByRole('button', { name: /Comenzar/ }).click();
  check(await page.getByText('mínimo 3 caracteres').isVisible(), `[${tag}] valida nombre vacío`);
  await page.getByLabel(/Nombre completo/).fill('Alumno QA');
  await page.getByLabel(/Grupo/).fill('3B');
  await page.getByRole('button', { name: /Comenzar/ }).click();

  // Teoría: responde todo bien menos q2 y q5
  const theoryAnswers = ['A', 'Verdadero', 'A', 'Verdadero', 'B', 'Falso', 'A', 'A', 'Falso', 'A', 'A', 'Verdadero'];
  for (const [i, ans] of theoryAnswers.entries()) {
    const radio = /^[A-D]$/.test(ans) ? page.getByRole('radio', { name: new RegExp(`^${ans} `) }) : page.getByRole('radio', { name: new RegExp(ans) });
    await radio.check();
    if (i === 0) await page.screenshot({ path: `${OUT}/${tag}-2-teoria.png`, fullPage: true });
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.waitForTimeout(450); // espera la animación de salida (AnimatePresence mode=wait)
  }
  // Práctica: errores a propósito en 2, 5 y 9
  const practice = ['8x³ − 7x² + 11x + 5', '7x^3+2x^2-2', '15ax+25x-9a-15', 'x^2-xy+y^2', '9x^6+81', '36x^(4n)-9y^(6a)',
    '25x^4n-5x^2n-6', '27x^6-108x^4y+144x^2y^2-64y^3', '4y^5-10y^3-4', '(a+b(a+x)'];
  for (const [i, ans] of practice.entries()) {
    await page.getByLabel('Tu respuesta').fill(ans);
    if (i === 0) { await page.screenshot({ path: `${OUT}/${tag}-3-practica.png`, fullPage: true }); await noHScroll('práctica'); }
    if (i < practice.length - 1) { await page.getByRole('button', { name: 'Siguiente' }).click(); await page.waitForTimeout(450); }
  }
  check(await page.getByText('No pude leer tu respuesta, revisa los paréntesis.').first().waitFor({ timeout: 3000 }).then(() => true, () => false), `[${tag}] mensaje de respuesta ilegible`);
  await page.getByRole('button', { name: /Terminar examen/ }).click();
  check(await page.getByRole('dialog').isVisible(), `[${tag}] confirma si hay preguntas ilegibles`);
  await page.getByRole('button', { name: 'Revisar' }).click();
  await page.waitForTimeout(300);
  await page.getByLabel('Tu respuesta').fill('(a+b)(a+x)');
  await page.getByRole('button', { name: /Terminar examen/ }).click();

  // Resultados
  await page.getByText('Temas que dominas').waitFor();
  await page.waitForTimeout(1200);
  const body = await page.locator('main').innerText();
  check(/10 de 12 correctas/.test(body) && /8\.3/.test(body), `[${tag}] nota teórica 8.3 (10/12)`);
  check(/7 de 10 correctos/.test(body) && /7\.0/.test(body), `[${tag}] nota práctica 7.0 (7/10)`);
  check(/no cambiaste todos los signos/i.test(body), `[${tag}] explica el error del ej. 2`);
  check(/doble producto/.test(body), `[${tag}] explica el error del ej. 5`);
  await page.screenshot({ path: `${OUT}/${tag}-4-resultados.png`, fullPage: true });
  await noHScroll('resultados');

  // Refuerzo
  await page.getByRole('button', { name: /Ir al refuerzo/ }).click();
  await page.getByText('Repasemos paso a paso').waitFor();
  const tabs = await page.getByRole('tab').allInnerTexts();
  check(tabs.length === 3, `[${tag}] 3 temas por repasar (${tabs.join(' | ')})`);
  await page.getByRole('button', { name: 'Ver todos' }).click();
  check(await page.getByText('Coinciden: el resultado es correcto.').isVisible(), `[${tag}] verificación numérica`);
  const inputs = page.getByLabel('Tu respuesta');
  await inputs.nth(0).fill('7x^3-12x^2+8');
  await page.getByRole('button', { name: 'Comprobar' }).nth(0).click();
  await inputs.nth(1).fill('3x^3+5x-5');
  await page.getByRole('button', { name: 'Comprobar' }).nth(1).click();
  check(await page.getByText('¡Correcto!').first().isVisible(), `[${tag}] refuerzo calificado`);
  // Glosario
  const term = page.getByRole('button', { name: /sustraendo/i }).first();
  if (await term.count()) { await term.click(); check(await page.getByRole('note').first().isVisible(), `[${tag}] glosario emergente`); await page.keyboard.press('Escape'); }
  await page.screenshot({ path: `${OUT}/${tag}-5-refuerzo.png`, fullPage: true });
  await noHScroll('refuerzo');

  await page.getByRole('button', { name: /Terminar refuerzo/ }).click();
  await page.getByText('Antes y después del refuerzo').waitFor();
  const fin = await page.locator('main').innerText();
  check(/Resta de polinomios[\s\S]*Por repasar[\s\S]*Dominado/.test(fin), `[${tag}] antes/después del tema 2`);
  await page.screenshot({ path: `${OUT}/${tag}-6-final.png`, fullPage: true });

  // Admin (modo local o login)
  await page.goto(`${URL}#/admin`);
  await page.waitForTimeout(800);
  const admin = await page.locator('main').innerText();
  check(/Alumno QA|Panel del administrador/.test(admin), `[${tag}] #/admin carga (muestra registros o pide inicio de sesión)`);
  await page.screenshot({ path: `${OUT}/${tag}-7-admin.png`, fullPage: true });

  check(errors.length === 0, `[${tag}] consola sin errores${errors.length ? ': ' + errors.join(' / ') : ''}`);
  await browser.close();
}

await run(375, false);
await run(1280, false);
await run(375, true);
console.log(problems.length ? `\n${problems.length} problemas` : '\nTodo OK');
process.exit(problems.length ? 1 : 0);
