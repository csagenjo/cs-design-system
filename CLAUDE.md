# CLAUDE.md — CS Design System
# Leído automáticamente por Claude Code al iniciar cada sesión.

## Qué es este proyecto

Librería personal de componentes React basada en un design system de banca (alias: Sistema Origen).
Completamente limpia de IP. Conectada con Figma CS Design System (csagenjo).
Caso de uso: UIKit para apps internas de back-office (alias: La Plataforma).

Repo: https://github.com/csagenjo/cs-design-system
Figma: https://www.figma.com/design/QiWDJdMPB5pfY3vHy9CqZv/CS---Design-System

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
  tokens.css        ✅ fuente de verdad de tokens
  main.jsx          importa tokens.css
  App.jsx           banco de pruebas temporal (se sobrescribe)
docs/
  architecture.md
```

## Reglas críticas — NO hacer nunca

- NUNCA usar hex hardcodeados en componentes — solo `var(--ds-*)`
- NUNCA referenciar colores del sistema origen (naranja #FF6200, etc.)
- NUNCA usar prefijo `.oj-` en CSS — usar `.ds-`
- NUNCA editar `package-lock.json` a mano — regenerar con `npm install`
- NUNCA acumular imports en App.jsx — es banco de pruebas, se sobrescribe
- NUNCA usar nombres reales de sistemas externos — solo los aliases definidos a continuación

## Aliases (usar siempre en código y comentarios)

Estos son los nombres canónicos del proyecto. No uses ningún otro término:

- **La Empresa** — la organización de origen
- **Sistema Origen** — el design system de referencia  
- **La Plataforma** — la aplicación back-office de caso de uso
- **UIKit Plataforma** — el UIKit de componentes de La Plataforma

## Tokens

Archivo: `src/tokens.css`
Prefijo: `--ds-*`
Generado desde exports de Figma CS Design System.

Tokens clave:
```css
--ds-color-primary-500: #4BA9C0   /* teal — color de marca */
--ds-color-primary-700: #286371   /* teal oscuro — texto */
--ds-button-bg-accent-filled: #4BA9C0
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
  outline  = {false}                      // borde sin relleno
  iconLeft = "Search"                     // nombre Lucide / PascalCase
  iconRight= "ArrowRight"
  iconOnly = {false}
  floating = {false}                      // sombra (barras fijas)
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

Migración desde v1 (Sistema Origen):
- filled   → variant="accent"
- outline  → variant="accent" outline
- sticky   → variant="accent" floating
- text     → variant="ghost"
- nav      → variant="default" outline
- negative → variant="negative"

Iconos disponibles (lucide-react, misma nomenclatura que DS):
Search, ChevronRight/Left/Up/Down, ArrowRight/Left/Up/Down,
Copy, Save, Delete, Edit2, Filter, Download, Upload,
Percent, Coins, Wallet, CreditCard, Check, X, Plus

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
  onPrev           = {fn}                        // solo complex
  prevDisabled     = {false}
  nextIsConfirm    = {false}                     // cambia label a "Confirmar"
/>
```

Reglas de layout:
- Negativos → SIEMPRE a la izquierda
- Cancelar → variant="ghost"
- Navegación (Anterior) → variant="default" outline
- CTA principal → variant="accent"
- ButtonBar siempre al pie, fuera del scroll de datos
- CSS class: `.ds-btn-bar` (no `.po-btn-bar`)

## Convención de commits

```
Add [ComponentName] using --ds-* tokens
Update [ComponentName]: descripción del cambio
Fix [ComponentName]: descripción del fix
```

## Estado actual

✅✅ tokens.css — paleta + tipografía completa
✅ Button.jsx — DS v2, pill shape, Lucide icons
✅ ButtonBar.jsx — DS v2, variantes correctas
✅ Input.jsx — todos los estados, forwardRef, aria completo
✅ Checkbox.jsx — DS v2, indeterminate, aria-checked=mixed
✅ 2 commits en GitHub, historial limpio

🔄 Siguiente: Radio o Link


## Arquitectura (dos capas)

CAPA 1 — DS csagenjo · átomos · /src/components/
CAPA 2 — UIKit Plataforma · 24 organismos + 5 layouts · pendiente migrar

Regla: nunca saltarse capas.
ButtonBar.jsx importa Button.jsx — no reimplementa el botón.

## Figma MCP (pendiente configurar en Claude Code)

## Figma MCP
Usar siempre claude.ai Figma (OAuth) — nunca añadir manualmente.
Si falla: claude mcp remove figma (el OAuth se activa solo).