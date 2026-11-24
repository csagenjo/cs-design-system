/**
 * BottomNavigation — Organismo
 * CS Design System · v1.0 (24/11/2026, alineado con Figma `Bottom Navigation`)
 *
 * Barra de 3 a 5 destinos para pantallas móviles: N × BottomNavigationItem
 * repartiendo el ancho a partes iguales (Figma: Items = 3 / 4 / 5, items en
 * FILL). Fondo bg/container y línea superior de 1 (borderColor/subtle) por
 * dentro: el alto es el de los items (56). Rellena por abajo la zona segura
 * del móvil (env(safe-area-inset-bottom)).
 *
 * Dónde va (fija abajo, solo en móvil…) lo decide el layout, no la barra.
 * Pieza suelta: no sustituye al menú de TopNavigation.
 *
 * Accesibilidad: <nav aria-label> + lista. El destino actual lleva
 * aria-current="page". `ariaLabel` obligatoria (en inglés, por prop).
 *
 * USO:
 *   <BottomNavigation ariaLabel="Main" selectedId="payments" items={[
 *     { id: 'home', label: 'Home', icon: 'menu', href: '/' },
 *     { id: 'payments', label: 'Payments', icon: 'wallet', href: '/payments', badge: '3', badgeLabel: '3 pending' },
 *     { id: 'suppliers', label: 'Suppliers', icon: 'file-text', href: '/suppliers' },
 *   ]} />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { warnOnce } from '../components/_devWarn';
import { BottomNavigationItem } from '../components/BottomNavigationItem';

const css = `
.ds-bottom-nav {
  position:       relative;
  box-sizing:     border-box;
  width:          100%;
  padding-bottom: env(safe-area-inset-bottom);
  background:     var(--ds-bottom-navigation-bg-generic);
}
/* Línea superior por encima del hover de los items, sin sumar alto (Figma: stroke inside). */
.ds-bottom-nav::before {
  content:        '';
  position:       absolute;
  top: 0; left: 0; right: 0;
  height:         var(--ds-bottom-navigation-border-width-top);
  background:     var(--ds-bottom-navigation-border-color-top);
  z-index:        1;
  pointer-events: none;
}
.ds-bottom-nav__list {
  display:    flex;
  margin:     0;
  padding:    0;
  list-style: none;
}
.ds-bottom-nav__list > li {
  display:   flex;
  flex:      1 1 0;
  min-width: 0;
}
`;

injectStyles('ds-bottom-nav', css);

export function BottomNavigation({
  items = [],          // [{ id, label, icon, href?, onClick?, badge?, badgeLabel?, disabled? }] — de 3 a 5
  selectedId,
  onSelect,            // (id, event) al pulsar un item sin href propio de navegación
  ariaLabel,           // obligatoria: nombre de la navegación ("Main")
  id,
  className,
  style,
}) {
  if (items.length < 3 || items.length > 5) {
    warnOnce('BottomNavigation.count', `[DS BottomNavigation] Lleva de 3 a 5 items (Figma: Items = 3 / 4 / 5); recibidos ${items.length}.`);
  }
  if (!ariaLabel) warnOnce('BottomNavigation.ariaLabel', '[DS BottomNavigation] `ariaLabel` es obligatoria: la <nav> necesita nombre.');

  return (
    <nav id={id} className={['ds-bottom-nav', className || ''].filter(Boolean).join(' ')} style={style} aria-label={ariaLabel}>
      <ul className="ds-bottom-nav__list" role="list">
        {items.map((it) => (
          <li key={it.id}>
            <BottomNavigationItem
              icon={it.icon}
              label={it.label}
              href={it.href}
              badge={it.badge}
              badgeLabel={it.badgeLabel}
              disabled={it.disabled}
              selected={it.id === selectedId}
              onClick={(e) => { it.onClick?.(e); onSelect?.(it.id, e); }}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

BottomNavigation.displayName = 'BottomNavigation';
export default BottomNavigation;
