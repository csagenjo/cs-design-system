/**
 * Video — Átomo
 * CS Design System · v1.1 (27/11/2026)
 *
 * Vídeo en un marco de proporción fija, misma estructura que Image (figure,
 * frame con aspect-ratio, figcaption) — `size` (16:9/4:3/9:16) × `fit`.
 *   fit="contain" (por defecto): el vídeo se ve entero, gris del marco a los lados.
 *   fit="cover": rellena el marco y recorta lo que sobra.
 *
 * `playback` (Figma "Playback", 27/11):
 *   "click" (por defecto, Click to play): arranca parado (sin autoplay,
 *   preload="metadata") y sin controles nativos; encima, centrado, un
 *   IconButton Primary Large con el icono Play. Al pulsarlo: play(), el botón
 *   desaparece, se activan los controles nativos y el foco pasa al <video>.
 *   "autoplay-loop" (Autoplay loop): solo animaciones cortas sin sonido.
 *   <video autoplay muted loop playsinline>, sin controles nativos ni Play
 *   central; Pause = IconButton Primary Small a 8 de la esquina inferior
 *   derecha, <button> con aria-pressed que pausa/reanuda y cambia icono y
 *   nombre (pauseLabel / playLabel). Con prefers-reduced-motion: reduce no
 *   arranca: solo el poster, y el botón muestra Play (WCAG 2.2.2, 2.3.3).
 *
 * Tokens propios (24/11): gap 8, radio 4, gris del marco y color del caption
 * (`video/all/*`, mismos var() que Image).
 *
 * Accesibilidad: subtítulos obligatorios con playback="click" (`captionsSrc`,
 * <track kind="captions" default>); opcionales con "autoplay-loop" (sin
 * sonido). `label` es el nombre del <video> (con autoplay-loop dice qué pasa,
 * paso a paso); `playLabel` y `pauseLabel` los de los botones. Sin
 * textos para lector de pantalla escritos en el componente: todos por prop.
 *
 * USO:
 *   <Video src="/onboarding.mp4" poster="/onboarding.jpg"
 *          captionsSrc="/onboarding.vtt" label="How to add a supplier"
 *          caption="Adding a supplier in two minutes" />
 *   <Video size="9:16" fit="cover" src={clip} captionsSrc={vtt} label="Product tour" showCaption={false} />
 *   <Video playback="autoplay-loop" src={anim} poster={animStill}
 *          label="An agent scans the index and picks one component" caption="How the agent chooses" />
 */
import React from 'react';
import { injectStyles } from './_inputBase';
import { IconButton } from './IconButton';

const ASPECT_RATIO = {
  '16:9': '16 / 9',
  '4:3':  '4 / 3',
  '9:16': '9 / 16',
};

const css = `
.ds-video {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-video-gap);
  margin:         0;
}
.ds-video__frame {
  position:      relative;
  width:         100%;
  border-radius: var(--ds-video-frame-border-radius);
  overflow:      hidden;
  background:    var(--ds-video-frame-bg-generic);
}
${Object.entries(ASPECT_RATIO).map(([k, v]) =>
  `.ds-video--${k.replace(':', '-')} .ds-video__frame { aspect-ratio: ${v}; }`).join('\n')}
.ds-video__media {
  display:    block;
  width:      100%;
  height:     100%;
  object-fit: contain;
}
.ds-video--cover .ds-video__media { object-fit: cover; }
.ds-video__play {
  position:  absolute;
  top:       50%;
  left:      50%;
  transform: translate(-50%, -50%);
}
.ds-video__pause {
  position: absolute;
  right:    var(--ds-video-inset-pause-generic);
  bottom:   var(--ds-video-inset-pause-generic);
}
.ds-video__caption {
  font-family: inherit;
  font-weight: var(--ds-font-weight-regular);
  font-size:   var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);
  color:       var(--ds-video-caption-fg-generic);
}
`;

injectStyles('ds-video', css);

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION).matches;

