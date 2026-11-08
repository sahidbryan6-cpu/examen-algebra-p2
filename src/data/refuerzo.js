/**
 * Refuerzo: explicación completa por tema (sobre el ejercicio del portafolio)
 * y banco fijo de 2 ejercicios nuevos por tema (20 en total).
 * Cada `answer` se verifica contra `original` en scripts/verify.test.js.
 * `values` son los números para la verificación por sustitución (se calcula sola).
 */

export const EXPLANATIONS = {
  t1: {
    idea: 'Sumar polinomios es juntar los [[términos semejantes]]. Sirve para simplificar cualquier expresión antes de resolver ecuaciones o evaluar.',
    rule: {
      tex: 'a\\,x^{k} + b\\,x^{k} = (a+b)\\,x^{k}',
      meaning: [
        '$a$ y $b$ son los [[coeficientes]]: los números que multiplican a la letra.',
        '$x^{k}$ es la parte literal: la letra y su [[exponente]]. Debe ser idéntica en ambos términos.',
        'El exponente $k$ NO cambia: se suman "cuántos hay", no "qué son".',
      ],
    },
    values: { x: 2 },
    steps: [
      { que: 'Quito los paréntesis.', porque: 'Un $+$ delante del paréntesis equivale a multiplicar por $+1$: ningún signo cambia.', para: 'Tener todos los términos sueltos y verlos juntos.', tex: '5x^3-7x^2+8x+3x^3-8x^2+3+8x^2+3x+2' },
      { que: 'Agrupo los [[términos semejantes]] (misma letra, mismo exponente).', porque: 'La suma es conmutativa y asociativa: puedo reordenar y agrupar sin cambiar el resultado.', para: 'Ver qué términos se pueden reducir.', tex: '(5x^3+3x^3)+(-7x^2-8x^2+8x^2)+(8x+3x)+(3+2)' },
      { que: 'Sumo solo los coeficientes de cada grupo: $5+3=8$; $-7-8+8=-7$; $8+3=11$; $3+2=5$.', porque: '[[Propiedad distributiva]] al revés: $5x^3+3x^3=(5+3)x^3$. El exponente se queda igual.', para: 'Reducir cada grupo a un solo término.', tex: '8x^3-7x^2+11x+5' },
      { que: 'Ordeno de mayor a menor exponente.', porque: 'Es la forma estándar de escribir un [[polinomio]].', para: 'Facilita comparar y revisar el resultado.', tex: '8x^3-7x^2+11x+5' },
    ],
    error: 'Sumar los exponentes ($5x^3+3x^3=8x^6$) o juntar términos no semejantes ($11x+5=16x$). Para evitarlo: antes de sumar, subraya con el mismo color los términos con la misma parte literal.',
    resumen: 'Sumar polinomios es sumar los coeficientes de los términos semejantes, sin tocar los exponentes.',
  },
  t2: {
    idea: 'Restar polinomios es sumar el opuesto del [[sustraendo]]. Es la base para comparar expresiones y despejar en ecuaciones.',
    rule: {
      tex: 'A - B = A + (-B)',
      meaning: [
        '$A$ es el [[minuendo]] (del que se resta) y $B$ el [[sustraendo]] (lo que se resta).',
        '$-B$ es el opuesto de $B$: cada término de $B$ con el signo cambiado.',
        '"De $A$ restar $B$" se escribe $A-B$: el orden importa.',
      ],
    },
    values: { x: 2 },
    steps: [
      { que: 'Escribo minuendo menos sustraendo, con paréntesis.', porque: '"De $A$ restar $B$" significa $A-B$.', para: 'No perder ningún signo.', tex: '(3x^3-5x^2+3)-(-4x^3+7x^2-5)' },
      { que: 'Quito el paréntesis del sustraendo cambiando el signo de CADA término: $-(-4x^3)=+4x^3$, $-(+7x^2)=-7x^2$, $-(-5)=+5$.', porque: '[[Ley de signos]]: el $-$ multiplica a todos los términos; menos por menos da más y menos por más da menos.', para: 'Convertir la resta en una suma.', tex: '3x^3-5x^2+3+4x^3-7x^2+5' },
      { que: 'Agrupo [[términos semejantes]].', porque: 'Propiedades conmutativa y asociativa de la suma.', para: 'Ver qué se puede reducir.', tex: '(3x^3+4x^3)+(-5x^2-7x^2)+(3+5)' },
      { que: 'Sumo coeficientes: $3+4=7$; $-5-7=-12$; $3+5=8$.', porque: 'Solo se suman coeficientes de términos semejantes.', para: 'Llegar al resultado reducido.', tex: '7x^3-12x^2+8' },
    ],
    error: 'Cambiar solo el primer signo del sustraendo (da $7x^3+2x^2-2$). Para evitarlo: escribe el sustraendo entre paréntesis y cambia los signos uno por uno antes de sumar.',
    resumen: 'Para restar, cambia el signo de todos los términos del sustraendo y suma.',
  },
  t3: {
    idea: 'Multiplicar polinomios es repartir cada término del primero sobre cada término del segundo. Sirve para desarrollar productos y áreas.',
    rule: {
      tex: '(p+q)(r+s)=pr+ps+qr+qs',
      meaning: [
        'Cada término del primer paréntesis ($p$, $q$) multiplica a cada término del segundo ($r$, $s$).',
        'Con 2 y 2 términos salen $2\\times 2=4$ productos.',
        'Al multiplicar: se multiplican los coeficientes, las letras iguales suman exponentes y las letras distintas se escriben juntas.',
      ],
    },
    values: { x: 2, a: 3 },
    steps: [
      { que: 'Multiplico $5x\\cdot 3a$: coeficientes $5\\cdot 3=15$; letras distintas se escriben juntas.', porque: 'Propiedad conmutativa y asociativa del producto.', para: 'Obtener el primer producto.', tex: '5x\\cdot 3a = 15ax' },
      { que: 'Multiplico $5x\\cdot 5$.', porque: '[[Propiedad distributiva]].', para: 'Segundo producto.', tex: '5x\\cdot 5 = 25x' },
      { que: 'Multiplico $(-3)\\cdot 3a$: menos por más da menos.', porque: '[[Ley de signos]].', para: 'Tercer producto.', tex: '(-3)\\cdot 3a=-9a' },
      { que: 'Multiplico $(-3)\\cdot 5$.', porque: '[[Ley de signos]].', para: 'Cuarto producto.', tex: '(-3)\\cdot 5=-15' },
      { que: 'Junto los 4 productos y busco [[términos semejantes]]: $ax$, $x$, $a$ y un número. Todos son distintos.', porque: 'Solo se reducen términos con la misma parte literal.', para: 'Confirmar que el resultado ya está simplificado.', tex: '15ax+25x-9a-15' },
    ],
    error: 'Juntar $25x$ y $-9a$ como si fueran semejantes. Para evitarlo: compara la parte literal completa; $x$ y $a$ son letras distintas.',
    resumen: 'Cada término del primer factor multiplica a cada término del segundo, y al final se reducen solo los semejantes.',
  },
  t4: {
    idea: 'Dividir $x^3+y^3$ entre $x+y$ es más fácil si se reconoce una [[suma de cubos]]: se factoriza y se simplifica.',
    rule: {
      tex: 'a^3+b^3=(a+b)(a^2-ab+b^2)',
      meaning: [
        '$a$ y $b$ son las raíces cúbicas de cada término.',
        'El primer factor $(a+b)$ lleva el mismo signo que la suma.',
        'En el segundo factor el término central $-ab$ lleva el signo contrario.',
      ],
    },
    values: { x: 2, y: 1 },
    steps: [
      { que: 'Reconozco la suma de cubos: $x^3=(x)^3$ y $y^3=(y)^3$, así que $a=x$ y $b=y$.', porque: 'Cada término es un cubo perfecto.', para: 'Poder usar la fórmula.', tex: 'x^3+y^3 = (x)^3+(y)^3' },
      { que: 'Factorizo el dividendo con la fórmula.', porque: '[[Suma de cubos]].', para: 'Que aparezca el divisor $(x+y)$ como factor.', tex: 'x^3+y^3=(x+y)(x^2-xy+y^2)' },
      { que: 'Divido: el factor $(x+y)$ de arriba y el de abajo se cancelan.', porque: 'Cualquier cantidad distinta de cero dividida entre sí misma da 1.', para: 'Obtener el cociente.', tex: '\\dfrac{(x+y)(x^2-xy+y^2)}{x+y}=x^2-xy+y^2' },
      { que: 'Compruebo multiplicando cociente por divisor.', porque: 'En una división exacta, cociente × divisor = dividendo.', para: 'Asegurar que el residuo es 0.', tex: '(x+y)(x^2-xy+y^2)=x^3-x^2y+xy^2+x^2y-xy^2+y^3=x^3+y^3' },
    ],
    error: 'Escribir $x^2+xy+y^2$ (signo del término central). Para evitarlo: comprueba multiplicando; con $+xy$ no se cancelan los términos centrales.',
    resumen: 'Una suma de cubos se divide entre $(a+b)$ y da $a^2-ab+b^2$.',
  },
  t5: {
    idea: 'El cuadrado de un binomio es un [[producto notable]]: se desarrolla sin multiplicar término a término.',
    rule: {
      tex: '(a-b)^2=a^2-2ab+b^2',
      meaning: [
        '$a$ es el primer término y $b$ el segundo, sin su signo.',
        '$a^2$ y $b^2$ siempre son positivos.',
        'El $2$ aparece porque $(a-b)(a-b)$ produce dos veces el producto $ab$: $-ab$ y $-ba$.',
        'El signo de $2ab$ es el del binomio: menos si es resta.',
      ],
    },
    values: { x: 2 },
    steps: [
      { que: 'Identifico $a=3x^3$ y $b=9$.', porque: 'Es un [[binomio]] restado elevado al cuadrado.', para: 'Saber qué sustituir en la fórmula.', tex: 'a=3x^3,\\quad b=9' },
      { que: 'Calculo $a^2$: el coeficiente se eleva ($3^2=9$) y el exponente se multiplica ($3\\cdot 2=6$).', porque: '[[Potencia de potencia]]: $(x^m)^n=x^{mn}$.', para: 'Primer término.', tex: '(3x^3)^2=9x^6' },
      { que: 'Calculo el doble producto $2ab$ y le pongo signo menos.', porque: 'El binomio es una resta.', para: 'Término central.', tex: '-2\\cdot 3x^3\\cdot 9=-54x^3' },
      { que: 'Calculo $b^2$.', porque: 'Un número al cuadrado siempre es positivo.', para: 'Último término.', tex: '9^2=81' },
      { que: 'Uno los tres términos.', porque: 'Fórmula del [[trinomio]] cuadrado perfecto.', para: 'Resultado final.', tex: '9x^6-54x^3+81' },
    ],
    error: 'Escribir $9x^6+81$ (olvidar el doble producto). Para evitarlo: recuerda que el cuadrado de un binomio siempre tiene 3 términos.',
    resumen: 'Cuadrado del primero, menos (o más) el doble del primero por el segundo, más el cuadrado del segundo.',
  },
  t6: {
    idea: 'Los [[binomios conjugados]] son dos binomios iguales salvo un signo. Su producto es una diferencia de cuadrados.',
    rule: {
      tex: '(a+b)(a-b)=a^2-b^2',
      meaning: [
        '$a$ es el término que tiene el mismo signo en ambos binomios.',
        '$b$ es el término que cambia de signo.',
        'No hay término central: $+ab$ y $-ab$ se cancelan.',
      ],
    },
    values: { x: 2, y: 1, n: 1, a: 1 },
    steps: [
      { que: 'Identifico $a=6x^{2n}$ (mismo signo) y $b=3y^{3a}$ (signo opuesto).', porque: 'Son [[binomios conjugados]].', para: 'Usar la fórmula.', tex: 'a=6x^{2n},\\quad b=3y^{3a}' },
      { que: 'Calculo $a^2$: $6^2=36$ y el exponente se multiplica por 2: $2n\\cdot 2=4n$.', porque: '[[Potencia de potencia]].', para: 'Primer término.', tex: '(6x^{2n})^2=36x^{4n}' },
      { que: 'Calculo $b^2$: $3^2=9$ y $3a\\cdot 2=6a$.', porque: '[[Potencia de potencia]].', para: 'Segundo término.', tex: '(3y^{3a})^2=9y^{6a}' },
      { que: 'Verifico que los productos cruzados se cancelan.', porque: '$ab-ab=0$.', para: 'Entender por qué no hay término central.', tex: '+18x^{2n}y^{3a}-18x^{2n}y^{3a}=0' },
      { que: 'Escribo la diferencia de cuadrados.', porque: 'Fórmula de conjugados.', para: 'Resultado final.', tex: '36x^{4n}-9y^{6a}' },
    ],
    error: 'Poner un término central como si fuera un binomio al cuadrado. Para evitarlo: si los binomios solo difieren en un signo, el resultado tiene exactamente 2 términos.',
    resumen: 'Conjugados: cuadrado del primero menos cuadrado del segundo.',
  },
  t7: {
    idea: 'Dos binomios con un término común se multiplican con un atajo: el término central es la suma de los no comunes por el común.',
    rule: {
      tex: '(u+a)(u+b)=u^2+(a+b)\\,u+ab',
      meaning: [
        '$u$ es el término común (aparece en ambos binomios).',
        '$a$ y $b$ son los no comunes, con su signo.',
        '$(a+b)$ sale de juntar $au+bu$, que son semejantes; $ab$ es el término independiente.',
      ],
    },
    values: { x: 2, n: 1 },
    steps: [
      { que: 'Identifico $u=5x^{2n}$, $a=2$ y $b=-3$.', porque: 'Ambos binomios empiezan con $5x^{2n}$.', para: 'Aplicar la fórmula.', tex: 'u=5x^{2n},\\ a=2,\\ b=-3' },
      { que: 'Calculo $u^2$: $5\\cdot 5=25$ y $x^{2n}\\cdot x^{2n}=x^{4n}$ (los exponentes se suman).', porque: 'Producto de potencias de igual base.', para: 'Primer término.', tex: 'u^2=25x^{4n}' },
      { que: 'Calculo $(a+b)u$: $2+(-3)=-1$.', porque: 'Los términos $2u$ y $-3u$ son semejantes.', para: 'Término central.', tex: '(2-3)\\cdot 5x^{2n}=-5x^{2n}' },
      { que: 'Calculo $ab$: $2\\cdot(-3)=-6$.', porque: '[[Ley de signos]].', para: 'Término independiente.', tex: 'ab=-6' },
      { que: 'Uno los tres términos.', porque: 'Fórmula del término común.', para: 'Resultado final.', tex: '25x^{4n}-5x^{2n}-6' },
    ],
    error: 'Olvidar el término central o equivocar su signo. Para evitarlo: calcula aparte $a+b$ con sus signos antes de multiplicar.',
    resumen: 'Común al cuadrado, más la suma de los no comunes por el común, más el producto de los no comunes.',
  },
  t8: {
    idea: 'El cubo de un binomio es un [[producto notable]] de 4 términos. Evita multiplicar el binomio tres veces.',
    rule: {
      tex: '(a-b)^3=a^3-3a^2b+3ab^2-b^3',
      meaning: [
        'Los coeficientes $1,3,3,1$ vienen del triángulo de Pascal.',
        'El exponente de $a$ baja ($3,2,1,0$) y el de $b$ sube ($0,1,2,3$).',
        'Con resta los signos alternan $+,-,+,-$ porque las potencias impares de $-b$ son negativas.',
      ],
    },
    values: { x: 2, y: 1 },
    steps: [
      { que: 'Identifico $a=3x^2$ y $b=4y$.', porque: 'Binomio restado al cubo.', para: 'Sustituir en la fórmula.', tex: 'a=3x^2,\\quad b=4y' },
      { que: 'Calculo $a^3$: $3^3=27$ y $(x^2)^3=x^6$.', porque: '[[Potencia de potencia]].', para: 'Primer término.', tex: '(3x^2)^3=27x^6' },
      { que: 'Calculo $3a^2b$: $3\\cdot 9x^4\\cdot 4y$; coeficientes $3\\cdot 9\\cdot 4=108$; signo menos.', porque: 'Fórmula; potencia impar de $-b$.', para: 'Segundo término.', tex: '-3(3x^2)^2(4y)=-108x^4y' },
      { que: 'Calculo $3ab^2$: $3\\cdot 3x^2\\cdot 16y^2$; coeficientes $3\\cdot 3\\cdot 16=144$; signo más.', porque: 'Potencia par de $-b$.', para: 'Tercer término.', tex: '3(3x^2)(4y)^2=144x^2y^2' },
      { que: 'Calculo $b^3$: $4^3=64$; signo menos.', porque: 'Potencia impar.', para: 'Último término.', tex: '-(4y)^3=-64y^3' },
      { que: 'Uno los cuatro términos.', porque: 'Fórmula del cubo.', para: 'Resultado final.', tex: '27x^6-108x^4y+144x^2y^2-64y^3' },
    ],
    error: 'Escribir solo $a^3-b^3$ (omitir los términos intermedios). Para evitarlo: el cubo de un binomio siempre tiene 4 términos.',
    resumen: 'Cubo del primero, menos 3 por el primero al cuadrado por el segundo, más 3 por el primero por el segundo al cuadrado, menos el cubo del segundo.',
  },
  t9: {
    idea: 'Sacar [[factor común]] es lo contrario de la propiedad distributiva. Es el primer paso de toda factorización.',
    rule: {
      tex: 'ab+ac+ad=a(b+c+d)',
      meaning: [
        '$a$ es el factor común: el [[MCD]] de los coeficientes por las letras presentes en TODOS los términos (con su menor exponente).',
        '$b$, $c$ y $d$ son lo que queda al dividir cada término entre $a$.',
      ],
    },
    values: { y: 2 },
    steps: [
      { que: 'Busco el [[MCD]] de los coeficientes 4, 10 y 4.', porque: 'El factor común debe dividir exactamente a todos.', para: 'Hallar la parte numérica del factor común.', tex: '\\text{MCD}(4,10,4)=2' },
      { que: 'Reviso las letras: $y$ no aparece en $-4$.', porque: 'Una letra solo es común si está en todos los términos.', para: 'Saber si hay parte literal común.', tex: '\\text{letra común: ninguna}' },
      { que: 'Divido cada término entre 2.', porque: 'Lo que queda dentro del paréntesis es cada término entre el factor común.', para: 'Obtener el polinomio interior.', tex: '\\tfrac{4y^5}{2}=2y^5,\\ \\tfrac{-10y^3}{2}=-5y^3,\\ \\tfrac{-4}{2}=-2' },
      { que: 'Escribo el factor común por el paréntesis.', porque: '[[Propiedad distributiva]] al revés.', para: 'Resultado factorizado.', tex: '2(2y^5-5y^3-2)' },
      { que: 'Reviso el paréntesis: 2, 5 y 2 no tienen divisor común y no hay letra común. No se factoriza más con enteros.', porque: 'Una factorización está completa cuando ningún factor se puede descomponer más.', para: 'Asegurar que la factorización es completa.', tex: '2(2y^5-5y^3-2)' },
    ],
    error: 'Dejar el polinomio sin factorizar, o dividir solo algunos términos. Para evitarlo: multiplica tu resultado y comprueba que regresa al original.',
    resumen: 'Saca el MCD y las letras comunes, y divide cada término entre ese factor.',
  },
  t10: {
    idea: 'Cuando no hay un factor común a todos los términos, a veces se puede [[agrupación|agrupar]] en parejas que sí lo tengan.',
    rule: {
      tex: 'ab+ac+db+dc=a(b+c)+d(b+c)=(b+c)(a+d)',
      meaning: [
        'Se agrupan términos que comparten un factor ($a$ en los dos primeros, $d$ en los dos últimos).',
        'Si en ambos grupos queda el mismo [[binomio]] $(b+c)$, ese binomio es el nuevo factor común.',
      ],
    },
    values: { a: 2, b: 3, x: 5 },
    steps: [
      { que: 'Formo dos grupos.', porque: 'Asociatividad de la suma.', para: 'Que cada grupo tenga su propio factor común.', tex: '(a^2+ab)+(ax+bx)' },
      { que: 'Saco [[factor común]] de cada grupo: $a$ del primero y $x$ del segundo.', porque: '[[Propiedad distributiva]] al revés.', para: 'Que aparezca el mismo binomio.', tex: 'a(a+b)+x(a+b)' },
      { que: 'Saco el binomio que se repite, $(a+b)$, como factor común.', porque: 'Es un factor común de toda la expresión.', para: 'Convertir la suma en producto.', tex: '(a+b)(a+x)' },
      { que: 'Compruebo multiplicando.', porque: 'Factorizar y multiplicar son operaciones inversas.', para: 'Verificar el resultado.', tex: '(a+b)(a+x)=a^2+ax+ab+bx' },
    ],
    error: 'Quedarse en $a(a+b)+x(a+b)$: todavía es una suma, no un producto. Para evitarlo: termina sacando el binomio repetido.',
    resumen: 'Agrupa en parejas con factor común y saca el binomio que se repite.',
  },
};

