# Token Architecture — CS Design System
*Estado: Retail ✅ · Youth Banking ✅ · Julio 2026*

## Cascada de colecciones

```
Base (157)
  └─ primitivos raw: hex, opacidades, dimensiones, tipografía
  └─ el código NUNCA los usa directamente

Theme (873 por tema × 2 temas activos)
  └─ mapea Base a roles semánticos POR TEMA
  └─ 2 temas activos: Overall (Retail) · Youth
  └─ Wholesale · Business · Private · Wireframe ELIMINADOS de la colección el 15/07/2026
     (decisión abierta — pueden volver más adelante, o no; ver "Estado de temas")
  └─ convenio: {rol}-light / {rol}-dark  (los dos valores posibles para el Mode)
  └─ el código NUNCA los usa directamente

Mode (364 × 2 modos: Light/Dark)
  └─ resuelve qué valor de Theme usar según modo UI activo
  └─ tokens SIN sufijo de modo — semánticos puros
  └─ EL LAYER QUE USA EL CÓDIGO → var(--ds-fg-primary), etc.

Component (1038 · 41 accent/visited visibles · 997 hidden)
  └─ tokens por componente, referencian SOLO Mode
  └─ convenio: {componente}/{dispositivo}/{parte}/{propiedad}/{estado}

Device (79 × 2: Mobile/Desk)
  └─ tipografía y espaciados responsivos
  └─ capa paralela — no interviene en cascada de color
```

**Regla de oro:** `Component → Mode → Theme → Base`
Saltar capas rompe el dark mode y la multi-temabilidad.

### La tipografía NO necesita capa de Componente (regla, 22/07/2026)

La regla de oro de arriba aplica **al color**. La tipografía es la excepción documentada:

- El **color** siempre pasa por un token de Componente propio (`{componente}/fg/*`) porque cambia con Theme y Mode (light/dark, Retail/Youth). El token de Componente es el punto donde cada componente resuelve a qué token de Mode apunta — por eso no se puede saltar.
- La **tipografía** (`fontSize`, `fontWeight`, `fontFamily`, `lineHeight`) **no cambia con Theme ni Mode** — solo varía por dispositivo, que es exactamente para lo que existe la capa **Device** (capa paralela, no de color). Por eso un componente puede consumir `fontSize/headline/2xl`, `fontWeight/regular`, `fontFamily/headline`… **directamente de Device**, sin token de Componente intermedio.

Checkbox y Radio ya lo hacían así; desde 22/07 es regla explícita, no una excepción sin documentar. Headline y Helper Text la aplican (color vía Componente→Mode, tipografía directa de Device).

---

## Base tokens (157)

### Paleta de color — 9 familias

| Familia | Hex 500 | Rol Retail | Rol Youth |
|---|---|---|---|
| primary (teal) | #4BA9C0 | Hero CTA · superficies primarias | Soporte · acento |
| secondary (magenta) | #E02C7C | Acento secundario | Hero CTA · superficies primarias |
| tertiary (lavanda) | #B185C5 | Decorativo · containerShape | Decorativo · containerShape |
| neutral | #7B8390 | Grises de interfaz | Igual |
| info | #0287D0 | Quaternary · informativo | Igual |
| error | #D53737 | Feedback error | Igual |
| success | #4CAF50 | Feedback éxito | Igual |
| warning | #FFAE0C | Feedback aviso | Igual |
| annotation | #9747FF | Uso interno DS | Igual |

Cada familia: 11 pasos (50, 100–900, 950).

### Opacidades — dos familias distintas ⚠️ no mezclar

**`color/opacity/black/*` y `color/opacity/white/*`** — type: color — fills con transparencia.
- 4 niveles: 10% · 16% · 30% · 40%

**`opacity/*`** — type: number — para `opacity` CSS del elemento completo.
- 5 valores: 30 · 40 · 60 · 70 · 80

---

## Theme — Retail vs Youth Banking

