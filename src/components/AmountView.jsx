import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-amount-view {
  display:         inline-flex;
  align-items:     center;
  align-self:       flex-start; /* hug content — nunca estirar en un padre flex-column */
  flex:             0 0 auto;
  gap:              var(--ds-amount-view-gap);
  box-sizing:       border-box;
  padding:          var(--ds-amount-view-padding-ver) var(--ds-amount-view-padding-hor);
  border-radius:    var(--ds-amount-view-border-radius);
  font-family:      inherit;
  font-size:        var(--ds-fontSize-label-sm);
  line-height:      var(--ds-lineHeight-2xs);
  white-space:      nowrap;
}

.ds-amount-view--positive.ds-amount-view--emphasis { background: var(--ds-amount-view-bg-positive-solid); color: var(--ds-amount-view-fg-onColor); }
.ds-amount-view--negative.ds-amount-view--emphasis { background: var(--ds-amount-view-bg-negative-solid); color: var(--ds-amount-view-fg-onColor); }
.ds-amount-view--positive.ds-amount-view--subtle   { background: var(--ds-amount-view-bg-positive-subtle); color: var(--ds-amount-view-fg-positive-subtle); }
.ds-amount-view--negative.ds-amount-view--subtle   { background: var(--ds-amount-view-bg-negative-subtle); color: var(--ds-amount-view-fg-negative-subtle); }
`;

injectStyles('ds-amount-view', css);

export function AmountView({
  amount,
  currency,
  type     = 'positive',
  emphasis = 'emphasis',
}) {
  const className = [
    'ds-amount-view',
    `ds-amount-view--${type}`,
    `ds-amount-view--${emphasis}`,
  ].join(' ');

  return (
    <div className={className}>
      <span>{amount}</span>
      <span>{currency}</span>
    </div>
  );
}

AmountView.displayName = 'AmountView';
export default AmountView;
