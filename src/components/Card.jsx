/**
 * Card — Átomo
 * CS Design System · v1
 *
 * Contenedor genérico con fondo, radio y sombra — solo la variante `basic`
 * de Figma (`Cards`, node real). Nace como carcasa del panel flydown de Top
 * Navigation, pero es un slot libre (`children`), reutilizable donde haga
 * falta una superficie elevada simple.
 *
 * Sombra propia (`--ds-card-root-shadow`, Effect Style real "Card/Shadow" en
 * Figma) — hasta el 23/09 aliasaba a Popover Sheet (mismo valor por
 * coincidencia); Carol decidió desacoplarla en Figma para que Card no
 * dependa de otro componente.
 *
 * NOTA (23/09, Carol) — solo en FIGMA: el Flydown de Top Navigation ahí NO
 * instancia el componente `Cards` (es rígido, `ABSOLUTE`, no se ajusta al
 * contenido real) — su root simula el mismo fill/radius/shadow a mano. En
 * CÓDIGO no aplica ese problema (`Card.jsx` no tiene esa rigidez, es un CSS
 * normal) — `TopNavigation.jsx` sigue instanciando este átomo tal cual.
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
