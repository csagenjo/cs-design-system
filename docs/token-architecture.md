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
- `pagination/web/activePage/bg/primary` → `bg/surface/primary-bold` (`#286371`) y `bg/secondary` → `bg/secondary-bold` (`#B71B60`): **repunte intencional** para que el círculo de página activa combine con el color del texto/icono del link. **NO tocar.**

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

### `fg/icon/inverse` vs `fg/icon/onColor` — trampa de dark mode ⚠️

Mismo valor en **light mode**, distinto en **dark mode**:

- `fg/icon/inverse` → se **invierte a negro** en dark mode. Pensado para icono que debe contrastar contra el fondo del modo (blanco en light, negro en dark).
- `fg/icon/onColor` → se **mantiene blanco** en ambos modos. Pensado para icono sobre una **superficie de color** (Button relleno, AmountView solid, chips de estado…).

**Regla:** para icono sobre superficie de color usar SIEMPRE `fg/icon/onColor`. Usar `inverse` ahí deja el icono negro (invisible) en dark mode. Es el mismo par de trampa detectado en `fg/body/inverse` vs `fg/body/onColor`. (Ver deuda técnica de Mode dark mode — revisar si hay más pares con esta misma semántica antes de cerrar la revisión global.)

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

- **Mode tokens dark mode** — varios tokens rotos o sin función clara en dark mode. Revisión global pendiente (sesión aparte, no bloqueante).
- **Notification Count description** — campo Description del componente apunta a dominio interno de Sistema Origen. Pendiente de borrar en Figma.
- **Placeholder/Placeholder** (node 2355:4239) — descripción del contenedor de iconos apunta a dominio interno. Pendiente de borrar en Figma.
