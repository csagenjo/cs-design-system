/**
 * StepHor — Átomo
 * CS Design System · v1
 *
 * Envuelve un `Node` con conectores IZQUIERDA/DERECHA horizontales y un
 * label debajo — la pieza que `StepIndicatorLarge` encadena para formar el
 * wizard horizontal. Nunca se usa solo: siempre en fila con más `StepHor`.
 *
 * Los conectores son `flex: 1` (elásticos) a cada lado de `Node` (tamaño
 * fijo) — así `Node` queda SIEMPRE centrado en su propio ancho, crezca lo
 * que crezca el paso, sin recálculo manual (mismo mecanismo verificado en
 * Figma: FILL simétrico a los dos lados de un elemento fijo).
 *
 * `showLeftConnector`/`showRightConnector` NUNCA quitan el hueco del lado
 * oculto (usan `visibility: hidden`, no `display: none`) — en el primer
 * paso de una cadena, el hueco vacío a la izquierda es lo que da el margen
 * de entrada correcto (visto en la referencia de Sistema Origen), no un
 * `Node` pegado al borde.
 *
 * USO (nunca aislado — ver StepIndicatorLarge):
 *   <StepHor state="completed" label="Datos personales" />
 *   <StepHor state="active" number="2" label="Dirección" showLeftConnector={false} />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Node } from './Node';

const css = `
.ds-step-hor {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            8px;
  min-width:      0;
}
.ds-step-hor__indicator {
  display:     flex;
  align-items: center;
  width:       100%;
}
.ds-step-hor__connector {
  flex:   1 1 auto;
  height: var(--ds-steps-border-width);
  background: var(--ds-steps-connector-border-color);
}
.ds-step-hor__connector--hidden {
  visibility: hidden;
}
.ds-step-hor__label {
  font-family: inherit;
  font-size:   var(--ds-fontSize-label-sm);
  font-weight: var(--ds-font-weight-regular);
  line-height: var(--ds-lineHeight-2xs);
  color:       var(--ds-fg-default);
  text-align:  center;
}
`;

injectStyles('ds-step-hor', css);

export function StepHor({
  state = 'incomplete',
  number = '1',
  label = 'Step name',
  showLeftConnector = true,
  showRightConnector = true,
  className,
  style,
}) {
  return (
    <div className={`ds-step-hor ${className || ''}`} style={style}>
      <div className="ds-step-hor__indicator">
        <span className={`ds-step-hor__connector ${!showLeftConnector ? 'ds-step-hor__connector--hidden' : ''}`} aria-hidden="true" />
        <Node state={state} number={number} />
        <span className={`ds-step-hor__connector ${!showRightConnector ? 'ds-step-hor__connector--hidden' : ''}`} aria-hidden="true" />
      </div>
      <span className="ds-step-hor__label">{label}</span>
    </div>
  );
}

export default StepHor;
