/**
 * ButtonBar — Organismo
 * Usa el componente atómico Button de CS Design System
 *
 * VARIANTES:
 *   "complex"  → Step processes / navegación master-detail
 *   "simple"   → Cajas de búsqueda o filtros
 *   "form"     → Formularios / validaciones
 *   "detail"   → Cabeceras de detalle
 *
 * REGLAS DE LAYOUT:
 *   - Acciones primarias   → variant="accent"
 *   - Acciones secundarias → variant="accent" outline
 *   - Cancelar             → variant="ghost"
 *   - Negativos            → variant="negative" — SIEMPRE a la IZQUIERDA
 *   - Navegación           → variant="default" outline
 *   - Barras flotantes     → variant="accent" floating
 */

import React from 'react';
import { Button } from './Button';

const barCss = `
.ds-btn-bar {
  display:     flex;
  align-items: center;
  gap:         8px;
  padding:     12px 16px;
  border-top:  1px solid var(--ds-borderColor-subtle);
  background:  var(--ds-bg-default);
}
.ds-btn-bar .spacer { flex: 1; }
.ds-btn-bar__sep {
  width:      1px;
  height:     22px;
  background: var(--ds-borderColor-subtle);
  flex-shrink: 0;
}
`;

let barCssInjected = false;
function injectBarStyles() {
  if (barCssInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = barCss;
  document.head.appendChild(s);
  barCssInjected = true;
}

/**
 * @param {Object}  props
 * @param {'complex'|'simple'|'form'|'detail'} props.variant
 *
 * TAMAÑO DE BOTONES (opcional, default "md"):
 * @param {'sm'|'md'|'lg'} [props.size]
 *
 * ACCIÓN PRIMARIA:
 * @param {string}   [props.primaryLabel]
 * @param {Function} [props.onPrimary]
 * @param {string}   [props.primaryIcon]
 *
 * ACCIÓN SECUNDARIA:
 * @param {string}   [props.secondaryLabel]
 * @param {Function} [props.onSecondary]
 * @param {string}   [props.secondaryIcon]
 *
 * CTAs EXTRA (solo variant="complex"):
 * @param {Array}    [props.extraSecondary]  — [{label, onClick, icon?}]
 *
 * CANCELAR:
 * @param {string}   [props.cancelLabel]     — default "Cancelar"
 * @param {Function} [props.onCancel]
 *
 * ACCIONES NEGATIVAS (izquierda):
 * @param {Array}    [props.negativeActions] — [{label, onClick, icon?}]
 *
 * NAVEGACIÓN (solo variant="complex"):
 * @param {Function} [props.onPrev]
 * @param {boolean}  [props.prevDisabled]
 * @param {boolean}  [props.nextIsConfirm]   — cambia "Siguiente" por "Confirmar"
 */
export function ButtonBar({
  variant,
  size = 'md',
  primaryLabel,
  onPrimary,
  primaryIcon,
  secondaryLabel,
  onSecondary,
  secondaryIcon,
  extraSecondary = [],
  cancelLabel = 'Cancelar',
  onCancel,
  negativeActions = [],
  onPrev,
  prevDisabled = false,
  nextIsConfirm = false,
}) {
  injectBarStyles();

  /* ── COMPLEX ─────────────────────────────────────────────── */
  if (variant === 'complex') {
    const hasLeft = onPrev || negativeActions.length > 0;
    return (
      <div className="ds-btn-bar">

        {/* Área izquierda: nav primero, luego negativos */}
        {onPrev && (
          <Button variant="default" outline size={size} iconLeft="arrow-left"
            onClick={onPrev} disabled={prevDisabled}>
            Anterior
          </Button>
        )}
        {negativeActions.map((a, i) => (
          <Button key={i} variant="negative" size={size}
            iconLeft={a.icon} onClick={a.onClick}>
            {a.label}
          </Button>
        ))}

        {/* Separador */}
        <div className="spacer" />
        {hasLeft && <div className="ds-btn-bar__sep" />}
        <div className="spacer" />

        {/* Área derecha */}
        {onCancel && (
          <Button variant="ghost" size={size} onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        {extraSecondary.map((a, i) => (
          <Button key={i} variant="accent" outline size={size}
            iconLeft={a.icon} onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
        {secondaryLabel && (
          <Button variant="accent" outline size={size}
            iconLeft={secondaryIcon} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
        {onPrimary && (
          <Button variant="accent" size={size}
            iconLeft={primaryIcon}
            iconRight={!nextIsConfirm ? 'arrow-right' : undefined}
            onClick={onPrimary}>
            {nextIsConfirm ? 'Confirmar' : (primaryLabel || 'Aceptar y continuar')}
          </Button>
        )}

      </div>
    );
  }

  /* ── SIMPLE ──────────────────────────────────────────────── */
  if (variant === 'simple') {
    return (
      <div className="ds-btn-bar">
        <div className="spacer" />
        {secondaryLabel && (
          <Button variant="accent" outline size={size}
            iconLeft={secondaryIcon} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
        {onPrimary && (
          <Button variant="accent" size={size}
            iconLeft={primaryIcon || 'search'} onClick={onPrimary}>
            {primaryLabel || 'Buscar'}
          </Button>
        )}
      </div>
    );
  }

  /* ── FORM ────────────────────────────────────────────────── */
  if (variant === 'form') {
    return (
      <div className="ds-btn-bar">
        {negativeActions.map((a, i) => (
          <Button key={i} variant="negative" size={size}
            iconLeft={a.icon} onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
        <div className="spacer" />
        {onCancel && (
          <Button variant="ghost" size={size} onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        {onPrimary && (
          <Button variant="accent" size={size}
            iconLeft={primaryIcon} onClick={onPrimary}>
            {primaryLabel || 'Aceptar'}
          </Button>
        )}
      </div>
    );
  }

  /* ── DETAIL ──────────────────────────────────────────────── */
  if (variant === 'detail') {
    return (
      <div className="ds-btn-bar">
        <div className="spacer" />
        {secondaryLabel && (
          <Button variant="accent" outline size={size}
            iconLeft={secondaryIcon || 'edit'} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
        {extraSecondary.map((a, i) => (
          <Button key={i} variant="accent" outline size={size}
            iconLeft={a.icon} onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
        {onPrimary && (
          <Button variant="accent" size={size}
            iconLeft={primaryIcon} onClick={onPrimary}>
            {primaryLabel}
          </Button>
        )}
      </div>
    );
  }

  return null;
}

export default ButtonBar;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────────

// COMPLEX — navegación por pasos con negativos
<ButtonBar
  variant="complex"
  size="md"
  negativeActions={[{ label: 'Rechazar', icon: 'x', onClick: handleReject }]}
  onPrev={handlePrev}
  prevDisabled={step === 1}
  onCancel={handleCancel}
  extraSecondary={[{ label: 'Guardar borrador', icon: 'download', onClick: handleDraft }]}
  onPrimary={handleNext}
  primaryLabel="Siguiente"
  nextIsConfirm={step === totalSteps}
/>

// SIMPLE — búsqueda
<ButtonBar
  variant="simple"
  size="sm"
  secondaryLabel="Borrar búsqueda"
  onSecondary={handleClear}
  onPrimary={handleSearch}
  primaryLabel="Buscar"
/>

// FORM — formulario con acción destructiva
<ButtonBar
  variant="form"
  negativeActions={[{ label: 'Eliminar', icon: 'trash', onClick: handleDelete }]}
  onCancel={handleCancel}
  onPrimary={handleSubmit}
  primaryLabel="Aceptar"
/>

// DETAIL — ficha de detalle
<ButtonBar
  variant="detail"
  secondaryLabel="Editar"
  secondaryIcon="edit"
  onSecondary={handleEdit}
  onPrimary={handleSend}
  primaryLabel="Enviar a validación"
  primaryIcon="send"
/>
*/
