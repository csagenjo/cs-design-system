/**
 * CurrencyPicker — Organismo
 * CS Design System · v1.0
 *
 * Panel flotante de selección de moneda — cierra la deuda técnica de
 * "Country/Currency Picker" (§10 CLAUDE.md): `InputAmount.jsx` ya dispara
 * `onCurrencyClick` pero no gestiona ningún picker, es responsabilidad de
 * este organismo separado. Mismo patrón que `CountryPicker`, MÁS simple:
 * sin `CountryFlag` — cada fila es texto plano ("USD — US Dollar", "EUR —
 * Euro"), no hace falta ningún arte multicolor ni exportación de assets.
 * `icon={null}` en `SelectorListItem` (en vez de su `file-text` por
 * defecto) — sin icono real que mostrar, no un placeholder genérico.
 *
 * Sin nodo propio en Figma — a diferencia de Country Picker (que sí tenía
 * `Selection cells`/`Country Picker` ya diseñados antes de tocar código),
 * aquí no hace falta ningún diseño nuevo: reutiliza `SelectorListItem`
 * (`Right Panel=false` → `showControl={false}`, mismo borde-como-selección
 * que Country Picker) y el mismo chrome de panel que Combobox/CountryPicker
 * (`--ds-combobox-picker-*`, ya existente). Mismo criterio que Table/
 * CellActions/ButtonBar: composición pura, sin componente propio en Figma.
 *
 * La lista real de monedas (ISO 4217, probablemente desde una base de datos
 * o endpoint) es responsabilidad del consumidor — este organismo solo recibe
 * `currencies` como array, desacoplado de dónde sale el dato.
 *
 * Sin campo de búsqueda, mismo criterio que Country Picker.
 *
 * USO:
 *   <div style={{ position: 'relative' }}>
 *     <InputAmount ... onCurrencyClick={() => setOpen(true)} />
 *     <CurrencyPicker
 *       open={open}
 *       currencies={[{ code: 'USD', name: 'US Dollar' }]}
 *       value={value}
 *       onChange={setValue}
 *       onClose={() => setOpen(false)}
 *     />
 *   </div>
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { usePickerListbox } from './_usePickerListbox';
import { SelectorListItem } from '../components/SelectorListItem';

const css = `
.ds-currency-picker {
  position:      absolute;
  top:           100%;
  left:          0;
  right:         0;
  margin-top:    4px;
  z-index:       20;
  background:    var(--ds-combobox-picker-bg);
  border-radius: var(--ds-combobox-picker-border-radius);
  box-shadow:    var(--ds-combobox-picker-shadow);
  overflow:      hidden;
  max-height:    320px;
  overflow-y:    auto;
  padding:       4px;
  display:       flex;
  flex-direction: column;
  gap:           2px;
}
`;

injectStyles('ds-currency-picker', css);

export function CurrencyPicker({
  currencies = [],
  value,
  onChange,
  open = false,
  onClose,
  ariaLabel = 'Currencies',  // nombre del listbox para lector de pantalla (inglés por defecto, decisión 20/10)
  id,
}) {
  // Listbox real con teclado — mismo helper que CountryPicker (A11y-1).
  const label = (c) => `${c.code} — ${c.name}`;
  const { listboxProps, getOptionProps } = usePickerListbox({
    open, onClose, onChange,
    items: currencies, value,
    getValue: (c) => c.code,
    getLabel: label,
    label: ariaLabel,
  });

  if (!open) return null;

  return (
    <div className="ds-currency-picker" {...listboxProps} id={id || listboxProps.id}>
      {currencies.map((currency, i) => (
        <SelectorListItem
          key={currency.code}
          {...getOptionProps(i)}
          data="single"
          headerText={label(currency)}
          icon={null}
          showControl={false}
          selected={currency.code === value}
        />
      ))}
    </div>
  );
}

export default CurrencyPicker;


/* ─── Ejemplo de uso ──────────────────────────────────────────────────────

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];

<div style={{ position: 'relative', display: 'inline-block' }}>
  <InputAmount
    currency="EUR"
    onCurrencyClick={() => setPickerOpen(true)}
  />
  <CurrencyPicker
    open={pickerOpen}
    currencies={currencies}
    value={selectedCurrency}
    onChange={setSelectedCurrency}
    onClose={() => setPickerOpen(false)}
  />
</div>
*/
