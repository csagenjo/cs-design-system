/**
 * CellHeader — Componente atómico (familia Celda)
 * CS Design System · v1.0
 *
 * Celda de encabezado de columna de una tabla. Es un CONTENEDOR: el rótulo es
 * un slot (`children`). Hermano de CellData — comparte los ejes y los tokens
 * cellCommon, pero añade el estado de orden de columna.
 *
 * Tokens: familia table/all/* — cellCommon compartido + específico de Header.
 *   · color/bg/borde vía --ds-cell-common-* (Componente→Mode)
 *   · icono de orden vía --ds-cell-common-icon-fg (teal), currentColor en el SVG
 *   · tipografía directa de Device (Title/sm 16/24) — regla de tipografía §4
 *
 * Ejes (nombres compartidos con CellData/CellMore, significado propio):
 *   · align    : left | right           (right para columnas numéricas)
 *   · density  : compact | basic        (basic = más padding superior, texto abajo)
 *   · surface  : neutral | onSurface | zebra
 *   · border   : subtle | primary       (primary = columna ordenada activa; el
 *                borde inferior teal marca la columna sobre la que se ordena.
 *                NO es el lastRow de CellData aunque en Figma compartan `Border`.)
 *   · showSort : icono ArrowUpAZ a la derecha (prop `showAZ` en Figma) — indica
 *                orden ascendente A→Z. Suele acompañar a border="primary".
 *
 * USO:
 *   <CellHeader>Cliente</CellHeader>
 *   <CellHeader align="right">Importe</CellHeader>
 *   <CellHeader border="primary" showSort>Fecha</CellHeader>
 */

import React from 'react';
import { Icon } from './Icon';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-cell-header {
  display:       flex;
  align-items:   center;
  box-sizing:    border-box;
  padding:       var(--ds-cell-common-padding-ver) var(--ds-cell-common-padding-hor); /* 4 / 6 */
  gap:           var(--ds-cell-common-gap);          /* 4 */
  font-family:   inherit;
  font-size:     var(--ds-fontSize-title-sm);        /* 16 */
  font-weight:   var(--ds-font-weight-regular);      /* 400 */
  line-height:   var(--ds-lineHeight-xs);            /* 24 */
  color:         var(--ds-cell-common-text-fg);      /* #050506 */
  border-bottom: var(--ds-cell-common-border-bottom-width) solid var(--ds-cell-common-border-bottom-color-subtle);
}

/* Alineación */
.ds-cell-header--right { justify-content: flex-end; text-align: right; }

/* Densidad: basic empuja el texto abajo y añade padding superior propio de Header */
.ds-cell-header--basic {
  align-items:    flex-end;
  padding-top:    var(--ds-cell-header-padding-top-basic);    /* 8 */
  padding-bottom: var(--ds-cell-header-padding-bottom-basic); /* 4 */
}

/* Superficie: neutral = transparente (sin token) */
.ds-cell-header--onSurface { background: var(--ds-cell-common-bg-on-surface); } /* #FFFFFF */
.ds-cell-header--zebra     { background: var(--ds-cell-common-bg-zebra); }      /* #F9FAFA */

/* Orden de columna: primary marca la columna sobre la que se ordena */
.ds-cell-header--primary { border-bottom-color: var(--ds-cell-common-border-bottom-color-primary); } /* #4BA9C0 */

/* Icono de orden — color propio (teal), aislado del color del texto */
.ds-cell-header__sort {
  display:     inline-flex;
  flex-shrink: 0;
  color:       var(--ds-cell-common-icon-fg); /* #4BA9C0 */
}
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── CellHeader ───────────────────────────────────────────────────────────── */

export function CellHeader({
  align    = 'left',      // 'left' | 'right'
  density  = 'compact',   // 'compact' | 'basic'
  surface  = 'neutral',   // 'neutral' | 'onSurface' | 'zebra'
  border   = 'subtle',    // 'subtle' | 'primary'
  showSort = false,
  children,
  className,
  style,
}) {
  injectStyles();

  const classes = [
    'ds-cell-header',
    align === 'right'     ? 'ds-cell-header--right'      : '',
    density === 'basic'   ? 'ds-cell-header--basic'      : '',
    surface !== 'neutral' ? `ds-cell-header--${surface}` : '',
    border === 'primary'  ? 'ds-cell-header--primary'    : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} role="columnheader">
      {children}
      {showSort && (
        <span className="ds-cell-header__sort">
          <Icon name="ArrowUpAZ" size="2xs" />
        </span>
      )}
    </div>
  );
}

export default CellHeader;
