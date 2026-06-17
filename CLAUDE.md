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
    Checkbox.jsx       ✅ DS v2, indeterminate, aria-checked=mixed
    Link.jsx           ✅ variantes default/accent, tokens teal
    LinkList.jsx       ✅ wrapper semántico nav/ul/li sobre Link
    CTALink.jsx        ✅ emphasis low/medium/high, variantes default/accent
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

## Link.jsx — API

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

Tokens de color Link (post-auditoría Jun 2026):
- default: texto negro, underline teal `#286371`, icono teal `#286371`
- accent: texto teal `#286371`, underline teal claro `#4BA9C0`, icono teal
- visited: texto lavanda, underline lavanda
- hover: overlay `rgba(5,5,6,0.1)`

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

## CTALink.jsx — API ✅ completado

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

Tokens disponibles en tokens.css:
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
```

Sin icono. Sin prop size. Talla única. 6 combinaciones (emphasis × variant) funcionando, hover via mix-token, disabled con aria-disabled + tabIndex -1, focus ring doble.

## Input — familia completa 🔄 EN CONSTRUCCIÓN

Estado: tokens de Figma 100% listos y auditados (Component tokens, grupo `Input/`).
Código React: pendiente — el `Input.jsx` actual es de una sesión anterior y necesita rehacerse
con la nueva estructura de tokens (ver patrón "Common + específico" arriba).

### Tipos a construir

1. **InputText** — texto simple, iconLeft opcional (subtle/primary/disabled), iconRight opcional
2. **InputTelephone** — dos sub-campos (country selector + número), variantes Selectable/Fixed, divider entre campos
   - Focus rings construidos en Figma (doble anillo blanco+negro) ✅
   - Deuda: Country Picker (Advanced List Item) tiene focus-inner en teal en vez de blanco — pendiente investigar alcance antes de tocar, NO es bloqueante para el código
3. **InputAmount** — mismo patrón dual que Telephone (amountField + currencyField)
4. **InputDate** — iconRight fijo (calendario), confirmar si el date picker es parte de este componente
5. **InputDropdown** — iconRight fijo (chevron)
6. **InputStepper** — iconLeft + iconRight (botones −/+)

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

## Próximos componentes

1. **Input (familia completa)** — en progreso, ver sección Input arriba
2. Radio.jsx
3. Chip.jsx

## Figma MCP

Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: `claude mcp remove figma` (el OAuth se reactiva solo).
`use_figma` requiere Figma desktop abierto. Soporta read/write de variables.
SIEMPRE leer `/mnt/skills/plugins/figma:figma-use/SKILL.md` antes de usar `use_figma`.
Para tareas grandes en Figma (renombrar/reestructurar muchos tokens), pedir confirmación
después de cada componente — no avanzar en cadena sin verificación visual.

## Arquitectura (dos capas)

```
CAPA 1 — DS csagenjo · átomos puros · /src/components/
  Button, Link, CTALink, Checkbox, LinkList, Input (familia) ✅/🔄

CAPA 2 — UIKit Plataforma · organismos · /src/organisms/
  ButtonBar ✅ (movido desde components/ — Jun 2026)
  24 organismos totales + 5 layouts — pendiente migrar el resto
```

Regla: nunca saltarse capas. Los organismos importan átomos, no reimplementan su lógica.