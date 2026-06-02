# CS Design System — Documentación del proyecto
**Autora:** Carol Sánchez Agenjo  
**Rol:** Senior UX & Product Designer → Design Engineer  
**Última actualización:** Mayo 2026

---

## 1. Qué es este proyecto y por qué existe

El objetivo es construir  una librería personal de componentes React basada en el sistema Sistema Origen, completamente limpia de IP de La Empresa, conectada con una librería de Figma propia llamada **CS Design System**.

El proyecto tiene dos capas paralelas:

- **Figma:** librería de componentes y tokens de diseño (CS Design System)
- **Código:** librería de componentes React que consume esos tokens (`cs-design-system` en GitHub)

El caso de uso real es **La Plataforma** — la plataforma de back-office de La Empresa para la que se diseñó el UIKit original. El objetivo a largo plazo es un agente que recibe especificaciones de pantallas de operaciones y genera layouts con componentes correctamente ensamblados.

---

## 2. Arquitectura del sistema (dos capas)

```
CAPA 1 — DS csagenjo (Figma) · /src/components/ (React)
  Átomos con marca propia. Variables --ds-*. Sin referencias La Empresa/Sistema Origen.

CAPA 2 — UIKit Plataforma → futuro "UIKit Apps Internas" (Figma)
  24 organismos construidos sobre Capa 1.
  5 layouts construidos sobre organismos.
```

**Regla de oro:** nunca saltarse capas. Los organismos importan átomos. Los layouts usan organismos. `ButtonBar.jsx` importa `Button.jsx` — no reimplementa el botón.

---

## 3. Paleta de marca

| Token | Color | Hex |
|-------|-------|-----|
| Primary | Teal | `#4BA9C0` (500) · texto oscuro: `#286371` (700) |
| Secondary | Pink | `#E02C7C` (500) |
| Tertiary | Lavender | `#B185C5` (500) |
| Neutral | Gris | Escala 50→950 |
| Error | Rojo | `#D53737` (500) |
| Warning | Ámbar | `#FFAE0C` (500) |
| Success | Verde | `#4DBE53` (500) |
| Info | Azul | `#0FA9FD` (500) |

---

## 4. Aprendizajes clave — Arquitectura de tokens en Figma

### Las 5 capas de tokens (sistema La Empresa, replicado en CS)

```
Base tokens → Mode (Light/Dark) → Device (Mobile/Desk) → Theme (Retail/Youth/etc) → Component tokens
```

Los cambios en Base se propagan en cascada si el archivo usa aliases de variables. Los component tokens en el JSON exportado muestran hexes resueltos, pero en Figma sí son referencias.

### Naming convention crítica

En los tokens del Theme, los sufijos `-light` y `-dark` indican el **modo** (light mode / dark mode), NO la intensidad. La intensidad es `light / medium / bold`.

Ejemplo: `bg/secondary-bold-dark` = fondo secondary de énfasis bold en **dark mode**.

### onSurface tokens

Texto/icono colocado ENCIMA de una superficie de color. El color del texto (negro/blanco) depende de la luminosidad del fondo, no del modo. Tras cruzar con component tokens, confirmamos que los 238 onSurface tokens no tienen hex únicos — los componentes no los referencian, son irrelevantes para el trabajo actual.

### bg/shape tokens

Son overlays de interacción (hover/pressed). NO llevan hex de color sino tokens de opacidad:
- `-light` mode → `color/opacity/black/100/150/300`
- `-dark` mode → `color/opacity/white/100/150/300`

### extPrimary / extSecondary / extTertiary

Colores adicionales de marca fuera de la jerarquía principal. En La Empresa, extPrimary era el sun/amber. En CS Design System:
- extPrimary → primary teal
- extSecondary → secondary pink
- extTertiary → tertiary lavender

### Hover states heredados

12 componentes (checkbox, radioButton, tabs, listView, accordion...) usan `#B8E6FE` (info/200) para hover — herencia del sky azul de La Empresa. **Decisión:** mantenerlos azules, no cambiar a primary/100.

