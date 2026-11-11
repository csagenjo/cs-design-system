/**
 * Divider — Componente atómico
 * CS Design System · v1.1 (11/11/2026: alineado con Figma `Divider` 30156:87202 — alto enlazado al token, scopes, token disabled sin uso borrado)
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
  height:      var(--ds-divider-border-width-generic); /* 1px */
  flex:        0 0 auto;
  background:  var(--ds-divider-border-color-generic); /* borderColor/subtle — n100 light / n400 dark */
  border:      0;
}
`;

injectStyles('ds-divider', css);

// `decorative`: la línea es solo visual (la estructura ya agrupa el contenido,
// p. ej. entre items de una <dl>) → oculta al lector. A11y-3.
export function Divider({ decorative = false, className }) {
  const classes = ['ds-divider', className || ''].filter(Boolean).join(' ');
  // <hr> ya es role="separator" horizontal: no hace falta repetirlo.
  return <hr className={classes} aria-hidden={decorative ? 'true' : undefined} />;
}

Divider.displayName = 'Divider';
export default Divider;
