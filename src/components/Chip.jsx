import React, { forwardRef, useId, useState } from 'react';
import { X, Check } from 'lucide-react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `

/* ── ChipToggle — ChipChoice + ChipFilter Selectable ── */

.ds-chip-toggle {
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-chip-root-gap-generic);
  padding:       var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  background:    var(--ds-chip-root-bg-generic);
  border:        none;
  border-radius: var(--ds-chip-root-border-radius-generic);
  color:         var(--ds-chip-label-fg-generic);
  cursor:        pointer;
  font-family:   inherit;
  font-size:     var(--ds-chip-label-font-size);
  font-weight:   var(--ds-font-weight-medium);
  white-space:   nowrap;
  position:      relative;
  box-sizing:    border-box;
  -webkit-tap-highlight-color: transparent;
}

.ds-chip-toggle::before {
  content:        '';
  position:       absolute;
  inset:          0;
  border-radius:  inherit;
  background:     transparent;
  pointer-events: none;
}
.ds-chip-toggle:not(:disabled):hover::before {
  background: var(--ds-chip-root-bgmix-hover);
}

.ds-chip-toggle[aria-pressed="true"] {
  background: var(--ds-chip-root-bg-selected);
  color:      var(--ds-chip-label-fg-selected);
}
.ds-chip-toggle[aria-pressed="true"]:not(:disabled):hover::before {
  background: var(--ds-chip-root-bgmix-hover-selected);
}

.ds-chip-toggle:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}

.ds-chip-toggle:disabled {
  background: var(--ds-chip-root-bg-disabled);
  color:      var(--ds-chip-label-fg-disabled);
  cursor:     not-allowed;
}

.ds-chip-toggle:focus-visible {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: var(--ds-chip-root-border-width-focus);
  box-shadow:     0 0 0 var(--ds-chip-root-border-width-focus) var(--ds-chip-root-border-color-focus-inner);
}

.ds-chip-toggle__check {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  color:       var(--ds-chip-icon-fg-selected);
}
.ds-chip-toggle:disabled .ds-chip-toggle__check {
  color: var(--ds-chip-icon-fg-disabled);
}


/* ── ChipFilter Dismissible — div + X button ── */

.ds-chip-dismissible {
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-chip-root-gap-generic);
  padding:       var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  background:    var(--ds-chip-root-bg-generic);
  border-radius: var(--ds-chip-root-border-radius-generic);
  box-sizing:    border-box;
  position:      relative;
}
.ds-chip-dismissible::before {
  content:        '';
  position:       absolute;
  inset:          0;
  border-radius:  inherit;
  background:     transparent;
  pointer-events: none;
}
.ds-chip-dismissible:not(.ds-chip-dismissible--disabled):hover::before {
  background: var(--ds-chip-root-bgmix-hover);
}
.ds-chip-dismissible--disabled {
  background: var(--ds-chip-root-bg-disabled);
}

.ds-chip-dismissible__filter-label {
  padding-left:  var(--ds-chip-filter-label-padding-left);
  padding-right: var(--ds-chip-filter-label-padding-right);
  color:         var(--ds-chip-label-fg-generic);
  font-family:   inherit;
  font-size:     var(--ds-chip-label-font-size);
  font-weight:   var(--ds-chip-filter-label-font-weight);
  white-space:   nowrap;
}
.ds-chip-dismissible--disabled .ds-chip-dismissible__filter-label {
  color: var(--ds-chip-label-fg-disabled);
}

.ds-chip-dismissible__value {
  padding-left:  var(--ds-chip-filter-valuetext-padding-hor);
  padding-right: var(--ds-chip-filter-valuetext-padding-hor);
  color:         var(--ds-chip-label-fg-generic);
  font-family:   inherit;
  font-size:     var(--ds-chip-label-font-size);
  font-weight:   var(--ds-font-weight-medium);
  white-space:   nowrap;
}
.ds-chip-dismissible--disabled .ds-chip-dismissible__value {
  color: var(--ds-chip-label-fg-disabled);
}

.ds-chip-dismissible__remove {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  padding:         var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  background:      transparent;
  border:          none;
  border-radius:   var(--ds-chip-root-border-radius-generic);
  color:           var(--ds-chip-icon-fg-generic);
  cursor:          pointer;
  flex-shrink:     0;
  -webkit-tap-highlight-color: transparent;
}
.ds-chip-dismissible--disabled .ds-chip-dismissible__remove {
  color:  var(--ds-chip-icon-fg-disabled);
  cursor: not-allowed;
}
.ds-chip-dismissible__remove:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}
.ds-chip-dismissible__remove:focus-visible {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: var(--ds-chip-root-border-width-focus);
  box-shadow:     inset 0 0 0 var(--ds-chip-root-border-width-focus) var(--ds-chip-root-border-color-focus-inner);
}


