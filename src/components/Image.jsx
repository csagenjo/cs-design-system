/**
 * Image — Átomo
 * CS Design System · v2.1 (17/11/2026, alineado con Figma `Image` 32318:269)
 *
 * Foto, ilustración o logo en un marco de proporción fija — `size` (1:1/3:2/
 * 4:3/16:9) × `variant` (roundedCorners/circle; circle solo con 1:1) × `fit`.
 *   fit="cover" (por defecto, Figma Fit=Cover = scaleMode FILL): la imagen
 *     rellena el marco y recorta lo que sobra. Para fotos.
 *   fit="contain" (v2.1, Figma Fit=Contain = scaleMode FIT): la imagen se ve
 *     entera y el gris del marco queda a los lados. Para logos y capturas que
 *     no se pueden recortar. El aire alrededor lo pone el padre, no Image.
 *
 * Tokens propios (11/11): gap 8 (`image/all/gap/generic`, antes 9 suelto),
 * radio 4 (`…/frame/borderRadius/roundedCorners`, antes reusaba el de Card),
 * gris de espera `…/frame/bg/generic` → bg/subtle (antes bg-subtle desde JSX;
 * en Figma el gris no existía y se ha añadido debajo de la imagen).
 *
 * Accesibilidad: `alt` describe la imagen; `alt=""` solo si es decorativa
 * (por defecto). Con caption se renderiza <figure> + <figcaption>.
 *
 * USO:
 *   <Image size="16:9" src="/promo.jpg" alt="Team at the office" caption="Our Madrid office" />
 *   <Image size="1:1" variant="circle" src="/avatar.jpg" alt="Profile photo" showCaption={false} />
 *   <Image size="4:3" fit="contain" src="/logo.svg" alt="" />
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
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-image-gap-generic);
  margin:         0;
}
.ds-image__frame {
  width:         100%;
  border-radius: var(--ds-image-border-radius-frame-rounded-corners);
  overflow:      hidden;
  background:    var(--ds-image-bg-frame-generic);
}
${Object.entries(ASPECT_RATIO).map(([k, v]) =>
  `.ds-image--${k.replace(':', '-')} .ds-image__frame { aspect-ratio: ${v}; }`).join('\n')}
.ds-image--circle .ds-image__frame { border-radius: 50%; }
.ds-image__img {
  display:    block;
  width:      100%;
  height:     100%;
  object-fit: cover;
}
.ds-image--contain .ds-image__img { object-fit: contain; }
.ds-image__caption {
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  color:       var(--ds-image-fg-caption-generic);
}
`;

injectStyles('ds-image', css);

export function Image({
  size = '1:1',               // '1:1' | '3:2' | '4:3' | '16:9'
  variant = 'roundedCorners', // 'roundedCorners' | 'circle' — circle solo con size="1:1"
  fit = 'cover',              // 'cover' (recorta, fotos) | 'contain' (entera, logos)
  src,
  alt = '',                   // describe la imagen; '' = decorativa
  caption,
  showCaption = true,
  className,
  style,
}) {
  if (process.env.NODE_ENV !== 'production' && variant === 'circle' && size !== '1:1') {
    console.warn('[DS Image] variant="circle" solo es válido con size="1:1".');
  }
  const ratio = ASPECT_RATIO[size] ? size : '1:1';
  const withCaption = showCaption && caption;
  const Tag = withCaption ? 'figure' : 'div';

  const classes = [
    'ds-image',
    `ds-image--${ratio.replace(':', '-')}`,
    variant === 'circle' ? 'ds-image--circle' : '',
    fit === 'contain' ? 'ds-image--contain' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} style={style}>
      <div className="ds-image__frame">
        {src && <img className="ds-image__img" src={src} alt={alt} />}
      </div>
      {withCaption && <figcaption className="ds-image__caption">{caption}</figcaption>}
    </Tag>
  );
}

Image.displayName = 'Image';
export default Image;
