/**
 * Slider — Componente atómico
 * CS Design System · v1.0
 *
 * Slider continuo de un solo valor — arrastre libre, sin marcas de parada
 * visibles. Primer componente del sistema con arrastre real (puntero +
 * teclado): el resto hasta ahora resolvía sus estados con pseudo-clases
 * nativas de `<button>`, aquí hace falta `role="slider"` + gestión de
 * posición vía Pointer Events, siguiendo el patrón ARIA APG de slider.
 *
 * Mecanismo real (confirmado en Figma, no asumido): la capa `.Indicator`
 * (exterior) pinta el color completo (`--ds-slider-indicator-bg-*`); encima,
 * `.Track` es una máscara gris con `padding-left` variable que tapa la
 * parte del recorrido aún no alcanzada — así el color "avanza" según el
 * padding se reduce. En CSS es más simple resolverlo al revés: track gris
 * de fondo + indicator coloreado con `width: value%` superpuesto — mismo
 * resultado visual, sin la capa de máscara (innecesaria fuera de Figma).
 *
 * El knob (`.Knob` en Figma) es un sub-átomo compartido real — instancia el
 * átomo `Tooltip` para la burbuja de valor. En código, mismo criterio: vive
 * en `_sliderKnob.jsx` (helper interno, no exportado), compartido con
 * `RangeSlider`/`SteppedSlider`, en vez de reimplementarlo en cada uno.
 *
 * Fila entera es una superficie hover real (`--ds-slider-root-bg-hover`),
 * y en foco pinta un borde propio alrededor de toda la fila además del
 * anillo del knob — confirmado con captura en Figma, dos mecanismos de
 * foco independientes, no uno solo.
 *
 * `variant` decide el color del indicator (primary teal / secondary rosa) —
 * el resto (knob, icono, track) no varía con el color, es `generic`.
 *
 * `iconLeft`/`iconRight` son slots libres `ReactNode` (no los iconos de
 * volumen literales de la documentación de Figma).
 *
 * Continuous y Segmented (ver `SteppedSlider.jsx`) se quedan como DOS
 * componentes separados a propósito — el mecanismo interno es realmente
 * distinto (relleno+máscara vs. cadena de instancias `.Segment`), no una
 * variación visual. Decisión confirmada con Carol tras varios intentos
 * reales de fusionarlos en Figma que rompieron el posicionamiento del knob.
 * Ver `tokens.css` para el detalle completo de la sesión.
 *
 * USO:
 *   <Slider value={value} onChange={setValue} ariaLabel="Volumen" />
 *   <Slider value={value} onChange={setValue} ariaLabel="Volumen" iconLeft={<Icon name="volume-x" />} iconRight={<Icon name="volume-2" />} />
 *   <Slider value={value} onChange={setValue} ariaLabel="Progreso" variant="secondary" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { SliderKnob } from './_sliderKnob';

const css = `
.ds-slider {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: var(--ds-slider-root-gap);
  padding: var(--ds-slider-root-padding-ver) 16px;
  background: var(--ds-slider-root-bg);
  border: var(--ds-slider-root-border-width) solid var(--ds-slider-root-border-color);
  border-radius: var(--ds-slider-root-border-radius);
  box-sizing: border-box;
}
.ds-slider--with-icon {
  padding-top: var(--ds-slider-root-padding-ver-with-icon);
  padding-bottom: var(--ds-slider-root-padding-ver-with-icon);
}
.ds-slider:not(.ds-slider--disabled):hover {
  background: var(--ds-slider-root-bg-hover);
}
.ds-slider--disabled {
  cursor: not-allowed;
}
.ds-slider:focus-within {
  border-width: var(--ds-slider-root-border-width-focus);
  border-color: var(--ds-slider-knob-focus-outer);
}
.ds-slider__icon {
  flex-shrink: 0;
  display: flex;
  color: var(--ds-slider-icon-fg);
}
.ds-slider--disabled .ds-slider__icon {
  color: var(--ds-slider-icon-fg-disabled);
}
.ds-slider__track-wrapper {
  position: relative;
  flex: 1 1 auto;
  height: var(--ds-slider-knob-size);
  display: flex;
  align-items: center;
  touch-action: none;
}
.ds-slider__track {
  position: relative;
  width: 100%;
  height: var(--ds-slider-track-height);
  border-radius: var(--ds-slider-track-border-radius);
  background: var(--ds-slider-track-bg);
  overflow: hidden;
}
.ds-slider__indicator {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: var(--ds-slider-indicator-border-radius);
  background: var(--ds-slider-indicator-bg-primary);
}
.ds-slider__indicator--secondary {
  background: var(--ds-slider-indicator-bg-secondary);
}
.ds-slider--disabled .ds-slider__indicator {
  background: var(--ds-slider-indicator-bg-disabled);
}
`;

injectStyles('ds-slider', css);

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary'
  iconLeft,
  iconRight,
  formatValue = (v) => `${v}%`,
  ariaLabel,
  id,
  className,
}) {
  const trackRef = React.useRef(null);
  const knobRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const percent = ((clamp(value, min, max) - min) / (max - min)) * 100;

  function valueFromClientX(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
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
    let next = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = value + step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = value - step;
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else return;
    e.preventDefault();
    onChange && onChange(clamp(next, min, max));
  }

  const classes = [
    'ds-slider',
    (iconLeft || iconRight) ? 'ds-slider--with-icon' : '',
    disabled ? 'ds-slider--disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      {iconLeft && <span className="ds-slider__icon">{iconLeft}</span>}
      <div
        className="ds-slider__track-wrapper"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="ds-slider__track">
          <div
            className={['ds-slider__indicator', variant === 'secondary' ? 'ds-slider__indicator--secondary' : ''].filter(Boolean).join(' ')}
            style={{ width: `${percent}%` }}
          />
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
      {iconRight && <span className="ds-slider__icon">{iconRight}</span>}
    </div>
  );
}

export default Slider;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Slider value={value} onChange={setValue} ariaLabel="Volumen" />

<Slider
  value={value}
  onChange={setValue}
  ariaLabel="Volumen"
  iconLeft={<Icon name="volume-x" size="sm" />}
  iconRight={<Icon name="volume-2" size="sm" />}
/>

<Slider value={value} onChange={setValue} ariaLabel="Progreso" variant="secondary" />
<Slider value={value} onChange={setValue} ariaLabel="Progreso" disabled />
*/
