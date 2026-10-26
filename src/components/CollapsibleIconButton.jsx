/**
 * CollapsibleIconButton — Componente atómico
 * CS Design System · v1.0
 *
 * Variante icon-only de Collapsible, con tooltip mostrando "Expand"/
 * "Collapse" al hover/focus. Instancia `IconButton` (`type="default"
 * variant="secondary"`) y `Tooltip` (`placement="top"`) sin reimplementar su
 * lógica — mismo mecanismo de re-tematización por CSS custom properties que
 * `Collapsible.jsx`. Hasta el 01/10/2026 llevaba un tooltip CSS local propio
 * (anterior al átomo, con px sueltos y sin flecha); ahora el `aria-describedby`
 * de Tooltip llega al botón gracias al rest-spread de IconButton (30/09).
 *
 * `expanded` decide icono + texto del tooltip: `false` → chevron-down/
 * "Expand", `true` → chevron-up/"Collapse".
 *
 * USO:
 *   <CollapsibleIconButton expanded={open} onToggle={() => setOpen(!open)} />
 *   <CollapsibleIconButton variant="secondary" size="small" expanded={open} onToggle={fn} />
 *
 * A11y-3 (21/10/2026): `aria-expanded` en el botón; `controls` = id del
 * contenido que abre/cierra (→ `aria-controls`). El tooltip ya es el nombre
 * del botón, así que no se repite como descripción.
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { IconButton } from './IconButton';
import { Tooltip } from './Tooltip';

const css = `
.ds-collapsible-icon-btn {
  display: inline-block;
}
.ds-collapsible-icon-btn--default {
  --ds-icon-button-border-color-default:       var(--ds-collapsible-border-color-default);
  --ds-icon-button-icon-fg-on-outline-default: var(--ds-collapsible-icon-fg-default);
}
.ds-collapsible-icon-btn--secondary {
  --ds-icon-button-border-color-default:       var(--ds-collapsible-border-color-secondary);
  --ds-icon-button-icon-fg-on-outline-default: var(--ds-collapsible-icon-fg-secondary);
  /* Hover/Pressed rellenan con el fondo de Primary: en Secondary, el rosa. */
  --ds-icon-button-bg-default-primary:         var(--ds-collapsible-border-color-secondary);
  --ds-icon-button-icon-fg-on-color-default:   var(--ds-collapsible-fg-on-color);
}
`;

injectStyles('ds-collapsible-icon-btn', css);

export function CollapsibleIconButton({
  variant  = 'default', // 'default' | 'secondary'
  size     = 'medium',   // 'small' | 'medium' | 'large' — misma escala que IconButton
  expanded = false,
  onToggle,
  labels   = { expand: 'Expand', collapse: 'Collapse' },
  controls,
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
      <Tooltip label={label} placement="top" describe={false}>
        <IconButton
          type="default"
          variant="secondary"
          size={size}
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          ariaLabel={label}
          aria-expanded={expanded}
          aria-controls={expanded ? controls : undefined}
          onClick={onToggle}
        />
      </Tooltip>
    </span>
  );
}

export default CollapsibleIconButton;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<CollapsibleIconButton expanded={open} onToggle={() => setOpen(!open)} />

<CollapsibleIconButton variant="secondary" size="small" expanded={open} onToggle={fn} />
*/
