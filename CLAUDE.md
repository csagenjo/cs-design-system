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
  components/
    Button.jsx      ✅ átomo DS v2
    ButtonBar.jsx   ✅ organismo DS v2
    Input.jsx       ✅ todos los estados, forwardRef, aria
    Checkbox.jsx    ✅ DS v2, indeterminate, aria-checked=mixed
    Link.jsx        ✅ variantes default/accent, --ds-link-* tokens
    LinkList.jsx    ✅ wrapper semántico sobre Link
  tokens.css        ✅ fuente de verdad de tokens
  main.jsx          importa tokens.css
  App.jsx           banco de pruebas temporal (se sobrescribe)
docs/
  architecture.md
```

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

## Arquitectura de tokens — 5 capas (cascada)

```
Base tokens (160)
  Paleta raw. Solo hex. Sin aliases.
  Grupos: color/primary, color/secondary, color/tertiary,
          color/neutral, color/black, color/white,
          color/error, color/warning, color/success, color/info
  Convenio: color/{grupo}/{paso}  ej: color/primary/700 = #286371

      ↓ referencia Base

Theme (869) — 7 modos: Overall(Retail), Wholesale, Youth, Business, Private, Wireframe, Legacy
  Mapea Base a roles semánticos POR TEMA.
  Cada token tiene sufijo de modo UI: -light / -dark
  Convenio: {rol}-{uiMode}  ej: fg/icon/primary-light → color/primary/700
  IMPORTANTE: -light/-dark aquí son los dos valores posibles,
  NO el modo UI activo — eso lo resuelve Mode.

      ↓ referencia Theme

Mode (348) — 2 modos: Light, Dark
  Resuelve qué valor de Theme usar según modo UI activo.
  SIN sufijo de modo — tokens semánticos puros.
  Convenio: {rol}  ej: fg/icon/primary
    Light → Theme/fg/icon/primary-light
    Dark  → Theme/fg/icon/primary-dark
  ESTE es el layer que referencian los Component tokens.

      ↓ referencia Mode

Component tokens (1038) — 1 modo: Mode 1
  Tokens por componente. Referencian SOLO Mode.
  Convenio: {componente}/{dispositivo}/{parte}/{propiedad}/{estado}
  ej: link/all/icon/fg/default-generic → Mode/fg/icon/default

Device (79) — capa paralela, no de color
  Tipografía y tamaños. No interviene en la cascada de color.
```

**Regla de oro:** Component → Mode → Theme → Base. Saltar capas rompe dark mode y multi-tema.

## Roles semánticos en Mode — fg/icon

```
fg/icon/default    → negro/blanco según modo
fg/icon/subtle     → gris medio
fg/icon/primary    → teal #286371 (light) / #4BA9C0 (dark)
fg/icon/secondary  → pink #B71B60 (light) / #FEF6F9 (dark)
fg/icon/tertiary   → lavanda #B185C5 (light) / #F6F1F8 (dark)
fg/icon/inverse    → blanco/negro según modo
fg/icon/onColor    → blanco (sobre fondos de color)
fg/icon/info       → azul informativo
fg/icon/success    → verde
fg/icon/warning    → ámbar oscuro
fg/icon/error      → rojo
fg/icon/disabled   → gris desactivado
```

## Tokens clave en tokens.css

```css
--ds-color-primary-500: #4BA9C0   /* teal claro — color de marca */
--ds-color-primary-700: #286371   /* teal oscuro — texto accent */
--ds-button-radius: 80px          /* pill shape */
--ds-bg-default: #FFFFFF
--ds-fg-default: #050506
--ds-borderColor-subtle: #D8DBDE
```

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

## ButtonBar.jsx — API

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
  negativeActions  = [{label, onClick, icon?}]
  extraSecondary   = [{label, onClick, icon?}]
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

Estado actual de tokens Link en Figma (Component layer):

**link/all/label/fg:**
- default-generic → fg/label/default (negro)
- accent-generic  → fg/label/primary (teal #286371) ✅
- accent-visited  → fg/label/tertiary (lavanda) ✅

**link/all/label/borderBottomColor:**
- default-generic  → borderColor/primary (#286371)
- accent-generic   → borderColor/primary-light (#4BA9C0)
- default-visited  → borderColor/tertiary (lavanda)
- monochrome-generic → borderColor/emphasis (casi negro)
- inverse          → borderColor/inverse (blanco)

**link/all/icon/fg:**
- default-generic → fg/icon/default (negro) ← PENDIENTE revisar
- accent-generic  → fg/icon/secondary (pink) ← INCONSISTENTE con label accent (teal)
- accent-visited  → fg/icon/tertiary (lavanda) ✅

## LinkList.jsx — API

```jsx
<LinkList
  items     = [{label, href, variant, size, emphasis, external, onClick, ariaLabel, disabled}]
  title     = ""       // opcional, heading de la lista
  gap       = "sm" | "md" | "lg"   // default: md
  ariaLabel = ""
/>
```

## Workflow de componentes

```
1. EXPLORE en Claude Code (Figma MCP, leer el componente en Figma)
2. PLAN en Claude Code (no code yet)
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
```

## Próximos componentes

1. CTALink.jsx — 3 emphasis (low/medium/high) · 2 variantes (default/accent) · icono ChevronRight siempre bold lg
2. Radio.jsx
3. Chip.jsx

## Figma MCP

Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: `claude mcp remove figma` (el OAuth se reactiva solo).
`use_figma` requiere Figma desktop abierto. Soporta read/write de variables.
SIEMPRE leer `/mnt/skills/plugins/figma:figma-use/SKILL.md` antes de usar `use_figma`.

## Arquitectura (dos capas)

CAPA 1 — DS csagenjo · átomos · /src/components/
CAPA 2 — UIKit Plataforma · 24 organismos + 5 layouts · pendiente migrar

Regla: nunca saltarse capas. ButtonBar importa Button, no reimplementa.
