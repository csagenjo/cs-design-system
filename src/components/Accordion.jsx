/**
 * Accordion — Componente atómico
 * CS Design System · v1.0
 *
 * Un solo item expandible/colapsable. El trigger pinta borde superior
 * siempre — separador natural entre items apilados en una lista (el de
 * arriba aporta su propio borde inferior visualmente al de abajo) — y
 * `isLast` decide si pinta también el de cierre inferior, para el último
 * item de la lista. Mismo criterio que `lastRow` en CellData/CellHeader,
 * y mismo mecanismo que Figma: `Title` solo con stroke arriba, el
 * rectángulo `Border` (controlado por la propiedad `Last`) aparte para el
 * cierre. (Hubo un vaivén real el 08/09/2026 — Carol probó brevemente
 * aplicar el borde a los dos lados de `Title`, lo revirtió porque el
 * mecanismo de `Border`/`Last` seguía haciendo falta — este es el estado
 * final, confirmado en vivo, no asumido.)
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
 * Accesibilidad (A11y-5): el trigger va dentro de un heading (`headingLevel`,
 * h3 por defecto) para que el lector lo liste entre los encabezados de la
 * página, como pide el patrón de acordeón de WAI-ARIA. Elige el nivel que
 * toque según el esquema de la página (debajo de un h2 → 3).
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
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
.ds-accordion__heading {
  margin: 0;
  padding: 0;
  font: inherit;
  letter-spacing: inherit;
}
.ds-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-accordion-title-gap);
  width: 100%;
  box-sizing: border-box;
  border: none;
  /* separador superior sin sumar altura (29/09) — mismo efecto que el stroke
     INSIDE de Figma: 6+28+6 = 40 exacto, en rejilla */
  box-shadow: inset 0 var(--ds-accordion-border-width) 0 var(--ds-accordion-border-color);
  background: transparent;
  padding: var(--ds-accordion-title-padding-ver) var(--ds-accordion-title-padding-right) var(--ds-accordion-title-padding-ver) var(--ds-accordion-title-padding-left);
  color: var(--ds-accordion-fg-text);
  font-family: inherit;                       /* Nunito (fontFamily/default) */
  font-size: var(--ds-fontSize-title-md);      /* 19 */
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-title-md);        /* 28 */
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
  box-shadow: inset 0 0 0 4px var(--ds-accordion-focus-inner),
              inset 0 var(--ds-accordion-border-width) 0 var(--ds-accordion-border-color);
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
  line-height: var(--ds-lineHeight-body-sm);        /* 24 */
  text-align: left;
}
.ds-accordion__content-inner {
  width: 100%;
  min-width: 0; /* texto plano como children directo se envuelve en una caja
                   anónima de flexbox que por defecto no hace fill (min-width:
                   auto) — este wrapper real da algo a lo que aplicarle 100% */
}
.ds-accordion--last {
  /* el cierre inferior cuelga de la raíz, no de __content — el último item
     puede estar colapsado (sin __content en absoluto), mismo caso que el
     rectángulo Border en Figma, que cuelga de Title + Action, no de Content */
  /* (sigue) pintado con ::after absoluto, no con border-bottom: no suma altura,
     igual que el rectángulo Border en Figma (absoluto, anclado abajo, 29/09) */
}
.ds-accordion--last::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--ds-accordion-border-width);
  background: var(--ds-accordion-border-color);
  pointer-events: none;
}
`;

injectStyles('ds-accordion', css);

export function Accordion({
  title,
  children,
  expanded = false,
  onToggle,
  isLast = false,
  headingLevel = 3,  // A11y-5: el trigger va dentro de un h2–h6 (patrón APG); null = sin heading
  id,
  className,
}) {
  // A11y-3: el botón apunta a su panel (aria-controls) y el panel es una
  // región con el nombre del título.
  const baseId = React.useId();
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;
  const classes = ['ds-accordion', isLast ? 'ds-accordion--last' : '', className || '']
    .filter(Boolean)
    .join(' ');

  const level = headingLevel && headingLevel >= 2 && headingLevel <= 6 ? headingLevel : null;
  const Heading = level ? `h${level}` : React.Fragment;
  const headingProps = level ? { className: 'ds-accordion__heading' } : {};

  return (
    <div id={id} className={classes}>
      <Heading {...headingProps}>
      <button
        type="button"
        className="ds-accordion__trigger"
        id={triggerId}
        aria-expanded={expanded}
        aria-controls={expanded ? panelId : undefined}
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
      </Heading>
      {expanded && (
        <div className="ds-accordion__content" id={panelId} role="region" aria-labelledby={triggerId}>
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

<Accordion title="Último item" expanded={false} onToggle={fn} isLast>
  Contenido...
</Accordion>
*/
