/**
 * CountryFlag — Componente atómico
 * CS Design System · v1.0
 *
 * A diferencia de Icon.jsx (wrapper de lucide-react, iconos de un color vía
 * currentColor), esto renderiza banderas reales multicolor desde el registro
 * `flags.js` (201 países, exportados 1:1 desde Figma `CountryFlag`, node
 * `30831:2867`, fileKey `QiWDJdMPB5pfY3vHy9CqZv`) — no encajan en el
 * mecanismo de Icon, que asume un solo color de trazo.
 *
 * El SVG se inyecta vía data URI en un <img>, nunca dangerouslySetInnerHTML.
 * El radio de esquina (2px sobre el viewBox 22×16 real de Figma) se aplica
 * aquí en el wrapper, no depende de que cada SVG traiga su propio clipPath
 * interno — así las 201 banderas quedan visualmente consistentes aunque
 * alguna (p. ej. saudi-arabia, cuyo SVG excede el límite de export en lote
 * y se obtuvo por una vía distinta) no incluya ese recorte por su cuenta.
 */
import React from 'react';
import { FLAGS } from './flags';

const ASPECT_RATIO = 16 / 22;

export function CountryFlag({ country, size = 22, className }) {
  const svg = FLAGS[country];
  if (!svg) return null;
  const height = Math.round(size * ASPECT_RATIO);
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      width={size}
      height={height}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}
    />
  );
}

export default CountryFlag;
