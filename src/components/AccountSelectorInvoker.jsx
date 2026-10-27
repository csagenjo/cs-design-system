import React, { forwardRef } from 'react';
import { VisuallyHidden } from './VisuallyHidden';
import { Icon } from './Icon';
import { injectStyles } from './_inputBase';
import { BadgeNotification } from './BadgeNotification';
import { AmountView } from './AmountView';
import { DetailText } from './DetailText';

const css = `
.ds-account-selector-invoker {
  box-sizing:     border-box;
  display:        inline-flex;
  align-items:    center;
  gap:            var(--ds-account-selector-root-gap);
  width:          auto;
  padding-left:   var(--ds-account-selector-root-padding);
  background:     var(--ds-account-selector-root-bg-generic);
  border:         var(--ds-account-selector-root-border-width-generic) solid var(--ds-account-selector-root-border-color-generic);
  border-radius:  var(--ds-account-selector-root-border-radius-generic);
  font-family:    inherit;
  text-align:     left;
  cursor:         pointer;
  position:       relative;
  transition:     border-color 0.12s, background 0.12s;
}
.ds-account-selector-invoker--full-width { display: flex; width: 100%; }

.ds-account-selector-invoker__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-account-selector-icon-fg-primary);
}
.ds-account-selector-invoker__icon-left svg {
  width:  var(--ds-account-selector-icon-left-size);
  height: var(--ds-account-selector-icon-left-size);
}

.ds-account-selector-invoker__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-account-selector-content-gap);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-account-selector-content-padding) var(--ds-account-selector-content-padding) var(--ds-account-selector-content-padding) 0;
}

.ds-account-selector-invoker__center {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-spacing-xs);
  flex:           1 1 auto;
  min-width:      0;
  text-align:     left;
}
.ds-account-selector-invoker--empty .ds-account-selector-invoker__center { gap: 0; }

.ds-account-selector-invoker__header {
  font-size:   var(--ds-fontSize-title-sm);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-title-sm);
  color:       var(--ds-account-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-account-selector-invoker__detail {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.ds-account-selector-invoker__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  color:       var(--ds-account-selector-icon-fg-primary);
}
.ds-account-selector-invoker__right svg { width: var(--ds-account-selector-icon-right-size); height: var(--ds-account-selector-icon-right-size); }

.ds-account-selector-invoker--default:hover { background: var(--ds-account-selector-root-bg-hover); }
.ds-account-selector-invoker--default:active { opacity: var(--ds-account-selector-root-opacity-pressed); }

.ds-account-selector-invoker:focus-visible {
  outline:        var(--ds-account-selector-root-border-width-focus) solid var(--ds-account-selector-root-border-color-focus-outer);
  outline-offset: var(--ds-account-selector-root-border-width-focus);
  box-shadow:     0 0 0 var(--ds-account-selector-root-border-width-focus) var(--ds-account-selector-root-border-color-focus-inner);
}

.ds-account-selector-invoker--error { border-color: var(--ds-account-selector-root-border-color-error); }

.ds-account-selector-invoker--readOnly {
  background:   var(--ds-account-selector-root-bg-disabled);
  border-color: var(--ds-account-selector-root-border-color-disabled);
  cursor:       default;
}
/* A11y-4: solo lectura sigue siendo enfocable — conserva el anillo de foco (antes se quitaba). */

.ds-account-selector-invoker--dataHidden { cursor: default; }

.ds-account-selector-invoker:disabled {
  background:   var(--ds-account-selector-root-bg-disabled);
  border-color: var(--ds-account-selector-root-border-color-disabled);
  color:        var(--ds-account-selector-icon-fg-disabled);
  cursor:       not-allowed;
}
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__icon-left,
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__right { color: var(--ds-account-selector-icon-fg-disabled); }
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__header { color: var(--ds-account-selector-header-fg-disabled); }
`;

injectStyles('ds-account-selector-invoker', css);

export const AccountSelectorInvoker = forwardRef(function AccountSelectorInvoker({
  state          = 'default',   // 'default' | 'error' | 'disabled' | 'readOnly' | 'dataHidden'
  dataSelection  = 'single',    // 'single' | 'multiple' | 'empty'
  headerText     = 'Account',
  amount,
  currency,
  amountType     = 'positive',  // 'positive' | 'negative'
  amountHighlight = 'emphasis', // AmountView highlight (Figma: Emphasis)
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

  const isDisabled   = state === 'disabled';
  const isReadOnly   = state === 'readOnly';
  const isDataHidden = state === 'dataHidden';
  const isEmpty      = dataSelection === 'empty';

  const rootClasses = [
    'ds-account-selector-invoker',
    `ds-account-selector-invoker--${state}`,
    isEmpty   ? 'ds-account-selector-invoker--empty'      : '',
    fullWidth ? 'ds-account-selector-invoker--full-width' : '',
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
        <span className="ds-account-selector-invoker__icon-left">
          <Icon name="file-text" size="sm" />
        </span>
      )}

      <span className="ds-account-selector-invoker__content">
        <span className="ds-account-selector-invoker__center">
          <span className="ds-account-selector-invoker__header">{isEmpty ? mask(headerText) : headerText}</span>

          {!isEmpty && amount != null && (
            <AmountView as="span" amount={mask(amount)} currency={currency} type={amountType} highlight={isDisabled ? 'disabled' : amountHighlight} />
          )}

          {!isEmpty && detailText && (
            <span className="ds-account-selector-invoker__detail">
              <DetailText color={isDisabled ? 'disabled' : 'default'} size="14">{mask(detailText)}</DetailText>
            </span>
          )}
        </span>

        <span className="ds-account-selector-invoker__right">
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

AccountSelectorInvoker.displayName = 'AccountSelectorInvoker';
export default AccountSelectorInvoker;
