/**
 * ListView — Componente atómico
 * CS Design System · v1.0
 *
 * Fila interactiva de un listado de resultados (Search for Results en La
 * Plataforma) — no un elemento pasivo: es un `<button>` real, clicable y
 * enfocable. hover/pressed/focus se resuelven vía pseudo-clases CSS nativas
 * (mismo criterio que SelectorInvoker) — no son props, solo `disabled` lo es.
 *
 * Header → SectionHeader · Description → DescriptionText (slot swappable por
 * Text vía `swapDescription`, mismo mecanismo de instance-swap que Figma) ·
 * Detail → DetailText — los tres átomos ya compartidos con Selector.
 *
 * Right Panel: slot libre (`rightPanelContent`), NO un wrapper que replique
 * las 10 variantes de Figma (Amount View/Checkbox/Radio/Switch/...) — el
 * consumidor instancia directamente el átomo que necesite (AmountView,
 * Checkbox, BadgeNotification+chevron, etc.), mismo criterio que
 * DescriptionList/CellActions.
 *
 * USO:
 *   <ListView header="Cliente" descriptionText="ID 4521" detailText="Alta: 12/03/2026" />
 *   <ListView header="Cuenta" rightPanelContent={<AmountView amount="1.250,00" currency="€" />} />
 *   <ListView header="Fila" swapDescription={<Text chevron>Ver más</Text>} selected />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { SectionHeader } from './SectionHeader';
import { DescriptionText } from './DescriptionText';
import { DetailText } from './DetailText';
import { Icon } from './Icon';

const css = `
.ds-list-view {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 16px 16px 16px;
  background: var(--ds-list-view-root-bg-generic);
  border: none;
  border-bottom: var(--ds-list-view-root-border-width-generic) solid transparent;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.ds-list-view--partial-bottom,
.ds-list-view--full-bottom,
.ds-list-view--all-sides { border-bottom-color: var(--ds-list-view-root-border-color-generic); }
.ds-list-view--all-sides { border-top: var(--ds-list-view-root-border-width-generic) solid var(--ds-list-view-root-border-color-generic); }

.ds-list-view:hover:not(:disabled) { background: var(--ds-list-view-root-bg-hover); }
.ds-list-view:active:not(:disabled) { opacity: var(--ds-list-view-root-opacity-pressed); }
.ds-list-view:focus-visible {
  outline: var(--ds-list-view-root-border-width-focus) solid var(--ds-list-view-root-border-color-focus-outer);
  outline-offset: -2px;
  box-shadow: inset 0 0 0 var(--ds-list-view-root-border-width-focus) var(--ds-list-view-root-border-color-focus-inner);
  border-radius: var(--ds-list-view-root-border-radius-focus-inner);
}
.ds-list-view:disabled {
  background: var(--ds-list-view-root-bg-disabled);
  cursor: not-allowed;
}

.ds-list-view__left-icon {
  flex-shrink: 0;
  display: flex;
  color: var(--ds-list-view-icon-left-fg-generic);
}
.ds-list-view:disabled .ds-list-view__left-icon { color: var(--ds-list-view-icon-left-fg-disabled); }

.ds-list-view__content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1 0 0;
  min-width: 0;
}
.ds-list-view__center {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 0 0;
  min-width: 0;
}
.ds-list-view__row { display: flex; align-items: center; width: 100%; overflow: hidden; }
.ds-list-view__right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.ds-list-view__ribbon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--ds-list-view-ribbon-border-width-selected);
  background: var(--ds-list-view-ribbon-border-color-selected);
}
.ds-list-view:disabled .ds-list-view__ribbon { background: var(--ds-list-view-ribbon-border-color-disabled); }
`;

injectStyles('ds-list-view', css);

const ICON_SIZE_MAP = { '2xs': '2xs', xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', '3xl': '3xl' };

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
  leftIconSize       = 'sm', // '2xs' | 'xs' | 'sm' | 'md' | 'lg' | '3xl' — escala de Icon.jsx
  rightPanel         = true,
  rightPanelContent,
  selected           = false,
  divider            = 'none', // 'none' | 'partialBottom' | 'fullBottom' | 'allSides'
  disabled           = false,
  onClick,
  id,
  className,
}) {
  const dividerClass = {
    none: '',
    partialBottom: 'ds-list-view--partial-bottom',
    fullBottom: 'ds-list-view--full-bottom',
    allSides: 'ds-list-view--all-sides',
  }[divider] || '';

  const classes = [
    'ds-list-view',
    dividerClass,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      id={id}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {selected && <span className="ds-list-view__ribbon" aria-hidden="true" />}

      {leftPanel && (
        <span className="ds-list-view__left-icon">
          {leftIcon || <Icon name="FileText" size={ICON_SIZE_MAP[leftIconSize] || 'sm'} />}
        </span>
      )}

      <span className="ds-list-view__content">
        <span className="ds-list-view__center">
          <span className="ds-list-view__row">
            <SectionHeader size="sm" color={disabled ? 'disabled' : 'default'}>{header}</SectionHeader>
          </span>

          {description && (
            <span className="ds-list-view__row">
              {swapDescription || (
                <DescriptionText color={disabled ? 'disabled' : 'subtle'} size="14">{descriptionText}</DescriptionText>
              )}
            </span>
          )}

          {detail && (
            <span className="ds-list-view__row">
              <DetailText color={disabled ? 'disabled' : (detailColor || 'default')} size="14">{detailText}</DetailText>
            </span>
          )}
        </span>

        {rightPanel && rightPanelContent && (
          <span className="ds-list-view__right">{rightPanelContent}</span>
        )}
      </span>
    </button>
  );
}

export default ListView;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<ListView header="García Fernández" descriptionText="Cliente nº 4521" detailText="Alta: 12/03/2026" />

<ListView
  header="Cuenta corriente"
  descriptionText="ES00 0000 0000 0000 0000"
  rightPanelContent={<AmountView amount="1.250,00" currency="€" />}
  divider="fullBottom"
/>

<ListView header="Fila seleccionada" selected swapDescription={<Text chevron>Ver más</Text>} />
*/
