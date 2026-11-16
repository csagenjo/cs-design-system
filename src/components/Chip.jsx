import React, { forwardRef, useId, useState } from 'react';
import { Icon } from './Icon';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
/* v2 (26/10/2026, alineado con Figma): área de foco de 4 px alrededor del chip
   (margin, chip/all/padding/focusArea/generic) y anillo doble por fuera del chip
   y dentro de esa área — mismo patrón que Button. Label/md regular. */

.ds-chip-toggle,
.ds-chip-dismissible,
.ds-chip-input {
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-chip-gap-generic);
  padding:       var(--ds-chip-padding-ver-generic) var(--ds-chip-padding-hor-generic);
  margin:        var(--ds-chip-padding-focus-area-generic);
  background:    var(--ds-chip-bg-generic);
  border:        none;
  border-radius: var(--ds-chip-border-radius-generic);
  color:         var(--ds-chip-fg-label-generic);
  font-family:   inherit;
  font-size:     var(--ds-chip-font-size-label);
  font-weight:   var(--ds-font-weight-regular);
  line-height:   var(--ds-chip-line-height-label);
  white-space:   nowrap;
  position:      relative;
  box-sizing:    border-box;
  -webkit-tap-highlight-color: transparent;
}

/* bgMix de hover encima del fondo */
.ds-chip-toggle::before,
.ds-chip-dismissible::before,
.ds-chip-input::before {
  content:        '';
  position:       absolute;
  inset:          0;
  border-radius:  inherit;
  background:     transparent;
  pointer-events: none;
}

/* Anillo de foco (doble, por fuera del chip) */
.ds-chip-toggle:focus-visible,
.ds-chip-dismissible:has(.ds-chip-dismissible__remove:focus-visible),
.ds-chip-input:has(.ds-chip-input__body:focus-visible) {
  outline:        var(--ds-chip-border-width-focus) solid var(--ds-chip-border-color-focus-outer);
  outline-offset: var(--ds-chip-border-width-focus);
  box-shadow:     0 0 0 var(--ds-chip-border-width-focus) var(--ds-chip-border-color-focus-inner);
}

/* ── ChipToggle — Choice + Filter Selectable ── */

.ds-chip-toggle { cursor: pointer; }
.ds-chip-toggle:not(:disabled):hover::before { background: var(--ds-chip-bg-mix-hover); }
.ds-chip-toggle[aria-pressed="true"] {
  background: var(--ds-chip-bg-selected);
  color:      var(--ds-chip-fg-label-selected);
}
.ds-chip-toggle[aria-pressed="true"]:not(:disabled):hover::before { background: var(--ds-chip-bg-mix-hover-selected); }
.ds-chip-toggle:not(:disabled):active { opacity: var(--ds-chip-opacity-pressed); }
.ds-chip-toggle:disabled {
  background: var(--ds-chip-bg-disabled);
  color:      var(--ds-chip-fg-label-disabled);
  cursor:     not-allowed;
}
/* Filter Selectable: el texto lleva el padding de Value Text (Choice no) */
.ds-chip-toggle--filter .ds-chip-toggle__label { padding: 0 var(--ds-chip-padding-hor-value-text-generic); }

.ds-chip-toggle__check {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  color:       var(--ds-chip-fg-icon-selected);
}
.ds-chip-toggle:disabled .ds-chip-toggle__check { color: var(--ds-chip-fg-icon-disabled); }

/* ── ChipFilter Dismissible — "Label:" + valor + X ── */

.ds-chip-dismissible:not(.ds-chip-dismissible--disabled):hover::before { background: var(--ds-chip-bg-mix-hover); }
.ds-chip-dismissible:not(.ds-chip-dismissible--disabled):has(.ds-chip-dismissible__remove:active) { opacity: var(--ds-chip-opacity-pressed); }
.ds-chip-dismissible--disabled {
  background: var(--ds-chip-bg-disabled);
  color:      var(--ds-chip-fg-label-disabled);
}
.ds-chip-dismissible__filter-label {
  padding-left:  var(--ds-chip-filter-padding-left-label);
  padding-right: var(--ds-chip-filter-padding-right-label);
  font-weight:   var(--ds-chip-filter-font-weight-label);
}
.ds-chip-dismissible__value { padding: 0 var(--ds-chip-padding-hor-value-text-generic); }

