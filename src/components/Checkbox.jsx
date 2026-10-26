/**
 * Checkbox — Componente atómico
 * CS Design System · v2.0
 *
 * Tokens: todos los estilos vienen de tokens.css (--ds-*)
 * Iconos: átomo Icon — check (selected) · minus (indeterminate), 16 px
 * Sin hex ni px sueltos.
 *
 * v3 (26/10/2026, alineado con Figma): la fila entera (caja + label) es el
 * control — hover, pressed y anillo de foco la rodean; área de foco de 4 px
 * (mismo patrón que Button). La ayuda y el error ya no van en el checkbox:
 * los pone CheckboxGroup (un check único obligatorio también va en un grupo
 * con su pregunta, regla de Carol 21/10).
 *
 * ESTADOS (prop state):
 *   "default"  → Initial / Focus manejados por CSS puro
 *   "error"    → Borde + relleno rojo (el mensaje lo pone CheckboxGroup)
 *   "disabled" → Colores de disabled, no interactivo
 *
 * BEHAVIORS:
 *   checked=false              → Unselected
 *   checked=true               → Selected (checkmark teal)
 *   indeterminate=true         → Indeterminate (dash teal, ignora checked)
 *
 * USO:
 *   <Checkbox label="Acepto los términos" checked={v} onChange={fn} />
 *   <Checkbox label="Todos" indeterminate />
 *   <Checkbox label="Campo requerido" state="error" />
 *   <Checkbox state="disabled" label="No disponible" />
 *   <Checkbox ariaLabel="Seleccionar fila" checked={v} onChange={fn} />
 */

import { CheckboxGroupContext } from './_checkboxGroupContext';
import React, { useRef, useEffect, forwardRef, useId, useContext } from 'react';
import { Icon } from './Icon';
import { warnOnce } from './_devWarn';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
/* Raíz = fila entera (caja + label), igual que Figma (26/10/2026):
   - área de foco de 4 px alrededor (margin), el anillo queda dentro de la caja
     del componente y mide lo mismo en todos los estados;
   - padding 2 + gap 6, radio 8; hover = fondo de la fila; pressed = opacidad. */
.ds-checkbox {
  position:      relative;
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-checkbox-label-gap);
  padding:       var(--ds-checkbox-padding);
  margin:        var(--ds-checkbox-focus-area-padding);
  border-radius: var(--ds-checkbox-border-radius-row);
  font-family:   inherit;
  cursor:        pointer;
  box-sizing:    border-box;
  transition:    background 0.12s, opacity 0.12s;
}
.ds-checkbox--full-width { display: flex; width: calc(100% - 2 * var(--ds-checkbox-focus-area-padding)); }
.ds-checkbox--disabled { cursor: not-allowed; }

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

/* Hueco de 24 (checkbox/all/root/size) con la caja de 20 centrada (.CheckStates) */
.ds-checkbox__slot {
  flex-shrink:     0;
  width:           var(--ds-checkbox-size);
  height:          var(--ds-checkbox-size);
  display:         flex;
  align-items:     center;
  justify-content: center;
  pointer-events:  none;
}
.ds-checkbox__box {
  width:           var(--ds-checkbox-box-size);
  height:          var(--ds-checkbox-box-size);
  border:          var(--ds-checkbox-border-width) solid var(--ds-checkbox-border-default);
  border-radius:   var(--ds-checkbox-border-radius);
  background:      var(--ds-checkbox-bg-default);
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      background 0.12s, border-color 0.12s;
  color:           var(--ds-checkbox-icon-fg);
  box-sizing:      border-box;
}

/* Selected / Indeterminate */
.ds-checkbox__input:checked       + .ds-checkbox__slot .ds-checkbox__box,
.ds-checkbox__input:indeterminate + .ds-checkbox__slot .ds-checkbox__box {
  background:   var(--ds-checkbox-bg-selected);
  border-color: var(--ds-checkbox-border-selected);
}

/* Error */
.ds-checkbox--error .ds-checkbox__box { border-color: var(--ds-checkbox-border-error); }
.ds-checkbox--error .ds-checkbox__input:checked       + .ds-checkbox__slot .ds-checkbox__box,
.ds-checkbox--error .ds-checkbox__input:indeterminate + .ds-checkbox__slot .ds-checkbox__box {
  background:   var(--ds-checkbox-bg-error);
  border-color: var(--ds-checkbox-border-error);
}

