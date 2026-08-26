/**
 * Dialog — Componente atómico
 * CS Design System · v1.0
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
 * width: "popUp" (480px fijo) | "fullScreen" (100%/100% del contenedor — el
 *        consumidor decide el tamaño real del overlay). Esquinas redondeadas
 *        y sombra Dialog/DialogShadow en las dos — actualizado 25/08, antes
 *        fullScreen no las llevaba; Carol las añadió a las 20 variantes en Figma.
 *
 * children = "Scrollable Content" (slot libre, scroll interno si excede alto).
 *
 * NOTA (24/08/2026): Dialog/DialogSimple Expanded piden fontSize/label/lg=19px
 * en sus botones grandes, pero el size="lg" actual de Button.jsx solo llega a
 * 16px (fontSize/label/md) — desajuste de un escalón preexistente en Button,
 * no de Dialog. Se usa size="lg" como aproximación más cercana sin tocar
 * Button.jsx (afecta a todos sus consumidores ya construidos). Pendiente
 * decisión: ¿añadir un escalón a Button, o token propio en Dialog?
 *
 * USO:
 *   <Dialog header="default" width="popUp">Contenido…</Dialog>
 *   <Dialog header="primary" size="small" onMainButton={fn} onSecondaryButton={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
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
  box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.24), 0px 0px 24px 0px rgba(0,0,0,0.12); /* Dialog/DialogShadow — 25/08: aplicada a todas las variantes, antes solo PopUp */
}
.ds-dialog--pop-up {
  width: 480px;
  flex-shrink: 0;
}
.ds-dialog--pop-up.ds-dialog--standard { height: 616px; }
.ds-dialog--pop-up.ds-dialog--small    { height: 628px; }
.ds-dialog--full-screen { width: 100%; height: 100%; }

.ds-dialog__content {
  flex: 1 0 0;
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
  id,
  className,
}) {
  const isAccent  = header === 'primary' || header === 'onPrimary';
  const btnVariant = isAccent ? 'accent' : 'default';
  const widthClass = width === 'fullScreen' ? 'full-screen' : 'pop-up';

  const classes = [
    'ds-dialog',
    `ds-dialog--${widthClass}`,
    `ds-dialog--${size}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} role="dialog" aria-modal="true" aria-label={title}>
      <DialogHeader
        color={header}
        size={size}
        title={title}
        showArrow={showArrow}
        showClose={crossButton}
        onBack={onBack}
        onClose={onClose}
      />
      <div className="ds-dialog__content">{children}</div>
      {showButtons && (mainButton || secondaryButton) && (
        <div className="ds-dialog__control-area">
          {mainButton && (
            <Button variant={btnVariant} size="lg" fullWidth onClick={onMainButton}>
              {mainButtonLabel}
            </Button>
          )}
          {secondaryButton && (
            <Button variant={btnVariant} outline size="lg" fullWidth onClick={onSecondaryButton}>
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