| Aspecto | Retail | Youth |
|---|---|---|
| Hero de marca (CTA, primary surfaces) | primary/teal | secondary/magenta |
| Color de soporte | secondary/magenta | primary/teal |
| Tokens cambiados entre temas | — | 148 (primary↔secondary swap) |

### Reducción de profundidad de color primary/secondary (15/07/2026)

Los roles de **texto/icono** primary y secondary se aclararon un paso hacia el `500` de su familia, en **Retail y Youth**, en light y dark. Regla aplicada por búsqueda+reemplazo en Figma sobre `primary-light/-dark` y `secondary-light/-dark`: lo que estaba en base alta (700 en primary, 600 en secondary) pasó a `500`. Valores reales del diff `tokens/Theme/`:

**Roles primary → `color/primary/500`** (antes `/700`) · en Youth = `color/secondary/500` (antes `/700`):
```
fg/primary-light · fg/title/primary-light · fg/headline/primary-light
fg/label/primary-light · fg/icon/primary-light
fg/body|headline|label|icon/onSurface/static-primary-light
borderColor/primary-light
bg/containerShape/primary-light   ⚠️ único bg/* que cambió — ver nota
```
**Roles secondary → `color/secondary/500`** (antes `/600`) · en Youth = `color/primary/500` (antes `/600`):
```
fg/secondary-light · fg/label/secondary-light
fg/icon/secondary-light · fg/body/secondary-light
```
**Tokens nuevos añadidos** (no existían antes):
```
fg/body/primary-light  → color/primary/500   (Youth: secondary/500)
fg/body/primary-dark   → color/primary/300   (Youth: secondary/300)
```

**Roles `accent` — dirección CONTRARIA, hacia `/700`** (antes `500` o mixto). Son roles distintos de los primary/secondary planos, no mezclar:
```
fg/icon/accent-primary-light · borderColor/accent-primary-light · bg/containerShape/accent-light
→ color/primary/700   (Youth: color/secondary/700)
```

**NO cambió (intencional — intensidades separadas):**
- ramas `bold`: `bg/primary-bold-light` (600), `bg/secondary-bold-light` (600)
- ramas `subtle`/`medium` y `bg/accent-primary-light` (sigue en 300)

**Efectos secundarios en Component tokens:**
- `checkbox/all/root/bg/selected` dependía de `bg/primary-bold` (`#36879C`) y quedó desincronizado → corregido a mano a `bg/primary` (`#4BA9C0`). Si algún componente en código depende de tokens `-bold` para primary/secondary, es candidato a la misma revisión.
- ~~`pagination/web/activePage/bg/primary` → `bg/surface/primary-bold`~~ **Obsoleto.** Superado por la reconstrucción de Pagination del 18/07/2026: los rellenos ahora apuntan a `bg/surface/primary` (`#4BA9C0`) / `bg/surface/secondary` (`#E02C7C`), sin repunte a `-bold`, y el círculo de página actual es `selectedPage`, no `activePage`. Ver §Pagination — nomenclatura por Part.

> ⚠️ **Verificar:** `bg/containerShape/primary-light` es un token `bg/*` y cambió (700→500). Es coherente con la regla primary (su hermano `bg/containerShape/accent-light` fue a 700), pero conviene confirmar con Carol que fue intencional y no un efecto colateral del reemplazo global.

---

## Mode (364 tokens × Light/Dark)

Tokens semánticos que el código consume. Grupos principales:

- `fg/*` — 208 tokens: texto e iconos
- `bg/*` — 114 tokens: fondos y superficies
- `borderColor/*` — 36 tokens: bordes
- `opacity/*` — 6 tokens: overlays y hover

### bg/hover tokens — semántica de color

`bg/hover-primary/secondary/tertiary` mapean a los tres acentos del sistema en versión muy suave:
- `bg/hover-primary` → azul cielo (acento teal en hover de listas y filas)
- `bg/hover-secondary` → rosa muy pálido (acento magenta)
- `bg/hover-tertiary` → lila muy pálido (acento purple)

Uso: Advanced Selector, Account Selector, Table rows.

### bg/negative — ELIMINADO (01/07/2026)

