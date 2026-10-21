/**
 * StepNavigator — Organismo
 * CS Design System · v1
 *
 * Una fila del menú vertical de progreso — instancia `StepVer` (círculo +
 * conectores verticales) + título. `Variation="chapter"` añade el chevron
 * de expandir/colapsar; las filas de `SubstepNavigator` que cuelgan de un
 * capítulo expandido las monta el consumidor debajo (composición, mismo
 * criterio que SidebarMenu con sus hijos — StepNavigator no gestiona una
 * lista, solo es una fila).
 *
 * `appearance` (Figma: `Style`) = sobre qué fondo de página va: `"onDefault"`
 * (bg/default, blanco en claro — mobile) o `"onPage"` (bg/page, gris muy claro
 * — web). Decide qué fondo usa cada `state`, nunca un color de marca. Hasta el
 * 20/10/2026 se llamaba `style` con valores primary/secondary (chocaba con el
 * `style` inline de React y sugería los colores de marca); los valores viejos
 * se siguen aceptando con aviso en dev — ver `_stepAppearance.js`.
 * `state="selected"` es el fondo persistente; hover/focus son pseudo-clases
 * CSS nativas, `:active` usa la opacidad de pressed (mismo mecanismo que
 * Accordion/Icon Button — no es un color-mix).
 *
 * `showTopConnector`/`showBottomConnector` se pasan tal cual a `StepVer` —
 * el primer y el último paso de una lista real los ocultan para no dejar un
 * conector colgando sin nada a lo que conectarse.
 *
 * USO:
 *   <StepNavigator state="active" number="2" title="Dirección" appearance="onPage" />
 *   <StepNavigator
 *     variation="chapter" state="incomplete" title="Documentación"
 *     expanded={open} onToggleExpand={() => setOpen(o => !o)}
 *   />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { currentFor } from '../components/_stepStatus';
import { StepVer } from '../components/StepVer';
import { Icon } from '../components/Icon';
import { resolveAppearance } from './_stepAppearance';

const css = `
.ds-step-navigator {
  display:        flex;
  align-items:    center;
  gap:            var(--ds-steps-navigator-root-gap);
  width:          100%;
  padding:        0 var(--ds-steps-navigator-root-padding-horizontal);
  border:         none;
  background:     var(--ds-steps-root-bg-on-default-incomplete);
  cursor:         pointer;
  text-align:     left;
  box-sizing:     border-box;
  outline:        none;
}
.ds-step-navigator--on-page {
  background: var(--ds-steps-root-bg-on-page-incomplete);
}
.ds-step-navigator:hover {
  background: var(--ds-steps-root-bg-hover);
}
.ds-step-navigator:active {
  opacity: var(--ds-steps-root-opacity-pressed);
}
.ds-step-navigator:focus-visible {
  outline:    var(--ds-border-width-lg) solid transparent; /* visible solo en colores forzados — audit §F */
  outline-offset: calc(var(--ds-border-width-lg) * -1);
  box-shadow: 0 0 0 var(--ds-steps-root-border-width-focus) var(--ds-steps-root-border-color-focus-inner) inset,
              0 0 0 calc(var(--ds-steps-root-border-width-focus) * 2) var(--ds-steps-root-border-color-focus-outer);
}
.ds-step-navigator--selected {
  background: var(--ds-steps-root-bg-on-default-completed-selected);
}
.ds-step-navigator--selected.ds-step-navigator--on-page {
  background: var(--ds-steps-root-bg-on-page-completed-selected);
}
.ds-step-navigator__title {
  flex:        1 1 auto;
  min-width:   0;
  font-family: inherit;
  font-size:   var(--ds-fontSize-label-lg);
  font-weight: var(--ds-font-weight-bold);
  color:       var(--ds-fg-default);
}
.ds-step-navigator__chevron {
  display:    flex;
  flex-shrink: 0;
  color:      var(--ds-fg-icon-primary);
  transition: transform 0.15s ease;
}
.ds-step-navigator__chevron--expanded {
  transform: rotate(180deg);
}
`;

injectStyles('ds-step-navigator', css);


export function StepNavigator({
  variation = 'page',
  appearance,
  state = 'incomplete',
  number = '1',
  title = 'Step name',
  showTopConnector = true,
  showBottomConnector = true,
  expanded = false,
  onToggleExpand,
  controls,
  stepLabel,
  statusLabels,
  onClick,
  className,
  style,
}) {
  const { styleAxis, inlineStyle } = resolveAppearance('StepNavigator', appearance, style);
  const isChapter = variation !== 'page';
  const selected = state === 'selected';
  const nodeState = selected ? 'completed' : state;

  return (
    <button
      type="button"
      className={`ds-step-navigator ${styleAxis === 'onPage' ? 'ds-step-navigator--on-page' : ''} ${selected ? 'ds-step-navigator--selected' : ''} ${className || ''}`}
      style={inlineStyle}
      onClick={isChapter ? onToggleExpand : onClick}
      aria-current={currentFor(state, selected)}
      aria-expanded={isChapter ? expanded : undefined}
      aria-controls={isChapter && expanded ? controls : undefined}
    >
      <StepVer state={nodeState} number={number} stepLabel={stepLabel} statusLabels={statusLabels} showTopConnector={showTopConnector} showBottomConnector={showBottomConnector} />
      <span className="ds-step-navigator__title">{title}</span>
      {isChapter && (
        <span className={`ds-step-navigator__chevron ${expanded ? 'ds-step-navigator__chevron--expanded' : ''}`} aria-hidden="true">
          <Icon name="ChevronDown" size="sm" />
        </span>
      )}
    </button>
  );
}

export default StepNavigator;
