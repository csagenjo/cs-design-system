import React, { useState, forwardRef, useId } from 'react';
import { Icon } from './Icon';
import { injectStyles } from './_inputBase';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-input-stepper {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-stepper--full-width { display: flex; width: 100%; }

.ds-input-stepper__label { margin-bottom: var(--ds-input-label-gap); }

/* Helper — encima del campo */
.ds-input-stepper__helper  { margin-bottom: var(--ds-input-helper-gap); }
.ds-input-stepper__message { margin-top: var(--ds-input-validation-gap); }

/* Campo: contenedor con borde, fondo, radio — igual que otros inputs */
.ds-input-stepper__field-wrap {
  display:       flex;
  align-items:   stretch;
  width:         100%;
  min-height:    var(--ds-input-min-height);
  background:    var(--ds-input-bg-default);
  border:        var(--ds-input-border-width) solid var(--ds-input-border-default);
  border-radius: var(--ds-input-border-radius);
  overflow:      hidden;
  transition:    border-color 0.12s, background 0.12s;
}

/* Hover */
.ds-input-stepper:not(.ds-input-stepper--disabled):not(.ds-input-stepper--error)
  .ds-input-stepper__field-wrap:hover {
  border-color: var(--ds-input-border-hover);
}

/* Focus — anillo doble cuando cualquier botón tiene foco */
.ds-input-stepper__field-wrap:focus-within {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Error */
.ds-input-stepper--error .ds-input-stepper__field-wrap {
  border-color: var(--ds-input-border-error);
}
.ds-input-stepper--error .ds-input-stepper__field-wrap:focus-within {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Disabled */
.ds-input-stepper--disabled .ds-input-stepper__field-wrap {
  background:   var(--ds-input-bg-disabled);
  border-color: var(--ds-input-border-disabled);
}
.ds-input-stepper--disabled .ds-input-stepper__field-wrap:focus-within {
  border-color: var(--ds-input-border-disabled);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* Botones −/+ */
.ds-input-stepper__btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
  width:           calc(var(--ds-input-padding-hor) * 2 + var(--ds-input-icon-size));
  border:          none;
  background:      transparent;
  cursor:          pointer;
  color:           var(--ds-input-icon-fg-primary);
  padding:         0;
  transition:      color 0.12s, background 0.12s;
}
.ds-input-stepper__btn--right { color: var(--ds-input-icon-fg-primary); }

.ds-input-stepper__btn:focus  { outline: none; }
/* A11y-4: además del anillo del campo, el botón que tiene el foco se marca
   por dentro — si no, no se sabía si el foco estaba en − o en +. */
.ds-input-stepper__btn:focus-visible {
  outline:        var(--ds-border-width-lg) solid var(--ds-input-focus-outer);
  outline-offset: calc(var(--ds-border-width-lg) * -2);
}

.ds-input-stepper__btn:hover:not(:disabled):not([aria-disabled="true"]) {
  background: var(--ds-input-stepper-btn-bg-hover);
}

.ds-input-stepper__btn:disabled,
.ds-input-stepper__btn[aria-disabled="true"] {
  color:  var(--ds-input-icon-fg-disabled);
  cursor: not-allowed;
}
.ds-input-stepper__btn--right:disabled,
.ds-input-stepper__btn--right[aria-disabled="true"] { color: var(--ds-input-icon-fg-disabled); }

/* Valor central */
.ds-input-stepper__value {
  flex:            1;
  display:         flex;
  align-items:     center;
  justify-content: center;
  font-size:       var(--ds-fontSize-body-sm);
  line-height:     var(--ds-lineHeight-body-sm);
  color:           var(--ds-input-fg-default);
  user-select:     none;
  font-family:     inherit;
}
.ds-input-stepper--disabled .ds-input-stepper__value { color: var(--ds-input-fg-disabled); }

`;

injectStyles('ds-input-stepper', css);

export const InputStepper = forwardRef(function InputStepper({
  label,
  ariaLabel,
  value,
  defaultValue  = 0,
  onChange,
  min,
  max,
  step          = 1,
  state         = 'default',
  helperText,
  errorMessage,
  fullWidth     = false,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  id,
}, forwardedRef) {

  const generatedId = useId();
  const groupId     = id || generatedId;
  const helperId    = helperText ? `${groupId}-helper` : null;
  const messageId   = state === 'error' && errorMessage ? `${groupId}-msg` : null;

  // Soporte controlado y no controlado
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value !== undefined ? value : internalValue;

  function update(next) {
    const clamped = max !== undefined && next > max ? max
                  : min !== undefined && next < min ? min
                  : next;
    if (value === undefined) setInternalValue(clamped);
    onChange?.(clamped);
  }

  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;
  const isDisabled = state === 'disabled';

  const wrapperClass = [
    'ds-input-stepper',
    state === 'error'    ? 'ds-input-stepper--error'     : '',
    isDisabled           ? 'ds-input-stepper--disabled'  : '',
    fullWidth            ? 'ds-input-stepper--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass} ref={forwardedRef}>
      {label && (
        <FieldLabel as="span" className="ds-input-stepper__label" id={`${groupId}-label`} disabled={state === 'disabled'}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-stepper__helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}

      <div
        className="ds-input-stepper__field-wrap"
        role="group"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-label={!label ? ariaLabel : undefined}
        aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
      >
        {/* A11y-4: al llegar al mínimo/máximo el botón queda aria-disabled (sigue
            enfocable) — con disabled nativo el foco se perdía al pulsarlo. */}
        <button
          type="button"
          className="ds-input-stepper__btn ds-input-stepper__btn--left"
          onClick={() => { if (!atMin) update(current - step); }}
          disabled={isDisabled}
          aria-disabled={!isDisabled && atMin ? 'true' : undefined}
          aria-label={decrementLabel}
        >
          <Icon name="minus" size="sm" />
        </button>

        <output
          className="ds-input-stepper__value"
          aria-live="polite"
          aria-atomic="true"
        >
          {current}
        </output>

        <button
          type="button"
          className="ds-input-stepper__btn ds-input-stepper__btn--right"
          onClick={() => { if (!atMax) update(current + step); }}
          disabled={isDisabled}
          aria-disabled={!isDisabled && atMax ? 'true' : undefined}
          aria-label={incrementLabel}
        >
          <Icon name="plus" size="sm" />
        </button>
      </div>
      <ValidationMessage className="ds-input-stepper__message" id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

InputStepper.displayName = 'InputStepper';
export default InputStepper;
