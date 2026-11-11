/**
 * CountryFlag — Componente atómico
 * CS Design System · v2 (11/11/2026, alineado con Figma `CountryFlag`)
 *
 * Bandera real a color desde el registro `flags.js` (201 países). En Figma el
 * set `CountryFlag` (704:9237) vive en la librería de iconos (archivo
 * ITpZmEHLpvXDLCnalyGCmj), no en el archivo del DS: 201 variantes `Country=…`,
 * todas 22×16, radio 2, recortadas. No es un icono: no usa currentColor.
 *
 * Un solo tamaño, como Figma (v2 quita `size`, que no existía en Figma).
 * Tamaño y radio por token: --ds-country-flag-width/height (literales de
 * Figma, el asset no está en la escala sizing) y --ds-country-flag-border-radius
 * → border-radius/xs (`countryFlag/all/root/borderRadius/generic`, nuevo).
 *
 * El SVG se inyecta vía data URI en un <img>, nunca dangerouslySetInnerHTML.
 *
 * Accesibilidad: decorativa por defecto (va junto al nombre o al prefijo);
 * `label` ("Spain") solo cuando la bandera es la única pista del país.
 *
 * USO:
 *   <CountryFlag country="spain" />
 *   <CountryFlag country="france" label="France" />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { FLAGS } from './flags';

const css = `
.ds-country-flag {
  display:       block;
  flex-shrink:   0;
  width:         var(--ds-country-flag-width);
  height:        var(--ds-country-flag-height);
  border-radius: var(--ds-country-flag-border-radius);
}
`;

injectStyles('ds-country-flag', css);

export function CountryFlag({ country, label, className }) {
  const svg = FLAGS[country];
  if (!svg) return null;
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      alt={label || ''}
      aria-hidden={label ? undefined : 'true'}
      className={['ds-country-flag', className || ''].filter(Boolean).join(' ')}
    />
  );
}

CountryFlag.displayName = 'CountryFlag';
export default CountryFlag;
