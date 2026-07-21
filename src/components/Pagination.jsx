/**
 * Pagination — Componente atómico
 * CS Design System · v1.0
 *
 * Muestra en qué página está el usuario y cuántas quedan. Reconstruido desde
 * las .Parts de Figma (18/07/2026), una por elemento con estructura consistente:
 *
 *   Previous / Next  → flechas chevron (antes arrowLeft / arrowRight)
 *   ActivePage       → Link de texto subrayado (resto de páginas)
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
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-pgn {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-pagination-gap);
}

.ds-pgn__item {
  width:            var(--ds-pagination-container-size);
  height:           var(--ds-pagination-container-size);
  display:          inline-flex;
  align-items:      center;
  justify-content:  center;
  box-sizing:       border-box;
  padding:          0;
  margin:           0;
  border:           none;
  background:       transparent;
  border-radius:    var(--ds-pagination-item-radius);
  font-family:      inherit;
  font-size:        var(--ds-pagination-number-font-size);
  font-weight:      var(--ds-pagination-number-font-weight);
  line-height:      1;
  cursor:           pointer;
  transition:       background 0.12s, color 0.12s, opacity 0.12s;
}
.ds-pgn__item:focus-visible {
  outline:    none;
  box-shadow: 0 0 0 var(--ds-pagination-root-border-width-focus) var(--ds-pagination-root-border-color-focus-inner),
              0 0 0 calc(var(--ds-pagination-root-border-width-focus) * 2) var(--ds-pagination-root-border-color-focus-outer);
}

/* ── Previous / Next (flechas) ────────────────────────────────────────────── */
.ds-pgn--primary   .ds-pgn__nav--prev { color: var(--ds-pagination-previous-fg-primary); }
.ds-pgn--secondary .ds-pgn__nav--prev { color: var(--ds-pagination-previous-fg-secondary); }
.ds-pgn--primary   .ds-pgn__nav--next { color: var(--ds-pagination-next-fg-primary); }
.ds-pgn--secondary .ds-pgn__nav--next { color: var(--ds-pagination-next-fg-secondary); }

.ds-pgn--primary   .ds-pgn__nav--prev:hover:not(:disabled) { background: var(--ds-pagination-previous-bg-hover-primary);   color: var(--ds-pagination-previous-fg-hover); }
.ds-pgn--secondary .ds-pgn__nav--prev:hover:not(:disabled) { background: var(--ds-pagination-previous-bg-hover-secondary); color: var(--ds-pagination-previous-fg-hover); }
.ds-pgn--primary   .ds-pgn__nav--next:hover:not(:disabled) { background: var(--ds-pagination-next-bg-hover-primary);       color: var(--ds-pagination-next-fg-hover); }
.ds-pgn--secondary .ds-pgn__nav--next:hover:not(:disabled) { background: var(--ds-pagination-next-bg-hover-secondary);     color: var(--ds-pagination-next-fg-hover); }

/* Cada flecha usa su propio token de opacidad al pulsar — antes Next reusaba el de Previous */
.ds-pgn__nav--prev:active:not(:disabled) { opacity: var(--ds-pagination-previous-opacity-pressed); }
.ds-pgn__nav--next:active:not(:disabled) { opacity: var(--ds-pagination-next-opacity-pressed); }

.ds-pgn__nav:disabled {
  color:          var(--ds-pagination-previous-fg-disabled);
  cursor:         not-allowed;
  pointer-events: none;
}

/* ── ActivePage (Link subrayado) ──────────────────────────────────────────── */
.ds-pgn--primary   .ds-pgn__page { color: var(--ds-pagination-active-fg-primary); }
.ds-pgn--secondary .ds-pgn__page { color: var(--ds-pagination-active-fg-secondary); }
.ds-pgn__page {
  text-decoration:           underline;
  text-underline-offset:     3px;
  text-decoration-thickness: var(--ds-pagination-active-border-bottom-width);
}
.ds-pgn--primary   .ds-pgn__page:hover { background: var(--ds-pagination-active-bg-hover-primary);   color: var(--ds-pagination-active-fg-hover); }
.ds-pgn--secondary .ds-pgn__page:hover { background: var(--ds-pagination-active-bg-hover-secondary); color: var(--ds-pagination-active-fg-hover); }
.ds-pgn__page:active { opacity: var(--ds-pagination-active-opacity-pressed); }

