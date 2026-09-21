/**
 * Node — Átomo
 * CS Design System · v1
 *
 * Círculo con número o icono que representa el estado de un paso —
 * `Incomplete` (contorno, número negro), `Active` (relleno teal, número
 * blanco), `Completed` (relleno verde, icono check blanco). Pieza compartida
 * real entre Step Navigator (vía `StepVer`) y Step Indicator (vía `StepHor`
 * y directamente en `StepIndicatorSmall`) — un único punto de mantenimiento
 * para el círculo, nunca reimplementado en cada sitio.
 *
 * Caja de 40×40 con la elipse de 36×36 centrada (2px de margen) — el margen
 * existe para que el borde `OUTSIDE` de 2px de la elipse nunca quede
 * recortado si algún contenedor activa `overflow: hidden` (bug real
 * encontrado y corregido en Figma, ver CLAUDE.md §9 Step Navigator/Indicator).
 *
 * USO:
 *   <Node state="completed" />
 *   <Node state="active" number="2" />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const css = `
.ds-node {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.ds-node__circle {
  width: 36px;
  height: 36px;
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
  line-height: var(--ds-lineHeight-sm);
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

export function Node({ state = 'incomplete', number = '1', className, style }) {
  return (
    <div className={`ds-node ds-node--${state} ${className || ''}`} style={style}>
      <div className="ds-node__circle">
        {state === 'completed' ? <Icon name="Check" size="sm" /> : <span>{number}</span>}
      </div>
    </div>
  );
}

export default Node;
