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
 * Figma: `Helper` (set State=Generic|Disabled) en 🟢 Form Elements.
 * Tokens: color vía --ds-helper-text-fg-* (`helperText/all/text/fg/*`, Componente→Mode). Tipografía directa
 * de Device (Body/sm = Nunito Regular 16/24) — sin token de Componente, según la
 * regla de tipografía (CLAUDE.md §5). El `gap` respecto a otros elementos NO es
 * de este átomo: lo fija cada consumidor con su clase (Input usa
 * --ds-input-helper-gap, RadioGroup/CheckboxGroup --ds-choice-group-root-gap).
 *
 * Estados: generic (por defecto) · disabled.
 *
 * USO:
 *   <HelperText>Formato: DD/MM/AAAA</HelperText>
 *   <HelperText disabled>No disponible</HelperText>
 *   <HelperText>1-25 de 100</HelperText>   // contador de tabla
 */

import React from 'react';
import { injectStyles } from './_inputBase';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
/* sin margen propio: la separación la pone quien lo instancia (su clase) */
:where(.ds-helper-text) { margin: 0; }
.ds-helper-text {
  font-family: inherit;                          /* Nunito (fontFamily/default) */
  font-size:   var(--ds-fontSize-body-sm);       /* 16 */
  font-weight: var(--ds-font-weight-regular);    /* 400 */
  line-height: var(--ds-lineHeight-body-sm);          /* 24 */
  color:       var(--ds-helper-text-fg-generic);
}
.ds-helper-text--disabled { color: var(--ds-helper-text-fg-disabled); }
`;

injectStyles('ds-helper-text', css);

/* ─── HelperText ───────────────────────────────────────────────────────────── */

export function HelperText({ children, disabled = false, id, className }) {
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
