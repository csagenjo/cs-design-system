/**
 * CellData — Componente atómico (familia Celda)
 * CS Design System · v1.0
 *
 * Celda de datos de una tabla (intersección fila×columna). Es un CONTENEDOR:
 * el contenido es un slot (`children`) que compone el consumidor — texto plano,
 * número, fecha, <BadgeHighlight>, texto+icono. No hay variantes de contenido.
 *
 * Tokens: familia table/all/* — cellCommon compartido + específico de Cell.
 *   · color/bg/borde vía --ds-cell-common-* (Componente→Mode)
 *   · tipografía directa de Device (Body/sm 16/24) — regla de tipografía
 *
 * Ejes (nombres de variante compartidos con Header/More, significado propio):
 *   · align    : left | right           (right para números/importes)
 *   · density  : compact | basic        (basic añade padding vertical)
 *   · surface  : neutral | onSurface | zebra
 *   · lastRow  : borde inferior de posición de fila — NO confundir con el
 *                sortState de CellHeader aunque en Figma compartan prop `Border`.
 *                default → divisor subtle (#EEEFF1) · lastRow → primary (#4BA9C0)
 *
 * USO:
 *   <CellData>García Fernández</CellData>
 *   <CellData align="right">1.250,00 €</CellData>
 *   <CellData surface="zebra" density="basic"><BadgeHighlight …/></CellData>
 *   <CellData lastRow align="right">Total</CellData>
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-cell {
  display:       flex;
  align-items:   center;
  box-sizing:    border-box;
  padding:       var(--ds-cell-common-padding-ver) var(--ds-cell-common-padding-hor); /* 4 / 6 */
  gap:           var(--ds-cell-common-gap);        /* 4 */
  font-family:   inherit;
  font-size:     var(--ds-fontSize-body-sm);       /* 16 */
  font-weight:   var(--ds-font-weight-regular);    /* 400 */
  line-height:   var(--ds-lineHeight-xs);          /* 24 */
  color:         var(--ds-cell-common-text-fg);    /* #050506 */
  border-bottom: var(--ds-cell-common-border-bottom-width) solid var(--ds-cell-common-border-bottom-color-subtle);
}

/* Alineación */
.ds-cell--right { justify-content: flex-end; text-align: right; }

/* Densidad: basic añade padding vertical propio de Cell */
.ds-cell--basic { padding-top: var(--ds-cell-data-padding-ver-basic); padding-bottom: var(--ds-cell-data-padding-ver-basic); } /* 6 */

/* Superficie: neutral = transparente (sin token) */
.ds-cell--onSurface { background: var(--ds-cell-common-bg-on-surface); } /* #FFFFFF */
.ds-cell--zebra     { background: var(--ds-cell-common-bg-zebra); }      /* #F9FAFA */

/* Posición de fila: última fila cierra con el borde primary */
.ds-cell--last-row { border-bottom-color: var(--ds-cell-common-border-bottom-color-primary); } /* #4BA9C0 */
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── CellData ─────────────────────────────────────────────────────────────── */

export function CellData({
  align   = 'left',      // 'left' | 'right'
  density = 'compact',   // 'compact' | 'basic'
  surface = 'neutral',   // 'neutral' | 'onSurface' | 'zebra'
  lastRow = false,
  children,
  className,
  style,
}) {
  injectStyles();

  const classes = [
    'ds-cell',
    align === 'right'   ? 'ds-cell--right'     : '',
    density === 'basic' ? 'ds-cell--basic'     : '',
    surface !== 'neutral' ? `ds-cell--${surface}` : '',
    lastRow ? 'ds-cell--last-row' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}

export default CellData;
