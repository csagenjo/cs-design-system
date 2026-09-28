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
| `Snackbar` | single/multi line · action = direct `Button` instance (default sm, no tokens of its own) · bg/fg invert with mode · `role="status" aria-live="polite"` | `--ds-snackbar-*` | ✅ v1 |
| `List` | unordered (teal bullet) · ordered (free-string `number` per item) · checkmark (Lucide `Check`, currentColor) · real `items` array (Figma bakes 3 by hand, not replicated) · no `size` prop — Figma exposes a single "16" | `--ds-list-*` | ✅ v1 |
| `AmountView` | v2 — `highlight` (neutral/emphasis/subtle/disabled) × `type` (positive/negative), replaces v1 emphasis/subtle · `.Amount` primitive axes: size xs/sm/md/lg, isoPlacement left/right, amountWeight bold/regular · subtle = pale bg + black text (v1 color-tint bug fixed) | `--ds-amount-view-*` | ✅ v2 |
| `Divider` | solid 1px bar (background, not border-bottom) matching Figma · named `-border-color-` despite the `background` implementation — the token describes the semantic color, not the one CSS property that happens to consume it here | `--ds-divider-*` | ✅ v1 |
| `SectionHeader` | shared section-title style, extracted from a wrapper duplicated 4× (List View, Selector, Account Selector, Description List) into one atom · `fontSize/title/*` — a distinct Device family from Headline's `fontSize/headline/*`, not interchangeable · size sm/md × color default/primary/disabled × weight bold/regular | `--ds-section-header-*` | ✅ v1 |
| `Dialog` | modal · `header` default/primary/onPrimary/secondary/tertiary (drives Button variant: accent for primary/onPrimary, default otherwise) · `size` standard/small · `width` popUp (fixed 480px, `Dialog/DialogShadow`) / fullScreen (100%/100%, no shadow/radius) · shared header extracted to `_dialogBase.jsx` (`DialogHeader`, not exported) | `--ds-dialog-*` | ✅ v1 |
| `DialogSimple` | compact confirmation dialog · fixed Default header (44px) · `variant` default (280px, solid `borderColor/subtle` border + the same `Dialog/DialogShadow` as Dialog's PopUp, not a distinct shadow) / expanded (480px, min-height 680px) | `--ds-dialog-*` | ✅ v1 |
| `ErrorAndEmptyState` | error/empty feedback · header with close only (no arrow, no visible title) · `variant` fullScreen / popUp · `icon` is a swappable `ReactNode` slot — not the banned Image atom | `--ds-dialog-*` | ✅ v1 |
| `Scrim` | trivial modal backdrop · no props · bg inverts with mode (black 30% light / white 30% dark) | `--ds-dialog-scrim-*` | ✅ v1 |
| `Text` | rich-text option swappable into List View/Selector's Description slot via Figma instance swap · `color` default/secondary/disabled × `size` 14/16 × `weight` bold/regular × boolean `chevron` (no variant duplication) · own Figma page, same treatment as SectionHeader | `--ds-text-*` | ✅ v1 |
| `DescriptionText` | plain description text · `color` default/subtle/disabled × `size` 14/16 · default content of the Description slot | `--ds-description-text-*` | ✅ v1 |
| `DetailText` | icon + detail text · consolidated from 4 duplicated inline copies across the Selector family · `color` default/secondary/tertiary/disabled × `size` 14/16 · swappable `icon` slot | `--ds-detail-text-*` | ✅ v1 |
| `ListView` | interactive result-list row, real `<button>` · Header/Description/Detail compose SectionHeader/DescriptionText/DetailText · `rightPanelContent` is a free slot — not a ported wrapper of Figma's 10-variant Right Panel · selected ribbon · 4 `divider` options · hover/pressed/focus via native CSS pseudo-classes, only `disabled` is a real prop | `--ds-list-view-*` | ✅ v1 |

### Layer 2 — Organisms

| Component | Description | Status |
|-----------|-------------|--------|
| `ButtonBar` | complex · simple · form · detail | ✅ v2 |
| `CellActions` | Cell family · cell container hosting ≤2 actions (Button/Link/CTALink) via children · align L/R · surface/lastRow · `role="cell"` · dev-warn if >2 | `--ds-cell-*` | ✅ v1 |
| `Table` | Cell family · `Table` + `TableRow` · pure layout wrapper, no chrome of its own (no Figma component for it) · composition via children, no prop cloning · `role="table"`/`role="row"` | — (uses `--ds-cell-*` on children) | ✅ v1 |
| `DescriptionList` | `DescriptionList` + `DescriptionListItem` · dumb container + children — does NOT replicate Figma's 8 "Variants" as an enum · orientation landscape (label\|value side by side) / portrait (value under label) · `dl`/`dt`/`dd` semantics · Badge/Link/List/AmountView/SectionHeader instanced by the consumer, never reimplemented | `--ds-descriptionlist-*` | ✅ v1 |

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

### AmountView v2 — `highlight` × `type` (21 August 2026, replaces the old solid/soft/plain draft below)

The convention originally sketched here (`plain`/`soft`/`solid`) was never actually built that way — v1 shipped with `emphasis`/`subtle` only, and `subtle` used a color-tinted background (light green/light red) that turned out not to match the real `Amount View` component in Figma at all. Audited node-by-node before writing v2:

```
highlight: neutral | emphasis | subtle | disabled
type:      positive | negative
```

| `highlight` × `type` | bg | fg |
|---|---|---|
| neutral + positive | none | fg-generic (black) |
| neutral + negative | bg-neutral (`#EEEFF1`) | fg-generic |
| emphasis + positive | bg-positive-solid (`#389A3D`) | fg-onColor (white) |
| emphasis + negative | bg-negative-solid (`#D53737`) | fg-onColor |
| subtle + positive | bg-positive-soft (`#F8FCF8`) | fg-generic (**black, not colored**) |
| subtle + negative | bg-negative-soft (`#FDF7F7`) | fg-generic |
| disabled + positive | none | fg-disabled |
| disabled + negative | bg-disabled (`#EEEFF1`) | fg-disabled |

**Intentional asymmetry, confirmed in Figma, not a gap:** at low/no emphasis (`neutral`, `disabled`), positive amounts get no visual mark — that's the expected/default state. Negative always gets at least a neutral gray flag, even at low emphasis, because it carries semantic weight worth surfacing. The pattern repeats identically across two separate rows (`neutral` and `disabled`), which is what confirmed it as a deliberate rule rather than one unwired cell.

The underlying text-only primitive (`.Amount` in Figma) is exposed as its own axis set: `size` (xs/sm/md/lg = 12/14/16/19), `isoPlacement` (left/right), `amountWeight` (bold/regular) — independent of `highlight`/`type`.

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

### Snackbar built + fg/body vs fg/label confirmed (12 August 2026)

- **Snackbar built** (Layer 1 atom, `--ds-snackbar-*`). Sprint 1 Pri 2 closed. Two Length variants
  (single/multi line) — layout only, same colors in both. The action ("Undo"/custom label) is a direct
  `Button` instance (`variant="default" size="sm"`), not a re-implementation — paddings already matched
  Figma exactly.
- **bg/fg pairing confirmed against Figma, not assumed:** `snackbar/all/root/bg/generic` → `bg/inverse`
  and `snackbar/all/text/fg/generic` → `fg/body/inverse` (not `fg/label/inverse` — initial assumption,
  corrected against the actual Figma variable panel; both currently resolve to the same hex, but the
  alias matters — Snackbar's message is body copy, not a button label). Dark-mode inversion verified
  directly against a Figma screenshot (dark canvas → white bg / black text) before wiring the tokens.
- **Shadow is a Figma Effect Style, not a color Variable** (`Snackbar/Shadow`) — written as a literal
  3-layer `box-shadow` value in the Component layer, same treatment `--ds-shadow-md`/`lg` should have
  gotten for Button's `floating` modifier but never did (pre-existing gap, unrelated to this session —
  see *Deuda técnica* / `CLAUDE.md` §10).

### Description List + 4 dependencies built, SectionHeader consolidated (19–21 August 2026)

- **Description List** shipped as `DescriptionList` + `DescriptionListItem` (`src/organisms/`), closing
  Sprint 1 Pri 3. Figma models it as 8 baked "Variants" × 2 Orientation (no real slot mechanism in the
  tool) — code deliberately does not mirror that enum. It's a dumb container + `children`, same shape as
  `CellData`/`Table`: Badge/Link/List/AmountView/SectionHeader are instanced by whoever uses it, never
  reimplemented inside the organism.
- **Four new atoms unlocked by the audit, none of which existed before:** `List` (unordered/ordered/
  checkmark, no `size` prop — Figma exposes exactly one size, inventing a scale wasn't warranted),
  `Divider` (see naming note below), `SectionHeader` (see below), and `AmountView` v2 (see the pattern
  entry above this one).
- **`SectionHeader` — one atom replacing four duplicated copies.** The teal/bold section-title style
  existed as a hand-copied local wrapper in four separate places (List View, Selector, Account Selector,
  Description List) — no shared component, no page of its own. Consolidated into a single `Section
  Header` component with its own Figma page; verified via a programmatic sweep of all 52 pages in the
  file that the old wrapper had zero remaining instances before deleting it. Confirmed **not** the same
  type ramp as `Headline` — `fontSize/title/*` is a distinct Device family from `fontSize/headline/*`,
  with its own line-height and always Bold-capable, checked line-by-line rather than assumed from a
  matching pixel size.
- **`Divider` naming is deliberate, not sloppy.** Figma's actual rendering is a solid 1px-tall filled
  bar, not a bordered element — yet the token is `--ds-divider-border-color-generic`, not `-bg-`. That
  same color value is already consumed as `border-color`/`border-bottom-color` everywhere else in the
  codebase (Cell family rows, Description List row separators); naming it by the one CSS property this
  specific atom happens to use would have produced two different names for one semantic concept.
- **IP leak found and closed inside the "CS - Design System" library itself** (not the already-flagged
  Sistema Origen copy): the `check` icon (Checkmark List) carried a documentation link to Sistema
  Origen's real domain in its Figma description field, and Description List's Account-variant icon was
  the `Placeholder/Placeholder` node already flagged as tech debt on 14 July — both fixed in Figma before
  any code was written. Neither was visible without expanding the specific variant/description field.

### Dialog + 3 sub-pieces built, 2 dark-mode contrast bugs found and fixed (24 August 2026)

- **Dialog, DialogSimple, ErrorAndEmptyState, Scrim shipped**, closing Sprint 1 Pri 4 — Sprint 1 complete.
  Figma's token namespace was consolidated first (34 → 27 variables under a single `dialog/all/*`,
  same Common+specific pattern as InputCommon/cellCommon) since 4 disconnected namespaces
  (`dialog`/`dialogHeader`/`dialogSimple`/`emptyAndErrorState`) shared the same header/root/scrim
  pieces without a single source of truth. The shared `.Header` (arrow + title + close, 5 color
  variants) was extracted to `_dialogBase.jsx` (`DialogHeader`, not exported) — instantiated by all
  three public components, same shape as the SectionHeader consolidation on 19 August.
- **Two real dark-mode contrast bugs found by pairing each header color's bg against its title/icon fg
  chain, not by assumption.** Both follow the same fg/bg-pairing trap already documented multiple times
  in this project (Chip selected, Pagination, Button `default-filled`): a background token and its text
  token must invert together, or one direction goes invisible.
  - **Tertiary**, spotted by Carol from a dark-mode screenshot before any code was written:
    `bg/surface/tertiary` lightens in dark mode (`#B185C5`→`#CAABD7`) but `title/fg/tertiary` and
    `icon/fg/tertiary` were bound to the `fg/*/default` family, which inverts *toward* white in dark —
    near-invisible light text on a light-purple background. Compared against Secondary (same
    lightens-in-dark bg pattern, already correctly on `fg/*/inverse`) to confirm the diagnosis before
    touching Figma; rebound to `fg/title/inverse` / `fg/icon/inverse`.
  - **Default**, spotted by Carol live in the browser after the first fix shipped: `title/fg/inverse`
    (Figma's own confusing name for the Default variant) correctly resolved to `fg/title/default`
    (inverts, black in light) — but its sibling `icon/fg/inverse` resolved to `fg/icon/inverse` instead
    (fixed white), invisible against the white `bg/default` in light mode, while the title right next to
    it was fine. Rebound to `fg/icon/default` to match its title sibling.
  Both verified by full alias-chain resolution in Figma (not by name or matching hex) before and after
  the fix, and confirmed visually in the test bench across all 5 header colors in both light and dark.
- **`bg/surface/primary|secondary|tertiary` resolve identically to the already-existing
  `--ds-bg-primary/-secondary/-tertiary`** Mode tokens (same values, both modes) — reused directly
  instead of adding a parallel "surface" token family.
- **Code-side bug, not a Figma issue:** the fixed-width cards (`Dialog--pop-up`, `DialogSimple--default`/
  `--expanded`) were getting compressed inside a flex row test-bench layout because `width` alone doesn't
  stop a flex item from shrinking — `flex-shrink: 0` was missing on all three and has been added.
- **Button's `size` scale is one step short of what Dialog needs**, found while wiring the Control Area
  buttons: Dialog's large buttons need `fontSize/label/lg` (19px) but `Button`'s existing `size="lg"`
  tops out at `fontSize/label/md` (16px); DialogSimple's compact buttons need `fontSize/label/sm` (14px),
  which is `Button`'s `size="md"`, not its `size="sm"` (12px). Pre-existing gap in `Button.jsx`, unrelated
  to this session's work — not fixed here given the blast radius (every existing `Button` consumer), left
  as an open decision for Carol (see *Deuda técnica* / `CLAUDE.md` §10).

### ListView built, Selector family refactored onto 3 new shared atoms (24 August 2026)

- **List View shipped**, the first piece of Sprint 2, alongside three new atoms — `Text`,
  `DescriptionText`, `DetailText` — each given its own Figma page (same treatment as SectionHeader) and
  a real Component-token family (`text/all/label/fg/*`, `descriptionText/all/text/fg/*`,
  `detailText/all/{text,icon}/fg/*`).
- **Process correction mid-session.** While exploring List View's structure, `DetailText` was found
  missing as a properly-published shared component — before confirming this with Carol, code started
  being written against an inferred token shape. Carol stopped the work: Figma is the source of truth,
  and a missing atom noticed during EXPLORE gets raised with her before any code, not inferred and built
  around. She then built `DetailText` in Figma herself (own page, `Show Icon` boolean, swappable `Icon`
  instance) and instanced it into the real List View/Selector layouts. The already-explored token names
  turned out to match exactly — confirming the earlier exploration was accurate, but the process gap
  (write code from inference, let Figma catch up after) was the real issue, now corrected going forward.
- **`SelectorInvoker`, `SelectorListItem`, `AccountSelectorInvoker`, `AccountSelectorListItem`
  refactored** to consume the new shared atoms instead of duplicated inline markup. This closed a real
  inconsistency: `SelectorListItem` exposed no detail-text color at all (always default), while
  `SelectorInvoker` supported secondary/tertiary — now both do, via the same `DetailText` atom.
- **Regression introduced and caught in the same pass:** moving description/detail color to live inside
  the new atoms broke each consumer's own `:disabled` CSS override (it targeted a wrapper `<span>` that
  no longer carries the text color). Fixed by passing `color="disabled"` explicitly from each consumer
  when `isDisabled` is true, and confirmed via live computed-style checks (not just reading the JSX) that
  both `AccountSelectorInvoker` and `AccountSelectorListItem` render the correct disabled gray
  (`rgb(185, 190, 196)` / `#B9BEC4`) before closing the loop.
- **`ListView` itself**: real `<button>`, hover/pressed/focus resolved via native CSS pseudo-classes
  (same convention as `SelectorInvoker`) rather than a `state` prop — only `disabled` is exposed, since
  Figma's other four "states" (Hover/Pressed/Focus aside from Disabled) are visual-only and don't need
  app-controlled toggling. `rightPanelContent` is a free slot, not a ported version of Figma's 10-variant
  Right Panel component (Amount View/Checkbox/Radio/Switch/Text Button/Icon/Badge with Icon/Loading
  Indicator/Highlight Badge) — same reasoning as `DescriptionList` not replicating Figma's baked variant
  list: the consumer instances whichever real atom it needs directly. Two of Right Panel's ten options
  (Switch, Loading Spinner) aren't built yet in code — not a blocker unless a consumer needs those
  specific slots.
- **8 missing dark-mode overrides found and fixed** while resolving tokens for the new atoms + ListView
  (`fg/label/secondary`, `fg/label/disabled`, `fg/body/secondary`, `fg/body/tertiary`, `fg/body/subtle`,
  `fg/body/disabled`, `fg/icon/disabled`, `borderColor/subtle`, `borderColor/disabled`) — all resolved
  live against Figma's variable chains, not assumed. `--ds-fg-disabled` was also carrying the light value
  in both dark blocks (no real override existed) — corrected to `#7B8490`.

> **Note on the gap below:** File Upload, Dialog's padding/gap consolidation fix, and Tabs all shipped
> between this entry and the next (see `CLAUDE.md` §6 for what was built) but weren't narrated here at
> the time — this file fell behind the actual git history for those three. Not backfilled retroactively
> to avoid inventing detail neither of us has direct record of; picking back up below with the session
> that *is* fully documented.

### Icon Button built, Collapsible's unused token layer found and wired up (1 September 2026)

**Icon Button — Figma audit before CODE.** The full 210-variant component set had never had real
auto-layout: every variant was `layoutMode: NONE` with hand-set pixel sizes, which is why the resize
panel never offered "Hug contents." Applied real Hug to the 60 variants without a focus ring
(Enabled/Disabled, with and without Label) — the 150 with `Focus outer`/`Focus inner` were left alone;
a first attempt to Hug all 210 at once corrupted the rings' size and position (recovered via Figma
Version History, not a manual patch). Root cause, learned the hard way: those two rectangles carry
`constraints` of type *stretch* — resizing a parent frame with `.resize()` reflows stretch-constrained
children by margin, so any resize of the root must happen **before** their exact geometry is set, never
after, or the resize undoes the fix.