`bg/negative` (rojo muy oscuro `#4f1111`) eliminado de Mode — sin consumidores definidos en el sistema. Cuando aparezca roto en algún componente, reasignar a:
- `bg/error` → para fondos sólidos de estado negativo/error
- `bg/error-subtle` → para superficies suaves de estado negativo

### `bg/default` · `bg/page` · `bg/container` — escalera de elevación (11/08/2026)

Tres tokens neutros que en **light** son casi indistinguibles pero en **dark** revelan una escalera de elevación real — cuanto más elevada la superficie, más clara en dark mode:

| Token | Light | Dark | Rol |
|---|---|---|---|
| `bg/default` | `#FFFFFF` | `#050506` | lienzo base de la app (el más oscuro en dark) |
| `bg/page` | `#F9FAFA` | `#464B53` | área de contenido, un nivel por encima |
| `bg/container` | `#FFFFFF` | `#606772` | superficie de tarjeta/panel elevada (scope `FRAME_FILL`/`SHAPE_FILL`, el más claro en dark) |

**Origen del hallazgo:** `table/all/cellCommon/bg/onSurface` estaba aliasado a `bg/default` en vez de `bg/container` — coincidía en light (`#FFFFFF`) pero en dark habría puesto las celdas "onSurface" casi negras (el lienzo base) en vez de leerse como tarjeta elevada. Mismo patrón que la trampa `inverse`/`onColor` de arriba, pero en la familia `bg/*` en vez de `fg/*`. Corregido el alias en Figma a `bg/container`. `--ds-bg-container` no existía en absoluto en `tokens.css` — añadido al Mode layer (antes faltaba, probablemente la razón original por la que `onSurface` cayó en `bg/default` como sustituto).

**De paso, auditada y corregida toda la escala neutra en dark de `tokens.css`** (estaba desincronizada de Figma, en algunos casos con el orden invertido): `bg-default` `#191C1F`→`#050506` · `bg-page` `#050506`→`#464B53` · `bg-subtle` `#2C2F34`→`#7B8490` · `bg-disabled` sin override→`#9AA1AA` (heredaba el light `#EEEFF1`, casi blanco, en todos los estados disabled del sistema).

### `*/inverse` vs `*/onColor` — trampa de dark mode ⚠️ (confirmada y cerrada 11/08/2026)

Mismo valor en **light mode**, distinto en **dark mode** — existe en las tres familias `fg/label/*`, `fg/body/*` y `fg/icon/*`, no solo icono:

- `*/inverse` → se **invierte** con el modo (blanco en light → negro en dark, o al revés). Correcto SOLO cuando el fondo sobre el que se apoya **también invierte** — es decir, `bg/inverse` (Button default-filled, CTALink primary). Ahí ambos invierten juntos y el contraste se mantiene.
- `*/onColor` → se **mantiene fijo** (blanco) en los dos modos. Correcto cuando el fondo es una **superficie de color de marca/feedback que NO invierte** (`bg/primary`, `bg/secondary`, `bg/error`, `bg/success`… — todas resuelven al mismo tono en light y dark, solo cambia de intensidad).

**Regla de detección:** antes de fijar un color de texto/icono sobre un fondo relleno, resolver el `bg` en Light y Dark — si el hex es el mismo en los dos modos, el fg va a `onColor`; si el hex cambia entre modos, el fg va a `inverse`. Nunca decidir por el nombre del token ni por lo que "parece coherente" visualmente en un solo modo.

**Auditoría completa (11/08/2026):** verificado en vivo (resolución de cadena de alias en Figma, no el JSON cacheado) que el bug era real y no solo teórico — 7 casos confirmados con `*/inverse` sentado sobre un `bg` que no invierte, todos corregidos (en Figma y en `tokens.css`): `button/all/label/fg/accent-primary`, `ctaLink/all/label/fg/accent-highEmphasis`, `chip/all/label/fg/selected`, `chip/all/icon/fg/selected`, `badgeNotification/all/label/fg/generic`, `pagination/root/text/fg/selectedPage`, `pagination/activePage/fg/hover` — todos realiasados a `*/onColor`. En paralelo, `--ds-fg-label-inverse`/`--ds-fg-body-inverse`/`--ds-fg-icon-inverse` (que sí necesitaban invertir, para Button/CTALink default-filled) no tenían override dark en `tokens.css` — añadido (`#050506`), y `--ds-button-fg-default-filled`/`--ds-cta-link-fg-primary` recableados de `fg-onColor` (no invertía, incorrecto ahí) a `fg-label-inverse`.

