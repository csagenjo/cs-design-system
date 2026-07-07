import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-badge-highlight {
  display:        inline-flex;
  align-items:    center;
  box-sizing:     border-box;
  height:         var(--ds-badge-highlight-height);
  gap:            var(--ds-badge-highlight-gap);
  padding:        var(--ds-badge-highlight-padding-ver) var(--ds-badge-highlight-padding-hor);
  border:         1px solid transparent;
  border-radius:  var(--ds-badge-highlight-border-radius);
  font-family:    inherit;
  font-size:      var(--ds-fontSize-label-xs);
  line-height:    var(--ds-lineHeight-3xs);
  color:          var(--ds-badge-highlight-label-fg);
  white-space:    nowrap;
}

.ds-badge-highlight__icon {
  flex-shrink: 0;
  display:     flex;
}
.ds-badge-highlight__icon svg {
  width:  var(--ds-badge-highlight-icon-size);
  height: var(--ds-badge-highlight-icon-size);
}

.ds-badge-highlight--emphasis {
  background:   var(--ds-badge-highlight-bg-emphasis);
  border-color: var(--ds-badge-highlight-icon-fg-emphasis);
}
.ds-badge-highlight--emphasis .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-emphasis); }

.ds-badge-highlight--neutral {
  background:   var(--ds-badge-highlight-bg-neutral);
  border-color: var(--ds-badge-highlight-icon-fg-neutral);
}
.ds-badge-highlight--neutral .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-neutral); }

.ds-badge-highlight--positive {
  background:   var(--ds-badge-highlight-bg-positive);
  border-color: var(--ds-badge-highlight-icon-fg-positive);
}
.ds-badge-highlight--positive .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-positive); }

.ds-badge-highlight--negative {
  background:   var(--ds-badge-highlight-bg-negative);
  border-color: var(--ds-badge-highlight-icon-fg-negative);
}
.ds-badge-highlight--negative .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-negative); }

.ds-badge-highlight--disabled {
  background:   var(--ds-badge-highlight-bg-disabled);
  border-color: var(--ds-badge-highlight-bg-disabled);
  color:        var(--ds-badge-highlight-label-fg-disabled);
}
.ds-badge-highlight--disabled .ds-badge-highlight__icon { color: var(--ds-badge-highlight-icon-fg-disabled); }
`;

injectStyles('ds-badge-highlight', css);

export function BadgeHighlight({
  variant  = 'neutral',   // 'emphasis' | 'neutral' | 'positive' | 'negative'
  disabled = false,
  label,
  icon,
  ariaLabel,
}) {
  const className = [
    'ds-badge-highlight',
    disabled ? 'ds-badge-highlight--disabled' : `ds-badge-highlight--${variant}`,
  ].join(' ');

  return (
    <span className={className} aria-label={ariaLabel}>
      {icon && <span className="ds-badge-highlight__icon" aria-hidden="true">{icon}</span>}
      {label}
    </span>
  );
}

BadgeHighlight.displayName = 'BadgeHighlight';
export default BadgeHighlight;
