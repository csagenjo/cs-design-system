/**
 * DescriptionList — Organismo (UIKit Plataforma)
 * CS Design System · v2 (27/10/2026: alineado 1:1 con Figma)
 *
 * Lista de descripción (pares label/valor). Figma: set `Description List`
 * (Variants Text / Not Filled / Link + Icon / Badge / Unordered / Ordered /
 * Checkmark List / Account × Orientation) y set `Description List section`
 * (Section Header + pares + Edit de la sección).
 *
 * En código las 8 "Variants" no son un enum: el valor es un slot libre
 * (`children` de cada item) donde el consumidor instancia Link, BadgeHighlight,
 * List, AmountView… DescriptionList NUNCA los reimplementa. La única variante
 * con estructura propia, Account, es `DescriptionListAccount`.
 *
 * Geometría (Figma, tokens descriptionList/all/*):
 *   · cada par = contenido + 8 + línea (también el último), 8 entre pares
 *   · landscape: label y valor a partes iguales, alineados por la línea base
 *   · portrait: valor bajo el label, 8 entre ellos
 *   · Edit (Link) 8 bajo el valor
 *   · sección: Section Header (19, primary, bold) + 8 + lista + 8 + Edit
 *
 * USO:
 *   <DescriptionList title="Customer" showEdit onEdit={fn}>
 *     <DescriptionListItem label="Name">Jane Doe</DescriptionListItem>
 *     <DescriptionListItem label="Status"><BadgeHighlight label="Active" /></DescriptionListItem>
 *     <DescriptionListItem label="Phone" emptyText="Not filled" />
 *     <DescriptionListItem label="Account">
 *       <DescriptionListAccount name="Main account" amount="1,289.00" currency="EUR" number="XX71 0961 2345 6769" />
 *     </DescriptionListItem>
 *   </DescriptionList>
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Link } from '../components/Link';
import { Icon } from '../components/Icon';
import { AmountView } from '../components/AmountView';
import { SectionHeader } from '../components/SectionHeader';
import { VisuallyHidden } from '../components/VisuallyHidden';

const css = `
.ds-dl-section {
  display:        flex;
  flex-direction: column;
  align-items:    flex-start;
  gap:            var(--ds-descriptionlist-gap);
  width:          100%;
  font-family:    inherit;
}

.ds-dl {
  margin:         0;
  display:        flex;
  flex-direction: column;
  width:          100%;
  font-family:    inherit;
}

/* Cada par = contenido + 8 + línea (también el último), 8 entre pares.
   La línea es el borde del grupo, no un <hr> dentro de <dl> (A11y-5). */
.ds-dl-item {
  display:        flex;
  gap:            var(--ds-descriptionlist-gap);
  padding-bottom: var(--ds-descriptionlist-gap);
  border-bottom:  var(--ds-descriptionlist-divider-width) solid var(--ds-descriptionlist-divider-color);
}
.ds-dl-item + .ds-dl-item { margin-top: var(--ds-descriptionlist-gap); }
.ds-dl--landscape .ds-dl-item { flex-direction: row;    align-items: baseline; }
.ds-dl--portrait  .ds-dl-item { flex-direction: column; }

.ds-dl-item__label {
  font-size:   var(--ds-fontSize-label-md);
  line-height: var(--ds-lineHeight-label-md);
  font-weight: var(--ds-font-weight-regular);
  color:       var(--ds-descriptionlist-label-fg-generic);
}
.ds-dl--landscape .ds-dl-item__label,
.ds-dl--landscape .ds-dl-item__value { flex: 1 1 0; min-width: 0; }
.ds-dl-item__label--bold { font-weight: var(--ds-font-weight-bold); }

.ds-dl-item__value {
  margin:         0;
  display:        flex;
  flex-direction: column;
  align-items:    flex-start;
  gap:            var(--ds-descriptionlist-gap);
  min-width:      0;
  font-size:      var(--ds-fontSize-body-sm);
  line-height:    var(--ds-lineHeight-body-sm);
  font-weight:    var(--ds-font-weight-regular);
  color:          var(--ds-descriptionlist-valuetext-fg-generic);
  overflow-wrap:  anywhere;
}
.ds-dl-item__value--empty { color: var(--ds-descriptionlist-valuetext-fg-subtle); }

