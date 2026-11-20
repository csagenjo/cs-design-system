/**
 * Hero — Organismo
 * CS Design System · v1.3 (18/11/2026, igual que Figma: set "Hero", Style × Scrim × Layout)
 *
 * v1.3: la foto en la forma es el átomo ShapeMedia (compartido con ContentBlock).
 * Nuevas: `shape` ('blob' | 'pill') y `backdrop` como color ('secondary' por
 * defecto | 'default' | 'primary' | 'tertiary'); `showBackdrop` la quita.
 * `backdrop={false}` sigue funcionando (= showBackdrop false). `popOut` (solo
 * Pill): la foto no se recorta con la forma (ver ShapeMedia). En Figma, la
 * instancia Shape Media está expuesta dentro del Hero.
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
 *   'shape' → la foto va DENTRO de una forma (ShapeMedia), junto al texto,
 *             con la misma forma detrás en color. Mejor un PNG recortado con
 *             fondo transparente. Blob sobresale por arriba y a la derecha:
 *             el Hero la recorta (overflow hidden). Stacked: la foto arriba.
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
 *     eyebrow="Personal account"
 *     title="Banking that fits in your pocket"
 *     image={{ src: '/phone-cutout.png', alt: '' }}
 *     actions={<Button href="#open">Open an account</Button>}
 *   >
 *     <Paragraph size="24">Pay, save and send money from one app…</Paragraph>
 *   </Hero>
 *
 *   <Hero shape="pill" backdrop="tertiary" title="…" image={{ src: '/phone-cutout.png' }} />
 *   <Hero variant="cover" scrim="gradient" image={{ src: '/office.jpg', alt: '', position: 'center 30%' }}
 *     title="Design systems that scale" />
 */
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Headline } from '../components/Headline';
import { Text } from '../components/Text';
import { ShapeMedia } from '../components/ShapeMedia';

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
/* Pop out: la foto sobresale por arriba y por abajo (cabe en el padding);
   a los lados se sigue recortando para no crear scroll horizontal. */
.ds-hero--pop-out { overflow-x: clip; overflow-y: visible; }
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

export function Hero({
  variant = 'shape',      // 'shape' | 'cover'
  eyebrow,                // texto corto encima del título (opcional)
  title,                  // siempre h1
  image,                  // { src, alt?, position? } — position solo en cover (object-position)
  actions,                // Button Accent Primary (uno o dos)
  shape = 'blob',         // shape: 'blob' | 'pill'
  backdrop = 'secondary', // shape: color de la forma de detrás — 'secondary' | 'default' | 'primary' | 'tertiary' (false = sin ella)
  showBackdrop = true,    // shape: false = sin forma (ni color ni recorte), la foto entera
  popOut = false,         // shape: solo Pill: la foto no se recorta y sobresale un 12 % por los cuatro lados (PNG recortado)
  scrim = 'full',         // cover: 'full' | 'gradient'
  mediaPosition = 'right',  // shape, desktop: 'right' | 'left' (acepta también 'end' / 'start')
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
    !isCover && (mediaPosition === 'left' || mediaPosition === 'start') ? 'ds-hero--media-start' : '',
    isCover && scrim === 'gradient' ? 'ds-hero--gradient' : '',
    !isCover && popOut && shape === 'pill' && showBackdrop !== false && backdrop !== false ? 'ds-hero--pop-out' : '',
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

      {!isCover && (
        <div className="ds-hero__media">
          <ShapeMedia
            shape={shape}
            backdrop={typeof backdrop === 'string' ? backdrop : 'secondary'}
            showBackdrop={showBackdrop && backdrop !== false}
            popOut={popOut}
            image={image}
          />
        </div>
      )}
    </section>
  );
}

export default Hero;
