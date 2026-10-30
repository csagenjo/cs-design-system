/**
 * FileUpload — Organismo
 * CS Design System · v2.0
 *
 * Compone LabelDescription + FileSelector (DropZone + N × DocumentItem).
 * 28/10/2026, alineado 1:1 con Figma (set "File Upload", Layout × State +
 * booleana "Show Label + Desc" → `showLabel`). Gap 24 entre bloques
 * (`fileUpload/root/gap/generic`).
 *
 * `layout="wide"`    — Label + Description (alineado a la derecha, 235 de
 *                       ancho) y el selector lado a lado.
 * `layout="stacked"` — una columna: Label + Description, Drop Zone y los
 *                       ficheros debajo.
 * `layout="compact"` — máximo 1 fichero y sin Drop Zone: Label + Description,
 *                       el botón (Default Secondary Small, sin iconos) y, si
 *                       hay fichero, su DocumentItem — los tres a 24.
 *
 * USO:
 *   <FileUpload layout="wide" label="Documents" description="PDF or JPG"
 *     files={[...]} onFileNameChange={fn} onFileRemove={fn} onButtonClick={fn} />
 *
 *   <FileUpload layout="compact" label="Invoice" description="Upload the PDF"
 *     files={file ? [file] : []} onButtonClick={fn} onFileRemove={fn} />
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { LabelDescription } from '../components/LabelDescription';
import { FileSelector } from './FileSelector';
import { DocumentItem } from '../components/DocumentItem';
import { Button } from '../components/Button';

const css = `
.ds-file-upload {
  display: flex;
  gap: var(--ds-file-upload-root-gap-generic);
  box-sizing: border-box;
}
.ds-file-upload--wide {
  flex-direction: row;
  align-items: flex-start;
}
.ds-file-upload--compact,
.ds-file-upload--stacked {
  flex-direction: column;
  align-items: stretch;
}
.ds-file-upload--compact { align-items: flex-start; }
.ds-file-upload--compact .ds-document-item { width: 100%; }

.ds-file-upload__label {
  flex-shrink: 0;
}
.ds-file-upload--wide .ds-file-upload__label { width: var(--ds-file-upload-label-width-wide); }

.ds-file-upload__selector {
  flex: 1 0 0;
  min-width: 0;
}
`;

injectStyles('ds-file-upload', css);

export function FileUpload({
  layout = 'wide', // 'wide' | 'compact' | 'stacked'
  label = 'Label',
  description = 'This is a short description of the input',
  files = [],
  onFileNameChange,
  onFileRemove,
  onButtonClick,
  onFilesDrop,
  buttonLabel = 'Button',
  instruction,
  hoverInstruction,
  showLabel = true,
  removeLabel,
  nameLabel,
  disabled = false,
  id,
  className,
}) {
  // A11y-3: la etiqueta y la descripción describen el botón de subir ficheros
  // (antes no estaban enlazadas a ningún control).
  const baseId = React.useId();
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  // Sin Label + Description visible, el botón no se describe con ids ausentes:
  // el consumidor nombra el botón con buttonLabel.
  const describedBy = showLabel ? `${labelId} ${descriptionId}` : undefined;
  const classes = [
    'ds-file-upload',
    `ds-file-upload--${layout}`,
    className || '',
  ].filter(Boolean).join(' ');

  const align = layout === 'wide' ? 'right' : 'left';

  return (
    <div id={id} className={classes}>
      {showLabel && (
        <div className="ds-file-upload__label">
          <LabelDescription align={align} label={label} description={description} labelId={labelId} descriptionId={descriptionId} />
        </div>
      )}

      {layout === 'compact' ? (
        <>
          <Button type="default" variant="secondary" size="sm" disabled={disabled} onClick={onButtonClick} aria-describedby={describedBy}>
            {buttonLabel}
          </Button>
          {files.slice(0, 1).map((file) => (
            <DocumentItem
              key={file.id}
              status={file.status}
              documentName={file.name}
              errorMessage={file.errorMessage}
              onNameChange={(name) => onFileNameChange?.(file.id, name)}
              onRemove={() => onFileRemove?.(file.id)}
              removeLabel={removeLabel}
              nameLabel={nameLabel}
            />
          ))}
        </>
      ) : (
        <div className="ds-file-upload__selector">
          <FileSelector
            files={files}
            disabled={disabled}
            onFileNameChange={onFileNameChange}
            onFileRemove={onFileRemove}
            onButtonClick={onButtonClick}
            onFilesDrop={onFilesDrop}
            buttonLabel={buttonLabel}
            instruction={instruction}
            hoverInstruction={hoverInstruction}
            describedBy={describedBy}
            removeLabel={removeLabel}
            nameLabel={nameLabel}
          />
        </div>
      )}
    </div>
  );
}

export default FileUpload;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<FileUpload layout="wide" label="Documents" description="PDF or JPG"
  files={[{ id: '1', name: 'factura.pdf', status: 'uploaded' }]}
  onFileNameChange={(id, name) => {}} onFileRemove={(id) => {}} onButtonClick={() => {}} />

<FileUpload layout="stacked" label="Documentos" description="Formatos: PDF, JPG"
  files={[
    { id: '1', name: 'factura.pdf', status: 'uploaded' },
    { id: '2', name: 'contrato.pdf', status: 'error', errorMessage: 'Formato no soportado' },
  ]} />

<FileUpload layout="compact" label="Factura" description="Sube el PDF"
  files={[{ id: '1', name: 'factura.pdf', status: 'uploaded' }]}
  onButtonClick={() => {}} onFileRemove={(id) => {}} />
*/
