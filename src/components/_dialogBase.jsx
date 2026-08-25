/**
 * DialogHeader — pieza interna compartida por Dialog / DialogSimple / ErrorAndEmptyState.
 * NO se exporta como componente público del sistema (mismo criterio que _inputBase.js).
 *
 * 5 variantes de color (default/primary/onPrimary/secondary/tertiary): bg + title + icon
 * deben invertir (o no) JUNTOS con el modo — ver comentario largo en tokens.css junto a
 * --ds-dialog-header-*. default/secondary/tertiary invierten; primary/onPrimary son fijos.
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';

const css = `
.ds-dialog-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: var(--ds-dialog-header-padding-ver) var(--ds-dialog-header-padding-hor);
}
.ds-dialog-header--standard { height: 60px; }
.ds-dialog-header--small    { height: 44px; }

.ds-dialog-header--standard .ds-dialog-header__title { font-size: var(--ds-fontSize-title-lg); line-height: var(--ds-lineHeight-md); }
.ds-dialog-header--small    .ds-dialog-header__title { font-size: var(--ds-fontSize-title-md); line-height: var(--ds-lineHeight-sm); }

.ds-dialog-header__title {
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  font-family: inherit;
  font-weight: var(--ds-font-weight-bold);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ds-dialog-header__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}
.ds-dialog-header__icon-btn:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
.ds-dialog-header__icon-btn--placeholder  { visibility: hidden; pointer-events: none; }

.ds-dialog-header--default    { background: var(--ds-dialog-header-bg-default); }
.ds-dialog-header--default    .ds-dialog-header__title    { color: var(--ds-dialog-header-title-fg-default); }
.ds-dialog-header--default    .ds-dialog-header__icon-btn  { color: var(--ds-dialog-header-icon-fg-default); }

.ds-dialog-header--primary    { background: var(--ds-dialog-header-bg-primary); }
.ds-dialog-header--primary    .ds-dialog-header__title    { color: var(--ds-dialog-header-title-fg-primary); }
.ds-dialog-header--primary    .ds-dialog-header__icon-btn  { color: var(--ds-dialog-header-icon-fg-primary); }

.ds-dialog-header--on-primary { background: var(--ds-dialog-header-bg-on-primary); }
.ds-dialog-header--on-primary .ds-dialog-header__title    { color: var(--ds-dialog-header-title-fg-on-primary); }
.ds-dialog-header--on-primary .ds-dialog-header__icon-btn  { color: var(--ds-dialog-header-icon-fg-on-primary); }

.ds-dialog-header--secondary  { background: var(--ds-dialog-header-bg-secondary); }
.ds-dialog-header--secondary  .ds-dialog-header__title    { color: var(--ds-dialog-header-title-fg-secondary); }
.ds-dialog-header--secondary  .ds-dialog-header__icon-btn  { color: var(--ds-dialog-header-icon-fg-secondary); }

.ds-dialog-header--tertiary   { background: var(--ds-dialog-header-bg-tertiary); }
.ds-dialog-header--tertiary   .ds-dialog-header__title    { color: var(--ds-dialog-header-title-fg-tertiary); }
.ds-dialog-header--tertiary   .ds-dialog-header__icon-btn  { color: var(--ds-dialog-header-icon-fg-tertiary); }
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
  showArrow = true,
  showClose = true,
  onBack,
  onClose,
}) {
  const classes = [
    'ds-dialog-header',
    `ds-dialog-header--${size}`,
    `ds-dialog-header--${COLOR_CLASS[color] || 'default'}`,
  ].join(' ');

  return (
    <div className={classes}>
      {showArrow ? (
        <button type="button" className="ds-dialog-header__icon-btn" onClick={onBack} aria-label="Volver">
          <Icon name="ArrowLeft" size="sm" />
        </button>
      ) : (
        <span className="ds-dialog-header__icon-btn ds-dialog-header__icon-btn--placeholder" aria-hidden="true" />
      )}
      <p className="ds-dialog-header__title">{title}</p>
      {showClose ? (
        <button type="button" className="ds-dialog-header__icon-btn" onClick={onClose} aria-label="Cerrar">
          <Icon name="X" size="sm" />
        </button>
      ) : (
        <span className="ds-dialog-header__icon-btn ds-dialog-header__icon-btn--placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
