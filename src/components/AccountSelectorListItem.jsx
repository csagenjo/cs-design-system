import React, { forwardRef } from 'react';
import { Icon } from './Icon';
import { injectStyles } from './_inputBase';
import { Radio } from './Radio';
import { Checkbox } from './Checkbox';
import { AmountView } from './AmountView';

const css = `
.ds-account-selector-list-item {
  box-sizing:     border-box;
  display:        flex;
  align-items:    center;
  width:          100%;
  gap:            var(--ds-account-selector-root-gap);
  padding-left:   var(--ds-account-selector-root-padding);
  background:     var(--ds-account-selector-root-bg-generic);
  border:         var(--ds-account-selector-root-border-width-generic) solid var(--ds-account-selector-root-border-color-generic);
  border-radius:  var(--ds-account-selector-root-border-radius-generic);
  font-family:    inherit;
  text-align:     left;
  cursor:         pointer;
  transition:     border-color 0.12s, background 0.12s;
}

.ds-account-selector-list-item__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-account-selector-icon-left-fg);
}
.ds-account-selector-list-item__icon-left svg {
  width:  var(--ds-account-selector-icon-left-size);
  height: var(--ds-account-selector-icon-left-size);
}

.ds-account-selector-list-item__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-account-selector-root-gap);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-account-selector-root-padding) var(--ds-account-selector-root-padding) var(--ds-account-selector-root-padding) 0;
}

.ds-account-selector-list-item__center {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-spacing-xs);
  flex:           1 1 auto;
  min-width:      0;
  text-align:     left;
}

.ds-account-selector-list-item__header {
  font-size:   var(--ds-fontSize-title-sm);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-xs);
  color:       var(--ds-account-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-account-selector-list-item__detail {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  font-size:   var(--ds-fontSize-body-xs);
  line-height: var(--ds-lineHeight-2xs);
  color:       var(--ds-account-selector-detail-text-fg-default);
  overflow:    hidden;
}
.ds-account-selector-list-item__detail svg { flex-shrink: 0; width: var(--ds-account-selector-detail-icon-size); height: var(--ds-account-selector-detail-icon-size); }
.ds-account-selector-list-item__detail span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ds-account-selector-list-item__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
}

.ds-account-selector-list-item--unselected:hover,
.ds-account-selector-list-item--selected:hover {
  background: var(--ds-account-selector-root-bg-hover);
}
.ds-account-selector-list-item--unselected:active,
.ds-account-selector-list-item--selected:active {
  opacity: var(--ds-account-selector-root-opacity-pressed);
}

.ds-account-selector-list-item--selected {
  border-width: var(--ds-account-selector-root-border-width-focus);
  border-color: var(--ds-account-selector-root-border-color-selected);
}
.ds-account-selector-list-item--error {
  border-width: var(--ds-account-selector-root-border-width-focus);
  border-color: var(--ds-account-selector-root-border-color-error);
}

.ds-account-selector-list-item:has(:focus-visible) {
  box-shadow: 0 0 0 var(--ds-account-selector-root-border-width-focus) var(--ds-account-selector-root-border-color-focus-inner);
}

.ds-account-selector-list-item--dataHidden { cursor: default; }

.ds-account-selector-list-item--disabled {
  background:   var(--ds-account-selector-root-bg-disabled);
  border-color: var(--ds-account-selector-root-border-color-disabled);
  cursor:       not-allowed;
}
.ds-account-selector-list-item--disabled .ds-account-selector-list-item__icon-left { color: var(--ds-account-selector-icon-left-fg-disabled); }
.ds-account-selector-list-item--disabled .ds-account-selector-list-item__header { color: var(--ds-account-selector-header-fg-disabled); }
.ds-account-selector-list-item--disabled .ds-account-selector-list-item__detail { color: var(--ds-account-selector-detail-text-fg-disabled); }
`;

injectStyles('ds-account-selector-list-item', css);

export const AccountSelectorListItem = forwardRef(function AccountSelectorListItem({
  data             = 'single',       // 'single' | 'multiple'
  state,                              // 'error' | 'disabled' | 'dataHidden'
  headerText       = 'Cuenta',
  amount,
  currency,
  amountType       = 'positive',
  detailText,
  selected         = false,
  onSelectedChange,
  onClick,
  disabled         = false,
  id,
}, forwardedRef) {

  const isDisabled   = disabled || state === 'disabled';
  const isError      = state === 'error';
  const isDataHidden = state === 'dataHidden';

  const rootClasses = [
    'ds-account-selector-list-item',
    isError      ? 'ds-account-selector-list-item--error'      : '',
    isDataHidden ? 'ds-account-selector-list-item--dataHidden'  : '',
    isDisabled   ? 'ds-account-selector-list-item--disabled'    : (selected ? 'ds-account-selector-list-item--selected' : 'ds-account-selector-list-item--unselected'),
  ].filter(Boolean).join(' ');

  const mask = (text) => (isDataHidden ? '••••••••' : text);

  function handleRowClick(e) {
    if (isDisabled) return;
    onSelectedChange?.(!selected);
    onClick?.(e);
  }

  const SelectionControl = data === 'multiple' ? Checkbox : Radio;

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={rootClasses}
      aria-disabled={isDisabled || undefined}
      onClick={handleRowClick}
    >
      <span className="ds-account-selector-list-item__icon-left">
        <Icon name="file-text" size="xs" />
      </span>

      <span className="ds-account-selector-list-item__content">
        <span className="ds-account-selector-list-item__center">
          <span className="ds-account-selector-list-item__header">{mask(headerText)}</span>

          {amount != null && !isDataHidden && (
            <AmountView amount={amount} currency={currency} type={amountType} />
          )}

          {detailText && (
            <span className="ds-account-selector-list-item__detail">
              <Icon name="link" size="2xs" />
              <span>{mask(detailText)}</span>
            </span>
          )}
        </span>

        <span className="ds-account-selector-list-item__right">
          <SelectionControl
            checked={selected}
            state={isDisabled ? 'disabled' : 'default'}
            ariaLabel={headerText}
            onChange={() => {}}
          />
        </span>
      </span>
    </div>
  );
});

AccountSelectorListItem.displayName = 'AccountSelectorListItem';
export default AccountSelectorListItem;
