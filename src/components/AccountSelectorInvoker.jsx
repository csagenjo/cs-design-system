import React, { forwardRef } from 'react';
import { FileText, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { injectStyles } from './_inputBase';
import { Badge } from './Badge';
import { AmountView } from './AmountView';

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
  color:       var(--ds-account-selector-icon-left-fg);
}

.ds-account-selector-invoker__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-account-selector-root-gap);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-account-selector-root-padding) var(--ds-account-selector-root-padding) var(--ds-account-selector-root-padding) 0;
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
  font-size:   16px;
  font-weight: 700;
  line-height: 24px;
  color:       var(--ds-account-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-account-selector-invoker__detail {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  font-size:   14px;
  line-height: 21px;
  color:       var(--ds-account-selector-detail-text-fg-default);
  overflow:    hidden;
}
.ds-account-selector-invoker__detail svg { flex-shrink: 0; width: var(--ds-account-selector-detail-icon-size); height: var(--ds-account-selector-detail-icon-size); }
.ds-account-selector-invoker__detail span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ds-account-selector-invoker__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  color:       var(--ds-account-selector-icon-right-fg);
}
.ds-account-selector-invoker__right svg { width: var(--ds-account-selector-icon-right-size); height: var(--ds-account-selector-icon-right-size); }

.ds-account-selector-invoker--default:hover { background: var(--ds-account-selector-root-bg-hover); }
.ds-account-selector-invoker--default:active { opacity: var(--ds-account-selector-root-opacity-pressed); }

.ds-account-selector-invoker:focus-visible {
  outline:        var(--ds-account-selector-root-border-width-focus) solid var(--ds-account-selector-root-border-color-focus-outer);
  outline-offset: var(--ds-account-selector-root-border-width-focus);
  box-shadow:     0 0 0 var(--ds-account-selector-root-border-width-focus) var(--ds-account-selector-root-border-color-focus-inner);
  border-width:   var(--ds-account-selector-root-border-width-focus);
}

.ds-account-selector-invoker--error { border-color: var(--ds-account-selector-root-border-color-error); }

.ds-account-selector-invoker--readOnly {
  background:   var(--ds-account-selector-root-bg-disabled);
  border-color: var(--ds-account-selector-root-border-color-disabled);
  cursor:       default;
}
.ds-account-selector-invoker--readOnly:focus-visible {
  outline: none;
  box-shadow: none;
  border-width: var(--ds-account-selector-root-border-width-generic);
}

.ds-account-selector-invoker--dataHidden { cursor: default; }

.ds-account-selector-invoker:disabled {
  background:   var(--ds-account-selector-root-bg-disabled);
  border-color: var(--ds-account-selector-root-border-color-disabled);
  color:        var(--ds-account-selector-icon-left-fg-disabled);
  cursor:       not-allowed;
}
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__icon-left,
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__right { color: var(--ds-account-selector-icon-right-fg-disabled); }
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__header { color: var(--ds-account-selector-header-fg-disabled); }
.ds-account-selector-invoker:disabled .ds-account-selector-invoker__detail { color: var(--ds-account-selector-detail-text-fg-disabled); }
`;

injectStyles('ds-account-selector-invoker', css);

export const AccountSelectorInvoker = forwardRef(function AccountSelectorInvoker({
  state          = 'default',   // 'default' | 'error' | 'disabled' | 'readOnly' | 'dataHidden'
  dataSelection  = 'single',    // 'single' | 'multiple' | 'empty'
  headerText     = 'Cuenta',
  amount,
  currency,
  amountType     = 'positive',  // 'positive' | 'negative'
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
        <span className="ds-account-selector-invoker__icon-left">
          <FileText size={20} strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}

      <span className="ds-account-selector-invoker__content">
        <span className="ds-account-selector-invoker__center">
          <span className="ds-account-selector-invoker__header">{mask(headerText)}</span>

          {!isEmpty && amount != null && !isDataHidden && (
            <AmountView amount={amount} currency={currency} type={amountType} />
          )}

          {!isEmpty && detailText && (
            <span className="ds-account-selector-invoker__detail">
              <LinkIcon strokeWidth={1.75} aria-hidden="true" />
              <span>{mask(detailText)}</span>
            </span>
          )}
        </span>

        <span className="ds-account-selector-invoker__right">
          {dataSelection === 'multiple' && selectedCount != null && (
            <Badge color="secondary" size="expanded" label={selectedCount} />
          )}
          <ChevronRight strokeWidth={1.75} aria-hidden="true" />
        </span>
      </span>
    </button>
  );
});

AccountSelectorInvoker.displayName = 'AccountSelectorInvoker';
export default AccountSelectorInvoker;
