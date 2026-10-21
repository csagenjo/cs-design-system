/**
 * LabelDescription — Componente atómico
 * CS Design System · v1.0
 *
 * Label + HelperText apilados, para el encabezado de File Upload. No lleva
 * tokens propios de color — instancia los átomos FieldLabel y HelperText
 * (los mismos que Input*), sin reimplementar nada.
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
import { FieldLabel } from './FieldLabel';

const css = `
.ds-label-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}
.ds-label-description--right { align-items: flex-end; text-align: right; }
.ds-label-description--left  { align-items: flex-start; text-align: left; }

`;

injectStyles('ds-label-description', css);

export function LabelDescription({
  align = 'left', // 'left' | 'right'
  label = 'Label',
  description = 'This is a short description of the input',
  labelId,        // ids para que el control los referencie (aria-describedby) — A11y-3
  descriptionId,
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
      <FieldLabel as="p" className="ds-label-description__label" id={labelId}>{label}</FieldLabel>
      <HelperText id={descriptionId}>{description}</HelperText>
    </div>
  );
}

export default LabelDescription;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<LabelDescription label="Documentos" description="Formatos aceptados: PDF, JPG (máx. 10MB)" />

<LabelDescription align="right" label="Adjuntar factura" description="Sube el justificante en PDF" />
*/
