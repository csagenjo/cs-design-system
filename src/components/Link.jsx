/**
 * Link — Componente atómico
 * CS Design System · v1.0
 *
 * Tokens: --ds-fg-* · --ds-fontSize-* · --ds-fontLheight-* · --ds-fontWeight-*
 * Icono:  ArrowUpRight (lucide-react) — escala con tamaño, strokeWidth con énfasis
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos.
 *
 * VARIANTES (variant):
 *   "default"  → --ds-fg-default  (#050506)
 *   "accent"   → --ds-fg-secondary (#B71B60)
 *
 * TAMAÑOS (size):
 *   "xs" → 12px   "sm" → 14px (default)   "md" → 16px   "lg" → 19px
 *
 * ÉNFASIS (emphasis):
 *   "low"    → font-weight 400, strokeWidth 1.75  (default)
 *   "medium" → font-weight 700, strokeWidth 2.5
 *
 * ESTADOS (CSS automático):
 *   :hover   → underline secondary-500 + bg overlay var(--ds-button-hover-mix-accent)
 *   :focus   → underline secondary-500 + doble anillo (#050506 / white)
 *   :active  → underline secondary-500 + opacity 0.8
 *   :visited → Default: sin cambio · Accent: color terciario (lavender)
 *
 * USO:
 *   <Link href="/ruta">Ver detalle</Link>
 *   <Link href="/ruta" variant="accent" emphasis="medium">Más información</Link>
 *   <Link href="https://..." external>Enlace externo</Link>
 *   <Link href="/ruta" size="lg" rightIcon={false}>Sin icono</Link>
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-link--xs { --_fs: var(--ds-fontSize-label-xs); --_lh: var(--ds-fontLheight-3xs); --_icon: 12; }
.ds-link--sm { --_fs: var(--ds-fontSize-label-sm); --_lh: var(--ds-fontLheight-2xs); --_icon: 14; }
.ds-link--md { --_fs: var(--ds-fontSize-label-md); --_lh: var(--ds-fontLheight-xs);  --_icon: 16; }
.ds-link--lg { --_fs: var(--ds-fontSize-label-lg); --_lh: var(--ds-fontLheight-sm);  --_icon: 18; }

.ds-link {
  display:         inline-flex;
  align-items:     center;
  gap:             4px;
  font-size:       var(--_fs);
  line-height:     var(--_lh);
  font-weight:     var(--ds-fontWeight-regular);
  font-family:     var(--ds-fontFamily-default);
  text-decoration: none;
  cursor:          pointer;
  border-radius:   2px;
  transition:      background 0.12s, opacity 0.12s, color 0.12s;
}

/* Text wrapper — carries the border-bottom underline */
.ds-link__text { border-bottom: 1px solid; }

/* ── Default variant ── */
.ds-link--default                        { color: var(--ds-fg-default); }
.ds-link--default .ds-link__text         { border-bottom-color: var(--ds-link-border-default); }
.ds-link--default:visited .ds-link__text { border-bottom-color: var(--ds-link-border-visited); }

/* ── Accent variant ── */
.ds-link--accent                        { color: var(--ds-fg-secondary); }
.ds-link--accent .ds-link__text         { border-bottom-color: var(--ds-link-border-accent-initial); }
.ds-link--accent:visited                { color: var(--ds-fg-tertiary); }
.ds-link--accent:visited .ds-link__text { border-bottom-color: var(--ds-link-border-visited); }

/* ── Icon color ── */
.ds-link--default .ds-link__icon { color: var(--ds-link-icon-default); }
.ds-link--accent  .ds-link__icon { color: var(--ds-link-icon-accent); }

/* ── Medium emphasis ── */
.ds-link--emphasis-medium { font-weight: var(--ds-fontWeight-bold); }

/* ── Hover — underline + background overlay ── */
.ds-link:hover                { background: var(--ds-link-bg-hover); }
.ds-link:hover .ds-link__text { border-bottom-color: var(--ds-link-border-hover); }

/* ── Focus — underline + double ring ── */
.ds-link:focus-visible {
  outline:    none;
  box-shadow: 0 0 0 2px var(--ds-link-focus-inner), 0 0 0 4px var(--ds-link-focus-outer);
}
.ds-link:focus-visible .ds-link__text { border-bottom-color: var(--ds-link-border-hover); }

/* ── Pressed — underline + opacity ── */
.ds-link:active                { opacity: 0.8; }
.ds-link:active .ds-link__text { border-bottom-color: var(--ds-link-border-hover); }

/* ── Screen-reader only (external link announcement) ── */
.ds-link .sr-only {
  position:    absolute;
  width:       1px;
  height:      1px;
  padding:     0;
  margin:      -1px;
  overflow:    hidden;
  clip:        rect(0,0,0,0);
  white-space: nowrap;
  border:      0;
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

  const classes = [
    'ds-link',
    `ds-link--${size}`,
    `ds-link--${variant}`,
    emphasis === 'medium' ? 'ds-link--emphasis-medium' : '',
  ].filter(Boolean).join(' ');

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
      {leftIcon  && <ArrowUpRight size={iconSize} strokeWidth={strokeWidth} className="ds-link__icon" aria-hidden="true" />}
      <span className="ds-link__text">{children}</span>
      {rightIcon && <ArrowUpRight size={iconSize} strokeWidth={strokeWidth} className="ds-link__icon" aria-hidden="true" />}
      {external  && <span className="sr-only">(opens in new tab)</span>}
    </a>
  );
}

export default Link;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Link href="/detalle">Ver detalle</Link>
<Link href="/detalle" variant="accent">Ver detalle</Link>
<Link href="/detalle" emphasis="medium">Ver detalle</Link>
<Link href="/detalle" variant="accent" emphasis="medium">Más información</Link>
<Link href="/detalle" size="lg">Enlace grande</Link>
<Link href="/detalle" size="xs" rightIcon={false}>Sin icono</Link>
<Link href="/detalle" leftIcon rightIcon={false}>Icono izquierda</Link>
<Link href="https://ejemplo.com" external>Enlace externo</Link>
<Link href="/detalle" ariaLabel="Ver detalle del producto" rightIcon={false} />
*/
