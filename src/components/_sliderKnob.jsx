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
 *
 * Sombra de elevación (`--ds-slider-shadow-knob`, Effect Style "Slider/Knob
 * Shadow") en reposo, hover y arrastre; en :focus-visible la sustituye el
 * anillo de foco y en disabled no hay — igual que Figma (29/09).
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Tooltip } from './Tooltip';

const css = `
.ds-slider__knob {
  box-sizing: border-box;
  width: var(--ds-slider-size-knob);
  height: var(--ds-slider-size-knob);
  border-radius: var(--ds-slider-border-radius-knob);
  background: var(--ds-slider-bg-knob);
  border: var(--ds-slider-border-width-knob-generic) solid var(--ds-slider-border-color-knob);
  box-shadow: var(--ds-slider-shadow-knob);
  cursor: grab;
  touch-action: none;
  display: block;
}
.ds-slider__knob:active {
  cursor: grabbing;
}
.ds-slider__knob:focus-visible {
  /* Figma .Knob State=Focus: inner 2 por dentro del knob (borde) + outer 2 por fuera, sin sombra */
  border-width: var(--ds-slider-border-width-knob-focus);
  border-color: var(--ds-slider-border-color-knob-focus-inner);
  outline: var(--ds-slider-border-width-knob-focus) solid var(--ds-slider-border-color-knob-focus-outer);
  outline-offset: 0;
  box-shadow: none;
}
.ds-slider__knob--disabled {
  background: var(--ds-slider-bg-knob-disabled);
  border-color: var(--ds-slider-border-color-knob-disabled);
  box-shadow: none;
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
    ariaLabelledBy,
    ariaValueMin,
    ariaValueMax,
    ariaValueNow,
  },
  ref
) {
  return (
    <Tooltip
      label={valueText}
      describe={false}
      placement="top"
      forceVisible={dragging}
      style={{
        position: 'absolute',
        top: '50%',
        left: `${percent}%`,
        transform: 'translate(-50%, -50%)',
        // Figma .Knob: 8 entre la burbuja y el knob (slider/all/knob/tooltipGap)
        '--ds-tooltip-offset': 'var(--ds-slider-gap-knob-tooltip-generic)',
      }}
    >
      <span
        ref={ref}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuenow={ariaValueNow}
        aria-valuetext={valueText}
        aria-disabled={disabled || undefined}
        className={['ds-slider__knob', disabled ? 'ds-slider__knob--disabled' : ''].filter(Boolean).join(' ')}
        onPointerDown={disabled ? undefined : onPointerDown}
        onKeyDown={disabled ? undefined : onKeyDown}
      />
    </Tooltip>
  );
});

export default SliderKnob;
