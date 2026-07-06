import React, { forwardRef, useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { mergeRefs, injectStyles } from './_inputBase';

const css = `
.ds-input-dropdown {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-dropdown--full-width { display: flex; width: 100%; }

.ds-input-dropdown__label {
  font-size:     var(--ds-fontSize-label-md);
  font-weight:   var(--ds-font-weight-bold);
  color:         var(--ds-input-fg-label);
  cursor:        pointer;
  line-height:   var(--ds-lineHeight-xs);
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-dropdown--disabled .ds-input-dropdown__label {
  color:  var(--ds-input-label-fg-disabled);
  cursor: default;
}

/* Helper — encima del campo */
.ds-input-dropdown__helper {
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: var(--ds-lineHeight-xs);
}
.ds-input-dropdown--disabled .ds-input-dropdown__helper { color: var(--ds-input-helper-fg-disabled); }

.ds-input-dropdown__field-wrap {
  position: relative;
  display:  flex;
  width:    100%;
}

.ds-input-dropdown__control {
  box-sizing:         border-box;
  width:              100%;
  min-height:         var(--ds-input-min-height);
  padding:            var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  padding-right:      calc(var(--ds-input-padding-hor) + var(--ds-input-dropdown-icon-right-size) + var(--ds-input-field-icon-gap));
  font-size:          var(--ds-fontSize-body-sm);
  font-family:        inherit;
  line-height:        var(--ds-lineHeight-xs);
  color:              var(--ds-input-fg-default);
  background:         var(--ds-input-bg-default);
  border:             var(--ds-input-border-width) solid var(--ds-input-border-default);
  border-radius:      var(--ds-input-border-radius);
  outline:            none;
  cursor:             pointer;
  -webkit-appearance: none;
  appearance:         none;
  transition:         border-color 0.12s, background 0.12s;
}

/* Hover */
.ds-input-dropdown:not(.ds-input-dropdown--disabled):not(.ds-input-dropdown--error)
  .ds-input-dropdown__control:hover {
  border-color: var(--ds-input-border-hover);
}

/* Focus — anillo doble */
.ds-input-dropdown__control:focus {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Error */
.ds-input-dropdown--error .ds-input-dropdown__control { border-color: var(--ds-input-border-error); }
.ds-input-dropdown--error .ds-input-dropdown__control:focus {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Disabled */
.ds-input-dropdown--disabled .ds-input-dropdown__control {
  background:   var(--ds-input-bg-disabled);
  color:        var(--ds-input-fg-disabled);
  border-color: var(--ds-input-border-disabled);
  cursor:       not-allowed;
}
.ds-input-dropdown--disabled .ds-input-dropdown__control:focus {
  border-color: var(--ds-input-border-disabled);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* Placeholder option — aplica color subtle cuando no hay valor seleccionado */
.ds-input-dropdown__control--placeholder { color: var(--ds-input-fg-placeholder); }

/* Icono chevron */
.ds-input-dropdown__icon {
  position:       absolute;
  top:            50%;
  right:          var(--ds-input-padding-hor);
  transform:      translateY(-50%);
  display:        flex;
  align-items:    center;
  pointer-events: none;
  color:          var(--ds-input-dropdown-icon-right-fg);
}
.ds-input-dropdown--disabled .ds-input-dropdown__icon { color: var(--ds-input-dropdown-icon-right-fg-disabled); }

/* Validation message — debajo del campo */
.ds-input-dropdown__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: var(--ds-lineHeight-xs);
}
.ds-input-dropdown__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
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
  placeholder   = 'Selecciona una opción',
  fullWidth     = false,
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
    'ds-input-dropdown',
    state === 'error'    ? 'ds-input-dropdown--error'     : '',
    state === 'disabled' ? 'ds-input-dropdown--disabled'  : '',
    fullWidth            ? 'ds-input-dropdown--full-width' : '',
  ].filter(Boolean).join(' ');

  const controlClass = [
    'ds-input-dropdown__control',
    showingPlaceholder && value !== undefined ? 'ds-input-dropdown__control--placeholder' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="ds-input-dropdown__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-input-dropdown__helper" id={helperId}>
          {helperText}
        </p>
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
          <ChevronDown size={24} strokeWidth={1.75} />
        </span>
      </div>

      {state === 'error' && errorMessage && (
        <p className="ds-input-dropdown__message" id={messageId} aria-live="polite">
          <span className="ds-input-dropdown__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

InputDropdown.displayName = 'InputDropdown';
export default InputDropdown;
