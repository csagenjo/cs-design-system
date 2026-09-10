/**
 * Combobox — Organismo
 * CS Design System · v1.0
 *
 * Compone `InputCombobox` (átomo, el campo) + un panel flotante ("Picker" en
 * Figma) de resultados — reutiliza `SelectorListItem` (ya construido, Sprint
 * 1) para cada fila, NO `ListView`. Vaivén real de esta sesión: primero
 * "Selection Cells" parecía derivar de `ListView` (así lo indicó Carol al
 * dar los node-ids), y el borde de 4 lados de su estado "Selected" se
 * diagnosticó como un bug (`ListView` representa selección con un ribbon en
 * el borde izquierdo, no con un borde completo) — corregido en Figma. Pero
 * revisando el resultado, Carol prefirió pivotar a `Selector List Item`
 * (`data="single"|"multiple"` → Radio/Checkbox real, mapea 1:1 con la prop
 * `multiple` de este organismo) porque el borde completo SÍ es su mecanismo
 * legítimo de selección (no un hack) y es más evidente en un desplegable de
 * N resultados. El fix de `ListView` (ribbon) se queda — es correcto para
 * el uso normal de `ListView` en Search for Results; simplemente el Picker
 * de Combobox usa otro átomo. Aquí `selected` en cada fila representa cuál
 * es la CANDIDATA resaltada por teclado (↑/↓), no si ya está elegida — las
 * ya elegidas en modo `multiple` ni siquiera aparecen en la lista (ver
 * `availableOptions` abajo).
 * El Picker no tiene átomo propio en Figma más allá de la composición (N ×
 * Selector List Item) — mismo criterio que `Table`/`FileSelector`: wrapper
 * puro, `options.length` decide cuántas filas, sin el límite `Results=1..5`
 * que Figma solo documenta como muestra.
 *
 * Gestiona TODO el estado real que `InputCombobox` no gestiona (mismo
 * criterio que Selector/SelectorInvoker): abrir/cerrar, filtrado por texto
 * tecleado, índice resaltado por teclado (↑/↓/Enter/Escape), cierre al
 * clicar fuera, y selección única (`value`) o múltiple (`selectedValues`,
 * pintados como `Chip type="input"` dentro del propio campo).
 *
 * Posicionamiento del panel: `absolute` local bajo el campo, sin depender de
 * un mecanismo de popover compartido — este proyecto todavía no tiene uno
 * (misma deuda ya anotada para Country/Currency Picker de Selector).
 * Decisión explícita de Carol: no bloquear Combobox en construirlo antes,
 * eso le toca a Popover Sheet cuando llegue su turno en el sprint.
 *
 * `autoSuggestText` (sugerencia gris tipo autocompletado) se calcula aquí:
 * la primera opción filtrada cuya etiqueta empiece por lo tecleado.
 *
 * USO:
 *   <Combobox
 *     label="País"
 *     options={[{ value: 'es', label: 'España' }, { value: 'fr', label: 'Francia' }]}
 *     value={value}
 *     onChange={setValue}
 *   />
 *
 *   <Combobox
 *     label="Etiquetas"
 *     multiple
 *     options={options}
 *     selectedValues={selected}
 *     onSelectedValuesChange={setSelected}
 *   />
 */

