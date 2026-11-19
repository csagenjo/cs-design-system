/**
 * ShapeMedia — Átomo
 * CS Design System · v1.2 (19/11/2026, igual que Figma: set "Shape Media", Shape × Backdrop, Show backdrop, Pop out)
 *
 * La foto dentro de una forma, con la misma forma detrás en color (el
 * backdrop). Sale del Hero v1.2 para compartirla: la usan Hero (Shape) y
 * ContentBlock. Mejor un PNG recortado con fondo transparente: alrededor de la
 * persona se ve el color.
 *
 * Área de 720 × 629 (la del Hero en Figma). La foto se ajusta al área entera
 * (alto completo, centrada y apoyada abajo: `xMidYMax meet`) y la forma la
 * recorta (clipPath); con `showBackdrop`, la misma forma va detrás en color.
 *
 * shape     → 'blob' (la forma de marca: 777 × 877, sube 248 y sobresale
 *             por arriba y a la derecha — el contenedor la recorta) |
 *             'pill' (cápsula vertical, alto del área, 56 % del ancho)
 *             Añadir una forma = añadir su trazado aquí y su opción en Figma.
 * backdrop  → 'default' (gris, sin marca) | 'secondary' | 'primary' | 'tertiary'
 *             (las superficies medium de marca, claro y oscuro). Solo tokens:
 *             un color libre rompería el modo oscuro y los temas.
 * showBackdrop → false = sin forma: ni color detrás ni recorte; la foto se ve
 *             entera dentro del área (19/11, Carol). Pensado para PNG recortados
 *             o ilustraciones; una foto con fondo se vería como rectángulo.
 * popOut    → solo Pill (decisión de Carol, 18/11): la forma deja de recortar
 *             la foto y queda solo como fondo de color; la foto se ve entera,
 *             recortada únicamente por los bordes del área. Solo con un PNG
 *             recortado: con una foto con fondo se vería su rectángulo entero.
 *             En Blob no hace nada (el diseño se complica).
 *
 * Accesibilidad: decorativa por defecto (aria-hidden). Con `image.alt`, el
 * <svg> pasa a role="img" con ese nombre.
 *
 * El contenedor que la usa pone `overflow: hidden` si quiere recortar lo que
 * sobresale (Blob).
 *
 * USO:
 *   <ShapeMedia image={{ src: '/phone-cutout.png', alt: '' }} backdrop="secondary" />
 *   <ShapeMedia shape="pill" backdrop="tertiary" image={{ src: '/phone-cutout.png' }} />
 *   <ShapeMedia shape="pill" popOut image={{ src: '/phone-cutout.png' }} />
 */
import React, { useId } from 'react';
import { injectStyles } from './_inputBase';

const AREA_W = 720;
const AREA_H = 629;

/* Trazados en coordenadas del área (720 × 629). */
const BLOB_PATH = 'M 426.75 0.66 C 526.01 5.38 630.42 42.26 691.02 119.06 C 747.05 190.06 709.40 290.89 725.41 379.11 C 738.28 450.04 786.30 512.96 775.40 584.20 C 763.33 663.13 724.84 738.45 662.53 790.19 C 597.27 844.37 510.84 889.89 426.75 873.67 C 345.26 857.95 319.88 754.82 250.25 710.64 C 174.07 662.29 41.25 688.78 6.43 606.91 C -27.68 526.71 83.96 456.26 106.31 372.21 C 131.07 279.11 79.61 166.63 143.09 93.02 C 208.87 16.76 324.69 -4.19 426.75 0.66 Z';
const PILL_W = Math.round(AREA_W * (330 / 592)); // 401: misma proporción que en Figma (330 de 592)
const PILL_X = (AREA_W - PILL_W) / 2;
const PILL_R = PILL_W / 2;
const PILL_PATH = `M ${PILL_X + PILL_R} 0 H ${PILL_X + PILL_W - PILL_R} A ${PILL_R} ${PILL_R} 0 0 1 ${PILL_X + PILL_W} ${PILL_R} V ${AREA_H - PILL_R} A ${PILL_R} ${PILL_R} 0 0 1 ${PILL_X + PILL_W - PILL_R} ${AREA_H} H ${PILL_X + PILL_R} A ${PILL_R} ${PILL_R} 0 0 1 ${PILL_X} ${AREA_H - PILL_R} V ${PILL_R} A ${PILL_R} ${PILL_R} 0 0 1 ${PILL_X + PILL_R} 0 Z`;

/* popOut: si la forma lo admite, la foto deja de recortarse con ella. */
const SHAPES = {
  blob: { d: BLOB_PATH, transform: 'translate(0 -248)', popOut: false }, // la forma sube 248 sobre el área
  pill: { d: PILL_PATH, popOut: true },
};
const BACKDROPS = ['default', 'secondary', 'primary', 'tertiary'];

const css = `
.ds-shape-media {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: ${AREA_W} / ${AREA_H};
  overflow: visible;             /* Blob sobresale; lo recorta el contenedor */
}
${BACKDROPS.map((b) => `.ds-shape-media--${b} .ds-shape-media__backdrop { fill: var(--ds-shape-media-${b}-bg-backdrop-generic); }`).join('\n')}
@media (forced-colors: active) {
  .ds-shape-media__backdrop { fill: Canvas; stroke: CanvasText; }
}
`;

injectStyles('ds-shape-media', css);

export function ShapeMedia({
  shape = 'blob',          // 'blob' | 'pill'
  backdrop = 'default',    // 'default' | 'secondary' | 'primary' | 'tertiary'
  showBackdrop = true,
  popOut = false,          // solo Pill: la foto no se recorta con la forma (solo con PNG recortado)
  image,                   // { src, alt? }
  className,
  style,
}) {
  const clipId = `${useId()}-shape`;
  const s = SHAPES[shape] || SHAPES.blob;
  const bd = BACKDROPS.includes(backdrop) ? backdrop : 'default';
  const named = Boolean(image?.alt);
  if (process.env.NODE_ENV !== 'production' && popOut && !s.popOut) {
    console.warn(`[DS ShapeMedia] popOut solo funciona con shape="pill"; se ignora en "${shape}".`);
  }
  const clipped = showBackdrop && !(popOut && s.popOut); // sin backdrop, sin recorte
  return (
    <svg
      className={['ds-shape-media', `ds-shape-media--${bd}`, className || ''].filter(Boolean).join(' ')}
      style={style}
      viewBox={`0 0 ${AREA_W} ${AREA_H}`}
      role={named ? 'img' : undefined}
      aria-label={named ? image.alt : undefined}
      aria-hidden={named ? undefined : 'true'}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={s.d} transform={s.transform} />
        </clipPath>
      </defs>
      {showBackdrop && <path className="ds-shape-media__backdrop" d={s.d} transform={s.transform} />}
      {image?.src && (
        <image
          href={image.src}
          x="0"
          y="0"
          width={AREA_W}
          height={AREA_H}
          preserveAspectRatio="xMidYMax meet"
          clipPath={clipped ? `url(#${clipId})` : undefined}
        />
      )}
    </svg>
  );
}

ShapeMedia.displayName = 'ShapeMedia';
export default ShapeMedia;
