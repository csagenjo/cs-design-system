# CS Design System

A personal component library built with React and Vite, connected to a Figma design system.  
All styles come from design tokens — no hardcoded values anywhere.

---

## What's in here

### Tokens

Design tokens generated from Figma exports, compiled into CSS custom properties (`--ds-*`).  
Five-layer cascade: **Base → Theme → Mode → Component → Device**.

- **Base** — raw color palette (9 families, 11 steps each)
- **Theme** — semantic roles per brand theme (2 active: Overall/Retail · Youth)
- **Mode** — light/dark resolution (`--ds-fg-*`, `--ds-bg-*`, `--ds-borderColor-*`)
- **Component** — per-component tokens referencing Mode only
- **Device** — responsive typography and spacing (Mobile / Desk)

The code only ever consumes Component tokens — never Mode, Base or Theme directly.

### Components — Capa 1 (Atoms)

| Component | Description | Status |
|-----------|-------------|--------|
| `Button` | Accent · Default · Negative · Ghost · Outline · Floating · Pill shape · Lucide icons | ✅ v2 |
| `Checkbox` | Unselected · Selected · Indeterminate · Error · Disabled · `aria-checked=mixed` · Double focus ring | ✅ v2 |
| `Radio` | Default · Error · Disabled · Label opcional · showLabel · Dual wrapper focus ring | ✅ v1 |
| `Chip` | Choice (toggle) · Filter Selectable · Filter Dismissible · Input (icon+value+X) | ✅ v1 |
| `Link` | Default · Accent · Visited · 4 sizes · Low/Medium emphasis · External | ✅ v2 |
| `LinkList` | Semantic `nav > ul > li > Link` wrapper | ✅ v1 |
| `CTALink` | Low · Medium · High emphasis × Default · Accent · 24 Figma variants | ✅ v2 |
| `InputText` | All states · Icon left/right · Adaptive textarea · forwardRef | ✅ v1 |
| `InputDate` | All states · Calendar icon | ✅ v1 |
| `InputDropdown` | All states · ChevronDown icon · Options array | ✅ v1 |
| `InputStepper` | All states · −/+ buttons · min/max/step | ✅ v1 |
| `InputTelephone` | Selectable/Fixed country · Flag + code + divider · All states | ✅ v1 |
| `InputAmount` | Selectable/Fixed currency · locale-aware number format · All states | ✅ v1 |
| `BadgeNotification` | Count pill · 4 colors (primary/secondary/tertiary/disabled) × 2 sizes (default/expanded) | ✅ v1 |
| `BadgeHighlight` | Status pill with icon · Emphasis · Neutral · Positive · Negative | ✅ v1 |
| `AmountView` | Amount pill · positive/negative × solid/soft/plain · onColor text for solid variants | ✅ v1 |
| `SelectorInvoker` | Advanced Selector trigger · 8 states × 3 data selections · Double focus ring | ✅ v1 |
| `SelectorListItem` | Advanced Selector list row · Composes real Radio/Checkbox atoms | ✅ v1 |
| `Selector` | Advanced Selector full component · Label + Helper + Invoker + Validation | ✅ v1 |
| `AccountSelectorInvoker` | Account Selector trigger · Same structure as SelectorInvoker + AmountView | ✅ v1 |
| `AccountSelectorListItem` | Account Selector list row | ✅ v1 |
| `AccountSelector` | Account Selector full component | ✅ v1 |
| `Pagination` | Primary/Secondary · Previous/Next · SelectedPage circle · ActivePage link · Dots truncation | ✅ v1 |

### Components — Capa 2 (Organisms)

| Component | Description | Status |
|-----------|-------------|--------|
| `ButtonBar` | Complex · Simple · Form · Detail · Primary/Secondary/Cancel/Negative actions | ✅ v2 |

> **Estado (18/07/2026):** Pagination construido y documentado. Celda + Tabla quedan para la semana que viene.

---

## Stack

- **React 19** + Vite 8
- **lucide-react** for icons — same naming convention as Figma DS. External Lucide Icons library activated in Figma (`figma.com/community/file/1204720733890022011`) with CS Design System variables mapped for color control.
- **CSS custom properties** — no CSS-in-JS, no Tailwind
- Tokens compiled from Figma variable exports (Tokens Studio)

