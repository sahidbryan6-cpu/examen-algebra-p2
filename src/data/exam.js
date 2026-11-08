/**
 * Datos del examen "Portafolio 2 de Álgebra".
 * - TOPICS: los 10 temas.
 * - PRACTICE: los 10 ejercicios del portafolio (enunciado copiado tal cual) con su clave.
 *   `original` es la expresión del enunciado en texto plano: las pruebas comprueban
 *   que `original` y `answer` son equivalentes (la clave se verifica sola).
 * - THEORY: 12 preguntas teóricas (generadas, no venían en el portafolio).
 * Texto enriquecido: $...$ es LaTeX y [[término]] abre el glosario.
 */

export const TOPICS = [
  { id: 't1', name: 'Suma de polinomios' },
  { id: 't2', name: 'Resta de polinomios (cambio de signo)' },
  { id: 't3', name: 'Multiplicación (propiedad distributiva)' },
  { id: 't4', name: 'División y suma de cubos' },
  { id: 't5', name: 'Binomio al cuadrado' },
  { id: 't6', name: 'Binomios conjugados' },
  { id: 't7', name: 'Binomios con término común' },
  { id: 't8', name: 'Binomio al cubo' },
  { id: 't9', name: 'Factor común' },
  { id: 't10', name: 'Factorización por agrupación' },
];

export const topicName = (id) => TOPICS.find((t) => t.id === id)?.name ?? id;

