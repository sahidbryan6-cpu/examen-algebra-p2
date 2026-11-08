/**
 * Motor algebraico mínimo del examen.
 * - normalize(): convierte lo que escribe el alumno (x², x^2, 2·x, −) a una forma única.
 * - parse(): convierte el texto en un árbol (AST).
 * - equivalent(): compara dos expresiones evaluándolas en puntos aleatorios.
 * - monomials() / isSimplified() / isFactored(): revisan la FORMA de la respuesta.
 * - toTex(): genera LaTeX para la vista previa con KaTeX.
 * Es JS puro (sin React) para poder probarlo con `node --test`.
 */

const SUP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  'ⁿ': 'n', 'ᵃ': 'a', '⁺': '+', '⁻': '-', '⁽': '(', '⁾': ')',
};

/** Unifica símbolos: superíndices → ^( ), signos tipográficos → ASCII, quita espacios. */
export function normalize(input) {
  let out = '';
  let sup = '';
  const flush = () => { if (sup) { out += `^(${sup})`; sup = ''; } };
  for (const ch of String(input)) {
    if (SUP[ch] !== undefined) sup += SUP[ch];
    else { flush(); out += ch; }
  }
  flush();
  return out
    .replace(/\*\*/g, '^')
    .replace(/[−–—]/g, '-')
    .replace(/[·×∙•⋅*]/g, '*')
    .replace(/[÷:]/g, '/')
    .replace(/[[{]/g, '(')
    .replace(/[\]}]/g, ')')
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function tokenize(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    const num = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (num) { tokens.push({ k: 'n', v: Number(num[0]) }); i += num[0].length; continue; }
    if (/[a-z]/.test(ch)) { tokens.push({ k: 'v', v: ch }); i++; continue; }
    if ('+-*/^()'.includes(ch)) { tokens.push({ k: ch }); i++; continue; }
    throw new Error(`Símbolo no reconocido: ${ch}`);
  }
  return tokens;
}

/**
 * Convierte texto en AST. Nodos: n (número), v (variable), + - * / ^, neg.
 * expVars: letras que solo viven en exponentes (ej. "n"), para leer x^2n como x^(2n).
 */
export function parse(input, expVars = []) {
  const src = normalize(input);
  if (!src) throw new Error('Vacío');
  const tk = tokenize(src);
  let p = 0;
  const peek = () => tk[p];
  const eat = (k) => {
    if (!tk[p] || tk[p].k !== k) throw new Error(`Se esperaba ${k}`);
    return tk[p++];
  };

  function expr() {
    let node = term();
    while (peek() && (peek().k === '+' || peek().k === '-')) {
      const op = tk[p++].k;
      node = { t: op, l: node, r: term() };
    }
    return node;
  }
  function term() {
    let node = factor();
    for (;;) {
      const t = peek();
      if (!t) break;
      if (t.k === '*' || t.k === '/') { p++; node = { t: t.k, l: node, r: factor() }; continue; }
      // Multiplicación implícita: 2x, x(y+1), (a+b)(a+x)
      if (t.k === 'v' || t.k === '(' || t.k === 'n') { node = { t: '*', l: node, r: factor() }; continue; }
      break;
    }
    return node;
  }
  function factor() {
    const t = peek();
    if (t && t.k === '-') { p++; return { t: 'neg', x: factor() }; }
    if (t && t.k === '+') { p++; return factor(); }
    return power();
  }
  function power() {
    const base = primary();
    if (peek() && peek().k === '^') { p++; return { t: '^', l: base, r: exponent() }; }
    return base;
  }
  function exponent() {
    const t = peek();
    if (!t) throw new Error('Falta el exponente');
    if (t.k === '-') { p++; return { t: 'neg', x: exponent() }; }
    if (t.k === '(') return primary();
    let node = primary();
    // x^2n → x^(2n) solo si la letra es variable de exponente en este ejercicio
    while (peek() && peek().k === 'v' && expVars.includes(peek().v)) {
      node = { t: '*', l: node, r: { t: 'v', n: tk[p++].v } };
    }
    return node;
  }
  function primary() {
    const t = peek();
    if (!t) throw new Error('Expresión incompleta');
    if (t.k === 'n') { p++; return { t: 'n', v: t.v }; }
    if (t.k === 'v') { p++; return { t: 'v', n: t.v }; }
    if (t.k === '(') { p++; const e = expr(); eat(')'); return e; }
    throw new Error(`No esperaba ${t.k}`);
  }

  const ast = expr();
  if (p !== tk.length) throw new Error('Sobran símbolos');
  return ast;
}

