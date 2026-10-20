/**
 * VisuallyHidden — Componente atómico (accesibilidad)
 * CS Design System · v1 · sprint A11y-0 (20/10/2026)
 *
 * Texto que lee el lector de pantalla pero no se ve. Para dar contexto que
 * la interfaz ya transmite visualmente (un icono, una posición, un color):
 * "(se abre en una pestaña nueva)", "Paso 2 de 4", el nombre del fichero en
 * un botón de borrar…
 *
 * Sustituye a las copias locales de `.sr-only` que tenían Link y CTALink.
 * Sin tokens: no pinta nada. Los `1px` / `-1px` son la técnica estándar de
 * ocultación (el elemento tiene que medir algo para que todos los lectores lo
 * lean), no un valor de diseño.
 *
 * PROPS:
 *   as         'span' (default) | cualquier etiqueta — 'span' para texto en
 *              línea, 'div' / 'h2'… si hace falta un bloque o un encabezado
 *   focusable  false (default) · true → se hace visible al recibir foco
 *              (enlaces "Saltar al contenido")
 *
 * NO USAR para ocultar contenido a todo el mundo (eso es `hidden`), ni para
 * esconder una etiqueta que debería verse: si un campo necesita etiqueta, que
 * se vea.
 *
 * USO:
 *   <button><Icon name="X" /><VisuallyHidden>Cerrar</VisuallyHidden></button>
 *   <a href="#main" className="…"><VisuallyHidden focusable>Saltar al contenido</VisuallyHidden></a>
 *
 * El nombre de clase `ds-visually-hidden` también se exporta para usarlo
 * directamente en markup que no es React.
 */
import React from 'react';
import { injectStyles } from './_inputBase';

export const VISUALLY_HIDDEN_CLASS = 'ds-visually-hidden';

const css = `
.ds-visually-hidden,
.ds-visually-hidden--focusable:not(:focus):not(:focus-within) {
  position:    absolute !important;
  width:       1px !important;
  height:      1px !important;
  padding:     0 !important;
  margin:      -1px !important;
  overflow:    hidden !important;
  clip:        rect(0, 0, 0, 0) !important;
  clip-path:   inset(50%) !important;
  white-space: nowrap !important;
  border:      0 !important;
}
`;
injectStyles('ds-visually-hidden', css);

export function VisuallyHidden({ as: Tag = 'span', focusable = false, className, children, ...rest }) {
  const classes = [
    focusable ? 'ds-visually-hidden--focusable' : VISUALLY_HIDDEN_CLASS,
    className || '',
  ].filter(Boolean).join(' ');
  return <Tag className={classes} {...rest}>{children}</Tag>;
}

export default VisuallyHidden;
