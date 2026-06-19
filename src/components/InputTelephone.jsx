/**
 * InputTelephone — Componente atómico
 * CS Design System · v1.0
 *
 * Tokens: --ds-input-* + --ds-input-telephone-* (tokens.css)
 * Iconos: lucide-react — ChevronDown (dropdown país) · AlertCircle (error)
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos.
 *
 * ESTRUCTURA:
 *   Label → Helper → [CountryField | Divider | PhoneField] → ValidationMessage
 *
 * VARIANTES (countryVariant):
 *   "selectable" → país es botón clicable, muestra ChevronDown en teal
 *   "fixed"      → país es solo visual, sin interacción, sin chevron
 *
 * ESTADOS (state):
 *   "default"  → genérico
 *   "error"    → borde rojo + validationMessage visible
 *   "disabled" → campos inactivos, opacidad reducida en flag
 *
 * NOTA: el Country Picker (lista de países) es un componente separado.
 *   Este componente solo dispara onCountryClick — no gestiona el picker.
 *
 * USO:
 *   <InputTelephone
 *     label="Teléfono"
 *     flagEmoji="🇪🇸"
 *     countryCode="+34"
 *     value={phone}
 *     onChange={e => setPhone(e.target.value)}
 *   />
 *   <InputTelephone countryVariant="fixed" flagEmoji="🇪🇸" countryCode="+34" />
 *   <InputTelephone state="error" errorMessage="Número inválido" />
 *   <InputTelephone state="disabled" />
 */

