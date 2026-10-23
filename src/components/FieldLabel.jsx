/**
 * FieldLabel — Componente atómico (Form Elements)
 * CS Design System · v1 · 21/10/2026
 *
 * El label de cualquier campo de formulario: Inputs, Selector, Account
 * Selector, Combobox, la cabecera de File Upload y la pregunta (leyenda) de
 * RadioGroup / CheckboxGroup. Antes cada uno tenía su propia copia del mismo
 * CSS; ahora todos instancian este átomo.
 *
 * Figma: `Label` en la página 🟢 Form Elements. La booleana `Required` enciende
 * el asterisco (color de marca `fieldLabel/all/required/fg/generic` →
 * `fg/label/primary`; rojo se reserva para error). Tokens propios
 * `--ds-field-label-*` (`fieldLabel/all/*`, 23/10/2026), ya no los de Input. El asterisco es solo
 * visual: el "required" lo anuncia el atributo del control.
 *
 * El margen con lo que viene debajo NO vive aquí: cada componente lo pone
 * con su propia clase (`className`), igual que en Figma lo pone el auto-layout
 * del padre.
 *
 * PROPS:
 *   as        'label' (por defecto) | 'span' | 'p' | 'legend'
 *   htmlFor   id del control (solo con as="label"); hace el label clicable
 *   required  muestra el asterisco
 *   disabled  color deshabilitado
 *
 * USO:
 *   <FieldLabel htmlFor={inputId} required>Name</FieldLabel>
 *   <FieldLabel as="legend" required>Account type</FieldLabel>
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { RequiredMark } from './_requiredMark';

injectStyles('ds-field-label', `
/* margen a 0 sin especificidad: el que lo instancia pone el suyo con su clase */
:where(.ds-field-label) { margin: 0; }
.ds-field-label {
  padding:     0;
  font-family: inherit;
  font-size:   var(--ds-fontSize-label-md);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-label-md);
  color:       var(--ds-field-label-fg-generic);
  cursor:      default;
}
.ds-field-label--clickable { cursor: pointer; }
.ds-field-label--disabled  { color: var(--ds-field-label-fg-disabled); cursor: default; }
`);

export function FieldLabel({
  as: Tag = 'label',
  htmlFor,
  id,
  required = false,
  disabled = false,
  className,
  children,
  ...rest
}) {
  const classes = [
    'ds-field-label',
    htmlFor && !disabled ? 'ds-field-label--clickable' : '',
    disabled ? 'ds-field-label--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} id={id} htmlFor={Tag === 'label' ? htmlFor : undefined} {...rest}>
      {children}
      <RequiredMark show={required} />
    </Tag>
  );
}

export default FieldLabel;
