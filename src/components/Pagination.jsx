/**
 * Pagination — Componente atómico
 * CS Design System · v1.1 (12/11/2026: eje default/secondary, números 14, área de foco 4, icono vía Icon, tokens)
 *
 * Muestra en qué página está el usuario y cuántas quedan. Reconstruido desde
 * las .Parts de Figma (18/07/2026), una por elemento con estructura consistente:
 *
 *   Previous / Next  → flechas chevron 16 (átomo Icon)
 *   ActivePage       → número subrayado (resto de páginas; en Figma ya no es un Link anidado, 12/11)
 *   SelectedPage     → círculo relleno de la página actual
 *   Dots             → "…" de truncamiento (botón: salta siblingCount páginas)
 *
 * Nombres cruzados heredados de Sistema Origen: "Active"/"Selected" NO siguen la
 * intuición. Los tokens de Figma ya están renombrados por Part — mapea por el
 * nombre del Part, nunca por la intuición.
 *
 * Regla de contraste (misma que Button/Icon Button): contenido en blanco cuando
 * el fondo del estado es relleno; oscuro cuando es contorno. Todo el color se
 * resuelve vía --ds-pagination-* + currentColor; sin hex hardcodeados en JSX.
 *
 * USO:
 *   <Pagination currentPage={1} totalPages={4} onPageChange={setPage} />
 *   <Pagination variant="secondary" currentPage={7} totalPages={20} onPageChange={setPage} />
 *
 * 12/11 (decisiones de Carol): números en label/sm 14 (bold solo la página
 * actual), hover rellena el círculo en todas las piezas, y cada Part es un
 * círculo de 32 dentro de un área de foco de 4 — el anillo 2 + 2 cae dentro y
 * entre círculos quedan 8, sin gap propio.
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { warnOnce } from './_devWarn';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-pgn {
  display:     inline-flex;
  align-items: center;
}

/* Cada Part: círculo de 32 dentro de un área de foco de 4 (margin, en todos
   los estados) — 8 visibles entre círculos, como Figma (12/11). */
.ds-pgn__item {
  position:         relative;
  width:            var(--ds-pagination-container-size);
  height:           var(--ds-pagination-container-size);
  margin:           var(--ds-pagination-root-focus-area);
  display:          inline-flex;
  align-items:      center;
  justify-content:  center;
  box-sizing:       border-box;
  padding:          0;
  border:           none;
  background:       transparent;
  border-radius:    var(--ds-pagination-item-radius);
  font-family:      inherit;
  font-size:        var(--ds-pagination-number-font-size);
  line-height:      var(--ds-pagination-number-line-height);
  font-weight:      var(--ds-font-weight-regular);
  cursor:           pointer;
}
/* Anillo 2 + 2 por fuera del círculo, dentro del área de foco */
.ds-pgn__item:focus-visible {
  outline:    var(--ds-pagination-root-border-width-focus) solid transparent; /* visible solo en colores forzados — audit §F */
  box-shadow: 0 0 0 var(--ds-pagination-root-border-width-focus) var(--ds-pagination-root-border-color-focus-inner),
              0 0 0 calc(var(--ds-pagination-root-border-width-focus) * 2) var(--ds-pagination-root-border-color-focus-outer);
}

/* ── Previous / Next (flechas) ────────────────────────────────────────────── */
.ds-pgn--default   .ds-pgn__nav--prev { color: var(--ds-pagination-previous-fg-default); }
.ds-pgn--secondary .ds-pgn__nav--prev { color: var(--ds-pagination-previous-fg-secondary); }
.ds-pgn--default   .ds-pgn__nav--next { color: var(--ds-pagination-next-fg-default); }
.ds-pgn--secondary .ds-pgn__nav--next { color: var(--ds-pagination-next-fg-secondary); }

.ds-pgn--default   .ds-pgn__nav--prev:hover:not(:disabled):not([aria-disabled="true"]) { background: var(--ds-pagination-previous-bg-hover-default);   color: var(--ds-pagination-previous-fg-hover); }
.ds-pgn--secondary .ds-pgn__nav--prev:hover:not(:disabled):not([aria-disabled="true"]) { background: var(--ds-pagination-previous-bg-hover-secondary); color: var(--ds-pagination-previous-fg-hover); }
.ds-pgn--default   .ds-pgn__nav--next:hover:not(:disabled):not([aria-disabled="true"]) { background: var(--ds-pagination-next-bg-hover-default);       color: var(--ds-pagination-next-fg-hover); }
.ds-pgn--secondary .ds-pgn__nav--next:hover:not(:disabled):not([aria-disabled="true"]) { background: var(--ds-pagination-next-bg-hover-secondary);     color: var(--ds-pagination-next-fg-hover); }

.ds-pgn__nav--prev:active:not(:disabled):not([aria-disabled="true"]) { opacity: var(--ds-pagination-previous-opacity-pressed); }
.ds-pgn__nav--next:active:not(:disabled):not([aria-disabled="true"]) { opacity: var(--ds-pagination-next-opacity-pressed); }

