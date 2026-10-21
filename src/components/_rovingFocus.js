/**
 * _rovingFocus — comportamiento de teclado compartido para grupos y listas,
 * NO exportado como componente público. Sprint A11y-0 (20/10/2026) · audit §C.
 *
 * Tres piezas, de menos a más:
 *
 * ─ nextIndex(current, key, count, options) ─────────────────────────────────
 *   Función pura: dado el índice actual y una tecla, ¿a qué índice se va?
 *   Flechas según orientación, Home/End, salta los deshabilitados, con o sin
 *   vuelta al principio. Devuelve `null` si la tecla no es de navegación.
 *
 * ─ useRovingFocus ──────────────────────────────────────────────────────────
 *   Patrón "roving tabindex" (WAI-ARIA APG): el grupo es UNA sola parada de
 *   Tab; dentro, las flechas mueven el foco. Para SegmentedControl, Tabs,
 *   grupos de Radio, toolbars (A11y-1/3).
 *
 *     const roving = useRovingFocus({ count: items.length, activeIndex: selectedIndex,
 *                                     orientation: 'horizontal' });
 *     items.map((it, i) => <button {...roving.getItemProps(i)} …/>)
 *
 *   `onActiveIndexChange(i)` se llama al mover el foco — un grupo de radios o
 *   unas tabs con "la selección sigue al foco" seleccionan ahí; si no, se
 *   selecciona solo con click/Enter/Espacio como siempre.
 *
 * ─ useListbox ──────────────────────────────────────────────────────────────
 *   Patrón listbox (APG) con selección: role="listbox" + role="option",
 *   aria-selected, flechas, Home/End, Enter/Espacio, búsqueda por las primeras
 *   letras (typeahead). Para SelectorListItem → CountryPicker / CurrencyPicker
 *   / Selector, y para el panel de Combobox (A11y-1). Dos modos:
 *
 *   mode="focus"            el foco del DOM se mueve de opción en opción
 *                           (pickers sin campo de texto).
 *   mode="activedescendant" el foco se queda en otro elemento (el <input> de
 *                           Combobox) y la opción activa se comunica con
 *                           aria-activedescendant. Espacio escribe en el campo,
 *                           no selecciona; no hay typeahead (ya escribe el usuario).
 *
 *     const lb = useListbox({ count, getLabel: (i) => opts[i].name, selected,
 *                             onSelect, label: 'País' });
 *     <div {...lb.listboxProps}>
 *       {opts.map((o, i) => <div key={o.id} {...lb.getOptionProps(i)}>…</div>)}
 *     </div>
 *     // activedescendant: <input {...lb.controllerProps} …/>
 *
 * Sin dirección RTL todavía (el sistema no tiene ningún idioma RTL).
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';

const KEYS = {
  horizontal: { prev: ['ArrowLeft'], next: ['ArrowRight'] },
  vertical:   { prev: ['ArrowUp'],   next: ['ArrowDown'] },
  both:       { prev: ['ArrowLeft', 'ArrowUp'], next: ['ArrowRight', 'ArrowDown'] },
};

export function nextIndex(current, key, count, {
  orientation = 'horizontal',
  loop = true,
  isDisabled = () => false,
} = {}) {
  if (count <= 0) return null;
  const { prev, next } = KEYS[orientation] || KEYS.horizontal;
  let step;
  let start;
  if (key === 'Home') { start = -1; step = 1; }
  else if (key === 'End') { start = count; step = -1; }
  else if (next.includes(key)) { start = current; step = 1; }
  else if (prev.includes(key)) { start = current; step = -1; }
  else return null;

  const wrap = loop && key !== 'Home' && key !== 'End';
  let i = start;
  for (let n = 0; n < count; n += 1) {
    i += step;
    if (i < 0 || i >= count) {
      if (!wrap) return current;
      i = (i + count) % count;
    }
    if (!isDisabled(i)) return i;
  }
  return current; // todo deshabilitado
}

/* ─── useRovingFocus ─────────────────────────────────────────────────────── */

