/**
 * Icon — Componente atómico
 * CS Design System · v1.0
 *
 * Wrapper genérico para iconos Lucide. Punto único de mantenimiento para
 * tamaño (Button.jsx e InputText.jsx aún no lo adoptan — mantienen su propia
 * lógica local hasta una sesión de migración aparte).
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

export function Icon({ name, size = 'sm', strokeWidth = 1.75, className }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) return null;
  return (
    <IconComponent
      size={SIZE_PX[size] ?? SIZE_PX.sm}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
