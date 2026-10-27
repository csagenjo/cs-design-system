/**
 * ErrorAndEmptyState — Componente atómico
 * CS Design System · v1.1 (27/10/2026: alineado 1:1 con Figma)
 *
 * Feedback de error o de "sin datos" a pantalla completa o en tarjeta PopUp.
 * Header Default fijo, solo con botón de cierre (sin flecha, sin título en la
 * barra — el título real vive en el bloque de contenido, centrado).
 *
 * Imagen: instancia el átomo `Image` (1:1, esquinas redondeadas, 120), igual que
 * Figma (27/10). `imageSrc` + `imageAlt` (vacío = decorativa). Sin `imageSrc`,
 * Image pinta su fondo de relleno. `icon` (slot antiguo) ya no existe: aviso en dev.
 *
 * variant="fullScreen" — la vista entera está vacía o ha fallado: sustituye al
 *                         contenido de la página (no es un modal). 100 %/100 % del
 *                         contenedor; el contenido se centra en el hueco libre y
 *                         los botones quedan abajo. También en móvil.
 * variant="popUp"       — una acción dentro de la página no ha devuelto nada o ha
 *                         fallado y la página sigue detrás. Tablet y escritorio;
 *                         en móvil, fullScreen. Tarjeta de 359. Las dos variantes llevan
 *                         Dialog/DialogShadow (añadida 25/08, antes ninguna la
 *                         tenía) pero sin radio de esquina — Figma no lo define
 *                         para este componente.
 *
 *
 * ACCESIBILIDAD (A11y-1, 21/10/2026, audit §B):
 *   popUp = diálogo modal: role="dialog" + `_useModal` (foco dentro, Tab
 *   atrapado, fondo inert, Escape → `onClose`, foco de vuelta al cerrar),
 *   nombre = el título (h2). `modal={false}` solo para mostrarlo estático.
 *   fullScreen = contenido de página, no un diálogo: sin role, título h2.
 *   La imagen es decorativa salvo que se pase `imageAlt`.
 *
 * USO:
 *   <ErrorAndEmptyState title="No hay resultados" description="Prueba a cambiar los filtros." />
 *   {open && <ErrorAndEmptyState variant="popUp" title="Sin resultados" onClose={close} />}
 *   <ErrorAndEmptyState variant="popUp" imageSrc={url} onClose={fn} />
 */

import React, { useId, useRef, useEffect } from 'react';
import { announce } from './announce';
import { injectStyles } from './_inputBase';
import { useModal } from './_useModal';
import { DialogHeader } from './_dialogBase';
import { Button } from './Button';
import { Image } from './Image';
import { warnOnce } from './_devWarn';

const css = `
.ds-error-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background: var(--ds-dialog-root-bg-generic);
  box-shadow: var(--ds-dialog-shadow); /* Dialog/DialogShadow — añadida 25/08, antes ninguna variante llevaba sombra ni radio (sigue sin radio, cornerRadius 0 en Figma) */
}
.ds-error-empty-state--full-screen {
  width: 100%;
  height: 100%;
  gap: var(--ds-dialog-root-gap-generic);
  padding: var(--ds-dialog-empty-state-padding-generic);
}
.ds-error-empty-state--pop-up {
  width: min(359px, 100%); /* Figma: Pop up 359 */
  flex-shrink: 0;
  gap: var(--ds-dialog-root-gap-generic);
  padding: var(--ds-dialog-empty-state-padding-generic);
}

.ds-error-empty-state__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-dialog-empty-state-content-gap);
  width: 100%;
  box-sizing: border-box;
}

.ds-error-empty-state__image { width: 120px; flex-shrink: 0; } /* Figma: Image 1:1 de 120 */

.ds-error-empty-state__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-dialog-empty-state-text-gap);
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}
.ds-error-empty-state--full-screen .ds-error-empty-state__content { flex: 1 1 auto; justify-content: center; } /* Figma: Content en fill, centrado en el hueco libre; botones abajo */
.ds-error-empty-state--full-screen .ds-error-empty-state__text { padding-bottom: var(--ds-dialog-empty-state-text-padding-bottom-full-screen); }

.ds-error-empty-state__title {
  margin: 0;
  letter-spacing: inherit; /* es un h2: que no herede el letter-spacing global de h2 */
  width: 100%;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  font-size: var(--ds-fontSize-title-md);
  line-height: var(--ds-lineHeight-title-md);
  color: var(--ds-dialog-title-fg-generic);
}
.ds-error-empty-state__description {
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  color: var(--ds-dialog-empty-state-body-text-fg-generic);
}

.ds-error-empty-state__control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ds-dialog-root-gap-generic);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}
.ds-error-empty-state--full-screen .ds-error-empty-state__control-area { padding: var(--ds-dialog-control-area-padding-generic); }
`;

injectStyles('ds-error-empty-state', css);

export function ErrorAndEmptyState({
  variant              = 'fullScreen', // 'fullScreen' | 'popUp'
  imageSrc,
  imageAlt             = '',     // vacío = decorativa
  icon,                          // eliminado 27/10 — aviso en dev
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
  modal                = true,
  announceOnMount      = true,  // A11y-4: fullScreen sustituye al contenido sin mover el foco — se anuncia título + descripción
  closeLabel,
  headingLevel         = 2,  // A11y-5: nivel del título en fullScreen (en popUp es un diálogo: siempre h2)
  id,
  className,
}) {
  const isFullScreen = variant !== 'popUp';
  if (icon) warnOnce('ErrorAndEmptyState.icon', '[DS ErrorAndEmptyState] `icon` ya no existe: la ilustración es el átomo Image (`imageSrc`, `imageAlt`), como en Figma.');
  const isDialog = !isFullScreen;
  const TitleTag = isDialog ? 'h2' : `h${Math.min(6, Math.max(1, headingLevel))}`;
  const ref = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  useModal({ open: isDialog && modal, containerRef: ref, onClose });
  // popUp ya se lee al recibir el foco (es un diálogo); fullScreen no lo recibe.
  useEffect(() => {
    if (isFullScreen && announceOnMount) announce([title, description].filter((t) => typeof t === 'string' && t).join('. '));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = [
    'ds-error-empty-state',
    `ds-error-empty-state--${isFullScreen ? 'full-screen' : 'pop-up'}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      id={id}
      className={classes}
      role={isDialog ? 'dialog' : undefined}
      aria-modal={isDialog && modal ? 'true' : undefined}
      aria-labelledby={isDialog ? titleId : undefined}
      aria-describedby={isDialog ? descriptionId : undefined}
    >
      <DialogHeader color="default" size="standard" title="" showArrow={false} showClose onClose={onClose} closeLabel={closeLabel} />
      <div className="ds-error-empty-state__content">
        <Image className="ds-error-empty-state__image" size="1:1" src={imageSrc} alt={imageAlt} />
        <div className="ds-error-empty-state__text">
          <TitleTag id={titleId} className="ds-error-empty-state__title">{title}</TitleTag>
          <p id={descriptionId} className="ds-error-empty-state__description">{description}</p>
        </div>
      </div>
      {showButtons && (primaryButton || secondaryButton) && (
        <div className="ds-error-empty-state__control-area">
          {primaryButton && (
            <Button type="default" variant="primary" size="lg" fullWidth onClick={onPrimaryButton}>
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButton && (
            <Button type="default" variant="secondary" size="lg" fullWidth onClick={onSecondaryButton}>
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
