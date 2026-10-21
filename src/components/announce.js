/**
 * announce — avisos globales por lector de pantalla (pareja de LiveRegion)
 * CS Design System · v1 · sprint A11y-0 (20/10/2026)
 *
 *   import { announce } from '../components/announce';
 *   announce('3 resultados');                                  // polite
 *   announce('No se pudo guardar', { politeness: 'assertive' }); // interrumpe
 *
 * Para avisos que no tienen un sitio visible: "3 resultados", "Fichero
 * subido", "Sin resultados". Si el mensaje SÍ se ve en pantalla, usar
 * <LiveRegion> alrededor de él. Ver LiveRegion.jsx.
 */

/* Atributo que marca las regiones globales — useModal no las hace `inert`. */
export const LIVE_REGION_ATTR = 'data-ds-live-region';

const regions = {};
const timers = {};

// Estilos en línea: la región global no depende de que el CSS de
// VisuallyHidden esté inyectado (puede usarse sin montar ningún componente).
const HIDDEN_STYLE = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;'
  + 'overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;';

function getRegion(politeness) {
  if (typeof document === 'undefined') return null;
  const existing = regions[politeness];
  if (existing && existing.isConnected) return existing;
  const el = document.createElement('div');
  el.setAttribute(LIVE_REGION_ATTR, politeness);
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('style', HIDDEN_STYLE);
  document.body.appendChild(el);
  regions[politeness] = el;
  return el;
}

/**
 * Anuncia `message` por lector de pantalla sin mostrar nada en pantalla.
 * El texto se vacía y se escribe con un pequeño retraso: así un mensaje
 * idéntico al anterior también se anuncia.
 */
export function announce(message, { politeness = 'polite' } = {}) {
  const level = politeness === 'assertive' ? 'assertive' : 'polite';
  const region = getRegion(level);
  if (!region) return;
  clearTimeout(timers[level]);
  region.textContent = '';
  timers[level] = setTimeout(() => { region.textContent = message ?? ''; }, 100);
}

/* Para tests y cambios de vista: vacía las dos regiones globales. */
export function clearAnnouncements() {
  for (const level of Object.keys(regions)) {
    clearTimeout(timers[level]);
    if (regions[level]) regions[level].textContent = '';
  }
}

