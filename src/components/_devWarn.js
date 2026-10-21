/**
 * _devWarn — avisos solo en desarrollo, helper interno (no exportado).
 * Sprint A11y-3, 21/10/2026 · audit §G.
 *
 * Varios componentes traen textos de relleno de Figma como valor por defecto
 * ("Button", "More"). Se dejan para no romper las demos, pero en una pantalla
 * real un botón llamado "Button" no dice nada: se avisa una vez por consola.
 */
const warned = new Set();

export function warnOnce(key, message) {
  if (process.env.NODE_ENV === 'production' || warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

export function warnPlaceholderLabel(component, prop, value, placeholder = 'Button') {
  if (value === placeholder) {
    warnOnce(`${component}.${prop}`, `[DS ${component}] \`${prop}\` sigue en "${placeholder}" (texto de relleno de Figma). Pon el texto real de la acción — es lo que lee el lector de pantalla.`);
  }
}
