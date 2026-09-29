/**
 * TabItem — Componente atómico
 * CS Design System · v2.0
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
 * Bordes y foco pintados por dentro (box-shadow inset / outline con offset
 * negativo) — nunca suman altura: 40/48/56 exactos, igual que Figma.
 *
 * USO:
 *   <TabItem size="m" selected>Resumen</TabItem>
 *   <TabItem size="s" variant="contained" onClick={fn}>Movimientos</TabItem>
 */

import React from 'react';
import { injectStyles } from './_inputBase';

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

.ds-tab-item:hover:not(:disabled) { background: var(--ds-tabs-root-bg-hover); }
.ds-tab-item:active:not(:disabled) { background: var(--ds-tabs-root-bg-pressed); }
.ds-tab-item:focus-visible {
  outline: var(--ds-tabs-root-border-width-focus) solid var(--ds-tabs-root-border-color-focus);
  outline-offset: calc(-1 * var(--ds-tabs-root-border-width-focus));
}
.ds-tab-item:disabled { cursor: default; }

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
.ds-tab-item--contained:hover:not(:disabled) { background: var(--ds-tabs-root-bg-hover); }
.ds-tab-item--contained:active:not(:disabled) { background: var(--ds-tabs-root-bg-pressed); }
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
  disabled = false,
  onClick,
  children,
  id,
  className,
}) {
  const classes = [
    'ds-tab-item',
    `ds-tab-item--${size}`,
    `ds-tab-item--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      id={id}
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      role="tab"
      aria-selected={selected}
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
