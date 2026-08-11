# CS Design System — Architecture

## Token structure

Tokens are generated from Figma exports and compiled into `src/tokens.css`.  
All components reference `--ds-*` CSS custom properties — no hardcoded values anywhere.  
**All Component tokens reference Mode via `var()` — zero hardcoded hex (audited 23/06/2026, confirmed 01/07/2026).**

### Five layers (Figma → CSS)

```
Base tokens      → raw color palette (50→950 scales)
Theme tokens     → semantic roles per brand theme (2 active: Overall/Retail · Youth)
Mode tokens      → semantic resolution (fg, bg, borderColor) · Light + Dark
Component tokens → component-specific values (--ds-button-*, etc.)
Device tokens    → responsive typography and spacing (Mobile / Desk)
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

Font family: **Nunito** (default)

| Scale | xs | sm | md | lg |
|-------|----|----|----|----|
| `label` | 12px | 14px | 16px | 19px |
| `body` | 12px | 14px | 16px | 19px |
| `title` | — | 16px | 19px | 24px |

Line heights: `--ds-fontLheight-{3xs → 3xl}` (18px → 72px)

---

## Component architecture

Two-layer system:

```
Layer 1 — Atoms (src/components/)
  Standalone components · --ds-* tokens · No external dependencies

Layer 2 — Organisms (src/organisms/)
  Composed from Layer 1 atoms
  Complex UI patterns for back-office applications
```

### Layer 1 — Components

| Component | Variants | Tokens | Status |
|-----------|----------|--------|--------|
| `Button` | accent · default · negative · ghost · outline · floating | `--ds-button-*` | ✅ v2 |
| `Checkbox` | unselected · selected · indeterminate · all states | `--ds-checkbox-*` | ✅ v2 |
| `Radio` | default · error · disabled · label | `--ds-radio-*` | ✅ v1 |
| `Chip` | choice · filter selectable · filter dismissible · input | `--ds-chip-*` | ✅ v1 |
| `Link` | default · accent · visited · all states | `--ds-link-*` | ✅ v2 |
| `LinkList` | wrapper over Link | Device spacing tokens | ✅ v1 |
| `CTALink` | low · medium · high emphasis × default · accent | `--ds-cta-link-*` | ✅ v2 |
| `InputText` | all states · icon left/right · adaptive | `--ds-input-*` | ✅ v1 |
| `InputDate` | all states | `--ds-input-*` `--ds-input-date-*` | ✅ v1 |
| `InputDropdown` | all states | `--ds-input-*` `--ds-input-dropdown-*` | ✅ v1 |
| `InputStepper` | all states · min/max/step | `--ds-input-*` `--ds-input-stepper-*` | ✅ v1 |
| `InputTelephone` | selectable · fixed × all states | `--ds-input-*` `--ds-input-telephone-*` | ✅ v1 |
| `InputAmount` | selectable · fixed × all states | `--ds-input-*` `--ds-input-amount-*` | ✅ v1 |
| `BadgeNotification` | 4 colors × 2 sizes | `--ds-badge-notification-*` | ✅ v1 |
| `BadgeHighlight` | emphasis · neutral · positive · negative | `--ds-badge-highlight-*` | ✅ v1 |
| `AmountView` | positive/negative × solid/soft/plain | `--ds-amount-view-*` | ✅ v1 |
| `SelectorInvoker` | 8 states × 3 data selections | `--ds-selector-*` | ✅ v1 |
| `SelectorListItem` | 8 states × 2 data selections | `--ds-selector-*` | ✅ v1 |
| `Selector` | wrapper: Label + Helper + SelectorInvoker + Validation | `--ds-selector-*` | ✅ v1 |
| `AccountSelectorInvoker` | 8 states × 3 data selections | `--ds-account-selector-*` | ✅ v1 |
| `AccountSelectorListItem` | 8 states × 2 data selections | `--ds-account-selector-*` | ✅ v1 |
| `AccountSelector` | wrapper: Label + Helper + AccountSelectorInvoker + Validation | `--ds-account-selector-*` | ✅ v1 |
| `Pagination` | primary · secondary · previous/next · selectedPage · activePage · dots · truncation | `--ds-pagination-*` | ✅ v1 |
| `HelperText` | generic · disabled · Body/sm · extracted from InputCommon | `--ds-helper-text-*` | ✅ v1 |
| `Headline` | h1–h6 (level=tag+size) × default/primary/secondary/onColor · left only · no truncation | `--ds-headline-*` | ✅ v1 |
| `CellData` | Cell family · slot container · align L/R · density compact/basic · surface neutral/onSurface/zebra · lastRow · `role="cell"` | `--ds-cell-*` | ✅ v1 |
| `CellHeader` | Cell family · slot container · align L/R · density compact/basic · surface neutral/onSurface/zebra · border subtle/primary · showSort (ArrowUpAZ) · `role="columnheader"` | `--ds-cell-*` | ✅ v1 |
| `CellMore` | Cell family · overflow trigger ("More ›") · root `<button role="cell">` · label falsy → icon-only · surface neutral/onSurface/zebra · lastRow | `--ds-cell-*` | ✅ v1 |

### Layer 2 — Organisms

| Component | Description | Status |
|-----------|-------------|--------|
| `ButtonBar` | complex · simple · form · detail | ✅ v2 |
| `CellActions` | Cell family · cell container hosting ≤2 actions (Button/Link/CTALink) via children · align L/R · surface/lastRow · `role="cell"` · dev-warn if >2 | `--ds-cell-*` | ✅ v1 |
| `Table` | Cell family · `Table` + `TableRow` · pure layout wrapper, no chrome of its own (no Figma component for it) · composition via children, no prop cloning · `role="table"`/`role="row"` | — (uses `--ds-cell-*` on children) | ✅ v1 |

---

## Design patterns

### Focus ring — two implementations

**Single element (Checkbox, Chip, SelectorInvoker):**
```css
outline:    2px solid var(--ds-*-focus-outer)   /* outer ring */
box-shadow: 0 0 0 4px var(--ds-*-focus-inner)   /* inner ring */
```

**Dual wrapper (Radio, SelectorListItem):**
```
.focus-ring   → border: focus-outer on :focus-visible
  .control    → border: focus-inner on :focus-visible
    .visual   → the actual visual element
