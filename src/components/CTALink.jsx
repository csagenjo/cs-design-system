/**
 * CTALink — Componente atómico
 * CS Design System · v1.0
 *
 * Tokens: --ds-cta-link-* (tokens.css)
 * Sin icono. Talla única. Tres niveles de énfasis + dos variantes.
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos.
 *
 * ÉNFASIS (emphasis):
 *   "low"    → texto + underline (estilo inline)
 *   "medium" → pill con borde (default)
 *   "high"   → pill relleno
 *
 * VARIANTES (variant):
 *   "default" → negro / borde gris oscuro / fondo negro
 *   "accent"  → teal / borde teal / fondo teal
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
  border-radius:   80px;
  border:          1px solid transparent;
  box-sizing:      border-box;
  white-space:     nowrap;
  transition:      background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
}

.ds-cta-link:focus-visible {
  outline:    none;
  box-shadow: 0 0 0 2px var(--ds-cta-link-focus-inner),
              0 0 0 4px var(--ds-cta-link-focus-outer);
}

.ds-cta-link:active:not([aria-disabled="true"]) { opacity: 0.8; }

/* ── Low emphasis ── */
.ds-cta-link--low {
  padding:                   2px 0;
  border-radius:             2px;
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
.ds-cta-link--low:not([aria-disabled="true"]):hover {
  background: var(--ds-cta-link-bg-mix-hover);
}

/* ── Medium emphasis ── */
.ds-cta-link--medium { padding: 6px 12px; }
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
.ds-cta-link--high { padding: 6px 12px; }
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
  background: var(--ds-cta-link-bg-mix-hover), var(--ds-cta-link-bg-primary);
}
.ds-cta-link--high.ds-cta-link--accent:not([aria-disabled="true"]):hover {
  background: var(--ds-cta-link-bg-mix-hover), var(--ds-cta-link-bg-accent-primary);
}

/* ── Disabled — must come last to win same-specificity conflicts ── */
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
