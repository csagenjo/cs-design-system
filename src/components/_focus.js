/**
 * _focus — helpers internos de foco y capas, NO exportados como componente
 * público (mismo criterio que _dialogBase.jsx / _popoverDismiss.js).
 * Sprint A11y-0 (20/10/2026).
 *
 * getFocusable(container)  — elementos alcanzables con Tab dentro de `container`,
 *                            en orden de documento (sin disabled, ocultos ni tabindex=-1)
 * focusFirst(container)    — enfoca el primero; devuelve true si lo consiguió
 *
 * Pila de capas (`pushLayer` / `isTopLayer`): cada capa abierta (modal,
 * popover, desplegable) se apila al abrirse. Escape cierra SOLO la de arriba
 * — antes, un Escape cerraba a la vez un desplegable y el diálogo que lo
 * contenía (audit §B, `_popoverDismiss`).
 */

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

function isVisible(el) {
  // getClientRects vacío = display:none o fuera del árbol de render.
  if (!el.getClientRects().length) return false;
  return getComputedStyle(el).visibility !== 'hidden';
}

export function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => (
    el.tabIndex >= 0
    && !el.closest('[inert]')
    && isVisible(el)
  ));
}

export function focusFirst(container) {
  const [first] = getFocusable(container);
  if (first) { first.focus(); return true; }
  return false;
}

/* ─── Pila de capas ───────────────────────────────────────────────────────── */

const layers = [];

/** Apila una capa y devuelve la función que la desapila. */
export function pushLayer(id) {
  layers.push(id);
  return () => {
    const i = layers.lastIndexOf(id);
    if (i > -1) layers.splice(i, 1);
  };
}

export function isTopLayer(id) {
  return layers.length > 0 && layers[layers.length - 1] === id;
}
