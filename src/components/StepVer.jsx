/**
 * StepVer — Átomo
 * CS Design System · v1.1 (12/11/2026: conectores que rellenan el alto de la fila, como Figma)
 *
 * Envuelve un `Node` con conectores ARRIBA/ABAJO verticales — la pieza que
 * `StepNavigator` instancia en cada fila para dar la sensación de una línea
 * continua atravesando toda la lista. Nunca se usa solo.
 *
 * `showTopConnector`/`showBottomConnector` usan `visibility: hidden`, nunca
 * `display: none` — el hueco se queda reservado siempre, así el `Node`
 * jamás cambia de sitio al mostrar/ocultar un conector (bug real que
 * perseguimos en Figma: `visible=false` en auto-layout colapsa el hueco y
 * recoloca el círculo — aquí no puede pasar porque el conector nunca sale
 * del flujo, solo se deja de pintar).
 *
 * Los conectores rellenan el alto que deja el Node en la fila (12/11, Figma
 * igual): en Step Navigator la fila mide 56 → 8 + 40 + 8 (rejilla de 8). Antes
 * medían 12 fijos en código y 11 en Figma (62, se salía de la fila de 60).
 *
 * USO (nunca aislado — ver StepNavigator):
 *   <StepVer state="completed" />
 *   <StepVer state="active" number="2" showTopConnector={false} />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Node } from './Node';

const css = `
.ds-step-ver {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  align-self:     stretch;
}
.ds-step-ver__connector {
  flex:   1 1 0;
  width:  var(--ds-steps-border-width);
  background: var(--ds-steps-connector-border-color);
}
.ds-step-ver__connector--hidden {
  visibility: hidden;
}
`;

injectStyles('ds-step-ver', css);

export function StepVer({
  state = 'incomplete',
  number = '1',
  stepLabel,
  statusLabels,
  showTopConnector = true,
  showBottomConnector = true,
  className,
  style,
}) {
  return (
    <div className={`ds-step-ver ${className || ''}`} style={style}>
      <span className={`ds-step-ver__connector ${!showTopConnector ? 'ds-step-ver__connector--hidden' : ''}`} aria-hidden="true" />
      <Node state={state} number={number} stepLabel={stepLabel} statusLabels={statusLabels} />
      <span className={`ds-step-ver__connector ${!showBottomConnector ? 'ds-step-ver__connector--hidden' : ''}`} aria-hidden="true" />
    </div>
  );
}

export default StepVer;
