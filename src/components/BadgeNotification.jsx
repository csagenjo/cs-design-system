import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-badge-notification {
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
  box-sizing:      border-box;
  min-width:       var(--ds-badge-notification-min-width);
  padding:         0 var(--ds-badge-notification-padding-hor-default);
  border-radius:   var(--ds-badge-notification-border-radius);
  font-family:     inherit;
  font-size:       var(--ds-fontSize-label-xs);
  font-weight:     var(--ds-font-weight-bold);
  line-height:     var(--ds-lineHeight-3xs);
  color:            var(--ds-badge-notification-fg-label);
  white-space:     nowrap;
}
.ds-badge-notification--expanded { padding: var(--ds-badge-notification-padding-ver-expanded) var(--ds-badge-notification-padding-hor-expanded); }

.ds-badge-notification--default   { background: var(--ds-badge-notification-bg-default); }
.ds-badge-notification--primary   { background: var(--ds-badge-notification-bg-primary); }
.ds-badge-notification--secondary { background: var(--ds-badge-notification-bg-secondary); }
.ds-badge-notification--tertiary  { background: var(--ds-badge-notification-bg-tertiary); }

.ds-badge-notification--disabled {
  background: var(--ds-badge-notification-bg-disabled);
  color:      var(--ds-badge-notification-fg-label-disabled);
}
`;

injectStyles('ds-badge-notification', css);

export function BadgeNotification({
  color    = 'default',
  size     = 'default',
  disabled = false,
  label,
  ariaLabel,
}) {
  const className = [
    'ds-badge-notification',
    disabled ? 'ds-badge-notification--disabled' : `ds-badge-notification--${color}`,
    size === 'expanded' ? 'ds-badge-notification--expanded' : '',
  ].filter(Boolean).join(' ');

  return (
    <span className={className} aria-label={ariaLabel}>
      {label}
    </span>
  );
}

BadgeNotification.displayName = 'BadgeNotification';
export default BadgeNotification;
