/**
 * InputAmount — Componente atómico
 * CS Design System · v2 (27/10/2026: alineado 1:1 con Figma)
 *
 * Figma: `Input Amount` (Label + Helper + `Amount Field` + Validation Message).
 * Dos cajas juntas — divisa e importe —, cada una con su borde: hover, foco y
 * error marcan solo la parte afectada (Figma `Hover|Focus|Error - Currency|Amount`).
 *
 * VARIANTES (currencyVariant, Figma `Variant`):
 *   "selectable" → la divisa es un botón (abre el Currency Picker): código ISO + chevron
 *   "fixed"      → la divisa solo se muestra
 *
 * ESTADOS (state): default · error · disabled
 *   errorField → qué parte lleva el error: 'amount' (por defecto) | 'currency'
 *
 * USO:
 *   <InputAmount label="Amount" currency="EUR" value={v} onChange={fn} onCurrencyClick={openPicker} />
 *   <InputAmount label="Amount" currencyVariant="fixed" currency="USD" />
 */

import React, { forwardRef, useId } from 'react';
import { Icon } from './Icon';
import { mergeRefs, injectStyles } from './_inputBase';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */
/* Cajas, hover, error, disabled, foco y borde compartido: .ds-input-box /
   .ds-input-split (_inputBase). */

const css = `
.ds-input-amount {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-amount--full-width { display: flex; }

.ds-input-amount__label   { margin-bottom: var(--ds-input-label-gap); }
.ds-input-amount__helper  { margin-bottom: var(--ds-input-helper-gap); }
.ds-input-amount__message { margin-top: var(--ds-input-validation-gap); }

/* ── Divisa (Figma ISO Currency) ── */
.ds-input-amount__currency {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  gap:         var(--ds-input-subfield-gap);
  min-height:  var(--ds-input-subfield-height);
  padding:     var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  font-family: inherit;
  white-space: nowrap;
  cursor:      default;
}
button.ds-input-amount__currency { cursor: pointer; }
button.ds-input-amount__currency:disabled { cursor: not-allowed; }

.ds-input-amount__currency-text {
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  font-weight: var(--ds-font-weight-regular);
  color:       inherit;
}

.ds-input-amount__chevron { display: flex; align-items: center; color: var(--ds-input-icon-fg-primary); }
.ds-input-amount--disabled .ds-input-amount__chevron { color: var(--ds-input-icon-fg-disabled); }

/* ── Importe (Figma Amount) ── */
.ds-input-amount__amount {
  flex:               1;
  min-width:          0;
  min-height:         var(--ds-input-subfield-height);
  padding:            var(--ds-input-padding-ver) var(--ds-input-padding-hor);
  font-size:          var(--ds-fontSize-body-sm);
  font-family:        inherit;
  line-height:        var(--ds-lineHeight-body-sm);
  -webkit-appearance: none;
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
  errorField      = 'amount',     // Figma Error - Amount | Error - Currency
  currencyVariant = 'selectable',
  currency        = 'EUR',
  onCurrencyClick,
  currencyExpanded,             // estado del picker de moneda (aria-expanded)
  currencyLabel = (c) => `Currency, ${c}`,
  helperText,
  errorMessage,
  fullWidth       = false,
  required        = false,
  id,
  name,
  onFocus,
  onBlur,
}, forwardedRef) {

  const getPlaceholder = (loc) =>
    new Intl.NumberFormat(loc, { minimumFractionDigits: 2 }).format(0);

  const generatedId = useId();
  const inputId     = id || generatedId;
  const helperId    = helperText ? `${inputId}-helper` : null;
  const messageId   = state === 'error' && errorMessage ? `${inputId}-msg` : null;
  // A11y-3: la moneda forma parte del dato — el campo la lee como descripción
  const currencyId  = `${inputId}-currency`;
  const describedBy = [currencyId, helperId, messageId].filter(Boolean).join(' ') || undefined;
  const isDisabled  = state === 'disabled';
  const isError     = state === 'error';
  const isSelectable = currencyVariant === 'selectable';

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputAmount] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const wrapperClass = [
    'ds-input-amount ds-input-root',
    isDisabled ? 'ds-input-amount--disabled' : '',
    fullWidth  ? 'ds-input-amount--full-width ds-input-root--full-width' : '',
  ].filter(Boolean).join(' ');

  const part = (which) => [
    'ds-input-box',
    isDisabled ? 'is-disabled' : '',
    isError && errorField === which ? 'is-error' : '',
  ].filter(Boolean).join(' ');

  const CurrencyTag = isSelectable ? 'button' : 'div';

  return (
    <div className={wrapperClass}>

      {label && (
        <FieldLabel className="ds-input-amount__label" htmlFor={inputId} required={required} disabled={isDisabled}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-amount__helper" disabled={isDisabled}>{helperText}</HelperText>
      )}

      <div className="ds-input-split">
        <CurrencyTag
          className={`ds-input-amount__currency ${part('currency')}`}
          onClick={isSelectable && !isDisabled ? onCurrencyClick : undefined}
          type={isSelectable ? 'button' : undefined}
          disabled={isSelectable ? isDisabled : undefined}
          aria-label={isSelectable ? currencyLabel(currency) : undefined}
          aria-haspopup={isSelectable ? 'listbox' : undefined}
          aria-expanded={isSelectable ? currencyExpanded : undefined}
          aria-invalid={isSelectable && isError && errorField === 'currency' ? 'true' : undefined}
        >
          <span className="ds-input-amount__currency-text" id={currencyId}>{currency}</span>
          {isSelectable && (
            <span className="ds-input-amount__chevron" aria-hidden="true">
              <Icon name="chevron-down" size="sm" />
            </span>
          )}
        </CurrencyTag>

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
          aria-invalid={isError ? 'true' : undefined}
          required={required}
          className={`ds-input-amount__amount ${part('amount')}`}
          autoComplete="off"
        />
      </div>
      <ValidationMessage className="ds-input-amount__message" id={messageId} message={isError ? errorMessage : ''} />

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
