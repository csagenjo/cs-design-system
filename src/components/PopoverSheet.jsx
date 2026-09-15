/**
 * PopoverSheet — Componente atómico
 * CS Design System · v1.1
 *
 * Contenedor flotante de contenido libre (Figma no modela cabecera ni body —
 * mismo criterio que Dialog/ErrorAndEmptyState: `children` es un slot
 * ReactNode, sin replicar nada dentro).
 *
 * v1.1 (15/09) — reescrito para resolver la deuda de popover/positioning
 * compartido (CLAUDE.md §10, "le toca a Popover Sheet cuando llegue su
 * turno") y 2 bugs reales de v1.0:
 *   1. La flecha se centraba respecto al ancho de la propia tarjeta, no del
 *      trigger — con un trigger más estrecho que la tarjeta (el caso normal)
 *      quedaba desplazada. Ahora `PopoverSheet` envuelve el `trigger` (el
 *      wrapper `position:relative` que antes tenía que aportar el consumidor)
 *      y mide su ancho/alto real con `ResizeObserver`, exponiéndolo como
 *      `--ds-popover-anchor-width/-height` — la flecha centrada usa esa
 *      variable, no `%` de sí misma.
 *   2. No había cierre por Escape ni por click-fuera (solo la X). Extraído a
 *      `_popoverDismiss.js`, el mismo hook que ahora usan Combobox y
 *      CountryPicker para su click-fuera (antes duplicado en los dos) — el
 *      hueco de Escape en CountryPicker también se cierra de paso.
 * Sigue sin resolver el "flip" ante borde de viewport (fuera de scope v1.1,
 * anotado en CLAUDE.md §10) — Combobox/CountryPicker no lo necesitan (panel
 * siempre debajo, full-width) y no hay todavía un caso real que lo pida aquí.
 *
 * Foco: al abrir, el panel recibe foco (`tabIndex=-1` + `.focus()`) para que
 * un lector de pantalla anuncie el `role="dialog"`; al cerrar (por cualquier
 * vía: X, Escape, click-fuera), el foco vuelve al primer elemento enfocable
 * del trigger. No es un focus-trap completo (Dialog/DialogSimple tampoco lo
 * tienen) — alcance consciente, no una regresión respecto al resto del catálogo.
 *
 * `trigger` se renderiza tal cual, SIN `cloneElement` para inyectarle
 * `aria-expanded`/`aria-haspopup` — se probó, pero `Button.jsx`/`IconButton.jsx`
 * no reenvían props desconocidas a su `<button>` real (lista de props fija,
 * sin rest-spread), así que la inyección quedaba silenciosamente sin efecto
 * con los triggers más comunes del catálogo. Mismo hueco ya existente hoy en
 * `Tooltip.jsx` (su `aria-describedby` vía `cloneElement` tiene el mismo
 * problema con su propio ejemplo de uso, `<Tooltip><IconButton/></Tooltip>`).
 * Deuda nueva anotada en CLAUDE.md §10: añadir rest-spread a Button/IconButton
 * antes de que Tooltip o PopoverSheet puedan anotar el trigger de verdad.
 *
 * `placement` decide en qué lado del trigger aparece la tarjeta.
 * `pointer` decide dónde, a lo largo del borde perpendicular, se dibuja la
 * flecha — 'left'/'right' son siempre inicio/fin de ese borde (horizontal en
 * top/bottom, vertical en left/right), no direcciones de compás; en esos dos
 * casos el offset ya es un píxel fijo desde el borde del trigger (correcto
 * sin cambios); solo 'center' necesitaba la corrección del punto 1 de arriba.
 *
 * Botón de cierre: `<button>` + `Icon name="X" size="sm"` (24px, igual que
 * la variante Icon Size=24 de Figma) — sin estados hover propios, mismo
 * criterio que el icon-btn de DialogHeader (ver debt review 14/09: instanciar
 * IconButton aquí sería sobre-ingeniería, Figma no define hover/pressed para
 * este control, igual que en Dialog).
 *
 * `ariaLabel` es fuertemente recomendado (avisa por consola en dev si falta,
 * mismo criterio que el dev-warn de CellActions) — sin nombre accesible un
 * lector de pantalla anuncia un `role="dialog"` sin identificar de qué trata.
 *
 * USO:
 *   <PopoverSheet
 *     trigger={<Button onClick={() => setOpen(true)}>Abrir</Button>}
 *     open={open}
 *     placement="bottom"
 *     pointer="center"
 *     ariaLabel="Detalle de la fila"
 *     onClose={() => setOpen(false)}
 *   >
 *     Contenido libre
 *   </PopoverSheet>
 */
