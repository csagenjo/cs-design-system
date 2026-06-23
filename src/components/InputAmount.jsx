/**
 * InputAmount — Componente atómico
 * CS Design System · v1.0
 *
 * Tokens: --ds-input-* + --ds-input-amount-* (tokens.css)
 * Iconos: lucide-react — ChevronDown (dropdown moneda) · AlertCircle (error)
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos.
 *
 * ESTRUCTURA:
 *   Label → Helper → [CurrencyField | AmountField] → ValidationMessage
 *
 * VARIANTES (currencyVariant):
 *   "selectable" → moneda es botón clicable, muestra ChevronDown en teal
 *   "fixed"      → moneda es solo visual, sin interacción, sin chevron
 *
 * ESTADOS (state):
 *   "default"  → genérico
 *   "error"    → borde rojo + validationMessage visible
 *   "disabled" → campos inactivos
 *
 * NOTA: el Currency Picker es un componente separado.
 *   Este componente solo dispara onCurrencyClick — no gestiona el picker.
 *
 * USO:
 *   <InputAmount label="Importe" currency="EUR" value={v} onChange={fn} />
 *   <InputAmount currencyVariant="fixed" currency="USD" />
 *   <InputAmount state="error" errorMessage="Importe inválido" />
 *   <InputAmount state="disabled" />
 */

