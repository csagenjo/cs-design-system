import React, { forwardRef } from 'react';
import { Icon } from './Icon';
import { injectStyles } from './_inputBase';
import { BadgeNotification } from './BadgeNotification';
import { DescriptionText } from './DescriptionText';
import { DetailText } from './DetailText';

const css = `
.ds-selector-invoker {
  box-sizing:     border-box;
  display:        inline-flex;
  align-items:    center;
  gap:            var(--ds-selector-root-gap);
  width:          auto;
  padding-left:   var(--ds-selector-root-padding);
  background:     var(--ds-selector-root-bg-generic);
  border:         var(--ds-selector-root-border-width-generic) solid var(--ds-selector-root-border-color-generic);
  border-radius:  var(--ds-selector-root-border-radius-generic);
  font-family:    inherit;
  text-align:     left;
  cursor:         pointer;
  position:       relative;
  transition:     border-color 0.12s, background 0.12s;
}
.ds-selector-invoker--full-width { display: flex; width: 100%; }

.ds-selector-invoker__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-selector-icon-fg-primary);
}
.ds-selector-invoker__icon-left svg {
  width:  var(--ds-selector-icon-left-size);
  height: var(--ds-selector-icon-left-size);
}

.ds-selector-invoker__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-selector-root-gap);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-selector-root-padding) var(--ds-selector-root-padding) var(--ds-selector-root-padding) 0;
}

.ds-selector-invoker__center {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-spacing-xs);
  flex:           1 1 auto;
  min-width:      0;
  text-align:     left;
}
.ds-selector-invoker--empty .ds-selector-invoker__center { gap: 0; }

.ds-selector-invoker__header {
  font-size:   var(--ds-fontSize-title-sm);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-xs);
  color:       var(--ds-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-selector-invoker__description,
.ds-selector-invoker__detail {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.ds-selector-invoker__description p,
.ds-selector-invoker__detail span:last-child { overflow: hidden; text-overflow: ellipsis; }

.ds-selector-invoker__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  color:       var(--ds-selector-icon-fg-primary);
}
.ds-selector-invoker__right svg { width: var(--ds-selector-icon-right-size); height: var(--ds-selector-icon-right-size); }

/* Hover — solo estado genérico interactivo */
.ds-selector-invoker--default:hover {
  background:   var(--ds-selector-root-bg-hover);
}

/* Pressed */
.ds-selector-invoker--default:active {
  opacity: var(--ds-selector-root-opacity-pressed);
}

/* Focus — anillo doble (inner blanco + outer negro) */
.ds-selector-invoker:focus-visible {
  outline:        var(--ds-selector-root-border-width-focus) solid var(--ds-selector-root-border-color-focus-outer);
  outline-offset: var(--ds-selector-root-border-width-focus);
  box-shadow:     0 0 0 var(--ds-selector-root-border-width-focus) var(--ds-selector-root-border-color-focus-inner);
  border-width:   var(--ds-selector-root-border-width-focus);
}

/* Error */
.ds-selector-invoker--error {
  border-color: var(--ds-selector-root-border-color-error);
}

/* Read-only — sin foco visible, cursor default */
.ds-selector-invoker--readOnly {
  background: var(--ds-selector-root-bg-disabled);
  border-color: var(--ds-selector-root-border-color-disabled);
  cursor:     default;
}
.ds-selector-invoker--readOnly:focus-visible {
  outline: none;
  box-shadow: none;
  border-width: var(--ds-selector-root-border-width-generic);
}

/* Data hidden — mismo aspecto que genérico, contenido enmascarado */
.ds-selector-invoker--dataHidden { cursor: default; }

/* Disabled */
.ds-selector-invoker:disabled {
  background:   var(--ds-selector-root-bg-disabled);
  border-color: var(--ds-selector-root-border-color-disabled);
  color:        var(--ds-selector-icon-fg-disabled);
  cursor:       not-allowed;
}
.ds-selector-invoker:disabled .ds-selector-invoker__icon-left,
.ds-selector-invoker:disabled .ds-selector-invoker__right { color: var(--ds-selector-icon-fg-disabled); }
.ds-selector-invoker:disabled .ds-selector-invoker__header { color: var(--ds-selector-header-fg-disabled); }
`;

injectStyles('ds-selector-invoker', css);

export const SelectorInvoker = forwardRef(function SelectorInvoker({
  state          = 'default',   // 'default' | 'error' | 'disabled' | 'readOnly' | 'dataHidden'
  dataSelection  = 'single',    // 'single' | 'multiple' | 'empty'
  headerText     = 'Header Text',
  descriptionText,
  descriptionEmphasis, // 'secondary' | 'tertiary' — solo aplica al color del detail text
  detailText,
  showIconLeft   = true,
  selectedCount,
  onClick,
  onFocus,
  onBlur,
  id,
  ariaLabel,
  fullWidth      = false,
  ...nativeProps
}, forwardedRef) {

  const isDisabled  = state === 'disabled';
  const isReadOnly  = state === 'readOnly';
  const isDataHidden = state === 'dataHidden';
  const isEmpty     = dataSelection === 'empty';

  const rootClasses = [
    'ds-selector-invoker',
    `ds-selector-invoker--${state}`,
    isEmpty     ? 'ds-selector-invoker--empty'      : '',
    fullWidth   ? 'ds-selector-invoker--full-width' : '',
  ].filter(Boolean).join(' ');

  const mask = (text) => (isDataHidden ? '••••••••' : text);

  return (
    <button
      type="button"
      ref={forwardedRef}
      id={id}
      className={rootClasses}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-readonly={isReadOnly || undefined}
      onClick={isReadOnly ? undefined : onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...nativeProps}
    >
      {showIconLeft && (
        <span className="ds-selector-invoker__icon-left">
          <Icon name="file-text" size="xs" />
        </span>
      )}

      <span className="ds-selector-invoker__content">
        <span className="ds-selector-invoker__center">
          <span className="ds-selector-invoker__header">{mask(headerText)}</span>

          {!isEmpty && descriptionText && (
            <span className="ds-selector-invoker__description">
              <DescriptionText color={isDisabled ? 'disabled' : 'subtle'} size="14">{mask(descriptionText)}</DescriptionText>
            </span>
          )}

          {!isEmpty && detailText && (
            <span className="ds-selector-invoker__detail">
              <DetailText color={isDisabled ? 'disabled' : (descriptionEmphasis || 'default')} size="14">{mask(detailText)}</DetailText>
            </span>
          )}
        </span>

        <span className="ds-selector-invoker__right">
          {dataSelection === 'multiple' && selectedCount != null && (
            <BadgeNotification color="secondary" size="expanded" label={selectedCount} />
          )}
          <Icon name="chevron-right" size="xs" />
        </span>
      </span>
    </button>
  );
});

SelectorInvoker.displayName = 'SelectorInvoker';
export default SelectorInvoker;
