/**
 * Link — Componente atómico
 * CS Design System · v2.0
 *
 * Tokens: --ds-link-* (tokens.css) — alineados con arquitectura link/all/ de Figma
 * Iconos: lucide-react (ChevronRight)
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos.
 *
 * VARIANTES:
 *   "default" → label negro, underline negro, icono negro
 *   "accent"  → label teal, underline teal, icono teal · visited: lavanda
 *
 * TAMAÑOS: xs · sm (default) · md · lg
 *
 * EMPHASIS:
 *   "low"    → fontWeight regular (400)
 *   "medium" → fontWeight bold (700)
 *
 * ESTADOS:
 *   Initial  → estilos base
 *   Hover    → overlay bgMix rgba(5,5,6,0.1)
 *   Focus    → doble focus ring (inner blanco + outer color de foco del sistema, azul)
 *   Active   → opacity 0.8 + SemiBold
 *   Visited  → lavanda (solo variant accent)
 *
 * USO:
 *   <Link href="/ruta">Ver detalle</Link>
 *   <Link href="/ruta" variant="accent" size="md" emphasis="medium">Más info</Link>
 *   <Link href="/ruta" leftIcon rightIcon={false}>Anterior</Link>
 *   <Link href="https://..." external>Enlace externo</Link>
 *   <Link onClick={abrirEdicion}>Editar</Link>   ← sin href: se pinta como <button>
 *
 * SIN `href` → <button type="button"> con el mismo aspecto (A11y-0, 20/10/2026).
 *   Un <a> sin href no recibe foco ni tiene rol: con solo `onClick` el enlace
 *   no se podía usar con teclado ni lo anunciaba el lector (audit §D). Regla
 *   de uso: si lleva a otra página/URL → `href` (es un enlace de verdad); si
 *   ejecuta una acción en la misma vista → solo `onClick` (es un botón con
 *   aspecto de enlace). Arregla de una vez TopNavigation (flydown),
 *   DescriptionList (Edit), PageTitle (nav y breadcrumb) y CellActions.
 *   El aviso "(opens in new tab)" se añade con `external` o con target="_blank".
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { VisuallyHidden } from './VisuallyHidden';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-link--xs { --_fs: var(--ds-fontSize-label-xs); --_lh: var(--ds-lineHeight-label-xs); --_icon: 12; }
.ds-link--sm { --_fs: var(--ds-fontSize-label-sm); --_lh: var(--ds-lineHeight-label-sm); --_icon: 14; }
.ds-link--md { --_fs: var(--ds-fontSize-label-md); --_lh: var(--ds-lineHeight-label-md);  --_icon: 16; }
.ds-link--lg { --_fs: var(--ds-fontSize-label-lg); --_lh: var(--ds-lineHeight-label-lg);  --_icon: 18; }

.ds-link {
  display:         inline-flex;
  align-items:     center;
  gap:             4px;
  font-size:       var(--_fs);
  line-height:     var(--_lh);
  font-weight:     var(--ds-font-weight-regular);
  font-family:     inherit;
  text-decoration: none;
  cursor:          pointer;
  border-radius:   2px;
  transition:      background 0.12s, opacity 0.12s;
}

/* ── Sin href → <button>: quita el aspecto de botón nativo ── */
.ds-link--as-button {
  margin:      0;
  padding:     0;
  border:      0;
  background:  transparent;
  text-align:  inherit;
  appearance:  none;
}

/* ── Underline sobre el texto ── */
.ds-link__text {
  border-bottom: var(--ds-link-border-bottom-width) solid;
}

/* ── Default ── */
.ds-link--default                        { color: var(--ds-link-fg-label-default); }
.ds-link--default .ds-link__text         { border-bottom-color: var(--ds-link-border-bottom-default); }
.ds-link--default .ds-link__icon         { color: var(--ds-link-fg-icon-default); }
.ds-link--default:visited .ds-link__text { border-bottom-color: var(--ds-link-border-bottom-visited); }

/* ── Accent ── */
.ds-link--accent                          { color: var(--ds-link-fg-label-accent); }
.ds-link--accent .ds-link__text           { border-bottom-color: var(--ds-link-border-bottom-accent); }
.ds-link--accent .ds-link__icon           { color: var(--ds-link-fg-icon-accent); }
.ds-link--accent:visited                  { color: var(--ds-link-fg-label-accent-visited); }
.ds-link--accent:visited .ds-link__text   { border-bottom-color: var(--ds-link-border-bottom-visited); }
.ds-link--accent:visited .ds-link__icon   { color: var(--ds-link-fg-icon-visited); }

/* ── Emphasis ── */
.ds-link--emphasis-medium { font-weight: var(--ds-font-weight-bold); }

/* ── Hover ── */
.ds-link:hover { background: var(--ds-link-bg-mix-hover); }

/* ── Focus ── */
.ds-link:focus-visible {
  /* outline transparente: invisible normalmente, visible en colores forzados
     (Windows High Contrast elimina el box-shadow) — audit §F. */
  outline:    var(--ds-border-width-lg) solid transparent;
  box-shadow: 0 0 0 2px var(--ds-link-focus-inner),
              0 0 0 4px var(--ds-link-focus-outer);
}

/* ── Active — opacity + SemiBold ── */
.ds-link:active {
  opacity:     var(--ds-link-opacity-pressed);
  font-weight: var(--ds-font-weight-semibold);
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
  external  = false,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
  children,
  ...rest
}) {
  const iconSize    = { xs: 12, sm: 14, md: 16, lg: 18 }[size];
  const strokeWidth = emphasis === 'medium' ? 2.5 : 1.75;

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
      {leftIcon  && <ChevronRight size={iconSize} strokeWidth={strokeWidth} className="ds-link__icon" aria-hidden="true" />}
      <span className="ds-link__text">{children}</span>
      {rightIcon && <ChevronRight size={iconSize} strokeWidth={strokeWidth} className="ds-link__icon" aria-hidden="true" />}
      {opensNewTab && <VisuallyHidden>(opens in new tab)</VisuallyHidden>}
    </>
  );

  if (!isAnchor) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel} {...rest}>
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
*/
