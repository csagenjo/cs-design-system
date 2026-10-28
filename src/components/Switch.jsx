/**
 * Switch — Componente atómico
 * CS Design System · v1 (28/10/2026)
 *
 * Interruptor de encendido/apagado con efecto inmediato (no necesita "Guardar").
 * Figma: `Switch` (State Initial / Hover / Pressed / Focus / Read-only / Disabled
 * × Behavior Selected / Unselected; Show Label, Label) y su pieza `.Switch`
 * (track + pulgar, State × Behavior On / Off).
 *
 * Misma estructura que Checkbox v3: la fila (label + switch) es el control —
 * hover = fondo de la fila, pressed = opacidad, doble anillo de foco alrededor
 * de la fila dentro del área de foco de 4. Label a la izquierda, como Figma.
 *
 * ESTADOS (prop state):
 *   "default"  → Initial / Hover / Pressed / Focus por CSS
 *   "readOnly" → muestra el valor pero no se puede cambiar: track con el fondo
 *                de disabled y pulgar en color normal, sin hover ni pressed;
 *                sigue en el orden de Tab y se lee "read only"
 *   "disabled" → colores de disabled, fuera del orden de Tab
 *
 * ACCESIBILIDAD: <input type="checkbox" role="switch"> nativo (se lee "switch,
 * on/off"), Espacio lo cambia. Sin label visible, `ariaLabel` es obligatorio
 * (aviso en desarrollo).
 *
 * USO:
 *   <Switch label="Notifications" checked={on} onChange={(e) => setOn(e.target.checked)} />
 *   <Switch label="Auto-renew" checked state="readOnly" />
 *   <Switch ariaLabel="Dark mode" checked={dark} onChange={fn} />
 */

import React, { forwardRef, useId } from 'react';
import { injectStyles } from './_inputBase';
import { warnOnce } from './_devWarn';
import { VisuallyHidden } from './VisuallyHidden';

const css = `
.ds-switch {
  position:      relative;
  display:       inline-flex;
  align-items:   center;
  gap:           var(--ds-switch-gap);
  padding:       var(--ds-switch-padding);
  margin:        var(--ds-switch-focus-area-padding);
  border-radius: var(--ds-switch-border-radius-row);
  font-family:   inherit;
  cursor:        pointer;
  box-sizing:    border-box;
  transition:    background 0.12s, opacity 0.12s;
}
.ds-switch:not(.ds-switch--full-width) { align-self: flex-start; }
.ds-switch--full-width { display: flex; justify-content: space-between; width: calc(100% - 2 * var(--ds-switch-focus-area-padding)); }
.ds-switch--disabled,
.ds-switch--read-only { cursor: default; }
.ds-switch--disabled { cursor: not-allowed; }

.ds-switch__input {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

/* Track: 2 + pulgar + 2 de alto; ancho = 2 pulgares + 2 paddings */
.ds-switch__track {
  flex-shrink:     0;
  display:         flex;
  align-items:     center;
  justify-content: flex-start;
  box-sizing:      border-box;
  height:          var(--ds-switch-track-height);
  width:           calc(2 * var(--ds-switch-thumb-size) + 2 * var(--ds-switch-track-padding));
  padding:         var(--ds-switch-track-padding);
  border-radius:   var(--ds-switch-track-border-radius);
  background:      var(--ds-switch-track-bg-off);
  pointer-events:  none;
  transition:      background 0.12s;
}
.ds-switch__thumb {
  width:         var(--ds-switch-thumb-size);
  height:        var(--ds-switch-thumb-size);
  border-radius: 50%;
  background:    var(--ds-switch-thumb-fg-generic);
  transition:    transform 0.12s;
}
.ds-switch__input:checked + .ds-switch__track { background: var(--ds-switch-track-bg-on); }
.ds-switch__input:checked + .ds-switch__track .ds-switch__thumb { transform: translateX(var(--ds-switch-thumb-size)); }

.ds-switch--read-only .ds-switch__track,
.ds-switch--read-only .ds-switch__input:checked + .ds-switch__track { background: var(--ds-switch-track-bg-read-only); }
.ds-switch--read-only .ds-switch__thumb { background: var(--ds-switch-thumb-fg-read-only); }
.ds-switch--disabled .ds-switch__track,
.ds-switch--disabled .ds-switch__input:checked + .ds-switch__track { background: var(--ds-switch-track-bg-disabled); }
.ds-switch--disabled .ds-switch__thumb { background: var(--ds-switch-thumb-fg-disabled); }

/* Hover y pressed: toda la fila (Figma: fill / opacidad del frame Root) */
.ds-switch--interactive:hover  { background: var(--ds-switch-bg-hover); }
.ds-switch--interactive:active { opacity: var(--ds-switch-opacity-pressed); }

/* Foco: anillo doble alrededor de la fila, dentro del área de foco */
.ds-switch:has(.ds-switch__input:focus-visible) {
  outline:        var(--ds-switch-focus-width) solid var(--ds-switch-focus-outer);
  outline-offset: var(--ds-switch-focus-width);
  box-shadow:     0 0 0 var(--ds-switch-focus-width) var(--ds-switch-focus-inner);
}

.ds-switch__label {
  font-size:   var(--ds-fontSize-label-md);
  font-weight: var(--ds-font-weight-regular);
  line-height: var(--ds-lineHeight-label-md);
  color:       var(--ds-switch-label-fg);
  user-select: none;
}
.ds-switch--disabled .ds-switch__label { color: var(--ds-switch-label-disabled); }
`;

injectStyles('ds-switch', css);

export const Switch = forwardRef(function Switch({
  checked,
  defaultChecked,
  state        = 'default',  // 'default' | 'readOnly' | 'disabled'
  label,
  showLabel    = true,
  ariaLabel,
  readOnlyLabel = 'read only', // texto oculto en read-only (inglés por defecto)
  onChange,
  id,
  name,
  value,
  fullWidth    = false,
  className,
  ...rest
}, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const disabled = state === 'disabled';
  const readOnly = state === 'readOnly';
  const hasLabel = showLabel && label;

  if (!hasLabel && !ariaLabel) {
    warnOnce('Switch.unnamed', '[DS Switch] Sin label visible ni `ariaLabel`: el switch no tiene nombre para el lector de pantalla.');
  }

  const classes = [
    'ds-switch',
    disabled ? 'ds-switch--disabled' : readOnly ? 'ds-switch--read-only' : 'ds-switch--interactive',
    fullWidth ? 'ds-switch--full-width' : '',
    className || '',
  ].filter(Boolean).join(' ');

  // Read-only: el input sigue enfocable y anuncia su valor, pero no cambia.
  const guard = readOnly ? (e) => e.preventDefault() : undefined;

  return (
    <label className={classes} htmlFor={inputId}>
      {hasLabel && <span className="ds-switch__label">{label}</span>}
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="ds-switch__input"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        aria-label={hasLabel ? undefined : ariaLabel}
        onChange={readOnly ? () => {} : onChange}
        onClick={guard}
        onKeyDown={readOnly ? (e) => { if (e.key === ' ') e.preventDefault(); } : rest.onKeyDown}
      />
      <span className="ds-switch__track" aria-hidden="true"><span className="ds-switch__thumb" /></span>
      {readOnly && hasLabel && <VisuallyHidden>{`, ${readOnlyLabel}`}</VisuallyHidden>}
    </label>
  );
});

Switch.displayName = 'Switch';
export default Switch;
