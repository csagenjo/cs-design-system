/**
 * Card — Átomo
 * CS Design System · v1
 *
 * Contenedor genérico con fondo, radio y sombra — solo la variante `basic`
 * de Figma (`Cards`, node real). Nace como carcasa del panel flydown de Top
 * Navigation, pero es un slot libre (`children`), reutilizable donde haga
 * falta una superficie elevada simple.
 *
 * Sombra reutilizada literal de Popover Sheet (`--ds-card-root-shadow`
 * alias `--ds-popover-sheet-root-shadow`) — Carol confirmó en Figma que es
 * la misma, no una nueva.
 *
 * USO:
 *   <Card>{children}</Card>
 */
import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-card {
  background:    var(--ds-card-root-bg);
  border-radius: var(--ds-card-root-border-radius);
  box-shadow:    var(--ds-card-root-shadow);
  box-sizing:    border-box;
}
`;

injectStyles('ds-card', css);

export function Card({ children, className, style }) {
  return (
    <div className={`ds-card ${className || ''}`} style={style}>
      {children}
    </div>
  );
}

export default Card;
