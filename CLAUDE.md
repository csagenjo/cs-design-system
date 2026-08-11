# CLAUDE.md — CS Design System
# Leído automáticamente por Claude Code al iniciar cada sesión.

## 1. Qué es este proyecto

Librería personal de componentes React basada en Sistema Origen, limpia de IP.
Conectada con Figma CS Design System. Caso de uso: La Plataforma (back-office).
Repo: https://github.com/csagenjo/cs-design-system

## 2. Aliases — usar SIEMPRE

- **La Empresa** — la organización de origen
- **Sistema Origen** — el design system de referencia
- **La Plataforma** — la aplicación back-office de caso de uso
- **UIKit Plataforma** — el UIKit de componentes de La Plataforma

## 3. Stack y estructura

Node.js v24.16.0 · Vite · React 19 · lucide-react (iconos)
Servidor local: http://localhost:5173 · Comando: npm run dev

```
src/
  components/        ← Capa 1: SOLO átomos puros (--ds-{componente}-* tokens)
  organisms/         ← Capa 2: UIKit Plataforma (organismos compuestos de átomos)
  tokens.css         ← fuente de verdad CSS — Component tokens → var() sobre Mode
  App.jsx            banco de pruebas (se sobrescribe cada sesión)
tokens/
  Base/ Theme/ Mode/ Component/ Device/   ← exports de Figma vía Tokens Studio
docs/
  architecture.md · token-architecture.md   ← referencia completa
```

## 4. Arquitectura de tokens — 5 capas

```
Base (157) → Theme (873×7) → Mode (364×2) → Component (1038) → Device (79×2)
```

**Regla de oro:** Component → Mode → Theme → Base. Saltar capas rompe dark mode y multi-tema.

- JSX usa SOLO `--ds-{componente}-*` (Component tokens)
- tokens.css usa `var(--ds-mode-token)` en los bloques de componente
- Nunca hex hardcodeados — ni en JSX ni en tokens.css
- Icon color siempre via `currentColor` — nunca token directo en SVG
- bgMix para hover/pressed en superficies transparentes (Button, Link, CTALink, Chip, InputStepper)
- Borrowing de `InputCommon` hacia Selector es **intencional** — punto único de mantenimiento para label/helper/validation de formularios
- **Color de icono: por contraste real, nunca por nombre de Variant.** El criterio correcto es "¿el fondo de este estado concreto está relleno o es contorno?", no "¿qué Variant es esta?" — en Button, Secondary/Tertiary pasan a fondo relleno en Hover y Focus Hover (feedback de interacción fuerte), manteniendo contorno en Enabled/Pressed/Focus/Focus Pressed. Como `currentColor` ya propaga el color del padre al SVG automáticamente, esto se resuelve en CSS puro vía los estados del botón — no hace falta token de icono por estado, solo que el CSS del padre defina bien qué color aplica en cada pseudo-clase

## 5. Reglas críticas — NO hacer nunca

