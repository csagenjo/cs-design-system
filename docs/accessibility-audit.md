# Accessibility audit

**Standard:** WCAG 2.2 AA · **Date:** 09/10/2026 · **Scope:** all 84 pieces
(66 in `src/components/`, 18 in `src/organisms/`), light and dark mode.

The rule going forward: **no accessibility gaps.** This document is the
diagnosis and the plan to get there. Each fix is ticked off here when it
lands, and the component's *Accessibility* section in Figma and in
`docs/component-inventory.md` is updated at the same time.

## Method

| Step | What | Catches |
|---|---|---|
| 1. Code review | Every `.jsx` file read in full against WCAG 2.2 AA and the WAI-ARIA APG patterns: semantics, name/role/value, keyboard, focus, live regions, target size, motion | Most issues; every finding cites `file:line` |
| 2. Automated scan | axe-core 4.10 over a gallery that renders all 84 pieces with every variant and state, light and dark | ARIA misuse, colour contrast of real rendered text |
| 3. Token contrast | Every `--ds-*` colour token resolved in the browser and measured against its surface, light and dark | Text contrast (1.4.3) and non-text contrast for borders and indicators (1.4.11) |
| 4. Verification | Every Critical finding re-checked by hand in the source | False positives |

**Not covered yet** (to add before calling the system clean): real
screen-reader passes (VoiceOver + NVDA), 200 % / 400 % zoom on real
layouts, Windows High Contrast (forced colors) visual check.

## How to run the scan

```bash
npm install                       # first time: installs playwright + axe-core
npx playwright install chromium   # first time on a machine
npm run a11y                      # build the gallery + scan light and dark
npm run a11y -- --strict          # exit 1 if anything fails (for CI)
```

- **Gallery:** `a11y.html` → `src/__a11y/Gallery.jsx` renders every piece in
  `src/components` and `src/organisms` with all its variants and states, one
  `<section data-component>` each. Built with its own config
  (`vite.a11y.config.js` → `dist-a11y/`), separate from the app.
- **Scan:** `scripts/a11y-scan.mjs` runs axe-core (WCAG 2.0–2.2 A/AA +
  best practice) in light and dark mode and prints the failures by rule and
  component. Colour-contrast results on disabled elements are listed as exempt.
  Full detail goes to `a11y-report.json` (git-ignored).
- **When you add or change a component,** add it to the gallery with every
  variant and state, so the scan covers it.
- axe catches roughly a third of real issues. Keyboard, focus management and
  screen-reader behaviour still need the manual checks in this audit.

## Summary

| Severity | Count | Meaning |
|---|---|---|
| 🔴 Critical | 17 | A user can't complete the task (keyboard trap, control unreachable, text unreadable) |
| 🟠 Major | 108 | Significant barrier or clear WCAG failure |
| 🟡 Minor | 128 | Best practice, small or edge-case failure |

**253 findings** in total (colour counted per token pair, the rest per
component). Only Scrim, HelperText, CellData, DescriptionText, Divider, Card and StepVer
came out clean.

**The issues cluster into 11 root causes.** Fixing the root cause fixes
every component that shares it, so the plan below is organised by root
cause, not by component.

| # | Root cause | Severity | Pieces affected |
|---|---|---|---|
| A | Colour tokens below contrast minimums | 🔴 | ~45 (every piece using primary teal, subtle text or default borders) |
| B | Modal overlays without focus management | 🔴 | Dialog, DialogSimple, ErrorAndEmptyState (popUp), TopNavigation (mobile), PopoverSheet |
| C | Custom list / selection widgets without keyboard or ARIA pattern | 🔴 | SelectorListItem → CountryPicker, CurrencyPicker, Selector, AccountSelector · Combobox · SegmentedControl · Tabs · SidebarMenu · TopNavigation |
| D | `Link` / `CTALink` render `<a>` without `href` | 🔴 | Link, CTALink → TopNavigation, DescriptionList, PageTitle, CellActions |
| E | State not exposed (expanded, current, selected, sort, status) | 🟠 | 25 |
| F | Focus lost or invisible | 🟠 | 14 |
| G | Missing, generic or ineffective accessible names | 🟠 | 26 |
| H | Form errors, required fields and status messages | 🟠 | 16 |
| I | Headings and structure | 🟠 | 13 |
| J | Pointer, hover, reflow and motion | 🔴 / 🟠 | DropZone, RangeSlider, Tooltip, Dialog, DialogSimple, Chip, all animated pieces |
| K | Screen-reader strings mix English and Spanish | 🟡 | 14 |

