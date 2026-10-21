/**
 * LiveRegion — Componente atómico (accesibilidad) + `announce()`
 * CS Design System · v1 · sprint A11y-0 (20/10/2026)
 *
 * Problema que resuelve (audit §H): un mensaje de error o de estado que
 * aparece en un elemento con `aria-live` que se monta EN EL MISMO MOMENTO que
 * el mensaje no se anuncia en muchos lectores de pantalla — la región tiene
 * que existir antes de que cambie su contenido. Hoy pasa en los 7 inputs,
 * Checkbox, Radio, Selector, AccountSelector y Snackbar.
 *
 * Dos formas de usarlo:
 *
 * 1. <LiveRegion> — contenedor PERSISTENTE. Se monta siempre (aunque esté
 *    vacío) y lo que cambia es su contenido. El contenido se ve con normalidad
 *    (`visuallyHidden` para que no se vea).
 *
 *      <LiveRegion>{error && <ValidationMessage>{error}</ValidationMessage>}</LiveRegion>
 *
 *    Ojo: si la región está fuera de un Dialog abierto, queda `inert` y no se
 *    anuncia — es lo correcto (el fondo no existe mientras el modal está
 *    abierto). Para avisos globales, usar `announce()`.
 *
 * 2. announce(mensaje, { politeness }) — `import { announce } from './announce'` — para avisos que no tienen un sitio
 *    visible en pantalla: "3 resultados", "Fichero subido", "Sin resultados".
 *    Escribe en una región única por nivel, creada una vez en <body> y nunca
 *    marcada como `inert` por useModal (lleva `data-ds-live-region`).
 *    Repetir el mismo mensaje lo vuelve a anunciar.
 *
 * politeness:
 *   'polite'    (default) espera a que el lector termine — estado, resultados
 *   'assertive' interrumpe — SOLO errores que bloquean la tarea
 *
 * Sin tokens: no pinta nada propio.
 */
import React from 'react';
import { VISUALLY_HIDDEN_CLASS } from './VisuallyHidden';
import { injectStyles } from './_inputBase';

/* A11y-4: vacía no ocupa sitio — si no, dentro de un contenedor flex con
   `gap` (Checkbox, Radio) añadía un hueco aunque no hubiera mensaje. Sigue en
   el árbol de accesibilidad (no es display:none), así que el mensaje que entre
   después se anuncia igual. */
injectStyles('ds-live-region', `
.ds-live-region:empty { position: absolute; }
`);

/* `announce()` vive en ./announce.js (un archivo de componente solo puede
   exportar componentes — Fast Refresh). */

export function LiveRegion({
  politeness = 'polite',
  atomic = true,
  visuallyHidden = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}) {
  const assertive = politeness === 'assertive';
  const classes = ['ds-live-region', visuallyHidden ? VISUALLY_HIDDEN_CLASS : '', className || ''].filter(Boolean).join(' ');
  return (
    <Tag
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic={atomic ? 'true' : 'false'}
      className={classes || undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default LiveRegion;
