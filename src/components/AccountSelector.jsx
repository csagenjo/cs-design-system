import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { injectStyles } from './_inputBase';
import { AccountSelectorInvoker } from './AccountSelectorInvoker';

const css = `
.ds-account-selector {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-account-selector--full-width { display: flex; width: 100%; }

.ds-account-selector__label {
  font-size:     14px;
  font-weight:   700;
  color:         var(--ds-input-fg-label);
  cursor:        pointer;
  line-height:   1.4;
  margin-bottom: var(--ds-input-label-gap);
}
.ds-account-selector--disabled .ds-account-selector__label { color: var(--ds-input-label-fg-disabled); cursor: default; }

.ds-account-selector__helper {
  font-size:   12px;
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: 1.4;
}
.ds-account-selector--disabled .ds-account-selector__helper { color: var(--ds-input-helper-fg-disabled); }

.ds-account-selector__message {
  display:     flex;
  align-items: flex-start;
  gap:         4px;
  font-size:   12px;
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: 1.4;
}
.ds-account-selector__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
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
  id,
  name,
}, forwardedRef) {

  const generatedId = useId();
  const invokerId    = id || generatedId;

  const helperId  = helperText ? `${invokerId}-helper` : null;
  const messageId = state === 'error' && errorMessage ? `${invokerId}-msg` : null;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[DS AccountSelector] Necesita `label` o `ariaLabel` para ser accesible.', { id: invokerId });
  }

  const wrapperClass = [
    'ds-account-selector',
    state === 'disabled' ? 'ds-account-selector--disabled' : '',
    fullWidth             ? 'ds-account-selector--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="ds-account-selector__label" htmlFor={invokerId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-account-selector__helper" id={helperId}>
          {helperText}
        </p>
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
        aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
        aria-invalid={state === 'error' ? 'true' : undefined}
      />

      {state === 'error' && errorMessage && (
        <p className="ds-account-selector__message" id={messageId} aria-live="polite">
          <span className="ds-account-selector__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

AccountSelector.displayName = 'AccountSelector';
export default AccountSelector;
