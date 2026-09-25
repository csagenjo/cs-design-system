/**
 * Image — Átomo
 * CS Design System · v1
 *
 * Contenedor de foto/ilustración a proporción fija — `size` (1:1/3:2/4:3/
 * 16:9) × `variant` (roundedCorners/circle, circle solo válido con 1:1),
 * mismo eje real que `.Container` en Figma antes de fusionarse dentro del
 * component set `Image` (24/09, ver CLAUDE.md §10). `objectFit: cover`
 * (`scaleMode=FILL` en Figma, corregido el 24/09 desde FIT — que dejaba
 * huecos de letterbox con fotos reales) — la imagen SIEMPRE rellena el
 * marco, recortando lo que sobre, nunca al revés.
 *
 * A diferencia de CountryFlag (SVG inyectado, un asset fijo por país), aquí
 * `src` es libre — cualquier foto real que pase el consumidor.
 *
 * `caption`/`showCaption` — mismos component properties que expone el
 * component set real de Figma (`Show Caption` bool, `Caption` texto).
 *
 * USO:
 *   <Image size="16:9" src="/promo.jpg" alt="" caption="Nueva hipoteca" />
 *   <Image size="1:1" variant="circle" src="/avatar.jpg" alt="Foto de perfil" showCaption={false} />
 */
import React from 'react';
import { injectStyles } from './_inputBase';

const ASPECT_RATIO = {
  '1:1': '1 / 1',
  '3:2': '3 / 2',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
};

const css = `
.ds-image {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.ds-image__frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--ds-card-root-border-radius);
  overflow: hidden;
  background: var(--ds-bg-subtle);
}
.ds-image--circle .ds-image__frame {
  border-radius: 50%;
}
.ds-image__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ds-image__caption {
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-xs);
  color: var(--ds-image-caption-fg-generic);
}
`;

injectStyles('ds-image', css);

export function Image({
  size = '1:1',
  variant = 'roundedCorners', // 'roundedCorners' | 'circle' — circle solo con size="1:1"
  src,
  alt = '',
  caption,
  showCaption = true,
  className,
  style,
}) {
  if (process.env.NODE_ENV !== 'production' && variant === 'circle' && size !== '1:1') {
    console.warn('[DS Image] variant="circle" solo es válido con size="1:1" — revisa si es intencional.');
  }

  const classes = [
    'ds-image',
    variant === 'circle' ? 'ds-image--circle' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      <div className="ds-image__frame" style={{ aspectRatio: ASPECT_RATIO[size] }}>
        {src && <img className="ds-image__img" src={src} alt={alt} />}
      </div>
      {showCaption && caption && (
        <span className="ds-image__caption">{caption}</span>
      )}
    </div>
  );
}

export default Image;
