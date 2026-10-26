/**
 * Button — Componente atómico
 * CS Design System · v3.0 (26/10/2026: alineado 1:1 con Figma)
 *
 * Tokens: todos los estilos vienen de tokens.css (--ds-button-*).
 * Iconos: átomo Icon (Lucide). Sin hex ni px sueltos.
 *
 * EJES (igual que el component set `Button` de Figma):
 *   type     → 'accent' (teal, por defecto) | 'default' (negro)
 *   variant  → 'primary' (relleno, por defecto) | 'secondary' (contorno) | 'tertiary' (solo texto)
 *   size     → 'sm' 32 · 'md' 40 (por defecto) · 'lg' 48
 *   fullWidth→ Width=Full
 *   disabled / loading → State=Disabled / State=Loading
 *   Hover, Pressed, Focus… → pseudo-clases CSS
 *
 * Valores antiguos (antes de v3) — siguen funcionando con aviso en desarrollo:
 *   variant="accent"            → type="accent"  variant="primary"
 *   variant="accent" outline    → type="accent"  variant="secondary"
 *   variant="ghost"             → type="accent"  variant="tertiary"
 *   variant="default" [outline] → type="default" variant="primary"|"secondary"
 *   variant="negative"          → type="accent"  variant="secondary" (Figma no
 *                                 tiene botón rojo: lo destructivo va a la
 *                                 izquierda y con un texto claro)
 *   floating, iconOnly          → eliminados (no existen en Figma; para un
 *                                 botón solo icono, IconButton)
 *
 * USO:
 *   <Button iconLeft="search">Search</Button>
 *   <Button type="default" variant="secondary" iconLeft="chevron-left">Back</Button>
 *   <Button variant="tertiary">Cancel</Button>
 */

import React from 'react';
import { Icon } from './Icon';
import { LoadingSpinner } from './LoadingSpinner';
import { VisuallyHidden } from './VisuallyHidden';
import { announce } from './announce';
import { warnOnce, warnPlaceholderLabel } from './_devWarn';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-btn--sm { --_h: var(--ds-button-height-small);  --_px: var(--ds-button-padding-hor-small);  --_fs: var(--ds-fontSize-label-sm); --_lh: var(--ds-lineHeight-label-sm); --_icon: var(--ds-button-icon-size-small); }
.ds-btn--md { --_h: var(--ds-button-height-medium); --_px: var(--ds-button-padding-hor-medium); --_fs: var(--ds-fontSize-label-md); --_lh: var(--ds-lineHeight-label-md); --_icon: var(--ds-button-icon-size-medium); }
.ds-btn--lg { --_h: var(--ds-button-height-large);  --_px: var(--ds-button-padding-hor-large);  --_fs: var(--ds-fontSize-label-lg); --_lh: var(--ds-lineHeight-label-lg); --_icon: var(--ds-button-icon-size-large); }
/* Área de foco (08/10/2026, igual que Figma): el componente reserva 4px
   alrededor para que el anillo de foco quede DENTRO de su caja. En Figma es
   el padding del frame del componente; aquí, margin del <button>. */
.ds-btn {
  margin:          var(--ds-button-focus-area-padding);
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  gap:             0;                 /* Figma: Root sin gap; el label lleva su padding */
  height:          var(--_h);
  padding:         0 var(--_px);
  font-size:       var(--_fs);
  font-weight:     var(--ds-font-weight-bold);
  border-radius:   var(--ds-button-radius);
  border:          var(--ds-button-border-width) solid transparent;
  cursor:          pointer;
  transition:      background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
  white-space:     nowrap;
  font-family:     inherit;
  line-height:     var(--_lh);
  text-decoration: none;
  box-sizing:      border-box;
}
/* Label: padding horizontal propio (button/all/label/paddingHor/generic = 4):
   separa el texto del icono y del borde, igual que el frame Label de Figma. */
.ds-btn__label { padding: 0 var(--ds-button-label-padding-hor); }
.ds-btn--full-width { width: calc(100% - 2 * var(--ds-button-focus-area-padding)); }
/* Foco POR FUERA del botón (08/10/2026, igual que Figma). */
.ds-btn:focus-visible {
  outline:        var(--ds-button-focus-width) solid var(--ds-button-border-focus-outer);
  outline-offset: var(--ds-button-focus-width);
  box-shadow:     0 0 0 var(--ds-button-focus-width) var(--ds-button-border-focus-inner);
}

/* ── Enabled ── */
.ds-btn--accent  { --_fill: var(--ds-button-bg-accent-filled);  --_on: var(--ds-button-fg-accent-filled);  --_mix: var(--ds-button-bg-mix-accent-hover);  --_line: var(--ds-button-border-accent);  --_ink: var(--ds-button-fg-accent-outline); }
.ds-btn--default { --_fill: var(--ds-button-bg-default-filled); --_on: var(--ds-button-fg-default-filled); --_mix: var(--ds-button-bg-mix-default-hover); --_line: var(--ds-button-border-default); --_ink: var(--ds-button-fg-default-outline); }
.ds-btn--primary   { background: var(--_fill);   color: var(--_on);  border-color: var(--_fill); }
.ds-btn--secondary { background: transparent;   color: var(--_ink); border-color: var(--_line); }
.ds-btn--tertiary  { background: transparent;   color: var(--_ink); border-color: transparent; }

/* ── Hover (y Focus Hover): las tres variantes se rellenan — fondo de la
   variante Primary + bgMix encima, texto e icono on-color. Feedback fuerte,
   igual que Figma (CLAUDE.md §4). ── */
