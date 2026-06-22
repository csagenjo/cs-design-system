# CLAUDE.md — CS Design System
# Leído automáticamente por Claude Code al iniciar cada sesión.

## Qué es este proyecto

Librería personal de componentes React basada en un design system de banca (alias: Sistema Origen).
Completamente limpia de IP. Conectada con Figma CS Design System (csagenjo).
Caso de uso: UIKit para apps internas de back-office (alias: La Plataforma).

Repo: https://github.com/csagenjo/cs-design-system

## Stack

Node.js v24.16.0 · Vite · React · lucide-react (iconos)
Servidor local: http://localhost:5173/
Comando dev: npm run dev

## Estructura

```
src/
  components/        ← Capa 1: DS csagenjo — SOLO átomos puros
    Button.jsx        ✅ átomo DS v2
    Input.jsx          🔄 a rehacer — ver sección Input más abajo
    Checkbox.jsx       🔄 DS v2, indeterminate, aria-checked=mixed — refactor de tokens en progreso (ver sección Checkbox)
    Link.jsx           ✅ variantes default/accent, tokens teal
    LinkList.jsx       ✅ wrapper semántico nav/ul/li sobre Link
    CTALink.jsx        ✅ v2.0 — 24 variantes, 4 estados, borderRadius por énfasis
    InputText.jsx      ✅ v1 — texto, iconos izq/der, adaptive
    InputDate.jsx      ✅ v1
    InputDropdown.jsx  ✅ v1
    InputStepper.jsx   ✅ v1
    InputTelephone.jsx ✅ v1 — selectable/fixed, doble campo, divider teal
    InputAmount.jsx    ✅ v1.0 — selectable/fixed, doble campo, formato de número locale-aware
  organisms/          ← Capa 2: UIKit Plataforma — ButtonBar y futuros organismos
    ButtonBar.jsx      ✅ movido aquí (antes vivía mal ubicado en components/)
  tokens.css          ✅ fuente de verdad — pendiente añadir tokens de Input
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

**IMPORTANTE — regla de capas:** `src/components/` es SOLO para átomos de Capa 1 (DS csagenjo). Cualquier organismo o componente compuesto pensado para La Plataforma va en `src/organisms/`. No mezclar.

## Aliases — usar SIEMPRE, nunca los nombres reales

- **La Empresa** — la organización de origen
- **Sistema Origen** — el design system de referencia
- **La Plataforma** — la aplicación back-office de caso de uso
- **UIKit Plataforma** — el UIKit de componentes de La Plataforma

## Reglas críticas — NO hacer nunca

- NUNCA usar hex hardcodeados en componentes — solo `var(--ds-*)`
- NUNCA referenciar colores del Sistema Origen
- NUNCA usar prefijo `.oj-` en CSS — usar `.ds-`
- NUNCA editar `package-lock.json` a mano
- NUNCA acumular imports en App.jsx — es banco de pruebas, se sobrescribe
- NUNCA usar nombres reales en código, commits ni docs — solo los aliases de arriba
- NUNCA saltar capas en la cascada de tokens (Component → Mode → Theme → Base)
- NUNCA mezclar átomos (components/) con organismos (organisms/)

## Arquitectura de tokens — 5 capas (cascada)

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
  compartido — ver sección Input más abajo como referencia del patrón.

Device (79) — capa paralela, no de color
  Tipografía y espaciados. Mobile / Desk / Generic.
```

**Regla de oro:** Component → Mode → Theme → Base. Saltar capas rompe dark mode y multi-tema.

**Sufijos -light/-dark en Theme:** son los dos valores posibles (light/dark mode), NO intensidad.
**Sufijos -subtle/-medium/-bold en Mode:** indican intensidad (renombrados de -light/-medium/-bold en Jun 2026).

