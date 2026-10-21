/**
 * Tabs — Organismo
 * CS Design System · v2.0
 *
 * Barra de N × `TabItem` desde un array (`items`), sin límite de número (en
 * Figma hay 8 ranuras con `Show tab 3…8` por comodidad de diseño; aquí no).
 *
 * `size`: 's' | 'm' | 'l' — 40 / 48 / 56, FIJO (29/09, sustituye a `device`).
 * `type`: 'fixed' reparte el ancho a partes iguales · 'scrollable' deja cada
 *         pestaña a su ancho natural y hace scroll horizontal si desborda.
 * `variant`: 'line' (línea inferior bajo la barra, ribbon inferior) |
 *            'contained' (pestañas con fondo/contorno que se unen a un panel
 *            de contenido — el panel lo pone el consumidor, no es parte de
 *            Tabs, mismo criterio que Dialog/PopoverSheet con su contenido).
 *
 * USO:
 *   <Tabs size="m" items={[{id:'a',label:'Resumen'},{id:'b',label:'Movimientos'}]}
 *     selectedId="a" onChange={fn} />
 *
 *   <Tabs size="s" variant="contained" type="scrollable"
 *     items={manyItems} selectedId={id} onChange={fn} />
 */

import { useRovingFocus } from '../components/_rovingFocus';
import { warnOnce } from '../components/_devWarn';
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { TabItem } from '../components/TabItem';

const css = `
.ds-tabs {
  display: flex;
  box-sizing: border-box;
  width: 100%;
}
.ds-tabs--line {
  box-shadow: inset 0 -1px 0 var(--ds-tabs-root-border-bottom-color-generic); /* línea bajo la barra, sin sumar altura */
}
.ds-tabs--contained {
  /* se solapa 1px con el panel que va debajo: el borde superior del panel
     queda oculto bajo la pestaña seleccionada (que no tiene borde inferior)
     y visible bajo las demás — el panel puede llevar su borde completo */
  position: relative;
  z-index: 1;
  margin-bottom: calc(-1 * var(--ds-tabs-contained-root-border-width-generic));
}
.ds-tabs--contained .ds-tab-item + .ds-tab-item {
  margin-left: calc(-1 * var(--ds-tabs-contained-root-border-width-generic)); /* bordes contiguos solapados */
}
.ds-tabs--fixed .ds-tab-item { flex: 1 0 0; }
.ds-tabs--scrollable {
  overflow-x: auto;
}
.ds-tabs--scrollable .ds-tab-item { flex: 0 0 auto; }
`;

injectStyles('ds-tabs', css);

const safe = (v) => String(v).replace(/\s+/g, '-');
const tabDomId = (tabsId, itemId) => `${tabsId}-tab-${safe(itemId)}`;
const panelDomId = (tabsId, itemId) => `${tabsId}-panel-${safe(itemId)}`;

export function Tabs({
  items = [],
  selectedId,
  onChange,
  size = 'm',          // 's' | 'm' | 'l'
  type = 'fixed',      // 'fixed' | 'scrollable'
  variant = 'line',    // 'line' | 'contained'
  ariaLabel,           // nombre del tablist — A11y-3
  ariaLabelledBy,
  id,
  className,
}) {
  const classes = [
    'ds-tabs',
    `ds-tabs--${type}`,
    `ds-tabs--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  // A11y-3: patrón tabs de APG con activación automática — una parada de Tab
  // (la pestaña elegida), flechas / Inicio / Fin cambian de pestaña. Con `id`,
  // cada pestaña apunta a su panel (aria-controls) y <TabPanel tabsId itemId>
  // pone el rol, el nombre y los ids que casan.
  const generatedId = useId();
  const baseId = id || generatedId;
  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const { getItemProps } = useRovingFocus({
    count: items.length,
    activeIndex: selectedIndex < 0 ? 0 : selectedIndex,
    onActiveIndexChange: (i) => onChange?.(items[i].id),
    isItemDisabled: (i) => !!items[i]?.disabled,
  });
  if (!ariaLabel && !ariaLabelledBy) warnOnce('Tabs.unnamed', '[DS Tabs] Necesita `ariaLabel` o `ariaLabelledBy` para nombrar las pestañas.');

  return (
    <div id={id} className={classes} role="tablist" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
      {items.map((item, i) => (
        <TabItem
          key={item.id}
          id={tabDomId(baseId, item.id)}
          aria-controls={id ? panelDomId(id, item.id) : undefined}
          size={size}
          variant={variant}
          selected={item.id === selectedId}
          disabled={item.disabled}
          onClick={() => onChange?.(item.id)}
          {...getItemProps(i)}
        >
          {item.label}
        </TabItem>
      ))}
    </div>
  );
}

/* Panel de una pestaña: `tabsId` = el `id` de <Tabs>, `itemId` = el id del item.
   Solo se monta el panel visible (o se pasa `hidden`). */
export function TabPanel({ tabsId, itemId, hidden, children, className, style }) {
  return (
    <div
      id={panelDomId(tabsId, itemId)}
      role="tabpanel"
      aria-labelledby={tabDomId(tabsId, itemId)}
      tabIndex={0}
      hidden={hidden}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}

export default Tabs;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Tabs
  size="m"
  items={[
    { id: 'summary', label: 'Resumen' },
    { id: 'movements', label: 'Movimientos' },
  ]}
  selectedId="summary"
  onChange={(id) => {}}
/>

<Tabs
  size="s"
  variant="contained"
  type="scrollable"
  items={[
    { id: '1', label: 'Enero' }, { id: '2', label: 'Febrero' }, { id: '3', label: 'Marzo' },
    { id: '4', label: 'Abril' }, { id: '5', label: 'Mayo' }, { id: '6', label: 'Junio' },
  ]}
  selectedId="1"
  onChange={(id) => {}}
/>
*/
