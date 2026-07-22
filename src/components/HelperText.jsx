/**
 * HelperText — Componente atómico
 * CS Design System · v1.0
 *
 * Texto de ayuda que acompaña a un campo de formulario o a un contador de
 * resultados. Siempre visible; NO reemplaza al mensaje de validación.
 *
 * Extraído de Input/InputCommon/helper el 22/07 como átomo propio. Dos
 * consumidores: formularios (Input*) y el contador de resultados de
 * TableContainer (ej. "1-25 de 100").
 *
 * Tokens: color vía --ds-helper-text-fg-* (Componente→Mode). Tipografía directa
 * de Device (Body/sm = Nunito Regular 16/24) — sin token de Componente, según la
 * regla de tipografía (CLAUDE.md §5). El `gap` respecto a otros elementos NO es
 * de este átomo: lo fija cada consumidor (Input usa --ds-input-helper-gap).
 *
 * Estados: generic (por defecto) · disabled.
 *
 * USO:
 *   <HelperText>Formato: DD/MM/AAAA</HelperText>
 *   <HelperText disabled>No disponible</HelperText>
 *   <HelperText>1-25 de 100</HelperText>   // contador de tabla
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-helper-text {
  margin:      0;
  font-family: inherit;                          /* Nunito (fontFamily/default) */
  font-size:   var(--ds-fontSize-body-sm);       /* 16 */
  font-weight: var(--ds-font-weight-regular);    /* 400 */
  line-height: var(--ds-lineHeight-xs);          /* 24 */
  color:       var(--ds-helper-text-fg-generic); /* #9AA1AA */
}
.ds-helper-text--disabled { color: var(--ds-helper-text-fg-disabled); }  /* #B9BEC4 */
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── HelperText ───────────────────────────────────────────────────────────── */

export function HelperText({ children, disabled = false, id, className }) {
  injectStyles();

  const classes = [
    'ds-helper-text',
    disabled ? 'ds-helper-text--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <p id={id} className={classes}>
      {children}
    </p>
  );
}

export default HelperText;