**Consolidado (22/06/2026):** el código de cada componente debe consumir EXCLUSIVAMENTE
tokens de Component (`--ds-{componente}-*`, ej. `--ds-input-*`, `--ds-checkbox-*`) — nunca
`var(--ds-fg-*)`, `--ds-bg-*`, `--ds-borderColor-*` (Mode) ni `--ds-color-*` (Base) directamente
desde un `.jsx`. La familia Input ya cumple esto en su totalidad (ver auditoría más abajo).
Excepción detectada: `Checkbox.jsx` todavía referencia tokens de Mode (`--ds-bg-primary`,
`--ds-borderColor-subtle`, `--ds-fg-subtle`...) y de Base (`--ds-color-primary-50`) en su CSS,
a pesar de que los tokens `--ds-checkbox-*` ya existen en `tokens.css` — pendiente de migrar
(ver sección Checkbox).

## Decisión de sistema — accent color

`accent` = teal en TODOS los componentes (Button, CTALink, Checkbox, Link, Input...).
Secondary/pink = rol de datos e información, no de navegación/acción.

## Patrón de tokens "Common + específico" (establecido con la familia Input)

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
    InputStepper/                   ← iconLeft, iconRight (botones −/+)
```

Aplicar este mismo patrón ("Common" + específicos) a futuras familias de componentes con estructura compartida (ej. si se construye una familia de Selectors o Chips).

## Button.jsx — API

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

## organisms/ButtonBar.jsx — API (Capa 2, UIKit Plataforma)

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

## Link.jsx — API ✅ v2.0

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

Tokens de color Link (arquitectura v2 — alineada con Figma link/all/):
- `--ds-link-fg-label-default` / `accent` / `accent-visited`
- `--ds-link-fg-icon-default` / `accent` / `visited`
- `--ds-link-border-bottom-default` (#2C2F34 negro) / `accent` (#286371) / `visited` (#B185C5)
- `--ds-link-bg-mix-hover` rgba(5,5,6,0.1)
- `--ds-link-opacity-pressed` 0.8
- Active: opacity 0.8 + SemiBold

## LinkList.jsx — API

```jsx
<LinkList
  items     = [{label, href, variant, size, emphasis, external, onClick, ariaLabel, disabled}]
  title     = ""       // opcional
  gap       = "sm" | "md" | "lg"   // default: md
  ariaLabel = ""
/>
```

Semántica: `<nav>` → `<ul role="list">` → `<li>` → `<Link>`.

## CTALink.jsx — API ✅ completado v2.0

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

Tokens en tokens.css:
```css
--ds-cta-link-fg-default              #050506
--ds-cta-link-fg-primary              #FFFFFF
--ds-cta-link-fg-accent               #286371
--ds-cta-link-fg-accent-primary       #FFFFFF
--ds-cta-link-bg-primary              #050506
--ds-cta-link-bg-accent-primary       #4BA9C0
--ds-cta-link-bg-mix-hover            rgba(5,5,6,0.1)
--ds-cta-link-border-secondary        #2C2F34
--ds-cta-link-border-accent-secondary #286371
--ds-cta-link-border-bottom-default   #2C2F34
--ds-cta-link-border-bottom-accent    #286371
--ds-cta-link-focus-inner             #FFFFFF
--ds-cta-link-focus-outer             #050506
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

## Input — familia completa ✅ código React completo

Estado: tokens de Figma 100% listos y auditados (Component tokens, grupo `Input/`).
Código React: los 6 tipos están construidos (InputText, InputDate, InputDropdown,
InputStepper, InputTelephone, InputAmount). El `Input.jsx` genérico de la sesión anterior
queda obsoleto frente a estos átomos independientes.

### Tipos construidos

1. **InputText** ✅ — texto simple, iconLeft opcional (subtle/primary/disabled), iconRight opcional
2. **InputTelephone** ✅ — dos sub-campos (country selector + número), variantes Selectable/Fixed, divider entre campos
   - Focus rings construidos en Figma (doble anillo blanco+negro) ✅
   - Deuda: Country Picker (Advanced List Item) tiene focus-inner en teal en vez de blanco — alcance sin investigar, NO bloqueante (ver Deuda técnica)
3. **InputAmount** ✅ — mismo patrón dual que Telephone (amountField + currencyField), formato numérico locale-aware vía `Intl.NumberFormat`
4. **InputDate** ✅ — iconRight fijo (calendario)
5. **InputDropdown** ✅ — iconRight fijo (chevron)
6. **InputStepper** ✅ — iconLeft + iconRight (botones −/+)

