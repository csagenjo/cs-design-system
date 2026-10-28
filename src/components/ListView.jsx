/**
 * ListView — Componente atómico
 * CS Design System · v2 (28/10/2026: alineado 1:1 con Figma)
 *
 * Fila interactiva de un listado (Search for Results, menús): la fila entera
 * es un <button>. Hover (azul), pressed (opacidad) y foco (doble anillo POR
 * DENTRO, las filas van apiladas) por pseudo-clases; solo `disabled` es prop.
 *
 * Figma `List View` (State × Divider; Selected, Description, Detail, Left
 * Panel, Right Panel, Swap Description):
 *   · Header → SectionHeader · Description → DescriptionText (o `swapDescription`,
 *     p. ej. Text) · Detail → DetailText
 *   · Left Panel: icono (`leftIcon`, 24) o un control de selección (`control`)
 *   · Right Panel: slot libre (`rightPanelContent`: AmountView, BadgeHighlight,
 *     Badge + chevron, Icon, LoadingSpinner…) o el control de selección
 *   · Divider: none · partialBottom (desde el contenido, deja libre el panel
 *     izquierdo) · fullBottom · allSides — 1 px, tokens propios
 *   · Selected: ribbon de 4 a la izquierda (`selected`, `aria-current`)
 *
 * Geometría (tokens listView/all/*): fila padding-left 16 y gap 16; contenido
 * padding 16 arriba/derecha/abajo; header → descripción → detalle 4. Los
 * divisores van por dentro (no suman alto), como el stroke INSIDE de Figma.
 *
 * CONTROL DE SELECCIÓN (28/10, decisión de Carol): con `control` = 'checkbox' |
 * 'radio' | 'switch' la fila ES ese control (role checkbox / radio / switch +
 * aria-checked, Espacio/Enter lo cambian vía onClick). El Checkbox / Radio /
 * Switch que se ve es solo el indicador (inert, fuera del Tab). `controlPlacement`
 * left/right. Varias filas radio: el consumidor las envuelve en un contenedor
 * con role="radiogroup" y nombre.
 *
 * USO:
 *   <ListView header="Customer" descriptionText="ID 4521" detailText="Since 12/03/2026" onClick={open} />
 *   <ListView header="Account" rightPanelContent={<AmountView amount="1,250.00" currency="EUR" />} divider="fullBottom" />
 *   <ListView header="Email alerts" control="switch" controlPlacement="right" checked={on} onClick={() => setOn(!on)} />
 */

import React, { useEffect, useRef } from 'react';
import { warnOnce } from './_devWarn';
import { injectStyles } from './_inputBase';
import { SectionHeader } from './SectionHeader';
import { DescriptionText } from './DescriptionText';
import { DetailText } from './DetailText';
import { Icon } from './Icon';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';

const css = `
.ds-list-view {
  --_dw: var(--ds-list-view-divider-width);
  --_dc: var(--ds-list-view-divider-color-generic);
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--ds-list-view-root-gap);
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0 0 0 var(--ds-list-view-root-padding);
  background: var(--ds-list-view-root-bg-generic);
  border: 0 solid var(--_dc);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: inherit;
}
.ds-list-view:disabled { --_dc: var(--ds-list-view-divider-color-disabled); }

.ds-list-view__content {
  display: flex;
  align-items: center;
  gap: var(--ds-list-view-root-gap);
  flex: 1 0 0;
  min-width: 0;
  box-sizing: border-box;
  padding: var(--ds-list-view-root-padding) var(--ds-list-view-root-padding) var(--ds-list-view-root-padding) 0;
  border: 0 solid var(--_dc);
}

/* Divisores por dentro: el padding descuenta el grosor de la línea */
.ds-list-view--partial-bottom .ds-list-view__content {
  border-bottom-width: var(--_dw);
  padding-bottom: calc(var(--ds-list-view-root-padding) - var(--_dw));
}
.ds-list-view--full-bottom { border-bottom-width: var(--_dw); }
.ds-list-view--full-bottom .ds-list-view__content { padding-bottom: calc(var(--ds-list-view-root-padding) - var(--_dw)); }
.ds-list-view--all-sides { border-width: var(--_dw); padding-left: calc(var(--ds-list-view-root-padding) - var(--_dw)); }
.ds-list-view--all-sides .ds-list-view__content {
  padding: calc(var(--ds-list-view-root-padding) - var(--_dw)) calc(var(--ds-list-view-root-padding) - var(--_dw)) calc(var(--ds-list-view-root-padding) - var(--_dw)) 0;
}

.ds-list-view:hover:not(:disabled)  { background: var(--ds-list-view-root-bg-hover); }
.ds-list-view:active:not(:disabled) { opacity: var(--ds-list-view-root-opacity-pressed); }
/* Foco: doble anillo por dentro (Figma: Focus outer / Focus inner) */
.ds-list-view:focus-visible {
  outline: var(--ds-list-view-root-border-width-focus) solid var(--ds-list-view-root-border-color-focus-outer);
  outline-offset: calc(-1 * var(--ds-list-view-root-border-width-focus));
  box-shadow: inset 0 0 0 calc(2 * var(--ds-list-view-root-border-width-focus)) var(--ds-list-view-root-border-color-focus-inner);
}
.ds-list-view:disabled { background: var(--ds-list-view-root-bg-disabled); cursor: not-allowed; }

.ds-list-view__panel {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.ds-list-view__left-icon { color: var(--ds-list-view-icon-left-fg-generic); }
.ds-list-view:disabled .ds-list-view__left-icon { color: var(--ds-list-view-icon-left-fg-disabled); }
.ds-list-view__panel--right { flex-direction: column; align-items: flex-end; }

.ds-list-view__center {
  display: flex;
  flex-direction: column;
  gap: var(--ds-list-view-center-gap);
  flex: 1 0 0;
  min-width: 0;
}
.ds-list-view__row { display: flex; align-items: center; width: 100%; overflow: hidden; }

.ds-list-view__ribbon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--ds-list-view-ribbon-border-width-selected);
  background: var(--ds-list-view-ribbon-border-color-selected);
}
.ds-list-view:disabled .ds-list-view__ribbon { background: var(--ds-list-view-ribbon-border-color-disabled); }

/* El indicador del control no reacciona por su cuenta: lo pinta la fila */
.ds-list-view__control { pointer-events: none; }
.ds-list-view__control .ds-checkbox,
.ds-list-view__control .ds-radio,
.ds-list-view__control .ds-switch { background: transparent; opacity: 1; }
`;

