/**
 * SubstepNavigator — Organismo
 * CS Design System · v1
 *
 * Fila hija de un `StepNavigator` en `variation="chapter"` — sin `Node`
 * propio, solo una línea vertical de paso (la continuación visual del
 * conector del capítulo padre) + icono de estado + label.
 *
 * Icono por `state` (igual que Figma, 21/10/2026): incomplete → punto,
 * active → chevron derecho, completed → check. El label va en negrita en
 * active, completed y con `selected`; regular en incomplete. Antes era
 * siempre una flecha y el label siempre regular. El consumidor la
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
 *   <SubstepNavigator state="active" label="Datos de contacto" appearance="onPage" />
 *
 * `appearance` onDefault/onPage — mismo eje y misma historia que en
 * StepNavigator (antes `style`, que chocaba con el `style` inline de React).
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Icon } from '../components/Icon';
import { resolveAppearance } from './_stepAppearance';

const css = `
.ds-substep-navigator {
  display:        flex;
  align-items:    center;
  gap:            var(--ds-steps-navigator-root-gap);
  width:          100%;
  min-height:     40px;
  padding:        0 var(--ds-steps-navigator-root-padding-horizontal);
  border:         none;
  background:     var(--ds-steps-root-bg-on-default-incomplete);
  cursor:         pointer;
  text-align:     left;
  box-sizing:     border-box;
  outline:        none;
}
.ds-substep-navigator--on-page {
  background: var(--ds-steps-root-bg-on-page-incomplete);
}
.ds-substep-navigator--active {
  background: var(--ds-steps-root-bg-on-default-active);
}
.ds-substep-navigator--active.ds-substep-navigator--on-page {
  background: var(--ds-steps-root-bg-on-page-active);
}
.ds-substep-navigator:hover {
  background: var(--ds-steps-root-bg-hover);
}
.ds-substep-navigator:focus-visible {
  outline:    var(--ds-border-width-lg) solid transparent; /* visible solo en colores forzados — audit §F */
  outline-offset: calc(var(--ds-border-width-lg) * -1);
  box-shadow: 0 0 0 var(--ds-steps-root-border-width-focus) var(--ds-steps-root-border-color-focus-inner) inset,
              0 0 0 calc(var(--ds-steps-root-border-width-focus) * 2) var(--ds-steps-root-border-color-focus-outer);
}
.ds-substep-navigator--selected {
  background: var(--ds-steps-root-bg-on-default-completed-selected);
}
.ds-substep-navigator--selected.ds-substep-navigator--on-page {
  background: var(--ds-steps-root-bg-on-page-completed-selected);
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
  color:       var(--ds-steps-navigator-root-fg-label);
}
.ds-substep-navigator--active .ds-substep-navigator__label,
.ds-substep-navigator--completed .ds-substep-navigator__label,
.ds-substep-navigator--selected .ds-substep-navigator__label {
  font-weight: var(--ds-font-weight-bold);
}
`;

injectStyles('ds-substep-navigator', css);

const STATE_ICON = { incomplete: 'Dot', active: 'ChevronRight', completed: 'Check' };

export function SubstepNavigator({
  state = 'incomplete',
  appearance,
  label = 'Step name',
  selected = false,
  onClick,
  className,
  style,
}) {
  const { styleAxis, inlineStyle } = resolveAppearance('SubstepNavigator', appearance, style);
  return (
    <button
      type="button"
      className={`ds-substep-navigator ds-substep-navigator--${state} ${styleAxis === 'onPage' ? 'ds-substep-navigator--on-page' : ''} ${selected ? 'ds-substep-navigator--selected' : ''} ${className || ''}`}
      style={inlineStyle}
      onClick={onClick}
    >
      <span className="ds-substep-navigator__line-col">
        <span className="ds-substep-navigator__line" aria-hidden="true" />
      </span>
      <span className="ds-substep-navigator__icon" aria-hidden="true">
        <Icon name={STATE_ICON[state] ?? STATE_ICON.incomplete} size="xs" />
      </span>
      <span className="ds-substep-navigator__label">{label}</span>
    </button>
  );
}

export default SubstepNavigator;
