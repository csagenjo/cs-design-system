/**
 * Node — Átomo
 * CS Design System · v1.1 (12/11/2026: tamaño por token, círculo de 40 como el visual de Figma)
 *
 * Círculo con número o icono que representa el estado de un paso —
 * `Incomplete` (contorno, número negro), `Active` (relleno teal, número
 * blanco), `Completed` (relleno verde, icono check blanco). Pieza compartida
 * real entre Step Navigator (vía `StepVer`) y Step Indicator (vía `StepHor`
 * y directamente en `StepIndicatorSmall`) — un único punto de mantenimiento
 * para el círculo, nunca reimplementado en cada sitio.
 *
 * Caja de 40×40 (`steps/common/all/node/size/generic` → sizing/lg). En Figma
 * es una elipse de 36 con trazo EXTERIOR de 2 y 2 de padding
 * (`node/padding/generic`), así que lo que se ve mide 40. En código el
 * círculo ocupa los 40 con el borde de 2 por dentro: mismo resultado visual.
 * (Hasta v1 el círculo medía 36 en total: 4 px más pequeño que Figma.)
 *
 * USO:
 *   <Node state="completed" />
 *   <Node state="active" number="2" />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { VisuallyHidden } from './VisuallyHidden';
import { stepStatusText } from './_stepStatus';

const css = `
.ds-node {
  width: var(--ds-steps-node-size);
  height: var(--ds-steps-node-size);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.ds-node__circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: var(--ds-steps-border-width) solid var(--ds-steps-node-border-color-incomplete);
  color: var(--ds-steps-node-fg-incomplete);
  font-family: inherit;
  font-size: var(--ds-fontSize-label-lg);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-label-lg);
}
.ds-node--active .ds-node__circle {
  background:  var(--ds-steps-node-bg-active);
  border-color: var(--ds-steps-node-border-color-active);
  color:       var(--ds-steps-node-fg-active);
}
.ds-node--completed .ds-node__circle {
  background:  var(--ds-steps-node-bg-completed);
  border-color: var(--ds-steps-node-border-color-completed);
  color:       var(--ds-steps-node-fg-completed);
}
`;

injectStyles('ds-node', css);

export function Node({
  state = 'incomplete',
  number = '1',
  stepLabel = 'Step',
  statusLabels,
  srLabel,
  className,
  style,
}) {
  // A11y-3: el círculo (relleno, número, check) es solo visual; lo que se lee
  // es "Step 2, in progress". `srLabel` lo sustituye entero (StepIndicatorSmall
  // ya muestra "Step 2 of 4" y solo necesita el estado); `srLabel=""` no lee nada.
  const spoken = srLabel ?? `${stepLabel} ${number}, ${stepStatusText(state, statusLabels)}`;
  return (
    <div className={`ds-node ds-node--${state} ${className || ''}`} style={style}>
      <div className="ds-node__circle" aria-hidden="true">
        {state === 'completed' ? <Icon name="Check" size="sm" /> : <span>{number}</span>}
      </div>
      {spoken ? <VisuallyHidden>{spoken}</VisuallyHidden> : null}
    </div>
  );
}

export default Node;
