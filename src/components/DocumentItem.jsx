/**
 * DocumentItem — Componente atómico
 * CS Design System · v2.0 (antes ListItem v1 — renombrado 28/10/2026 para no
 * confundirlo con List View; en Figma, set "Document Item" de 🟢 File Upload)
 *
 * Fila de fichero dentro de File Upload — icono (o spinner al subir) + nombre
 * editable + botón de quitar, con mensaje de validación debajo en error.
 *
 * `status`: 'uploading' | 'uploaded' | 'error' — único eje real como prop.
 * Hover y Focus son pseudo-clases CSS (Figma: State Initial/Hover/Focus).
 *
 * Geometría = Figma: área del documento con padding 4 y gap 12; icono 24;
 * nombre y X con padding 2 (el hueco del anillo de foco) → fila 36.
 *   · Uploading / Uploaded: divisor inferior de 1 px por dentro de la fila.
 *   · Error: sin divisor; el área del documento lleva borde de error de 1 px
 *     por dentro (radio 4) y debajo el ValidationMessage (gap 8).
 *   · Hover: fondo azul en el área del documento (no en el mensaje).
 *   · Focus: anillo doble 2 + 2 alrededor del nombre o de la X.
 *   · Uploading: spinner (LoadingSpinner small) y nombre en gris, de solo
 *     lectura — se puede enfocar (Figma tiene Focus en Uploading), no editar.
 *
 * Nombre del documento: siempre un <input type="text"> real — el truncado con
 * "…" y el foco salen de los estados nativos.
 *
 * USO:
 *   <DocumentItem status="uploaded" documentName="invoice.pdf" onNameChange={fn} onRemove={fn} />
 *   <DocumentItem status="error" documentName="invoice.pdf" errorMessage="Format not supported" onRemove={fn} />
 */

import React, { useEffect, useId, useRef } from 'react';
import { announce } from './announce';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { LoadingSpinner } from './LoadingSpinner';
import { ValidationMessage } from './ValidationMessage';

const css = `
.ds-document-item {
  display: flex;
  flex-direction: column;
  gap: var(--ds-file-upload-common-stack-gap-generic);
  width: 100%;
  box-sizing: border-box;
}
.ds-document-item:not(.ds-document-item--error) {
  box-shadow: inset 0 calc(-1 * var(--ds-file-upload-document-item-border-width-generic)) 0 var(--ds-file-upload-document-item-border-color-generic);
}

.ds-document-item__document-area {
  display: flex;
  align-items: center;
  gap: var(--ds-file-upload-common-gap-generic);
  width: 100%;
  box-sizing: border-box;
  padding: var(--ds-file-upload-document-item-padding-ver-generic) var(--ds-file-upload-document-item-padding-hor-generic);
}
.ds-document-item__document-area:hover { background: var(--ds-file-upload-common-bg-hover); }
.ds-document-item--error .ds-document-item__document-area {
  box-shadow: inset 0 0 0 var(--ds-file-upload-document-item-border-width-generic) var(--ds-file-upload-document-item-border-color-error);
  border-radius: var(--ds-file-upload-common-border-radius-generic);
}

.ds-document-item__left-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--ds-file-upload-document-item-icon-size);
  height: var(--ds-file-upload-document-item-icon-size);
  color: var(--ds-file-upload-common-icon-fg-generic);
}

.ds-document-item__name {
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-label-md);
  line-height: var(--ds-lineHeight-label-md);
  padding: var(--ds-file-upload-document-item-control-padding);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ds-file-upload-document-item-text-fg-generic);
}
.ds-document-item--uploading .ds-document-item__name { color: var(--ds-file-upload-document-item-text-fg-uploading); }

.ds-document-item__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0;
  padding: var(--ds-file-upload-document-item-control-padding);
  border: none;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
  color: var(--ds-file-upload-common-icon-fg-generic);
}

.ds-document-item__name:focus-visible,
.ds-document-item__close:focus-visible {
  outline: var(--ds-file-upload-document-item-focus-ring-width) solid var(--ds-file-upload-document-item-focus-ring-border-color-outer);
  outline-offset: var(--ds-file-upload-document-item-focus-ring-width);
  box-shadow: 0 0 0 var(--ds-file-upload-document-item-focus-ring-width) var(--ds-file-upload-document-item-focus-ring-border-color-inner);
}

.ds-document-item__validation { margin: 0; }
`;

injectStyles('ds-document-item', css);

export function DocumentItem({
  status = 'uploaded', // 'uploading' | 'uploaded' | 'error'
  documentName = '',
  onNameChange,
  onRemove,
  errorMessage = 'Validation or counter here',
  nameLabel = 'File name',
  removeLabel = (name) => `Remove ${name || 'file'}`,
  statusLabels = {},
  id,
  className,
}) {
  // El cambio de estado se anuncia ("invoice.pdf uploaded" / el error) y el
  // error queda enlazado al campo del nombre. Solo cambios, no el montaje.
  const t = {
    uploaded: (n) => `${n || 'File'} uploaded`,
    error: (n, msg) => `${n || 'File'}: ${msg}`,
    ...statusLabels,
  };
  const errorId = `${useId()}-error`;
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === status) return;
    prevStatus.current = status;
    if (status === 'uploaded') announce(t.uploaded(documentName));
    if (status === 'error') announce(t.error(documentName, errorMessage));
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const uploading = status === 'uploading';
  const classes = [
    'ds-document-item',
    `ds-document-item--${status}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <div className="ds-document-item__document-area">
        <span className="ds-document-item__left-icon">
          {uploading
            ? <LoadingSpinner size="small" label="" />
            : <Icon name="file-text" size="sm" />}
        </span>
        <input
          className="ds-document-item__name"
          type="text"
          value={documentName}
          onChange={(e) => onNameChange?.(e.target.value)}
          readOnly={uploading || !onNameChange}
          aria-label={uploading ? `${nameLabel}, uploading` : nameLabel}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={status === 'error' ? errorId : undefined}
        />
        <button
          type="button"
          className="ds-document-item__close"
          onClick={onRemove}
          aria-label={removeLabel(documentName)}
        >
          <Icon name="x" size="sm" />
        </button>
      </div>
      {/* sin región viva: el cambio de estado ya se anuncia con announce() */}
      <ValidationMessage className="ds-document-item__validation" id={errorId} message={status === 'error' ? errorMessage : ''} live={false} />
    </div>
  );
}

export default DocumentItem;
