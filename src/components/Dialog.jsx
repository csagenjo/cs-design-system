/**
 * Dialog — Componente atómico
 * CS Design System · v1.1 (27/10/2026: alineado 1:1 con Figma)
 *
 * Modal que informa de una tarea y puede requerir una decisión. Puro contenido
 * visual — NO gestiona portal ni posicionamiento fijo en pantalla, ni el Scrim
 * de fondo (eso es responsabilidad del consumidor, componiendo Dialog + Scrim
 * — mismo criterio de límite de átomo que Snackbar).
 *
 * header: color del header — deriva la variante de Button ("default" para
 * default/secondary/tertiary, "accent" para primary/onPrimary), reutilizando
 * Button.jsx tal cual, sin tokens propios.
 * size: "standard" (header 60px) | "small" (header 44px).
 * width: "popUp" (480 de ancho, alto por contenido hasta la pantalla) |
 *        "fullScreen" (100%/100% del contenedor; Figma lo muestra a 375 × 667).
 *        Esquinas redondeadas y sombra Dialog/DialogShadow en las dos.
 * Back/Close del header = Icon Button Tertiary (ver _dialogBase.jsx).
 *
 * children = "Scrollable Content" (slot libre, scroll interno si excede alto).
 *
 * Botones: Button size="lg", igual que Figma (Size=Large). Desde el 01/10/2026
 * la escala de Button coincide con Figma (label 14/16/19), así que ya no es
 * una aproximación.
 *
 *
 * ACCESIBILIDAD — modal (A11y-1, 21/10/2026, audit §B):
 *   `modal` (default true) = montado es abierto. Vía `_useModal`: el foco entra
 *   al abrir (primer elemento enfocable), Tab queda atrapado dentro, el resto de
 *   la página se vuelve `inert`, el scroll de fondo se bloquea, Escape llama a
 *   `onClose` y al cerrar el foco vuelve al elemento que lo abrió. El nombre del
 *   diálogo es su título (`aria-labelledby` → h2). `modal={false}` solo para
 *   mostrarlo estático (documentación, galería), nunca en una app.
 *
 * USO:
 *   {open && <Dialog header="default" width="popUp" onClose={() => setOpen(false)}>Contenido…</Dialog>}
 *   <Dialog header="primary" size="small" onMainButton={fn} onSecondaryButton={fn} />
 */

import React, { useId, useRef } from 'react';
import { injectStyles } from './_inputBase';
import { useModal } from './_useModal';
import { DialogHeader } from './_dialogBase';
import { Button } from './Button';

const css = `
.ds-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background: var(--ds-dialog-root-bg-generic);
  gap: var(--ds-dialog-root-gap-generic);
  border-radius: var(--ds-dialog-root-border-radius-generic);
  overflow: hidden;
  box-shadow: var(--ds-dialog-shadow); /* Dialog/DialogShadow — 25/08: aplicada a todas las variantes, antes solo PopUp */
}
.ds-dialog--pop-up {
  /* Ancho 480; el alto lo da el contenido, como mucho la pantalla (27/10).
     A11y-5 (1.4.10): a 320 px o con zoom al 400 % se encoge al viewport y el
     contenido hace scroll por dentro, nunca en dos direcciones. */
  width: min(480px, 100%);
  max-height: 100dvh;
  flex-shrink: 0;
}
.ds-dialog--full-screen { width: 100%; height: 100%; }

.ds-dialog__content {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.ds-dialog__control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ds-dialog-root-gap-generic);
  padding: var(--ds-dialog-control-area-padding-generic);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}
`;

injectStyles('ds-dialog', css);

export function Dialog({
  header              = 'default',   // 'default' | 'primary' | 'onPrimary' | 'secondary' | 'tertiary'
  size                = 'standard',  // 'standard' | 'small'
  width               = 'popUp',     // 'popUp' | 'fullScreen'
  title               = 'Dialog Title',
  showArrow           = true,
  onBack,
  crossButton         = true,
  onClose,
  showButtons         = true,
  mainButton          = true,
  mainButtonLabel     = 'Button',
  onMainButton,
  secondaryButton     = true,
  secondaryButtonLabel = 'Button',
  onSecondaryButton,
  children,
  modal               = true,
  backLabel,
  closeLabel,
  id,
  className,
}) {
  const ref = useRef(null);
  const titleId = useId();
  useModal({ open: modal, containerRef: ref, onClose });
  const isAccent  = header === 'primary' || header === 'onPrimary';
  const btnType = isAccent ? 'accent' : 'default';
  const widthClass = width === 'fullScreen' ? 'full-screen' : 'pop-up';

  const classes = [
    'ds-dialog',
    `ds-dialog--${widthClass}`,
    `ds-dialog--${size}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      id={id}
      className={classes}
      role="dialog"
      aria-modal={modal ? 'true' : undefined}
      aria-labelledby={title ? titleId : undefined}
    >
      <DialogHeader
        color={header}
        size={size}
        title={title}
        titleId={titleId}
        backLabel={backLabel}
        closeLabel={closeLabel}
        showArrow={showArrow}
        showClose={crossButton}
        onBack={onBack}
        onClose={onClose}
      />
      <div className="ds-dialog__content">{children}</div>
      {showButtons && (mainButton || secondaryButton) && (
        <div className="ds-dialog__control-area">
          {mainButton && (
            <Button type={btnType} variant="primary" size="lg" fullWidth onClick={onMainButton}>
              {mainButtonLabel}
            </Button>
          )}
          {secondaryButton && (
            <Button type={btnType} variant="secondary" size="lg" fullWidth onClick={onSecondaryButton}>
              {secondaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default Dialog;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Dialog header="default" width="popUp">
  <p>Contenido scrollable del diálogo.</p>
</Dialog>

<Dialog header="primary" size="small" width="fullScreen"
  mainButtonLabel="Aceptar" secondaryButtonLabel="Cancelar"
  onMainButton={() => {}} onSecondaryButton={() => {}} />

<Dialog header="tertiary" crossButton={false} showArrow={false} />
*/
