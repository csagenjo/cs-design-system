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
- **Nomenclatura de tokens de Componente por eje `default`/`secondary` vs `generic` (fijado 01/09/2026, familia Collapsible):** NUNCA usar `primary`/`secondary` para nombrar el eje de color que varía entre variantes de un componente — `primary` induce a pensar en el teal de marca, y en varios componentes (Collapsible, entre otros) ese eje resuelve en realidad a negro/rosa, no a teal/rosa. Usar **`default`** para el valor que no lleva color de marca (negro) y **`secondary`** para el que sí (rosa) — nunca `primary`. Reservar **`generic`** solo para propiedades que son **iguales en las dos variantes** (borderRadius, borderWidth, gap, padding…) — si un token `generic` en realidad diverge por variante (como pasaba con `icon/fg/generic`, que en realidad era el rosa), está mal nombrado y hay que corregirlo a `default`/`secondary` según corresponda.
- La regla "nunca saltar capas" aplica **al color** (Component→Mode→Theme→Base): el color cambia con Theme/Mode, por eso cada componente necesita su token de Componente. **Excepción documentada: la tipografía.** `fontSize`/`fontWeight`/`fontFamily`/`lineHeight` no cambian con Theme ni Mode (solo por dispositivo = capa Device), así que los componentes las consumen **directas de Device** (`fontSize/headline/2xl`, `fontWeight/regular`…) sin token de Componente intermedio. Checkbox/Radio/Headline/Helper Text lo hacen así. Ver `token-architecture.md` §tipografía.
- **NUNCA cambiar las propiedades de variante de una instancia anidada dentro de un componente compuesto** (p. ej. el `Button`/`Icon Button` que instancia Collapsible) — Type/Variant/Size/State/with Label/Icon están calibrados para una única configuración exacta; cambiarlos rompe la geometría del componente padre (Tooltip, hug del root — confirmado con pruebas reales en Collapsible, 01/09/2026). Figma no permite restringir esto de verdad: exponer o no la propiedad como "instance swap" solo evita el cambio desde el panel del padre, pero cualquiera con acceso de edición puede hacer doble clic, entrar en la capa anidada y cambiar sus propias propiedades sin restricción. Mitigación aplicada — no es infalible, es fricción: la instancia anidada de los triggers de Collapsible está bloqueada (candado) y cada variante lleva la advertencia en su campo `description` de Figma. Aplicar el mismo criterio (bloquear + describir) a cualquier futuro componente que instancie otro átomo con una configuración fija en su interior.

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
| Snackbar | v1 | length single/multi · acción = instancia directa de Button (default sm, sin tokens propios) · bg/fg invierten con el modo (bg-inverse/fg-label-inverse, confirmado en Figma dark 12/08) · role="status" aria-live="polite" · sin timer/portal (fuera de scope de átomo) |
| List | v1 | unordered (bullet • teal) / ordered (marcador `number` string libre, negro) / checkmark (Lucide `Check` teal, currentColor) · `items` array real · SIN prop size (Figma expone un único "16") · ul/ol semántico · ordered reusa gap de unordered |
| AmountView | v2 | `highlight` (neutral/emphasis/subtle/disabled) × `type` (positive/negative) — reemplaza emphasis/subtle v1 · ejes `.Amount`: size xs/sm/md/lg (12/14/16/19), isoPlacement left/right (row-reverse), amountWeight bold/regular · **subtle = fondo pálido + texto NEGRO (fg-generic), no texto de color** (bug v1 corregido) · asimetría intencional: positive sin marca en neutral/disabled |
| Divider | v1 | barra sólida 1px (height + background, no border-bottom) como en Figma · token `--ds-divider-border-color-generic` (nombre semántico = color de borde/divisor; el fill es detalle de impl) · `<hr>` role=separator · sin variantes v1 |
| SectionHeader | v1 | familia tipográfica `fontSize/title/*` (NO Headline) · size sm/md (16/19) × color default/primary/disabled × weight bold(def)/regular · size+weight directos de Device (regla §4) · "Subtle" de Figma → `default` en código (va contra fg/title/default, no fg/title/subtle) · reemplaza el `.Heading` borrado |
| Dialog | v1 | `header` default/primary/onPrimary/secondary/tertiary (deriva variant de Button: accent para primary/onPrimary, default para el resto) · `size` standard/small (header 60/44px) · `width` popUp (480px, radio, sombra Dialog/DialogShadow) / fullScreen (100%/100%, sin radio/sombra — tamaño real lo decide el consumidor) · header compartido vía `_dialogBase.jsx` (`DialogHeader`, no exportado) |
| DialogSimple | v1 | header Default fijo (44px) · `variant` default (280px, borde sólido `borderColor/subtle` + mismo Dialog/DialogShadow que el PopUp de Dialog — no una sombra distinta) / expanded (480px, min-height 680px) · botones md/lg según variant |
| ErrorAndEmptyState | v1 | header Default sin flecha ni título (solo X) · `variant` fullScreen (100%/100%) / popUp (max-width 359px) · `icon` slot libre ReactNode (NO átomo Image, prohibido) · título+descripción centrados |
| Scrim | v1 | overlay trivial, sin props · `--ds-dialog-scrim-bg-generic` invierte con el modo (negro 30% light / blanco 30% dark) |
| Text | v1 | opción de texto enriquecido intercambiable en el slot Description de List View/Selector (instance swap en Figma) · `color` default/secondary/disabled × `size` 14/16 × `weight` bold(def)/regular × `chevron` booleano (icono opcional, sin duplicar variantes) · página propia en Figma, mismo criterio que SectionHeader |
| DescriptionText | v1 | texto plano de descripción — consolidado desde el markup fijo que Selector/AccountSelector tenían embebido · `color` default/subtle(def)/disabled × `size` 14/16 · valor por defecto del slot Description de List View/Selector |
| DetailText | v1 | icono + texto de detalle — consolidado desde 4 copias duplicadas en Selector/SelectorListItem/AccountSelectorInvoker/AccountSelectorListItem · `color` default/secondary/tertiary/disabled × `size` 14/16 · icono slot libre ReactNode, `showIcon` booleano |
| ListView | v1 | fila interactiva de listado (`<button>` real) para Search for Results · Header→SectionHeader, Description→DescriptionText (swap por Text), Detail→DetailText · `rightPanelContent` slot libre (NO el wrapper de 10 variantes de Figma) · ribbon de selected, 4 `divider`, icono izquierdo con tamaño configurable · hover/pressed/focus vía pseudo-clases CSS, solo `disabled` es prop |
| ListItem | v1 | fila de fichero en File Upload — icono + nombre editable (`<input type="text">` real, también en `status="uploading"` deshabilitado ahí) + botón de cierre · `status` uploading/uploaded/error, único eje real como prop · mensaje de error mismo patrón que InputText.jsx (icono + texto, tokens de validación de Input reutilizados) |
| DropZone | v1 | área drag-and-drop de File Upload — borde discontinuo + texto + botón de selección manual · hover: el botón se queda visible pero pasa a Disabled real (mismo tamaño de caja, nunca se colapsa) y el texto cambia a "Drag & drop your files here" · `disabled` prop de estado real independiente del hover, usa `useState` (única del family que no resuelve todo con pseudo-clases puras) |
| LabelDescription | v1 | Label+HelperText apilados para el encabezado de File Upload · sin tokens propios — reutiliza `--ds-input-fg-label` y el átomo HelperText.jsx tal cual · `align` left/right (solo text-align) |
| TabItem | v1 | item individual dentro de Tabs · `<button>` real, hover/pressed/focus vía pseudo-clases CSS nativas (mismo criterio que Checkbox/ListView) · `selected` única prop de estado real · focus: un único stroke real en la raíz (se redimensiona con el tab, sin rectángulos hermanos que puedan desfasarse) · `device` mobile/tablet — solo cambia el padding vertical |
| IconButton | v1 | botón circular icon-only + `label` opcional debajo (`with Label=Yes`) · `type` default/accent × `variant` primary(relleno)/secondary(contorno)/tertiary(ghost) × `size` small/medium/large · icono vía átomo `Icon` (nunca reimplementado) · color de icono por contraste (`on-color`/`on-outline`), no por Variant (regla §4) · hover/pressed/focus vía pseudo-clases CSS, solo `disabled` es prop · focus ring con geometría real de Figma (doble anillo, criterio Checkbox): círculo sin label / rectángulo redondeado con label |
| Collapsible | v1 | trigger con label ("Expand"/"Collapse") + chevron · instancia `Button` (`variant="default" outline"`) sin reimplementar — re-tematiza color redefiniendo localmente las CSS custom properties de Button (`--ds-button-border-default`, `--ds-button-fg-default-outline`), mismo mecanismo que el rebind de variables en Figma · `variant` default(negro)/secondary(rosa) × `size` sm/md/lg · `expanded` decide label+icono, sin gestionar el propio estado |
| CollapsibleIconButton | v1 | variante icon-only de Collapsible, con tooltip "Expand"/"Collapse" en hover/focus · instancia `IconButton` (`type="default" variant="secondary"`) mismo mecanismo de re-tematización que Collapsible · **deuda:** el átomo `Tooltip` compartido no existe aún (backlog) — el tooltip es una implementación CSS mínima local, migrar cuando se construya `Tooltip` |
| InlineNotification | v1 | `type` error/success/information/warning (color de icono+borde) × `style` default/borderless/simple (chrome del root, nunca el color del texto) · `showTitle`/`showMessage`/`showButton` booleanos como en Figma · icono vía `Icon` (circle-x/info/circle-check/alert-circle) · botón = instancia `Button` (`variant="default" outline" size="sm"`), bloqueado en Figma · sin timer/portal (fuera de scope de átomo, mismo criterio que Snackbar) |

