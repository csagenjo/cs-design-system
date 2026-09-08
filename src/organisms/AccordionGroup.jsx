/**
 * AccordionGroup — Organismo
 * CS Design System · v1.0
 *
 * Compone N `Accordion`. Gestiona qué item(s) está(n) abierto(s) —
 * `multiple` decide el comportamiento: `false` (por defecto) es el
 * acordeón clásico, un solo item abierto a la vez; `true` permite varios
 * abiertos de forma independiente.
 *
 * Gap 0 fijo en el propio organismo, y `isLast` aplicado automáticamente
 * al último item — el consumidor nunca lo toca a mano. No depende de que
 * cada lista se monte bien: el bug real encontrado en la propia
 * documentación de Figma de Accordion (un gap de 114px en vez de 0 en la
 * lista de ejemplo) es exactamente la clase de error que este organismo
 * hace estructuralmente imposible.
 *
 * USO:
 *   <AccordionGroup items={[
 *     { title: 'Uno', content: 'Contenido...' },
 *     { title: 'Dos', content: 'Contenido...' },
 *   ]} />
 *
 *   <AccordionGroup items={items} multiple />
 *   <AccordionGroup items={items} defaultOpenIndex={0} />
 */

import React, { useState } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Accordion } from '../components/Accordion';

const css = `
.ds-accordion-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}
`;

injectStyles('ds-accordion-group', css);

export function AccordionGroup({
  items = [],
  multiple = false,
  defaultOpenIndex,
  id,
  className,
}) {
  const [openIndex, setOpenIndex] = useState(
    defaultOpenIndex !== undefined ? defaultOpenIndex : -1
  );
  const [openSet, setOpenSet] = useState(
    () => new Set(defaultOpenIndex !== undefined ? [defaultOpenIndex] : [])
  );

  function isOpen(i) {
    return multiple ? openSet.has(i) : openIndex === i;
  }

  function toggle(i) {
    if (multiple) {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return next;
      });
    } else {
      setOpenIndex((prev) => (prev === i ? -1 : i));
    }
  }

  const classes = ['ds-accordion-group', className || ''].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      {items.map((item, i) => (
        <Accordion
          key={i}
          title={item.title}
          expanded={isOpen(i)}
          onToggle={() => toggle(i)}
          isLast={i === items.length - 1}
        >
          {item.content}
        </Accordion>
      ))}
    </div>
  );
}

export default AccordionGroup;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<AccordionGroup items={[
  { title: 'Primer título', content: 'Lorem ipsum dolor sit amet.' },
  { title: 'Segundo título', content: 'Otro contenido.' },
  { title: 'Tercer título', content: 'Y otro más.' },
]} />

<AccordionGroup items={items} multiple defaultOpenIndex={0} />
*/
