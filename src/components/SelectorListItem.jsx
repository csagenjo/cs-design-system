import React, { forwardRef } from 'react';
import { Icon } from './Icon';
import { injectStyles } from './_inputBase';
import { Radio } from './Radio';
import { Checkbox } from './Checkbox';
import { DescriptionText } from './DescriptionText';
import { DetailText } from './DetailText';

const css = `
.ds-selector-list-item {
  box-sizing:     border-box;
  display:        flex;
  align-items:    center;
  width:          100%;
  gap:            var(--ds-selector-root-gap);
  padding-left:   var(--ds-selector-root-padding);
  background:     var(--ds-selector-root-bg-generic);
  /* Unselected/Disabled no llevan borde real en Figma (corregido por Carol,
     10/09/2026 — antes había un borde gris de fondo aplicado siempre). Base
     transparente del mismo ancho que Selected/Error (1px) para que activar
     esos estados no desplace el layout 1px. */
  border:         var(--ds-selector-root-border-width-generic) solid transparent;
  border-radius:  var(--ds-selector-root-border-radius-generic);
  font-family:    inherit;
  text-align:     left;
  cursor:         pointer;
  transition:     border-color 0.12s, background 0.12s;
}

.ds-selector-list-item__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-selector-icon-fg-primary);
}
.ds-selector-list-item__icon-left svg {
  width:  var(--ds-selector-icon-left-size);
  height: var(--ds-selector-icon-left-size);
}

.ds-selector-list-item__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-selector-content-gap);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-selector-content-padding) var(--ds-selector-content-padding) var(--ds-selector-content-padding) 0;
}

.ds-selector-list-item__center {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-spacing-xs);
  flex:           1 1 auto;
  min-width:      0;
  text-align:     left;
}

.ds-selector-list-item__header {
  font-size:   var(--ds-fontSize-title-md);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-title-md);
  color:       var(--ds-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-selector-list-item__description,
.ds-selector-list-item__detail {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.ds-selector-list-item__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
}

/* Hover */
.ds-selector-list-item--unselected:hover,
.ds-selector-list-item--selected:hover {
  background: var(--ds-selector-root-bg-hover);
}

/* Pressed */
.ds-selector-list-item--unselected:active,
.ds-selector-list-item--selected:active {
  opacity: var(--ds-selector-root-opacity-pressed);
}

/* Selected — 2px real (Carol lo ajustó a propósito al ancho de foco, se ve
   mejor que el 1px inicial) */
.ds-selector-list-item--selected {
  border-width: var(--ds-selector-root-border-width-focus);
  border-color: var(--ds-selector-root-border-color-selected);
}

/* Error — 1px, distinto de Selected a propósito */
.ds-selector-list-item--error {
  border-color: var(--ds-selector-root-border-color-error);
}

/* Focus (Figma: anillo doble POR DENTRO de la fila — va apilada en listas y
   paneles, por fuera pisaría la vecina y lo recortaría el panel). Vale tanto
   si la fila es la opción enfocada (listbox) como si el foco está en su Radio. */
.ds-selector-list-item:focus-visible,
.ds-selector-list-item:has(:focus-visible) {
  outline:        var(--ds-selector-root-border-width-focus) solid var(--ds-selector-root-border-color-focus-outer);
  outline-offset: calc(var(--ds-selector-root-border-width-focus) * -1);
  box-shadow:     inset 0 0 0 calc(var(--ds-selector-root-border-width-focus) * 2) var(--ds-selector-root-border-color-focus-inner);
}
/* El anillo es de la fila (Figma Focus): el Radio/Checkbox de dentro no pinta el suyo */
.ds-selector-list-item .ds-radio:has(:focus-visible),
.ds-selector-list-item .ds-checkbox:has(:focus-visible) { outline: none; box-shadow: none; }

/* Data hidden */
.ds-selector-list-item--dataHidden { cursor: default; }

/* Disabled — sin borde, igual que Unselected (confirmado en Figma) */
.ds-selector-list-item--disabled {
  background: var(--ds-selector-root-bg-disabled);
  cursor:     not-allowed;
}
.ds-selector-list-item--disabled .ds-selector-list-item__icon-left { color: var(--ds-selector-icon-fg-disabled); }
.ds-selector-list-item--disabled .ds-selector-list-item__header { color: var(--ds-selector-header-fg-disabled); }
`;