/* Disabled — gana a selected/indeterminate */
.ds-checkbox--disabled .ds-checkbox__box,
.ds-checkbox--disabled .ds-checkbox__input:checked       + .ds-checkbox__slot .ds-checkbox__box,
.ds-checkbox--disabled .ds-checkbox__input:indeterminate + .ds-checkbox__slot .ds-checkbox__box {
  background:   var(--ds-checkbox-bg-disabled);
  border-color: var(--ds-checkbox-border-disabled);
  color:        var(--ds-checkbox-icon-disabled);
}

/* Hover y pressed: toda la fila (Figma: fill / opacidad del frame Root) */
.ds-checkbox:not(.ds-checkbox--disabled):hover  { background: var(--ds-checkbox-bg-hover); }
.ds-checkbox:not(.ds-checkbox--disabled):active { opacity: var(--ds-checkbox-opacity-pressed); }

/* Foco: anillo doble alrededor de la fila, dentro del área de foco */
.ds-checkbox:has(.ds-checkbox__input:focus-visible) {
  outline:        var(--ds-checkbox-focus-width) solid var(--ds-checkbox-focus-outer);
  outline-offset: var(--ds-checkbox-focus-width);
  box-shadow:     0 0 0 var(--ds-checkbox-focus-width) var(--ds-checkbox-focus-inner);
}

/* Iconos — ocultos salvo en su estado */
.ds-checkbox__icon { display: none; }
.ds-checkbox__input:checked:not(:indeterminate) + .ds-checkbox__slot .ds-checkbox__icon--check { display: flex; }
.ds-checkbox__input:indeterminate + .ds-checkbox__slot .ds-checkbox__icon--indeterminate       { display: flex; }

/* Label — Label/md regular (fontSize/label/md · fontLheight/label/md) */
.ds-checkbox__label {
  font-size:   var(--ds-fontSize-label-md);
  font-weight: var(--ds-font-weight-regular);
  line-height: var(--ds-lineHeight-label-md);
  color:       var(--ds-checkbox-label-fg);
  user-select: none;
}
.ds-checkbox--disabled .ds-checkbox__label { color: var(--ds-checkbox-label-disabled); }
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
  description,   // eliminado en v3: la ayuda va en CheckboxGroup
  errorMessage,  // eliminado en v3: el error va en CheckboxGroup
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

  // A11y-4: dentro de un CheckboxGroup, el grupo pone name, marcado,
  // obligatorio (solo si es la única opción), error y deshabilitado. El
  // asterisco de obligatorio va en la leyenda del grupo, nunca en la opción
  // (regla de Carol, 21/10) — un check suelto con `required` no lo pinta.
  const group = useContext(CheckboxGroupContext);
  if (group) {
    name = group.name;
    if (checked === undefined) checked = group.values.includes(value);
    if (!onChange) onChange = (e) => group.toggle(value, e.target.checked);
    required = group.required;
    if (group.disabled) state = 'disabled';
    else if (group.invalid && state === 'default') state = 'error';
  }

  const inputRef    = useRef(null);
  const generatedId = useId();
  const inputId     = id || generatedId;

  if (description || errorMessage) {
    warnOnce('Checkbox.helpError', '[DS Checkbox] `description` y `errorMessage` se eliminaron en v3: la ayuda y el error los pone CheckboxGroup.');
  }
  const describedBy = group?.describedBy || undefined;

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
    // A11y-4: sin aria-checked — en un checkbox nativo el estado mixto lo da la propiedad .indeterminate (arriba)
  };

  /* Controlled vs uncontrolled */
  if (checked !== undefined) {
    inputProps.checked = checked;
  } else if (defaultChecked !== undefined) {
    inputProps.defaultChecked = defaultChecked;
  }

  return (
    <label className={rootClasses}>
      <input {...inputProps} />
      <span className="ds-checkbox__slot">
        <span className="ds-checkbox__box">
          <span className="ds-checkbox__icon ds-checkbox__icon--check"><Icon name="check" size="2xs" strokeWidth={2} /></span>
          <span className="ds-checkbox__icon ds-checkbox__icon--indeterminate"><Icon name="minus" size="2xs" strokeWidth={2} /></span>
        </span>
      </span>
      {label && <span className="ds-checkbox__label">{label}</span>}
    </label>
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

// Error (el mensaje lo pone CheckboxGroup)
<Checkbox label="Campo obligatorio" state="error" checked={v} onChange={fn} />

// Deshabilitado
<Checkbox label="No disponible" state="disabled" checked />

// Sin label visible — requiere ariaLabel
<Checkbox ariaLabel="Seleccionar fila 1" checked={v} onChange={fn} />

// Ref externo
const ref = useRef(null);
<Checkbox ref={ref} label="Foco programático" onChange={fn} />
ref.current.focus();
*/
