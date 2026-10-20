/**
 * Headline — Componente atómico
 * CS Design System · v2.0
 *
 * Títulos semánticos h1–h6. 6 tamaños × 4 colores.
 *
 * Tokens: color vía --ds-headline-fg-* (Componente→Mode). Tipografía directa de
 * Device (fontSize/headline/*, fontFamily/headline, fontWeight/bold) — sin
 * token de Componente, según la regla de tipografía (CLAUDE.md §5). Bold en
 * las 24 variantes (h1-h6 × 4 colores), no solo h1 — cambiado 22/09.
 *
 * `level` y `size` SEPARADOS (v2, 20/10/2026 — audit §I, decisión de Carol):
 *   · `level` (1–6) = la etiqueta HTML h1–h6. Depende de dónde va el título en
 *     el esquema de la página, NUNCA de lo grande que se quiere ver.
 *   · `size` ('2xl'…'xs') = solo el aspecto. Por defecto sigue al level
 *     (1→2xl … 6→xs), así que todo el código anterior se ve igual.
 *   Antes iban bloqueados y se elegía nivel por tamaño (SidebarMenu usaba un
 *   h6 para un título pequeño → orden de encabezados roto).
 *   Figma: propiedad `Size` (2xl…xs, antes `Variant` h1…h6); el nivel se anota
 *   en cada instancia.
 * Los 6 tamaños son RESPONSIVE vía tokens Device (mobile-first, 28/09/2026 —
 * el componente no tiene media queries propias, las resuelve tokens.css):
 *   size  token             Mobile   Tablet   Desktop   (fontSize/lineHeight)
 *   2xl   headline/2xl      32/40    40/48    48/60
 *   xl    headline/xl       28/36    32/40    36/44
 *   lg    headline/lg       24/28    28/36    32/40
 *   md    headline/md       22/28    24/28    28/36
 *   sm    headline/sm       19/24    22/28    24/28
 *   xs    headline/xs       16/20    19/24    19/24
 *   line-height = 1.25× redondeado al múltiplo de 4 más cercano (empate → abajo),
 *   29/09 — rejilla de 4 de tipografía; la lectura (body/label/title) va a 1.5×.
 *
 * El level NUNCA cambia por device (Carol, accesibilidad: un solo h1 real por
 * página) — solo el tamaño. Sustituye al h1 de 3 tiers propio (19/28/48) que
 * existía antes de que Device fuera responsive en Figma.
 *
 * Reglas de uso (no solo de estilo):
 *   · Alineación SOLO a la izquierda — son h1–h3 semánticos, no se centran.
 *   · SIN truncamiento con "…" — decisión de accesibilidad: si no cabe, se
 *     ajusta a más líneas, nunca se recorta (perdería info para lectores).
 *   · h1 reservado al título de página completa. En tabla usar h2/h3.
 *
 * USO:
 *   <Headline level={1}>Título de página</Headline>
 *   <Headline level={2} size="xs">Título de navegación (h2 pequeño)</Headline>
 *   <Headline level={2} color="primary">Sección</Headline>
 *   <Headline level={3} color="onColor">Sobre fondo de color</Headline>
 */

import React from 'react';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-headline {
  margin:         0;
  font-family:    inherit;                        /* Nunito (fontFamily/headline) */
  font-weight:    var(--ds-font-weight-bold);     /* 700 — cambiado 22/09, Carol, las 24 variantes de Figma (h1-h6 × 4 colores) son Bold */
  text-align:     left;                           /* regla: solo izquierda */
  overflow-wrap:  break-word;                     /* ajusta a varias líneas, nunca "…" */
  color:          var(--ds-headline-fg-default);
}

/* Tamaño = size (fontSize + lineHeight emparejados por rol, responsive vía tokens Device) */
.ds-headline--2xl { font-size: var(--ds-fontSize-headline-2xl); line-height: var(--ds-lineHeight-headline-2xl); }
.ds-headline--xl  { font-size: var(--ds-fontSize-headline-xl);  line-height: var(--ds-lineHeight-headline-xl);  }
.ds-headline--lg  { font-size: var(--ds-fontSize-headline-lg);  line-height: var(--ds-lineHeight-headline-lg);  }
.ds-headline--md  { font-size: var(--ds-fontSize-headline-md);  line-height: var(--ds-lineHeight-headline-md);  }
.ds-headline--sm  { font-size: var(--ds-fontSize-headline-sm);  line-height: var(--ds-lineHeight-headline-sm);  }
.ds-headline--xs  { font-size: var(--ds-fontSize-headline-xs);  line-height: var(--ds-lineHeight-headline-xs);  }

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

const SIZES = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];          // índice = level - 1

export function Headline({
  level = 1,          // 1..6 → h1..h6 (solo la etiqueta)
  size,               // '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' — por defecto, el del level
  color = 'default',  // 'default' | 'primary' | 'secondary' | 'onColor'
  children,
  id,
  className,
}) {
  injectStyles();

  const lvl = Math.min(6, Math.max(1, level));
  const Tag = `h${lvl}`;
  const resolvedSize = SIZES.includes(size) ? size : SIZES[lvl - 1];

  const classes = [
    'ds-headline',
    `ds-headline--${resolvedSize}`,
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
