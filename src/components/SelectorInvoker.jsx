import React, { forwardRef } from 'react';
import { VisuallyHidden } from './VisuallyHidden';
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
  gap:            var(--ds-selector-gap);
  width:          auto;
  padding-left:   var(--ds-selector-padding);
  background:     var(--ds-selector-bg-generic);
  border:         var(--ds-selector-border-width-generic) solid var(--ds-selector-border-color-generic);
  border-radius:  var(--ds-selector-border-radius-generic);
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
  color:       var(--ds-selector-fg-icon-primary);
}
.ds-selector-invoker__icon-left svg {
  width:  var(--ds-selector-size-icon-left);
  height: var(--ds-selector-size-icon-left);
}

.ds-selector-invoker__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-selector-gap-content);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-selector-padding-content) var(--ds-selector-padding-content) var(--ds-selector-padding-content) 0;
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
  font-size:   var(--ds-fontSize-title-md);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-title-md);
  color:       var(--ds-selector-fg-header-default);
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
  color:       var(--ds-selector-fg-icon-primary);
}
.ds-selector-invoker__right svg { width: var(--ds-selector-size-icon-right); height: var(--ds-selector-size-icon-right); }

/* Hover — solo estado genérico interactivo */
.ds-selector-invoker--default:hover {
  background:   var(--ds-selector-bg-hover);
}

/* Pressed */
.ds-selector-invoker--default:active {
  opacity: var(--ds-selector-opacity-pressed);
}

/* Focus — anillo doble (inner blanco + outer negro) */
.ds-selector-invoker:focus-visible {
  outline:        var(--ds-selector-root-border-width-focus) solid var(--ds-selector-root-border-color-focus-outer);
  outline-offset: var(--ds-selector-root-border-width-focus);
  box-shadow:     0 0 0 var(--ds-selector-root-border-width-focus) var(--ds-selector-root-border-color-focus-inner);
}

/* Error */
.ds-selector-invoker--error {
  border-color: var(--ds-selector-border-color-error);
}

/* Read-only — sin foco visible, cursor default */
.ds-selector-invoker--readOnly {
  background: var(--ds-selector-bg-disabled);
  border-color: var(--ds-selector-border-color-disabled);
  cursor:     default;
}
/* A11y-4: solo lectura sigue siendo enfocable — conserva el anillo de foco (antes se quitaba). */

/* Data hidden — mismo aspecto que genérico, contenido enmascarado */
.ds-selector-invoker--dataHidden { cursor: default; }

/* Disabled */
.ds-selector-invoker:disabled {
  background:   var(--ds-selector-bg-disabled);
  border-color: var(--ds-selector-border-color-disabled);
  color:        var(--ds-selector-fg-icon-disabled);
  cursor:       not-allowed;
}
.ds-selector-invoker:disabled .ds-selector-invoker__icon-left,
.ds-selector-invoker:disabled .ds-selector-invoker__right { color: var(--ds-selector-fg-icon-disabled); }
.ds-selector-invoker:disabled .ds-selector-invoker__header { color: var(--ds-selector-fg-header-disabled); }
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
  expanded,                     // estado del panel que abre (aria-expanded)
  haspopup       = 'dialog',    // qué abre: 'dialog' | 'listbox' | 'menu'…
  readOnlyLabel  = 'read only',
  hiddenLabel    = 'hidden',
  selectedCountLabel = (n) => `${n} selected`,
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

  // A11y-3: los puntos de dato oculto no se leen ("bullet bullet…"); se dice
  // "hidden".
  const mask = (text) => (isDataHidden
    ? <><span aria-hidden="true">••••••••</span><VisuallyHidden>{hiddenLabel}</VisuallyHidden></>
    : text);

  return (
    <button
      type="button"
      ref={forwardedRef}
      id={id}
      className={rootClasses}
      disabled={isDisabled}
      aria-haspopup={haspopup}
      aria-expanded={expanded}
      aria-disabled={isReadOnly || undefined}
      onClick={isReadOnly ? undefined : onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...nativeProps}
    >
      {/* A11y-3: `ariaLabel` ya no sustituye al nombre (ocultaba el valor
          elegido) — se lee delante: "Cuenta de cargo, Cuenta nómina…". */}
      {ariaLabel && <VisuallyHidden>{`${ariaLabel}, `}</VisuallyHidden>}
      {showIconLeft && (
        <span className="ds-selector-invoker__icon-left">
          <Icon name="file-text" size="sm" />
        </span>
      )}

      <span className="ds-selector-invoker__content">
        <span className="ds-selector-invoker__center">
          <span className="ds-selector-invoker__header">{isEmpty ? mask(headerText) : headerText}</span>

          {!isEmpty && descriptionText && (
            <span className="ds-selector-invoker__description">
              <DescriptionText as="span" color={isDisabled ? 'disabled' : 'subtle'} size="14">{mask(descriptionText)}</DescriptionText>
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
            <BadgeNotification color="secondary" size="expanded" label={selectedCount} ariaLabel={selectedCountLabel(selectedCount)} />
          )}
          <Icon name="chevron-right" size="sm" />
        </span>
      </span>
      {isReadOnly && <VisuallyHidden>{`, ${readOnlyLabel}`}</VisuallyHidden>}
    </button>
  );
});

SelectorInvoker.displayName = 'SelectorInvoker';
export default SelectorInvoker;
