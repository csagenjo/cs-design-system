/**
 * PageTitle — Organismo
 * CS Design System · v1
 *
 * Encabezado de página para Web — genérico, no ata a un consumidor concreto
 * (mismo criterio que TopNavigation). RESPONSIVE de verdad: `__compact`
 * (Mobile+Tablet) y `__wide` (Desktop) se renderizan las dos siempre, media
 * query a 1024px decide cuál se ve (mismo mecanismo que TopNavigation).
 *
 * `nav` colapsa los 8 ejes reales de Figma (Close/Chevron/Link/Text/
 * TextBold/TextDisabled/None/Breadcrumb) en 4 tipos + `undefined` — Close y
 * Chevron/Back son el mismo mecanismo (un icono libre, no dos variantes
 * fijas); Text/TextBold/TextDisabled son el mismo átomo `Text` con otra
 * prop (`weight`/`disabled`), no 3 variantes distintas:
 *
 *   { type: 'icon', icon, ariaLabel, onClick }
 *   { type: 'link', label, href?, onClick? }   — href → <a>; solo onClick → <button> (A11y-0)
 *   { type: 'text', label, weight?: 'regular'|'bold', disabled?: boolean }
 *   { type: 'breadcrumb', items: [{ label, href?, onClick? }, ...] }  — Desktop only,
 *     último item = texto plano no clicable (la página actual, aria-current).
 *     `onBack` hace de la flecha un botón ("Back", `backLabel`) — A11y-3
 *   undefined → None
 *
 * `title` — string, instancia `<Headline level={1}>` SIEMPRE (nunca baja de
 * nivel semántico — decisión explícita de Carol: solo debe existir un h1 real
 * por página, aunque el tamaño visual cambie por device). El tamaño
 * responsive (48 desktop / 28 tablet / 19 mobile) ya lo resuelve `Headline`
 * internamente por CSS puro (§ ver Headline.jsx) — aquí no hace falta re-
 * tematizar nada, solo instanciarlo. Wrap real (nunca truncado — regla de
 * accesibilidad de Carol), el root crece en alto si el título ocupa más de
 * una línea.
 *
 * `actions` — array libre `{ icon, ariaLabel, onClick }`, sin límite fijo
 * (Figma solo muestra 3 como ejemplo, no como tope — mismo criterio que
 * CellActions/Table). En `__compact` son iconos sueltos clicables (sin
 * chrome de botón, igual que Figma); en `__wide` son `Button` real
 * (`variant="default" outline" size="sm"`, icon+label).
 *
 * Iconos de `nav`/`actions` en `__compact`: tamaño responsive vía CSS
 * (20 mobile / 24 tablet — `--ds-page-title-nav-icon-size-*`), no vía prop
 * de React — mismo `<Icon size="sm">` siempre, el `className` deja que la
 * media query sobreescriba el `width`/`height` real del SVG.
 *
 * USO:
 *   <PageTitle
 *     nav={{ type: 'icon', icon: 'X', ariaLabel: 'Cerrar', onClick: fn }}
 *     title="Título de página"
 *     actions={[
 *       { icon: 'Share2', ariaLabel: 'Compartir', onClick: fn },
 *       { icon: 'Heart', ariaLabel: 'Favorito', onClick: fn },
 *       { icon: 'Search', ariaLabel: 'Buscar', onClick: fn },
 *     ]}
 *   />
 *
 *   <PageTitle
 *     nav={{ type: 'breadcrumb', items: [
 *       { label: 'Nivel 1', onClick: fn }, { label: 'Nivel 2', onClick: fn },
 *       { label: 'Página actual' },
 *     ] }}
 *     title="Título de página"
 *     actions={[{ icon: 'Share2', ariaLabel: 'Compartir', onClick: fn }]}
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
.ds-page-title__nav-icon-btn {
  display: inline-flex;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--ds-page-title-nav-icon-fg);
}
.ds-page-title__actions {
  display: flex;
  align-items: center;
  gap: var(--ds-page-title-buttons-gap);
}
.ds-page-title__action-icon {
  display: inline-flex;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--ds-page-title-nav-icon-fg);
}
.ds-page-title__nav-icon,
.ds-page-title__action-icon svg {
  width: var(--ds-page-title-nav-icon-size-tablet);
  height: var(--ds-page-title-nav-icon-size-tablet);
}
@media (max-width: 767px) {
  .ds-page-title__nav-icon,
  .ds-page-title__action-icon svg {
    width: var(--ds-page-title-nav-icon-size-mobile);
    height: var(--ds-page-title-nav-icon-size-mobile);
  }
}

@media (min-width: 1024px) {
  .ds-page-title__compact { display: none; }
}

/* ── Wide (Desktop) ─────────────────────────────────────────────────────── */
.ds-page-title__wide {
  display: none;
  flex-direction: column;
  gap: var(--ds-page-title-root-gap);
  padding: var(--ds-page-title-root-padding-ver) var(--ds-page-title-root-padding-hor);
}
@media (min-width: 1024px) {
  .ds-page-title__wide { display: flex; }
}
.ds-page-title__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--ds-page-title-root-gap);
}
.ds-page-title__breadcrumb .ds-page-title__nav-icon-btn svg {
  width: var(--ds-page-title-nav-icon-size-desktop);
  height: var(--ds-page-title-nav-icon-size-desktop);
}
.ds-page-title__breadcrumb-list,
.ds-page-title__breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--ds-page-title-root-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}
.ds-page-title__breadcrumb-sep {
  color: var(--ds-page-title-nav-icon-fg);
  width: 16px;
  height: 16px;
}
.ds-page-title__breadcrumb-current {
  font-family: inherit;
  font-size: var(--ds-fontSize-label-sm);
  color: var(--ds-fg-subtle);
}
.ds-page-title__wide .ds-page-title__row {
  gap: var(--ds-page-title-root-gap);
}
.ds-page-title__wide .ds-page-title__row > .ds-headline {
  flex: 1 1 auto;
  min-width: 0;
}
`;

injectStyles('ds-page-title', css);

function NavCompact({ nav }) {
  if (!nav) return null;
  if (nav.type === 'icon') {
    return (
      <button type="button" className="ds-page-title__nav-icon-btn" aria-label={nav.ariaLabel} onClick={nav.onClick}>
        <Icon name={nav.icon} size="sm" className="ds-page-title__nav-icon" />
      </button>
    );
  }
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

function ActionsCompact({ actions }) {
  return (
    <div className="ds-page-title__actions">
      {actions.map((action, i) => (
        <button
          key={i}
          type="button"
          className="ds-page-title__action-icon"
          aria-label={action.ariaLabel}
          onClick={action.onClick}
        >
          <Icon name={action.icon} size="sm" className="ds-page-title__nav-icon" />
        </button>
      ))}
    </div>
  );
}

/* A11y-3 (21/10/2026): lista ordenada con la página actual en aria-current,
   separadores ocultos al lector. El botón de volver solo es botón si hay
   `onBack` (antes no hacía nada); sin él, la flecha es decorativa. */
function Breadcrumb({ items, onBack, backLabel = 'Back', ariaLabel = 'Breadcrumb' }) {
  return (
    <nav className="ds-page-title__breadcrumb" aria-label={ariaLabel}>
      {onBack ? (
        <button type="button" className="ds-page-title__nav-icon-btn" aria-label={backLabel} onClick={onBack}>
          <Icon name="ArrowLeft" size="sm" />
        </button>
      ) : (
        <span className="ds-page-title__nav-icon-btn" aria-hidden="true">
          <Icon name="ArrowLeft" size="sm" />
        </span>
      )}
      <ol className="ds-page-title__breadcrumb-list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="ds-page-title__breadcrumb-item">
              {isLast ? (
                <span className="ds-page-title__breadcrumb-current" aria-current="page">{item.label}</span>
              ) : (
                <>
                  <Link size="sm" emphasis="low" rightIcon={false} href={item.href} onClick={item.onClick}>{item.label}</Link>
                  <Icon name="ChevronRight" size="2xs" className="ds-page-title__breadcrumb-sep" />
                </>
              )}
            </li>
          );
        })}
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
          <NavCompact nav={nav} />
          <ActionsCompact actions={actions} />
        </div>
        <Headline level={1}>{title}</Headline>
      </div>

      {/* Desktop */}
      <div className="ds-page-title__wide">
        {nav && nav.type === 'breadcrumb' && <Breadcrumb items={nav.items} onBack={nav.onBack} backLabel={nav.backLabel} ariaLabel={nav.ariaLabel} />}
        <div className="ds-page-title__row">
          <Headline level={1}>{title}</Headline>
          <div className="ds-page-title__actions">
            {actions.map((action, i) => (
              <Button key={i} type="default" variant="secondary" size="sm" iconLeft={action.icon} onClick={action.onClick}>
                {action.ariaLabel}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageTitle;
