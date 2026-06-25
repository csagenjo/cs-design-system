# CS Design System

A personal component library built with React and Vite, connected to a Figma design system.  
All styles come from design tokens — no hardcoded values anywhere.

---

## What's in here

### Tokens

Design tokens generated from Figma exports, compiled into CSS custom properties (`--ds-*`).  
Five-layer cascade: **Base → Theme → Mode → Component → Device**.

- **Base** — raw color palette (9 families, 11 steps each)
- **Theme** — semantic roles per brand theme (Retail, Youth Banking + 5 more)
- **Mode** — light/dark resolution (`--ds-fg-*`, `--ds-bg-*`, `--ds-borderColor-*`)
- **Component** — per-component tokens referencing Mode only
- **Device** — responsive typography and spacing (Mobile / Desk)

The code only ever consumes Component tokens — never Mode, Base or Theme directly.

### Components — Capa 1 (Atoms)

| Component | Description | Status |
|-----------|-------------|--------|
| `Button` | Accent · Default · Negative · Ghost · Outline · Floating · Pill shape · Lucide icons | ✅ v2 |
| `Checkbox` | Unselected · Selected · Indeterminate · Error · Disabled · `aria-checked=mixed` · Double focus ring · Hover+Focus state | ✅ v2 |
| `Link` | Default · Accent · Visited · 4 sizes · Low/Medium emphasis · External | ✅ v2 |
| `LinkList` | Semantic `nav > ul > li > Link` wrapper | ✅ v1 |
| `CTALink` | Low · Medium · High emphasis × Default · Accent · 24 Figma variants | ✅ v2 |
| `InputText` | All states · Icon left/right · Adaptive textarea · forwardRef | ✅ v1 |
| `InputDate` | All states · Calendar icon | ✅ v1 |
| `InputDropdown` | All states · ChevronDown icon · Options array | ✅ v1 |
| `InputStepper` | All states · −/+ buttons · min/max/step | ✅ v1 |
| `InputTelephone` | Selectable/Fixed country · Flag + code + divider · All states | ✅ v1 |
| `InputAmount` | Selectable/Fixed currency · locale-aware number format · All states | ✅ v1 |
| `Radio` | Default · Error · Disabled · Label opcional · showLabel · forwardRef | ✅ v1 |
| `Chip` | Choice (toggle) · Filter Selectable (toggle) · Filter Dismissible (label+value+X) · Input (icon+value+X) | ✅ v1 |

### Components — Capa 2 (Organisms)

| Component | Description | Status |
|-----------|-------------|--------|
| `ButtonBar` | Complex · Simple · Form · Detail · Primary/Secondary/Cancel/Negative actions | ✅ v2 |

---

## Stack

- **React 18** + Vite
- **lucide-react** for icons (same naming convention as the Figma DS)
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
  --ds-cta-link-border-radius-high: 80px;
  --ds-input-min-height:            56px;
  --ds-checkbox-bg-selected:        var(--ds-bg-primary-bold);
  --ds-checkbox-focus-outer:        var(--ds-borderColor-focus-outer);
  --ds-input-amount-currency-field-gap-hor-generic: 4px;
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

---

## Token audit — June 2026

**Input family audit (22 June):** All 6 input types audited. Zero violations. Shared tokens consolidated under `Input/InputCommon/`.

**Full cross-component audit (23 June):** All Component tokens in `tokens.css` now reference Mode via `var()` — zero hardcoded hex values. All JSX components consume exclusively `--ds-{component}-*` tokens. Dark mode and multi-theme cascade fully intact across the entire token stack.

| Component | Token violations | Status |
|-----------|-----------------|--------|
| `Button` | 0 | ✅ Clean |
| `Checkbox` | 0 | ✅ Clean |
| `Link` | 0 | ✅ Clean |
| `CTALink` | 0 | ✅ Clean |
| `InputText` | 0 | ✅ Clean |
| `InputDate` | 0 | ✅ Clean |
| `InputDropdown` | 0 | ✅ Clean |
| `InputTelephone` | 0 | ✅ Clean |
| `InputAmount` | 0 | ✅ Clean |
| `InputStepper` | 0 | ✅ Clean |
| `Radio` | 0 | ✅ Clean |
| `Chip` | 0 | ✅ Clean |

---

## Radio — API

```jsx
<Radio
  checked                                          // controlled
  defaultChecked                                   // uncontrolled — never use both
  onChange     = {fn}
  state        = "default" | "error" | "disabled"
  label        = "Opción A"
  showLabel    = {true}    // false → label hidden visually, ariaLabel required
  description  = ""        // helper text below label
  errorMessage = ""        // shown when state="error"
  id
  name                                             // group radios with the same name
  value
  required     = {false}
  fullWidth    = {false}
  ariaLabel    = ""        // required when showLabel={false} or no label
  onFocus      = {fn}
  onBlur       = {fn}
/>
```

Group usage — the browser enforces mutual exclusivity within a `name` group:

```jsx
<Radio label="SEPA"   name="payment" value="sepa"   checked={v === 'sepa'}   onChange={fn} />
<Radio label="Tarjeta" name="payment" value="card"  checked={v === 'card'}   onChange={fn} />
```

### Focus ring — dual wrapper pattern

Radio uses two nested `<span>` wrappers around the visual circle. On `:focus-visible` the
outer wrapper receives `--ds-radio-root-border-color-focus-outer` and the inner wrapper
receives `--ds-radio-root-border-color-focus-inner`, producing a double ring via two
separate borders.

Checkbox achieves the same double-ring result differently: a single `.ds-checkbox__box`
element uses `outline` (outer ring) + `box-shadow` (inner ring). Both approaches are
intentional — Radio's dual wrapper allows the hover background (`control-wrap`) to be
scoped inside the outer ring without leaking color.

---

*Built by Carol Sánchez Agenjo · Senior UX & Product Designer → Design Engineer*