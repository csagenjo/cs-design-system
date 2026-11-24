/**
 * BottomSheet — Átomo (contenedor)
 * CS Design System · v1.0 (24/11/2026, alineado con Figma `Bottom Sheet`)
 *
 * Panel modal que sube desde el borde inferior de un móvil. Solo para
 * móvil: en tablet y escritorio se usa Dialog (o PopoverSheet si va anclado
 * a un botón). Sin tirador: no hay gesto de arrastre; se cierra con la X,
 * pulsando el Scrim o con Escape.
 *
 * Figma → código:
 *   Title · Description · Show Description → `title` · `description`
 *   Close (Icon Button Default Tertiary Medium, x) → botón con `closeLabel`
 *   Slot Content                          → `children` (ListView, un estado vacío, un formulario…)
 *   Slot Footer + Show Footer             → `footer` (normalmente una ButtonBar)
 *
 * Medidas: cabecera 64 (6 + 52 + 6), radio 12 solo arriba, divisores
 * borderColor/subtle bajo la cabecera y sobre el pie, pie con padding 16.
 * Alto = el del contenido hasta `--ds-bottom-sheet-max-height`; a partir de
 * ahí el contenido hace scroll por dentro (cabecera y pie fijos). Rellena
 * por abajo la zona segura del móvil.
 *
 * Accesibilidad: role="dialog" + aria-modal, nombre = título y descripción
 * = aria-describedby. `modal` (por defecto) usa `useModal`, como Dialog:
 * foco dentro y atrapado, Escape cierra, página `inert`, scroll de fondo
 * bloqueado y el foco vuelve a donde estaba. `modal={false}` pinta solo el
 * panel, sin capa ni Scrim (galería, composiciones).
 *
 * USO:
 *   {open && (
 *     <BottomSheet title="Sort by" onClose={() => setOpen(false)}
 *       footer={<ButtonBar variant="simple" primaryLabel="Apply" onPrimary={apply} />}>
 *       <ListView title="Name" … />
 *     </BottomSheet>
 *   )}
 */
import React, { useId, useRef } from 'react';
import { injectStyles } from './_inputBase';
import { useModal } from './_useModal';
import { IconButton } from './IconButton';
import { Scrim } from './Scrim';

const css = `
.ds-bottom-sheet-layer {
  position:        fixed;
  inset:           0;
  z-index:         40;
  display:         flex;
  flex-direction:  column;
  justify-content: flex-end;
}
.ds-bottom-sheet-layer > .ds-scrim {
  position: absolute;
  inset:    0;
}
.ds-bottom-sheet {
  position:       relative;
  display:        flex;
  flex-direction: column;
  box-sizing:     border-box;
  width:          100%;
  max-height:     var(--ds-bottom-sheet-max-height);
  padding-bottom: env(safe-area-inset-bottom);
  background:     var(--ds-bottom-sheet-bg-generic);
  border-radius:  var(--ds-bottom-sheet-border-radius-top) var(--ds-bottom-sheet-border-radius-top) 0 0;
  box-shadow:     var(--ds-bottom-sheet-shadow);
  overflow:       hidden;
}
@media (prefers-reduced-motion: no-preference) {
  .ds-bottom-sheet-layer .ds-bottom-sheet { animation: ds-bottom-sheet-in 0.25s ease-out; }
}
@keyframes ds-bottom-sheet-in {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
.ds-bottom-sheet__header {
  display:       flex;
  align-items:   center;
  flex-shrink:   0;
  gap:           var(--ds-bottom-sheet-gap-header);
  padding:       var(--ds-bottom-sheet-padding-ver-header) var(--ds-bottom-sheet-padding-right-header) var(--ds-bottom-sheet-padding-ver-header) var(--ds-bottom-sheet-padding-left-header);
  box-shadow:    inset 0 calc(-1 * var(--ds-bottom-sheet-border-width-divider)) 0 var(--ds-bottom-sheet-border-color-divider);
}
.ds-bottom-sheet__text { flex: 1 1 auto; min-width: 0; }
.ds-bottom-sheet__title {
  margin:      0;
  font-weight: var(--ds-font-weight-bold);
  font-size:   var(--ds-fontSize-title-md);
  line-height: var(--ds-lineHeight-title-md);
  color:       var(--ds-bottom-sheet-fg-title);
}
.ds-bottom-sheet__description {
  margin:      0;
  font-weight: var(--ds-font-weight-regular);
  font-size:   var(--ds-fontSize-body-2xs);
  line-height: var(--ds-lineHeight-body-2xs);
  color:       var(--ds-bottom-sheet-fg-description);
}
.ds-bottom-sheet__content {
  flex:        1 1 auto;
  min-height:  0;
  overflow-y:  auto;
  padding:     var(--ds-bottom-sheet-padding-ver-content) 0;
}
.ds-bottom-sheet__footer {
  flex-shrink: 0;
  padding:     var(--ds-bottom-sheet-padding-footer);
  box-shadow:  inset 0 var(--ds-bottom-sheet-border-width-divider) 0 var(--ds-bottom-sheet-border-color-divider);
}
`;

injectStyles('ds-bottom-sheet', css);

export function BottomSheet({
  title,                  // obligatorio: nombre del diálogo
  description,
  onClose,
  closeLabel = 'Close',
  children,               // slot Content
  footer,                 // slot Footer (ButtonBar)
  modal = true,           // false: solo el panel, sin capa ni Scrim
  id,
  className,
}) {
  const layerRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  useModal({ open: modal, containerRef: layerRef, onClose });

  const panel = (
    <div
      id={id}
      className={['ds-bottom-sheet', className || ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal={modal ? 'true' : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <div className="ds-bottom-sheet__header">
        <div className="ds-bottom-sheet__text">
          <h2 id={titleId} className="ds-bottom-sheet__title">{title}</h2>
          {description && <p id={descId} className="ds-bottom-sheet__description">{description}</p>}
        </div>
        {onClose && (
          <IconButton type="default" variant="tertiary" size="medium" icon="x" ariaLabel={closeLabel} onClick={onClose} />
        )}
      </div>
      <div className="ds-bottom-sheet__content">{children}</div>
      {footer && <div className="ds-bottom-sheet__footer">{footer}</div>}
    </div>
  );

  if (!modal) return <div ref={layerRef}>{panel}</div>;

  return (
    <div ref={layerRef} className="ds-bottom-sheet-layer">
      <Scrim onClick={onClose} />
      {panel}
    </div>
  );
}

BottomSheet.displayName = 'BottomSheet';
export default BottomSheet;