Real bugs caught in the same pass, all confirmed by data before being called bugs:
- `Tertiary, Size=Medium` (both Default and Accent) had `cornerRadius: 0` — square instead of circle,
  invisible in a screenshot because Tertiary paints no stroke (`strokes: []`, ghost style) and was only
  caught by comparing the raw property against the other 16 Enabled combinations.
- The icon inside all three Icon Button sizes was bound to the *same* size token
  (`iconButton/all/icon/size/medium`, 20px) regardless of the button's own Size — a leftover from a
  manual edit. Rebound per size (16/20/24) and the node's `layoutSizingHorizontal/Vertical` flipped from
  `HUG` to `FIXED` so the binding actually took visual effect (HUG on that node computes from its own
  swapped `Icon Size` sub-variant, ignoring any width/height binding entirely). This correctly cascaded
  the whole button's footprint (Small 36→32, Large 52→56) since the content frame hugs icon+padding.
- `iconButton/all/icon/fg/accent-primary` was aliased to `fg/icon/inverse` (flips in dark mode) while its
  paired background (`bg/surface/primary`, teal) does not — same fg/bg-pairing bug pattern already fixed
  elsewhere in Button/Chip/CTALink/BadgeNotification. Realiased to `fg/icon/onColor` (fixed white in both
  modes) and confirmed live in the built component (dark mode: icon stays white on teal).
- After Carol manually adjusted the ring-state variants' `Icon Size` to match the corrected per-size
  values, the `Focus outer`/`Focus inner` rings were left calibrated for the old uniform 20px icon —
  visibly off-center. Recalculated `inner = bbox(content [+ Label])`, `outer = inner ± 2px` per variant
  from the *current* geometry (a formula confirmed against the original, un-touched baseline first). Two
  further bugs found while doing this: content wasn't re-centered horizontally under its Label after the
  icon shrank (fixed by recomputing `content.x` from the Label's own bounds), and the 18 Large
  Focus-family root frames didn't grow to contain the now-bigger ring (fixed by resizing root to
  `2×outer.offset + outer.size` — a formula verified against the untouched baseline, which already
  matched it exactly).

**Icon Button — CODE**, `IconButton.jsx`: `type` (default/accent) × `variant` (primary=filled,
secondary=outline, tertiary=ghost) × `size` × `disabled`, icon via the shared `Icon` atom. Focus ring
implemented in CSS to match the real Figma geometry: a circle (pill radius) when there's no label, a
rounded rectangle (`--ds-icon-button-focus-radius-with-label-outer`, 4px, Figma's
`iconWithLabel-focus-outer` token) wrapping icon+label when there is one — CSS can't give outline and
box-shadow two different radii on the same element, so the inner ring shares the outer's radius (Figma
differentiates them by 2px, imperceptible on a decorative focus detail).

**Collapsible — the token layer existed but nothing consumed it.** Both `Collapsible` (Button-based) and
`Collapsible Icon Button` had a `Variant=Primary/Secondary` property, and Figma had 15 dedicated
Component-layer tokens for it (`collapsible/all/root/borderColor/*`, `label/fg/*`, `icon/fg/*`, plus
root geometry: borderWidth/borderRadius/gap/padding/focus-ring). None of it was wired up: the label text
and chevron in *both* Primary and Secondary read colors straight from the nested Button/Icon Button
instance's own default token, and the outer wrapper frame itself was completely bare — no stroke, no
radius, no padding, `strokes: []`. Practical effect: Secondary looked identical to Primary, and the pink
(`#E02C7C`) defined for it was dead weight.

First attempt at the fix put a new stroke on the *outer* Collapsible frame — wrong: Carol's correction
was that the outer frame **is** the container, and the visible border already comes from the nested
Button's own `Root` frame, so adding one on the wrapper doubled it. Reverted, then rebound the *existing*
border on the Button's `Root` (color only — geometry stayed on Button's own tokens after a second
over-correction attempt changed the pill radius to Collapsible's 8px value, which Carol also caught:
she'd asked to rebind colors, not geometry). Label and icon fg were similarly rebound directly on the
`TEXT` fill and chevron `VECTOR` stroke inside the nested instance — several manually-bound variants
turned out to have the wrong token (label and icon sharing one color, or both borrowing the border's
token) and were corrected by re-reading every binding by ID before trusting the visual.