/** Intenta leer; devuelve null si no se puede. */
export function tryParse(input, expVars = []) {
  try { return parse(input, expVars); } catch { return null; }
}

export function evaluate(node, env) {
  switch (node.t) {
    case 'n': return node.v;
    case 'v': {
      if (!(node.n in env)) throw new Error(`Sin valor para ${node.n}`);
      return env[node.n];
    }
    case '+': return evaluate(node.l, env) + evaluate(node.r, env);
    case '-': return evaluate(node.l, env) - evaluate(node.r, env);
    case '*': return evaluate(node.l, env) * evaluate(node.r, env);
    case '/': return evaluate(node.l, env) / evaluate(node.r, env);
    case '^': return evaluate(node.l, env) ** evaluate(node.r, env);
    case 'neg': return -evaluate(node.x, env);
    default: throw new Error('Nodo desconocido');
  }
}

export function variables(node, set = new Set()) {
  if (node.t === 'v') set.add(node.n);
  for (const k of ['l', 'r', 'x']) if (node[k]) variables(node[k], set);
  return set;
}

/**
 * Equivalencia numérica: evalúa en `trials` puntos con valores positivos (0.5 a 2.5)
 * para todas las letras y compara con tolerancia relativa 1e-9.
 * Positivos para que x^(2n) tenga sentido con n no entero.
 */
export function equivalent(a, b, trials = 8, rand = Math.random) {
  const vars = [...new Set([...variables(a), ...variables(b)])];
  for (let i = 0; i < trials; i++) {
    const env = Object.fromEntries(vars.map((v) => [v, 0.5 + 2 * rand()]));
    const va = evaluate(a, env);
    const vb = evaluate(b, env);
    if (!Number.isFinite(va) || !Number.isFinite(vb)) return false;
    if (Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(va), Math.abs(vb))) return false;
  }
  return true;
}

/* ---------- Forma de la respuesta ---------- */

function sumTerms(node, sign = 1, out = []) {
  if (node.t === '+') { sumTerms(node.l, sign, out); sumTerms(node.r, sign, out); }
  else if (node.t === '-') { sumTerms(node.l, sign, out); sumTerms(node.r, -sign, out); }
  else out.push({ sign, node });
  return out;
}

function productFactors(node, out = { sign: 1, list: [] }) {
  if (node.t === '*') { productFactors(node.l, out); productFactors(node.r, out); }
  else if (node.t === 'neg') { out.sign *= -1; productFactors(node.x, out); }
  else out.list.push(node);
  return out;
}

/** Exponente válido en un monomio: números, letras de exponente y productos (2, 2n, 4n). */
function isExponentAtom(node, expVars) {
  if (node.t === 'n') return true;
  if (node.t === 'v') return expVars.includes(node.n);
  if (node.t === '*') return isExponentAtom(node.l, expVars) && isExponentAtom(node.r, expVars);
  return false;
}

// Valores fijos para comparar exponentes literales (4n vs 2n·2) sin álgebra simbólica.
const EXP_ENV = { n: 1.2345, a: 1.6789, m: 1.9876, k: 2.1357 };

/**
 * Descompone una expresión en monomios {coef, sig} si ya es un polinomio "escrito":
 * suma de términos sin paréntesis, con a lo más un coeficiente y cada letra una vez.
 * Devuelve null si la expresión no tiene esa forma.
 */
