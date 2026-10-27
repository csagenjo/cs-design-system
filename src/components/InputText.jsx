import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useId,
} from 'react';
import { Icon } from './Icon';
import { mergeRefs, injectStyles, boxStateClass } from './_inputBase';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const css = `
.ds-input-text {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-text--full-width { display: flex; }

.ds-input-text__label { margin-bottom: var(--ds-input-label-gap); }

.ds-input-text__field-wrap {
  position: relative;
  display:  flex;
  width:    100%;
}

.ds-input-text__control {
  width:              100%;
  padding:            var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  font-size:          var(--ds-fontSize-body-sm);
  font-family:        inherit;
  line-height:        var(--ds-lineHeight-body-sm);
  -webkit-appearance: none;
}
/* Caja, hover, error, read-only, disabled y foco: .ds-input-box (_inputBase) */
.ds-input-text__control.is-readonly { cursor: default; }

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
  color: var(--ds-input-icon-fg);
}
.ds-input-text__icon--right {
  right: var(--ds-input-padding-hor);
  color: var(--ds-input-icon-fg);
}
.ds-input-text__icon--left.ds-input-text__icon--primary  { color: var(--ds-input-icon-fg-primary); }
.ds-input-text__icon--right.ds-input-text__icon--primary { color: var(--ds-input-icon-fg-primary); }
.ds-input-text--disabled .ds-input-text__icon--left      { color: var(--ds-input-icon-fg-disabled); }
.ds-input-text--disabled .ds-input-text__icon--right     { color: var(--ds-input-icon-fg-disabled); }

/* En adaptive el icono se ancla al borde superior del texto */
.ds-input-text--adaptive .ds-input-text__icon {
  top:       var(--ds-input-padding-ver);
  transform: none;
}

/* Padding compensado cuando hay iconos */
.ds-input-text__field-wrap--icon-left .ds-input-text__control {
  padding-left: calc(var(--ds-input-padding-hor) + var(--ds-input-icon-size) + var(--ds-input-field-icon-gap));
}
.ds-input-text__field-wrap--icon-right .ds-input-text__control {
  padding-right: calc(var(--ds-input-padding-hor) + var(--ds-input-icon-size) + var(--ds-input-field-icon-gap));
}

/* Helper text — aparece ENCIMA del campo */
.ds-input-text__helper  { margin-bottom: var(--ds-input-helper-gap); }
.ds-input-text__message { margin-top: var(--ds-input-validation-gap); }

`;

injectStyles('ds-input-text', css);


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
  required        = false, // A11y-4: asterisco visible + `required` nativo
  id,
  name,
  onFocus,
  onBlur,
  ...nativeProps
}, forwardedRef) {

  const internalRef = useRef(null);
  const generatedId = useId();
  const inputId     = id || generatedId;

  const helperId  = helperText ? `${inputId}-helper` : null;
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
    'ds-input-text ds-input-root',
    state === 'error'     ? 'ds-input-text--error'     : '',
    state === 'read-only' ? 'ds-input-text--readonly'  : '',
    state === 'disabled'  ? 'ds-input-text--disabled'  : '',
    adaptive              ? 'ds-input-text--adaptive'  : '',
    fullWidth             ? 'ds-input-text--full-width ds-input-root--full-width' : '',
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
    required,
    className:          ['ds-input-text__control ds-input-box', boxStateClass(state)].filter(Boolean).join(' '),
    ...nativeProps,
  };

  return (
    <div className={wrapperClass}>
      {label && (
        <FieldLabel className="ds-input-text__label" htmlFor={inputId} required={required} disabled={state === 'disabled'}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-text__helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}

      <div className={fieldWrapClass}>
        {iconLeft && (
          <span className={[
            'ds-input-text__icon ds-input-text__icon--left',
            iconLeftPrimary ? 'ds-input-text__icon--primary' : '',
          ].filter(Boolean).join(' ')}>
            <Icon name={iconLeft} size="sm" />
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
            <Icon name={iconRight} size="sm" />
          </span>
        )}
      </div>
      <ValidationMessage className="ds-input-text__message" id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

InputText.displayName = 'InputText';
export default InputText;
