/**
 * _stepAppearance — helper interno (no exportado como componente) de
 * StepNavigator / SubstepNavigator. Sprint A11y-0, 20/10/2026.
 */

/* `appearance` (eje primary/secondary) vs `style` (estilo inline de React).
   Compatibilidad: un `style` string antiguo se interpreta como `appearance`.
   Compartido por StepNavigator y SubstepNavigator (misma regla). */
export function resolveAppearance(componentName, appearance, style) {
  if (typeof style === 'string') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`${componentName}: \`style="${style}"\` está obsoleto — usa \`appearance="${style}"\`.`);
    }
    return { styleAxis: appearance || style, inlineStyle: undefined };
  }
  return { styleAxis: appearance || 'primary', inlineStyle: style };
}