### Sufijos de intensidad en bg y fg

- `-subtle` → intensidad baja (superficie muy suave)
- `-medium` → intensidad media
- `-bold` → intensidad alta (superficie saturada)

**No confundir** con los sufijos `-light/-dark` de Theme, que indican los dos valores posibles para light/dark mode.

---

## Component tokens (1038)

### Patrón "Common + específico"

Cuando una familia de componentes comparte estructura, los tokens compartidos viven en un grupo `Common` separado:

```
Input/
  InputCommon/   ← 27 tokens compartidos (root/label/helper/validation/valueText)
  InputText/     ← iconLeft, iconRight
  InputTelephone/ InputAmount/ InputDate/ InputDropdown/ InputStepper/

advancedSelector/all/   ← tokens propios del Advanced Selector
accountSelector/all/    ← tokens propios del Account Selector
```

**Borrowing intencional de InputCommon hacia Selector:** los tokens de `label/fg`, `helper/fg` y `validation/fg/*` son compartidos entre la familia Input y ambos Selectors. Es una decisión de arquitectura — todos son componentes de formulario y deben tener un único punto de mantenimiento para esos tokens.

### Tokens de icono — gestión en CSS, no en Figma

Los iconos son vectores de la librería Lucide. Figma no permite vincular el fill de un vector a una variable de componente → el color en Figma apunta al Mode token correspondiente (aproximación visual).

En código, el color se aplica via `currentColor` en el componente padre:
```css
/* Component token */
--ds-selector-icon-fg-primary: var(--ds-fg-icon-primary)
/* En el JSX, se aplica al contenedor, no al SVG */
color: var(--ds-selector-icon-fg-primary)
/* El SVG hereda via currentColor */
```

### Nomenclatura de color de icono — por contraste, no por posición ni Variant (14–15/07/2026)

Los tokens de color de icono se nombraban por su **posición** (`iconLeft`/`iconRight`) o por la **Variant de origen** (`default-primary`, `accent-generic`). Ninguno de los dos describe lo que el token resuelve. Regla nueva: **nombrar por el contraste real** — "¿qué necesita verse sobre este fondo?".

**Button e Icon Button** — consolidado en Figma:
```
Antes: iconLeft/fg/* + iconRight/fg/*   (16 tokens, duplicados por posición y por Variant)
Ahora: button/all/icon/fg/*             (4 tokens, por contraste)
  on-color            → icono sobre fondo relleno (blanco)      → fg/icon/onColor
  on-outline-default  → icono sobre contorno, tema default
  on-outline-accent   → icono sobre contorno, tema accent
  disabled            → icono deshabilitado
```
La posición (left/right) **nunca** determina el color. El criterio es el contraste del **estado concreto**, no la Variant: en Secondary/Tertiary el fondo pasa a relleno en Hover y Focus Hover, así que ahí el icono es `on-color` (blanco) aunque la Variant no sea Primary. Como `currentColor` propaga el color del padre al SVG, esto se resuelve en CSS puro vía los estados del botón — sin token de icono por estado.

`button/all/icon/size/*` también consolidado (antes `iconLeft/size` + `iconRight/size` duplicados).

> **Button — sincronizado con tokens.css (15/07/2026):** `button/all/icon/size/*` → `--ds-button-icon-size-{small,medium,large}` (`sizing/2xs·xs·sm` = 16/20/24). El **color** de icono NO tiene token propio: se hereda vía `currentColor` del botón, y ese color lo fijan los `--ds-button-fg-*` existentes (`on-color`→`fg/*-filled`, `on-outline-accent`→`fg/accent-outline`, `on-outline-default`→`fg/default-outline`, `disabled`→`fg/disabled`). Regla CLAUDE.md §4 — no se crea token de icono por estado.

