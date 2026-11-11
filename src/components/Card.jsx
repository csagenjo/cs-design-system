/**
 * Card — Átomo
 * CS Design System · v2.1 (11/11/2026: filete en dark; v2 alineado con Figma `Cards`)
 *
 * Superficie vacía que agrupa contenido: fondo, radio y sombra. Las dos
 * variantes de Figma (`Cards`, 2455:62023):
 *   · Full  — plana: sin radio ni sombra (borde a borde, p. ej. una sección en mobile)
 *   · Basic — elevada: radio 4 (`cards/all/root/borderRadius/basic`) + Effect Style
 *             "Card/Shadow" + filete 1 px `borderColor/elevated` (blanco en light,
 *             neutral/700 en dark: la sombra negra no se ve sobre fondo oscuro, 11/11)
 *             (p. ej. el flydown de Top Navigation)
 * Fondo `cards/all/root/bg/generic` → bg/container (blanco en light; en dark
 * se separa del fondo de página, decisión 26/10).
 *
 * Contenido = slot libre (`children`): Card no pone padding ni layout; lo pone
 * lo que va dentro (en Figma la Card también es un contenedor vacío).
 *
 * `as` cambia la etiqueta: 'section' (con aria-labelledby a su título) o
 * 'article' cuando el contenido se entiende solo; por defecto 'div'.
 *
 * NOTA (23/09) — solo en FIGMA: el Flydown de Top Navigation no instancia
 * `Cards` (es rígido, ABSOLUTE); simula fill/radius/shadow a mano. En código
 * TopNavigation sí instancia este átomo.
 *
 * USO:
 *   <Card>{children}</Card>
 *   <Card variant="full" as="section" aria-labelledby="summary-title">…</Card>
 */
import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-card {
  background: var(--ds-card-root-bg);
  box-sizing: border-box;
}
.ds-card--basic {
  border-radius:  var(--ds-card-root-border-radius);
  box-shadow:     var(--ds-card-root-shadow);
  /* Filete = stroke INSIDE de Figma: outline hacia dentro, no cambia el tamaño.
     Light: blanco (no se ve, trabaja la sombra) · Dark: neutral/700 */
  outline:        var(--ds-card-root-border-width-basic) solid var(--ds-card-root-border-color-basic);
  outline-offset: calc(-1 * var(--ds-card-root-border-width-basic));
}
/* Colores forzados: la sombra desaparece → el filete pasa a CanvasText */
@media (forced-colors: active) {
  .ds-card--basic { outline-color: CanvasText; }
}
`;

injectStyles('ds-card', css);

export function Card({
  variant = 'basic',   // 'basic' | 'full'
  as: Tag = 'div',     // 'div' | 'section' | 'article' | …
  children,
  className,
  ...rest              // id, style, aria-labelledby, aria-label…
}) {
  const classes = ['ds-card', `ds-card--${variant === 'full' ? 'full' : 'basic'}`, className || '']
    .filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

Card.displayName = 'Card';
export default Card;
