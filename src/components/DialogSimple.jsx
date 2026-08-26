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
 * variant="expanded"  — 480px, min-height 680px, mismo Dialog/DialogShadow que
 *                       "default" pero sin borde (añadida 25/08, antes sin sombra
 *                       — invisible sobre fondo blanco sin Scrim detrás), botones lg.
 *
 * Border 0.5px de "default": tenía 2 strokes en gradiente sin token (restos de
 * edición) — limpiado en Figma 24/08 a un único stroke sólido enlazado a
 * `borderColor/subtle` (mismo hairline que Divider/Cell), reflejado aquí en
 * `--ds-dialog-simple-border-color-generic`.
 *
 * padding/gap/borderRadius: renombrados 26/08 de `dialog/all/simple/*` a
 * `dialog/all/root/*` en Figma — no eran exclusivos de DialogSimple, Dialog y
 * ErrorAndEmptyState ya los consumían con el nombre "simple" por error. De
 * paso se sincronizó `--ds-dialog-root-gap-generic` (existía en Figma sin
 * sincronizar) para dejar de usar el token de padding como gap.
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
  border-radius: var(--ds-dialog-root-border-radius-generic);
  gap: var(--ds-dialog-root-gap-generic);
}
.ds-dialog-simple--default {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  padding: var(--ds-dialog-root-padding-ver-generic) var(--ds-dialog-root-padding-hor-generic);
  border: 0.5px solid var(--ds-dialog-simple-border-color-generic);
  box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.24), 0px 0px 24px 0px rgba(0,0,0,0.12); /* Dialog/DialogShadow — mismo valor que Dialog PopUp */
}
.ds-dialog-simple--expanded {
  width: 480px;
  min-height: 680px;
  flex-shrink: 0;
  box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.24), 0px 0px 24px 0px rgba(0,0,0,0.12); /* Dialog/DialogShadow — añadida 25/08, antes Expanded no llevaba sombra; sigue sin borde */
}

.ds-dialog-simple__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ds-dialog-simple-content-gap-generic);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: var(--ds-dialog-root-padding-ver-generic) var(--ds-dialog-root-padding-hor-generic);
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
  gap: var(--ds-dialog-simple-cta-gap-generic);
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
