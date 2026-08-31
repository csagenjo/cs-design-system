/**
 * Tabs — Organismo
 * CS Design System · v1.0
 *
 * Contenedor de N × Tab. `type="fixed"` reparte el ancho a partes iguales
 * entre los tabs; `type="scrollable"` deja cada tab a su ancho natural y
 * activa scroll horizontal si el contenido desborda el contenedor — el
 * número de items no está limitado (a diferencia de Figma, que solo
 * documenta 2-6 como ejemplos: aquí acepta cualquier `items.length`).
 *
 * `device`: 'mobile' | 'tablet' — Desktop reutiliza 'tablet' (ver nota en
 * Tab.jsx y en tokens.css).
 *
 * USO:
 *   <Tabs items={[{id:'a',label:'Resumen'},{id:'b',label:'Movimientos'}]}
 *     selectedId="a" onChange={fn} />
 *
 *   <Tabs type="scrollable" device="mobile"
 *     items={manyItems} selectedId={id} onChange={fn} />
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { TabItem } from '../components/TabItem';

const css = `
.ds-tabs {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid var(--ds-tabs-root-border-bottom-color-generic);
}
.ds-tabs--fixed .ds-tab-item { flex: 1 0 0; }
.ds-tabs--scrollable {
  overflow-x: auto;
}
.ds-tabs--scrollable .ds-tab-item { flex: 0 0 auto; }
`;

injectStyles('ds-tabs', css);

export function Tabs({
  items = [],
  selectedId,
  onChange,
  type = 'fixed', // 'fixed' | 'scrollable'
  device = 'tablet', // 'mobile' | 'tablet'
  id,
  className,
}) {
  const classes = [
    'ds-tabs',
    `ds-tabs--${type}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} role="tablist">
      {items.map((item) => (
        <TabItem
          key={item.id}
          device={device}
          selected={item.id === selectedId}
          disabled={item.disabled}
          onClick={() => onChange?.(item.id)}
        >
          {item.label}
        </TabItem>
      ))}
    </div>
  );
}

export default Tabs;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Tabs
  items={[
    { id: 'summary', label: 'Resumen' },
    { id: 'movements', label: 'Movimientos' },
  ]}
  selectedId="summary"
  onChange={(id) => {}}
/>

<Tabs
  type="scrollable"
  device="mobile"
  items={[
    { id: '1', label: 'Enero' }, { id: '2', label: 'Febrero' }, { id: '3', label: 'Marzo' },
    { id: '4', label: 'Abril' }, { id: '5', label: 'Mayo' }, { id: '6', label: 'Junio' },
    { id: '7', label: 'Julio' },
  ]}
  selectedId="1"
  onChange={(id) => {}}
/>
*/
