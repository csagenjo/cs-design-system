/**
 * CellMore — Componente atómico (familia Celda)
 * CS Design System · v1.0
 *
 * Celda disparador de overflow ("More ›") en la columna de acciones de una
 * tabla. A diferencia de CellData/CellHeader (contenedores puros con slot),
 * CellMore tiene contenido fijo — rótulo "More" + chevron — y ES interactivo:
 * su raíz es un <button> que dispara el menú/overflow del consumidor (onClick).
 *
 * Tokens: familia table/all/* — cellCommon compartido.
 *   · color/bg/borde vía --ds-cell-common-* (Componente→Mode)
 *   · chevron vía --ds-cell-common-icon-fg (teal), currentColor en el SVG
 *   · texto vía --ds-cell-common-text-fg (oscuro)
 *   · tipografía directa de Device (Body/sm 16/24) — regla de tipografía §4
 *
 * Ejes (nombres compartidos con CellData/CellHeader, significado propio):
 *   · surface : neutral | onSurface | zebra
 *   · lastRow : borde inferior de posición de fila (cierra la fila igual que
 *               CellData) — default → subtle (#EEEFF1) · lastRow → primary (#4BA9C0)
 *   · label   : rótulo del disparador. Vacío/falsy → solo chevron (variante
 *               "Basic" de Figma, icon-only). Siempre alineado a la derecha.
 *
 * USO:
 *   <CellMore onClick={openMenu} />
 *   <CellMore label="" onClick={openMenu} />              {/* icon-only *\/}
 *   <CellMore surface="zebra" lastRow onClick={openMenu}>{/* ... *\/}</CellMore>
 */

import React from 'react';
import { Icon } from './Icon';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-cell-more {
  display:         flex;
  align-items:     center;
  justify-content: flex-end;          /* siempre a la derecha */
  box-sizing:      border-box;
  width:           100%;
  margin:          0;
  padding:         var(--ds-cell-common-padding-ver) var(--ds-cell-common-padding-hor); /* 4 / 6 */
  gap:             var(--ds-cell-common-gap);        /* 4 */
  font-family:     inherit;
  font-size:       var(--ds-fontSize-body-sm);       /* 16 */
  font-weight:     var(--ds-font-weight-regular);    /* 400 */
  line-height:     var(--ds-lineHeight-xs);          /* 24 */
  color:           var(--ds-cell-common-text-fg);    /* #050506 */
  background:      transparent;
  border:          0;
  border-bottom:   var(--ds-cell-common-border-bottom-width) solid var(--ds-cell-common-border-bottom-color-subtle);
  cursor:          pointer;
  text-align:      right;
}

.ds-cell-more:disabled { cursor: not-allowed; }

/* Superficie: neutral = transparente (sin token) */
.ds-cell-more--onSurface { background: var(--ds-cell-common-bg-on-surface); } /* #FFFFFF */
.ds-cell-more--zebra     { background: var(--ds-cell-common-bg-zebra); }      /* #F9FAFA */

/* Posición de fila: última fila cierra con el borde primary */
.ds-cell-more--last-row { border-bottom-color: var(--ds-cell-common-border-bottom-color-primary); } /* #4BA9C0 */

/* Chevron — color propio (teal), aislado del color del texto */
.ds-cell-more__chevron {
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

/* ─── CellMore ─────────────────────────────────────────────────────────────── */

export function CellMore({
  label    = 'More',      // rótulo; vacío/falsy → solo chevron (variante Basic)
  surface  = 'neutral',   // 'neutral' | 'onSurface' | 'zebra'
  lastRow  = false,
  onClick,
  disabled = false,
  className,
  style,
  ...rest
}) {
  injectStyles();

  const classes = [
    'ds-cell-more',
    surface !== 'neutral' ? `ds-cell-more--${surface}` : '',
    lastRow ? 'ds-cell-more--last-row' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-label={label ? undefined : 'More'}
      {...rest}
    >
      {label && <span>{label}</span>}
      <span className="ds-cell-more__chevron">
        <Icon name="ChevronRight" size="2xs" />
      </span>
    </button>
  );
}

export default CellMore;
