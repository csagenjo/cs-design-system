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
    Link.jsx        ✅ variantes default/accent, tokens teal
    LinkList.jsx    ✅ wrapper semántico nav/ul/li sobre Link
    CTALink.jsx     ✅ énfasis low/medium/high, variantes default/accent, tokens teal
  tokens.css        ✅ fuente de verdad — 532 líneas
  main.jsx
  App.jsx           banco de pruebas (se sobrescribe cada sesión)
tokens/
  Base/             ✅ Mode 1.tokens.json
  Theme/            ✅ Retail + Youth + 5 más
  Mode/             ✅ Light.tokens.json + Dark.tokens.json
  Component/        ✅ Mode 1.tokens.json
  Device/           ✅ Mobile + Desk + Generic
docs/
  token-architecture.md  ✅ arquitectura completa
CLAUDE.md
README.md
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
Base (157) — paleta raw, solo hex, el código NUNCA los usa directamente

      ↓ referencia Base

Theme (873) — 7 temas: Retail ✅ · Youth ✅ · Wholesale ⚠️ · Business ⚠️ · Private ⚠️ · Wireframe ⚠️ · Legacy ⚠️
  Mapea Base a roles semánticos POR TEMA.
  Convenio: {rol}-light / {rol}-dark  (dos valores posibles para Mode)
  El código NUNCA los usa directamente.

      ↓ referencia Theme

Mode (364) — 2 modos: Light / Dark
  Resuelve qué valor de Theme usar según modo UI activo.
  SIN sufijo de modo — tokens semánticos puros.
  ESTE es el layer que usa el código → var(--ds-fg-primary)

      ↓ referencia Mode

Component (1038) — tokens por componente, referencian SOLO Mode
  Convenio: {componente}/{dispositivo}/{parte}/{propiedad}/{estado}

Device (79) — capa paralela, no de color
  Tipografía y espaciados. Mobile / Desk / Generic.
```

**Regla de oro:** Component → Mode → Theme → Base. Saltar capas rompe dark mode y multi-tema.

**Sufijos -light/-dark en Theme:** son los dos valores posibles (light/dark mode), NO intensidad.
**Sufijos -subtle/-medium/-bold en Mode:** indican intensidad (renombrados de -light/-medium/-bold en Jun 2026).

## Decisión de sistema — accent color

`accent` = teal en TODOS los componentes (Button, CTALink, Checkbox, Link...).
Secondary/pink = rol de datos e información, no de navegación/acción.

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
- default: texto negro, underline teal `#286371`, icono negro
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

## CTALink.jsx — API (próximo componente)

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

Sizing: padding 6px 12px · borderRadius 80px · borderWidth 1px · gap 6px · focus borderWidth 2px
Sin icono. Sin prop size. Talla única.

| Emphasis | Visual | Default | Accent |
|---|---|---|---|
| low | texto + underline | negro + underline #2C2F34 | teal + underline #286371 |
| medium | pill outline | borde #2C2F34 | borde #286371 |
| high | pill filled | fondo negro, texto blanco | fondo #4BA9C0, texto blanco |

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

1. Radio.jsx
2. Chip.jsx

## Figma MCP

Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: `claude mcp remove figma` (el OAuth se reactiva solo).
`use_figma` requiere Figma desktop abierto. Soporta read/write de variables.
SIEMPRE leer `/mnt/skills/plugins/figma:figma-use/SKILL.md` antes de usar `use_figma`.

## Arquitectura (dos capas)

CAPA 1 — DS csagenjo · átomos · /src/components/
CAPA 2 — UIKit Plataforma · 24 organismos + 5 layouts · pendiente migrar

Regla: nunca saltarse capas. ButtonBar importa Button, no reimplementa.
