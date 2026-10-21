/**
 * RequiredMark — pieza interna (no exportada en el índice) del asterisco de
 * campo obligatorio. Sprint A11y-4, 21/10/2026 · audit §H. Decisión de Carol:
 * asterisco.
 *
 * El asterisco es solo visual (`aria-hidden`): lo que dice "required" al
 * lector de pantalla es el atributo `required` / `aria-required` del propio
 * control, que pone cada componente. Así no se lee "asterisco".
 *
 * La pantalla que use asteriscos debe explicarlo una vez ("* Required
 * field") — WCAG 3.3.2. Eso es del consumidor, no del campo.
 */
import React from 'react';
import { injectStyles } from './_inputBase';

injectStyles('ds-required-mark', `
.ds-required-mark {
  color:       var(--ds-input-fg-required);
  margin-left: 0.15em;
}
`);

export function RequiredMark({ show = true }) {
  if (!show) return null;
  return <span className="ds-required-mark" aria-hidden="true">*</span>;
}

export default RequiredMark;
