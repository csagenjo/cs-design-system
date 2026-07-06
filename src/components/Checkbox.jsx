/**
 * Checkbox — Componente atómico
 * CS Design System · v2.0
 *
 * Tokens: todos los estilos vienen de tokens.css (--ds-*)
 * Iconos: lucide-react — Check (selected) · Minus (indeterminate)
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos  .
 *
 * ESTADOS (prop state):
 *   "default"  → Initial / Focus manejados por CSS puro
 *   "error"    → Borde + relleno rojo + errorMessage visible
 *   "disabled" → Opacidad reducida, no interactivo
 *
 * BEHAVIORS:
 *   checked=false              → Unselected
 *   checked=true               → Selected (checkmark teal)
 *   indeterminate=true         → Indeterminate (dash teal, ignora checked)
 *
 * USO:
 *   <Checkbox label="Acepto los términos" checked={v} onChange={fn} />
 *   <Checkbox label="Todos" indeterminate />
 *   <Checkbox label="Campo requerido" state="error" errorMessage="Obligatorio" />
 *   <Checkbox state="disabled" label="No disponible" />
 *   <Checkbox ariaLabel="Seleccionar fila" checked={v} onChange={fn} />
 */

import React, { useRef, useEffect, forwardRef, useId } from 'react';
import { Check, Minus } from 'lucide-react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-checkbox {
  display:        inline-flex;
  flex-direction: column;
  gap:            4px;
  font-family:    inherit;
}
.ds-checkbox--full-width { display: flex; width: 100%; }

.ds-checkbox__row {
  position:    relative;
  display:     inline-flex;
  align-items: center;
  gap:         8px;
  cursor:      pointer;
}
.ds-checkbox--disabled .ds-checkbox__row { cursor: not-allowed; }