.ds-btn:hover:not(:disabled):not(.ds-btn--loading) {
  background: linear-gradient(var(--_mix), var(--_mix)), var(--_fill);
  color:      var(--_on);
}
.ds-btn--primary:hover:not(:disabled):not(.ds-btn--loading),
.ds-btn--tertiary:hover:not(:disabled):not(.ds-btn--loading) { border-color: var(--_fill); }

/* ── Pressed: opacidad (button/all/root/opacity/pressed), sin escalar ── */
.ds-btn:active:not(:disabled):not(.ds-btn--loading) { opacity: var(--ds-button-opacity-pressed); }

/* ── Disabled: sus tokens, nunca opacidad ── */
.ds-btn:disabled { cursor: not-allowed; color: var(--ds-button-fg-disabled); }
.ds-btn--primary:disabled   { background: var(--ds-button-bg-disabled); border-color: var(--ds-button-bg-disabled); }
.ds-btn--secondary:disabled { background: transparent; border-color: var(--ds-button-border-disabled); }
.ds-btn--tertiary:disabled  { background: transparent; border-color: transparent; }

/* Loading: aspecto de Enabled, como en Figma — no es un botón deshabilitado,
   es una acción en curso (aria-disabled, el click no hace nada). */
.ds-btn--loading { cursor: progress; }

/* LoadingSpinner en el sitio del icono izquierdo, mismo tamaño que el icono
   (16/20/24) y color de icono por contraste (currentColor). */
.ds-btn .ds-btn__spinner { width: var(--_icon); height: var(--_icon); }
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── Button ───────────────────────────────────────────────────────────────── */

const LEGACY = { accent: 1, default: 1, ghost: 1, negative: 1 };

/** Traduce la API anterior a v3 (variant accent/default/ghost/negative + outline). */
function resolveAxes(type, variant, outline) {
  if (!LEGACY[variant]) return { type: type || 'accent', variant: variant || 'primary' };
  warnOnce(`Button.legacy.${variant}${outline ? '.outline' : ''}`,
    `[DS Button] variant="${variant}"${outline ? ' outline' : ''} es la API anterior a v3. Usa type="accent"|"default" + variant="primary"|"secondary"|"tertiary".`);
  if (variant === 'ghost')    return { type: 'accent', variant: 'tertiary' };
  if (variant === 'negative') return { type: 'accent', variant: 'secondary' };
  return { type: variant, variant: outline ? 'secondary' : 'primary' };
}

export function Button({
  type,                      // 'accent' (por defecto) | 'default'
  variant,                   // 'primary' (por defecto) | 'secondary' | 'tertiary'
  size      = 'md',          // 'sm' | 'md' | 'lg'
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled  = false,
  loading   = false,
  onClick,
  loadingLabel = 'Loading',  // se lee con el botón en `loading` (inglés por defecto)
  htmlType  = 'button',
  children,
  outline,                   // API anterior a v3 (ver resolveAxes)
  floating,                  // eliminado: no existe en Figma
  iconOnly,                  // eliminado: usa IconButton
  ariaLabel, // eslint-disable-line no-unused-vars -- solo tenía efecto con iconOnly; un aria-label llega por ...rest
  ...rest   // aria-*/data-*/title/handlers de wrappers (Tooltip, PopoverSheet) llegan al <button> real
}) {
  injectStyles();
  const axes = resolveAxes(type, variant, outline);

  if (floating) warnOnce('Button.floating', '[DS Button] `floating` se eliminó en v3 (no existe en Figma).');
  if (iconOnly) warnOnce('Button.iconOnly', '[DS Button] `iconOnly` se eliminó en v3: para un botón solo icono usa IconButton.');

  // Instancia el átomo Icon compartido (nunca reimplementado) — 16/20/24 como
  // Figma button/all/icon/size/*.
  const iconSize = { sm: '2xs', md: 'xs', lg: 'sm' }[size];

  // A11y-3: aviso si el texto sigue siendo el de relleno "Button" de Figma.
  warnPlaceholderLabel('Button', 'children', children);
  // A11y-4: "loading" forma parte del nombre ("Save, Loading") y se anuncia al empezar.
  const wasLoading = React.useRef(loading);
  React.useEffect(() => {
    if (loading && !wasLoading.current) announce(loadingLabel);
    wasLoading.current = loading;
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = loading
    ? (e) => e.preventDefault() // tampoco envía el formulario si es type="submit"
    : onClick;

  const classes = [
    'ds-btn',
    `ds-btn--${size}`,
    `ds-btn--${axes.type}`,
    `ds-btn--${axes.variant}`,
    fullWidth ? 'ds-btn--full-width' : '',
    loading   ? 'ds-btn--loading'    : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      type={htmlType}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={loading && !disabled ? 'true' : undefined}
      aria-busy={loading || undefined}
    >
      {loading  && <LoadingSpinner color="current" label="" className="ds-btn__spinner" />}
      {!loading && iconLeft && <Icon name={iconLeft} size={iconSize} />}
      <span className="ds-btn__label">
        {children}
        {loading && <VisuallyHidden>{`, ${loadingLabel}`}</VisuallyHidden>}
      </span>
      {!loading && iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}

export default Button;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Button iconLeft="search">Search</Button>
<Button iconRight="arrow-right">Accept and continue</Button>
<Button variant="secondary" iconLeft="download">Download</Button>
<Button type="default" variant="secondary" iconLeft="chevron-left">Back</Button>
<Button variant="tertiary">Cancel</Button>
<Button loading>Saving</Button>
<Button disabled>Not available</Button>
*/
