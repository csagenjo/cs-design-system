/**
 * InputCombobox — Componente atómico
 * CS Design System · v2.0
 *
 * 03/11/2026, alineado 1:1 con Figma (sets ".Combobox" e "Input Combobox"):
 * la caja es la COMÚN de los inputs (`_inputBase`: .ds-input-root con área
 * de foco de 4, .ds-input-box con Hover, Error, Read-only y Disabled, foco =
 * borde intacto + hueco focus-inner + anillo focus-outer por fuera). Antes
 * tenía tokens propios y en foco engordaba el borde. Estados: Initial
 * (placeholder) · Enabled · Hover · Focus · Error · Read-only (nuevo) ·
 * Disabled. El texto tecleado va en regular (decisión de Carol); la
 * sugerencia, en gris. La X de borrar tiene su propio anillo de foco.
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
 *
 * A11y-1 (21/10/2026): el átomo no pinta la lista de opciones. Con `open`, el
 * consumidor DEBE pasar `aria-controls` (id de su listbox) y, si resalta una
 * opción, `aria-activedescendant` — llegan al <input> por las props nativas.
 * `Combobox` ya lo hace (useListbox, modo activedescendant).
 */

import React, { forwardRef, useId, useRef } from 'react';
import { Icon } from './Icon';
import { mergeRefs, injectStyles, boxStateClass } from './_inputBase';
import { Chip } from './Chip';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';
import { VisuallyHidden } from './VisuallyHidden';

const css = `
.ds-input-combobox {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-combobox--full-width { display: flex; }
.ds-input-combobox__message { margin-top: var(--ds-input-validation-gap); }

.ds-input-combobox__field-wrap { position: relative; display: flex; }

/* La caja: .ds-input-box (borde, fondo, radio, hover, error, read-only,
   disabled). Aquí solo el layout interior: icono · valor · botones. */
.ds-input-combobox__field {
  width:       100%;
  display:     flex;
  align-items: center;
  gap:         var(--ds-input-field-icon-gap);
  padding:     var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  cursor:      text;
}
/* Foco: solo cuando el foco está en el texto (la X tiene el suyo). */
.ds-input-combobox__field:has(.ds-input-combobox__control:focus) {
  outline:        var(--ds-input-border-width-focus) solid var(--ds-input-focus-outer);
  outline-offset: var(--ds-input-border-width-focus);
  box-shadow:     0 0 0 var(--ds-input-border-width-focus) var(--ds-input-focus-inner);
}
.ds-input-combobox--disabled .ds-input-combobox__field { cursor: not-allowed; }
.ds-input-combobox--readonly .ds-input-combobox__field { cursor: default; }

.ds-input-combobox__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-input-icon-fg-primary);
}
.ds-input-combobox--disabled .ds-input-combobox__icon-left { color: var(--ds-input-icon-fg-disabled); }

.ds-input-combobox__value {
  flex:        1 1 0;   /* base 0: el texto ocupa el hueco libre, los botones no bajan de línea */
  min-width:   0;
  display:     flex;
  flex-wrap:   wrap;
  align-items: center;
  gap:         var(--ds-combobox-chips-gap);
}
.ds-input-combobox__value-wrap {
  position:    relative;
  flex:        1 1 0;
  min-width:   var(--ds-sizing-sm); /* hueco mínimo para escribir junto a los chips */
  display:     flex;
  align-items: center;
  /* la tipografía vive aquí: input y capa de sugerencia miden igual */
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
}
.ds-input-combobox__suggest {
  position:       absolute;
  inset:          0;
  display:        flex;
  align-items:    center;
  pointer-events: none;
  white-space:    pre;
  font:           inherit;
}
.ds-input-combobox__suggest-typed { visibility: hidden; }
.ds-input-combobox__suggest-remainder { color: var(--ds-combobox-autosuggest-fg); }

.ds-input-combobox__control {
  position:    relative;
  flex:        1 1 auto;
  min-width:   0;
  box-sizing:  border-box;
  width:       100%;
  margin:      0;
  border:      none;
  outline:     none;
  background:  transparent;
  padding:     0;
  font:        inherit;
  color:       var(--ds-input-fg-default);
  caret-color: var(--ds-combobox-caret-color);
}
.ds-input-combobox__control::placeholder { color: var(--ds-input-fg-placeholder); opacity: 1; }
.ds-input-combobox--disabled .ds-input-combobox__control { color: var(--ds-input-fg-disabled); cursor: not-allowed; }

.ds-input-combobox__buttons {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  gap:         var(--ds-combobox-buttons-gap);
}
.ds-input-combobox__delete,
.ds-input-combobox__chevron {
  display:         flex;
  align-items:     center;
  justify-content: center;
  margin:          0;
  padding:         0;
  border:          none;
  border-radius:   0;
  background:      transparent;
  cursor:          pointer;
}
.ds-input-combobox__delete { color: var(--ds-combobox-icondelete-fg); }
.ds-input-combobox__delete:focus-visible {
  outline:        var(--ds-input-border-width-focus) solid var(--ds-input-focus-outer);
  outline-offset: var(--ds-input-border-width-focus);
  box-shadow:     0 0 0 var(--ds-input-border-width-focus) var(--ds-input-focus-inner);
}
.ds-input-combobox__chevron { color: var(--ds-input-icon-fg-primary); transition: transform 0.12s; }
.ds-input-combobox__chevron:disabled { color: var(--ds-input-icon-fg-disabled); cursor: inherit; }
.ds-input-combobox__chevron--open { transform: rotate(180deg); }
`;

