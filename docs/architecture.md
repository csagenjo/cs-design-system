# CS Design System — Architecture

## Token structure

Tokens are generated from Figma exports and compiled into `src/tokens.css`.  
All components reference `--ds-*` CSS custom properties — no hardcoded values anywhere.  
**All Component tokens reference Mode via `var()` — zero hardcoded hex (audited 23/06/2026).**

### Four layers (Figma → CSS)

```
Base tokens      → raw color palette (50→950 scales)
Mode tokens      → semantic roles (fg, bg, borderColor) · Light + Dark
Component tokens → component-specific values (--ds-button-*, etc.)
Typography       → font family, size, weight, line-height scales
```

### CSS variable naming

```css
--ds-color-{group}-{step}        /* base palette:   --ds-color-primary-500 */
--ds-fg-{role}                   /* foreground:     --ds-fg-default */
--ds-bg-{role}                   /* background:     --ds-bg-subtle */
--ds-borderColor-{role}          /* borders:        --ds-borderColor-error */
--ds-{component}-{part}-{state}  /* component:      --ds-link-fg-label-default */
--ds-fontSize-{scale}-{step}     /* typography:     --ds-fontSize-label-md */
```

Component token naming follows Figma path convention:
`{component}/{device}/{part}/{property}/{state}` → `--ds-{component}-{part}-{property}-{state}`

Example — Link tokens aligned with `link/all/` Figma architecture:
```css
--ds-link-fg-label-default        /* link/all/fg/label/default-generic */
--ds-link-fg-icon-accent          /* link/all/fg/icon/accent-generic */
--ds-link-border-bottom-default   /* link/all/borderBottomColor/label/default-generic */
--ds-link-bg-mix-hover            /* link/all/root/bgMix/hover */
```

---

## Color palette

| Token | Color | Hex |
|-------|-------|-----|
| `--ds-color-primary-500` | Teal | `#4BA9C0` |
| `--ds-color-primary-700` | Teal dark | `#286371` |
| `--ds-color-secondary-500` | Pink | `#E02C7C` |
| `--ds-color-tertiary-500` | Lavender | `#B185C5` |
| `--ds-color-error-500` | Red | `#D53737` |
| `--ds-color-warning-500` | Amber | `#FFAE0C` |
| `--ds-color-success-500` | Green | `#4DBE53` |
| `--ds-color-info-500` | Blue | `#0FA9FD` |

Each color has a full scale from `50` to `950`.

---

## Typography scale

Font family: **Nunito** (default), Courier New (code)

| Scale | xs | sm | md | lg |
|-------|----|----|----|----|
| `label` | 12px | 14px | 16px | 19px |
| `body` | 12px | 14px | 16px | 19px |
| `title` | — | 16px | 19px | 24px |
| `annotation` | 12px | 14px | 16px | — |

Line heights: `--ds-fontLheight-{3xs → 3xl}` (18px → 72px)

---

## Component architecture

Two-layer system:

```
Layer 1 — Atoms (this repo)
  Standalone components · --ds-* tokens · No external dependencies

Layer 2 — Organisms (planned)
  Composed from Layer 1 atoms
  Complex UI patterns for back-office applications
```

### Layer 1 — Current components

| Component | Variants | Tokens | Status |
|-----------|----------|--------|--------|
| `Button` | accent · default · negative · ghost · outline · floating | `--ds-button-*` | ✅ v2 |
| `ButtonBar` | complex · simple · form · detail | inherits Button | ✅ v2 |
| `Checkbox` | unselected · selected · indeterminate · all states | `--ds-checkbox-*` | ✅ v2 |
| `Link` | default · accent · visited · all states | `--ds-link-fg-label-*` `--ds-link-fg-icon-*` `--ds-link-border-bottom-*` | ✅ v2 |
| `LinkList` | wrapper over Link | inherits Link | ✅ v1 |
| `CTALink` | low · medium · high emphasis × default · accent | `--ds-cta-link-*` | ✅ v2 |
| `InputText` | all states · icon left/right · adaptive | `--ds-input-*` | ✅ v1 |
| `InputDate` | all states | `--ds-input-*` `--ds-input-date-*` | ✅ v1 |
| `InputDropdown` | all states | `--ds-input-*` `--ds-input-dropdown-*` | ✅ v1 |
| `InputStepper` | all states · min/max/step | `--ds-input-*` `--ds-input-stepper-*` | ✅ v1 |
| `InputTelephone` | selectable · fixed × all states | `--ds-input-*` `--ds-input-telephone-*` | ✅ v1 |
| `Radio` | default · error · disabled · label · showLabel · forwardRef | `--ds-radio-*` | ✅ v1 |

