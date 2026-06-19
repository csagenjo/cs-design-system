/**
 * CTALink — Componente atómico
 * CS Design System · v2.0
 *
 * Tokens: --ds-cta-link-* (tokens.css)
 * Sin icono. Talla única. Tres niveles de énfasis + dos variantes.
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos.
 *
 * ÉNFASIS (emphasis):
 *   "low"    → texto + underline (estilo inline) · borderRadius 16px
 *   "medium" → pill con borde · borderRadius 24px
 *   "high"   → pill relleno · borderRadius 80px
 *
 * VARIANTES (variant):
 *   "default" → negro / borde gris oscuro / fondo negro
 *   "accent"  → teal / borde teal / fondo teal
 *
 * ESTADOS:
 *   Initial  → estilos base
 *   Hover    → overlay bgMix rgba(5,5,6,0.1) · low: underline 1.5px
 *   Focus    → doble focus ring (inner blanco + outer negro)
 *   Pressed  → opacity 0.8
 *
 * USO:
 *   <CTALink href="/ruta">Ver detalle</CTALink>
 *   <CTALink href="/ruta" emphasis="high" variant="accent">Empezar</CTALink>
 *   <CTALink href="https://..." external>Enlace externo</CTALink>
 *   <CTALink disabled>No disponible</CTALink>
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-cta-link {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  font-family:     var(--ds-fontFamily-default);
  font-size:       var(--ds-fontSize-label-sm);
  line-height:     var(--ds-fontLheight-2xs);
  font-weight:     var(--ds-fontWeight-regular);
  text-decoration: none;
  cursor:          pointer;
  border:          1px solid transparent;
  box-sizing:      border-box;
  white-space:     nowrap;
  transition:      background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
}

/* Focus — doble anillo (solo en Focus state, no en Hover ni Pressed) */
.ds-cta-link:focus-visible {
  outline:       none;
  border-radius: var(--ds-cta-link-border-radius-focus);
  box-shadow:    0 0 0 2px var(--ds-cta-link-focus-inner),
                 0 0 0 4px var(--ds-cta-link-focus-outer);
}

/* Pressed — opacity token */
.ds-cta-link:active:not([aria-disabled="true"]) {
  opacity: var(--ds-cta-link-opacity-pressed);
}

/* ── Low emphasis ── */
.ds-cta-link--low {
  padding:                   2px 0;
  border-radius:             var(--ds-cta-link-border-radius-low);
  border-color:              transparent;
  text-decoration:           underline;
  text-underline-offset:     3px;
  text-decoration-thickness: 1px;
}
.ds-cta-link--low.ds-cta-link--default {
  color:                 var(--ds-cta-link-fg-default);
  text-decoration-color: var(--ds-cta-link-border-bottom-default);
}
.ds-cta-link--low.ds-cta-link--accent {
  color:                 var(--ds-cta-link-fg-accent);
  text-decoration-color: var(--ds-cta-link-border-bottom-accent);
}
/* Low hover: overlay + underline más grueso */
.ds-cta-link--low:not([aria-disabled="true"]):hover {
  background:                var(--ds-cta-link-bg-mix-hover);
  text-decoration-thickness: 1.5px;
}

/* ── Medium emphasis ── */
.ds-cta-link--medium {
  padding:       var(--ds-cta-link-padding-ver) var(--ds-cta-link-padding-hor);
  border-radius: var(--ds-cta-link-border-radius-medium);
}
.ds-cta-link--medium.ds-cta-link--default {
  color:        var(--ds-cta-link-fg-default);
  border-color: var(--ds-cta-link-border-secondary);
}
.ds-cta-link--medium.ds-cta-link--accent {
  color:        var(--ds-cta-link-fg-accent);
  border-color: var(--ds-cta-link-border-accent-secondary);
}
.ds-cta-link--medium:not([aria-disabled="true"]):hover {
  background: var(--ds-cta-link-bg-mix-hover);
}

