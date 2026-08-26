/**
 * Text — Componente atómico
 * CS Design System · v1.0
 *
 * Opción de texto "enriquecido" intercambiable en el slot Description de
 * List View / Selector — no forma parte de su estructura fija, es una pieza
 * suelta con página propia en Figma (mismo criterio que SectionHeader). El
 * consumidor la usa como children del slot description cuando una fila
 * necesita texto en negrita/color o un chevron final.
 *
 * Chevron es booleano — no duplica variantes, solo muestra/oculta el icono
 * (mismo patrón ya usado en Figma tras consolidar `.Text + Chevron`, sin uso,
 * dentro de `Text`).
 *
 * USO:
 *   <Text>Texto</Text>
 *   <Text color="secondary" weight="regular">Ver más</Text>
 *   <Text chevron onClick={fn}>Ver detalle</Text>
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const css = `
.ds-text {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  white-space: nowrap;
  color: var(--ds-text-fg-default);
  background: none;
  border: none;
  padding: 0;
  cursor: default;
}
.ds-text--clickable { cursor: pointer; }

.ds-text--14 { font-size: var(--ds-fontSize-label-sm); line-height: var(--ds-lineHeight-2xs); } /* 14/21 */
.ds-text--16 { font-size: var(--ds-fontSize-label-md); line-height: var(--ds-lineHeight-xs);  } /* 16/24 */

.ds-text--regular { font-weight: var(--ds-font-weight-regular); }

.ds-text--secondary { color: var(--ds-text-fg-secondary); }
.ds-text--disabled  { color: var(--ds-text-fg-disabled); cursor: not-allowed; }

.ds-text__chevron { display: inline-flex; flex-shrink: 0; }
`;

injectStyles('ds-text', css);

export function Text({
  children,
  color   = 'default',  // 'default' | 'secondary' | 'disabled'
  size    = '16',        // '14' | '16'
  weight  = 'bold',       // 'bold' | 'regular'
  chevron = false,
  onClick,
  id,
  className,
}) {
  const classes = [
    'ds-text',
    `ds-text--${size}`,
    weight === 'regular' ? 'ds-text--regular' : '',
    color !== 'default' ? `ds-text--${color}` : '',
    onClick ? 'ds-text--clickable' : '',
    className || '',
  ].filter(Boolean).join(' ');

  const Tag = onClick ? 'button' : 'span';

  return (
    <Tag id={id} type={onClick ? 'button' : undefined} className={classes} onClick={onClick}>
      {children}
      {chevron && (
        <span className="ds-text__chevron">
          <Icon name="ChevronRight" size="2xs" />
        </span>
      )}
    </Tag>
  );
}

export default Text;