injectStyles('ds-selector-list-item', css);

export const SelectorListItem = forwardRef(function SelectorListItem({
  data             = 'single',       // 'single' | 'multiple'
  state,                              // 'error' | 'disabled' | 'dataHidden' — selected/unselected se deriva de `selected`
  headerText       = 'Selected Data',
  descriptionText,
  detailText,
  descriptionEmphasis, // 'secondary' | 'tertiary' — color del detailText
  selected         = false,
  onSelectedChange,
  onClick,
  disabled         = false,
  icon             = <Icon name="file-text" size="sm" />, // slot libre — refleja "Left Panel" de Figma, con el mismo icono de antes por defecto
  showControl      = true, // oculta el Radio/Checkbox — refleja "Right Panel" de Figma (p. ej. Country Picker, donde el borde ya es la selección)
  name,          // A11y-4: mismo `name` en las filas de una lista → un grupo de radios (o envolver en RadioGroup)
  id,
  ...rest                   // A11y-1: role/aria-*/tabIndex/eventos de useListbox (`getOptionProps(i)`) llegan a la fila
}, forwardedRef) {

  // Como opción de un listbox (pickers, Combobox — A11y-1), la fila es la
  // única parada: el Radio/Checkbox de dentro pasa a ser solo visual
  // (`inert`, fuera del Tab y del lector), y el estado lo da aria-selected.
  const isOption = rest.role === 'option';

  const isDisabled   = disabled || state === 'disabled';
  const isError      = state === 'error';
  const isDataHidden = state === 'dataHidden';

  const rootClasses = [
    'ds-selector-list-item',
    isError      ? 'ds-selector-list-item--error'      : '',
    isDataHidden ? 'ds-selector-list-item--dataHidden'  : '',
    isDisabled   ? 'ds-selector-list-item--disabled'    : (selected ? 'ds-selector-list-item--selected' : 'ds-selector-list-item--unselected'),
  ].filter(Boolean).join(' ');

  const mask = (text) => (isDataHidden ? '••••••••' : text);

  function handleRowClick(e) {
    if (isDisabled) return;
    onSelectedChange?.(!selected);
    onClick?.(e);
  }

  const SelectionControl = data === 'multiple' ? Checkbox : Radio;

  return (
    <div
      {...rest}
      ref={forwardedRef}
      id={id ?? rest.id}
      className={rootClasses}
      aria-disabled={(isOption && isDisabled) || undefined}
      onClick={handleRowClick}
    >
      <span className="ds-selector-list-item__icon-left">
        {icon}
      </span>

      <span className="ds-selector-list-item__content">
        <span className="ds-selector-list-item__center">
          <span className="ds-selector-list-item__header">{headerText}</span>

          {descriptionText && (
            <span className="ds-selector-list-item__description">
              <DescriptionText color={isDisabled ? 'disabled' : 'subtle'} size="14">{mask(descriptionText)}</DescriptionText>
            </span>
          )}

          {detailText && (
            <span className="ds-selector-list-item__detail">
              <DetailText color={isDisabled ? 'disabled' : (descriptionEmphasis || 'default')} size="14">{mask(detailText)}</DetailText>
            </span>
          )}
        </span>

        {showControl && (
          <span className="ds-selector-list-item__right" inert={isOption || undefined} aria-hidden={isOption || undefined}>
            {/* Radio/Checkbox real — es el único control nativo enfocable de la fila.
                Su propio onChange no hace nada: el click de la fila (arriba) es la fuente de verdad;
                se deja como no-op para que React no marque el input como "uncontrolled". */}
            <SelectionControl
              checked={selected}
              state={isDisabled ? 'disabled' : 'default'}
              ariaLabel={[headerText, isDataHidden ? null : detailText].filter((t) => typeof t === 'string' && t).join(', ')} /* A11y-3: filas con el mismo título se distinguen por el detalle */
              onChange={() => {}}
              name={name}
            />
          </span>
        )}
      </span>
    </div>
  );
});

SelectorListItem.displayName = 'SelectorListItem';
export default SelectorListItem;