export function Video({
  playback = 'click',         // 'click' | 'autoplay-loop'
  size = '16:9',              // '16:9' | '4:3' | '9:16'
  fit = 'contain',            // 'contain' (entero) | 'cover' (recorta)
  src,
  poster,
  captionsSrc,                // .vtt de subtítulos: obligatoria con playback="click"
  captionsLang = 'en',
  label,                      // obligatoria: aria-label del <video>
  playLabel = 'Play video',
  pauseLabel = 'Pause animation',
  caption,
  showCaption = true,
  className,
  style,
}) {
  const loop = playback === 'autoplay-loop';
  if (process.env.NODE_ENV !== 'production') {
    if (!loop && !captionsSrc) console.warn('[DS Video] `captionsSrc` es obligatoria: el vídeo necesita subtítulos.');
    if (!label) console.warn('[DS Video] `label` es obligatoria: el <video> no tiene nombre.');
  }
  const videoRef = React.useRef(null);
  const [started, setStarted] = React.useState(false);
  // autoplay-loop: arranca solo si no se pide movimiento reducido.
  const [reducedMotion] = React.useState(prefersReducedMotion);
  const [paused, setPaused] = React.useState(reducedMotion);

  // autoplay-loop: play() explícito al montar (React pone `muted` como propiedad,
  // no como atributo); si el navegador lo bloquea, el botón pasa a Play.
  React.useEffect(() => {
    if (!loop || reducedMotion) return;
    const p = videoRef.current?.play();
    if (p && typeof p.catch === 'function') p.catch(() => setPaused(true));
  }, [loop, reducedMotion]);

  // autoplay-loop: si el usuario activa "reducir movimiento" con la página abierta, se para.
  React.useEffect(() => {
    if (!loop || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(REDUCED_MOTION);
    const onChange = (e) => { if (e.matches) videoRef.current?.pause(); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [loop]);

  // Tras el render con controles, el foco pasa al <video> (el botón ya no existe).
  React.useEffect(() => {
    if (started) videoRef.current?.focus();
  }, [started]);

  const handlePlay = () => {
    const p = videoRef.current?.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    setStarted(true);
  };

  // Pause/Play de autoplay-loop: el estado sigue a los eventos del <video>
  // (si el navegador bloquea el autoplay, el botón muestra Play).
  const handleToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      v.pause();
    }
  };

  const ratio = ASPECT_RATIO[size] ? size : '16:9';
  const withCaption = showCaption && caption;
  const Tag = withCaption ? 'figure' : 'div';

  const classes = [
    'ds-video',
    `ds-video--${ratio.replace(':', '-')}`,
    fit === 'cover' ? 'ds-video--cover' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} style={style}>
      <div className="ds-video__frame">
        {loop ? (
          <>
            <video
              ref={videoRef}
              className="ds-video__media"
              src={src}
              poster={poster}
              preload={reducedMotion ? 'metadata' : 'auto'}
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              tabIndex={-1}
              aria-label={label}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
            >
              {captionsSrc && <track kind="captions" srcLang={captionsLang} src={captionsSrc} default />}
            </video>
            <IconButton
              className="ds-video__pause"
              type="default"
              variant="primary"
              size="small"
              icon={paused ? 'play' : 'pause'}
              ariaLabel={paused ? playLabel : pauseLabel}
              aria-pressed={paused}
              onClick={handleToggle}
            />
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              className="ds-video__media"
              src={src}
              poster={poster}
              preload="metadata"
              controls={started}
              tabIndex={started ? 0 : -1}
              aria-label={label}
              playsInline
            >
              <track kind="captions" srcLang={captionsLang} src={captionsSrc} default />
            </video>
            {!started && (
              <IconButton
                className="ds-video__play"
                type="default"
                variant="primary"
                size="large"
                icon="play"
                ariaLabel={playLabel}
                onClick={handlePlay}
              />
            )}
          </>
        )}
      </div>
      {withCaption && <figcaption className="ds-video__caption">{caption}</figcaption>}
    </Tag>
  );
}

Video.displayName = 'Video';
export default Video;