/* ── SelectedPage (círculo actual) ────────────────────────────────────────── */
.ds-pgn--primary   .ds-pgn__current { background: var(--ds-pagination-selected-bg-primary); }
.ds-pgn--secondary .ds-pgn__current { background: var(--ds-pagination-selected-bg-secondary); }
.ds-pgn__current {
  color:  var(--ds-pagination-root-text-fg-selected);
  cursor: default;
}

/* ── Dots ("…" — botón: salta un bloque de siblingCount páginas) ──────────── */
.ds-pgn--primary   .ds-pgn__dots { color: var(--ds-pagination-dots-fg-primary); }
.ds-pgn--secondary .ds-pgn__dots { color: var(--ds-pagination-dots-fg-secondary); }
.ds-pgn--primary   .ds-pgn__dots:hover:not(:disabled) { background: var(--ds-pagination-dots-bg-hover-primary);   color: var(--ds-pagination-dots-fg-hover); }
.ds-pgn--secondary .ds-pgn__dots:hover:not(:disabled) { background: var(--ds-pagination-dots-bg-hover-secondary); color: var(--ds-pagination-dots-fg-hover); }
.ds-pgn__dots:active:not(:disabled) { opacity: var(--ds-pagination-dots-opacity-pressed); }
.ds-pgn__dots:disabled { cursor: not-allowed; pointer-events: none; }

/* ── Disabled global ──────────────────────────────────────────────────────── */
.ds-pgn--disabled .ds-pgn__page,
.ds-pgn--disabled .ds-pgn__dots    { color: var(--ds-pagination-active-fg-disabled); pointer-events: none; }
.ds-pgn--disabled .ds-pgn__current {
  background: var(--ds-pagination-selected-bg-disabled);
  color:      var(--ds-pagination-root-text-fg-disabled);
}
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

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
  variant     = 'primary',   // 'primary' | 'secondary'
  currentPage = 1,
  totalPages  = 1,
  onPageChange,
  disabled    = false,
  maxSlots    = 7,
  siblingCount = 1,   // páginas que salta cada "…" en su dirección
}) {
  injectStyles();

  const go = (page) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  const items = buildPageItems(currentPage, totalPages, maxSlots);

  const rootClasses = [
    'ds-pgn',
    `ds-pgn--${variant}`,
    disabled ? 'ds-pgn--disabled' : '',
  ].filter(Boolean).join(' ');

  const atFirst = disabled || currentPage <= 1;
  const atLast  = disabled || currentPage >= totalPages;

  return (
    <nav className={rootClasses} aria-label="Paginación">
      <button
        type="button"
        className="ds-pgn__item ds-pgn__nav ds-pgn__nav--prev"
        onClick={() => go(currentPage - 1)}
        disabled={atFirst}
        aria-label="Página anterior"
      >
        <ChevronLeft width={20} height={20} strokeWidth={1.75} aria-hidden="true" />
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
              aria-label="Saltar páginas"
            >
              …
            </button>
          );
        }
        return item === currentPage ? (
          <span
            key={item}
            className="ds-pgn__item ds-pgn__current"
            aria-current="page"
            aria-label={`Página ${item}`}
          >
            {item}
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className="ds-pgn__item ds-pgn__page"
            onClick={() => go(item)}
            disabled={disabled}
            aria-label={`Ir a la página ${item}`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        className="ds-pgn__item ds-pgn__nav ds-pgn__nav--next"
        onClick={() => go(currentPage + 1)}
        disabled={atLast}
        aria-label="Página siguiente"
      >
        <ChevronRight width={20} height={20} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
