/**
 * CountryPicker — Organismo
 * CS Design System · v1.2 (12/11/2026: caja Picker compartida, grupos con título, giro arriba si no cabe)
 *
 * Panel flotante de selección de país — cierra la deuda técnica de
 * "Country/Currency Picker" (§10 CLAUDE.md): InputTelephone.jsx ya dispara
 * `onCountryClick` pero no gestiona ningún picker, es responsabilidad de
 * este organismo separado.
 *
 * Node-ids EXPLORE: `Selection cells` (22974-9064), `Country Picker`
 * (22974-9071). Mismo pivote arquitectónico que el Picker de Combobox: cada
 * fila es una instancia de `SelectorListItem` con `Right Panel=false`
 * (Figma) → `showControl={false}` aquí — el borde completo es la única
 * señal de selección, sin Radio visible. `Left Panel=true` → `icon` recibe
 * una `CountryFlag`, no el `file-text` genérico por defecto del átomo.
 *
 * El panel reutiliza literalmente los tokens `--ds-combobox-picker-*`
 * (bg/border-radius/shadow) — Figma hace lo mismo: el fondo del Country
 * Picker está enlazado a `combobox/all/root/bg/generic`, el mismo token que
 * el Picker de Combobox, no uno nuevo. Mismo criterio de reutilización que
 * ya aplicamos en código.
 *
 * A diferencia de Combobox, el Country Picker real (Figma) no tiene campo de
 * búsqueda — solo lista países, click para elegir. Por eso este organismo NO
 * filtra por texto; si se necesita búsqueda en el futuro, es una extensión
 * consciente, no algo que Figma ya define hoy.
 *
 * Posicionamiento: panel `absolute` bajo el campo (o encima, si abajo no
 * cabe en la ventana — `useFlip`, 12/11); el consumidor envuelve el trigger
 * (p. ej. InputTelephone) en un contenedor `position: relative`. La caja es
 * el Picker compartido con Combobox (`_pickerPanel.jsx`, tokens picker/all/*).
 *
 * USO:
 *   <div style={{ position: 'relative' }}>
 *     <InputTelephone ... onCountryClick={() => setOpen(true)} />
 *     <CountryPicker
 *       open={open}
 *       countries={[{ value: 'es', label: 'SP | Spain (+34)', flag: 'spain' }]}
 *       value={value}
 *       onChange={setValue}
 *       onClose={() => setOpen(false)}
 *     />
 *   </div>
 */

import React from 'react';
import { PickerPanel } from './_pickerPanel';
import { CountryFlag } from '../components/CountryFlag';

export function CountryPicker({
  countries = [],
  groups,                    // [{ label: 'Most used', items: [...] }, ...] — título por grupo (Figma: Show Category)
  value,
  onChange,
  open = false,
  onClose,
  ariaLabel = 'Countries',   // nombre del listbox para lector de pantalla (inglés por defecto, decisión 20/10)
  id,
}) {
  // Listbox real con teclado, foco y cierre por Escape/Tab/click-fuera
  // (A11y-1, ver _usePickerListbox.js). Caja y giro: _pickerPanel.jsx (12/11).
  return (
    <PickerPanel
      open={open}
      onClose={onClose}
      onChange={onChange}
      value={value}
      items={countries}
      groups={groups}
      getValue={(c) => c.value}
      getLabel={(c) => c.label}
      renderIcon={(c) => <CountryFlag country={c.flag} />}
      ariaLabel={ariaLabel}
      id={id}
    />
  );
}

export default CountryPicker;


/* ─── Ejemplo de uso ──────────────────────────────────────────────────────

const countries = [
  { value: 'es', label: 'SP | Spain (+34)', flag: 'spain' },
  { value: 'fr', label: 'FR | France (+33)', flag: 'france' },
  { value: 'gb', label: 'UK | United Kingdom (+44)', flag: 'united-kingdom' },
];

<div style={{ position: 'relative', display: 'inline-block' }}>
  <InputTelephone
    flagEmoji="🇪🇸"
    countryCode="+34"
    onCountryClick={() => setPickerOpen(true)}
  />
  <CountryPicker
    open={pickerOpen}
    countries={countries}
    value={selectedCountry}
    onChange={setSelectedCountry}
    onClose={() => setPickerOpen(false)}
  />
</div>
*/
