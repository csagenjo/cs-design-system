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
  /* Mode — semantic layer, never used directly by components */
  --ds-fg-default:         #050506;
  --ds-bg-default:         #FFFFFF;
  --ds-borderColor-subtle: #D8DBDE;

  /* Component — scoped per component, reference Mode only */
  --ds-button-radius:               80px;
  --ds-link-fg-label-default:       #050506;
  --ds-link-border-bottom-default:  #2C2F34;
  --ds-cta-link-border-radius-low:  16px;
  --ds-cta-link-border-radius-high: 80px;
  --ds-input-min-height:            56px;
  --ds-checkbox-bg-selected:        #4BA9C0;
  --ds-checkbox-focus-outer:        #050506;
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

## Input family audit — June 2026

All 6 input types audited against the Component token architecture. Zero violations.

| Component | Audit result |
|-----------|-------------|
| `InputText` | ✅ Zero violations |
| `InputDate` | ✅ Zero violations |
| `InputDropdown` | ✅ Zero violations |
| `InputTelephone` | ✅ Zero violations |
| `InputAmount` | ✅ Zero violations |
| `InputStepper` | ✅ Zero violations |

Shared tokens consolidated under `Input/InputCommon/` (27 tokens across 5 semantic groups).

---

*Built by Carol Sánchez Agenjo · Senior UX & Product Designer → Design Engineer*