import React, { forwardRef, useId } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { mergeRefs, injectStyles } from './_inputBase';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-input-telephone {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-telephone--full-width { display: flex; width: 100%; }

/* Label */
.ds-input-telephone__label {
  font-size:     14px;
  font-weight:   700;
  color:         var(--ds-input-fg-label);
  cursor:        default;
  line-height:   1.4;
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-telephone--disabled .ds-input-telephone__label {
  color: var(--ds-input-label-fg-disabled);
}

/* Helper — encima del campo */
.ds-input-telephone__helper {
  font-size:   12px;
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: 1.4;
}
.ds-input-telephone--disabled .ds-input-telephone__helper {
  color: var(--ds-input-helper-fg-disabled);
}

/* Contenedor del campo doble */
.ds-input-telephone__field-wrap {
  display:       flex;
  align-items:   stretch;
  width:         100%;
  min-height:    var(--ds-input-min-height);
  border:        var(--ds-input-border-width) solid var(--ds-input-border-default);
  border-radius: var(--ds-input-border-radius);
  overflow:      hidden;
  transition:    border-color 0.12s;
  box-sizing:    border-box;
}

/* Hover — solo en estado genérico */
.ds-input-telephone:not(.ds-input-telephone--disabled):not(.ds-input-telephone--error)
  .ds-input-telephone__field-wrap:hover {
  border-color: var(--ds-borderColor-emphasis);
}

/* Focus — anillo doble via :focus-within */
.ds-input-telephone__field-wrap:focus-within {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Error */
.ds-input-telephone--error .ds-input-telephone__field-wrap {
  border-color: var(--ds-input-border-error);
}
.ds-input-telephone--error .ds-input-telephone__field-wrap:focus-within {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Disabled */
.ds-input-telephone--disabled .ds-input-telephone__field-wrap {
  border-color: var(--ds-input-border-disabled);
}
.ds-input-telephone--disabled .ds-input-telephone__field-wrap:focus-within {
  border-color: var(--ds-input-border-disabled);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* ── País ── */
.ds-input-telephone__country {
  display:         flex;
  align-items:     center;
  gap:             var(--ds-input-telephone-country-gap);
  padding:         var(--ds-input-telephone-country-padding-ver)
                   var(--ds-input-telephone-country-padding-hor);
  background:      var(--ds-input-telephone-country-bg);
  border:          none;
  cursor:          default;
  font-family:     inherit;
  flex-shrink:     0;
  white-space:     nowrap;
  outline:         none;
}

/* Selectable: es un botón */
.ds-input-telephone__country--selectable {
  cursor: pointer;
}
.ds-input-telephone__country--selectable:hover {
  background: color-mix(in srgb, var(--ds-input-telephone-country-bg), #000 4%);
}
.ds-input-telephone__country--selectable:focus-visible {
  background: color-mix(in srgb, var(--ds-input-telephone-country-bg), #000 4%);
}

/* Disabled */
.ds-input-telephone--disabled .ds-input-telephone__country {
  background: var(--ds-input-telephone-country-bg-disabled);
  cursor:     not-allowed;
}

/* Flag */
.ds-input-telephone__flag {
  font-size:   var(--ds-input-telephone-icon-flag-size);
  line-height: 1;
  display:     flex;
  align-items: center;
}
.ds-input-telephone--disabled .ds-input-telephone__flag {
  opacity: var(--ds-input-telephone-icon-flag-opacity-disabled);
}

/* Código de país */
.ds-input-telephone__code {
  font-size:   14px;
  font-weight: 500;
  color:       var(--ds-input-telephone-country-text-fg);
  line-height: 1;
}
.ds-input-telephone--disabled .ds-input-telephone__code {
  color: var(--ds-input-telephone-country-text-fg-disabled);
}

/* Chevron dropdown — solo en selectable */
.ds-input-telephone__chevron {
  display:    flex;
  align-items: center;
  color:      var(--ds-input-telephone-icon-dropdown-fg);
}
.ds-input-telephone--disabled .ds-input-telephone__chevron {
  color: var(--ds-input-telephone-icon-dropdown-fg-disabled);
}

/* ── Divider ── */
.ds-input-telephone__divider {
  width:            1px;
  background-color: var(--ds-input-telephone-divider-color);
  flex-shrink:      0;
  align-self:       stretch;
}
.ds-input-telephone--disabled .ds-input-telephone__divider {
  background-color: var(--ds-input-border-disabled);
}

/* ── Campo de teléfono ── */
.ds-input-telephone__phone {
  flex:               1;
  min-width:          0;
  padding:            var(--ds-input-telephone-field-padding-ver)
                      var(--ds-input-telephone-field-padding-hor);
  font-size:          14px;
  font-family:        inherit;
  line-height:        1.5;
  color:              var(--ds-input-fg-default);
  background:         var(--ds-input-telephone-field-bg);
  border:             none;
  outline:            none;
  -webkit-appearance: none;
}
.ds-input-telephone__phone::placeholder { color: var(--ds-fg-subtle); }

.ds-input-telephone--disabled .ds-input-telephone__phone {
  background: var(--ds-input-telephone-field-bg-disabled);
  color:      var(--ds-input-fg-disabled);
  cursor:     not-allowed;
}

/* ── Validation message ── */
.ds-input-telephone__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   12px;
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: 1.4;
}
.ds-input-telephone__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
`;

injectStyles('ds-input-telephone', css);

/* ─── InputTelephone ────────────────────────────────────────────────────────── */

export const InputTelephone = forwardRef(function InputTelephone({
  label,
  ariaLabel,
  placeholder      = '600 000 000',
  value,
  defaultValue,
  onChange,
  state            = 'default',
  countryVariant   = 'selectable',
  flagEmoji        = '🇪🇸',
  countryCode      = '+34',
  onCountryClick,
  helperText,
  errorMessage,
  fullWidth        = false,
  id,
  name,
  onFocus,
  onBlur,
}, forwardedRef) {

  const generatedId  = useId();
  const inputId      = id || generatedId;
  const helperId     = helperText ? `${inputId}-helper` : null;
  const messageId    = state === 'error' && errorMessage ? `${inputId}-msg` : null;
  const describedBy  = [helperId, messageId].filter(Boolean).join(' ') || undefined;
  const isDisabled   = state === 'disabled';
  const isSelectable = countryVariant === 'selectable' && !isDisabled;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputTelephone] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const wrapperClass = [
    'ds-input-telephone',
    state === 'error'    ? 'ds-input-telephone--error'     : '',
    isDisabled           ? 'ds-input-telephone--disabled'  : '',
    fullWidth            ? 'ds-input-telephone--full-width' : '',
  ].filter(Boolean).join(' ');

  const CountryTag = isSelectable ? 'button' : 'div';
  const countryClass = [
    'ds-input-telephone__country',
    isSelectable ? 'ds-input-telephone__country--selectable' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>

      {label && (
        <label className="ds-input-telephone__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-input-telephone__helper" id={helperId}>
          {helperText}
        </p>
      )}

      <div className="ds-input-telephone__field-wrap">

        {/* País */}
        <CountryTag
          className={countryClass}
          onClick={isSelectable ? onCountryClick : undefined}
          type={isSelectable ? 'button' : undefined}
          disabled={isSelectable ? isDisabled : undefined}
          aria-label={isSelectable ? `Seleccionar país, actual ${countryCode}` : undefined}
          tabIndex={isSelectable ? 0 : -1}
        >
          <span className="ds-input-telephone__flag" aria-hidden="true">
            {flagEmoji}
          </span>
          <span className="ds-input-telephone__code">
            {countryCode}
          </span>
          {isSelectable && (
            <span className="ds-input-telephone__chevron" aria-hidden="true">
              <ChevronDown
                size={parseInt(getComputedStyle(document?.documentElement || {})
                  .getPropertyValue('--ds-input-telephone-icon-dropdown-size') || '24')}
                strokeWidth={1.75}
              />
            </span>
          )}
        </CountryTag>

        {/* Divider */}
        <div className="ds-input-telephone__divider" aria-hidden="true" />

        {/* Número */}
        <input
          ref={forwardedRef ? mergeRefs(forwardedRef) : undefined}
          id={inputId}
          name={name}
          type="tel"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={isDisabled}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={describedBy}
          aria-invalid={state === 'error' ? 'true' : undefined}
          className="ds-input-telephone__phone"
          autoComplete="tel-national"
        />

      </div>

      {state === 'error' && errorMessage && (
        <p className="ds-input-telephone__message" id={messageId} aria-live="polite">
          <span className="ds-input-telephone__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}

    </div>
  );
});

InputTelephone.displayName = 'InputTelephone';
export default InputTelephone;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

// Selectable (default)
<InputTelephone
  label="Teléfono móvil"
  flagEmoji="🇪🇸"
  countryCode="+34"
  value={phone}
  onChange={e => setPhone(e.target.value)}
  onCountryClick={() => setPickerOpen(true)}
/>

// Fixed — país no interactivo
<InputTelephone
  label="Teléfono"
  countryVariant="fixed"
  flagEmoji="🇪🇸"
  countryCode="+34"
  value={phone}
  onChange={fn}
/>

// Error
<InputTelephone
  label="Teléfono"
  state="error"
  errorMessage="Introduce un número válido de 9 dígitos"
  value={phone}
  onChange={fn}
/>

// Disabled
<InputTelephone
  label="Teléfono"
  state="disabled"
  flagEmoji="🇪🇸"
  countryCode="+34"
/>

// Con helper
<InputTelephone
  label="Teléfono de contacto"
  helperText="Usaremos este número solo para verificación"
  flagEmoji="🇬🇧"
  countryCode="+44"
  value={phone}
  onChange={fn}
/>
*/
