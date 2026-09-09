/**
 * SliderKnob — helper interno, NO exportado como átomo público.
 * Compartido por Slider, RangeSlider y SteppedSlider — mismo criterio que
 * `_dialogBase.jsx`/`_inputBase.js`: la pieza real que se repite en Figma
 * (`.Knob`, instancia real de `Tooltip` + círculo) vive en un único sitio.
 *
 * Instancia el átomo `Tooltip` (no reimplementa su burbuja) para el valor —
 * `dragging` fuerza la burbuja visible mientras se arrastra con el ratón,
 * aunque el puntero salga del área del knob (ver `forceVisible` en
 * Tooltip.jsx). El foco por teclado ya la muestra vía `:focus-within` nativo
 * del propio Tooltip, sin necesitar `dragging` para eso.
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Tooltip } from './Tooltip';

const css = `
.ds-slider__knob {
  box-sizing: border-box;
  width: var(--ds-slider-knob-size);
  height: var(--ds-slider-knob-size);
  border-radius: var(--ds-slider-knob-border-radius);
  background: var(--ds-slider-knob-bg);
  border: 1px solid var(--ds-slider-knob-border-color);
  cursor: grab;
  touch-action: none;
  display: block;
}
.ds-slider__knob:active {
  cursor: grabbing;
}
.ds-slider__knob:focus-visible {
  outline: var(--ds-slider-root-border-width-focus) solid var(--ds-slider-knob-focus-outer);
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--ds-slider-knob-focus-inner);
}
.ds-slider__knob--disabled {
  background: var(--ds-slider-knob-bg-disabled);
  border-color: var(--ds-slider-knob-border-color-disabled);
  cursor: not-allowed;
}
`;

injectStyles('ds-slider-knob', css);

export const SliderKnob = React.forwardRef(function SliderKnob(
  {
    percent,
    valueText,
    disabled = false,
    dragging = false,
    onPointerDown,
    onKeyDown,
    ariaLabel,
    ariaValueMin,
    ariaValueMax,
    ariaValueNow,
  },
  ref
) {
  return (
    <Tooltip
      label={valueText}
      placement="top"
      forceVisible={dragging}
      style={{
        position: 'absolute',
        top: '50%',
        left: `${percent}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span
        ref={ref}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuenow={ariaValueNow}
        aria-disabled={disabled || undefined}
        className={['ds-slider__knob', disabled ? 'ds-slider__knob--disabled' : ''].filter(Boolean).join(' ')}
        onPointerDown={disabled ? undefined : onPointerDown}
        onKeyDown={disabled ? undefined : onKeyDown}
      />
    </Tooltip>
  );
});

export default SliderKnob;
