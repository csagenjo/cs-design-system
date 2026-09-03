/**
 * ProgressBar — Componente atómico
 * CS Design System · v1.0
 *
 * Indicador de progreso lineal. `variant` decide sobre qué SUPERFICIE va el
 * progress bar, no un color de marca alternativo — el indicator es siempre
 * el mismo color en las dos variantes, a propósito (confirmado contra
 * Sistema Origen, donde ambas columnas de referencia usan el mismo color de
 * indicator). `onColor` es para colocar el progress bar sobre una superficie
 * de color (p.ej. dentro de una card teal) — NUNCA sobre `bg/page` o
 * `bg/default` directamente, donde vuelve a quedar con bajo contraste.
 *
 * `value` es un número 0-100 libre (no los saltos discretos 0/20/50/80/100
 * de Figma) — el ancho del indicator es simplemente `value%`.
 *
 * USO:
 *   <ProgressBar value={50} label="Uploading" helperText="50%" />
 *   <ProgressBar value={80} variant="onColor" label="Progress" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--ds-progress-bar-gap);
  width: 100%;
}
.ds-progress-bar__label {
  margin: 0;
  font-family: inherit;                        /* Nunito (fontFamily/default) */
  font-size: var(--ds-fontSize-label-md);       /* 16 */
  font-weight: var(--ds-font-weight-regular);   /* 400 */
  line-height: var(--ds-lineHeight-xs);         /* 24 */
  color: var(--ds-progress-bar-text-fg);
}
.ds-progress-bar__track {
  width: 100%;
  height: 8px;
  border-radius: var(--ds-progress-bar-root-border-radius);
  overflow: hidden;
}
.ds-progress-bar--default .ds-progress-bar__track {
  background: var(--ds-progress-bar-root-bg-default);
}
.ds-progress-bar--onColor .ds-progress-bar__track {
  background: var(--ds-progress-bar-root-bg-on-color);
}
.ds-progress-bar__indicator {
  height: 100%;
  border-radius: inherit;
  background: var(--ds-progress-bar-indicator-bg);
  transition: width 0.2s ease;
}
.ds-progress-bar__helper-text {
  margin: 0;
  font-family: inherit;
  font-size: var(--ds-fontSize-body-2xs);       /* 12 */
  font-weight: var(--ds-font-weight-regular);   /* 400 */
  line-height: var(--ds-lineHeight-3xs);        /* 18 */
  color: var(--ds-progress-bar-text-fg);
}
`;

injectStyles('ds-progress-bar', css);

export function ProgressBar({
  value          = 0, // 0-100
  variant        = 'default', // 'default' | 'onColor'
  label          = 'Label',
  showLabel      = true,
  helperText     = 'Helper text',
  showHelperText = true,
  id,
  className,
}) {
  const clamped = Math.min(100, Math.max(0, value));

  const classes = [
    'ds-progress-bar',
    `ds-progress-bar--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      {showLabel && <p className="ds-progress-bar__label">{label}</p>}
      <div
        className="ds-progress-bar__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="ds-progress-bar__indicator" style={{ width: `${clamped}%` }} />
      </div>
      {showHelperText && <p className="ds-progress-bar__helper-text">{helperText}</p>}
    </div>
  );
}

export default ProgressBar;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<ProgressBar value={20} label="Uploading" helperText="20%" />

<ProgressBar value={80} variant="onColor" label="Uploading" helperText="80%" />

<ProgressBar value={100} showLabel={false} showHelperText={false} />
*/
