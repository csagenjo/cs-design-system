/**
 * InputCombobox — Componente atómico
 * CS Design System · v1.0
 *
 * El campo del Combobox — Label + Helper + Field + Validation, mismo
 * borrowing de `--ds-input-*` (InputCommon) que InputText/InputDropdown.
 * Puramente presentacional/controlado: no gestiona apertura, filtrado ni
 * navegación por teclado — eso es responsabilidad del organismo
 * `Combobox.jsx`, que le pasa todo por props (mismo criterio que
 * SelectorInvoker es al Selector).
 *
 * `multiple` decide el modo: `false` (por defecto) pinta `value` como texto
 * plano (Figma: `Input Type=Text`); `true` pinta `selectedChips` como
 * instancias reales del átomo `Chip` (`type="input"`, ya construido — no se
 * reimplementa), con su propio botón de eliminar por chip (Figma:
 * `Input Type=Input Chip`).
 *
 * El cursor de texto NO se fabrica a mano — Figma tiene un vector `Caret`
 * propio, pero en HTML un `<input>` real ya trae su cursor nativo; alcanza
 * con `caret-color` (`--ds-combobox-caret-color`) para que sea el color
 * correcto, sin reimplementar un elemento que el navegador ya da gratis.
 *
 * `autoSuggestText` (la parte de la sugerencia que falta por escribir, tipo
 * autocompletado de barra de direcciones) se pinta con la técnica clásica de
 * superposición: una capa invisible con el texto ya tecleado (misma fuente/
 * padding, para que mida igual) seguida del resto en gris, colocada DETRÁS
 * del `<input>` real (que lleva fondo transparente) — así el texto tecleado
 * (negro, del input) y la sugerencia (gris, de la capa de abajo) quedan
 * pixel a pixel alineados sin duplicar el texto visualmente.
 *
 * USO:
 *   <InputCombobox label="País" value={value} onValueChange={setValue} ariaLabel="País" />
 *   <InputCombobox label="Etiquetas" multiple selectedChips={chips} onRemoveChip={fn} />
 */

import React, { forwardRef, useId, useRef } from 'react';
import { AlertCircle, ChevronDown, X } from 'lucide-react';
import { mergeRefs, injectStyles } from './_inputBase';
import { Chip } from './Chip';

const css = `
.ds-input-combobox {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-combobox--full-width { display: flex; width: 100%; }

.ds-input-combobox__label {
  font-size:     var(--ds-fontSize-label-md);
  font-weight:   var(--ds-font-weight-bold);
  color:         var(--ds-input-fg-label);
  cursor:        pointer;
  line-height:   var(--ds-lineHeight-xs);
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-combobox--disabled .ds-input-combobox__label {
  color:  var(--ds-input-label-fg-disabled);
  cursor: default;
}

.ds-input-combobox__helper {
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: var(--ds-lineHeight-xs);
}
.ds-input-combobox--disabled .ds-input-combobox__helper { color: var(--ds-input-helper-fg-disabled); }

.ds-input-combobox__field-wrap {
  position: relative;
  display:  flex;
}

.ds-input-combobox__field {
  box-sizing:    border-box;
  width:         100%;
  min-height:    var(--ds-input-min-height);
  display:       flex;
  align-items:   center;
  flex-wrap:     wrap;
  gap:           6px;
  padding:       var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  background:    var(--ds-combobox-root-bg);
  border:        var(--ds-combobox-root-border-width) solid var(--ds-combobox-root-border-color);
  border-radius: var(--ds-input-border-radius);
  cursor:        text;
  transition:    border-color 0.12s, background 0.12s;
}
.ds-input-combobox__field:has(.ds-input-combobox__control:focus) {
  border-color:   var(--ds-combobox-root-border-color-focus-inner);
  border-width:   var(--ds-combobox-root-border-width-focus);
  outline:        2px solid var(--ds-combobox-root-border-color-focus-outer);
  outline-offset: 2px;
}
.ds-input-combobox--error .ds-input-combobox__field {
  border-color: var(--ds-combobox-root-border-color-error);
}
.ds-input-combobox--disabled .ds-input-combobox__field {
  background:   var(--ds-combobox-root-bg-disabled);
  border-color: var(--ds-combobox-root-border-color-disabled);
  cursor:       not-allowed;
}

.ds-input-combobox__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-combobox-icon-fg);
}
.ds-input-combobox--disabled .ds-input-combobox__icon-left { color: var(--ds-combobox-icon-fg-disabled); }

.ds-input-combobox__value-wrap {
  position: relative;
  flex:     1 1 auto;
  min-width: 60px;
  display:  flex;
  align-items: center;
}
.ds-input-combobox__suggest {
  position:      absolute;
  inset:         0;
  display:       flex;
  align-items:   center;
  pointer-events: none;
  white-space:   pre;
  font:          inherit;
}
.ds-input-combobox__suggest-typed { visibility: hidden; }
.ds-input-combobox__suggest-remainder { color: var(--ds-combobox-autosuggest-fg); }

.ds-input-combobox__control {
  position:      relative;
  flex:          1 1 auto;
  min-width:     40px;
  box-sizing:    border-box;
  width:         100%;
  border:        none;
  outline:       none;
  background:    transparent;
  padding:       0;
  font-size:     var(--ds-fontSize-body-sm);
  font-family:   inherit;
  line-height:   var(--ds-lineHeight-xs);
  color:         var(--ds-combobox-text-fg);
  caret-color:   var(--ds-combobox-caret-color);
}
.ds-input-combobox__control::placeholder { color: var(--ds-input-fg-placeholder); }
.ds-input-combobox--disabled .ds-input-combobox__control { color: var(--ds-combobox-text-fg-disabled); }

.ds-input-combobox__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1 1 auto;
}

.ds-input-combobox__buttons {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  gap:         4px;
}
.ds-input-combobox__delete {
  display:        flex;
  align-items:    center;
  justify-content: center;
  width:          24px;
  height:         24px;
  padding:        0;
  border:         none;
  background:     transparent;
  color:          var(--ds-combobox-icondelete-fg);
  cursor:         pointer;
  border-radius:  50%;
}
.ds-input-combobox--disabled .ds-input-combobox__delete { display: none; }
.ds-input-combobox__chevron {
  display:        flex;
  align-items:    center;
  justify-content: center;
  width:          24px;
  height:         24px;
  padding:        0;
  border:         none;
  background:     transparent;
  color:          var(--ds-combobox-icon-fg);
  cursor:         pointer;
  transition:     transform 0.12s;
}
.ds-input-combobox--disabled .ds-input-combobox__chevron { color: var(--ds-combobox-icon-fg-disabled); cursor: not-allowed; }
.ds-input-combobox__chevron--open { transform: rotate(180deg); }

.ds-input-combobox__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: var(--ds-lineHeight-xs);
}
.ds-input-combobox__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
`;

