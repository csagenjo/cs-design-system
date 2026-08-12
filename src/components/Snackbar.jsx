/**
 * Snackbar — Componente atómico
 * CS Design System · v1.0
 *
 * Feedback transitorio de una acción realizada o en curso. Puro contenido
 * visual — NO gestiona temporizador de auto-dismiss ni posicionamiento fijo
 * en pantalla: eso es responsabilidad del consumidor (La Plataforma).
 *
 * length="single" — mensaje + acción en una fila.
 * length="multi"  — mensaje en su propia línea, acción debajo alineada a la derecha.
 *
 * La acción es una instancia directa de Button (variant="default" size="sm")
 * — sin tokens propios, los paddings ya coinciden con los de Figma.
 *
 * Tokens: --ds-snackbar-* (Componente→Mode). bg/fg invierten con el modo
 * (bg-inverse/fg-body-inverse) — confirmado en Figma dark mode 12/08.
 *
 * USO:
 *   <Snackbar message="Cambios guardados" />
 *   <Snackbar message="Elemento eliminado" actionLabel="Deshacer" onAction={fn} />
 *   <Snackbar length="multi" message="No se pudo completar la operación. Inténtalo de nuevo más tarde." />
 */

import React from 'react';
import { Button } from './Button';

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-snackbar {
  display:       flex;
  box-sizing:    border-box;
  background:    var(--ds-snackbar-root-bg-generic);
  border-radius: var(--ds-snackbar-root-border-radius);
  padding-left:  var(--ds-snackbar-root-padding-hor);
  padding-right: var(--ds-snackbar-root-padding-hor);
  box-shadow:    var(--ds-snackbar-root-shadow);
}
.ds-snackbar--single {
  align-items:    center;
  justify-content: flex-end;
  gap:            var(--ds-snackbar-root-gap-single);
  padding-top:    var(--ds-snackbar-root-padding-ver-single);
  padding-bottom: var(--ds-snackbar-root-padding-ver-single);
}
.ds-snackbar--multi {
  flex-direction: column;
  align-items:    flex-end;
  padding-top:    var(--ds-snackbar-root-padding-ver-multi);
  padding-bottom: var(--ds-snackbar-root-padding-ver-multi);
}
.ds-snackbar__message {
  margin:      0;
  font-family: inherit;                         /* Nunito (fontFamily/default) */
  font-size:   var(--ds-fontSize-body-sm);       /* 16 */
  font-weight: var(--ds-font-weight-regular);    /* 400 */
  line-height: var(--ds-lineHeight-xs);          /* 24 */
  color:       var(--ds-snackbar-text-fg-generic);
  word-break:  break-word;
}
.ds-snackbar--single .ds-snackbar__message { flex: 1 0 0; min-width: 0; }
.ds-snackbar--multi  .ds-snackbar__message { width: 100%; }
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  injected = true;
}

/* ─── Snackbar ─────────────────────────────────────────────────────────────── */

export function Snackbar({
  length      = 'single',
  message     = 'Snackbar message',
  showAction  = true,
  actionLabel = 'Undo',
  onAction,
  id,
  className,
}) {
  injectStyles();

  const isMulti = length === 'multi';

  const classes = [
    'ds-snackbar',
    isMulti ? 'ds-snackbar--multi' : 'ds-snackbar--single',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} role="status" aria-live="polite">
      <p className="ds-snackbar__message">{message}</p>
      {showAction && actionLabel && (
        <Button variant="default" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default Snackbar;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Snackbar message="Cambios guardados" showAction={false} />
<Snackbar message="Elemento eliminado" actionLabel="Deshacer" onAction={() => {}} />
<Snackbar length="multi" message="No se pudo completar la operación. Inténtalo de nuevo más tarde." actionLabel="Reintentar" />
*/
