/**
 * Tooltip — Componente atómico
 * CS Design System · v1.0
 *
 * Envuelve un trigger y muestra una burbuja de texto al hover/focus, vía
 * :hover/:focus-within puro en CSS — sin JS de estado, sin timer/portal
 * (fuera de scope de átomo, mismo criterio que Snackbar e InlineNotification).
 * Se posiciona con position:absolute relativo al propio wrapper, no fixed:
 * puede recortarse dentro de contenedores con overflow:hidden — responsabilidad
 * del consumidor evitarlo si hace falta.
 *
 * Paga la deuda de CollapsibleIconButton, que hasta ahora usaba una
 * implementación CSS local mínima a la espera de este átomo (ver CLAUDE.md
 * §9/§10) — mismos valores (bg-inverse/fg-label-inverse, fontSize/label/xs,
 * padding 2px 6px, radius 4px), ahora como único punto de mantenimiento.
 *
 * `placement` decide en qué lado aparece la burbuja respecto al trigger — la
 * flecha siempre apunta HACIA el trigger, en el lado opuesto a `placement`.
 *
 * USO:
 *   <Tooltip label="Expand"><IconButton icon="chevron-down" ariaLabel="Expand" /></Tooltip>
 *   <Tooltip label="Eliminar" placement="right"><Button variant="negative">Eliminar</Button></Tooltip>
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-tooltip {
  position: relative;
  display: inline-block;
}
.ds-tooltip__bubble {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--ds-tooltip-gap);
  box-sizing: border-box;
  background: var(--ds-tooltip-bg);
  color: var(--ds-tooltip-fg);
  border-radius: var(--ds-tooltip-border-radius);
  padding: var(--ds-tooltip-padding-ver) var(--ds-tooltip-padding-hor);
  font-family: inherit;                        /* Nunito (fontFamily/default) */
  font-size: var(--ds-fontSize-label-xs);       /* 12 */
  font-weight: var(--ds-font-weight-regular);   /* 400 */
  line-height: var(--ds-lineHeight-3xs);        /* 18 */
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s;
  z-index: 10;
}
.ds-tooltip:hover .ds-tooltip__bubble,
.ds-tooltip:focus-within .ds-tooltip__bubble {
  opacity: 1;
}
.ds-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.ds-tooltip__bubble--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(calc(-1 * var(--ds-tooltip-arrow-length)));
}
.ds-tooltip__bubble--top .ds-tooltip__arrow {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-right: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-top: var(--ds-tooltip-arrow-length) solid var(--ds-tooltip-bg);
}

.ds-tooltip__bubble--bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(var(--ds-tooltip-arrow-length));
}
.ds-tooltip__bubble--bottom .ds-tooltip__arrow {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-right: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-bottom: var(--ds-tooltip-arrow-length) solid var(--ds-tooltip-bg);
}

.ds-tooltip__bubble--left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(calc(-1 * var(--ds-tooltip-arrow-length)));
}
.ds-tooltip__bubble--left .ds-tooltip__arrow {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-top: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-bottom: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-left: var(--ds-tooltip-arrow-length) solid var(--ds-tooltip-bg);
}

.ds-tooltip__bubble--right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(var(--ds-tooltip-arrow-length));
}
.ds-tooltip__bubble--right .ds-tooltip__arrow {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-top: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-bottom: calc(var(--ds-tooltip-arrow-base) / 2) solid transparent;
  border-right: var(--ds-tooltip-arrow-length) solid var(--ds-tooltip-bg);
}
`;

injectStyles('ds-tooltip', css);

export function Tooltip({
  label,
  placement = 'top', // 'top' | 'bottom' | 'left' | 'right'
  children,
  id,
  className,
}) {
  const generatedId = React.useId();
  const tooltipId = id || generatedId;

  const trigger = React.isValidElement(children)
    ? React.cloneElement(children, { 'aria-describedby': tooltipId })
    : children;

  const classes = ['ds-tooltip', className || ''].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {trigger}
      <span
        className={`ds-tooltip__bubble ds-tooltip__bubble--${placement}`}
        role="tooltip"
        id={tooltipId}
      >
        {label}
        <span className="ds-tooltip__arrow" />
      </span>
    </span>
  );
}

export default Tooltip;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Tooltip label="Expand"><IconButton icon="chevron-down" ariaLabel="Expand" /></Tooltip>

<Tooltip label="Eliminar" placement="right">
  <IconButton icon="trash-2" ariaLabel="Eliminar" />
</Tooltip>

<Tooltip label="Configuración" placement="bottom">
  <IconButton icon="settings" ariaLabel="Configuración" />
</Tooltip>
*/
