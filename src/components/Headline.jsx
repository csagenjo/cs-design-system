/**
 * Headline — Componente atómico
 * CS Design System · v1.0
 *
 * Títulos semánticos h1–h6. 6 tamaños × 4 colores.
 *
 * Tokens: color vía --ds-headline-fg-* (Componente→Mode). Tipografía directa de
 * Device (fontSize/headline/*, fontFamily/headline, fontWeight/regular) — sin
 * token de Componente, según la regla de tipografía (CLAUDE.md §5).
 *
 * `level` fija a la vez la etiqueta HTML y el tamaño (van bloqueados):
 *   level 1 → h1 · 2xl (48)   level 4 → h4 · md (28)
 *   level 2 → h2 · xl (36)    level 5 → h5 · sm (24)
 *   level 3 → h3 · lg (32)    level 6 → h6 · xs (19)
 *
 * Reglas de uso (no solo de estilo):
 *   · Alineación SOLO a la izquierda — son h1–h3 semánticos, no se centran.
 *   · SIN truncamiento con "…" — decisión de accesibilidad: si no cabe, se
 *     ajusta a más líneas, nunca se recorta (perdería info para lectores).
 *   · h1 reservado al título de página completa. En tabla usar h2/h3.
 *
 * lineHeight por tamaño: derivado como "menor fontLheight ≥ fontSize"
 * (ancla confirmada: headline/md 28 ↔ fontLheight/sm 28.5). Verificar contra
 * los text styles de Figma si se afinan.
 *
 * USO:
 *   <Headline level={1}>Título de página</Headline>
 *   <Headline level={2} color="primary">Sección</Headline>
 *   <Headline level={3} color="onColor">Sobre fondo de color</Headline>
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-headline {
  margin:         0;
  font-family:    inherit;                        /* Nunito (fontFamily/headline) */
  font-weight:    var(--ds-font-weight-regular);  /* 400 */
  text-align:     left;                           /* regla: solo izquierda */
  overflow-wrap:  break-word;                     /* ajusta a varias líneas, nunca "…" */
  color:          var(--ds-headline-fg-default);
}

/* Tamaño = level (fontSize + lineHeight bloqueados) */
.ds-headline--1 { font-size: var(--ds-fontSize-headline-2xl); line-height: var(--ds-lineHeight-xl);  } /* 48/48 */
.ds-headline--2 { font-size: var(--ds-fontSize-headline-xl);  line-height: var(--ds-lineHeight-md);  } /* 36/36 */
.ds-headline--3 { font-size: var(--ds-fontSize-headline-lg);  line-height: var(--ds-lineHeight-md);  } /* 32/36 */
.ds-headline--4 { font-size: var(--ds-fontSize-headline-md);  line-height: var(--ds-lineHeight-sm);  } /* 28/28.5 */
.ds-headline--5 { font-size: var(--ds-fontSize-headline-sm);  line-height: var(--ds-lineHeight-xs);  } /* 24/24 */
.ds-headline--6 { font-size: var(--ds-fontSize-headline-xs);  line-height: var(--ds-lineHeight-2xs); } /* 19/21 */

/* Color */
.ds-headline--primary   { color: var(--ds-headline-fg-primary);   }
.ds-headline--secondary { color: var(--ds-headline-fg-secondary); }
.ds-headline--onColor   { color: var(--ds-headline-fg-onColor);   }
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── Headline ─────────────────────────────────────────────────────────────── */

export function Headline({
  level = 1,          // 1..6 → h1..h6 (+ tamaño bloqueado)
  color = 'default',  // 'default' | 'primary' | 'secondary' | 'onColor'
  children,
  id,
  className,
}) {
  injectStyles();

  const lvl = Math.min(6, Math.max(1, level));
  const Tag = `h${lvl}`;

  const classes = [
    'ds-headline',
    `ds-headline--${lvl}`,
    color !== 'default' ? `ds-headline--${color}` : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}

export default Headline;