**Tokens de referencia rápida — Selector:**
- `--ds-selector-*` (advancedSelector/all/*): borderWidth 1.5px, borderRadius 8px, gap/padding 16px
- `--ds-account-selector-*` (accountSelector/all/*): borderWidth 1px, gap/padding 12px
- Ambos comparten `--ds-input-fg-label`, `--ds-input-fg-helper`, `--ds-input-validation-fg-*` (borrowing intencional)

**AmountView v2 — matriz highlight × type (asimetría intencional de Figma):**
- neutral+positive: sin fondo · texto negro (fg-generic) — positive "callado"
- neutral+negative: bg-neutral (#EEEFF1) · texto negro
- emphasis: bg solid (positive #389A3D / negative #D53737) · texto blanco (fg-onColor)
- subtle: bg pálido (positive-soft #F8FCF8 / negative-soft #FDF7F7) · **texto NEGRO** (no de color)
- disabled+positive: sin fondo · texto gris (fg-disabled) · disabled+negative: bg-disabled + texto gris

### Capa 2 — src/organisms/

| Componente | Versión | Notas |
|---|---|---|
| ButtonBar | v2 | complex/simple/form/detail · primary/secondary/cancel/negative |
| CellActions | v1 | familia Celda · contenedor de celda que aloja ≤2 acciones (Button/Link/CTALink) vía children · align L/R (right default) · surface neutral/onSurface/zebra · lastRow · dev-warn si >2 |
| Table | v1 | familia Celda · `Table` + `TableRow` · wrapper de layout puro (sin chrome propio, sin componente en Figma) · composición vía children, sin clonar/inyectar props · roles ARIA table/row (columnheader/cell ya en los átomos) · surface/lastRow se siguen fijando a mano por celda |
| DescriptionList | v1 | `DescriptionList` + `DescriptionListItem` · contenedor tonto + children (NO replica los 8 Variants de Figma como enum) · orientation landscape (label\|valor) / portrait (valor bajo label) · item: labelWeight regular/bold, emptyText (Not Filled → valuetext-fg-subtle), showEdit/onEdit (Link real) · divisores = átomo Divider entre items · dl/dt/dd semántico · valores = slot libre (BadgeHighlight/List/AmountView instanciados por el consumidor, nunca reimplementados) · title/amount/iconAccount NO se replican (los aportan SectionHeader/AmountView compuestos) |
| FileSelector | v1 | wrapper puro: DropZone + N × ListItem en columna · sin chrome propio (no existe "File Selector" como componente visual en Figma, solo la composición) — mismo criterio que CellActions/ButtonBar/Table · nº de ficheros = `files.length`, sin replicar las 6 variantes "1-5 Files" de Figma como enum |
| FileUpload | v1 | compone LabelDescription + FileSelector · 3 layouts: `wide` (lado a lado, Figma original), `stacked` (columna única con Drop Zone visible — pedido de Carol 26/08, no existía en Sistema Origen), `compact` (máx. 1 fichero, sin Drop Zone real — botón con chevron a cada lado tal cual Figma, sin simplificar) |
| Tabs | v1 | `Tabs` + N × `TabItem` · `type` fixed (reparte ancho a partes iguales) / scrollable (ancho natural + scroll horizontal, nº de items sin límite a diferencia de Figma) · `device` mobile/tablet (Desktop reutiliza tablet) |

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

### 🔴 Sprint 1 — ✅ Completo (24/08/2026)

| Pri | Componente | Dependencias |
|---|---|---|
| 0 | ~~Table + Celda (CellHeader/CellData/CellActions)~~ ✅ · ~~Pagination~~ ✅ | Checkbox ✅ · Badge (a confirmar alcance — ver nota abajo) |
| 1 | ~~Advanced Selector~~ ✅ | — |
| — | ~~Account Selector~~ ✅ | — |
| 2 | ~~Snackbar~~ ✅ | Button ✅ |
| 3 | ~~Description List~~ ✅ (+ Divider ✅ · List ✅ · SectionHeader ✅ · AmountView v2 ✅) | Link ✅ · Divider ✅ · List ✅ · SectionHeader ✅ · AmountView v2 ✅ |
| 4 | ~~Dialog~~ ✅ (+ DialogSimple ✅ · ErrorAndEmptyState ✅ · Scrim ✅) | Button ✅ |

**Sprint 1 completo (24/08/2026).** Última pieza: Dialog + sub-piezas. Antes de CODE se consolidó el namespace de Figma (34→27 tokens bajo `dialog/*`, patrón Common+específico ya usado en InputCommon/cellCommon) y se encontraron y corrigieron 2 bugs de contraste dark-mode reales en el `.Header` compartido, ambos con el mismo patrón fg/bg ya cazado varias veces en el proyecto (ver §10): **Tertiary** (bg se aclara en dark pero title/icon usaban `fg/*/default`, que invierte hacia blanco → texto blanco sobre lila claro) y **Default** (icon usaba `fg/icon/inverse` mientras su title hermano ya usaba correctamente `fg/icon/default` → icono blanco sobre bg-default blanco en light). Ambos repuntados en Figma y verificados en vivo (screenshot antes/después, light+dark). Header compartido extraído a `_dialogBase.jsx` (`DialogHeader`, no exportado) — instanciado por Dialog/DialogSimple/ErrorAndEmptyState, mismo criterio que la consolidación de SectionHeader (19/08). `bg/surface/primary|secondary|tertiary` del header de Figma resuelven exactamente igual que los `--ds-bg-primary/-secondary/-tertiary` ya existentes — reusados sin token nuevo. Bug de CSS encontrado en CODE (no de Figma): los cards de ancho fijo (`--pop-up` de Dialog, `--default`/`--expanded` de DialogSimple) se comprimían dentro de un flex container sin `flex-shrink: 0` — corregido en los 3 componentes.

**Tercer bug encontrado en el mismo día, ya con el código escrito:** los dos primeros bugs eran de qué resolvía cada token; este era de qué token tenía enlazada cada CAPA — las capas de icono reales de Header=Primary y Header=Default estaban literalmente cruzadas entre sí en Figma (Primary enlazado al token de Default y viceversa), y las de DialogSimple/ErrorAndEmptyState apuntaban al token de Tertiary por error. Corregido capa por capa (8 instancias en Dialog + 4 en DialogSimple/ErrorAndEmptyState). Carol renombró de paso `generic`→`primary` e `inverse`→`default` en `header/title/fg/*` y `header/icon/fg/*` para que las 5 variantes queden nombradas igual que su color de header, sin excepción — reflejado en `tokens.css`. Aparte, el Effect Style `Dialog/DialogShadow` resultó ser una referencia externa rota (0 estilos de efecto locales en el archivo) — recreado como estilo local; y los strokes de Dialog/DialogSimple eran restos de gradientes sin token — limpiados (ver §10, entrada de DialogSimple).

**Nota (14/07/2026):** Table + Celda + Pagination se prioriza por delante del resto de Sprint 1 — es lo que Carol está construyendo en Figma ahora mismo (Celda ya en desarrollo activo). Pendiente confirmar si Badge se adelanta también (si el toolkit necesita estados en celda desde ya) o si Table puede avanzar primero con celdas de texto plano.

**Actualización (21/08/2026 — CODE completo):** las 5 piezas construidas y verificadas en el banco de pruebas (build + dev server + screenshot): `List`, `Divider`, `SectionHeader`, `AmountView` v2 y `DescriptionList` (`DescriptionList`+`DescriptionListItem` en `src/organisms/`). tokens.css sincronizado (reconciliación: eliminados `--ds-amount-view-fg-positive-subtle`/`-negative-subtle`, renombrados `bg-*-subtle`→`bg-*-soft`, añadidos `bg-neutral`/`bg-disabled`/`fg-generic`/`fg-disabled`; familia `fg/title/*` añadida al Mode layer en light + ambos bloques dark). Reconfirmado en vivo: subtle de AmountView = fondo pálido + texto negro (bug v1 cerrado). `App.jsx` sobrescrito como banco de pruebas de las 5 piezas. Nota lint: los 3 átomos nuevos disparan el mismo `no-unused-vars` de `React` que ya tienen Headline/BadgeHighlight — convención preexistente del repo (todos los átomos importan React), no regresión.

**Auditoría (19/08/2026):** Description List dependía de 4 piezas que no existían: `Divider`, `List`, `SectionHeader`, y una v2 de `AmountView` — todas cerradas en Figma. Resumen:

- **`SectionHeader` (átomo nuevo)** — extraído de un wrapper interno `.Header`/`.Heading` que estaba **duplicado 4 veces** (List View, Selector, Account Selector, Description List), cada uno con su propia copia local del mismo estilo de título de sección. Consolidado en un único componente con página propia en Figma (antes vivía escondido dentro de List View sin página). Los 4 sitios ahora instancian el mismo componente — verificado con barrido de las 52 páginas del archivo (0 instancias del wrapper viejo antes de borrarlo). Tokens renombrados `header/all/*` → `sectionHeader/all/*`. **No es lo mismo que `Headline`** — familia tipográfica distinta (`fontSize/title/*`, no `fontSize/headline/*`), line-height propio, siempre Bold-capable. Mode nuevo creado: `fg/title/default` (`#050506`/`#FFFFFF`) · `fg/title/primary` (`#4BA9C0` ambos modos) · `fg/title/disabled` (`#B9BEC4`/`#7B8490`) — valores reales resueltos en Figma (cadena de alias completa vía Theme→Base), no replicados de Headline.
- **`Divider` (átomo nuevo)** — ya lo consumía Description List. Decisión de naming: `--ds-divider-border-color-generic` (no `-bg-`) pese a que la implementación real pinta un `background` de 1px de alto — el nombre describe qué es semánticamente (mismo color que se usa como `border-color` en el resto del codebase: filas de Cell, etc.), no qué propiedad CSS lo consume en este átomo concreto.
- **`List` (átomo nuevo)** — unordered/ordered/checkmark. **Sin prop `size`** — Figma solo expone un tamaño (`16`, Body/sm), no un eje real; no se inventa una escala de tamaños sin caso de uso ni respaldo en Figma (freeze de alcance).
- **`AmountView` v2** — el `subtle` actual en código (tinte de color verde/rojo) no coincidía con el `Subtle` real de Figma (fondo pálido plano, texto negro). Matriz completa `highlight` (`neutral`/`emphasis`/`subtle`/`disabled`) × `type` (`positive`/`negative`) con asimetría intencional confirmada por Carol: a bajo/nulo énfasis, positivo se queda sin marca visual, negativo siempre lleva un fondo gris — patrón repetido en dos filas (Neutral y Disabled), no un descuido puntual. Se expone también el primitivo `.Amount` completo (size/isoPlacement/amountWeight), fiel a Figma.
- **Fuga de IP encontrada y cerrada** (dentro de la propia librería "CS - Design System", no en la copia de Sistema Origen ya fichada): el icono `check` de Checkmark List tenía un enlace de documentación con el dominio real de Sistema Origen; el icono de Account en Description List era el `Placeholder/Placeholder` ya apuntado en la deuda técnica del 14/07 (ver §10) — ambos corregidos en Figma.

**Actualización (11/08/2026):** Table ✅ construido — `Table` + `TableRow` en `src/organisms/Table.jsx`. Decisión de arquitectura: sin componente "Row" separado (no tiene uso standalone fuera de una tabla) y sin chrome propio (no existe "Table" en Figma, solo la familia Cell) — wrapper de layout puro, composición vía children sin clonar props, igual que CellActions/ButtonBar. Añadidos roles ARIA (`table`/`row`/`columnheader`/`cell`) a Table/TableRow y a los 4 átomos de la familia Celda (CellHeader/CellData/CellMore/CellActions) — antes no los tenían. `App.jsx` migrado a usar `Table`/`TableRow` en vez de los `<div style={{display:'flex'}}>` manuales del banco de pruebas. Sprint 1 Pri 0 completo.

**Actualización (12/08/2026):** Snackbar ✅ construido — `src/components/Snackbar.jsx`, átomo puro (sin timer/portal, eso es responsabilidad de La Plataforma). Nodo EXPLORE confirmado: `3109:11663` (Length=Single Line / Multi-Line). La acción "Undo" es una instancia directa de Button (`variant="default" size="sm"`) — sin tokens propios, paddings ya coincidían. bg/fg (`--ds-snackbar-root-bg-generic` / `--ds-snackbar-text-fg-generic`) reutilizan `bg-inverse` (igual que Button default-filled/CTALink primario) pero `fg-body-inverse`, no `fg-label-inverse` — alias real confirmado en el panel de variables de Figma (`snackbar/all/text/fg/generic` → `fg/body/inverse`, el mensaje es texto de cuerpo, no label de botón). Ambos tokens resuelven al mismo hex hoy, pero el alias correcto es el de body. Confirmado en Figma dark mode (12/08) que Snackbar invierte igual: negro-sobre-blanco en light, blanco-sobre-negro en dark. Shadow es Effect Style de Figma ("Snackbar/Shadow"), tratado como token literal en Component layer (mismo patrón que los `--ds-shadow-md/lg` de Button, que siguen sin definir — deuda preexistente, no de esta sesión). Sprint 1 Pri 2 completo.

**Actualización (18/07/2026):** Pagination ✅ construido y documentado (Pagination.jsx + `--ds-pagination-*` sincronizados desde Figma tras reconstruir `.Parts`). Quedan Celda + Tabla para la semana que viene.

### 🟠 Sprint 2 — ✅ Completo (31/08/2026)

~~List View~~ ✅ · ~~File Upload~~ ✅ · ~~Tabs~~ ✅

**Sprint 2 completo (31/08/2026 — Tabs, última pieza).** List View 26/08, File Upload 28/08, Tabs 31/08 (fechas reales de merge en git). Las tablas §6 no se habían actualizado con File Upload (`ListItem`, `DropZone`, `LabelDescription`, `FileSelector`, `FileUpload`) ni Tabs (`TabItem`, `Tabs`) pese a estar mergeados — corregido 01/09/2026.

**Actualización (24/08/2026):** List View ✅ construido (+ `Text`, `DescriptionText`, `DetailText` — 3 átomos nuevos con página propia en Figma, mismo criterio que SectionHeader). `DescriptionText`/`DetailText` sustituyen el markup duplicado que `SelectorInvoker`, `SelectorListItem`, `AccountSelectorInvoker` y `AccountSelectorListItem` tenían embebido — los 4 refactorizados para consumir los átomos compartidos, cerrando una inconsistencia real (`SelectorListItem` no exponía color de detail text en absoluto; `AccountSelector*` no reutilizaba nada). Proceso: cuando eché en falta `DetailText` durante EXPLORE, empecé a escribir el átomo en código antes de confirmar con Carol si debía existir en Figma primero — parada a tiempo, Carol lo creó en Figma con su propia página y lo instanció en Selector/List View antes de retomar código; los tokens ya explorados coincidieron exactamente. Regla reafirmada: Figma es la fuente de verdad, un átomo echado en falta se plantea antes de escribirlo, no se infiere.

### 🟢 Sprint 3 — ✅ Completo (01/09/2026)

~~Icon Button~~ ✅ (no estaba en el plan original) · ~~Collapsible~~ ✅ (+ CollapsibleIconButton) · ~~Inline Notification~~ ✅

**Sprint 3 completo (01/09/2026).** `InlineNotification.jsx` construido — a diferencia de Icon Button/Collapsible, los 19 tokens `inlineNotification/all/*` ya estaban correctamente enlazados en Figma (verificado en las 12 variantes: borde/icono por Type, sin rebind necesario). Reutiliza `Icon` (circle-x/info/circle-check/alert-circle, los 3 primeros añadidos a `icons.js`) y `Button` (`variant="default" outline" size="sm"`, bloqueado en las 12 variantes de Figma igual que en Collapsible) sin reimplementar. `type` fija color de icono+borde; `style` default/borderless/simple solo cambia el chrome del root, nunca el color del texto (título/mensaje siempre negro fijo). Se investigó de paso una variante Regular del átomo `.Title` compartido — descartada por Carol: innecesaria, ya que ocultar el título y usar el mensaje cubre ese caso.

**Actualización (01/09/2026 — Collapsible construido.)** `Collapsible` y `CollapsibleIconButton` en código (v1) — instancian Button/IconButton sin reimplementar, re-tematizados por CSS custom properties. Antes de CODE se encontró que el componente en Figma tenía 15 tokens propios (`collapsible/all/*`) completamente sin usar — label/icono/borde heredaban directo de Button/IconButton en vez de los tokens de Collapsible, y el color "secondary" (rosa) definido nunca se aplicaba en ningún sitio. Corregido en Figma (bindings reales + geometría de root real con borde visible, antes inexistente) antes de construir el átomo. Ver `docs/architecture.md` para el detalle completo de la sesión.

**Actualización (01/09/2026 — Icon Button, solo Figma por ahora, CODE pendiente):** auditoría y saneamiento del component set completo (210 variantes: Type Default/Accent × Variant Primary/Secondary/Tertiary × Size Small/Medium/Large × State Enabled/Disabled/Hover/Pressed/Focus/Hover Focus/Focus Pressed × with Label None/Yes) — motivado por EXPLORE de Collapsible (Icon Button es la base de su variante icon-only).

- **Hug real aplicado solo a las 60 variantes sin anillo de foco** (Enabled/Disabled, con y sin Label) — antes ninguna de las 210 tenía `layoutMode` propio, por eso el panel de resize nunca ofrecía "Hug contents". Las 150 con anillo (`Focus outer`/`Focus inner`, decorativos y con offsets no enteros por variante — no derivables de una fórmula) se dejaron tal cual, sin auto-layout — ver incidente abajo.
- **Incidente y recuperación:** un primer intento de aplicar Hug a las 210 de golpe rompió el tamaño y posición de los anillos de foco en las 150 variantes con ese patrón (`layoutPositioning` a `ABSOLUTE` a mitad de una cascada de cambios en el padre re-disparó el auto-layout antes de fijar la posición real). Recuperado restaurando una versión de Figma anterior a la sesión (Version History → Restore, no destructivo: el estado "roto" queda accesible en el historial igualmente) y releyendo los valores reales antes de reintentar, esta vez con alcance reducido a las 60 sin anillo.
- **Bug real encontrado:** `Tertiary, Size=Medium` (Default y Accent) tenía `cornerRadius: 0` en el frame de contenido — cuadrado en vez de círculo, único caso entre las 18 combinaciones Enabled auditadas. Corregido a 80 (mismo valor que el resto). No se ve por captura porque Tertiary no pinta stroke (`strokes: []`, estilo ghost) — verificado por dato, no por render.
- **Auditoría padding/borde/gap:** contra lo esperado, ya eran consistentes — padding 8/12/16 por tamaño sin excepciones, borde Primary=1px vs Secondary/Tertiary=2px consistente en los 3 tamaños (decisión de énfasis, no descuido). Gap 8 en Small vs 0 en Medium/Large es un residuo sin efecto visual (un solo hijo). No hizo falta crear una regla nueva.
- **`Icon` mal vinculado a tokens:** el icono interior de los 3 tamaños estaba vinculado al mismo token (`iconButton/all/icon/size/medium`, 20px) en vez de cada uno al suyo (`size/small`=16, `size/large`=24) — residuo de un ajuste manual previo. Además el nodo `Icon` estaba en modo `HUG` (calcula tamaño desde su propia sub-variante `Icon Size`, ignora cualquier binding de ancho/alto) — el binding a los tokens se corrigió pero quedaba inerte hasta pasar el nodo a `FIXED`. Aplicado a las 60 sin anillo (Small 36→32, Medium sin cambio, Large 52→56 — el frame de contenido huguea sobre el icono+padding, así que el tamaño del icono corrige la huella entera del botón). En las 150 con anillo se revirtió el modo a `HUG` en su momento para no desbordar sus contenedores; Carol ajustó después el `Icon Size` de esos 150 directamente en Figma (contenido ya en 32/44/56 por tamaño) — la geometría del anillo se recalculó a continuación, ver ✅ abajo.
- **Geometría del anillo de foco (150 variantes con `Focus outer`/`Focus inner`) ✅ Resuelto 01/09/2026, mismo día.** Tras el ajuste de `Icon Size` de Carol, los anillos quedaron descentrados (calibrados para el icono uniforme de 20px anterior). Recalculados con `inner = bbox(content [+ Label])` exacto, `outer = inner ± 2px` — fórmula derivada de la geometría original (ya confirmaba ese patrón antes de tocar nada). Dos bugs reales encontrados en el propio proceso: **(1)** en los estados "con Label", el icono no se había re-centrado horizontalmente bajo el label al reducirse — corregido recalculando `content.x = label.x + (label.width − content.width) / 2` antes de envolver el anillo. **(2)** en los 18 estados Focus-family × Large que desbordaban su `root` (icono creció, contenedor no), redimensionar el `root` con `.resize()` disparó los `constraints` tipo *stretch* de los propios rectángulos del anillo, que Figma recalculó por márgenes y volvió a descentrar — la lección: **redimensionar el contenedor SIEMPRE antes de fijar la geometría interna de children con constraints stretch/scale, nunca después**, si no el resize del padre deshace lo que acabas de fijar. Verificado al final por dato sobre las 150 (no por muestreo): 0 con desajuste.
- **Decisión: "with Label" se queda como eje de variante, no pasa a propiedad booleana.** Motivo de Carol: el anillo de foco cambia de *forma* según haya label o no (círculo alrededor del icono solo / rectángulo envolviendo icono+label), no es un simple show/hide de capa — forzarlo a booleano duplicaría los anillos igualmente sin simplificar nada real. Además `Type=Accent` no tiene variante con Label en absoluto en Small/Medium (solo Large) — la matriz ya tiene huecos legítimos, no es 1:1.
- **CODE ✅ (mismo día, sin deuda).** `IconButton.jsx` construido y verificado en el banco de pruebas (light + dark, las 3 Variant × 2 Type × 3 Size + disabled + con Label). Confirmado en vivo que el fix del bug fg/bg de `icon-fg-accent-primary` se propaga correctamente: icono blanco fijo sobre teal en ambos modos. Focus ring con geometría real de Figma portada al CSS: círculo (radio pill) sin label, rectángulo redondeado (`--ds-icon-button-focus-radius-with-label-outer`, 4px, token `iconWithLabel-focus-outer`) envolviendo icono+label cuando hay label — verificado con Tab real en el banco de pruebas, ambas formas correctas. Única simplificación consciente: CSS no admite dos radios distintos para outline vs. box-shadow en el mismo elemento, así que el anillo interior comparte el radio del exterior (Figma los diferencia en 2px, imperceptible en un detalle decorativo de foco).

### 🔵 Sprint 4 — pagar deuda + baja complejidad

**Planificado 02/09/2026.** Con Icon Button construido, las 11 piezas de Tier 3 ya no tienen ninguna dependencia sin resolver — se reparten en 2 sprints por complejidad e impacto real, mismo criterio que priorizó Sprint 1 (lo que desbloquea algo ya construido va primero, no solo lo más simple).

| Pri | Componente | Dependencias | Por qué va aquí |
|---|---|---|---|
| 1 | Tooltip | — | Paga deuda real: `CollapsibleIconButton` usa un tooltip CSS local a la espera de este átomo (ver §6, nota de deuda) |
| 2 | Loading Spinner | — | Baja complejidad · estado de carga que ya se mencionó como pendiente en File Upload |
| 3 | Progress Bar | — | Baja complejidad, sin dependencias |
| 4 | Segmented Controls | — | Baja complejidad · alternativa a Tabs (ya construido, mismo criterio de referencia) |

### 🟣 Sprint 5 — media/alta complejidad, organismos

| Pri | Componente | Dependencias | Notas |
|---|---|---|---|
| 5 | Accordion | Link ✅ · Divider ✅ | Alternativa a Collapsible (ya construido) |
| 6 | Slider | — | Media complejidad |
| 7 | Step Navigator | Button ✅ | Wizard/procesos en pasos |
| 8 | Popover Sheet | Button ✅ | Contenido contextual flotante |
| 9 | Drawer | Button ✅ · Link ✅ | Panel lateral de detalle |
| 10 | Combobox | InputText ✅ · Chip ✅ | Alta complejidad — búsqueda con autocompletado |
| 11 | Top Navigation | Button ✅ · Link ✅ · Icon Button ✅ | Alta complejidad — el más compuesto de los 11, último a propósito |

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
- **Notification Count + Placeholder/Placeholder** — descripciones apuntan a dominio interno de Sistema Origen. **Parcial resuelto 19/08/2026:** la instancia de `Placeholder/Placeholder` usada como icono opcional de la variante Account de Description List se sustituyó por un icono `Icon` genérico (`showIcon`/slot `icon` intercambiable). **Sigue abierto:** no se ha repetido el barrido completo de las 52 páginas buscando otras instancias de `Placeholder/Placeholder` o `Notification Count` fuera de Description List — el de esta sesión fue puntual, no exhaustivo.
- **Selector token families** — tokens de iconLeft/fg y borderColor/focus-inner pendientes de crear en tokens.css (estructura en Figma completada 01/07/2026). Ver token-architecture.md §Selector families. **Al crearlos, aplicar el patrón consolidado del 14/07** (un único grupo `icon/fg` con nombres por contraste — `on-color`/`on-outline-*`/`disabled` —, no duplicar por posición ni por Variant de origen).
- ~~**Sync Figma → tokens.css para Button**~~ ✅ **Resuelto 15/07/2026.** `button/all/icon/size/*` → `--ds-button-icon-size-{small,medium,large}` (16/20/24, antes hardcode 14/16/18px en Button.jsx). El color de icono no lleva token propio: `currentColor` + los `--ds-button-fg-*` existentes (regla §4). **Icon Button ya no es "sin impacto"** — saneado en Figma el 01/09/2026 (ver §9 Sprint 3) y su CODE es el siguiente paso. `iconButton/all/icon/fg/*` sigue con nomenclatura por Variant en Figma (`default-primary`…) — al sincronizar a tokens.css, aplicar el patrón consolidado de nombrar por contraste (`on-color`/`on-outline-*`/`disabled`), igual que en la entrada de Selector de abajo.
- ~~**Icon Button — geometría del anillo de foco pendiente de rehacer**~~ ✅ **Resuelto 01/09/2026, mismo día.** Las 150 variantes con `Focus outer`/`Focus inner` siguen sin auto-layout propio (decisión consciente: offsets no enteros por Variant/Size, no es una fórmula limpia que merezca forzar Hug) pero su geometría ya está recalculada y verificada por dato contra el tamaño de icono real. Ver detalle completo en §9 Sprint 3. Nota para la próxima vez que se toque este átomo: `Focus outer`/`Focus inner` tienen `constraints` tipo *stretch* — cualquier `resize()` del componente raíz debe hacerse ANTES de fijar su posición/tamaño exactos, nunca después (el resize del padre recalcula children stretch por márgenes y deshace valores ya fijados).
- **Sync Mode layer tokens.css ↔ theme depth (15/07/2026)** ✅ hecho para light mode: `--ds-fg/borderColor` primary 700→500, secondary 600→500, accent primary 500→700; `checkbox/bg/selected` y `radio/indicator/fg` corregidos de `-bold` al token correcto. **Pendiente:** revisar los bloques dark (`@media prefers-color-scheme: dark` y `[data-mode="dark"]`) — no tocados esta sesión, se solapan con la deuda de "Mode tokens dark mode".
- **Copia de librería de Sistema Origen en la cuenta de Figma** — detectada el 14/07 vía búsqueda por nombre de archivo (el nombre delataba directamente el origen real), no vinculada al archivo activo pero presente en el espacio de equipo. Pendiente que Carol la revise/archive.
- **Verificación pendiente (no bloqueante):** confirmar en Figma que `on-filled` y los tokens huérfanos de `iconLeft`/`iconRight` de Button han desaparecido del todo del panel de variables — la herramienta reporta el borrado sin error pero la lectura inmediata los seguía mostrando (problema de caché plugin↔archivo, ya confirmado benigno en casos anteriores de la misma sesión).
- **Pagination · SelectedPage — contraste (18/07/2026).** El nº del círculo se puso **blanco** por coherencia con las demás superficies rellenas. **(1)** ~~Figma exporta `root/text/fg/selectedPage` = `fg/label/default`~~ ✅ **Resuelto 11/08/2026** — era el mismo bug de `inverse` vs `onColor` (el token de Figma además invertía con el modo, sentado sobre `bg/surface/primary` que no invierte); corregido en Figma y en código a `fg/label/onColor` (blanco fijo, correcto en los dos modos). **(2) Sigue pendiente:** blanco sobre teal `#4BA9C0` = 2.7:1, **no cumple WCAG AA** — decisión consciente de Carol de dejarlo así de momento; revisar (¿oscurecer el fill del círculo, o volver a texto oscuro?).
- ~~**Pagination · Dots — consistencia estructural (18/07/2026).**~~ ✅ **Resuelto 21/07.** Dots pasó a `<button>` interactivo (salta `siblingCount` páginas); consume `dots/bg/hover-*`, `dots/fg/hover`, `dots/opacity/pressed`.
- ~~**Cell family · `bg/onSurface` sin resolver (22/07/2026).**~~ ✅ **Resuelto 11/08/2026.** El alias en Figma apuntaba a `bg/default` (el lienzo base de la app), no a nada realmente "superficie" — coincidía en light (`#FFFFFF`) pero era la misma trampa ya documentada para `fg/icon/inverse`: en dark, `bg/default` es el tono más oscuro de toda la paleta (`#050506`), justo lo opuesto a una tarjeta elevada. Comparando `bg/default` · `bg/page` · `bg/container` en Light→Dark (`#FFFFFF→#050506` · `#F9FAFA→#464B53` · `#FFFFFF→#606772`) se ve una escalera de elevación clara: en dark, cuanto más elevada la superficie, más clara. `bg/container` (scope `FRAME_FILL`/`SHAPE_FILL`, pensado para tarjetas/paneles) es la superficie elevada real. Cambiado el alias de `table/all/cellCommon/bg/onSurface` en Figma de `bg/default` → `bg/container`; añadido `--ds-bg-container` al Mode layer de `tokens.css` (no existía, faltaba desde siempre) y `--ds-cell-common-bg-on-surface` ahora consume `var(--ds-bg-container)`. **Nota:** el valor dark usado para `--ds-bg-container` (`#606772`) es el real de Figma. `--ds-bg-default`/`--ds-bg-page` dark también se corrigieron el mismo día (ver "Mode tokens dark mode" abajo) — la escalera default/page/container queda coherente en ambos modos.
- ~~**Cell family · solo falta CÓDIGO (act. 22/07/2026).**~~ ✅ **Familia Celda completa en código 11/08/2026.** Construido: `CellData` ✅ · `CellHeader` ✅ (`showSort` + border subtle/primary) · `CellMore` ✅ (átomo, raíz `<button>`, disparador overflow "More ›", `label` falsy → icon-only ChevronRight teal) · `CellActions` ✅ (**organismo** en `src/organisms/`, ≤2 acciones Button/Link/CTALink vía children, dev-warn si >2 — NO es Column More). Todos consumen solo `--ds-cell-common-*` (sin tokens nuevos). Nodos EXPLORE confirmados: Cell `3291:24354` · More `3291:24336` (variantes `Type=Basic/Compact × Surface`; Basic = icon-only). **Pendiente**: ensamblar **Table** con estas celdas (Pri 0 Sprint 1). Nota: CellActions no existe como componente en Figma (búsqueda vacía) — es composición code-only por diseño.
- **Sync tokens.css = reconciliación, no solo añadir (act. 22/07/2026).** Los JSON de Component se re-exportaron con limpieza de duplicados (Selector/List View, entre otros). Al sincronizar, **eliminar de tokens.css las entradas cuyo token ya no exista en el JSON**, no solo añadir lo nuevo. Ante la duda, comparar contra el JSON actual, no contra memoria de sesión.
- **Text Styles de Figma eliminados (22/07/2026).** Todos los Text Styles se borraron ese día (0 nodos rotos tras el borrado). Ya no hay contra qué verificar la tipografía. El lineHeight de Headline se resuelve **directo de Device** (`fontLheight/headline/*`), sin capa de Componente ni Text Styles — coherente con la regla de tipografía §4. (La antigua nota "verificar lineHeight contra text styles" queda sin efecto.)
- **`--ds-shadow-md`/`--ds-shadow-lg` no existen en tokens.css (detectado 12/08/2026, construyendo Snackbar).** `Button.jsx` los referencia en `.ds-btn--floating` desde v2 pero nunca se definieron — el modificador `floating` de Button actualmente no pinta ninguna sombra. No es deuda de esta sesión (preexistente, sin relación con Snackbar) y no bloquea nada mientras `floating` no se use en ningún consumidor real. Snackbar NO reutiliza estos tokens — su sombra (`--ds-snackbar-root-shadow`) es un Effect Style propio de Figma ("Snackbar/Shadow"), token literal en Component layer, sin relación con Device/Mode. Pendiente: si `floating` se necesita algún día, definir `--ds-shadow-md/lg` contra Figma en vez de asumir su valor.
- **`List View` — posible hueco visual (detectado 19/08/2026).** Al extraer `SectionHeader` de su wrapper interno `.Header` (embebido con posicionamiento absoluto, no auto-layout, dentro de `.List View - Nested Elements`), sacarlo a su propia página puede haber dejado un hueco donde antes estaba. No verificado con captura — revisar visualmente la página `List View` en Figma.
- **`AmountView.jsx` — `subtle` en código no coincide con Figma (detectado 19/08/2026, auditando Description List).** El `subtle` actual (tinte de color: fondo verde/rojo clarito + texto en el color del sentimiento) no existe así en el `Amount View` real de Figma — el estado equivalente (`Neutral`) es fondo gris plano (`#eeeff1`) con texto negro, y hay un `Subtle` distinto (fondo pálido `#f8fcf8`/`#fdf7f7`, también texto negro, no de color). Corregido en el PLAN de v2 (ver nota 19/08 en §9) — pendiente que Code lo aterrice y se borren `--ds-amount-view-fg-positive-subtle`/`-negative-subtle` (huérfanos tras el fix, ya no están en el JSON re-exportado).
- **`List View` — posible hueco visual (detectado 19/08/2026).** Al extraer `SectionHeader` de su wrapper interno `.Header` (embebido con posicionamiento absoluto, no auto-layout, dentro de `.List View - Nested Elements`), sacarlo a su propia página puede haber dejado un hueco donde antes estaba. No verificado con captura — revisar visualmente la página `List View` en Figma.
- **`Button.jsx` — escala de `fontSize` de `size` va un escalón por debajo de lo que pide Dialog (detectado 24/08/2026, construyendo Dialog).** Los botones grandes de Dialog/DialogSimple-expanded/ErrorAndEmptyState piden `fontSize/label/lg` (19px) en Figma, pero el `size="lg"` actual de Button.jsx solo llega a `fontSize/label/md` (16px) — un escalón por debajo. Del mismo modo, los botones compactos de DialogSimple-default piden `fontSize/label/sm` (14px), que coincide con el `size="md"` actual de Button (no con su `size="sm"`, que da 12px). Dialog usa `size="lg"`/`size="md"` como aproximación más cercana sin tocar Button.jsx (afecta a todos sus consumidores ya construidos). Pendiente decisión de Carol: ¿añadir un cuarto tamaño a Button, desplazar la escala existente, o vivir con el desajuste?
- ~~**`DialogSimple.jsx` — borde 0.5px de la variante `default` sin Variable de color en Figma (24/08/2026).**~~ ✅ **Resuelto el mismo día.** Resultó ser peor de lo que parecía en un primer vistazo: no era un literal aislado, sino restos de edición — Dialog tenía 3 strokes en gradiente apilados (2 ocultos + 1 visible sin token) y DialogSimple Default tenía 2 gradientes visibles apilados, ninguno ligado a Variable. Limpiado en Figma: Dialog se queda sin borde (coincide con la extracción original, que ya lo daba transparente), DialogSimple Default con un único stroke sólido enlazado a `borderColor/subtle` — reflejado en código como `--ds-dialog-simple-border-color-generic`. De paso se encontró que el Effect Style `Dialog/DialogShadow` era una referencia externa rota (0 estilos de efecto locales en todo el archivo) — recreado como estilo local y reasignado a las 10 variantes PopUp de Dialog y a DialogSimple Default, que resultó compartir el mismo shadow (radius 24), no uno propio de 12px como se documentó al principio.