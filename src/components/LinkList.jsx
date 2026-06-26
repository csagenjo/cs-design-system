import React from 'react';
import { Link } from './Link';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-link-list {
  list-style: none;
  margin:     0;
  padding:    0;
  display:    flex;
  flex-direction: column;
}

.ds-link-list--gap-sm { gap: var(--ds-spacing-xs); }
.ds-link-list--gap-md { gap: var(--ds-spacing-md); }
.ds-link-list--gap-lg { gap: var(--ds-spacing-xl); }
`;

let _styleInjected = false;
function injectStyles() {
  if (_styleInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  _styleInjected = true;
}
injectStyles();

/* ─── LinkList ──────────────────────────────────────────────────────────────── */

export function LinkList({
  items     = [],
  title,
  gap       = 'md',
  ariaLabel,
  fullWidth = false,
}) {
  return (
    <nav aria-label={ariaLabel} style={fullWidth ? { width: '100%' } : undefined}>
      {title && <h2>{title}</h2>}
      <ul
        role="list"
        className={[
          'ds-link-list',
          `ds-link-list--gap-${gap}`,
        ].filter(Boolean).join(' ')}
      >
        {items.map((item) => (
          <li key={item.href ?? item.label}>
            <Link
              variant={item.variant}
              size={item.size}
              emphasis={item.emphasis}
              href={item.href}
              onClick={item.onClick}
              external={item.external}
              leftIcon={item.leftIcon ?? true}
              rightIcon={item.rightIcon ?? true}
              ariaLabel={item.ariaLabel}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default LinkList;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<LinkList
  ariaLabel="Navegación principal"
  items={[
    { label: 'Inicio',     href: '/' },
    { label: 'Clientes',   href: '/clientes', variant: 'accent' },
    { label: 'Informes',   href: '/informes', emphasis: 'medium' },
    { label: 'Ayuda',      href: 'https://help.example.com', external: true },
  ]}
/>

<LinkList
  title="Accesos rápidos"
  gap="lg"
  ariaLabel="Accesos rápidos"
  items={[
    { label: 'Nueva operación', href: '/ops/nueva', variant: 'accent', emphasis: 'medium' },
    { label: 'Ver historial',   href: '/ops/historial' },
  ]}
/>
*/
