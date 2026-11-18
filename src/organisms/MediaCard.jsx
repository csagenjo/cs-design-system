/**
 * MediaCard — Organismo
 * CS Design System · v1 (18/11/2026, igual que Figma: set "Media Card", Layout)
 *
 * Tarjeta que enlaza a un trabajo (un case study): título, subtítulo opcional,
 * descripción y un enlace, junto a un panel gris con una imagen (un logo).
 * Card Basic por debajo.
 *
 *   título      → Headline size 'md'; nivel `headingLevel` (4 por defecto: va
 *                 bajo un h3 de grupo dentro de una sección h2)
 *   subtitle    → Paragraph 16 subtle. Describe, no estructura: no es un
 *                 encabezado (no mete ruido en la lista de títulos del lector)
 *   description → Paragraph 16
 *   enlace      → Link (default, md, chevron). Solo el enlace es clicable:
 *                 una tarjeta entera como enlace se lee de golpe y no deja
 *                 seleccionar el texto. Su nombre accesible añade el título
 *                 ("Case study: BBVA Contact Center") con VisuallyHidden.
 *   imagen      → Image 4:3, fit="contain" (un logo no se recorta). Decorativa
 *                 por defecto: el título ya nombra el proyecto.
 *
 * Responsive: por encima de 1024 (Desktop) texto e imagen lado a lado; por
 * debajo (Stacked) la imagen arriba.
 *
 * Accesibilidad: <article> con el nombre de su título (aria-labelledby).
 *
 * USO:
 *   <MediaCard
 *     title="BBVA Contact Center"
 *     subtitle="Multi-role support system"
 *     description="Unified fragmented tools into a single operational workspace…"
 *     href="/bbva-contact-center"
 *     image={{ src: bbvaLogo }}
 *   />
 */
import React, { useId } from 'react';
import { injectStyles } from '../components/_inputBase';
import { Card } from '../components/Card';
import { Headline } from '../components/Headline';
import { Paragraph } from '../components/Paragraph';
import { Link } from '../components/Link';
import { Image } from '../components/Image';
import { VisuallyHidden } from '../components/VisuallyHidden';

const css = `
.ds-media-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  overflow: hidden;              /* el panel gris respeta el radio de la Card */
}
.ds-media-card__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--ds-media-card-gap-link-generic);
  padding: var(--ds-media-card-padding-text-generic);
  min-width: 0;
}
.ds-media-card__copy {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--ds-media-card-gap-text-generic);
}
.ds-media-card__media {
  order: -1;                     /* Stacked: la imagen arriba */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-media-card-padding-media-generic);
  background: var(--ds-media-card-bg-media-generic);
  min-width: 0;
}
.ds-media-card__media > .ds-image { width: 100%; }

@media (min-width: 1024px) {
  .ds-media-card { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ds-media-card__media { order: 0; }
}
`;

injectStyles('ds-media-card', css);

export function MediaCard({
  title,
  subtitle,                 // opcional
  description,
  href,
  linkLabel = 'Case study',
  image,                    // { src, alt? } — alt '' por defecto (decorativa)
  headingLevel = 4,
  titleId,
  className,
  style,
}) {
  const autoId = useId();
  const headingId = titleId || `${autoId}-title`;
  return (
    <Card
      as="article"
      variant="basic"
      className={['ds-media-card', className || ''].filter(Boolean).join(' ')}
      style={style}
      aria-labelledby={headingId}
    >
      <div className="ds-media-card__text">
        <div className="ds-media-card__copy">
          <Headline level={headingLevel} size="md" id={headingId}>{title}</Headline>
          {subtitle && <Paragraph color="subtle">{subtitle}</Paragraph>}
          {description && <Paragraph>{description}</Paragraph>}
        </div>
        {href && (
          <Link href={href} size="md">
            {linkLabel}<VisuallyHidden>: {title}</VisuallyHidden>
          </Link>
        )}
      </div>
      <div className="ds-media-card__media">
        <Image size="4:3" fit="contain" src={image?.src} alt={image?.alt || ''} showCaption={false} />
      </div>
    </Card>
  );
}

MediaCard.displayName = 'MediaCard';
export default MediaCard;