import React, { useRef, useLayoutEffect, useEffect, useId } from 'react';
import { injectStyles } from './_inputBase';
import { Icon } from './Icon';
import { usePopoverDismiss } from './_popoverDismiss';

const css = `
.ds-popover-sheet-wrapper {
  position: relative;
  display:  inline-block;
}

.ds-popover-sheet {
  position:      absolute;
  box-sizing:    border-box;
  min-width:     200px;
  text-align:    left;  /* el boilerplate de Vite pone text-align:center global — mismo bug ya visto en Accordion/InlineNotification */
  background:    var(--ds-popover-sheet-root-bg);
  border-radius: var(--ds-popover-sheet-root-border-radius);
  box-shadow:    var(--ds-popover-sheet-root-shadow);
  padding:       var(--ds-popover-sheet-root-padding);
  z-index:       10;
}
.ds-popover-sheet:focus-visible { outline: none; } /* el foco lo señala el propio trigger/close, no el panel */
.ds-popover-sheet--with-close {
  padding-top: 36px; /* despeja el hueco del botón de cierre (44×44 en Figma) */
}

.ds-popover-sheet__close {
  position:        absolute;
  top:             4px;
  right:           4px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  padding:         6px;
  background:      transparent;
  border:          none;
  border-radius:   999px;
  color:           var(--ds-popover-sheet-close-fg);
  cursor:          pointer;
}
.ds-popover-sheet__close:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }

.ds-popover-sheet__pointer {
  position: absolute;
  width:    0;
  height:   0;
}

/* Placement — dónde se coloca la tarjeta respecto al wrapper que envuelve el trigger */
.ds-popover-sheet--top    { bottom: calc(100% + var(--ds-popover-sheet-pointer-height)); left: 0; }
.ds-popover-sheet--bottom { top:    calc(100% + var(--ds-popover-sheet-pointer-height)); left: 0; }
.ds-popover-sheet--left   { right: calc(100% + var(--ds-popover-sheet-pointer-height)); top: 0; }
.ds-popover-sheet--right  { left:  calc(100% + var(--ds-popover-sheet-pointer-height)); top: 0; }

/* Flecha — triángulo CSS apuntando hacia el trigger, mismo mecanismo que Tooltip */
.ds-popover-sheet--top .ds-popover-sheet__pointer {
  top: 100%;
  border-left:  calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-right: calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-top:   var(--ds-popover-sheet-pointer-height) solid var(--ds-popover-sheet-pointer-bg);
}
.ds-popover-sheet--bottom .ds-popover-sheet__pointer {
  bottom: 100%;
  border-left:   calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-right:  calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-bottom: var(--ds-popover-sheet-pointer-height) solid var(--ds-popover-sheet-pointer-bg);
}
.ds-popover-sheet--left .ds-popover-sheet__pointer {
  left: 100%;
  border-top:    calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-bottom: calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-left:   var(--ds-popover-sheet-pointer-height) solid var(--ds-popover-sheet-pointer-bg);
}
.ds-popover-sheet--right .ds-popover-sheet__pointer {
  right: 100%;
  border-top:    calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-bottom: calc(var(--ds-popover-sheet-pointer-width) / 2) solid transparent;
  border-right:  var(--ds-popover-sheet-pointer-height) solid var(--ds-popover-sheet-pointer-bg);
}

/* Posición de la flecha a lo largo del borde perpendicular — eje horizontal (top/bottom).
   'center' usa el ancho REAL del trigger (--ds-popover-anchor-width, medido por
   ResizeObserver en el wrapper), no un % de la propia tarjeta — bug real de v1.0,
   ver docstring. 'left'/'right' ya eran un offset fijo desde el borde del trigger
   (el panel está flush con el wrapper vía left:0 de arriba), sin cambios. */
.ds-popover-sheet--top .ds-popover-sheet__pointer,
.ds-popover-sheet--bottom .ds-popover-sheet__pointer {
  left: calc(var(--ds-popover-anchor-width, 100%) / 2);
  transform: translateX(-50%);
}
.ds-popover-sheet--pointer-left.ds-popover-sheet--top .ds-popover-sheet__pointer,
.ds-popover-sheet--pointer-left.ds-popover-sheet--bottom .ds-popover-sheet__pointer {
  left: 20px;
  transform: none;
}
.ds-popover-sheet--pointer-right.ds-popover-sheet--top .ds-popover-sheet__pointer,
.ds-popover-sheet--pointer-right.ds-popover-sheet--bottom .ds-popover-sheet__pointer {
  left: auto;
  right: 20px;
  transform: none;
}

/* Posición de la flecha a lo largo del borde perpendicular — eje vertical (left/right).
   Mismo criterio que arriba: 'center' usa la altura real del trigger. */
.ds-popover-sheet--left .ds-popover-sheet__pointer,
.ds-popover-sheet--right .ds-popover-sheet__pointer {
  top: calc(var(--ds-popover-anchor-height, 100%) / 2);
  transform: translateY(-50%);
}
.ds-popover-sheet--pointer-left.ds-popover-sheet--left .ds-popover-sheet__pointer,
.ds-popover-sheet--pointer-left.ds-popover-sheet--right .ds-popover-sheet__pointer {
  top: 20px;
  transform: none;
}
.ds-popover-sheet--pointer-right.ds-popover-sheet--left .ds-popover-sheet__pointer,
.ds-popover-sheet--pointer-right.ds-popover-sheet--right .ds-popover-sheet__pointer {
  top: auto;
  bottom: 20px;
  transform: none;
}
`;