**Selector y Account Selector** — mismo patrón aplicado (15/07/2026): `Selector/iconLeft/fg/*` == `Selector/iconRight/fg/*` (mismo valor `#4BA9C0` primary / `#B9BEC4` disabled), consolidados en CSS a un único par por componente:
```css
--ds-selector-icon-fg-primary   / --ds-selector-icon-fg-disabled
--ds-account-selector-icon-fg-primary / --ds-account-selector-icon-fg-disabled
```
Left y right comparten color; solo el tamaño (`--ds-selector-icon-left/right-size`, ambos 20px) sigue separado por posición — candidato a la misma consolidación en una pasada futura.

### AmountView — convención plain/soft/solid (01/07/2026)

Sustituyó la nomenclatura anterior (`positiveHighEmphasis`, `negativeHighEmphasis`, `negative`):

```
amountView/all/
  root/
    bg/
      positive-solid  → bg/success          (verde sólido)
      positive-soft   → bg/success-subtle   (verde suave)
      negative-solid  → bg/error            (rojo estándar — NO bg/error-bold ni bg/negative)
      negative-soft   → bg/error-subtle     (rojo suave)
      disabled        → bg/disabled
    borderRadius/ paddingHor/ paddingVer/ gapHor/   (geometría)
  fg/
    generic   → fg/body/default   (negro, para fondos claros)
    onColor   → fg/body/onColor   (blanco, para fondos sólidos)
    disabled  → fg/body/disabled
```

**Lógica de legibilidad WCAG AA:**
- `positive-solid` (bg/success verde): texto `generic` (negro) → ratio ~5.2:1 ✅
- `negative-solid` (bg/error rojo): texto `onColor` (blanco) → ratio ~9.8:1 ✅

**Nota de implementación:** `align-self: flex-start` + `flex: 0 0 auto` obligatorio en la raíz para que la píldora haga hug cuando vive en un contenedor `flex-direction: column`.

### BadgeHighlight — corrección de fondos (01/07/2026)

```
badgeHighlight/all/root/bg/
  emphasis   → bg/secondary-subtle   (rosa pálido magenta)
  neutral    → bg/surface/default    (antes: bg/page — incorrecto)
  positive   → bg/success-subtle     (antes: bg/success sólido — icono invisible)
  negative   → bg/error-subtle       (antes: bg/negative oscuro — icono invisible)
  disabled   → bg/disabled

badgeHighlight/all/icon/fg/
  emphasis   → fg/icon/secondary   (magenta)
  neutral    → fg/icon/subtle      (gris)
  positive   → fg/icon/success     (verde sobre fondo suave)
  negative   → fg/icon/error       (rojo sobre fondo suave)
  disabled   → fg/icon/disabled
```

Variantes renombradas en Figma: `Neutral High Emphasis` → `Emphasis`, `Neutral Low Emphasis` → `Neutral`.

### Selector families — estado de tokens de icono

**Color de icono — CREADO y sincronizado (15/07/2026).** Figma expone `Selector/iconLeft/fg/{primary,disabled}` y `Selector/iconRight/fg/{primary,disabled}` (mismo valor left/right: `#4BA9C0` primary, `#B9BEC4` disabled → Mode `fg/icon/primary` / `fg/icon/disabled`). Consolidados en `tokens.css` a un único par por componente, sin distinción de posición:

```css
--ds-selector-common-icon-fg-primary   → var(--ds-fg-icon-primary)
--ds-selector-common-icon-fg-disabled  → var(--ds-fg-icon-disabled)
/* alias por componente */
--ds-selector-icon-fg-primary  · --ds-selector-icon-fg-disabled
--ds-account-selector-icon-fg-primary · --ds-account-selector-icon-fg-disabled
```

