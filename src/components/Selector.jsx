import React, { forwardRef, useId } from 'react';
import { injectStyles } from './_inputBase';
import { SelectorInvoker } from './SelectorInvoker';
import { FieldLabel } from './FieldLabel';
import { HelperText } from './HelperText';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-selector {
  display:        inline-flex;
  flex-direction: column;
  font-family:    inherit;
}
.ds-selector--full-width { display: flex; width: 100%; }

.ds-selector__label { margin-bottom: var(--ds-input-label-gap); }

.ds-selector__helper  { margin-bottom: var(--ds-input-helper-gap); }
.ds-selector__message { margin-top: var(--ds-input-validation-gap); }

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
        <FieldLabel className="ds-selector__label" htmlFor={invokerId} id={labelId} disabled={state === 'disabled'}>{label}</FieldLabel>
      )}

      {helperText && (
        <HelperText id={helperId} className="ds-selector__helper" disabled={state === 'disabled'}>{helperText}</HelperText>
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
        aria-labelledby={labelId ? `${labelId} ${invokerId}` : undefined}
        expanded={expanded}
        haspopup={haspopup}
        aria-describedby={[helperId, messageId].filter(Boolean).join(' ') || undefined}
        aria-invalid={state === 'error' ? 'true' : undefined}
      />
      <ValidationMessage className="ds-selector__message" id={messageId} message={state === 'error' ? errorMessage : ''} />
    </div>
  );
});

Selector.displayName = 'Selector';
export default Selector;
