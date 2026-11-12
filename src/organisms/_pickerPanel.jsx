/**
 * _pickerPanel — helper interno (no exportado como componente). 12/11/2026.
 *
 * La caja flotante "Picker" que comparten Combobox, CountryPicker y
 * CurrencyPicker (Figma: Picker en 🟢 Combobox, Country Picker y Currency
 * Picker en 🟢 Inputs; tokens picker/all/*). Antes cada uno copiaba el mismo
 * CSS con px sueltos.
 *
 *   · `PICKER_CLASSES(side)` — clases de la caja (posición, padding 4, filas a 2,
 *     radio, sombra, filete en dark, scroll a partir de ~5 filas, giro arriba).
 *   · `PickerPanel` — la lista completa de Country / Currency Picker: listbox
 *     con teclado (`_usePickerListbox`), filas SelectorListItem y, si se pasan
 *     `groups`, un título por grupo (Figma `.Heading` = Section Header 19 bold).
 */
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { useFlip } from '../components/_floating';
import { SelectorListItem } from '../components/SelectorListItem';
import { SectionHeader } from '../components/SectionHeader';
import { usePickerListbox } from './_usePickerListbox';

const css = `
.ds-picker {
  position:      absolute;
  top:           100%;
  left:          0;
  right:         0;
  margin-top:    var(--ds-picker-root-offset);
  z-index:       var(--ds-picker-root-z-index);
  box-sizing:    border-box;
  max-height:    var(--ds-picker-root-max-height);
  overflow-y:    auto;
  padding:       var(--ds-picker-root-padding);
  background:    var(--ds-picker-root-bg);
  border:        var(--ds-picker-root-border-width) solid var(--ds-picker-root-border-color);
  border-radius: var(--ds-picker-root-border-radius);
  box-shadow:    var(--ds-picker-root-shadow);
}
.ds-picker--up {
  top:           auto;
  bottom:        100%;
  margin-top:    0;
  margin-bottom: var(--ds-picker-root-offset);
}
.ds-picker__list,
.ds-picker__group {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-picker-root-gap);
}
.ds-picker__heading {
  padding: var(--ds-picker-heading-padding-ver) var(--ds-picker-heading-padding-hor);
}
.ds-picker__empty {
  padding:   var(--ds-picker-empty-padding);
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  color:     var(--ds-picker-empty-fg);
}
`;

injectStyles('ds-picker', css);

export function pickerClasses(side, extra) {
  return ['ds-picker', side === 'top' ? 'ds-picker--up' : '', extra || ''].filter(Boolean).join(' ');
}

export function PickerPanel({
  open,
  onClose,
  onChange,
  value,
  items = [],
  groups,           // [{ label, items }] — título por grupo, como Show Category en Figma
  getValue,
  getLabel,
  renderIcon,
  ariaLabel,
  id,
}) {
  const flat = groups ? groups.flatMap((g) => g.items) : items;
  const { listboxProps, getOptionProps, rootRef } = usePickerListbox({
    open, onClose, onChange,
    items: flat, value,
    getValue, getLabel,
    label: ariaLabel,
  });
  const side = useFlip({ open, panelRef: rootRef, placement: 'bottom' });
  const baseId = useId();

  if (!open) return null;

  let index = 0;
  const option = (item) => {
    const i = index++;
    return (
      <SelectorListItem
        key={getValue(item)}
        {...getOptionProps(i)}
        data="single"
        headerText={getLabel(item)}
        icon={renderIcon ? renderIcon(item) : null}
        showControl={false}
        selected={getValue(item) === value}
      />
    );
  };

  return (
    <div className={pickerClasses(side, 'ds-picker__list')} {...listboxProps} id={id || listboxProps.id}>
      {groups
        ? groups.map((g, gi) => (
          <div key={gi} role="group" aria-labelledby={`${baseId}-g${gi}`} className="ds-picker__group">
            <div id={`${baseId}-g${gi}`} className="ds-picker__heading">
              <SectionHeader level={null} size="md">{g.label}</SectionHeader>
            </div>
            {g.items.map(option)}
          </div>
        ))
        : flat.map(option)}
    </div>
  );
}