.ds-pgn__nav--prev:disabled, .ds-pgn__nav--prev[aria-disabled="true"] { color: var(--ds-pagination-previous-fg-disabled); }
.ds-pgn__nav--next:disabled, .ds-pgn__nav--next[aria-disabled="true"] { color: var(--ds-pagination-next-fg-disabled); }
.ds-pgn__nav:disabled,
.ds-pgn__nav[aria-disabled="true"] { cursor: not-allowed; }

/* ── ActivePage (número subrayado) ────────────────────────────────────────── */
.ds-pgn--default   .ds-pgn__page { color: var(--ds-pagination-active-fg-default); }
.ds-pgn--secondary .ds-pgn__page { color: var(--ds-pagination-active-fg-secondary); }
.ds-pgn__page {
  text-decoration:           underline;
  text-decoration-thickness: var(--ds-pagination-active-border-bottom-width);
}
.ds-pgn--default   .ds-pgn__page:hover { background: var(--ds-pagination-active-bg-hover-default);   color: var(--ds-pagination-active-fg-hover); }
.ds-pgn--secondary .ds-pgn__page:hover { background: var(--ds-pagination-active-bg-hover-secondary); color: var(--ds-pagination-active-fg-hover); }
.ds-pgn__page:active { opacity: var(--ds-pagination-active-opacity-pressed); }

/* ── SelectedPage (círculo actual, bold) ──────────────────────────────────── */
.ds-pgn--default   .ds-pgn__current { background-color: var(--ds-pagination-selected-bg-default); }
.ds-pgn--secondary .ds-pgn__current { background-color: var(--ds-pagination-selected-bg-secondary); }
.ds-pgn__current {
  color:       var(--ds-pagination-root-text-fg-selected);
  font-weight: var(--ds-font-weight-bold);
}
.ds-pgn__current:hover  { background-image: linear-gradient(var(--ds-pagination-selected-bg-hover), var(--ds-pagination-selected-bg-hover)); }
.ds-pgn__current:active { opacity: var(--ds-pagination-selected-opacity-pressed); }

/* ── Dots ("…" — botón: salta un bloque de siblingCount páginas) ──────────── */
.ds-pgn--default   .ds-pgn__dots { color: var(--ds-pagination-dots-fg-default); }
.ds-pgn--secondary .ds-pgn__dots { color: var(--ds-pagination-dots-fg-secondary); }
.ds-pgn--default   .ds-pgn__dots:hover:not(:disabled) { background: var(--ds-pagination-dots-bg-hover-default);   color: var(--ds-pagination-dots-fg-hover); }
.ds-pgn--secondary .ds-pgn__dots:hover:not(:disabled) { background: var(--ds-pagination-dots-bg-hover-secondary); color: var(--ds-pagination-dots-fg-hover); }
.ds-pgn__dots:active:not(:disabled) { opacity: var(--ds-pagination-dots-opacity-pressed); }

