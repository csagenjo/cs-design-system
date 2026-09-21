/**
 * StepIndicatorSmall — Organismo
 * CS Design System · v1
 *
 * Variante compacta de una sola fila — `Node` a la izquierda + dos líneas
 * de texto ("Step X of Y" / nombre del paso), sin conectores (a diferencia
 * de Step Indicator Large, aquí no hay cadena visual entre pasos). Pensada
 * para listas o paneles estrechos donde el conector completo no cabe.
 *
 * Instancia `Node` directamente, sin pasar por `StepHor` — no tiene
 * conector que envolver.
 *
 * `selected` es prop real (fondo persistente); hover/focus son pseudo-clases
 * CSS nativas sobre el `<button>` raíz, mismo criterio que ListView/TabItem.
 *
 * USO:
 *   <StepIndicatorSmall
 *     state="active" number="2" step={2} total={4}
 *     label="Dirección" onClick={() => goToStep(2)}
 *   />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Node } from '../components/Node';

const css = `
.ds-step-indicator-small {
  display:        flex;
  align-items:    center;
  gap:            12px;
  width:          100%;
  padding:        8px var(--ds-steps-navigator-root-padding-horizontal);
  border:         none;
  border-radius:  0;
  background:     var(--ds-steps-root-bg-primary-incomplete);
  cursor:         pointer;
  text-align:     left;
  box-sizing:     border-box;
  outline:        none;
}
.ds-step-indicator-small:hover {
  background: var(--ds-steps-root-bg-hover);
}
.ds-step-indicator-small:focus-visible {
  box-shadow: 0 0 0 var(--ds-steps-root-border-width-focus) var(--ds-steps-root-border-color-focus-inner) inset,
              0 0 0 calc(var(--ds-steps-root-border-width-focus) * 2) var(--ds-steps-root-border-color-focus-outer);
}
.ds-step-indicator-small--selected {
  background: var(--ds-steps-root-bg-primary-completed-selected);
}
.ds-step-indicator-small__text {
  display:        flex;
  flex-direction: column;
  gap:            2px;
  min-width:      0;
}
.ds-step-indicator-small__meta {
  font-family: inherit;
  font-size:   var(--ds-fontSize-label-xs);
  font-weight: var(--ds-font-weight-regular);
  color:       var(--ds-fg-default);
}
.ds-step-indicator-small__label {
  font-family: inherit;
  font-size:   var(--ds-fontSize-label-sm);
  font-weight: var(--ds-font-weight-bold);
  color:       var(--ds-fg-default);
}
`;

injectStyles('ds-step-indicator-small', css);

export function StepIndicatorSmall({
  state = 'incomplete',
  number = '1',
  step,
  total,
  label = 'Step name',
  selected = false,
  onClick,
  className,
  style,
}) {
  return (
    <button
      type="button"
      className={`ds-step-indicator-small ${selected ? 'ds-step-indicator-small--selected' : ''} ${className || ''}`}
      style={style}
      onClick={onClick}
    >
      <Node state={state} number={number} />
      <span className="ds-step-indicator-small__text">
        {step != null && total != null && (
          <span className="ds-step-indicator-small__meta">Step {step} of {total}</span>
        )}
        <span className="ds-step-indicator-small__label">{label}</span>
      </span>
    </button>
  );
}

export default StepIndicatorSmall;
