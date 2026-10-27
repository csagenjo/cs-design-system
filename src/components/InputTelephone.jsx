/**
 * InputTelephone — Componente atómico
 * CS Design System · v2 (27/10/2026: alineado 1:1 con Figma)
 *
 * Figma: `Input Telephone` (Label + Helper + `Telephone Field` + Validation
 * Message). El campo son DOS cajas juntas — país y número — cada una con su
 * borde: hover, foco y error marcan solo la parte afectada (Figma
 * `Hover|Focus|Error - Country|Telephone`), el borde compartido toma su color.
 *
 * VARIANTES (countryVariant, Figma `Variant`):
 *   "selectable" → el país es un botón (abre el Country Picker): bandera + prefijo + chevron
 *   "fixed"      → el país solo se muestra, sin chevron ni interacción
 *
 * ESTADOS (state): default · error · disabled
 *   errorField → qué parte lleva el error: 'telephone' (por defecto) | 'country'
 *
 * USO:
 *   <InputTelephone label="Phone" flag={<CountryFlag country="spain" />} countryCode="+34"
 *     onCountryClick={openPicker} value={phone} onChange={e => setPhone(e.target.value)} />
 *   <InputTelephone label="Phone" countryVariant="fixed" countryCode="+34" />
 *
 * El Country Picker es un organismo aparte (CountryPicker); este átomo solo
 * dispara onCountryClick.
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
.ds-input-telephone {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-input-telephone--full-width { display: flex; }

.ds-input-telephone__label   { margin-bottom: var(--ds-input-label-gap); }
.ds-input-telephone__message { margin-top: var(--ds-input-validation-gap); }

/* ── País (Figma Country Code) ── */
.ds-input-telephone__country {
  display:     flex;
  align-items: center;
  flex-shrink: 0;
  gap:         var(--ds-input-subfield-gap);
  min-height:  var(--ds-input-subfield-height);
  padding:     var(--ds-input-telephone-country-padding-ver) var(--ds-input-padding-hor);
  font-family: inherit;
  white-space: nowrap;
  cursor:      default;
}
button.ds-input-telephone__country { cursor: pointer; }
button.ds-input-telephone__country:disabled { cursor: not-allowed; }

.ds-input-telephone__flag {
  display:     flex;
  align-items: center;
  height:      var(--ds-input-telephone-icon-flag-size);
  font-size:   var(--ds-input-telephone-icon-flag-size);
  line-height: 1;
}
.ds-input-telephone__flag img { height: var(--ds-input-telephone-icon-flag-size); width: auto; }
.ds-input-telephone--disabled .ds-input-telephone__flag { opacity: var(--ds-input-telephone-icon-flag-opacity-disabled); }

/* Prefijo — mismo texto que el valor (valueText, body sm regular) */
.ds-input-telephone__code {
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  font-weight: var(--ds-font-weight-regular);
  color:       inherit;
}

.ds-input-telephone__chevron { display: flex; align-items: center; color: var(--ds-input-icon-fg-primary); }
.ds-input-telephone--disabled .ds-input-telephone__chevron { color: var(--ds-input-icon-fg-disabled); }

/* ── Número (Figma Telephone) ── */
.ds-input-telephone__phone {
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
  errorField       = 'telephone',   // Figma Error - Telephone | Error - Country
  countryVariant   = 'selectable',
  flagEmoji        = '🇪🇸',
  flag, // slot opcional (p. ej. <CountryFlag country="spain" />) — sustituye a flagEmoji
  countryCode      = '+34',
  onCountryClick,
  countryName,                  // nombre del país (lo que no dice el prefijo solo)
  countryExpanded,              // estado del picker de país (aria-expanded)
  countryLabel = (code, nameText) => `Country code, ${code}${nameText ? ` (${nameText})` : ''}`,
  helperText,
  errorMessage,
  fullWidth        = false,
  required         = false,
  id,
  name,
  onFocus,
  onBlur,
}, forwardedRef) {

  const generatedId  = useId();
  const inputId      = id || generatedId;
  const helperId     = helperText ? `${inputId}-helper` : null;
  const messageId    = state === 'error' && errorMessage ? `${inputId}-msg` : null;
  // A11y-3: el prefijo forma parte del número — el campo lo lee como descripción
  const codeId       = `${inputId}-code`;
  const describedBy  = [codeId, helperId, messageId].filter(Boolean).join(' ') || undefined;
  const isDisabled   = state === 'disabled';
  const isError      = state === 'error';
  const isSelectable = countryVariant === 'selectable';

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS InputTelephone] Necesita `label` o `ariaLabel` para ser accesible.', { id: inputId });
  }

  const wrapperClass = [
    'ds-input-telephone ds-input-root',
    isDisabled ? 'ds-input-telephone--disabled' : '',
    fullWidth  ? 'ds-input-telephone--full-width ds-input-root--full-width' : '',
  ].filter(Boolean).join(' ');

  const part = (which) => [
    'ds-input-box',
    isDisabled ? 'is-disabled' : '',
    isError && errorField === which ? 'is-error' : '',
  ].filter(Boolean).join(' ');

  const CountryTag = isSelectable ? 'button' : 'div';

  return (
    <div className={wrapperClass}>

      {label && (
        <FieldLabel className="ds-input-telephone__label ds-input-label" htmlFor={inputId} required={required} disabled={isDisabled}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-input-telephone__helper ds-input-helper" disabled={isDisabled}>{helperText}</HelperText>
      )}

      <div className="ds-input-split">
        <CountryTag
          className={`ds-input-telephone__country ${part('country')}`}
          onClick={isSelectable && !isDisabled ? onCountryClick : undefined}
          type={isSelectable ? 'button' : undefined}
          disabled={isSelectable ? isDisabled : undefined}
          aria-label={isSelectable ? countryLabel(countryCode, countryName) : undefined}
          aria-haspopup={isSelectable ? 'listbox' : undefined}
          aria-expanded={isSelectable ? countryExpanded : undefined}
          aria-invalid={isSelectable && isError && errorField === 'country' ? 'true' : undefined}
        >
          <span className="ds-input-telephone__flag" aria-hidden="true">{flag ?? flagEmoji}</span>
          <span className="ds-input-telephone__code" id={codeId}>{countryCode}</span>
          {isSelectable && (
            <span className="ds-input-telephone__chevron" aria-hidden="true">
              <Icon name="chevron-down" size="sm" />
            </span>
          )}
        </CountryTag>

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
          aria-invalid={isError ? 'true' : undefined}
          required={required}
          className={`ds-input-telephone__phone ${part('telephone')}`}
          autoComplete="tel-national"
        />
      </div>
      <ValidationMessage className="ds-input-telephone__message" id={messageId} message={isError ? errorMessage : ''} />

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
