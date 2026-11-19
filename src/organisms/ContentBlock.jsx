/**
 * ContentBlock — Organismo
 * CS Design System · v1.1 (19/11/2026, igual que Figma: set "Content Block", Layout · Media position)
 *
 * Sección de página con título, su texto y una foto en una forma: una
 * función o un tema de la página (pagos, seguridad de la tarjeta…). Como el Hero Shape, pero con un h2 y sin eyebrow ni botones, así
 * que se puede repetir en la página (el Hero es uno por página, con el h1).
 *
 * Título = Headline level 2, size '2xl'. Contenido = `children` (slot Content
 * en Figma): Paragraph size="24" para la introducción, luego List, o un
 * Headline level 3 + Paragraph. El bloque pone el hueco entre ellos
 * (`contentBlock/all/gap/text/generic`), sin padding extra.
 *
 * La foto es ShapeMedia: `shape` ('blob' | 'pill'), `backdrop` ('default' gris
 * sin marca — por defecto — | 'secondary' | 'primary' | 'tertiary') y
 * `showBackdrop` y `popOut` (solo Pill: la foto no se recorta con la forma). En Figma, la
 * instancia Shape Media está expuesta.
 *
 * Responsive: por encima de 1024 (Desktop) texto e imagen lado a lado; por
 * debajo (Stacked) la foto arriba. Mismo mecanismo que Hero.
 *
 * `mediaPosition` ('right' por defecto | 'left'): en Desktop, la foto a la
 * derecha o a la izquierda del texto (como en Hero; acepta también 'end' / 'start'). En Stacked no cambia: la
 * foto siempre arriba. El orden del DOM no cambia (título y texto primero),
 * así que el lector de pantalla y el tabulador leen igual en los dos casos.
 *
 * Accesibilidad: <section> con el nombre de su h2 (aria-labelledby). La foto
 * es decorativa por defecto; `image.alt` la describe si aporta información.
 *
 * USO:
 *   <ContentBlock title="Send money in seconds" backdrop="secondary" image={{ src: phone }}>
 *     <Paragraph size="24">Pay friends and split bills from your phone…</Paragraph>
 *   </ContentBlock>
 */
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Headline } from '../components/Headline';
import { ShapeMedia } from '../components/ShapeMedia';

const css = `
.ds-content-block {
  position: relative;
  overflow: hidden;              /* recorta la forma que sobresale (Blob) */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--ds-content-block-gap-generic);
  padding: var(--ds-content-block-padding-ver-generic) var(--ds-content-block-padding-hor-generic);
  box-sizing: border-box;
}
.ds-content-block__text {
  display: flex;
  flex-direction: column;
  gap: var(--ds-content-block-gap-text-generic);
  min-width: 0;
}
.ds-content-block__content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-content-block-gap-text-generic);
}
.ds-content-block__media { order: -1; min-width: 0; }  /* Stacked: la foto arriba */

@media (min-width: 1024px) {
  .ds-content-block {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
  }
  .ds-content-block__media { order: 0; }
  .ds-content-block--media-start .ds-content-block__media { order: -1; }
}
`;

injectStyles('ds-content-block', css);

export function ContentBlock({
  title,                    // h2
  titleId,
  image,                    // { src, alt? }
  shape = 'blob',           // 'blob' | 'pill'
  backdrop = 'default',     // 'default' | 'secondary' | 'primary' | 'tertiary'
  showBackdrop = true,
  popOut = false,           // solo Pill: la foto no se recorta con la forma (PNG recortado)
  mediaPosition = 'right',  // Desktop: 'right' | 'left' (Figma: Media position Right / Left)
  children,                 // Paragraph 24, List, Headline h3 + Paragraph…
  className,
  style,
  id,
}) {
  const autoId = useId();
  const headingId = titleId || `${autoId}-title`;
  return (
    <section
      id={id}
      className={['ds-content-block', (mediaPosition === 'left' || mediaPosition === 'start') ? 'ds-content-block--media-start' : '', className || ''].filter(Boolean).join(' ')}
      style={style}
      aria-labelledby={headingId}
    >
      <div className="ds-content-block__text">
        <Headline level={2} size="2xl" id={headingId}>{title}</Headline>
        {children && <div className="ds-content-block__content">{children}</div>}
      </div>
      <div className="ds-content-block__media">
        <ShapeMedia shape={shape} backdrop={backdrop} showBackdrop={showBackdrop} popOut={popOut} image={image} />
      </div>
    </section>
  );
}

ContentBlock.displayName = 'ContentBlock';
export default ContentBlock;
