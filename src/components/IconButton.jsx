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
import { warnOnce } from './_devWarn';
import { Icon } from './Icon';
import { LoadingSpinner } from './LoadingSpinner';
import { VisuallyHidden } from './VisuallyHidden';
import { announce } from './announce';

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
.ds-icon-btn:disabled {
  cursor: not-allowed;
  pointer-events: none;
}

/* Colores por tipo: relleno de Primary, velo de hover, línea y tinta de
   contorno, icono sobre color. */
.ds-icon-btn--default { --_fill: var(--ds-icon-button-bg-default-primary); --_mix: var(--ds-icon-button-bg-mix-default-hover); --_line: var(--ds-icon-button-border-color-default); --_ink: var(--ds-icon-button-icon-fg-on-outline-default); --_on: var(--ds-icon-button-icon-fg-on-color-default); }
.ds-icon-btn--accent  { --_fill: var(--ds-icon-button-bg-accent-primary);  --_mix: var(--ds-icon-button-bg-mix-accent-hover);  --_line: var(--ds-icon-button-border-color-accent);  --_ink: var(--ds-icon-button-icon-fg-on-outline-accent);  --_on: var(--ds-icon-button-icon-fg-on-color-accent); }

/* Enabled */
.ds-icon-btn--default-primary .ds-icon-btn__circle,
.ds-icon-btn--accent-primary .ds-icon-btn__circle { background: var(--_fill); color: var(--_on); }
.ds-icon-btn--default-secondary .ds-icon-btn__circle,
.ds-icon-btn--accent-secondary .ds-icon-btn__circle {
  border-width: var(--ds-icon-button-border-width-secondary);
  border-color: var(--_line);
  color:        var(--_ink);
}
.ds-icon-btn--default-tertiary .ds-icon-btn__circle,
.ds-icon-btn--accent-tertiary .ds-icon-btn__circle { color: var(--_ink); }

/* Hover (y Focus Hover): las tres variantes se rellenan con el fondo de
   Primary + bgMix, icono on-color — igual que Figma. */
.ds-icon-btn:hover:not(:disabled):not(.ds-icon-btn--loading) .ds-icon-btn__circle {
  background: linear-gradient(var(--_mix), var(--_mix)), var(--_fill);
  color:      var(--_on);
}
/* Pressed: relleno de Primary al 80 % (iconButton/all/root/opacity/pressed),
   también en Secondary y Tertiary — igual que Figma. */
.ds-icon-btn:active:not(:disabled):not(.ds-icon-btn--loading) .ds-icon-btn__circle {
  background: var(--_fill);
  color:      var(--_on);
  opacity:    var(--ds-icon-button-opacity-pressed);
}
/* Loading: aspecto de Enabled, spinner en el sitio del icono. */
.ds-icon-btn--loading { cursor: progress; }
.ds-icon-btn__spinner { width: var(--_icon); height: var(--_icon); }
.ds-icon-btn--small  { --_icon: var(--ds-icon-button-icon-size-small); }
.ds-icon-btn--medium { --_icon: var(--ds-icon-button-icon-size-medium); }
.ds-icon-btn--large  { --_icon: var(--ds-icon-button-icon-size-large); }

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
  loading   = false,          // State=Loading: spinner en el sitio del icono
  loadingLabel = 'Loading',   // se añade al nombre y se anuncia (inglés por defecto)
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
    loading ? 'ds-icon-btn--loading' : '',
    className || '',
  ].filter(Boolean).join(' ');

  // A11y-3: con `label` visible, ese texto ES el nombre (WCAG 2.5.3: quien
  // dice "pulsa Editar" tiene que poder usarlo). `ariaLabel` solo se usa si
  // contiene el texto visible ("Editar dirección"); si no, se ignora y se avisa.
  // Sin label ni ariaLabel, el botón no tiene nombre: aviso en desarrollo.
  const explicit = ariaLabel ?? rest['aria-label'];
  let name = explicit;
  if (label && explicit && !String(explicit).toLowerCase().includes(String(label).toLowerCase())) {
    warnOnce(`IconButton.label.${label}`, `[DS IconButton] \`ariaLabel\` ("${explicit}") no contiene el texto visible ("${label}"); se usa el texto visible.`);
    name = undefined;
  }
  if (!label && !explicit && !rest['aria-labelledby']) {
    warnOnce('IconButton.unnamed', '[DS IconButton] Sin `label` ni `ariaLabel`: el botón no tiene nombre para el lector de pantalla.');
  }

  // Loading (igual que Button): aria-disabled (no pierde el foco), el click no
  // hace nada, ", Loading" entra en el nombre y se anuncia al empezar.
  const wasLoading = React.useRef(loading);
  React.useEffect(() => {
    if (loading && !wasLoading.current) announce(loadingLabel);
    wasLoading.current = loading;
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps
  const loadingName = loading && name ? `${name}, ${loadingLabel}` : name;

  return (
    <button
      {...rest}
      id={id}
      type={htmlType}
      className={classes}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      disabled={disabled}
      aria-disabled={loading && !disabled ? 'true' : undefined}
      aria-busy={loading || undefined}
      aria-label={loadingName}
    >
      <span className="ds-icon-btn__circle">
        {loading
          ? <LoadingSpinner color="current" label="" className="ds-icon-btn__spinner" />
          : <Icon name={icon} size={ICON_SIZE_BY_BUTTON_SIZE[size]} />}
      </span>
      {label && (
        <span className="ds-icon-btn__label">
          {label}
          {loading && <VisuallyHidden>{`, ${loadingLabel}`}</VisuallyHidden>}
        </span>
      )}
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