/* Visually hidden native input — still focusable and operable */
.ds-checkbox__input {
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

/* Visual box */
.ds-checkbox__box {
  flex-shrink:     0;
  width:           var(--ds-checkbox-size);
  height:          var(--ds-checkbox-size);
  border:          var(--ds-checkbox-border-width) solid var(--ds-checkbox-border-default);
  border-radius:   var(--ds-checkbox-border-radius);
  background:      var(--ds-checkbox-bg-default);
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      background 0.12s, border-color 0.12s, opacity 0.12s;
  color:           var(--ds-checkbox-icon-fg);
  pointer-events:  none;
  box-sizing:      border-box;
}

/* Selected / Indeterminate — teal fill */
.ds-checkbox__input:checked       + .ds-checkbox__box,
.ds-checkbox__input:indeterminate + .ds-checkbox__box {
  background:   var(--ds-checkbox-bg-selected);
  border-color: var(--ds-checkbox-border-selected);
}

/* Error — unselected: red border only */
.ds-checkbox--error .ds-checkbox__box {
  border-color: var(--ds-checkbox-border-error);
}
/* Error — selected/indeterminate: red fill */
.ds-checkbox--error .ds-checkbox__input:checked       + .ds-checkbox__box,
.ds-checkbox--error .ds-checkbox__input:indeterminate + .ds-checkbox__box {
  background:   var(--ds-checkbox-bg-error);
  border-color: var(--ds-checkbox-border-error);
}

/* Disabled — muted surface */
.ds-checkbox--disabled .ds-checkbox__box {
  background:   var(--ds-checkbox-bg-disabled);
  border-color: var(--ds-checkbox-border-disabled);
  color:        var(--ds-checkbox-icon-disabled);
}

/* Hover — unselected, not disabled */
.ds-checkbox:not(.ds-checkbox--disabled) .ds-checkbox__row:hover
  .ds-checkbox__input:not(:checked):not(:indeterminate) + .ds-checkbox__box {
  border-color: var(--ds-checkbox-border-hover);
  background:   var(--ds-checkbox-bg-hover);
}

/* Focus ring on the visual box */
.ds-checkbox__input:focus-visible + .ds-checkbox__box {
  outline:        2px solid var(--ds-checkbox-focus-outer);
  outline-offset: 2px;
  box-shadow:     0 0 0 4px var(--ds-checkbox-focus-inner);
}

/* Hover + Focus combined */
.ds-checkbox:not(.ds-checkbox--disabled) .ds-checkbox__row:hover
  .ds-checkbox__input:focus-visible + .ds-checkbox__box {
  background:     var(--ds-checkbox-bg-hover);
  outline:        2px solid var(--ds-checkbox-focus-outer);
  outline-offset: 2px;
  box-shadow:     0 0 0 4px var(--ds-checkbox-focus-inner);
}

/* Icons — hidden by default, shown by state */
.ds-checkbox__icon {
  display:         none;
  align-items:     center;
  justify-content: center;
}
.ds-checkbox__input:checked       + .ds-checkbox__box .ds-checkbox__icon--check         { display: flex; }
.ds-checkbox__input:indeterminate + .ds-checkbox__box .ds-checkbox__icon--indeterminate { display: flex; }

/* Label text */
.ds-checkbox__label {
  font-size:   var(--ds-fontSize-label-sm);
  font-weight: var(--ds-font-weight-medium);
  color:       var(--ds-checkbox-label-fg);
  line-height: var(--ds-lineHeight-2xs);
  user-select: none;
}
.ds-checkbox--disabled .ds-checkbox__label { color: var(--ds-checkbox-label-disabled); }

/* Helper text */
.ds-checkbox__description {
  font-size:   var(--ds-fontSize-annotation-sm);
  color:       var(--ds-checkbox-description-fg);
  line-height: var(--ds-lineHeight-3xs);
  margin:      0;
}

/* Validation message */
.ds-checkbox__message {
  font-size:   var(--ds-fontSize-annotation-sm);
  line-height: var(--ds-lineHeight-3xs);
  margin:      0;
}
.ds-checkbox__message--error { color: var(--ds-checkbox-validation-fg); }
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

/* ─── Checkbox ─────────────────────────────────────────────────────────────── */

export const Checkbox = forwardRef(function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
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
}, forwardedRef) {

  const inputRef    = useRef(null);
  const generatedId = useId();
  const inputId     = id || generatedId;

  const descId = description                       ? `${inputId}-desc` : null;
  const msgId  = state === 'error' && errorMessage ? `${inputId}-msg`  : null;
  const describedBy = [descId, msgId].filter(Boolean).join(' ') || undefined;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS Checkbox] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  /* Sets the indeterminate DOM property — not settable via HTML attribute */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  const rootClasses = [
    'ds-checkbox',
    state === 'error'    ? 'ds-checkbox--error'      : '',
    state === 'disabled' ? 'ds-checkbox--disabled'   : '',
    fullWidth            ? 'ds-checkbox--full-width'  : '',
  ].filter(Boolean).join(' ');

  const inputProps = {
    ref:              mergeRefs(inputRef, forwardedRef),
    type:             'checkbox',
    className:        'ds-checkbox__input',
    id:               inputId,
    name,
    value,
    required,
    disabled:         state === 'disabled',
    onChange,
    onFocus,
    onBlur,
    'aria-label':     !label ? ariaLabel : undefined,
    'aria-describedby': describedBy,
    'aria-invalid':   state === 'error' ? 'true' : undefined,
    'aria-checked':   indeterminate ? 'mixed' : undefined,
  };

  /* Controlled vs uncontrolled */
  if (checked !== undefined) {
    inputProps.checked = checked;
  } else if (defaultChecked !== undefined) {
    inputProps.defaultChecked = defaultChecked;
  }

  return (
    <div className={rootClasses}>
      <label className="ds-checkbox__row">
        <input {...inputProps} />
        <span className="ds-checkbox__box">
          <span className="ds-checkbox__icon ds-checkbox__icon--check">
            <Check size={14} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="ds-checkbox__icon ds-checkbox__icon--indeterminate">
            <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
          </span>
        </span>
        {label && <span className="ds-checkbox__label">{label}</span>}
      </label>

      {description && (
        <p className="ds-checkbox__description" id={descId}>
          {description}
        </p>
      )}

      {state === 'error' && errorMessage && (
        <p
          className="ds-checkbox__message ds-checkbox__message--error"
          id={msgId}
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

// Controlado básico
<Checkbox label="Acepto los términos" checked={v} onChange={e => setV(e.target.checked)} />

// No controlado
<Checkbox label="Recordar sesión" defaultChecked />

// Indeterminado (estado "todos parcialmente seleccionados")
<Checkbox label="Seleccionar todos" indeterminate checked={false} onChange={fn} />

// Error
<Checkbox
  label="Campo obligatorio"
  state="error"
  errorMessage="Debes aceptar los términos para continuar"
  checked={v}
  onChange={fn}
/>

// Deshabilitado
<Checkbox label="No disponible" state="disabled" checked />

// Con descripción
<Checkbox
  label="Notificaciones por email"
  description="Recibirás un resumen diario de actividad"
  checked={v}
  onChange={fn}
/>

// Sin label visible — requiere ariaLabel
<Checkbox ariaLabel="Seleccionar fila 1" checked={v} onChange={fn} />

// Ref externo
const ref = useRef(null);
<Checkbox ref={ref} label="Foco programático" onChange={fn} />
ref.current.focus();
*/
