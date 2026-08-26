/**
 * DescriptionText — Componente atómico
 * CS Design System · v1.0
 *
 * Texto plano de descripción. Consolidado desde el markup fijo (color/tamaño
 * únicos) que Selector/AccountSelector tenían embebido — ahora expone el
 * rango real de color que Figma define.
 *
 * Es el valor por defecto del slot Description de List View/Selector,
 * intercambiable por `Text` cuando la fila necesita más énfasis (ver Text.jsx).
 *
 * USO:
 *   <DescriptionText>Description</DescriptionText>
 *   <DescriptionText color="default" size="16">Texto normal</DescriptionText>
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-description-text {
  margin: 0;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  white-space: nowrap;
  color: var(--ds-description-text-fg-subtle);
}

.ds-description-text--14 { font-size: var(--ds-fontSize-body-xs); line-height: var(--ds-lineHeight-2xs); } /* 14/21 */
.ds-description-text--16 { font-size: var(--ds-fontSize-body-sm); line-height: var(--ds-lineHeight-xs);  } /* 16/24 */

.ds-description-text--default  { color: var(--ds-description-text-fg-default); }
.ds-description-text--disabled { color: var(--ds-description-text-fg-disabled); }
`;

injectStyles('ds-description-text', css);

export function DescriptionText({
  children,
  color = 'subtle', // 'subtle' | 'default' | 'disabled'
  size  = '14',       // '14' | '16'
  id,
  className,
}) {
  const classes = [
    'ds-description-text',
    `ds-description-text--${size}`,
    color !== 'subtle' ? `ds-description-text--${color}` : '',
    className || '',
  ].filter(Boolean).join(' ');

  return <p id={id} className={classes}>{children}</p>;
}

export default DescriptionText;
