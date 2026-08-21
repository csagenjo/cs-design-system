/**
 * List — Componente atómico
 * CS Design System · v1.0
 *
 * Lista de 3 variantes. Contenedor tonto: recibe `items` (array real) y los
 * mapea — Figma hornea 3 items a mano por limitación de la herramienta, no es
 * un eje. SIN prop `size` (Figma expone un único "16", no una escala real).
 *
 * Variantes (nodos 3338:33178 / 33117 / 33191):
 *   · unordered : bullet "•" teal, bold — <ul>
 *   · ordered   : marcador `number` (string libre por item), negro — <ol>
 *   · checkmark : icono Lucide `Check` teal (glyph simple, currentColor) — <ul>
 *
 * `items` acepta strings o { content, number }:
 *   unordered/checkmark → string (o { content })
 *   ordered             → { number: "1.", content: "…" }  · si falta number → "n."
 *
 * Tokens: color/gap/padding vía --ds-list-* (Componente→Mode). Tipografía directa
 * de Device — bullet/number = label/md bold; texto = body/sm regular (regla §4).
 *
 * USO:
 *   <List variant="unordered" items={['Uno', 'Dos', 'Tres']} />
 *   <List variant="ordered"   items={[{ number:'1.', content:'Primero' }, …]} />
 *   <List variant="checkmark" items={['Incluido', 'También esto']} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const css = `
.ds-list {
  margin:       0;
  padding:      0;
  list-style:   none;
  font-family:  inherit;
}
.ds-list--unordered { padding-left: var(--ds-list-padding-left-unordered); } /* 2 */

.ds-list__item {
  display:        flex;
  align-items:    flex-start;
  padding-bottom: var(--ds-list-padding-bottom-generic); /* 6 */
}
.ds-list__item:last-child { padding-bottom: 0; }

.ds-list--unordered .ds-list__item,
.ds-list--ordered   .ds-list__item { gap: var(--ds-list-gap-unordered); }  /* 8 */
.ds-list--checkmark .ds-list__item { gap: var(--ds-list-gap-checkmark); }  /* 6 */

/* Marcador (bullet / number) — label/md bold */
.ds-list__marker {
  flex-shrink:  0;
  font-size:    var(--ds-fontSize-label-md);   /* 16 */
  line-height:  var(--ds-lineHeight-xs);       /* 24 */
  font-weight:  var(--ds-font-weight-bold);    /* 700 */
}
.ds-list--unordered .ds-list__marker { color: var(--ds-list-bullet-fg-generic); }   /* teal */
.ds-list--ordered   .ds-list__marker { color: var(--ds-list-bodytext-fg-generic); } /* negro */

/* Icono checkmark — teal vía currentColor */
.ds-list__icon {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  height:      var(--ds-lineHeight-xs);        /* 24 — alinea con la 1ª línea de texto */
  color:       var(--ds-list-icon-checkmark-fg-generic);
}

/* Texto — body/sm regular */
.ds-list__text {
  font-size:    var(--ds-fontSize-body-sm);    /* 16 */
  line-height:  var(--ds-lineHeight-xs);       /* 24 */
  font-weight:  var(--ds-font-weight-regular); /* 400 */
  color:        var(--ds-list-bodytext-fg-generic);
}
`;

injectStyles('ds-list', css);

function normalize(item) {
  if (item && typeof item === 'object' && !React.isValidElement(item)) {
    return { content: item.content, number: item.number };
  }
  return { content: item, number: undefined };
}

export function List({
  variant = 'unordered',  // 'unordered' | 'ordered' | 'checkmark'
  items = [],
  className,
}) {
  const Tag = variant === 'ordered' ? 'ol' : 'ul';

  const classes = [
    'ds-list',
    `ds-list--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes}>
      {items.map((raw, i) => {
        const { content, number } = normalize(raw);
        return (
          <li key={i} className="ds-list__item">
            {variant === 'checkmark' ? (
              <span className="ds-list__icon" aria-hidden="true">
                <Icon name="Check" size="xs" />
              </span>
            ) : (
              <span className="ds-list__marker" aria-hidden="true">
                {variant === 'ordered' ? (number ?? `${i + 1}.`) : '•'}
              </span>
            )}
            <span className="ds-list__text">{content}</span>
          </li>
        );
      })}
    </Tag>
  );
}

List.displayName = 'List';
export default List;
