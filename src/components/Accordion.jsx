/**
 * Accordion — Componente atómico
 * CS Design System · v1.0
 *
 * Un solo item expandible/colapsable. El borde superior se pinta siempre —
 * es el separador natural entre items apilados en una lista (el de arriba
 * aporta su propio borde inferior visualmente al de abajo) — y el inferior
 * (`isLast`) solo se pinta en el último item de la lista, para cerrarla.
 * Mismo criterio que `lastRow` en CellData/CellHeader.
 *
 * Sesión de limpieza real de Figma antes de escribir este átomo — 2 fugas
 * de IP encontradas y corregidas (fuente literal filtrada en el título,
 * color de borde enlazado a una librería externa ya irresoluble) y una
 * inconsistencia real (el borde superior faltaba en 3 de los 8 estados).
 * Ver CLAUDE.md §9 para el detalle completo.
 *
 * Estados vía pseudo-clases nativas sobre `<button>` real: `:hover` con
 * background (mismo azul claro que Checkbox/Radio/Selector hover),
 * `:active` con `opacity` (Figma: `bgMix/pressed` resultó ser un opacity
 * plano, no un color — mismo patrón que Icon Button/Segmented Control),
 * `:focus-visible` con anillo doble `outline`+`box-shadow` (mismo mecanismo
 * CSS que Icon Button/Segmented Control).
 *
 * USO:
 *   <Accordion title="Título" expanded={open} onToggle={() => setOpen(!open)}>
 *     Contenido...
 *   </Accordion>
 *
 *   {items.map((item, i) => (
 *     <Accordion key={i} title={item.title} expanded={openIndex === i}
 *       onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
 *       isLast={i === items.length - 1}>
 *       {item.content}
 *     </Accordion>
 *   ))}
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
.ds-accordion--last {
  border-bottom: var(--ds-accordion-border-width) solid var(--ds-accordion-border-color);
}
`;

injectStyles('ds-accordion', css);

export function Accordion({
  title,
  children,
  expanded = false,
  onToggle,
  isLast = false,
  id,
  className,
}) {
  const classes = ['ds-accordion', isLast ? 'ds-accordion--last' : '', className || '']
    .filter(Boolean)
    .join(' ');

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
      {expanded && <div className="ds-accordion__content">{children}</div>}
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
