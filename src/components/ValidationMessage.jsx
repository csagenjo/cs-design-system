/**
 * ValidationMessage — Componente atómico (Form Elements)
 * CS Design System · v1 · 21/10/2026
 *
 * El mensaje bajo un campo: error de validación (con icono) o contador
 * (sin icono). Lo instancian Inputs, Selector, Account Selector, Combobox,
 * la fila de File Upload y RadioGroup / CheckboxGroup.
 *
 * Figma: `Validation Message` en 🟢 Form Elements — Body/xs (14/20), icono
 * `circle-x` de 16 px, separación icono–texto `validationMessage/all/root/gap`
 * (`spacing/md`). "Vertically Centered" y "Top Aligned" son el mismo
 * comportamiento en código: el icono se centra en la PRIMERA línea, así queda
 * centrado con una línea y arriba con varias. "Counter" = sin icono.
 *
 * Accesibilidad (A11y-4): el error vive dentro de una región viva que existe
 * siempre (`LiveRegion`), así se anuncia cuando aparece. El contador NO es
 * región viva (se anunciaría en cada pulsación); `live={false}` también para
 * quien ya anuncia por su cuenta (ListItem usa `announce()`).
 *
 * PROPS:
 *   id        para `aria-describedby` del control
 *   message   texto; sin texto no se pinta nada (la región sigue montada)
 *   type      'error' (por defecto, con icono) | 'counter' (sin icono)
 *   live      región viva (por defecto true en error, false en counter)
 *
 * USO:
 *   <ValidationMessage id={msgId} message={state === 'error' ? errorMessage : ''} />
 *   <ValidationMessage type="counter" message={`${n}/140`} />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { LiveRegion } from './LiveRegion';

injectStyles('ds-validation-message', `
/* margen sin especificidad: el que lo instancia puede cambiarlo con su clase */
:where(.ds-validation-message) { margin: var(--ds-input-validation-gap) 0 0; }
.ds-validation-message {
  display:     flex;
  align-items: flex-start;
  gap:         var(--ds-input-validation-message-gap);
  font-family: inherit;
  font-size:   var(--ds-fontSize-body-xs);
  font-weight: var(--ds-font-weight-regular);
  line-height: var(--ds-lineHeight-body-xs);
  color:       var(--ds-input-validation-fg-text);
}
.ds-validation-message__icon {
  display:     inline-flex;
  align-items: center;
  flex-shrink: 0;
  height:      var(--ds-lineHeight-body-xs);
  color:       var(--ds-input-fg-error);
}
`);

export function ValidationMessage({
  id,
  message,
  type = 'error',
  live,
  className,
}) {
  const isCounter = type === 'counter';
  const content = message ? (
    <p className={['ds-validation-message', className || ''].filter(Boolean).join(' ')} id={id}>
      {!isCounter && (
        <span className="ds-validation-message__icon">
          <Icon name="circle-x" size="2xs" />
        </span>
      )}
      {message}
    </p>
  ) : null;

  const isLive = live ?? !isCounter;
  return isLive ? <LiveRegion>{content}</LiveRegion> : content;
}

export default ValidationMessage;
