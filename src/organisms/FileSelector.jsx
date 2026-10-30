/**
 * FileSelector — Organismo
 * CS Design System · v1.0
 *
 * Wrapper puro: DropZone + N × DocumentItem en columna. Sin chrome propio (no
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

import React, { useEffect, useRef } from 'react';
import { announce } from '../components/announce';
import { injectStyles } from '../components/_inputBase';
import { DropZone } from '../components/DropZone';
import { DocumentItem } from '../components/DocumentItem';

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
  onFilesDrop,
  buttonLabel,        // texto del botón de la DropZone (antes no llegaba: siempre "Button")
  instruction,        // textos de la DropZone (Figma: Instruction / Hover Instruction)
  hoverInstruction,
  describedBy,
  removeLabel,
  nameLabel,
  addedLabel = (name) => `${name} added`,
  removedLabel = (name) => `${name} removed`,
  disabled = false,
  id,
  className,
}) {
  const classes = ['ds-file-selector', className || ''].filter(Boolean).join(' ');

  // A11y-4: añadir y quitar ficheros se anuncia, y al quitar uno el foco no
  // se pierde: pasa al botón de quitar del siguiente (o del anterior) o, si no
  // quedan, al botón de la DropZone.
  const rootRef = useRef(null);
  const prevFiles = useRef(files);
  const focusAfterRemove = useRef(null);
  useEffect(() => {
    const before = prevFiles.current;
    prevFiles.current = files;
    if (before === files) return;
    const nowIds = new Set(files.map((f) => f.id));
    const beforeIds = new Set(before.map((f) => f.id));
    files.filter((f) => !beforeIds.has(f.id)).forEach((f) => announce(addedLabel(f.name)));
    before.filter((f) => !nowIds.has(f.id)).forEach((f) => announce(removedLabel(f.name)));
    if (focusAfterRemove.current != null) {
      const closes = rootRef.current?.querySelectorAll('.ds-document-item__close') || [];
      const target = closes[Math.min(focusAfterRemove.current, closes.length - 1)]
        || rootRef.current?.querySelector('.ds-drop-zone button');
      target?.focus();
      focusAfterRemove.current = null;
    }
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id={id} className={classes} ref={rootRef}>
      <DropZone disabled={disabled} onButtonClick={onButtonClick} onFilesDrop={onFilesDrop} buttonLabel={buttonLabel} instruction={instruction} hoverInstruction={hoverInstruction} describedBy={describedBy} />
      {files.map((file, index) => (
        <DocumentItem
          key={file.id}
          status={file.status}
          documentName={file.name}
          errorMessage={file.errorMessage}
          onNameChange={(name) => onFileNameChange?.(file.id, name)}
          onRemove={() => { focusAfterRemove.current = index; onFileRemove?.(file.id); }}
          removeLabel={removeLabel}
          nameLabel={nameLabel}
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