/* ── ChipInput — div + body button + X button ── */

.ds-chip-input {
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-chip-root-gap-generic);
  padding:       var(--ds-chip-root-padding-ver-generic) var(--ds-chip-root-padding-hor-generic);
  background:    var(--ds-chip-root-bg-generic);
  border-radius: var(--ds-chip-root-border-radius-generic);
  box-sizing:    border-box;
  position:      relative;
}
.ds-chip-input::before {
  content:        '';
  position:       absolute;
  inset:          0;
  border-radius:  inherit;
  background:     transparent;
  pointer-events: none;
}
.ds-chip-input:not(.ds-chip-input--disabled):hover::before {
  background: var(--ds-chip-root-bgmix-hover);
}
.ds-chip-input--disabled {
  background: var(--ds-chip-root-bg-disabled);
}

/* 1px ring en el chip cuando la X está en hover/focus */
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__remove:hover),
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__remove:focus-visible) {
  box-shadow: 0 0 0 var(--ds-chip-root-border-width-generic) var(--ds-chip-root-border-color-generic);
}

/* outer ring en el wrapper cuando el body tiene foco */
.ds-chip-input:not(.ds-chip-input--disabled):has(.ds-chip-input__body:focus-visible) {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: var(--ds-chip-root-border-width-focus);
}

.ds-chip-input__body {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-chip-root-gap-generic);
  background:  transparent;
  border:      none;
  color:       var(--ds-chip-label-fg-generic);
  cursor:      pointer;
  font-family: inherit;
  font-size:   var(--ds-chip-label-font-size);
  font-weight: var(--ds-chip-label-font-weight);
  white-space: nowrap;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
.ds-chip-input--disabled .ds-chip-input__body {
  color:  var(--ds-chip-label-fg-disabled);
  cursor: not-allowed;
}
.ds-chip-input__body:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}
/* inner ring en el body cuando está focused */
.ds-chip-input__body:focus-visible {
  outline:       none;
  box-shadow:    inset 0 0 0 var(--ds-chip-root-border-width-focus) var(--ds-chip-root-border-color-focus-inner);
  border-radius: var(--ds-chip-root-border-radius-generic);
}

.ds-chip-input__icon {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  color:       var(--ds-chip-icon-fg-generic);
}
.ds-chip-input--disabled .ds-chip-input__icon {
  color: var(--ds-chip-icon-fg-disabled);
}

.ds-chip-input__label {
  padding-left:  var(--ds-chip-input-valuetext-padding-hor);
  padding-right: var(--ds-chip-input-valuetext-padding-hor);
}

.ds-chip-input__remove {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  background:      transparent;
  border:          none;
  border-radius:   var(--ds-chip-root-border-radius-generic);
  color:           var(--ds-chip-icon-fg-generic);
  cursor:          pointer;
  flex-shrink:     0;
  -webkit-tap-highlight-color: transparent;
}
.ds-chip-input--disabled .ds-chip-input__remove {
  color:  var(--ds-chip-icon-fg-disabled);
  cursor: not-allowed;
}
.ds-chip-input__remove:not(:disabled):active {
  opacity: var(--ds-chip-root-opacity-pressed);
}
.ds-chip-input__remove:focus-visible {
  outline:        var(--ds-chip-root-border-width-focus) solid var(--ds-chip-root-border-color-focus-outer);
  outline-offset: var(--ds-chip-root-border-width-focus);
  box-shadow:     inset 0 0 0 var(--ds-chip-root-border-width-focus) var(--ds-chip-root-border-color-focus-inner);
}

/* SVGs de Lucide dimensionados via CSS — sin size= en JSX */
.ds-chip-toggle__check svg,
.ds-chip-dismissible__remove svg,
.ds-chip-input__remove svg,
.ds-chip-input__icon svg {
  width:   var(--ds-chip-icon-size-generic);
  height:  var(--ds-chip-icon-size-generic);
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
        className="ds-chip-toggle"
        onClick={handleToggle}
      >
        {isSelected && (
          <span className="ds-chip-toggle__check" aria-hidden="true">
            <Check />
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
        aria-label={ariaLabel || `${filterLabel}: ${value}`}
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
          aria-label={`Eliminar ${filterLabel}: ${value}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <X aria-hidden="true" />
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
            aria-label={`Eliminar ${label || ''}`}
            disabled={disabled}
            onClick={onRemove}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return null;
});

Chip.displayName = 'Chip';
export default Chip;
