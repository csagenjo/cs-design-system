import React, { forwardRef, useId } from 'react';
import { injectStyles } from './_inputBase';
import { AccountSelectorInvoker } from './AccountSelectorInvoker';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-account-selector {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-account-selector--full-width { display: flex; }


.ds-account-selector__message { margin-top: var(--ds-input-validation-gap); }

`;

injectStyles('ds-account-selector', css);

export const AccountSelector = forwardRef(function AccountSelector({
  label,
  ariaLabel,
  helperText,
  errorMessage,
  state           = 'default',   // 'default' | 'error' | 'disabled' | 'readOnly' | 'dataHidden'
  dataSelection   = 'single',    // 'single' | 'multiple' | 'empty'
  headerText,
  amount,
  currency,
  amountType      = 'positive',
  detailText,
  selectedCount,
  onClick,
  fullWidth       = false,
  expanded,
  haspopup,
  id,
  name,
}, forwardedRef) {

  const generatedId = useId();
  const invokerId    = id || generatedId;

  // A11y-3: con <label htmlFor> el nombre del botón era SOLO la etiqueta y el
  // valor elegido no se leía. aria-labelledby = etiqueta + el propio botón →
  // "Cuenta de cargo, Cuenta nómina, ES12…".
  const labelId   = label ? `${invokerId}-label` : null;
  const helperId  = helperText ? `${invokerId}-helper` : null;
  const messageId = state === 'error' && errorMessage ? `${invokerId}-msg` : null;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS AccountSelector] Necesita `label` o `ariaLabel` para ser accesible.', { id: invokerId });
  }

  const wrapperClass = [
    'ds-account-selector ds-input-root',
    state === 'disabled' ? 'ds-account-selector--disabled' : '',
    fullWidth             ? 'ds-account-selector--full-width ds-input-root--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <FieldLabel className="ds-account-selector__label ds-input-label" htmlFor={invokerId} id={labelId} disabled={state === 'disabled'}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-account-selector__helper ds-input-helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}

      <AccountSelectorInvoker
        ref={forwardedRef}
        id={invokerId}
        name={name}
        state={state}
        dataSelection={dataSelection}
        headerText={headerText}
        amount={amount}
        currency={currency}
        amountType={amountType}
        detailText={detailText}
        selectedCount={selectedCount}
        onClick={onClick}
        fullWidth={fullWidth}
        ariaLabel={!label ? ariaLabel : undefined}
        aria-labelledby={labelId ? `${labelId} ${invokerId}` : undefined}
        expanded={expanded}
        haspopup={haspopup}
        aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
        aria-invalid={state === 'error' ? 'true' : undefined}
      />
      <ValidationMessage className="ds-account-selector__message" id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

AccountSelector.displayName = 'AccountSelector';
export default AccountSelector;
