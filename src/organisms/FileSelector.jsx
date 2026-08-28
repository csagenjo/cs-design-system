/**
 * FileSelector — Organismo
 * CS Design System · v1.0
 *
 * Wrapper puro: DropZone + N × ListItem en columna. Sin chrome propio (no
 * existe "File Selector" como componente visual distinto en Figma, solo la
 * composición) — mismo criterio que CellActions/ButtonBar/Table. El número
 * de ficheros lo decide `files.length`, no se replican las 6 variantes
 * "1-5 Files" de Figma como enum — eso es responsabilidad de quien consume.
 *
 * USO:
 *   <FileSelector
 *     files={[{ id: '1', name: 'factura.pdf', status: 'uploaded' }]}
 *     onFileNameChange={(id, name) => {}}
 *     onFileRemove={(id) => {}}
 *     onButtonClick={() => {}}
 *   />
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { DropZone } from '../components/DropZone';
import { ListItem } from '../components/ListItem';

const css = `
.ds-file-selector {
  display: flex;
  flex-direction: column;
  gap: var(--ds-file-upload-common-stack-gap-generic);
  width: 100%;
  box-sizing: border-box;
}
`;

injectStyles('ds-file-selector', css);

export function FileSelector({
  files = [],
  onFileNameChange,
  onFileRemove,
  onButtonClick,
  disabled = false,
  id,
  className,
}) {
  const classes = ['ds-file-selector', className || ''].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <DropZone disabled={disabled} onButtonClick={onButtonClick} />
      {files.map((file) => (
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
  );
}

export default FileSelector;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<FileSelector
  files={[
    { id: '1', name: 'factura.pdf', status: 'uploaded' },
    { id: '2', name: 'contrato.pdf', status: 'uploading' },
  ]}
  onFileNameChange={(id, name) => {}}
  onFileRemove={(id) => {}}
  onButtonClick={() => {}}
/>
*/
