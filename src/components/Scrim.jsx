/**
 * Scrim — Componente atómico
 * CS Design System · v1.0
 *
 * Fondo oscurecido tras un Dialog modal. Puro overlay visual — NO gestiona
 * portal, z-index, ni el propio Dialog: el consumidor compone Scrim + Dialog
 * y decide el posicionamiento fijo en pantalla (mismo límite de átomo que
 * Snackbar/Dialog).
 *
 * bg/overlay invierte con el modo (negro 30% en light, blanco 30% en dark)
 * — confirmado en Figma. Sin props: la opacidad vive en el propio color, no
 * en un layer-opacity separado (bug de doble-opacidad corregido en Figma
 * 24/08 — ver CLAUDE.md §10).
 *
 * USO:
 *   <div style={{ position: 'fixed', inset: 0 }}>
 *     <Scrim />
 *     <Dialog ... />
 *   </div>
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-scrim {
  width: 100%;
  height: 100%;
  background: var(--ds-dialog-scrim-bg-generic);
}
`;

injectStyles('ds-scrim', css);

export function Scrim({ id, className }) {
  const classes = ['ds-scrim', className || ''].filter(Boolean).join(' ');
  return <div id={id} className={classes} aria-hidden="true" />;
}

export default Scrim;