injectStyles('ds-list-view', css);

const ICON_SIZE_MAP = { '2xs': '2xs', xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', '3xl': '3xl' };
const CONTROL_ROLE = { checkbox: 'checkbox', radio: 'radio', switch: 'switch' };

function ControlIndicator({ control, checked, disabled, name }) {
  // Solo visual (inert): el nombre real lo da la fila; se pasa para no disparar avisos de "sin nombre".
  const state = disabled ? 'disabled' : 'default';
  const common = { checked: !!checked, onChange: () => {}, ariaLabel: name };
  return (
    <span className="ds-list-view__panel ds-list-view__control" inert aria-hidden="true">
      {control === 'checkbox' && <Checkbox {...common} state={state} />}
      {control === 'radio' && <Radio {...common} state={state} showLabel={false} />}
      {control === 'switch' && <Switch {...common} state={state} showLabel={false} />}
    </span>
  );
}

export function ListView({
  header,
  description       = true,
  descriptionText    = 'Description',
  swapDescription,
  detail             = true,
  detailText         = 'Here is some detail text',
  detailColor,       // 'default' | 'secondary' | 'tertiary'
  leftPanel          = true,
  leftIcon,
  leftIconSize       = 'sm', // escala de Icon.jsx; Figma: 24 (sm)
  rightPanel         = true,
  rightPanelContent,
  control,           // 'checkbox' | 'radio' | 'switch' — la fila es ese control
  controlPlacement   = 'left', // 'left' | 'right'
  checked            = false,
  selected           = false,
  current            = 'true', // aria-current cuando `selected` — 'page' en navegación (SidebarMenu)
  divider            = 'none', // 'none' | 'partialBottom' | 'fullBottom' | 'allSides'
  disabled           = false,
  onClick,
  id,
  className,
  ...rest
}) {
  const dividerClass = {
    partialBottom: 'ds-list-view--partial-bottom',
    fullBottom: 'ds-list-view--full-bottom',
    allSides: 'ds-list-view--all-sides',
  }[divider] || '';

  const role = CONTROL_ROLE[control];

  // A11y-5: la fila entera es un <button>; un control dentro de otro control no
  // es válido. Aviso si `rightPanelContent` / `swapDescription` traen algo
  // interactivo (el indicador de `control` es inert y no cuenta).
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    const focusables = el ? [...el.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')] : [];
    if (focusables.some((n) => !n.closest('[inert]'))) {
      warnOnce('ListView.nested', '[DS ListView] La fila ya es un botón: no metas botones, enlaces ni campos en `rightPanelContent` / `swapDescription`. Para seleccionar, usa la prop `control`.');
    }
  });

  const classes = ['ds-list-view', dividerClass, className || ''].filter(Boolean).join(' ');
  const indicator = role ? <ControlIndicator control={control} checked={checked} disabled={disabled} name={typeof header === 'string' ? header : 'option'} /> : null;

  return (
    <button
      {...rest}
      ref={rootRef}
      type="button"
      id={id}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      role={role}
      aria-checked={role ? !!checked : undefined}
      aria-current={!role && selected ? current : undefined}
    >
      {selected && <span className="ds-list-view__ribbon" aria-hidden="true" />}

      {indicator && controlPlacement === 'left' ? indicator : leftPanel && (
        <span className="ds-list-view__panel ds-list-view__left-icon">
          {leftIcon || <Icon name="FileText" size={ICON_SIZE_MAP[leftIconSize] || 'sm'} />}
        </span>
      )}

      <span className="ds-list-view__content">
        <span className="ds-list-view__center">
          <span className="ds-list-view__row">
            <SectionHeader level={null} size="sm" color={disabled ? 'disabled' : 'default'}>{header}</SectionHeader>
          </span>

          {description && (
            <span className="ds-list-view__row">
              {swapDescription || (
                <DescriptionText as="span" color={disabled ? 'disabled' : 'subtle'} size="14">{descriptionText}</DescriptionText>
              )}
            </span>
          )}

          {detail && (
            <span className="ds-list-view__row">
              <DetailText color={disabled ? 'disabled' : (detailColor || 'default')} size="14">{detailText}</DetailText>
            </span>
          )}
        </span>

        {indicator && controlPlacement === 'right'
          ? indicator
          : rightPanel && rightPanelContent && (
            <span className="ds-list-view__panel ds-list-view__panel--right">{rightPanelContent}</span>
          )}
      </span>
    </button>
  );
}

export default ListView;
