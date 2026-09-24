/**
 * TopNavigation — Organismo
 * CS Design System · v1
 *
 * Barra de navegación principal para Web (genérico — no ata a un consumidor
 * concreto, mismo criterio que Page Title). Reemplaza las 576 variantes
 * combinatorias de la librería de origen (iOS/Android × Device × Left/Right
 * Panel — Sistema Origen nunca construyó una versión Web) por un puñado de
 * props reales.
 *
 * RESPONSIVE DE VERDAD, no un componente por breakpoint: las dos capas
 * (`__desktop`/`__collapsed`) se renderizan las dos siempre, y una media
 * query (`--ds-top-navigation-breakpoint`) decide cuál se ve — igual de
 * simple que decidió Carol para no repetir el problema de Sistema Origen
 * (imposible hacer responsive de verdad con esa arquitectura de variantes).
 *
 * Por encima del breakpoint: Logo (slot libre) + fila de `TabItem`
 * (`device="desktop"`, sin límite de items) + `Button` de salir. Un item
 * con `flydown` abre un MEGA-MENÚ (`Card`, ancho completo de la barra —
 * ref. real de Carol: mollie.com/es, 25/09) al hacer hover/focus, con los
 * links agrupados por columna — cada link es un `Link` re-tematizado
 * LOCALMENTE (solo en este CSS, sin tocar el átomo compartido) para que el
 * subrayado permanente no "manche" el panel con muchos enlaces en columna —
 * hallazgo real de Carol, confirmado visualmente en Figma. Mismo mecanismo
 * que Collapsible re-tematizando Button.
 *
 * `flydown` — array de `{ groupTitle?, links }`, SIN límite de columnas ni
 * de enlaces por columna (composición libre, no variantes — mismo criterio
 * que CellActions/StepIndicatorLarge). `groupTitle` es opcional: referencia
 * real de Carol (PowerOPs) confirma flydowns reales con 1 a 6+ columnas, de
 * 1 a 7+ enlaces cada una, y al menos un caso sin título de grupo en
 * absoluto (lista plana).
 *
 * El panel abre con un "Tab title" (label del propio `menuItem`, en cabecera,
 * fuera del layout de columnas) — añadido en Figma 24/09: nombra sin
 * ambigüedad a qué tab pertenece el flydown visible, motivado en parte por
 * el fix de abajo (con el hover-close corregido ya no hacía falta para
 * evitar el flydown equivocado, pero Carol lo mantuvo como refuerzo visual
 * real, confirmado en Figma). Usa `--ds-top-navigation-flydown-tab-title-fg-generic`
 * (Component token nuevo — antes de esta sesión el texto de Figma saltaba
 * directo a `headline/fg/default`, Mode, sin capa de Componente).
 *
 * **Deuda pendiente, NO construida en código:** Figma (24/09) añadió una
 * segunda variante de Flydown, `Featured`, donde la última columna se
 * sustituye por `.Featured` (imagen(es) promocional + caption, renombrado
 * desde `.FlydownImage` el 24/09) en vez de
 * una columna de links. Ese componente instancia el átomo `Image` de
 * Sistema Origen — que este proyecto NUNCA construyó (sigue en el backlog
 * de §9 de CLAUDE.md junto a Calendar/Bottom Navigation/Bottom Sheet/
 * Videoplayer) — así que `Featured` no tiene equivalente en `TopNavigation.jsx`
 * todavía. `flydown` solo admite el layout `Default` (columnas de links).
 *
 * Ancho SIEMPRE el de la barra (= el de la página, `left/right:0` contra el
 * `<nav>` raíz, nunca una `width` propia) — sin esto, hubo 4 intentos reales
 * fallidos calculando/midiendo el ancho a mano (ver git log si hace falta el
 * detalle); anclarlo al 100% del padre los cierra todos de una vez. Alto:
 * columnas CSS reales (`column-width`/`max-height`/`column-fill:auto`),
 * NUNCA scroll en una capa flotante — un grupo largo sin columnas hermanas
 * salta de columna en cuanto se queda sin alto (`break-inside: avoid` por
 * grupo) en vez de crecer sin límite. `--ds-top-navigation-flydown-height`
 * es aproximado a propósito ("de un vistazo"), no una garantía matemática
 * para cualquier volumen de contenido — pensado para el rango real visto en
 * PowerOPs (hasta ~6 grupos, ~7 enlaces cada uno).
 *
 * Por debajo del breakpoint: Logo + `IconButton` (Menu) — SIN botón de
 * salir aparte. El IconButton abre `SidebarMenu` (ya construido) sobre un
 * `Scrim` — mismo árbol de información que el flydown, reestructurado: cada
 * `menuItem` es un Parent, cada link de sus grupos flydown es un Child, y
 * `exitLabel` se añade como ÚLTIMO item plano del árbol (pedido explícito
 * de Carol: en mobile, Salir es una opción más del menú desplegado, no un
 * control aparte junto al hamburger). **Simplificación v1 consciente:** el
 * título de grupo del flydown ("no es linkable", según la referencia) se
 * pierde en esta vista — SidebarMenu no tiene un nivel "encabezado no
 * clicable", así que los links de todos los grupos de un item se aplanan
 * como Children directos. Aceptable porque es una vista de apoyo (móvil/
 * tablet), no la primaria.
 *
 * USO:
 *   <TopNavigation
 *     logo={<MyLogo />}
 *     exitLabel="Salir"
 *     onExit={() => logout()}
 *     menuItems={[
 *       { id: 'clientes', label: 'Clientes' },
 *       {
 *         id: 'facturacion', label: 'Facturación y servicios',
 *         flydown: [
 *           { groupTitle: 'Facturación', links: [{ label: 'Facturas', onClick: fn }] },
 *           { groupTitle: 'Sistema de pago', links: [{ label: 'Cobros', onClick: fn }] },
 *         ],
 *       },
 *     ]}
 *   />
 */
