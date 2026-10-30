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

## Progress

| Sprint | Status | Scan (`npm run a11y`) |
|---|---|---|
| A11y-2 · Colour | ✅ 19/10/2026 | colour-contrast 317 → 0 outside disabled |
| A11y-0 · Foundations | ✅ 20/10/2026 — shared pieces built and tested; D and the StepNavigator bug fixed. Open criticals 14 → **9** (the five D findings) | 68 ARIA failures, unchanged by design (the helpers are wired into components in A11y-1/3/4); 0 in the pieces touched |
| Headline `level` / `size` split | ✅ 20/10/2026 (pulled forward from A11y-5) — code + Figma | heading-order fixed (SidebarMenu): 68 → 66 |
| A11y-1 · Critical blockers | ✅ 21/10/2026 — B, C criticals, DropZone. Open criticals 9 → **0** | 66 → 56 (CountryPicker, CurrencyPicker listbox fixed; the rest belong to A11y-3/4/5) |
| A11y-3 · State and names | ✅ 21/10/2026 — E and G, plus SegmentedControl, Tabs and SidebarMenu keyboard patterns (C) | 56 → **0** failures |
| A11y-4 · Forms and focus | ✅ 21/10/2026 — H and F, new `RadioGroup` and `CheckboxGroup`, required marker (asterisk on the group legend) | **0** failures (RadioGroup and required states added to the gallery) |
| A11y-5 · Structure, pointer, language | ✅ 23/10/2026 — I, J and K | **0** failures |

**Decisions (20/10/2026, Carol):**
- **Screen-reader language: English.** Every built-in hidden string ("(opens in new tab)", "Close", "Back", "Remove file"…) is English by default and becomes a prop so an app can translate it. Applied in A11y-5 (K).
- **Headline:** `level` (h1–h6 tag) and `size` (2xl–xs, visual) are separate; `size` defaults to the level's step, so existing code looks the same. Figma: the `Variant` property (h1–h6) is now `Size` (2xl–xs); the heading level is annotated per instance.

### A11y-0 · what exists now

| Piece | File | For | Used by (sprint) |
|---|---|---|---|
| `VisuallyHidden` | `src/components/VisuallyHidden.jsx` | Text for screen readers only; `focusable` for skip links | Link, CTALink (now) · names in G (A11y-3) |
| `LiveRegion` | `src/components/LiveRegion.jsx` | Persistent `aria-live` container — mounted always, its content changes | Input errors, Checkbox, Radio, Selector, Snackbar (A11y-4, H) |
| `announce()` | `src/components/announce.js` | Global polite/assertive announcements with no visible place ("3 results", "File uploaded") | Combobox no-results, FileSelector, ListItem (A11y-1/4) |
| `useModal` | `src/components/_useModal.js` | Focus in, Tab trapped, background `inert`, scroll locked, Escape on the top layer only, focus returned | Dialog, DialogSimple, ErrorAndEmptyState popUp, TopNavigation mobile (A11y-1, B) |
| `useRovingFocus` | `src/components/_rovingFocus.js` | One Tab stop per group; arrows / Home / End; skips disabled items | SegmentedControl, Tabs, RadioGroup, SidebarMenu (A11y-1/3/4, C) |
| `useListbox` | `src/components/_rovingFocus.js` | APG listbox: `role=option`, `aria-selected`, Enter/Space, typeahead; `focus` mode (pickers) and `activedescendant` mode (Combobox input) | SelectorListItem → CountryPicker / CurrencyPicker / Selector, Combobox (A11y-1, C) |
| Layer stack | `src/components/_focus.js` | Escape closes only the top layer — `_popoverDismiss` and `useModal` share it | All popovers and modals (now) |
| Reduced motion | `src/foundations.css` | Transitions on `.ds-*` become instant; Button press scale off; spinners keep turning (essential motion) | All animated pieces (now) |
| Forced colors | `src/foundations.css` + transparent `outline` in 6 components | Focus visible in Windows High Contrast | All focusable pieces (now) |

`foundations.css` must be imported next to `tokens.css` in any app that uses the system.

Verified with a keyboard harness (47 checks in Chromium, React StrictMode): Link/CTALink without `href` reachable and activated by Enter and Space; modal focus in / trap / Escape order with a popover inside / focus return / inert and scroll restored; roving and listbox keys, typeahead, disabled skipping, `aria-activedescendant` after filtering; `announce()`; forced-colors outline and reduced-motion transitions emulated.

---

### A11y-1 · what changed

| Piece | Before | Now |
|---|---|---|
| Dialog, DialogSimple, ErrorAndEmptyState (popUp) | `aria-modal` with no focus handling | `useModal`: focus in, Tab trapped, background `inert`, scroll locked, Escape → `onClose`, focus back to the opener. Name from the title, now an `h2` (`aria-labelledby`). DialogSimple is an `alertdialog` with the message as description. New `modal` prop (default `true`; `false` only for static docs/gallery) |
| CountryPicker, CurrencyPicker | `<div onClick>` rows, nothing focusable | Listbox (`useListbox`, focus mode): focus goes to the selected option, arrows / Home / End / typeahead, Enter or Space chooses, Escape / Tab close, focus returns to the opener. Named "Countries" / "Currencies" (`ariaLabel`) |
| SelectorListItem | — | Forwards `role`/`aria-*`/`tabIndex`/handlers, so it can be a listbox option; as an option its Radio/Checkbox is visual only (`inert`). Own focus ring when the row itself has focus |
| Combobox | Tab trapped by the auto-suggestion; no listbox wiring | Focus stays in the input; `aria-controls` + `aria-activedescendant`; options are `role="option"` with no inner tab stops. Tab accepts the suggestion and moves on; leaving with Tab closes the panel. "No results" announced; removing a chip keeps focus in the field |
| TopNavigation | Flydown on hover only; nav built as a tablist; mobile panel not modal | Disclosure navigation: items with a flydown are buttons with `aria-expanded`/`aria-controls` (click, Enter, Space); the flydown sits right after its button in the Tab order; Escape closes it and returns focus; focus moving away closes it; hover still works. `<nav aria-label="Main">`, items in a list. Mobile panel is a modal (`useModal`) with `aria-expanded` on the menu button |
| PopoverSheet | Always pulled focus back to the trigger | Only when focus was lost or is still inside — a click into another field keeps its focus |
| DropZone | Mouse hover disabled the "select file" button | The Figma "Hover" state is driven by drag events, so the button always works with a mouse; drops are delivered through `onFilesDrop(files)`; instructions linked to the button |

