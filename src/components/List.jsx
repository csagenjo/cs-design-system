/**
 * List — Componente atómico
 * CS Design System · v2.0 (11/11/2026, alineado con Figma: escala de tamaños y niveles)
 *
 * Tres sets de Figma (página 🟢 List):
 *   · Unordered List (3338:33178) — bullet "•" teal bold — <ul>
 *   · Ordered List   (3338:33117) — marcador regular del color del texto, 3 niveles — <ol>
 *   · Checkmark List (3338:33191) — icono check teal — <ul>
 *
 * `size` = Size de Figma: 'xs' 12 · 'sm' 14 · 'md' 16 (por defecto) · 'lg' 19.
 *   Texto body/2xs · xs · sm · md; bullet label/xs · sm · md · lg bold.
 *
 * Ordered — niveles (Level 1st / 2nd / 3rd): un item puede llevar `items` hijos.
 *   Marcadores automáticos como Figma: 1. · a. · i (romano sin punto); `number`
 *   en el item lo sustituye. El marcador va en una columna fija
 *   (orderedList/indent/level2-*: 20/24/24/32) y el nivel hijo empieza donde
 *   empieza el texto del padre, así que level3 = 2 × level2 sin token aparte.
 *
 * Checkmark — icono 16/20/24/32 con 2 de padding arriba y abajo, centrado con la
 * línea de texto (Figma: auto layout centrado).
 *
 * `items`: strings o { content, number?, items? }.
 *
 * USO:
 *   <List variant="unordered" items={['Invoices', 'Payments']} />
 *   <List variant="ordered" size="sm" items={[{ content: 'Review', items: ['Totals', 'Dates'] }, 'Approve']} />
 *   <List variant="checkmark" size="lg" items={['No fees', 'Instant transfers']} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const SIZES = ['xs', 'sm', 'md', 'lg'];
const TEXT = { xs: 'body-2xs', sm: 'body-xs', md: 'body-sm', lg: 'body-md' };
const MARK = { xs: 'label-xs', sm: 'label-sm', md: 'label-md', lg: 'label-lg' };

const css = `
.ds-list {
  margin:       0;
  padding:      0;
  list-style:   none;
  font-family:  inherit;
}
.ds-list--unordered { padding-left: var(--ds-list-padding-left-unordered); }
/* lista anidada: empieza en la columna del texto del padre */
.ds-list .ds-list { margin-top: var(--ds-list-padding-bottom-generic); }

.ds-list__item {
  display:        flex;
  align-items:    flex-start;
  padding-bottom: var(--ds-list-padding-bottom-generic);
}
.ds-list__item:last-child { padding-bottom: 0; }
.ds-list--checkmark .ds-list__item { align-items: center; gap: var(--ds-list-gap-checkmark); }
.ds-list--ordered .ds-list__item { gap: 0; }

.ds-list__body { min-width: 0; flex: 1 1 auto; }

.ds-list__body,
.ds-list--ordered .ds-list__marker {
  font-weight: var(--ds-font-weight-regular);
  color:       var(--ds-list-bodytext-fg-generic);
}
.ds-list--unordered .ds-list__marker {
  flex-shrink: 0;
  font-weight: var(--ds-font-weight-bold);
  color:       var(--ds-list-bullet-fg-generic);
}
.ds-list--ordered .ds-list__marker {
  flex-shrink: 0;
  box-sizing:  border-box;
}

.ds-list__icon {
  flex-shrink: 0;
  display:     flex;
  padding:     var(--ds-list-icon-checkmark-padding-ver) 0;
  color:       var(--ds-list-icon-checkmark-fg-generic);
}

${SIZES.map((s) => `
.ds-list--${s} > .ds-list__item > .ds-list__body,
.ds-list--${s}.ds-list--ordered .ds-list__marker {
  font-size:   var(--ds-fontSize-${TEXT[s]});
  line-height: var(--ds-lineHeight-${TEXT[s]});
}
.ds-list--${s}.ds-list--unordered .ds-list__marker {
  font-size:   var(--ds-fontSize-${MARK[s]});
  line-height: var(--ds-lineHeight-${MARK[s]});
}
.ds-list--${s}.ds-list--unordered .ds-list__item { gap: var(--ds-list-gap-unordered-${s}); }
.ds-list--${s}.ds-list--ordered .ds-list__marker { min-width: var(--ds-list-ordered-indent-${s}); }
.ds-list--${s} .ds-list__icon svg {
  width:  var(--ds-list-icon-checkmark-size-${s});
  height: var(--ds-list-icon-checkmark-size-${s});
}`).join('')}
`;

injectStyles('ds-list', css);

function normalize(item) {
  if (item && typeof item === 'object' && !React.isValidElement(item)) {
    return { content: item.content, number: item.number, items: item.items };
  }
  return { content: item, number: undefined, items: undefined };
}

function toRoman(n) {
  const map = [[10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
  let out = '';
  for (const [v, r] of map) while (n >= v) { out += r; n -= v; }
  return out;
}

// Marcador por nivel, como Figma: 1. · a. · i
function orderedMarker(i, level) {
  if (level === 2) return `${String.fromCharCode(97 + (i % 26))}.`;
  if (level >= 3) return toRoman(i + 1);
  return `${i + 1}.`;
}

export function List({
  variant = 'unordered',  // 'unordered' | 'ordered' | 'checkmark'
  size    = 'md',         // 'xs' 12 | 'sm' 14 | 'md' 16 | 'lg' 19
  items   = [],
  level   = 1,            // interno: nivel de anidado de la lista ordenada
  className,
}) {
  const Tag = variant === 'ordered' ? 'ol' : 'ul';
  const sz = SIZES.includes(size) ? size : 'md';
  const classes = ['ds-list', `ds-list--${variant}`, `ds-list--${sz}`, className || '']
    .filter(Boolean).join(' ');

  return (
    // A11y-5: con list-style:none, Safari/VoiceOver deja de anunciarla como lista
    <Tag className={classes} role="list">
      {items.map((raw, i) => {
        const { content, number, items: children } = normalize(raw);
        return (
          <li key={i} className="ds-list__item">
            {variant === 'checkmark' ? (
              <span className="ds-list__icon" aria-hidden="true"><Icon name="Check" /></span>
            ) : (
              <span className="ds-list__marker" aria-hidden="true">
                {variant === 'ordered' ? (number ?? orderedMarker(i, level)) : '•'}
              </span>
            )}
            <div className="ds-list__body">
              {content}
              {variant === 'ordered' && children?.length > 0 && level < 3 && (
                <List variant="ordered" size={sz} items={children} level={level + 1} />
              )}
            </div>
          </li>
        );
      })}
    </Tag>
  );
}

List.displayName = 'List';
export default List;
