/**
 * CTALink — Componente atómico
 * CS Design System · v4.0 (26/10/2026: alineado 1:1 con Figma)
 *
 * Tokens: --ds-cta-link-* (tokens.css) ← ctaLink/all/* de Figma.
 * Talla única (Label/lg bold), sin icono.
 *
 * EJES (igual que el component set `CTA link` de Figma):
 *   emphasis → 'low' (texto subrayado) | 'medium' (contorno, por defecto) | 'high' (relleno) — Figma `Type`
 *   variant  → 'default' (negro) | 'accent' (teal)
 *   disabled → State=Disabled: tokens de disabled (texto, fondo, borde), nunca opacidad
 *
 * ESTADOS: Initial · Hover (bgMix encima del fondo; Low además subrayado de
 *   1,5) · Pressed (:active, opacidad) · Focus (anillo doble) · Disabled.
 *
 * Mide igual en los tres énfasis: padding 6/12 + área de foco de 4 px
 *   alrededor (margin, `--ds-cta-link-focus-area-padding`), donde va el
 *   anillo — mismo patrón que Button (el anillo nunca sale del componente).
 *
 * SIN `href` o `disabled` → <button type="button"> con el mismo aspecto
 *   (A11y-0). Un enlace no puede estar deshabilitado: `disabled` pinta un
 *   <button disabled>, que el lector anuncia como no disponible.
 *
 * USO:
 *   <CTALink href="/ruta">Ver detalle</CTALink>
 *   <CTALink href="/ruta" emphasis="high" variant="accent">Empezar</CTALink>
 *   <CTALink href="https://..." external>Enlace externo</CTALink>
 *   <CTALink disabled>No disponible</CTALink>
 */

import React from 'react';
import { VisuallyHidden } from './VisuallyHidden';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-cta-link {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  margin:          var(--ds-cta-link-focus-area-padding);
  /* el borde (transparente salvo en Medium) va por dentro: el padding lo descuenta, como el stroke INSIDE de Figma */
  padding:         calc(var(--ds-cta-link-padding-ver) - var(--ds-cta-link-border-width-medium)) calc(var(--ds-cta-link-padding-hor) - var(--ds-cta-link-border-width-medium));
  font-family:     inherit;
  font-size:       var(--ds-fontSize-label-lg);
  line-height:     var(--ds-lineHeight-label-lg);
  font-weight:     var(--ds-font-weight-bold);
  text-decoration: none;
  cursor:          pointer;
  border:          var(--ds-cta-link-border-width-medium) solid transparent;
  box-sizing:      border-box;
  background:      transparent;
  appearance:      none;
  white-space:     nowrap;
  transition:      background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
}
/* Subrayado por dentro del label (inset): no suma altura, como en Figma */
.ds-cta-link__label { --_ul: transparent; --_ulw: var(--ds-cta-link-border-bottom-width); box-shadow: inset 0 calc(-1 * var(--_ulw)) 0 var(--_ul); }

/* ── Low emphasis: texto subrayado ── */
.ds-cta-link--low { border-radius: var(--ds-cta-link-border-radius-low); }
.ds-cta-link--low.ds-cta-link--default { color: var(--ds-cta-link-fg-default); }
.ds-cta-link--low.ds-cta-link--accent  { color: var(--ds-cta-link-fg-accent); }
.ds-cta-link--low.ds-cta-link--default .ds-cta-link__label { --_ul: var(--ds-cta-link-border-bottom-default); }
.ds-cta-link--low.ds-cta-link--accent  .ds-cta-link__label { --_ul: var(--ds-cta-link-border-bottom-accent); }
.ds-cta-link--low:hover:not(:disabled) .ds-cta-link__label { --_ulw: var(--ds-cta-link-border-bottom-width-hover); }

