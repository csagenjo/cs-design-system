import React, { useRef, forwardRef, useId } from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-radio {
  display:        inline-flex;
  flex-direction: column;
  gap:            4px;
  font-family:    inherit;
}
.ds-radio--full-width { display: flex; width: 100%; }

.ds-radio__row {
  position:    relative;
  display:     inline-flex;
  align-items: center;
  gap:         8px;
  cursor:      pointer;
}
.ds-radio--disabled .ds-radio__row { cursor: not-allowed; }

/* Visually hidden native input — still focusable and operable */
.ds-radio__input {
  position:    absolute;
  width:       1px;
  height:      1px;
  padding:     0;
  margin:      -1px;
  overflow:    hidden;
  clip:        rect(0, 0, 0, 0);
  white-space: nowrap;
  border:      0;
}

/* Focus ring wrappers — transparent by default, borders appear on focus-visible */
.ds-radio__focus-ring {
  flex-shrink:    0;
  display:        inline-flex;
  border-radius:  var(--ds-radio-root-border-radius-generic);
  border:         var(--ds-radio-root-border-width-generic) solid transparent;
  pointer-events: none;
}

.ds-radio__control-wrap {
  display:       inline-flex;
  border-radius: var(--ds-radio-root-border-radius-generic);
  border:        var(--ds-radio-root-border-width-generic) solid transparent;
  padding:       var(--ds-radio-root-gap-generic);
  transition:    background 0.12s;
}

/* Visual circle */
.ds-radio__circle {
  width:           var(--ds-radio-root-size-generic);
  height:          var(--ds-radio-root-size-generic);
  border:          var(--ds-radio-root-border-width-generic) solid var(--ds-radio-root-border-color-generic);
  border-radius:   var(--ds-radio-root-border-radius-generic);
  background:      var(--ds-radio-root-bg-generic);
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      border-color 0.12s;
  box-sizing:      border-box;
}

/* Inner indicator dot — fills circle interior, hidden until checked */
.ds-radio__dot {
  width:         100%;
  height:        100%;
  border-radius: var(--ds-radio-indicator-border-radius-generic);
  background:    var(--ds-radio-indicator-fg-generic);
  display:       none;
}

/* Selected */
.ds-radio__input:checked + .ds-radio__focus-ring .ds-radio__circle {
  border-color: var(--ds-radio-root-border-color-selected);
}
.ds-radio__input:checked + .ds-radio__focus-ring .ds-radio__dot {
  display: block;
}

/* Error */
.ds-radio--error .ds-radio__circle {
  border-color: var(--ds-radio-root-border-color-error);
}
.ds-radio--error .ds-radio__input:checked + .ds-radio__focus-ring .ds-radio__dot {
  background: var(--ds-radio-indicator-fg-error);
}

/* Disabled — debe ganar a selected (el borde checked tiene más especificidad
   que .ds-radio--disabled .ds-radio__circle) para que el disabled seleccionado
   se vea gris, no con el borde de marca. */
.ds-radio--disabled .ds-radio__circle,
.ds-radio--disabled .ds-radio__input:checked + .ds-radio__focus-ring .ds-radio__circle {
  background:   var(--ds-radio-root-bg-disabled);
  border-color: var(--ds-radio-root-border-color-disabled);
}
.ds-radio--disabled .ds-radio__input:checked + .ds-radio__focus-ring .ds-radio__dot {
  background: var(--ds-radio-indicator-fg-disabled);
}

/* Hover — bg on control-wrap, not disabled */
.ds-radio:not(.ds-radio--disabled) .ds-radio__row:hover .ds-radio__control-wrap {
  background: var(--ds-radio-root-bg-hover);
}

/* Focus visible — show both ring borders */
.ds-radio__input:focus-visible + .ds-radio__focus-ring {
  border-color: var(--ds-radio-root-border-color-focus-outer);
}
.ds-radio__input:focus-visible + .ds-radio__focus-ring .ds-radio__control-wrap {
  border-color: var(--ds-radio-root-border-color-focus-inner);
}

/* Label text */
.ds-radio__label {
  font-size:   var(--ds-fontSize-label-sm);
  font-weight: var(--ds-font-weight-medium);
  color:       var(--ds-radio-label-fg-generic);
  line-height: var(--ds-lineHeight-2xs);
  user-select: none;
}
.ds-radio--disabled .ds-radio__label { color: var(--ds-radio-label-fg-disabled); }