injectStyles('ds-popover-sheet', css);

function focusFirst(container) {
  container?.querySelector('button, [href], input, select, textarea, [tabindex]')?.focus();
}

export function PopoverSheet({
  trigger,
  open = false,
  placement = 'bottom',  // 'top' | 'bottom' | 'left' | 'right'
  pointer = 'center',    // 'left' | 'center' | 'right' — inicio/centro/fin del borde perpendicular
  showCloseButton = true,
  onClose,
  children,
  id,
  className,
  style,
  ariaLabel,
}) {
  const generatedId = useId();
  const panelId = id || generatedId;
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const wasOpenRef = useRef(false);

  usePopoverDismiss({ open, onClose, refs: [wrapperRef] });

  // Mide el trigger real (el wrapper, en inline-block, se ajusta exactamente
  // a él — el panel es position:absolute y no aporta ancho/alto al wrapper)
  // y lo expone como variable CSS para que la flecha centrada apunte al
  // trigger de verdad, sin importar cuánto crezca la tarjeta con el contenido.
  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) return;
    const el = wrapperRef.current;
    function updateAnchorSize() {
      el.style.setProperty('--ds-popover-anchor-width', `${el.offsetWidth}px`);
      el.style.setProperty('--ds-popover-anchor-height', `${el.offsetHeight}px`);
    }
    updateAnchorSize();
    const observer = new ResizeObserver(updateAnchorSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  // Foco: entra en el panel al abrir, vuelve al trigger al cerrar (no es un
  // focus-trap completo — alcance consciente, ver docstring). `wasOpenRef`
  // evita robar el foco en el montaje inicial (open=false de entrada nunca
  // cuenta como "se acaba de cerrar").
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else if (wasOpenRef.current && wrapperRef.current) {
      focusFirst(wrapperRef.current);
    }
    wasOpenRef.current = open;
  }, [open]);

  if (process.env.NODE_ENV !== 'production' && open && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn('PopoverSheet: falta `ariaLabel` — un lector de pantalla anunciará el panel sin nombre accesible.');
  }

  const classes = [
    'ds-popover-sheet',
    `ds-popover-sheet--${placement}`,
    `ds-popover-sheet--pointer-${pointer}`,
    showCloseButton ? 'ds-popover-sheet--with-close' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={wrapperRef} className="ds-popover-sheet-wrapper">
      {trigger}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className={classes}
          style={style}
          role="dialog"
          aria-modal="false"
          aria-label={ariaLabel}
          tabIndex={-1}
        >
          {showCloseButton && (
            <button type="button" className="ds-popover-sheet__close" onClick={onClose} aria-label="Cerrar">
              <Icon name="X" size="sm" />
            </button>
          )}
          {children}
          <span className="ds-popover-sheet__pointer" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export default PopoverSheet;
