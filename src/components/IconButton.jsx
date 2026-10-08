/**
 * IconButton — Componente atómico
 * CS Design System · v1.0
 *
 * Botón circular icon-only, con label opcional debajo del icono
 * (`with Label=Yes` en Figma). Hover/Pressed/Focus se resuelven vía
 * pseudo-clases CSS nativas (mismo criterio que Checkbox/ListView) — no hay
 * props de estado para ellos.
 *
 * `type` (Default/Accent) fija la familia de color; `variant`
 * (Primary/Secondary/Tertiary) fija el estilo: Primary = relleno,
 * Secondary = contorno, Tertiary = ghost (sin borde visible).
 *
 * Icono: reutiliza el átomo `Icon` (nunca reimplementado aquí) — el color
 * se resuelve por contraste real (on-color relleno / on-outline contorno),
 * nunca por Variant de origen (regla CLAUDE.md §4).
 *
 * Focus ring: doble anillo POR FUERA del círculo, con o sin label (08/10/2026,
 * igual que Figma) — hueco de 2px pegado al borde y anillo exterior de 2px
 * en el color de foco del sistema. El borde del círculo queda intacto. El
 * componente reserva 4px de área de foco (padding) para que el anillo quede
 * dentro de su caja, igual que en Figma.
 *
 * USO:
 *   <IconButton icon="search" ariaLabel="Buscar" />
 *   <IconButton type="accent" variant="primary" icon="plus" ariaLabel="Añadir" />
 *   <IconButton variant="tertiary" size="small" icon="x" ariaLabel="Cerrar" />
 *   <IconButton icon="chevron-down" label="Expandir" onClick={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const ICON_SIZE_BY_BUTTON_SIZE = { small: '2xs', medium: 'xs', large: 'sm' };

const css = `
.ds-icon-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  /* Área de foco (08/10/2026, igual que Figma): padding del frame del
     componente para que el anillo quede DENTRO de su caja (Large = 56 + 2×4). */
  padding: var(--ds-icon-button-focus-area-padding);
  border-radius: var(--ds-icon-button-border-radius);
  border: 0 solid transparent;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  box-sizing: border-box;
  transition: background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
}
.ds-icon-btn__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ds-icon-button-border-radius);
  border: 0 solid transparent; /* sin grosor explícito el navegador aplica 3px (medium) invisibles */
  box-sizing: border-box;
}
.ds-icon-btn--small  { --_pad: var(--ds-icon-button-padding-small); }
.ds-icon-btn--medium { --_pad: var(--ds-icon-button-padding-medium); }
.ds-icon-btn--large  { --_pad: var(--ds-icon-button-padding-large); }
.ds-icon-btn__circle { padding: var(--_pad); }
/* Borde por dentro, como Figma (strokeAlign INSIDE): el padding descuenta el
   borde para que Secondary mida lo mismo que Primary/Tertiary (32/44/56). */
.ds-icon-btn--default-secondary,
.ds-icon-btn--accent-secondary { --_bw: var(--ds-icon-button-border-width-secondary); }
.ds-icon-btn--default-secondary .ds-icon-btn__circle,
.ds-icon-btn--accent-secondary .ds-icon-btn__circle {
  padding: calc(var(--_pad) - var(--_bw));
}

.ds-icon-btn__label {
  padding: 0 var(--ds-icon-button-label-padding-hor);
  font-weight: var(--ds-font-weight-bold);
  white-space: nowrap;
}
.ds-icon-btn--small .ds-icon-btn__label  { font-size: var(--ds-fontSize-label-xs); }
.ds-icon-btn--medium .ds-icon-btn__label { font-size: var(--ds-fontSize-label-sm); }
.ds-icon-btn--large .ds-icon-btn__label  { font-size: var(--ds-fontSize-label-md); }

.ds-icon-btn:focus-visible {
  outline: none;
}
/* Foco POR FUERA del círculo, con o sin label (08/10/2026, igual que Figma):
   hueco de 2px pegado al borde (box-shadow sin blur) + anillo exterior de 2px
   en el color de foco del sistema (outline con offset). El borde de Secondary
   queda intacto. Cabe entero en el padding del área de foco, sin cortarse. */
.ds-icon-btn:focus-visible .ds-icon-btn__circle {
  outline:        var(--ds-icon-button-focus-width) solid var(--ds-icon-button-border-color-focus-outer);
  outline-offset: var(--ds-icon-button-focus-width);
  box-shadow:     0 0 0 var(--ds-icon-button-focus-width) var(--ds-icon-button-border-color-focus-inner);
}
.ds-icon-btn:active:not(:disabled) .ds-icon-btn__circle {
  opacity: var(--ds-icon-button-opacity-pressed);
}
.ds-icon-btn:disabled {
  cursor: not-allowed;
  pointer-events: none;
}