injectStyles('ds-input-combobox', css);

export const InputCombobox = forwardRef(function InputCombobox({
  label,
  ariaLabel,
  clearLabel  = 'Clear',          // A11y-3: + nombre del campo → "Clear Country"
  toggleLabel = 'Show options',   // nombre fijo; el estado lo da aria-expanded
  placeholder = '',
  value = '',
  onValueChange,
  autoSuggestText = '',
  multiple = false,
  selectedChips = [],
  onRemoveChip,
  iconLeft,
  state = 'default', // 'default' | 'error' | 'read-only' | 'disabled'
  readOnlyLabel = 'read only',
  helperText,
  errorMessage,
  fullWidth = false,
  open = false,
  onToggleOpen,
  onClear,
  required        = false, // A11y-4: asterisco visible + `required` nativo
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
  const readOnly = state === 'read-only';
  const locked = disabled || readOnly; // ni se abre, ni se borra, ni se quitan chips
  // en multiple cada chip ya lleva su propia X — un botón de borrado
  // adicional aquí no tiene destino claro (¿borra el último? ¿todos?) y
  // queda flotando sin más texto al lado; se queda solo para single.
  const hasValue = !multiple && value.length > 0 && !locked;
  // comparación case-insensitive (el usuario puede teclear "fr" y la opción
  // real ser "Francia") pero el slice conserva las mayúsculas originales de
  // la opción para el resto de la sugerencia
  const suggestRemainder = autoSuggestText.toLowerCase().startsWith(value.toLowerCase())
    ? autoSuggestText.slice(value.length)
    : '';

  const wrapperClass = [
    'ds-input-combobox ds-input-root',
    state === 'error' ? 'ds-input-combobox--error' : '',
    disabled ? 'ds-input-combobox--disabled' : '',
    readOnly ? 'ds-input-combobox--readonly' : '',
    fullWidth ? 'ds-input-combobox--full-width ds-input-root--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <FieldLabel className="ds-input-combobox__label ds-input-label" htmlFor={inputId} required={required} disabled={state === 'disabled'}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-combobox__helper ds-input-helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}

      <div className="ds-input-combobox__field-wrap">
        <div
          className={['ds-input-combobox__field ds-input-box', boxStateClass(state)].filter(Boolean).join(' ')}
          onClick={() => localInputRef.current?.focus()}
        >
          {iconLeft && (
            <span className="ds-input-combobox__icon-left" aria-hidden="true">
              {typeof iconLeft === 'string' ? <Icon name={iconLeft} size="sm" /> : iconLeft}
            </span>
          )}

          <div className="ds-input-combobox__value">
          {multiple && selectedChips.map((chip, i) => (
            <Chip
              key={chip.value ?? i}
              type="input"
              label={chip.label}
              disabled={locked}
              onRemove={() => onRemoveChip?.(i)}
            />
          ))}

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
              readOnly={readOnly}
              aria-readonly={readOnly || undefined}
              aria-label={!label ? ariaLabel : undefined}
              aria-describedby={describedBy}
              aria-invalid={state === 'error' ? 'true' : undefined}
          required={required}
              aria-expanded={open}
              aria-autocomplete="both"
              className="ds-input-combobox__control"
              {...nativeProps}
            />
            {readOnly && <VisuallyHidden>{`, ${readOnlyLabel}`}</VisuallyHidden>}
          </div>
          </div>

          <div className="ds-input-combobox__buttons">
            {hasValue && (
              <button
                type="button"
                className="ds-input-combobox__delete"
                aria-label={`${clearLabel} ${label || ariaLabel || ''}`.trim()}
                onClick={onClear}
              >
                <Icon name="x" size="xs" />
              </button>
            )}
            <button
              type="button"
              className={['ds-input-combobox__chevron', open ? 'ds-input-combobox__chevron--open' : ''].filter(Boolean).join(' ')}
              aria-label={toggleLabel}
              aria-expanded={open}
              disabled={locked}
              onClick={onToggleOpen}
              tabIndex={-1}
            >
              <Icon name="chevron-down" size="xs" />
            </button>
          </div>
        </div>
      </div>
      <ValidationMessage className="ds-input-combobox__message" id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

InputCombobox.displayName = 'InputCombobox';
export default InputCombobox;
