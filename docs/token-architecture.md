# Token Architecture — CS Design System
*Estado: Retail ✅ · Youth Banking ✅ · Julio 2026*

## Cascada de colecciones

```
Base (157)
  └─ primitivos raw: hex, opacidades, dimensiones, tipografía
  └─ el código NUNCA los usa directamente

Theme (873 por tema × 7 temas)
  └─ mapea Base a roles semánticos POR TEMA
  └─ 7 modos: Retail · Youth · Wholesale⚠️ · Business⚠️ · Private⚠️ · Wireframe⚠️ · Legacy⚠️
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
--ds-selector-icon-left-fg-generic: var(--ds-fg-icon-default)
/* En el JSX, se aplica al contenedor, no al SVG */
color: var(--ds-selector-icon-left-fg-generic)
/* El SVG hereda via currentColor */
```

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

### Selector families — tokens pendientes de crear

Pendiente de implementar en `tokens/component/` (creación manual en Figma completada el 01/07):

**advancedSelector (9 tokens nuevos):**
```
advancedSelector/all/iconLeft/fg/generic · focus · error · readOnly · dataHidden · hover · pressed
advancedSelector/all/root/borderColor/focus-inner
advancedSelector/all/root/opacity/pressed
```

**accountSelector (15 tokens nuevos):**
```
accountSelector/all/iconLeft/fg/* (8 tokens — igual que advancedSelector)
accountSelector/all/root/borderWidth/generic (1.5) · focus (2)
accountSelector/all/root/borderColor/focus-inner
accountSelector/all/detailText/fg/default · disabled · secondary · tertiary
```

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
| Retail (Overall) | ✅ Auditado · 0 KOs |
| Youth Banking | ✅ Auditado · 0 KOs · 148 tokens cambiados |
| Wholesale Banking | ⚠️ Sin auditar |
| Business Banking | ⚠️ Sin auditar |
| Private Banking | ⚠️ Sin auditar |
| Wireframe | ⚠️ Sin auditar |
| Legacy | ⚠️ Sin auditar |

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