**Naming convention fixed, now documented in `CLAUDE.md` §5:** the color axis was originally named
`primary`/`secondary`, which reads as brand-teal — but the real values are black/pink. Renamed to
`default`/`secondary`, reserving `generic` strictly for properties that don't vary by variant
(borderRadius, borderWidth, gap, padding). One residual mismatch (`icon/fg/primary` vs `label/fg/default`
for the same role) found and fixed the same way.

**Known Figma limitation, mitigated not solved:** nothing prevents someone with edit access from
double-clicking into the nested Button/Icon Button instance and changing its own Type/Variant/Size/
State/Icon/Label — exposing or not the property as an instance-swap only blocks the swap from the
*parent's* properties panel, not direct entry into the child layer. Mitigation applied: the nested
instance is locked (padlock) in all 24 Collapsible variants, and each variant's Figma `description` now
carries the warning. Not foolproof — locking is reversible — but real friction against the accidental
break Carol had reproduced.

**CODE**, `Collapsible.jsx` / `CollapsibleIconButton.jsx`: both instance Button/IconButton unmodified and
re-theme purely via CSS custom-property overrides scoped to a wrapper class — the same mechanism as
Figma's own variable rebind, applied at the CSS layer instead of the Figma layer. Tooltip on
`CollapsibleIconButton` is a small local CSS implementation, not the shared `Tooltip` atom (doesn't exist
yet, backlog) — noted as a migration TODO in the component's own docstring.

### InlineNotification built — closes Sprint 3 (1 September 2026, same day)

**Figma was clean this time.** Unlike Icon Button and Collapsible, all 19 `inlineNotification/all/*`
tokens were already correctly bound across the 12 variants (Type: Error/Success/Information/Warning ×
Style: Default/Borderless/Simple) before any code was written — border and icon color per Type, fixed
black title/message text regardless of Type, no rebind pass needed. The nested `Button` trigger was
already locked by Carol before EXPLORE started, same mitigation as Collapsible's nested instance.

One real gap found: 3 of the 4 status icons (`circle-x`, `info`, `circle-check`) weren't in the shared
`icons.js` map yet — only `alert-circle` (Warning) existed. Added all three, matching Figma's exact icon
names as map keys.

A parallel, unrelated question came up mid-EXPLORE: Carol had tried adding a Regular-weight variant to
the shared `.Title` atom (used here for the notification title) and found the weight wouldn't change.
Root cause, confirmed by inspecting the text node directly: `fontStyle` was bound to a real variable
(`fontWeight/bold`), not a loose override — and a single component's variable binding can't conditionally
switch by variant property in Figma; each Variant in a set is an independent component with its own
bindings, so a working Bold/Regular axis would need two separate `.Title` components combined into a set.
Turned out moot: none of the 12 Inline Notification variants use anything but Bold, and Carol's actual
need (a regular-weight option) is already covered by hiding the title and using the message text instead
— nothing built, nothing changed on `.Title`.

**Bug found after first CODE pass, from a live screenshot Carol sent:** the action button rendered
left-aligned instead of matching Figma's `Button Container` frame, which Carol had just set to
`layoutSizingHorizontal: FILL` with `counterAxisAlignItems: MAX` (push the button to the container's
right edge). Fixed by wrapping the button in a `flex; justify-content: flex-end` div — sizing-terminology
note for future sessions: Carol's "le acabo de dar un fill" meant Figma's FILL *sizing mode* on the
container, not a background paint (the container's `fills` array is empty).

**Second bug, caught by Carol from a screenshot after that first fix landed:** the button was right-
aligned everywhere *except* the one variant combination with a short message and no title
(`showTitle={false}`) — reproduced independently in the agent's own browser too, so not a caching
artifact. Root cause: `.ds-inline-notification__content` had no `flex: 1`, so it sized to its own longest
child's natural width instead of filling the notification's actual width. With a long message (the
default placeholder text), the content happened to already be wide enough that the bug was invisible; a
short message let the whole column shrink to content-width, leaving the button with no real space to
shift into. Fixed by adding `flex: 1` to the content column — a reminder that "it works for the sample
data" isn't the same as "it works," especially for anything measured relative to a flex sibling's width.

### Tooltip built — opens Sprint 4 (2 September 2026)

**EXPLORE.** Node search: `2570:39` (from Carol's node-id) didn't resolve — same class of typo seen before
with Dialog and Inline Notification — found instead by walking the file's page tree to the actual
component set, `2570:396`, containing 4 `Placement` variants (Top/Bottom/Left/Right). `get_variable_defs`
returned a clean, small set — 8 tokens under `tooltip/all/*`, all `generic` (no color-varying axis):
`root/bg`, `text/fg`, `root/gap`, `root/paddingHor`, `root/paddingVer`, `root/borderRadius`, plus Device
typography (`fontSize/label/xs`, `fontWeight/regular`, `fontLheight/3xs`). Same favorable case as Inline
Notification — no rebind pass needed.

**The recurring fg/bg inversion bug, checked proactively this time.** Given how many times this project has
caught a token pair where one side inverts with dark mode and its partner doesn't (Chip, Pagination, Button
default-filled, CTALink primary — see CLAUDE.md §10), Tooltip's bg/fg were checked *before* writing
`tokens.css`, not after a visual bug report. Used `use_figma` to resolve the actual variable bindings and
alias chains on the component's fill properties (not the single resolved hex `get_variable_defs` returns
for the current mode) — `tooltip/all/root/bg/generic` → `bg/inverse`, `tooltip/all/text/fg/generic` →
`fg/label/inverse`. Both sides of the pair invert together, so this is *not* an instance of the bug: light
mode renders black-on-white, dark mode renders white-on-black, self-consistent regardless of the app's
theme (an intentional "OS tooltip" look, matching what `CollapsibleIconButton`'s local implementation had
already guessed correctly). `--ds-bg-inverse` and `--ds-fg-label-inverse` already carry correct dark
overrides from the 11 August audit, so no new Mode-layer tokens were needed.

**Arrow geometry has no Figma Variable** — the vector node's dimensions (8×6 for Top/Bottom, 6×8 for
Left/Right, same pair rotated) are literal shape geometry, not a bound token. Read from each variant's
`get_metadata` output directly (container + arrow child positions) rather than guessed, then added to
`tokens.css` as literal Component-layer values (`--ds-tooltip-arrow-base`, `--ds-tooltip-arrow-length`),
same treatment already established for `--ds-snackbar-root-shadow`.

**CODE.** `Tooltip.jsx` wraps a `children` trigger (`React.cloneElement` to add `aria-describedby`,
pointing at a `React.useId()`-generated id on the bubble) and shows/hides the bubble purely via
`:hover`/`:focus-within` CSS — no JS state, no timer/portal (same scope boundary as Snackbar/Inline
Notification). Arrow is a CSS border-triangle, sized off the two new tokens via `calc()`, rotated per
`placement` with 4 modifier classes. Verified live in the test bench: all 4 placements point the arrow at
the trigger correctly, both mouse hover and keyboard focus show the bubble (confirms `:focus-within` works
without any extra JS), dark mode inverts bg/fg together as predicted, and the mechanism works identically
with an icon-only trigger (`IconButton`) and a text trigger (`Button`).

**Deliberately left undone:** `CollapsibleIconButton` still uses its own local tooltip markup instead of
instancing this new atom — migrating it is real, tracked debt (CLAUDE.md §10), kept out of this session's
scope so closing that debt doesn't get mixed with landing the new Sprint 4 piece.

### Loading Spinner built — second Sprint 4 piece (2 September 2026)

**EXPLORE.** Node `2455:6028` resolved cleanly this time — a component set on axes `Color` (Primary/
Inverted) × `Size` (Extra-small/Small/Medium/Large, 16/24/32/48px). `get_variable_defs` returned 6 tokens:
4 literal sizes plus `borderColor/primary` (`#4ba9c0`) and `borderColor/inverted` (`#ffffff`) — despite the
"borderColor" name, the actual node is a filled vector ("Progress (Stroke)"), not a stroke; that name is a
leftover from how the shape was presumably authored before being flattened. `get_metadata` showed a single
`VECTOR` child per variant; `use_figma` confirmed it has an empty `strokes` array and a real `fills` binding
instead — a closed, evenodd-wound annulus-with-a-gap path, not an open stroked arc.

**A vector can't spin.** Figma's shape is one static frame of what is, by definition, a continuously
rotating element — there's no way to CSS-animate a filled path's "gap position" without either duplicating
the exact path as a mask or switching representations. Rebuilt as a real SVG `<circle>` with `fill: none`,
`stroke-linecap: round`, and `stroke-dasharray` covering ~75% of the circumference — the standard technique
for this exact UI pattern, and it reads as the same shape Figma shows. Fidelity was kept where it mattered:
`strokeWeight` per size (2/3/4/6, read via `use_figma`, not guessed) turned out to divide `size` by exactly
8 in all four variants — confirmed by data, then encoded directly as `radius = (size − stroke) / 2` per
size and precomputed `stroke-dasharray` values (both literal Component-layer tokens, same treatment as
Tooltip's arrow geometry and Snackbar's shadow — Figma has no Variable for either).