- NUNCA hex hardcodeados (ni #050506, ni rgba(), ni px sueltos) en JSX ni tokens.css
- NUNCA referenciar Mode (`--ds-fg-*`, `--ds-bg-*`) o Base (`--ds-color-*`) desde JSX
- NUNCA usar prefijo `.oj-` — solo `.ds-`
- NUNCA mezclar átomos (components/) con organismos (organisms/)
- NUNCA reimplementar la lógica de un átomo dentro de otro componente — importar e instanciar
- NUNCA usar nombres reales — solo los aliases de arriba
- NUNCA nombrar tokens de color de icono por la Variant de origen (`default-primary`, `accent-generic`...) — nombrar por el contraste que resuelven (`on-color`, `on-outline-default`, `on-outline-accent`). El nombre debe responder "¿qué necesita verse aquí?", no "¿de dónde viene esto?"
- NUNCA usar `fg/icon/inverse` para icono sobre superficie de color — se invierte en dark mode (pasa a negro) y deja el icono invisible. Usar `fg/icon/onColor`, que se mantiene blanco en ambos modos
- La regla "nunca saltar capas" aplica **al color** (Component→Mode→Theme→Base): el color cambia con Theme/Mode, por eso cada componente necesita su token de Componente. **Excepción documentada: la tipografía.** `fontSize`/`fontWeight`/`fontFamily`/`lineHeight` no cambian con Theme ni Mode (solo por dispositivo = capa Device), así que los componentes las consumen **directas de Device** (`fontSize/headline/2xl`, `fontWeight/regular`…) sin token de Componente intermedio. Checkbox/Radio/Headline/Helper Text lo hacen así. Ver `token-architecture.md` §tipografía.

## 6. Componentes construidos ✅

### Capa 1 — src/components/ (plano, sin subcarpetas)

| Componente | Versión | Notas |
|---|---|---|
| Button | v2 | accent/default/negative/ghost · outline · floating · iconLeft/Right · loading |
| Checkbox | v2 | indeterminate · aria-checked=mixed · doble focus ring |
| Radio | v1 | dual wrapper focus ring · label opcional |
| Chip | v1 | choice · filter selectable/dismissible · input |
| Link | v2 | default/accent · 4 sizes · emphasis low/medium |
| LinkList | v1 | nav>ul>li>Link · gap via Device tokens |
| CTALink | v2 | low/medium/high emphasis · default/accent · 24 variantes |
| InputText | v1 | iconLeft/Right · adaptive textarea |
| InputDate | v1 | icono calendario fijo |
| InputDropdown | v1 | opciones array · chevron fijo |
| InputStepper | v1 | botones −/+ · min/max/step |
| InputTelephone | v1 | selectable/fixed country · flag+code+divider |
| InputAmount | v1 | selectable/fixed currency · locale-aware |
| BadgeNotification | v1 | 4 colores × 2 tamaños · disabled |
| BadgeHighlight | v1 | emphasis/neutral/positive/negative · icono Lucide · fondo suave |
| AmountView | v1 | positive/negative × solid/soft/plain · fg/onColor para solid |
| SelectorInvoker | v1 | 8 estados × 3 dataSelection · tabla declarativa · doble focus ring |
| SelectorListItem | v1 | 8 estados × 2 dataSelection · Radio/Checkbox reales · raíz div |
| Selector | v1 | Label+Helper+SelectorInvoker+Validation · borrowing InputCommon |
| AccountSelectorInvoker | v1 | igual que SelectorInvoker + AmountView en slot descripción |
| AccountSelectorListItem | v1 | igual que SelectorListItem |
| AccountSelector | v1 | igual que Selector con tokens accountSelector/all/* propios |
| Pagination | v1 | primary/secondary · previous/next · selectedPage círculo · activePage link · dots · truncado (maxSlots) |
| HelperText | v1 | generic/disabled · Body/sm · extraído de InputCommon · usado en forms + contador de tabla |
| Headline | v1 | h1–h6 (level=tag+tamaño) × default/primary/secondary/onColor · solo left · sin truncado |
| CellData | v1 | familia Celda · contenedor slot · align L/R · density compact/basic · surface neutral/onSurface/zebra · lastRow |
| CellHeader | v1 | familia Celda · contenedor slot · align L/R · density compact/basic · surface neutral/onSurface/zebra · border subtle/primary · showSort (ArrowUpAZ) |
| CellMore | v1 | familia Celda · disparador overflow "More ›" · raíz `<button>` · siempre right · label falsy → icon-only (ChevronRight teal) · surface neutral/onSurface/zebra · lastRow |

**Tokens de referencia rápida — Selector:**
- `--ds-selector-*` (advancedSelector/all/*): borderWidth 1.5px, borderRadius 8px, gap/padding 16px
- `--ds-account-selector-*` (accountSelector/all/*): borderWidth 1px, gap/padding 12px
- Ambos comparten `--ds-input-fg-label`, `--ds-input-fg-helper`, `--ds-input-validation-fg-*` (borrowing intencional)

**AmountView — convención solid/soft/plain:**
- solid: bg sólido (success/error) + texto fg/onColor (blanco)
- soft: bg suave (success-subtle/error-subtle) + texto fg genérico
- plain: sin fondo, solo texto con color semántico

### Capa 2 — src/organisms/

| Componente | Versión | Notas |
|---|---|---|
| ButtonBar | v2 | complex/simple/form/detail · primary/secondary/cancel/negative |
| CellActions | v1 | familia Celda · contenedor de celda que aloja ≤2 acciones (Button/Link/CTALink) vía children · align L/R (right default) · surface neutral/onSurface/zebra · lastRow · dev-warn si >2 |

## 7. Workflow de componentes

```
1. EXPLORE — leer tokens.css + Figma MCP (get_variable_defs sobre el nodo)
2. PLAN — arquitectura + API + tokens CSS faltantes (NO code yet)
3. CODE
4. REVIEW con GPT (auditoría técnica)
5. FIX solo críticos
6. COMMIT cuando ≥8/10
```

Convención de commits:
```
Add [ComponentName] using --ds-* tokens
Update [ComponentName]: descripción
Fix [ComponentName]: descripción
```

## 8. Figma MCP

Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: `claude mcp remove figma` (el OAuth se reactiva solo).
`use_figma` requiere Figma desktop abierto.
SIEMPRE leer `/mnt/skills/plugins/figma:figma-use/SKILL.md` antes de usar `use_figma`.

**Figma fileKey:** `QiWDJdMPB5pfY3vHy9CqZv`
**Lucide Icons Figma:** librería externa activada en el equipo — NO usar página de iconos local.

## 9. Próximos componentes — Sprint activo

### 🔴 Sprint 1 (en curso)

| Pri | Componente | Dependencias |
|---|---|---|
| 0 | **Table + Celda (CellHeader/CellData/CellActions)** · ~~Pagination~~ ✅ | Checkbox ✅ · Badge (a confirmar alcance — ver nota abajo) |
| 1 | ~~Advanced Selector~~ ✅ | — |
| — | ~~Account Selector~~ ✅ | — |
| 2 | **Snackbar** | Button ✅ |
| 3 | **Description List** | Link ✅ |
| 4 | **Dialog** | Button ✅ |

**Nota (14/07/2026):** Table + Celda + Pagination se prioriza por delante del resto de Sprint 1 — es lo que Carol está construyendo en Figma ahora mismo (Celda ya en desarrollo activo). Pendiente confirmar si Badge se adelanta también (si el toolkit necesita estados en celda desde ya) o si Table puede avanzar primero con celdas de texto plano.

**Actualización (18/07/2026):** Pagination ✅ construido y documentado (Pagination.jsx + `--ds-pagination-*` sincronizados desde Figma tras reconstruir `.Parts`). Quedan Celda + Tabla para la semana que viene.

### 🟠 Sprint 2

List View · File Upload · Tabs

### 🟢 Sprint 3

Collapsible · Inline Notification

### ⚪ Backlog

Accordion · Tooltip · Combobox · Segmented Controls · Slider · Step Navigator · Progress Bar · Loading Spinner · Top Navigation · Popover Sheet · Drawer

### ⛔ No construir

Calendar · Bottom Navigation · Bottom Sheet · Image · Videoplayer


## 10. Deuda técnica

- **Country/Currency Picker** — Selector entrega solo el trigger. El mecanismo de apertura/popover sigue pendiente.
- **Country Picker / Advanced List Item** — focus-inner en teal en vez de blanco. Alcance sin investigar (sigue así tras la sesión del 14/07 — se abrió el tema pero la sesión derivó hacia Button/Icon Button antes de llegar a Advanced Selector; retomar).
- **Mode tokens dark mode** — ✅ **Resuelto 11/08/2026** para bg neutro + bg marca/feedback + `*-inverse` por tipo (ver detalle abajo). Caso concreto ya identificado el 14/07: `fg/icon/inverse` se invierte a negro en dark mode, `fg/icon/onColor` se mantiene blanco en ambos modos — mismo valor en light, distinto en dark. **Pendiente real:** `borderColor/*` dark no se ha auditado contra Figma todavía (ver nota 15/07 abajo) — mismo tipo de revisión, sesión aparte.
  - **Parcial resuelto 24/07:** los bloques dark **no volteaban los fg por tipo de elemento**. Solo `fg/default` y `fg/icon/default` pasaban a blanco; `fg/label/default`, `fg/body/default` y `fg/headline/default` se quedaban en `#050506` → texto negro invisible sobre fondo oscuro en Headline, Cell, y labels de Checkbox/Radio/Chip/Input/Pagination. Añadido override a `#FFFFFF` en ambos bloques dark. **Pendiente aún:** `fg/headline/tertiary` sigue en `#050506` (no consumido por Headline.jsx, latente); y los `*-inverse` (label/body/icon) siguen en blanco en dark — revisar contra la trampa `inverse`/`onColor` en la revisión global.
  - **Resuelto 11/08/2026 — escala neutra `bg-*` en dark.** Hallado (vía debt Cell `bg/onSurface`) que `--ds-bg-default`/`--ds-bg-page` dark en `tokens.css` (`#191C1F`/`#050506`) no coincidían con los valores reales resueltos en vivo desde Figma, con el orden incluso invertido — verificado con resolución de cadena de alias en el archivo, no con el JSON estático cacheado (no fiable, ver [[token-sync-workflow]]). Corregidos los 5 tokens neutros en ambos bloques dark (`@media prefers-color-scheme` y `[data-mode="dark"]`) a los valores reales de Figma: `bg-default` `#191C1F`→`#050506` · `bg-page` `#050506`→`#464B53` · `bg-subtle` `#2C2F34`→`#7B8490` · `bg-disabled` sin override→`#9AA1AA` (añadido; antes heredaba el light `#EEEFF1`, invisible/incorrecto en disabled de Button/Input/Checkbox/Radio/Chip/Badge/Selector/Pagination) · `bg-container` ya añadido en el fix de Cell. Verificado visualmente en el banco de pruebas: Chip/Input/Dropdown disabled y la tabla Cell (onSurface/zebra) leen correctamente en dark. **Pendiente real (fuera de esta sesión):** ya cerrado — ver auditoría completa de marca/feedback justo abajo (mismo día).

  - **Resuelto 11/08/2026 — familias bg de marca/feedback + `*-inverse` por tipo.** Auditoría completa contra Figma (resolución de cadena de alias en vivo, no JSON cacheado). Hallazgos:
    - **Bug de swap:** `--ds-bg-primary` (el más usado de la familia — Button accent, Checkbox/Chip selected, CTALink accent, BadgeNotification primary, 5× Pagination) y `--ds-bg-primary-bold` (0 consumidores) tenían sus valores dark **intercambiados entre sí** — ninguno coincidía con Figma. Corregido: `bg-primary` dark `#286371`→`#4BA9C0` (el teal vivo real, no un teal casi negro); `bg-primary-bold` dark `#4BA9C0`→`#F7FBFC` (su valor real, sin impacto porque sigue sin consumidores). De paso, `bg-primary-bold` **light** también estaba desviado (`#36879C`→`#286371`, ya apuntado como sospechoso en `token-architecture.md` desde el 15/07).
    - **Sin override dark (heredaban light):** añadidos con el valor real de Figma — `bg-primary-medium` `#A0D1DE` (Chip) · `bg-secondary` `#EE8FB9` (BadgeNotification, Pagination) · `bg-secondary-medium` `#E75D9B` (BadgeHighlight) · `bg-tertiary` `#CAABD7` (BadgeNotification) · `bg-error`/`bg-error-subtle` `#F3C4C4` (Checkbox, BadgeNotification, Button, BadgeHighlight, AmountView — mismo valor en dark para ambos, así resuelve Figma) · `bg-success`/`bg-success-subtle` `#CBECCC` (AmountView, BadgeHighlight — ídem) · `bg-hover-primary` `#016398` (Checkbox/Radio/Selector hover) · `bg-inverse` `#FFFFFF` (Button default-filled, CTALink primary — **ver bug de pareja fg abajo**). También añadidos sin consumidores hoy pero con fuente Figma confirmada (reservados para Dialog/InlineNotification): `bg-accent-primary` `#CAE6ED` · `bg-accent-secondary` `#FBE4EE` · `bg-warning` `#FFE7B8` · `bg-info` `#B8E6FE` · `bg-highlight` `#016398`.
    - **Huérfanos sin fuente en Figma, 0 consumidores.** ✅ **Resuelto 11/08/2026 (mismo día):** `bg-quaternary` (las 4 variantes, incluida la plana — Carol confirma que quedaron por error, no son parte del sistema) y `bg-hover-secondary`/`bg-hover-tertiary` (Carol confirma que el hover es único y se aplica igual en todos los themes, no hay variante por color) — **eliminados** de `tokens.css`. `bg-completed` también **eliminado** (mismo día) — Carol confirma que era duplicado de `bg-success` (mismo valor `#389A3D`, sin token propio en Figma). `bg-done` inicialmente se mantuvo (sí era variable propia en Figma, con consumidores reales: `switch/all/track/bg/on` y `stepNavigator/web/steps/bg/completed`, ambos en backlog sin construir aún) — pero Carol decide simplificar: esos dos tokens de Figma se realiasaron a `bg/success` directamente y `bg/done` se **eliminó** de Figma (sin referencias huérfanas verificado antes de borrar) y de `tokens.css`. Si Switch o Step Navigator alguna vez necesitan un verde "completado" distinto de "success", se creará un token nuevo entonces — no se reserva de antemano.
    - **Bug de pareja fg/bg — el más importante:** `bg/inverse` invierte de verdad en Figma (negro↔blanco), y Button default-filled / CTALink primario lo usan así — correcto. Pero su texto (`--ds-button-fg-default-filled`, `--ds-cta-link-fg-primary`) estaba cableado a `--ds-fg-onColor` (fijo blanco en los dos modos) en vez de a `--ds-fg-label-inverse` (invierte igual que el fondo). Al añadir el dark de `bg-inverse` sin corregir esto, el botón "Default" habría quedado con **texto blanco sobre fondo blanco** en dark. Corregido: ambos tokens ahora consumen `var(--ds-fg-label-inverse)`. Esto exigió cerrar también el hueco ya apuntado en este mismo párrafo del debt (`*-inverse` por tipo sin dark): añadido dark a `--ds-fg-label-inverse`/`--ds-fg-body-inverse`/`--ds-fg-icon-inverse` (`#050506`, mismo patrón que el `--ds-fg-inverse` genérico, ya corregido antes).
    - **Efecto colateral del fix anterior — mismo bug pero al revés:** una vez que `fg-label/icon-inverse` invierte de verdad, todo lo que los usara **sobre una superficie que NO invierte** se habría roto (texto negro sobre teal en dark). Encontrados y corregidos 3 casos, todos con el mismo patrón — texto de Chip seleccionado (`--ds-chip-label-fg-selected`/`--ds-chip-icon-fg-selected`: inverse→onColor) y Pagination (`--ds-pagination-active-fg-hover`: inverse→onColor). El de Pagination `selectedPage` se resuelve en el punto siguiente porque ya tenía debt propia documentada.
    - **Mismo bug confirmado también en Figma** (no solo en código), y corregido ahí también con el visto bueno de Carol: `button/all/label/fg/accent-primary`, `ctaLink/all/label/fg/accent-highEmphasis`, `chip/all/label/fg/selected`, `chip/all/icon/fg/selected`, `badgeNotification/all/label/fg/generic` — los 5 estaban alias a `fg/label(icon)/inverse` sentados sobre `bg/surface/*` (no invierte); realiasados a `fg/label(icon)/onColor`. No afectaba a código porque ya usaba `fg-onColor` ahí independientemente, pero el preview de Figma en dark mostraba texto negro sobre teal.
    - Verificado visualmente en el banco de pruebas (dark): Button Accent/Default, Chip selected, BadgeNotification, CTALink ambas variantes, Pagination selectedPage primary/secondary/disabled — todos correctos, cero regresiones en light (los tokens onColor no cambiaron de valor ahí).
- **Notification Count + Placeholder/Placeholder** — descripciones apuntan a dominio interno de Sistema Origen. Borrar en Figma. **Sin verificar en la sesión del 14/07** — el barrido de esa sesión usaba patrones de nombre distintos (`(Beta)`, `Pill Button`, `PO-`, `OJ/INT`...) y no cubría este caso; sigue abierto.
- **Selector token families** — tokens de iconLeft/fg y borderColor/focus-inner pendientes de crear en tokens.css (estructura en Figma completada 01/07/2026). Ver token-architecture.md §Selector families. **Al crearlos, aplicar el patrón consolidado del 14/07** (un único grupo `icon/fg` con nombres por contraste — `on-color`/`on-outline-*`/`disabled` —, no duplicar por posición ni por Variant de origen).
- ~~**Sync Figma → tokens.css para Button**~~ ✅ **Resuelto 15/07/2026.** `button/all/icon/size/*` → `--ds-button-icon-size-{small,medium,large}` (16/20/24, antes hardcode 14/16/18px en Button.jsx). El color de icono no lleva token propio: `currentColor` + los `--ds-button-fg-*` existentes (regla §4). Pendiente aún: `iconButton/all/icon/fg/*` en Figma sigue con nomenclatura por Variant (`default-primary`…) — Icon Button no está construido en código, sin impacto.
- **Sync Mode layer tokens.css ↔ theme depth (15/07/2026)** ✅ hecho para light mode: `--ds-fg/borderColor` primary 700→500, secondary 600→500, accent primary 500→700; `checkbox/bg/selected` y `radio/indicator/fg` corregidos de `-bold` al token correcto. **Pendiente:** revisar los bloques dark (`@media prefers-color-scheme: dark` y `[data-mode="dark"]`) — no tocados esta sesión, se solapan con la deuda de "Mode tokens dark mode".
- **Copia de librería de Sistema Origen en la cuenta de Figma** — detectada el 14/07 vía búsqueda (`Web - SYS_OJ_INT (Copy)`), no vinculada al archivo activo pero presente en el espacio de equipo. Pendiente que Carol la revise/archive.
- **Verificación pendiente (no bloqueante):** confirmar en Figma que `on-filled` y los tokens huérfanos de `iconLeft`/`iconRight` de Button han desaparecido del todo del panel de variables — la herramienta reporta el borrado sin error pero la lectura inmediata los seguía mostrando (problema de caché plugin↔archivo, ya confirmado benigno en casos anteriores de la misma sesión).
- **Pagination · SelectedPage — contraste (18/07/2026).** El nº del círculo se puso **blanco** por coherencia con las demás superficies rellenas. **(1)** ~~Figma exporta `root/text/fg/selectedPage` = `fg/label/default`~~ ✅ **Resuelto 11/08/2026** — era el mismo bug de `inverse` vs `onColor` (el token de Figma además invertía con el modo, sentado sobre `bg/surface/primary` que no invierte); corregido en Figma y en código a `fg/label/onColor` (blanco fijo, correcto en los dos modos). **(2) Sigue pendiente:** blanco sobre teal `#4BA9C0` = 2.7:1, **no cumple WCAG AA** — decisión consciente de Carol de dejarlo así de momento; revisar (¿oscurecer el fill del círculo, o volver a texto oscuro?).
- ~~**Pagination · Dots — consistencia estructural (18/07/2026).**~~ ✅ **Resuelto 21/07.** Dots pasó a `<button>` interactivo (salta `siblingCount` páginas); consume `dots/bg/hover-*`, `dots/fg/hover`, `dots/opacity/pressed`.
- ~~**Cell family · `bg/onSurface` sin resolver (22/07/2026).**~~ ✅ **Resuelto 11/08/2026.** El alias en Figma apuntaba a `bg/default` (el lienzo base de la app), no a nada realmente "superficie" — coincidía en light (`#FFFFFF`) pero era la misma trampa ya documentada para `fg/icon/inverse`: en dark, `bg/default` es el tono más oscuro de toda la paleta (`#050506`), justo lo opuesto a una tarjeta elevada. Comparando `bg/default` · `bg/page` · `bg/container` en Light→Dark (`#FFFFFF→#050506` · `#F9FAFA→#464B53` · `#FFFFFF→#606772`) se ve una escalera de elevación clara: en dark, cuanto más elevada la superficie, más clara. `bg/container` (scope `FRAME_FILL`/`SHAPE_FILL`, pensado para tarjetas/paneles) es la superficie elevada real. Cambiado el alias de `table/all/cellCommon/bg/onSurface` en Figma de `bg/default` → `bg/container`; añadido `--ds-bg-container` al Mode layer de `tokens.css` (no existía, faltaba desde siempre) y `--ds-cell-common-bg-on-surface` ahora consume `var(--ds-bg-container)`. **Nota:** el valor dark usado para `--ds-bg-container` (`#606772`) es el real de Figma. `--ds-bg-default`/`--ds-bg-page` dark también se corrigieron el mismo día (ver "Mode tokens dark mode" abajo) — la escalera default/page/container queda coherente en ambos modos.
- ~~**Cell family · solo falta CÓDIGO (act. 22/07/2026).**~~ ✅ **Familia Celda completa en código 11/08/2026.** Construido: `CellData` ✅ · `CellHeader` ✅ (`showSort` + border subtle/primary) · `CellMore` ✅ (átomo, raíz `<button>`, disparador overflow "More ›", `label` falsy → icon-only ChevronRight teal) · `CellActions` ✅ (**organismo** en `src/organisms/`, ≤2 acciones Button/Link/CTALink vía children, dev-warn si >2 — NO es Column More). Todos consumen solo `--ds-cell-common-*` (sin tokens nuevos). Nodos EXPLORE confirmados: Cell `3291:24354` · More `3291:24336` (variantes `Type=Basic/Compact × Surface`; Basic = icon-only). **Pendiente**: ensamblar **Table** con estas celdas (Pri 0 Sprint 1). Nota: CellActions no existe como componente en Figma (búsqueda vacía) — es composición code-only por diseño.
- **Sync tokens.css = reconciliación, no solo añadir (act. 22/07/2026).** Los JSON de Component se re-exportaron con limpieza de duplicados (Selector/List View, entre otros). Al sincronizar, **eliminar de tokens.css las entradas cuyo token ya no exista en el JSON**, no solo añadir lo nuevo. Ante la duda, comparar contra el JSON actual, no contra memoria de sesión.
- **Text Styles de Figma eliminados (22/07/2026).** Todos los Text Styles se borraron ese día (0 nodos rotos tras el borrado). Ya no hay contra qué verificar la tipografía. El lineHeight de Headline se resuelve **directo de Device** (`fontLheight/headline/*`), sin capa de Componente ni Text Styles — coherente con la regla de tipografía §4. (La antigua nota "verificar lineHeight contra text styles" queda sin efecto.)