/* ── Medium emphasis: contorno ── */
.ds-cta-link--medium { border-radius: var(--ds-cta-link-border-radius-medium); }
.ds-cta-link--medium.ds-cta-link--default { color: var(--ds-cta-link-fg-default); border-color: var(--ds-cta-link-border-secondary); }
.ds-cta-link--medium.ds-cta-link--accent  { color: var(--ds-cta-link-fg-accent);  border-color: var(--ds-cta-link-border-accent-secondary); }

/* ── High emphasis: relleno ── */
.ds-cta-link--high { border-radius: var(--ds-cta-link-border-radius-high); }
.ds-cta-link--high.ds-cta-link--default { --_fill: var(--ds-cta-link-bg-primary);        color: var(--ds-cta-link-fg-primary);        background: var(--_fill); }
.ds-cta-link--high.ds-cta-link--accent  { --_fill: var(--ds-cta-link-bg-accent-primary); color: var(--ds-cta-link-fg-accent-primary); background: var(--_fill); }

/* ── Hover: bgMix encima del fondo (Figma: segundo fill del Root) ── */
.ds-cta-link:hover:not(:disabled) {
  background: linear-gradient(var(--ds-cta-link-bg-mix-hover), var(--ds-cta-link-bg-mix-hover)), var(--_fill, transparent);
}

/* ── Pressed ── */
.ds-cta-link:active:not(:disabled) { opacity: var(--ds-cta-link-opacity-pressed); }

/* ── Focus: anillo doble dentro del área de foco (mismo patrón que Button) ── */
.ds-cta-link:focus-visible {
  outline:        var(--ds-cta-link-focus-width) solid var(--ds-cta-link-focus-outer);
  outline-offset: var(--ds-cta-link-focus-width);
  box-shadow:     0 0 0 var(--ds-cta-link-focus-width) var(--ds-cta-link-focus-inner);
}

/* ── Disabled: sus tokens, nunca opacidad ── */
.ds-cta-link:disabled { cursor: not-allowed; color: var(--ds-cta-link-fg-disabled); }
.ds-cta-link--low:disabled .ds-cta-link__label { --_ul: var(--ds-cta-link-border-disabled); }
.ds-cta-link--medium:disabled { border-color: var(--ds-cta-link-border-disabled); }
.ds-cta-link--high:disabled   { --_fill: var(--ds-cta-link-bg-disabled); background: var(--_fill); }
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

/* ─── CTALink ───────────────────────────────────────────────────────────────── */

export function CTALink({
  emphasis  = 'medium',
  variant   = 'default',
  href,
  onClick,
  external  = false,
  disabled  = false,
  ariaLabel,
  children,
  ...rest
}) {
  const resolvedTarget = external ? '_blank'              : undefined;
  const resolvedRel    = external ? 'noopener noreferrer' : undefined;
  const isAnchor = !disabled && href != null && href !== '';

  const classes = [
    'ds-cta-link',
    `ds-cta-link--${emphasis}`,
    `ds-cta-link--${variant}`,
  ].join(' ');

  if (!isAnchor) {
    return (
      <button
        type="button"
        className={classes}
        onClick={disabled ? undefined : onClick}
        disabled={disabled || undefined}
        aria-label={ariaLabel}
        {...rest}
      >
        <span className="ds-cta-link__label">{children}</span>
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
      <span className="ds-cta-link__label">{children}</span>
      {external && <VisuallyHidden>(opens in new tab)</VisuallyHidden>}
    </a>
  );
}

export default CTALink;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<CTALink href="/ruta">Ver detalle</CTALink>
<CTALink href="/ruta" emphasis="low">Más información</CTALink>
<CTALink href="/ruta" emphasis="high">Registrarse</CTALink>
<CTALink href="/ruta" variant="accent">Ver detalle</CTALink>
<CTALink href="/ruta" emphasis="low" variant="accent">Leer más</CTALink>
<CTALink href="/ruta" emphasis="high" variant="accent">Empezar</CTALink>
<CTALink href="https://..." external>Enlace externo</CTALink>
<CTALink disabled>No disponible</CTALink>
<CTALink onClick={() => alert('click')} emphasis="medium">Acción</CTALink>   ← <button>
*/