export function monomials(ast, expVars = []) {
  const result = [];
  for (const { sign, node } of sumTerms(ast)) {
    const { sign: s2, list } = productFactors(node);
    let coef = sign * s2;
    let numbers = 0;
    const powers = {};
    for (const f of list) {
      if (f.t === 'n') { coef *= f.v; numbers++; continue; }
      let base = f;
      let expKey = '1';
      if (f.t === '^') {
        base = f.l;
        if (!isExponentAtom(f.r, expVars)) return null;
        expKey = evaluate(f.r, EXP_ENV).toFixed(6);
      }
      if (base.t !== 'v' || expVars.includes(base.n)) return null;
      if (base.n in powers) return null; // x·x sin reducir
      powers[base.n] = expKey === '1' ? (1).toFixed(6) : expKey;
    }
    if (numbers > 1) return null; // 2·3x sin reducir
    const sig = Object.keys(powers).sort().map((v) => `${v}^${powers[v]}`).join('·');
    result.push({ coef, sig });
  }
  return result;
}

/** Simplificada = polinomio escrito, sin términos semejantes repetidos ni coeficientes 0. */
export function isSimplified(ast, expVars = []) {
  const mons = monomials(ast, expVars);
  if (!mons) return false;
  const sigs = mons.map((m) => m.sig);
  return new Set(sigs).size === sigs.length && mons.every((m) => m.coef !== 0);
}

function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }

/**
 * Factorizada = producto de 2+ factores (o potencia de una suma) donde al menos
 * un factor es una suma. Devuelve { ok, reason } para explicar el fallo.
 */
export function factoredCheck(ast, expVars = []) {
  const { list } = productFactors(ast);
  const isSum = (n) => n.t === '+' || n.t === '-';
  const sums = list.filter((f) => isSum(f) || (f.t === '^' && isSum(f.l)));
  const powerOfSum = list.length === 1 && list[0].t === '^' && isSum(list[0].l);
  if ((list.length < 2 && !powerOfSum) || sums.length === 0) {
    return { ok: false, reason: 'no-producto' };
  }
  if (list.some((f) => f.t === 'n' && Math.abs(f.v) === 1)) return { ok: false, reason: 'factor-trivial' };
  for (const s of sums) {
    const mons = monomials(isSum(s) ? s : s.l, expVars);
    if (!mons) continue;
    if (mons.some((m) => !Number.isInteger(m.coef))) return { ok: false, reason: 'no-enteros' };
    const g = mons.reduce((acc, m) => gcd(acc, Math.round(m.coef)), 0);
    if (g > 1) return { ok: false, reason: 'falta-factor-comun' };
    // Una letra presente en todos los términos también es factor común sin sacar.
    const letters = mons.map((m) => new Set(m.sig ? m.sig.split('·').map((p) => p[0]) : []));
    if (letters.length > 1 && [...letters[0]].some((v) => letters.every((s) => s.has(v)))) {
      return { ok: false, reason: 'falta-factor-comun' };
    }
  }
  return { ok: true };
}

/* ---------- LaTeX para la vista previa ---------- */

const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, neg: 3, '^': 4, n: 5, v: 5 };

export function toTex(node) {
  const wrap = (n, min) => (PREC[n.t] < min ? `\\left(${toTex(n)}\\right)` : toTex(n));
  switch (node.t) {
    case 'n': return String(node.v);
    case 'v': return node.n;
    case '+': return `${toTex(node.l)} + ${wrap(node.r, node.r.t === 'neg' ? 4 : 1)}`;
    case '-': return `${toTex(node.l)} - ${wrap(node.r, node.r.t === 'neg' ? 4 : 2)}`;
    case '*': {
      const l = wrap(node.l, 2);
      const r = wrap(node.r, 2);
      // Entre números (o antes de un signo) hace falta el punto: 2·3, x·(−2)
      const needDot = /^[\d-]/.test(r) || (/\d$/.test(l) && /^\d/.test(r));
      return needDot ? `${l} \\cdot ${r}` : `${l}${r}`;
    }
    case '/': return `\\frac{${toTex(node.l)}}{${toTex(node.r)}}`;
    case '^': return `${wrap(node.l, 5)}^{${toTex(node.r)}}`;
    case 'neg': return `-${wrap(node.x, 3)}`;
    default: return '';
  }
}
