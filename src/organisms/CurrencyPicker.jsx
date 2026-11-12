/**
 * CurrencyPicker — Organismo
 * CS Design System · v1.1 (12/11/2026: caja Picker compartida, grupos con título, giro arriba si no cabe; componente nuevo en Figma)
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
 * Figma (12/11): componente propio `Currency Picker` en 🟢 Inputs (sección
 * Input Amount), clonado de Country Picker con `.Selection Cells`
 * `Cell Type=Currency` (sin bandera). Antes solo existía en código. Misma
 * caja Picker que Combobox y Country Picker (`--ds-picker-*`).
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
import { PickerPanel } from './_pickerPanel';

export function CurrencyPicker({
  currencies = [],
  groups,                     // [{ label: 'Most used', items: [...] }, ...] — título por grupo (Figma: Show Category)
  value,
  onChange,
  open = false,
  onClose,
  ariaLabel = 'Currencies',  // nombre del listbox para lector de pantalla (inglés por defecto, decisión 20/10)
  id,
}) {
  // Listbox real con teclado — mismo helper que CountryPicker (A11y-1).
  // Caja y giro: _pickerPanel.jsx (12/11). Fila sin bandera: "EUR — Euro".
  return (
    <PickerPanel
      open={open}
      onClose={onClose}
      onChange={onChange}
      value={value}
      items={currencies}
      groups={groups}
      getValue={(c) => c.code}
      getLabel={(c) => `${c.code} — ${c.name}`}
      ariaLabel={ariaLabel}
      id={id}
    />
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
