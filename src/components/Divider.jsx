/**
 * Divider — Componente atómico
 * CS Design System · v1.0
 *
 * Barra divisoria horizontal. En Figma (node 30156:87202) es una barra sólida
 * de 1px de alto pintada con fill, no un border-bottom — así se replica aquí
 * (height + background), pero el token se llama --ds-divider-border-color-generic
 * porque semánticamente es un color de borde/divisor: ese mismo valor se consume
 * como border-bottom-color en las filas de Description List y la familia Cell.
 * El nombre describe QUÉ es, no qué propiedad CSS lo pinta en cada sitio.
 *
 * Altura 1px vía --ds-border-width-sm (token, no px suelto).
 *
 * USO:
 *   <Divider />
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-divider {
  width:       100%;
  height:      var(--ds-border-width-sm);            /* 1px */
  flex:        0 0 auto;
  background:  var(--ds-divider-border-color-generic); /* #EEEFF1 */
  border:      0;
}
`;

injectStyles('ds-divider', css);

export function Divider({ className }) {
  const classes = ['ds-divider', className || ''].filter(Boolean).join(' ');
  return <hr className={classes} role="separator" aria-orientation="horizontal" />;
}

Divider.displayName = 'Divider';
export default Divider;