export function useRovingFocus({
  count,
  activeIndex,                 // índice que recibe el Tab (normalmente el seleccionado)
  onActiveIndexChange,
  orientation = 'horizontal',
  loop = true,
  isItemDisabled = () => false,
}) {
  const firstEnabled = () => {
    for (let i = 0; i < count; i += 1) if (!isItemDisabled(i)) return i;
    return 0;
  };
  const resolve = (i) => (i == null || i < 0 || i >= count || isItemDisabled(i) ? firstEnabled() : i);

  const [focusIndex, setFocusIndex] = useState(activeIndex);
  const [syncedActive, setSyncedActive] = useState(activeIndex);
  const itemRefs = useRef([]);

  // Si el consumidor cambia la selección desde fuera, la parada de Tab la
  // sigue. Ajuste durante el render (patrón de React para "estado derivado de
  // una prop"), no en un efecto: evita un render intermedio con el Tab mal puesto.
  let pending = focusIndex;
  if (syncedActive !== activeIndex) {
    setSyncedActive(activeIndex);
    setFocusIndex(activeIndex);
    pending = activeIndex;
  }
  const current = resolve(pending);

  const moveTo = useCallback((i) => {
    setFocusIndex(i);
    itemRefs.current[i]?.focus();
    onActiveIndexChange?.(i);
  }, [onActiveIndexChange]);

  function getItemProps(index, { onKeyDown, onFocus } = {}) {
    return {
      ref: (el) => { itemRefs.current[index] = el; },
      tabIndex: index === current ? 0 : -1,
      onKeyDown: (e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const to = nextIndex(index, e.key, count, { orientation, loop, isDisabled: isItemDisabled });
        if (to == null) return;
        e.preventDefault();
        if (to !== index) moveTo(to);
      },
      onFocus: (e) => {
        onFocus?.(e);
        if (index !== current) setFocusIndex(index); // click o foco programático
      },
    };
  }

  return { getItemProps, focusIndex: current, setFocusIndex };
}

/* ─── useListbox ─────────────────────────────────────────────────────────── */

const TYPEAHEAD_RESET_MS = 500;

