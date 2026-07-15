/**
 * Button — Componente atómico
 * CS Design System · v2.0
 *
 * Tokens: todos los estilos vienen de tokens.css (--ds-button-*)
 * Iconos: lucide-react (misma nomenclatura que CS Design System)
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos  .
 *
/**
 * VARIANTES (nomenclatura Figma → prop):
 *   Accent Primary    → variant="accent"
 *   Accent Secondary  → variant="accent" outline
 *   Accent Tertiary   → variant="ghost"
 *   Default Primary   → variant="default"
 *   Default Secondary → variant="default" outline
 *   [extensión CS]    → variant="negative"  (no existe en DS)
 *
 * MODIFICADORES:
 *   outline    → versión con borde y fondo transparente
 *   floating   → añade sombra (barras flotantes)
 *   fullWidth  → 100% del contenedor
 *
 * TAMAÑOS:
 *   "sm" → 32px  "md" → 40px (default)  "lg" → 48px
 *
 * ICONOS (nombres del CS Design System / Lucide):
 *   Search, ChevronRight, ChevronLeft, ChevronUp, ChevronDown
 *   ArrowRight, ArrowLeft, ArrowUp, ArrowDown
 *   Copy, Save, Delete, Edit2, Filter, Download
 *   Percent, Coins, Wallet, CreditCard
 *   Check, X, Plus, Upload
 *
 * USO:
 *   <Button variant="accent" iconLeft="Search">Buscar</Button>
 *   <Button variant="default" outline iconLeft="ChevronLeft">Anterior</Button>
 *   <Button variant="negative" iconLeft="Delete">Eliminar</Button>
 *   <Button variant="ghost">Cancelar</Button>
 */

import React from 'react';
import {
  Search, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Copy, Save, Trash2 as Delete, Edit2, Filter, Download,
  Percent, Coins, Wallet, CreditCard,
  Check, X, Plus, Upload, Eye, MoreHorizontal,
} from 'lucide-react';

/* ─── Mapa de iconos ───────────────────────────────────────────────────────── */

const ICONS = {
  // Navegación
  'ChevronRight': ChevronRight, 'chevron-right': ChevronRight,
  'ChevronLeft':  ChevronLeft,  'chevron-left':  ChevronLeft,
  'ChevronUp':    ChevronUp,    'chevron-up':    ChevronUp,
  'ChevronDown':  ChevronDown,  'chevron-down':  ChevronDown,
  'ArrowRight':   ArrowRight,   'arrow-right':   ArrowRight,
  'ArrowLeft':    ArrowLeft,    'arrow-left':    ArrowLeft,
  'ArrowUp':      ArrowUp,      'arrow-up':      ArrowUp,
  'ArrowDown':    ArrowDown,    'arrow-down':    ArrowDown,
  // Acciones
  'Search':   Search,   'search':   Search,
  'Copy':     Copy,     'copy':     Copy,
  'Save':     Save,     'save':     Save,
  'Delete':   Delete,   'delete':   Delete,   'trash': Delete,
  'Edit2':    Edit2,    'edit2':    Edit2,    'edit':  Edit2,
  'Filter':   Filter,   'filter':   Filter,
  'Download': Download, 'download': Download,
  'Upload':   Upload,   'upload':   Upload,
  'Plus':     Plus,     'plus':     Plus,
  'Check':    Check,    'check':    Check,
  'X':        X,        'x':        X,
  // Finanzas
  'Percent':    Percent,    'percent':    Percent,
  'Coins':      Coins,      'coins':      Coins,
  'Wallet':     Wallet,     'wallet':     Wallet,
  'CreditCard': CreditCard, 'credit-card': CreditCard,
  // Misc
  'Eye':           Eye,           'eye':  Eye,
  'MoreHorizontal': MoreHorizontal, 'more': MoreHorizontal,
};

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-btn--sm { --_h: 32px; --_px: var(--ds-button-px-sm); --_py: var(--ds-button-py-sm); --_fs: var(--ds-fontSize-label-xs); --_icon: var(--ds-button-icon-size-small);  --_gap: 4px; }
.ds-btn--md { --_h: 40px; --_px: var(--ds-button-px-md); --_py: var(--ds-button-py-md); --_fs: var(--ds-fontSize-label-sm); --_icon: var(--ds-button-icon-size-medium); --_gap: 6px; }
.ds-btn--lg { --_h: 48px; --_px: var(--ds-button-px-lg); --_py: var(--ds-button-py-lg); --_fs: var(--ds-fontSize-label-md); --_icon: var(--ds-button-icon-size-large);  --_gap: 8px; }

.ds-btn {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  gap:             var(--_gap);
  height:          var(--_h);
  padding:         var(--_py) var(--_px);
  font-size:       var(--_fs);
  font-weight:     var(--ds-font-weight-medium);
  border-radius:   var(--ds-button-radius);
  border:          var(--ds-button-border-width) solid transparent;
  cursor:          pointer;
  transition:      background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
  white-space:     nowrap;
  font-family:     inherit;
  line-height:     1;
  text-decoration: none;
  box-sizing:      border-box;
}
.ds-btn--full-width { width: 100%; }
.ds-btn:focus-visible {
  outline:        var(--ds-button-border-width) solid var(--ds-button-border-focus-outer);
  outline-offset: 2px;
}
.ds-btn:active:not(:disabled) { opacity: 0.8; transform: scale(0.98); }
.ds-btn:disabled,
.ds-btn--disabled {
  opacity:        0.4;
  cursor:         not-allowed;
  pointer-events: none;
}
.ds-btn--icon-only { padding: 0; width: var(--_h); }