Verified with a keyboard harness (52 checks, Chromium, StrictMode) and pixel diffs of the gallery (Dialog, DialogSimple, ErrorAndEmptyState, TabItem, DropZone identical to before).

**Note for consumers:** a TopNavigation item with a `flydown` is now only a toggle — its own `onClick` no longer runs (its links navigate).

---

### A11y-3 · what changed

| Area | Pieces | Now |
|---|---|---|
| Step status (E) | Node, StepHor, StepVer, StepNavigator, SubstepNavigator, StepIndicatorLarge, StepIndicatorSmall | Status read as text: "Step 2, in progress" (`_stepStatus.js`, labels by prop). `aria-current="step"` on the step in progress, `"page"` on the one being viewed. StepIndicatorLarge is an `<ol>`. Chapter rows have `aria-expanded` + `controls`. StepIndicatorSmall without `onClick` is a `div`, not a dead button |
| Expanded / popup state (E) | Accordion, Collapsible, CollapsibleIconButton, Drawer, SelectorInvoker, AccountSelectorInvoker, InputAmount, InputTelephone, CellMore | `aria-expanded` + `aria-controls` (Accordion content is a named `region`); invokers have `aria-haspopup` + `expanded`; currency / country buttons are `aria-haspopup="listbox"`; CellMore takes `haspopup` |
| Current item (E) | SidebarMenu, ListView, LinkList, Pagination, PageTitle breadcrumb | `aria-current` (ListView `current` prop, LinkList `item.current`). SidebarMenu is a named `<nav>` of nested lists — no more `role="tree"` — with `aria-expanded`/`aria-controls` on parents. Breadcrumb is an `<ol>`; the back arrow is a button only with `onBack` |
| Sorting (E) | CellHeader | `aria-sort`; with `onSort` the title is a button and the icon follows the order (A→Z, Z→A, unsorted) |
| Not by colour only (1.4.1) | AmountView, InlineNotification, BadgeHighlight | Negative amounts without a sign read "negative"; notifications start with their type ("Warning: …"); BadgeHighlight documents that the text must carry the state |
| ARIA with no effect (G) | BadgeNotification, BadgeHighlight, Pagination, SelectorInvoker, AccountSelectorInvoker, SelectorListItem, AccountSelectorListItem, LoadingSpinner, CellMore | `ariaLabel` read through hidden text; `aria-readonly` on a button → `aria-disabled` + "read only"; masked data reads "hidden"; LoadingSpinner is a real `role="status"` with text; CellMore is a button inside a `cell` wrapper |
| Missing names (G) | ProgressBar, Slider, SteppedSlider, RangeSlider, SegmentedControl, Tabs | Names from the visible label or `ariaLabel` (dev warning when missing); sliders expose `aria-valuetext` and the value bubble is no longer read twice; RangeSlider knobs sit in a named `group` |
| Generic names (G) | Button, IconButton, CellMore, ListItem, DescriptionList, Pagination, InputCombobox, Chip, FileSelector, FileUpload | Dev warning for "Button" placeholder text and unnamed icon-only buttons; IconButton keeps its visible label as the name (2.5.3); "Remove id.pdf", "Edit Status", "Earlier / Later pages", "Clear Country", "Remove Spain"; FileSelector forwards `buttonLabel` |
| Value hidden by the name (G) | Selector, AccountSelector, InputAmount, InputTelephone | Name = label + selected value (`aria-labelledby` label + button); `ariaLabel` is read before the value instead of replacing it; the amount / phone field reads its currency / prefix as description |
| Not linked (G) | LabelDescription, FileUpload, DropZone | LabelDescription takes ids; FileUpload's label and description describe the upload button |
| Keyboard patterns (C) | SegmentedControl, Tabs | One Tab stop, arrows / Home / End (`useRovingFocus`), radios select on arrow, tabs activate on arrow and skip disabled ones. `Tabs id` + `<TabPanel tabsId itemId>` link each tab to its panel |

All hidden strings are English by default and can be changed by prop. New
optional labels: `Icon label` and `CountryFlag label` for the rare icon or
flag with no text next to it.

Verified with a keyboard and accessibility-tree harness (40 checks in
Chromium via CDP, StrictMode), the A11y-1 harness (57/57) and pixel diffs of
all 86 gallery sections in light and dark: no visual change except the
intended ones (sortable CellHeader icon, new Tabs-with-panel example).

