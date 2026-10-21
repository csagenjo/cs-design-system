/**
 * _stepStatus — helper interno de la familia Steps (no exportado como
 * componente). Sprint A11y-3, 21/10/2026 · audit §E.
 *
 * El estado de un paso (sin empezar / en curso / completado) solo se veía por
 * el relleno del círculo o el icono, que van ocultos al lector de pantalla
 * (WCAG 1.3.1 / 1.4.1). Estos textos se leen en su lugar. Inglés por defecto
 * (decisión de Carol, 20/10); cada componente los acepta por prop para
 * traducirlos.
 *
 * `currentFor(state, selected)` decide `aria-current`:
 *   · `selected` (el paso que se está viendo) → "page"
 *   · `state="active"` (el paso en curso del proceso) → "step"
 *   · el resto → sin aria-current
 */
export const STEP_STATUS_LABELS = {
  incomplete: 'not started',
  active: 'in progress',
  completed: 'completed',
};

export function stepStatusText(state, labels) {
  const all = { ...STEP_STATUS_LABELS, ...(labels || {}) };
  return all[state] ?? all.incomplete;
}

export function currentFor(state, selected) {
  if (selected) return 'page';
  if (state === 'active') return 'step';
  return undefined;
}
