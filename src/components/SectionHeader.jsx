/**
 * SectionHeader — Componente atómico
 * CS Design System · v1.0
 *
 * Título de sección de la familia tipográfica fontSize/title/* — NO es Headline
 * (familia distinta: headline usa fontSize/headline/*, line-height propio, y va
 * siempre en regular; SectionHeader va bold por defecto). No reusar Headline.
 *
 * Tokens: color vía --ds-section-header-text-fg-* (Componente→Mode). Tipografía
 * (size + weight) directa de Device (regla de tipografía §4) — sin token de
 * Componente intermedio.
 *
 * Ejes (matriz 12/12 de Figma, componente 3209:4291):
 *   · size   : sm (16, título/sm) | md (19, título/md)
 *   · color  : default (negro) | primary (teal) | disabled (gris)
 *              — "Subtle" de Figma se renombra a `default` en código y va contra
 *                fg/title/default, NO fg/title/subtle.
 *   · weight : bold (default) | regular
 *
 * USO:
 *   <SectionHeader>Datos del cliente</SectionHeader>
 *   <SectionHeader size="sm" color="primary">Sección</SectionHeader>
 *   <SectionHeader weight="regular" color="disabled">Inactiva</SectionHeader>
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-section-header {
  margin:       0;
  font-family:  inherit;                     /* Nunito */
  font-weight:  var(--ds-font-weight-bold);  /* 700 por defecto */
  text-align:   left;
  color:        var(--ds-section-header-text-fg-default);
}

/* Tamaño (fontSize + lineHeight bloqueados) */
.ds-section-header--sm { font-size: var(--ds-fontSize-title-sm); line-height: var(--ds-lineHeight-xs); } /* 16/24 */
.ds-section-header--md { font-size: var(--ds-fontSize-title-md); line-height: var(--ds-lineHeight-sm); } /* 19/28.5 */

/* Peso */
.ds-section-header--regular { font-weight: var(--ds-font-weight-regular); } /* 400 */

/* Color */
.ds-section-header--primary  { color: var(--ds-section-header-text-fg-primary);  }
.ds-section-header--disabled { color: var(--ds-section-header-text-fg-disabled); }
`;

injectStyles('ds-section-header', css);

export function SectionHeader({
  size   = 'md',       // 'sm' | 'md'
  color  = 'default',  // 'default' | 'primary' | 'disabled'
  weight = 'bold',     // 'bold' | 'regular'
  children,
  id,
  className,
}) {
  const classes = [
    'ds-section-header',
    `ds-section-header--${size}`,
    color !== 'default'  ? `ds-section-header--${color}`  : '',
    weight === 'regular' ? 'ds-section-header--regular'   : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} role="heading" aria-level={2}>
      {children}
    </div>
  );
}

SectionHeader.displayName = 'SectionHeader';
export default SectionHeader;
