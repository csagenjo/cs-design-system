import React, { useState, forwardRef, useId } from 'react';
import { AlertCircle, Plus, Minus } from 'lucide-react';
import { injectStyles } from './_inputBase';

const css = `
.ds-input-stepper {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-stepper--full-width { display: flex; width: 100%; }

.ds-input-stepper__label {
  font-size:     14px;
  font-weight:   700;
  color:         var(--ds-input-fg-label);
  line-height:   1.4;
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-stepper--disabled .ds-input-stepper__label { color: var(--ds-input-label-fg-disabled); }

/* Helper — encima del campo */
.ds-input-stepper__helper {
  font-size:   12px;
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: 1.4;
}
.ds-input-stepper--disabled .ds-input-stepper__helper { color: var(--ds-input-helper-fg-disabled); }

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
  width:           calc(var(--ds-input-padding-hor) * 2 + var(--ds-input-stepper-icon-left-size));
  border:          none;
  background:      transparent;
  cursor:          pointer;
  color:           var(--ds-input-stepper-icon-left-fg);
  padding:         0;
  transition:      color 0.12s, background 0.12s;
}
.ds-input-stepper__btn--right { color: var(--ds-input-stepper-icon-right-fg); }

.ds-input-stepper__btn:focus  { outline: none; }

.ds-input-stepper__btn:hover:not(:disabled) {
  background: var(--ds-opacity-hover-default);
}

.ds-input-stepper__btn:disabled {
  color:  var(--ds-input-stepper-icon-left-fg-disabled);
  cursor: not-allowed;
}
.ds-input-stepper__btn--right:disabled { color: var(--ds-input-stepper-icon-right-fg-disabled); }

/* Valor central */
.ds-input-stepper__value {
  flex:            1;
  display:         flex;
  align-items:     center;
  justify-content: center;
  font-size:       14px;
  line-height:     1.5;
  color:           var(--ds-input-fg-default);
  user-select:     none;
  font-family:     inherit;
}
.ds-input-stepper--disabled .ds-input-stepper__value { color: var(--ds-input-fg-disabled); }

/* Validation message — debajo del campo */
.ds-input-stepper__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   12px;
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: 1.4;
}
.ds-input-stepper__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
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
        <span className="ds-input-stepper__label" id={`${groupId}-label`}>
          {label}
        </span>
      )}

      {helperText && (
        <p className="ds-input-stepper__helper" id={helperId}>
          {helperText}
        </p>
      )}

      <div
        className="ds-input-stepper__field-wrap"
        role="group"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-label={!label ? ariaLabel : undefined}
        aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
      >
        <button
          type="button"
          className="ds-input-stepper__btn ds-input-stepper__btn--left"
          onClick={() => update(current - step)}
          disabled={isDisabled || atMin}
          aria-label="Decrementar"
        >
          <Minus size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <output
          className="ds-input-stepper__value"
          htmlFor={`${groupId}-label`}
          aria-live="polite"
          aria-atomic="true"
        >
          {current}
        </output>

        <button
          type="button"
          className="ds-input-stepper__btn ds-input-stepper__btn--right"
          onClick={() => update(current + step)}
          disabled={isDisabled || atMax}
          aria-label="Incrementar"
        >
          <Plus size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {state === 'error' && errorMessage && (
        <p className="ds-input-stepper__message" id={messageId} aria-live="polite">
          <span className="ds-input-stepper__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

InputStepper.displayName = 'InputStepper';
export default InputStepper;
