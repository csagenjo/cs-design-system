/**
 * Paragraph — Componente atómico
 * CS Design System · v1 (17/11/2026, igual que Figma: set "Paragraph", Size × Color)
 *
 * Texto corrido para leer: una introducción, un párrafo de un caso de
 * estudio, una explicación. Parte líneas. Text y DescriptionText son
 * etiquetas de una línea (filas, botones, celdas); Paragraph es para leer.
 *
 * size  → '14' | '16' (por defecto) | '20' | '24'
 *         fontSize/body/xs|sm|md|lg con lineHeight 24 · 24 · 32 · 32.
 *         Letra en pasos de 4 e interlineado en la rejilla de 8, igual en los
 *         tres devices. 24 para entradillas (la introducción de un Hero),
 *         16 para cuerpo, 14 para notas.
 * color → 'default' | 'subtle' | 'onColor' (sobre imagen o superficie de color)
 *
 * Sin variante Bold: el énfasis va dentro del texto (<strong>). Sin margen
 * exterior: el espacio entre párrafos lo pone el padre. El ancho de lectura
 * (unos 70 caracteres) lo limita el layout, no el párrafo.
 *
 * USO:
 *   <Paragraph>Texto de cuerpo…</Paragraph>
 *   <Paragraph size="24">Entradilla de la página.</Paragraph>
 *   <Paragraph color="subtle" size="14">Nota al pie.</Paragraph>
 */
import React from 'react';
import { injectStyles } from './_inputBase';

const css = `
.ds-paragraph {
  margin: 0;
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  color: var(--ds-paragraph-fg-text-default);
}
.ds-paragraph strong { font-weight: var(--ds-font-weight-bold); }
.ds-paragraph--14 { font-size: var(--ds-fontSize-body-xs); line-height: var(--ds-lineHeight-body-xs); } /* 14/24 */
.ds-paragraph--16 { font-size: var(--ds-fontSize-body-sm); line-height: var(--ds-lineHeight-body-sm); } /* 16/24 */
.ds-paragraph--20 { font-size: var(--ds-fontSize-body-md); line-height: var(--ds-lineHeight-body-md); } /* 20/32 */
.ds-paragraph--24 { font-size: var(--ds-fontSize-body-lg); line-height: var(--ds-lineHeight-body-lg); } /* 24/32 */
.ds-paragraph--subtle  { color: var(--ds-paragraph-fg-text-subtle); }
.ds-paragraph--onColor { color: var(--ds-paragraph-fg-text-on-color); }
`;

injectStyles('ds-paragraph', css);

const SIZES = ['14', '16', '20', '24'];

export function Paragraph({
  children,
  size = '16',         // '14' | '16' | '20' | '24'
  color = 'default',   // 'default' | 'subtle' | 'onColor'
  id,
  className,
}) {
  const sz = SIZES.includes(String(size)) ? String(size) : '16';
  const classes = [
    'ds-paragraph',
    `ds-paragraph--${sz}`,
    color !== 'default' ? `ds-paragraph--${color}` : '',
    className || '',
  ].filter(Boolean).join(' ');
  return <p id={id} className={classes}>{children}</p>;
}

export default Paragraph;
