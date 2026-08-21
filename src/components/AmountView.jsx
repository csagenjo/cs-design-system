/**
 * AmountView — Componente atómico · v2
 * CS Design System
 *
 * Dos capas del mismo componente de Figma:
 *   · `.Amount` (3218:4761) — primitivo de texto sin color de estado:
 *       size (12/14/16/19) × isoPlacement (left/right) × amountWeight (bold/regular)
 *   · `Amount View` (3223:1904) — pastilla con estado:
 *       highlight (neutral|emphasis|subtle|disabled) × type (positive|negative)
 *
 * Matriz de fondo/texto (asimetría INTENCIONAL de Figma — positivo se queda sin
 * marca en neutral/disabled, negativo siempre lleva fondo). subtle = fondo pálido
 * + texto NEGRO (fg-generic), no texto de color:
 *
 *   highlight × type   | bg                  | fg
 *   neutral  + positive| (ninguno)           | fg-generic
 *   neutral  + negative| bg-neutral  #EEEFF1 | fg-generic
 *   emphasis + positive| bg-positive-solid   | fg-onColor
 *   emphasis + negative| bg-negative-solid   | fg-onColor
 *   subtle   + positive| bg-positive-soft    | fg-generic
 *   subtle   + negative| bg-negative-soft    | fg-generic
 *   disabled + positive| (ninguno)           | fg-disabled
 *   disabled + negative| bg-disabled #EEEFF1 | fg-disabled
 *
 * Tokens: --ds-amount-view-* (Componente→Mode). Tipografía directa de Device.
 *
 * USO:
 *   <AmountView amount="1.250,00" currency="€" highlight="emphasis" type="positive" />
 *   <AmountView amount="-40,00" currency="€" highlight="subtle" type="negative" size="md" />
 *   <AmountView amount="99,00" currency="USD" isoPlacement="left" amountWeight="bold" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';

const SIZE_FONT = {
  xs: 'var(--ds-fontSize-label-xs)',  // 12
  sm: 'var(--ds-fontSize-label-sm)',  // 14
  md: 'var(--ds-fontSize-label-md)',  // 16
  lg: 'var(--ds-fontSize-label-lg)',  // 19
};
const SIZE_LH = {
  xs: 'var(--ds-lineHeight-3xs)',     // 18
  sm: 'var(--ds-lineHeight-2xs)',     // 21
  md: 'var(--ds-lineHeight-xs)',      // 24
  lg: 'var(--ds-lineHeight-sm)',      // 28.5
};

const css = `
.ds-amount-view {
  display:        inline-flex;
  align-items:    center;
  align-self:     flex-start; /* hug content — nunca estirar en un padre flex-column */
  flex:           0 0 auto;
  gap:            var(--ds-amount-view-gap);
  box-sizing:     border-box;
  padding:        var(--ds-amount-view-padding-ver) var(--ds-amount-view-padding-hor);
  border-radius:  var(--ds-amount-view-border-radius);
  font-family:    inherit;
  white-space:    nowrap;
  color:          var(--ds-amount-view-fg-generic); /* neutral/subtle → texto negro */
}

/* amountWeight */
.ds-amount-view--bold    { font-weight: var(--ds-font-weight-bold);    }
.ds-amount-view--regular { font-weight: var(--ds-font-weight-regular); }

/* isoPlacement: left invierte el orden visual amount ↔ iso */
.ds-amount-view--iso-left { flex-direction: row-reverse; }

/* ── Fondo + texto por highlight × type ──────────────────────────────────── */
.ds-amount-view--emphasis.ds-amount-view--positive { background: var(--ds-amount-view-bg-positive-solid); color: var(--ds-amount-view-fg-onColor); }
.ds-amount-view--emphasis.ds-amount-view--negative { background: var(--ds-amount-view-bg-negative-solid); color: var(--ds-amount-view-fg-onColor); }

.ds-amount-view--subtle.ds-amount-view--positive   { background: var(--ds-amount-view-bg-positive-soft); }
.ds-amount-view--subtle.ds-amount-view--negative   { background: var(--ds-amount-view-bg-negative-soft); }

.ds-amount-view--neutral.ds-amount-view--negative   { background: var(--ds-amount-view-bg-neutral); }
/* neutral+positive → sin fondo (hereda color fg-generic del base) */

.ds-amount-view--disabled                           { color: var(--ds-amount-view-fg-disabled); }
.ds-amount-view--disabled.ds-amount-view--negative  { background: var(--ds-amount-view-bg-disabled); }
/* disabled+positive → sin fondo */
`;

injectStyles('ds-amount-view', css);

export function AmountView({
  amount,
  currency,
  highlight    = 'neutral',   // 'neutral' | 'emphasis' | 'subtle' | 'disabled'
  type         = 'positive',  // 'positive' | 'negative'
  size         = 'sm',        // 'xs' | 'sm' | 'md' | 'lg'  (12/14/16/19)
  isoPlacement = 'right',     // 'right' | 'left'
  amountWeight = 'regular',   // 'regular' | 'bold'
}) {
  const className = [
    'ds-amount-view',
    `ds-amount-view--${highlight}`,
    `ds-amount-view--${type}`,
    `ds-amount-view--${amountWeight}`,
    isoPlacement === 'left' ? 'ds-amount-view--iso-left' : '',
  ].filter(Boolean).join(' ');

  const typo = {
    fontSize:   SIZE_FONT[size] ?? SIZE_FONT.sm,
    lineHeight: SIZE_LH[size] ?? SIZE_LH.sm,
  };

  return (
    <div className={className} style={typo}>
      <span>{amount}</span>
      {currency != null && <span>{currency}</span>}
    </div>
  );
}

AmountView.displayName = 'AmountView';
export default AmountView;