**Notes for consumers:**
- `RangeSlider` defaults `ariaLabelMin`/`ariaLabelMax` to "Minimum"/"Maximum" (were Spanish) and wants an `ariaLabel` for the pair.
- `Drawer iconLabel` defaults to "Toggle panel"; `Pagination` hidden labels are English (`labels`, `ariaLabel` props).
- `Selector ariaLabel` (without a visible label) is now read before the value, not instead of it.

### A11y-4 · what changed

| Area | Pieces | Now |
|---|---|---|
| Error announcements (H) | InputText, InputAmount, InputCombobox, InputDate, InputDropdown, InputStepper, InputTelephone, Checkbox, Radio, Selector, AccountSelector | The error message sits inside a `LiveRegion` that is mounted all the time, so it's announced when it appears (before, the live element appeared together with the message and most screen readers stayed silent). An empty region takes no space |
| Required (H) | All inputs, RadioGroup, CheckboxGroup, Combobox | `required` prop on every field: native `required` + an asterisk in the brand primary colour after the label (`--ds-input-fg-required` → `fg/label/primary`; red is kept for errors), hidden from screen readers because `required` is already read. Decision (Carol, 21/10): asterisk, brand primary, and **only on the group legend — never on single Checkbox / Radio options**; a lone required checkbox ("I accept the terms") goes in a one-option CheckboxGroup |
| Option groups (H, C) | New organisms `RadioGroup` and `CheckboxGroup` | `<fieldset>` + `<legend>` (the question), helper, group error in a live region, `required`, `disabled`, vertical / horizontal (shared `_choiceGroup.jsx`). Radios share a `name`, so one Tab stop and arrow keys come from the browser. CheckboxGroup: `values` + `onChange`; with one option that option is natively `required`, with several none are and the legend adds a hidden ", required" (`role=group` has no `aria-required`). `spacing="none"` for lists of SelectorListItem / AccountSelectorListItem, which now take `name` |
| Status messages (H) | ListItem, FileSelector, Snackbar, InlineNotification, ErrorAndEmptyState | ListItem announces "uploaded" / error (`statusLabels`) and links the error to the name field; FileSelector announces added / removed files; Snackbar announces through `announce()`; InlineNotification `error` is `role="alert"`; ErrorAndEmptyState full screen announces its title and description (`announceOnMount`) |
| Date format (H) | InputDate | The format is read as description ("Format DD/MM/YYYY", `formatHint`), not only in the placeholder |
| Focus kept (F) | Button, Pagination, InputStepper, FileSelector | Button `loading` and Pagination prev/next at the ends and InputStepper −/+ at min/max use `aria-disabled` + a click guard, so focus stays on them. Loading reads ", Loading" in the name and is announced. Pagination's current page stays a button (`aria-current`). After removing a file, focus goes to the next row, the previous one, or the upload button |
| Focus visible (F) | InputText, SelectorInvoker, AccountSelectorInvoker (read-only), InputAmount currency, InputTelephone country, InputStepper −/+, PopoverSheet panel | Read-only fields keep their focus ring; inner buttons get their own ring so you can tell which part has focus; PopoverSheet panel shows focus (`--ds-popover-sheet-focus-outer`) |

Verified with a keyboard and accessibility-tree harness (37 checks, Chromium
via CDP, StrictMode), the A11y-3 (40/40) and A11y-1 (57/57) harnesses, and
pixel diffs of all gallery sections in light and dark: no visual change
except the intended ones (Pagination arrows at the ends keep the disabled look
with `aria-disabled`).

**Notes for consumers:**
- `Checkbox` with `indeterminate` no longer sets `aria-checked="mixed"` (the native `indeterminate` property already exposes it).
- `Button loading` stays focusable; clicks are ignored while loading.
- `InputStepper` buttons default to "Decrease" / "Increase" (`decrementLabel`, `incrementLabel`).

**Figma (done 21/10):** new 🟢 Form Elements page with Label (Required boolean → `*` in `fg/label/primary`, gap `spacing/2xs`), Helper (Generic / Disabled) and Validation Message, shared by every field. Radio Group and Checkbox Group component sets, options in an "Options" slot. The asterisk goes on the group label, never on single Checkbox / Radio options.

### A11y-5 · what changed

