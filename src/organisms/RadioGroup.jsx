/**
 * RadioGroup — Organismo (compone N Radio)
 * CS Design System · v1 · sprint A11y-4 (21/10/2026) · audit §H y §C
 *
 * Agrupa N `Radio` bajo una pregunta común. Antes cada Radio iba suelto: sin
 * `name` compartido el lector decía "1 de 1" en cada uno, las flechas no
 * movían entre opciones y no había sitio para la pregunta, el asterisco de
 * obligatorio ni el error del grupo.
 *
 * Estructura (pieza compartida `_choiceGroup.jsx`): <fieldset role="radiogroup">
 * + <legend> (la pregunta) + ayuda + opciones + error en región viva
 * persistente. Las opciones son <input type="radio"> nativos con el mismo
 * `name`, así que el navegador ya da una sola parada de Tab y las flechas.
 *
 * RadioGroup controla el valor: cada Radio hijo solo necesita `value` y
 * `label`. `required` pone el asterisco en la leyenda (nunca en las opciones,
 * regla de Carol 21/10) y `required` nativo en los radios. `state="error"` +
 * `errorMessage` marca todas las opciones como inválidas y las describe con
 * el error.
 *
 * Sin componente en Figma todavía — se compone con instancias de Radio + la
 * etiqueta de Input (mismo estilo que el label de los campos).
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
import { ChoiceGroup } from './_choiceGroup';
import { RadioGroupContext } from '../components/_radioGroupContext';

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

  return (
    <ChoiceGroup
      role="radiogroup"
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      state={state}
      required={required}
      orientation={orientation}
      spacing={spacing}
      id={id}
      className={['ds-radio-group', className].filter(Boolean).join(' ')}
      render={({ messageId }) => (
        <RadioGroupContext.Provider value={{
          name: groupName,
          value,
          onChange,
          required,
          invalid: state === 'error',
          disabled: state === 'disabled',
          describedBy: messageId || undefined,
        }}>
          {children}
        </RadioGroupContext.Provider>
      )}
    />
  );
}

export default RadioGroup;
