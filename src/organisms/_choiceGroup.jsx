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
import { HelperText } from '../components/HelperText';
import { VisuallyHidden } from '../components/VisuallyHidden';
import { FieldLabel } from '../components/FieldLabel';
import { ValidationMessage } from '../components/ValidationMessage';

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
.ds-choice-group__legend { margin-bottom: var(--ds-input-label-gap); }
.ds-choice-group__helper { margin-bottom: var(--ds-input-helper-gap); }
.ds-choice-group__options {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-choice-group-gap);
}
.ds-choice-group--horizontal .ds-choice-group__options { flex-direction: row; flex-wrap: wrap; }
.ds-choice-group--no-gap .ds-choice-group__options { gap: 0; }
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
      <FieldLabel as="legend" className="ds-choice-group__legend" id={legendId} required={required} disabled={state === 'disabled'}>
        {label}
        {required && !supportsRequired && requiredLabel && (
          <VisuallyHidden>{`, ${requiredLabel}`}</VisuallyHidden>
        )}
      </FieldLabel>
      {helperText && (
        <HelperText id={helperId} className="ds-choice-group__helper" disabled={state === 'disabled'}>{helperText}</HelperText>
      )}
      <div className="ds-choice-group__options">{render({ messageId })}</div>
      <ValidationMessage id={messageId} message={state === 'error' ? errorMessage : ''} />
    </fieldset>
  );
}
