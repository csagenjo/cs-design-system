/**
 * _floating — helper interno (no exportado como componente). 12/11/2026.
 *
 * Geometría compartida de los paneles flotantes: PopoverSheet, Combobox,
 * CountryPicker y CurrencyPicker. El cierre ya era común (`_popoverDismiss.js`);
 * esto resuelve la otra mitad de la deuda: el giro cuando el panel no cabe.
 *
 * `useFlip` devuelve el lado en el que se pinta el panel: el preferido
 * (`placement`) o el opuesto, si en el preferido no cabe dentro de la ventana
 * y en el opuesto hay más sitio. Se recalcula al abrir, al cambiar el tamaño
 * de la ventana y al hacer scroll (en cualquier contenedor).
 *
 * El panel sigue siendo `position: absolute` respecto a su ancla (el wrapper
 * del trigger o el contenedor del campo): solo cambia de lado, nunca se
 * "despega" del campo.
 *
 *   const side = useFlip({ open, panelRef, anchorRef, placement: 'bottom' });
 *   // side ∈ 'top' | 'bottom' | 'left' | 'right'
 */
import { useLayoutEffect, useState } from 'react';

const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export function useFlip({ open, panelRef, anchorRef, placement = 'bottom' }) {
  const [side, setSide] = useState(placement);

  useLayoutEffect(() => {
    if (!open) {
      setSide(placement);
      return undefined;
    }
    function update() {
      const panel = panelRef.current;
      const anchor = anchorRef?.current || panel?.offsetParent;
      if (!panel || !anchor) return;
      const p = panel.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const room = { bottom: vh - a.bottom, top: a.top, right: vw - a.right, left: a.left };
      const vertical = placement === 'top' || placement === 'bottom';
      const need = vertical ? p.height : p.width;
      const opposite = OPPOSITE[placement];
      setSide(room[placement] < need && room[opposite] > room[placement] ? opposite : placement);
    }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, placement, panelRef, anchorRef]);

  return side;
}
