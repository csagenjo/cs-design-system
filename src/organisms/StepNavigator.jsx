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
 * `style="primary"` (fondo por defecto/mobile) vs `"secondary"` (fondo gris
 * claro/web) — decide qué fondo usa cada `state`, nunca el color de marca.
 * `state="selected"` es el fondo persistente; hover/focus son pseudo-clases
 * CSS nativas, `:active` usa la opacidad de pressed (mismo mecanismo que
 * Accordion/Icon Button — no es un color-mix).
 *
 * `showTopConnector`/`showBottomConnector` se pasan tal cual a `StepVer` —
 * el primer y el último paso de una lista real los ocultan para no dejar un
 * conector colgando sin nada a lo que conectarse.
 *
 * USO:
 *   <StepNavigator state="active" number="2" title="Dirección" style="secondary" />
 *   <StepNavigator
 *     variation="chapter" state="incomplete" title="Documentación"
 *     expanded={open} onToggleExpand={() => setOpen(o => !o)}
 *   />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { StepVer } from '../components/StepVer';
import { Icon } from '../components/Icon';

const css = `
.ds-step-navigator {
  display:        flex;
  align-items:    center;
  gap:            var(--ds-steps-navigator-root-gap);
  width:          100%;
  padding:        0 var(--ds-steps-navigator-root-padding-horizontal);
  border:         none;
  background:     var(--ds-steps-root-bg-primary-incomplete);
  cursor:         pointer;
  text-align:     left;
  box-sizing:     border-box;
  outline:        none;
}
.ds-step-navigator--secondary {
  background: var(--ds-steps-root-bg-secondary-incomplete);
}
.ds-step-navigator:hover {
  background: var(--ds-steps-root-bg-hover);
}
.ds-step-navigator:active {
  opacity: var(--ds-steps-root-opacity-pressed);
}
.ds-step-navigator:focus-visible {
  box-shadow: 0 0 0 var(--ds-steps-root-border-width-focus) var(--ds-steps-root-border-color-focus-inner) inset,
              0 0 0 calc(var(--ds-steps-root-border-width-focus) * 2) var(--ds-steps-root-border-color-focus-outer);
}
.ds-step-navigator--selected {
  background: var(--ds-steps-root-bg-primary-completed-selected);
}
.ds-step-navigator--selected.ds-step-navigator--secondary {
  background: var(--ds-steps-root-bg-secondary-completed-selected);
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
  style: styleAxis = 'primary',
  state = 'incomplete',
  number = '1',
  title = 'Step name',
  showTopConnector = true,
  showBottomConnector = true,
  expanded = false,
  onToggleExpand,
  onClick,
  className,
  style,
}) {
  const isChapter = variation !== 'page';
  const selected = state === 'selected';
  const nodeState = selected ? 'completed' : state;

  return (
    <button
      type="button"
      className={`ds-step-navigator ${styleAxis === 'secondary' ? 'ds-step-navigator--secondary' : ''} ${selected ? 'ds-step-navigator--selected' : ''} ${className || ''}`}
      style={style}
      onClick={isChapter ? onToggleExpand : onClick}
    >
      <StepVer state={nodeState} number={number} showTopConnector={showTopConnector} showBottomConnector={showBottomConnector} />
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
