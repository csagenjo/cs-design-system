# CLAUDE.md — CS Design System
# Leído automáticamente por Claude Code al iniciar cada sesión.

## 1. Qué es este proyecto

Librería personal de componentes React basada en un design system de banca (alias: Sistema Origen).
Completamente limpia de IP. Conectada con Figma CS Design System (csagenjo).
Caso de uso: UIKit para apps internas de back-office (alias: La Plataforma).

Repo: https://github.com/csagenjo/cs-design-system

## 2. Stack y estructura de carpetas

Node.js v24.16.0 · Vite · React · lucide-react (iconos)
Servidor local: http://localhost:5173/
Comando dev: npm run dev

```
src/
  components/        ← Capa 1: DS csagenjo — SOLO átomos puros
    Button.jsx        ✅ átomo DS v2
    Checkbox.jsx       ✅ DS v2, indeterminate, aria-checked=mixed — tokens migrados a --ds-checkbox-* (22/06/2026)
    Link.jsx           ✅ variantes default/accent, tokens teal
    CTALink.jsx        ✅ v2.0 — 24 variantes, 4 estados, borderRadius por énfasis
    InputText.jsx      ✅ v1 — texto, iconos izq/der, adaptive
    InputDate.jsx      ✅ v1
    InputDropdown.jsx  ✅ v1
    InputStepper.jsx   ✅ v1
    InputTelephone.jsx ✅ v1 — selectable/fixed, doble campo, divider teal
    InputAmount.jsx    ✅ v1.0 — selectable/fixed, doble campo, formato de número locale-aware
    Radio.jsx          ✅ v1 — dual wrapper focus ring, label opcional, 21 tokens --ds-radio-*, zero violaciones
    Chip.jsx           ✅ v1.0 — choice/filter(selectable+dismissible)/input, bgMix overlay, dual focus target via :has()
    LinkList.jsx       ✅ v1.0 — wrapper semántico nav/ul/li sobre Link, gap via Device spacing tokens
  organisms/          ← Capa 2: UIKit Plataforma — ButtonBar y futuros organismos
    ButtonBar.jsx      ✅ movido aquí (antes vivía mal ubicado en components/)
  tokens.css          ✅ fuente de verdad — Component tokens migrados a var() (23/06/2026)
  main.jsx
  App.jsx             banco de pruebas (se sobrescribe cada sesión)
tokens/
  Base/               ✅ Mode 1.tokens.json
  Theme/               ✅ Retail + Youth + 5 más (⚠️ sin auditar)
  Mode/                 ✅ Light.tokens.json + Dark.tokens.json
  Component/           ✅ Mode 1.tokens.json — incluye familia Input/ completa
  Device/               ✅ Mobile + Desk + Generic
docs/
  token-architecture.md  ✅ arquitectura completa
CLAUDE.md
README.md
```

## 3. Aliases — usar SIEMPRE, nunca los nombres reales

- **La Empresa** — la organización de origen
- **Sistema Origen** — el design system de referencia
- **La Plataforma** — la aplicación back-office de caso de uso
- **UIKit Plataforma** — el UIKit de componentes de La Plataforma

## 4. Arquitectura de tokens — 5 capas (cascada)

```
Base (157) — paleta raw, solo hex, el código NUNCA los usa directamente

      ↓ referencia Base

Theme (873) — 7 temas: Retail ✅ · Youth ✅ · Wholesale ⚠️ · Business ⚠️ · Private ⚠️ · Wireframe ⚠️
  Mapea Base a roles semánticos POR TEMA.
  Convenio: {rol}-light / {rol}-dark  (dos valores posibles para Mode)
  El código NUNCA los usa directamente.

      ↓ referencia Theme

Mode (364) — 2 modos: Light / Dark
  Resuelve qué valor de Theme usar según modo UI activo.
  SIN sufijo de modo — tokens semánticos puros.
  ESTE es el layer que usa el código → var(--ds-fg-primary)

      ↓ referencia Mode

Component (1026+) — tokens por componente, referencian SOLO Mode
  Convenio: {Grupo}/{Componente}/{parte}/{propiedad}/{estado}
  Patrón nuevo (Jun 2026): familias con tokens comunes usan un grupo "Common"
  compartido — ver sección Familia Input como referencia del patrón.

Device (79) — capa paralela, no de color
  Tipografía y espaciados. Mobile / Desk / Generic.
```

