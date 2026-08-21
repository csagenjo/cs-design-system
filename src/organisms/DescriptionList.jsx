/**
 * DescriptionList — Organismo (UIKit Plataforma)
 * CS Design System · v1.0
 *
 * Lista de descripción (pares label/valor). Contenedor tonto + children, igual
 * que CellData/Table: NO se replican como enum los 8 "Variants" que Figma hornea
 * (Figma los separa por no tener slots reales; en código es composición).
 *
 * Los valores son un slot libre (`children` de cada item): texto plano, o átomos
 * importados e instanciados por el consumidor — <BadgeHighlight>, <List>,
 * <AmountView>, etc. DescriptionList NUNCA los reimplementa (regla del proyecto).
 * El título de sección y los divisores usan los átomos SectionHeader / Divider.
 *
 * Ejes:
 *   · orientation : landscape (label|valor lado a lado) | portrait (valor bajo label)
 *   · DescriptionListItem.labelWeight : regular | bold
 *   · DescriptionListItem.emptyText   : estado "Not Filled" → valuetext-fg-subtle
 *   · DescriptionListItem.showEdit/onEdit : Link "Edit" (instancia real de Link)
 *
 * Tokens: --ds-descriptionlist-* (Componente→Mode). Tipografía directa de Device.
 *
 * USO:
 *   <DescriptionList orientation="landscape">
 *     <DescriptionListItem label="Cliente">García Fernández</DescriptionListItem>
 *     <DescriptionListItem label="Estado" showEdit onEdit={fn}>
 *       <BadgeHighlight label="Activo" />
 *     </DescriptionListItem>
 *     <DescriptionListItem label="Saldo" emptyText="Sin datos" />
 *   </DescriptionList>
 */

import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Divider } from '../components/Divider';
import { Link } from '../components/Link';

const css = `
.ds-dl {
  margin:  0;
  display: flex;
  flex-direction: column;
  width:   100%;
  font-family: inherit;
}

.ds-dl-item {
  display: flex;
  gap:     var(--ds-spacing-md);           /* 8 */
  padding: var(--ds-spacing-sm) 0;         /* 6 vert */
}
.ds-dl--landscape .ds-dl-item { flex-direction: row;    align-items: baseline; }
.ds-dl--portrait  .ds-dl-item { flex-direction: column; }

.ds-dl-item__label {
  flex-shrink: 0;
  font-size:   var(--ds-fontSize-label-md);    /* 16 */
  line-height: var(--ds-lineHeight-xs);        /* 24 */
  font-weight: var(--ds-font-weight-regular);  /* 400 */
  color:       var(--ds-descriptionlist-label-fg-generic);
}
.ds-dl--landscape .ds-dl-item__label { width: 40%; }
.ds-dl-item__label--bold { font-weight: var(--ds-font-weight-bold); } /* 700 */

.ds-dl-item__value {
  margin:      0;
  flex:        1 1 auto;
  min-width:   0;
  font-size:   var(--ds-fontSize-body-sm);     /* 16 */
  line-height: var(--ds-lineHeight-xs);        /* 24 */
  font-weight: var(--ds-font-weight-regular);  /* 400 */
  color:       var(--ds-descriptionlist-valuetext-fg-generic);
}
.ds-dl-item__value--empty { color: var(--ds-descriptionlist-valuetext-fg-subtle); }

.ds-dl-item__edit { margin-top: var(--ds-spacing-xs); } /* 4 */
`;

injectStyles('ds-description-list', css);

/* ─── DescriptionListItem ──────────────────────────────────────────────────── */

export function DescriptionListItem({
  label,
  labelWeight = 'regular',  // 'regular' | 'bold'
  emptyText,
  showEdit = false,
  onEdit,
  children,
}) {
  const isEmpty = (children == null || children === '') && emptyText != null;

  const labelClasses = [
    'ds-dl-item__label',
    labelWeight === 'bold' ? 'ds-dl-item__label--bold' : '',
  ].filter(Boolean).join(' ');

  const valueClasses = [
    'ds-dl-item__value',
    isEmpty ? 'ds-dl-item__value--empty' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="ds-dl-item">
      <dt className={labelClasses}>{label}</dt>
      <dd className={valueClasses}>
        {isEmpty ? emptyText : children}
        {showEdit && (
          <div className="ds-dl-item__edit">
            <Link rightIcon={false} onClick={onEdit}>Edit</Link>
          </div>
        )}
      </dd>
    </div>
  );
}

DescriptionListItem.displayName = 'DescriptionListItem';

/* ─── DescriptionList ──────────────────────────────────────────────────────── */

export function DescriptionList({
  orientation = 'landscape',  // 'landscape' | 'portrait'
  children,
  className,
  style,
}) {
  const classes = [
    'ds-dl',
    `ds-dl--${orientation}`,
    className || '',
  ].filter(Boolean).join(' ');

  const items = React.Children.toArray(children);

  return (
    <dl className={classes} style={style}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </dl>
  );
}

DescriptionList.displayName = 'DescriptionList';
export default DescriptionList;