---

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Token structure

```css
:root {
  /* Mode — semantic layer, consumed by Component tokens only */
  --ds-fg-default:         #050506;
  --ds-bg-default:         #FFFFFF;
  --ds-borderColor-subtle: #D8DBDE;

  /* Component — reference Mode exclusively via var(), zero hardcoded hex */
  --ds-button-radius:               80px;
  --ds-link-fg-label-default:       var(--ds-fg-label-default);
  --ds-link-border-bottom-default:  var(--ds-borderColor-emphasis);
  --ds-cta-link-border-radius-low:  16px;
  --ds-input-min-height:            56px;
  --ds-checkbox-bg-selected:        var(--ds-bg-primary-bold);
  --ds-amount-view-bg-positive-solid: var(--ds-bg-success);
  --ds-amount-view-fg-onColor:      var(--ds-fg-onColor);
}
```

---

## Architecture

```
src/
  components/    ← Layer 1: pure atoms (--ds-{component}-* tokens only)
  organisms/     ← Layer 2: UIKit Plataforma (composed from atoms)
  tokens.css     ← single source of truth for all CSS variables
tokens/
  Base/          ← raw palette exports from Figma
  Theme/         ← semantic roles per brand theme
  Mode/          ← light + dark resolved tokens
  Component/     ← per-component token values
  Device/        ← responsive spacing and typography
```

Rule: organisms import atoms — they never re-implement atom logic.  
Rule: components consume `--ds-{component}-*` tokens only — never Mode or Base directly.  
Rule: icon color is always managed via `currentColor` — never a direct token on the SVG.

---

## Token audits

**Input family (22 June 2026):** All 6 input types audited. Zero violations. Shared tokens consolidated under `Input/InputCommon/`.

**Full cross-component audit (23 June 2026):** Zero violations across all components. 83 hardcoded hex values migrated to `var()`.

**Selector + Badge + AmountView audit (01 July 2026):** Advanced Selector and Account Selector structurally complete (24+16+8 and 24+16+8 variants respectively). AmountView token naming restructured to `plain/soft/solid` convention. BadgeHighlight backgrounds corrected to subtle surfaces. `bg/negative` token eliminated from Mode — remap to `bg/error` or `bg/error-subtle` when encountered.

**Token + IP sync (14–15 July 2026):** Icon color tokens consolidated to a single position-agnostic set named by contrast (Button, Icon Button, Selector, Account Selector). Theme collection reduced to Overall/Retail + Youth. Legacy-IP cleanup completed across the Figma file (naming + component documentation links). See `docs/token-architecture.md` for detail.

| Component | Token violations | Status |
|-----------|-----------------|--------|
| `Button` | 0 | ✅ Clean |
| `Checkbox` | 0 | ✅ Clean |
| `Radio` | 0 | ✅ Clean |
| `Link` | 0 | ✅ Clean |
| `CTALink` | 0 | ✅ Clean |
| `Chip` | 0 | ✅ Clean |
| `InputText` | 0 | ✅ Clean |
| `InputDate` | 0 | ✅ Clean |
| `InputDropdown` | 0 | ✅ Clean |
| `InputTelephone` | 0 | ✅ Clean |
| `InputAmount` | 0 | ✅ Clean |
| `InputStepper` | 0 | ✅ Clean |
| `LinkList` | 0 | ✅ Clean |
| `BadgeNotification` | 0 | ✅ Clean |
| `BadgeHighlight` | 0 | ✅ Clean (01/07/2026) |
| `AmountView` | 0 | ✅ Clean (01/07/2026) |
| `SelectorInvoker` | 0 | ✅ Clean |
| `SelectorListItem` | 0 | ✅ Clean |
| `Selector` | 0 | ✅ Clean |
| `AccountSelectorInvoker` | 0 | ✅ Clean |
| `AccountSelectorListItem` | 0 | ✅ Clean |
| `AccountSelector` | 0 | ✅ Clean |

---

*Built by Carol Sánchez Agenjo · Senior UX & Product Designer → Design Engineer*
