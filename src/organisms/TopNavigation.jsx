/**
 * TopNavigation — Organismo
 * CS Design System · v1
 *
 * Barra de navegación principal de La Plataforma. Reemplaza las 576
 * variantes combinatorias de la librería de origen (iOS/Android × Device ×
 * Left/Right Panel — Sistema Origen nunca construyó una versión Web) por
 * un puñado de props reales.
 *
 * RESPONSIVE DE VERDAD, no un componente por breakpoint: las dos capas
 * (`__desktop`/`__collapsed`) se renderizan las dos siempre, y una media
 * query (`--ds-top-navigation-breakpoint`) decide cuál se ve — igual de
 * simple que decidió Carol para no repetir el problema de Sistema Origen
 * (imposible hacer responsive de verdad con esa arquitectura de variantes).
 *
 * Por encima del breakpoint: Logo (slot libre) + fila de `TabItem`
 * (`device="desktop"`, sin límite de items) + `Button` de salir. Un item
 * con `flydown` abre un panel `Card` con los links agrupados por columna al
 * hacer hover/focus — cada link es un `Link` re-tematizado LOCALMENTE (solo
 * en este CSS, sin tocar el átomo compartido) para que el subrayado
 * permanente no "manche" el panel con muchos enlaces en columna — hallazgo
 * real de Carol, confirmado visualmente en Figma. Mismo mecanismo que
 * Collapsible re-tematizando Button.
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

.ds-top-navigation__left { display: flex; align-items: center; gap: 32px; min-width: 0; }
.ds-top-navigation__tabs { display: flex; align-items: stretch; }
.ds-top-navigation__item { position: relative; }

.ds-top-navigation__flydown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  display: flex;
  gap: var(--ds-top-navigation-flydown-gap);
  padding: 24px;
}
.ds-top-navigation__group { display: flex; flex-direction: column; gap: 16px; min-width: 140px; }
.ds-top-navigation__group-title {
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-label-sm);
  color: var(--ds-fg-default);
}
.ds-top-navigation__group-links { display: flex; flex-direction: column; gap: 8px; }

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

function flydownToSidebarChildren(flydown, onSelectLeaf) {
  if (!flydown) return undefined;
  return flydown.flatMap((group) =>
    group.links.map((link, i) => {
      const id = `${group.groupTitle}-${i}`;
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

  // los leaves del árbol de SidebarMenu solo llevan id/label — el onClick
  // real de cada link/menuItem se guarda aparte y se resuelve en handleSelect
  const onSelectLeaf = {};
  const sidebarItems = menuItems.map((item) => {
    onSelectLeaf[item.id] = item.onClick;
    return {
      id: item.id,
      label: item.label,
      children: flydownToSidebarChildren(item.flydown, onSelectLeaf),
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
          <div className="ds-top-navigation__tabs" role="tablist">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="ds-top-navigation__item"
                onMouseEnter={() => item.flydown && setOpenFlydownId(item.id)}
                onMouseLeave={() => item.flydown && setOpenFlydownId(null)}
              >
                <TabItem device="desktop" onClick={item.onClick}>{item.label}</TabItem>
                {item.flydown && openFlydownId === item.id && (
                  <Card className="ds-top-navigation__flydown">
                    {item.flydown.map((group) => (
                      <div className="ds-top-navigation__group" key={group.groupTitle}>
                        <span className="ds-top-navigation__group-title">{group.groupTitle}</span>
                        <div className="ds-top-navigation__group-links">
                          {group.links.map((link) => (
                            <Link key={link.label} size="xs" emphasis="low" rightIcon={false} onClick={link.onClick}>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            ))}
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
