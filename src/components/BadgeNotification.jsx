/**
 * BadgeNotification — Componente atómico
 * CS Design System · v2.0 (10/11/2026, alineado con Figma `badgeNotification`)
 *
 * Contador de elementos pendientes (3, 12, 99+). No es interactivo.
 *
 * Figma → código:
 *   Color Default/Primary/Secondary/Tertiary/Disabled → `color` (+ `disabled`)
 *   Size Small/Expanded                               → `size` 'small' | 'expanded'
 *   Label                                             → `label`
 *
 * Geometría = Figma: padding horizontal 6 en los dos tamaños; Small 16 de alto
 * sin mínimo de ancho; Expanded 24 de alto (4 + 16 + 4) y 24 de ancho mínimo.
 * Texto label/xs 12/16 bold, centrado.
 *
 * `size="default"` (nombre de v1) sigue funcionando como 'small'.
 *
 * Accesibilidad: el número solo no dice qué cuenta. `ariaLabel` ("3 unread
 * messages") sustituye al número para el lector; sin él se lee el número.
 *
 * USO:
 *   <BadgeNotification label="3" ariaLabel="3 unread messages" />
 *   <BadgeNotification color="secondary" size="expanded" label="12" ariaLabel="12 selected" />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { VisuallyHidden } from './VisuallyHidden';

const css = `
.ds-badge-notification {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  box-sizing:      border-box;
  padding:         0 var(--ds-badge-notification-padding-hor);
  border-radius:   var(--ds-badge-notification-border-radius);
  font-family:     inherit;
  font-size:       var(--ds-fontSize-label-xs);
  font-weight:     var(--ds-font-weight-bold);
  line-height:     var(--ds-lineHeight-label-xs);
  text-align:      center;
  color:           var(--ds-badge-notification-fg-label);
  white-space:     nowrap;
}
.ds-badge-notification--expanded {
  min-width: var(--ds-badge-notification-min-width-expanded);
  padding:   var(--ds-badge-notification-padding-ver-expanded) var(--ds-badge-notification-padding-hor);
}

.ds-badge-notification--default   { background: var(--ds-badge-notification-bg-default); }
.ds-badge-notification--primary   { background: var(--ds-badge-notification-bg-primary); }
.ds-badge-notification--secondary { background: var(--ds-badge-notification-bg-secondary); }
.ds-badge-notification--tertiary  { background: var(--ds-badge-notification-bg-tertiary); }

.ds-badge-notification--disabled {
  background: var(--ds-badge-notification-bg-disabled);
  color:      var(--ds-badge-notification-fg-label-disabled);
}
`;

injectStyles('ds-badge-notification', css);

export function BadgeNotification({
  color    = 'default',   // 'default' | 'primary' | 'secondary' | 'tertiary'
  size     = 'small',     // 'small' | 'expanded' ('default' = 'small', nombre de v1)
  disabled = false,       // = Color=Disabled de Figma
  label,
  ariaLabel,              // lo que cuenta: "3 unread messages"
  id,
  className,
}) {
  const classes = [
    'ds-badge-notification',
    disabled ? 'ds-badge-notification--disabled' : `ds-badge-notification--${color}`,
    size === 'expanded' ? 'ds-badge-notification--expanded' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    // A11y-3: aria-label en un <span> sin rol no se lee. Con `ariaLabel` el
    // número visible se oculta al lector y se lee el texto completo.
    <span id={id} className={classes}>
      {ariaLabel ? (
        <>
          <span aria-hidden="true">{label}</span>
          <VisuallyHidden>{ariaLabel}</VisuallyHidden>
        </>
      ) : label}
    </span>
  );
}

BadgeNotification.displayName = 'BadgeNotification';
export default BadgeNotification;