### Focus ring implementation patterns

Two components share the same visual output (double focus ring: white inner + black outer) but use different DOM/CSS strategies:

**Checkbox — outline + box-shadow on a single element:**
```
.ds-checkbox__box
  outline:    2px solid var(--ds-checkbox-focus-outer)   ← outer ring
  box-shadow: 0 0 0 4px var(--ds-checkbox-focus-inner)   ← inner ring
```
Simple DOM. The outer ring sits outside the element boundary via `outline`; the inner
ring wraps the element via `box-shadow` inset offset.

**Radio — dual wrapper (two nested `<span>` elements, each with a border):**
```
.ds-radio__focus-ring          border: transparent → focus-outer on :focus-visible
  .ds-radio__control-wrap      border: transparent → focus-inner on :focus-visible
    .ds-radio__circle          visual circle
```
The extra wrapper layer lets the hover background (`control-wrap` background) be
scoped inside the outer ring — preventing the hover tint from bleeding outside the
outer focus border. This constraint does not exist in Checkbox (hover is on the row,
not the box), which is why the simpler `outline` + `box-shadow` approach works there.

---

## System rules

- **No hardcoded values** — every color, size, and radius comes from a `--ds-*` token
- **Component tokens only in JSX** — `.jsx` files must reference `--ds-{component}-*` exclusively, never `--ds-fg-*`, `--ds-bg-*`, `--ds-borderColor-*` (Mode) or `--ds-color-*` (Base) directly
- **bgMix pattern for hover overlays** — use `var(--ds-opacity-hover-default)` via a Component token (e.g. `--ds-button-bg-mix-hover`), never a Base color token
- **Pill shape** for buttons: `--ds-button-radius: 80px`
- **Semantic tokens** for components without Figma component token exports
- **Component tokens** only when confirmed from Figma variable exports
- **CSS prefix** `.ds-` for all component classes
- **Icons** via lucide-react — same naming convention as the Figma DS

---

## Dark mode

Supported via two mechanisms:

```css
@media (prefers-color-scheme: dark) { /* system preference */ }
[data-theme="dark"] { /* manual toggle */ }
```

Semantic tokens (`--ds-fg-*`, `--ds-bg-*`) automatically switch between modes.

---

## Token audit — June 2026

### Full cross-component audit (23 June 2026)

**Result: zero violations across all components.**

83 hardcoded hex values in `tokens.css` Component blocks migrated to `var(--ds-mode-token)` references. 20 direct Mode/Base token references removed from JSX files.

**8 new Component tokens added:**

| Token | Value | Block |
|---|---|---|
| `--ds-input-fg-placeholder` | `var(--ds-fg-subtle)` | InputCommon |
| `--ds-input-border-hover` | `var(--ds-borderColor-emphasis)` | InputCommon |
| `--ds-input-bg-readonly` | `var(--ds-bg-page)` | InputCommon |
| `--ds-button-fg-negative` | `var(--ds-fg-error)` | Button |
| `--ds-button-border-negative` | `var(--ds-borderColor-error)` | Button |
| `--ds-button-bg-negative-hover` | `var(--ds-bg-error-subtle)` | Button |
| `--ds-button-bg-mix-hover` | `var(--ds-opacity-hover-default)` | Button |
| `--ds-input-stepper-btn-bg-hover` | `var(--ds-opacity-hover-default)` | InputStepper |

**bgMix pattern for interaction overlays:**  
Hover states on transparent surfaces (outline buttons, ghost, links) use a `rgba` overlay token rather than a solid Base color. The pattern: define `--ds-{component}-bg-mix-hover: var(--ds-opacity-hover-default)` at Component level, reference it from JSX. Enables dark mode inversion automatically when `--ds-opacity-hover-default` overrides to `rgba(255,255,255,0.1)`.

Components using bgMix: `Button` · `Link` · `CTALink` · `InputStepper`