export const PRACTICE = [
  {
    id: 'p1', topic: 't1', form: 'simplified', expVars: [],
    statement: 'Hallar la suma:',
    tex: '(5x^3-7x^2+8x) + (3x^3-8x^2+3) + (8x^2+3x+2)',
    original: '(5x^3-7x^2+8x)+(3x^3-8x^2+3)+(8x^2+3x+2)',
    answer: '8x^3-7x^2+11x+5',
    errors: [
      { answer: '8x^3-23x^2+11x+5', msg: 'Restaste el $8x^2$ del tercer polinomio: ese término es positivo, así que $-7x^2-8x^2+8x^2=-7x^2$.' },
      { answer: '8x^3-15x^2+11x+5', msg: 'Te faltó sumar el $+8x^2$ del tercer polinomio. Revisa que cada término aparezca una vez.' },
      { answer: '8x^3-7x^2+11x+3', msg: 'Te faltó el $+2$ del tercer polinomio en los términos independientes: $3+2=5$.' },
      { answer: '8x^3-7x^2+8x+5', msg: 'Olvidaste el $3x$ del tercer polinomio: $8x+3x=11x$.' },
    ],
    hint: 'Agrupa solo [[términos semejantes]] (misma letra y mismo exponente) y suma sus [[coeficientes]]; los exponentes no cambian.',
  },
  {
    id: 'p2', topic: 't2', form: 'simplified', expVars: [],
    statement: 'Hallar la resta: de $3x^3-5x^2+3$ restar $-4x^3+7x^2-5$',
    tex: '(3x^3-5x^2+3) - (-4x^3+7x^2-5)',
    original: '(3x^3-5x^2+3)-(-4x^3+7x^2-5)',
    answer: '7x^3-12x^2+8',
    errors: [
      { answer: '-x^3+2x^2-2', msg: 'No cambiaste los signos del [[sustraendo]]: sumaste en lugar de restar. Al restar, TODOS sus términos cambian de signo.' },
      { answer: '7x^3+2x^2-2', msg: 'No cambiaste todos los signos: solo cambiaste el primero. $-(+7x^2)=-7x^2$ y $-(-5)=+5$.' },
      { answer: '7x^3+2x^2+8', msg: 'No cambiaste todos los signos: el $+7x^2$ debía pasar a $-7x^2$.' },
      { answer: '7x^3-12x^2-2', msg: 'No cambiaste todos los signos: $-(-5)$ es $+5$, así que $3+5=8$.' },
      { answer: '-7x^3+12x^2-8', msg: 'Restaste al revés. "De A restar B" es $A-B$, no $B-A$.' },
    ],
    hint: 'Restar es sumar el opuesto: cambia el signo de cada término del [[sustraendo]] y luego reduce [[términos semejantes]].',
  },
  {
    id: 'p3', topic: 't3', form: 'simplified', expVars: [],
    statement: 'Resolver la multiplicación de polinomios: $(5x-3)$ por $(3a+5)$',
    tex: '(5x-3)(3a+5)',
    original: '(5x-3)(3a+5)',
    answer: '15ax+25x-9a-15',
    errors: [
      { answer: '15ax-15', msg: 'Solo multiplicaste primero por primero y último por último. Con la [[propiedad distributiva]] salen 4 productos.' },
      { answer: '15ax+25x+9a-15', msg: 'Error de [[ley de signos]]: $(-3)(3a)=-9a$.' },
      { answer: '31ax-15', msg: 'Sumaste términos que no son semejantes: $25x$ y $-9a$ tienen letras distintas y no se pueden juntar.' },
      { answer: '15ax+16x-15', msg: 'Sumaste $25x$ con $-9a$ como si fueran semejantes. La $x$ y la $a$ son letras distintas.' },
    ],
    hint: 'Multiplica cada término del primer paréntesis por cada término del segundo (4 productos). $x$ y $a$ son letras distintas.',
  },
  {
    id: 'p4', topic: 't4', form: 'simplified', expVars: [],
    statement: 'Resolver la división de polinomios: $x^3+y^3$ entre $x+y$',
    tex: '\\dfrac{x^3+y^3}{x+y}',
    original: '(x^3+y^3)/(x+y)',
    answer: 'x^2-xy+y^2',
    errors: [
      { answer: 'x^2+xy+y^2', msg: 'El signo del término central es negativo: $a^3+b^3=(a+b)(a^2-ab+b^2)$. El $+ab$ es de la diferencia de cubos.' },
      { answer: 'x^2+y^2', msg: 'Te faltó el término central $-xy$. Compruébalo multiplicando $(x+y)(x^2+y^2)$: no da $x^3+y^3$.' },
      { answer: 'x^2-2xy+y^2', msg: 'Ese es el cuadrado $(x-y)^2$. En la [[suma de cubos]] el término central es $-xy$, sin el 2.' },
    ],
    hint: 'Reconoce una [[suma de cubos]]: $a^3+b^3=(a+b)(a^2-ab+b^2)$ y simplifica el factor $(x+y)$.',
  },
  {
    id: 'p5', topic: 't5', form: 'simplified', expVars: [],
    statement: 'Desarrollar:',
    tex: '(3x^3-9)^2',
    original: '(3x^3-9)^2',
    answer: '9x^6-54x^3+81',
    errors: [
      { answer: '9x^6+81', msg: 'Elevaste cada término por separado y olvidaste el doble producto $-2ab=-54x^3$. $(a-b)^2\\neq a^2+b^2$.' },
      { answer: '9x^6-81', msg: 'Olvidaste el doble producto y además $b^2=(-9)^2=+81$ siempre es positivo.' },
      { answer: '9x^6-27x^3+81', msg: 'Te faltó el 2 del doble producto: $2\\cdot 3x^3\\cdot 9=54x^3$.' },
      { answer: '9x^6+54x^3+81', msg: 'El signo del término central es negativo porque el binomio es una resta.' },
      { answer: '9x^5-54x^3+81', msg: 'En una [[potencia de potencia]] los exponentes se multiplican: $(x^3)^2=x^6$, no $x^5$.' },
      { answer: '3x^6-54x^3+81', msg: 'También el coeficiente se eleva al cuadrado: $(3x^3)^2=9x^6$.' },
    ],
    hint: 'Usa $(a-b)^2=a^2-2ab+b^2$ con $a=3x^3$ y $b=9$.',
  },
  {
    id: 'p6', topic: 't6', form: 'simplified', expVars: ['n', 'a'],
    statement: 'Desarrollar el producto de binomios conjugados:',
    tex: '(6x^{2n}+3y^{3a})(6x^{2n}-3y^{3a})',
    original: '(6x^(2n)+3y^(3a))(6x^(2n)-3y^(3a))',
    answer: '36x^(4n)-9y^(6a)',
    errors: [
      { answer: '36x^(4n)+36x^(2n)y^(3a)-9y^(6a)', msg: 'Pusiste un término central. En [[binomios conjugados]] los productos cruzados $+ab$ y $-ab$ se cancelan.' },
      { answer: '36x^(4n)-36x^(2n)y^(3a)-9y^(6a)', msg: 'Pusiste un término central. En [[binomios conjugados]] los productos cruzados se cancelan: solo queda $a^2-b^2$.' },
      { answer: '36x^(4n)-36x^(2n)y^(3a)+9y^(6a)', msg: 'Lo trataste como un binomio al cuadrado. Son [[binomios conjugados]]: $(a+b)(a-b)=a^2-b^2$.' },
      { answer: '36x^(4n)+9y^(6a)', msg: 'El resultado es una diferencia: $a^2-b^2$. El segundo cuadrado va con signo menos.' },
      { answer: '36x^(2n)-9y^(3a)', msg: 'Al elevar al cuadrado se multiplica el exponente por 2: $(x^{2n})^2=x^{4n}$.' },
      { answer: '6x^(4n)-3y^(6a)', msg: 'Los coeficientes también se elevan al cuadrado: $6^2=36$ y $3^2=9$.' },
    ],
    hint: 'Usa $(a+b)(a-b)=a^2-b^2$. Al elevar $x^{2n}$ al cuadrado, el exponente se multiplica por 2.',
  },
  {
    id: 'p7', topic: 't7', form: 'simplified', expVars: ['n'],
    statement: 'Resolver el producto:',
    tex: '(5x^{2n}+2)(5x^{2n}-3)',
    original: '(5x^(2n)+2)(5x^(2n)-3)',
    answer: '25x^(4n)-5x^(2n)-6',
    errors: [
      { answer: '25x^(4n)-6', msg: 'Te faltó el término central. Con término común: $(u+a)(u+b)=u^2+(a+b)u+ab$ y aquí $(2-3)u=-5x^{2n}$.' },
      { answer: '25x^(4n)+5x^(2n)-6', msg: 'El término central es $(2+(-3))\\cdot 5x^{2n}=-5x^{2n}$: la suma $2-3$ es negativa.' },
      { answer: '25x^(4n)-5x^(2n)+6', msg: 'El producto de los no comunes es $2\\cdot(-3)=-6$.' },
      { answer: '25x^(2n)-5x^(2n)-6', msg: 'Al multiplicar $x^{2n}\\cdot x^{2n}$ los exponentes se suman: $x^{4n}$.' },
      { answer: '25x^(4n)-x^(2n)-6', msg: 'El término central se multiplica por el término común completo: $-1\\cdot 5x^{2n}=-5x^{2n}$.' },
    ],
    hint: 'El término común es $5x^{2n}$. Usa $(u+a)(u+b)=u^2+(a+b)u+ab$.',
  },
  {
    id: 'p8', topic: 't8', form: 'simplified', expVars: [],
    statement: 'Desarrollar:',
    tex: '(3x^2-4y)^3',
    original: '(3x^2-4y)^3',
    answer: '27x^6-108x^4y+144x^2y^2-64y^3',
    errors: [
      { answer: '27x^6-64y^3', msg: 'Omitiste los términos intermedios. $(a-b)^3$ tiene 4 términos: $a^3-3a^2b+3ab^2-b^3$.' },
      { answer: '27x^6+64y^3', msg: 'Omitiste los términos intermedios y el signo de $b^3$ es negativo.' },
      { answer: '27x^6-36x^4y+48x^2y^2-64y^3', msg: 'Te faltó el coeficiente 3 de los términos intermedios: $3a^2b$ y $3ab^2$.' },
      { answer: '27x^6+108x^4y+144x^2y^2+64y^3', msg: 'Con una resta, los signos alternan: $+,-,+,-$.' },
      { answer: '27x^5-108x^4y+144x^2y^2-64y^3', msg: 'En $(x^2)^3$ los exponentes se multiplican: $x^6$.' },
      { answer: '9x^6-108x^4y+144x^2y^2-12y^3', msg: 'Los coeficientes se elevan al cubo: $3^3=27$ y $4^3=64$.' },
    ],
    hint: 'Usa $(a-b)^3=a^3-3a^2b+3ab^2-b^3$ con $a=3x^2$, $b=4y$.',
  },
  {
    id: 'p9', topic: 't9', form: 'factored', expVars: [],
    statement: 'Factorar:',
    tex: '4y^5-10y^3-4',
    original: '4y^5-10y^3-4',
    answer: '2(2y^5-5y^3-2)',
    errors: [
      { answer: '2(2y^5-5y^3-4)', msg: 'Al sacar el 2 hay que dividir TODOS los términos: $-4\\div 2=-2$.' },
      { answer: '2(2y^5-10y^3-4)', msg: 'Al sacar el 2 hay que dividir todos los términos: $-10\\div 2=-5$.' },
      { answer: '2y(2y^4-5y^2-2)', msg: 'La $y$ no es común: el término $-4$ no tiene $y$.' },
    ],
    hint: 'Busca el [[MCD]] de 4, 10 y 4, y revisa si alguna letra está en todos los términos.',
  },
  {
    id: 'p10', topic: 't10', form: 'factored', expVars: [],
    statement: 'Factorar:',
    tex: 'a^2+ab+ax+bx',
    original: 'a^2+ab+ax+bx',
    answer: '(a+b)(a+x)',
    errors: [
      { answer: '(a+x)(b+x)', msg: 'Ese producto da $ab+ax+bx+x^2$. Agrupa $(a^2+ab)+(ax+bx)$ y saca factor común de cada grupo.' },
      { answer: '(a+b)(a-x)', msg: 'Revisa el signo: $x(a+b)$ es positivo, así que el factor es $(a+x)$.' },
      { answer: '(a+b)(x+b)', msg: 'Del primer grupo $a^2+ab$ sale $a$, no $b$: $a(a+b)$.' },
    ],
    hint: 'Agrupa de dos en dos, saca [[factor común]] de cada grupo y luego el binomio que se repite.',
  },
];

