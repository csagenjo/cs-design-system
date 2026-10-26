/**
 * ButtonBar — Organismo
 * CS Design System · v3.0 (26/10/2026: igual que el component set `Button Bar` de Figma)
 *
 * Acciones de cierre de una pantalla. Compone Button (Type=Accent) e
 * InlineNotification; no reimplementa ninguno.
 *
 * VARIANTES (Figma `Variant`):
 *   complex → procesos por pasos / master-detail
 *             izq.: notificación encima de [Previous (Tertiary ‹)] [negativas (Secondary)]
 *             der.: [Cancel (Tertiary)] [secundarias (Secondary)] [principal (Primary)] [Next (Tertiary ›)]
 *   simple  → búsqueda y filtros: izq. notificación · der. [secundaria] [principal]
 *   form    → formularios: izq. notificación encima de [negativas] · der. [Cancel] [principal]
 *   detail  → cabeceras de detalle: izq. notificación · der. [secundarias] [principal]
 *
 * REGLAS (las fija el componente, no el consumidor):
 *   - Una sola acción principal (Primary), siempre la última a la derecha (antes de Next).
 *   - Negativas = Secondary, siempre a la izquierda. No hay botón rojo: lo
 *     destructivo se distingue por su texto y su posición.
 *   - Cancel, Previous y Next = Tertiary.
 *   - Gap 24 entre acciones (`--ds-button-bar-gap`), 16 entre notificación y
 *     acciones (`--ds-button-bar-notification-gap`). Sin padding, borde ni fondo:
 *     los pone la pantalla que lo contiene.
 */

import React from 'react';
import { Button } from '../components/Button';
import { injectStyles } from '../components/_inputBase';

const css = `
.ds-btn-bar {
  display:         flex;
  align-items:     flex-end;
  justify-content: space-between;
  flex-wrap:       wrap;
  gap:             var(--ds-button-bar-gap);
  /* El área de foco de cada Button (4 px) ya separa los botones del borde. */
}
.ds-btn-bar__left {
  display:        flex;
  flex-direction: column;
  align-items:    flex-start;
  gap:            var(--ds-button-bar-notification-gap);
  min-width:      0;
}
.ds-btn-bar--simple .ds-btn-bar__left,
.ds-btn-bar--detail .ds-btn-bar__left { align-self: center; }
.ds-btn-bar__actions {
  display:     flex;
  align-items: center;
  flex-wrap:   wrap;
  gap:         var(--ds-button-bar-gap);
}
.ds-btn-bar__right { margin-left: auto; }
`;

injectStyles('ds-button-bar', css);

const actionList = (items, size, variant) => items.map((a, i) => (
  <Button key={i} type="accent" variant={variant} size={size}
    iconLeft={a.icon} disabled={a.disabled} loading={a.loading} onClick={a.onClick}>
    {a.label}
  </Button>
));

/**
 * @param {'complex'|'simple'|'form'|'detail'} props.variant
 * @param {'sm'|'md'|'lg'} [props.size='lg']           — Figma usa Large
 * @param {React.ReactNode} [props.notification]       — InlineNotification (slot)
 * @param {string}   [props.primaryLabel] · onPrimary · primaryIcon · primaryLoading · primaryDisabled
 * @param {string}   [props.secondaryLabel] · onSecondary · secondaryIcon
 * @param {Array}    [props.extraSecondary]  — [{label, onClick, icon?, disabled?}] (complex, detail)
 * @param {string}   [props.cancelLabel='Cancel'] · onCancel
 * @param {Array}    [props.negativeActions] — [{label, onClick, icon?, disabled?}] (complex, form)
 * @param {Function} [props.onPrev] · prevLabel='Previous' · prevDisabled   (complex)
 * @param {Function} [props.onNext] · nextLabel='Next' · nextDisabled       (complex)
 * @param {string}   [props.ariaLabel] — nombre del grupo de acciones (opcional)
 */
export function ButtonBar({
  variant,
  size = 'lg',
  notification,
  primaryLabel,
  onPrimary,
  primaryIcon,
  primaryLoading = false,
  primaryDisabled = false,
  secondaryLabel,
  onSecondary,
  secondaryIcon,
  extraSecondary = [],
  cancelLabel = 'Cancel',
  onCancel,
  negativeActions = [],
  onPrev,
  prevLabel = 'Previous',
  prevDisabled = false,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  ariaLabel,
}) {
  const isComplex = variant === 'complex';
  const showNegatives = (isComplex || variant === 'form') && negativeActions.length > 0;
  const showExtra = (isComplex || variant === 'detail') && extraSecondary.length > 0;
  const showCancel = (isComplex || variant === 'form') && onCancel;
  const showSecondary = variant !== 'form' && secondaryLabel;
  const defaultPrimary = { complex: 'Accept', simple: 'Search', form: 'Accept', detail: 'Send' }[variant];

  const left = (
    <div className="ds-btn-bar__left">
      {notification}
      {(isComplex && onPrev) || showNegatives ? (
        <div className="ds-btn-bar__actions">
          {isComplex && onPrev && (
            <Button type="accent" variant="tertiary" size={size} iconLeft="chevron-left"
              onClick={onPrev} disabled={prevDisabled}>
              {prevLabel}
            </Button>
          )}
          {showNegatives && actionList(negativeActions, size, 'secondary')}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className={`ds-btn-bar ds-btn-bar--${variant}`} role={ariaLabel ? 'group' : undefined} aria-label={ariaLabel}>
      {left}
      <div className="ds-btn-bar__actions ds-btn-bar__right">
        {showCancel && (
          <Button type="accent" variant="tertiary" size={size} onClick={onCancel}>{cancelLabel}</Button>
        )}
        {showExtra && actionList(extraSecondary, size, 'secondary')}
        {showSecondary && (
          <Button type="accent" variant="secondary" size={size}
            iconLeft={secondaryIcon} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
        {onPrimary && (
          <Button type="accent" variant="primary" size={size} iconLeft={primaryIcon}
            loading={primaryLoading} disabled={primaryDisabled} onClick={onPrimary}>
            {primaryLabel || defaultPrimary}
          </Button>
        )}
        {isComplex && onNext && (
          <Button type="accent" variant="tertiary" size={size} iconRight="chevron-right"
            onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ButtonBar;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────────

<ButtonBar
  variant="complex"
  notification={error && <InlineNotification type="error" style="default" showTitle={false} message={error} />}
  onPrev={prev} prevDisabled={step === 1}
  negativeActions={[{ label: 'Reject', onClick: reject }]}
  onCancel={cancel}
  extraSecondary={[{ label: 'Save draft', onClick: saveDraft }]}
  primaryLabel="Accept" onPrimary={accept}
  onNext={next} nextDisabled={step === total}
/>

<ButtonBar variant="simple" secondaryLabel="Clear" onSecondary={clear} primaryLabel="Search" onPrimary={search} />
<ButtonBar variant="form" negativeActions={[{ label: 'Delete', onClick: del }]} onCancel={cancel} primaryLabel="Save" onPrimary={save} />
<ButtonBar variant="detail" secondaryLabel="Edit" onSecondary={edit} primaryLabel="Send for review" onPrimary={send} />
*/
