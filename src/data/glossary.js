/** Glosario emergente: [[término]] en los textos abre esta definición con un ejemplo. */
export const GLOSSARY = {
  'término semejante': { def: 'Términos con las mismas letras elevadas a los mismos exponentes. Solo se pueden sumar o restar entre sí.', ex: '5x^3 \\text{ y } -2x^3 \\text{ son semejantes; } 5x^3 \\text{ y } 5x^2 \\text{ no.}' },
  coeficiente: { def: 'El número que multiplica a la parte literal de un término.', ex: '\\text{En } -7x^2 \\text{ el coeficiente es } -7.' },
  exponente: { def: 'Indica cuántas veces se multiplica la base por sí misma.', ex: 'x^3 = x\\cdot x\\cdot x' },
  polinomio: { def: 'Suma o resta de varios términos algebraicos.', ex: '8x^3-7x^2+11x+5' },
  monomio: { def: 'Expresión de un solo término.', ex: '-9a' },
  binomio: { def: 'Polinomio de dos términos.', ex: '3x^3-9' },
  trinomio: { def: 'Polinomio de tres términos.', ex: '9x^6-54x^3+81' },
  minuendo: { def: 'En una resta, la cantidad de la que se resta.', ex: '\\text{En } A-B, \\ A \\text{ es el minuendo.}' },
  sustraendo: { def: 'En una resta, la cantidad que se resta. Todos sus signos cambian.', ex: '\\text{En } A-B, \\ B \\text{ es el sustraendo.}' },
  'ley de signos': { def: 'Al multiplicar: signos iguales dan +, signos distintos dan −.', ex: '(-3)(-5)=15,\\quad (-3)(5)=-15' },
  'propiedad distributiva': { def: 'Un factor multiplica a cada término de una suma.', ex: 'a(b+c)=ab+ac' },
  'producto notable': { def: 'Multiplicación con un resultado conocido que se escribe sin hacer todos los pasos.', ex: '(a+b)^2=a^2+2ab+b^2' },
  'binomios conjugados': { def: 'Dos binomios iguales que solo difieren en el signo de un término.', ex: '(a+b)(a-b)=a^2-b^2' },
  'potencia de potencia': { def: 'Al elevar una potencia a otra potencia, los exponentes se multiplican.', ex: '(x^3)^2=x^{6}' },
  'suma de cubos': { def: 'Suma de dos cubos perfectos; siempre se factoriza con (a+b).', ex: 'a^3+b^3=(a+b)(a^2-ab+b^2)' },
  'factor común': { def: 'Lo que divide a todos los términos: el MCD de los coeficientes y las letras presentes en todos con su menor exponente.', ex: '6x^3-9x^2=3x^2(2x-3)' },
  mcd: { def: 'Máximo común divisor: el número más grande que divide exactamente a todos.', ex: '\\text{MCD}(4,10,4)=2' },
  agrupación: { def: 'Factorizar juntando términos en grupos con factor común y sacando el binomio que se repite.', ex: 'a^2+ab+ax+bx=(a+b)(a+x)' },
};

/** Busca la entrada aceptando plurales simples ("términos semejantes", "coeficientes"). */
export function lookupTerm(word) {
  const norm = (s) => s.toLowerCase().split(' ').map((p) => p.replace(/s$/, '')).join(' ');
  const w = norm(word);
  return Object.entries(GLOSSARY).find(([k]) => norm(k) === w)?.[1] ?? null;
}