```
The dual wrapper scopes hover background inside the outer ring, preventing color bleed.

### bgMix pattern for hover overlays

Hover over transparent surfaces uses a `rgba` overlay token, never a solid color.
```css
/* Component token */
--ds-button-bg-mix-hover: var(--ds-opacity-hover-default)
/* JSX */
background: var(--ds-button-bg-mix-hover)
```
Enables automatic dark mode inversion.

Components using bgMix: `Button` · `Link` · `CTALink` · `Chip` · `InputStepper`

### Common + specific pattern (Input family, Selector family)

Shared tokens live in a `{Family}Common/` group. Specific tokens live in `{Component}/`.

```
Input/
  InputCommon/   ← 27 shared tokens (root, label, helper, validation, valueText)
  InputText/     ← only iconLeft, iconRight
  InputTelephone/ ← countryField, telephoneField, divider, etc.
  ...

advancedSelector/all/   ← selector-specific tokens
accountSelector/all/    ← account-selector-specific tokens
  (label/helper/validation tokens are borrowed from InputCommon — intentional,
   single maintenance point for all form components)
```

### Icon color — currentColor pattern

Icons from lucide-react inherit color from their parent via `currentColor`.
The parent component sets the color via its own Component token:
```css
/* Component token sets the color */
--ds-selector-icon-fg-primary: var(--ds-fg-icon-primary)
/* JSX applies it to the container, not the SVG directly */
color: var(--ds-selector-icon-fg-primary)
/* The icon SVG inherits via currentColor */
```
This is necessary because Figma vector fills cannot be bound to variables — 
the token exists in Component layer but is applied in CSS, not in Figma.

**Naming by contrast, not by position or Variant (14–15/07/2026):** icon color
tokens are named by the contrast they resolve, never by their slot or source Variant.
`iconLeft`/`iconRight` pairs were consolidated to a single position-agnostic token —
the position never determines the color:
- **Button / Icon Button:** `iconLeft/fg/*` + `iconRight/fg/*` → `button/all/icon/fg/*`
  (`on-color` · `on-outline-default` · `on-outline-accent` · `disabled`). An icon is
  `on-color` (white) whenever the **concrete state's** background is filled — in
  Secondary/Tertiary that includes Hover and Focus Hover, not only Primary.
  *(tokens.css still reflects the old iconLeft/iconRight structure for Button — sync pending.)*
- **Selector / Account Selector:** `Selector/iconLeft/fg/*` == `Selector/iconRight/fg/*`
  (same value) → consolidated in CSS to `--ds-selector-icon-fg-primary` /
  `--ds-selector-icon-fg-disabled` (and `--ds-account-selector-icon-fg-*`). ✅ synced.

### Selector family — shared Icon atom

`SelectorInvoker`, `SelectorListItem`, `AccountSelectorInvoker` and `AccountSelectorListItem`
no longer depend on the old `.Icon Left` / `.Icon Right` sub-components (removed in Figma
15/07/2026). All icons now render through the shared `Icon` atom (`src/components/Icon.jsx`):
configurable size, color inherited from context via `currentColor`.

### AmountView — solid/soft/plain naming convention

```
plain  → no background, text only (positive/negative color via fg token)
soft   → subtle surface background (bg/success-subtle, bg/error-subtle)
solid  → solid surface background (bg/success, bg/error) + onColor white text
```
Text on `solid` variants uses `fg/onColor` (white) for legibility — verified WCAG AA:
- positive-solid (bg/success green): black text → ratio ~5.2:1 ✅ keep black
- negative-solid (bg/error red): white text → ratio ~9.8:1 ✅ use onColor

### Cell family + Table — composition without a Row organism (11/08/2026)

`CellHeader`/`CellData`/`CellMore`/`CellActions` share the `cellCommon` tokens (padding, gap, border,
surface) and only diverge on `basic`-density vertical padding. `Table` (`Table` + `TableRow`) assembles
them, but deliberately **does not expose a separate `Row` organism**: a row has no standalone use case
outside a table (unlike `CellActions`, which does live alone inside a single `CellData`), so making it
its own exported component would only add API surface with no real consumer. `TableRow` lives in the
same file as `Table`, documented as one organism, not two.

`Table` has **no chrome of its own** (no background/border/radius) — there is no "Table" component in
Figma, only the Cell family (`Column Header`/`Cell`/`More`), confirmed via `search_design_system` before
assuming one existed. If a page needs Table wrapped in a card, the consumer wraps it.

Semantics stay `<div>` + flexbox (not native `<table>`/`<tr>`/`<td>`) — consistent with CellHeader/CellData
already being `<div>`s, and the same approach complex data grids use in practice (AG Grid, MUI DataGrid,
TanStack Table skip native `<table>` too, for virtualization / sticky columns / custom cell renderers).
ARIA roles (`table`/`row`/`columnheader`/`cell`) give the equivalent semantics. `Table`/`TableRow` never
clone or inject props into children — `surface`/`lastRow` stay explicit per-cell, matching the
`CellActions`/`ButtonBar` composition style used everywhere else.

---

## Icons

**Lucide Icons** — external Figma library activated from the Figma community
(`figma.com/community/file/1204720733890022011`), connected to CS Design System variables
for color control. No local icon page maintained in CS Design System.

In React: `import { Lock, ChevronRight } from 'lucide-react'` — always with `currentColor`.

---

## System rules

- **No hardcoded values** — every color, size, and radius from a `--ds-*` token
- **Component tokens only in JSX** — never `--ds-fg-*`, `--ds-bg-*` (Mode) or `--ds-color-*` (Base)
- **Label/Helper/Validation borrowing from InputCommon is intentional** — all form components share one maintenance point
- **bgMix for hover overlays** — never a solid color token for transparent surface hover
- **Icon color via currentColor** — never bind icon fill to a token in Figma (vector limitation); apply via CSS on the parent
- **`bg/negative` eliminated** — remap to `bg/error` (solid) or `bg/error-subtle` (soft) when found broken
- **CSS prefix** `.ds-` for all component classes
- **No subfolder per component** — all atoms flat in `src/components/`

---

## Dark mode

```css
@media (prefers-color-scheme: dark) { /* system preference */ }
[data-mode="dark"] { /* manual toggle */ }
```

### `*/inverse` vs `*/onColor` — the rule (confirmed + closed 11/08/2026)

Two token families read identically in light mode and diverge in dark — picking the wrong one is
invisible until dark mode ships. The rule: resolve the **background** first.

- Background flips with the mode (`bg/inverse`: black in light → white in dark) → pair it with
  `*/inverse` text/icon tokens, which flip too, keeping contrast.
- Background is a brand/feedback color that **stays the same hex in both modes** (`bg/primary`,
  `bg/error`, `bg/success`…) → pair it with `*/onColor`, which stays fixed white in both modes.

Never decide by token name or by how it looks in one mode alone — resolve the paired `bg` in both
Light and Dark first. Full audit (7 confirmed instances, in both Figma and `tokens.css`) and the
`bg/default`/`bg/page`/`bg/container` elevation-ladder trap of the same shape live in
`token-architecture.md`.

---

## Token audits

### Full cross-component audit (23 June 2026) — zero violations

83 hardcoded hex values in `tokens.css` migrated to `var()`. 20 direct Mode/Base references removed from JSX.

### Selector + Badge + AmountView audit (01 July 2026)

- Advanced Selector: 24 + 16 + 8 variants, structurally complete
- Account Selector: 24 + 16 + 8 variants, Read Only added
- AmountView naming restructured: `positiveHighEmphasis/negativeHighEmphasis` → `positive-solid/negative-solid`, `negative` → `negative-soft`, `positive-soft` added
- BadgeHighlight: all backgrounds corrected to subtle surfaces; icon colors legible on all variants
- `bg/negative` Mode token eliminated — no consumers
- Lucide Icons Figma library activated, local icon page removed

### Token + IP sync (14–15 July 2026)

- **IP cleanup** (scope only, no content reproduced): 215 legacy-naming corrections across
  the 50 file pages + 1 page removed (leaked real name + internal URL). Additionally, an
  internal documentation URL was cleared from the `documentationLinks` property of 64
  components (exposed automatically in Dev Mode / Code Connect), verified across 42 pages.
- **Icon color architecture** consolidated for Button, Icon Button, Selector and Account
  Selector — named by contrast, position-agnostic (see *Icon color* pattern above).
- **Theme collection reduced** to Overall (Retail) + Youth; Wholesale/Business/Private/
  Wireframe removed (open decision — may return). primary/secondary text-role depth pulled
  to `500`; `accent` roles pushed to `700`. See `token-architecture.md` for the full diff.
- **Sprint priority:** Table + Cell (CellHeader/CellData/CellActions) + Pagination is now
  the top priority of the active sprint (decision 14/07/2026).

### Pagination + token sync (18 July 2026)

- **Pagination built** (Layer 1 atom, `--ds-pagination-*`). `.Parts` rebuilt from scratch in
  Figma (each part had a different internal structure); parts now share a consistent
  32×32 container → fill → content shape. Token rename (part-based, not intuition):
  `arrowLeft/arrowRight → previous/next`, and `activePage`↔`selectedPage` are crossed vs.
  intuition (`activePage` = the underlined Link, `selectedPage` = the current-page circle).
  Contrast rule reused from Button: white content on filled surfaces, dark on outline.
  See `token-architecture.md` §Pagination for the full map and the SelectedPage contrast debt.
- **`bg/container` consolidation** (before Pagination): the `bg/container` / `bg/containerShape`
  / `bg/shape` families were merged into a single `bg/container` with widened scopes.

### Cell family completion + Table + dark mode audit (11 August 2026)

- **Cell family complete:** `CellMore` (atom) and `CellActions` (organism) built, closing the family
  alongside `CellHeader`/`CellData`. `Table` (organism) assembles them — see *Design patterns* above
  for why there's no separate `Row` organism and no Table chrome tokens.
- **`table/all/cellCommon/bg/onSurface`** was aliased to `bg/default` instead of `bg/container` in
  Figma — same value in light, wrong in dark (see *Dark mode* above). Fixed in Figma; `--ds-bg-container`
  added to `tokens.css` (didn't exist at all before).
- **Dark mode audit:** neutral `bg/*` scale (default/page/subtle/disabled/container) and the brand/
  feedback `bg/*` family (primary — found swapped with primary-bold, secondary, tertiary, error,
  success, hover-primary, inverse, accent, warning, info, highlight) resynced against live Figma
  resolution, not the cached JSON export. The `*/inverse` vs `*/onColor` trap — previously only
  documented for icons — confirmed present in `fg/label`/`fg/body` too, with 7 concrete instances
  found and fixed in both Figma and code (Button, CTALink, Chip ×2, BadgeNotification, Pagination ×2).
  Dead tokens removed: `bg-quaternary` (all variants), `bg-hover-secondary/tertiary`, `bg-completed`,
  `bg-done`. Full detail in `token-architecture.md`.
- **Audit technique:** Tokens Studio re-exports reorder JSON keys, producing diffs of hundreds of lines
  that are pure noise. Diffing by flattened `path → (hex, alias)` instead of raw text/line position
  separates real changes from cosmetic reordering — used to verify a 428-line Theme file diff was 100%
  cosmetic before committing it.
