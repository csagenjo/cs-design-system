export { ICONS } from './icons';

export function mergeRefs(...refs) {
  return (el) => refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });
}

const _injected = new Set();
export function injectStyles(id, css) {
  if (_injected.has(id) || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  _injected.add(id);
}

/* ─── Caja de campo común a los 6 inputs (27/10/2026, igual que Figma) ─────
   Figma `.Field` / Dropdown / Date / Stepper Build / Telephone Field / Amount
   Field: misma caja y mismos estados en todos.

   .ds-input-root  → raíz de cada input: área de foco de 4 px alrededor
                     (Input/InputCommon/root/focusArea/padding), así el anillo
                     queda dentro del componente. Label, ayuda y error van
                     dentro, alineados con el borde del campo.
   .ds-input-box   → la caja del campo (borde, fondo, radio).
                     Estados: :hover (borde emphasis) · .is-error · .is-readonly
                     (fondo y borde de disabled, texto normal) · .is-disabled.
                     Foco: borde intacto + hueco focus-inner 2 px + anillo
                     focus-outer 2 px, por fuera. `:focus-visible` cuando la caja
                     ES el control; `.ds-input-box--within` cuando lo contiene.
   .ds-input-split → dos cajas juntas (país/teléfono, divisa/importe): la
                     segunda se solapa el ancho del borde y la parte en hover,
                     foco o error pasa por encima, así el borde compartido toma
                     su color (Figma: Hover/Focus/Error - Country|Telephone). */
const INPUT_BOX_CSS = `
.ds-input-root { margin: var(--ds-input-focus-area-padding); box-sizing: border-box; }
.ds-input-root--full-width { width: calc(100% - 2 * var(--ds-input-focus-area-padding)); }

.ds-input-box {
  box-sizing:    border-box;
  min-height:    var(--ds-input-min-height);
  color:         var(--ds-input-fg-default);
  background:    var(--ds-input-bg-default);
  border:        var(--ds-input-border-width) solid var(--ds-input-border-default);
  border-radius: var(--ds-input-border-radius);
  outline:       none;
  transition:    border-color 0.12s, background 0.12s;
}
.ds-input-box::placeholder,
.ds-input-box ::placeholder { color: var(--ds-input-fg-placeholder); opacity: 1; }

.ds-input-box:hover:not(.is-error):not(.is-readonly):not(.is-disabled) { border-color: var(--ds-input-border-hover); }
.ds-input-box.is-error    { border-color: var(--ds-input-border-error); }
.ds-input-box.is-readonly { background: var(--ds-input-bg-disabled); border-color: var(--ds-input-border-disabled); }
.ds-input-box.is-disabled {
  background:   var(--ds-input-bg-disabled);
  border-color: var(--ds-input-border-disabled);
  color:        var(--ds-input-fg-disabled);
  cursor:       not-allowed;
}

.ds-input-box:focus-visible,
.ds-input-box:is(input, select, textarea):focus,
.ds-input-box--within:focus-within {
  outline:        var(--ds-input-border-width-focus) solid var(--ds-input-focus-outer);
  outline-offset: var(--ds-input-border-width-focus);
  box-shadow:     0 0 0 var(--ds-input-border-width-focus) var(--ds-input-focus-inner);
}

.ds-input-split { display: flex; align-items: stretch; width: 100%; }
.ds-input-split > .ds-input-box:first-child:not(:last-child) { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.ds-input-split > .ds-input-box + .ds-input-box {
  margin-left:               calc(-1 * var(--ds-input-border-width));
  border-top-left-radius:    0;
  border-bottom-left-radius: 0;
}
.ds-input-split > .ds-input-box { position: relative; }
.ds-input-split > .ds-input-box:is(.is-error, :focus-visible, :focus, .ds-input-box--within:focus-within) { z-index: 2; }
.ds-input-split > .ds-input-box:hover:not(.is-disabled) { z-index: 1; }
`;
injectStyles('ds-input-common', INPUT_BOX_CSS);

/** Clases de estado de la caja: state = default | error | read-only | disabled */
export function boxStateClass(state) {
  return state === 'error'     ? 'is-error'
       : state === 'read-only' ? 'is-readonly'
       : state === 'disabled'  ? 'is-disabled'
       : '';
}