**Regla de oro:** Component → Mode → Theme → Base. Saltar capas rompe dark mode y multi-tema.

**Sufijos -light/-dark en Theme:** son los dos valores posibles (light/dark mode), NO intensidad.
**Sufijos -subtle/-medium/-bold en Mode:** indican intensidad (renombrados de -light/-medium/-bold en Jun 2026).

**Decisión de sistema — accent color:** `accent` = teal en TODOS los componentes (Button, CTALink, Checkbox, Link, Input...). Secondary/pink = rol de datos e información, no de navegación/acción.

**Consolidado (22/06/2026, completado 23/06/2026):** el código de cada componente debe consumir
EXCLUSIVAMENTE tokens de Component (`--ds-{componente}-*`) — nunca `--ds-fg-*`, `--ds-bg-*`,
`--ds-borderColor-*` (Mode) ni `--ds-color-*` (Base) directamente desde un `.jsx`.
Todos los componentes cumplen esto desde 23/06/2026 — cero violaciones.

### Patrón bgMix para overlays de interacción

Hover sobre superficies sin fondo sólido (outline, ghost, links) usa overlay rgba vía
`var(--ds-opacity-hover-default)` — nunca un color Base hardcodeado. Componentes que lo usan:
Button (`--ds-button-bg-mix-hover`), Link (`--ds-link-bg-mix-hover`),
CTALink (`--ds-cta-link-bg-mix-hover`), InputStepper (`--ds-input-stepper-btn-bg-hover`).

### Patrón "Common + específico" (establecido con la familia Input)

Cuando varios componentes comparten estructura (ej. los 6 tipos de Input), los tokens se organizan así en Figma:

```
Component tokens
  Input/                    ← agrupador del dominio
    InputCommon/             ← 27 tokens compartidos por TODOS los inputs
      root/bg, borderColor (generic/error/disabled/focus-inner/focus-outer),
           borderRadius, borderWidth, minheight, paddingHor/Ver, fieldIconGap
      label/fg, gap
      helper/fg, gap
      validation/fg.icon, fg.text, gap
      valueText/fg
    InputText/                ← SOLO lo específico: iconLeft, iconRight (tamaño+color)
    InputTelephone/           ← countryField, telephoneField, countryText, divider, iconDropdown, iconFlag
    InputAmount/               ← amountField, currencyField, currencyText, iconDropdown
    InputDate/                  ← iconRight (calendario)
    InputDropdown/                ← iconRight (chevron)
    InputStepper/                   ← iconLeft, iconRight (botones −/+), btnBgHover
```

Aplicar este mismo patrón ("Common" + específicos) a futuras familias de componentes con estructura compartida (ej. si se construye una familia de Selectors o Chips).

### Auditoría global de tokens (23/06/2026) ✅

Auditoría completa sobre `tokens.css` y todos los JSX. Estado final: cero violaciones.

**tokens.css — migración de Component blocks:**
83 hex hardcodeados reemplazados por `var()` en 9 bloques (Button, InputCommon, InputText,
InputDate, InputDropdown, InputTelephone, InputAmount, InputStepper, Link, CTALink).
Checkbox era el único bloque ya correcto — sirve de modelo.

**JSX — violaciones eliminadas:**
20 referencias directas a Mode/Base corregidas en 7 archivos:
Button.jsx (6) · InputText.jsx (3) · InputDate.jsx (2) · InputDropdown.jsx (2) ·
InputStepper.jsx (2) · InputTelephone.jsx (2) · InputAmount.jsx (2)

