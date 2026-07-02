import React, { forwardRef } from 'react';
import { FileText, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { injectStyles } from './_inputBase';
import { BadgeNotification } from './BadgeNotification';

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
  color:       var(--ds-selector-icon-left-fg);
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
  font-size:   16px;
  font-weight: 700;
  line-height: 24px;
  color:       var(--ds-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-selector-invoker__description {
  font-size:   14px;
  line-height: 21px;
  color:       var(--ds-selector-description-fg-subtle);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-selector-invoker__detail {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  font-size:   14px;
  line-height: 21px;
  color:       var(--ds-selector-detail-text-fg-default);
  overflow:    hidden;
}
.ds-selector-invoker__detail svg { flex-shrink: 0; width: var(--ds-selector-detail-icon-size); height: var(--ds-selector-detail-icon-size); }
.ds-selector-invoker__detail span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-selector-invoker__detail--secondary { color: var(--ds-selector-detail-text-fg-secondary); }
.ds-selector-invoker__detail--tertiary  { color: var(--ds-selector-detail-text-fg-tertiary); }

.ds-selector-invoker__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  color:       var(--ds-selector-icon-right-fg);
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
  color:        var(--ds-selector-icon-left-fg-disabled);
  cursor:       not-allowed;
}
.ds-selector-invoker:disabled .ds-selector-invoker__icon-left,
.ds-selector-invoker:disabled .ds-selector-invoker__right { color: var(--ds-selector-icon-right-fg-disabled); }
.ds-selector-invoker:disabled .ds-selector-invoker__header { color: var(--ds-selector-header-fg-disabled); }
.ds-selector-invoker:disabled .ds-selector-invoker__description { color: var(--ds-selector-description-fg-disabled); }
.ds-selector-invoker:disabled .ds-selector-invoker__detail { color: var(--ds-selector-detail-text-fg-disabled); }
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

  const detailClasses = [
    'ds-selector-invoker__detail',
    descriptionEmphasis ? `ds-selector-invoker__detail--${descriptionEmphasis}` : '',
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
          <FileText size={20} strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}

      <span className="ds-selector-invoker__content">
        <span className="ds-selector-invoker__center">
          <span className="ds-selector-invoker__header">{mask(headerText)}</span>

          {!isEmpty && descriptionText && (
            <span className="ds-selector-invoker__description">{mask(descriptionText)}</span>
          )}

          {!isEmpty && detailText && (
            <span className={detailClasses}>
              <LinkIcon strokeWidth={1.75} aria-hidden="true" />
              <span>{mask(detailText)}</span>
            </span>
          )}
        </span>

        <span className="ds-selector-invoker__right">
          {dataSelection === 'multiple' && selectedCount != null && (
            <BadgeNotification color="secondary" size="expanded" label={selectedCount} />
          )}
          <ChevronRight strokeWidth={1.75} aria-hidden="true" />
        </span>
      </span>
    </button>
  );
});

SelectorInvoker.displayName = 'SelectorInvoker';
export default SelectorInvoker;
