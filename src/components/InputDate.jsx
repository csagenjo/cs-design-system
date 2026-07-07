import React, { forwardRef, useId } from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { mergeRefs, injectStyles } from './_inputBase';

const css = `
.ds-input-date {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-date--full-width { display: flex; width: 100%; }

.ds-input-date__label {
  font-size:     var(--ds-fontSize-label-md);
  font-weight:   var(--ds-font-weight-bold);
  color:         var(--ds-input-fg-label);
  cursor:        pointer;
  line-height:   var(--ds-lineHeight-xs);
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-date--disabled .ds-input-date__label {
  color:  var(--ds-input-label-fg-disabled);
  cursor: default;
}

.ds-input-date__field-wrap {
  position: relative;
  display:  flex;
  width:    100%;
}

.ds-input-date__control {
  box-sizing:         border-box;
  width:              100%;
  min-height:         var(--ds-input-min-height);
  /* padding-right siempre compensado por el icono calendario */
  padding:            var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  padding-right:      calc(var(--ds-input-padding-hor) + var(--ds-input-date-icon-right-size) + var(--ds-input-field-icon-gap));
  font-size:          var(--ds-fontSize-body-sm);
  font-family:        inherit;
  line-height:        var(--ds-lineHeight-xs);
  color:              var(--ds-input-fg-default);
  background:         var(--ds-input-bg-default);
  border:             var(--ds-input-border-width) solid var(--ds-input-border-default);
  border-radius:      var(--ds-input-border-radius);
  outline:            none;
  transition:         border-color 0.12s, background 0.12s;
  -webkit-appearance: none;
}
.ds-input-date__control::placeholder { color: var(--ds-input-fg-placeholder); }

/* Hover */
.ds-input-date:not(.ds-input-date--disabled):not(.ds-input-date--error)
  .ds-input-date__control:hover {
  border-color: var(--ds-input-border-hover);
}

/* Focus — anillo doble */
.ds-input-date__control:focus {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Error */
.ds-input-date--error .ds-input-date__control { border-color: var(--ds-input-border-error); }
.ds-input-date--error .ds-input-date__control:focus {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Disabled */
.ds-input-date--disabled .ds-input-date__control {
  background:   var(--ds-input-bg-disabled);
  color:        var(--ds-input-fg-disabled);
  border-color: var(--ds-input-border-disabled);
  cursor:       not-allowed;
}
.ds-input-date--disabled .ds-input-date__control:focus {
  border-color: var(--ds-input-border-disabled);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* Icono calendario */
.ds-input-date__icon {
  position:       absolute;
  top:            50%;
  right:          var(--ds-input-padding-hor);
  transform:      translateY(-50%);
  display:        flex;
  align-items:    center;
  pointer-events: none;
  color:          var(--ds-input-date-icon-right-fg);
}
.ds-input-date--disabled .ds-input-date__icon { color: var(--ds-input-date-icon-right-fg-disabled); }

/* Helper — aparece ENCIMA del campo */
.ds-input-date__helper {
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: var(--ds-lineHeight-xs);
}
.ds-input-date--disabled .ds-input-date__helper { color: var(--ds-input-helper-fg-disabled); }

/* Validación */
.ds-input-date__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: var(--ds-lineHeight-xs);
}
.ds-input-date__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
`;

injectStyles('ds-input-date', css);

export const InputDate = forwardRef(function InputDate({
  label,
  ariaLabel,
  placeholder   = 'DD/MM/AAAA',
  value,
  defaultValue,
  onChange,
  state         = 'default',
  helperText,
  errorMessage,
  fullWidth     = false,
  id,
  name,
  onFocus,
  onBlur,
  ...nativeProps
}, forwardedRef) {

  const generatedId = useId();
  const inputId     = id || generatedId;
  const helperId    = helperText ? `${inputId}-helper` : null;
  const messageId   = state === 'error' && errorMessage ? `${inputId}-msg`  : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputDate] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const wrapperClass = [
    'ds-input-date',
    state === 'error'    ? 'ds-input-date--error'     : '',
    state === 'disabled' ? 'ds-input-date--disabled'  : '',
    fullWidth            ? 'ds-input-date--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="ds-input-date__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-input-date__helper" id={helperId}>
          {helperText}
        </p>
      )}

      <div className="ds-input-date__field-wrap">
        <input
          ref={forwardedRef ? mergeRefs(forwardedRef) : undefined}
          id={inputId}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={state === 'disabled'}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={describedBy}
          aria-invalid={state === 'error' ? 'true' : undefined}
          className="ds-input-date__control"
          {...nativeProps}
        />
        <span className="ds-input-date__icon" aria-hidden="true">
          <Calendar size={24} strokeWidth={1.75} />
        </span>
      </div>

      {state === 'error' && errorMessage && (
        <p className="ds-input-date__message" id={messageId} aria-live="polite">
          <span className="ds-input-date__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

InputDate.displayName = 'InputDate';
export default InputDate;
