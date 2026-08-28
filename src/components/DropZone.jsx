/**
 * DropZone — Componente atómico
 * CS Design System · v1.0
 *
 * Área de arrastrar-y-soltar de File Upload — borde discontinuo + texto +
 * botón de selección manual.
 *
 * Hover: el botón se queda visible pero pasa a Disabled (mismo tamaño de
 * caja que Initial, sin encogerse ni desplazar nada) y el texto cambia a
 * "Drag & drop your files here" en negrita, sin el "or" (no tiene sentido
 * ofrecer una alternativa clicable mientras se arrastra un fichero encima).
 * Decisión de Carol tras probar la alternativa (26/08): mantener el hueco
 * del botón siempre reservado, nunca colapsarlo — tocar el `disabled` real
 * de Button.jsx requiere estado en React (CSS no puede cambiar props de un
 * hijo), por eso este átomo sí usa `useState` para el hover, a diferencia
 * del resto de la familia que lo resuelve con pseudo-clases puras.
 *
 * `disabled`: prop de estado real independiente del hover (Drop Zone
 * deshabilitada de verdad, ej. límite de ficheros alcanzado).
 *
 * USO:
 *   <DropZone onButtonClick={fn} />
 *   <DropZone disabled />
 */

import React, { useState } from 'react';
import { injectStyles } from './_inputBase';
import { Button } from './Button';

const css = `
.ds-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ds-file-upload-drop-zone-gap-generic);
  width: 100%;
  box-sizing: border-box;
  padding: var(--ds-file-upload-drop-zone-padding-ver-generic) var(--ds-file-upload-drop-zone-padding-hor-generic);
  border: var(--ds-file-upload-drop-zone-border-width-generic) dashed var(--ds-file-upload-drop-zone-border-color-generic);
  border-radius: var(--ds-file-upload-common-border-radius-generic);
  text-align: center;
}
.ds-drop-zone--hovering {
  border-style: solid;
  background: var(--ds-file-upload-common-bg-hover);
}

.ds-drop-zone__text {
  margin: 0;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-label-md);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-file-upload-drop-zone-text-fg-generic);
}
.ds-drop-zone--disabled .ds-drop-zone__text { color: var(--ds-file-upload-drop-zone-text-fg-disabled); }
.ds-drop-zone--hovering .ds-drop-zone__text { font-weight: var(--ds-font-weight-bold); }
`;

injectStyles('ds-drop-zone', css);

export function DropZone({
  disabled = false,
  buttonLabel = 'Button',
  onButtonClick,
  id,
  className,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const hovering = isHovering && !disabled;

  const classes = [
    'ds-drop-zone',
    disabled ? 'ds-drop-zone--disabled' : '',
    hovering ? 'ds-drop-zone--hovering' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div
      id={id}
      className={classes}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <p className="ds-drop-zone__text">
        {hovering ? 'Drag & drop your files here' : 'Drag & drop your files here or'}
      </p>
      <Button variant="default" outline size="sm" disabled={disabled || hovering} onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </div>
  );
}

export default DropZone;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<DropZone onButtonClick={() => {}} />

<DropZone disabled />
*/