/** Banco fijo: 2 ejercicios nuevos por tema. */
export const BANK = [
  { id: 'r1a', topic: 't1', form: 'simplified', expVars: [], statement: 'Hallar la suma:', tex: '(2x^3+4x^2-x)+(x^3-6x^2+5)', original: '(2x^3+4x^2-x)+(x^3-6x^2+5)', answer: '3x^3-2x^2-x+5', values: { x: 2 },
    steps: ['2x^3+4x^2-x+x^3-6x^2+5', '(2x^3+x^3)+(4x^2-6x^2)-x+5', '3x^3-2x^2-x+5'] },
  { id: 'r1b', topic: 't1', form: 'simplified', expVars: [], statement: 'Hallar la suma:', tex: '(4a^2-3a+1)+(-a^2+5a-7)+(2a^2-a)', original: '(4a^2-3a+1)+(-a^2+5a-7)+(2a^2-a)', answer: '5a^2+a-6', values: { a: 2 },
    steps: ['4a^2-3a+1-a^2+5a-7+2a^2-a', '(4a^2-a^2+2a^2)+(-3a+5a-a)+(1-7)', '5a^2+a-6'] },
  { id: 'r2a', topic: 't2', form: 'simplified', expVars: [], statement: 'De $5x^3+2x-4$ restar $2x^3-3x+1$', tex: '(5x^3+2x-4)-(2x^3-3x+1)', original: '(5x^3+2x-4)-(2x^3-3x+1)', answer: '3x^3+5x-5', values: { x: 2 },
    steps: ['5x^3+2x-4-2x^3+3x-1', '(5x^3-2x^3)+(2x+3x)+(-4-1)', '3x^3+5x-5'] },
  { id: 'r2b', topic: 't2', form: 'simplified', expVars: [], statement: 'De $6y^2-y+3$ restar $-2y^2+4y-3$', tex: '(6y^2-y+3)-(-2y^2+4y-3)', original: '(6y^2-y+3)-(-2y^2+4y-3)', answer: '8y^2-5y+6', values: { y: 2 },
    steps: ['6y^2-y+3+2y^2-4y+3', '(6y^2+2y^2)+(-y-4y)+(3+3)', '8y^2-5y+6'] },
  { id: 'r3a', topic: 't3', form: 'simplified', expVars: [], statement: 'Multiplicar:', tex: '(2x+5)(4b-3)', original: '(2x+5)(4b-3)', answer: '8bx-6x+20b-15', values: { x: 2, b: 3 },
    steps: ['2x\\cdot 4b+2x\\cdot(-3)+5\\cdot 4b+5\\cdot(-3)', '8bx-6x+20b-15'] },
  { id: 'r3b', topic: 't3', form: 'simplified', expVars: [], statement: 'Multiplicar:', tex: '(3y-4)(2y+7)', original: '(3y-4)(2y+7)', answer: '6y^2+13y-28', values: { y: 2 },
    steps: ['3y\\cdot 2y+3y\\cdot 7-4\\cdot 2y-4\\cdot 7', '6y^2+21y-8y-28', '6y^2+13y-28'] },
  { id: 'r4a', topic: 't4', form: 'simplified', expVars: [], statement: 'Dividir $a^3-b^3$ entre $a-b$', tex: '\\dfrac{a^3-b^3}{a-b}', original: '(a^3-b^3)/(a-b)', answer: 'a^2+ab+b^2', values: { a: 3, b: 1 },
    steps: ['a^3-b^3=(a-b)(a^2+ab+b^2)', '\\dfrac{(a-b)(a^2+ab+b^2)}{a-b}', 'a^2+ab+b^2'] },
  { id: 'r4b', topic: 't4', form: 'simplified', expVars: [], statement: 'Dividir $8x^3+27$ entre $2x+3$', tex: '\\dfrac{8x^3+27}{2x+3}', original: '(8x^3+27)/(2x+3)', answer: '4x^2-6x+9', values: { x: 2 },
    steps: ['8x^3+27=(2x)^3+3^3', '(2x+3)\\left((2x)^2-2x\\cdot 3+3^2\\right)', '4x^2-6x+9'] },
  { id: 'r5a', topic: 't5', form: 'simplified', expVars: [], statement: 'Desarrollar:', tex: '(2x^2+5)^2', original: '(2x^2+5)^2', answer: '4x^4+20x^2+25', values: { x: 2 },
    steps: ['(2x^2)^2+2(2x^2)(5)+5^2', '4x^4+20x^2+25'] },
  { id: 'r5b', topic: 't5', form: 'simplified', expVars: [], statement: 'Desarrollar:', tex: '(4y-3)^2', original: '(4y-3)^2', answer: '16y^2-24y+9', values: { y: 2 },
    steps: ['(4y)^2-2(4y)(3)+3^2', '16y^2-24y+9'] },
  { id: 'r6a', topic: 't6', form: 'simplified', expVars: [], statement: 'Desarrollar:', tex: '(5a^3+2b)(5a^3-2b)', original: '(5a^3+2b)(5a^3-2b)', answer: '25a^6-4b^2', values: { a: 2, b: 1 },
    steps: ['(5a^3)^2-(2b)^2', '25a^6-4b^2'] },
  { id: 'r6b', topic: 't6', form: 'simplified', expVars: ['n'], statement: 'Desarrollar:', tex: '(7x^{3n}+4)(7x^{3n}-4)', original: '(7x^(3n)+4)(7x^(3n)-4)', answer: '49x^(6n)-16', values: { x: 2, n: 1 },
    steps: ['(7x^{3n})^2-4^2', '49x^{6n}-16'] },
  { id: 'r7a', topic: 't7', form: 'simplified', expVars: ['n'], statement: 'Resolver el producto:', tex: '(x^{2n}+5)(x^{2n}-2)', original: '(x^(2n)+5)(x^(2n)-2)', answer: 'x^(4n)+3x^(2n)-10', values: { x: 2, n: 1 },
    steps: ['(x^{2n})^2+(5-2)x^{2n}+5\\cdot(-2)', 'x^{4n}+3x^{2n}-10'] },
  { id: 'r7b', topic: 't7', form: 'simplified', expVars: [], statement: 'Resolver el producto:', tex: '(4y+3)(4y-7)', original: '(4y+3)(4y-7)', answer: '16y^2-16y-21', values: { y: 2 },
    steps: ['(4y)^2+(3-7)\\cdot 4y+3\\cdot(-7)', '16y^2-16y-21'] },
  { id: 'r8a', topic: 't8', form: 'simplified', expVars: [], statement: 'Desarrollar:', tex: '(2x+y)^3', original: '(2x+y)^3', answer: '8x^3+12x^2y+6xy^2+y^3', values: { x: 2, y: 1 },
    steps: ['(2x)^3+3(2x)^2y+3(2x)y^2+y^3', '8x^3+12x^2y+6xy^2+y^3'] },
  { id: 'r8b', topic: 't8', form: 'simplified', expVars: [], statement: 'Desarrollar:', tex: '(x^2-3)^3', original: '(x^2-3)^3', answer: 'x^6-9x^4+27x^2-27', values: { x: 2 },
    steps: ['(x^2)^3-3(x^2)^2(3)+3(x^2)(3)^2-3^3', 'x^6-9x^4+27x^2-27'] },
  { id: 'r9a', topic: 't9', form: 'factored', expVars: [], statement: 'Factorar:', tex: '6x^4-9x^2+15', original: '6x^4-9x^2+15', answer: '3(2x^4-3x^2+5)', values: { x: 2 },
    steps: ['\\text{MCD}(6,9,15)=3;\\ x \\text{ no está en } 15', '3(2x^4-3x^2+5)'] },
  { id: 'r9b', topic: 't9', form: 'factored', expVars: [], statement: 'Factorar:', tex: '8y^6-12y^4+20y', original: '8y^6-12y^4+20y', answer: '4y(2y^5-3y^3+5)', values: { y: 2 },
    steps: ['\\text{MCD}(8,12,20)=4;\\ \\text{letra común } y^{1}', '4y(2y^5-3y^3+5)'] },
  { id: 'r10a', topic: 't10', form: 'factored', expVars: [], statement: 'Factorar:', tex: 'x^2+xy+2x+2y', original: 'x^2+xy+2x+2y', answer: '(x+y)(x+2)', values: { x: 2, y: 3 },
    steps: ['(x^2+xy)+(2x+2y)', 'x(x+y)+2(x+y)', '(x+y)(x+2)'] },
  { id: 'r10b', topic: 't10', form: 'factored', expVars: [], statement: 'Factorar:', tex: '3a+3b+ax+bx', original: '3a+3b+ax+bx', answer: '(a+b)(3+x)', values: { a: 2, b: 3, x: 5 },
    steps: ['(3a+3b)+(ax+bx)', '3(a+b)+x(a+b)', '(a+b)(3+x)'] },
];
