/**
 * DetailText — Componente atómico
 * CS Design System · v1.1 (12/11/2026: icono vía átomo Icon, gap y tamaño con token)
 *
 * Icono + texto de detalle. Consolidado desde 4 copias duplicadas en código
 * (SelectorInvoker, SelectorListItem, AccountSelectorInvoker,
 * AccountSelectorListItem), cada una con soporte de color parcial distinto
 * — punto único de mantenimiento a partir de ahora.
 *
 * `icon` es un slot libre (ReactNode, usar el átomo Icon size="2xs") — por defecto el icono "link" de Figma,
 * sustituible por cualquier otro cuando el consumidor lo necesite.
 *
 * USO:
 *   <DetailText>Here is some detail text</DetailText>
 *   <DetailText color="secondary" size="16" icon={<Icon name="phone" size="2xs" />}>600 000 000</DetailText>
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const css = `
.ds-detail-text {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-detail-text-gap);
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  white-space: nowrap;
  color: var(--ds-detail-text-fg-default);
}

.ds-detail-text--14 { font-size: var(--ds-fontSize-body-xs); line-height: var(--ds-lineHeight-body-xs); } /* 14/20 */
.ds-detail-text--16 { font-size: var(--ds-fontSize-body-sm); line-height: var(--ds-lineHeight-body-sm);  } /* 16/24 */

.ds-detail-text--secondary { color: var(--ds-detail-text-fg-secondary); }
.ds-detail-text--tertiary  { color: var(--ds-detail-text-fg-tertiary); }
.ds-detail-text--disabled  { color: var(--ds-detail-text-fg-disabled); }

.ds-detail-text__icon {
  display: inline-flex;
  flex-shrink: 0;
  width: var(--ds-detail-text-icon-size);
  height: var(--ds-detail-text-icon-size);
  color: var(--ds-detail-text-icon-fg-default);
}
.ds-detail-text--secondary .ds-detail-text__icon { color: var(--ds-detail-text-icon-fg-secondary); }
.ds-detail-text--tertiary  .ds-detail-text__icon { color: var(--ds-detail-text-icon-fg-tertiary); }
.ds-detail-text--disabled  .ds-detail-text__icon { color: var(--ds-detail-text-icon-fg-disabled); }
`;

injectStyles('ds-detail-text', css);

export function DetailText({
  children,
  color    = 'default', // 'default' | 'secondary' | 'tertiary' | 'disabled'
  size     = '14',       // '14' | '16'
  icon,
  showIcon = true,
  id,
  className,
}) {
  const classes = [
    'ds-detail-text',
    `ds-detail-text--${size}`,
    color !== 'default' ? `ds-detail-text--${color}` : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <span id={id} className={classes}>
      {showIcon && (
        <span className="ds-detail-text__icon" aria-hidden="true">
          {icon || <Icon name="link" size="2xs" />}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}

export default DetailText;