import React, { useState } from 'react';
import { injectStyles } from '../components/_inputBase';
import { TabItem } from '../components/TabItem';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Link } from '../components/Link';
import { Scrim } from '../components/Scrim';
import { SidebarMenu } from './SidebarMenu';

const css = `
.ds-top-navigation {
  position: relative;
  width: 100%;
  background: var(--ds-top-navigation-root-bg-generic);
  box-sizing: border-box;
}
.ds-top-navigation__desktop,
.ds-top-navigation__collapsed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ds-top-navigation-root-padding-horizontal);
}
.ds-top-navigation__desktop { display: flex; }
.ds-top-navigation__collapsed { display: none; }

@media (max-width: 1023px) {
  .ds-top-navigation__desktop { display: none; }
  .ds-top-navigation__collapsed { display: flex; }
}

.ds-top-navigation__left { display: flex; align-items: center; gap: var(--ds-top-navigation-root-gap-generic); min-width: 0; }
.ds-top-navigation__tabs { display: flex; align-items: stretch; }
.ds-top-navigation__item { position: relative; }

.ds-top-navigation__flydown {
  /* Mega-menú a ancho completo de página (25/09, ref. real de Carol:
     mollie.com/es — aparece en mouseover, siempre el mismo ancho que la
     barra). Se ancla a .ds-top-navigation (el nav raíz, position:relative +
     width:100% ya existente) — no a la pestaña ni a .__tabs, que no llegan
     al borde (Logo/Salir quedan fuera) — con left/right:0 en vez de una
     width propia, así SIEMPRE ocupa el 100% real de la barra = la página,
     sin importar cuántos px mida, nunca hace falta medir ni acotar al
     viewport (ancho ya no es auto/calculado, lo fija el padre). Cierra
     todo el
     historial de bugs de ancho de la versión anterior (card compacta
     flotando junto a la pestaña) — ver git log si hace falta el detalle.
  */
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: var(--ds-top-navigation-flydown-title-gap);
  padding: var(--ds-top-navigation-flydown-padding) var(--ds-top-navigation-root-padding-horizontal);
  text-align: left; /* el boilerplate de Vite pone text-align:center en body — mismo
    bug real ya cazado en Accordion/InlineNotification. Con columnas estrechas
    (Group title) apenas se notaba; con el "Tab title" a ancho completo del
    panel quedaba muy centrado — se corrige aquí, en la raíz, para cubrir
    todos los textos del flydown de una vez, no solo el título del tab. */
}
.ds-top-navigation__flydown-title {
  /* "Tab title" (Figma, 24/09) — nombra el tab cuyo flydown se ve, para que
     nunca quede ambigüedad de a qué pestaña pertenece el panel abierto. */
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-headline-xs);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-top-navigation-flydown-tab-title-fg-generic);
}
.ds-top-navigation__flydown-columns {
  /* Columnas CSS reales, no flex-wrap — flex-wrap solo resuelve el desborde
     de ANCHO (una fila entera pasa a la siguiente), pero un ÚNICO grupo
     largo (p. ej. una lista plana de 7 enlaces sin columnas hermanas)
     simplemente crecía en alto sin límite. column-width + max-height (con
     column-fill:auto) hacen que el CONTENIDO fluya y salte de columna en
     columna en cuanto se queda sin alto — nunca scroll, nunca crece
     indefinido. Aproximado a propósito ("de un vistazo"), no es garantía
     matemática para cualquier volumen — pensado para el rango real visto en
     PowerOPs (hasta ~6 grupos, ~7 enlaces cada uno). */
  max-height: var(--ds-top-navigation-flydown-height);
  column-width: var(--ds-top-navigation-flydown-column-width);
  column-gap: var(--ds-top-navigation-flydown-gap);
  column-fill: auto;
}
.ds-top-navigation__group {
  display: flex;
  flex-direction: column;
  gap: var(--ds-top-navigation-flydown-links-group-gap);
  padding: var(--ds-top-navigation-flydown-links-group-padding);
  margin-bottom: var(--ds-top-navigation-flydown-gap);
  break-inside: avoid; /* un grupo nunca se parte entre 2 columnas */
}
.ds-top-navigation__group-title {
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-label-sm);
  color: var(--ds-top-navigation-flydown-group-title-fg-generic);
}
.ds-top-navigation__group-links { display: flex; flex-direction: column; gap: var(--ds-top-navigation-flydown-links-group-gap); }

/* re-tematiza Link SOLO aquí — subrayado permanente -> hover/focus.
   Mismo mecanismo que Collapsible re-tematizando Button, sin tocar el
   átomo compartido ni sus otros consumidores. */
.ds-top-navigation__group-links .ds-link {
  --ds-link-border-bottom-default: transparent;
  --ds-link-border-bottom-accent:  transparent;
}
.ds-top-navigation__group-links .ds-link:hover,
.ds-top-navigation__group-links .ds-link:focus-visible {
  --ds-link-border-bottom-default: var(--ds-borderColor-primary);
  --ds-link-border-bottom-accent:  var(--ds-borderColor-primary);
}

.ds-top-navigation__scrim-wrap {
  position: fixed;
  inset: 0;
  z-index: 30;
}
.ds-top-navigation__mobile-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px;
  z-index: 31;
  background: var(--ds-top-navigation-root-bg-generic);
}
`;