### Decisión pendiente de arquitectura de código

¿Un componente por tipo (`InputText.jsx`, `InputTelephone.jsx`...) con lógica común compartida vía hook/wrapper, o un solo `Input.jsx` con prop `type`? Evaluar en la fase PLAN antes de codear — ver `src/components/` ya sigue el patrón de átomos separados (Button, Link, CTALink son componentes independientes, no uno genérico con prop `type`), así que lo más consistente es Opción A (un componente por tipo).

### Estados comunes a todos (InputCommon)

generic/enabled · error · disabled · focus (doble anillo blanco+negro) · helper text · validation message

## Workflow de componentes

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

## InputTelephone.jsx — API ✅ completado

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

## InputAmount.jsx — API ✅ completado v1.0

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
para mostrar el formato decimal correcto según el locale. Sin prop `variant` ni `validation`
genéricas — el estado de error se controla con `state="error"` + `errorMessage`, igual que en
el resto de la familia Input.
Currency Picker (selector de moneda) es componente separado — fuera del scope de este átomo,
mismo patrón que el Country Picker de InputTelephone.

## Auditoría Input family (22/06/2026)

InputText, InputDropdown, InputDate, InputTelephone, InputAmount e InputStepper pasaron
auditoría de tokens con **cero violaciones**: todos consumen exclusivamente
`--ds-input-*` (InputCommon + específicos por tipo), sin hex hardcodeados ni referencias
directas a tokens de Mode o Base. Confirma el patrón "Common + específico" como válido
para escalar a futuras familias (Selectors, Chips).

## Checkbox.jsx — estado (22/06/2026) 🔄 refactor en progreso

Figma: limpio y auditado — 23 tokens en Component tokens (`--ds-checkbox-*` en `tokens.css`):
bg (default/selected/hover/disabled/error), border (default/selected/hover/disabled/error),
focus (inner/outer), icon (fg/disabled), label (fg/disabled), description, validation,
geometría (size, borderRadius, borderWidth, labelGap).
Código: `Checkbox.jsx` aún NO usa estos tokens — su CSS sigue referenciando tokens de Mode
(`--ds-bg-primary`, `--ds-borderColor-subtle`, `--ds-borderColor-primary`, `--ds-fg-subtle`,
`--ds-fg-error`...) y de Base (`--ds-color-primary-50`) directamente. Pendiente: migrar
`Checkbox.jsx` para que consuma únicamente `--ds-checkbox-*` (ver Deuda técnica).

## Próximos componentes

1. **Radio.jsx**
2. **Chip.jsx**

## Figma MCP

Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: `claude mcp remove figma` (el OAuth se reactiva solo).
`use_figma` requiere Figma desktop abierto. Soporta read/write de variables.
SIEMPRE leer `/mnt/skills/plugins/figma:figma-use/SKILL.md` antes de usar `use_figma`.
Para tareas grandes en Figma (renombrar/reestructurar muchos tokens), pedir confirmación
después de cada componente — no avanzar en cadena sin verificación visual.

## Deuda técnica

- **Country Picker / Advanced List Item** (InputTelephone) — el focus-inner está en teal en
  vez de blanco. Alcance sin investigar todavía. NO bloqueante para el código de InputTelephone.
- **Checkbox.jsx** — refactor de tokens pendiente de aplicar al código. Los tokens
  `--ds-checkbox-*` ya existen en `tokens.css` y Figma está auditado (23 tokens), pero el
  componente sigue leyendo tokens de Mode/Base directamente (ver sección Checkbox).

## Arquitectura (dos capas)

```
CAPA 1 — DS csagenjo · átomos puros · /src/components/
  Button, Link, CTALink, LinkList ✅ · Input (familia, 6 tipos) ✅ auditada 22/06/2026
  Checkbox 🔄 (refactor de tokens en progreso)

CAPA 2 — UIKit Plataforma · organismos · /src/organisms/
  ButtonBar ✅ (movido desde components/ — Jun 2026)
  24 organismos totales + 5 layouts — pendiente migrar el resto
```

Regla: nunca saltarse capas. Los organismos importan átomos, no reimplementan su lógica.