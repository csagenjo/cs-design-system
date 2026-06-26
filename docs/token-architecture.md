# Token Architecture — CS Design System
*Estado: Retail ✅ · Youth Banking ✅ · Junio 2026*

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

### Paleta de color — 9 familias + 2 auxiliares

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
`color/black: #050506` · `color/white: #FFFFFF` — alias de conveniencia, 449 refs en Theme.

### Opacidades — dos familias distintas ⚠️ no mezclar

**`color/opacity/black/*` y `color/opacity/white/*`** — type: color — para fills con transparencia en shapes decorativos.
- 4 niveles: 10% (rgba 0.1) · 16% (rgba 0.16) · 30% (rgba 0.3) · 40% (rgba 0.4)
- Uso: bg/shape-subtle→10%, bg/shape-default→16%, bg/shape-bold→30%

**`opacity/*`** — type: number — para el atributo CSS `opacity` del elemento completo.
- 5 valores: 30 · 40 · 60 · 70 · 80

---

## Theme — Retail vs Youth Banking

| Aspecto | Retail | Youth |
|---|---|---|
| Hero de marca (CTA, primary surfaces) | primary/teal (#4BA9C0) | secondary/magenta (#E02C7C) |
| Color de soporte | secondary/magenta | primary/teal |
| Decorativo / containerShape | tertiary/lavanda | tertiary/lavanda — sin cambio |
| Tokens cambiados entre temas | — | 148 (primary↔secondary swap) |

El swap primary↔secondary permite que los componentes funcionen en ambos temas sin cambio de código: solo cambia el modo activo de Theme.

### Cómo leer fg/*/onSurface

`fg/label/onSurface/primary` = texto sobre una superficie de tipo primary.
- **No** es "texto en color primary"
- **Sí** es "texto que garantiza contraste AA cuando el fondo es `bg/surface/primary`"

`fg/label/default` → texto sobre fondo neutro. Invierte a blanco en dark mode.
`fg/label/onSurface/primary` → texto sobre superficie primary. Ajusta al fondo, no invierte genéricamente.

---

## Mode (364 tokens × Light/Dark)

Tokens semánticos que el código consume. Grupos principales:

- `fg/*` — 208 tokens: texto e iconos
- `bg/*` — 114 tokens: fondos y superficies
- `borderColor/*` — 36 tokens: bordes
- `opacity/*` — 6 tokens: overlays y hover

### Roles de icono disponibles en fg/icon

```
default       → negro/blanco según modo
subtle        → gris medio
primary       → teal #286371 (light) / #4BA9C0 (dark)
secondary     → magenta #B71B60 (light) / #FEF6F9 (dark)
tertiary      → lavanda #B185C5 (light) / #F6F1F8 (dark)
accent-primary→ teal claro #4BA9C0 (light+dark)
inverse       → blanco/negro según modo
onColor       → blanco (sobre fondos de color)
info          → azul #016398
success       → verde #389A3D
warning       → ámbar #996600
error         → rojo #AD2525
disabled      → gris #B9BEC4
```

### Renames aplicados en la última auditoría (51 tokens)

- `-light` → `-subtle` × 47 (ej: `bg/secondary-light` → `bg/secondary-subtle`)
- `default-primary` → `static-primary` × 4

11 tokens nuevos añadidos: `bg/accent-primary`, `bg/accent-secondary`, `bg/completed`, `bg/shape/primary-subtle/medium/bold`, `bg/surface/primary-subtle/medium/bold`, `fg/icon/accent-primary`, `fg/icon/onSurface/inverse`.

---

## Component tokens (1038)

- **41 visibles** (accent + visited): personalizables por tema desde el picker de Figma
- **997 hidden**: internos del componente

Componentes con tokens definidos: button, buttonBlob, checkbox, chipChoice, chipFilter, chipInput, ctaLink, link, linkList, iconButton, input (text/amount/date/telephone/dropdown), calendar, cards, accordion, tabs, dialog, drawer, pagination, radioButton, segmentedControl, slider, switch, table, text, tooltip, y ~35 más.

**Nota — LinkList:** no tiene bloque `--ds-link-list-*` propio. Usa exclusivamente tokens de Device (`--ds-spacing-xs/md/xl`) para el gap entre items, y delega todos los estilos de color/tipografía a los tokens de Link que ya porta cada `<Link>` hijo. Patrón válido para wrappers puramente estructurales.

### Bloque `--ds-radio-*` (21 tokens)

```css
/* Fondos */
--ds-radio-root-bg-generic:                var(--ds-bg-default)
--ds-radio-root-bg-hover:                  var(--ds-bg-hover-primary)
--ds-radio-root-bg-disabled:               var(--ds-bg-disabled)

/* Bordes del círculo */
--ds-radio-root-border-color-generic:      var(--ds-borderColor-default)
--ds-radio-root-border-color-selected:     var(--ds-borderColor-primary)
--ds-radio-root-border-color-error:        var(--ds-borderColor-error)
--ds-radio-root-border-color-disabled:     var(--ds-borderColor-disabled)

/* Focus ring — dual wrapper */
--ds-radio-root-border-color-focus-inner:  var(--ds-borderColor-focus-inner)
--ds-radio-root-border-color-focus-outer:  var(--ds-borderColor-focus-outer)

/* Indicador (punto interior) */
--ds-radio-indicator-fg-generic:           var(--ds-bg-primary-bold)
--ds-radio-indicator-fg-disabled:          var(--ds-fg-disabled)
--ds-radio-indicator-fg-error:             var(--ds-fg-error)

/* Label y texto */
--ds-radio-label-fg-generic:               var(--ds-fg-label-default)
--ds-radio-label-fg-disabled:              var(--ds-fg-label-disabled)
--ds-radio-description-fg:                 var(--ds-fg-subtle)
--ds-radio-validation-fg:                  var(--ds-fg-error)

/* Geometría */
--ds-radio-root-size-generic:              24px
--ds-radio-root-border-radius-generic:     80px
--ds-radio-root-border-width-generic:      2px
--ds-radio-root-gap-generic:               2px
--ds-radio-indicator-border-radius-generic: 80px
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

### Border radius

`xs · sm · md · lg · xl · 2xl · 3xl · circle`

### Border width

`sm · md · lg · xl`

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
background: var(--ds-input-bg-default);

/* ✅ Correcto — tokens.css usa Mode token */
--ds-button-fg-accent-outline: var(--ds-fg-primary);
--ds-input-bg-default: var(--ds-bg-default);

/* ❌ Incorrecto — JSX salta la cascada usando Mode directamente */
color: var(--ds-fg-primary);
background: var(--ds-bg-default);

/* ❌ Incorrecto — salta todas las capas */
color: var(--ds-color-primary-700);
color: #286371;
```

El tema activo se activa con `data-theme="youth"` en el elemento raíz.
El modo claro/oscuro con `data-mode="dark"` o `prefers-color-scheme`.

---

## Auditoría 23/06/2026

**Estado post-auditoría: cero violaciones en todos los componentes.**

### Cambios aplicados

**tokens.css:** 83 hex hardcodeados → `var()` en los bloques Button, InputCommon, InputText, InputDate, InputDropdown, InputTelephone, InputAmount, InputStepper, Link, CTALink. Checkbox era el único bloque ya correcto.

**JSX:** 20 referencias directas a Mode/Base eliminadas en Button.jsx (6), InputText.jsx (3), InputDate.jsx (2), InputDropdown.jsx (2), InputStepper.jsx (2), InputTelephone.jsx (2), InputAmount.jsx (2).

### Tokens nuevos (8)

Tokens faltantes creados para permitir la migración completa de JSX:

```
InputCommon:  --ds-input-fg-placeholder     → var(--ds-fg-subtle)
              --ds-input-border-hover       → var(--ds-borderColor-emphasis)
              --ds-input-bg-readonly        → var(--ds-bg-page)
Button:       --ds-button-fg-negative       → var(--ds-fg-error)
              --ds-button-border-negative   → var(--ds-borderColor-error)
              --ds-button-bg-negative-hover → var(--ds-bg-error-subtle)
              --ds-button-bg-mix-hover      → var(--ds-opacity-hover-default)
InputStepper: --ds-input-stepper-btn-bg-hover → var(--ds-opacity-hover-default)
```

### Patrón bgMix

Overlays de hover sobre superficies transparentes (botones outline/ghost, links) usan `var(--ds-opacity-hover-default)` envuelto en un Component token propio, nunca referenciado directamente desde el JSX. Esto garantiza que el dark mode override (`rgba(255,255,255,0.1)`) llegue hasta el JSX por la cascada normal.