| Area | Pieces | Now |
|---|---|---|
| Headings (I) | Accordion, AccordionGroup | The trigger sits inside a heading (`headingLevel`, h3 by default; `null` for none), as the WAI-ARIA accordion pattern asks. Same height as before |
| Headings (I) | SectionHeader | A real `<h2>` (`level` 2–6; `null` → plain text) instead of a `div role="heading" aria-level=2`. ListView uses `level={null}` because it sits inside a button |
| Headings (I) | LinkList, ErrorAndEmptyState | LinkList `titleLevel` (h2 by default); with a title, the `<nav>` is named by it. ErrorAndEmptyState full screen `headingLevel` (popUp stays h2, it's a dialog) |
| Lists and tables (I) | List, Table, DescriptionList | List has `role="list"` (Safari drops list semantics with `list-style: none`). Table takes `ariaLabel` / `ariaLabelledBy` and warns in development without one. DescriptionList no longer puts `<hr>` inside `<dl>`: the separator is the top border of each pair (same colour, `--ds-descriptionlist-divider-color`) |
| Button content (I) | SelectorInvoker, AccountSelectorInvoker, ListView | No `<p>` / `<div>` / heading inside the button: DescriptionText and AmountView take `as="span"`. ListView warns in development if `rightPanelContent` or `swapDescription` holds a button, link or field (a control inside a control) |
| Hover content (J, 1.4.13) | Tooltip | The bubble can be hovered (the pointer can move onto it without it closing) and Escape hides it without moving pointer or focus; it comes back when pointer or focus leave and return. Inside a dialog the first Escape only closes the bubble |
| Pointer (J, 2.5.7) | RangeSlider | A click on the track moves the nearest knob (on equal distance, the one on the clicked side), moves focus to it and keeps dragging |
| Target size (J, 2.5.8) | Chip (input) | The remove X accepts clicks on a 24 × 24 area (`--ds-chip-remove-target-size`) with no visual change |
| Reflow (J, 1.4.10) | Dialog, DialogSimple | popUp and expanded shrink to the viewport (`min(480px, 100%)`, `max-height: 100dvh`) and scroll inside: they fit at 320 × 568 |
| Language (K) | InputDropdown, ButtonBar, TopNavigation, AccountSelectorInvoker, AccountSelectorListItem | Last Spanish defaults now English: "Select an option", "Cancel", "Confirm", "Accept and continue", "Accept", "Search", "Log out", "Account". Every built-in string is a prop |

Verified with a new harness (30 checks: headings, list and table names,
Tooltip hover/Escape including inside a dialog, RangeSlider track clicks and
drag, Chip target, dialogs at 320 × 568), the A11y-4 (37/37), A11y-3 (40/40)
and A11y-1 (57/57) harnesses, and pixel diffs of the gallery in light and
dark. Visual changes: the English defaults above, and DescriptionList now
matches Figma: each item is content + 8 px + divider (the last one too) and
items sit 8 px apart — the code had 14 px on each side of the line.

**Notes for consumers:**
- Accordion titles are now `<h3>` by default: set `headingLevel` to fit the page outline.
- `SectionHeader` renders an `<h2>`: pass `level` to fit the outline, or `level={null}` for a non-heading title.
- Give every `Table` an `ariaLabelledBy` (id of its visible title) or `ariaLabel`.

---

## A · Colour contrast (tokens)

> **Status 19/10/2026: ✅ fixed (A1–A17).** Contrast-based Base palette, dark-mode Theme alias rules and new Component tokens (BadgeHighlight labels, ProgressBar onColor text) in Figma — 478 token pairs × 2 modes, 0 failures. `tokens.css` synced; axe scan of all 84 pieces: colour-contrast 317 → 0 outside disabled states (exempt). See docs/changelog.md (registro de deuda).

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
still scrolls. **Status 21/10/2026: ✅ fixed (A11y-1).** A keyboard user tabs behind the modal; a screen-reader user
is told the background doesn't exist while focus is still there.

**Fix once:** a shared `useModal` hook (or native `<dialog>.showModal()`)
used by all four. *(✅ A11y-1 — all four use `_useModal.js`.)* Also: `_popoverDismiss` closes every open layer on one
Escape (should close only the top one) *(✅ fixed in A11y-0 — layer stack in `_focus.js`)*, and `PopoverSheet` pulls focus back
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
*(A11y-0 ✅ `useListbox` and `useRovingFocus` built. A11y-1 ✅ pickers, Combobox and TopNavigation wired. A11y-3 ✅ SegmentedControl, Tabs and SidebarMenu. Selector / AccountSelector radios move to A11y-4 with `RadioGroup`. A11y-4 ✅ `RadioGroup`.)*

## D · `<a>` without `href` (🔴)

> **Status 20/10/2026: ✅ fixed (A11y-0).** `Link` and `CTALink` render `<button type="button">` when there's no `href` (and CTALink when `disabled`). TopNavigation and PageTitle also pass `href` through when the data has one.

`Link` and `CTALink` always render `<a href={href}>`. With only `onClick`
(the documented usage in several places) the element isn't focusable and has
no role. Consumers that do this: TopNavigation flydown links, DescriptionList
**Edit**, PageTitle breadcrumb and nav links, CellActions example.

**Fix once:** `Link`/`CTALink` render a `<button>` styled as a link when
there's no `href`. That fixes every consumer at once.

## E · State not exposed to assistive tech (🟠)

*(✅ A11y-3, 21/10/2026 — every row below; details in "A11y-3 · what changed".)*

| State | Missing on |
|---|---|
| `aria-expanded` / `aria-controls` | Accordion (controls), Collapsible, CollapsibleIconButton, StepNavigator chapter, SidebarMenu parents, TopNavigation menu button, SelectorInvoker, AccountSelectorInvoker, InputAmount currency button, InputTelephone country button, CellMore, Drawer (controls) |
| `aria-current` | Node, StepHor, StepNavigator, SubstepNavigator, StepIndicatorLarge/Small, SidebarMenu, ListView selected, LinkList, Pagination current page, PageTitle breadcrumb |
| `aria-sort` + sort button | CellHeader |
| Meaning by colour or hidden icon only (1.4.1) | Node completed/active, SubstepNavigator, AmountView positive/negative, BadgeHighlight variant, InlineNotification type |

## F · Focus lost or invisible (🟠)

*(✅ A11y-4, 21/10/2026 — every point below.)*

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
  `outline: 2px solid transparent`. *(✅ A11y-0 — in those six, plus a
  global net in `foundations.css` for every `.ds-*` focus.)*

## G · Accessible names (🟠)

*(✅ A11y-3, 21/10/2026 — every point below; the "Button" placeholder text gets a dev warning, the real text is the consumer's.)*

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

*(✅ A11y-4, 21/10/2026 — every point below; details in "A11y-4 · what changed".)*

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

- ~~Accordion: trigger not inside a heading; no `aria-controls` / region.~~ ✅ A11y-3 (region) + A11y-5: trigger inside `<h3>` by default (`headingLevel`, `null` = no heading); AccordionGroup passes it down.
- ~~Headline: `level` sets both the tag and the visual size, so people pick a
  level for its size (SidebarMenu uses `level={6}` for a menu title). Split
  into `level` + `size`.~~ ✅ 20/10/2026 — split in code and Figma; SidebarMenu
  title is now `level={2} size="xs"`.
- ~~SectionHeader: `role="heading" aria-level={2}` hard-coded on a `<div>`.~~ ✅ A11y-5: real `h1`–`h6` via `level` (default 2), `level={null}` = `span` (used inside ListView).
- ~~Dialog title and ErrorAndEmptyState title are `<p>`; LinkList title is a
  fixed `<h2>` with no styling (see A17).~~ ✅ A11y-1 (Dialog `h2`) + A11y-5: ErrorAndEmptyState `headingLevel` (fullScreen, default 2; popUp always `h2`), LinkList `titleLevel` (default 2) and the `<nav>` is named by its title.
- ~~DescriptionList: `<hr>` as a direct child of `<dl>`.~~ ✅ A11y-5: the divider is each item's bottom border, spaced as in Figma (8 px to the line, 8 px between items, a line under the last item too).
- ~~List: `list-style: none` drops list semantics in Safari (add `role="list"`).~~ ✅ A11y-5.
- ~~Table: no way to give it a name or caption.~~ ✅ A11y-5: `ariaLabel` / `ariaLabelledBy`, dev warning if neither.
- ~~StepIndicatorLarge and the PageTitle breadcrumb aren't ordered lists.~~ ✅ A11y-3.
- ~~`<p>` / `<div>` inside `<button>` (SelectorInvoker, AccountSelectorInvoker,
  ListView) and controls inside a button (ListView right panel).~~ ✅ A11y-5: DescriptionText / AmountView take `as="span"` inside buttons; ListView warns in dev if its right panel holds a control.

## J · Pointer, hover, reflow and motion

| Piece | Problem | WCAG | Severity |
|---|---|---|---|
| DropZone | ~~Hovering the zone **disables its own button**~~ ✅ A11y-1: the state follows drag events, not mouse hover | 2.5.7 | 🔴 |
| RangeSlider | ~~Values can only change by dragging; no click on the track~~ ✅ A11y-5: a click on the track moves the nearest knob | 2.5.7 | 🟠 |
| Tooltip | ~~Not hoverable (`pointer-events: none`) and can't be dismissed with Escape~~ ✅ A11y-5: bubble hoverable (bridge over the arrow), Escape hides it until the pointer/focus leaves | 1.4.13 | 🟠 |
| Dialog, DialogSimple | ~~Fixed 480 px width and 616–680 px height: two-way scrolling at 320 px~~ ✅ A11y-5: `min(480px, 100%)`, height capped at `100dvh` with inner scroll | 1.4.10 | 🟠 |
| Chip (input) | ~~Remove target 20 × 20 px~~ ✅ A11y-5: 24 × 24 hit area (`--ds-chip-remove-target-size`), same look | 2.5.8 | 🟡 |
| All animated pieces | ~~No `prefers-reduced-motion` anywhere in `src`~~ ✅ A11y-0: `foundations.css` (transitions, Button press scale; spinners kept as essential motion) | 2.3.3 (AAA, best practice) | 🟡 |

## K · Language of screen-reader strings (🟡)

Hidden strings mix languages: "(opens in new tab)", "Loading", "Step X of
Y", "Expand", "More", "Edit" vs "Cerrar", "Volver", "Eliminar fichero",
"Buscar". ~~**Decision needed:** the system's default language.~~ **Decided
20/10/2026: English.** Every built-in string becomes a prop with an English
default (A11y-5). ✅ 23/10/2026: the last Spanish defaults (InputDropdown placeholder, ButtonBar labels, TopNavigation "Log out", Account Selector "Account") are English.

## Bug found during the audit

> **Status 20/10/2026: ✅ fixed (A11y-0).** The axis is now `appearance`; a string `style` is still read as `appearance`, with a dev warning.

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
| **A11y-0 · Foundations** ✅ 20/10 | Shared helpers: `VisuallyHidden`, persistent live region, `useModal`, listbox/roving-focus behaviour, global `prefers-reduced-motion`, transparent outline for forced colors. `Link`/`CTALink` button fallback (D). StepNavigator `style` bug. Commit the axe gallery + script as a regression check | Every later fix reuses these; D alone unblocks 4 consumers | Approve adding the gallery to the repo |
| **A11y-1 · Critical blockers** ✅ 21/10 | B (all modals) · C criticals (SelectorListItem → pickers, Combobox trap + wiring, TopNavigation) · DropZone hover | Removes every "can't complete the task" issue | — |
| **A11y-2 · Colour** | A1–A17: decide steps in Figma (Theme / Mode), re-export, sync `tokens.css`, re-scan both modes. Includes the open Pagination 2.7:1 debt and the borderColor dark-mode audit | Biggest visual change; done in Figma first | **Yes — brand teal decision** |
| **A11y-3 · State and names** ✅ 21/10 | E and G | Mostly additive props, low risk | — |
| **A11y-4 · Forms and focus** ✅ 21/10 | H and F; `RadioGroup` | Builds on the live region from A11y-0 | ~~Required-field marker style~~ decided 21/10: asterisk |
| **A11y-5 · Structure, pointer, language** ✅ 23/10 | I, J (rest), K (English defaults as props). ~~Headline `level`/`size` split~~ ✅ done 20/10 | Touches APIs consumers use | ~~Yes~~ decided 20/10: English; Headline split |
| **Close-out** | Screen-reader pass (VoiceOver + NVDA), 200 % / 400 % zoom, forced colors check; every component's Accessibility section says "no known gaps" | Proves the claim | — |

---

## Appendix · Findings by component

Severity: 🔴 Critical · 🟠 Major · 🟡 Minor. Root cause letter in brackets.
Colour issues (A) are in the tables above and not repeated here.

### Actions
- **Button** — ~~🟠 `loading` sets native `disabled`: focus lost, busy state not announced [F]~~ ✅ · ~~🟡 `iconOnly` without `ariaLabel` gives no name and no warning [G]~~ ✅ · 🟡 press scale and spinner ignore reduced motion [J]
- **IconButton** — ~~🟡 no warning when unnamed [G]~~ ✅ · ~~🟡 `ariaLabel` overrides visible `label` (2.5.3) [G]~~ ✅
- **Link** — ~~🔴 `<a>` without `href` isn't focusable [D]~~ ✅ · 🟡 new-tab hint in English [K] · ~~🟡 hint only with `external`, not with `target="_blank"`~~ ✅ · ~~🟡 focus via box-shadow only [F]~~ ✅
- **CTALink** — ~~🔴 same `href` issue; its own example does it [D]~~ ✅ · 🟡 English hint [K] · ~~🟡 box-shadow focus [F]~~ ✅
- **ButtonBar** — 🟡 no `role="group"` + label
- **CellActions** — ~~🟡 doc example uses `Link` without `href` [D]~~ ✅ (Link renders a button) · 🟡 doc example `size="small"` (should be `sm`) renders a 19 px target

### Forms
- **InputText** — ~~🟠 read-only removes the focus ring [F]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **InputAmount** — ~~🟠 currency button focus barely visible [F]~~ ✅ · ~~🟠 currency not linked to the input [G]~~ ✅ · ~~🟡 no `aria-haspopup`/`aria-expanded` [E]~~ ✅ · ~~🟡 no `required` pass-through [H]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **InputCombobox** — ~~🟡 `aria-autocomplete` should be `both`~~ ✅ · ~~🟡 clear button "Borrar" without context [G]~~ ✅ · ~~🟡 error live region [H]~~ ✅ · axe: `aria-controls` missing on `role="combobox"` 🟠 [C]
- **InputDate** — ~~🟡 format only in placeholder [H]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **InputDropdown** — ~~🟡 no `required` [H]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **InputStepper** — ~~🟠 −/+ have `outline:none` [F]~~ ✅ · ~~🟠 reaching min/max disables the focused button [F]~~ ✅ · ~~🟡 `<output htmlFor>` points at the label~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **InputTelephone** — ~~🟠 country button focus barely visible [F]~~ ✅ · ~~🟡 no `aria-haspopup`/`aria-expanded` [E]~~ ✅ · ~~🟡 fixed country code not linked~~ ✅ · ~~🟡 no `required` [H]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **Checkbox** — ~~🟡 `aria-checked="mixed"` on a native checkbox~~ ✅ · ~~🟡 no visible required marker [H]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **Radio** — ~~🟠 no RadioGroup [H]~~ ✅ · ~~🟡 no required marker~~ ✅ · ~~🟡 error live region~~ ✅
- **Chip** — 🟡 remove target 20 px [J] · ~~🟡 remove name "Eliminar " when only `ariaLabel`~~ ✅ · ~~🟡 "undefined" in filter chip names~~ ✅ · 🟡 choice chips not grouped
- **LabelDescription** — ~~🟠 no ids for label/description [G]~~ ✅
- **Slider** — ~~🟠 name only via optional `ariaLabel` [G]~~ ✅ · 🟡 no PageUp/PageDown
- **SteppedSlider** — ~~🟠 decimal `aria-valuenow` with no `aria-valuetext`~~ ✅ · ~~🟠 naming as Slider [G]~~ ✅
- **RangeSlider** — 🟠 no track click (2.5.7) [J] · ~~🟠 knobs "Mínimo/Máximo" without context, no group [G]~~ ✅
- **_sliderKnob** — ~~🟡 `aria-valuetext` never set~~ ✅ · ~~🟡 Tooltip repeats the value as description~~ ✅
- **SegmentedControl** — ~~🟠 radiogroup unnamed [G]~~ ✅ · ~~🟠 no roving tabindex / arrows [C]~~ ✅
- **Combobox** — ~~🔴 Tab keyboard trap [C]~~ ✅ · ~~🔴 no listbox wiring [C]~~ ✅ · ~~🟠 Radio/Checkbox tab stops inside options~~ ✅ · ~~🟠 no results not announced [H]~~ ✅ · ~~🟠 chip remove drops focus [F]~~ ✅ · ~~🟡 listbox unnamed~~ ✅
- **CountryPicker** — ~~🔴 rows not keyboard-reachable [C]~~ ✅ · ~~🟠 listbox unnamed, no options [C]~~ ✅ · ~~🟠 no focus management [B]~~ ✅
- **CurrencyPicker** — ~~🔴 rows not keyboard-reachable [C]~~ ✅ · ~~🟠 listbox unnamed, no options [C]~~ ✅ · ~~🟠 no focus management [B]~~ ✅

### Data
- **AccordionGroup** — 🟡 no `headingLevel` / ids to pass down [I]
- **Accordion** — 🟠 no heading wrapper [I] · ~~🟡 no `aria-controls` / region [E]~~ ✅
- **Collapsible** — ~~🟠 no `aria-expanded` / `aria-controls` [E]~~ ✅ · 🟡 default "Expand/Collapse" without context [G]
- **CollapsibleIconButton** — ~~🟠 no `aria-expanded` [E]~~ ✅ · ~~🟡 tooltip repeats the name~~ ✅
- **Table** — 🟡 no name / caption [I]
- **CellHeader** — ~~🟠 no `aria-sort`, no sort button, icon always ascending [E]~~ ✅
- **CellMore** — ~~🟠 `role="cell"` replaces the button role [G]~~ ✅ · ~~🟠 every trigger named "More" [G]~~ ✅ · ~~🟡 no `aria-haspopup` [E]~~ ✅
- **DescriptionList** — ~~🔴 Edit is `<Link>` without `href` [D]~~ ✅ · ~~🟡 `<hr>` inside `<dl>` [I]~~ ✅ · ~~🟡 "Edit" without field name, English [G][K]~~ ✅
- **List** — 🟡 add `role="list"` · 🟡 custom number marker hidden
- **ListItem** — ~~🟠 remove button without file name [G]~~ ✅ · ~~🟠 uploading not announced [H]~~ ✅ · ~~🟠 error not linked [H]~~ ✅ · 🟡 spinner motion [J] · 🟡 hard-coded strings [K]
- **ListView** — ~~🟠 selected not exposed [E]~~ ✅ · 🟠 controls inside the row button [I] · 🟡 `<p>` / heading inside button
- **AmountView** — ~~🟠 positive/negative by colour only [E]~~ ✅ · 🟡 disabled visual only
- **DetailText** — 🟡 meaningful icon always hidden
- **Text** — 🟠 `color="disabled"` still clickable · 🟡 20 px target
- **Icon** — ~~🟡 no `label` option for meaningful icons~~ ✅
- **Image** — 🟡 `alt` defaults to `''` · 🟡 caption not `<figcaption>`
- **CountryFlag** — ~~🟡 no label option (only country cue in InputTelephone)~~ ✅

### Feedback
- **Dialog** — ~~🔴 no focus management [B]~~ ✅ · ~~🟠 no Escape [B]~~ ✅ · ~~🟠 background not inert [B]~~ ✅ · 🟠 fixed size breaks reflow [J] · ~~🟡 `aria-label` instead of `aria-labelledby`~~ ✅ · ~~🟡 "Button" defaults [G]~~ ✅
- **DialogSimple** — ~~🔴 no focus management [B]~~ ✅ · ~~🟠 no Escape / inert [B]~~ ✅ · 🟠 fixed size [J] · ~~🟡 should be `alertdialog`~~ ✅ · ~~🟡 "Button" defaults~~ ✅
- **_dialogBase** — ~~🟡 title is `<p>` [I]~~ ✅ (`h2`) · 🟡 title truncated with ellipsis · ~~🟡 "Volver/Cerrar" not translatable [K]~~ ✅ (`backLabel`/`closeLabel`, English defaults)
- **Drawer** — ~~🟡 no `aria-controls`~~ ✅ · 🟡 transition ignores reduced motion
- **PopoverSheet** — ~~🟠 focus always returned to trigger, even after click-outside [B]~~ ✅ · ~~🟡 panel `outline:none`~~ ✅ · 🟡 no `aria-labelledby` option
- **_popoverDismiss** — ~~🟡 one Escape closes every layer [B]~~ ✅
- **Tooltip** — 🟠 not hoverable · 🟠 no Escape [J] · 🟡 always in DOM at opacity 0 · ~~🟡 overwrites existing `aria-describedby`~~ ✅ · 🟡 `nowrap`
- **Snackbar** — ~~🟡 live region rendered with message [H]~~ ✅ · 🟡 no dismiss / pause hook (2.2.1)
- **InlineNotification** — ~~🟠 type only by hidden icon [E]~~ ✅ · ~~🟡 `status` for errors [H]~~ ✅ · ~~🟡 "Button" default~~ ✅
- **LoadingSpinner** — ~~🟠 `role="status"` on svg is never announced [G]~~ ✅ · 🟡 motion · 🟡 "Loading" in English [K]
- **ProgressBar** — ~~🟠 no accessible name [G]~~ ✅ · ~~🟡 helper not linked~~ ✅
- **ErrorAndEmptyState** — ~~🟠 popUp has no dialog role / focus [B]~~ ✅ · ~~🟠 error not announced [H]~~ ✅ · ~~🟡 title `<p>`~~ ✅ · 🟡 close button without `onClose` · ~~🟡 custom icon not hidden~~ ✅ · ~~🟡 "Button" defaults~~ ✅
- **BadgeHighlight** — ~~🟠 `aria-label` on span ignored [G]~~ ✅ · ~~🟡 variant by colour only [E]~~ ✅ · 🟡 disabled visual only
- **BadgeNotification** — ~~🟠 count read bare, `aria-label` ignored [G]~~ ✅
- **Selector** — ~~🟠 `label htmlFor` hides the selected value [G]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **SelectorInvoker** — ~~🟠 no `aria-haspopup`/`aria-expanded` [E]~~ ✅ · ~~🟠 read-only removes focus ring [F]~~ ✅ · ~~🟠 `ariaLabel` hides the value [G]~~ ✅ · ~~🟡 `aria-readonly` on button~~ ✅ · 🟡 `<p>` in button · ~~🟡 count badge without context~~ ✅ · ~~🟡 masked bullets read aloud~~ ✅
- **SelectorListItem** — ~~🔴 `<div onClick>` row not keyboard-reachable [C]~~ ✅ (as a listbox option) · ~~🟠 selected not exposed~~ ✅ (`aria-selected` as option) · ~~🟠 radios ungrouped [C]~~ ✅ (`RadioGroup`) · 🟡 description not linked · ~~🟡 `aria-disabled` on div~~ ✅ · 🟡 custom icon not hidden
- **AccountSelector** — ~~🟠 `label htmlFor` hides the value [G]~~ ✅ · ~~🟡 error live region [H]~~ ✅
- **AccountSelectorInvoker** — ~~🟠 no popup state [E]~~ ✅ · ~~🟠 read-only removes focus ring [F]~~ ✅ · ~~🟠 `ariaLabel` hides the value [G]~~ ✅ · ~~🟡 `aria-readonly`~~ ✅ · 🟡 `<div>` in button · ~~🟡 count badge~~ ✅ · ~~🟡 masked data read aloud~~ ✅
- **AccountSelectorListItem** — ~~🟠 radios ungrouped [C]~~ ✅ (`RadioGroup`) · ~~🟠 rows with the same header sound identical [G]~~ ✅ · ~~🟡 `aria-disabled` on div~~ ✅

### Navigation
- **Pagination** — ~~🟠 current page re-mounts as span, focus lost [F]~~ ✅ · ~~🟠 prev/next disabled at the ends, focus lost [F]~~ ✅ · ~~🟡 `aria-label` on span~~ ✅ · ~~🟡 both ellipses "Saltar páginas"~~ ✅ · ~~🟡 box-shadow focus~~ ✅ · ~~axe: two `nav` landmarks with the same label 🟡~~ ✅
- **TabItem** — ~~🟠 doesn't forward props [C]~~ ✅ · 🟡 `role="tab"` outside a tablist
- **Tabs** — ~~🟠 no roving tabindex / arrows [C]~~ ✅ · ~~🟠 no tab ↔ panel link [C]~~ ✅ · ~~🟡 tablist unnamed~~ ✅
- **TopNavigation** — ~~🔴 flydown hover-only [C]~~ ✅ · ~~🔴 flydown links without `href` [D]~~ ✅ · ~~🟠 nav built as tablist~~ ✅ · ~~🟠 no Escape~~ ✅ · ~~🟠 menu button no `aria-expanded` [E]~~ ✅ · ~~🟠 mobile panel not a modal [B]~~ ✅ · ~~🟡 flydown after all items in DOM~~ ✅ · 🟡 group titles not headings · ~~🟡 `nav` unnamed~~ ✅
- **SidebarMenu** — ~~🟠 `role="tree"` misuse [C]~~ ✅ · ~~🟠 parents no `aria-expanded` [E]~~ ✅ · ~~🟠 selected no `aria-current` [E]~~ ✅ · ~~🟡 no `nav` landmark~~ ✅ · ~~axe: heading order (`h6`) [I]~~ ✅
- **StepNavigator** — ~~🟠 chapter no `aria-expanded` [E]~~ ✅ · ~~🟠 selected by colour only [E]~~ ✅ · ~~🟠 status not in text [E]~~ ✅ · ~~🟡 box-shadow focus~~ ✅ · ~~bug: `style` prop crash~~ ✅
- **SubstepNavigator** — ~~🟠 active/completed by colour only [E]~~ ✅ · ~~🟠 selected by colour only [E]~~ ✅ · ~~🟡 box-shadow focus~~ ✅ · ~~bug: `style` prop crash~~ ✅
- **StepIndicatorLarge** — ~~🟠 not a list, no current step [I][E]~~ ✅
- **StepIndicatorSmall** — ~~🟠 selected by colour only [E]~~ ✅ · ~~🟠 status not in text [E]~~ ✅ · ~~🟡 "Step X of Y" English [K]~~ ✅ · ~~🟡 button without `onClick`~~ ✅ · ~~🟡 box-shadow focus~~ ✅
- **StepHor** — ~~🟠 status only visual, no `aria-current` [E]~~ ✅
- **Node** — ~~🟠 completed shows a hidden check icon: number and status lost [E]~~ ✅ · ~~🟡 active vs incomplete by fill only~~ ✅
- **LinkList** — 🟡 always a `nav` landmark, may be unnamed · 🟡 fixed `h2` · ~~🟡 no `aria-current`~~ ✅ · see A17

### Page structure
- **PageTitle** — ~~🔴 breadcrumb and nav links without `href` [D]~~ ✅ · ~~🟠 "Volver" button does nothing~~ ✅ · ~~🟡 breadcrumb not `ol`, no `aria-current`~~ ✅ · 🟡 icon-only buttons may be unnamed
- **Headline** — ~~🟠 level tied to visual size [I]~~ ✅
- **SectionHeader** — 🟠 hard-coded `aria-level={2}` on div [I]
- **DropZone** — ~~🔴 hover disables the button [J]~~ ✅ · ~~🟠 "Button" default name [G]~~ ✅ · ~~🟡 instructions not linked~~ ✅
- **FileSelector** — ~~🟠 `buttonLabel` not forwarded ("Button") [G]~~ ✅ · ~~🟠 add/remove not announced [H]~~ ✅ · ~~🟡 focus lost on remove [F]~~ ✅ · 🟡 rows not a list
- **FileUpload** — ~~🟠 label/description not linked to the control [G]~~ ✅ · ~~🟠 compact layout button text "Button" [G]~~ ✅
