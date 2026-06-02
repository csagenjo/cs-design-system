/**
 * Input — Componente atómico
 * CS Design System · v1.0
 *
 * Tokens: todos los estilos vienen de tokens.css (--ds-fg-*, --ds-bg-*, --ds-borderColor-*)
 * Iconos: lucide-react (misma nomenclatura que CS Design System)
 * Sin hex hardcodeados. Sin referencias a Empresa / Sistemas externos  .
 *
 * TIPOS:
 *   Single Line  → adaptive={false}  → <input>   (default)
 *   Adaptive     → adaptive={true}   → <textarea> que crece con el contenido
 *
 * ESTADOS (prop state):
 *   "default"   → Initial / Enabled / Focus manejados por CSS puro
 *   "error"     → Borde rojo + errorMessage visible
 *   "read-only" → Fondo sutil, cursor default, no editable
 *   "disabled"  → Fondo sutil, texto atenuado, no interactivo
 *
 * USO:
 *   <Input label="Nombre" placeholder="Escribe aquí" onChange={fn} />
 *   <Input label="Email" type="email" iconLeft="Search" state="error" errorMessage="Campo requerido" />
 *   <Input label="Notas" adaptive description="Texto libre" />
 *   <Input label="IBAN" state="read-only" value="ES91 2100 0418 4502 0005 1332" />
 *   <Input ref={inputRef} label="Buscar" iconLeft="Search" />
 */

import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useId,
} from 'react';
import {
  Search, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Copy, Save, Trash2 as Delete, Edit2, Filter, Download,
  Percent, Coins, Wallet, CreditCard,
  Check, X, Plus, Upload, Eye, EyeOff, Calendar, AlertCircle,
  MoreHorizontal,
} from 'lucide-react';

/* ─── Mapa de iconos ───────────────────────────────────────────────────────── */

const ICONS = {
  'ChevronRight':   ChevronRight,   'chevron-right':  ChevronRight,
  'ChevronLeft':    ChevronLeft,    'chevron-left':   ChevronLeft,
  'ChevronUp':      ChevronUp,      'chevron-up':     ChevronUp,
  'ChevronDown':    ChevronDown,    'chevron-down':   ChevronDown,
  'ArrowRight':     ArrowRight,     'arrow-right':    ArrowRight,
  'ArrowLeft':      ArrowLeft,      'arrow-left':     ArrowLeft,
  'ArrowUp':        ArrowUp,        'arrow-up':       ArrowUp,
  'ArrowDown':      ArrowDown,      'arrow-down':     ArrowDown,
  'Search':         Search,         'search':         Search,
  'Copy':           Copy,           'copy':           Copy,
  'Save':           Save,           'save':           Save,
  'Delete':         Delete,         'delete':         Delete,   'trash':  Delete,
  'Edit2':          Edit2,          'edit2':          Edit2,    'edit':   Edit2,
  'Filter':         Filter,         'filter':         Filter,
  'Download':       Download,       'download':       Download,
  'Upload':         Upload,         'upload':         Upload,
  'Plus':           Plus,           'plus':           Plus,
  'Check':          Check,          'check':          Check,
  'X':              X,              'x':              X,
  'Percent':        Percent,        'percent':        Percent,
  'Coins':          Coins,          'coins':          Coins,
  'Wallet':         Wallet,         'wallet':         Wallet,
  'CreditCard':     CreditCard,     'credit-card':    CreditCard,
  'Eye':            Eye,            'eye':            Eye,
  'EyeOff':         EyeOff,         'eye-off':        EyeOff,
  'Calendar':       Calendar,       'calendar':       Calendar,
  'AlertCircle':    AlertCircle,    'alert-circle':   AlertCircle,
  'MoreHorizontal': MoreHorizontal, 'more':           MoreHorizontal,
};

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.ds-input {
  display:        inline-flex;
  flex-direction: column;
  gap:            4px;
  font-family:    inherit;
}
.ds-input--full-width {
  display: flex;
  width:   100%;
}

.ds-input__label {
  font-size:   14px;
  font-weight: 500;
  color:       var(--ds-fg-default);
  cursor:      pointer;
  line-height: 1.4;
}
.ds-input--disabled .ds-input__label { color: var(--ds-fg-disabled); }

