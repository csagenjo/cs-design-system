/**
 * ProgressBar — Componente atómico
 * CS Design System · v2.0 (10/11: label y texto de ayuda = átomos FieldLabel y
 * HelperText de Form Elements, como Figma — se deprecan los Label/Helper text propios;
 * alto de la barra, gap y radio por token)
 *
 * Indicador de progreso lineal. `variant` decide sobre qué SUPERFICIE va el
 * progress bar, no un color de marca alternativo — el indicator es siempre
 * el mismo color en las dos variantes, a propósito (confirmado contra
 * Sistema Origen, donde ambas columnas de referencia usan el mismo color de
 * indicator).
 *
 * `onColor` — probado a mano contra 7 superficies reales: track + indicator
 * funcionan sobre `bg/surface/*` de saturación media o subtle (primary,
 * tertiary, error, success, info, inverse) — EXCEPTO `bg/surface/secondary`
 * (rosa), donde el indicator es ese mismo rosa de marca y se funde con el
 * fondo. Nunca sobre `bg/page` o `bg/default` directamente tampoco (bajo
 * contraste del track).
 * Texto en onColor: desde 19/10 (A11y-2) Label/Helper (hoy FieldLabel/HelperText, recoloreados con sus variables) usan
 * `progressBar/all/text/fg/onColor` (→ fg/onColor, blanco) — los rellenos
 * de color pasan 4.5:1 con blanco tras la paleta por contraste. Excepción:
 * sobre `bg/inverse` en dark (blanco) no usar onColor.
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
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';

const css = `
.ds-progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--ds-progress-bar-gap);
  width: 100%;
}
.ds-progress-bar__track {
  width: 100%;
  height: var(--ds-progress-bar-track-height);
  border-radius: var(--ds-progress-bar-root-border-radius);
  overflow: hidden;
}
.ds-progress-bar--default .ds-progress-bar__track {
  background: var(--ds-progress-bar-root-bg-default);
}
.ds-progress-bar--onColor {
  /* Label y Helper son los átomos de Form Elements: sobre relleno de color se
     redefinen sus variables desde aquí (regla de instancias anidadas) */
  --ds-field-label-fg-generic: var(--ds-progress-bar-text-fg-on-color);
  --ds-helper-text-fg-generic: var(--ds-progress-bar-text-fg-on-color);
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
`;

injectStyles('ds-progress-bar', css);

export function ProgressBar({
  value          = 0, // 0-100
  variant        = 'default', // 'default' | 'onColor'
  label          = 'Label',
  showLabel      = true,
  helperText     = 'Helper text',
  showHelperText = true,
  ariaLabel,      // nombre si no hay label visible (por defecto, el propio `label`)
  id,
  className,
}) {
  const clamped = Math.min(100, Math.max(0, value));
  // A11y-3: la barra no tenía nombre. Con label visible → aria-labelledby; si
  // se oculta, el texto del label (o `ariaLabel`) va como aria-label. El
  // helper text la describe.
  const baseId = React.useId();
  const labelId = `${baseId}-label`;
  const helperId = `${baseId}-helper`;

  const classes = [
    'ds-progress-bar',
    `ds-progress-bar--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      {showLabel && <FieldLabel as="p" id={labelId}>{label}</FieldLabel>}
      <div
        className="ds-progress-bar__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={showLabel && !ariaLabel ? labelId : undefined}
        aria-label={showLabel && !ariaLabel ? undefined : (ariaLabel ?? label)}
        aria-describedby={showHelperText ? helperId : undefined}
      >
        <div className="ds-progress-bar__indicator" style={{ width: `${clamped}%` }} />
      </div>
      {showHelperText && <HelperText id={helperId}>{helperText}</HelperText>}
    </div>
  );
}

export default ProgressBar;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<ProgressBar value={20} label="Uploading" helperText="20%" />

<ProgressBar value={80} variant="onColor" label="Uploading" helperText="80%" />

<ProgressBar value={100} showLabel={false} showHelperText={false} />
*/
