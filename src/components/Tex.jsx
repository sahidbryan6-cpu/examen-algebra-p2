import katex from 'katex';
import 'katex/dist/katex.min.css';
import { memo } from 'react';

/** Renderiza LaTeX con KaTeX. Nunca lanza: si algo falla muestra el texto. */
export const Tex = memo(function Tex({ tex, display = false, className = '' }) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: 'ignore' });
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
});
