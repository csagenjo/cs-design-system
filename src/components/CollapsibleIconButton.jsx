/**
 * CollapsibleIconButton — Componente atómico
 * CS Design System · v1.0
 *
 * Variante icon-only de Collapsible, con tooltip mostrando "Expand"/
 * "Collapse" al hover/focus. Instancia `IconButton` (`type="default"
 * variant="secondary"`) sin reimplementar su lógica — mismo mecanismo de
 * re-tematización por CSS custom properties que `Collapsible.jsx`.
 *
 * Deuda conocida: el átomo `Tooltip` aún no existe en el sistema (backlog,
 * ver CLAUDE.md §9) — el tooltip de este componente es una implementación
 * mínima local en CSS puro, no el átomo compartido. Cuando se construya
 * `Tooltip`, migrar este componente a instanciarlo en vez de mantener su
 * propio markup.
 *
 * `expanded` decide icono + texto del tooltip: `false` → chevron-down/
 * "Expand", `true` → chevron-up/"Collapse".
 *
 * USO:
 *   <CollapsibleIconButton expanded={open} onToggle={() => setOpen(!open)} />
 *   <CollapsibleIconButton variant="secondary" size="small" expanded={open} onToggle={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { IconButton } from './IconButton';

const css = `
.ds-collapsible-icon-btn {
  position: relative;
  display: inline-block;
}
.ds-collapsible-icon-btn--default {
  --ds-icon-button-border-color-default:       var(--ds-collapsible-border-color-default);
  --ds-icon-button-icon-fg-on-outline-default: var(--ds-collapsible-icon-fg-default);
}
.ds-collapsible-icon-btn--secondary {
  --ds-icon-button-border-color-default:       var(--ds-collapsible-border-color-secondary);
  --ds-icon-button-icon-fg-on-outline-default: var(--ds-collapsible-icon-fg-secondary);
}
.ds-collapsible-icon-btn__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-6px);
  background: var(--ds-bg-inverse);
  color: var(--ds-fg-label-inverse);
  font-size: var(--ds-fontSize-label-xs);
  font-weight: var(--ds-font-weight-regular);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s;
  z-index: 1;
}
.ds-collapsible-icon-btn:hover .ds-collapsible-icon-btn__tooltip,
.ds-collapsible-icon-btn:focus-within .ds-collapsible-icon-btn__tooltip {
  opacity: 1;
}
`;

injectStyles('ds-collapsible-icon-btn', css);

export function CollapsibleIconButton({
  variant  = 'default', // 'default' | 'secondary'
  size     = 'medium',   // 'small' | 'medium' | 'large' — misma escala que IconButton
  expanded = false,
  onToggle,
  labels   = { expand: 'Expand', collapse: 'Collapse' },
  id,
  className,
}) {
  const label = expanded ? labels.collapse : labels.expand;
  const classes = [
    'ds-collapsible-icon-btn',
    `ds-collapsible-icon-btn--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} id={id}>
      <span className="ds-collapsible-icon-btn__tooltip" role="tooltip">{label}</span>
      <IconButton
        type="default"
        variant="secondary"
        size={size}
        icon={expanded ? 'chevron-up' : 'chevron-down'}
        ariaLabel={label}
        onClick={onToggle}
      />
    </span>
  );
}

export default CollapsibleIconButton;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<CollapsibleIconButton expanded={open} onToggle={() => setOpen(!open)} />

<CollapsibleIconButton variant="secondary" size="small" expanded={open} onToggle={fn} />
*/
