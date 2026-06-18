import React from 'react';
import { ChevronRight } from 'lucide-react';

const css = `
.ds-link--xs { --_fs: var(--ds-fontSize-label-xs); --_lh: var(--ds-fontLheight-3xs); --_icon: 12; }
.ds-link--sm { --_fs: var(--ds-fontSize-label-sm); --_lh: var(--ds-fontLheight-2xs); --_icon: 14; }
.ds-link--md { --_fs: var(--ds-fontSize-label-md); --_lh: var(--ds-fontLheight-xs);  --_icon: 16; }
.ds-link--lg { --_fs: var(--ds-fontSize-label-lg); --_lh: var(--ds-fontLheight-sm);  --_icon: 18; }

.ds-link {
  display:         inline-flex;
  align-items:     center;
  gap:             4px;
  font-size:       var(--_fs);
  line-height:     var(--_lh);
  font-weight:     var(--ds-fontWeight-regular);
  font-family:     var(--ds-fontFamily-default);
  text-decoration: none;
  cursor:          pointer;
  border-radius:   2px;
  transition:      background 0.12s, opacity 0.12s;
}

.ds-link__text { border-bottom: 1px solid; }

/* ── Default ── */
.ds-link--default                         { color: var(--ds-link-fg-default); }
.ds-link--default .ds-link__text          { border-bottom-color: var(--ds-link-border-default); }
.ds-link--default .ds-link__icon          { color: var(--ds-link-icon-default); }
.ds-link--default:visited .ds-link__text  { border-bottom-color: var(--ds-link-border-visited); }

/* ── Accent ── */
.ds-link--accent                          { color: var(--ds-link-fg-accent); }
.ds-link--accent .ds-link__text           { border-bottom-color: var(--ds-link-border-accent-light); }
.ds-link--accent .ds-link__icon           { color: var(--ds-link-icon-accent); }
.ds-link--accent:visited                  { color: var(--ds-link-fg-accent-visited); }
.ds-link--accent:visited .ds-link__text   { border-bottom-color: var(--ds-link-border-visited); }
.ds-link--accent:visited .ds-link__icon   { color: var(--ds-link-icon-visited); }

/* ── Emphasis ── */
.ds-link--emphasis-medium { font-weight: var(--ds-fontWeight-bold); }

/* ── Hover ── */
.ds-link:hover { background: var(--ds-link-bg-hover); }

/* ── Focus ── */
.ds-link:focus-visible {
  outline:    none;
  box-shadow: 0 0 0 2px var(--ds-link-focus-inner), 0 0 0 4px var(--ds-link-focus-outer);
}

/* ── Active ── */
.ds-link:active { opacity: 0.8; }

/* ── SR-only (enlace externo) ── */
.ds-link .sr-only {
  position:    absolute;
  width:       1px;
  height:      1px;
  padding:     0;
  margin:      -1px;
  overflow:    hidden;
  clip:        rect(0,0,0,0);
  white-space: nowrap;
  border:      0;
}
`;

let _styleInjected = false;
function injectStyles() {
  if (_styleInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  _styleInjected = true;
}
injectStyles();

export function Link({
  variant   = 'default',
  size      = 'sm',
  emphasis  = 'low',
  leftIcon  = false,
  rightIcon = true,
  external  = false,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
  children,
  ...rest
}) {
  const iconSize    = { xs: 12, sm: 14, md: 16, lg: 18 }[size];
  const strokeWidth = emphasis === 'medium' ? 2.5 : 1.75;

  const resolvedTarget = target ?? (external ? '_blank'              : undefined);
  const resolvedRel    = rel    ?? (external ? 'noopener noreferrer' : undefined);

  const classes = [
    'ds-link',
    `ds-link--${size}`,
    `ds-link--${variant}`,
    emphasis === 'medium' ? 'ds-link--emphasis-medium' : '',
  ].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {leftIcon  && <ChevronRight size={iconSize} strokeWidth={strokeWidth} className="ds-link__icon" aria-hidden="true" />}
      <span className="ds-link__text">{children}</span>
      {rightIcon && <ChevronRight size={iconSize} strokeWidth={strokeWidth} className="ds-link__icon" aria-hidden="true" />}
      {external  && <span className="sr-only">(opens in new tab)</span>}
    </a>
  );
}

export default Link;
