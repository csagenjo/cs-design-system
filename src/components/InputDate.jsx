import { VisuallyHidden } from './VisuallyHidden';
import React, { forwardRef, useId } from 'react';
import { Icon } from './Icon';
import { mergeRefs, injectStyles } from './_inputBase';
import { FieldLabel } from './FieldLabel';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-input-date {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-date--full-width { display: flex; width: 100%; }

.ds-input-date__label { margin-bottom: var(--ds-input-label-gap); }

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
  padding-right:      calc(var(--ds-input-padding-hor) + var(--ds-input-icon-size) + var(--ds-input-field-icon-gap));
  font-size:          var(--ds-fontSize-body-sm);
  font-family:        inherit;
  line-height:        var(--ds-lineHeight-body-sm);
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
  color:          var(--ds-input-icon-fg-primary);
}
.ds-input-date--disabled .ds-input-date__icon { color: var(--ds-input-icon-fg-disabled); }

/* Helper — aparece ENCIMA del campo */
.ds-input-date__helper {
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: var(--ds-lineHeight-body-sm);
}
.ds-input-date--disabled .ds-input-date__helper { color: var(--ds-input-helper-fg-disabled); }

/* Validación */
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
  required        = false, // A11y-4: asterisco visible + `required` nativo
  formatHint      = (fmt) => `Format ${fmt}`, // A11y-4: el formato solo estaba en el placeholder (desaparece al escribir); null si helperText ya lo dice
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
  const formatId    = formatHint && placeholder ? `${inputId}-format` : null;
  const describedBy = [helperId, formatId, messageId].filter(Boolean).join(' ') || undefined;

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
        <FieldLabel className="ds-input-date__label" htmlFor={inputId} required={required} disabled={state === 'disabled'}>{label}</FieldLabel>
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
          required={required}
          className="ds-input-date__control"
          {...nativeProps}
        />
        {formatId && <VisuallyHidden id={formatId}>{formatHint(placeholder)}</VisuallyHidden>}
        <span className="ds-input-date__icon" aria-hidden="true">
          <Icon name="calendar-days" size="sm" />
        </span>
      </div>
      <ValidationMessage id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

InputDate.displayName = 'InputDate';
export default InputDate;