/* ── ChipInput — cuerpo (opcionalmente clicable) + X ── */

.ds-chip-input:not(.ds-chip-input--disabled):hover::before { background: var(--ds-chip-bg-mix-hover); }
.ds-chip-input--disabled {
  background: var(--ds-chip-bg-disabled);
  color:      var(--ds-chip-fg-label-disabled);
}
/* Borde de 1 px en el chip cuando la X está en hover/foco/pressed (Part=Delete) */
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__remove:hover),
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__remove:focus-visible),
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__remove:active) {
  box-shadow: inset 0 0 0 var(--ds-chip-border-width-generic) var(--ds-chip-border-color-generic);
}
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__body:active) { opacity: var(--ds-chip-opacity-pressed); }

.ds-chip-input__body {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-chip-gap-generic);
  padding:     0;
  background:  transparent;
  border:      none;
  color:       inherit;
  font:        inherit;
  cursor:      pointer;
  white-space: nowrap;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
span.ds-chip-input__body { cursor: default; }
.ds-chip-input__body:focus-visible { outline: none; }
.ds-chip-input--disabled .ds-chip-input__body { cursor: not-allowed; }

.ds-chip-input__icon {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  color:       var(--ds-chip-fg-icon-generic);
}
.ds-chip-input--disabled .ds-chip-input__icon { color: var(--ds-chip-fg-icon-disabled); }
.ds-chip-input__label { padding: 0 var(--ds-chip-padding-hor-value-text-generic); }

/* ── X (Dismissible e Input): el icono de 20, área de clic de 24 ── */

.ds-chip-dismissible__remove,
.ds-chip-input__remove {
  position:        relative;
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  padding:         0;
  background:      transparent;
  border:          none;
  border-radius:   var(--ds-chip-border-radius-generic);
  color:           var(--ds-chip-fg-icon-generic);
  cursor:          pointer;
  flex-shrink:     0;
  -webkit-tap-highlight-color: transparent;
}
.ds-chip-dismissible__remove:focus-visible { outline: none; } /* el anillo lo pinta el chip */
.ds-chip-dismissible--disabled .ds-chip-dismissible__remove,
.ds-chip-input--disabled .ds-chip-input__remove {
  color:  var(--ds-chip-fg-icon-disabled);
  cursor: not-allowed;
}
/* Chip Input Part=Delete: el anillo de foco rodea la X */
.ds-chip-input__remove:focus-visible {
  outline:        var(--ds-chip-border-width-focus) solid var(--ds-chip-border-color-focus-outer);
  outline-offset: var(--ds-chip-border-width-focus);
  box-shadow:     0 0 0 var(--ds-chip-border-width-focus) var(--ds-chip-border-color-focus-inner);
}
/* A11y-5 (2.5.8): área de clic de 24 × 24 sin cambiar el aspecto */
.ds-chip-dismissible__remove::after,
.ds-chip-input__remove::after {
  content:   '';
  position:  absolute;
  top:       50%;
  left:      50%;
  width:     var(--ds-chip-size-remove-target);
  height:    var(--ds-chip-size-remove-target);
  transform: translate(-50%, -50%);
}

