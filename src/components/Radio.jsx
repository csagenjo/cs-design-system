import React, { useRef, forwardRef, useId, useContext } from 'react';
import { RadioGroupContext } from './_radioGroupContext';
import { warnOnce } from './_devWarn';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
/* Raíz = fila entera (círculo + label), igual que Figma (26/10/2026): área de
   foco de 4 px (margin), padding 2 + gap 6, radio 8; hover = fondo de la fila,
   pressed = opacidad, anillo de foco doble alrededor de la fila. */
.ds-radio {
  position:      relative;
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-radio-root-gap-generic);
  padding:       var(--ds-radio-root-padding-generic);
  margin:        var(--ds-radio-root-focus-area-padding);
  border-radius: var(--ds-radio-root-border-radius-row);
  font-family:   inherit;
  cursor:        pointer;
  box-sizing:    border-box;
  transition:    background 0.12s, opacity 0.12s;
}
.ds-radio--full-width { display: flex; width: calc(100% - 2 * var(--ds-radio-root-focus-area-padding)); }
.ds-radio--disabled { cursor: not-allowed; }

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

/* Hueco de 24 con el círculo de 20 centrado (.RadioStates) */
.ds-radio__slot {
  flex-shrink:     0;
  width:           var(--ds-radio-root-size-generic);
  height:          var(--ds-radio-root-size-generic);
  display:         flex;
  align-items:     center;
  justify-content: center;
  pointer-events:  none;
}
.ds-radio__circle {
  width:           var(--ds-radio-circle-size);
  height:          var(--ds-radio-circle-size);
  border:          var(--ds-radio-root-border-width-generic) solid var(--ds-radio-root-border-color-generic);
  border-radius:   var(--ds-radio-root-border-radius-generic);
  background:      var(--ds-radio-root-bg-generic);
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      border-color 0.12s;
  box-sizing:      border-box;
}
/* Indicador: la mitad del círculo (10 de 20, como el indicator de Figma) */
.ds-radio__dot {
  width:         50%;
  height:        50%;
  flex-shrink:   0;
  border-radius: var(--ds-radio-indicator-border-radius-generic);
  background:    var(--ds-radio-indicator-fg-generic);
  display:       none;
}

/* Selected */
.ds-radio__input:checked + .ds-radio__slot .ds-radio__circle { border-color: var(--ds-radio-root-border-color-selected); }
.ds-radio__input:checked + .ds-radio__slot .ds-radio__dot    { display: block; }

/* Error */
.ds-radio--error .ds-radio__circle { border-color: var(--ds-radio-root-border-color-error); }
.ds-radio--error .ds-radio__input:checked + .ds-radio__slot .ds-radio__dot { background: var(--ds-radio-indicator-fg-error); }

/* Disabled — gana a selected */
.ds-radio--disabled .ds-radio__circle,
.ds-radio--disabled .ds-radio__input:checked + .ds-radio__slot .ds-radio__circle {
  background:   var(--ds-radio-root-bg-disabled);
  border-color: var(--ds-radio-root-border-color-disabled);
}
.ds-radio--disabled .ds-radio__input:checked + .ds-radio__slot .ds-radio__dot { background: var(--ds-radio-indicator-fg-disabled); }

/* Hover y pressed: toda la fila */
.ds-radio:not(.ds-radio--disabled):hover  { background: var(--ds-radio-root-bg-hover); }
.ds-radio:not(.ds-radio--disabled):active { opacity: var(--ds-radio-root-opacity-pressed); }

/* Foco: anillo doble alrededor de la fila, dentro del área de foco */
.ds-radio:has(.ds-radio__input:focus-visible) {
  outline:        var(--ds-radio-root-border-width-focus) solid var(--ds-radio-root-border-color-focus-outer);
  outline-offset: var(--ds-radio-root-border-width-focus);
  box-shadow:     0 0 0 var(--ds-radio-root-border-width-focus) var(--ds-radio-root-border-color-focus-inner);
}

/* Label — Label/md regular */
.ds-radio__label {
  font-size:   var(--ds-fontSize-label-md);
  font-weight: var(--ds-font-weight-regular);
  line-height: var(--ds-lineHeight-label-md);
  color:       var(--ds-radio-label-fg-generic);
  user-select: none;
}
.ds-radio--disabled .ds-radio__label { color: var(--ds-radio-label-fg-disabled); }
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
  description,   // eliminado en v2: la ayuda va en RadioGroup
  errorMessage,  // eliminado en v2: el error va en RadioGroup
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

  // A11y-4: dentro de un RadioGroup, el grupo pone name, valor elegido,
  // obligatorio, error y deshabilitado. El asterisco va en la leyenda del
  // grupo, nunca en la opción (regla de Carol, 21/10).
  const group = useContext(RadioGroupContext);
  if (group) {
    name = group.name;
    if (checked === undefined && group.value !== undefined) checked = group.value === value;
    if (!onChange && group.onChange) onChange = () => group.onChange(value);
    if (group.required) required = true;
    if (group.disabled) state = 'disabled';
    else if (group.invalid && state === 'default') state = 'error';
  }

  const inputRef    = useRef(null);
  const generatedId = useId();
  const inputId     = id || generatedId;

  if (description || errorMessage) {
    warnOnce('Radio.helpError', '[DS Radio] `description` y `errorMessage` se eliminaron en v2: la ayuda y el error los pone RadioGroup.');
  }
  const describedBy = group?.describedBy || undefined;

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
    <label className={rootClasses}>
      <input {...inputProps} />
      <span className="ds-radio__slot">
        <span className="ds-radio__circle">
          <span className="ds-radio__dot" aria-hidden="true" />
        </span>
      </span>
      {label && showLabel && <span className="ds-radio__label">{label}</span>}
    </label>
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

// Error (el mensaje lo pone RadioGroup)
<Radio label="Campo obligatorio" name="grupo" value="a" state="error" checked={v === 'a'} onChange={fn} />

// Deshabilitado
<Radio label="No disponible" name="grupo" value="c" state="disabled" />

// Mejor: siempre dentro de un RadioGroup, que pone pregunta, ayuda y error
<RadioGroup label="Método de pago" helperText="Disponible en 1-2 días hábiles" name="pago" value={v} onChange={setV}>
  <Radio label="Transferencia SEPA" value="sepa" />
</RadioGroup>

// Sin label visible — requiere ariaLabel
<Radio ariaLabel="Seleccionar fila 1" name="filas" value="1" checked={v === '1'} onChange={fn} />

// Ref externo
const ref = useRef(null);
<Radio ref={ref} label="Foco programático" name="grupo" value="a" onChange={fn} />
ref.current.focus();
*/
