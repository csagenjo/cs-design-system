/**
 * _popoverDismiss — helper interno compartido, NO exportado como componente
 * público (mismo criterio que _dialogBase.jsx/_inputBase.js/_sliderKnob.jsx).
 *
 * Consolida el mecanismo de cierre por click-fuera + Escape que Combobox y
 * CountryPicker ya implementaban cada uno por su cuenta (mismo `useEffect`
 * con un listener `mousedown` copiado dos veces) — punto único de
 * mantenimiento, y cierra un hueco real: CountryPicker no tenía Escape en
 * absoluto. Combobox mantiene su propio Escape-en-el-input (más específico:
 * cierra Y resetea el texto tecleado) sin tocar — solo migra la parte de
 * click-fuera a este hook.
 *
 * `refs` es un array de refs "dentro" del popover (normalmente basta con el
 * wrapper que engloba trigger+panel) — un click dentro de cualquiera de
 * ellos no cuenta como "fuera". No se incluye en las dependencias del efecto
 * a propósito: los objetos ref de useRef son estables entre renders, así que
 * un array literal nuevo en cada render no invalida el listener ya montado
 * (su `.current` se lee en el momento del evento, no al montar el efecto).
 *
 * `closeOnEscape` (default true) — Combobox lo pasa en `false` porque ya
 * gestiona su propio Escape dentro de `handleKeyDown` del input (cierra Y
 * resetea el texto tecleado, más específico que el genérico de aquí); sin
 * este flag el Escape se dispararía dos veces por el mismo evento.
 */
import { useEffect } from 'react';

export function usePopoverDismiss({ open, onClose, refs, closeOnEscape = true }) {
  useEffect(() => {
    if (!open) return;

    function handleMouseDown(e) {
      const insideAny = refs.some((ref) => ref.current && ref.current.contains(e.target));
      if (!insideAny) onClose?.();
    }
    function handleKeyDown(e) {
      if (closeOnEscape && e.key === 'Escape') onClose?.();
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, closeOnEscape]); // eslint-disable-line react-hooks/exhaustive-deps
}