/* Accent filled */
.ds-btn--accent {
  background:   var(--ds-button-bg-accent-filled);
  color:        var(--ds-button-fg-accent-filled);
  border-color: var(--ds-button-bg-accent-filled);
}
.ds-btn--accent:hover:not(:disabled) {
  background:   color-mix(in srgb, var(--ds-button-bg-accent-filled), black 8%);
  border-color: color-mix(in srgb, var(--ds-button-bg-accent-filled), black 8%);
}
/* Accent outline */
.ds-btn--accent.ds-btn--outline {
  background:   transparent;
  color:        var(--ds-button-fg-accent-outline);
  border-color: var(--ds-button-border-accent);
}
.ds-btn--accent.ds-btn--outline:hover:not(:disabled) {
  background: var(--ds-button-bg-mix-hover);
}

/* Default filled */
.ds-btn--default {
  background:   var(--ds-button-bg-default-filled);
  color:        var(--ds-button-fg-default-filled);
  border-color: var(--ds-button-bg-default-filled);
}
.ds-btn--default:hover:not(:disabled) {
  background:   color-mix(in srgb, var(--ds-button-bg-default-filled), white 8%);
  border-color: color-mix(in srgb, var(--ds-button-bg-default-filled), white 8%);
}
/* Default outline */
.ds-btn--default.ds-btn--outline {
  background:   transparent;
  color:        var(--ds-button-fg-default-outline);
  border-color: var(--ds-button-border-default);
}
.ds-btn--default.ds-btn--outline:hover:not(:disabled) {
  background: var(--ds-button-bg-mix-hover);
}

/* Ghost */
.ds-btn--ghost {
  background:   transparent;
  color:        var(--ds-button-fg-accent-outline);
  border-color: transparent;
}
.ds-btn--ghost:hover:not(:disabled) { background: var(--ds-button-bg-mix-hover); }

/* Negative */
.ds-btn--negative {
  background:   transparent;
  color:        var(--ds-button-fg-negative);
  border-color: var(--ds-button-border-negative);
}
.ds-btn--negative:hover:not(:disabled) { background: var(--ds-button-bg-negative-hover); }

/* Floating */
.ds-btn--floating { box-shadow: var(--ds-shadow-md); }
.ds-btn--floating:hover:not(:disabled) { box-shadow: var(--ds-shadow-lg); }

/* Spinner */
.ds-btn__spinner {
  width:         var(--_icon);
  height:        var(--_icon);
  border:        2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation:     ds-spin 0.7s linear infinite;
  flex-shrink:   0;
}
@keyframes ds-spin { to { transform: rotate(360deg); } }
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── Componente Icon ──────────────────────────────────────────────────────── */

function Icon({ name, size }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) return null;
  return <IconComponent size={parseInt(size)} strokeWidth={1.75} aria-hidden="true" />;
}

/* ─── Button ───────────────────────────────────────────────────────────────── */

export function Button({
  variant   = 'accent',
  size      = 'md',
  outline   = false,
  iconLeft,
  iconRight,
  iconOnly  = false,
  floating  = false,
  fullWidth = false,
  disabled  = false,
  loading   = false,
  onClick,
  ariaLabel,
  htmlType  = 'button',
  children,
}) {
  injectStyles();

  // Tamaño intrínseco del SVG; el tamaño visual final lo fija --_icon (CSS) vía
  // --ds-button-icon-size-*. Alineado con Figma button/all/icon/size (16/20/24).
  const iconSize   = { sm: '16', md: '20', lg: '24' }[size];
  const isDisabled = disabled || loading;

  const classes = [
    'ds-btn',
    `ds-btn--${size}`,
    `ds-btn--${variant}`,
    outline    ? 'ds-btn--outline'    : '',
    iconOnly   ? 'ds-btn--icon-only'  : '',
    floating   ? 'ds-btn--floating'   : '',
    fullWidth  ? 'ds-btn--full-width' : '',
    isDisabled ? 'ds-btn--disabled'   : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={htmlType}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={iconOnly ? ariaLabel : undefined}
      aria-busy={loading}
    >
      {loading  && <span className="ds-btn__spinner" />}
      {!loading && iconLeft  && <Icon name={iconLeft}  size={iconSize} />}
      {!iconOnly && children}
      {!loading && iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}

export default Button;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Button variant="accent" iconLeft="Search">Buscar</Button>
<Button variant="accent" iconRight="ArrowRight">Aceptar y continuar</Button>
<Button variant="accent" outline iconLeft="Download">Descargar</Button>
<Button variant="default" outline iconLeft="ChevronLeft">Anterior</Button>
<Button variant="ghost">Cancelar</Button>
<Button variant="negative" iconLeft="Delete">Eliminar</Button>
<Button variant="accent" iconLeft="Save" floating>Guardar</Button>
<Button variant="accent" iconOnly ariaLabel="Filtrar"><Filter /></Button>
<Button variant="accent" loading>Guardando...</Button>
<Button variant="accent" disabled>No disponible</Button>
*/