.ds-input__description {
  font-size:   12px;
  color:       var(--ds-fg-subtle);
  margin:      0;
  line-height: 1.4;
}

.ds-input__wrap {
  position: relative;
  display:  flex;
  width:    100%;
}

.ds-input__control {
  box-sizing:         border-box;
  width:              100%;
  min-width:          200px;
  height:             40px;
  padding:            0 12px;
  font-size:          14px;
  font-family:        inherit;
  line-height:        1.5;
  color:              var(--ds-fg-default);
  background:         var(--ds-bg-default);
  border:             1px solid var(--ds-borderColor-subtle);
  border-radius:      6px;
  outline:            none;
  transition:         border-color 0.12s, box-shadow 0.12s, background 0.12s;
  -webkit-appearance: none;
}
.ds-input__control::placeholder { color: var(--ds-fg-subtle); }

/* Enabled — has a value, not in a special state */
.ds-input:not(.ds-input--error):not(.ds-input--readonly):not(.ds-input--disabled)
  .ds-input__control:not(:focus):not(:placeholder-shown) {
  border-color: var(--ds-borderColor-default);
}

/* Focus */
.ds-input__control:focus {
  border-color: var(--ds-borderColor-focus);
  box-shadow:   0 0 0 3px color-mix(in srgb, var(--ds-borderColor-focus) 12%, transparent);
}

/* Error */
.ds-input--error .ds-input__control {
  border-color: var(--ds-borderColor-error);
}
.ds-input--error .ds-input__control:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-borderColor-error) 15%, transparent);
}

/* Read-only */
.ds-input--readonly .ds-input__control {
  background: var(--ds-bg-subtle);
  cursor:     default;
}
.ds-input--readonly .ds-input__control:focus {
  border-color: var(--ds-borderColor-subtle);
  box-shadow:   none;
}

/* Disabled */
.ds-input--disabled .ds-input__control {
  background: var(--ds-bg-subtle);
  color:      var(--ds-fg-disabled);
  cursor:     not-allowed;
}
.ds-input--disabled .ds-input__control:focus {
  border-color: var(--ds-borderColor-subtle);
  box-shadow:   none;
}

/* Adaptive (textarea) */
.ds-input--adaptive .ds-input__control {
  height:     auto;
  min-height: 40px;
  padding:    10px 12px;
  resize:     none;
  overflow:   hidden;
}

/* Icons */
.ds-input__icon {
  position:        absolute;
  top:             50%;
  transform:       translateY(-50%);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           var(--ds-fg-subtle);
  pointer-events:  none;
  width:           16px;
  height:          16px;
}
.ds-input__icon--left  { left:  12px; }
.ds-input__icon--right { right: 12px; }

.ds-input--adaptive .ds-input__icon {
  top:       12px;
  transform: none;
}

.ds-input__wrap--icon-left  .ds-input__control { padding-left:  36px; }
.ds-input__wrap--icon-right .ds-input__control { padding-right: 36px; }

