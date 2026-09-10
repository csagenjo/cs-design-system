/**
 * SteppedSlider — Componente atómico
 * CS Design System · v1.0
 *
 * Slider de un solo valor con paradas discretas visibles (marcas de punto
 * a lo largo del track) — en Figma es el componente "Segmented", con su
 * propio mecanismo real: una cadena de instancias `.Segment` (Point+Tail),
 * no el relleno+máscara de `Slider`/`Continuous`.
 *
 * Se queda como componente SEPARADO de `Slider` a propósito, no como un
 * prop `steps` sobre el mismo átomo — varios intentos reales de fusionarlos
 * en Figma (ver `tokens.css`) rompieron el posicionamiento del knob y
 * expusieron un bug real en el maestro `.Segment` (sin eje `Variant`,
 * saltándose la capa de Componente). El mecanismo interno es distinto de
 * verdad: aquí el valor SIEMPRE snapea a una de `steps` paradas fijas, no
 * hay arrastre libre.
 *
 * `steps` = nº de paradas reales (incluye los dos extremos) — `steps={5}`
 * con `min=0 max=100` da paradas en 0/25/50/75/100. El track subyacente
 * (relleno sólido + máscara) es el MISMO mecanismo de `Slider` — las marcas
 * de punto son una capa decorativa encima, no una reimplementación del
 * relleno. Reutiliza `_sliderKnob.jsx`, mismo helper que `Slider`/
 * `RangeSlider`.
 *
 * USO:
 *   <SteppedSlider value={value} steps={5} onChange={setValue} ariaLabel="Nivel" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { SliderKnob } from './_sliderKnob';

const css = `
.ds-stepped-slider {
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
.ds-stepped-slider:not(.ds-stepped-slider--disabled):hover {
  background: var(--ds-slider-root-bg-hover);
}
.ds-stepped-slider--disabled {
  cursor: not-allowed;
}
.ds-stepped-slider:focus-within {
  border-width: var(--ds-slider-root-border-width-focus);
  border-color: var(--ds-slider-knob-focus-outer);
}
.ds-stepped-slider__track-wrapper {
  position: relative;
  flex: 1 1 auto;
  height: var(--ds-slider-knob-size);
  display: flex;
  align-items: center;
  touch-action: none;
}
.ds-stepped-slider__track {
  position: relative;
  width: 100%;
  height: var(--ds-slider-track-height);
}
.ds-stepped-slider__line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: calc(var(--ds-slider-track-height) / 2);
  transform: translateY(-50%);
  border-radius: var(--ds-slider-track-border-radius);
  background: var(--ds-slider-track-bg);
  overflow: hidden;
}
.ds-stepped-slider__indicator {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: var(--ds-slider-indicator-border-radius);
  background: var(--ds-slider-indicator-bg-primary);
}
.ds-stepped-slider__indicator--secondary {
  background: var(--ds-slider-indicator-bg-secondary);
}
.ds-stepped-slider--disabled .ds-stepped-slider__indicator {
  background: var(--ds-slider-indicator-bg-disabled);
}
.ds-stepped-slider__dots {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}
.ds-stepped-slider__dot {
  width: var(--ds-slider-track-height);
  height: var(--ds-slider-track-height);
  border-radius: 50%;
  background: var(--ds-slider-track-bg);
}
.ds-stepped-slider__dot--active {
  background: var(--ds-slider-indicator-bg-primary);
}
.ds-stepped-slider__dot--active.ds-stepped-slider__dot--secondary {
  background: var(--ds-slider-indicator-bg-secondary);
}
.ds-stepped-slider--disabled .ds-stepped-slider__dot--active {
  background: var(--ds-slider-indicator-bg-disabled);
}
`;

injectStyles('ds-stepped-slider', css);

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function SteppedSlider({
  value,
  steps = 5,
  min = 0,
  max = 100,
  onChange,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary'
  formatValue = (v) => `${Math.round(v)}%`, // steps no siempre divide min-max en enteros exactos (p.ej. steps=4 → 33.33/66.66) — se redondea solo la burbuja, el snapping interno sigue con el valor real
  ariaLabel,
  id,
  className,
}) {
  const trackRef = React.useRef(null);
  const knobRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const stepValues = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < steps; i++) {
      arr.push(min + (i / (steps - 1)) * (max - min));
    }
    return arr;
  }, [steps, min, max]);

  function nearestStep(raw) {
    return stepValues.reduce((closest, v) =>
      Math.abs(v - raw) < Math.abs(closest - raw) ? v : closest
    , stepValues[0]);
  }

  const percent = ((clamp(value, min, max) - min) / (max - min)) * 100;

  function valueFromClientX(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = min + ratio * (max - min);
    return nearestStep(raw);
  }

  function handlePointerDown(e) {
    if (disabled) return;
    e.preventDefault(); // evita que el mousedown por defecto del navegador robe el foco tras la llamada a .focus() de abajo
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    knobRef.current?.focus();
    onChange && onChange(valueFromClientX(e.clientX));
  }

  function handlePointerMove(e) {
    if (!dragging || disabled) return;
    onChange && onChange(valueFromClientX(e.clientX));
  }

  function handlePointerUp(e) {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setDragging(false);
  }

  function handleKeyDown(e) {
    if (disabled) return;
    const currentIndex = stepValues.indexOf(nearestStep(value));
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nextIndex = currentIndex + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nextIndex = currentIndex - 1;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = stepValues.length - 1;
    else return;
    e.preventDefault();
    nextIndex = clamp(nextIndex, 0, stepValues.length - 1);
    onChange && onChange(stepValues[nextIndex]);
  }

  const classes = [
    'ds-stepped-slider',
    disabled ? 'ds-stepped-slider--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  const isSecondary = variant === 'secondary';

  return (
    <div id={id} className={classes}>
      <div
        className="ds-stepped-slider__track-wrapper"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="ds-stepped-slider__track">
          <div className="ds-stepped-slider__line">
            <div
              className={['ds-stepped-slider__indicator', isSecondary ? 'ds-stepped-slider__indicator--secondary' : ''].filter(Boolean).join(' ')}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="ds-stepped-slider__dots">
            {stepValues.map((v) => (
              <span
                key={v}
                className={[
                  'ds-stepped-slider__dot',
                  v <= value ? 'ds-stepped-slider__dot--active' : '',
                  isSecondary ? 'ds-stepped-slider__dot--secondary' : '',
                ].filter(Boolean).join(' ')}
              />
            ))}
          </div>
        </div>
        <SliderKnob
          ref={knobRef}
          percent={percent}
          valueText={formatValue(value)}
          disabled={disabled}
          dragging={dragging}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          ariaLabel={ariaLabel}
          ariaValueMin={min}
          ariaValueMax={max}
          ariaValueNow={value}
        />
      </div>
    </div>
  );
}

export default SteppedSlider;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<SteppedSlider value={value} steps={5} onChange={setValue} ariaLabel="Nivel" />
<SteppedSlider value={value} steps={4} onChange={setValue} ariaLabel="Nivel" variant="secondary" />
<SteppedSlider value={value} steps={5} onChange={setValue} ariaLabel="Nivel" disabled />
*/
