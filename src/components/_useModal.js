/**
 * _useModal — hook interno compartido para capas modales, NO exportado como
 * componente público. Sprint A11y-0 (20/10/2026) · audit §B.
 *
 * Lo usarán (sprint A11y-1) Dialog, DialogSimple, ErrorAndEmptyState en popUp
 * y el panel móvil de TopNavigation — hoy declaran `aria-modal` pero el foco
 * no entra, no queda atrapado, no vuelve al cerrar, Escape no hace nada y el
 * fondo sigue activo.
 *
 * Mientras `open` es true:
 *   1. Foco DENTRO al abrir — `initialFocusRef` si se pasa; si no, el primer
 *      elemento enfocable; si no hay ninguno, el propio contenedor
 *      (se le pone tabindex=-1).
 *   2. Foco ATRAPADO — Tab / Shift+Tab dan la vuelta dentro del contenedor,
 *      y si el foco acaba fuera (click en el fondo, script) vuelve dentro.
 *   3. Fondo INERTE — todo lo que no es el modal (ni sus ancestros) recibe
 *      `inert`: ni ratón, ni teclado, ni lector de pantalla. Las regiones de
 *      `announce()` (data-ds-live-region) se respetan.
 *   4. Scroll de la página BLOQUEADO (`lockScroll`).
 *   5. Escape → `onClose`, solo si este modal es la capa de arriba
 *      (un desplegable abierto dentro del modal se cierra primero).
 * Al cerrar (open=false o desmontar): todo se deshace y el foco VUELVE a
 * `returnFocusRef` o, si no se pasa, al elemento que tenía el foco al abrir.
 *
 * El hook no pinta nada ni decide la geometría — el componente sigue
 * siendo el que monta el panel y el Scrim.
 *
 * USO:
 *   const ref = useRef(null);
 *   useModal({ open, containerRef: ref, onClose });
 *   return open && <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId}>…</div>;
 */
import { useEffect, useId, useRef } from 'react';
import { getFocusable, isTopLayer, pushLayer } from './_focus';

import { LIVE_REGION_ATTR } from './announce';

const LIVE_REGION_SELECTOR = `[${LIVE_REGION_ATTR}]`;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT']);

/* Marca como inert los hermanos de cada ancestro del contenedor, hasta <body>.
   Devuelve la función que restaura SOLO lo que se cambió aquí (un elemento ya
   inert de antes, p. ej. por otro modal debajo, se deja como estaba). */
function makeOutsideInert(container) {
  const changed = [];
  let node = container;
  while (node && node.parentElement && node !== document.body) {
    for (const sibling of node.parentElement.children) {
      if (sibling === node || SKIP_TAGS.has(sibling.tagName)) continue;
      if (sibling.matches(LIVE_REGION_SELECTOR)) continue;
      if (sibling.inert) continue;
      sibling.inert = true;
      changed.push(sibling);
    }
    node = node.parentElement;
  }
  return () => changed.forEach((el) => { el.inert = false; });
}

let scrollLocks = 0;
let savedOverflow = '';
function lockScroll() {
  if (scrollLocks === 0) {
    savedOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  scrollLocks += 1;
  return () => {
    scrollLocks -= 1;
    if (scrollLocks === 0) document.documentElement.style.overflow = savedOverflow;
  };
}

export function useModal({
  open = true,
  containerRef,
  onClose,
  initialFocusRef,
  returnFocusRef,
  closeOnEscape = true,
  lockScroll: shouldLockScroll = true,
  inertOutside = true,
}) {
  const layerId = useId();
  // onClose en ref: el efecto no se re-ejecuta (y no re-enfoca) cada vez que
  // el consumidor pasa una función nueva en el render.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!open) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;
    const popLayer = pushLayer(layerId);
    const restoreInert = inertOutside ? makeOutsideInert(container) : () => {};
    const unlockScroll = shouldLockScroll ? lockScroll() : () => {};

    // 1. Foco dentro
    const initial = initialFocusRef?.current;
    if (initial) {
      initial.focus();
    } else {
      const [first] = getFocusable(container);
      if (first) first.focus();
      else {
        if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
        container.focus();
      }
    }

    // 2. Tab atrapado + 5. Escape
    function handleKeyDown(e) {
      if (!isTopLayer(layerId)) return;
      if (e.key === 'Escape' && closeOnEscape) {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable(container);
      if (!items.length) { e.preventDefault(); container.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !container.contains(active))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (active === last || !container.contains(active))) {
        e.preventDefault(); first.focus();
      }
    }
    function handleFocusIn(e) {
      if (!isTopLayer(layerId) || container.contains(e.target)) return;
      const [first] = getFocusable(container);
      (first || container).focus();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      restoreInert();
      unlockScroll();
      popLayer();
      // Foco de vuelta — solo si sigue en el documento.
      // returnFocusRef se lee AL CERRAR a propósito: el trigger puede haberse
      // re-montado mientras el modal estaba abierto.
      const target = returnFocusRef?.current || previouslyFocused; // eslint-disable-line react-hooks/exhaustive-deps
      if (target && target.isConnected && typeof target.focus === 'function') target.focus();
    };
  }, [open, layerId, closeOnEscape, shouldLockScroll, inertOutside]); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useModal;
