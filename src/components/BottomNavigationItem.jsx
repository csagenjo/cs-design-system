/**
 * BottomNavigationItem — Átomo
 * CS Design System · v1.0 (24/11/2026, alineado con Figma `Bottom Navigation Item`)
 *
 * Un destino de la Bottom Navigation: icono 20 arriba, label xs debajo y un
 * badge opcional (BadgeNotification Small) sobre el icono. Alto 56 =
 * padding 8 + icono 20 + gap 4 + label 16 + padding 8.
 *
 * Figma → código:
 *   State Enabled/Hover/Pressed/Focus → pseudo-clases CSS (no hay props)
 *   State Disabled                    → `disabled`
 *   Selected Yes/No                   → `selected` (icono fg/icon/primary + label en negrita)
 *   Label · Icon · Show Badge         → `label` · `icon` · `badge`
 *
 * Hover azul (bg/hover-primary) y pressed gris (bg/subtle), como Tabs. Foco
 * con anillo doble POR DENTRO (celdas pegadas): outline focus-outer + hueco
 * focus-inner en ::after.
 *
 * Accesibilidad: con `href` es un <a>, si no un <button>. El seleccionado
 * lleva aria-current="page". Disabled = aria-disabled (sigue en el orden de
 * Tab, no navega). El icono es decorativo; el badge va en el DOM detrás de
 * la label para que se lea "Payments, 3 pending" (`badgeLabel` por prop).
 *
 * USO (normalmente desde el organismo BottomNavigation):
 *   <BottomNavigationItem icon="wallet" label="Payments" href="/payments" selected />
 *   <BottomNavigationItem icon="file-text" label="Invoices" badge="3" badgeLabel="3 pending" onClick={fn} />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { BadgeNotification } from './BadgeNotification';
import { VisuallyHidden } from './VisuallyHidden';

const css = `
.ds-bottom-nav-item {
  position:        relative;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  gap:             var(--ds-bottom-navigation-gap-generic);
  box-sizing:      border-box;
  width:           100%;
  min-width:       0;
  margin:          0;
  padding:         var(--ds-bottom-navigation-padding-top) var(--ds-bottom-navigation-padding-hor) var(--ds-bottom-navigation-padding-bottom);
  border:          none;
  background:      transparent;
  font-family:     inherit;
  font-weight:     var(--ds-font-weight-regular);
  font-size:       var(--ds-fontSize-label-xs);
  line-height:     var(--ds-lineHeight-label-xs);
  color:           var(--ds-bottom-navigation-fg-label-generic);
  text-decoration: none;
  cursor:          pointer;
}
.ds-bottom-nav-item__icon {
  display: inline-flex;
  width:   var(--ds-bottom-navigation-size-icon);
  height:  var(--ds-bottom-navigation-size-icon);
  color:   var(--ds-bottom-navigation-fg-icon-default);
}
.ds-bottom-nav-item__label {
  max-width:     100%;
  overflow:      hidden;
  text-overflow: ellipsis;
  white-space:   nowrap;
}
.ds-bottom-nav-item__badge {
  position: absolute;
  top:      var(--ds-bottom-navigation-badge-top);
  left:     calc(50% + var(--ds-bottom-navigation-badge-offset-x));
  display:  inline-flex;
}
.ds-bottom-nav-item--selected { font-weight: var(--ds-font-weight-bold); }
.ds-bottom-nav-item--selected .ds-bottom-nav-item__icon { color: var(--ds-bottom-navigation-fg-icon-selected); }

.ds-bottom-nav-item:not(.ds-bottom-nav-item--disabled):hover  { background: var(--ds-bottom-navigation-bg-hover); }
.ds-bottom-nav-item:not(.ds-bottom-nav-item--disabled):active { background: var(--ds-bottom-navigation-bg-pressed); }

.ds-bottom-nav-item:focus-visible {
  outline:        var(--ds-bottom-navigation-border-width-focus) solid var(--ds-bottom-navigation-border-color-focus-outer);
  outline-offset: calc(-1 * var(--ds-bottom-navigation-border-width-focus));
}
.ds-bottom-nav-item:focus-visible::after {
  content:        '';
  position:       absolute;
  inset:          var(--ds-bottom-navigation-border-width-focus);
  box-shadow:     inset 0 0 0 var(--ds-bottom-navigation-border-width-focus) var(--ds-bottom-navigation-border-color-focus-inner);
  pointer-events: none;
}

.ds-bottom-nav-item--disabled { cursor: default; color: var(--ds-bottom-navigation-fg-label-disabled); }
.ds-bottom-nav-item--disabled .ds-bottom-nav-item__icon { color: var(--ds-bottom-navigation-fg-icon-disabled); }
`;

injectStyles('ds-bottom-nav-item', css);

export function BottomNavigationItem({
  icon,                 // nombre del átomo Icon (decorativo)
  label,
  selected = false,
  disabled = false,
  badge,                // número o texto corto del BadgeNotification ("3", "99+")
  badgeLabel,           // lo que cuenta, para el lector: "3 pending"
  href,
  onClick,
  id,
  className,
  ...rest               // aria-*/data-* llegan al <a>/<button>
}) {
  const Tag = href && !disabled ? 'a' : 'button';
  const classes = [
    'ds-bottom-nav-item',
    selected ? 'ds-bottom-nav-item--selected' : '',
    disabled ? 'ds-bottom-nav-item--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled) { e.preventDefault(); return; }
    onClick?.(e);
  };

  return (
    <Tag
      {...rest}
      {...(Tag === 'a' ? { href } : { type: 'button' })}
      id={id}
      className={classes}
      onClick={handleClick}
      aria-current={selected ? 'page' : undefined}
      aria-disabled={disabled || undefined}
    >
      <span className="ds-bottom-nav-item__icon" aria-hidden="true">
        {icon && <Icon name={icon} size="xs" />}
      </span>
      <span className="ds-bottom-nav-item__label">{label}</span>
      {badge != null && badge !== '' && (
        <span className="ds-bottom-nav-item__badge">
          <VisuallyHidden>, </VisuallyHidden>
          <BadgeNotification label={String(badge)} ariaLabel={badgeLabel} disabled={disabled} />
        </span>
      )}
    </Tag>
  );
}

BottomNavigationItem.displayName = 'BottomNavigationItem';
export default BottomNavigationItem;