import React, { forwardRef, useId } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { mergeRefs, injectStyles } from './_inputBase';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-input-amount {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-amount--full-width { display: flex; width: 100%; }

/* Label */
.ds-input-amount__label {
  font-size:     14px;
  font-weight:   700;
  color:         var(--ds-input-fg-label);
  cursor:        default;
  line-height:   1.4;
  margin-bottom: var(--ds-input-label-gap);
}
.ds-input-amount--disabled .ds-input-amount__label {
  color: var(--ds-input-label-fg-disabled);
}

/* Helper */
.ds-input-amount__helper {
  font-size:   12px;
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: 1.4;
}
.ds-input-amount--disabled .ds-input-amount__helper {
  color: var(--ds-input-helper-fg-disabled);
}

/* Contenedor del campo doble */
.ds-input-amount__field-wrap {
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
.ds-input-amount:not(.ds-input-amount--disabled):not(.ds-input-amount--error)
  .ds-input-amount__field-wrap:hover {
  border-color: var(--ds-input-border-hover);
}

/* Focus — anillo doble via :focus-within */
.ds-input-amount__field-wrap:focus-within {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Error */
.ds-input-amount--error .ds-input-amount__field-wrap {
  border-color: var(--ds-input-border-error);
}
.ds-input-amount--error .ds-input-amount__field-wrap:focus-within {
  border-color:   var(--ds-input-focus-inner);
  border-width:   var(--ds-input-border-width-focus);
  outline:        2px solid var(--ds-input-focus-outer);
  outline-offset: 2px;
}

/* Disabled */
.ds-input-amount--disabled .ds-input-amount__field-wrap {
  border-color: var(--ds-input-border-disabled);
}
.ds-input-amount--disabled .ds-input-amount__field-wrap:focus-within {
  border-color: var(--ds-input-border-disabled);
  border-width: var(--ds-input-border-width);
  outline:      none;
}

/* ── Campo de moneda ── */
.ds-input-amount__currency {
  display:     flex;
  align-items: center;
  gap:         var(--ds-input-amount-currency-field-gap-hor-generic);
  padding:     var(--ds-input-amount-currency-field-padding-ver-generic)
               var(--ds-input-amount-currency-field-padding-hor-generic);
  background:  var(--ds-input-amount-currency-field-bg-generic, var(--ds-input-bg-default));
  border:      none;
  cursor:      default;
  font-family: inherit;
  flex-shrink: 0;
  white-space: nowrap;
  outline:     none;
}

.ds-input-amount__currency--selectable {
  cursor: pointer;
}
.ds-input-amount__currency--selectable:hover {
  background: color-mix(in srgb, var(--ds-input-amount-currency-field-bg-generic, var(--ds-input-bg-default)), #000 4%);
}
.ds-input-amount__currency--selectable:focus-visible {
  background: color-mix(in srgb, var(--ds-input-amount-currency-field-bg-generic, var(--ds-input-bg-default)), #000 4%);
}

.ds-input-amount--disabled .ds-input-amount__currency {
  background: var(--ds-input-amount-currency-field-bg-disabled, var(--ds-input-bg-disabled));
  cursor:     not-allowed;
}

/* Texto ISO de moneda */
.ds-input-amount__currency-text {
  font-size:   14px;
  font-weight: 500;
  color:       var(--ds-input-amount-currency-text-fg-generic, var(--ds-input-fg-default));
  line-height: 1;
}
.ds-input-amount--disabled .ds-input-amount__currency-text {
  color: var(--ds-input-amount-currency-text-fg-disabled, var(--ds-input-fg-disabled));
}

/* Chevron dropdown — solo en selectable */
.ds-input-amount__chevron {
  display:     flex;
  align-items: center;
  color:       var(--ds-input-amount-icon-dropdown-fg-generic);
}
.ds-input-amount--disabled .ds-input-amount__chevron {
  color: var(--ds-input-amount-icon-dropdown-fg-disabled);
}

/* ── Campo de importe ── */
.ds-input-amount__amount {
  flex:               1;
  min-width:          0;
  padding:            var(--ds-input-amount-amount-field-padding-ver-generic)
                      var(--ds-input-amount-amount-field-padding-hor-generic);
  font-size:          14px;
  font-family:        inherit;
  line-height:        1.5;
  color:              var(--ds-input-fg-default);
  background:         var(--ds-input-amount-amount-field-bg-generic, var(--ds-input-bg-default));
  border:             none;
  outline:            none;
  -webkit-appearance: none;
}
.ds-input-amount__amount::placeholder { color: var(--ds-input-fg-placeholder); }

.ds-input-amount--disabled .ds-input-amount__amount {
  background: var(--ds-input-amount-amount-field-bg-disabled, var(--ds-input-bg-disabled));
  color:      var(--ds-input-fg-disabled);
  cursor:     not-allowed;
}

/* ── Validation message ── */
.ds-input-amount__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   12px;
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: 1.4;
}
.ds-input-amount__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
`;

injectStyles('ds-input-amount', css);

/* ─── InputAmount ───────────────────────────────────────────────────────────── */

export const InputAmount = forwardRef(function InputAmount({
  label,
  ariaLabel,
  locale          = 'es-ES',
  value,
  defaultValue,
  onChange,
  state           = 'default',
  currencyVariant = 'selectable',
  currency        = 'EUR',
  onCurrencyClick,
  helperText,
  errorMessage,
  fullWidth       = false,
  id,
  name,
  onFocus,
  onBlur,
}, forwardedRef) {

  const getPlaceholder = (locale) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: 2 }).format(0);

  const generatedId = useId();
  const inputId     = id || generatedId;
  const helperId    = helperText ? `${inputId}-helper` : null;
  const messageId   = state === 'error' && errorMessage ? `${inputId}-msg` : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;
  const isDisabled  = state === 'disabled';
  const isSelectable = currencyVariant === 'selectable' && !isDisabled;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputAmount] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const wrapperClass = [
    'ds-input-amount',
    state === 'error' ? 'ds-input-amount--error'     : '',
    isDisabled        ? 'ds-input-amount--disabled'  : '',
    fullWidth         ? 'ds-input-amount--full-width' : '',
  ].filter(Boolean).join(' ');

  const CurrencyTag = isSelectable ? 'button' : 'div';
  const currencyClass = [
    'ds-input-amount__currency',
    isSelectable ? 'ds-input-amount__currency--selectable' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>

      {label && (
        <label className="ds-input-amount__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-input-amount__helper" id={helperId}>
          {helperText}
        </p>
      )}

      <div className="ds-input-amount__field-wrap">

        {/* Moneda */}
        <CurrencyTag
          className={currencyClass}
          onClick={isSelectable ? onCurrencyClick : undefined}
          type={isSelectable ? 'button' : undefined}
          disabled={isSelectable ? isDisabled : undefined}
          aria-label={isSelectable ? `Seleccionar moneda, actual ${currency}` : undefined}
          tabIndex={isSelectable ? 0 : -1}
        >
          <span className="ds-input-amount__currency-text">
            {currency}
          </span>
          {isSelectable && (
            <span className="ds-input-amount__chevron" aria-hidden="true">
              <ChevronDown
                size={parseInt(getComputedStyle(document?.documentElement || {})
                  .getPropertyValue('--ds-input-amount-icon-dropdown-size-generic') || '24')}
                strokeWidth={1.75}
              />
            </span>
          )}
        </CurrencyTag>

        {/* Importe */}
        <input
          ref={forwardedRef ? mergeRefs(forwardedRef) : undefined}
          id={inputId}
          name={name}
          type="text"
          inputMode="decimal"
          placeholder={getPlaceholder(locale)}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={isDisabled}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={describedBy}
          aria-invalid={state === 'error' ? 'true' : undefined}
          className="ds-input-amount__amount"
          autoComplete="off"
        />

      </div>

      {state === 'error' && errorMessage && (
        <p className="ds-input-amount__message" id={messageId} aria-live="polite">
          <span className="ds-input-amount__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}

    </div>
  );
});

InputAmount.displayName = 'InputAmount';
export default InputAmount;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

// Selectable (default)
<InputAmount
  label="Importe"
  currency="EUR"
  value={amount}
  onChange={e => setAmount(e.target.value)}
  onCurrencyClick={() => setPickerOpen(true)}
/>

// Fixed — moneda no interactiva
<InputAmount
  label="Importe"
  currencyVariant="fixed"
  currency="USD"
  value={amount}
  onChange={fn}
/>

// Error
<InputAmount
  label="Importe"
  state="error"
  errorMessage="Introduce un importe válido"
  value={amount}
  onChange={fn}
/>

// Disabled
<InputAmount
  label="Importe"
  state="disabled"
  currency="EUR"
/>

// Con helper
<InputAmount
  label="Importe de la transferencia"
  helperText="Máximo 10.000 € por operación"
  currency="EUR"
  value={amount}
  onChange={fn}
/>
*/