### Cruce Theme → Component tokens

Solo 16 theme tokens controlan el 100% de los 1035 component tokens. Los más impactantes:

| Token | Props afectadas |
|-------|----------------|
| `fg/default-light` | 135 |
| `fg/disabled-light` | 110 |
| `fg/primary-light` | 52 |
| `bg/primary-light` | 33 |
| `fg/subtle-dark` | 41 |

---

## 5. Setup técnico — VS Code + Vite + React

### Herramientas instaladas

| Herramienta | Versión | Cómo instalar |
|-------------|---------|---------------|
| Node.js | v24.16.0 | [nodejs.org](https://nodejs.org/) → versión LTS |
| Xcode CLI | 2416 | `xcode-select --install` |
| VS Code | última | [code.visualstudio.com](https://code.visualstudio.com/) |
| Extensión React | — | ES7+ React/Redux de dsznajder |

### Crear el proyecto (referencia, ya hecho)

```bash
npm create vite@latest cs-design-system -- --template react
cd cs-design-system
npm install
npm run dev
```

El proyecto arranca en `http://localhost:5173/`

### Estructura de carpetas

```
cs-design-system/
  src/
    components/
      Button.jsx        ✅ migrado a DS v2
      ButtonBar.jsx     🔄 pendiente migrar
    App.jsx
    App.css
    main.jsx
    index.css
    tokens.css          ✅ generado desde Figma
  package.json
  .gitignore
  vite.config.js
```

### Comandos de referencia rápida

| Comando | Para qué sirve |
|---------|---------------|
| `npm run dev` | Arranca el servidor en localhost:5173 |
| `npm install` | Instala dependencias (tras clonar) |
| `rm package-lock.json && npm install` | Regenera package-lock si se corrompe |
| `Cmd + J` | Abre/cierra terminal en VS Code |
| `Cmd + S` | Guarda archivo |
| `+` en panel terminal | Abre un segundo terminal sin cerrar el servidor |
| `Ctrl + C` | Para el servidor de desarrollo |

### Notas importantes de VS Code

- El `package-lock.json` **nunca se edita a mano** — solo se modifica `package.json` y se regenera con `npm install`
- Los imports en React necesitan extensión `.jsx` explícita: `import ButtonBar from './components/ButtonBar.jsx'`
- `tokens.css` debe estar dentro de `src/`, no en la raíz — Vite lanza error si está fuera
- El punto azul en la pestaña del archivo = cambios sin guardar

### Claude Code
  Instalación: sudo npm install -g @anthropic-ai/claude-code
  Versión: 2.1.159
  Verificar: claude --version
  Arrancar sesión: claude (desde el terminal de VS Code, dentro de la carpeta del proyecto)
  Salir: /exit
  Limpiar contexto: /clear
  Ver MCPs: /mcp

  IMPORTANTE: Claude Code en el terminal de VS Code ≠ Claude Code en Claude desktop.
  El MCP de Figma está configurado para el proyecto local — usar siempre el terminal de VS Code.

### Figma MCP en Claude Code
  Conexión: claude.ai Figma (OAuth, conectado hace 2 meses via claude.ai)
  Herramientas disponibles: 17 tools
  Configuración: no requiere token manual — usa la conexión OAuth de claude.ai
  
  Si aparece conflicto entre figma (local) y claude.ai Figma:
    claude mcp remove figma   ← elimina el local, el OAuth se activa solo
  
  Herramienta principal: get_design_context (confirmar "don't ask again")
  Herramienta fallback:  get_metadata (para estructura/variantes sin screenshot)
---

## 6. tokens.css — Cómo se genera

### Fuente de verdad: exports de Figma

Los tokens se exportan desde Figma en cuatro grupos:

| Archivo | Contenido |
|---------|-----------|
| `Base_tokens.zip` → `Mode 1.tokens.json` | Paleta de colores base (50→950 por escala) |
| `Mode.zip` → `Light.tokens.json` + `Dark.tokens.json` | Tokens semánticos (fg, bg, borderColor) |
| `Component_tokens.zip` → `Mode 1.tokens.json` | Tokens de componentes (button, checkbox, etc.) |
| `Device.zip` → `Mobile/Desk/Generic.tokens.json` | Tokens de tamaño por dispositivo |
| `Theme.zip` → `Overall (Retail).tokens.json` + otros | Temas de marca |

### Estructura del tokens.css generado

```css
:root {
  /* 1. Base color palette  → --ds-color-{group}-{step} */
  /* 2. Semantic tokens     → --ds-fg-* · --ds-bg-* · --ds-borderColor-* */
  /* 3. Component tokens    → --ds-button-* */
  /* 4. Shadows             → --ds-shadow-* */
}
@media (prefers-color-scheme: dark) { /* dark mode override */ }
[data-theme="dark"] { /* dark mode manual toggle */ }
```

### Import en main.jsx

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tokens.css'   // ← debe ir aquí, dentro de src/
import App from './App.jsx'
```

---

## 7. Button.jsx — Migración de Sistema Origen v1 a DS v2

### Qué cambió en el Design System (changelog La Empresa → v2)

| Aspecto | Antes (Sistema Origen v1) | Ahora (DS v2) |
|---------|--------------|---------------|
| Tipos de botón | 6 separados (filled, outline, sticky, text, nav, negative) | Default + Accent (simplificado) |
| Forma | `border-radius: 4px` (redondeado) | `border-radius: 80px` (píldora) |
| Color principal | Naranja `#FF6200` | Teal `#4BA9C0` (tu primary) |
| Padding por estado | Sí | Eliminado en v2 |
| Iconos | Props separadas y camelCase | `iconLeft` / `iconRight` normalizados |
| Nomenclatura | Filled = naranja | Accent = teal |

### Nueva API de Button.jsx

```jsx
<Button
  variant  = "accent" | "default" | "negative" | "ghost"
  size     = "sm" | "md" | "lg"
  outline  = {false}    // borde sin relleno (cualquier variante)
  iconLeft = "arrow-left"
  iconRight= "arrow-right"
  iconOnly = {false}
  floating = {false}    // sombra (reemplaza sticky)
  fullWidth= {false}    // nuevo en DS v2
  disabled = {false}
  loading  = {false}
  onClick  = {fn}
  ariaLabel= ""
  htmlType = "button" | "submit" | "reset"
>
  Texto del botón
</Button>
```

### Guía de migración desde v1

| Tipo v1 | Equivalente v2 |
|---------|---------------|
| `type="filled"` | `variant="accent"` |
| `type="outline"` | `variant="accent" outline` |
| `type="sticky"` | `variant="accent" floating` |
| `type="text"` | `variant="ghost"` |
| `type="nav"` | `variant="default" outline` |
| `type="negative"` | `variant="negative"` |

### Prefijos CSS

```
Antes: .xx-btn  (traza La Empresa/Sistema Origen)
Ahora: .ds-btn  (CS Design System)
```

### Tokens de Button en tokens.css

```css
--ds-button-bg-accent-filled:    #4BA9C0;   /* fondo accent */
--ds-button-bg-default-filled:   #050506;   /* fondo default */
--ds-button-fg-accent-filled:    #FFFFFF;   /* texto sobre accent */
--ds-button-fg-default-outline:  #050506;   /* texto default outline */
--ds-button-fg-accent-outline:   #286371;   /* texto accent outline */
--ds-button-border-default:      #2C2F34;
--ds-button-border-accent:       #286371;
--ds-button-radius:              80px;       /* píldora */
--ds-button-border-width:        2px;
```

### Añadidos icons al Button.jsx 
Iconos: lucide-react (v0.383+)
  - Instalación: npm install lucide-react
  - Nombres: PascalCase o kebab-case (ambos funcionan)
  - Iconos principales: Search, ChevronLeft/Right/Up/Down,
    ArrowLeft/Right, Delete, Edit2, Filter, Download,
    Save, Copy, Coins, Wallet, CreditCard, Percent
  - Sustitución futura: cuando se exporten SVGs propios de Figma,
    solo hay que cambiar los imports en la parte superior de Button.jsx


---

## 8. Organismos y layouts (Capa 2 — UIKit Plataforma)

### Los 24 organismos

| Organismo | Átomo principal | Estado |
|-----------|----------------|--------|
| PO-Buttons line | Button ✅ | ✅ ButtonBar.jsx migrado a DS v2
| PO-Input field | Input | ✅ Input.jsx construido (Text, todos los estados)
| PO-Add input field | Input + Button ✅ | 🔄 por construir |
| PO-Detail Entry | Label | 🔄 por construir |
| PO-Detail Entry with Actions | Label + Button ✅ + Link | 🔄 por construir |
| PO-Dashboard card | Icon + tipografía | 🔄 por construir |
| PO-Cells [micro-organismo] | — | 🔄 por construir |
| PO-Table container | Icon + Checkbox + Button ✅ | 🔄 por construir |
| PO-Filters | Button ✅ + Icon | 🔄 por construir |
| PO-Main Navigation | Button ✅ nav + Icon | 🔄 por construir |
| PO-Breadcrumb | Link + Icon | 🔄 por construir |
| PO-Page title | Tipografía | 🔄 por construir |
| PO-Content group | Tipografía + Link | 🔄 por construir |
| PO-Dropdown | Input + Icon | 🔄 por construir |
| PO-Checkbox group | Checkbox + Label | 🔄 por construir |
| PO-Checkbox select | Checkbox + Label | 🔄 por construir |
| PO-Radio group | Radio + Label | 🔄 por construir |
| PO-Chip choice group | Chip | 🔄 por construir |
| PO-Secondary Navigation | Link + Icon | 🔄 por construir |
| PO-File Upload | Button ✅ + Icon | 🔄 por construir |
| PO-File Upload draggable | Button ✅ + Icon | 🔄 por construir |
| PO-File Upload on Table | Button ✅ + Icon | 🔄 por construir |
| PO-Item Upload | Icon + Label | 🔄 por construir |
| PO-Item Upload on Table | Icon + Checkbox | 🔄 por construir |

### PO-Cells — regla de tabla

PO-Cells es un micro-organismo con tres sub-componentes de posición **fija e intercambiable**:

| Sub-componente | Posición | Uso |
|---------------|----------|-----|
| PO-Cell with Check | SIEMPRE primera columna | Selección de filas |
| PO-Cell with Values / Values for Last | SIEMPRE última columna ("More") | Dato destacado o link |
| PO-Cell with Actions | SIEMPRE última columna ("More") | Menú de acciones por fila |

**Regla:** `[Check] → [Values...] → [Values for Last / Actions]`. Nunca mezclar Actions y Values en la misma columna "More".

### Los 5 layouts

| Layout | Cuándo usarlo |
|--------|--------------|
| Basic — Details | "ver detalle de", "ficha de", "consultar registro" |
| Basic — Forms | "crear", "dar de alta", "editar" (sin pasos) |
| Filter a Report | "filtrar", "informe", "exportar", "reporte" |
| Search for Results | "buscar", "listar", "auditar", "histórico" |
| Step Process | "solicitar", "en pasos", "wizard", "aprobación" |
| Dashboard | "monitorear", "cola de trabajo", "KPIs", "pendientes" |

---

## 9. Git y GitHub

### Configuración inicial (ya hecha)

```bash
git init
echo "node_modules/
dist/
.DS_Store
.env" > .gitignore
git add -A
git commit -m "mensaje"
```

### Conectar con GitHub

```bash
git remote add origin https://github.com/csagenjo/cs-design-system.git
git branch -M main
git push -u origin main
```

Repositorio: [github.com/csagenjo/cs-design-system](https://github.com/csagenjo/cs-design-system)

### Convención de commits

```
Add [ComponentName] using --ds-* tokens
Update [ComponentName]: migrate from Sistema Origen v1 to DS v2
Fix [ComponentName]: resolve token references
```

### Notas importantes

- El `package-lock.json` **nunca se edita a mano** — se regenera con `npm install`
- GitHub no acepta contraseña normal por terminal — usar Personal Access Token
- El primer `git init` cambia los archivos del proyecto a verde en VS Code

---

## 10. Estado actual y próximos pasos

### ✅ Completado

- Setup completo: Node.js, VS Code, Vite, React
- `tokens.css` generado desde los exports reales de Figma CS Design System
- `Button.jsx` migrado a DS v2: píldora, variantes correctas, tokens `--ds-*`, sin hexes hardcodeados
- Primer commit + repositorio en GitHub
- Inventario de los 24 organismos y 5 layouts documentado
- Aprendizajes de arquitectura de tokens Figma documentados
- ButtonBar.jsx migrado a DS v2: variantes, tokens --ds-*, sin hexes
- Iconos Lucide React integrados en Button.jsx
- Limpieza completa de IP: La Empresa/Sistema Origen/La Plataforma reemplazados por aliases
- Convención de commits establecida (funciona como changelog del código)
- 4 commits en GitHub con historial limpio y descriptivo
- Input.jsx construido: todos los estados, tokens semánticos --ds-*, 8.5/10 code review
- Figma MCP configurado en Claude Code y validado con Explore real del Button
- Workflow Explore → Plan → Code → Review → Fix ejecutado por primera vez completo
- Claude Code instalado y operativo en terminal VS Code
- Limpieza completa de IP en el repo (find & replace global en VS Code)
- CLAUDE.md creado en raíz del proyecto

### 🔄 Inmediato — Próxima sesión

- CLAUDE.md — crear en raíz del proyecto
- Configurar Figma MCP en Claude Code
- Renombrar carpeta local: cs-design-toolkit → cs-design-system

### ⏳ Pendiente (orden sugerido por impacto)

- Átomos: Icon, Label, Input, Link, Checkbox, Radio, Chip
- Migrar 24 organismos a DS csagenjo
- Renombrar UIKit Plataforma → UIKit Apps Internas

---

## 11. Reglas del sistema

- Nunca usar hex hardcodeados — solo tokens `--ds-*`
- Nunca referenciar colores La Empresa/Sistema Origen (naranja `#FF6200`, etc.)
- Prefijo CSS: `ds-btn` (no `oj-btn`)
- Tamaño base en operaciones: `md` (40px)
- ButtonBar siempre al pie del contenido, fuera del scroll de datos
- Nomenclatura React: PascalCase (`Button`, `ButtonBar`)
- Antes de publicar: eliminar toda mención a La Empresa, La Plataforma, Sistema Origen, Sistema Origen
- Los commits funcionan como changelog del código: describen qué cambió
  y por qué, igual que el changelog de componentes en Figma
- App.jsx es un banco de pruebas temporal — se sobrescribe en cada sesión,
  no se acumulan imports
- El repo debe estar limpio de nombres reales antes de hacerse público:
  usar siempre los aliases definidos en la tabla de la sección 1

---

## 12. Workflow de construcción de componentes

1. EXPLORE en Claude Code:
   "Read Figma component at [URL]. List variants, states, properties. Don't write code."

2. PLAN en Claude Code:
   "Plan a React [Component].jsx. Show API and CSS structure. No code yet."
   → Responder preguntas abiertas (estrategia de tokens, etc.) antes de continuar

3. CODE en Claude Code:
   "Code"
   → Claude Code escribe el archivo directamente en src/components/

4. REVIEW con GPT u otro revisor:
   → Pegar el código generado y pedir auditoría
   → Identificar issues críticos (🔴) vs mejoras futuras (🟡)

5. FIX en Claude Code:
   "Fix these issues: 1. [...] 2. [...]"

6. COMMIT cuando llega a 8+/10:
   git add src/components/[Componente].jsx
   git commit -m "Add [Componente] with DS v2 tokens..."
   git push

Notas:
- App.jsx es banco de pruebas desechable — sobrescribir en cada sesión
- Semantic tokens si no hay component tokens exportados de Figma
- Component tokens solo cuando vienen del export de Figma, nunca inventados