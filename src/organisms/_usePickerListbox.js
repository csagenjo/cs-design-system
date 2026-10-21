/**
 * _usePickerListbox — helper interno (no exportado como componente) de
 * CountryPicker / CurrencyPicker. Sprint A11y-1, 21/10/2026 · audit §C.
 *
 * Antes las filas eran <div onClick> sin nada enfocable: con el teclado no se
 * podía elegir país ni moneda. Ahora el panel es un listbox de verdad
 * (`useListbox`, modo focus):
 *   · al abrir, el foco va a la opción seleccionada (o a la primera);
 *   · ↑/↓, Inicio/Fin y las primeras letras mueven el foco; Enter/Espacio eligen;
 *   · Escape o Tab cierran sin elegir; click fuera cierra;
 *   · al cerrar, el foco vuelve a lo que abrió el panel (el botón de país /
 *     moneda), salvo que el usuario ya lo haya movido a otro sitio.
 */
import { useEffect, useRef } from 'react';
import { usePopoverDismiss } from '../components/_popoverDismiss';
import { useListbox } from '../components/_rovingFocus';

export function usePickerListbox({ open, onClose, onChange, items, value, getValue, getLabel, label }) {
  const rootRef = useRef(null);
  const openerRef = useRef(null);

  usePopoverDismiss({ open, onClose, refs: [rootRef] });

  const selectedIndex = items.findIndex((item) => getValue(item) === value);
  const listbox = useListbox({
    count: items.length,
    selected: selectedIndex >= 0 ? selectedIndex : null,
    onSelect: (i) => {
      onChange?.(getValue(items[i]));
      onClose?.();
    },
    getLabel: (i) => getLabel(items[i]),
    label,
  });

  useEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    const target = rootRef.current?.querySelector('[role="option"][tabindex="0"]');
    target?.focus();
    return () => {
      // Al cerrar el panel desaparece y el foco cae en <body>: se devuelve al
      // que lo abrió. Si el usuario ya está en otro campo, se respeta.
      const active = document.activeElement;
      if (!active || active === document.body) openerRef.current?.focus?.();
    };
  }, [open]);

  const listboxProps = {
    ...listbox.listboxProps,
    ref: rootRef,
    onKeyDown: (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onClose?.();
        return;
      }
      listbox.listboxProps.onKeyDown?.(e);
    },
  };

  return { listboxProps, getOptionProps: listbox.getOptionProps };
}