export const THEORY = [
  {
    id: 'q1', topic: 't1', type: 'mc',
    prompt: 'Al sumar polinomios, ¿qué términos se pueden combinar en uno solo?',
    options: [
      'Los que tienen las mismas letras con los mismos exponentes',
      'Los que tienen el mismo coeficiente',
      'Todos los que tienen la letra $x$',
      'Solo los términos independientes',
    ],
    correct: 0,
    explanation: 'Solo se combinan [[términos semejantes]]: misma parte literal (letras y exponentes). $5x^3$ y $3x^3$ se suman; $5x^3$ y $5x^2$ no.',
  },
  {
    id: 'q2', topic: 't2', type: 'tf',
    prompt: 'Para restar un polinomio, basta con cambiar el signo del primer término del [[sustraendo]].',
    correct: false,
    explanation: 'Falso. Restar es sumar el opuesto: se cambia el signo de TODOS los términos del sustraendo, porque el signo menos multiplica a cada uno.',
  },
  {
    id: 'q3', topic: 't3', type: 'mc',
    prompt: '¿Qué propiedad se usa para multiplicar $(5x-3)(3a+5)$?',
    options: ['Propiedad distributiva', 'Propiedad conmutativa de la suma', 'Elemento neutro', 'Propiedad del inverso'],
    correct: 0,
    explanation: 'La [[propiedad distributiva]] dice que $p(r+s)=pr+ps$. Se aplica dos veces: cada término del primer factor multiplica a cada término del segundo.',
  },
  {
    id: 'q4', topic: 't4', type: 'tf',
    prompt: '$x^3+y^3$ se puede dividir exactamente (residuo 0) entre $x+y$.',
    correct: true,
    explanation: 'Verdadero. Por la [[suma de cubos]], $x^3+y^3=(x+y)(x^2-xy+y^2)$, así que $x+y$ es uno de sus factores.',
  },
  {
    id: 'q5', topic: 't5', type: 'mc',
    prompt: '¿Cuál es el desarrollo de $(a-b)^2$?',
    options: ['$a^2-2ab+b^2$', '$a^2-b^2$', '$a^2+b^2$', '$a^2-ab+b^2$'],
    correct: 0,
    explanation: '$(a-b)(a-b)=a^2-ab-ab+b^2=a^2-2ab+b^2$. El 2 aparece porque el producto $ab$ sale dos veces.',
  },
  {
    id: 'q6', topic: 't5', type: 'tf',
    prompt: '$(3x^3)^2=9x^5$',
    correct: false,
    explanation: 'Falso. En una [[potencia de potencia]] los exponentes se multiplican: $(x^3)^2=x^{3\\cdot 2}=x^6$. Entonces $(3x^3)^2=9x^6$.',
  },
  {
    id: 'q7', topic: 't6', type: 'mc',
    prompt: 'El producto de [[binomios conjugados]] $(m+n)(m-n)$ es igual a:',
    options: ['$m^2-n^2$', '$m^2+2mn-n^2$', '$m^2+n^2$', '$m^2-2mn+n^2$'],
    correct: 0,
    explanation: 'Los productos cruzados $-mn$ y $+mn$ se cancelan, por eso queda una diferencia de cuadrados: $m^2-n^2$.',
  },
  {
    id: 'q8', topic: 't7', type: 'mc',
    prompt: 'En $(x+a)(x+b)=x^2+(a+b)x+ab$, ¿qué representa $a+b$?',
    options: [
      'La suma de los términos no comunes; es el coeficiente del término central',
      'El producto de los términos no comunes',
      'El cuadrado del término común',
      'Siempre vale cero',
    ],
    correct: 0,
    explanation: 'Al multiplicar salen $ax$ y $bx$, que son semejantes: juntos dan $(a+b)x$. El producto $ab$ es el término independiente.',
  },
  {
    id: 'q9', topic: 't8', type: 'tf',
    prompt: '$(a-b)^3=a^3-b^3$',
    correct: false,
    explanation: 'Falso. Faltan los términos intermedios: $(a-b)^3=a^3-3a^2b+3ab^2-b^3$.',
  },
  {
    id: 'q10', topic: 't8', type: 'mc',
    prompt: '¿Cuántos términos tiene el desarrollo de $(a-b)^3$ y cómo van sus signos?',
    options: [
      '4 términos, con signos alternados $+,-,+,-$',
      '2 términos, $+$ y $-$',
      '3 términos, todos positivos',
      '4 términos, todos negativos',
    ],
    correct: 0,
    explanation: 'Tiene 4 términos con coeficientes 1, 3, 3, 1. Como $b$ es negativo, sus potencias impares cambian el signo: $+,-,+,-$.',
  },
  {
    id: 'q11', topic: 't9', type: 'mc',
    prompt: '¿Cuál es el [[factor común]] de $6x^3-9x^2$?',
    options: ['$3x^2$', '$3x$', '$x^2$', '$6x^3$'],
    correct: 0,
    explanation: 'El [[MCD]] de 6 y 9 es 3, y la letra común $x$ va con su menor exponente: $x^2$. Así $6x^3-9x^2=3x^2(2x-3)$.',
  },
  {
    id: 'q12', topic: 't10', type: 'tf',
    prompt: 'Para factorizar por [[agrupación]] se forman grupos con factor común y luego se saca el binomio que se repite.',
    correct: true,
    explanation: 'Verdadero. Ejemplo: $a^2+ab+ax+bx=a(a+b)+x(a+b)=(a+b)(a+x)$.',
  },
];
