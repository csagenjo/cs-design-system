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
- **Mode tokens dark mode** — varios tokens rotos o sin función clara. Revisión global pendiente (sesión aparte). Caso concreto ya identificado el 14/07: `fg/icon/inverse` se invierte a negro en dark mode, `fg/icon/onColor` se mantiene blanco en ambos modos — mismo valor en light, distinto en dark. Revisar si hay más pares Mode con esta misma trampa antes de dar la revisión global por completa.
- **Notification Count + Placeholder/Placeholder** — descripciones apuntan a dominio interno de Sistema Origen. Borrar en Figma. **Sin verificar en la sesión del 14/07** — el barrido de esa sesión usaba patrones de nombre distintos (`(Beta)`, `Pill Button`, `PO-`, `OJ/INT`...) y no cubría este caso; sigue abierto.
- **Selector token families** — tokens de iconLeft/fg y borderColor/focus-inner pendientes de crear en tokens.css (estructura en Figma completada 01/07/2026). Ver token-architecture.md §Selector families. **Al crearlos, aplicar el patrón consolidado del 14/07** (un único grupo `icon/fg` con nombres por contraste — `on-color`/`on-outline-*`/`disabled` —, no duplicar por posición ni por Variant de origen).
- ~~**Sync Figma → tokens.css para Button**~~ ✅ **Resuelto 15/07/2026.** `button/all/icon/size/*` → `--ds-button-icon-size-{small,medium,large}` (16/20/24, antes hardcode 14/16/18px en Button.jsx). El color de icono no lleva token propio: `currentColor` + los `--ds-button-fg-*` existentes (regla §4). Pendiente aún: `iconButton/all/icon/fg/*` en Figma sigue con nomenclatura por Variant (`default-primary`…) — Icon Button no está construido en código, sin impacto.
- **Sync Mode layer tokens.css ↔ theme depth (15/07/2026)** ✅ hecho para light mode: `--ds-fg/borderColor` primary 700→500, secondary 600→500, accent primary 500→700; `checkbox/bg/selected` y `radio/indicator/fg` corregidos de `-bold` al token correcto. **Pendiente:** revisar los bloques dark (`@media prefers-color-scheme: dark` y `[data-mode="dark"]`) — no tocados esta sesión, se solapan con la deuda de "Mode tokens dark mode".
- **Copia de librería de Sistema Origen en la cuenta de Figma** — detectada el 14/07 vía búsqueda (`Web - SYS_OJ_INT (Copy)`), no vinculada al archivo activo pero presente en el espacio de equipo. Pendiente que Carol la revise/archive.
- **Verificación pendiente (no bloqueante):** confirmar en Figma que `on-filled` y los tokens huérfanos de `iconLeft`/`iconRight` de Button han desaparecido del todo del panel de variables — la herramienta reporta el borrado sin error pero la lectura inmediata los seguía mostrando (problema de caché plugin↔archivo, ya confirmado benigno en casos anteriores de la misma sesión).
- **Pagination · SelectedPage — contraste (18/07/2026).** El nº del círculo se puso **blanco** (`fg/label/inverse`) por coherencia con las demás superficies rellenas, pero: **(1)** Figma exporta `root/text/fg/selectedPage` = `fg/label/default` (oscuro) → corregir el token en Figma para que coincida con el código; **(2)** blanco sobre teal `#4BA9C0` = 2.7:1, **no cumple WCAG AA** — decisión consciente de Carol de dejarlo así de momento; revisar (¿oscurecer el fill del círculo, o volver a texto oscuro?). En `tokens.css` va comentado en `--ds-pagination-root-text-fg-selected`.
- ~~**Pagination · Dots — consistencia estructural (18/07/2026).**~~ ✅ **Resuelto 21/07.** Dots pasó a `<button>` interactivo (salta `siblingCount` páginas); consume `dots/bg/hover-*`, `dots/fg/hover`, `dots/opacity/pressed`.
- **Cell family · `bg/onSurface` sin resolver (22/07/2026).** Renombrado de `onPrimary`→`onSurface` en las 3 celdas (Header/Cell/More); el valor sigue siendo `#FFFFFF` (`bg/default`). Carol marca que "aún no está resuelto del todo qué significa `onSurface`" — no es un blanco cualquiera, falta definir sobre qué superficie se apoya. En `tokens.css`: `--ds-cell-common-bg-on-surface`. No bloqueante para CellData (Neutral = transparente cubre el caso normal).
- **Cell family · solo falta CÓDIGO (act. 22/07/2026).** El diseño y los tokens (`table/all/cellCommon/*`) están **completos y verificados en Figma** — NO es exploración de diseño abierta. Construido: `CellData` ✅. Pendiente **programar**: `CellHeader` (añade `sortState` none/asc/desc → `Divider` + icono de orden vía prop booleana `Order`, siempre a la derecha), `CellMore` (átomo, disparador overflow "More ›") y `CellActions` (**organismo**, máx 2 acciones Button/Link/CTALink — NO es Column More). **Hacer EXPLORE fresco de los nodos**: la estructura cambió, `columnCell/columnHeader/columnMore` (mayúscula/estructura antigua) ya NO existen — todo vive en `cellCommon`. Nodos: Header `3291:24405` · Cell `3291:24354` · More `3291:24336` (reconfirmar IDs en el EXPLORE).
- **Sync tokens.css = reconciliación, no solo añadir (act. 22/07/2026).** Los JSON de Component se re-exportaron con limpieza de duplicados (Selector/List View, entre otros). Al sincronizar, **eliminar de tokens.css las entradas cuyo token ya no exista en el JSON**, no solo añadir lo nuevo. Ante la duda, comparar contra el JSON actual, no contra memoria de sesión.
- **Text Styles de Figma eliminados (22/07/2026).** Todos los Text Styles se borraron ese día (0 nodos rotos tras el borrado). Ya no hay contra qué verificar la tipografía. El lineHeight de Headline se resuelve **directo de Device** (`fontLheight/headline/*`), sin capa de Componente ni Text Styles — coherente con la regla de tipografía §4. (La antigua nota "verificar lineHeight contra text styles" queda sin efecto.)