/**
 * CheckboxGroup — Organismo (compone N Checkbox)
 * CS Design System · v1 · sprint A11y-4 (21/10/2026) · audit §H
 *
 * Pareja de RadioGroup para selección múltiple: una pregunta común
 * (<legend>), ayuda, opciones y error de grupo en región viva persistente
 * (pieza compartida `_choiceGroup.jsx`). `<fieldset role="group">`.
 *
 * Controla los valores: `values` (array) + `onChange(nextValues)`. Cada
 * Checkbox hijo solo necesita `value` y `label`.
 *
 * Obligatorio (regla de Carol, 21/10): el asterisco va en la leyenda del
 * grupo, nunca en las opciones. Un check único obligatorio ("Acepto los
 * términos") va también dentro de un CheckboxGroup con su pregunta.
 *   · Con UNA opción, esa opción lleva `required` nativo (tiene que marcarse).
 *   · Con VARIAS, ninguna es obligatoria por sí sola, así que no llevan
 *     `required` nativo (exigiría marcarlas todas): la leyenda añade un texto
 *     oculto ", required" (`requiredLabel`, inglés por defecto) para el lector,
 *     porque `role="group"` no admite `aria-required`. Comprobar el mínimo es
 *     del formulario consumidor.
 *
 * Sin componente en Figma todavía — se compone con instancias de Checkbox +
 * la etiqueta de Input.
 *
 * USO:
 *   <CheckboxGroup label="Notifications" values={v} onChange={setV}>
 *     <Checkbox value="email" label="Email" />
 *     <Checkbox value="sms" label="SMS" />
 *   </CheckboxGroup>
 *
 *   <CheckboxGroup label="Terms and conditions" values={v} onChange={setV} required>
 *     <Checkbox value="accept" label="I accept the terms" />
 *   </CheckboxGroup>
 */
import React, { useId, Children } from 'react';
import { ChoiceGroup } from './_choiceGroup';
import { CheckboxGroupContext } from '../components/_checkboxGroupContext';

export function CheckboxGroup({
  label,
  helperText,
  errorMessage,
  state         = 'default', // 'default' | 'error' | 'disabled'
  name,
  values        = [],
  onChange,
  required      = false,
  requiredLabel = 'required',
  orientation   = 'vertical', // 'vertical' | 'horizontal'
  spacing       = 'default',  // 'default' | 'none'
  id,
  className,
  children,
}) {
  const baseId = useId();
  const groupName = name || `${baseId}-check`;
  const single = Children.toArray(children).filter(Boolean).length === 1;

  const toggle = (value, checked) => {
    const next = checked ? [...values.filter((v) => v !== value), value] : values.filter((v) => v !== value);
    onChange?.(next);
  };

  return (
    <ChoiceGroup
      role="group"
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      state={state}
      required={required}
      requiredLabel={single ? undefined : requiredLabel}
      orientation={orientation}
      spacing={spacing}
      id={id}
      className={['ds-checkbox-group', className].filter(Boolean).join(' ')}
      render={({ messageId }) => (
        <CheckboxGroupContext.Provider value={{
          name: groupName,
          values,
          toggle,
          required: required && single,
          invalid: state === 'error',
          disabled: state === 'disabled',
          describedBy: messageId || undefined,
        }}>
          {children}
        </CheckboxGroupContext.Provider>
      )}
    />
  );
}

export default CheckboxGroup;
