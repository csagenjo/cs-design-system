/**
 * Link — Componente atómico
 * CS Design System · v4.0 (26/10/2026: alineado 1:1 con Figma)
 *
 * Tokens: --ds-link-* (tokens.css) ← link/all/* de Figma. Iconos: átomo Icon.
 *
 * EJES (igual que el component set `Link` de Figma):
 *   variant  → 'default' (negro) | 'accent' (teal)
 *   emphasis → 'low' (regular) | 'medium' (bold)    — Figma `Type`
 *   size     → 'xs' | 'sm' (por defecto) | 'md' | 'lg' — texto label xs/sm/md/lg,
 *              iconos 16 / 20 / 24 / 32
 *   leftIcon / rightIcon → true (chevron-right) o el nombre de un icono de `Icon`
 *
 * ESTADOS (Figma `State`):
 *   Initial · Hover (bgMix) · Pressed (:active, opacidad) · Focus (anillo doble
 *   pegado al enlace, 2 + 2 px) · Visited (subrayado lila; Accent también texto
 *   e icono) · Current → `current` = página actual: SemiBold + aria-current="page"
 *
 *   Sin área de foco (decisión de Carol 26/10): el enlace suele ir dentro de
 *   un texto o de una lista; el anillo se pinta pegado y el contenedor deja aire.
 *
 * SIN `href` → <button type="button"> con el mismo aspecto (A11y-0): `href` =
 *   navega (es un enlace); solo `onClick` = acción en la vista (es un botón).
 *   El aviso "(opens in new tab)" se añade con `external` o con target="_blank".
 *
 * USO:
 *   <Link href="/ruta">Ver detalle</Link>
 *   <Link href="/ruta" variant="accent" size="md" emphasis="medium">Más info</Link>
 *   <Link href="/clientes" current>Clientes</Link>
 *   <Link onClick={abrirEdicion} rightIcon={false}>Editar</Link>
 */

import React from 'react';
import { Icon } from './Icon';
import { VisuallyHidden } from './VisuallyHidden';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-link--xs { --_fs: var(--ds-fontSize-label-xs); --_lh: var(--ds-lineHeight-label-xs); --_icon: var(--ds-link-icon-size-xs); }
.ds-link--sm { --_fs: var(--ds-fontSize-label-sm); --_lh: var(--ds-lineHeight-label-sm); --_icon: var(--ds-link-icon-size-sm); }
.ds-link--md { --_fs: var(--ds-fontSize-label-md); --_lh: var(--ds-lineHeight-label-md); --_icon: var(--ds-link-icon-size-md); }
.ds-link--lg { --_fs: var(--ds-fontSize-label-lg); --_lh: var(--ds-lineHeight-label-lg); --_icon: var(--ds-link-icon-size-lg); }

.ds-link {
  display:         inline-flex;
  align-items:     center;
  gap:             var(--ds-link-gap);
  font-size:       var(--_fs);
  line-height:     var(--_lh);
  font-weight:     var(--ds-font-weight-regular);
  font-family:     inherit;
  text-decoration: none;
  cursor:          pointer;
  border-radius:   var(--ds-link-border-radius);
  transition:      background 0.12s, opacity 0.12s;
}
.ds-link .ds-link__icon { width: var(--_icon); height: var(--_icon); flex-shrink: 0; }

/* ── Sin href → <button>: quita el aspecto de botón nativo ── */
.ds-link--as-button {
  margin:      0;
  padding:     0;
  border:      0;
  background:  transparent;
  text-align:  inherit;
  appearance:  none;
}

/* ── Subrayado bajo el texto (frame Link de Figma, borde inferior) ── */
.ds-link__text { box-shadow: inset 0 calc(-1 * var(--ds-link-border-bottom-width)) 0 var(--_ul); } /* por dentro: no suma altura, como en Figma */