/* ── Disabled global ──────────────────────────────────────────────────────── */
.ds-pgn--disabled .ds-pgn__item { cursor: not-allowed; pointer-events: none; }
.ds-pgn--disabled .ds-pgn__page { color: var(--ds-pagination-active-fg-disabled); }
.ds-pgn--disabled .ds-pgn__dots { color: var(--ds-pagination-dots-fg-disabled); }
.ds-pgn--disabled .ds-pgn__current {
  background: var(--ds-pagination-selected-bg-disabled);
  color:      var(--ds-pagination-root-text-fg-disabled);
}
`;

injectStyles('ds-pagination', css);

/* ─── Lógica de truncamiento ─────────────────────────────────────────────────
 * Devuelve la secuencia de items a renderizar: números de página o 'dots'.
 * Tope fijo de "bolas" (maxSlots, por defecto 7 = 2 boundary + hasta 2 dots
 * + los números intermedios que quepan). Nunca se supera ese número de items.
 *
 *   totalPages <= maxSlots        → se muestran todas, sin puntos suspensivos
 *   currentPage cerca del inicio  → 1 2 3 4 5 … 99   (aprovecha el hueco del
 *                                                      lado sin dots)
 *   currentPage cerca del final   → 1 … 95 96 97 98 99
 *   currentPage en medio          → 1 … 6 7 8 … 99    (1 vecino a cada lado)
 *
 * Caso límite conocido: si totalPages === maxSlots + 1 y currentPage está en
 * medio, ocultar 1 sola página con "…" no ahorra hueco (los puntos ocupan lo
 * mismo que la página que sustituyen) — en ese caso se muestran todas
 * (maxSlots + 1 items) en vez de forzar un recorte que no aporta nada.        */
function buildPageItems(current, total, maxSlots = 7) {
  if (total <= maxSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const boundaryCount = 1;                           // páginas fijas al principio/final
  const innerSlots = maxSlots - boundaryCount * 2;    // slots del bloque central (=5 con maxSlots=7)

  const needsLeftDots  = current - boundaryCount - 2 > innerSlots - 3;
  const needsRightDots = total - current - boundaryCount - 1 > innerSlots - 3;

  const items = [];

  if (!needsLeftDots && needsRightDots) {
    // cerca del inicio: consumimos el hueco mostrando consecutivos desde el principio
    const end = maxSlots - boundaryCount - 1;
    for (let i = 1; i <= end; i++) items.push(i);
    items.push('dots');
    for (let i = total - boundaryCount + 1; i <= total; i++) items.push(i);
  } else if (needsLeftDots && !needsRightDots) {
    // cerca del final: simétrico
    for (let i = 1; i <= boundaryCount; i++) items.push(i);
    items.push('dots');
    const start = total - (maxSlots - boundaryCount - 2);
    for (let i = start; i <= total; i++) items.push(i);
  } else if (needsLeftDots && needsRightDots) {
    // en medio: boundary + dots + vecinos ±1 + dots + boundary
    const siblingCount = Math.max(1, Math.floor((innerSlots - 2) / 2) - 1);
    for (let i = 1; i <= boundaryCount; i++) items.push(i);
    items.push('dots');
    for (let i = current - siblingCount; i <= current + siblingCount; i++) items.push(i);
    items.push('dots');
    for (let i = total - boundaryCount + 1; i <= total; i++) items.push(i);
  } else {
    // total === maxSlots + 1 aprox: no compensa recortar, se muestran todas
    for (let i = 1; i <= total; i++) items.push(i);
  }

  return items;
}

/* ─── Pagination ─────────────────────────────────────────────────────────────*/

export function Pagination({
  variant     = 'default',   // 'default' | 'secondary' ('primary' = alias antiguo de default)
  currentPage = 1,
  totalPages  = 1,
  onPageChange,
  disabled    = false,
  maxSlots    = 7,
  siblingCount = 1,   // páginas que salta cada "…" en su dirección
  ariaLabel   = 'Pagination', // nombre del <nav> — distinto si hay dos en la página
  labels      = {},
}) {
  // A11y-3: textos ocultos en inglés por defecto (decisión 20/10), por prop.
  const t = {
    previous: 'Previous page',
    next: 'Next page',
    page: (n) => `Page ${n}`,
    earlierPages: 'Earlier pages',
    laterPages: 'Later pages',
    ...labels,
  };
  const go = (page) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  if (variant === 'primary') warnOnce('Pagination.primary', '[DS Pagination] variant="primary" ahora se llama "default".');
  const v = variant === 'secondary' ? 'secondary' : 'default';
  const items = buildPageItems(currentPage, totalPages, maxSlots);

  const rootClasses = [
    'ds-pgn',
    `ds-pgn--${v}`,
    disabled ? 'ds-pgn--disabled' : '',
  ].filter(Boolean).join(' ');

  // A11y-4: en los extremos las flechas quedan aria-disabled (siguen
  // enfocables): con `disabled` nativo el foco se perdía al llegar al final.
  const atFirst = currentPage <= 1;
  const atLast  = currentPage >= totalPages;

  return (
    <nav className={rootClasses} aria-label={ariaLabel}>
      <button
        type="button"
        className="ds-pgn__item ds-pgn__nav ds-pgn__nav--prev"
        onClick={() => go(currentPage - 1)}
        disabled={disabled}
        aria-disabled={!disabled && atFirst ? 'true' : undefined}
        aria-label={t.previous}
      >
        <Icon name="chevron-left" size="2xs" />
      </button>

      {items.map((item, i) => {
        if (item === 'dots') {
          // Dirección por el número que precede al "…": si es anterior a la
          // página actual, este "…" está a la izquierda → retrocede; si no,
          // está a la derecha → avanza. Salto = siblingCount páginas.
          const prevNum = items[i - 1];
          const back    = typeof prevNum === 'number' && prevNum < currentPage;
          const target  = back
            ? Math.max(1, currentPage - siblingCount)
            : Math.min(totalPages, currentPage + siblingCount);
          return (
            <button
              key={`dots-${i}`}
              type="button"
              className="ds-pgn__item ds-pgn__dots"
              onClick={() => go(target)}
              disabled={disabled}
              aria-label={back ? t.earlierPages : t.laterPages}
            >
              …
            </button>
          );
        }
        // A11y-4: la página actual es el MISMO botón (misma key y etiqueta) que
        // antes de pulsarlo, solo cambia de aspecto — antes se re-montaba como
        // <span> y el foco se perdía. "Page 3, current page".
        const isCurrent = item === currentPage;
        return (
          <button
            key={item}
            type="button"
            className={`ds-pgn__item ${isCurrent ? 'ds-pgn__current' : 'ds-pgn__page'}`}
            onClick={() => go(item)}
            disabled={disabled}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={t.page(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        className="ds-pgn__item ds-pgn__nav ds-pgn__nav--next"
        onClick={() => go(currentPage + 1)}
        disabled={disabled}
        aria-disabled={!disabled && atLast ? 'true' : undefined}
        aria-label={t.next}
      >
        <Icon name="chevron-right" size="2xs" />
      </button>
    </nav>
  );
}

export default Pagination;
