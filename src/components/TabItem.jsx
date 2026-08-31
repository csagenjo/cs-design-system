/**
 * TabItem — Componente atómico
 * CS Design System · v1.0
 *
 * Item individual dentro de Tabs. `<button>` real — Hover/Pressed/Focus se
 * resuelven vía pseudo-clases CSS nativas (mismo criterio que Checkbox/
 * ListView), no hay props de estado para ellos. `selected` es la única prop
 * de estado real, ya que no existe un pseudo-selector nativo para eso.
 *
 * Nombre "TabItem" (no "Tab") para no colisionar con el organismo "Tabs" —
 * coincide además con el nombre que ya tenía la capa de texto en Figma.
 *
 * Focus: un único stroke real en la raíz del propio TabItem (no doble
 * anillo) — se redimensiona solo con el tab, sin rectángulos hermanos que
 * puedan quedarse desfasados si el ancho cambia.
 *
 * `device`: 'mobile' | 'tablet' — Desktop reutiliza 'tablet', no existe un
 * tercer valor (ver nota en tokens.css). Solo cambia el padding vertical
 * (14px / 18px); el horizontal es igual en los dos.
 *
 * USO:
 *   <TabItem selected>Resumen</TabItem>
 *   <TabItem device="mobile" onClick={fn}>Movimientos</TabItem>
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  box-sizing: border-box;
  padding: 0 16px;
  background: var(--ds-tabs-root-bg-generic);
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-label-sm);
  line-height: var(--ds-lineHeight-2xs);
  color: var(--ds-tabs-text-fg-generic);
  white-space: nowrap;
  flex-shrink: 0;
}
.ds-tab-item--mobile { padding-top: 14px; padding-bottom: 14px; }
.ds-tab-item--tablet { padding-top: 18px; padding-bottom: 18px; }

.ds-tab-item:hover:not(:disabled) { background: var(--ds-tabs-root-bg-hover); }
.ds-tab-item:active:not(:disabled) { opacity: var(--ds-tabs-root-opacity-pressed); }
.ds-tab-item:focus-visible {
  outline: none;
  border: var(--ds-tabs-root-border-width-focus) solid var(--ds-tabs-root-border-color-focus);
}

.ds-tab-item__ribbon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--ds-tabs-ribbon-border-width-selected);
  background: var(--ds-tabs-ribbon-border-color-selected);
}
`;

injectStyles('ds-tab-item', css);

export function TabItem({
  device = 'tablet', // 'mobile' | 'tablet'
  selected = false,
  disabled = false,
  onClick,
  children,
  id,
  className,
}) {
  const classes = [
    'ds-tab-item',
    `ds-tab-item--${device}`,
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

<TabItem selected>Resumen</TabItem>

<TabItem device="mobile" onClick={() => {}}>Movimientos</TabItem>
*/
