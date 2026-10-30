/**
 * PageTitle — Organismo
 * CS Design System · v2
 *
 * Encabezado de página para Web. `__compact` (Mobile + Tablet) y `__wide`
 * (Desktop) se renderizan los dos y una media query a 1024 decide cuál se ve
 * (el oculto sale del árbol de accesibilidad con display:none).
 *
 * 30/10/2026, alineado 1:1 con Figma (set "Page Title", Device × Nav):
 *   · Acciones neutras: Figma "Action 1/2/3" con icono de relleno (antes
 *     Share/Like/Search). Qué acción va en cada una lo decide el consumidor
 *     (compartir, favorito, buscar, descargar…), ver la documentación.
 *   · Iconos de nav y acciones en Mobile/Tablet: icono suelto (20 / 24 por
 *     device) dentro de un botón con padding 2 y anillo doble 2 + 2 al
 *     enfocar — mismo criterio que la X de DocumentItem. Antes sin foco.
 *   · Desktop: acciones = Button Default Tertiary Medium (antes Secondary
 *     Small); breadcrumb con el chevron dentro de cada Link y la página actual
 *     como Text 14; paddings y gaps de escritorio por token (antes los de
 *     móvil). Delante del breadcrumb, un pin de ubicación de 32 decorativo
 *     ("estás aquí", Carol): antes era una flecha de volver con `onBack`.
 *
 * `nav` (Mobile/Tablet): los 8 valores de Figma en 3 tipos —
 *   { type: 'icon', icon, ariaLabel, onClick }       — Close / Back
 *   { type: 'link', label, href?, onClick? }         — Link
 *   { type: 'text', label, weight?: 'regular'|'bold', disabled?: boolean } — Text / TextBold / TextDisabled
 *   undefined                                        — None
 * Desktop solo tiene breadcrumb (como Figma):
 *   { type: 'breadcrumb', items: [{ label, href?, onClick? }, …], ariaLabel? }
 *   el último item es la página actual (texto, aria-current). Para volver
 *   atrás se usan los propios enlaces del breadcrumb.
 *
 * `title` — siempre `<Headline level={1}>`: un solo h1 por página; el tamaño
 * por device lo pone Headline. Hace wrap, nunca se trunca.
 *
 * `actions` — `[{ icon, label, onClick }]`, sin límite (Figma muestra 3). En
 * Mobile/Tablet solo el icono, con `label` como nombre accesible; en Desktop
 * Button con icono y `label`. (`ariaLabel` sigue valiendo como `label`.)
 *
 * USO:
 *   <PageTitle
 *     nav={{ type: 'icon', icon: 'x', ariaLabel: 'Close', onClick: fn }}
 *     title="Payments"
 *     actions={[{ icon: 'share-2', label: 'Share', onClick: fn }]}
 *   />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Headline } from '../components/Headline';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

const css = `
.ds-page-title {
  width: 100%;
  box-sizing: border-box;
}

/* Botón de icono (nav y acciones): icono + padding 2, anillo doble al enfocar */
.ds-page-title__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0;
  padding: var(--ds-page-title-nav-padding);
  border: none;
  border-radius: 0;
  background: none;
  cursor: pointer;
  color: var(--ds-page-title-nav-icon-fg);
}
.ds-page-title__icon-btn:focus-visible {
  outline: var(--ds-page-title-nav-focus-width) solid var(--ds-page-title-nav-focus-outer);
  outline-offset: var(--ds-page-title-nav-focus-width);
  box-shadow: 0 0 0 var(--ds-page-title-nav-focus-width) var(--ds-page-title-nav-focus-inner);
}
.ds-page-title__icon-btn svg {
  width: var(--ds-page-title-nav-icon-size-tablet);
  height: var(--ds-page-title-nav-icon-size-tablet);
}
@media (max-width: 767px) {
  .ds-page-title__icon-btn svg {
    width: var(--ds-page-title-nav-icon-size-mobile);
    height: var(--ds-page-title-nav-icon-size-mobile);
  }
}

/* ── Compact (Mobile + Tablet) ─────────────────────────────────────────── */
.ds-page-title__compact {
  display: flex;
  flex-direction: column;
  gap: var(--ds-page-title-root-gap);
  padding: var(--ds-page-title-root-padding-ver) var(--ds-page-title-root-padding-hor);
}
.ds-page-title__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ds-page-title__actions {
  display: flex;
  align-items: center;
  gap: var(--ds-page-title-buttons-gap);
}
@media (min-width: 1024px) {
  .ds-page-title__compact { display: none; }
}

