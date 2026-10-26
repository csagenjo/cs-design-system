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
 *
 * ACCESIBILIDAD — modal (A11y-1, 21/10/2026, audit §B):
 *   `modal` (default true) = montado es abierto. Vía `_useModal`: el foco entra
 *   al abrir (primer elemento enfocable), Tab queda atrapado dentro, el resto de
 *   la página se vuelve `inert`, el scroll de fondo se bloquea, Escape llama a
 *   `onClose` y al cerrar el foco vuelve al elemento que lo abrió. El nombre del
 *   diálogo es su título (`aria-labelledby` → h2). `modal={false}` solo para
 *   mostrarlo estático (documentación, galería), nunca en una app.
 *   Es una confirmación: role="alertdialog", con el mensaje como descripción
 *   (`aria-describedby`) — el lector lee título y pregunta al abrir.
 *
 * USO:
 *   {open && <DialogSimple message="¿Seguro que quieres continuar?" onClose={close} />}
 *   <DialogSimple variant="expanded" title="Confirmación" onPrimaryButton={fn} />
 */

import React, { useId, useRef } from 'react';
import { injectStyles } from './_inputBase';
import { useModal } from './_useModal';
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
  max-width: 100%;   /* A11y-5 (1.4.10) */
  flex-shrink: 0;
  padding: var(--ds-dialog-root-padding-ver-generic) var(--ds-dialog-root-padding-hor-generic);
  border: 0.5px solid var(--ds-dialog-simple-border-color-generic);
  box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.24), 0px 0px 24px 0px rgba(0,0,0,0.12); /* Dialog/DialogShadow — mismo valor que Dialog PopUp */
}
.ds-dialog-simple--expanded {
  /* A11y-5 (1.4.10): cabe en 320 px / zoom 400 %; si no hay alto, hace scroll por dentro */
  width: min(480px, 100%);
  min-height: min(680px, 100dvh);
  max-height: 100dvh;
  overflow-y: auto;
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
  line-height: var(--ds-lineHeight-body-sm);
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
  modal                = true,
  backLabel,
  closeLabel,
  id,
  className,
}) {
  const ref = useRef(null);
  const titleId = useId();
  const messageId = useId();
  useModal({ open: modal, containerRef: ref, onClose });
  const isExpanded = variant === 'expanded';
  const btnSize = isExpanded ? 'lg' : 'sm'; /* igual que Figma: Default → Button Small, Expanded → Large */

  const classes = [
    'ds-dialog-simple',
    `ds-dialog-simple--${isExpanded ? 'expanded' : 'default'}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      id={id}
      className={classes}
      role="alertdialog"
      aria-modal={modal ? 'true' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={messageId}
    >
      <DialogHeader
        color="default"
        size="small"
        title={title}
        titleId={titleId}
        backLabel={backLabel}
        closeLabel={closeLabel}
        showArrow
        showClose
        onBack={onBack}
        onClose={onClose}
      />
      <div className="ds-dialog-simple__content">
        <p id={messageId} className="ds-dialog-simple__message">{message}</p>
      </div>
      {showButtonBar && (primaryButton || secondaryButton) && (
        <div className="ds-dialog-simple__cta">
          {primaryButton && (
            <Button type="default" variant="primary" size={btnSize} fullWidth onClick={onPrimaryButton}>
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButton && (
            <Button type="default" variant="secondary" size={btnSize} fullWidth onClick={onSecondaryButton}>
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
