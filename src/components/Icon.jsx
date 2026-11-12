/**
 * Icon — Componente atómico
 * CS Design System · v1.1 (12/11/2026: trazo fijo de 2 en todos los tamaños, como Figma)
 *
 * Wrapper genérico para iconos Lucide (mapa único en `icons.js`). Desde el
 * 10/11 todo el sistema pasa por aquí: ningún componente importa lucide-react.
 *
 * Trazo (12/11, decisión de Carol): fijo de 2 en todos los tamaños, como la
 * variable `icon-stroke` de la librería Lucide en Figma (`absoluteStrokeWidth`).
 * Antes era 1,75 y escalaba con el tamaño (a 16 quedaba en ~1,2 px).
 *
 * Tamaño: prop `size`, keyword de la escala --ds-sizing-* (2xs..3xl).
 * Color: SIEMPRE heredado vía currentColor desde el contenedor — Icon no fija
 * color propio. Regla de CLAUDE.md: nunca referenciar tokens de Mode (--ds-fg-*)
 * directamente desde JSX; el color se controla fijando `color` en el CSS del
 * componente consumidor (p. ej. `--ds-selector-icon-fg-primary`), nunca aquí.
 *
 * Espejo de la escala de tamaños --ds-sizing-* (tokens.css) — Lucide necesita
 * un número, no puede leer var(--ds-sizing-*) directamente.
 */
import React from 'react';
import { ICONS } from './icons';

// Espejo de icon-stroke (librería Lucide en Figma): 2 px reales en cualquier tamaño.
const STROKE = 2;

const SIZE_PX = {
  '2xs': 16,
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
  '2xl': 56,
  '3xl': 64,
};

// A11y-3: `label` para el raro caso de un icono con significado propio (sin
// texto al lado) → role="img" + aria-label. Sin label es decorativo.
export function Icon({ name, size = 'sm', label, className }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) return null;
  return (
    <IconComponent
      size={SIZE_PX[size] ?? SIZE_PX.sm}
      strokeWidth={STROKE}
      absoluteStrokeWidth
      className={className}
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      focusable="false"
    />
  );
}
