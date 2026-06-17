import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useId,
} from 'react';
import { AlertCircle } from 'lucide-react';
import { ICONS, mergeRefs, injectStyles } from './_inputBase';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const css = `
.ds-input-text {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-text--full-width { display: flex; width: 100%; }

.ds-input-text__label {
  font-size:     14px;
  font-weight:   500;
  color:         var(--ds-input-fg-label);
  cursor:        pointer;
  line-height:   1.4;
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-text--disabled .ds-input-text__label {
  color: var(--ds-input-label-fg-disabled);
  cursor: default;
}

.ds-input-text__field-wrap {
  position: relative;
  display:  flex;
  width:    100%;
}

.ds-input-text__control {
  box-sizing:         border-box;
  width:              100%;
  min-height:         var(--ds-input-min-height);
  padding:            var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  font-size:          14px;
  font-family:        inherit;
  line-height:        1.5;
  color:              var(--ds-input-fg-default);
  background:         var(--ds-input-bg-default);
  border:             var(--ds-input-border-width) solid var(--ds-input-border-default);
  border-radius:      var(--ds-input-border-radius);
  outline:            none;
  transition:         border-color 0.12s, background 0.12s;
  -webkit-appearance: none;
}
.ds-input-text__control::placeholder { color: var(--ds-fg-subtle); }

/* Hover — solo en estado genérico */
.ds-input-text:not(.ds-input-text--disabled):not(.ds-input-text--error):not(.ds-input-text--readonly)
  .ds-input-text__control:hover {
  border-color: var(--ds-borderColor-emphasis);
}

/* Focus — anillo doble */
.ds-input-text__control:focus {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Error */
.ds-input-text--error .ds-input-text__control {
  border-color: var(--ds-input-border-error);
}
.ds-input-text--error .ds-input-text__control:focus {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Read-only */
.ds-input-text--readonly .ds-input-text__control {
  background: var(--ds-bg-page);
  cursor:     default;
}
.ds-input-text--readonly .ds-input-text__control:focus {
  border-color: var(--ds-input-border-default);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* Disabled */
.ds-input-text--disabled .ds-input-text__control {
  background:   var(--ds-input-bg-disabled);
  color:        var(--ds-input-fg-disabled);
  border-color: var(--ds-input-border-disabled);
  cursor:       not-allowed;
}
.ds-input-text--disabled .ds-input-text__control:focus {
  border-color: var(--ds-input-border-disabled);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* Adaptive (textarea) */
.ds-input-text--adaptive .ds-input-text__control {
  height:   auto;
  resize:   none;
  overflow: hidden;
}

/* Iconos */
.ds-input-text__icon {
  position:       absolute;
  top:            50%;
  transform:      translateY(-50%);
  display:        flex;
  align-items:    center;
  pointer-events: none;
}
.ds-input-text__icon--left  {
  left:  var(--ds-input-padding-hor);
  color: var(--ds-input-text-icon-left-fg);
}
.ds-input-text__icon--right {
  right: var(--ds-input-padding-hor);
  color: var(--ds-input-text-icon-right-fg);
}
.ds-input-text__icon--left.ds-input-text__icon--primary  { color: var(--ds-input-text-icon-left-fg-primary); }
.ds-input-text__icon--right.ds-input-text__icon--primary { color: var(--ds-input-text-icon-right-fg-primary); }
.ds-input-text--disabled .ds-input-text__icon--left      { color: var(--ds-input-text-icon-left-fg-disabled); }
.ds-input-text--disabled .ds-input-text__icon--right     { color: var(--ds-input-text-icon-right-fg-disabled); }

/* En adaptive el icono se ancla al borde superior del texto */
.ds-input-text--adaptive .ds-input-text__icon {
  top:       var(--ds-input-padding-ver);
  transform: none;
}

/* Padding compensado cuando hay iconos */
.ds-input-text__field-wrap--icon-left .ds-input-text__control {
  padding-left: calc(var(--ds-input-padding-hor) + var(--ds-input-text-icon-left-size) + var(--ds-input-field-icon-gap));
}
.ds-input-text__field-wrap--icon-right .ds-input-text__control {
  padding-right: calc(var(--ds-input-padding-hor) + var(--ds-input-text-icon-right-size) + var(--ds-input-field-icon-gap));
}

/* Helper text */
.ds-input-text__helper {
  font-size:   12px;
  color:       var(--ds-input-fg-helper);
  margin:      var(--ds-input-helper-gap) 0 0;
  line-height: 1.4;
}
.ds-input-text--disabled .ds-input-text__helper { color: var(--ds-input-helper-fg-disabled); }

/* Mensaje de validación */
.ds-input-text__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   12px;
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: 1.4;
}
.ds-input-text__message-icon {
  color:      var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
`;

