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
 *
 * Capas (A11y-0, 20/10/2026): cada popover abierto se apila en la pila de
 * `_focus.js`. Escape cierra solo el de ARRIBA — antes, un Escape cerraba a
 * la vez todos los popovers abiertos y el modal que los contenía. Con
 * `closeOnEscape={false}` la capa se apila igual (para que el modal de debajo
 * no se cierre con el Escape que el propio componente gestiona).
 */
import { useEffect, useId, useRef } from 'react';
import { isTopLayer, pushLayer } from './_focus';

export function usePopoverDismiss({ open, onClose, refs, closeOnEscape = true }) {
  const layerId = useId();
  // onClose en ref: si el consumidor pasa una función nueva en cada render, el
  // efecto NO se re-ejecuta — re-ejecutarlo re-apilaría la capa encima de un
  // popover hijo ya abierto y Escape cerraría el padre en vez del hijo.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    if (!open) return;
    const popLayer = pushLayer(layerId);

    function handleMouseDown(e) {
      const insideAny = refs.some((ref) => ref.current && ref.current.contains(e.target));
      if (!insideAny) onCloseRef.current?.();
    }
    function handleKeyDown(e) {
      if (closeOnEscape && e.key === 'Escape' && isTopLayer(layerId)) onCloseRef.current?.();
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      popLayer();
    };
  }, [open, closeOnEscape, layerId]); // eslint-disable-line react-hooks/exhaustive-deps
}