Consumido por `SelectorInvoker` · `SelectorListItem` · `AccountSelectorInvoker` · `AccountSelectorListItem` vía `color:` sobre el contenedor + `currentColor` en el SVG (componente `Icon` compartido). Los sub-componentes antiguos `.Icon Left`/`.Icon Right` ya no existen en Figma.

**Aún pendiente de crear:**
```
advancedSelector/all/root/borderColor/focus-inner   ← no bloqueante
accountSelector/all/root/borderColor/focus-inner    ← no bloqueante
```
(Deuda conocida — el focus-inner del Country Picker/Advanced List Item se ve en teal en vez de blanco; ver deuda técnica en CLAUDE.md.)

---

### Pagination — nomenclatura por Part (18/07/2026)

`.Parts` de Pagination se reconstruyó desde cero: cada parte tenía estructura interna distinta (Link anidado, Frame duplicado, sin fondo…) y ahora comparten contenedor 32×32 → fondo (si aplica) → contenido, sin envoltorios extra.

**Renombrado de tokens — nombres cruzados heredados de Sistema Origen, ya corregidos para coincidir con el Part real:**

| Antes | Ahora | Es |
|---|---|---|
| `arrowLeft/*`  | `previous/*`     | flecha chevron-left |
| `arrowRight/*` | `next/*`         | flecha chevron-right |
| (intuición: actual) | `activePage/*` | el **Link** de texto subrayado (resto de páginas) |
| (intuición: otras)  | `selectedPage/*` | el **círculo** relleno de la página actual |

⚠️ **`activePage` ↔ `selectedPage` van cruzados respecto a la intuición.** Mapear SIEMPRE por el nombre del Part, no por lo que sugiere "Active"/"Selected": `activePage` = Link, `selectedPage` = círculo.

**Regla de contraste — caso de referencia (idéntica a Button/Icon Button):** contenido en blanco (`fg/icon/onColor` para icono, `fg/label/inverse` para texto) cuando el fondo del estado es **relleno/sólido**; oscuro cuando es **contorno**. En Pagination el fondo se rellena en el hover de `previous`/`next`/`dots` (chevron/…, van a blanco) y de forma persistente en `selectedPage` (círculo). El resto (Enabled/Focus/Pressed) es contorno → color por Variant (primary teal / secondary rosa).

Dark mode: los rellenos usan `fg/icon/onColor` (blanco en ambos modos), nunca `fg/icon/inverse` (se invierte a negro). El JSON exportado ya está limpio de `inverse` de icono.

**Mapa `--ds-pagination-*` → Mode:**
```css
/* selectedPage — círculo */
selected-bg-primary/secondary/disabled → bg/primary · bg/secondary · bg/disabled
root-text-fg-selected                  → fg/label/inverse   /* ⚠ ver deuda abajo */
/* activePage — Link subrayado */
active-fg-primary/secondary/hover/disabled → fg/label/default · secondary · inverse · disabled
active-bg-hover-primary/secondary          → bg/primary · bg/secondary
active-border-bottom-width                 → 1px (borderWidth/sm), color absorbido en currentColor
/* previous · next — flechas (idénticas, separadas como input iconLeft/Right) */
{previous,next}-fg-primary/secondary/disabled/hover → fg/icon/{primary,secondary,disabled,onColor}
{previous,next}-bg-hover-primary/secondary          → bg/primary · bg/secondary
/* dots — usa tokens de label, no de icono */
dots-fg-primary/secondary/disabled → fg/label/{default,secondary,disabled}
dots-fg-hover                       → fg/icon/onColor  ({icon.fg.onColor})
```

**Deuda de contraste (SelectedPage).** ~~Figma exporta `root/text/fg/selectedPage` = `fg/label/default`~~ **(1) resuelto 11/08/2026** — era el mismo bug `inverse`/`onColor` de arriba: el token de Figma invertía con el modo sentado sobre `bg/surface/primary`, que no invierte. Corregido en Figma y en código a `fg/label/onColor` (blanco fijo, correcto en los dos modos). ⚠️ **(2) sigue pendiente:** blanco sobre teal `#4BA9C0` = 2.7:1, no cumple WCAG AA — decisión consciente de Carol de dejarlo así por ahora; revisar (¿oscurecer el fill del círculo, o volver a texto oscuro?).