injectStyles('ds-input-combobox', css);

export const InputCombobox = forwardRef(function InputCombobox({
  label,
  ariaLabel,
  placeholder = '',
  value = '',
  onValueChange,
  autoSuggestText = '',
  multiple = false,
  selectedChips = [],
  onRemoveChip,
  iconLeft,
  state = 'default', // 'default' | 'error' | 'disabled'
  helperText,
  errorMessage,
  fullWidth = false,
  open = false,
  onToggleOpen,
  onClear,
  id,
  name,
  onFocus,
  onBlur,
  onKeyDown,
  ...nativeProps
}, forwardedRef) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = helperText ? `${inputId}-helper` : null;
  const messageId = state === 'error' && errorMessage ? `${inputId}-msg` : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputCombobox] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const localInputRef = useRef(null);
  const disabled = state === 'disabled';
  // en multiple cada chip ya lleva su propia X — un botón de borrado
  // adicional aquí no tiene destino claro (¿borra el último? ¿todos?) y
  // queda flotando sin más texto al lado; se queda solo para single.
  const hasValue = !multiple && value.length > 0;
  // comparación case-insensitive (el usuario puede teclear "fr" y la opción
  // real ser "Francia") pero el slice conserva las mayúsculas originales de
  // la opción para el resto de la sugerencia
  const suggestRemainder = autoSuggestText.toLowerCase().startsWith(value.toLowerCase())
    ? autoSuggestText.slice(value.length)
    : '';

  const wrapperClass = [
    'ds-input-combobox',
    state === 'error' ? 'ds-input-combobox--error' : '',
    disabled ? 'ds-input-combobox--disabled' : '',
    fullWidth ? 'ds-input-combobox--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="ds-input-combobox__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-input-combobox__helper" id={helperId}>
          {helperText}
        </p>
      )}

      <div className="ds-input-combobox__field-wrap">
        <div
          className="ds-input-combobox__field"
          onClick={() => localInputRef.current?.focus()}
        >
          {iconLeft && (
            <span className="ds-input-combobox__icon-left" aria-hidden="true">
              {iconLeft}
            </span>
          )}

          {multiple && selectedChips.length > 0 && (
            <div className="ds-input-combobox__chips">
              {selectedChips.map((chip, i) => (
                <Chip
                  key={chip.value ?? i}
                  type="input"
                  label={chip.label}
                  onRemove={disabled ? undefined : () => onRemoveChip?.(i)}
                />
              ))}
            </div>
          )}

          <div className="ds-input-combobox__value-wrap">
            {suggestRemainder && (
              <span className="ds-input-combobox__suggest" aria-hidden="true">
                <span className="ds-input-combobox__suggest-typed">{value}</span>
                <span className="ds-input-combobox__suggest-remainder">{suggestRemainder}</span>
              </span>
            )}
            <input
              ref={mergeRefs(localInputRef, forwardedRef)}
              id={inputId}
              name={name}
              type="text"
              role="combobox"
              autoComplete="off"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onValueChange?.(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              disabled={disabled}
              aria-label={!label ? ariaLabel : undefined}
              aria-describedby={describedBy}
              aria-invalid={state === 'error' ? 'true' : undefined}
              aria-expanded={open}
              aria-autocomplete="list"
              className="ds-input-combobox__control"
              {...nativeProps}
            />
          </div>

          <div className="ds-input-combobox__buttons">
            {hasValue && !disabled && (
              <button
                type="button"
                className="ds-input-combobox__delete"
                aria-label="Borrar"
                onClick={onClear}
              >
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className={['ds-input-combobox__chevron', open ? 'ds-input-combobox__chevron--open' : ''].filter(Boolean).join(' ')}
              aria-label={open ? 'Cerrar lista' : 'Abrir lista'}
              disabled={disabled}
              onClick={onToggleOpen}
              tabIndex={-1}
            >
              <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {state === 'error' && errorMessage && (
        <p className="ds-input-combobox__message" id={messageId} aria-live="polite">
          <span className="ds-input-combobox__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

InputCombobox.displayName = 'InputCombobox';
export default InputCombobox;
