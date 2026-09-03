/**
 * SegmentedControl — Componente atómico
 * CS Design System · v1.0
 *
 * Grupo de selección única en forma de píldoras. Compone N `segments` a
 * partir de un array + índice seleccionado — Figma enumeraba cada
 * combinación (`Number=2..5 Step` × `Selected=1st..5th`) como variante fija,
 * antipatrón ya evitado en Table/CellActions/FileSelector; aquí se ignora
 * esa enumeración por completo y no hay límite de 5 segmentos.
 *
 * `size` small/medium/large — mismo eje que `.Segment` en Figma. El color
 * del indicator seleccionado es siempre el mismo (`bg-inverse`/`fg-label-
 * inverse`, pareja que invierte junta con el modo) — no varía por tamaño.
 *
 * Estados vía pseudo-clases CSS nativas (`<button>` real, sin JS de estado
 * propio): `:hover` con `::before` (mismo mecanismo que Chip), `:active`
 * con `opacity` (mismo mecanismo que Icon Button), `:focus-visible` con
 * anillo doble (mismo mecanismo que Icon Button: `outline` + `box-shadow`
 * combinados, sin necesidad de las 2 capas que hizo falta en Figma).
 *
 * USO:
 *   <SegmentedControl
 *     segments={['Día', 'Semana', 'Mes']}
 *     selectedIndex={selected}
 *     onChange={setSelected}
 *   />
 *   <SegmentedControl segments={['A', 'B']} selectedIndex={0} onChange={fn} size="large" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-segmented-control {
  display: inline-flex;
  gap: var(--ds-segmented-control-root-gap);
  background: var(--ds-segmented-control-root-bg);
  border-radius: var(--ds-segmented-control-root-border-radius);
  box-sizing: border-box;
}
.ds-segmented-control__segment {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--ds-segmented-control-segment-bg);
  color: var(--ds-segmented-control-label-fg);
  border-radius: var(--ds-segmented-control-segment-border-radius);
  font-family: inherit;                       /* Nunito (fontFamily/default) */
  font-size: var(--ds-fontSize-label-sm);      /* 14 */
  font-weight: var(--ds-font-weight-regular);  /* 400 */
  line-height: var(--ds-lineHeight-2xs);       /* 21 */
  cursor: pointer;
  box-sizing: border-box;
  white-space: nowrap;
}
.ds-segmented-control__segment::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
}
.ds-segmented-control__segment:hover::before {
  background: var(--ds-segmented-control-bgmix-hover);
}
.ds-segmented-control__segment[aria-checked="true"] {
  background: var(--ds-segmented-control-segment-bg-selected);
  color: var(--ds-segmented-control-label-fg-selected);
}
.ds-segmented-control__segment[aria-checked="true"]:hover::before {
  background: var(--ds-segmented-control-bgmix-hover-selected);
}
.ds-segmented-control__segment:active {
  opacity: var(--ds-segmented-control-opacity-pressed);
}
.ds-segmented-control__segment:focus-visible {
  outline: var(--ds-segmented-control-focus-width) solid var(--ds-segmented-control-focus-outer);
  outline-offset: 1px;
  box-shadow: 0 0 0 4px var(--ds-segmented-control-focus-inner);
}

.ds-segmented-control__segment--small {
  padding: var(--ds-segmented-control-segment-padding-ver-sm) var(--ds-segmented-control-segment-padding-hor-sm);
}
.ds-segmented-control__segment--medium {
  padding: var(--ds-segmented-control-segment-padding-ver-md) var(--ds-segmented-control-segment-padding-hor-sm);
}
.ds-segmented-control__segment--large {
  padding: var(--ds-segmented-control-segment-padding-ver-lg) var(--ds-segmented-control-segment-padding-hor-lg);
}
`;

injectStyles('ds-segmented-control', css);

export function SegmentedControl({
  segments = [],
  selectedIndex = 0,
  onChange,
  size = 'small', // 'small' | 'medium' | 'large'
  id,
  className,
}) {
  const classes = ['ds-segmented-control', className || ''].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} role="radiogroup">
      {segments.map((label, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={i === selectedIndex}
          className={`ds-segmented-control__segment ds-segmented-control__segment--${size}`}
          onClick={() => onChange && onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

const [selected, setSelected] = useState(0);

<SegmentedControl segments={['Día', 'Semana', 'Mes']} selectedIndex={selected} onChange={setSelected} />

<SegmentedControl segments={['A', 'B']} selectedIndex={0} onChange={fn} size="large" />
*/