**8 tokens nuevos añadidos:**
```
--ds-input-fg-placeholder           var(--ds-fg-subtle)             — InputCommon
--ds-input-border-hover             var(--ds-borderColor-emphasis)  — InputCommon
--ds-input-bg-readonly              var(--ds-bg-page)               — InputCommon
--ds-button-fg-negative             var(--ds-fg-error)              — Button
--ds-button-border-negative         var(--ds-borderColor-error)     — Button
--ds-button-bg-negative-hover       var(--ds-bg-error-subtle)       — Button
--ds-button-bg-mix-hover            var(--ds-opacity-hover-default) — Button
--ds-input-stepper-btn-bg-hover     var(--ds-opacity-hover-default) — InputStepper
```

## 5. Arquitectura de capas

```
CAPA 1 — DS csagenjo · átomos puros · /src/components/
  Button ✅ · Link ✅ · CTALink ✅ · Checkbox ✅ · Radio ✅ · Input (familia, 6 tipos) ✅
  Todos auditados — cero violaciones de capas en JSX y tokens.css (23/06/2026)

CAPA 2 — UIKit Plataforma · organismos · /src/organisms/
  ButtonBar ✅ (movido desde components/ — Jun 2026)
  24 organismos totales + 5 layouts — pendiente migrar el resto
```

Regla: nunca saltarse capas. Los organismos importan átomos, no reimplementan su lógica.
`src/components/` es SOLO para átomos de Capa 1 (DS csagenjo). Cualquier organismo o componente compuesto pensado para La Plataforma va en `src/organisms/`. No mezclar.

## 6. Reglas críticas — NO hacer nunca

