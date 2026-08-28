/**
 * FileUpload — Organismo
 * CS Design System · v1.0
 *
 * Compone LabelDescription + FileSelector. 3 layouts:
 *
 * `layout="wide"`    — LabelDescription y FileSelector lado a lado
 *                       (horizontal), como en el Figma original.
 * `layout="stacked"` — todo en una sola columna: LabelDescription arriba,
 *                       Drop Zone real + ficheros apilados debajo. Variante
 *                       nueva (26/08), no existía en Sistema Origen — Carol
 *                       la pidió porque "Wide" no cubría el caso de columna
 *                       única con Drop Zone visible.
 * `layout="compact"` — máximo 1 fichero. No muestra el Drop Zone real: en su
 *                       lugar, un botón (con chevron a cada lado, tal cual
 *                       en Figma — no se ha simplificado, aunque Carol tiene
 *                       dudas sobre si sobra una vez subido el fichero. NO
 *                       tocar ese botón sin que ella lo decida). Si hay un
 *                       fichero, se añade su ListItem debajo del botón.
 *
 * USO:
 *   <FileUpload layout="wide" label="Documentos" description="PDF, JPG"
 *     files={[...]} onFileNameChange={fn} onFileRemove={fn} onButtonClick={fn} />
 *
 *   <FileUpload layout="compact" label="Factura" description="Sube el PDF"
 *     files={file ? [file] : []} onButtonClick={fn} onFileRemove={fn} />
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { LabelDescription } from '../components/LabelDescription';
import { FileSelector } from './FileSelector';
import { ListItem } from '../components/ListItem';
import { Button } from '../components/Button';

const css = `
.ds-file-upload {
  display: flex;
  gap: 24px;
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

.ds-file-upload__label {
  flex-shrink: 0;
}
.ds-file-upload--wide .ds-file-upload__label { width: 235px; }

.ds-file-upload__selector {
  flex: 1 0 0;
  min-width: 0;
}

.ds-file-upload__compact-files {
  display: flex;
  flex-direction: column;
  gap: var(--ds-file-upload-common-stack-gap-generic);
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
  disabled = false,
  id,
  className,
}) {
  const classes = [
    'ds-file-upload',
    `ds-file-upload--${layout}`,
    className || '',
  ].filter(Boolean).join(' ');

  const align = layout === 'wide' ? 'right' : 'left';

  return (
    <div id={id} className={classes}>
      <div className="ds-file-upload__label">
        <LabelDescription align={align} label={label} description={description} />
      </div>

      {layout === 'compact' ? (
        <div className="ds-file-upload__compact-files">
          <Button variant="default" outline size="sm" iconLeft="ChevronLeft" iconRight="ChevronRight" disabled={disabled} onClick={onButtonClick}>
            Button
          </Button>
          {files.slice(0, 1).map((file) => (
            <ListItem
              key={file.id}
              status={file.status}
              documentName={file.name}
              errorMessage={file.errorMessage}
              onNameChange={(name) => onFileNameChange?.(file.id, name)}
              onRemove={() => onFileRemove?.(file.id)}
            />
          ))}
        </div>
      ) : (
        <div className="ds-file-upload__selector">
          <FileSelector
            files={files}
            disabled={disabled}
            onFileNameChange={onFileNameChange}
            onFileRemove={onFileRemove}
            onButtonClick={onButtonClick}
          />
        </div>
      )}
    </div>
  );
}

export default FileUpload;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<FileUpload layout="wide" label="Documentos" description="Formatos: PDF, JPG"
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