/* Helper text */
.ds-radio__description {
  font-size:   var(--ds-fontSize-annotation-sm);
  color:       var(--ds-radio-description-fg);
  line-height: var(--ds-lineHeight-3xs);
  margin:      0;
}

/* Validation message */
.ds-radio__message {
  font-size:   var(--ds-fontSize-annotation-sm);
  line-height: var(--ds-lineHeight-3xs);
  margin:      0;
}
.ds-radio__message--error { color: var(--ds-radio-validation-fg); }
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

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function mergeRefs(...refs) {
  return (el) => refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });
}

/* ─── Radio ─────────────────────────────────────────────────────────────────── */

export const Radio = forwardRef(function Radio({
  checked,
  defaultChecked,
  state         = 'default',
  label,
  description,
  errorMessage,
  onChange,
  onFocus,
  onBlur,
  id,
  name,
  value,
  required      = false,
  ariaLabel,
  fullWidth     = false,
  showLabel     = true,
}, forwardedRef) {

  const inputRef    = useRef(null);
  const generatedId = useId();
  const inputId     = id || generatedId;

  const descId = description                       ? `${inputId}-desc` : null;
  const msgId  = state === 'error' && errorMessage ? `${inputId}-msg`  : null;
  const describedBy = [descId, msgId].filter(Boolean).join(' ') || undefined;

  if (process.env.NODE_ENV !== 'production' && !(label && showLabel) && !ariaLabel) {
    console.warn('[DS Radio] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const rootClasses = [
    'ds-radio',
    state === 'error'    ? 'ds-radio--error'     : '',
    state === 'disabled' ? 'ds-radio--disabled'  : '',
    fullWidth            ? 'ds-radio--full-width' : '',
  ].filter(Boolean).join(' ');

  const inputProps = {
    ref:               mergeRefs(inputRef, forwardedRef),
    type:              'radio',
    className:         'ds-radio__input',
    id:                inputId,
    name,
    value,
    required,
    disabled:          state === 'disabled',
    onChange,
    onFocus,
    onBlur,
    'aria-label':      (!label || !showLabel) ? ariaLabel : undefined,
    'aria-describedby': describedBy,
    'aria-invalid':    state === 'error' ? 'true' : undefined,
  };

  if (checked !== undefined) {
    inputProps.checked = checked;
  } else if (defaultChecked !== undefined) {
    inputProps.defaultChecked = defaultChecked;
  }

  return (
    <div className={rootClasses}>
      <label className="ds-radio__row">
        <input {...inputProps} />
        <span className="ds-radio__focus-ring">
          <span className="ds-radio__control-wrap">
            <span className="ds-radio__circle">
              <span className="ds-radio__dot" aria-hidden="true" />
            </span>
          </span>
        </span>
        {label && showLabel && <span className="ds-radio__label">{label}</span>}
      </label>

      {description && (
        <p className="ds-radio__description" id={descId}>
          {description}
        </p>
      )}

      {state === 'error' && errorMessage && (
        <p
          className="ds-radio__message ds-radio__message--error"
          id={msgId}
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

// Controlado básico (requiere name para agrupar)
<Radio label="Opción A" name="grupo" value="a" checked={v === 'a'} onChange={fn} />
<Radio label="Opción B" name="grupo" value="b" checked={v === 'b'} onChange={fn} />

// No controlado
<Radio label="Recordar" name="pref" value="yes" defaultChecked />

// Error
<Radio
  label="Campo obligatorio"
  name="grupo"
  value="a"
  state="error"
  errorMessage="Selecciona una opción"
  checked={v === 'a'}
  onChange={fn}
/>

// Deshabilitado
<Radio label="No disponible" name="grupo" value="c" state="disabled" />

// Con descripción
<Radio
  label="Transferencia SEPA"
  description="Disponible en 1-2 días hábiles"
  name="pago"
  value="sepa"
  checked={v === 'sepa'}
  onChange={fn}
/>

// Sin label visible — requiere ariaLabel
<Radio ariaLabel="Seleccionar fila 1" name="filas" value="1" checked={v === '1'} onChange={fn} />

// Ref externo
const ref = useRef(null);
<Radio ref={ref} label="Foco programático" name="grupo" value="a" onChange={fn} />
ref.current.focus();
*/