---

## Cell family + Table (11/08/2026) — familia completa

Los 4 átomos/organismos de la familia Celda (`table/all/cellCommon/*`) están construidos y ensamblados en `Table`:

- **CellHeader** (átomo) · **CellData** (átomo) · **CellMore** (átomo, disparador overflow) · **CellActions** (organismo, ≤2 acciones) — comparten los 10 tokens `cellCommon` (padding, gap, borde, superficie) y solo divergen en lo específico (padding vertical `basic` de cada uno).
- **Table** (organismo, `src/organisms/Table.jsx`) — decisión de arquitectura: **sin componente "Row" separado**. No existe uso standalone de una fila fuera de una tabla (a diferencia de CellActions, que sí vive sola dentro de una CellData), así que exponerla como organismo aparte solo añade superficie de API sin caso de uso real. `Table` exporta `Table` + `TableRow`, la fila es una pieza estructural del mismo archivo, no una entidad documentada aparte.
- **Sin chrome propio.** No existe un componente "Table" en Figma (verificado con `search_design_system` — solo existen `Column Header`/`Column Cell`/`Column More`, la familia Cell). `Table`/`TableRow` son wrappers de layout puro (`display:flex`, sin fondo/borde/radio propios) — si se necesita una tarjeta alrededor, la envuelve el consumidor.
- **Semántica ARIA, no `<table>` nativo.** CellHeader/CellData ya eran `<div>` con flexbox (no `<th>`/`<td>`) — mantenerlo así evita reescribir 3 átomos ya shippeados, y es el patrón estándar en tablas de datos complejas (AG Grid, MUI DataGrid, TanStack Table tampoco usan `<table>` nativo, por virtualización/columnas sticky/cell renderers custom). Roles añadidos: `role="table"` (Table) · `role="row"` (TableRow) · `role="columnheader"` (CellHeader) · `role="cell"` (CellData/CellMore/CellActions).
- **Composición pura, sin clonar props.** Igual que CellActions/ButtonBar — `Table`/`TableRow` no inspeccionan ni clonan sus `children`; `surface="zebra"`/`lastRow` se siguen fijando a mano por celda, Table no adivina el índice de fila.

### Bug de swap: `bg/primary` ↔ `bg/primary-bold` en dark (11/08/2026)

Al auditar la familia bg de marca/feedback en dark mode se encontró que `--ds-bg-primary` (el token más usado de toda la familia — Button accent, Checkbox/Chip seleccionado, CTALink accent, BadgeNotification primary, 5× Pagination) y `--ds-bg-primary-bold` (0 consumidores) tenían sus valores dark **intercambiados entre sí** en `tokens.css` — ninguno coincidía con el valor real de Figma. Corregido: `bg-primary` dark `#286371`→`#4BA9C0` (el teal vivo real, no un teal casi negro); `bg-primary-bold` dark `#4BA9C0`→`#F7FBFC`. De paso se sincronizó el resto de la familia (antes sin override dark, caían al valor light): `bg-primary-medium`, `bg-secondary`, `bg-secondary-medium`, `bg-tertiary`, `bg-error`/`bg-error-subtle`, `bg-success`/`bg-success-subtle`, `bg-hover-primary`, `bg-inverse`, `bg-accent-primary/secondary`, `bg-warning`, `bg-info`, `bg-highlight` — todos con el valor real resuelto en vivo desde Figma.

**Tokens huérfanos eliminados** (sin fuente en Figma bajo ningún nombre + 0 consumidores en código): `bg-quaternary` (las 4 variantes), `bg-hover-secondary`/`bg-hover-tertiary`, `bg-completed` (duplicado de `bg-success`), `bg-done` (sí era variable propia en Figma con consumidores reales — `switch/all/track/bg/on`, `stepNavigator/web/steps/bg/completed`, ambos en backlog sin construir — pero se decidió simplificar: esos dos se repuntaron a `bg/success` y `bg/done` se eliminó de Figma).