export function useListbox({
  count,
  selected,                    // índice | índice[] (multiple) | null
  onSelect,                    // (index) => void
  multiple = false,
  mode = 'focus',              // 'focus' | 'activedescendant'
  orientation = 'vertical',
  loop = false,
  getLabel,                    // (index) => string — para el typeahead
  isOptionDisabled = () => false,
  label,                       // nombre accesible del listbox (o labelledBy)
  labelledBy,
  id,
}) {
  const generatedId = useId();
  const listboxId = id || `ds-listbox-${generatedId.replace(/:/g, '')}`;
  const optionId = (i) => `${listboxId}-opt-${i}`;
  const isSelected = (i) => (multiple ? Array.isArray(selected) && selected.includes(i) : selected === i);
  const firstSelected = multiple ? (Array.isArray(selected) ? selected[0] : undefined) : selected;

  const [rawActiveIndex, setActiveIndex] = useState(() => (firstSelected ?? -1));
  // La lista cambia (filtrado en Combobox): el activo nunca queda fuera de rango.
  const activeIndex = rawActiveIndex >= count ? count - 1 : rawActiveIndex;
  const optionRefs = useRef([]);
  const typeahead = useRef({ buffer: '', timer: null });
  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  // Opción activa siempre visible al navegar con teclado.
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = optionRefs.current[activeIndex];
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const activate = (i) => {
    setActiveIndex(i);
    if (mode === 'focus') optionRefs.current[i]?.focus();
  };

  function findByTypeahead(char) {
    if (!getLabel) return null;
    const t = typeahead.current;
    clearTimeout(t.timer);
    t.buffer += char.toLowerCase();
    t.timer = setTimeout(() => { t.buffer = ''; }, TYPEAHEAD_RESET_MS);
    // Misma letra repetida ("p", "p") recorre las opciones que empiezan por ella.
    const repeated = t.buffer.split('').every((c) => c === t.buffer[0]);
    const query = repeated ? t.buffer[0] : t.buffer;
    const from = repeated ? activeIndex + 1 : Math.max(activeIndex, 0);
    for (let n = 0; n < count; n += 1) {
      const i = (from + n) % count;
      if (!isOptionDisabled(i) && String(getLabel(i) ?? '').toLowerCase().startsWith(query)) return i;
    }
    return null;
  }

  function handleKeyDown(e) {
    if (e.defaultPrevented) return;
    const { key } = e;
    // En un campo de texto (activedescendant), Home/End mueven el cursor del
    // texto, no la opción activa (APG, combobox editable).
    const isNavKey = !(mode === 'activedescendant' && (key === 'Home' || key === 'End'));
    // Sin opción activa: "siguiente" empieza por la primera, "anterior" por la última.
    const goesBack = KEYS[orientation]?.prev.includes(key);
    const from = activeIndex >= 0 ? activeIndex : (goesBack ? count : -1);
    const to = isNavKey
      ? nextIndex(from, key, count, { orientation, loop, isDisabled: isOptionDisabled })
      : null;
    if (to != null) {
      e.preventDefault();
      if (to >= 0 && to < count) activate(to);
      return;
    }
    const selectKey = key === 'Enter' || (key === ' ' && mode === 'focus');
    if (selectKey && activeIndex >= 0 && !isOptionDisabled(activeIndex)) {
      e.preventDefault();
      onSelect?.(activeIndex);
      return;
    }
    if (mode === 'focus' && key.length === 1 && key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const match = findByTypeahead(key);
      if (match != null) { e.preventDefault(); activate(match); }
    }
  }

  const listboxProps = {
    id: listboxId,
    role: 'listbox',
    'aria-label': labelledBy ? undefined : label,
    'aria-labelledby': labelledBy,
    'aria-multiselectable': multiple ? 'true' : undefined,
    'aria-orientation': orientation === 'horizontal' ? 'horizontal' : undefined,
    ...(mode === 'focus' ? { onKeyDown: handleKeyDown } : {}),
  };

  // Roving en modo focus: una sola parada de Tab — la activa, o la seleccionada,
  // o la primera habilitada.
  const tabStop = (() => {
    if (activeIndex >= 0) return activeIndex;
    if (firstSelected != null && firstSelected >= 0) return firstSelected;
    for (let i = 0; i < count; i += 1) if (!isOptionDisabled(i)) return i;
    return 0;
  })();

  function getOptionProps(index, { onClick, onMouseMove } = {}) {
    const disabled = isOptionDisabled(index);
    return {
      id: optionId(index),
      ref: (el) => { optionRefs.current[index] = el; },
      role: 'option',
      'aria-selected': isSelected(index) ? 'true' : 'false',
      'aria-disabled': disabled ? 'true' : undefined,
      ...(mode === 'focus' ? { tabIndex: index === tabStop ? 0 : -1 } : {}),
      onClick: (e) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        setActiveIndex(index);
        onSelect?.(index);
      },
      onMouseMove: (e) => {
        onMouseMove?.(e);
        if (mode === 'activedescendant' && index !== activeIndex && !disabled) setActiveIndex(index);
      },
      onFocus: () => { if (index !== activeIndex) setActiveIndex(index); },
    };
  }

  // Para el elemento que conserva el foco en modo activedescendant (input).
  const controllerProps = mode === 'activedescendant' ? {
    'aria-controls': listboxId,
    'aria-activedescendant': activeIndex >= 0 && activeIndex < count ? optionId(activeIndex) : undefined,
    onKeyDown: handleKeyDown,
  } : {};

  return {
    listboxId,
    optionId,
    activeIndex,
    setActiveIndex,
    listboxProps,
    getOptionProps,
    controllerProps,
  };
}
