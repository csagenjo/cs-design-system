/**
 * BadgeHighlight — Componente atómico
 * CS Design System · v2.0 (10/11/2026, alineado con Figma `badgeHighlight`)
 *
 * Etiqueta corta de estado ("Paid", "Overdue", "New"). `variant` fija el color
 * (fondo, icono y, en positive/negative, el texto). No es interactivo.
 *
 * Figma → código:
 *   Variant Neutral/Positive/Negative/Emphasis/Disabled → `variant` (+ `disabled`)
 *   Icon (booleano + swap)                              → `icon` (nombre o nodo)
 *   Show Label                                          → `showLabel`
 *   Tooltip (booleano) + texto del tooltip              → `tooltip`
 *
 * Geometría = Figma: alto 24, padding 2/8, gap 4, radio 4, icono 16, label
 * label/sm 14/20. Sin borde (v1 tenía uno de 1 px que Figma no tiene).
 *
 * Accesibilidad (10/11, decisión con Carol):
 *   · El lector de pantalla siempre recibe el texto del badge: con label
 *     visible, o como texto oculto si es solo icono (`showLabel={false}`).
 *     El tooltip nunca es la única fuente del texto.
 *   · Con `tooltip`, el badge entra en el orden de tabulación (tabIndex 0) para
 *     que quien usa teclado sin lector también pueda verlo; muestra el anillo
 *     de foco del sistema. Sin tooltip, no es enfocable.
 *   · Si el tooltip repite el texto del badge, no se anuncia dos veces.
 *
 * USO:
 *   <BadgeHighlight variant="positive" label="Paid" />
 *   <BadgeHighlight variant="negative" icon="alert-circle" label="Overdue" tooltip="Payment 12 days late" />
 *   <BadgeHighlight variant="neutral" icon="lock" label="Locked" showLabel={false} tooltip="Locked" />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { VisuallyHidden } from './VisuallyHidden';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

const css = `
.ds-badge-highlight {
  display:        inline-flex;
  align-items:    center;
  box-sizing:     border-box;
  height:         var(--ds-badge-highlight-height);
  gap:            var(--ds-badge-highlight-gap);
  padding:        var(--ds-badge-highlight-padding-ver) var(--ds-badge-highlight-padding-hor);
  border-radius:  var(--ds-badge-highlight-border-radius);
  font-family:    inherit;
  font-weight:    var(--ds-font-weight-regular);
  font-size:      var(--ds-fontSize-label-sm);
  line-height:    var(--ds-lineHeight-label-sm);
  color:          var(--ds-badge-highlight-label-fg);
  white-space:    nowrap;
}
.ds-badge-highlight:focus-visible {
  outline:        var(--ds-badge-highlight-focus-width) solid var(--ds-badge-highlight-focus-outer);
  outline-offset: var(--ds-badge-highlight-focus-width);
  box-shadow:     0 0 0 var(--ds-badge-highlight-focus-width) var(--ds-badge-highlight-focus-inner);
}

.ds-badge-highlight__icon {
  flex-shrink: 0;
  display:     flex;
}
.ds-badge-highlight__icon svg {
  width:  var(--ds-badge-highlight-icon-size);
  height: var(--ds-badge-highlight-icon-size);
}

.ds-badge-highlight--emphasis { background: var(--ds-badge-highlight-bg-emphasis); }
.ds-badge-highlight--emphasis .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-emphasis); }

.ds-badge-highlight--neutral { background: var(--ds-badge-highlight-bg-neutral); }
.ds-badge-highlight--neutral .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-neutral); }

.ds-badge-highlight--positive {
  background: var(--ds-badge-highlight-bg-positive);
  color:      var(--ds-badge-highlight-label-fg-positive);
}
.ds-badge-highlight--positive .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-positive); }

.ds-badge-highlight--negative {
  background: var(--ds-badge-highlight-bg-negative);
  color:      var(--ds-badge-highlight-label-fg-negative);
}
.ds-badge-highlight--negative .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-negative); }

.ds-badge-highlight--disabled {
  background: var(--ds-badge-highlight-bg-disabled);
  color:      var(--ds-badge-highlight-label-fg-disabled);
}
.ds-badge-highlight--disabled .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-disabled); }
`;

injectStyles('ds-badge-highlight', css);

export function BadgeHighlight({
  variant   = 'neutral',   // 'emphasis' | 'neutral' | 'positive' | 'negative'
  disabled  = false,       // = Variant=Disabled de Figma
  label,
  showLabel = true,        // Figma "Show Label"; false = solo icono (el texto queda para el lector)
  icon,                    // nombre de icono (string) o nodo
  tooltip,                 // texto del tooltip (Figma "Tooltip"); vuelve el badge enfocable
  tooltipPlacement = 'top',
  ariaLabel,               // sustituye al texto visible para el lector ("Overdue by 12 days")
  id,
  className,
  ...rest                  // aria-describedby del Tooltip, data-*
}) {
  if (process.env.NODE_ENV !== 'production' && !showLabel && !icon) {
    console.warn('[BadgeHighlight] showLabel={false} sin icon: el badge queda vacío.');
  }

  const classes = [
    'ds-badge-highlight',
    disabled ? 'ds-badge-highlight--disabled' : `ds-badge-highlight--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  // Texto para el lector: ariaLabel si lo hay; si no, la label (visible u oculta).
  const srText = ariaLabel || (!showLabel ? label : null);
  const iconNode = typeof icon === 'string' ? <Icon name={icon} size="2xs" /> : icon;

  const badge = (
    <span id={id} className={classes} tabIndex={tooltip ? 0 : undefined} {...rest}>
      {iconNode && <span className="ds-badge-highlight__icon" aria-hidden="true">{iconNode}</span>}
      {showLabel && <span aria-hidden={srText ? 'true' : undefined}>{label}</span>}
      {srText && <VisuallyHidden>{srText}</VisuallyHidden>}
    </span>
  );

  if (!tooltip) return badge;
  // si el tooltip repite lo que ya lee el lector, no lo describe otra vez
  const spoken = srText || label;
  return (
    <Tooltip label={tooltip} placement={tooltipPlacement} describe={tooltip !== spoken}>
      {badge}
    </Tooltip>
  );
}

BadgeHighlight.displayName = 'BadgeHighlight';
export default BadgeHighlight;
