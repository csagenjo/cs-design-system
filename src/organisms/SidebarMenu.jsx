/**
 * SidebarMenu — Organismo
 * CS Design System · v1.0
 *
 * Menú lateral de navegación para La Plataforma (UIKit Plataforma) — hasta 3
 * niveles de profundidad (Parent → Child → Gran son). Compone `Drawer`
 * (carcasa colapsable — riel de icono ↔ panel ancho, ya construido) +
 * `ListView` (cada fila del árbol, ya construido) — cero átomo nuevo,
 * mismo criterio que Country Picker/Combobox reutilizando SelectorListItem.
 *
 * Referencia de comportamiento: la plantilla "PO-Sidebar menu" que Carol ya
 * tiene en el UI Toolkit de Apps Internas (archivo aparte, sin limpiar de
 * IP) — se usó solo para entender estructura/comportamiento (3 niveles,
 * icono+chevron, fila seleccionada con acento), NUNCA se copió ningún valor
 * literal de ese archivo (colores/fuente reales de La Empresa) a este
 * organismo — todo pasa por los tokens `--ds-*` ya existentes.
 *
 * `title` — el nombre de la feature/building block seleccionada en el menú
 * principal. Ese menú principal AÚN NO EXISTE en el catálogo — de momento es
 * un string simple que el consumidor pasa a mano; el día que exista una
 * fuente real, se conecta ahí sin tocar este organismo. Se renderiza como
 * primera línea de `children` dentro de Drawer, NO junto al icono de
 * colapsar/expandir en la misma fila — Drawer no tiene hoy un slot de texto
 * junto al icono (`icon`+`label` en la misma cabecera es una extensión de
 * Drawer que Carol dejó explícitamente para más adelante). Al colapsar, el
 * título desaparece con el resto del contenido — coincide con la referencia
 * (el estado "Hide" solo muestra el icono). Instancia el átomo `Headline`
 * (`level={6}`, Default) — nunca reimplementado a mano, mismo criterio que
 * el resto del sistema — envuelto en un padding propio (`--ds-sidebar-menu-
 * title-padding-*`, 16/16/8, token real desde Figma).
 *
 * Tercer átomo instanciado además de Drawer/ListView (documentado en Figma
 * como "3 instanced components"). El indent por nivel del árbol también es
 * un token real, `--ds-sidebar-menu-indent-step` (16px) — Parent=0, Child=
 * 1×step, Gran son=2×step — no un literal hardcodeado en el JS.
 *
 * `items` — árbol real, no una lista plana con indentación manual:
 *   [{ id, label, children?: [{ id, label, children?: [{ id, label }] }] }]
 * Solo 3 niveles tienen tratamiento visual real en Figma (Parent/Child/Gran
 * son) — un 4º nivel se renderiza igual que el 3º (mismo padding, sin
 * truncar el árbol) en vez de fallar en silencio.
 *
 * Máximo recomendado de 8 items en el nivel Parent (raíz de `items`) — el
 * riel se vuelve difícil de escanear de un vistazo por encima de eso; con
 * más de 8, avisa por consola en dev (mismo criterio que CellActions con
 * `>2` acciones), no bloquea el render.
 *
 * Expandir/colapsar RAMAS del árbol se gestiona internamente (estado propio,
 * mismo criterio que AccordionGroup) — al montar, expande automáticamente la
 * rama que contiene `selectedId`, para que la fila seleccionada sea visible
 * de entrada sin que el consumidor tenga que calcularlo.
 *
 * USO:
 *   <SidebarMenu
 *     title="Gestión de cuentas"
 *     items={items}
 *     selectedId={selectedId}
 *     onSelect={setSelectedId}
 *     collapsed={collapsed}
 *     onToggleCollapse={() => setCollapsed(c => !c)}
 *   />
 */
import React, { useState, useMemo } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Drawer } from '../components/Drawer';
import { ListView } from '../components/ListView';
import { Headline } from '../components/Headline';
import { Icon } from '../components/Icon';

