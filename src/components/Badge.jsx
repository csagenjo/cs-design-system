import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-badge {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  box-sizing:      border-box;
  min-width:       var(--ds-badge-min-width);
  padding:         0 var(--ds-badge-padding-hor-default);
  border-radius:   var(--ds-badge-border-radius);
  font-family:     inherit;
  font-size:       12px;
  font-weight:     700;
  line-height:     18px;
  color:            var(--ds-badge-fg-label);
  white-space:     nowrap;
}
.ds-badge--expanded { padding: var(--ds-badge-padding-ver-expanded) var(--ds-badge-padding-hor-expanded); }

.ds-badge--default   { background: var(--ds-badge-bg-default); }
.ds-badge--primary   { background: var(--ds-badge-bg-primary); }
.ds-badge--secondary { background: var(--ds-badge-bg-secondary); }
.ds-badge--tertiary  { background: var(--ds-badge-bg-tertiary); }
`;

injectStyles('ds-badge', css);

export function Badge({
  color = 'default',
  size  = 'default',
  label,
  ariaLabel,
}) {
  const className = [
    'ds-badge',
    `ds-badge--${color}`,
    size === 'expanded' ? 'ds-badge--expanded' : '',
  ].filter(Boolean).join(' ');

  return (
    <span className={className} aria-label={ariaLabel}>
      {label}
    </span>
  );
}

Badge.displayName = 'Badge';
export default Badge;