/* ── Default ── */
.ds-link--default                        { color: var(--ds-link-fg-label-default); }
.ds-link--default .ds-link__text         { --_ul: var(--ds-link-border-bottom-default); }
.ds-link--default .ds-link__icon         { color: var(--ds-link-fg-icon-default); }
.ds-link--default:visited .ds-link__text { --_ul: var(--ds-link-border-bottom-visited); }

/* ── Accent ── */
.ds-link--accent                          { color: var(--ds-link-fg-label-accent); }
.ds-link--accent .ds-link__text           { --_ul: var(--ds-link-border-bottom-accent); }
.ds-link--accent .ds-link__icon           { color: var(--ds-link-fg-icon-accent); }
.ds-link--accent:visited                  { color: var(--ds-link-fg-label-accent-visited); }
.ds-link--accent:visited .ds-link__text   { --_ul: var(--ds-link-border-bottom-visited); }
.ds-link--accent:visited .ds-link__icon   { color: var(--ds-link-fg-icon-visited); }

/* ── Emphasis (Figma Type) ── */
.ds-link--emphasis-medium { font-weight: var(--ds-font-weight-bold); }

/* ── Current (Figma State=Current): página actual ── */
.ds-link[aria-current="page"] { font-weight: var(--ds-font-weight-semibold); }

/* ── Hover ── */
.ds-link:hover { background: var(--ds-link-bg-mix-hover); }

/* ── Pressed ── */
.ds-link:active { opacity: var(--ds-link-opacity-pressed); }

/* ── Focus: anillo doble pegado al enlace (Focus inner −2, Focus outer −4).
   outline transparente: visible solo en colores forzados — audit §F. ── */
.ds-link:focus-visible {
  outline:    var(--ds-link-focus-width) solid transparent;
  box-shadow: 0 0 0 var(--ds-link-focus-width) var(--ds-link-focus-inner),
              0 0 0 calc(2 * var(--ds-link-focus-width)) var(--ds-link-focus-outer);
}
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

/* ─── Link ─────────────────────────────────────────────────────────────────── */

export function Link({
  variant   = 'default',
  size      = 'sm',
  emphasis  = 'low',
  leftIcon  = false,
  rightIcon = true,
  current   = false,   // Figma State=Current: página actual (aria-current="page")
  external  = false,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
  children,
  ...rest
}) {
  // Icono por nombre (true = chevron-right); el tamaño lo pone el CSS (--_icon)
  const iconName = (v) => (v === true ? 'chevron-right' : v);
  const icon = (v) => v ? <Icon name={iconName(v)} size="2xs" className="ds-link__icon" /> : null;

  const resolvedTarget = target ?? (external ? '_blank'              : undefined);
  const resolvedRel    = rel    ?? (external ? 'noopener noreferrer' : undefined);

  const isAnchor = href != null && href !== '';
  const opensNewTab = isAnchor && resolvedTarget === '_blank';

  const classes = [
    'ds-link',
    `ds-link--${size}`,
    `ds-link--${variant}`,
    emphasis === 'medium' ? 'ds-link--emphasis-medium' : '',
    isAnchor ? '' : 'ds-link--as-button',
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon(leftIcon)}
      <span className="ds-link__text">{children}</span>
      {icon(rightIcon)}
      {opensNewTab && <VisuallyHidden>(opens in new tab)</VisuallyHidden>}
    </>
  );

  if (!isAnchor) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel} aria-current={current ? 'page' : undefined} {...rest}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={current ? 'page' : undefined}
      {...rest}
    >
      {content}
    </a>
  );
}

export default Link;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Link href="/ruta">Ver detalle</Link>
<Link href="/ruta" variant="accent">Ver más</Link>
<Link href="/ruta" size="md" emphasis="medium">Título de sección</Link>
<Link href="/ruta" leftIcon rightIcon={false}>Anterior</Link>
<Link href="/ruta" rightIcon={false}>Sin icono</Link>
<Link href="https://..." external>Enlace externo</Link>
<Link onClick={() => setEditing(true)}>Editar</Link>      ← <button> con aspecto de enlace
<Link href="/clientes" current>Clientes</Link>         ← página actual (SemiBold)
*/
