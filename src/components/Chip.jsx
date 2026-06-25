/**
 * Chip — Componente atómico
 * CS Design System · v1.0
 *
 * Tokens: todos los estilos vienen de tokens.css (--ds-chip-*)
 * Iconos: lucide-react — X (remove/clear) + cualquier Lucide para iconLeft
 *
 * VARIANTES (prop type):
 *   "choice" — toggle button, iconLeft opcional
 *   "filter" — toggle + botón X de dismiss (si se pasa onRemove)
 *   "input"  — campo de texto estilizado como chip, botón X de clear opcional
 *
 * ESTADOS:
 *   selected/defaultSelected — controlado/no controlado (choice/filter)
 *   disabled                 — no interactivo
 *
 * USO:
 *   <Chip type="choice" label="Activos" />
 *   <Chip type="filter" label="Pendiente" selected={v} onSelectedChange={fn} onRemove={fn} />
 *   <Chip type="input"  placeholder="Etiqueta" value={v} onChange={fn} onRemove={fn} />
 */

import React, { useRef, useId, forwardRef, useState } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `

/* ── Shared toggle button (choice + filter-toggle) ── */
.ds-chip__toggle {
  display:        inline-flex;
  align-items:    center;
  gap:            var(--ds-chip-root-gap-generic);
  padding:        var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  background:     var(--ds-chip-root-bg-generic);
  border:         var(--ds-chip-root-border-width-generic) solid var(--ds-chip-root-border-color-generic);
  border-radius:  var(--ds-chip-root-border-radius-generic);
  color:          var(--ds-chip-label-fg-generic);
  cursor:         pointer;
  font-size:      14px;
  font-weight:    500;
  font-family:    inherit;
  white-space:    nowrap;
  position:       relative;
  overflow:       hidden;
  transition:     background 0.12s, border-color 0.12s, color 0.12s;
  box-sizing:     border-box;
  -webkit-tap-highlight-color: transparent;
}

/* bgMix overlay */
.ds-chip__toggle::before {
  content:        '';
  position:       absolute;
  inset:          0;
  background:     transparent;
  pointer-events: none;
  transition:     background 0.12s;
}

.ds-chip__toggle:not(:disabled):hover::before {
  background: var(--ds-chip-root-bgmix-hover);
}

/* selected */
.ds-chip__toggle[aria-pressed="true"] {
  background:   var(--ds-chip-root-bg-selected);
  border-color: var(--ds-chip-root-bg-selected);
  color:        var(--ds-chip-label-fg-selected);
}
.ds-chip__toggle[aria-pressed="true"]:not(:disabled):hover::before {
  background: var(--ds-chip-root-bgmix-hover-selected);
}
.ds-chip__toggle[aria-pressed="true"] .ds-chip__icon {
  color: var(--ds-chip-icon-fg-selected);
}

/* pressed */
.ds-chip__toggle:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}

/* disabled */
.ds-chip__toggle:disabled {
  background:   var(--ds-chip-root-bg-disabled);
  border-color: var(--ds-chip-root-border-color-generic);
  color:        var(--ds-chip-label-fg-disabled);
  cursor:       not-allowed;
}
.ds-chip__toggle:disabled .ds-chip__icon {
  color: var(--ds-chip-icon-fg-disabled);
}

/* focus ring */
.ds-chip__toggle:focus-visible {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: 2px;
  box-shadow:     0 0 0 4px var(--ds-chip-root-border-color-focus-inner);
}

/* icon */
.ds-chip__icon {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  color:       var(--ds-chip-icon-fg-generic);
}

/* ── Filter chip wrapper ── */
.ds-chip--filter {
  display:       inline-flex;
  align-items:   stretch;
  border:        var(--ds-chip-root-border-width-generic) solid var(--ds-chip-root-border-color-generic);
  border-radius: var(--ds-chip-root-border-radius-generic);
  background:    var(--ds-chip-root-bg-generic);
  overflow:      hidden;
  box-sizing:    border-box;
  transition:    background 0.12s, border-color 0.12s;
}

.ds-chip--filter.ds-chip--selected {
  background:   var(--ds-chip-root-bg-selected);
  border-color: var(--ds-chip-root-bg-selected);
}

.ds-chip--filter.ds-chip--disabled {
  background:   var(--ds-chip-root-bg-disabled);
  border-color: var(--ds-chip-root-border-color-generic);
}

/* filter inner toggle (no border/bg — wrapper handles them) */
.ds-chip__filter-toggle {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-chip-root-gap-generic);
  padding:     var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  background:  transparent;
  border:      0;
  color:       var(--ds-chip-label-fg-generic);
  cursor:      pointer;
  font-size:   14px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  position:    relative;
  overflow:    hidden;
  transition:  color 0.12s;
  box-sizing:  border-box;
}

.ds-chip--filter.ds-chip--selected .ds-chip__filter-toggle {
  color: var(--ds-chip-label-fg-selected);
}

.ds-chip--filter.ds-chip--disabled .ds-chip__filter-toggle {
  color:  var(--ds-chip-label-fg-disabled);
  cursor: not-allowed;
}

.ds-chip__filter-toggle::before {
  content:        '';
  position:       absolute;
  inset:          0;
  background:     transparent;
  pointer-events: none;
  transition:     background 0.12s;
}

.ds-chip--filter:not(.ds-chip--disabled) .ds-chip__filter-toggle:hover::before {
  background: var(--ds-chip-root-bgmix-hover);
}

.ds-chip--filter.ds-chip--selected:not(.ds-chip--disabled) .ds-chip__filter-toggle:hover::before {
  background: var(--ds-chip-root-bgmix-hover-selected);
}

.ds-chip__filter-toggle:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}

.ds-chip__filter-toggle:focus-visible {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: -3px;
  box-shadow:     inset 0 0 0 2px var(--ds-chip-root-border-color-focus-inner);
}

/* filter remove button */
.ds-chip__remove {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  padding:         var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  padding-left:    0;
  background:      transparent;
  border:          0;
  color:           var(--ds-chip-icon-fg-generic);
  cursor:          pointer;
  font-family:     inherit;
  transition:      color 0.12s, opacity 0.12s;
  box-sizing:      border-box;
}

.ds-chip--filter.ds-chip--selected .ds-chip__remove {
  color: var(--ds-chip-icon-fg-selected);
}

.ds-chip--filter.ds-chip--disabled .ds-chip__remove {
  color:  var(--ds-chip-icon-fg-disabled);
  cursor: not-allowed;
}

.ds-chip__remove:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}

.ds-chip__remove:focus-visible {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: -3px;
  box-shadow:     inset 0 0 0 2px var(--ds-chip-root-border-color-focus-inner);
}

/* ── Input chip ── */
.ds-chip--input {
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-chip-root-gap-generic);
  padding:       var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  border:        var(--ds-chip-root-border-width-generic) solid var(--ds-chip-root-border-color-generic);
  border-radius: var(--ds-chip-root-border-radius-generic);
  background:    var(--ds-chip-root-bg-generic);
  transition:    border-color 0.12s, outline 0.12s;
  box-sizing:    border-box;
}

.ds-chip--input:focus-within {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: 2px;
  box-shadow:     0 0 0 4px var(--ds-chip-root-border-color-focus-inner);
}

.ds-chip--input.ds-chip--disabled {
  background:   var(--ds-chip-root-bg-disabled);
  border-color: var(--ds-chip-root-border-color-generic);
}

.ds-chip__text-input {
  border:      0;
  background:  transparent;
  color:       var(--ds-chip-label-fg-generic);
  font-size:   14px;
  font-weight: 500;
  font-family: inherit;
  outline:     none;
  padding:     0 var(--ds-chip-input-valuetext-padding-hor);
  caret-color: var(--ds-chip-input-caret-border-color);
  min-width:   4ch;
}

.ds-chip__text-input::placeholder {
  color:       var(--ds-chip-label-fg-disabled);
  font-weight: 400;
}

.ds-chip__text-input:disabled {
  cursor: not-allowed;
  color:  var(--ds-chip-label-fg-disabled);
}

/* input chip label */
.ds-chip__input-label {
  font-size:   14px;
  font-weight: 500;
  color:       var(--ds-chip-label-fg-generic);
  user-select: none;
}

/* input chip clear button */
.ds-chip__clear {
  display:     inline-flex;
  align-items: center;
  background:  transparent;
  border:      0;
  color:       var(--ds-chip-icon-fg-generic);
  cursor:      pointer;
  padding:     0;
  flex-shrink: 0;
  font-family: inherit;
  transition:  color 0.12s, opacity 0.12s;
}

.ds-chip__clear:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}

.ds-chip__clear:focus-visible {
  outline:       var(--ds-chip-input-icon-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  border-radius: 2px;
}

.ds-chip--disabled .ds-chip__clear {
  color:  var(--ds-chip-icon-fg-disabled);
  cursor: not-allowed;
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

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function mergeRefs(...refs) {
  return (el) => refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });
}

function resolveIcon(name) {
  if (!name) return null;
  return LucideIcons[name] || null;
}

/* ─── Chip ──────────────────────────────────────────────────────────────────── */

export const Chip = forwardRef(function Chip({
  type             = 'choice',
  label,
  selected,
  defaultSelected  = false,
  onSelectedChange,
  disabled         = false,
  iconLeft,
  onRemove,
  // input-specific
  value,
  defaultValue,
  onChange,
  placeholder,
  onFocus,
  onBlur,
  // common
  id,
  name,
  ariaLabel,
}, forwardedRef) {

  const inputRef    = useRef(null);
  const generatedId = useId();
  const chipId      = id || generatedId;

  const isControlled = selected !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultSelected);
  const isSelected = isControlled ? selected : uncontrolled;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS Chip] Necesita `label` o `ariaLabel` para ser accesible.', { id: chipId });
  }

  function handleToggle() {
    if (disabled) return;
    if (!isControlled) setUncontrolled((s) => !s);
    onSelectedChange?.(!isSelected);
  }

  const IconLeft = resolveIcon(iconLeft);

  /* ── Choice ── */
  if (type === 'choice') {
    return (
      <button
        ref={forwardedRef}
        type="button"
        id={chipId}
        name={name}
        aria-pressed={isSelected}
        aria-label={!label ? ariaLabel : undefined}
        disabled={disabled}
        className="ds-chip__toggle"
        onClick={handleToggle}
      >
        {IconLeft && (
          <span className="ds-chip__icon" aria-hidden="true">
            <IconLeft size={20} strokeWidth={2} />
          </span>
        )}
        {label && <span>{label}</span>}
      </button>
    );
  }

  /* ── Filter ── */
  if (type === 'filter') {
    const wrapClass = [
      'ds-chip--filter',
      isSelected ? 'ds-chip--selected' : '',
      disabled   ? 'ds-chip--disabled' : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapClass} role="group" aria-label={ariaLabel || label}>
        <button
          ref={forwardedRef}
          type="button"
          id={chipId}
          aria-pressed={isSelected}
          disabled={disabled}
          className="ds-chip__filter-toggle"
          onClick={handleToggle}
        >
          {label && <span>{label}</span>}
        </button>
        {onRemove && (
          <button
            type="button"
            className="ds-chip__remove"
            aria-label={`Eliminar ${label || ''}`}
            disabled={disabled}
            onClick={onRemove}
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  /* ── Input ── */
  if (type === 'input') {
    const wrapClass = [
      'ds-chip--input',
      disabled ? 'ds-chip--disabled' : '',
    ].filter(Boolean).join(' ');

    const inputProps = {
      ref:        mergeRefs(inputRef, forwardedRef),
      id:         chipId,
      name,
      placeholder,
      disabled,
      className:  'ds-chip__text-input',
      onFocus,
      onBlur,
      'aria-label': !label ? ariaLabel : undefined,
    };

    if (value !== undefined) {
      inputProps.value    = value;
      inputProps.onChange = onChange;
    } else {
      if (defaultValue !== undefined) inputProps.defaultValue = defaultValue;
      if (onChange) inputProps.onChange = onChange;
    }

    return (
      <div className={wrapClass}>
        {label && <span className="ds-chip__input-label">{label}</span>}
        <input type="text" {...inputProps} />
        {onRemove && (
          <button
            type="button"
            className="ds-chip__clear"
            aria-label="Borrar"
            disabled={disabled}
            onClick={onRemove}
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return null;
});

Chip.displayName = 'Chip';
export default Chip;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

// Choice — no controlado
<Chip type="choice" label="Activos" />

// Choice — controlado con icono
<Chip type="choice" label="Favoritos" iconLeft="Star" selected={v} onSelectedChange={fn} />

// Choice — deshabilitado
<Chip type="choice" label="No disponible" disabled />

// Filter — solo toggle (sin X)
<Chip type="filter" label="Pendiente" selected={v} onSelectedChange={fn} />

// Filter — toggle + dismiss
<Chip type="filter" label="Pendiente" selected={v} onSelectedChange={fn} onRemove={() => removeFilter('pendiente')} />

// Filter — disabled
<Chip type="filter" label="Archivado" disabled />

// Input — no controlado
<Chip type="input" placeholder="Añadir etiqueta" onRemove={() => removeTag(i)} />

// Input — controlado
<Chip type="input" value={v} onChange={e => setV(e.target.value)} onRemove={() => removeTag(i)} />

// Input — con label visible
<Chip type="input" label="EUR" placeholder="0.00" value={v} onChange={fn} />
*/