/* Primary — relleno */
.ds-icon-btn--default-primary .ds-icon-btn__circle {
  background: var(--ds-icon-button-bg-default-primary);
  color:      var(--ds-icon-button-icon-fg-on-color-default);
}
.ds-icon-btn--default-primary:hover:not(:disabled) .ds-icon-btn__circle {
  background: color-mix(in srgb, var(--ds-icon-button-bg-default-primary), white 8%);
}
.ds-icon-btn--accent-primary .ds-icon-btn__circle {
  background: var(--ds-icon-button-bg-accent-primary);
  color:      var(--ds-icon-button-icon-fg-on-color-accent);
}
.ds-icon-btn--accent-primary:hover:not(:disabled) .ds-icon-btn__circle {
  background: color-mix(in srgb, var(--ds-icon-button-bg-accent-primary), black 8%);
}

/* Secondary — contorno */
.ds-icon-btn--default-secondary .ds-icon-btn__circle {
  border-width: var(--ds-icon-button-border-width-secondary);
  border-color: var(--ds-icon-button-border-color-default);
  color:        var(--ds-icon-button-icon-fg-on-outline-default);
}
.ds-icon-btn--default-secondary:hover:not(:disabled) .ds-icon-btn__circle {
  background: var(--ds-icon-button-bg-mix-default-hover);
}
.ds-icon-btn--accent-secondary .ds-icon-btn__circle {
  border-width: var(--ds-icon-button-border-width-secondary);
  border-color: var(--ds-icon-button-border-color-accent);
  color:        var(--ds-icon-button-icon-fg-on-outline-accent);
}
.ds-icon-btn--accent-secondary:hover:not(:disabled) .ds-icon-btn__circle {
  background: var(--ds-icon-button-bg-mix-accent-hover);
}

/* Tertiary — ghost, sin borde visible */
.ds-icon-btn--default-tertiary .ds-icon-btn__circle {
  color: var(--ds-icon-button-icon-fg-on-outline-default);
}
.ds-icon-btn--default-tertiary:hover:not(:disabled) .ds-icon-btn__circle {
  background: var(--ds-icon-button-bg-mix-default-hover);
}
.ds-icon-btn--accent-tertiary .ds-icon-btn__circle {
  color: var(--ds-icon-button-icon-fg-on-outline-accent);
}
.ds-icon-btn--accent-tertiary:hover:not(:disabled) .ds-icon-btn__circle {
  background: var(--ds-icon-button-bg-mix-accent-hover);
}

/* Disabled — mismo para las 3 variantes */
.ds-icon-btn:disabled .ds-icon-btn__circle {
  background:   var(--ds-icon-button-bg-disabled);
  border-color: var(--ds-icon-button-border-color-disabled);
  color:        var(--ds-icon-button-icon-fg-disabled);
}
.ds-icon-btn--tertiary:disabled .ds-icon-btn__circle,
.ds-icon-btn--default-tertiary:disabled .ds-icon-btn__circle,
.ds-icon-btn--accent-tertiary:disabled .ds-icon-btn__circle {
  background: transparent;
}
.ds-icon-btn:disabled .ds-icon-btn__label {
  color: var(--ds-icon-button-label-fg-disabled);
}
.ds-icon-btn--default:not(:disabled) .ds-icon-btn__label { color: var(--ds-icon-button-label-fg-default); }
.ds-icon-btn--accent:not(:disabled) .ds-icon-btn__label  { color: var(--ds-icon-button-label-fg-accent); }
`;

injectStyles('ds-icon-btn', css);

export function IconButton({
  type      = 'default',   // 'default' | 'accent'
  variant   = 'secondary',  // 'primary' | 'secondary' | 'tertiary'
  size      = 'medium',     // 'small' | 'medium' | 'large'
  icon,
  label,
  disabled  = false,
  onClick,
  ariaLabel,
  htmlType  = 'button',
  id,
  className,
  ...rest   // aria-*/data-*/title/handlers de wrappers (Tooltip, PopoverSheet) llegan al <button> real
}) {
  const classes = [
    'ds-icon-btn',
    `ds-icon-btn--${size}`,
    `ds-icon-btn--${type}`,
    `ds-icon-btn--${type}-${variant}`,
    label ? 'ds-icon-btn--has-label' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      id={id}
      type={htmlType}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? rest['aria-label']}
    >
      <span className="ds-icon-btn__circle">
        <Icon name={icon} size={ICON_SIZE_BY_BUTTON_SIZE[size]} />
      </span>
      {label && <span className="ds-icon-btn__label">{label}</span>}
    </button>
  );
}

export default IconButton;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<IconButton icon="search" ariaLabel="Buscar" />
<IconButton type="accent" variant="primary" icon="plus" ariaLabel="Añadir" />
<IconButton variant="tertiary" size="small" icon="x" ariaLabel="Cerrar" />
<IconButton size="large" icon="filter" ariaLabel="Filtrar" disabled />
<IconButton icon="chevron-down" label="Expandir" onClick={() => {}} />
*/
