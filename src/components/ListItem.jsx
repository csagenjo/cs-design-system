/**
 * ListItem — Componente atómico
 * CS Design System · v1.0
 *
 * Fila de fichero dentro de File Upload — icono + nombre (editable) + botón
 * de cierre, con mensaje de validación bajo la fila en status="error".
 *
 * `status`: 'uploading' | 'uploaded' | 'error' — único eje real como prop.
 * Focus/Hover se resuelven vía pseudo-clases CSS nativas sobre el propio
 * <input> (mismo criterio que Checkbox/ListView) — no hay prop `state`.
 *
 * Nombre del documento: siempre un <input type="text"> real (no un <p>),
 * incluso en status="uploading" (deshabilitado ahí) — así el doble
 * focus-ring y el truncado con "…" salen gratis de los estados nativos del
 * navegador, sin replicar variantes de Figma en JS.
 *
 * Mensaje de error: mismo patrón que InputText.jsx (icono AlertCircle +
 * texto), reutilizando los tokens de validación de Input — decisión de
 * Carol: "tratar File Upload como un input" para el error.
 *
 * USO:
 *   <ListItem status="uploaded" documentName="factura.pdf" onNameChange={fn} onRemove={fn} />
 *   <ListItem status="error" documentName="factura.pdf" errorMessage="Formato no soportado" onRemove={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { AlertCircle } from 'lucide-react';

const css = `
.ds-list-item {
  display: flex;
  flex-direction: column;
  gap: var(--ds-file-upload-common-stack-gap-generic);
  width: 100%;
  box-sizing: border-box;
  border-bottom: var(--ds-file-upload-list-item-border-width-generic) solid var(--ds-file-upload-list-item-border-color-generic);
}
.ds-list-item:hover { background: var(--ds-file-upload-common-bg-hover); }

.ds-list-item__document-area {
  display: flex;
  align-items: center;
  gap: var(--ds-file-upload-common-gap-generic);
  width: 100%;
  box-sizing: border-box;
  padding: var(--ds-file-upload-list-item-padding-ver-generic) var(--ds-file-upload-list-item-padding-hor-generic);
}
.ds-list-item--error .ds-list-item__document-area {
  border: var(--ds-file-upload-drop-zone-border-width-generic) solid var(--ds-file-upload-list-item-border-color-error);
  border-radius: var(--ds-file-upload-common-border-radius-generic);
}

.ds-list-item__left-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--ds-file-upload-common-icon-fg-generic);
}
.ds-list-item__spinner { animation: ds-list-item-spin 1s linear infinite; }
@keyframes ds-list-item-spin { to { transform: rotate(360deg); } }

.ds-list-item__name {
  flex: 1 0 0;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-label-md);
  line-height: var(--ds-lineHeight-xs);
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ds-file-upload-list-item-text-fg-generic);
}
.ds-list-item--uploading .ds-list-item__name { color: var(--ds-file-upload-list-item-text-fg-uploading); }
.ds-list-item__name:focus-visible {
  outline: 2px solid var(--ds-file-upload-list-item-focus-ring-border-color-outer);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--ds-file-upload-list-item-focus-ring-border-color-inner);
  border-radius: var(--ds-file-upload-common-border-radius-generic);
}

.ds-list-item__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--ds-file-upload-common-icon-fg-generic);
}
.ds-list-item__close:focus-visible {
  outline: 2px solid var(--ds-file-upload-list-item-focus-ring-border-color-outer);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--ds-file-upload-list-item-focus-ring-border-color-inner);
  border-radius: var(--ds-file-upload-common-border-radius-generic);
}

.ds-list-item__validation {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin: 0;
  padding: 0 var(--ds-file-upload-list-item-padding-hor-generic);
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-input-validation-fg-text);
}
.ds-list-item__validation-icon {
  color: var(--ds-input-fg-error);
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
}
`;

injectStyles('ds-list-item', css);

export function ListItem({
  status = 'uploaded', // 'uploading' | 'uploaded' | 'error'
  documentName = '',
  onNameChange,
  onRemove,
  errorMessage = 'Validation or counter here',
  id,
  className,
}) {
  const classes = [
    'ds-list-item',
    `ds-list-item--${status}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <div className="ds-list-item__document-area">
        <span className="ds-list-item__left-icon">
          {status === 'uploading' ? (
            <span className="ds-list-item__spinner"><Icon name="loader" size="sm" /></span>
          ) : (
            <Icon name="file-text" size="sm" />
          )}
        </span>
        <input
          className="ds-list-item__name"
          type="text"
          value={documentName}
          onChange={(e) => onNameChange?.(e.target.value)}
          disabled={status === 'uploading'}
          aria-label="Nombre del documento"
        />
        <button
          type="button"
          className="ds-list-item__close"
          onClick={onRemove}
          aria-label="Eliminar fichero"
        >
          <Icon name="x" size="sm" />
        </button>
      </div>
      {status === 'error' && (
        <p className="ds-list-item__validation">
          <span className="ds-list-item__validation-icon">
            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default ListItem;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<ListItem status="uploading" documentName="factura.pdf" onRemove={() => {}} />

<ListItem status="uploaded" documentName="factura.pdf"
  onNameChange={(v) => console.log(v)} onRemove={() => {}} />

<ListItem status="error" documentName="factura.pdf"
  errorMessage="El archivo supera el tamaño máximo" onRemove={() => {}} />
*/
