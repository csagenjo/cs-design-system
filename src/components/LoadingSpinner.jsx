/**
 * LoadingSpinner — Componente atómico
 * CS Design System · v1.0
 *
 * Indicador de carga circular. `<circle>` SVG con `stroke-dasharray` (75%
 * trazo / 25% hueco) rotando vía CSS — el vector "Progress (Stroke)" de
 * Figma es un path relleno estático, no puede animarse tal cual, así que
 * se traduce a un stroke real (mismo radio/grosor por tamaño, confirmados
 * por dato: strokeWeight de Figma = size/8 exacto en las 4 variantes).
 *
 * `color="onColor"` es para usar sobre una superficie de color (p.ej.
 * dentro de un Button en `loading` — ver deuda en CLAUDE.md §10) — blanco
 * fijo en los dos modos, nunca el fondo de página.
 *
 * USO:
 *   <LoadingSpinner />
 *   <LoadingSpinner size="large" color="onColor" label="Guardando" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-loading-spinner {
  display: inline-block;
  animation: ds-loading-spinner-spin var(--ds-loading-spinner-duration) linear infinite;
  flex-shrink: 0;
}
/* viewBox 16×16, r=7, trazo 2 → el grosor es siempre tamaño/8 (2/3/4/6 en
   16/24/32/48, igual que Figma) a cualquier tamaño, sin radio ni dasharray
   por tamaño. pathLength=100 → 75% trazo / 25% hueco. */
.ds-loading-spinner__track {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 75 25;
}
.ds-loading-spinner--extraSmall { width: var(--ds-loading-spinner-size-xs); height: var(--ds-loading-spinner-size-xs); }
.ds-loading-spinner--small      { width: var(--ds-loading-spinner-size-sm); height: var(--ds-loading-spinner-size-sm); }
.ds-loading-spinner--medium     { width: var(--ds-loading-spinner-size-md); height: var(--ds-loading-spinner-size-md); }
.ds-loading-spinner--large      { width: var(--ds-loading-spinner-size-lg); height: var(--ds-loading-spinner-size-lg); }

.ds-loading-spinner--primary .ds-loading-spinner__track { stroke: var(--ds-loading-spinner-color-primary); }
.ds-loading-spinner--onColor .ds-loading-spinner__track { stroke: var(--ds-loading-spinner-color-on-color); }
/* current: hereda el color del texto del padre (Button lo usa así: el
   spinner toma el color de icono por contraste de cada variante, como en Figma). */
.ds-loading-spinner--current .ds-loading-spinner__track { stroke: currentColor; }

@keyframes ds-loading-spinner-spin {
  to { transform: rotate(360deg); }
}
`;

injectStyles('ds-loading-spinner', css);

export function LoadingSpinner({
  size  = 'medium', // 'extraSmall' | 'small' | 'medium' | 'large'
  color = 'primary', // 'primary' | 'onColor' | 'current' (hereda el color del texto)
  label = 'Loading',
  id,
  className,
}) {
  const classes = [
    'ds-loading-spinner',
    `ds-loading-spinner--${size}`,
    `ds-loading-spinner--${color}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <svg id={id} className={classes} viewBox="0 0 16 16" role="status" aria-label={label}>
      <circle className="ds-loading-spinner__track" cx="8" cy="8" r="7" pathLength="100" />
    </svg>
  );
}

export default LoadingSpinner;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<LoadingSpinner />
<LoadingSpinner size="extraSmall" />
<LoadingSpinner size="large" color="onColor" label="Guardando" />
*/
