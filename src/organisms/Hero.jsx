/**
 * Hero — Organismo
 * CS Design System · v1.2 (17/11/2026, igual que Figma: set "Hero", Style × Scrim × Layout)
 *
 * v1.1: el título es Headline size="display" (el h1 de Hero) y la
 * introducción, Paragraph 24 (antes Text con un apaño para partir líneas).
 *
 * Bloque de apertura de una página: eyebrow, el título (siempre h1) y una
 * introducción, con una imagen. Uno por página.
 *
 * Responsive de verdad: un solo componente. Por encima de 1024 (Desktop)
 * texto e imagen van lado a lado; por debajo (Stacked, móvil y tablet) se
 * apilan. En Figma son la variante Layout porque Figma no tiene media query.
 *
 * variant
 *   'shape' → la foto va DENTRO de la forma del portfolio, junto al texto.
 *             La forma recorta la foto (clipPath) y, con `backdrop`, la misma
 *             forma va detrás en `hero/all/bg/backdrop/generic`. Mejor un PNG
 *             recortado con fondo transparente: alrededor se ve el color.
 *             v1.2: la foto se ajusta al área de 720 × 629 (alto completo,
 *             centrada y apoyada abajo), no a la caja de la forma — así la
 *             cabeza no queda por encima del área visible. La forma la recorta.
 *             Proporciones de Figma: área de 720 × 629; la forma mide
 *             777 × 877 y sube 248, así que sobresale por arriba y a la
 *             derecha — el Hero la recorta (overflow hidden).
 *             Stacked: la foto arriba.
 *   'cover' → cualquier imagen de fondo de todo el bloque, con velo entre la
 *             imagen y el texto (`scrim`): negro 60 % en los dos modos, que
 *             con texto blanco garantiza ≥ 4,5:1 sobre cualquier imagen (el
 *             mínimo es 54 %). 'full' cubre toda la imagen; 'gradient'
 *             mantiene el 60 % detrás del texto (desktop: hasta el 55 % del
 *             ancho; stacked: pegado al bloque de texto, que crece con él) y
 *             se desvanece hacia el otro lado. Stacked: el texto abajo.
 *             El texto pasa a onColor: Headline con color="onColor" y Text
 *             re-tematizado localmente (sus variables CSS redefinidas desde el
 *             Hero, mismo mecanismo que Collapsible con Button).
 *
 * actions: solo Button Accent Primary (decisión de Carol, 17/11): el Hero es
 * el mensaje principal de la página; lo secundario va más abajo.
 *
 * Accesibilidad: <section> con nombre del h1 (aria-labelledby). La imagen es
 * decorativa por defecto (alt ''); si aporta información, `image.alt` la
 * describe. En Shape la foto va en un <svg role="img"> con ese nombre.
 *
 * USO:
 *   <Hero
 *     eyebrow="Senior Product Designer"
 *     title="Hi, I’m Carol Sánchez"
 *     image={{ src: '/carol.png', alt: '' }}
 *     actions={<Button href="#work">See my work</Button>}
 *   >
 *     <Paragraph size="24">I simplify complex product systems…</Paragraph>
 *   </Hero>
 *
 *   <Hero variant="cover" scrim="gradient" image={{ src: '/office.jpg', alt: '', position: 'center 30%' }}
 *     title="Design systems that scale" />
 */
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Headline } from '../components/Headline';
import { Text } from '../components/Text';

/* Forma del portfolio (trazado de Carol, "brand-bg", 777 × 877). */
const SHAPE_PATH = 'M 426.75 0.66 C 526.01 5.38 630.42 42.26 691.02 119.06 C 747.05 190.06 709.40 290.89 725.41 379.11 C 738.28 450.04 786.30 512.96 775.40 584.20 C 763.33 663.13 724.84 738.45 662.53 790.19 C 597.27 844.37 510.84 889.89 426.75 873.67 C 345.26 857.95 319.88 754.82 250.25 710.64 C 174.07 662.29 41.25 688.78 6.43 606.91 C -27.68 526.71 83.96 456.26 106.31 372.21 C 131.07 279.11 79.61 166.63 143.09 93.02 C 208.87 16.76 324.69 -4.19 426.75 0.66 Z';
const AREA_W = 720;  // área de la imagen en Figma
const AREA_H = 629;
const SHAPE_Y = -248; // la forma sube 248 sobre el área

