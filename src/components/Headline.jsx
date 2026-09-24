/**
 * Headline — Componente atómico
 * CS Design System · v1.0
 *
 * Títulos semánticos h1–h6. 6 tamaños × 4 colores.
 *
 * Tokens: color vía --ds-headline-fg-* (Componente→Mode). Tipografía directa de
 * Device (fontSize/headline/*, fontFamily/headline, fontWeight/bold) — sin
 * token de Componente, según la regla de tipografía (CLAUDE.md §5). Bold en
 * las 24 variantes (h1-h6 × 4 colores), no solo h1 — cambiado 22/09.
 *
 * `level` fija a la vez la etiqueta HTML y el tamaño (van bloqueados):
 *   level 1 → h1 · 2xl (48, 32 en mobile/tablet — ver responsive abajo)
 *   level 2 → h2 · xl (36)    level 5 → h5 · sm (24)
 *   level 3 → h3 · lg (32)    level 6 → h6 · xs (19)
 *
 * h1 RESPONSIVE (añadido 22/09, Page Title) — 48px se veía desproporcionado
 * en Layout=Horizontal/Vertical de Page Title (Content de 24px de alto).
 * Carol: la etiqueta debe seguir siendo h1 siempre (es el título real de la
 * página — bajar a level=5/6 rompería la semántica, solo debe haber un h1
 * por página), así que el tamaño se resuelve por CSS (media query 1023px,
 * mismo corte que TopNavigation/Page Title) en vez de por prop — 32px por
 * debajo, 48px por encima. Mismo patrón que Device Mobile/Desk ya resuelve
 * en Figma (fontSize/headline/2xl-mobile=32 / -desk=48, antes id��nticos).
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
  font-weight:    var(--ds-font-weight-bold);     /* 700 — cambiado 22/09, Carol, las 24 variantes de Figma (h1-h6 × 4 colores) son Bold */
  text-align:     left;                           /* regla: solo izquierda */
  overflow-wrap:  break-word;                     /* ajusta a varias líneas, nunca "…" */
  color:          var(--ds-headline-fg-default);
}

/* Tamaño = level (fontSize + lineHeight bloqueados) */
.ds-headline--1 { font-size: var(--ds-fontSize-headline-2xl); line-height: var(--ds-lineHeight-xl);  } /* 48/48 desktop */
.ds-headline--2 { font-size: var(--ds-fontSize-headline-xl);  line-height: var(--ds-lineHeight-md);  } /* 36/36 */
.ds-headline--3 { font-size: var(--ds-fontSize-headline-lg);  line-height: var(--ds-lineHeight-md);  } /* 32/36 */
.ds-headline--4 { font-size: var(--ds-fontSize-headline-md);  line-height: var(--ds-lineHeight-sm);  } /* 28/28.5 */
.ds-headline--5 { font-size: var(--ds-fontSize-headline-sm);  line-height: var(--ds-lineHeight-xs);  } /* 24/24 */
.ds-headline--6 { font-size: var(--ds-fontSize-headline-xs);  line-height: var(--ds-lineHeight-2xs); } /* 19/21 */

/* h1 responsive — la ETIQUETA se queda h1 siempre (sigue siendo el título real
   de la página, level nunca cambia por device), solo el TAMAÑO se adapta.
   Mismo corte que TopNavigation/Page Title (1024px) y mismo mecanismo (CSS
   decide, no una prop de nivel) — Device/Mobile en Figma ya lo resuelve a 32
   (headline/2xl-mobile), Desk se queda en 48. Pedido explícito de Carol: no
   bajar a h5/h6 visualmente aunque el tamaño se reduzca, eso rompería la
   semántica del documento (solo debe existir un h1 real por página). */
@media (max-width: 1023px) {
  .ds-headline--1 { font-size: var(--ds-fontSize-headline-2xl-mobile); line-height: var(--ds-lineHeight-md); } /* 32/36 mobile/tablet */
}

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
