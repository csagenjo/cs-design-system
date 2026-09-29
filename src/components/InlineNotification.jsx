/**
 * InlineNotification — Componente atómico
 * CS Design System · v1.0
 *
 * Alerta contextual en línea (no flotante, no timer/portal — eso es
 * responsabilidad de La Plataforma, mismo criterio que Snackbar). Icono +
 * título opcional + mensaje + botón de acción opcional, todo condicionado por
 * `Show Title`/`Show Message`/`Show Button` — mismas 3 props booleanas que en
 * Figma.
 *
 * `type` fija el color (icono + borde) y el icono: error→circle-x,
 * information→info, success→circle-check, warning→alert-circle (átomo `Icon`
 * compartido, nunca reimplementado).
 *
 * `style`: 'default' (fondo blanco + borde de color) / 'borderless' (mismo
 * fondo, sin borde) / 'simple' (sin fondo ni borde — solo icono + contenido).
 * Título y mensaje son SIEMPRE del mismo color fijo (negro) en las 3 —
 * el color de `type` solo tiñe icono y borde, nunca el texto.
 *
 * Botón: instancia `Button` (`variant="default" outline" size="sm"`) sin
 * reimplementar — mismo Type/Variant/Size en las 12 variantes de Figma,
 * bloqueado ahí para que no cambie a un botón relleno/primario.
 *
 * USO:
 *   <InlineNotification type="error" title="Error" message="Algo ha ido mal" onButtonClick={fn} />
 *   <InlineNotification type="success" style="borderless" showButton={false} message="Guardado" />
 *   <InlineNotification type="warning" style="simple" showTitle={false} message="Revisa este campo" />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { Button } from './Button';

const ICON_BY_TYPE = {
  error: 'circle-x',
  information: 'info',
  success: 'circle-check',
  warning: 'alert-circle',
};

const css = `
.ds-inline-notification {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-inline-notification-gap);
  padding: var(--ds-inline-notification-padding-ver) var(--ds-inline-notification-padding-hor);
  border-radius: var(--ds-inline-notification-border-radius);
  /* borde pintado por dentro (inset), sin sumar altura — igual que el stroke
     INSIDE de Figma (29/09): así 8 + contenido + 8 cae en rejilla */
  box-shadow: inset 0 0 0 var(--ds-inline-notification-border-width) var(--_border, transparent);
  box-sizing: border-box;
}
.ds-inline-notification--default,
.ds-inline-notification--borderless {
  background: var(--ds-inline-notification-bg);
}
.ds-inline-notification--default.ds-inline-notification--error       { --_border: var(--ds-inline-notification-color-error); }
.ds-inline-notification--default.ds-inline-notification--success     { --_border: var(--ds-inline-notification-color-success); }
.ds-inline-notification--default.ds-inline-notification--information { --_border: var(--ds-inline-notification-color-information); }
.ds-inline-notification--default.ds-inline-notification--warning     { --_border: var(--ds-inline-notification-color-warning); }

.ds-inline-notification__icon--error       { color: var(--ds-inline-notification-color-error); }
.ds-inline-notification__icon--success     { color: var(--ds-inline-notification-color-success); }
.ds-inline-notification__icon--information { color: var(--ds-inline-notification-color-information); }
.ds-inline-notification__icon--warning     { color: var(--ds-inline-notification-color-warning); }
.ds-inline-notification__icon { flex-shrink: 0; }

.ds-inline-notification__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--ds-inline-notification-content-gap);
  min-width: 0;
}
.ds-inline-notification__text {
  /* título + mensaje juntos, sin gap — "Label + Message" en Figma; el gap de
     __content solo separa este bloque del botón (29/09) */
  display: flex;
  flex-direction: column;
}
.ds-inline-notification__title {
  font-size: var(--ds-fontSize-title-sm);
  line-height: var(--ds-lineHeight-title-sm);  /* 24 — faltaba: heredaba 23.2 de index.css (29/09) */
  font-weight: var(--ds-font-weight-bold);
  color: var(--ds-inline-notification-title-fg);
  text-align: left;
}
.ds-inline-notification__message {
  font-size: var(--ds-fontSize-body-sm);
  line-height: var(--ds-lineHeight-body-sm);   /* 24 — faltaba (29/09) */
  color: var(--ds-inline-notification-text-fg);
  text-align: left;
}
.ds-inline-notification__button {
  display: flex;
  justify-content: flex-end;
}
`;

injectStyles('ds-inline-notification', css);

export function InlineNotification({
  type         = 'error', // 'error' | 'success' | 'information' | 'warning'
  style        = 'default', // 'default' | 'borderless' | 'simple'
  showTitle    = true,
  title        = 'Title',
  message      = 'This is an example of an inline message for notification',
  showMessage  = true,
  showButton   = true,
  buttonLabel  = 'Button',
  onButtonClick,
  id,
  className,
}) {
  const classes = [
    'ds-inline-notification',
    `ds-inline-notification--${style}`,
    `ds-inline-notification--${type}`,
    className || '',
  ].filter(Boolean).join(' ');

  const iconClasses = ['ds-inline-notification__icon', `ds-inline-notification__icon--${type}`].join(' ');

  return (
    <div id={id} className={classes} role="status">
      <Icon name={ICON_BY_TYPE[type]} size="sm" className={iconClasses} />
      <div className="ds-inline-notification__content">
        {(showTitle || showMessage) && (
          <div className="ds-inline-notification__text">
            {showTitle && <span className="ds-inline-notification__title">{title}</span>}
            {showMessage && <span className="ds-inline-notification__message">{message}</span>}
          </div>
        )}
        {showButton && (
          <div className="ds-inline-notification__button">
            <Button variant="default" outline size="sm" onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InlineNotification;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<InlineNotification type="error" title="Error" message="Algo ha ido mal" onButtonClick={() => {}} />

<InlineNotification type="success" style="borderless" showButton={false} message="Guardado correctamente" />

<InlineNotification type="warning" style="simple" showTitle={false} message="Revisa este campo antes de continuar" />

<InlineNotification type="information" title="Información" message="Nuevo dato disponible" showButton={false} />
*/