const css = `
.ds-sidebar-menu__title {
  padding: var(--ds-sidebar-menu-title-padding-top) var(--ds-sidebar-menu-title-padding-horizontal) var(--ds-sidebar-menu-title-padding-bottom);
}
.ds-sidebar-menu__tree { display: flex; flex-direction: column; }
.ds-sidebar-menu__row  { padding-left: var(--ds-sidebar-menu-indent, 0px); }
.ds-sidebar-menu__chevron {
  display:    flex;
  color:      var(--ds-sidebar-menu-chevron-fg-primary);
  transition: transform 0.15s ease;
}
/* ChevronDown (no chevron-up import) + rotate 180° al expandir — mismo
   mecanismo que InputCombobox. Collapsed=down / Expanded=up, igual que
   Figma (chevron-down/chevron-up) — bug real detectado por Carol 17/09:
   antes era ChevronRight rotado 90°, que da Collapsed=derecha/Expanded=
   abajo, justo invertido respecto a Figma. */
.ds-sidebar-menu__chevron--expanded { transform: rotate(180deg); }
`;

injectStyles('ds-sidebar-menu', css);

function collectAncestors(items, targetId, path = []) {
  for (const item of items) {
    const nextPath = [...path, item.id];
    if (item.id === targetId) return path;
    if (item.children) {
      const found = collectAncestors(item.children, targetId, nextPath);
      if (found) return found;
    }
  }
  return null;
}

function SidebarMenuNode({ item, level, selectedId, expandedIds, onSelect, onToggleExpand }) {
  const hasChildren = !!item.children?.length;
  const isSelected = item.id === selectedId;
  const isExpanded = expandedIds.has(item.id);

  return (
    <>
      <div className="ds-sidebar-menu__row" style={{ '--ds-sidebar-menu-indent': `calc((${level} - 1) * var(--ds-sidebar-menu-indent-step))` }}>
        <ListView
          header={item.label}
          leftPanel={false}
          description={false}
          detail={false}
          selected={isSelected}
          rightPanelContent={hasChildren ? (
            <span className={`ds-sidebar-menu__chevron ${isExpanded ? 'ds-sidebar-menu__chevron--expanded' : ''}`} aria-hidden="true">
              <Icon name="ChevronDown" size="sm" />
            </span>
          ) : null}
          onClick={() => (hasChildren ? onToggleExpand(item.id) : onSelect(item.id))}
        />
      </div>
      {hasChildren && isExpanded && item.children.map((child) => (
        <SidebarMenuNode
          key={child.id}
          item={child}
          level={level + 1}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </>
  );
}

export function SidebarMenu({
  title,
  items = [],
  selectedId,
  onSelect,
  collapsed = false,
  onToggleCollapse,
  id,
  className,
  style,
}) {
  const initialExpanded = useMemo(() => {
    const ancestors = selectedId ? collectAncestors(items, selectedId) : null;
    return new Set(ancestors || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo al montar — expandir la rama del seleccionado de entrada, no en cada cambio

  const [expandedIds, setExpandedIds] = useState(initialExpanded);

  if (process.env.NODE_ENV !== 'production' && items.length > 8) {
    console.warn('[DS SidebarMenu] Máximo recomendado 8 Parent items — se recibieron ' + items.length + '.');
  }

  function toggleExpand(nodeId) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }

  return (
    <Drawer
      id={id}
      className={className}
      anchor="left"
      dismissable
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
      icon={<Icon name="Menu" />}
      expandedIcon={<Icon name="ArrowLeft" />}
      style={{ '--ds-drawer-collapsed-size': '56px', '--ds-drawer-expanded-size': '312px', ...style }}
    >
      {title && (
        <div className="ds-sidebar-menu__title">
          <Headline level={6}>{title}</Headline>
        </div>
      )}
      <div className="ds-sidebar-menu__tree" role="tree">
        {items.map((item) => (
          <SidebarMenuNode
            key={item.id}
            item={item}
            level={1}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggleExpand={toggleExpand}
          />
        ))}
      </div>
    </Drawer>
  );
}

export default SidebarMenu;