/* Un icono de consumidor (slot de Input) se ajusta al tamaño del chip */
.ds-chip-input__icon svg {
  width:   var(--ds-chip-size-icon-generic);
  height:  var(--ds-chip-size-icon-generic);
  display: block;
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

/* ─── Chip ──────────────────────────────────────────────────────────────────── */

export const Chip = forwardRef(function Chip({
  type             = 'choice',
  // choice + filter selectable
  label,
  selected,
  defaultSelected  = false,
  onSelectedChange,
  // filter dismissible
  variant          = 'selectable',
  filterLabel,
  value,
  onRemove,
  // input
  icon,
  onChipClick,
  // common
  disabled         = false,
  id,
  name,
  ariaLabel,
  removeLabel = 'Remove', // A11y-3: "Remove Status: Active" / "Remove Spain"
}, forwardedRef) {

  const generatedId = useId();
  const chipId      = id || generatedId;

  const isControlled = selected !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultSelected);
  const isSelected = isControlled ? selected : uncontrolled;

  if (process.env.NODE_ENV !== 'production') {
    if (type !== 'filter' && !label && !ariaLabel) {
      console.warn('[DS Chip] Necesita `label` o `ariaLabel` para ser accesible.', { id: chipId });
    }
    if (type === 'filter' && variant === 'dismissible' && !filterLabel) {
      console.warn('[DS Chip] type="filter" variant="dismissible" necesita `filterLabel`.', { id: chipId });
    }
  }

  const filterText = [filterLabel, value].filter(Boolean).join(': ');

  function handleToggle() {
    if (disabled) return;
    if (!isControlled) setUncontrolled((s) => !s);
    onSelectedChange?.(!isSelected);
  }

  /* ── Choice + Filter Selectable — mismo JSX ── */
  if (type === 'choice' || (type === 'filter' && variant === 'selectable')) {
    return (
      <button
        ref={forwardedRef}
        type="button"
        id={chipId}
        name={name}
        aria-pressed={isSelected}
        aria-label={!label ? ariaLabel : undefined}
        disabled={disabled}
        className={`ds-chip-toggle${type === 'filter' ? ' ds-chip-toggle--filter' : ''}`}
        onClick={handleToggle}
      >
        {isSelected && (
          <span className="ds-chip-toggle__check" aria-hidden="true">
            <Icon name="check" size="xs" />
          </span>
        )}
        <span className="ds-chip-toggle__label">{label}</span>
      </button>
    );
  }

  /* ── Filter Dismissible ── */
  if (type === 'filter' && variant === 'dismissible') {
    return (
      <div
        ref={forwardedRef}
        className={`ds-chip-dismissible${disabled ? ' ds-chip-dismissible--disabled' : ''}`}
        role="group"
        aria-label={ariaLabel || filterText}
      >
        {filterLabel && (
          <span className="ds-chip-dismissible__filter-label" aria-hidden="true">
            {filterLabel}:
          </span>
        )}
        {value && (
          <span className="ds-chip-dismissible__value" aria-hidden="true">
            {value}
          </span>
        )}
        <button
          type="button"
          className="ds-chip-dismissible__remove"
          aria-label={`${removeLabel} ${filterText}`.trim()}
          disabled={disabled}
          onClick={onRemove}
        >
          <Icon name="x" size="xs" />
        </button>
      </div>
    );
  }

  /* ── Input ── */
  if (type === 'input') {
    const BodyTag  = onChipClick ? 'button' : 'span';
    const bodyProps = onChipClick
      ? { type: 'button', onClick: onChipClick, disabled }
      : {};

    return (
      <div
        ref={forwardedRef}
        className={`ds-chip-input${disabled ? ' ds-chip-input--disabled' : ''}`}
      >
        <BodyTag
          className="ds-chip-input__body"
          {...(onChipClick && !label ? { 'aria-label': ariaLabel } : {})}
          {...bodyProps}
        >
          {icon && (
            <span className="ds-chip-input__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          {label && <span className="ds-chip-input__label">{label}</span>}
        </BodyTag>
        {onRemove && (
          <button
            type="button"
            className="ds-chip-input__remove"
            aria-label={`${removeLabel} ${label || ariaLabel || ''}`.trim()}
            disabled={disabled}
            onClick={onRemove}
          >
            <Icon name="x" size="xs" />
          </button>
        )}
      </div>
    );
  }

  return null;
});

Chip.displayName = 'Chip';
export default Chip;
