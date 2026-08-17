/**
 * CellActions — Organismo (familia Celda)
 * CS Design System · v1.0
 *
 * Celda de acciones de una tabla: un contenedor de celda que aloja hasta 2
 * acciones (Button / Link / CTALink) pasadas como `children`. Es un ORGANISMO
 * — compone átomos ya construidos, NO reimplementa su lógica. NO es CellMore
 * (ese es el disparador de overflow "More ›" de un único menú).
 *
 * Comparte el contenedor de celda con CellData/CellHeader/CellMore (mismos
 * tokens cellCommon: padding, borde, superficie, gap). Las acciones se
 * disponen en fila; el gap entre ellas es --ds-cell-common-gap.
 *
 * Tokens: familia table/all/* — cellCommon compartido (Componente→Mode).
 *
 * Ejes (compartidos con el resto de la familia, significado propio):
 *   · align   : left | right    (right por defecto — columna de acciones)
 *   · surface : neutral | onSurface | zebra
 *   · lastRow : borde inferior de posición de fila — default → subtle
 *               (#EEEFF1) · lastRow → primary (#4BA9C0)
 *
 * USO:
 *   <CellActions>
 *     <Link size="sm">Editar</Link>
 *   </CellActions>
 *   <CellActions surface="zebra" lastRow>
 *     <Button variant="ghost" size="small">Editar</Button>
 *     <Button variant="ghost" size="small">Borrar</Button>
 *   </CellActions>
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-cell-actions {
  display:       flex;
  align-items:   center;
  box-sizing:    border-box;
  padding:       var(--ds-cell-common-padding-ver) var(--ds-cell-common-padding-hor); /* 4 / 6 */
  gap:           var(--ds-cell-common-gap);        /* 4 */
  border-bottom: var(--ds-cell-common-border-bottom-width) solid var(--ds-cell-common-border-bottom-color-subtle);
}

/* Alineación de las acciones dentro de la celda */
.ds-cell-actions--right { justify-content: flex-end; }

/* Superficie: neutral = transparente (sin token) */
.ds-cell-actions--onSurface { background: var(--ds-cell-common-bg-on-surface); } /* #FFFFFF */
.ds-cell-actions--zebra     { background: var(--ds-cell-common-bg-zebra); }      /* #F9FAFA */

/* Posición de fila: última fila cierra con el borde primary */
.ds-cell-actions--last-row { border-bottom-color: var(--ds-cell-common-border-bottom-color-primary); } /* #4BA9C0 */
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── CellActions ──────────────────────────────────────────────────────────── */

export function CellActions({
  align   = 'right',     // 'left' | 'right'
  surface = 'neutral',   // 'neutral' | 'onSurface' | 'zebra'
  lastRow = false,
  children,
  className,
  style,
}) {
  injectStyles();

  if (process.env.NODE_ENV !== 'production' && React.Children.count(children) > 2) {
    console.warn('[DS CellActions] Máximo 2 acciones — se recibieron ' + React.Children.count(children) + '.');
  }

  const classes = [
    'ds-cell-actions',
    align === 'right'     ? 'ds-cell-actions--right'    : '',
    surface !== 'neutral' ? `ds-cell-actions--${surface}` : '',
    lastRow ? 'ds-cell-actions--last-row' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} role="cell">
      {children}
    </div>
  );
}

export default CellActions;