---

## A · Colour contrast (tokens)

> **Status 19/10/2026: ✅ fixed (A1–A17).** Contrast-based Base palette, dark-mode Theme alias rules and new Component tokens (BadgeHighlight labels, ProgressBar onColor text) in Figma — 478 token pairs × 2 modes, 0 failures. `tokens.css` synced; axe scan of all 84 pieces: colour-contrast 317 → 0 outside disabled states (exempt). See CLAUDE.md §10.

Figma and code share the same colour tokens, so these fixes are made in
Figma first (Theme / Mode layers), re-exported, and then synced to
`tokens.css`. **They need a design decision from Carol** before any change:
the primary teal is the brand colour.

Disabled controls are exempt from 1.4.3 and 1.4.11, so `fg/disabled`
(#B9BEC4, 1.87:1) is listed for information only.

### Light mode

| ID | Token(s) | Pair | Ratio | Needs | Used by | Severity |
|---|---|---|---|---|---|---|
| A1 | `fg/primary`, `fg/label-primary`, `fg/headline-primary` = primary/500 #4BA9C0 | teal text on white | **2.71** | 4.5 (3 for large) | Link, CTALink, ghost & outline Buttons, IconButton accent, Headline/SectionHeader primary, LinkList, Dialog link actions, TopNavigation | 🔴 |
| A2 | `bg/primary` = primary/500 #4BA9C0 | white text on teal | **2.71** | 4.5 | Accent Button, selected Chip, BadgeNotification, Pagination selected (known debt), Node active, PopoverSheet, ProgressBar label | 🔴 |
| A3 | `fg/subtle` = neutral/400 #9AA1AA | grey text on white | **2.61** | 4.5 | HelperText, DescriptionText, DetailText, input placeholders and helpers, LabelDescription, breadcrumb current page, ListView, Selector descriptions | 🟠 |
| A4 | `borderColor/default` = neutral/400 #9AA1AA | control border on white | **2.61** | 3 (1.4.11) | Input family, Checkbox, Radio, Chip, Selector, AccountSelector, Combobox, DropZone, Slider knob | 🟠 |
| A5 | `borderColor/primary`, `checkbox-border-selected`, `radio-indicator-fg`, `slider-indicator-bg`, `tabs-ribbon` = #4BA9C0 | selected indicator on white | **2.71** | 3 (1.4.11) | Checkbox, Radio, Slider, Tabs, ListView, Selector selected, Step node | 🟠 |
| A6 | `fg/secondary` = secondary/500 #E02C7C | pink text on white | 4.36 | 4.5 | Text secondary, DetailText, Collapsible, Pagination, SelectorInvoker | 🟠 |
| A7 | `fg/tertiary`, `bg/tertiary` = tertiary/500 #B185C5 | purple text on white / white on purple | 2.99 | 4.5 | DetailText, ListView, Selector, BadgeNotification tertiary, Dialog onTertiary | 🟠 |
| A8 | `bg/success` = success/600 #389A3D | white text on green | 3.58 | 4.5 | AmountView positive | 🟠 |
| A9 | `fg/subtle` on `bg/subtle` #EEEFF1 | grey on light grey | 2.26 | 4.5 | Selector / SelectorInvoker read-only | 🟠 |

### Dark mode

| ID | Token(s) | Pair | Ratio | Needs | Used by | Severity |
|---|---|---|---|---|---|---|
| A10 | `bg/success-subtle` #CBECCC, `bg/error-subtle` #F3C4C4, `bg/primary-medium` #A0D1DE stay light in dark mode while text flips to white | white on pastel | **1.27–1.65** | 4.5 | BadgeHighlight, AmountView, Chip input, Combobox chips, Table status | 🔴 |
| A11 | `fg/error`, `borderColor/error` = error/600 #AD2525 (not raised in dark) | red on #050506 | 2.97 | 4.5 / 3 | Error text and borders on every input, negative Button, Checkbox/Radio error, Tooltip | 🟠 |
| A12 | `bg/subtle` = neutral/500 #7B8490 | white on grey | 3.78 | 4.5 | SegmentedControl, AmountView neutral, BadgeHighlight, AccountSelector | 🟠 |
| A13 | `bg/disabled` #9AA1AA under read-only Selector text | white on grey | 2.60 | 4.5 (read-only isn't exempt) | Selector, AccountSelector read-only | 🟠 |
| A14 | `borderColor/default` = #454C56 | border on #050506 | 2.35 | 3 | Same as A4 | 🟠 |
| A15 | `bg/secondary` #EE8FB9, `bg/tertiary` #CAABD7, `bg/secondary-medium` #E75D9B | white on pastel | 2.03–3.26 | 4.5 | BadgeNotification, BadgeHighlight emphasis | 🟠 |
| A16 | `fg/primary` on `bg/container` / `bg/page` | teal on dark grey | 2.10 / 3.23 | 4.5 | CellActions ghost buttons inside Table | 🟠 |
| A17 | LinkList title has no colour token — it inherits the Vite template's `index.css` (`--text-h: #08060d`) | near-black on #050506 | **1.01** | 3 | LinkList (and any unstyled heading) | 🟠 |

### Options for the decision (measured against white)

| Scale | Step that passes 4.5:1 for text | Step that passes 3:1 for borders / large text |
|---|---|---|
| primary (teal) | **700** #286371 · 6.75 | 600 #36879C · 4.12 |
| neutral | **600** #5D6470 · 5.96 | 500 #7B8390 · 3.82 |
| secondary (pink) | **600** #B71B60 · 6.29 | 500 (current) · 4.36 |
| tertiary (purple) | **600** #9558B0 · 4.88 | 600 · 4.88 |
| success (white on fill) | **700** #27692B · 6.68 | 600 (current) · 3.58 |

A common way to keep the brand teal visible: keep primary/500 for large
decorative surfaces and illustrations, and use primary/700 for text, links,
borders, indicators and any fill that carries white text.

---

## B · Modal overlays without focus management (🔴)

`Dialog`, `DialogSimple`, the popUp variant of `ErrorAndEmptyState` and the
TopNavigation mobile panel declare `aria-modal` (or behave as modals) but:
focus isn't moved in on open, isn't trapped, isn't returned to the trigger
on close; Escape does nothing; the background isn't `inert` and the page
still scrolls. A keyboard user tabs behind the modal; a screen-reader user
is told the background doesn't exist while focus is still there.

**Fix once:** a shared `useModal` hook (or native `<dialog>.showModal()`)
used by all four. Also: `_popoverDismiss` closes every open layer on one
Escape (should close only the top one), and `PopoverSheet` pulls focus back
to its trigger even when the user clicked into another field.

## C · Custom list and selection widgets (🔴)

| Piece | Problem | Severity |
|---|---|---|
| SelectorListItem → CountryPicker, CurrencyPicker | Rows are `<div onClick>`; with `showControl={false}` nothing is focusable, so **a country or currency can't be chosen by keyboard**. Listbox has no name, no `role="option"`, no `aria-selected`, no focus management | 🔴 |
| Combobox | **Keyboard trap:** Tab is `preventDefault`-ed whenever an auto-suggestion exists (Combobox.jsx:198), so focus can't leave the field | 🔴 |
| Combobox | No `aria-controls`, `aria-activedescendant`, `role="option"`: screen readers don't hear the highlighted option. Options contain real Radio/Checkbox tab stops. "No results" not announced. Removing a chip drops focus | 🔴 |
| Selector / AccountSelector lists | Radios have no shared `name` or group: each announces "1 of 1", no arrow keys | 🟠 |
| SegmentedControl | `role="radiogroup"` with no name; every segment is a Tab stop; no arrow keys | 🟠 |
| Tabs / TabItem | No roving tabindex or arrow keys; tabs not linked to panels; TabItem doesn't forward props, so the pattern can't be finished from outside | 🟠 |
| SidebarMenu | `role="tree"` with no tree items or arrow keys | 🟠 |
| TopNavigation | Flydown opens **on mouse hover only**: keyboard users never reach the sub-links. Site nav built as a `tablist`. No Escape | 🔴 |

**Fix once:** a shared listbox/option behaviour (roving focus, arrows,
Home/End, typeahead, `aria-selected`) used by SelectorListItem, Combobox and
the pickers; a disclosure-navigation pattern for TopNavigation.

## D · `<a>` without `href` (🔴)

`Link` and `CTALink` always render `<a href={href}>`. With only `onClick`
(the documented usage in several places) the element isn't focusable and has
no role. Consumers that do this: TopNavigation flydown links, DescriptionList
**Edit**, PageTitle breadcrumb and nav links, CellActions example.

**Fix once:** `Link`/`CTALink` render a `<button>` styled as a link when
there's no `href`. That fixes every consumer at once.

## E · State not exposed to assistive tech (🟠)

| State | Missing on |
|---|---|
| `aria-expanded` / `aria-controls` | Accordion (controls), Collapsible, CollapsibleIconButton, StepNavigator chapter, SidebarMenu parents, TopNavigation menu button, SelectorInvoker, AccountSelectorInvoker, InputAmount currency button, InputTelephone country button, CellMore, Drawer (controls) |
| `aria-current` | Node, StepHor, StepNavigator, SubstepNavigator, StepIndicatorLarge/Small, SidebarMenu, ListView selected, LinkList, Pagination current page, PageTitle breadcrumb |
| `aria-sort` + sort button | CellHeader |
| Meaning by colour or hidden icon only (1.4.1) | Node completed/active, SubstepNavigator, AmountView positive/negative, BadgeHighlight variant, InlineNotification type |

## F · Focus lost or invisible (🟠)

- **Activating a control removes it from focus:** Button `loading` (native
  `disabled`), Pagination prev/next at the ends and the current page
  (re-mounts as `<span>`), InputStepper −/+ at min/max, Combobox chip
  remove, FileSelector file remove. Fix: `aria-disabled` + click guard, or
  move focus deliberately.
- **No visible focus:** InputText read-only, SelectorInvoker and
  AccountSelectorInvoker read-only, the inner buttons of InputAmount /
  InputTelephone / InputStepper (ring only on the wrapper, so you can't tell
  which part has focus), PopoverSheet panel.
- **Forced colors:** Link, CTALink, Pagination, StepNavigator,
  SubstepNavigator and StepIndicatorSmall draw focus with `box-shadow` only,
  which disappears in Windows High Contrast. Fix: add
  `outline: 2px solid transparent`.

## G · Accessible names (🟠)

- **ARIA that has no effect:** `aria-label` on role-less `<span>`
  (BadgeNotification count, BadgeHighlight, Pagination current page),
  `aria-readonly` on `<button>` (SelectorInvoker, AccountSelectorInvoker),
  `aria-disabled` on `<div>` (SelectorListItem, AccountSelectorListItem),
  `role="status"` on an `<svg>` (LoadingSpinner), `role="cell"` replacing a
  button's role (CellMore).
- **Missing names:** ProgressBar, SegmentedControl, Slider / SteppedSlider
  (only optional `ariaLabel`), RangeSlider knobs ("Mínimo"/"Máximo" with no
  context), Tabs tablist, CountryPicker / CurrencyPicker listbox.
- **Generic names:** default label "Button" (Dialog, DialogSimple, DropZone,
  FileSelector, FileUpload, InlineNotification, ErrorAndEmptyState), "More"
  on every CellMore, "Eliminar fichero" with no file name, "Edit" with no
  field, "Saltar páginas" on both ellipses.
- **Value hidden by the name:** `<label htmlFor>` on Selector /
  AccountSelector invokers replaces the button text, so the selected value
  is never announced; `ariaLabel` on the invokers does the same.
- **Not linked:** LabelDescription has no ids, so FileUpload can't reference
  its label and description.

## H · Forms and status messages (🟠)

- Error messages use `aria-live` on an element that appears together with
  the message, so many screen readers never announce it: InputText,
  InputAmount, InputCombobox, InputDate, InputDropdown, InputStepper,
  InputTelephone, Checkbox, Radio, Selector, AccountSelector, Snackbar.
  **Fix once:** a persistent live region in `_inputBase`.
- No visible required marker and no consistent `required` API (InputAmount,
  InputDropdown, InputTelephone don't pass it through).
- No `RadioGroup` (fieldset + legend + group error).
- InputDate: format only in the placeholder.
- ListItem / FileSelector: upload progress, success and errors not announced;
  ListItem error not linked to its input.
- InlineNotification: `role="status"` even for errors (should be `alert`).
- ErrorAndEmptyState: an error appearing after a failed load isn't announced.

## I · Headings and structure (🟠)

- Accordion: trigger not inside a heading; no `aria-controls` / region.
- Headline: `level` sets both the tag and the visual size, so people pick a
  level for its size (SidebarMenu uses `level={6}` for a menu title). Split
  into `level` + `size`.
- SectionHeader: `role="heading" aria-level={2}` hard-coded on a `<div>`.
- Dialog title and ErrorAndEmptyState title are `<p>`; LinkList title is a
  fixed `<h2>` with no styling (see A17).
- DescriptionList: `<hr>` as a direct child of `<dl>`.
- List: `list-style: none` drops list semantics in Safari (add `role="list"`).
- Table: no way to give it a name or caption.
- StepIndicatorLarge and the PageTitle breadcrumb aren't ordered lists.
- `<p>` / `<div>` inside `<button>` (SelectorInvoker, AccountSelectorInvoker,
  ListView) and controls inside a button (ListView right panel).

## J · Pointer, hover, reflow and motion

| Piece | Problem | WCAG | Severity |
|---|---|---|---|
| DropZone | Hovering the zone **disables its own button**, so a mouse user can never click "select file" — the only alternative to drag-and-drop | 2.5.7 | 🔴 |
| RangeSlider | Values can only change by dragging; no click on the track | 2.5.7 | 🟠 |
| Tooltip | Not hoverable (`pointer-events: none`) and can't be dismissed with Escape | 1.4.13 | 🟠 |
| Dialog, DialogSimple | Fixed 480 px width and 616–680 px height: two-way scrolling at 320 px | 1.4.10 | 🟠 |
| Chip (input) | Remove target 20 × 20 px | 2.5.8 | 🟡 |
| All animated pieces | No `prefers-reduced-motion` anywhere in `src` (spinners, transitions, Button press scale) | 2.3.3 (AAA, best practice) | 🟡 |

## K · Language of screen-reader strings (🟡)

Hidden strings mix languages: "(opens in new tab)", "Loading", "Step X of
Y", "Expand", "More", "Edit" vs "Cerrar", "Volver", "Eliminar fichero",
"Buscar". **Decision needed:** the system's default language. Then every
built-in string becomes a prop with that default.

## Bug found during the audit

`StepNavigator` and `SubstepNavigator` read the `style` prop twice — as the
primary/secondary axis and as the inline style. `style="secondary"`, exactly
as their own usage comment shows, crashes React. Fix: rename the axis prop
(e.g. `appearance`).

---

## Plan

Each sprint ends with the axe gallery scan at zero for the pieces it
touched, and the Figma + inventory Accessibility sections updated.

| Sprint | Content | Why this order | Needs Carol |
|---|---|---|---|
| **A11y-0 · Foundations** | Shared helpers: `VisuallyHidden`, persistent live region, `useModal`, listbox/roving-focus behaviour, global `prefers-reduced-motion`, transparent outline for forced colors. `Link`/`CTALink` button fallback (D). StepNavigator `style` bug. Commit the axe gallery + script as a regression check | Every later fix reuses these; D alone unblocks 4 consumers | Approve adding the gallery to the repo |
| **A11y-1 · Critical blockers** | B (all modals) · C criticals (SelectorListItem → pickers, Combobox trap + wiring, TopNavigation) · DropZone hover | Removes every "can't complete the task" issue | — |
| **A11y-2 · Colour** | A1–A17: decide steps in Figma (Theme / Mode), re-export, sync `tokens.css`, re-scan both modes. Includes the open Pagination 2.7:1 debt and the borderColor dark-mode audit | Biggest visual change; done in Figma first | **Yes — brand teal decision** |
| **A11y-3 · State and names** | E and G | Mostly additive props, low risk | — |
| **A11y-4 · Forms and focus** | H and F; `RadioGroup` | Builds on the live region from A11y-0 | Required-field marker style (Figma) |
| **A11y-5 · Structure, pointer, language** | I, J (rest), K. Headline `level`/`size` split | Touches APIs consumers use | **Yes — default language; Headline API change** |
| **Close-out** | Screen-reader pass (VoiceOver + NVDA), 200 % / 400 % zoom, forced colors check; every component's Accessibility section says "no known gaps" | Proves the claim | — |

---

## Appendix · Findings by component

Severity: 🔴 Critical · 🟠 Major · 🟡 Minor. Root cause letter in brackets.
Colour issues (A) are in the tables above and not repeated here.

### Actions
- **Button** — 🟠 `loading` sets native `disabled`: focus lost, busy state not announced [F] · 🟡 `iconOnly` without `ariaLabel` gives no name and no warning [G] · 🟡 press scale and spinner ignore reduced motion [J]
- **IconButton** — 🟡 no warning when unnamed [G] · 🟡 `ariaLabel` overrides visible `label` (2.5.3) [G]
- **Link** — 🔴 `<a>` without `href` isn't focusable [D] · 🟡 new-tab hint in English [K] · 🟡 hint only with `external`, not with `target="_blank"` · 🟡 focus via box-shadow only [F]
- **CTALink** — 🔴 same `href` issue; its own example does it [D] · 🟡 English hint [K] · 🟡 box-shadow focus [F]
- **ButtonBar** — 🟡 no `role="group"` + label
- **CellActions** — 🟡 doc example uses `Link` without `href` [D] · 🟡 doc example `size="small"` (should be `sm`) renders a 19 px target

### Forms
- **InputText** — 🟠 read-only removes the focus ring [F] · 🟡 error live region [H]
- **InputAmount** — 🟠 currency button focus barely visible [F] · 🟠 currency not linked to the input [G] · 🟡 no `aria-haspopup`/`aria-expanded` [E] · 🟡 no `required` pass-through [H] · 🟡 error live region [H]
- **InputCombobox** — 🟡 `aria-autocomplete` should be `both` · 🟡 clear button "Borrar" without context [G] · 🟡 error live region [H] · axe: `aria-controls` missing on `role="combobox"` 🟠 [C]
- **InputDate** — 🟡 format only in placeholder [H] · 🟡 error live region [H]
- **InputDropdown** — 🟡 no `required` [H] · 🟡 error live region [H]
- **InputStepper** — 🟠 −/+ have `outline:none` [F] · 🟠 reaching min/max disables the focused button [F] · 🟡 `<output htmlFor>` points at the label · 🟡 error live region [H]
- **InputTelephone** — 🟠 country button focus barely visible [F] · 🟡 no `aria-haspopup`/`aria-expanded` [E] · 🟡 fixed country code not linked · 🟡 no `required` [H] · 🟡 error live region [H]
- **Checkbox** — 🟡 `aria-checked="mixed"` on a native checkbox · 🟡 no visible required marker [H] · 🟡 error live region [H]
- **Radio** — 🟠 no RadioGroup [H] · 🟡 no required marker · 🟡 error live region
- **Chip** — 🟡 remove target 20 px [J] · 🟡 remove name "Eliminar " when only `ariaLabel` · 🟡 "undefined" in filter chip names · 🟡 choice chips not grouped
- **LabelDescription** — 🟠 no ids for label/description [G]
- **Slider** — 🟠 name only via optional `ariaLabel` [G] · 🟡 no PageUp/PageDown
- **SteppedSlider** — 🟠 decimal `aria-valuenow` with no `aria-valuetext` · 🟠 naming as Slider [G]
- **RangeSlider** — 🟠 no track click (2.5.7) [J] · 🟠 knobs "Mínimo/Máximo" without context, no group [G]
- **_sliderKnob** — 🟡 `aria-valuetext` never set · 🟡 Tooltip repeats the value as description
- **SegmentedControl** — 🟠 radiogroup unnamed [G] · 🟠 no roving tabindex / arrows [C]
- **Combobox** — 🔴 Tab keyboard trap [C] · 🔴 no listbox wiring [C] · 🟠 Radio/Checkbox tab stops inside options · 🟠 no results not announced [H] · 🟠 chip remove drops focus [F] · 🟡 listbox unnamed
- **CountryPicker** — 🔴 rows not keyboard-reachable [C] · 🟠 listbox unnamed, no options [C] · 🟠 no focus management [B]
- **CurrencyPicker** — 🔴 rows not keyboard-reachable [C] · 🟠 listbox unnamed, no options [C] · 🟠 no focus management [B]

### Data
- **AccordionGroup** — 🟡 no `headingLevel` / ids to pass down [I]
- **Accordion** — 🟠 no heading wrapper [I] · 🟡 no `aria-controls` / region [E]
- **Collapsible** — 🟠 no `aria-expanded` / `aria-controls` [E] · 🟡 default "Expand/Collapse" without context [G]
- **CollapsibleIconButton** — 🟠 no `aria-expanded` [E] · 🟡 tooltip repeats the name
- **Table** — 🟡 no name / caption [I]
- **CellHeader** — 🟠 no `aria-sort`, no sort button, icon always ascending [E]
- **CellMore** — 🟠 `role="cell"` replaces the button role [G] · 🟠 every trigger named "More" [G] · 🟡 no `aria-haspopup` [E]
- **DescriptionList** — 🔴 Edit is `<Link>` without `href` [D] · 🟡 `<hr>` inside `<dl>` [I] · 🟡 "Edit" without field name, English [G][K]
- **List** — 🟡 add `role="list"` · 🟡 custom number marker hidden
- **ListItem** — 🟠 remove button without file name [G] · 🟠 uploading not announced [H] · 🟠 error not linked [H] · 🟡 spinner motion [J] · 🟡 hard-coded strings [K]
- **ListView** — 🟠 selected not exposed [E] · 🟠 controls inside the row button [I] · 🟡 `<p>` / heading inside button
- **AmountView** — 🟠 positive/negative by colour only [E] · 🟡 disabled visual only
- **DetailText** — 🟡 meaningful icon always hidden
- **Text** — 🟠 `color="disabled"` still clickable · 🟡 20 px target
- **Icon** — 🟡 no `label` option for meaningful icons
- **Image** — 🟡 `alt` defaults to `''` · 🟡 caption not `<figcaption>`
- **CountryFlag** — 🟡 no label option (only country cue in InputTelephone)

### Feedback
- **Dialog** — 🔴 no focus management [B] · 🟠 no Escape [B] · 🟠 background not inert [B] · 🟠 fixed size breaks reflow [J] · 🟡 `aria-label` instead of `aria-labelledby` · 🟡 "Button" defaults [G]
- **DialogSimple** — 🔴 no focus management [B] · 🟠 no Escape / inert [B] · 🟠 fixed size [J] · 🟡 should be `alertdialog` · 🟡 "Button" defaults
- **_dialogBase** — 🟡 title is `<p>` [I] · 🟡 title truncated with ellipsis · 🟡 "Volver/Cerrar" not translatable [K]
- **Drawer** — 🟡 no `aria-controls` · 🟡 transition ignores reduced motion
- **PopoverSheet** — 🟠 focus always returned to trigger, even after click-outside [B] · 🟡 panel `outline:none` · 🟡 no `aria-labelledby` option
- **_popoverDismiss** — 🟡 one Escape closes every layer [B]
- **Tooltip** — 🟠 not hoverable · 🟠 no Escape [J] · 🟡 always in DOM at opacity 0 · 🟡 overwrites existing `aria-describedby` · 🟡 `nowrap`
- **Snackbar** — 🟡 live region rendered with message [H] · 🟡 no dismiss / pause hook (2.2.1)
- **InlineNotification** — 🟠 type only by hidden icon [E] · 🟡 `status` for errors [H] · 🟡 "Button" default
- **LoadingSpinner** — 🟠 `role="status"` on svg is never announced [G] · 🟡 motion · 🟡 "Loading" in English [K]
- **ProgressBar** — 🟠 no accessible name [G] · 🟡 helper not linked
- **ErrorAndEmptyState** — 🟠 popUp has no dialog role / focus [B] · 🟠 error not announced [H] · 🟡 title `<p>` · 🟡 close button without `onClose` · 🟡 custom icon not hidden · 🟡 "Button" defaults
- **BadgeHighlight** — 🟠 `aria-label` on span ignored [G] · 🟡 variant by colour only [E] · 🟡 disabled visual only
- **BadgeNotification** — 🟠 count read bare, `aria-label` ignored [G]
- **Selector** — 🟠 `label htmlFor` hides the selected value [G] · 🟡 error live region [H]
- **SelectorInvoker** — 🟠 no `aria-haspopup`/`aria-expanded` [E] · 🟠 read-only removes focus ring [F] · 🟠 `ariaLabel` hides the value [G] · 🟡 `aria-readonly` on button · 🟡 `<p>` in button · 🟡 count badge without context · 🟡 masked bullets read aloud
- **SelectorListItem** — 🔴 `<div onClick>` row not keyboard-reachable [C] · 🟠 selected not exposed · 🟠 radios ungrouped [C] · 🟡 description not linked · 🟡 `aria-disabled` on div · 🟡 custom icon not hidden
- **AccountSelector** — 🟠 `label htmlFor` hides the value [G] · 🟡 error live region [H]
- **AccountSelectorInvoker** — 🟠 no popup state [E] · 🟠 read-only removes focus ring [F] · 🟠 `ariaLabel` hides the value [G] · 🟡 `aria-readonly` · 🟡 `<div>` in button · 🟡 count badge · 🟡 masked data read aloud
- **AccountSelectorListItem** — 🟠 radios ungrouped [C] · 🟠 rows with the same header sound identical [G] · 🟡 `aria-disabled` on div

### Navigation
- **Pagination** — 🟠 current page re-mounts as span, focus lost [F] · 🟠 prev/next disabled at the ends, focus lost [F] · 🟡 `aria-label` on span · 🟡 both ellipses "Saltar páginas" · 🟡 box-shadow focus · axe: two `nav` landmarks with the same label 🟡
- **TabItem** — 🟠 doesn't forward props [C] · 🟡 `role="tab"` outside a tablist
- **Tabs** — 🟠 no roving tabindex / arrows [C] · 🟠 no tab ↔ panel link [C] · 🟡 tablist unnamed
- **TopNavigation** — 🔴 flydown hover-only [C] · 🔴 flydown links without `href` [D] · 🟠 nav built as tablist · 🟠 no Escape · 🟠 menu button no `aria-expanded` [E] · 🟠 mobile panel not a modal [B] · 🟡 flydown after all items in DOM · 🟡 group titles not headings · 🟡 `nav` unnamed
- **SidebarMenu** — 🟠 `role="tree"` misuse [C] · 🟠 parents no `aria-expanded` [E] · 🟠 selected no `aria-current` [E] · 🟡 no `nav` landmark · axe: heading order (`h6`) [I]
- **StepNavigator** — 🟠 chapter no `aria-expanded` [E] · 🟠 selected by colour only [E] · 🟠 status not in text [E] · 🟡 box-shadow focus · bug: `style` prop crash
- **SubstepNavigator** — 🟠 active/completed by colour only [E] · 🟠 selected by colour only [E] · 🟡 box-shadow focus · bug: `style` prop crash
- **StepIndicatorLarge** — 🟠 not a list, no current step [I][E]
- **StepIndicatorSmall** — 🟠 selected by colour only [E] · 🟠 status not in text [E] · 🟡 "Step X of Y" English [K] · 🟡 button without `onClick` · 🟡 box-shadow focus
- **StepHor** — 🟠 status only visual, no `aria-current` [E]
- **Node** — 🟠 completed shows a hidden check icon: number and status lost [E] · 🟡 active vs incomplete by fill only
- **LinkList** — 🟡 always a `nav` landmark, may be unnamed · 🟡 fixed `h2` · 🟡 no `aria-current` · see A17

### Page structure
- **PageTitle** — 🔴 breadcrumb and nav links without `href` [D] · 🟠 "Volver" button does nothing · 🟡 breadcrumb not `ol`, no `aria-current` · 🟡 icon-only buttons may be unnamed
- **Headline** — 🟠 level tied to visual size [I]
- **SectionHeader** — 🟠 hard-coded `aria-level={2}` on div [I]
- **DropZone** — 🔴 hover disables the button [J] · 🟠 "Button" default name [G] · 🟡 instructions not linked
- **FileSelector** — 🟠 `buttonLabel` not forwarded ("Button") [G] · 🟠 add/remove not announced [H] · 🟡 focus lost on remove [F] · 🟡 rows not a list
- **FileUpload** — 🟠 label/description not linked to the control [G] · 🟠 compact layout button text "Button" [G]