**Técnica de auditoría — diff estructural, no textual.** Los re-exports de Tokens Studio reordenan claves JSON (alfabético o por orden de creación en Figma), produciendo diffs de cientos de líneas que son 100% ruido cosmético. Para auditar un re-export con confianza: aplanar ambos JSON a `path → (hex, alias)` (recorriendo hasta el nodo con `$value`+`$type`) y comparar por path, no por posición de línea — así se separa lo que cambió de verdad de lo que solo cambió de sitio.

---

## Device tokens (79 × Mobile/Desk)

### Spacing

| Token | Mobile | Desk |
|---|---|---|
| spacing/2xs | 2px | — |
| spacing/xs | 4px | — |
| spacing/sm | 6px | — |
| spacing/md | 8px | — |
| spacing/lg | 12px | — |
| spacing/xl | 16px | — |
| spacing/2xl | 24px | — |
| spacing/3xl | 32px | — |

### Sizing

| Token | Valor |
|---|---|
| sizing/2xs | 16px |
| sizing/xs | 20px |
| sizing/sm | 24px |
| sizing/md | 32px |
| sizing/lg | 40px |
| sizing/xl | 48px |
| sizing/2xl | 64px |

`sizing/2xs` añadido el 01/07/2026 para BadgeHighlight icon size (16px).

### Border radius

`xs · sm · md · lg · xl · 2xl · 3xl · circle`

---

## Estado de temas

| Tema | Estado |
|---|---|
| Overall (Retail) | ✅ Activo · Auditado · 0 KOs |
| Youth | ✅ Activo · Auditado · 0 KOs · 148 tokens cambiados |
| Wholesale Banking | 🗑️ Eliminado de la colección 15/07/2026 |
| Business Banking | 🗑️ Eliminado de la colección 15/07/2026 |
| Private Banking | 🗑️ Eliminado de la colección 15/07/2026 |
| Wireframe | 🗑️ Eliminado de la colección 15/07/2026 |
| Legacy | — Nunca llegó a exportarse como archivo (figuraba en tablas antiguas sin `.tokens.json` real) |

**Decisión abierta:** los 4 temas eliminados el 15/07/2026 pueden volver a añadirse más adelante, o no. No es una eliminación definitiva — se trató como reducción de alcance del sistema (solo Retail + Youth activos). Los `.tokens.json` correspondientes se borraron del repo en la misma sesión.

---

## Reglas de consumo en código React

```css
/* ✅ Correcto — JSX usa Component token */
color: var(--ds-button-fg-accent-outline);
background: var(--ds-amount-view-bg-positive-solid);

/* ✅ Correcto — tokens.css usa Mode token */
--ds-button-fg-accent-outline: var(--ds-fg-primary);
--ds-amount-view-bg-positive-solid: var(--ds-bg-success);

/* ❌ Incorrecto — JSX salta la cascada usando Mode directamente */
color: var(--ds-fg-primary);

/* ❌ Incorrecto — salta todas las capas */
color: #286371;
```

---

## Deuda técnica de tokens

- ~~**Mode tokens dark mode** — varios tokens rotos o sin función clara en dark mode.~~ ✅ **Resuelto 11/08/2026** para la escala neutra `bg/*` (default/page/subtle/disabled/container), la familia de marca/feedback `bg/*` (primary/-bold/-medium, secondary, tertiary, error, success, hover-primary, inverse, accent, warning, info, highlight), y la trampa `*/inverse` vs `*/onColor` en `fg/label`, `fg/body` y `fg/icon` (ver secciones arriba). **Pendiente real:** `borderColor/*` dark no se ha auditado todavía contra Figma — mismo tipo de revisión, sesión aparte.
- **Notification Count description** — campo Description del componente apunta a dominio interno de Sistema Origen. Pendiente de borrar en Figma.
- **Placeholder/Placeholder** (node 2355:4239) — descripción del contenedor de iconos apunta a dominio interno. Pendiente de borrar en Figma.
