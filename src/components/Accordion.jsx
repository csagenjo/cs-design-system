/**
 * Accordion — Componente atómico
 * CS Design System · v1.0
 *
 * Un solo item expandible/colapsable. El trigger pinta borde arriba Y abajo
 * siempre — en una lista apilada, el borde inferior de un item y el
 * superior del siguiente coinciden exactamente (misma línea), y el último
 * item de la lista cierra solo con su propio borde inferior. No hace falta
 * ningún prop de "es el último" — la composición ya lo resuelve sola.
 *
 * Sesión de limpieza real de Figma antes de escribir este átomo — 2 fugas
 * de IP encontradas y corregidas (fuente literal filtrada en el título,
 * color de borde enlazado a una librería externa ya irresoluble), una
 * inconsistencia real (el borde superior faltaba en 3 de los 8 estados),
 * y una simplificación real de tokens (no solo bindings corregidos, a
 * petición de Carol). Ver CLAUDE.md §9 para el detalle completo.
 *
 * Estados vía pseudo-clases nativas sobre `<button>` real: `:hover` con
 * background (mismo azul claro que Checkbox/Radio/Selector hover),
 * `:active` con `opacity` (Figma: `bgMix/pressed` resultó ser un opacity
 * plano, no un color — mismo patrón que Icon Button/Segmented Control),
 * `:focus-visible` con anillo doble `outline`+`box-shadow` (mismo mecanismo
 * CSS que Icon Button/Segmented Control).
 *
 * `children` se envuelve en un div interno propio (`__content-inner`) —
 * texto plano como children directo de un contenedor flex-column se envuelve
 * en una caja anónima que por defecto NO hace fill horizontal (min-width:
 * auto de flexbox); el wrapper da un elemento real al que aplicarle 100%.
 *
 * Para listas reales de varios items, usar el organismo `AccordionGroup`
 * (src/organisms/) — gestiona qué item(s) está(n) abierto(s) y agrupa con
 * gap 0 real, sin depender de que el consumidor lo monte bien a mano.
 *
 * USO:
 *   <Accordion title="Título" expanded={open} onToggle={() => setOpen(!open)}>
 *     Contenido...
 *   </Accordion>
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const css = `
.ds-accordion {
  width: 100%;
  box-sizing: border-box;
}
.ds-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-accordion-title-gap);
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-top: var(--ds-accordion-border-width) solid var(--ds-accordion-border-color);
  border-bottom: var(--ds-accordion-border-width) solid var(--ds-accordion-border-color);
  background: transparent;
  padding: var(--ds-accordion-title-padding-ver) var(--ds-accordion-title-padding-right) var(--ds-accordion-title-padding-ver) var(--ds-accordion-title-padding-left);
  color: var(--ds-accordion-fg-text);
  font-family: inherit;                       /* Nunito (fontFamily/default) */
  font-size: var(--ds-fontSize-title-md);      /* 19 */
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-sm);        /* 28.5 */
  cursor: pointer;
  text-align: left;
}
.ds-accordion__trigger:hover {
  background: var(--ds-accordion-bg-hover);
}
.ds-accordion__trigger:active {
  opacity: var(--ds-accordion-opacity-pressed);
}
.ds-accordion__trigger:focus-visible {
  outline: var(--ds-accordion-focus-width) solid var(--ds-accordion-focus-outer);
  outline-offset: -2px;
  box-shadow: inset 0 0 0 4px var(--ds-accordion-focus-inner);
}
.ds-accordion__icon {
  flex-shrink: 0;
  color: var(--ds-accordion-fg-icon);
}
.ds-accordion__content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-accordion-content-gap);
  box-sizing: border-box;
  padding: var(--ds-accordion-content-padding-top) var(--ds-accordion-content-padding-right) var(--ds-accordion-content-padding-bottom) var(--ds-accordion-content-padding-left);
  margin: 0;
  color: var(--ds-accordion-fg-text);
  font-family: inherit;
  font-size: var(--ds-fontSize-body-sm);       /* 16 */
  font-weight: var(--ds-font-weight-regular);
  line-height: var(--ds-lineHeight-xs);        /* 24 */
  text-align: left;
}
.ds-accordion__content-inner {
  width: 100%;
  min-width: 0; /* texto plano como children directo se envuelve en una caja
                   anónima de flexbox que por defecto no hace fill (min-width:
                   auto) — este wrapper real da algo a lo que aplicarle 100% */
}
`;

injectStyles('ds-accordion', css);

export function Accordion({
  title,
  children,
  expanded = false,
  onToggle,
  id,
  className,
}) {
  const classes = ['ds-accordion', className || ''].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <button
        type="button"
        className="ds-accordion__trigger"
        aria-expanded={expanded}
        onClick={() => onToggle && onToggle()}
      >
        {title}
        <Icon
          className="ds-accordion__icon"
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size="2xs"
          strokeWidth={2}
        />
      </button>
      {expanded && (
        <div className="ds-accordion__content">
          <div className="ds-accordion__content-inner">{children}</div>
        </div>
      )}
    </div>
  );
}

export default Accordion;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Accordion title="Título" expanded={open} onToggle={() => setOpen(!open)}>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Accordion>

<Accordion title="Otro item" expanded={false} onToggle={fn}>
  Contenido...
</Accordion>
*/
