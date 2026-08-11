/**
 * Table — Organismo (familia Celda)
 * CS Design System · v1.0
 *
 * Wrapper de layout y semántica para ensamblar CellHeader/CellData/CellMore/
 * CellActions en una tabla. NO tiene chrome visual propio (sin fondo, borde
 * ni radio) — no existe un componente "Table" en Figma, solo la familia Cell
 * (Column Header/Cell/More); el borde inferior de cada fila ya lo aporta cada
 * Cell individualmente vía --ds-cell-common-border-bottom-*. Si se necesita
 * una tarjeta/panel alrededor, el consumidor la envuelve él mismo.
 *
 * Composición pura, sin clonar ni inyectar props en los hijos — igual que
 * CellActions/ButtonBar. surface="zebra"/lastRow se siguen fijando a mano por
 * celda, como ya se hace en el banco de pruebas; Table no adivina el índice
 * de fila por ti.
 *
 * Semántica: div+flexbox (no <table> nativo) — coherente con que CellHeader/
 * CellData/CellMore/CellActions ya son <div>/<button>, no <th>/<td>. Roles
 * ARIA (table/row/columnheader/cell) dan la semántica equivalente.
 *
 * USO:
 *   <Table>
 *     <TableRow>
 *       <CellHeader border="primary" showSort>Cliente</CellHeader>
 *       <CellHeader align="right">Importe</CellHeader>
 *     </TableRow>
 *     <TableRow>
 *       <CellData>García Fernández</CellData>
 *       <CellData align="right">1.250,00 €</CellData>
 *     </TableRow>
 *     <TableRow>
 *       <CellData lastRow>Total</CellData>
 *       <CellData lastRow align="right">1.250,00 €</CellData>
 *     </TableRow>
 *   </Table>
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-table {
  display:        flex;
  flex-direction: column;
  width:          100%;
}
.ds-table-row {
  display: flex;
  width:   100%;
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

/* ─── Table ────────────────────────────────────────────────────────────────── */

export function Table({ children, className, style }) {
  injectStyles();

  const classes = ['ds-table', className || ''].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} role="table">
      {children}
    </div>
  );
}

/* ─── TableRow ─────────────────────────────────────────────────────────────── */

export function TableRow({ children, className, style }) {
  injectStyles();

  const classes = ['ds-table-row', className || ''].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} role="row">
      {children}
    </div>
  );
}

export default Table;
