/**
 * LabelDescription — Componente atómico
 * CS Design System · v1.0
 *
 * Label + HelperText apilados, para el encabezado de File Upload. No lleva
 * tokens propios de color — reutiliza `--ds-input-fg-label` (mismo que
 * Input*) y el átomo HelperText.jsx tal cual, sin reimplementar nada.
 *
 * `align`: 'left' | 'right' — solo text-align, no reposiciona el bloque.
 *
 * USO:
 *   <LabelDescription label="Documentos" description="Formatos aceptados: PDF, JPG" />
 *   <LabelDescription align="right" label="Documentos" description="..." />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { HelperText } from './HelperText';

const css = `
.ds-label-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}
.ds-label-description--right { align-items: flex-end; text-align: right; }
.ds-label-description--left  { align-items: flex-start; text-align: left; }

.ds-label-description__label {
  margin: 0;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-label-md);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-input-fg-label);
}
`;

injectStyles('ds-label-description', css);

export function LabelDescription({
  align = 'left', // 'left' | 'right'
  label = 'Label',
  description = 'This is a short description of the input',
  id,
  className,
}) {
  const classes = [
    'ds-label-description',
    `ds-label-description--${align}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <p className="ds-label-description__label">{label}</p>
      <HelperText>{description}</HelperText>
    </div>
  );
}

export default LabelDescription;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<LabelDescription label="Documentos" description="Formatos aceptados: PDF, JPG (máx. 10MB)" />

<LabelDescription align="right" label="Adjuntar factura" description="Sube el justificante en PDF" />
*/