/* ── Wide (Desktop) ─────────────────────────────────────────────────────── */
.ds-page-title__wide {
  display: none;
  flex-direction: column;
  gap: var(--ds-page-title-desktop-root-gap);
  padding: var(--ds-page-title-desktop-root-padding-top) var(--ds-page-title-desktop-root-padding-hor) 0;
}
@media (min-width: 1024px) {
  .ds-page-title__wide { display: flex; }
}
.ds-page-title__wide .ds-page-title__row {
  gap: var(--ds-page-title-desktop-content-gap);
  padding: var(--ds-page-title-desktop-content-padding-ver) 0;
}
.ds-page-title__wide .ds-page-title__row > .ds-headline {
  flex: 1 1 auto;
  min-width: 0;
}
.ds-page-title__breadcrumb,
.ds-page-title__breadcrumb-list,
.ds-page-title__breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--ds-page-title-desktop-breadcrumb-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}
.ds-page-title__location {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--ds-page-title-nav-icon-fg);
}
.ds-page-title__location svg {
  width: var(--ds-page-title-nav-icon-size-desktop);
  height: var(--ds-page-title-nav-icon-size-desktop);
}
`;

injectStyles('ds-page-title', css);

const actionLabel = (a) => a.label ?? a.ariaLabel;

function IconButtonPlain({ icon, label, onClick }) {
  return (
    <button type="button" className="ds-page-title__icon-btn" aria-label={label} onClick={onClick}>
      <Icon name={icon} size="sm" />
    </button>
  );
}

function NavCompact({ nav }) {
  if (!nav) return null;
  if (nav.type === 'icon') return <IconButtonPlain icon={nav.icon} label={nav.ariaLabel} onClick={nav.onClick} />;
  if (nav.type === 'link') {
    return <Link size="sm" emphasis="low" rightIcon={false} href={nav.href} onClick={nav.onClick}>{nav.label}</Link>;
  }
  if (nav.type === 'text') {
    return (
      <Text size="14" weight={nav.weight === 'bold' ? 'bold' : 'regular'} color={nav.disabled ? 'disabled' : 'default'}>
        {nav.label}
      </Text>
    );
  }
  return null;
}

/* Lista ordenada, página actual con aria-current; el chevron va dentro de
   cada Link (como Figma) y es decorativo. */
function Breadcrumb({ items, ariaLabel = 'Breadcrumb' }) {
  return (
    <nav className="ds-page-title__breadcrumb" aria-label={ariaLabel}>
      <span className="ds-page-title__location" aria-hidden="true"><Icon name="map-pin" size="sm" /></span>
      <ol className="ds-page-title__breadcrumb-list">
        {items.map((item, i) => (
          <li key={i} className="ds-page-title__breadcrumb-item">
            {i === items.length - 1 ? (
              <span aria-current="page"><Text size="14" weight="regular">{item.label}</Text></span>
            ) : (
              <Link size="sm" emphasis="low" rightIcon="chevron-right" href={item.href} onClick={item.onClick}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageTitle({ nav, title, actions = [], className, style }) {
  return (
    <div className={`ds-page-title ${className || ''}`} style={style}>
      {/* Mobile + Tablet */}
      <div className="ds-page-title__compact">
        <div className="ds-page-title__row">
          <NavCompact nav={nav && nav.type !== 'breadcrumb' ? nav : undefined} />
          <div className="ds-page-title__actions">
            {actions.map((a, i) => <IconButtonPlain key={i} icon={a.icon} label={actionLabel(a)} onClick={a.onClick} />)}
          </div>
        </div>
        <Headline level={1}>{title}</Headline>
      </div>

      {/* Desktop */}
      <div className="ds-page-title__wide">
        {nav && nav.type === 'breadcrumb' && <Breadcrumb items={nav.items} ariaLabel={nav.ariaLabel} />}
        <div className="ds-page-title__row">
          <Headline level={1}>{title}</Headline>
          <div className="ds-page-title__actions">
            {actions.map((a, i) => (
              <Button key={i} type="default" variant="tertiary" size="md" iconLeft={a.icon} onClick={a.onClick}>
                {actionLabel(a)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageTitle;
