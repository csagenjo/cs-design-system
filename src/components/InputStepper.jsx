/**
 * InputStepper — Componente atómico
 * CS Design System · v2 (27/10/2026: alineado 1:1 con Figma)
 *
 * Figma: `Stepper` (Label + Helper + `Stepper Build` + Validation Message).
 * Estados (Figma `State`): Enabled · Hover · Focus · Error · Read-only · Disabled.
 *
 * Patrón APG "spinbutton": el valor es el control (role="spinbutton", una
 * parada de Tab, flechas ↑/↓, Inicio/Fin, Re Pág/Av Pág). Los botones − / +
 * son para el ratón: fuera del orden de Tab y, al pulsarlos, el foco se queda
 * en el valor — por eso el anillo de foco rodea el campo entero, como en Figma.
 *
 * USO:
 *   <InputStepper label="Quantity" defaultValue={1} min={0} max={10} />
 *   <InputStepper label="Quantity" state="read-only" value={3} />
 */

import React, { useState, useRef, forwardRef, useId } from 'react';
import { Icon } from './Icon';
import { injectStyles, boxStateClass, mergeRefs } from './_inputBase';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-input-stepper {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-stepper--full-width { display: flex; }

.ds-input-stepper__label   { margin-bottom: var(--ds-input-label-gap); }
.ds-input-stepper__message { margin-top: var(--ds-input-validation-gap); }

/* Caja: .ds-input-box (_inputBase). El anillo aparece con el foco en el valor. */
.ds-input-stepper__field-wrap {
  display:     flex;
  align-items: stretch;
  width:       100%;
}

/* Botones − / + (Figma: Icon Left / Icon Right, icono primary) */
.ds-input-stepper__btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
  width:           calc(var(--ds-input-padding-hor) * 2 + var(--ds-input-icon-size));
  padding:         0;
  border:          none;
  background:      transparent;
  cursor:          pointer;
  color:           var(--ds-input-icon-fg-primary);
}
.ds-input-stepper__btn:first-child { margin-right: calc(-1 * var(--ds-input-padding-hor) + var(--ds-input-field-icon-gap)); }
.ds-input-stepper__btn:last-child  { margin-left:  calc(-1 * var(--ds-input-padding-hor) + var(--ds-input-field-icon-gap)); }
.ds-input-stepper__btn:focus { outline: none; }
.ds-input-stepper__btn[aria-disabled="true"],
.ds-input-stepper__btn:disabled {
  color:  var(--ds-input-icon-fg-disabled);
  cursor: not-allowed;
}

/* Valor (spinbutton) */
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
  outline:         none;
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
  state         = 'default',   // default | error | read-only | disabled
  helperText,
  errorMessage,
  fullWidth     = false,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  id,
}, forwardedRef) {

  const generatedId = useId();
  const groupId     = id || generatedId;
  const labelId     = label ? `${groupId}-label` : undefined;
  const helperId    = helperText ? `${groupId}-helper` : null;
  const messageId   = state === 'error' && errorMessage ? `${groupId}-msg` : null;
  const spinRef     = useRef(null);

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputStepper] Necesita `label` o `ariaLabel` para ser accesible.', { id: groupId });
  }

  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value !== undefined ? value : internalValue;

  const isDisabled = state === 'disabled';
  const isReadOnly = state === 'read-only';
  const locked     = isDisabled || isReadOnly;

  function update(next) {
    if (locked) return;
    const clamped = max !== undefined && next > max ? max
                  : min !== undefined && next < min ? min
                  : next;
    if (clamped === current) return;
    if (value === undefined) setInternalValue(clamped);
    onChange?.(clamped);
  }

  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;

  function onKeyDown(e) {
    const big = step * 10;
    const map = {
      ArrowUp:   () => update(current + step),
      ArrowDown: () => update(current - step),
      PageUp:    () => update(current + big),
      PageDown:  () => update(current - big),
      Home:      () => min !== undefined && update(min),
      End:       () => max !== undefined && update(max),
    };
    if (map[e.key]) { e.preventDefault(); map[e.key](); }
  }

  // Los botones no se llevan el foco: se queda (o pasa) al valor
  function keepFocus(e) {
    e.preventDefault();
    if (!isDisabled) spinRef.current?.focus();
  }

  const wrapperClass = [
    'ds-input-stepper ds-input-root',
    isDisabled ? 'ds-input-stepper--disabled' : '',
    fullWidth  ? 'ds-input-stepper--full-width ds-input-root--full-width' : '',
  ].filter(Boolean).join(' ');

  const boxClass = ['ds-input-stepper__field-wrap ds-input-box ds-input-box--within', boxStateClass(state)]
    .filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <FieldLabel as="span" className="ds-input-stepper__label ds-input-label" id={labelId} disabled={isDisabled}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-stepper__helper ds-input-helper" disabled={isDisabled}>{helperText}</HelperText>
      )}

      <div className={boxClass}>
        <button
          type="button"
          tabIndex={-1}
          className="ds-input-stepper__btn"
          onMouseDown={keepFocus}
          onClick={() => update(current - step)}
          disabled={isDisabled}
          aria-disabled={!isDisabled && (atMin || isReadOnly) ? 'true' : undefined}
          aria-label={decrementLabel}
          aria-controls={groupId}
        >
          <Icon name="minus" size="sm" />
        </button>

        <div
          ref={mergeRefs(spinRef, forwardedRef)}
          id={groupId}
          role="spinbutton"
          tabIndex={isDisabled ? -1 : 0}
          className="ds-input-stepper__value"
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-labelledby={labelId}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
          aria-invalid={state === 'error' ? 'true' : undefined}
          aria-readonly={isReadOnly ? 'true' : undefined}
          aria-disabled={isDisabled ? 'true' : undefined}
          onKeyDown={onKeyDown}
        >
          {current}
        </div>

        <button
          type="button"
          tabIndex={-1}
          className="ds-input-stepper__btn"
          onMouseDown={keepFocus}
          onClick={() => update(current + step)}
          disabled={isDisabled}
          aria-disabled={!isDisabled && (atMax || isReadOnly) ? 'true' : undefined}
          aria-label={incrementLabel}
          aria-controls={groupId}
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