**A real bug, checked proactively rather than found by accident.** Given how many times this project has
caught one side of an fg/bg (or here, "the icon color and what it sits on") pairing inverting with dark
mode while the other side doesn't, `borderColor/inverted`'s actual binding was resolved via `use_figma`
before writing any code — and it was wrong: bound to `bg/default` (the app's page-canvas background),
which is white in light mode but near-black in dark mode. "Inverted" here means "use this spinner on a
colored surface" (the obvious use case being a `Button` in its `loading` state, where the button's fill
doesn't change with the app theme) — so the color needs to stay a fixed white in both modes, not track the
page background. Re-bound the Figma variable directly to `fg/icon/onColor` (confirmed via the same
alias-chain-resolution technique to be white in both Light and Dark) — the exact fix CLAUDE.md §5 already
prescribes for "icon color on top of a colored surface," just not yet applied here. Carol applied the same
reasoning in parallel to `borderColor/primary`, mid-session: it pointed at `bg/surface/primary` — the same
value, doesn't invert either — but it's still a `bg`-family token backing what is conceptually an icon
glyph. Re-bound it to `fg/icon/primary` instead (already present in `tokens.css` as `--ds-fg-icon-primary`,
used by 15+ other components), so both spinner colors now come from the `fg/icon/*` family rather than one
from `fg/icon/*` and one borrowed from `bg/*`.

**CODE.** `LoadingSpinner.jsx` renders one generic `<svg><circle /></svg>` — no per-size JS branching for
geometry at all. `cx`/`cy` are literal `"50%"` (SVG natively resolves percentages against the viewport, so
no viewBox or numeric center calculation is needed), and every other geometric property (`r`, `stroke-width`,
`stroke-dasharray`, plus the container's `width`/`height`) is driven purely by CSS custom properties behind
`.ds-loading-spinner--{size}` modifier classes — modern browsers support `r`/`cx`/`cy`/`stroke-width` as
styleable CSS properties on SVG geometry elements, so this needed no JS size-lookup table at all (a step
cleaner than IconButton's icon-name lookup). Rotation is a single `@keyframes` transform, timed at the same
`0.7s` Button's own pre-existing local spinner already uses, for a consistent spin speed system-wide.
Verified live: all 4 sizes at both colors, confirmed actually rotating (two screenshots a beat apart show
the gap in a different position), and confirmed `inverted` stays clearly visible on a dark surface in both
light and dark app theme — the exact scenario that would have silently broken without the Figma fix.

**New debt, not migrated here:** `Button.jsx` already had its own local `.ds-btn__spinner` (a CSS
border-trick using `currentColor`, square-cut ends, no rounded caps) predating this shared atom — same
class of duplication as `CollapsibleIconButton`'s local tooltip. Not migrated in this session: Button's
spinner leans on `currentColor` to automatically match whatever text/icon color each `variant`/`state`
combination already resolves to, while `LoadingSpinner` takes an explicit `color` prop — migrating cleanly
would need mapping every Button variant/outline combination to `primary` or `onColor` first, which is its
own piece of work, tracked in CLAUDE.md §10.

### Progress Bar built — third Sprint 4 piece, the most collaborative session yet (3 September 2026)

**Carol came in with two suspicions already, from the component's own Figma documentation page**: the
`Default` and `Secondary` variants barely looked different, and the track's background used tokens that
looked wrong on sight. EXPLORE confirmed both with data rather than assuming from the screenshot. Node
`2893:8512` — a set on `Variant` (Default/Secondary) × `Percentage` (0/20/50/80/100%, used only as Figma's
own preview steps, not a real constraint). `get_variable_defs` plus a direct `use_figma` inspection of both
variants' actual fill bindings showed:

- `indicator/bg/generic` resolved to `bg/surface/secondary` — and, critically, it was the **only** token for
  indicator color: both `Default`'s and `Secondary`'s Indicator instances were bound to the exact same
  variable ID. Same historically-fixed anti-pattern as Collapsible's `icon/fg/generic` (a "generic" token
  that actually only ever held one variant's real color).
- `root/bg/default` resolved to `bg/page`, and `root/bg/onPrimary` (used by the `Secondary` variant) resolved
  to `bg/default` — both are page-canvas background tokens, not anything scoped to "this component's own
  track surface."

**First read: assumed the shared indicator was a bug and proposed fixes for both.** Before touching Figma,
this was raised with Carol rather than acted on — matching the project's standing rule to confirm before
inventing missing pieces. Her answer reframed the whole problem: she pulled up the actual Sistema Origen
file (not the cleaned CS Design System copy) and pointed at something neither of us had considered — in
Sistema Origen's own Variants panel, the property is literally named `Secondary`, but the documentation
text on that same page describes it as `onPrimary`. That mismatch predates CS Design System entirely; it's
baked into the reference system itself. With that context, the shared indicator color turned out to be
intentional, not a bug — Sistema Origen's own reference renders the same indicator color in both columns.
The real axis was never "which brand color" — it's "what surface does this progress bar sit on."

**Carol renamed the Figma variant from `Secondary` to `onColor`** — a better name than either `Secondary` or
`onPrimary`, since the actual need is a track that reads on *any* colored surface, not just the app's teal.
Same naming principle CLAUDE.md §5 already establishes for `fg/icon/onColor` (name by the contrast being
solved, not by where the value happens to come from). She then built out a 4-quadrant test — `bg/default` ×
`bg/page`, each in Light and Dark — with real component instances to check the track's actual visibility,
and shared screenshots. The result: `Default`'s track was invisible on `bg/page` in both modes, `onColor`'s
was invisible on `bg/default` in both modes, and even the best case for `onColor` on `bg/page` in light mode
had weak contrast. This was verified with real WCAG contrast-ratio math (relative luminance computed from
each token's resolved hex), not just eyeballing: most gray candidates in the palette landed between ~1.1:1
and ~2.6:1 against near-white surfaces — well under the 3:1 minimum for graphical objects — while the one
token strong enough to clear it (`borderColor/emphasis`, near-black/white) was too heavy for a subtle track.
A third, unrelated bug turned up in the same pass: the renamed `onColor` token still pointed at `bg/default`,
which inverts with the theme — in dark mode it would have gone nearly black, exactly the Loading Spinner
bug pattern, just not yet caught here.

**Carol fixed both track bindings herself in Figma**, re-verified with the same 4-quadrant screenshots:
`root/bg/default` → `bg/subtle` (a real, visible gray) and `root/bg/onColor` → `bg/onColor` (fixed white in
both modes, not the inverting `bg/default`). All four quadrants read correctly after the fix.

**CODE.** `ProgressBar.jsx` exposes `variant="default"|"onColor"` (never `"secondary"` — reintroducing that
name would reintroduce the exact confusion this session untangled), a free-form `value` 0–100 (Figma's
0/20/50/80/100 are just preview steps, not a real constraint), and `showLabel`/`showHelperText` booleans
matching Figma's own properties panel. Label and Helper text turned out to share the literal same fill
variable in Figma (`fg/default`) — checked directly rather than assumed, since a dimmer helper-text color
would have been the more common pattern. Helper text also turned out to use its own smaller type scale
(`fontSize/body/2xs` = 12, vs. the shared `HelperText.jsx` atom's `fontSize/body/sm` = 16) — so it renders as
plain local text rather than instancing that atom, since it isn't actually the same visual spec. Verified
live: 5 values × both variants, `onColor` placed on a real teal surface, light and dark — all four
previously-broken combinations now read with real contrast.

**Carol asked to stress-test `onColor` against more than just teal**, right after the branch was pushed.
The test bench grew to 7 real surfaces (`bg/primary`, `bg/secondary`, `bg/tertiary`, `bg/error`,
`bg/success`, `bg/info`, `bg/inverse`). Two real limits surfaced that the earlier track-contrast fix didn't
touch:

1. On `bg/surface/secondary` (pink), the indicator all but disappears — it's the same brand pink as the
   surface it sits on. The other six surfaces all read fine.
2. Neither Label nor Helper text has an `onColor`-specific color — both use the fixed near-black `fg/default`
   regardless of variant. On a genuinely dark surface like `bg/inverse`, the text goes effectively invisible
   even though the track and indicator still read perfectly there.

**Carol's call: document the boundary, don't redesign the component.** `onColor` is scoped to medium- or
subtle-saturation `bg/surface/*` surfaces — *except* `bg/surface/secondary`, the one case that actually
fails. That rule now lives in both `ProgressBar.jsx`'s docstring and the `tokens.css` Component block, since
neither the token names nor the component's props make it self-evident. Nothing in the token bindings or
the component itself changed — this was a scope note, not a new bug to fix.

### LoadingSpinner's `inverted` renamed to `onColor` (3 September 2026)

While building Progress Bar the same day, "onColor" was settled on as the clearer name for this exact
pattern — a color that stays fixed regardless of theme, meant for placement on any colored surface (see
CLAUDE.md §5). Carol applied the same rename here: Figma's `Color=Inverted` variant became `Color=onColor`,
and `borderColor/inverted` became `borderColor/onColor` (`Primary` stayed as-is — it's a real brand color
choice, not a surface-placement axis). Updated in `tokens.css` and `LoadingSpinner.jsx`. Worth flagging
explicitly: this is a public API change (`color="inverted"` → `color="onColor"`) on an atom that was already
merged into `main`, not just a documentation touch-up.

### Segmented Control built — closes Sprint 4 (3 September 2026)

**Carol flagged this one before EXPLORE even started**: she'd never used this component pattern in her
career at Sistema Origen, and the Figma component "está muy mal construido." That turned out to be an
understatement, and it's why this "low complexity" sprint item ended up being the longest session of the
four.

**The composition problem.** Node `18913:10366` — a set enumerating `Number=2..5 Step` × `Selected=1st..5th`
as 14 fixed variants, each with a hand-placed count of `.Segment` instances. No axis represents "N segments,
none selected," nothing composes past 5, and the underlying `.Segment` atom itself (`19052:3459`) had only a
`Size` axis — no Hover, Focus, or Pressed states existed yet. Exactly the enumerate-instead-of-compose
antipattern this project already avoids in Table, CellActions, and FileSelector — so the call, confirmed
with Carol, was to ignore Figma's `Number×Selected` structure in code entirely: `SegmentedControl.jsx`
composes an arbitrary-length array, no ceiling at 5.

**Two smaller real bugs on `.Segment` itself, found while reading its tokens**: a stray `Behavior=New value`
variant (×3, one per size) — dead Figma cruft, never renamed after a duplicate — and Large's internal gap
bound to a different token namespace (`segment/gap/generic`) than Small/Medium's (`rootSegment/gap/generic`)
for the identical concept.

**Carol built the missing states herself in Figma, in parallel with EXPLORE** — the pattern for this whole
session. For the focus ring, the real technique came from Checkbox, not Icon Button's original (fragile,
fixed-position) approach: two frames with auto-layout + hug, one stroke (`focus-inner`) on the inner content
frame, another (`focus-outer`) on the outer wrapper — no absolute positioning, no geometry to keep in sync
if content changes size later.

**First attempt at the ring landed on the wrong node** — an orphaned `.States/Focus/Unselected` component
sitting outside the real `.Segment` set, left over from an earlier exploration pass. Carol caught it
("creo que lo has hecho donde no debías!!!") and pointed at the real set (`19052:3459`). Redone correctly
across the 6 real Focus variants; the orphan was deleted once confirmed unused elsewhere.

**Three real bugs surfaced while building those 6 variants:**
1. The outer wrapper's `cornerRadius` was `0` instead of `inner radius + padding` (`10`, not `0`) — with a
   rounded inner shape sitting inside a square-cornered outer ring, the gap between the two rings was uneven,
   visibly wider right at the curve. Carol's screenshot made this obvious at a glance.
2. Creating the new wrapper frame copied padding, fill, and corner radius from the original — but not
   `primaryAxisAlignItems`/`counterAxisAlignItems` — so the label lost its centering in all 6 Focus variants.
3. The three size-scoped Hover+Selected variants used `bgMix/hover` (the token meant for the *unselected*
   background) instead of `bgMix/hover-selected`, and were missing the base `bg/selected` fill entirely —
   without it, "hover while selected" rendered as a near-transparent gray wash instead of a lightened black.

**A structural-consistency rule, stated by Carol, that reshaped the whole approach:** every variant of a
component should share the same layer structure — the new wrapper had only been added to the 6 Focus
variants, leaving them structurally different from the other 18 and breaking cross-variant multi-select (a
real Figma workflow, not just an aesthetic preference). The same wrapper — invisible except where focus
paints a stroke — was extended to all 24 real variants. Carol then simplified further, removing the `.Label`
sub-frame that wrapped each segment's text now that multi-select confirmed the structure was sound; plain
text directly inside `segment` was enough.

**CODE.** `SegmentedControl.jsx` takes `segments` (array), `selectedIndex`, `onChange`, and `size`. Real
`<button role="radio">` elements per segment, states handled entirely through native pseudo-classes: `:hover`
via a `::before` overlay (same mechanism as Chip), `:active` via `opacity` (same mechanism as Icon Button —
Figma's `bgMix/pressed` turned out to be a flat 80% opacity, not a color-mix overlay like hover), and
`:focus-visible` via a combined `outline` + `box-shadow` double ring (same CSS trick Icon Button already
uses — no need for Figma's two-frame technique once it's just CSS). Verified live: three sizes, hover,
keyboard focus, `:active`, dark mode, and a 7-segment case specifically to confirm there's no hidden ceiling
at 5.

### Accordion built — opens Sprint 5, two real IP leaks found (8 September 2026)

**Carol asked for a real cleanup pass before any code, not just a token sync.** Her words starting EXPLORE:
"está mal hecho o se quedaron a medias simplificando" (badly built, or someone stopped halfway through
simplifying it). That turned out to be accurate, and worse than the usual mis-bound-token pattern this
project has caught repeatedly — this time it was actual leaked source data, not just confusing names.

**Leak #1 — a literal real typeface name, hiding behind a correctly-bound token.** `get_variable_defs`
reported the title's `fontFamily/default` as `"<tipografía de La Empresa>"` — the real name of a real company's typeface. The
suspicious part: the text node's Variable binding for `fontFamily` *did* correctly point to the project's
own `fontFamily/default` (which resolves to Nunito everywhere else in the file, confirmed by walking its
full alias chain). Figma allows a text node's rendered font to be manually overridden after a Variable is
bound, without breaking the binding metadata — so the token *looked* fine from the binding alone. Only
checking the node's actual `fontName` property directly (`{family: "<tipografía de La Empresa>", style: "Bold"}`) surfaced it.
Swept all 12 text nodes across the 8 variants by data — exactly one was affected. Fixed by setting the real
`fontName` to Nunito Bold; the binding itself needed no change.

**Leak #2 — a border color bound to an unresolvable external-library variable ID.** The title's top-border
stroke (the separator between stacked accordion items) carried a `boundVariables` reference in a long-hash
external-library ID format, not the short local-ID format every other variable in this file uses.
`getVariableByIdAsync` returned `null` for it — a dead reference to a library that isn't available in this
context, most likely Sistema Origen's own live file. The cached color that kept rendering (`#0d0804`) didn't
match the system's real black (`#050506`) anywhere else. Re-bound to `borderColor/default` (`#9AA1AA`) — the
same local token the bottom `Border` rectangle already used correctly, which also unifies what had been two
different color values doing the same conceptual job.

**A real inconsistency surfaced in the same pass**: checked whether that top stroke was present across all 8
`State × Version` variants, by data rather than by eye — it was on all 4 `Expanded` variants and on `Focus,
Collapsed`, but missing from the other three Collapsed states (`Initial`/`Hover`/`Pressed`). Added to all 8
so the separator no longer depends on interaction state.

**The component's real shape, confirmed rather than assumed.** The actual component set only has a
`State × Version(Expanded/Collapsed)` axis. The "Open/Closed × Last/Not-last" rows on Figma's documentation
page aren't real variants at all — they're several real component instances stacked to demonstrate how the
top-border-as-separator mechanism reads in an actual list (a middle item's top border does double duty as
the item above it), which needed inspecting the node tree to confirm rather than infer from the doc page.
One more orphaned token turned up while tracing this: `accordion/all/text/fg/generic` no longer resolves to
any local variable and nothing in the component consumes it (confirmed by searching every node's bound
variables) — left out of the code entirely rather than guessed into a token. `button/bg/pressed` is named
like a color but is actually consumed as a plain `opacity` (80%) applied to the whole title+action row, not
a color-mix — same mechanism already used by Icon Button and Segmented Control's pressed state.

**CODE.** `Accordion.jsx` renders one item per instance — it doesn't own a list or track which item is open,
same boundary as Tabs/TabItem. `isLast` is the only prop controlling the closing bottom border; the top
border always paints. One real bug surfaced in CODE, not Figma: content text rendered center-aligned because
of Vite's global boilerplate `text-align: center` — the exact same bug already hit once on Inline
Notification — fixed with an explicit `text-align: left`. Verified live: a real 3-item stacked list with
`isLast` on the last one, toggle, hover, keyboard focus, and dark mode.

### Accordion tokens actually simplified, not just re-bound (8 September 2026, same day)

**Carol's response after seeing the fixed-but-not-simplified result was direct:** she'd explicitly asked for
the component tokens to be simplified, not just correctly bound. She'd also improved the Figma
documentation page in the meantime — removed the "Not last" demonstration rows (they only showed a
composition effect, not a real variant) and added an "Accordion setup" section for designers: build a
vertical auto-layout with 0 gap, mark only the last item "Last" — confirming the exact same mental model
`isLast` already encodes in code.

**First pass at consolidation, then a real correction.** The initial proposal collapsed title, body, *and*
icon color into one token. Carol pushed back: "recuerda que distinguimos entre textos e iconos... los
padres del grupo deben ser bg, fg, border" — the project's actual convention nests `text`/`icon` one level
inside `fg`, it doesn't collapse them together just because today's value happens to match. Corrected:
title and body (both genuinely text) now share one `accordion/all/fg/text/generic`; the icon keeps its own
`accordion/all/fg/icon/generic`, already correctly scoped to `STROKE_COLOR` in Figma — confirmed by
checking the variable's actual `scopes` property before assuming it needed fixing, since this system's
icons render via stroke, not fill.

**Border tokens**: six fragmented entries (`title/borderTopColor`, `title/borderBottomColor`,
`title/borderTopWidth`, `title/borderBottomWidth`, `content/borderBottomWidth`, `content/borderBottomColor`)
for what was conceptually one 1px line in one color. `content/borderBottomColor/generic` (`#eeeff1`) turned
out to be a genuinely different color from the rest, feeding a stray stroke that existed on only one of the
eight variants — real cruft, removed along with that stroke. Collapsed to two:
`accordion/all/border/color/generic` and `accordion/all/border/width/generic`, re-bound across all eight
variants.

**Deleting the old variables surfaced three more layers of vestigial bindings** — `Title + Action` and each
variant's own top-level frame both carried leftover `strokeTopWeight`/`strokeBottomWeight` variable
bindings with no actual stroke paint attached, blocking deletion of the old width tokens until cleared.
None of it had any visual effect; all of it was real clutter once found.

`accordion/all/text/fg/generic` (the orphaned token from the earlier leak-fixing pass) was deleted from
Figma outright this time, not just left unused in code. `button/bg/pressed` was renamed to
`accordion/all/opacity/pressed` — it was already a `FLOAT` variable already applied as real node `opacity`,
so the rename was the only actual fix needed; same mechanism Icon Button and Segmented Control already use
for their own pressed states. Verified with a screenshot after each phase: zero visual regression across
all eight variants. `tokens.css` and `Accordion.jsx` updated to match (`--ds-accordion-fg-text`,
`--ds-accordion-fg-icon`).

### isLast briefly removed, then restored; AccordionGroup born (8 September 2026, same day)

**Two more manual fixes landed in Figma while this was in progress, both found by Carol working directly in
the file.** First: a real bug in her own "Accordion setup" documentation demo — the auto-layout frame
wrapping the "Expanded" column had `itemSpacing: 114` instead of `0` (the "Collapsed" column's wrapper was
correctly `0`), confirmed by reading the property directly rather than eyeballing the screenshot. Fixed, and
re-verified with a fresh screenshot showing the four items flush against each other. Second: the focus ring
on `Title + Action` only had its left/right sides at the focus stroke weight — she corrected it to all four
sides.

**A third change had a bigger consequence than a visual tweak — and it turned out to be temporary.** Carol
tried switching the trigger's border from top-only to top-*and*-bottom on the `Title` frame. With every item
painting both edges, the `isLast` mechanism looked redundant: in a stacked list, one item's bottom border and
the next item's top border would land on the exact same pixel with the exact same color and weight. `isLast`
was removed from `Accordion.jsx` on that basis. Carol reverted the Figma change shortly after, though — the
separate `Border` rectangle gated by the `Last` component property was still needed, so `Title` went back to
top-only. She flagged it directly: "había ignorado el border, pero como es necesario he aplicado los strokes
de nuevo, así que revisa de nuevo." Re-checking the live Figma state confirmed it: `Title` is top-only stroke
again, `Border` still exists and still carries its own bottom stroke. `isLast` was restored to
`Accordion.jsx`, matching the original two-part mechanism. Lesson: confirm the *current* Figma state before
trusting an earlier observation, especially in a session where Carol is editing in parallel.

**A real bug also surfaced in code, prompted by a direct question**: "¿por qué el texto del content no hace
fill horizontal?" `.ds-accordion__content` is a `flex-direction: column` container, and `{children}` as a
bare string renders as an anonymous flex item — which browsers don't stretch to fill the cross axis the same
reliable way a real block element does (the classic flexbox `min-width: auto` gotcha). Fixed by wrapping
`children` in an explicit `.ds-accordion__content-inner` div, giving the fill behavior something real to
target.

**`AccordionGroup` organism, `src/organisms/`.** Carol asked directly: shouldn't there be an Accordion
organism, the same way Table wraps the Cell family? The itemSpacing bug above is the concrete argument for
it — if assembling a list depends on every designer or developer remembering "0 gap, only mark the last
item," someone will eventually get it wrong, exactly as just happened in Carol's own demo. `AccordionGroup`
takes an `items` array and renders N `Accordion` atoms with `gap: 0` hard-coded on the organism itself, not
left as something a consumer could mis-set, and applies `isLast` automatically to the last item — the
consumer never sets it by hand. `multiple` (Carol's explicit ask) controls whether more than one item can
stay open: `false` is the classic single-open accordion, `true` lets each item toggle independently.
Verified live, with the `isLast` mechanism back in place: both modes, toggling, hover, light and dark mode.

### Drawer built, `SidebarMenu` organism born from it (15–17 September 2026)

**Drawer turned out to be a simple collapsible rail, not a full content drawer** — Carol's own description:
"un simple contenedor," something La Empresa wanted for the beta catalog. Before code, the 30-variant
component set got audited the same way Accordion did: 16 position-based icon color tokens
(`iconLeftTop`/`iconTopLeft`/etc.) turned out to be 12 orphans never bound to any real node, plus an empty
`web` namespace — collapsed to 4 real tokens (`root/bg-primary`/`-secondary`, `border/color`/`width`) plus one
new one, `icon/fg/generic`, since none existed despite 12 icons needing a color. The real property axes
(`Color`, `Style` dismissable/standard, sparse `State`, `Anchor` left/top, `Icon Placement`, `Show Divider`)
were confirmed by inspecting real variant data, not assumed from the property panel — several were fixed live
by Carol mid-session (missing border/radius on specific variants, icon layers renamed from position-based to
state-based, then reverted to a plain `Icon` for `Style=Standard` since that slot has no expand/collapse
semantics at all — "la standar no se expande ni colapsa, y el usuario puede meter cualquier icono").

**`Drawer.jsx`** — icon is keyed to STATE, not a fixed position: `icon` shows collapsed, `expandedIcon` shows
expanded (falls back to `icon`), always pointing toward the anchor edge — a real v0 Figma bug fixed alongside
Carol. Two CSS bugs found in the test bench, not in Figma: the border was missing on Collapsed (moved
background/border/radius to the unconditional base rule once confirmed identical in both states by data), and
the icon rendered centered instead of respecting `iconPlacement` — the real offset is a FIXED pixel value (20px
anchor=left, 16px anchor=top), which only *looks* like centering in the narrow Collapsed state.

**`SidebarMenu.jsx` (new organism)** composes Drawer (the shell) + `Headline` (`level={6}`, the title) +
`ListView` (each row) — zero new atoms, same reuse discipline as Country Picker/Combobox instancing
`SelectorListItem`. `items` is a real recursive tree up to 3 levels (Parent/Child/Grand son, a 4th level
renders like the 3rd rather than failing silently), and branch expand/collapse is internal state that
auto-expands the branch containing `selectedId` on mount. The Right Panel chevron only appears on rows that
have children, and — this is an explicit a11y rule documented on the Figma page, not just a styling choice —
a chevron row never navigates, it only shows or hides its own children.

**Built in Figma too, deliberately as a reference composition rather than a single locked component.** Carol's
first attempt (`node 32090-92873`) was a real Figma `COMPONENT` with nested List View instances and the Drawer
manually set to absolute position ("el drawer queda en posición absoluta, he tenido que ajustarlo a mano") — a
lot of manual work, and too rigid to support an arbitrary number of parents/children. Abandoned on purpose,
same reasoning already applied to Table/CellActions/ButtonBar/FileSelector: no monolithic Figma component,
just a composition guide built from pieces that are already real components. A full documentation page was
built instead (`node 32090-91349`: Header bar / Intro / Instanced components / "How to compose a Sidebar
Menu" / "Usage limits"), with two live examples side by side — a 3-level hierarchy, and an "8 Parent max"
pair (Initial-on-page-load vs. Expanded).

**Real spacing tokens, not just color ones.** `sidebarMenu/all/title/padding/horizontal-top-bottom` (16/16/8,
formalizing the `padding: 16px 16px 8px` the CSS already had by hand) and `sidebarMenu/all/indent/step`
(16px per level). The indent step could NOT be bound as a position variable in Figma — `setBoundVariable`
rejects the `x` field outright — so the real fix was nesting nested frames with `paddingLeft` bound to that
same token instead of loose x-coordinates (Grand son = two levels of nesting = 2×step). The JS side never had
that problem: it already read the token through `calc()`.

**Max 8 Parent items, enforced with a dev-warn** (same pattern as CellActions' `>2`, doesn't block render) —
justified by a real visual constraint: the collapsed rail shows every icon at once, with no comfortable
scroll. Child/Grand son were deliberately left WITHOUT a fixed number — information-architecture
recommendations instead (group by task not by org chart, keep sibling branches balanced, order by frequency
of use, avoid a lone child, reserve Grand son for genuinely distinct sub-views) — Carol's own call after being
offered the choice between a number and UX/IA guidance.

**Two more real bugs, both found by Carol working directly in Figma, both matching a pattern this project has
hit before (a value silently inheriting from the wrong place instead of carrying its own token).** First: the
Drawer `Container`'s stroke was `strokeAlign: INSIDE` across all 30 variants — any full-width `children` (the
Parent-level rows in SidebarMenu) painted right over the inside-aligned border by construction, since the
border lived inside the exact area the content was allowed to paint. Fixed to `OUTSIDE` on the master
component, all 30 variants — not a patch on the reference composition — so the border now paints outside the
declared box, where no content can ever cover it again. No code change needed: `box-sizing: border-box` on
`.ds-drawer` already keeps the border in its own layer outside the content area, so this bug only ever existed
in Figma's manual composition, which has no real box model. Second: the Right Panel chevron had no `color` set
at all in `.ds-sidebar-menu__chevron`, so it inherited black from the row's text via `currentColor` instead of
teal — `Icon.jsx` never sets its own color by design. Fixed with a new token,
`--ds-sidebar-menu-chevron-fg-primary` (aliased to the same fixed teal the Drawer's own icon already uses).

**A third bug, caught by Carol comparing code and Figma side by side with two screenshots.** The chevron used
`ChevronRight` rotated 90° when expanded — the right mechanism (a single icon plus a CSS rotation, not two
swapped icons — Carol asked directly whether that was intentional; it is, `InputCombobox` already does the
same thing with `ChevronDown`/180°) but pointing the wrong way relative to Figma: Collapsed ended up pointing
right and Expanded ended up pointing down, which is exactly what "collapsed" means in Figma's own convention
(chevron-down = collapsed, chevron-up = expanded). Fixed to `ChevronDown` + `rotate(180deg)` on expand, the
same mechanism `InputCombobox` already uses, now with the right icon: Collapsed points down, Expanded points
up, matching Figma.

**A fix added to the same branch after PR review, at Carol's request: clicking outside SidebarMenu collapses
it.** There was no real dismiss mechanism — clicking elsewhere in the app while the menu was expanded left it
open. Fixed by reusing `usePopoverDismiss` (the same helper PopoverSheet, Combobox and Country Picker already
share) over a real ref to the underlying `Drawer` — which gained `forwardRef` on its root `<div>` for exactly
this (non-invasive: every existing usage without a `ref` keeps working unchanged). The effect is only active
while the Drawer is expanded, so it can only ever collapse it, never auto-expand it. Escape does the same,
free from the same hook. Documented in Figma too ("Usage limits").

### Slider family built — first component with real drag interaction (9 September 2026)

Carol handed over four starting node-ids (`.Knob`, `Continuous`, `Range`, and "Segmented" — the last one
turned out to be a text paragraph listing node-ids, not the component itself; the real one, `4620-1532`,
surfaced later). Before code, several real Figma bugs surfaced: four variants of the value tooltip had their
text literally set to `"%"` with no leading digit, which shrank the knob's HUG frame and threw its absolute
position 10px outside the track, overlapping the icon — a content bug cascading into a position bug, not a
position bug on its own; 16 Continuous variants had their fill bound directly to `color/primary` (Base layer),
skipping Component and Mode entirely, re-bound to `slider/all/indicator/fg/primary`; and a first bulk rename of
`Slider (adjustable)`→`.Track` / `Base`→`.Indicator` across 74 instances, done by analogy without checking the
real binding first, turned out to be backwards for Continuous (the OUTER layer paints the full color, the
INNER one is a gray mask with variable `paddingLeft` covering the untraveled part) and the opposite mechanism
again for Range — fixed layer by layer against the real bound variable, never by analogy again. `.Segment`
(the stepped-slider point+tail piece) had been accidentally deleted earlier and was restored from Figma's
version history; the restored master had no `Variant` axis at all and painted pink unconditionally
(`bg/secondary` from Mode, skipping Component the same way) — an 8-variant axis was added and re-bound to the
same `indicator`/`track` tokens the rest of the family already used, no new tokens.

**Architectural call: Continuous and Segmented stay separate, in Figma and in code.** A real attempt was made
to merge them — add a `With Steps` property to Continuous and transplant `.Segment`'s content into its
`.Track` — and it broke knob positioning twice (the track's fixed 8px height had no room for a 58px knob;
then the old mask's inherited `paddingLeft` pushed the points into the right half of the track), which is what
exposed the layer-naming bug above. Carol reverted the experiment by hand. Conclusion, confirmed explicitly:
the internal mechanism really is different (fill+mask vs. a chain of `.Segment` instances), not a visual
variation — forcing one component (in Figma or in React) would just move the same complexity into an `if`,
not simplify anything real. They share tokens (`--ds-slider-*`), not a component.

**Code** — three atoms (`Slider.jsx` continuous, `RangeSlider.jsx` two values, `SteppedSlider.jsx` discrete
stops) share a non-exported helper, `_sliderKnob.jsx` (same pattern as `_dialogBase.jsx`), which instances the
`Tooltip` atom for the value bubble instead of reimplementing it — `Tooltip.jsx` gained a `forceVisible` prop
and a `style` prop for this, since its original `:hover`/`:focus-within` mechanism doesn't cover a mouse drag
that leaves the knob's hit area while still active. First component in the system with real Pointer Events
drag (`setPointerCapture`/`onPointerMove`/`onPointerUp`) plus keyboard (arrows ±step, Home/End) — everything
before this resolved entirely with native `<button>` pseudo-classes. A real code bug, not a Figma one: clicking
the TRACK (not directly on the knob) moved the value but never moved DOM focus to the knob, breaking immediate
keyboard navigation afterward — `.focus()` called inside `pointerdown` can be overridden by the browser's
default focus behavior firing right after; fixed with `e.preventDefault()` on `pointerdown` before calling
`.focus()`, the standard pattern for custom sliders.

### Combobox built — jumped ahead in priority order at Carol's request (10 September 2026)

Four starting node-ids: `.Combobox`, `Input combobox`, `Selection cells` (derived from `List View`) and
`Picker`. Carol asked to simplify tokens before touching code, same discipline as Accordion/Slider:
`inputIconLeft` + `iconDropdown` (same teal value, same generic-icon concept) merged into
`combobox/all/icon/fg/generic`; `valueText` renamed to `combobox/all/text/fg/generic`. `caret` deliberately
kept its own separate token — it isn't an icon, it's the blinking text-cursor vector (a 30×0 stroke, confirmed
by inspecting the layer, not assumed), coinciding in value today by coincidence, same reasoning already fixed
for Accordion's text-vs-icon split.

A real bug was found in `List View` along the way: its two direct children (`.Left Panel` /
`Center + Right Content`) were `layoutPositioning: ABSOLUTE` inside a parent that WAS auto-layout — the
auto-layout existed but was completely inert, nothing reflowed when elements were shown or hidden, exactly the
symptom Carol had reported. Fixed across all 20 variants by setting both to `AUTO`; a positive side effect was
fixing a pre-existing 2–4px misalignment between the 24px and 20px (Disabled) icon sizes.

**A real back-and-forth on the Picker's architecture — from `ListView` to `SelectorListItem`.** First finding:
"Selection Cells" faked its `Selected` state with a manual 4-side border (`borderColor/primary`, a Mode-layer
color, skipping Component) laid on top of an instance that actually had `Selected=false` — the real `ListView`
selection mechanism (the left-edge ribbon, built in Sprint 2) was never being used. Fixed to real
`Selected=true` plus the fake border removed. But reviewing the result, Carol preferred to pivot the Picker to
`SelectorListItem` (already built, Sprint 1) instead of `ListView`: `data="single"|"multiple"` maps 1:1 to the
organism's `multiple` prop, giving a real Radio/Checkbox, and the full 4-side border IS `SelectorListItem`'s
legitimate selection mechanism (not a hack) — more legible in an N-result dropdown than `ListView`'s thin
ribbon. The `ListView` fix stays (correct for its normal Search-for-Results use); Combobox's Picker simply
reuses a different existing atom.

**Code.** `InputCombobox.jsx` (atom) borrows `--ds-input-*` the same way InputText/InputDropdown do for
Label+Helper+Field+Validation. `multiple` decides plain text vs. real chips (`Chip type="input"`, already
built). The text cursor is never hand-built — a real `<input>` already ships one, all that's needed is
`caret-color`. `autoSuggestText` (gray autocomplete-style suggestion) uses the classic overlay technique: an
invisible layer with the typed text plus the remaining suggestion in gray, sitting behind a transparent-
background input. `Combobox.jsx` (organism) owns all real state: open/close, filtering, keyboard-highlighted
index, click-outside close, single/multiple selection. Four real code bugs found and fixed: a stray delete
button floated with no clear purpose once chips already had their own X (removed for `multiple` mode);
autosuggest failed on a case mismatch ("fr" typed vs. "Francia" — comparison made case-insensitive); clicking
empty space in the field (not directly on the `<input>`) didn't focus it (fixed with click-to-focus on the
whole field); and that fix in turn exposed a fourth bug — selecting an option re-focused the input, which
fired `onFocus` and reopened the picker with the just-picked option as the only filtered result — fixed with
the standard `onMouseDown` + `preventDefault()` pattern on the Picker panel, so a click there never steals
focus from the input in the first place. The Picker's positioning is local `absolute` — no shared
popover/positioning system yet, the same debt Country/Currency Picker already carried, deliberately left for
Popover Sheet's turn.

### Country Flag + Country Picker built — closes real technical debt (11 September 2026)

Not on the numbered sprint list — `InputTelephone` had fired `onCountryClick` for a while with nothing to
handle it. Node-ids: `Selection cells` (22974-9064), `Country Picker` (22974-9071). EXPLORE confirmed the same
architectural pivot Combobox had just landed on, already real in Figma: the Picker's rows are literal
instances of `Selector List Item` (the same component set `SelectorListItem.jsx` already uses) with
`Right Panel=false`, so the full border is already the only selection signal in the design. The root panel
reuses `combobox/all/root/bg/generic` literally — same token as Combobox's Picker, not a new one. Unlike
Combobox, there's no search field here, matching Figma's own `Country Picker` (no search field there either).

**Code gap, not a Figma one.** `SelectorListItem.jsx` had no way to (1) replace its fixed `file-text` icon with
a flag, or (2) hide the Radio/Checkbox. Two props were added — `icon` (a free `ReactNode` slot) and
`showControl` (boolean) — mirroring `Left Panel`/`Right Panel`, real Figma properties the atom simply hadn't
exposed yet.

**A real architecture bottleneck, resolved with a bulk export from Figma.** Carol wanted real flags, not the
emoji `InputTelephone` already used — Figma's `CountryFlag` component set (node `30831:2867`) already had all
201 real flags, each with its own vector, nothing to build there. The real work was in code: `Icon.jsx` is a
lucide-react-only wrapper (one color via `currentColor`), incompatible with real multicolor art. All 201 were
exported via `node.exportAsync({format:'SVG_STRING'})` into `flags.js` (slug → raw SVG) — verified
programmatically, 201/201 present, none malformed. **A real operational lesson:** requesting SVGs in batches
of ~23 silently truncates the response around ~20KB with no warning — batches of 5 or fewer are needed, and
flags with very complex vectors (`sri-lanka`, `saudi-arabia`) had to be requested alone; `saudi-arabia`
exceeded the limit even alone and was resolved with `download_assets` (URL + direct download) instead of
inlining the SVG in the plugin response. An attempt to hand-write `sri-lanka` from memory instead of copying
the already-received data produced wrong content — caught by diffing against the real fetch; lesson: never
reconstruct already-fetched data from memory, only reuse the literal.

`CountryFlag.jsx` injects the SVG via a data URI inside an `<img>` — never `dangerouslySetInnerHTML`. The
corner radius (2px) lives on the wrapper rather than depending on each SVG bringing its own crop, so all 201
stay visually consistent even though `saudi-arabia` (exported through the alternate path) doesn't include one
on its own. `CountryPicker.jsx` composes `SelectorListItem` (`icon`=`CountryFlag`, `showControl={false}`) plus
the same panel chrome as Combobox. A real code bug, caught live by Carol: the test bench passed a fixed
`flagEmoji` to `InputTelephone` that never updated on picker selection — the dial code changed but the flag
didn't, because `InputTelephone.jsx` only ever accepted a static `flagEmoji` with no mechanism to reflect a
real selection. Fixed by adding a `flag` slot (`ReactNode`, defaults to `undefined` so it falls back to
`flagEmoji` — no breaking change for existing consumers).

### Popover Sheet built, rewritten as v1.1 the same week after its first review (14–15 September 2026)

Node-ids: `Popover Sheet` (3291-16275), `Pointer` (3291-16348) — a real `COMPONENT_SET` with `Placement`
(Top/Bottom/Right/Left) × `Pointer` (Left/Center/Right) + `Close Button` (boolean). No predefined content in
Figma (`Cross Frame` only holds the close icon) — same slot-based pattern as Dialog/ErrorAndEmptyState.

Two Figma cleanups before code, both at Carol's request: six fragmented, unbound padding tokens
(`paddingHor/top-generic`, `paddingTop/top-generic`, etc., all worth 8) with no real `boundVariables` on the
`Cross Frame` (padding was hardcoded 8/0/0/8) consolidated into one real `popoverSheet/all/root/padding/generic`
token, properly bound this time — a seventh orphan (`paddingHor/bottom-generic`) surfaced only on a second
sweep and was removed too; and a pointless `web` namespace, renamed to `all` (same convention as
Button/Combobox/Tooltip/Accordion: `all` means "identical across every variant," not an empty grouping).

**A real IP leak, worse than the padding orphans — a shadow LIVE-linked to La Empresa's real library.** The
`Elevation/Light Mode/Level02` effect on `Shadow Frame` wasn't broken (unlike `Dialog/DialogShadow` back in
Sprint 1) — `getStyleByIdAsync` resolved it fine, because it was still genuinely CONNECTED to a real external
file, which is worse than a dangling reference. A new local style, `Popover Sheet/Shadow`, was created
(3 layers: radius 5/14/10, y-offsets 5/3/8, spread -3/2/1 — a distinct, more subtle shadow than
`Dialog/DialogShadow`, not merged with it) and reassigned to all 12 `Shadow Frame`s, verified by data
(`remote: false`) and by screenshot.

The same day, `root`/`pointer` background moved from `bg/default` to `bg/container` — the same elevated-surface
bug already fixed for the Cell family back in August turned out to affect Combobox/Country Picker's floating
panel too (`bg/default` is the darkest tone in the whole palette in dark mode, the opposite of an elevated
surface); fixed in Figma and in `tokens.css` for all three components at once.

**v1.1, rewritten the same week after the first `code-review` + verification pass found two real bugs in v1.0**
(a pure atom with no trigger concept at all): (1) the `pointer="center"` arrow centered against the card's own
width (`min-width:200px`), not against the trigger — with a realistically narrow trigger (a 35px `Button
size="sm"` in the test bench) it landed dozens of pixels off; (2) there was no Escape or click-outside dismiss,
only the close button — inaccessible to anyone who can't use a mouse with precision. Carol asked for both fixed
and, in the same pass, to pay off the shared popover/positioning debt this component had owed since Combobox's
build ("le toca a Popover Sheet cuando llegue su turno").

`PopoverSheet` now wraps its `trigger` (a new prop, replacing the earlier pattern where the consumer supplied
its own `position:relative`) — it measures the real trigger with `ResizeObserver` and exposes
`--ds-popover-anchor-width/-height`, which the centered arrow consumes via `calc()` instead of its own `%`
(measured misalignment: ~82px in v1.0 → 0.08px in v1.1, same 35px trigger). `_popoverDismiss.js` was extracted
as an internal helper (same pattern as `_dialogBase.jsx`/`_sliderKnob.jsx`) with the click-outside + Escape
mechanism — a real consolidation: Combobox and CountryPicker each had their own near-identical `mousedown`
listener; CountryPicker gains Escape (it never had it), Combobox keeps its own more specific Escape-in-the-
input behavior (closes AND resets typed text) via a `closeOnEscape={false}` flag on the shared hook. A real
attempt to annotate the trigger with `aria-expanded`/`aria-haspopup` via `React.cloneElement` — the same
mechanism `Tooltip.jsx` already uses for `aria-describedby` — was tried and confirmed dead on arrival: neither
`Button.jsx` nor `IconButton.jsx` forward unknown props to the real DOM node (no rest-spread), so the ARIA
injection never shipped. This means `Tooltip.jsx` has had the same gap since Sprint 4 — its own documented
usage example never actually wired `aria-describedby` to the DOM. Logged as its own debt entry rather than
fixed here, to avoid mixing debt-closing with this build. The "flip near a viewport edge" part of shared
positioning remains open too — no real consumer needs it yet.

### Step Elements, Step Navigator and Step Indicator built (17–21 September 2026)

Carol shared a real mockup from internal apps and several Figma node-ids already worked on in parallel on her
side — a long, highly collaborative session with several of her own fixes landing mid-exploration, the same
pattern already seen with Collapsible and Slider.

**Early architectural call: Step Navigator (vertical) and Step Indicator (horizontal) split into two
documentation families while sharing real atoms.** Carol made this call explicitly after noticing both use
the same circle with a different connector — instead of duplicating the circle per orientation, a shared
`Node` atom (the circle + number/icon) was created, wrapped by `StepVer` (vertical connectors, for Step
Navigator) and `StepHor` (horizontal connectors, for Step Indicator). The documentation settled into three
frames on one Figma page ("Step Elements", "Step Navigator", "Step Indicator") after a real back-and-forth
about splitting across separate Figma pages instead.

**A real centering bug found and fixed in the vertical atom before the renaming pass — constraint vs.
auto-layout divergence.** A child with `layoutPositioning: ABSOLUTE` and `SCALE`/`STRETCH` constraints computes
its position as a percentage of the parent frame, completely decoupled from a sibling positioned by
auto-layout (the connector lines, pushed by `FILL`). Stretching the parent frame beyond its original width let
the two systems diverge — the number/icon spilled out of the ellipse with two digits. Fixed by wrapping the
auto-layout-positioned element (the ellipse) and the constraint-positioned one (the text/icon) inside a single
fixed-size sub-frame that participates as one atomic unit in the outer auto-layout — guaranteeing they can
never diverge regardless of the outer width.

**Naming unification, 21/09 — the circle stopped being triplicated.** Three nearly identical circle+number/icon
structures existed: the new `.Part` atom, and a duplicate structure inside the old `.Indicator` atom (which
never instanced `.Part`, it had its own Ellipse+Text). Carol unified the name to `.Node` and — after explicitly
asking "couldn't we just instance `.Node`?" inside `.navigatorPart` (her rename of `.Indicator`) — the
duplicated structure was replaced with a real `.Node` instance, closing the last duplication. `.Step` (the
horizontal wrapper) was renamed to `.StepHor` and `.navigatorPart` (the vertical wrapper) to `.StepVer`,
applied to all real instances, not just the masters.

**The same repositioning bug, found TWICE, once per orientation, same root cause.** The `Show
Top/Bottom connector` and `Left/Right connector` booleans were bound to `visible` in Figma — an invisible
child drops out of auto-layout's calculation, so hiding a connector shrank the atom and REPOSITIONED `Node`.
Vertical fix: connectors moved to `layoutPositioning: ABSOLUTE` with a fixed position — geometry immune to
visibility, at the cost of not being able to stretch (acceptable, `StepVer` only ever lives in fixed-width
rows). Horizontal fix, more involved because `StepHor` genuinely needs to stretch (`StepIndicatorLarge` must
fit any page width): normal `FILL` connectors on each side of `Node`, symmetric, so `Node` stays centered as it
grows, and hiding one side naturally and correctly collapses just that side (exactly what's wanted at the
first/last step of a chain, unlike the vertical case). A side effect of the same fix: the label text below
stayed centered against the step's TOTAL width, not against where `Node` actually landed after one side
collapsed — resolved not by manually syncing the text gap to the connector gap (tried, left a ~26px residue),
but by wrapping each connector line in a spacer that is ALWAYS visible and ALWAYS symmetric — the boolean only
turns off painting the line inside the spacer, never the spacer itself, so `Node` (above) and the label's
center (below) line up mathematically without any syncing.

**`Step Indicator Large` — a deliberate choice to have two different architectures, one in Figma, one in
code.** Carol wanted a Figma component with fixed `Number of steps=2..7` variants — the exact pattern this
project has avoided since Sprint 1 (Table/CellActions/FileSelector/SegmentedControl) because code doesn't need
it (`array.map()` with no limit). Here it's justified in Figma: real convenience for designers plus a real
screen-width limit (not every step count fits). Confirmed explicitly that CODE still follows the usual
composition pattern with no limit — `StepIndicatorLarge.jsx` is plain `array.map()` with a dev-warn past 7,
never a hard block.

**Two rounds of real Figma token reorganization.** First round: the 34 existing `steps/all/*` tokens were split
into `steps/common/*` (genuinely shared between Navigator and Indicator, confirmed component by component) and
`steps/navigator/*` (exclusive to the menu hierarchy) — no "Indicator" bucket, since nothing exclusive to it
survived the split (Carol's explicit rule: "if a group ends up empty, don't make a group"). Three real
simplifications along the way: `fg/text` and `fg/icon` resolved to the same color in all 3 states, merged into
one `fg`; `borderWidth` was tripled across circle/connector/substep-connector, all the same value, merged into
one; and `Substep Navigator`'s label was bound to `node/fg/incomplete` (the circle NUMBER's color, matching
black by coincidence) — given its own `root/fg/label` token. Second round, a correction from Carol: `root/bg`
and the three focus tokens turned out to be genuinely shared too (`Step Indicator Small` consumes them as
well) — moved from `navigator` to `common`, and the whole hierarchy nested under one `steps` parent, reflecting
that "Steps" is the Figma page that contains both families.

**Code — 7 files**, verified in the live test bench, not just built: `Node.jsx`, `StepHor.jsx`, `StepVer.jsx`
(atoms) plus `StepIndicatorLarge.jsx`, `StepIndicatorSmall.jsx`, `StepNavigator.jsx`, `SubstepNavigator.jsx`
(organisms). Tokens in `tokens.css` reuse existing Mode-layer values where they already matched
(`--ds-bg-primary`, `--ds-fg-success`, `--ds-borderColor-emphasis`) instead of duplicating hex — only
`--ds-steps-border-width` and the padding/gap/icon-size literals are new, with a direct Figma precedent
(`spacing/xl`).

### Top Navigation, Card and Image built (22–25 September 2026)

Top Navigation is the most composite piece of Sprint 4+5 — genuinely responsive (`__desktop`/`__collapsed`
both render always, a 1024px media query decides which shows, the same mechanism already used for
TabItem/Page Title). Desktop: Logo + `TabItem`×N + an exit Button; a menu item with `flydown` opens a
full-width mega-menu on hover. The mega-menu shape itself only landed after four failed attempts at a compact,
hand-measured dropdown — anchoring it to 100% of the root `<nav>` (`left/right: 0` against the nav, never its
own `width`) is what finally closed all four failure modes at once, following Carol's own reference
(mollie.com/es). Menu height is resolved with CSS columns (`column-width`/`max-height`/`column-fill: auto`),
never scroll, deliberately approximate ("de un vistazo"). Collapsed (<1024px): Logo + a Menu `IconButton` opens
`SidebarMenu` over a `Scrim` — Exit is the last entry inside that menu, not a separate button.

**`Card` (new atom)** is born as the Flydown panel's shell — a generic surface with background/radius/shadow,
only the `basic` Figma variant, but a free `children` slot reusable anywhere a simple elevated surface is
needed. Its shadow (`--ds-card-root-shadow`, a real Effect Style, "Card/Shadow") aliased to Popover Sheet's
shadow purely by coincidence until 23/09, when it was decoupled into its own token so Card doesn't depend on
another unrelated component. In Figma the Flydown itself doesn't instance `Cards` — it's a rigid, `ABSOLUTE`
frame that hand-simulates the same fill/radius/shadow — a problem that never exists in code, where
`TopNavigation.jsx` instances the real `Card` atom directly.

**A flydown group can carry `featured: {...}` instead of `links`** (25/09), closing what had been an open Image
debt — it instances the `Image` atom as-is. `flydownToSidebarChildren` (the tree `SidebarMenu` builds for
mobile) filters `featured` groups out before flattening, since they're decorative content, not navigation —
without the filter, `group.links.map` crashed on `undefined` for a group with no `links`, a real bug found and
fixed while verifying.

**`Image` (new atom)** closes a real Figma-only debt — the component existed in Figma with no code yet.
`size` (1:1/3:2/4:3/16:9) × `variant` (roundedCorners/circle, circle only valid with 1:1) mirrors the same axis
`.Container` had before merging into the real `Image` component set on 24/09. `objectFit: cover` is fixed,
matching Figma's `scaleMode=FILL` across all 5 variants — fixed the same day from `FIT`, which had been leaving
letterbox gaps with real photos. `borderRadius` literally reuses `--ds-card-root-border-radius` (the same
token Figma itself aliases to, `cards/all/root/borderRadius/basic`) rather than getting its own. The fallback
background (`--ds-bg-subtle`, shown when there's no `src`) is a code-only decision, not a pixel-for-pixel port
of Figma's mountain-and-sun placeholder graphic, which represents "no image yet" purely as documentation
artwork.

### Page Title built, Headline extended to a real 3-tier responsive h1 (22–28 September 2026)

Node-id `32244:18450`, 15 Figma variants (`Layout` Horizontal/Vertical/Desktop × `Nav`
Close/Chevron/Link/Text/TextBold/TextDisabled/None/Breadcrumb). Before code, 5 legacy Android/iOS/`.System nav`
component sets were deleted after confirming zero external consumers, and a real "ghost variable" bug was
found and fixed: the nav/action icons were bound to `topNavigation/android/iconLeft|iconRight/fg|size/generic`
— variables that resolved fine by ID and reported `remote:false` (genuinely local) yet were absent from their
own collection's `variableIds` listing, invisible to any collection-scanning search while still actively bound
to 274+623 real nodes. The only reliable fix was scanning every node's own `boundVariables` directly rather
than trusting a collection listing — new `pageTitle/nav/icon/fg|size/generic` tokens were created, the affected
nodes re-bound, and the four ghosts deleted once nothing referenced them.

**A real structural overflow, found by measurement, not by eye.** Headline text (202px) plus action buttons
(112px) needed 314px of room inside a `Content` box that only had 256–288px on the narrowest device. Carol
rejected both the obvious fixes outright — truncating the title ("nunca truncar, no es accesible") and dropping
elements ("nada de quitar elementos") — and rebuilt one reference variant herself in Figma using a different
structure entirely: a top row (nav icon + actions, `space-between`) with the full-width Headline below it, root
height set to auto (hug). That structure was then propagated to the other Horizontal variants, and all 7
`Vertical` variants were deleted outright — Carol's own call: "la vertical carece de sentido," it only moved
the `nav` zone relative to `Content`, it never solved the overflow. Real text wrap (`textAutoResize: 'HEIGHT'`,
`layoutSizingHorizontal: 'FILL'`) was enabled on every Headline instance afterward.

**The `Layout` property became a real `Device` axis (Mobile/Tablet/Desktop)**, with Carol building the Tablet
variants herself and initially swapping the Headline instance's `Variant` per device (Mobile=h6, Tablet=h4,
Desktop=h1) for proportional sizing. That raised a real accessibility question during PLAN: should the
semantic heading level actually change per device (needing JS), or should the level stay fixed with only the
visual size responding to CSS? **Carol's answer: the semantic level stays fixed at `h1`, always — only the
font-size changes** — a page has exactly one real `<h1>`, and swapping it to `<h6>`/`<h4>` on smaller screens
would break that regardless of how it looks. This was implemented at the Figma layer by reverting every
Mobile/Tablet Headline instance back to `Variant=h1` and binding two new tokens per device
(`pageTitle/headline/fontSize|lineHeight/{mobile,tablet,desktop}`) directly onto each text node's instance-level
Typography override, aliased to the values Mobile=h6(19)/Tablet=h4(28)/Desktop=h1(48) already used — the
`level` never moves, only the rendered size does.

**Code simplified the final approach further.** `Headline.jsx` already had a 2-tier h1-responsive CSS mechanism
from an earlier session (`<1024px`→32px, `≥1024px`→48px) — extended to 3 real tiers
(`<768px`→19px, `768–1023px`→28px, `≥1024px`→48px, the 768px cutoff being a new, unprecedented-in-this-repo
Mobile↔Tablet breakpoint, confirmed with Carol as the industry-standard iPad-portrait width). Because that
mechanism already lives inside `Headline.jsx` itself, `PageTitle.jsx` never needed to re-theme font-size
locally the way the original PLAN assumed — it simply instances `<Headline level={1}>` and the sizing resolves
on its own, benefiting every other `level={1}` consumer in the repo too, not just Page Title.

`PageTitle.jsx` (organism) collapses Figma's 8 `Nav` axes into 4 real types plus `undefined`: `icon` (Close and
Back are the same free-icon mechanism, not two fixed variants), `link`, `text` (Text/TextBold/TextDisabled are
the same `Text` atom with a different `weight`/`disabled` prop, not three variants), and `breadcrumb`
(Desktop-only, last item non-clickable plain text — the current page). `actions` is a free array with no fixed
limit (Figma only shows 3 as an example) — a bare clickable icon in `__compact`, a real `Button` (icon+label)
in `__wide`. `nav`/`actions` icon sizing in `__compact` responds via a CSS class keyed to three device-specific
tokens (`--ds-page-title-nav-icon-size-{mobile,tablet,desktop}` = 20/24/32px) rather than a React device prop.
