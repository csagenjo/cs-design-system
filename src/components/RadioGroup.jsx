/**
 * RadioGroup — Componente (composición de Radio)
 * CS Design System · v1 · sprint A11y-4 (21/10/2026) · audit §H y §C
 *
 * Agrupa N `Radio` bajo una pregunta común. Antes cada Radio iba suelto: sin
 * `name` compartido el lector decía "1 de 1" en cada uno, las flechas no
 * movían entre opciones y no había sitio para la etiqueta del grupo, el
 * asterisco de obligatorio ni el error del grupo.
 *
 * Estructura: <fieldset role="radiogroup"> + <legend> (la pregunta) +
 * ayuda + opciones + error en región viva persistente. Las opciones son
 * <input type="radio"> nativos con el mismo `name`, así que el navegador ya
 * da una sola parada de Tab y las flechas.
 *
 * RadioGroup controla el valor: cada Radio hijo solo necesita `value` y
 * `label`. `required` pone el asterisco en la leyenda (no en cada opción) y
 * `required` en los radios. `state="error"` + `errorMessage` marca todas las
 * opciones como inválidas y las describe con el error.
 *
 * Sin componente en Figma todavía — se construye con instancias de Radio +
 * la etiqueta de Input (mismo estilo que el label de los campos).
 *
 * USO:
 *   <RadioGroup label="Account type" name="type" value={type} onChange={setType} required>
 *     <Radio value="personal" label="Personal" />
 *     <Radio value="business" label="Business" />
 *   </RadioGroup>
 *
 *   Lista de SelectorListItem / AccountSelectorListItem de selección única:
 *   <RadioGroup label="Debit account" spacing="none" value={id} onChange={setId}>
 *     {accounts.map((a) => <SelectorListItem key={a.id} … selected={a.id === id}
 *       onSelectedChange={() => setId(a.id)} />)}
 *   </RadioGroup>
 */
import React, { useId } from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { HelperText } from './HelperText';
import { LiveRegion } from './LiveRegion';
import { RequiredMark } from './_requiredMark';
import { RadioGroupContext } from './_radioGroupContext';

injectStyles('ds-radio-group', `
.ds-radio-group {
  display:     flex;
  flex-direction: column;
  min-width:   0;
  margin:      0;
  padding:     0;
  border:      0;
  font-family: inherit;
}
.ds-radio-group__legend {
  padding:       0;
  font-size:     var(--ds-fontSize-label-md);
  font-weight:   var(--ds-font-weight-bold);
  line-height:   var(--ds-lineHeight-label-md);
  color:         var(--ds-input-fg-label);
  margin-bottom: var(--ds-input-label-gap);
}
.ds-radio-group--disabled .ds-radio-group__legend { color: var(--ds-input-label-fg-disabled); }
.ds-radio-group__helper { margin-bottom: var(--ds-input-helper-gap); }
.ds-radio-group__options {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-radio-group-gap);
}
.ds-radio-group--horizontal .ds-radio-group__options { flex-direction: row; flex-wrap: wrap; }
.ds-radio-group--no-gap .ds-radio-group__options { gap: 0; }
.ds-radio-group__message {
  display:     flex;
  align-items: flex-start;
  gap:         var(--ds-spacing-xs);
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
}
.ds-radio-group__message-icon {
  display: inline-flex;
  color:   var(--ds-input-fg-error);
}
`);

export function RadioGroup({
  label,
  helperText,
  errorMessage,
  state       = 'default', // 'default' | 'error' | 'disabled'
  name,
  value,
  onChange,
  required    = false,
  orientation = 'vertical', // 'vertical' | 'horizontal'
  spacing     = 'default',  // 'default' | 'none' (filas pegadas: SelectorListItem / AccountSelectorListItem)
  id,
  className,
  children,
}) {
  const baseId = useId();
  const groupName = name || `${baseId}-radio`;
  const legendId = `${baseId}-legend`;
  const helperId = helperText ? `${baseId}-helper` : null;
  const messageId = state === 'error' && errorMessage ? `${baseId}-msg` : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;

  const ctx = {
    name: groupName,
    value,
    onChange,
    required,
    invalid: state === 'error',
    disabled: state === 'disabled',
    describedBy: messageId || undefined,
  };

  const classes = [
    'ds-radio-group',
    orientation === 'horizontal' ? 'ds-radio-group--horizontal' : '',
    spacing === 'none' ? 'ds-radio-group--no-gap' : '',
    state === 'disabled' ? 'ds-radio-group--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <fieldset
      id={id}
      className={classes}
      role="radiogroup"
      aria-labelledby={legendId}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      aria-invalid={state === 'error' || undefined}
      disabled={state === 'disabled'}
    >
      <legend className="ds-radio-group__legend" id={legendId}>
        {label}
        <RequiredMark show={required} />
      </legend>
      {helperText && (
        <HelperText id={helperId} className="ds-radio-group__helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}
      <RadioGroupContext.Provider value={ctx}>
        <div className="ds-radio-group__options">{children}</div>
      </RadioGroupContext.Provider>
      <LiveRegion>
        {state === 'error' && errorMessage && (
          <p className="ds-radio-group__message" id={messageId}>
            <span className="ds-radio-group__message-icon"><Icon name="circle-x" size="2xs" /></span>
            {errorMessage}
          </p>
        )}
      </LiveRegion>
    </fieldset>
  );
}

export default RadioGroup;
