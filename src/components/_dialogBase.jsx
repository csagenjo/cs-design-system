/**
 * DialogHeader — pieza interna compartida por Dialog / DialogSimple / ErrorAndEmptyState.
 * NO se exporta como componente público del sistema (mismo criterio que _inputBase.js).
 *
 * Back y Close son Icon Button (Default · Tertiary · Medium/Small), nunca un botón propio (27/10).
 *
 * 5 variantes de color (default/primary/onPrimary/secondary/tertiary): bg + title + icon
 * deben invertir (o no) JUNTOS con el modo — ver comentario largo en tokens.css junto a
 * --ds-dialog-header-*. default/secondary/tertiary invierten; primary/onPrimary son fijos.
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { IconButton } from './IconButton';

const css = `
.ds-dialog-header {
  display: flex;
  align-items: center;
  gap: var(--ds-dialog-gap-generic);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: 0 var(--ds-dialog-padding-hor-header);
}
/* Alto = padding + Icon Button con su área de foco: 4 + 52 + 4 = 60 / 2 + 40 + 2 = 44 */
.ds-dialog-header--standard { padding-top: var(--ds-dialog-padding-ver-header-regular); padding-bottom: var(--ds-dialog-padding-ver-header-regular); }
.ds-dialog-header--small    { padding-top: var(--ds-dialog-padding-ver-header-small);   padding-bottom: var(--ds-dialog-padding-ver-header-small); }

.ds-dialog-header--standard .ds-dialog-header__title { font-size: var(--ds-fontSize-title-lg); line-height: var(--ds-lineHeight-title-lg); }
.ds-dialog-header--small    .ds-dialog-header__title { font-size: var(--ds-fontSize-title-md); line-height: var(--ds-lineHeight-title-md); }

.ds-dialog-header__title {
  flex: 1 0 0;
  letter-spacing: inherit; /* es un h2: que no herede el letter-spacing global de h2 */
  min-width: 0;
  margin: 0;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ds-dialog-header--left .ds-dialog-header__title { text-align: left; }

/* Back y Close = Icon Button Default Tertiary (Medium en Standard, Small en Small).
   Se re-tematiza redefiniendo sus variables, como Collapsible: color del icono
   y anillo de foco que contrastan con el fondo de cada header. */
.ds-dialog-header--default    { background: var(--ds-dialog-bg-header-default); }
.ds-dialog-header--default    .ds-dialog-header__title { color: var(--ds-dialog-fg-header-title-default); }
.ds-dialog-header--default    .ds-icon-btn {
  --ds-icon-button-fg-icon-on-outline-default: var(--ds-dialog-fg-header-icon-default);
  --ds-icon-button-border-color-focus-inner:   var(--ds-dialog-border-color-header-icon-focus-inner-default);
  --ds-icon-button-border-color-focus-outer:   var(--ds-dialog-border-color-header-icon-focus-outer-default);
}

.ds-dialog-header--primary    { background: var(--ds-dialog-bg-header-primary); }
.ds-dialog-header--primary    .ds-dialog-header__title { color: var(--ds-dialog-fg-header-title-primary); }
.ds-dialog-header--primary    .ds-icon-btn {
  --ds-icon-button-fg-icon-on-outline-default: var(--ds-dialog-fg-header-icon-primary);
  --ds-icon-button-border-color-focus-inner:   var(--ds-dialog-border-color-header-icon-focus-inner-primary);
  --ds-icon-button-border-color-focus-outer:   var(--ds-dialog-border-color-header-icon-focus-outer-primary);
}

.ds-dialog-header--on-primary { background: var(--ds-dialog-bg-header-on-primary); }
.ds-dialog-header--on-primary .ds-dialog-header__title { color: var(--ds-dialog-fg-header-title-on-primary); }
.ds-dialog-header--on-primary .ds-icon-btn {
  --ds-icon-button-fg-icon-on-outline-default: var(--ds-dialog-fg-header-icon-on-primary);
  --ds-icon-button-border-color-focus-inner:   var(--ds-dialog-border-color-header-icon-focus-inner-on-primary);
  --ds-icon-button-border-color-focus-outer:   var(--ds-dialog-border-color-header-icon-focus-outer-on-primary);
}

.ds-dialog-header--secondary  { background: var(--ds-dialog-bg-header-secondary); }
.ds-dialog-header--secondary  .ds-dialog-header__title { color: var(--ds-dialog-fg-header-title-secondary); }
.ds-dialog-header--secondary  .ds-icon-btn {
  --ds-icon-button-fg-icon-on-outline-default: var(--ds-dialog-fg-header-icon-secondary);
  --ds-icon-button-border-color-focus-inner:   var(--ds-dialog-border-color-header-icon-focus-inner-secondary);
  --ds-icon-button-border-color-focus-outer:   var(--ds-dialog-border-color-header-icon-focus-outer-secondary);
}

.ds-dialog-header--tertiary   { background: var(--ds-dialog-bg-header-tertiary); }
.ds-dialog-header--tertiary   .ds-dialog-header__title { color: var(--ds-dialog-fg-header-title-tertiary); }
.ds-dialog-header--tertiary   .ds-icon-btn {
  --ds-icon-button-fg-icon-on-outline-default: var(--ds-dialog-fg-header-icon-tertiary);
  --ds-icon-button-border-color-focus-inner:   var(--ds-dialog-border-color-header-icon-focus-inner-tertiary);
  --ds-icon-button-border-color-focus-outer:   var(--ds-dialog-border-color-header-icon-focus-outer-tertiary);
}
`;

injectStyles('ds-dialog-header', css);

const COLOR_CLASS = {
  default: 'default',
  primary: 'primary',
  onPrimary: 'on-primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
};

export function DialogHeader({
  color = 'default',
  size = 'standard',      // 'standard' | 'small'
  title = 'Dialog Title',
  titleAlign = 'center',  // 'center' | 'left' (Dialog Simple, como en Figma)
  showArrow = true,
  showClose = true,
  onBack,
  onClose,
  titleId,                 // id del título — el diálogo lo usa en aria-labelledby (A11y-1)
  backLabel = 'Back',      // textos para lector de pantalla — inglés por defecto (decisión 20/10)
  closeLabel = 'Close',
}) {
  const classes = [
    'ds-dialog-header',
    `ds-dialog-header--${size}`,
    `ds-dialog-header--${COLOR_CLASS[color] || 'default'}`,
    titleAlign === 'left' ? 'ds-dialog-header--left' : '',
  ].filter(Boolean).join(' ');
  const btnSize = size === 'small' ? 'small' : 'medium';

  // Un botón oculto no deja hueco (igual que Figma: la capa oculta sale del auto-layout).
  return (
    <div className={classes}>
      {showArrow && (
        <IconButton type="default" variant="tertiary" size={btnSize} icon="arrow-left" ariaLabel={backLabel} onClick={onBack} />
      )}
      {/* Título = encabezado real (h2) para que el lector lo anuncie y el diálogo
          lo use como nombre. Sin título (ErrorAndEmptyState) solo queda el hueco. */}
      {title
        ? <h2 id={titleId} className="ds-dialog-header__title">{title}</h2>
        : <span className="ds-dialog-header__title" aria-hidden="true" />}
      {showClose && (
        <IconButton type="default" variant="tertiary" size={btnSize} icon="x" ariaLabel={closeLabel} onClick={onClose} />
      )}
    </div>
  );
}
