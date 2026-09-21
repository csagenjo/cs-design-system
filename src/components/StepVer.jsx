/**
 * StepVer — Átomo
 * CS Design System · v1
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
}
.ds-step-ver__connector {
  width:  var(--ds-steps-border-width);
  height: 12px;
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
  showTopConnector = true,
  showBottomConnector = true,
  className,
  style,
}) {
  return (
    <div className={`ds-step-ver ${className || ''}`} style={style}>
      <span className={`ds-step-ver__connector ${!showTopConnector ? 'ds-step-ver__connector--hidden' : ''}`} aria-hidden="true" />
      <Node state={state} number={number} />
      <span className={`ds-step-ver__connector ${!showBottomConnector ? 'ds-step-ver__connector--hidden' : ''}`} aria-hidden="true" />
    </div>
  );
}

export default StepVer;
