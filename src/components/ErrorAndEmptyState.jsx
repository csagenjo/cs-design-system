/**
 * ErrorAndEmptyState — Componente atómico
 * CS Design System · v1.0
 *
 * Feedback de error o de "sin datos" a pantalla completa o en tarjeta PopUp.
 * Header Default fijo, solo con botón de cierre (sin flecha, sin título en la
 * barra — el título real vive en el bloque de contenido, centrado).
 *
 * `icon`: slot libre (ReactNode) — NO es el átomo Image (prohibido, ver
 * CLAUDE.md §9 "No construir"). Por defecto un Lucide genérico dentro de un
 * círculo de superficie sutil, sustituible por cualquier ilustración real.
 *
 * variant="fullScreen" — ocupa 100%/100% del contenedor (igual que Dialog
 *                         width="fullScreen"), header/contenido/botones
 *                         repartidos en los extremos.
 * variant="popUp"       — tarjeta compacta centrada, sin sombra/radio propios
 *                         (Figma no los define para esta variante).
 *
 * USO:
 *   <ErrorAndEmptyState title="No hay resultados" description="Prueba a cambiar los filtros." />
 *   <ErrorAndEmptyState variant="popUp" icon={<AlertTriangle />} onClose={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { DialogHeader } from './_dialogBase';
import { Button } from './Button';
import { ImageOff } from 'lucide-react';

const css = `
.ds-error-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background: var(--ds-dialog-root-bg-generic);
}
.ds-error-empty-state--full-screen {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  padding: 8px 16px 16px;
}
.ds-error-empty-state--pop-up {
  max-width: 359px;
  flex-shrink: 0;
  gap: var(--ds-dialog-simple-padding-ver-generic);
  padding: 16px;
}

.ds-error-empty-state__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-dialog-simple-padding-ver-generic);
  width: 100%;
  box-sizing: border-box;
}
.ds-error-empty-state--pop-up .ds-error-empty-state__content { gap: 16px; }

.ds-error-empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: var(--ds-bg-subtle);
  color: var(--ds-fg-icon-subtle);
  flex-shrink: 0;
}

.ds-error-empty-state__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}
.ds-error-empty-state--full-screen .ds-error-empty-state__text { padding-bottom: 24px; }

.ds-error-empty-state__title {
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-title-md);
  line-height: var(--ds-lineHeight-sm);
  color: var(--ds-dialog-title-fg-generic);
}
.ds-error-empty-state__description {
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-dialog-empty-state-body-text-fg-generic);
}

.ds-error-empty-state__control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ds-dialog-simple-padding-ver-generic);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}
.ds-error-empty-state--full-screen .ds-error-empty-state__control-area { padding: 16px; }
`;

injectStyles('ds-error-empty-state', css);

export function ErrorAndEmptyState({
  variant              = 'fullScreen', // 'fullScreen' | 'popUp'
  icon,
  title                = 'Here comes your title',
  description          = 'Here comes the paragraphy. Tell the story you want the user to know.',
  onClose,
  showButtons          = true,
  primaryButton        = true,
  primaryButtonLabel   = 'Button',
  onPrimaryButton,
  secondaryButton      = true,
  secondaryButtonLabel = 'Button',
  onSecondaryButton,
  id,
  className,
}) {
  const isFullScreen = variant !== 'popUp';

  const classes = [
    'ds-error-empty-state',
    `ds-error-empty-state--${isFullScreen ? 'full-screen' : 'pop-up'}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <DialogHeader color="default" size="standard" title="" showArrow={false} showClose onClose={onClose} />
      <div className="ds-error-empty-state__content">
        <div className="ds-error-empty-state__icon">
          {icon || <ImageOff size={64} strokeWidth={1.5} aria-hidden="true" />}
        </div>
        <div className="ds-error-empty-state__text">
          <p className="ds-error-empty-state__title">{title}</p>
          <p className="ds-error-empty-state__description">{description}</p>
        </div>
      </div>
      {showButtons && (primaryButton || secondaryButton) && (
        <div className="ds-error-empty-state__control-area">
          {primaryButton && (
            <Button variant="default" size="lg" fullWidth onClick={onPrimaryButton}>
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButton && (
            <Button variant="default" outline size="lg" fullWidth onClick={onSecondaryButton}>
              {secondaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorAndEmptyState;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<ErrorAndEmptyState title="No se pudo cargar la información" description="Inténtalo de nuevo más tarde." />

<ErrorAndEmptyState variant="popUp" title="Sin resultados" description="Prueba a cambiar los filtros."
  secondaryButton={false} primaryButtonLabel="Reintentar" onPrimaryButton={() => {}} />
*/
