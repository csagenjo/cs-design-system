/**
 * _choiceGroup — pieza interna (no exportada) de RadioGroup y CheckboxGroup.
 * CS Design System · sprint A11y-4 (21/10/2026) · audit §H.
 *
 * La estructura común de un grupo de opciones: <fieldset> + <legend> (la
 * pregunta, con el asterisco de obligatorio) + ayuda + opciones + error de
 * grupo en una región viva persistente. Cada grupo decide el `role`
 * (radiogroup / group) y pasa su propio contexto a las opciones.
 *
 * Regla (Carol, 21/10): el asterisco va SOLO en la leyenda del grupo, nunca
 * en las opciones sueltas. Un check único obligatorio ("Acepto los términos")
 * también va dentro de un grupo con su pregunta.
 */
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Icon } from '../components/Icon';
import { HelperText } from '../components/HelperText';
import { LiveRegion } from '../components/LiveRegion';
import { VisuallyHidden } from '../components/VisuallyHidden';
import { RequiredMark } from '../components/_requiredMark';

injectStyles('ds-choice-group', `
.ds-choice-group {
  display:        flex;
  flex-direction: column;
  min-width:      0;
  margin:         0;
  padding:        0;
  border:         0;
  font-family:    inherit;
}
.ds-choice-group__legend {
  padding:       0;
  font-size:     var(--ds-fontSize-label-md);
  font-weight:   var(--ds-font-weight-bold);
  line-height:   var(--ds-lineHeight-label-md);
  color:         var(--ds-input-fg-label);
  margin-bottom: var(--ds-input-label-gap);
}
.ds-choice-group--disabled .ds-choice-group__legend { color: var(--ds-input-label-fg-disabled); }
.ds-choice-group__helper { margin-bottom: var(--ds-input-helper-gap); }
.ds-choice-group__options {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-choice-group-gap);
}
.ds-choice-group--horizontal .ds-choice-group__options { flex-direction: row; flex-wrap: wrap; }
.ds-choice-group--no-gap .ds-choice-group__options { gap: 0; }
.ds-choice-group__message {
  display:     flex;
  align-items: flex-start;
  gap:         var(--ds-spacing-xs);
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  color:       var(--ds-input-validation-fg-text);
  margin:      var(--ds-input-validation-gap) 0 0;
}
.ds-choice-group__message-icon {
  display: inline-flex;
  color:   var(--ds-input-fg-error);
}
`);

/**
 * `render(ids)` recibe { messageId } y devuelve las opciones envueltas en el
 * Provider del grupo concreto.
 */
export function ChoiceGroup({
  role,
  label,
  helperText,
  errorMessage,
  state = 'default',
  required = false,
  requiredLabel,       // solo grupos sin aria-required (checkbox): texto oculto en la leyenda
  orientation = 'vertical',
  spacing = 'default',
  id,
  className,
  render,
}) {
  const baseId = useId();
  const legendId = `${baseId}-legend`;
  const helperId = helperText ? `${baseId}-helper` : null;
  const messageId = state === 'error' && errorMessage ? `${baseId}-msg` : null;
  const describedBy = [helperId, messageId].filter(Boolean).join(' ') || undefined;
  const supportsRequired = role === 'radiogroup';

  const classes = [
    'ds-choice-group',
    orientation === 'horizontal' ? 'ds-choice-group--horizontal' : '',
    spacing === 'none' ? 'ds-choice-group--no-gap' : '',
    state === 'disabled' ? 'ds-choice-group--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <fieldset
      id={id}
      className={classes}
      role={role}
      aria-labelledby={legendId}
      aria-describedby={describedBy}
      aria-required={supportsRequired && required ? true : undefined}
      aria-invalid={supportsRequired && state === 'error' ? true : undefined}
      disabled={state === 'disabled'}
    >
      <legend className="ds-choice-group__legend" id={legendId}>
        {label}
        <RequiredMark show={required} />
        {required && !supportsRequired && requiredLabel && (
          <VisuallyHidden>{`, ${requiredLabel}`}</VisuallyHidden>
        )}
      </legend>
      {helperText && (
        <HelperText id={helperId} className="ds-choice-group__helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}
      <div className="ds-choice-group__options">{render({ messageId })}</div>
      <LiveRegion>
        {state === 'error' && errorMessage && (
          <p className="ds-choice-group__message" id={messageId}>
            <span className="ds-choice-group__message-icon"><Icon name="circle-x" size="2xs" /></span>
            {errorMessage}
          </p>
        )}
      </LiveRegion>
    </fieldset>
  );
}
