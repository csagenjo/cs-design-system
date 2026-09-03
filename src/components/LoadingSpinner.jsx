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
 * `color="inverted"` es para usar sobre una superficie de color (p.ej.
 * dentro de un Button en `loading` — ver deuda en CLAUDE.md §10) — blanco
 * fijo en los dos modos, nunca el fondo de página.
 *
 * USO:
 *   <LoadingSpinner />
 *   <LoadingSpinner size="large" color="inverted" label="Guardando" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-loading-spinner {
  display: inline-block;
  animation: ds-loading-spinner-spin var(--ds-loading-spinner-duration) linear infinite;
  flex-shrink: 0;
}
.ds-loading-spinner__track {
  fill: none;
  stroke-linecap: round;
}

.ds-loading-spinner--extraSmall {
  width: var(--ds-loading-spinner-size-xs);
  height: var(--ds-loading-spinner-size-xs);
}
.ds-loading-spinner--extraSmall .ds-loading-spinner__track {
  r: var(--ds-loading-spinner-radius-xs);
  stroke-width: var(--ds-loading-spinner-stroke-xs);
  stroke-dasharray: var(--ds-loading-spinner-dasharray-xs);
}

.ds-loading-spinner--small {
  width: var(--ds-loading-spinner-size-sm);
  height: var(--ds-loading-spinner-size-sm);
}
.ds-loading-spinner--small .ds-loading-spinner__track {
  r: var(--ds-loading-spinner-radius-sm);
  stroke-width: var(--ds-loading-spinner-stroke-sm);
  stroke-dasharray: var(--ds-loading-spinner-dasharray-sm);
}

.ds-loading-spinner--medium {
  width: var(--ds-loading-spinner-size-md);
  height: var(--ds-loading-spinner-size-md);
}
.ds-loading-spinner--medium .ds-loading-spinner__track {
  r: var(--ds-loading-spinner-radius-md);
  stroke-width: var(--ds-loading-spinner-stroke-md);
  stroke-dasharray: var(--ds-loading-spinner-dasharray-md);
}

.ds-loading-spinner--large {
  width: var(--ds-loading-spinner-size-lg);
  height: var(--ds-loading-spinner-size-lg);
}
.ds-loading-spinner--large .ds-loading-spinner__track {
  r: var(--ds-loading-spinner-radius-lg);
  stroke-width: var(--ds-loading-spinner-stroke-lg);
  stroke-dasharray: var(--ds-loading-spinner-dasharray-lg);
}

.ds-loading-spinner--primary .ds-loading-spinner__track {
  stroke: var(--ds-loading-spinner-color-primary);
}
.ds-loading-spinner--inverted .ds-loading-spinner__track {
  stroke: var(--ds-loading-spinner-color-inverted);
}

@keyframes ds-loading-spinner-spin {
  to { transform: rotate(360deg); }
}
`;

injectStyles('ds-loading-spinner', css);

export function LoadingSpinner({
  size  = 'medium', // 'extraSmall' | 'small' | 'medium' | 'large'
  color = 'primary', // 'primary' | 'inverted'
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
    <svg id={id} className={classes} role="status" aria-label={label}>
      <circle className="ds-loading-spinner__track" cx="50%" cy="50%" />
    </svg>
  );
}

export default LoadingSpinner;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<LoadingSpinner />
<LoadingSpinner size="extraSmall" />
<LoadingSpinner size="large" color="inverted" label="Guardando" />
*/
