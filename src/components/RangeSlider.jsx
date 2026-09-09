/**
 * RangeSlider — Componente atómico
 * CS Design System · v1.0
 *
 * Slider de rango — dos valores (`value={[min, max]}`), dos knobs
 * independientes, el indicator pinta el tramo ENTRE ambos (no desde el
 * origen, a diferencia de `Slider`). Mecanismo real confirmado en Figma:
 * el tramo coloreado es la capa exterior real (`.Indicator`), y el tramo
 * gris que sigue tras el segundo knob es una continuación de `.Track` que
 * solo existe para alojar la posición absoluta de ese knob — en CSS no
 * hace falta esa capa extra, un `left`/`right` sobre el indicator basta.
 *
 * Reutiliza el mismo helper interno `_sliderKnob.jsx` que `Slider` — un
 * knob por extremo, cada uno arrastrable y enfocable de forma independiente
 * (`role="slider"` × 2), acotados entre sí (el inferior nunca puede superar
 * al superior y viceversa).
 *
 * USO:
 *   <RangeSlider value={[20, 70]} onChange={setRange} ariaLabelMin="Mínimo" ariaLabelMax="Máximo" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { SliderKnob } from './_sliderKnob';

const css = `
.ds-range-slider {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: var(--ds-slider-root-gap);
  padding: var(--ds-slider-root-padding-ver) 16px;
  background: var(--ds-slider-root-bg);
  border: var(--ds-slider-root-border-width) solid var(--ds-slider-root-border-color);
  border-radius: var(--ds-slider-root-border-radius);
}
.ds-range-slider:not(.ds-range-slider--disabled):hover {
  background: var(--ds-slider-root-bg-hover);
}
.ds-range-slider--disabled {
  cursor: not-allowed;
}
.ds-range-slider:focus-within {
  border-width: var(--ds-slider-root-border-width-focus);
  border-color: var(--ds-slider-knob-focus-outer);
}
.ds-range-slider__track-wrapper {
  position: relative;
  flex: 1 1 auto;
  height: var(--ds-slider-knob-size);
  display: flex;
  align-items: center;
  touch-action: none;
}
.ds-range-slider__track {
  position: relative;
  width: 100%;
  height: var(--ds-slider-track-height);
  border-radius: var(--ds-slider-track-border-radius);
  background: var(--ds-slider-track-bg);
  overflow: hidden;
}
.ds-range-slider__indicator {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: var(--ds-slider-indicator-border-radius);
  background: var(--ds-slider-indicator-bg-primary);
}
.ds-range-slider__indicator--secondary {
  background: var(--ds-slider-indicator-bg-secondary);
}
.ds-range-slider--disabled .ds-range-slider__indicator {
  background: var(--ds-slider-indicator-bg-disabled);
}
`;

injectStyles('ds-range-slider', css);

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function RangeSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary'
  formatValue = (v) => `${v}%`,
  ariaLabelMin = 'Mínimo',
  ariaLabelMax = 'Máximo',
  id,
  className,
}) {
  const [lo, hi] = value;
  const trackRef = React.useRef(null);
  const loKnobRef = React.useRef(null);
  const hiKnobRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(null); // 'lo' | 'hi' | null

  const loPercent = ((clamp(lo, min, max) - min) / (max - min)) * 100;
  const hiPercent = ((clamp(hi, min, max) - min) / (max - min)) * 100;

  function valueFromClientX(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
  }

  function startDrag(which, e) {
    if (disabled) return;
    e.preventDefault(); // evita que el mousedown por defecto del navegador robe el foco tras la llamada a .focus() de abajo
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(which);
    (which === 'lo' ? loKnobRef : hiKnobRef).current?.focus();
  }

  function handlePointerMove(e) {
    if (!dragging || disabled) return;
    const next = valueFromClientX(e.clientX);
    if (dragging === 'lo') {
      onChange && onChange([Math.min(next, hi), hi]);
    } else {
      onChange && onChange([lo, Math.max(next, lo)]);
    }
  }

  function handlePointerUp(e) {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setDragging(null);
  }

  function makeKeyHandler(which) {
    return function handleKeyDown(e) {
      if (disabled) return;
      const current = which === 'lo' ? lo : hi;
      let next = current;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = current + step;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = current - step;
      else if (e.key === 'Home') next = min;
      else if (e.key === 'End') next = max;
      else return;
      e.preventDefault();
      next = clamp(next, min, max);
      if (which === 'lo') onChange && onChange([Math.min(next, hi), hi]);
      else onChange && onChange([lo, Math.max(next, lo)]);
    };
  }

  const classes = [
    'ds-range-slider',
    disabled ? 'ds-range-slider--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <div
        className="ds-range-slider__track-wrapper"
        ref={trackRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="ds-range-slider__track">
          <div
            className={['ds-range-slider__indicator', variant === 'secondary' ? 'ds-range-slider__indicator--secondary' : ''].filter(Boolean).join(' ')}
            style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
          />
        </div>
        <SliderKnob
          ref={loKnobRef}
          percent={loPercent}
          valueText={formatValue(lo)}
          disabled={disabled}
          dragging={dragging === 'lo'}
          onPointerDown={(e) => startDrag('lo', e)}
          onKeyDown={makeKeyHandler('lo')}
          ariaLabel={ariaLabelMin}
          ariaValueMin={min}
          ariaValueMax={hi}
          ariaValueNow={lo}
        />
        <SliderKnob
          ref={hiKnobRef}
          percent={hiPercent}
          valueText={formatValue(hi)}
          disabled={disabled}
          dragging={dragging === 'hi'}
          onPointerDown={(e) => startDrag('hi', e)}
          onKeyDown={makeKeyHandler('hi')}
          ariaLabel={ariaLabelMax}
          ariaValueMin={lo}
          ariaValueMax={max}
          ariaValueNow={hi}
        />
      </div>
    </div>
  );
}

export default RangeSlider;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<RangeSlider value={[20, 70]} onChange={setRange} />
<RangeSlider value={[20, 70]} onChange={setRange} variant="secondary" />
<RangeSlider value={[20, 70]} onChange={setRange} disabled />
*/