import React, { useState, useRef, useEffect, useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { InputCombobox } from '../components/InputCombobox';
import { SelectorListItem } from '../components/SelectorListItem';

const css = `
.ds-combobox {
  position: relative;
  width: 100%;
}
.ds-combobox__picker {
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
}
.ds-combobox__empty {
  padding:   16px;
  font-size: var(--ds-fontSize-body-sm);
  color:     var(--ds-fg-subtle);
  text-align: center;
}
`;

injectStyles('ds-combobox', css);

export function Combobox({
  options = [],
  multiple = false,
  value = '',
  onChange,
  selectedValues = [],
  onSelectedValuesChange,
  label,
  ariaLabel,
  placeholder,
  iconLeft,
  helperText,
  errorMessage,
  state = 'default',
  fullWidth = false,
  emptyMessage = 'Sin resultados',
  id,
}) {
  const generatedId = useId();
  const rootId = id || generatedId;
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(multiple ? '' : (options.find(o => o.value === value)?.label || ''));
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    if (!multiple) {
      const selected = options.find(o => o.value === value);
      if (!open) setQuery(selected ? selected.label : '');
    }
  }, [value, multiple, open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleOutsideClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const availableOptions = multiple
    ? options.filter(o => !selectedValues.includes(o.value))
    : options;
  const filtered = query
    ? availableOptions.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : availableOptions;

  const autoSuggestText = (!multiple && query)
    ? (filtered.find(o => o.label.toLowerCase().startsWith(query.toLowerCase()))?.label || '')
    : '';

  function openPicker() {
    setOpen(true);
    setHighlighted(0);
  }

  function selectOption(opt) {
    if (multiple) {
      onSelectedValuesChange?.([...selectedValues, opt.value]);
      setQuery('');
    } else {
      onChange?.(opt.value);
      setQuery(opt.label);
    }
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleValueChange(next) {
    setQuery(next);
    if (!multiple && next === '') onChange?.('');
    openPicker();
  }

  function handleRemoveChip(index) {
    const next = selectedValues.filter((_, i) => i !== index);
    onSelectedValuesChange?.(next);
  }

  function handleClear() {
    setQuery('');
    if (!multiple) onChange?.('');
    inputRef.current?.focus();
    openPicker();
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { openPicker(); return; }
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[highlighted]) selectOption(filtered[highlighted]);
      else if (autoSuggestText) {
        const match = filtered.find(o => o.label === autoSuggestText);
        if (match) selectOption(match);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      if (!multiple) setQuery(options.find(o => o.value === value)?.label || '');
    } else if (e.key === 'Tab' && autoSuggestText) {
      e.preventDefault();
      setQuery(autoSuggestText);
    }
  }

  const selectedChips = multiple
    ? selectedValues.map(v => options.find(o => o.value === v)).filter(Boolean)
    : [];

  return (
    <div className="ds-combobox" ref={rootRef} id={rootId}>
      <InputCombobox
        ref={inputRef}
        label={label}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        value={query}
        onValueChange={handleValueChange}
        autoSuggestText={autoSuggestText}
        multiple={multiple}
        selectedChips={selectedChips}
        onRemoveChip={handleRemoveChip}
        iconLeft={iconLeft}
        state={state}
        helperText={helperText}
        errorMessage={errorMessage}
        fullWidth={fullWidth}
        open={open}
        onToggleOpen={() => (open ? setOpen(false) : openPicker())}
        onClear={handleClear}
        onFocus={openPicker}
        onKeyDown={handleKeyDown}
      />

      {/* onMouseDown con preventDefault: sin esto, clicar una fila BLUR-ea el
          input antes de que el click complete, y el refocus de selectOption
          dispara onFocus -> openPicker de nuevo, reabriendo el panel con la
          opción recién elegida como único resultado filtrado — patrón
          estándar para paneles de combobox/autocomplete. */}
      {open && state !== 'disabled' && (
        <div
          className="ds-combobox__picker"
          role="listbox"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filtered.length === 0 && (
            <div className="ds-combobox__empty">{emptyMessage}</div>
          )}
          {filtered.map((opt, i) => (
            <SelectorListItem
              key={opt.value}
              data={multiple ? 'multiple' : 'single'}
              headerText={opt.label}
              descriptionText={opt.description}
              selected={i === highlighted}
              onClick={() => selectOption(opt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Combobox;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Combobox
  label="País"
  ariaLabel="País"
  options={[
    { value: 'es', label: 'España' },
    { value: 'fr', label: 'Francia' },
    { value: 'de', label: 'Alemania' },
  ]}
  value={value}
  onChange={setValue}
/>

<Combobox
  label="Etiquetas"
  multiple
  options={options}
  selectedValues={selected}
  onSelectedValuesChange={setSelected}
/>
*/