injectStyles('ds-top-navigation', css);

function flydownToSidebarChildren(flydown, onSelectLeaf, parentId) {
  if (!flydown) return undefined;
  return flydown.flatMap((group, groupIndex) =>
    group.links.map((link, i) => {
      const id = `${parentId}-${groupIndex}-${i}`;
      onSelectLeaf[id] = link.onClick;
      return { id, label: link.label };
    })
  );
}

export function TopNavigation({
  logo,
  menuItems = [],
  exitLabel = 'Salir',
  onExit,
  className,
  style,
}) {
  const [openFlydownId, setOpenFlydownId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openFlydownItem = menuItems.find((item) => item.id === openFlydownId && item.flydown);

  // los leaves del árbol de SidebarMenu solo llevan id/label — el onClick
  // real de cada link/menuItem se guarda aparte y se resuelve en handleSelect
  const onSelectLeaf = {};
  const sidebarItems = menuItems.map((item) => {
    onSelectLeaf[item.id] = item.onClick;
    return {
      id: item.id,
      label: item.label,
      children: flydownToSidebarChildren(item.flydown, onSelectLeaf, item.id),
    };
  });
  // Salir NO es un botón aparte junto al hamburger en mobile — es la última
  // opción del propio SidebarMenu desplegado (pedido explícito de Carol).
  onSelectLeaf.exit = onExit;
  sidebarItems.push({ id: 'exit', label: exitLabel });

  function handleSidebarSelect(id) {
    onSelectLeaf[id]?.();
    setMobileMenuOpen(false);
  }

  return (
    <nav className={`ds-top-navigation ${className || ''}`} style={style}>
      {/* ── Desktop ─────────────────────────────────────────────────────── */}
      <div className="ds-top-navigation__desktop">
        <div className="ds-top-navigation__left">
          {logo}
          <div
            className="ds-top-navigation__tabs"
            role="tablist"
            onMouseLeave={() => setOpenFlydownId(null)}
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="ds-top-navigation__item"
                // hover sobre un item SIN flydown debe cerrar el que estuviera
                // abierto — bug real reportado por Carol 24/09: `item.flydown &&
                // setOpenFlydownId(...)` era un no-op para esos items, así que
                // el flydown anterior se quedaba abierto (p. ej. hover en
                // "Clientes" con "Productos y servicios" ya desplegado).
                onMouseEnter={() => setOpenFlydownId(item.flydown ? item.id : null)}
              >
                <TabItem device="desktop" onClick={item.onClick}>{item.label}</TabItem>
              </div>
            ))}
            {openFlydownItem && (
              <Card className="ds-top-navigation__flydown">
                <span className="ds-top-navigation__flydown-title">{openFlydownItem.label}</span>
                <div className="ds-top-navigation__flydown-columns">
                  {openFlydownItem.flydown.map((group, groupIndex) => (
                    <div className="ds-top-navigation__group" key={groupIndex}>
                      {group.groupTitle && (
                        <span className="ds-top-navigation__group-title">{group.groupTitle}</span>
                      )}
                      <div className="ds-top-navigation__group-links">
                        {group.links.map((link) => (
                          <Link key={link.label} size="xs" emphasis="low" rightIcon={false} onClick={link.onClick}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
        <Button variant="ghost" size="lg" iconRight="LogOut" onClick={onExit}>{exitLabel}</Button>
      </div>

      {/* ── Mobile/Tablet, colapsado ────────────────────────────────────── */}
      <div className="ds-top-navigation__collapsed">
        {logo}
        <IconButton
          type="default"
          variant="tertiary"
          icon="Menu"
          ariaLabel="Abrir menú"
          onClick={() => setMobileMenuOpen(true)}
        />
      </div>

      {mobileMenuOpen && (
        <>
          <div className="ds-top-navigation__scrim-wrap">
            <Scrim onClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className="ds-top-navigation__mobile-panel">
            <SidebarMenu items={sidebarItems} onSelect={handleSidebarSelect} />
          </div>
        </>
      )}
    </nav>
  );
}

export default TopNavigation;