/* Validation message */
.ds-input__message {
  font-size:   12px;
  margin:      0;
  line-height: 1.4;
}
.ds-input__message--error { color: var(--ds-fg-error); }
`;

/* Inyectado una sola vez al cargar el módulo, no dentro del render */
let _styleInjected = false;
function injectStyles() {
  if (_styleInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  _styleInjected = true;
}
injectStyles();

/* useLayoutEffect isomórfico — evita warnings de SSR (Next.js, etc.) */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function Icon({ name, size = 16 }) {
  const C = ICONS[name];
  if (!C) return null;
  return <C size={size} strokeWidth={1.75} aria-hidden="true" />;
}

function mergeRefs(...refs) {
  return (el) => refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });
}

/* ─── Input ────────────────────────────────────────────────────────────────── */

export const Input = forwardRef(function Input({
  label,
  description,
  placeholder   = '',
  value,
  defaultValue,
  onChange,
  type          = 'text',
  adaptive      = false,
  state         = 'default',
  errorMessage,
  iconLeft,
  iconRight,
  fullWidth     = false,
  id,
  name,
  ariaLabel,
  onFocus,
  onBlur,
  ...nativeProps   // autoComplete, inputMode, maxLength, min, max, pattern, required…
}, forwardedRef) {

  const internalRef = useRef(null);

  /* useId — SSR-safe, estable entre hidratación y cliente (React 18+) */
  const generatedId = useId();
  const inputId     = id || generatedId;

  /* IDs de elementos de soporte — solo existen si hay contenido real */
  const descId = description                       ? `${inputId}-desc` : null;
  const msgId  = state === 'error' && errorMessage ? `${inputId}-msg`  : null;

  /* aria-describedby solo se emite cuando hay al menos un elemento que referenciar */
  const describedBy = [descId, msgId].filter(Boolean).join(' ') || undefined;

  /* Warning en dev si el control no tiene nombre accesible */
  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn(
      '[DS Input] El componente necesita `label` o `ariaLabel` para ser accesible.',
      { id: inputId, name }
    );
  }

  /* Auto-grow del textarea:
     - useIsomorphicLayoutEffect evita el warning de SSR
     - observa `value` para soportar textarea controlado desde el padre */
  useIsomorphicLayoutEffect(() => {
    if (!adaptive || !internalRef.current) return;
    const el = internalRef.current;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [adaptive, value]);

  function handleChange(e) {
    if (adaptive) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
    onChange?.(e);
  }

  const wrapperClasses = [
    'ds-input',
    state === 'error'     ? 'ds-input--error'    : '',
    state === 'read-only' ? 'ds-input--readonly'  : '',
    state === 'disabled'  ? 'ds-input--disabled'  : '',
    adaptive              ? 'ds-input--adaptive'  : '',
    fullWidth             ? 'ds-input--full-width' : '',
  ].filter(Boolean).join(' ');

  const wrapClasses = [
    'ds-input__wrap',
    iconLeft  ? 'ds-input__wrap--icon-left'  : '',
    iconRight ? 'ds-input__wrap--icon-right' : '',
  ].filter(Boolean).join(' ');

  const controlProps = {
    ref:                mergeRefs(internalRef, forwardedRef),
    id:                 inputId,
    name,
    placeholder,
    value,
    defaultValue,
    onChange:           handleChange,
    onFocus,
    onBlur,
    disabled:           state === 'disabled',
    readOnly:           state === 'read-only',
    'aria-label':       !label ? ariaLabel : undefined,
    'aria-describedby': describedBy,
    'aria-invalid':     state === 'error' ? 'true' : undefined,
    className:          'ds-input__control',
    ...nativeProps,
  };

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="ds-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      {description && (
        <p className="ds-input__description" id={descId}>
          {description}
        </p>
      )}
      <div className={wrapClasses}>
        {iconLeft && (
          <span className="ds-input__icon ds-input__icon--left">
            <Icon name={iconLeft} />
          </span>
        )}
        {adaptive
          ? <textarea {...controlProps} rows={1} />
          : <input    {...controlProps} type={type} />
        }
        {iconRight && (
          <span className="ds-input__icon ds-input__icon--right">
            <Icon name={iconRight} />
          </span>
        )}
      </div>

      {/* errorMessage solo se renderiza en estado error */}
      {state === 'error' && errorMessage && (
        <p
          className="ds-input__message ds-input__message--error"
          id={msgId}
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

// Básico controlado
<Input label="Nombre" value={name} onChange={e => setName(e.target.value)} />

// Con icono y autoComplete
<Input label="Email" type="email" iconLeft="Search" autoComplete="email" />

// Error
<Input
  label="Teléfono"
  type="tel"
  state="error"
  errorMessage="Formato incorrecto. Ej: +34 612 345 678"
/>

// Read-only
<Input label="IBAN" state="read-only" value="ES91 2100 0418 4502 0005 1332" />

// Disabled
<Input label="Bloqueado" state="disabled" placeholder="No disponible" />

// Adaptive (textarea) — usar value para modo controlado, defaultValue para no controlado
<Input label="Notas" adaptive value={notes} onChange={e => setNotes(e.target.value)} />

// Props nativas
<Input label="Código postal" inputMode="numeric" maxLength={5} autoComplete="postal-code" />

// Ref externo
const inputRef = useRef(null);
<Input ref={inputRef} label="Buscar" iconLeft="Search" />
inputRef.current.focus();

// Sin label visible — requiere ariaLabel para accesibilidad
<Input ariaLabel="Buscar en el catálogo" iconLeft="Search" placeholder="Buscar..." fullWidth />
*/
