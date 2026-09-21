/**
 * SubstepNavigator — Organismo
 * CS Design System · v1
 *
 * Fila hija de un `StepNavigator` en `variation="chapter"` — sin `Node`
 * propio, solo una línea vertical de paso (la continuación visual del
 * conector del capítulo padre) + icono chevron + label. El consumidor la
 * monta debajo del `StepNavigator` cuando `expanded` es true, igual que
 * SidebarMenu con sus filas hijas.
 *
 * La línea vive en una columna de 40px — el mismo ancho que la columna de
 * `Node`/`StepVer` — para que quede exactamente alineada con el conector
 * de las filas de `StepNavigator` de arriba y abajo, sin depender de
 * calcular el centro a mano.
 *
 * USO (montado por el consumidor bajo un StepNavigator expandido):
 *   <SubstepNavigator state="active" label="Datos de contacto" />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Icon } from '../components/Icon';

const css = `
.ds-substep-navigator {
  display:        flex;
  align-items:    center;
  gap:            var(--ds-steps-navigator-root-gap);
  width:          100%;
  min-height:     40px;
  padding:        0 var(--ds-steps-navigator-root-padding-horizontal);
  border:         none;
  background:     var(--ds-steps-root-bg-primary-incomplete);
  cursor:         pointer;
  text-align:     left;
  box-sizing:     border-box;
  outline:        none;
}
.ds-substep-navigator--secondary {
  background: var(--ds-steps-root-bg-secondary-incomplete);
}
.ds-substep-navigator:hover {
  background: var(--ds-steps-root-bg-hover);
}
.ds-substep-navigator:focus-visible {
  box-shadow: 0 0 0 var(--ds-steps-root-border-width-focus) var(--ds-steps-root-border-color-focus-inner) inset,
              0 0 0 calc(var(--ds-steps-root-border-width-focus) * 2) var(--ds-steps-root-border-color-focus-outer);
}
.ds-substep-navigator--selected {
  background: var(--ds-steps-root-bg-primary-completed-selected);
}
.ds-substep-navigator--selected.ds-substep-navigator--secondary {
  background: var(--ds-steps-root-bg-secondary-completed-selected);
}
.ds-substep-navigator__line-col {
  flex-shrink:     0;
  width:           40px;
  align-self:      stretch;
  display:         flex;
  justify-content: center;
}
.ds-substep-navigator__line {
  width:      var(--ds-steps-border-width);
  background: var(--ds-steps-connector-border-color);
}
.ds-substep-navigator__icon {
  display:     flex;
  flex-shrink: 0;
  color:       var(--ds-steps-navigator-substep-icon-fg-incomplete);
}
.ds-substep-navigator--active .ds-substep-navigator__icon {
  color: var(--ds-steps-navigator-substep-icon-fg-active);
}
.ds-substep-navigator--completed .ds-substep-navigator__icon {
  color: var(--ds-steps-navigator-substep-icon-fg-completed);
}
.ds-substep-navigator__label {
  font-family: inherit;
  font-size:   var(--ds-fontSize-label-md);
  font-weight: var(--ds-font-weight-regular);
  color:       var(--ds-fg-default);
}
`;

injectStyles('ds-substep-navigator', css);

export function SubstepNavigator({
  state = 'incomplete',
  style: styleAxis = 'primary',
  label = 'Step name',
  selected = false,
  onClick,
  className,
  style,
}) {
  return (
    <button
      type="button"
      className={`ds-substep-navigator ds-substep-navigator--${state} ${styleAxis === 'secondary' ? 'ds-substep-navigator--secondary' : ''} ${selected ? 'ds-substep-navigator--selected' : ''} ${className || ''}`}
      style={style}
      onClick={onClick}
    >
      <span className="ds-substep-navigator__line-col">
        <span className="ds-substep-navigator__line" aria-hidden="true" />
      </span>
      <span className="ds-substep-navigator__icon" aria-hidden="true">
        <Icon name="ArrowRight" size="xs" />
      </span>
      <span className="ds-substep-navigator__label">{label}</span>
    </button>
  );
}

export default SubstepNavigator;