/* ── High emphasis ── */
.ds-cta-link--high {
  padding:       var(--ds-cta-link-padding-ver) var(--ds-cta-link-padding-hor);
  border-radius: var(--ds-cta-link-border-radius-high);
}
.ds-cta-link--high.ds-cta-link--default {
  color:        var(--ds-cta-link-fg-primary);
  background:   var(--ds-cta-link-bg-primary);
  border-color: var(--ds-cta-link-bg-primary);
}
.ds-cta-link--high.ds-cta-link--accent {
  color:        var(--ds-cta-link-fg-accent-primary);
  background:   var(--ds-cta-link-bg-accent-primary);
  border-color: var(--ds-cta-link-bg-accent-primary);
}
.ds-cta-link--high.ds-cta-link--default:not([aria-disabled="true"]):hover {
  background: color-mix(in srgb, var(--ds-cta-link-bg-primary), transparent 10%);
}
.ds-cta-link--high.ds-cta-link--accent:not([aria-disabled="true"]):hover {
  background: color-mix(in srgb, var(--ds-cta-link-bg-accent-primary), transparent 10%);
}

/* ── Disabled — debe ir al final para ganar conflictos de misma especificidad ── */
.ds-cta-link[aria-disabled="true"] {
  color:           var(--ds-cta-link-fg-disabled);
  cursor:          not-allowed;
  pointer-events:  none;
  text-decoration: none;
  background:      transparent;
  border-color:    transparent;
  opacity:         0.6;
}

.ds-cta-link .sr-only {
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

  const classes = [
    'ds-cta-link',
    `ds-cta-link--${emphasis}`,
    `ds-cta-link--${variant}`,
  ].join(' ');

  return (
    <a
      href={disabled ? undefined : href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={classes}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled ? 'true' : undefined}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : undefined}
      {...rest}
    >
      {children}
      {external && !disabled && <span className="sr-only">(opens in new tab)</span>}
    </a>
  );
}

export default CTALink;


/* ─── Tokens requeridos en tokens.css ────────────────────────────────────────

--ds-cta-link-fg-default              #050506
--ds-cta-link-fg-primary              #FFFFFF
--ds-cta-link-fg-accent               #286371
--ds-cta-link-fg-accent-primary       #FFFFFF
--ds-cta-link-fg-disabled             (hereda de --ds-fg-disabled)
--ds-cta-link-bg-primary              #050506
--ds-cta-link-bg-accent-primary       #4BA9C0
--ds-cta-link-bg-mix-hover            rgba(5,5,6,0.1)
--ds-cta-link-border-secondary        #2C2F34
--ds-cta-link-border-accent-secondary #286371
--ds-cta-link-border-bottom-default   #2C2F34
--ds-cta-link-border-bottom-accent    #286371
--ds-cta-link-focus-inner             #FFFFFF
--ds-cta-link-focus-outer             #050506
--ds-cta-link-border-radius-low       16px   ← NUEVO (ctaLink/all/root/borderRadius/lowEmphasis)
--ds-cta-link-border-radius-medium    24px   ← NUEVO (ctaLink/all/root/borderRadius/mediumEmphasis)
--ds-cta-link-border-radius-high      80px   ← ya existía como hardcode, ahora es token
--ds-cta-link-border-radius-focus     80px   ← NUEVO (ctaLink/all/root/borderRadius/focus)
--ds-cta-link-opacity-pressed         0.8    ← NUEVO (ctaLink/all/root/opacity/pressed = 80)
--ds-cta-link-padding-ver             6px    (ctaLink/all/root/paddingVer/generic)
--ds-cta-link-padding-hor             12px   (ctaLink/all/root/paddingHor/generic)

*/


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<CTALink href="/ruta">Ver detalle</CTALink>
<CTALink href="/ruta" emphasis="low">Más información</CTALink>
<CTALink href="/ruta" emphasis="high">Registrarse</CTALink>
<CTALink href="/ruta" variant="accent">Ver detalle</CTALink>
<CTALink href="/ruta" emphasis="low" variant="accent">Leer más</CTALink>
<CTALink href="/ruta" emphasis="high" variant="accent">Empezar</CTALink>
<CTALink href="https://..." external>Enlace externo</CTALink>
<CTALink disabled>No disponible</CTALink>
<CTALink onClick={() => alert('click')} emphasis="medium">Acción</CTALink>
*/
