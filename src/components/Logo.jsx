/**
 * Logo — Átomo
 * CS Design System · v1 (24/11/2026, alineado con Figma `Logo` 33133:486)
 *
 * El logo de una empresa u organización, sin marco, sin fondo y sin sombra:
 * alto fijo por tipo y el ancho que pida el archivo (width auto), así la
 * proporción la pone el logo. Sin max-width: un wordmark muy largo es señal
 * de que el archivo trae márgenes vacíos.
 *   type="wordmark" (por defecto): el nombre escrito, más ancho que 1.5:1 →
 *     alto `logo/wordmark/height/generic` (40).
 *   type="symbol": cuadrado, alto o hasta 1.5:1 → alto
 *     `logo/symbol/height/generic` (56), un paso más para que pese lo mismo.
 *
 * Sin `src` pinta el placeholder de Figma: gris `logo/all/bg/placeholder/generic`
 * con su radio, a la proporción de la variante (Wordmark 160 × 40, Symbol 56 × 56).
 * El gris y el radio solo existen en el placeholder.
 *
 * Accesibilidad: `alt` es obligatoria y nombra la empresa ("Company name"),
 * nunca "logo". `alt=""` es válido cuando el nombre ya está escrito al lado.
 * Si falta, aviso en desarrollo.
 *
 * USO:
 *   <Logo src="/company-wordmark.svg" alt="Company name" />
 *   <Logo type="symbol" src="/company-symbol.svg" alt="" />  // el nombre va al lado
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { warnOnce } from './_devWarn';

const css = `
.ds-logo {
  display: block;
  width:   auto;
  height:  var(--ds-logo-wordmark-height-generic);
}
.ds-logo--symbol { height: var(--ds-logo-symbol-height-generic); }
.ds-logo--placeholder {
  aspect-ratio:  4 / 1;  /* proporción de la variante Wordmark en Figma (160 × 40) */
  background:    var(--ds-logo-bg-placeholder-generic);
  border-radius: var(--ds-logo-border-radius-placeholder-generic);
}
.ds-logo--symbol.ds-logo--placeholder { aspect-ratio: 1 / 1; }
`;

injectStyles('ds-logo', css);

export function Logo({
  src,
  alt,                  // obligatoria: el nombre de la empresa, o '' si está escrito al lado
  type = 'wordmark',    // 'wordmark' | 'symbol'
  className,
  style,
}) {
  if (alt === undefined || alt === null) {
    warnOnce('Logo.alt', '[DS Logo] `alt` es obligatoria: pon el nombre de la empresa, o "" si el nombre ya está escrito al lado.');
  }
  const kind = type === 'symbol' ? 'symbol' : 'wordmark';
  const classes = [
    'ds-logo',
    `ds-logo--${kind}`,
    src ? '' : 'ds-logo--placeholder',
    className || '',
  ].filter(Boolean).join(' ');

  if (!src) {
    return alt
      ? <span className={classes} style={style} role="img" aria-label={alt} />
      : <span className={classes} style={style} aria-hidden="true" />;
  }
  return <img className={classes} style={style} src={src} alt={alt ?? ''} />;
}

Logo.displayName = 'Logo';
export default Logo;
