/**
 * TabItem — Componente atómico
 * CS Design System · v3.0
 *
 * Pestaña individual. `<button role="tab">` real — Hover/Pressed/Focus se
 * resuelven vía pseudo-clases CSS nativas (mismo criterio que Checkbox/
 * ListView); `selected` es la única prop de estado real. Se puede usar
 * SUELTA (p. ej. dentro de una tarjeta) o dentro del organismo `Tabs`.
 *
 * `size`: 's' | 'm' | 'l' — 40 / 48 / 56 px (29/09, sustituye a `device`).
 * FIJO, independiente del device: quien lo usa elige el tamaño según el
 * contexto (un Tab M dentro de una tarjeta en desktop, por ejemplo).
 *   s → label/xs (12/16) + padding 12
 *   m → label/sm (14/20) + padding 14
 *   l → label/md (16/24) + padding 16
 *
 * `variant`: 'line' | 'contained' (Figma `Style`; `style` es prop reservada
 * en React).
 *   line      → ribbon inferior al seleccionar; navegación de página.
 *   contained → pestaña con fondo y contorno que se une a un panel de
 *               contenido (ref. Carbon "contained tabs"); la seleccionada
 *               toma el fondo del panel, pierde el borde inferior y lleva el
 *               ribbon ARRIBA. Esquinas rectas (29/09, Carol: como Line y
 *               como Carbon — un radio superior no casa con un panel recto).
 *
 * Peso por ESTADO: Regular en Initial/Hover/Focus, Bold en Selected/Pressed.
 * Fondo por estado (ambos estilos): Initial blanco · Hover azul · Pressed gris.
 * Bordes y foco pintados por dentro — nunca suman altura: 40/48/56 exactos.
 *
 * 30/10/2026, alineado 1:1 con Figma (set "Tab Item", Size × Style × State):
 *   · Foco = anillo doble POR DENTRO, como las filas apiladas: `focus-outer`
 *     de 2 en el borde + hueco `focus-inner` de 2 (Figma: rects Focus outer /
 *     Focus inner). Antes era un anillo simple.
 *   · Sin `disabled`: Figma no tiene estado Disabled (decisión de Carol). Si
 *     una sección no aplica, la pestaña no se muestra. La prop se ignora con
 *     aviso en desarrollo.
 *   · Grosores por token (ribbon 4 = borderWidth/xl, foco 2 = borderWidth/lg).
 *
 * USO:
 *   <TabItem size="m" selected>Resumen</TabItem>
 *   <TabItem size="s" variant="contained" onClick={fn}>Movimientos</TabItem>
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { warnOnce } from './_devWarn';

const css = `
.ds-tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: var(--_pv) var(--ds-tabs-root-padding-hor-generic);
  background: var(--ds-tabs-root-bg-generic);
  border: none;
  margin: 0;
  cursor: pointer;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--_fs);
  line-height: var(--_lh);
  color: var(--ds-tabs-text-fg-generic);
  white-space: nowrap;
  flex-shrink: 0;
}
.ds-tab-item--s { --_pv: var(--ds-tabs-root-padding-ver-s); --_fs: var(--ds-fontSize-label-xs); --_lh: var(--ds-lineHeight-label-xs); }
.ds-tab-item--m { --_pv: var(--ds-tabs-root-padding-ver-m); --_fs: var(--ds-fontSize-label-sm); --_lh: var(--ds-lineHeight-label-sm); }
.ds-tab-item--l { --_pv: var(--ds-tabs-root-padding-ver-l); --_fs: var(--ds-fontSize-label-md); --_lh: var(--ds-lineHeight-label-md); }

.ds-tab-item[aria-selected="true"],
.ds-tab-item:active:not(:disabled) {
  font-weight: var(--ds-font-weight-bold);
}

.ds-tab-item:hover { background: var(--ds-tabs-root-bg-hover); }
.ds-tab-item:active { background: var(--ds-tabs-root-bg-pressed); }
/* Foco doble por dentro: outline (focus-outer) en el borde + hueco focus-inner.
   El hueco va en ::after para no pisar el box-shadow de los bordes de Contained. */
.ds-tab-item:focus-visible {
  outline: var(--ds-tabs-root-border-width-focus) solid var(--ds-tabs-root-border-color-focus);
  outline-offset: calc(-1 * var(--ds-tabs-root-border-width-focus));
}
.ds-tab-item:focus-visible::after {
  content: '';
  position: absolute;
  inset: var(--ds-tabs-root-border-width-focus);
  box-shadow: inset 0 0 0 var(--ds-tabs-root-border-width-focus) var(--ds-tabs-root-border-color-focus-inner);
  pointer-events: none;
  z-index: 1;
}

.ds-tab-item__ribbon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--ds-tabs-ribbon-border-width-selected);
  background: var(--ds-tabs-ribbon-border-color-selected);
}

/* ── Contained ── */
.ds-tab-item--contained {
  --_bw: var(--ds-tabs-contained-root-border-width-generic);
  --_bc: var(--ds-tabs-contained-root-border-color-generic);
  background: var(--ds-tabs-contained-root-bg-generic);
  box-shadow: inset 0 0 0 var(--_bw) var(--_bc);
}
.ds-tab-item--contained[aria-selected="true"] {
  background: var(--ds-tabs-contained-root-bg-selected);
  /* sin borde inferior: se une al panel */
  box-shadow: inset var(--_bw) 0 0 var(--_bc), inset calc(-1 * var(--_bw)) 0 0 var(--_bc), inset 0 var(--_bw) 0 var(--_bc);
}
.ds-tab-item--contained:hover { background: var(--ds-tabs-root-bg-hover); }
.ds-tab-item--contained:active { background: var(--ds-tabs-root-bg-pressed); }
.ds-tab-item--contained .ds-tab-item__ribbon {
  top: 0;
  bottom: auto;
}
`;

injectStyles('ds-tab-item', css);

export function TabItem({
  size = 'm',          // 's' | 'm' | 'l'
  variant = 'line',    // 'line' | 'contained'
  selected = false,
  disabled,            // eliminado 30/10 (Figma no tiene Disabled) — se ignora
  onClick,
  children,
  id,
  className,
  role = 'tab',   // A11y-1: TopNavigation la usa como botón de navegación (role={null}), no como pestaña
  ...rest         // A11y-1: aria-expanded/aria-controls/ref/onKeyDown… llegan al <button>
}) {
  if (disabled !== undefined) warnOnce('TabItem.disabled', '[DS TabItem] `disabled` ya no existe (Figma no tiene estado Disabled): si la pestaña no aplica, no la muestres.');
  const classes = [
    'ds-tab-item',
    `ds-tab-item--${size}`,
    `ds-tab-item--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      id={id}
      type="button"
      className={classes}
      onClick={onClick}
      role={role || undefined}
      aria-selected={role === 'tab' ? selected : undefined}
    >
      {children}
      {selected && <span className="ds-tab-item__ribbon" aria-hidden="true" />}
    </button>
  );
}

export default TabItem;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<TabItem size="m" selected>Resumen</TabItem>

<TabItem size="s" variant="contained" onClick={() => {}}>Movimientos</TabItem>
*/
