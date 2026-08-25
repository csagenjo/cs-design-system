/**
 * DialogSimple — Componente atómico
 * CS Design System · v1.0
 *
 * Diálogo compacto de pregunta/confirmación — header Default fijo (44px,
 * arrow + title + close), mensaje de cuerpo, hasta 2 botones apilados.
 *
 * variant="default"  — tarjeta compacta 280px, borde sutil + Dialog/DialogShadow
 *                       (mismos valores que el PopUp de Dialog, no una sombra
 *                       propia — verificado 24/08 contra Figma en vivo), botones sm.
 * variant="expanded"  — 480px, min-height 680px, botones lg.
 *
 * Border 0.5px de "default": tenía 2 strokes en gradiente sin token (restos de
 * edición) — limpiado en Figma 24/08 a un único stroke sólido enlazado a
 * `borderColor/subtle` (mismo hairline que Divider/Cell), reflejado aquí en
 * `--ds-dialog-simple-border-color-generic`.
 *
 * USO:
 *   <DialogSimple message="¿Seguro que quieres continuar?" />
 *   <DialogSimple variant="expanded" title="Confirmación" onPrimaryButton={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { DialogHeader } from './_dialogBase';
import { Button } from './Button';

const css = `
.ds-dialog-simple {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  background: var(--ds-dialog-root-bg-generic);
  border-radius: var(--ds-dialog-simple-border-radius-generic);
  gap: var(--ds-dialog-simple-padding-ver-generic);
}
.ds-dialog-simple--default {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  padding: var(--ds-dialog-simple-padding-ver-generic) var(--ds-dialog-simple-padding-hor-generic);
  border: 0.5px solid var(--ds-dialog-simple-border-color-generic);
  box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.24), 0px 0px 24px 0px rgba(0,0,0,0.12); /* Dialog/DialogShadow — mismo valor que Dialog PopUp */
}
.ds-dialog-simple--expanded {
  width: 480px;
  min-height: 680px;
  flex-shrink: 0;
}

.ds-dialog-simple__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ds-dialog-simple-content-gap-generic);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: var(--ds-dialog-simple-padding-ver-generic) var(--ds-dialog-simple-padding-hor-generic);
}
.ds-dialog-simple--expanded .ds-dialog-simple__content { flex: 1 0 0; }

.ds-dialog-simple__message {
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-dialog-body-text-fg-generic);
}

.ds-dialog-simple__cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}
`;

injectStyles('ds-dialog-simple', css);

export function DialogSimple({
  variant              = 'default',  // 'default' | 'expanded'
  title                = 'Dialog Title',
  message              = 'Dialog question or statement',
  onBack,
  onClose,
  showButtonBar        = true,
  primaryButton        = true,
  primaryButtonLabel   = 'Button',
  onPrimaryButton,
  secondaryButton      = true,
  secondaryButtonLabel = 'Button',
  onSecondaryButton,
  id,
  className,
}) {
  const isExpanded = variant === 'expanded';
  const btnSize = isExpanded ? 'lg' : 'md'; /* 'md' = fontSize/label/sm 14px, el tamaño real que pide "default" — ver nota Dialog.jsx */

  const classes = [
    'ds-dialog-simple',
    `ds-dialog-simple--${isExpanded ? 'expanded' : 'default'}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} role="dialog" aria-modal="true" aria-label={title}>
      <DialogHeader
        color="default"
        size="small"
        title={title}
        showArrow
        showClose
        onBack={onBack}
        onClose={onClose}
      />
      <div className="ds-dialog-simple__content">
        <p className="ds-dialog-simple__message">{message}</p>
      </div>
      {showButtonBar && (primaryButton || secondaryButton) && (
        <div className="ds-dialog-simple__cta">
          {primaryButton && (
            <Button variant="default" size={btnSize} fullWidth onClick={onPrimaryButton}>
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButton && (
            <Button variant="default" outline size={btnSize} fullWidth onClick={onSecondaryButton}>
              {secondaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default DialogSimple;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<DialogSimple message="¿Seguro que quieres eliminar este elemento?" />

<DialogSimple variant="expanded" title="Confirmar operación"
  message="Esta acción no se puede deshacer."
  primaryButtonLabel="Confirmar" secondaryButtonLabel="Cancelar"
  onPrimaryButton={() => {}} onSecondaryButton={() => {}} />
*/
