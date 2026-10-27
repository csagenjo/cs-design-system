/**
 * Snackbar — Componente atómico
 * CS Design System · v1.1 (27/10/2026: foco de la acción con focus-*-inverse)
 *
 * Feedback transitorio de una acción realizada o en curso. Puro contenido
 * visual — NO gestiona temporizador de auto-dismiss ni posicionamiento fijo
 * en pantalla: eso es responsabilidad del consumidor (La Plataforma).
 *
 * length="single" — mensaje + acción en una fila.
 * length="multi"  — mensaje en su propia línea, acción debajo alineada a la derecha.
 *
 * La acción es una instancia de Button (Default · Primary · Small), igual que
 * en Figma. Sobre el fondo invertido el anillo de foco usa
 * --ds-snackbar-action-focus-* (focus-*-inverse).
 *
 * El consumidor decide ancho, posición y cuánto tiempo se muestra: si lleva
 * acción, no debe cerrarse solo antes de que se pueda alcanzar (WCAG 2.2.1).
 *
 * Tokens: --ds-snackbar-* (Componente→Mode). bg/fg invierten con el modo
 * (bg-inverse/fg-body-inverse) — confirmado en Figma dark mode 12/08.
 *
 * USO:
 *   <Snackbar message="Changes saved" showAction={false} />
 *   <Snackbar message="Item deleted" actionLabel="Undo" onAction={fn} />
 *   <Snackbar length="multi" message="The operation could not be completed. Try again later." actionLabel="Retry" onAction={fn} />
 */

import React from 'react';
import { announce } from './announce';
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
  line-height: var(--ds-lineHeight-body-sm);          /* 24 */
  color:       var(--ds-snackbar-text-fg-generic);
  word-break:  break-word;
}
.ds-snackbar .ds-btn {
  /* El foco del sistema no contrasta sobre el fondo invertido: el Button
     anidado toma los focus-*-inverse (mismo mecanismo que Collapsible). */
  --ds-button-border-focus-inner: var(--ds-snackbar-action-focus-inner);
  --ds-button-border-focus-outer: var(--ds-snackbar-action-focus-outer);
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

  // A11y-4: el Snackbar se monta a la vez que su mensaje, así que su propio
  // aria-live no se oía en muchos lectores. Se anuncia por la región global
  // persistente de announce() y el contenedor ya no es región viva.
  React.useEffect(() => {
    if (message) announce(message);
  }, [message]);

  const isMulti = length === 'multi';

  const classes = [
    'ds-snackbar',
    isMulti ? 'ds-snackbar--multi' : 'ds-snackbar--single',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes}>
      <p className="ds-snackbar__message">{message}</p>
      {showAction && actionLabel && (
        <Button type="default" variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default Snackbar;