- NUNCA usar hex hardcodeados en componentes — solo `var(--ds-*)`
- NUNCA referenciar colores del Sistema Origen
- NUNCA usar prefijo `.oj-` en CSS — usar `.ds-`
- NUNCA editar `package-lock.json` a mano
- NUNCA acumular imports en App.jsx — es banco de pruebas, se sobrescribe
- NUNCA usar nombres reales en código, commits ni docs — solo los aliases de arriba
- NUNCA saltar capas en la cascada de tokens (Component → Mode → Theme → Base)
- NUNCA mezclar átomos (components/) con organismos (organisms/)
- NUNCA referenciar tokens de Mode (`--ds-fg-*`, `--ds-bg-*`, `--ds-borderColor-*`) o Base (`--ds-color-*`) directamente desde un `.jsx` — solo `--ds-{componente}-*`
- NUNCA usar valores hardcodeados en JSX ni en el bloque CSS de componentes — ni hex (#050506), ni rgba(), ni px sueltos (2px, 8px), ni números de opacidad (0.8). Todo valor debe venir de un token CSS via var(--ds-*). Si el token no existe en tokens.css, créalo primero siguiendo la cascada Component → Mode → Base. Los valores hex/rgba/px que aparecen en el análisis de Figma son valores resueltos para referencia visual, nunca para copiar directamente al código.

## 7. Workflow de componentes

```
1. EXPLORE en Claude Code (leer código actual + tokens de Figma ya auditados)
2. PLAN en Claude Code (arquitectura + API + tokens CSS faltantes — NO code yet)
3. CODE en Claude Code
4. REVIEW con GPT (auditoría técnica)
5. FIX en Claude Code (solo críticos)
6. COMMIT cuando ≥8/10
```

Convención de commits:
```
Add [ComponentName] using --ds-* tokens
Update [ComponentName]: descripción
Fix [ComponentName]: descripción
Move [ComponentName]: descripción (ej. reubicación de capas)
```

## 8. Componentes construidos

### Button.jsx ✅ v2

```jsx
<Button
  variant  = "accent" | "default" | "negative" | "ghost"
  size     = "sm" | "md" | "lg"          // default: md
  outline  = {false}
  iconLeft = "Search"                     // nombre Lucide / PascalCase
  iconRight= "ArrowRight"
  iconOnly = {false}
  floating = {false}
  fullWidth= {false}
  disabled = {false}
  loading  = {false}
  onClick  = {fn}
  ariaLabel= ""                           // requerido si iconOnly
  htmlType = "button" | "submit" | "reset"
>
  Texto
</Button>
```

Tokens Component (Button) — todos referencian Mode vía `var()`:
```
--ds-button-bg-accent-filled    var(--ds-bg-primary)
--ds-button-bg-default-filled   var(--ds-bg-inverse)
--ds-button-bg-disabled         var(--ds-bg-disabled)
--ds-button-fg-accent-filled    var(--ds-fg-onColor)
--ds-button-fg-accent-outline   var(--ds-fg-primary)
--ds-button-fg-default-filled   var(--ds-fg-onColor)
--ds-button-fg-default-outline  var(--ds-fg-default)
--ds-button-fg-disabled         var(--ds-fg-disabled)
--ds-button-border-accent       var(--ds-borderColor-accent)
--ds-button-border-default      var(--ds-borderColor-emphasis)
--ds-button-border-disabled     var(--ds-borderColor-disabled)
--ds-button-border-focus-outer  var(--ds-borderColor-focus-outer)
--ds-button-fg-negative         var(--ds-fg-error)
--ds-button-border-negative     var(--ds-borderColor-error)
--ds-button-bg-negative-hover   var(--ds-bg-error-subtle)
--ds-button-bg-mix-hover        var(--ds-opacity-hover-default)
```

### Link.jsx ✅ v2.0

```jsx
<Link
  variant   = "default" | "accent"
  size      = "xs" | "sm" | "md" | "lg"  // default: sm
  emphasis  = "low" | "medium"            // low=400, medium=700
  leftIcon  = {false}
  rightIcon = {true}                      // ChevronRight
  external  = {false}
  href
  onClick
  ariaLabel
>
  Texto
</Link>
```

Tokens de color Link (arquitectura v2 — alineada con Figma link/all/) — todos `var()`:
- `--ds-link-fg-label-default` / `accent` → `var(--ds-fg-label-primary)` / `accent-visited` → `var(--ds-fg-tertiary)`
- `--ds-link-fg-icon-default` / `accent` → `var(--ds-fg-icon-primary)` / `visited` → `var(--ds-fg-icon-tertiary)`
- `--ds-link-border-bottom-default` → `var(--ds-borderColor-emphasis)` / `accent` → `var(--ds-borderColor-accent)` / `visited` → `var(--ds-borderColor-tertiary)`
- `--ds-link-bg-mix-hover` → `var(--ds-opacity-hover-default)`
- `--ds-link-opacity-pressed` 0.8
- Active: opacity 0.8 + SemiBold

### CTALink.jsx ✅ v2.0

```jsx
<CTALink
  emphasis  = "low" | "medium" | "high"   // default: medium
  variant   = "default" | "accent"        // default: default
  href
  onClick
  external  = {false}
  disabled  = {false}
  ariaLabel
>
  Texto
</CTALink>
```

24 variantes en Figma (4 estados × 6 combinaciones). Estados: Initial · Hover · Focus · Pressed.

Tokens en tokens.css — todos referencian Mode vía `var()`:
```css
--ds-cta-link-fg-default              var(--ds-fg-default)
--ds-cta-link-fg-primary              var(--ds-fg-onColor)
--ds-cta-link-fg-accent               var(--ds-fg-primary)
--ds-cta-link-fg-accent-primary       var(--ds-fg-onColor)
--ds-cta-link-fg-disabled             var(--ds-fg-disabled)
--ds-cta-link-bg-primary              var(--ds-bg-inverse)
--ds-cta-link-bg-accent-primary       var(--ds-bg-primary)
--ds-cta-link-bg-mix-hover            var(--ds-opacity-hover-default)
--ds-cta-link-border-secondary        var(--ds-borderColor-emphasis)
--ds-cta-link-border-accent-secondary var(--ds-borderColor-accent)
--ds-cta-link-border-bottom-default   var(--ds-borderColor-emphasis)
--ds-cta-link-border-bottom-accent    var(--ds-borderColor-accent)
--ds-cta-link-focus-inner             var(--ds-borderColor-focus-inner)
--ds-cta-link-focus-outer             var(--ds-borderColor-focus-outer)
--ds-cta-link-border-radius-low       16px    /* ctaLink/all/root/borderRadius/lowEmphasis */
--ds-cta-link-border-radius-medium    24px    /* ctaLink/all/root/borderRadius/mediumEmphasis */
--ds-cta-link-border-radius-high      80px    /* ctaLink/all/root/borderRadius/highEmphasis */
--ds-cta-link-border-radius-focus     80px    /* ctaLink/all/root/borderRadius/focus */
--ds-cta-link-opacity-pressed         0.8     /* ctaLink/all/root/opacity/pressed = 80 */
--ds-cta-link-padding-ver             6px     /* ctaLink/all/root/paddingVer/generic */
--ds-cta-link-padding-hor             12px    /* ctaLink/all/root/paddingHor/generic */
```

Sin icono. Sin prop size. Talla única.
- Hover: overlay bgMix rgba(5,5,6,0.1). Low emphasis: underline sube a 1.5px en hover.
- Focus: doble anillo (inner blanco + outer negro), solo en estado Focus.
- Pressed: opacity 0.8 vía `:active`.
- Disabled: aria-disabled + tabIndex -1 + opacity 0.6.

### Checkbox.jsx ✅ v2

**Historial v1 → v2 (22/06/2026):**
- v1: tokens Mode/Base directos, `opacity: 0.5` para disabled, focus ring simple.
- v2: migrado a `--ds-checkbox-*` exclusivamente. Focus ring doble anillo (outer+inner via box-shadow). Disabled: `opacity: 0.5` eliminado, reemplazado por `--ds-checkbox-icon-disabled` en `color`. Hover+Focus combinado añadido.

Figma: limpio y auditado — 23 tokens en Component tokens (`--ds-checkbox-*` en `tokens.css`):
bg (default/selected/hover/disabled/error), border (default/selected/hover/disabled/error),
focus (inner/outer), icon (fg/disabled), label (fg/disabled), description, validation,
geometría (size, borderRadius, borderWidth, labelGap).

```jsx
<Checkbox
  checked
  defaultChecked
  indeterminate = {false}
  state         = "default" | "error" | "disabled"
  label
  description
  errorMessage
  onChange
  onFocus
  onBlur
  id
  name
  value
  required      = {false}
  ariaLabel
  fullWidth     = {false}
/>
```

Comportamientos: `checked=false` → Unselected · `checked=true` → Selected (checkmark teal) · `indeterminate=true` → Indeterminate (dash teal, ignora `checked`). Sin validación de formato — el estado error lo gestiona el padre.

### Radio.jsx ✅ v1

```jsx
<Radio
  checked
  defaultChecked
  state         = "default" | "error" | "disabled"
  label
  description
  errorMessage
  onChange
  onFocus
  onBlur
  id
  name
  value
  required      = {false}
  ariaLabel
  fullWidth     = {false}
  showLabel     = {true}
/>
```

Tokens Component (Radio) — 21 tokens, todos referencian Mode vía `var()`:
```
--ds-radio-root-bg-generic:                var(--ds-bg-default)
--ds-radio-root-bg-hover:                  var(--ds-bg-hover-primary)
--ds-radio-root-bg-disabled:               var(--ds-bg-disabled)
--ds-radio-root-border-color-generic:      var(--ds-borderColor-default)
--ds-radio-root-border-color-selected:     var(--ds-borderColor-primary)
--ds-radio-root-border-color-error:        var(--ds-borderColor-error)
--ds-radio-root-border-color-disabled:     var(--ds-borderColor-disabled)
--ds-radio-root-border-color-focus-inner:  var(--ds-borderColor-focus-inner)
--ds-radio-root-border-color-focus-outer:  var(--ds-borderColor-focus-outer)
--ds-radio-indicator-fg-generic:           var(--ds-bg-primary-bold)
--ds-radio-indicator-fg-disabled:          var(--ds-fg-disabled)
--ds-radio-indicator-fg-error:             var(--ds-fg-error)
--ds-radio-label-fg-generic:               var(--ds-fg-label-default)
--ds-radio-label-fg-disabled:              var(--ds-fg-label-disabled)
--ds-radio-description-fg:                 var(--ds-fg-subtle)
--ds-radio-validation-fg:                  var(--ds-fg-error)
--ds-radio-root-size-generic:              24px
--ds-radio-root-border-radius-generic:     80px
--ds-radio-root-border-width-generic:      2px
--ds-radio-root-gap-generic:               2px
--ds-radio-indicator-border-radius-generic: 80px
```

**Notas de implementación:**
- Dual wrapper focus ring: input nativo oculto (visually hidden) + dos wrappers span (`focus-ring` → `control-wrap`) que reciben los bordes de focus vía `:focus-visible`. Mismo patrón que Checkbox.
- Label opcional — si no se pasa `label`, requiere `ariaLabel` (warning en dev si falta).
- Controlado/no controlado: acepta `checked` (controlado) o `defaultChecked` (no controlado) — nunca los dos.
- Sin `indeterminate` — Radio no tiene ese estado (a diferencia de Checkbox).
- Grupos de radio: agrupar con la misma prop `name`. El navegador gestiona la exclusividad.
- `forwardRef` expuesto — permite `ref.current.focus()` desde el padre.

### Chip.jsx ✅ v1.0

```jsx
// Choice — toggle button
<Chip
  type             = "choice"
  label            = "Activos"
  selected                        // controlado
  defaultSelected  = {false}      // no controlado
  onSelectedChange = {fn}
  disabled         = {false}
  id
  name
  ariaLabel                       // requerido si no hay label
/>

// Filter — variante selectable (toggle idéntico a choice)
<Chip
  type             = "filter"
  variant          = "selectable" // default
  label            = "Pendiente"
  selected
  defaultSelected  = {false}
  onSelectedChange = {fn}
  disabled         = {false}
/>

// Filter — variante dismissible (label + value + X)
<Chip
  type        = "filter"
  variant     = "dismissible"
  filterLabel = "Ciudad"          // texto bold antes de los dos puntos
  value       = "Madrid"          // valor del filtro aplicado
  onRemove    = {fn}              // click en botón X
  disabled    = {false}
  ariaLabel                       // auto-generado de filterLabel + value si se omite
/>

// Input — chip de valor fijo con icono y botón eliminar
<Chip
  type        = "input"
  label       = "Madrid"          // valor del chip
  icon        = {<MapPin />}      // ReactNode Lucide (opcional)
  onChipClick = {fn}              // click en body — si se omite, body es <span>
  onRemove    = {fn}              // click en botón X
  disabled    = {false}
  ariaLabel                       // requerido si no hay label y hay onChipClick
/>
```

**Tokens — 22 comunes (`chip/all/`) + 4 chipFilter + 3 chipInput:**
```
chip/all/root:
  --ds-chip-root-bg-generic             var(--ds-bg-primary-medium)
  --ds-chip-root-bg-selected            var(--ds-bg-primary)
  --ds-chip-root-bg-disabled            var(--ds-bg-disabled)
  --ds-chip-root-opacity-pressed        var(--ds-opacity-pressed)
  --ds-chip-root-bgmix-hover            var(--ds-opacity-hover-default)
  --ds-chip-root-bgmix-hover-selected   var(--ds-opacity-hover-inverse)
  --ds-chip-root-border-color-generic   var(--ds-borderColor-default)
  --ds-chip-root-border-color-focus-inner var(--ds-borderColor-focus-inner)
  --ds-chip-root-border-color-focus-outer var(--ds-borderColor-focus-outer)
  --ds-chip-root-border-width-generic   var(--ds-border-width-sm)
  --ds-chip-root-border-width-focus     var(--ds-border-width-lg)
  --ds-chip-root-border-radius-generic  var(--ds-border-radius-md)
  --ds-chip-root-gap-generic            var(--ds-spacing-xs)
  --ds-chip-root-padding-hor-generic    var(--ds-spacing-md)
  --ds-chip-root-padding-ver-generic    var(--ds-spacing-xs)

chip/all/label:
  --ds-chip-label-fg-generic            var(--ds-fg-label-default)
  --ds-chip-label-fg-selected           var(--ds-fg-label-inverse)
  --ds-chip-label-fg-disabled           var(--ds-fg-label-disabled)
  --ds-chip-label-font-size             var(--ds-fontSize-label-md)

chip/all/icon:
  --ds-chip-icon-fg-generic             var(--ds-fg-icon-primary)
  --ds-chip-icon-fg-selected            var(--ds-fg-icon-inverse)
  --ds-chip-icon-fg-disabled            var(--ds-fg-icon-disabled)
  --ds-chip-icon-size-generic           var(--ds-sizing-xs)

chip/chipFilter/all/:
  --ds-chip-filter-label-font-weight    var(--ds-font-weight-bold)
  --ds-chip-filter-label-padding-left   var(--ds-spacing-xs)
  --ds-chip-filter-label-padding-right  var(--ds-spacing-2xs)
  --ds-chip-filter-valuetext-padding-hor var(--ds-spacing-xs)

chip/chipInput/all/:
  --ds-chip-input-valuetext-padding-hor var(--ds-spacing-xs)
```

**Notas de implementación:**
- **bgMix hover overlay:** pseudo-elemento `::before` con `border-radius: inherit` y `background: var(--ds-chip-root-bgmix-hover)` en `:hover`. Seleccionado usa `--bgmix-hover-selected`. Mismo patrón que Button, Link, CTALink.
- **Focus ring doble:** `outline` (outer, negro) + `box-shadow: 0 0 0 ...` (inner, blanco) via `:focus-visible`. Los botones X usan `box-shadow: inset 0 0 0 ...` para el inner ring.
- **ChipInput — dual focus target via `:has()`:** `.ds-chip-input:has(.ds-chip-input__body:focus-visible)` aplica el outer ring al wrapper completo; `.ds-chip-input:has(.ds-chip-input__remove:hover/focus-visible)` aplica `box-shadow: 0 0 0 1px` (borde genérico) al wrapper. Cada botón maneja su propio inner ring.
- **ChipInput body dinámico:** si `onChipClick` se pasa, el body es `<button>`; si no, `<span>` no interactivo.
- **Iconos Lucide via CSS:** los SVG se dimensionan con `.ds-chip-* svg { width/height: var(--ds-chip-icon-size-generic) }` — sin prop `size=` en JSX.
- **Choice + Filter Selectable:** misma estructura JSX (`ds-chip-toggle`), diferenciados solo por semántica en la prop `type`.
- `forwardRef` expuesto. Controlado/no controlado via `selected` / `defaultSelected`.

### Familia Input ✅ (6 tipos)

6 átomos independientes en `src/components/`. Tokens: `tokens/Component/Mode 1.tokens.json`, grupo `Input/`.

**Estados comunes a todos (InputCommon):**
generic/enabled · error · disabled · focus (doble anillo blanco+negro) · helper text · validation message

#### InputText ✅ v1

texto simple, iconLeft opcional (subtle/primary/disabled), iconRight opcional.

#### InputTelephone ✅ v1

```jsx
<InputTelephone
  label
  helperText
  errorMessage
  state          = "default" | "error" | "disabled"
  countryVariant = "selectable" | "fixed"   // default: selectable
  flagEmoji      = "🇪🇸"
  countryCode    = "+34"
  onCountryClick = {fn}                     // abre el Country Picker (componente separado)
  value
  onChange
  placeholder    = "600 000 000"
  fullWidth      = {false}
  id
  name
/>
```

Estructura: Label → Helper → [CountryField | Divider teal | PhoneField] → ValidationMessage.
Sin validación de formato — el estado error lo gestiona el padre.
`autoComplete="tel-national"` en el campo de número.
Country Picker (Advanced List Item) es componente separado — fuera del scope de este átomo.

#### InputAmount ✅ v1.0

```jsx
<InputAmount
  label
  ariaLabel
  helperText
  errorMessage
  state           = "default" | "error" | "disabled"
  currencyVariant = "selectable" | "fixed"   // default: selectable
  currency        = "EUR"
  onCurrencyClick = {fn}                     // abre el Currency Picker (componente separado)
  locale          = "es-ES"                  // usado por Intl.NumberFormat para el placeholder
  value
  defaultValue
  onChange
  fullWidth       = {false}
  id
  name
  onFocus
  onBlur
/>
```

Estructura: Label → Helper → [CurrencyField | AmountField] → ValidationMessage.
Sin prop `placeholder` explícita — se genera automáticamente vía `Intl.NumberFormat(locale)`
para mostrar el formato decimal correcto según el locale.
Currency Picker (selector de moneda) es componente separado — fuera del scope de este átomo,
mismo patrón que el Country Picker de InputTelephone.

#### InputDate ✅ v1

iconRight fijo (calendario).

#### InputDropdown ✅ v1

iconRight fijo (chevron).

#### InputStepper ✅ v1

iconLeft + iconRight (botones −/+).

#### Tokens InputCommon + específicos

Ver diagrama completo en sección 4 — Patrón "Common + específico".

#### Auditoría Input family (22/06/2026)

Cero violaciones: todos consumen exclusivamente `--ds-input-*` (InputCommon + específicos por tipo),
sin hex hardcodeados ni referencias directas a tokens de Mode o Base. Confirma el patrón
"Common + específico" como válido para escalar a futuras familias (Selectors, Chips).

### LinkList.jsx ✅ v1.0

```jsx
// Wrapper semántico nav → ul[role="list"] → li → Link
<LinkList
  items     = {[
    { label: 'Inicio',   href: '/' },
    { label: 'Clientes', href: '/clientes', variant: 'accent' },
    { label: 'Informes', href: '/informes', emphasis: 'medium' },
    { label: 'Ayuda',    href: 'https://help.example.com', external: true },
  ]}
  title     = ""              // opcional — renderiza <h2> antes de la lista
  gap       = "sm" | "md" | "lg"  // default: md
  ariaLabel = "Navegación"
  fullWidth = {false}
/>
```

Items API (todos opcionales salvo `label`):
`label · href · variant · size · emphasis · leftIcon · rightIcon · external · onClick · ariaLabel`

Defaults de icono por item: `leftIcon ?? true` · `rightIcon ?? true`

CSS — solo gap entre items:
```
gap sm → var(--ds-spacing-xs)
gap md → var(--ds-spacing-md)
gap lg → var(--ds-spacing-xl)
```

**Sin tokens Component propios.** Solo consume tokens de Device (spacing) via `var()`.
`injectStyles()`. Cero hardcodes.

### ButtonBar.jsx ✅ (Capa 2 — organisms/)

```jsx
<ButtonBar
  variant          = "complex" | "simple" | "form" | "detail"
  size             = "sm" | "md" | "lg"
  primaryLabel     = "Aceptar y continuar"
  onPrimary        = {fn}
  primaryIcon      = "ArrowRight"
  secondaryLabel   = ""
  onSecondary      = {fn}
  cancelLabel      = "Cancelar"
  onCancel         = {fn}
  negativeActions  = [{label, onClick, icon?}]   // SIEMPRE izquierda
  extraSecondary   = [{label, onClick, icon?}]   // solo complex
  onPrev           = {fn}
  prevDisabled     = {false}
  nextIsConfirm    = {false}
/>
```

## 9. Próximos componentes

*(sin pendientes documentados — añadir aquí el siguiente componente cuando se planifique)*

## 10. Figma MCP

Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: `claude mcp remove figma` (el OAuth se reactiva solo).
`use_figma` requiere Figma desktop abierto. Soporta read/write de variables.
SIEMPRE leer `/mnt/skills/plugins/figma:figma-use/SKILL.md` antes de usar `use_figma`.
Para tareas grandes en Figma (renombrar/reestructurar muchos tokens), pedir confirmación
después de cada componente — no avanzar en cadena sin verificación visual.

## 11. Deuda técnica

- **Country Picker / Advanced List Item** (InputTelephone) — el focus-inner está en teal en
  vez de blanco. Alcance sin investigar todavía. NO bloqueante para el código de InputTelephone.
