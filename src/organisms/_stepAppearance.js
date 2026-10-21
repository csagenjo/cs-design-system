/**
 * _stepAppearance — helper interno (no exportado como componente) de
 * StepNavigator / SubstepNavigator. Sprint A11y-0, 20/10/2026.
 *
 * Eje `appearance` = Figma `Style`: sobre qué fondo de página va el navegador.
 *   'onDefault' — fondo bg/default (blanco en claro), normalmente mobile
 *   'onPage'    — fondo bg/page (gris muy claro), normalmente web
 * La fila seleccionada toma el OTRO fondo, para destacar.
 *
 * Historia: hasta el 20/10/2026 el eje se llamaba `style` (chocaba con el
 * `style` inline de React) y sus valores `primary`/`secondary` (sugerían
 * los colores de marca). Se siguen aceptando, con aviso en consola en dev:
 *   style="secondary"  →  appearance="onPage"
 *   appearance="primary" | "secondary"  →  "onDefault" | "onPage"
 */

const LEGACY = { primary: 'onDefault', secondary: 'onPage' };

function warn(msg) {
  if (process.env.NODE_ENV !== 'production') console.warn(msg);
}

export function resolveAppearance(componentName, appearance, style) {
  let value = appearance;
  let inlineStyle = style;
  if (typeof style === 'string') {
    warn(`${componentName}: \`style="${style}"\` está obsoleto — usa \`appearance="${LEGACY[style] || style}"\`.`);
    value = value || style;
    inlineStyle = undefined;
  }
  if (LEGACY[value]) {
    if (value === appearance) warn(`${componentName}: \`appearance="${value}"\` está obsoleto — usa \`appearance="${LEGACY[value]}"\`.`);
    value = LEGACY[value];
  }
  return { styleAxis: value === 'onPage' ? 'onPage' : 'onDefault', inlineStyle };
}
