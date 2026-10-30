# CLAUDE.md — CS Design System

Librería personal de componentes React, basada en Sistema Origen y limpia de IP.
Figma es la fuente de verdad. Caso de uso: La Plataforma (back-office).
Repo: https://github.com/csagenjo/cs-design-system · Figma fileKey `QiWDJdMPB5pfY3vHy9CqZv`

**Dónde está el resto**
- `docs/component-inventory.md` — cómo usar cada componente y su accesibilidad (diseño, React, agentes)
- `docs/component-notes.md` — detalle y decisiones por componente
- `docs/token-architecture.md` · `docs/architecture.md` — tokens y arquitectura completas
- `docs/accessibility-audit.md` — auditoría WCAG 2.2 AA y plan A11y
- `docs/tech-debt.md` — deuda abierta · `docs/changelog.md` — historia (sprints, deuda resuelta)

## 1. Aliases — usar SIEMPRE

Nunca nombres reales: **La Empresa** (organización de origen) · **Sistema Origen** (design system de referencia) · **La Plataforma** (back-office de caso de uso) · **UIKit Plataforma** (su UIKit).

## 2. Stack y estructura

Node.js v24 · Vite · React 19 · lucide-react · `npm run dev` (http://localhost:5173) · `npm run build` · `npm run a11y`

```
src/components/   Capa 1: átomos puros (solo tokens --ds-{componente}-*)
src/organisms/    Capa 2: UIKit Plataforma (compone átomos)
src/tokens.css    fuente de verdad CSS (Component → var() de Mode)
src/foundations.css  movimiento reducido y colores forzados — importar siempre con tokens.css
src/__a11y/       galería con todas las piezas y variantes (escaneo axe, light + dark)
src/App.jsx       banco de pruebas (se sobrescribe)
tokens/           exports de Figma: Base/ Theme/ Mode/ Component/ Device/
```

## 3. Tokens — 5 capas

`Base → Theme → Mode (light/dark) → Component → Device (Mobile/Tablet/Desktop)`

- **Color: Component → Mode → Theme → Base, sin saltar capas** (rompe dark y multi-tema). JSX usa solo `--ds-{componente}-*`; los bloques de componente de `tokens.css` usan `var()` de Mode.
- **Tipografía: excepción.** No cambia con Theme ni Mode, así que se consume directa de Device (`fontSize/*`, `fontWeight/*`, `lineHeight/*`).
- **Spacing:** `spacing/*` fijo en los 3 devices; solo `layout/margin|gutter` es responsive. Rejilla de 4/8 validada en el tamaño exterior del componente.
- **Nombres:** color de icono por el contraste que resuelve (`on-color`, `on-outline-default`), nunca por la Variant de origen. Eje de color entre variantes = `default` (sin marca) / `secondary` (con marca), nunca `primary`; `generic` solo si el valor es igual en todas las variantes.
- **Icono sobre superficie de color:** `fg/icon/onColor` (blanco en los dos modos), nunca `fg/icon/inverse` (pasa a negro en dark).
- **Exportar tokens:** Carol exporta a `~/Downloads/DDMMAAAA/` (zip, el último del día). Al oír "exportados": pedir acceso a `~/Downloads`, descomprimir en `tokens/<Colección>/` de la rama, revisar el diff por nombre de token (el orden de Figma cambia) y subirlo a la PR. Nunca tocar el repo de su Mac.

## 4. Reglas de componente

- **Foco.** Un color para todo el sistema (`borderColor/focus-outer`, contraste ≥ 3:1) + hueco `focus-inner`, 2 + 2 px. Controles sueltos (Button, IconButton, Checkbox, Radio, Switch, Chip, inputs): anillo por fuera del control y dentro de un **área de foco de 4 px** del propio componente (`…/root/focusArea/padding`; `margin` o `padding` en código, en todos los estados; `fullWidth` la descuenta). Filas apiladas (ListView, SelectorListItem, celdas): anillo doble por dentro. Figma: rects `Focus inner` / `Focus outer` en todas las variantes, ocultos salvo en Focus.
- **Hover, dos familias.** Azul (`bg/hover-primary`) en filas y opciones que son la superficie (Checkbox, Radio, Selector, ListView, Tabs, Steps). Velo (`opacity/hover`, negro 10 % / blanco 10 % en dark) en controles que van encima de cualquier fondo (Button, IconButton, Chip, Link, CTALink, InputStepper). Pressed = opacidad (Tabs: gris). Disabled por tokens, nunca opacidad.
- **Inputs.** Caja común en `_inputBase.js` (Text, Dropdown, Date, Stepper, Telephone, Amount) con los estados de Figma (Initial, Enabled, Hover, Focus, Error, Read-only, Disabled). Lo repetido entre inputs va a `Input/InputCommon`. Label → ayuda 4, ayuda → campo 8. Label, ayuda y error son átomos con tokens propios (`FieldLabel`, `HelperText`, `ValidationMessage`), sin margen exterior: el espacio lo pone el padre. Asterisco de obligatorio solo en la label o en la leyenda del grupo.
- **Iconos** siempre vía el átomo `Icon` (nunca `lucide-react` directo) y con `currentColor`; su color lo decide el estado del padre por contraste (relleno o contorno), no la Variant.
- **Instancias anidadas** (el Button de Collapsible, los IconButton de Dialog…): no cambiar sus propiedades de variante; en Figma se bloquean y se avisa en la descripción. Para cambiar su color se redefinen sus variables CSS desde el padre.
- **Accesibilidad.** Textos para lector de pantalla en inglés y por prop. Cada componente nuevo entra en la galería con todas sus variantes, y `npm run a11y` termina sin fallos.
- **Documentación.** Antes de documentar se cierran todas las diferencias código ↔ Figma ("Known gaps: None"). Cada componente: frame "{Nombre} — How to use & Accessibility" en su página de Figma, entrada en `component-inventory.md` y fila en `component-notes.md`.

## 5. Nunca

- Hex, `rgba()` o px sueltos en JSX (en `tokens.css`, solo literales de Figma sin variable, comentados).
- Mode (`--ds-fg-*`, `--ds-bg-*`) o Base (`--ds-color-*`) desde JSX.
- Clases con el prefijo de Sistema Origen: solo `.ds-`.
- Mezclar átomos y organismos, o reimplementar un átomo dentro de otro: importar e instanciar.
- Borrar una variable de Figma sin re-enlazar antes sus usos (los nodos quedan apuntando a un ID muerto).
- Copiar nada del archivo de referencia de La Empresa (`ZeevegAnIFnmJWWxBVgmKo`): tiene fugas, solo se mira.

## 6. Componentes

Detalle de cada uno en `docs/component-notes.md`.

**Átomos (`src/components/`)** — Button v3 · IconButton v1.1 · Checkbox v3 · Radio v2 · Switch v1 · Chip v2 · Link v4 · LinkList v1 · CTALink v4 · VisuallyHidden v1 · LiveRegion v1 · FieldLabel v1 · HelperText v1 · ValidationMessage v1 · InputText v2 · InputDate v2 · InputDropdown v2 · InputStepper v2 · InputTelephone v2 · InputAmount v2 · InputCombobox v1 · Selector v2 (+ SelectorInvoker, SelectorListItem) · AccountSelector v2 (+ invoker, list item) · BadgeNotification v1 · BadgeHighlight v1 · AmountView v2 · Pagination v1 · Headline v2 · SectionHeader v1 · Text v1 · DescriptionText v1 · DetailText v1 · List v1 · Divider v1 · CellData v1.1 · CellHeader v2 · CellMore v2 · ListView v2 · Snackbar v1.1 · InlineNotification v1 · Tooltip v1 · LoadingSpinner v1 · ProgressBar v1 · Dialog v1.1 · DialogSimple v1.1 · ErrorAndEmptyState v1.1 · Scrim v1 · PopoverSheet v1.1 · Drawer v1 · Card v1 · Image v1 · TabItem v2 · SegmentedControl v1 · Accordion v1 · Collapsible v1 · CollapsibleIconButton v1 · Slider v1 · RangeSlider v1 · SteppedSlider v1 · DropZone v2 · DocumentItem v2 · LabelDescription v1 · CountryFlag v1 · Node v1 · StepHor v1 · StepVer v1

**Organismos (`src/organisms/`)** — ButtonBar v3 · Table v1 · CellActions v1 · DescriptionList v2 · FileUpload v2 · FileSelector v1 · Tabs v2 · RadioGroup v1 · CheckboxGroup v1 · AccordionGroup v1 · Combobox v1.1 · CountryPicker v1.1 · CurrencyPicker v1 · SidebarMenu v1 · TopNavigation v1 · PageTitle v1 · StepIndicatorLarge v1 · StepIndicatorSmall v1 · StepNavigator v1 · SubstepNavigator v1

**Siguientes:** documentar Tabs, Page Title y Combobox (ver `docs/tech-debt.md`). Backlog: Bottom Navigation, Bottom Sheet, Videoplayer.

## 7. Workflow

1. **Explore** — `tokens.css` + Figma (variables y estructura del nodo).
2. **Plan** — API, tokens que faltan, diferencias con Figma. Sin código todavía.
3. **Code** — y Figma, si hay que corregirlo; galería, `npm run build`, `npm run a11y`, capturas light/dark.
4. **Docs** — frame en Figma, inventory, component-notes.
5. **PR** — Carol hace el merge. Commits: `Add|Update|Fix [Componente]: descripción`.

**Figma MCP:** usar el conector de claude.ai (OAuth); si falla, `claude mcp remove figma`. Leer la skill `figma-use` antes de cada `use_figma`. Lucide es una librería externa activada en el equipo: no crear iconos locales.
