import React, { forwardRef } from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { injectStyles } from './_inputBase';
import { Radio } from './Radio';
import { Checkbox } from './Checkbox';

const css = `
.ds-selector-list-item {
  box-sizing:     border-box;
  display:        flex;
  align-items:    center;
  width:          100%;
  gap:            var(--ds-selector-root-gap);
  padding-left:   var(--ds-selector-root-padding);
  background:     var(--ds-selector-root-bg-generic);
  border:         var(--ds-selector-root-border-width-generic) solid var(--ds-selector-root-border-color-generic);
  border-radius:  var(--ds-selector-root-border-radius-generic);
  font-family:    inherit;
  text-align:     left;
  cursor:         pointer;
  transition:     border-color 0.12s, background 0.12s;
}

.ds-selector-list-item__icon-left {
  flex-shrink: 0;
  display:     flex;
  color:       var(--ds-selector-icon-left-fg);
}
.ds-selector-list-item__icon-left svg {
  width:  var(--ds-selector-icon-left-size);
  height: var(--ds-selector-icon-left-size);
}

.ds-selector-list-item__content {
  box-sizing:  border-box;
  display:     flex;
  align-items: center;
  gap:         var(--ds-selector-root-gap);
  flex:        1 1 auto;
  min-width:   0;
  padding:     var(--ds-selector-root-padding) var(--ds-selector-root-padding) var(--ds-selector-root-padding) 0;
}

.ds-selector-list-item__center {
  display:        flex;
  flex-direction: column;
  gap:            var(--ds-spacing-xs);
  flex:           1 1 auto;
  min-width:      0;
  text-align:     left;
}

.ds-selector-list-item__header {
  font-size:   var(--ds-fontSize-title-sm);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-lineHeight-xs);
  color:       var(--ds-selector-header-fg-default);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-selector-list-item__description {
  font-size:   var(--ds-fontSize-body-xs);
  line-height: var(--ds-lineHeight-2xs);
  color:       var(--ds-selector-description-fg-subtle);
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-selector-list-item__detail {
  display:     inline-flex;
  align-items: center;
  gap:         var(--ds-spacing-xs);
  font-size:   var(--ds-fontSize-body-xs);
  line-height: var(--ds-lineHeight-2xs);
  color:       var(--ds-selector-detail-text-fg-default);
  overflow:    hidden;
}
.ds-selector-list-item__detail svg { flex-shrink: 0; width: var(--ds-selector-detail-icon-size); height: var(--ds-selector-detail-icon-size); }
.ds-selector-list-item__detail span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ds-selector-list-item__right {
  flex-shrink: 0;
  display:     inline-flex;
  align-items: center;
}

/* Hover */
.ds-selector-list-item--unselected:hover,
.ds-selector-list-item--selected:hover {
  background: var(--ds-selector-root-bg-hover);
}

/* Pressed */
.ds-selector-list-item--unselected:active,
.ds-selector-list-item--selected:active {
  opacity: var(--ds-selector-root-opacity-pressed);
}

/* Selected */
.ds-selector-list-item--selected {
  border-width: var(--ds-selector-root-border-width-focus);
  border-color: var(--ds-selector-root-border-color-selected);
}

/* Error */
.ds-selector-list-item--error {
  border-width: var(--ds-selector-root-border-width-focus);
  border-color: var(--ds-selector-root-border-color-error);
}

/* Focus — anillo unico blanco, activado cuando el Radio/Checkbox interno recibe foco de teclado.
   La fila vive dentro de un listado: no lleva el doble anillo aislado del Invoker. */
.ds-selector-list-item:has(:focus-visible) {
  box-shadow: 0 0 0 var(--ds-selector-root-border-width-focus) var(--ds-selector-root-border-color-focus-inner);
}

/* Data hidden */
.ds-selector-list-item--dataHidden { cursor: default; }

/* Disabled */
.ds-selector-list-item--disabled {
  background:   var(--ds-selector-root-bg-disabled);
  border-color: var(--ds-selector-root-border-color-disabled);
  cursor:       not-allowed;
}
.ds-selector-list-item--disabled .ds-selector-list-item__icon-left { color: var(--ds-selector-icon-left-fg-disabled); }
.ds-selector-list-item--disabled .ds-selector-list-item__header { color: var(--ds-selector-header-fg-disabled); }
.ds-selector-list-item--disabled .ds-selector-list-item__description { color: var(--ds-selector-description-fg-disabled); }
.ds-selector-list-item--disabled .ds-selector-list-item__detail { color: var(--ds-selector-detail-text-fg-disabled); }
`;

injectStyles('ds-selector-list-item', css);

export const SelectorListItem = forwardRef(function SelectorListItem({
  data             = 'single',       // 'single' | 'multiple'
  state,                              // 'error' | 'disabled' | 'dataHidden' — selected/unselected se deriva de `selected`
  headerText       = 'Selected Data',
  descriptionText,
  detailText,
  selected         = false,
  onSelectedChange,
  onClick,
  disabled         = false,
  id,
}, forwardedRef) {

  const isDisabled   = disabled || state === 'disabled';
  const isError      = state === 'error';
  const isDataHidden = state === 'dataHidden';

  const rootClasses = [
    'ds-selector-list-item',
    isError      ? 'ds-selector-list-item--error'      : '',
    isDataHidden ? 'ds-selector-list-item--dataHidden'  : '',
    isDisabled   ? 'ds-selector-list-item--disabled'    : (selected ? 'ds-selector-list-item--selected' : 'ds-selector-list-item--unselected'),
  ].filter(Boolean).join(' ');

  const mask = (text) => (isDataHidden ? '••••••••' : text);

  function handleRowClick(e) {
    if (isDisabled) return;
    onSelectedChange?.(!selected);
    onClick?.(e);
  }

  const SelectionControl = data === 'multiple' ? Checkbox : Radio;

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={rootClasses}
      aria-disabled={isDisabled || undefined}
      onClick={handleRowClick}
    >
      <span className="ds-selector-list-item__icon-left">
        <FileText strokeWidth={1.75} aria-hidden="true" />
      </span>

      <span className="ds-selector-list-item__content">
        <span className="ds-selector-list-item__center">
          <span className="ds-selector-list-item__header">{mask(headerText)}</span>

          {descriptionText && (
            <span className="ds-selector-list-item__description">{mask(descriptionText)}</span>
          )}

          {detailText && (
            <span className="ds-selector-list-item__detail">
              <LinkIcon strokeWidth={1.75} aria-hidden="true" />
              <span>{mask(detailText)}</span>
            </span>
          )}
        </span>

        <span className="ds-selector-list-item__right">
          {/* Radio/Checkbox real — es el único control nativo enfocable de la fila.
              Su propio onChange no hace nada: el click de la fila (arriba) es la fuente de verdad;
              se deja como no-op para que React no marque el input como "uncontrolled". */}
          <SelectionControl
            checked={selected}
            state={isDisabled ? 'disabled' : 'default'}
            ariaLabel={headerText}
            onChange={() => {}}
          />
        </span>
      </span>
    </div>
  );
});

SelectorListItem.displayName = 'SelectorListItem';
export default SelectorListItem;
