import React, { forwardRef, useId } from 'react';
import { Icon } from './Icon';
import { mergeRefs, injectStyles, boxStateClass } from './_inputBase';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-input-dropdown {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-dropdown--full-width { display: flex; }


/* Helper — encima del campo */
.ds-input-dropdown__message { margin-top: var(--ds-input-validation-gap); }

.ds-input-dropdown__field-wrap {
  position: relative;
  display:  flex;
  width:    100%;
}

.ds-input-dropdown__control {
  width:              100%;
  padding:            var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  padding-right:      calc(var(--ds-input-padding-hor) + var(--ds-input-icon-size) + var(--ds-input-field-icon-gap));
  font-size:          var(--ds-fontSize-body-sm);
  font-family:        inherit;
  line-height:        var(--ds-lineHeight-body-sm);
  cursor:             pointer;
  -webkit-appearance: none;
  appearance:         none;
}
/* Caja, hover, error, disabled y foco: .ds-input-box (_inputBase) */
.ds-input-dropdown__control.is-disabled { cursor: not-allowed; }

/* Placeholder option — aplica color subtle cuando no hay valor seleccionado */
.ds-input-dropdown__control--placeholder:not(.is-disabled),
.ds-input-dropdown__control:not(.is-disabled):has(option[value=""]:checked) { color: var(--ds-input-fg-placeholder); }
.ds-input-dropdown__control option { color: var(--ds-input-fg-default); }

/* Icono chevron */
.ds-input-dropdown__icon {
  position:       absolute;
  top:            50%;
  right:          var(--ds-input-padding-hor);
  transform:      translateY(-50%);
  display:        flex;
  align-items:    center;
  pointer-events: none;
  color:          var(--ds-input-icon-fg-primary);
}
.ds-input-dropdown--disabled .ds-input-dropdown__icon { color: var(--ds-input-icon-fg-disabled); }

`;

injectStyles('ds-input-dropdown', css);

export const InputDropdown = forwardRef(function InputDropdown({
  label,
  ariaLabel,
  value,
  defaultValue,
  onChange,
  options       = [],
  state         = 'default',
  helperText,
  errorMessage,
  placeholder   = 'Select an option',  // A11y-5 (K): textos por defecto en inglés
  fullWidth     = false,
  required        = false, // A11y-4: asterisco visible + `required` nativo
  id,
  name,
  onFocus,
  onBlur,
}, forwardedRef) {

  const generatedId = useId();
  const inputId     = id || generatedId;
  const helperId    = helperText ? `${inputId}-helper` : null;
  const messageId   = state === 'error' && errorMessage ? `${inputId}-msg` : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputDropdown] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  // Para detectar si se muestra el placeholder (solo en modo controlado)
  const showingPlaceholder = value === '' || value === undefined || value === null;

  const wrapperClass = [
    'ds-input-dropdown ds-input-root',
    state === 'error'    ? 'ds-input-dropdown--error'     : '',
    state === 'disabled' ? 'ds-input-dropdown--disabled'  : '',
    fullWidth            ? 'ds-input-dropdown--full-width ds-input-root--full-width' : '',
  ].filter(Boolean).join(' ');

  const controlClass = [
    'ds-input-dropdown__control ds-input-box',
    boxStateClass(state),
    showingPlaceholder && value !== undefined ? 'ds-input-dropdown__control--placeholder' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <FieldLabel className="ds-input-dropdown__label ds-input-label" htmlFor={inputId} required={required} disabled={state === 'disabled'}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-dropdown__helper ds-input-helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}

      <div className="ds-input-dropdown__field-wrap">
        <select
          ref={forwardedRef ? mergeRefs(forwardedRef) : undefined}
          id={inputId}
          name={name}
          value={value}
          defaultValue={defaultValue ?? ''}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={state === 'disabled'}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={describedBy}
          aria-invalid={state === 'error' ? 'true' : undefined}
          required={required}
          className={controlClass}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="ds-input-dropdown__icon" aria-hidden="true">
          <Icon name="chevron-down" size="sm" />
        </span>
      </div>
      <ValidationMessage className="ds-input-dropdown__message" id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

InputDropdown.displayName = 'InputDropdown';
export default InputDropdown;
