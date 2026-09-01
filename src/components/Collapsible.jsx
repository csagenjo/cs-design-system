/**
 * Collapsible — Componente atómico
 * CS Design System · v1.0
 *
 * Trigger con label ("Expand"/"Collapse") + chevron, usado para expandir o
 * colapsar contenido. Instancia `Button` (`variant="default" outline`) sin
 * reimplementar su lógica (regla CLAUDE.md §5) — solo re-tematiza color
 * redefiniendo localmente las CSS custom properties que Button ya consume
 * (`--ds-button-border-default`, `--ds-button-fg-default-outline`), el mismo
 * mecanismo que el rebind de variables en Figma. El Button interno usa
 * SIEMPRE `variant="default" outline` — el color visible (negro/rosa) lo fija
 * `variant` de Collapsible, no el de Button (así resuelve también en Figma:
 * las dos variantes de Collapsible instancian el mismo Button, solo cambia
 * el token de color).
 *
 * `expanded` decide label+icono: `false` → "Expand"/chevron-down,
 * `true` → "Collapse"/chevron-up. Collapsible no gestiona el propio estado
 * expandido/colapsado del contenido — es responsabilidad del consumidor.
 *
 * USO:
 *   <Collapsible expanded={open} onToggle={() => setOpen(!open)} />
 *   <Collapsible variant="secondary" size="sm" expanded={open} onToggle={fn} />
 *   <Collapsible labels={{ expand: 'Ver más', collapse: 'Ver menos' }} expanded={open} onToggle={fn} />
 */

import React from 'react';
import { injectStyles } from './_inputBase';
import { Button } from './Button';

const css = `
.ds-collapsible--default {
  --ds-button-border-default:     var(--ds-collapsible-border-color-default);
  --ds-button-fg-default-outline: var(--ds-collapsible-label-fg-default);
}
.ds-collapsible--secondary {
  --ds-button-border-default:     var(--ds-collapsible-border-color-secondary);
  --ds-button-fg-default-outline: var(--ds-collapsible-label-fg-secondary);
}
`;

injectStyles('ds-collapsible', css);

export function Collapsible({
  variant  = 'default', // 'default' | 'secondary'
  size     = 'md',       // 'sm' | 'md' | 'lg' — misma escala que Button
  expanded = false,
  onToggle,
  labels   = { expand: 'Expand', collapse: 'Collapse' },
  id,
  className,
}) {
  const classes = [
    'ds-collapsible',
    `ds-collapsible--${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} id={id}>
      <Button
        variant="default"
        outline
        size={size}
        iconRight={expanded ? 'chevron-up' : 'chevron-down'}
        onClick={onToggle}
      >
        {expanded ? labels.collapse : labels.expand}
      </Button>
    </div>
  );
}

export default Collapsible;


/* ─── Ejemplos de uso ──────────────────────────────────────────────────────

<Collapsible expanded={open} onToggle={() => setOpen(!open)} />

<Collapsible variant="secondary" size="sm" expanded={open} onToggle={fn} />

<Collapsible
  labels={{ expand: 'Ver más', collapse: 'Ver menos' }}
  expanded={open}
  onToggle={fn}
/>
*/
