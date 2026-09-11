/**
 * CountryPicker — Organismo
 * CS Design System · v1.0
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
 * Posicionamiento: panel `absolute` local (`top:100%`), igual que el Picker
 * de Combobox — el consumidor solo necesita envolver el trigger (p. ej.
 * InputTelephone) en un contenedor `position: relative`. Sin popover
 * compartido todavía (misma deuda ya anotada para Combobox/Selector).
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

import React, { useEffect, useRef } from 'react';
import { injectStyles } from '../components/_inputBase';
import { SelectorListItem } from '../components/SelectorListItem';
import { CountryFlag } from '../components/CountryFlag';

const css = `
.ds-country-picker {
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

injectStyles('ds-country-picker', css);

export function CountryPicker({
  countries = [],
  value,
  onChange,
  open = false,
  onClose,
  id,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ds-country-picker" ref={rootRef} id={id} role="listbox">
      {countries.map((country) => (
        <SelectorListItem
          key={country.value}
          data="single"
          headerText={country.label}
          icon={<CountryFlag country={country.flag} size={22} />}
          showControl={false}
          selected={country.value === value}
          onClick={() => {
            onChange?.(country.value);
            onClose?.();
          }}
        />
      ))}
    </div>
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