const css = `
.ds-hero {
  position: relative;
  overflow: hidden;              /* recorta la forma que sobresale */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--ds-hero-gap-generic);
  padding: var(--ds-hero-padding-ver-generic) var(--ds-hero-padding-hor-generic);
  box-sizing: border-box;
}
.ds-hero__text {
  position: relative;            /* por encima del velo en Cover */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ds-hero-gap-text-generic);
  min-width: 0;
}
.ds-hero__content {
  align-self: stretch;           /* ocupa el ancho de la columna: el texto se parte en líneas */
  display: flex;
  flex-direction: column;
  gap: var(--ds-hero-gap-text-generic);
}
.ds-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-hero-gap-actions-generic); /* + el área de foco de cada Button, como en Figma */
}

/* ── Shape ── */
.ds-hero--shape .ds-hero__media { order: -1; min-width: 0; }  /* Stacked: la foto arriba */
.ds-hero__shape {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: ${AREA_W} / ${AREA_H};
  overflow: visible;             /* la forma sobresale; la recorta el Hero */
}
.ds-hero__backdrop { fill: var(--ds-hero-bg-backdrop-generic); }

/* ── Cover ── */
.ds-hero--cover {
  min-height: var(--ds-hero-cover-height-min-stacked);
  align-content: end;            /* Stacked: el texto abajo */
  /* Texto blanco: re-tematiza Text (eyebrow) y Paragraph localmente, sin tocar los átomos */
  --ds-text-fg-default:            var(--ds-hero-cover-fg-text-generic);
  --ds-text-fg-label-secondary:    var(--ds-hero-cover-fg-text-generic);
  --ds-paragraph-fg-text-default:  var(--ds-hero-cover-fg-text-generic);
  --ds-paragraph-fg-text-subtle:   var(--ds-hero-cover-fg-text-generic);
}
.ds-hero__cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ds-hero__scrim {
  position: absolute;
  inset: 0;
  background: var(--ds-hero-cover-bg-scrim-generic);
}
.ds-hero__scrim--gradient { display: none; }
/* Stacked + Gradient: el velo va pegado al bloque de texto y crece con él,
   así el 60 % siempre queda detrás de todo el texto (un porcentaje fijo del
   alto fallaba con títulos de varias líneas: medido 3,8:1). Se desvanece en
   los --ds-hero-cover-height-fade-stacked de encima. */
.ds-hero--gradient .ds-hero__text { z-index: 1; }
.ds-hero--gradient .ds-hero__text::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: calc(-1 * var(--ds-hero-padding-hor-generic));
  right: calc(-1 * var(--ds-hero-padding-hor-generic));
  bottom: calc(-1 * var(--ds-hero-padding-ver-generic));
  top: calc(-1 * var(--ds-hero-cover-height-fade-stacked));
  background: linear-gradient(to top, var(--ds-hero-cover-bg-scrim-generic) 0%, var(--ds-hero-cover-bg-scrim-generic) calc(100% - var(--ds-hero-cover-height-fade-stacked)), transparent 100%);
}

@media (min-width: 1024px) {
  .ds-hero {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
  }
  .ds-hero--shape .ds-hero__media { order: 0; }
  .ds-hero--media-start .ds-hero__media { order: -1; }
  .ds-hero--cover {
    min-height: var(--ds-hero-cover-height-min-desktop);
    align-content: center;
  }
  .ds-hero--gradient .ds-hero__text::before { content: none; }
  .ds-hero__scrim--gradient {
    display: block;
    background: linear-gradient(to right, var(--ds-hero-cover-bg-scrim-generic) 0%, var(--ds-hero-cover-bg-scrim-generic) 55%, transparent 100%);
  }
}
`;

injectStyles('ds-hero', css);

function ShapeMedia({ image, backdrop }) {
  const clipId = `${useId()}-shape`;
  const named = Boolean(image?.alt);
  return (
    <div className="ds-hero__media">
      <svg
        className="ds-hero__shape"
        viewBox={`0 0 ${AREA_W} ${AREA_H}`}
        role={named ? 'img' : undefined}
        aria-label={named ? image.alt : undefined}
        aria-hidden={named ? undefined : 'true'}
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={SHAPE_PATH} transform={`translate(0 ${SHAPE_Y})`} />
          </clipPath>
        </defs>
        {backdrop && <path className="ds-hero__backdrop" d={SHAPE_PATH} transform={`translate(0 ${SHAPE_Y})`} />}
        {image?.src && (
          <image
            href={image.src}
            x="0"
            y="0"
            width={AREA_W}
            height={AREA_H}
            preserveAspectRatio="xMidYMax meet"
            clipPath={`url(#${clipId})`}
          />
        )}
      </svg>
    </div>
  );
}

export function Hero({
  variant = 'shape',      // 'shape' | 'cover'
  eyebrow,                // texto corto encima del título (opcional)
  title,                  // siempre h1
  image,                  // { src, alt?, position? } — position solo en cover (object-position)
  actions,                // Button Accent Primary (uno o dos)
  backdrop = true,        // shape: la forma de color detrás de la foto
  scrim = 'full',         // cover: 'full' | 'gradient'
  mediaPosition = 'end',  // shape, desktop: 'end' (derecha) | 'start' (izquierda)
  titleId,
  children,               // la introducción: Paragraph size="24"
  className,
  style,
}) {
  const autoId = useId();
  const headingId = titleId || `${autoId}-title`;
  const isCover = variant === 'cover';

  const classes = [
    'ds-hero',
    `ds-hero--${isCover ? 'cover' : 'shape'}`,
    !isCover && mediaPosition === 'start' ? 'ds-hero--media-start' : '',
    isCover && scrim === 'gradient' ? 'ds-hero--gradient' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <section className={classes} style={style} aria-labelledby={headingId}>
      {isCover && image?.src && (
        <img
          className="ds-hero__cover-img"
          src={image.src}
          alt={image.alt || ''}
          style={image.position ? { objectPosition: image.position } : undefined}
        />
      )}
      {isCover && <div className={`ds-hero__scrim ${scrim === 'gradient' ? 'ds-hero__scrim--gradient' : ''}`} aria-hidden="true" />}

      <div className="ds-hero__text">
        {eyebrow && <Text color="secondary" weight="regular">{eyebrow}</Text>}
        <Headline level={1} size="display" color={isCover ? 'onColor' : 'default'} id={headingId}>{title}</Headline>
        {children && <div className="ds-hero__content">{children}</div>}
        {actions && <div className="ds-hero__actions">{actions}</div>}
      </div>

      {!isCover && <ShapeMedia image={image} backdrop={backdrop} />}
    </section>
  );
}

export default Hero;