/* Account: icono opcional + nombre / importe / número / segundo valor */
.ds-dl-account { display: flex; align-items: flex-start; gap: var(--ds-descriptionlist-gap); }
.ds-dl-account__icon {
  display: inline-flex; flex-shrink: 0;
  width:  var(--ds-descriptionlist-icon-account-size);
  height: var(--ds-descriptionlist-icon-account-size);
  color:  var(--ds-descriptionlist-icon-account-fg);
}
.ds-dl-account__values { display: flex; flex-direction: column; align-items: flex-start; gap: var(--ds-descriptionlist-account-gap); min-width: 0; }
.ds-dl-account__name {
  font-size: var(--ds-fontSize-label-md); line-height: var(--ds-lineHeight-label-md);
  font-weight: var(--ds-font-weight-regular); color: var(--ds-descriptionlist-accountname-fg-generic);
}
.ds-dl-account__number {
  font-size: var(--ds-fontSize-label-sm); line-height: var(--ds-lineHeight-label-sm);
  font-weight: var(--ds-font-weight-regular); color: var(--ds-descriptionlist-iban-fg-generic);
}
.ds-dl-account__helper {
  font-size: var(--ds-fontSize-body-xs); line-height: var(--ds-lineHeight-body-xs);
  font-weight: var(--ds-font-weight-regular); color: var(--ds-descriptionlist-helpertext-fg-generic);
}
`;

injectStyles('ds-description-list', css);

/* "Edit Status": el texto oculto dice qué se edita (A11y-3). */
function EditLink({ label, target, onEdit }) {
  return (
    <Link rightIcon={false} onClick={onEdit}>
      {label}
      {typeof target === 'string' && target && <VisuallyHidden>{` ${target}`}</VisuallyHidden>}
    </Link>
  );
}

/* ─── DescriptionListAccount — valor de la variante Account ────────────────── */

export function DescriptionListAccount({
  name,                    // Account name
  amount,                  // ya formateado
  currency,
  amountType = 'positive', // 'positive' | 'negative'
  amountHighlight = 'neutral',
  number,                  // número de cuenta / IBAN
  helperText,              // Figma "2nd value/helper txt"
  icon,                    // nombre de icono (Figma "Show icon" + "Icon")
}) {
  return (
    <span className="ds-dl-account">
      {icon && (
        <span className="ds-dl-account__icon" aria-hidden="true">
          <Icon name={icon} size="sm" />
        </span>
      )}
      <span className="ds-dl-account__values">
        {name && <span className="ds-dl-account__name">{name}</span>}
        {amount != null && (
          <AmountView as="span" amount={amount} currency={currency} type={amountType} highlight={amountHighlight} size="sm" />
        )}
        {number && <span className="ds-dl-account__number">{number}</span>}
        {helperText && <span className="ds-dl-account__helper">{helperText}</span>}
      </span>
    </span>
  );
}

DescriptionListAccount.displayName = 'DescriptionListAccount';

/* ─── DescriptionListItem ──────────────────────────────────────────────────── */

export function DescriptionListItem({
  label,
  labelWeight = 'regular',  // 'regular' | 'bold'
  emptyText,                // Figma "Not Filled"
  showEdit = false,
  onEdit,
  editLabel = 'Edit',
  children,
}) {
  const isEmpty = (children == null || children === '') && emptyText != null;

  return (
    <div className="ds-dl-item">
      <dt className={['ds-dl-item__label', labelWeight === 'bold' ? 'ds-dl-item__label--bold' : ''].filter(Boolean).join(' ')}>
        {label}
      </dt>
      <dd className={['ds-dl-item__value', isEmpty ? 'ds-dl-item__value--empty' : ''].filter(Boolean).join(' ')}>
        {isEmpty ? <span>{emptyText}</span> : children}
        {showEdit && <EditLink label={editLabel} target={label} onEdit={onEdit} />}
      </dd>
    </div>
  );
}

DescriptionListItem.displayName = 'DescriptionListItem';

/* ─── DescriptionList ──────────────────────────────────────────────────────── */

export function DescriptionList({
  orientation = 'landscape',  // 'landscape' | 'portrait'
  title,                      // Figma "Description List section": Section Header
  titleLevel  = 2,            // nivel del encabezado; lo decide la página
  showEdit    = false,        // Edit de toda la sección (debajo de la lista)
  onEdit,
  editLabel   = 'Edit',
  children,
  className,
  style,
}) {
  const list = (
    <dl className={['ds-dl', `ds-dl--${orientation}`, title || showEdit ? '' : className || ''].filter(Boolean).join(' ')}
        style={title || showEdit ? undefined : style}>
      {children}
    </dl>
  );

  if (!title && !showEdit) return list;

  return (
    <section className={['ds-dl-section', className || ''].filter(Boolean).join(' ')} style={style}>
      {title && <SectionHeader size="md" color="primary" level={titleLevel}>{title}</SectionHeader>}
      {list}
      {showEdit && <EditLink label={editLabel} target={typeof title === 'string' ? title : ''} onEdit={onEdit} />}
    </section>
  );
}

DescriptionList.displayName = 'DescriptionList';
export default DescriptionList;