injectStyles('ds-input-text', css);

function Icon({ name, size = 24 }) {
  const C = ICONS[name];
  if (!C) return null;
  return <C size={size} strokeWidth={1.75} aria-hidden="true" />;
}

export const InputText = forwardRef(function InputText({
  label,
  ariaLabel,
  placeholder      = '',
  value,
  defaultValue,
  onChange,
  type             = 'text',
  adaptive         = false,
  state            = 'default',
  helperText,
  errorMessage,
  iconLeft,
  iconLeftPrimary  = false,
  iconRight,
  iconRightPrimary = false,
  fullWidth        = false,
  id,
  name,
  onFocus,
  onBlur,
  ...nativeProps
}, forwardedRef) {

  const internalRef = useRef(null);
  const generatedId = useId();
  const inputId     = id || generatedId;

  const helperId  = helperText && state !== 'error' ? `${inputId}-helper` : null;
  const messageId = state === 'error' && errorMessage ? `${inputId}-msg`  : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputText] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  useIsomorphicLayoutEffect(() => {
    if (!adaptive || !internalRef.current) return;
    const el = internalRef.current;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [adaptive, value]);

  function handleChange(e) {
    if (adaptive) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
    onChange?.(e);
  }

  const wrapperClass = [
    'ds-input-text',
    state === 'error'     ? 'ds-input-text--error'     : '',
    state === 'read-only' ? 'ds-input-text--readonly'  : '',
    state === 'disabled'  ? 'ds-input-text--disabled'  : '',
    adaptive              ? 'ds-input-text--adaptive'  : '',
    fullWidth             ? 'ds-input-text--full-width' : '',
  ].filter(Boolean).join(' ');

  const fieldWrapClass = [
    'ds-input-text__field-wrap',
    iconLeft  ? 'ds-input-text__field-wrap--icon-left'  : '',
    iconRight ? 'ds-input-text__field-wrap--icon-right' : '',
  ].filter(Boolean).join(' ');

  const controlProps = {
    ref:                mergeRefs(internalRef, forwardedRef),
    id:                 inputId,
    name,
    placeholder,
    value,
    defaultValue,
    onChange:           handleChange,
    onFocus,
    onBlur,
    disabled:           state === 'disabled',
    readOnly:           state === 'read-only',
    'aria-label':       !label ? ariaLabel : undefined,
    'aria-describedby': describedBy,
    'aria-invalid':     state === 'error' ? 'true' : undefined,
    className:          'ds-input-text__control',
    ...nativeProps,
  };

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="ds-input-text__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={fieldWrapClass}>
        {iconLeft && (
          <span className={[
            'ds-input-text__icon ds-input-text__icon--left',
            iconLeftPrimary ? 'ds-input-text__icon--primary' : '',
          ].filter(Boolean).join(' ')}>
            <Icon name={iconLeft} size={24} />
          </span>
        )}

        {adaptive
          ? <textarea {...controlProps} rows={1} />
          : <input    {...controlProps} type={type} />
        }

        {iconRight && (
          <span className={[
            'ds-input-text__icon ds-input-text__icon--right',
            iconRightPrimary ? 'ds-input-text__icon--primary' : '',
          ].filter(Boolean).join(' ')}>
            <Icon name={iconRight} size={24} />
          </span>
        )}
      </div>

      {state !== 'error' && helperText && (
        <p className="ds-input-text__helper" id={helperId}>
          {helperText}
        </p>
      )}

      {state === 'error' && errorMessage && (
        <p className="ds-input-text__message" id={messageId} aria-live="polite">
          <span className="ds-input-text__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

InputText.displayName = 'InputText';
export default InputText;
