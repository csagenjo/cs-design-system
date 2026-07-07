import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { injectStyles } from './_inputBase';
import { SelectorInvoker } from './SelectorInvoker';

const css = `
.ds-selector {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-selector--full-width { display: flex; width: 100%; }

.ds-selector__label {
  font-size:     var(--ds-fontSize-label-md);
  font-weight:   var(--ds-font-weight-bold);
  color:         var(--ds-input-fg-label);
  cursor:        pointer;
  line-height:   var(--ds-lineHeight-xs);
  margin-bottom: var(--ds-input-label-gap);
}
.ds-selector--disabled .ds-selector__label { color: var(--ds-input-label-fg-disabled); cursor: default; }

.ds-selector__helper {
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-fg-helper);
  margin:      0 0 var(--ds-input-helper-gap);
  line-height: var(--ds-lineHeight-xs);
}
.ds-selector--disabled .ds-selector__helper { color: var(--ds-input-helper-fg-disabled); }

.ds-selector__message {
  display:     flex;
  align-items: flex-start;
  gap:         var(--ds-spacing-xs);
  font-size:   var(--ds-fontSize-body-sm);
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
  line-height: var(--ds-lineHeight-xs);
}
.ds-selector__message-icon {
  color:       var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top:  1px;
  display:     flex;
}
`;

injectStyles('ds-selector', css);

export const Selector = forwardRef(function Selector({
  label,
  ariaLabel,
  helperText,
  errorMessage,
  state           = 'default',   // 'default' | 'error' | 'disabled' | 'readOnly' | 'dataHidden'
  dataSelection   = 'single',    // 'single' | 'multiple' | 'empty'
  headerText,
  descriptionText,
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
    console.warn('[DS Selector] Necesita `label` o `ariaLabel` para ser accesible.', { id: invokerId });
  }

  const wrapperClass = [
    'ds-selector',
    state === 'disabled' ? 'ds-selector--disabled' : '',
    fullWidth            ? 'ds-selector--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="ds-selector__label" htmlFor={invokerId}>
          {label}
        </label>
      )}

      {helperText && (
        <p className="ds-selector__helper" id={helperId}>
          {helperText}
        </p>
      )}

      <SelectorInvoker
        ref={forwardedRef}
        id={invokerId}
        name={name}
        state={state}
        dataSelection={dataSelection}
        headerText={headerText}
        descriptionText={descriptionText}
        detailText={detailText}
        selectedCount={selectedCount}
        onClick={onClick}
        fullWidth={fullWidth}
        ariaLabel={!label ? ariaLabel : undefined}
        aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
        aria-invalid={state === 'error' ? 'true' : undefined}
      />

      {state === 'error' && errorMessage && (
        <p className="ds-selector__message" id={messageId} aria-live="polite">
          <span className="ds-selector__message-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Selector.displayName = 'Selector';
export default Selector;
