/**
 * Drawer — Componente atómico
 * CS Design System · v1.0
 *
 * Riel lateral/superior colapsable — contenedor simple, sin header ni
 * contenido propios (los aporta el consumidor vía `children`, mismo criterio
 * que Dialog/PopoverSheet: Figma tampoco los modela). Sprint 5, Pri 9.
 *
 * `dismissable` decide el comportamiento (mapea `Style` de Figma):
 *   - `true` (Dismissable) — alterna Collapsed↔Expanded de verdad.
 *   - `false` (Standard) — sin toggle, siempre en su único estado real
 *     (`collapsed` se ignora).
 * El fondo/borde/radio son EL MISMO en los dos estados (confirmado por dato:
 * mismo radio 0/8/0/8 en Collapsed y Expanded) — solo cambia el tamaño
 * (`--ds-drawer-collapsed-size`/`-expanded-size`) y si `children` se muestra.
 *
 * Sin cambio de código: `strokeAlign` del `Container` se corrigió en Figma
 * de `INSIDE` a `OUTSIDE` en las 30 variantes (17/09) — con `INSIDE`, un
 * `children` a ancho completo (p. ej. las filas Parent de SidebarMenu) tapaba
 * el borde por diseño. En CSS esto nunca pasó: `box-sizing: border-box` deja
 * el borde en su propia capa fuera del área de contenido — el fix es solo
 * de la referencia en Figma, no de este componente.
 *
 * Icono por estado, no por posición fija (bug real de v0 en Figma, corregido
 * 15-16/09 junto con Carol): `icon` se muestra colapsado (p. ej. `Menu`,
 * invita a abrir) y `expandedIcon` al expandir (p. ej. `ArrowLeft`/`ArrowUp`,
 * apunta hacia el borde de anclaje, invita a cerrar) — si no se pasa
 * `expandedIcon`, cae en `icon`. En Standard, `icon` es un slot libre
 * permanente (el "holder" de Figma es a propósito genérico — cesta, libro,
 * lo que traiga el consumidor — no un placeholder roto).
 *
 * `iconPlacement` — confirmado por coordenadas reales en Figma, no es solo
 * decorativo:
 *   - `anchor="left"`: 'start' (Icon Top, por defecto) pone icono+divider
 *     ARRIBA y `children` debajo; 'end' (Icon Bottom) los pone ABAJO
 *     (`children` arriba) — el orden real se invierte, no es una alineación.
 *   - `anchor="top"`: 'start' (Icon Left, por defecto) alinea el icono a la
 *     izquierda de su fila; 'end' (Icon Right) a la derecha — aquí sí es
 *     alineación pura, `children` siempre debajo.
 *   - `'none'`: sin icono (ni fila de icono, ni divider).
 *
 * `anchor` decide el eje: 'left' (riel vertical, ancho variable, alto fijo
 * por el consumidor) o 'top' (riel horizontal, alto variable, ancho fijo).
 * El radio de esquina (8px, literal — confirmado por dato en Figma) solo se
 * pinta en el borde OPUESTO al anclaje, para que el riel quede a ras del
 * borde de pantalla al que se ancla.
 *
 * `--ds-drawer-collapsed-size`/`-expanded-size` (72px/240px por defecto)
 * gobiernan el ancho (anchor="left") o alto (anchor="top") en cada estado —
 * sobreescribibles por el consumidor vía `style` (custom properties CSS),
 * p. ej. un SidebarMenu que necesite 56px/312px en vez de los de muestra.
 *
 * `showDivider` solo pinta separador con `anchor="left"` — confirmado por
 * dato en Figma: la instancia `Divider` existe en las variantes Anchor=
 * Default(Left) pero NO en ninguna de las Anchor=Top, no es una omisión.
 *
 * USO:
 *   <Drawer
 *     anchor="left"
 *     dismissable
 *     collapsed={collapsed}
 *     onToggleCollapse={() => setCollapsed(c => !c)}
 *     icon={<Icon name="Menu" />}
 *     expandedIcon={<Icon name="ArrowLeft" />}
 *   >
 *     Contenido libre
 *   </Drawer>
 *
 *   <Drawer dismissable={false} icon={<Icon name="ShoppingCart" />}>
 *     Contenido siempre visible
 *   </Drawer>
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Divider } from './Divider';

const css = `
.ds-drawer {
  box-sizing:    border-box;
  display:       flex;
  overflow:      hidden;
  background:    var(--ds-drawer-root-bg-primary);
  border:        var(--ds-drawer-root-border-width-generic) solid var(--ds-drawer-root-border-color-generic);
  transition:    width 0.2s ease, height 0.2s ease;
}
.ds-drawer--color-secondary { background: var(--ds-drawer-root-bg-secondary); }

/* Icono siempre arriba (o abajo con iconPlacement="end"), children en el
   resto del eje — solo cambia qué dimensión CSS responde a collapsed/expanded. */
.ds-drawer--anchor-left { flex-direction: column; height: 100%; }
.ds-drawer--anchor-top  { flex-direction: column; width: 100%; }
.ds-drawer--anchor-left.ds-drawer--placement-end { flex-direction: column-reverse; }

.ds-drawer--anchor-left.ds-drawer--collapsed  { width: var(--ds-drawer-collapsed-size); }
.ds-drawer--anchor-left.ds-drawer--expanded   { width: var(--ds-drawer-expanded-size); }
.ds-drawer--anchor-top.ds-drawer--collapsed   { height: var(--ds-drawer-collapsed-size); }
.ds-drawer--anchor-top.ds-drawer--expanded    { height: var(--ds-drawer-expanded-size); }

/* El radio solo va en el borde opuesto al anclaje (confirmado por dato en Figma) */
.ds-drawer--anchor-left { border-radius: 0 var(--ds-drawer-root-border-radius-generic) var(--ds-drawer-root-border-radius-generic) 0; }
.ds-drawer--anchor-top  { border-radius: 0 0 var(--ds-drawer-root-border-radius-generic) var(--ds-drawer-root-border-radius-generic); }

.ds-drawer__icon {
  flex-shrink:     0;
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           var(--ds-drawer-collapsed-size);
  height:          var(--ds-drawer-collapsed-size);
  padding:         0;
  background:      transparent;
  border:          none;
  color:           var(--ds-drawer-icon-fg-generic);
  cursor:          pointer;
}
.ds-drawer__icon:disabled { cursor: default; }
.ds-drawer__icon:focus-visible { outline: 2px solid var(--ds-drawer-icon-fg-generic); outline-offset: -2px; }

/* El icono NUNCA se centra — confirmado por dato en Figma: x fijo (20px
   anchor=left, 16px anchor=top) igual en Collapsed y Expanded, no un cálculo
   de centrado (solo coincide con el centro en Collapsed por casualidad
   numérica, 72/2−16=20). Con el botón a tamaño fijo (--ds-drawer-collapsed-
   size) pegado al extremo, su propio centrado interno reproduce ese offset
   sin necesitar un margen aparte. */
.ds-drawer__icon-row { flex-shrink: 0; display: flex; align-items: center; justify-content: flex-start; }
/* "end" en anchor="left" es posición VERTICAL (Icon Bottom, ya resuelto por
   column-reverse arriba) — el icono se queda alineado a la izquierda igual
   que en "start". En anchor="top" sí es alineación horizontal real. */
.ds-drawer--anchor-top.ds-drawer--placement-end .ds-drawer__icon-row { justify-content: flex-end; }

.ds-drawer__content {
  flex:       1 1 auto;
  min-width:  0;
  min-height: 0;
  overflow:   auto;
}
.ds-drawer--collapsed .ds-drawer__content { display: none; }
`;

injectStyles('ds-drawer', css);

export function Drawer({
  anchor           = 'left',    // 'left' | 'top'
  color            = 'primary', // 'primary' | 'secondary'
  dismissable      = true,
  collapsed        = false,     // ignorado si dismissable=false (Standard siempre "expandido")
  onToggleCollapse,
  icon,
  expandedIcon,
  iconPlacement    = 'start',   // 'start' | 'end' | 'none'
  iconLabel        = 'Abrir/cerrar panel',
  showDivider      = true,
  children,
  id,
  className,
  style,
}) {
  const isCollapsed = dismissable && collapsed;
  const currentIcon = iconPlacement === 'none' ? null : (isCollapsed ? icon : (expandedIcon ?? icon));

  const classes = [
    'ds-drawer',
    `ds-drawer--anchor-${anchor}`,
    `ds-drawer--color-${color}`,
    `ds-drawer--placement-${iconPlacement === 'none' ? 'start' : iconPlacement}`,
    isCollapsed ? 'ds-drawer--collapsed' : 'ds-drawer--expanded',
    className || '',
  ].filter(Boolean).join(' ');

  const iconRow = currentIcon && (
    <div className="ds-drawer__icon-row">
      {dismissable ? (
        <button
          type="button"
          className="ds-drawer__icon"
          onClick={onToggleCollapse}
          aria-label={iconLabel}
          aria-expanded={!isCollapsed}
        >
          {currentIcon}
        </button>
      ) : (
        <span className="ds-drawer__icon" aria-hidden="true">{currentIcon}</span>
      )}
    </div>
  );

  return (
    <div id={id} className={classes} style={style}>
      {iconRow}
      {showDivider && currentIcon && anchor === 'left' && <Divider />}
      <div className="ds-drawer__content">{children}</div>
    </div>
  );
}

export default Drawer;
