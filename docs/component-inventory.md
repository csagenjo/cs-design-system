# Component inventory

The catalogue of every piece in the CS Design System, written for three
readers at once: designers working in Figma, developers working in React,
and AI agents (Claude Code) that assemble interfaces from requirements.

Figma is the source of truth. Each component page in the Figma library has
two doc frames side by side: the component spec (`{Component}`) and
`{Component} — How to use & Accessibility`. Each entry here mirrors the
second frame — same content, plain text, so an agent can read it without
opening Figma.

## How to read an entry

Every entry has two sections, **How to use** and **Accessibility**, each
written for the same three audiences, plus the token prefix:

| Block | Audience | What it answers |
|---|---|---|
| **Designers · Figma** | Designers | When to use it, which properties to set, how to build it in a layout |
| **Developers · React** | Developers | Import path, props with types and defaults, usage notes |
| **AI agents · Claude Code** | Agents | Pick it when / don't pick it when (and what to pick instead), composition rules |
| **Accessibility** (same three audiences) | Everyone | What's built in, what the designer / developer / agent still has to do, known gaps (tracked in `docs/accessibility-audit.md`) |
| **Tokens** | Everyone | The `--ds-{component}-*` prefix it consumes |

Rules that apply to every entry:

- JSX consumes only `--ds-{component}-*` tokens (plus Device typography).
  Never hard-code colours, spacing or radii.
- Import from the file path; there is no barrel export.
  Atoms live in `src/components/`, organisms in `src/organisms/`.
- Fields (inputs and selectors) share the spacing: label → help 4, help → field 8 (label → field 8 without help), field → error 4, and a 4 px focus area around the whole field.
- Hover has two families on purpose: **blue** (`bg/hover-primary`) on selectable surfaces such as rows, options and tabs; **veil** (`opacity/hover`) on controls that sit on any background (Button, Icon Button, Chip, Link, CTA Link).
- If a piece is listed under **Internal parts**, don't use it directly —
  use the component named next to it.

## Groups

| Group | Pieces |
|---|---|
| Actions | Button, IconButton, ButtonBar · _rest to be filled_ |
| Forms | Switch · FileUpload, FileSelector, DropZone, DocumentItem, LabelDescription · FieldLabel, HelperText, ValidationMessage (Form Elements) · RadioGroup, CheckboxGroup · Checkbox, Radio, Chip · InputText, InputDropdown, InputDate, InputStepper, InputTelephone, InputAmount · Selector, AccountSelector (+ invokers and list items) · _rest to be filled_ |
| Data | ListView · DescriptionList (+ DescriptionListItem, DescriptionListAccount) · Table (+ TableRow, CellHeader, CellData, CellMore, CellActions) · _rest to be filled_ |
| Feedback | Snackbar · _rest to be filled_ |
| Navigation | PageTitle · Tabs (+ TabItem, TabPanel) · Link, LinkList, CTALink · _rest to be filled (includes Pagination)_ |
| Overlays | Dialog, DialogSimple, ErrorAndEmptyState, Scrim · _rest to be filled_ |
| Page structure | Accordion, AccordionGroup |
| Accessibility foundations | VisuallyHidden, LiveRegion (+ `announce`) |
| Internal parts | _to be filled_ — includes `_requiredMark` (use FieldLabel `required`), `_choiceGroup` (use RadioGroup / CheckboxGroup), `_useModal`, `_rovingFocus` (`useRovingFocus`, `useListbox`), `_focus` (layer stack), `_popoverDismiss`, `_dialogBase` (use Dialog / DialogSimple / ErrorAndEmptyState) |

---

## Accordion · AccordionGroup

**Group:** Page structure
**Figma:** 🟢 Accordion page → frame *Accordion — How to use & Accessibility*
**Code:** `src/components/Accordion.jsx` (atom), `src/organisms/AccordionGroup.jsx` (organism)
**Tokens:** `--ds-accordion-*`

A vertical list of items whose content expands and collapses under a
clickable title.

## How to use

### Designers · Figma

**When to use**
- Long pages with several independent sections the user scans before
  going into detail: FAQs, groups of settings, record details.
- One block that shows or hides extra content with an Expand / Collapse
  button → use **Collapsible** instead.
- Content the user must see at once, or a process in steps (use Step
  Navigator) → don't use an accordion.

**Properties**
- `Variant` → Expanded · Collapsed.
- `State` → Initial · Hover · Focus · Pressed. Hover, Focus and Pressed
  are interaction states for specs and prototypes; in static screens use
  Initial. In code they come from `:hover`, `:focus-visible` and `:active`.
- `Title`, `Content` → text properties.
- `Last` → on only in the last item of a group: it draws the closing
  bottom border.

**Building a group**
- Vertical auto layout with gap 0.
- Turn `Last` on only in the last item.
- Don't add Dividers between items — each item brings its own top border.

### Developers · React

```jsx
import { Accordion } from './components/Accordion';
import { AccordionGroup } from './organisms/AccordionGroup';
```

**Accordion** — one item, controlled.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | string | — | Plain text shown in the trigger |
| `children` | node | — | Content shown when expanded |
| `expanded` | bool | `false` | Controlled open state |
| `onToggle` | func | — | Called when the trigger is clicked |
| `isLast` | bool | `false` | Draws the bottom closing border |
| `id`, `className` | string | — | Passed to the root |

**AccordionGroup** — a list of items; manages open state for you.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `[{ title, content }]` | `[]` | One entry per item |
| `multiple` | bool | `false` | Allow several items open at once |
| `defaultOpenIndex` | number | — | Item open on first render |
| `className` | string | — | Passed to the root |

**Usage**
- For lists, always use `AccordionGroup`: it sets gap 0 and `isLast`
  on the last item. Use `Accordion` alone only when you need to control
  state yourself.
- The trigger is a real `<button>`; hover, pressed and focus come from
  native pseudo-classes. Don't add your own focus styles.
- Style only through `--ds-accordion-*` tokens.

```jsx
<AccordionGroup
  items={[
    { title: 'Shipping', content: 'Orders ship in 2–3 working days.' },
    { title: 'Returns', content: 'Return any item within 30 days.' },
  ]}
/>
```

### AI agents · Claude Code

**Pick it when**
- The requirement mentions FAQs, "more details", "show/hide sections" or
  long secondary content the user reads on demand.
- A form or detail page has several independent sections and only one
  needs attention at a time.

**Don't pick it when**
- There's a single show/hide block → use **Collapsible**.
- Sections are parallel views of the same object that the user switches
  between → use **Tabs**.
- Sections are sequential steps of a process → use **Step Navigator**.
- The content is essential and every user must see it → show it directly.

**Composition rules**
- Always render through `AccordionGroup`, never a hand-built stack of
  `Accordion`s.
- `title` is plain text: no icons, links or buttons inside it.
- Content can hold text or other components (forms, lists, tables).
- Typical layouts: *Basic — Details*, *Basic — Forms*.

## Accessibility

### Designers · Figma

**Built in**
- Focus state with the system ring (2px gap + 2px outer ring in
  focus-outer blue) — use it in specs and prototypes.
- Trigger height 40px — above the 24 × 24 px minimum target (WCAG 2.5.8).
- Title, content and chevron on `fg/default` — check contrast if you
  place it on a non-default surface.

**Your job**
- Write titles that make sense on their own: screen readers list them out
  of context.
- Keep the title as text only — no links, buttons or icons inside it.
- The chevron is decorative: the open / closed state is announced by the
  trigger, don't add a text label for it.

### Developers · React

**Semantics**
- The trigger is a native `<button type="button">` with `aria-expanded`
  and, when open, `aria-controls` pointing at the content.
- The open content is a `region` named by the title, so screen-reader
  users can jump to it from the landmarks list.
- Collapsed content is removed from the DOM, so Tab and screen readers
  skip it.

**Keyboard**
- Tab / Shift + Tab move between triggers · Enter or Space toggles.
- Focus ring comes from `:focus-visible` — don't override or remove it.

- The trigger sits inside a heading (`<h3>` by default). Set
  `headingLevel` to fit the page outline (one level below the section
  heading above it); `headingLevel={null}` drops the heading.

**Known gaps:** none. ~~No `aria-controls`~~ fixed 21/10 (A11y-3) ·
~~trigger not in a heading~~ fixed 23/10 (A11y-5).

### AI agents · Claude Code

**Check before shipping**
- Every title is unique within its group and describes the content.
- Required fields and error messages are never hidden inside a collapsed
  item.
- No AccordionGroup nested inside another one.

**Don't**
- Put interactive elements in the title.
- Hide content every user must read (legal text, errors, key amounts).

---

## VisuallyHidden · LiveRegion

Accessibility foundations (sprint A11y-0, 20/10/2026). No Figma component —
they don't draw anything. Every app that uses the system also imports
`src/foundations.css` next to `src/tokens.css` (reduced motion and
forced-colors focus for every `ds-*` piece).

## How to use

### Designers · Figma

Nothing to place on the canvas. When a design relies on something only
visible — an icon-only button, a colour meaning "error", a position meaning
"step 2 of 4" — write the text a screen reader should say in the
annotation; developers put it in `VisuallyHidden`. When a message appears
after an action (an error, "saved", "3 results"), say in the annotation
whether it should interrupt (blocking error) or wait (everything else).

### Developers · React

```jsx
import { VisuallyHidden } from '../components/VisuallyHidden';
import { LiveRegion } from '../components/LiveRegion';
import { announce } from '../components/announce';
```

| Piece | Props | Notes |
|---|---|---|
| `VisuallyHidden` | `as` = `'span'` · `focusable` = `false` · `className` | Read aloud, not shown. `focusable` shows it on focus (skip links). Class `ds-visually-hidden` is exported for non-React markup |
| `LiveRegion` | `politeness` = `'polite'` \| `'assertive'` · `atomic` = `true` · `visuallyHidden` = `false` · `as` = `'div'` | Mount it ALWAYS; change what's inside. `polite` → `role="status"`, `assertive` → `role="alert"` (blocking errors only) |
| `announce(message, { politeness })` | `politeness` = `'polite'` | For messages with no visible place. Repeating the same message announces it again |

### AI agents · Claude Code

- Pick `VisuallyHidden` when an element needs words that the visual design
  already conveys. Don't pick it to hide a form label — labels are visible.
- Pick `LiveRegion` around a message that appears on screen after an action.
  Never mount the region together with the message (`{error && <LiveRegion>…}`
  is wrong; `<LiveRegion>{error && …}</LiveRegion>` is right).
- Pick `announce()` when nothing visible changes but the user needs to know
  (result counts, background uploads).

## Accessibility

### Designers · Figma

These pieces are the accessibility. Annotate the hidden text and the
politeness of each status message.

### Developers · React

- A `LiveRegion` outside an open modal is `inert` and silent while the modal
  is open — by design. `announce()` regions are never made inert.
- Use `assertive` only for errors that stop the task; it interrupts whatever
  the screen reader is saying.

### AI agents · Claude Code

Known gaps: none in these pieces. Strings passed to them follow the system
language decision (audit §K, pending).

**Tokens:** none.

---

## FieldLabel · HelperText · ValidationMessage (Form Elements)

**Group:** Forms
**Figma:** 🟢 Form Elements page → `Label` (State Generic/Disabled + Required), `Helper` (State Generic/Disabled), `Validation Message` (Vertically Centred · Top Aligned · Counter) · frame *Form Elements — How to use & Accessibility*
**Code:** `src/components/FieldLabel.jsx`, `src/components/HelperText.jsx`, `src/components/ValidationMessage.jsx` (atoms)
**Tokens:** `--ds-field-label-*` · `--ds-helper-text-*` · `--ds-validation-message-*`

The three pieces every form field is made of: the label (the question, with
the required asterisk), the helper text under it and the message under the
control (an error or a counter). Every input, Selector, Account Selector,
Combobox, File Upload, RadioGroup and CheckboxGroup instances these same
atoms, so a change here reaches all of them.

## How to use

### Designers · Figma

**When to use**
- Inside field components they're already placed — you only set their
  properties on the field instance.
- Use them on their own only to build a field the library doesn't have yet.

**Properties**
- `Label` → `State` Generic · Disabled · `Required` (shows the asterisk,
  brand primary — red is kept for errors) · `Input Label` (text).
- `Helper` → `State` Generic · Disabled · `Description` (text).
- `Validation Message` → `Message Type` Vertically Centred · Top Aligned
  (both are the same in code: the icon sits on the first line) · Counter
  (no icon).

**Building a field**
- Order: Label → Helper → control → Validation Message.
- The spacing between them belongs to the field (Input: `Input/InputCommon/*/gap`;
  groups: `choiceGroup/all/root/gap` and `/validation/gap`), not to the atoms.
- In a group, the asterisk goes on the group label, never on each option.
  A screen that uses asterisks explains them once ("* Required field").

### Developers · React

```jsx
import { FieldLabel } from './components/FieldLabel';
import { HelperText } from './components/HelperText';
import { ValidationMessage } from './components/ValidationMessage';
```

| Atom | Props | Notes |
|---|---|---|
| `FieldLabel` | `as` = `'label'` \| `'span'` \| `'p'` \| `'legend'` · `htmlFor` · `id` · `required` · `disabled` · `className` | `htmlFor` makes it clickable. The asterisk is `aria-hidden` |
| `HelperText` | `id` · `disabled` · `className` | Always visible; never replaces the validation message |
| `ValidationMessage` | `id` · `message` · `type` = `'error'` \| `'counter'` · `live` (default: true for error, false for counter) · `className` | With no `message` it renders nothing, but the live region stays mounted |

**Usage**
- None of the three has an outer margin. The parent sets the spacing with
  its own class (`className`), the same way auto layout does in Figma.
- Point the control's `aria-describedby` at the HelperText and
  ValidationMessage `id`s.
- Pass `message={state === 'error' ? errorMessage : ''}` — don't mount the
  component only when there's an error, or the error won't be announced.

### AI agents · Claude Code

**Pick them when**
- You build a field the library doesn't have. For the usual fields use the
  field component (InputText, Selector, RadioGroup…) — they already include them.

**Don't**
- Rebuild a label, helper or error with plain `<p>`/`<label>` and copied CSS.
- Put the asterisk on Checkbox or Radio options.
- Use HelperText for errors or ValidationMessage for permanent hints.

## Accessibility

### Designers · Figma

**Built in**
- Label 16/24 bold, helper 16/24, message 14/20 with a 16 px icon — all pass
  4.5:1 in light and dark (disabled states are exempt).
- Error = icon + text, never colour alone.

**Your job**
- Write the label as a question or noun the field answers; don't rely on
  placeholder text.
- Error text says what to fix ("Enter a date after today"), not only "Error".

### Developers · React

- `FieldLabel` with `htmlFor` (or `as="legend"` inside a fieldset) gives the
  control its accessible name.
- "Required" is read from the control's `required` / `aria-required`, so
  the asterisk is hidden from screen readers.
- `ValidationMessage` error lives in a persistent `LiveRegion` (polite): it's
  announced when it appears. Counter isn't live (it would talk on every key).

### AI agents · Claude Code

**Check before shipping**
- Every control has a visible FieldLabel (or a group legend).
- Helper and error ids are in the control's `aria-describedby`.

Known gaps: none.

**Tokens:** `--ds-field-label-fg-generic|disabled`, `--ds-field-label-required-fg`,
`--ds-field-label-gap` (Figma `fieldLabel/all/*`) · `--ds-helper-text-fg-generic|disabled`
(`helperText/all/text/fg/*`) · `--ds-validation-message-fg-text|fg-icon`,
`--ds-validation-message-gap` (`validationMessage/all/*`). Typography comes
straight from Device. Since 23/10/2026 they no longer borrow `Input/InputCommon` tokens.

---

## RadioGroup · CheckboxGroup

**Group:** Forms
**Figma:** 🟢 Radio button page → `Radio Group` · 🟢 Checkbox page → `Checkbox Group` (State Initial/Error/Disabled × Orientation Vertical/Horizontal, options in the **Options** slot) · frames *Radio Group — How to use & Accessibility* and *Checkbox Group — How to use & Accessibility*, one on each page
**Code:** `src/organisms/RadioGroup.jsx`, `src/organisms/CheckboxGroup.jsx` (organisms; shared structure in `_choiceGroup.jsx`)
**Tokens:** `--ds-choice-group-*` (+ the Form Elements atoms and Radio / Checkbox)

A question with several options: one answer (RadioGroup) or several
(CheckboxGroup). The group owns the question, the helper, the asterisk and
the error; the options are plain Radio / Checkbox.

## How to use

### Designers · Figma

**When to use**
- RadioGroup: one answer out of 2–7 visible options. More options, or
  little space → Selector or Combobox.
- CheckboxGroup: zero, one or several answers. A single required check
  ("I accept the terms") also goes in a CheckboxGroup with its question.
- Choosing between views of the same content → Segmented Control or Tabs.

**Properties**
- `State` → Initial · Error (shows the Validation Message) · Disabled.
- `Orientation` → Vertical (default) · Horizontal (only short labels, ≤ 3 options).
- Label and Helper are exposed: set `Required`, the question and the help.
- Put the options in the **Options** slot — as many Radio / Checkbox as you need.

**Spacing**
- Question → helper → options: `choiceGroup/all/root/gap` (8).
- Between options: `choiceGroup/all/options/gap` (8).
- Options → error: `choiceGroup/all/validation/gap` (4).

### Developers · React

```jsx
import { RadioGroup } from './organisms/RadioGroup';
import { CheckboxGroup } from './organisms/CheckboxGroup';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | node | — | The question (legend) |
| `helperText` | node | — | Under the question |
| `errorMessage` | node | — | Shown with `state="error"` |
| `state` | `'default'` \| `'error'` \| `'disabled'` | `'default'` | |
| `value` / `values` | string / string[] | — | RadioGroup / CheckboxGroup, controlled |
| `onChange` | func | — | RadioGroup: `(value)` · CheckboxGroup: `(nextValues)` |
| `required` | bool | `false` | Asterisk on the question + native `required` |
| `requiredLabel` | string | `'required'` | CheckboxGroup only: hidden ", required" in the legend when there are several options |
| `orientation` | `'vertical'` \| `'horizontal'` | `'vertical'` | |
| `spacing` | `'default'` \| `'none'` | `'default'` | `none` for lists of SelectorListItem / AccountSelectorListItem |
| `name`, `id`, `className` | string | — | `name` is generated if omitted |

```jsx
<RadioGroup label="Account type" value={type} onChange={setType} required>
  <Radio value="personal" label="Personal" />
  <Radio value="business" label="Business" />
</RadioGroup>
```

**Usage**
- Children only need `value` and `label`; the group passes name, checked
  state, required, error and disabled through context.
- Never put `required` on the children.

### AI agents · Claude Code

**Pick it when**
- A form asks one question with a short, fixed list of answers.

**Don't pick it when**
- More than ~7 options → Selector / Combobox.
- The choice applies immediately and switches a view → Segmented Control / Tabs.
- An on/off setting → a single Checkbox inside a CheckboxGroup only if it's a question; otherwise wait for Switch.

**Composition rules**
- Always render Radio / Checkbox inside their group, never loose with
  hand-made headings.
- A lone required checkbox = CheckboxGroup with one option.

## Accessibility

### Designers · Figma

**Built in**
- The question is the group's name; the asterisk sits only on it.
- Error = icon + text under the options.

**Your job**
- Write the question as the group label — don't rely on a nearby heading.

### Developers · React

**Semantics**
- `<fieldset>` + `<legend>`. RadioGroup: `role="radiogroup"` with
  `aria-required` / `aria-invalid`. CheckboxGroup: `role="group"` (which has
  no `aria-required`), so with several options the legend adds a hidden
  ", required"; with one option, that option gets native `required`.
- Helper and error are linked with `aria-describedby`; the error is in a
  persistent live region.

**Keyboard**
- RadioGroup: one Tab stop, arrows move and select (native radios).
- CheckboxGroup: each option is a Tab stop, Space toggles.

### AI agents · Claude Code

**Check before shipping**
- Every group has a `label`.
- No option is checked or pre-selected by default: the user chooses. If
  an answer is required, mark the group `required` and show the error
  when nothing is chosen.

Known gaps: none.

**Tokens:** `--ds-choice-group-gap` (options, `choiceGroup/all/options/gap`),
`--ds-choice-group-root-gap` (question → helper → options, `choiceGroup/all/root/gap`),
`--ds-choice-group-validation-gap` (`choiceGroup/all/validation/gap`).

---

## Button

**Group:** Actions
**Figma:** 🟢 Buttons page → `Button` set in frame `Buttons` (Type × Variant × Size × Width × State, 288 variants: Default and Accent in the three sizes since 26/10) · frame *Button — How to use & Accessibility*
**Code:** `src/components/Button.jsx` (atom, v3 — same axes as Figma)
**Tokens:** `--ds-button-*`

The action control of the system: it does something on the current view
(save, send, delete, open a dialog). Navigating to another page is a Link.

## How to use

### Designers · Figma

**When to use**
- One action the user starts on this view. One Primary per area; the rest
  Secondary or Tertiary.
- Destructive action: Secondary, on the left of the bar, with a label that
  says what it destroys ("Delete account"). There is no red button.
- Going to another page → Link or CTA Link. Only an icon → Icon Button.

**Properties**
- `Type` → Accent (teal) · Default (black).
- `Variant` → Primary (filled) · Secondary (outline) · Tertiary (text only).
- `Size` → Small 32 · Medium 40 · Large 48 (labels 14 / 16 / 19, bold).
- `Width` → Flexible · Full.
- `State` → Enabled · Hover · Pressed · Focus · Focus Hover · Focus Pressed · Disabled · Loading.
- Icon left / right: `Show Icon Left/Right` + the Lucide icon through the `Icon` wrapper.

**Behaviour**
- Hover: all three variants fill with the Primary background + `bgMix`, text
  and icon turn on-colour.
- Pressed: 80 % opacity (`button/all/root/opacity/pressed`).
- Disabled: its own tokens (background, border, text), never opacity.
- Loading: spinner in the left icon slot, label visible, Enabled look.

**Sizing**
- Root padding `button/all/root/paddingHor/*` (8 / 12 / 16) + label padding
  `button/all/label/paddingHor/generic` (4): text 12 / 16 / 20 from the edge,
  4 from the icon.
- 4 px focus area around it (`button/all/root/focusArea/padding`): the box is
  height + 8 (Large = 56). It's where the focus ring lives.

### Developers · React

```jsx
import { Button } from './components/Button';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `'accent'` \| `'default'` | `'accent'` | Figma `Type` |
| `variant` | `'primary'` \| `'secondary'` \| `'tertiary'` | `'primary'` | Figma `Variant` |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | 32 / 40 / 48 |
| `iconLeft` / `iconRight` | string | — | `Icon` name |
| `fullWidth` | bool | `false` | Width=Full (minus the focus area) |
| `disabled` | bool | `false` | Native `disabled` |
| `loading` | bool | `false` | State=Loading |
| `loadingLabel` | string | `'Loading'` | Added to the name and announced |
| `htmlType` | `'button'` \| `'submit'` \| `'reset'` | `'button'` | |
| `...rest` | | | Forwarded to the `<button>` (aria-*, data-*, title) |

```jsx
<Button iconLeft="save" loading={saving}>Save</Button>
<Button type="default" variant="secondary" iconLeft="chevron-left">Back</Button>
<Button variant="tertiary">Cancel</Button>
```

**Usage**
- Write the action as a verb ("Save", "Send request"). The Figma placeholder
  "Button" triggers a dev warning.
- While an action runs, use `loading`, not `disabled`: the button keeps its
  focus and a second click does nothing.
- API before v3 (`variant="accent|default|ghost|negative"`, `outline`) still
  renders, mapped to the new axes, with a dev warning. `floating` and
  `iconOnly` were removed (not in Figma; use IconButton for icon only).

### AI agents · Claude Code

**Pick it when**
- The user triggers an action on this view.

**Don't pick it when**
- It navigates → Link / CTALink with `href`.
- Icon only → IconButton.
- A screen's closing actions → ButtonBar.
- Choosing between options → Segmented Control, Radio Group, Chip.

**Composition rules**
- Inside another component, keep the configuration it fixes; never change the
  variant of a nested Button.
- Never restyle with hex values; re-theme only through `--ds-button-*`
  (Collapsible does it this way).

## Accessibility

### Designers · Figma

**Built in**
- Focus ring outside the control: 2 px gap + 2 px ring (`borderColor/focus-outer`,
  ≥ 3:1 against the background).
- Icon colour by contrast with the fill of each state, not by variant.
- Loading keeps the Enabled look, so it doesn't read as disabled.

**Your job**
- A visible label on every button; one Primary per area.
- Destructive actions say what they do; colour is never the only signal.

### Developers · React

**Semantics**
- Native `<button type="button">`.
- `loading` → `aria-busy` + `aria-disabled`; the name becomes "Save, Loading"
  and `loadingLabel` is announced when it starts; a submit button in loading
  doesn't send the form.
- `disabled` → native `disabled` (removed from the Tab order).

**Keyboard**
- Tab to focus, Enter / Space to activate.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- No button keeps the text "Button".
- `loading` instead of `disabled` while an action is running.
- No dev warnings about the pre-v3 API.

**Don't**
- Don't render a `<div onClick>` styled as a button.
- Don't use Button for navigation.

---

## IconButton

**Group:** Actions
**Figma:** 🟢 Buttons page → `Icon Button` set in frame `Buttons - Icon Button` (Type × Variant × Size × State × with Label, 240 variants; `State=Loading` with spinner since 26/10) · frame *Icon Button — How to use & Accessibility*
**Code:** `src/components/IconButton.jsx` (atom)
**Tokens:** `--ds-icon-button-*`

A round button with only an icon, optionally with a short label under it.
For compact toolbars and repeated actions (close, edit, filter).

## How to use

### Designers · Figma

**When to use**
- The icon is well known (close, search, edit, add) or a label sits under it.
- Space is tight: tables, cards, headers.
- Not well known, or the main action of the page → Button with text.

**Properties**
- `Type` → Default · Accent.
- `Variant` → Primary (filled) · Secondary (outline) · Tertiary (icon only).
- `Size` → Small 32 · Medium 44 · Large 56.
- `with Label` → None · Yes (label under the circle).
- `State` → Enabled · Hover · Pressed · Focus · Hover Focus · Focus Pressed · Disabled · Loading.

**Behaviour**
- Hover: all three variants fill with the Primary background + `bgMix`, icon on-colour.
- Pressed: Primary background at 80 % (`iconButton/all/root/opacity/pressed`), also in Secondary and Tertiary.
- Loading: spinner in place of the icon, same size and colour.

**Sizing**
- 4 px focus area around it (`iconButton/all/root/focusArea/padding`): the box is size + 8.

### Developers · React

```jsx
import { IconButton } from './components/IconButton';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | string | — | `Icon` name |
| `ariaLabel` | string | — | Required without `label` |
| `label` | string | — | Visible label under the icon; it is the name |
| `type` | `'default'` \| `'accent'` | `'default'` | |
| `variant` | `'primary'` \| `'secondary'` \| `'tertiary'` | `'secondary'` | |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | 32 / 44 / 56 |
| `disabled` | bool | `false` | |
| `loading` | bool | `false` | State=Loading |
| `loadingLabel` | string | `'Loading'` | Added to the name and announced |
| `htmlType`, `id`, `className`, `onClick` | | | |
| `...rest` | | | Forwarded to the `<button>` |

```jsx
<Tooltip label="Close" describe={false}><IconButton icon="x" ariaLabel="Close" /></Tooltip>
<IconButton icon="edit" label="Edit" />
```

### AI agents · Claude Code

**Pick it when**
- A secondary action with a universal icon, or a repeated action per row.

**Don't pick it when**
- The action needs words to be understood → Button.
- Expanding / collapsing content → CollapsibleIconButton.

**Composition rules**
- Without `label`, wrap it in a Tooltip with the same text as `ariaLabel`
  and `describe={false}`, so the name isn't read twice.

## Accessibility

### Designers · Figma

**Built in**
- Focus ring outside the circle, also with label.
- Icon colour by contrast (on-color for filled, on-outline for outline).

**Your job**
- Give every Icon Button a name (the tooltip text) in the spec.
- Small (32) still meets the 24 × 24 target; don't make it smaller.

### Developers · React

**Semantics**
- Native `<button>`; the icon is decorative.
- Name = visible `label` if there is one (WCAG 2.5.3); `ariaLabel` is used
  only if it contains that text, otherwise it's ignored with a dev warning.
  No label and no `ariaLabel` → dev warning.
- `loading` → `aria-busy` + `aria-disabled`, ", Loading" in the name, announced.

**Keyboard**
- Tab, Enter / Space.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every IconButton has `ariaLabel` or `label`.
- The tooltip and `ariaLabel` say the same thing (`describe={false}` on the Tooltip).

**Don't**
- Don't put a bare Lucide icon with `onClick`; use IconButton.

---

## ButtonBar

**Group:** Actions (organism)
**Figma:** 🟢 Buttons page → `Button Bar` set (Variant Complex / Simple / Form / Detail + `Show Notification`, `Show Previous`, `Show Negative`, `Show Cancel`, `Show Secondary`, `Show Primary`, `Show Next`; created 26/10) · frames *Button Bar* (variants, by Carol) and *Button Bar — How to use & Accessibility*
**Code:** `src/organisms/ButtonBar.jsx` (organism, v3; composes Button and takes an InlineNotification)
**Tokens:** `--ds-button-bar-gap`, `--ds-button-bar-notification-gap` (`buttonBar/all/*`)

The closing actions of a screen: forms, step processes, search panels and
detail views. It fixes the order and the style of each button so every
screen in La Plataforma reads the same.

## How to use

### Designers · Figma

**When to use**
- `Complex` → step processes and master-detail. Left: notification above
  Previous + negative actions. Right: Cancel, secondary actions, primary, Next.
- `Simple` → search and filters. Left: notification. Right: secondary + Search.
- `Form` → forms. Left: notification above negative actions. Right: Cancel + primary.
- `Detail` → detail headers. Left: notification. Right: secondary + primary.

**Rules**
- Buttons are Accent Large. Primary filled, one per bar, last on the right
  (only Next goes after it).
- Negative actions are Secondary and always on the left.
- Cancel, Previous and Next are Tertiary.
- Gap 24 between actions (`buttonBar/all/root/gap`), 16 between the
  notification and the actions (`buttonBar/all/notification/gap`).
- No padding, border or background: the screen that holds it sets them.
- The nested instances are locked: change texts and use the `Show…`
  properties; never change their variants.

### Developers · React

```jsx
import { ButtonBar } from './organisms/ButtonBar';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'complex'` \| `'simple'` \| `'form'` \| `'detail'` | — | |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'lg'` | Figma uses Large |
| `notification` | node | — | An InlineNotification |
| `primaryLabel` / `onPrimary` / `primaryIcon` | | | Primary renders only with `onPrimary` |
| `primaryLoading` / `primaryDisabled` | bool | `false` | |
| `secondaryLabel` / `onSecondary` / `secondaryIcon` | | | simple, detail, complex |
| `extraSecondary` | `{label, onClick, icon?, disabled?}[]` | `[]` | complex, detail |
| `cancelLabel` / `onCancel` | | `'Cancel'` | complex, form |
| `negativeActions` | `{label, onClick, icon?, disabled?}[]` | `[]` | complex, form |
| `onPrev` / `prevLabel` / `prevDisabled` | | `'Previous'` | complex |
| `onNext` / `nextLabel` / `nextDisabled` | | `'Next'` | complex |
| `ariaLabel` | string | — | Names the group of actions |

Default labels are English; always pass the screen's own.

### AI agents · Claude Code

**Pick it when**
- A screen needs its closing actions (save / cancel / next).

**Don't pick it when**
- One action alone → Button.
- Actions inside a table cell → CellActions.

**Composition rules**
- Don't build the row by hand with loose Buttons; the order is part of the pattern.
- Errors of the whole screen go in `notification`, not in a toast.

## Accessibility

### Designers · Figma

**Built in**
- Visual order = DOM order = Tab order: notification, left actions, right actions.

**Your job**
- Clear verbs on every label; the primary says what happens ("Send request").
- Destructive actions say what they destroy.

### Developers · React

**Semantics**
- A `<div>` with native Buttons (with `ariaLabel`, `role="group"`).
- The notification is an InlineNotification: an error one is `role="alert"`.
- `prevDisabled` / `nextDisabled` use native `disabled`; `primaryLoading` keeps focus.

**Keyboard**
- Tab through the buttons in visual order.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Pass every label in the screen's language.
- One primary per bar.

---

## Checkbox

**Group:** Forms
**Figma:** Checkbox page → `Checkbox` set (Behavior Unselected / Selected / Indeterminate × State Initial / Hover / Pressed / Focus / Error / Disabled, 18 variants; rebuilt 26/10 with the 4 px focus area) and `.CheckStates` (internal: the box) · frame *Checkbox — How to use & Accessibility*
**Code:** `src/components/Checkbox.jsx` (atom, v3)
**Tokens:** `--ds-checkbox-*`

One option the user can turn on or off. Options always go inside a
CheckboxGroup, which gives them a question, help and the error message.

## How to use

### Designers · Figma

**When to use**
- Pick any number of options from a list (zero, one or several).
- Accepting terms: one check inside a Checkbox Group with its question.
- Only one answer allowed → Radio. Turning a setting on at once → wait for Switch.

**Properties**
- `Behavior` → Unselected · Selected · Indeterminate ("some of the children are selected").
- `State` → Initial · Hover · Pressed · Focus · Error · Disabled.
- `Label` (text) — short, says what checking it means.

**Behaviour**
- The whole row (box + label) is the control: hover fills the row, pressed lowers its opacity, the focus ring surrounds the row.
- Help text and error message are not part of the checkbox: use Checkbox Group.

**Sizing**
- 24 slot with a 20 box, 6 gap to the label, 2 padding, row radius 8.
- 4 px focus area around it (`checkbox/all/root/focusArea/padding`): with a label the box is 36 high.

### Developers · React

```jsx
import { Checkbox } from './components/Checkbox';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | string | — | Visible text; it is the name |
| `ariaLabel` | string | — | Only without `label` (a table row, say) |
| `checked` / `defaultChecked` | bool | — | Controlled / uncontrolled |
| `indeterminate` | bool | `false` | Native `.indeterminate` property |
| `state` | `'default'` \| `'error'` \| `'disabled'` | `'default'` | |
| `onChange`, `onFocus`, `onBlur` | func | — | |
| `id`, `name`, `value`, `required` | | | Inside a CheckboxGroup the group sets `name`, checked, required, error and disabled |
| `fullWidth` | bool | `false` | Row fills the width (minus the focus area) |

`description` and `errorMessage` were removed in v3 (dev warning if passed):
the group shows help and errors.

```jsx
<CheckboxGroup label="Notifications" values={v} onChange={setV}>
  <Checkbox value="email" label="Email" />
  <Checkbox value="sms" label="SMS" />
</CheckboxGroup>
```

### AI agents · Claude Code

**Pick it when**
- A form question accepts several answers, or a row of a table can be selected.

**Don't pick it when**
- Only one answer is allowed → RadioGroup.
- The choice is a filter on a list → Chip `type="filter"`.

**Composition rules**
- Always inside CheckboxGroup, except a selection checkbox in a table row or a list item (with `ariaLabel`).
- Never put help or error text next to a single Checkbox; pass them to the group.

## Accessibility

### Designers · Figma

**Built in**
- Focus ring around the whole row, inside the component's own box (never clipped).
- Hover / pressed on the whole row: the click area is the box and the label.
- Required asterisk only on the group's question, never on the option.

**Your job**
- Write a label that makes sense on its own ("Email", not "Yes").
- Mark indeterminate only for a parent that controls a list of children.

### Developers · React

**Semantics**
- Native `<input type="checkbox">` inside a `<label>`: clicking the text toggles it.
- Indeterminate via the native property (read as "mixed").
- `state="error"` → `aria-invalid`; the group's message is linked with `aria-describedby`.

**Keyboard**
- Tab to reach it, Space to toggle.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every Checkbox has `label` or `ariaLabel`.
- Errors come from CheckboxGroup `state="error"` + `errorMessage`.

**Don't**
- Don't build a checkbox from a `div` with `onClick`.

---

## Radio

**Group:** Forms
**Figma:** Radio button page → `Radio button` set (Behavior Unselected / Selected × State Initial / Hover / Pressed / Focus / Error / Disabled, 12 variants; rebuilt 26/10 with the 4 px focus area) and `.RadioStates` (internal: the circle) · frame *Radio button — How to use & Accessibility*
**Code:** `src/components/Radio.jsx` (atom, v2)
**Tokens:** `--ds-radio-*`

One answer out of several. Radios always go inside a RadioGroup, which
gives them their question, help, error and the arrow-key behaviour.

## How to use

### Designers · Figma

**When to use**
- One, and only one, answer from 2–6 visible options.
- More options, or space is tight → Selector / Dropdown.
- Several answers allowed → Checkbox.

**Properties**
- `Behavior` → Unselected · Selected.
- `State` → Initial · Hover · Pressed · Focus · Error · Disabled.
- `Label` (text) · `Show Label` (hide it only in list items that already have a title).

**Behaviour**
- The whole row (circle + label) is the control: hover fills the row, pressed lowers its opacity, the focus ring surrounds the row.
- Help text and error message belong to Radio Group.

**Sizing**
- 24 slot with a 20 circle and a 10 dot, 6 gap to the label, 2 padding, row radius 8.
- 4 px focus area around it (`radioButton/all/root/focusArea/padding`): with a label it is 36 high.

### Developers · React

```jsx
import { Radio } from './components/Radio';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | string | — | Visible text; it is the name |
| `showLabel` | bool | `true` | `false` needs `ariaLabel` |
| `ariaLabel` | string | — | Only without a visible label |
| `value` | string | — | Required inside a RadioGroup |
| `checked` / `defaultChecked` | bool | — | The group sets it from its `value` |
| `state` | `'default'` \| `'error'` \| `'disabled'` | `'default'` | |
| `onChange`, `onFocus`, `onBlur` | func | — | |
| `id`, `name`, `required` | | | Set by the group |
| `fullWidth` | bool | `false` | |

`description` and `errorMessage` were removed in v2 (dev warning if passed).

```jsx
<RadioGroup label="Account type" name="type" value={v} onChange={setV}>
  <Radio value="personal" label="Personal" />
  <Radio value="business" label="Business" />
</RadioGroup>
```

### AI agents · Claude Code

**Pick it when**
- A single answer from a short visible list.

**Don't pick it when**
- Several answers → CheckboxGroup. A long list → Selector. Switching views → SegmentedControl or Tabs.

**Composition rules**
- Always inside RadioGroup (it gives the shared `name`, the question and the arrow keys).
- Selectable list items use SelectorListItem, which already contains the Radio.

## Accessibility

### Designers · Figma

**Built in**
- Focus ring around the whole row, inside the component's own box.
- Click area = circle + label.
- Required asterisk only on the group's question.

**Your job**
- Labels must be distinct and short; don't rely on order alone.
- Don't pre-select any option: the user has to choose. A preset answer
  is easy to miss and gets submitted without being read.

### Developers · React

**Semantics**
- Native `<input type="radio">` inside a `<label>`.
- `state="error"` → `aria-invalid`; the group's message is linked with `aria-describedby`.

**Keyboard**
- Tab enters the group on the selected option; arrows move and select (native radio behaviour).

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- All radios of a question share one RadioGroup.
- Every Radio has `label` (or `showLabel={false}` + `ariaLabel`).

**Don't**
- Don't use a lone Radio as an on/off control.

---

## Chip

**Group:** Forms
**Figma:** Chip page → sets `Chip Choice` (State × Behavior), `Chip Filter` (Variant Selectable / Dismissible × State × Behavior), `Chip Input` (State × Part Chip / Delete) and `.Label` (internal: the "Label:" of Filter Dismissible) — rebuilt 26/10 with the 4 px focus area · frame *Chip — How to use & Accessibility*
**Code:** `src/components/Chip.jsx` (atom, v2)
**Tokens:** `--ds-chip-*`

Small, rounded pieces for choosing, filtering or showing entered values.

## How to use

### Designers · Figma

**When to use**
- `Choice` → pick options in a compact row (tags, quick answers).
- `Filter Selectable` → turn a filter on or off on a list.
- `Filter Dismissible` → an applied filter ("Status: Active") that can be removed.
- `Input` → a value the user entered (Combobox multiple, e-mail recipients), removable with its X.
- A form question with a label and error → Checkbox / Radio groups instead.

**Properties**
- `State` → Initial · Hover · Pressed · Focus · Disabled.
- `Behavior` → Unselected · Selected (Choice, Filter Selectable).
- `Part` (Input) → Chip (the body) · Delete (the X: hover shows a 1 px border, focus rings the X).

**Behaviour**
- Selected: filled teal with a check icon.
- Hover adds `bgMix`; pressed lowers the opacity.

**Sizing**
- 32 high: padding 4 / 8, gap 4, icons 20, radius 8, label 16 regular.
- 4 px focus area around it (`chip/all/root/focusArea/padding`): the box is 40 high.

### Developers · React

```jsx
import { Chip } from './components/Chip';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `'choice'` \| `'filter'` \| `'input'` | `'choice'` | |
| `variant` | `'selectable'` \| `'dismissible'` | `'selectable'` | Filter only |
| `label` | string | — | Choice, Filter Selectable, Input |
| `selected` / `defaultSelected` | bool | — / `false` | Controlled / uncontrolled |
| `onSelectedChange` | func(bool) | — | |
| `filterLabel`, `value` | string | — | Filter Dismissible: "filterLabel: value" |
| `onRemove` | func | — | Shows the X (Dismissible, Input) |
| `icon` | node | — | Input: leading icon |
| `onChipClick` | func | — | Input: makes the body a button |
| `disabled` | bool | `false` | |
| `ariaLabel` | string | — | Only without visible text |
| `removeLabel` | string | `'Remove'` | X name: "Remove Status: Active" |
| `id`, `name` | | | |

```jsx
<Chip label="Pending" selected={on} onSelectedChange={setOn} />
<Chip type="filter" variant="dismissible" filterLabel="Status" value="Active" onRemove={clear} />
<Chip type="input" label="Spain" onRemove={() => remove('es')} />
```

### AI agents · Claude Code

**Pick it when**
- Compact toggles or filters above a list, or showing removable values.

**Don't pick it when**
- A form question → CheckboxGroup / RadioGroup. Switching views → SegmentedControl or Tabs. Status display only → BadgeHighlight.

**Composition rules**
- A row of related chips goes in a container with a name (`role="group"` + `aria-label`).
- Combobox `multiple` already renders Input chips; don't add them by hand.

## Accessibility

### Designers · Figma

**Built in**
- Focus ring outside the chip, inside its own box (never clipped). On Input chips the X has its own ring.
- The X has a 24 × 24 click area even though the icon is 20.
- Selected is shown by colour and the check icon, not by colour alone.

**Your job**
- Keep labels short and unique within the row.
- Name the row of chips in the spec ("Filters").

### Developers · React

**Semantics**
- Choice / Filter Selectable: `<button aria-pressed>`.
- Filter Dismissible: `role="group"` named "filterLabel: value"; the X is a button "Remove filterLabel: value".
- Input: the body is a button only with `onChipClick`; the X is "Remove {label}".

**Keyboard**
- Tab to each chip (and to each X), Enter / Space to toggle or remove.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- After removing a chip, move focus to the next chip or the field (Combobox does this already).
- `removeLabel` is translated if the screen isn't in English.

**Don't**
- Don't use chips as the only way to submit or navigate.

---

## InputText

**Group:** Forms
**Figma:** 🟢 Inputs page → `Input Text` set (State Initial / Enabled / Hover / Focus / Error / Read-only / Disabled × Type Single Line / Adaptive, 14 variants) and `.Field` (internal: the box) · frame *Input Text — How to use & Accessibility* (27/10)
**Code:** `src/components/InputText.jsx` (atom)
**Tokens:** `--ds-input-*`

A text field: one line, or a box that grows with the text (Adaptive). Optional icons on either side.

## How to use

### Designers · Figma

**When to use**
- Free text the user types: name, reference, search inside a form, a comment.
- Long text that wraps → Type Adaptive (grows with the content).
- A date → Input Date · an amount → Input Amount · a phone → Input Telephone · pick one of a list → Input Dropdown or Selector.

**Properties**
- State → Initial (empty, shows the placeholder) · Enabled (with a value) · Hover · Focus · Error · Read-only · Disabled.
- Type → Single Line · Adaptive.
- Label · Description (help text) · Validation text (booleans).
- On .Field: Show Icon (left) · Show Eye Button (right) · Text.

**Behaviour**
- Hover darkens the border (borderColor/emphasis).
- Focus keeps the border and adds a white gap + blue ring outside it.
- Error: red border + message below with icon.
- Disabled: grey field, grey text; nothing reacts.
- Read-only: grey field with normal text — it can be focused, read and copied, not edited.
- Placeholder text is grey (valueText/fg/placeholder).

**Sizing**
- Field 56 high, padding 16, radius 8, border 1.5.
- Label, help (above the field) and error message (below) are Form Elements instances.
- 4 px focus area around the whole input (Input/InputCommon/root/focusArea/padding): the focus ring fits inside the component and the label stays aligned with the border.

### Developers · React

```jsx
import { InputText } from './components/InputText';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Visible label |
| `ariaLabel` | `string` | — | Only without a visible label |
| `value / defaultValue` | `string` | — | Controlled / uncontrolled |
| `onChange, onFocus, onBlur` | `func` | — |  |
| `placeholder` | `string` | `''` | An example, never the label |
| `type` | `string` | `'text'` | 'email', 'password', 'search'… |
| `adaptive` | `bool` | `false` | Textarea that grows with the text (Figma Type Adaptive) |
| `state` | `'default' \| 'error' \| 'read-only' \| 'disabled'` | `'default'` |  |
| `helperText / errorMessage` | `string` | — | errorMessage shows with state="error" |
| `iconLeft / iconRight` | `icon name` | — | iconLeftPrimary / iconRightPrimary → teal (an icon that does something) |
| `required` | `bool` | `false` | Asterisk + native required |
| `fullWidth` | `bool` | `false` | Fills the width minus the focus area |
| `id, name, …rest` |  | — | Forwarded to the <input> / <textarea> |

```jsx
<InputText label="Reference" helperText="As it appears on the invoice" value={v} onChange={e => setV(e.target.value)} />
<InputText label="Notes" adaptive />
<InputText label="Email" type="email" state="error" errorMessage="Enter an email like name@company.com" />
```

### AI agents · Claude Code

**Pick it when**
- The user types free text.

**Don't pick it when**
- Dates, amounts, phone numbers → InputDate, InputAmount, InputTelephone.
- Choosing from known options → InputDropdown (few), Selector or Combobox (search).

**Composition rules**
- One InputText per question; group related fields with a heading, not with one label.
- Use type for the right mobile keyboard (email, tel, url).

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the field; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box.
- Error is not colour only: icon + text under the field.
- Required = asterisk on the label in the brand colour (not red).

**Your job**
- Always show a label; the placeholder is an example, not the label.
- Write the error as what to do ("Enter a date after today"), not "Invalid".

### Developers · React

**Semantics**
- label → <label for>; helperText and errorMessage → aria-describedby.
- state="error" → aria-invalid; the message lives in a persistent live region, so it is announced when it appears.
- required → asterisk + native required.
- adaptive renders a <textarea>; read-only uses the native readOnly attribute (focusable).

**Keyboard**
- Tab to reach it; typing as usual.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every input has label (or ariaLabel when there is truly no visible label).
- Errors use state="error" + errorMessage, never text placed by hand under the field.

**Don't**
- Don't use the placeholder as the only label.
- Don't add your own border or focus style around the field.

---

## InputDropdown

**Group:** Forms
**Figma:** 🟢 Inputs page → `Input Dropdown` set (State Initial / Enabled / Hover / Focus / Error / Disabled) and `Dropdown` (internal: the box) · frame *Input Dropdown — How to use & Accessibility* (27/10)
**Code:** `src/components/InputDropdown.jsx` (atom)
**Tokens:** `--ds-input-*`

A native select: pick one option from a short list. The list is the browser's own.

## How to use

### Designers · Figma

**When to use**
- Pick one option from a short, known list (2–15 options): country of residence, document type.
- Few options (2–5) that should all be visible → Radio Group.
- Long lists or options with detail (account, amount) → Selector · typing to search → Combobox.

**Properties**
- State → Initial (no option yet, shows the placeholder) · Enabled · Hover · Focus · Error · Disabled.
- Label · Helper Text · Validation (booleans).
- Text on the Dropdown instance: the selected option or the placeholder.

**Behaviour**
- Hover darkens the border (borderColor/emphasis).
- Focus keeps the border and adds a white gap + blue ring outside it.
- Error: red border + message below with icon.
- Disabled: grey field, grey text; nothing reacts.
- The chevron is teal; the open list is the operating system's (not designed in Figma).

**Sizing**
- Field 56 high, padding 16, radius 8, border 1.5.
- Label, help (above the field) and error message (below) are Form Elements instances.
- 4 px focus area around the whole input (Input/InputCommon/root/focusArea/padding): the focus ring fits inside the component and the label stays aligned with the border.

### Developers · React

```jsx
import { InputDropdown } from './components/InputDropdown';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label |
| `options` | `{ value, label, disabled? }[]` | `[]` |  |
| `value / defaultValue` | `string` | — |  |
| `onChange` | `func` | — | Native change event |
| `placeholder` | `string` | `'Select an option'` | First option, not selectable |
| `state` | `'default' \| 'error' \| 'disabled'` | `'default'` |  |
| `helperText / errorMessage` | `string` | — |  |
| `required` | `bool` | `false` |  |
| `fullWidth` | `bool` | `false` |  |
| `id, name, onFocus, onBlur` |  | — |  |

```jsx
<InputDropdown label="Document type" options={[{ value: "id", label: "ID card" }, { value: "pp", label: "Passport" }]} value={v} onChange={e => setV(e.target.value)} />
```

### AI agents · Claude Code

**Pick it when**
- One choice from a short list where the options need no extra detail.

**Don't pick it when**
- 2–5 options the user should compare → RadioGroup.
- Options with secondary data or more than ~15 → Selector or Combobox.

**Composition rules**
- Order options in a meaningful way (alphabetical, frequency); no empty or duplicate labels.

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the field; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box.
- Error is not colour only: icon + text under the field.
- Required = asterisk on the label in the brand colour (not red).

**Your job**
- Always show a label; the placeholder is an example, not the label.
- Write the error as what to do ("Enter a date after today"), not "Invalid".

### Developers · React

**Semantics**
- label → <label for>; helperText and errorMessage → aria-describedby.
- state="error" → aria-invalid; the message lives in a persistent live region, so it is announced when it appears.
- required → asterisk + native required.
- Native <select>: the list, the keyboard and the screen reader output come from the browser.

**Keyboard**
- Tab to reach it; Space / Alt+↓ opens the list; arrows change the option; typing jumps to it.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every input has label (or ariaLabel when there is truly no visible label).
- Errors use state="error" + errorMessage, never text placed by hand under the field.

**Don't**
- Don't use the placeholder as the only label.
- Don't add your own border or focus style around the field.

---

## InputDate

**Group:** Forms
**Figma:** 🟢 Inputs page → `Input Date` set (State Initial / Enabled / Hover / Focus / Error / Disabled) and `Date` (internal: the box) · frame *Input Date — How to use & Accessibility* (27/10)
**Code:** `src/components/InputDate.jsx` (atom)
**Tokens:** `--ds-input-*`

A text field for a date typed as text, with the calendar icon as a visual hint.

## How to use

### Designers · Figma

**When to use**
- A date the user knows (date of birth, document expiry): typing is faster than a calendar.
- Picking a date by looking at a calendar → wait for the Date Picker (not built yet).

**Properties**
- State → Initial (shows the format dd/mm/yyyy) · Enabled · Hover · Focus · Error · Disabled.
- Label · Helper Text · Validation (booleans).

**Behaviour**
- Hover darkens the border (borderColor/emphasis).
- Focus keeps the border and adds a white gap + blue ring outside it.
- Error: red border + message below with icon.
- Disabled: grey field, grey text; nothing reacts.
- The calendar icon is decorative: it does not open anything.

**Sizing**
- Field 56 high, padding 16, radius 8, border 1.5.
- Label, help (above the field) and error message (below) are Form Elements instances.
- 4 px focus area around the whole input (Input/InputCommon/root/focusArea/padding): the focus ring fits inside the component and the label stays aligned with the border.

### Developers · React

```jsx
import { InputDate } from './components/InputDate';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label |
| `value / defaultValue` | `string` | — | Text, as typed |
| `onChange` | `func` | — |  |
| `placeholder` | `string` | `'DD/MM/YYYY'` | Also read as the format (formatHint) |
| `formatHint` | `(format) => string \| null` | ``Format ${fmt}`` | Hidden text so the format is not lost once the user types; null if helperText already says it |
| `state` | `'default' \| 'error' \| 'disabled'` | `'default'` |  |
| `helperText / errorMessage` | `string` | — |  |
| `required` | `bool` | `false` |  |
| `fullWidth` | `bool` | `false` |  |
| `id, name, onFocus, onBlur, …rest` |  | — |  |

```jsx
<InputDate label="Date of birth" value={d} onChange={e => setD(e.target.value)} />
<InputDate label="Expiry date" state="error" errorMessage="The date must be after today" />
```

### AI agents · Claude Code

**Pick it when**
- A date the user can type from memory or from a document.

**Don't pick it when**
- Choosing a date relative to others (a booking, a range) → Date Picker when it exists.

**Composition rules**
- Validate the format and the range; say in the error which format and which range.

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the field; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box.
- Error is not colour only: icon + text under the field.
- Required = asterisk on the label in the brand colour (not red).
- The format is always visible (placeholder) and also read by screen readers.

**Your job**
- Always show a label; the placeholder is an example, not the label.
- Write the error as what to do ("Enter a date after today"), not "Invalid".

### Developers · React

**Semantics**
- label → <label for>; helperText and errorMessage → aria-describedby.
- state="error" → aria-invalid; the message lives in a persistent live region, so it is announced when it appears.
- required → asterisk + native required.
- The format is a hidden description (formatHint), because the placeholder disappears when typing.

**Keyboard**
- Tab to reach it; typing as usual.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every input has label (or ariaLabel when there is truly no visible label).
- Errors use state="error" + errorMessage, never text placed by hand under the field.

**Don't**
- Don't use the placeholder as the only label.
- Don't add your own border or focus style around the field.

---

## InputStepper

**Group:** Forms
**Figma:** 🟢 Inputs page → `Stepper` set (State Enabled / Hover / Focus / Error / Read-only / Disabled) and `Stepper Build` (internal: the box with − and +) · frame *Stepper — How to use & Accessibility* (27/10)
**Code:** `src/components/InputStepper.jsx` (atom, v2)
**Tokens:** `--ds-input-*`

A small number changed one step at a time with − and +, or with the arrow keys.

## How to use

### Designers · Figma

**When to use**
- A small whole number close to a default: quantity, number of people, copies.
- Numbers the user types (amounts, IDs) → Input Text or Input Amount.

**Properties**
- State → Enabled · Hover · Focus · Error · Read-only · Disabled.
- Label · Helper Text · Validation (booleans).

**Behaviour**
- Hover darkens the border (borderColor/emphasis).
- Focus keeps the border and adds a white gap + blue ring outside it.
- Error: red border + message below with icon.
- Disabled: grey field, grey text; nothing reacts.
- − and + are teal; at the minimum / maximum the matching button turns grey.
- Read-only: grey field, value in normal text, both buttons grey.
- Focus rings the whole field (the value is the control; the buttons are for the mouse).

**Sizing**
- Field 56 high, padding 16, radius 8, border 1.5.
- Label, help (above the field) and error message (below) are Form Elements instances.
- 4 px focus area around the whole input (Input/InputCommon/root/focusArea/padding): the focus ring fits inside the component and the label stays aligned with the border.

### Developers · React

```jsx
import { InputStepper } from './components/InputStepper';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label |
| `value / defaultValue` | `number` | `— / 0` |  |
| `onChange` | `(value: number) => void` | — |  |
| `min / max` | `number` | — | Buttons and keys stop there |
| `step` | `number` | `1` | PageUp / PageDown move 10 steps |
| `state` | `'default' \| 'error' \| 'read-only' \| 'disabled'` | `'default'` |  |
| `helperText / errorMessage` | `string` | — |  |
| `decrementLabel / incrementLabel` | `string` | `'Decrease' / 'Increase'` | Names of the buttons |
| `fullWidth` | `bool` | `false` |  |
| `id` | `string` | — | Id of the spinbutton |

```jsx
<InputStepper label="Guests" min={1} max={8} value={n} onChange={setN} />
```

### AI agents · Claude Code

**Pick it when**
- A small number the user nudges up or down.

**Don't pick it when**
- Large or exact numbers → InputText (type="number" is not recommended) or InputAmount.

**Composition rules**
- Always give min and max when they exist; say the range in helperText.

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the field; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box.
- Error is not colour only: icon + text under the field.
- Required = asterisk on the label in the brand colour (not red).
- Keyboard users change the value with the arrow keys; the buttons are not separate stops.

**Your job**
- Always show a label; the placeholder is an example, not the label.
- Write the error as what to do ("Enter a date after today"), not "Invalid".

### Developers · React

**Semantics**
- label → <label for>; helperText and errorMessage → aria-describedby.
- state="error" → aria-invalid; the message lives in a persistent live region, so it is announced when it appears.
- required → asterisk + native required.
- The value is role="spinbutton" with aria-valuenow / min / max (APG pattern); read-only → aria-readonly.
- − and + are buttons out of the tab order; clicking them keeps the focus on the value, so the new value is announced.

**Keyboard**
- Tab to the value; ↑ / ↓ one step; Page Up / Page Down ten steps; Home / End to min / max.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every input has label (or ariaLabel when there is truly no visible label).
- Errors use state="error" + errorMessage, never text placed by hand under the field.

**Don't**
- Don't use the placeholder as the only label.
- Don't add your own border or focus style around the field.

---

## InputTelephone

**Group:** Forms
**Figma:** 🟢 Inputs page → `Input Telephone` set (Variant Selectable / Fixed × State Initial / Enabled / Hover - Country / Hover - Telephone / Focus - Country / Focus - Telephone / Error - Country / Error - Telephone / Disabled; Fixed has no Country states) and `Telephone Field` (internal) · frame *Input Telephone — How to use & Accessibility* (27/10)
**Code:** `src/components/InputTelephone.jsx` (atom, v2)
**Tokens:** `--ds-input-*`, `--ds-input-telephone-*`

A phone number with its country prefix: two boxes side by side, country (flag + prefix) and number.

## How to use

### Designers · Figma

**When to use**
- Any phone number, so the prefix is never typed by hand.
- The country can change → Variant Selectable (opens the Country Picker).
- Only one country is allowed → Variant Fixed.

**Properties**
- Variant → Selectable (flag + prefix + chevron, it is a button) · Fixed (flag + prefix, no chevron).
- State → Initial · Enabled · Hover / Focus / Error - Country · Hover / Focus / Error - Telephone · Disabled.
- Label · Helper Text · Validation (booleans) · on Telephone Field: Country (text), Flag (swap), Selectable.

**Behaviour**
- Each box has its own border: hover, focus and error mark only the part concerned, and the shared border takes its colour.
- Hover darkens the border; focus adds the white gap + blue ring outside the part.
- Error: red border on the wrong part + message below.
- Disabled: grey field, flag at 40 % opacity.

**Sizing**
- Field 56 high, padding 16, radius 8, border 1.5.
- Label, help (above the field) and error message (below) are Form Elements instances.
- 4 px focus area around the whole input (Input/InputCommon/root/focusArea/padding): the focus ring fits inside the component and the label stays aligned with the border.

### Developers · React

```jsx
import { InputTelephone } from './components/InputTelephone';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label |
| `value / defaultValue, onChange` |  | — | The number, without prefix |
| `placeholder` | `string` | `'600 000 000'` |  |
| `countryVariant` | `'selectable' \| 'fixed'` | `'selectable'` | Figma Variant |
| `countryCode` | `string` | `'+34'` | Shown next to the flag and read with the number |
| `flag` | `node` | — | <CountryFlag country="spain" />; replaces flagEmoji |
| `onCountryClick` | `func` | — | Open CountryPicker |
| `countryName / countryExpanded` | `string / bool` | — | Name read on the button; aria-expanded of the picker |
| `state` | `'default' \| 'error' \| 'disabled'` | `'default'` |  |
| `errorField` | `'telephone' \| 'country'` | `'telephone'` | Which part shows the error |
| `helperText / errorMessage` | `string` | — |  |
| `required, fullWidth, id, name, onFocus, onBlur` |  | — |  |

```jsx
<InputTelephone label="Mobile" flag={<CountryFlag country={c.slug} />} countryCode={c.dial} countryName={c.name} onCountryClick={() => setOpen(true)} countryExpanded={open} value={p} onChange={e => setP(e.target.value)} />
```

### AI agents · Claude Code

**Pick it when**
- Any phone number.

**Don't pick it when**
- Don't ask for the prefix in a separate Input Text.

**Composition rules**
- Selectable → pair it with CountryPicker; update flag, countryCode and countryName from the choice.
- errorField="country" only for errors about the country itself.

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the field; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box.
- Error is not colour only: icon + text under the field.
- Required = asterisk on the label in the brand colour (not red).
- Two tab stops when Selectable: the country button, then the number.

**Your job**
- Always show a label; the placeholder is an example, not the label.
- Write the error as what to do ("Enter a date after today"), not "Invalid".

### Developers · React

**Semantics**
- label → <label for>; helperText and errorMessage → aria-describedby.
- state="error" → aria-invalid; the message lives in a persistent live region, so it is announced when it appears.
- required → asterisk + native required.
- The country is a <button> with aria-haspopup="listbox" and aria-expanded; its name says the prefix and country.
- The prefix is read as the description of the number field ("600 000 000, +34").
- <input type="tel" autocomplete="tel-national">.

**Keyboard**
- Tab: country button (Selectable) → number; Enter / Space on the country opens the picker.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every input has label (or ariaLabel when there is truly no visible label).
- Errors use state="error" + errorMessage, never text placed by hand under the field.

**Don't**
- Don't use the placeholder as the only label.
- Don't add your own border or focus style around the field.

---

## InputAmount

**Group:** Forms
**Figma:** 🟢 Inputs page → `Input Amount` set (Variant Selectable / Fixed × State Initial / Enabled / Hover - Currency / Hover - Amount / Focus - Currency / Focus - Amount / Error - Currency / Error - Amount / Disabled; Fixed has no Currency states) and `Amount Field` (internal) · frame *Input Amount — How to use & Accessibility* (27/10)
**Code:** `src/components/InputAmount.jsx` (atom, v2)
**Tokens:** `--ds-input-*`

An amount of money with its currency: two boxes side by side, currency (ISO code) and amount.

## How to use

### Designers · Figma

**When to use**
- Any amount of money the user types.
- The currency can change → Variant Selectable (opens the Currency Picker).
- Only one currency → Variant Fixed.
- Showing an amount (not editing) → Amount View.

**Properties**
- Variant → Selectable (ISO code + chevron, it is a button) · Fixed (ISO code only).
- State → Initial · Enabled · Hover / Focus / Error - Currency · Hover / Focus / Error - Amount · Disabled.
- Label · Helper Text · Validation (booleans) · on Amount Field: ISO Currency, Amount (texts), Selectable.

**Behaviour**
- Each box has its own border: hover, focus and error mark only the part concerned, and the shared border takes its colour.
- Hover darkens the border; focus adds the white gap + blue ring outside the part.
- Error: red border on the wrong part + message below.
- Placeholder 0.00 in the user's number format.

**Sizing**
- Field 56 high, padding 16, radius 8, border 1.5.
- Label, help (above the field) and error message (below) are Form Elements instances.
- 4 px focus area around the whole input (Input/InputCommon/root/focusArea/padding): the focus ring fits inside the component and the label stays aligned with the border.

### Developers · React

```jsx
import { InputAmount } from './components/InputAmount';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label |
| `value / defaultValue, onChange` |  | — | Text as typed |
| `locale` | `string` | `'es-ES'` | Format of the placeholder |
| `currencyVariant` | `'selectable' \| 'fixed'` | `'selectable'` | Figma Variant |
| `currency` | `string` | `'EUR'` | ISO 4217 code; read with the amount |
| `onCurrencyClick` | `func` | — | Open CurrencyPicker |
| `currencyExpanded` | `bool` | — | aria-expanded of the picker |
| `state` | `'default' \| 'error' \| 'disabled'` | `'default'` |  |
| `errorField` | `'amount' \| 'currency'` | `'amount'` | Which part shows the error |
| `helperText / errorMessage` | `string` | — |  |
| `required, fullWidth, id, name, onFocus, onBlur` |  | — |  |

```jsx
<InputAmount label="Amount" currency={cur} onCurrencyClick={() => setOpen(true)} currencyExpanded={open} value={a} onChange={e => setA(e.target.value)} />
```

### AI agents · Claude Code

**Pick it when**
- The user enters money.

**Don't pick it when**
- Read-only amounts → AmountView.
- Quantities that are not money → InputText or InputStepper.

**Composition rules**
- Selectable → pair it with CurrencyPicker.
- State limits in helperText ("Up to 10,000 €").

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the field; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box.
- Error is not colour only: icon + text under the field.
- Required = asterisk on the label in the brand colour (not red).
- Two tab stops when Selectable: the currency button, then the amount.

**Your job**
- Always show a label; the placeholder is an example, not the label.
- Write the error as what to do ("Enter a date after today"), not "Invalid".

### Developers · React

**Semantics**
- label → <label for>; helperText and errorMessage → aria-describedby.
- state="error" → aria-invalid; the message lives in a persistent live region, so it is announced when it appears.
- required → asterisk + native required.
- The currency is a <button> with aria-haspopup="listbox" and aria-expanded.
- The ISO code is read as the description of the amount ("1,250.00, EUR").
- inputMode="decimal" for the numeric keyboard on mobile.

**Keyboard**
- Tab: currency button (Selectable) → amount; Enter / Space on the currency opens the picker.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every input has label (or ariaLabel when there is truly no visible label).
- Errors use state="error" + errorMessage, never text placed by hand under the field.

**Don't**
- Don't use the placeholder as the only label.
- Don't add your own border or focus style around the field.

---

## Selector · SelectorInvoker · SelectorListItem

**Group:** Forms
**Figma:** 🟢 Selector page → `Selector` set (State Initial / Hover / Focus / Pressed / Error / Read-only / Data Hidden / Disabled), `.SelectorInvoker` (the box: same states × Data Selection Single / Multiple / Empty), `Selector List Item` (State Selected / Unselected / Hover / Focus / Pressed / Error / Data Hidden / Disabled × Data Single / Multiple Selection), `Left Panel`, `Right Panel` · frame *Selector — How to use & Accessibility* (27/10)
**Code:** `src/components/Selector.jsx`, `SelectorInvoker.jsx`, `SelectorListItem.jsx` (atoms)
**Tokens:** `--ds-selector-*` (shared with Account in `--ds-selector-common-*`)

A field that shows the chosen item (header, description, detail) and opens a list to change it. SelectorListItem is the row of that list.

## How to use

### Designers · Figma

**When to use**
- Choosing an item that needs more than a word to recognise it (a document, a beneficiary, a contract): header + description + detail.
- Single (Radio in the list) or multiple selection (Checkbox, badge with the count on the invoker).
- A bank account with balance → Account Selector · a short list of plain options → Input Dropdown · searching by typing → Combobox.

**Properties**
- State → Initial · Hover · Focus · Pressed · Error · Read-only · Data Hidden · Disabled.
- Data Selection (invoker) → Single · Multiple (badge with the count) · Empty (only the header, as a prompt).
- Label · Helper · Validation (booleans) · Left Panel / Right Panel / Description / Detail (booleans) · Swap Description.
- List Item: State (Selected, Unselected…) × Data Single / Multiple Selection.

**Behaviour**
- The whole box is one button that opens the list (dialog, bottom sheet or picker) — the list itself is built by the consumer with List Items.
- Hover: blue fill (bg/hover-primary); Pressed lowers the opacity.
- Focus keeps the border and adds a white gap + blue ring outside it.
- Error: red border + message below · Read-only: grey box, normal text, does not open · Disabled: grey, nothing reacts.
- Data Hidden: description, amount and detail are masked (••••••••); the header stays.
- List Item Selected: 2 px teal border; Error: 1 px red; Focus: double ring inside the row.

**Sizing**
- Invoker: 12 left padding and 12 gap to the icon (selector/root/paddingHor, gapHor); 16 top, right and bottom (selector/content/padding) and 16 between the text and the right panel (selector/content/gap); border 1, radius 8.
- Icons 24; header Section Header.
- 4 px focus area around the whole selector (selector/root/focusArea/padding); label, help and error inside it.
- List items: same padding, no focus area — the focus ring is drawn inside the row because rows are stacked in lists and panels.

### Developers · React

```jsx
import { Selector } from './components/Selector';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label; read before the value |
| `headerText / descriptionText / detailText` | `string` | — | What is shown in the box |
| `dataSelection` | `'single' \| 'multiple' \| 'empty'` | `'single'` |  |
| `selectedCount` | `number` | — | Badge in multiple |
| `state` | `'default' \| 'error' \| 'readOnly' \| 'dataHidden' \| 'disabled'` | `'default'` |  |
| `helperText / errorMessage` | `string` | — |  |
| `onClick` | `func` | — | Open the list |
| `expanded / haspopup` | `bool / string` | `— / 'dialog'` | aria-expanded, aria-haspopup |
| `fullWidth` | `bool` | `false` | Minus the focus area |
| `id, name` |  | — |  |
| `SelectorListItem` |  | — | data 'single'\|'multiple', selected, onSelectedChange, state, disabled, icon (slot), showControl, headerText, descriptionText, detailText, name, …rest (role/aria from a listbox) |

```jsx
<Selector label="Document" headerText={doc.title} descriptionText={doc.type} detailText={doc.ref} onClick={openList} expanded={open} />
<SelectorListItem data="single" name="doc" headerText="Passport" selected={v==="pp"} onSelectedChange={() => setV("pp")} />
```

### AI agents · Claude Code

**Pick it when**
- The user chooses an item described by more than one line.
- SelectorListItem: the rows of the list the Selector opens (or of a Country / Currency picker).

**Don't pick it when**
- Accounts with balance → AccountSelector.
- Plain short list → InputDropdown · filter by typing → Combobox.

**Composition rules**
- Selector shows the value; the consumer opens a Dialog / Bottom Sheet / picker with SelectorListItems and updates the value.
- Multiple selection: list in a CheckboxGroup (spacing="none"); single: RadioGroup (spacing="none") or a listbox.

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the button; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box (inside the row for list items).
- Selected rows are marked by the border and by the Radio/Checkbox, never by colour alone.
- Error is not colour only: icon + text under the field.

**Your job**
- Always show a label ("Charge account"), and write the header as the chosen value.
- Say in the spec what opens (list, dialog, sheet) and whether it is single or multiple selection.

### Developers · React

**Semantics**
- The invoker is a <button> with aria-haspopup (dialog by default) and aria-expanded; its name is the label + the chosen value.
- helperText and errorMessage → aria-describedby; state="error" → aria-invalid; the message lives in a persistent live region.
- readOnly → aria-disabled + "read only"; dataHidden reads "hidden" instead of the dots.
- List item: inside a listbox it is role="option" and its Radio/Checkbox is inert; otherwise the Radio/Checkbox is the control and the ring is drawn on the row.

**Keyboard**
- Invoker: Tab to reach it, Enter / Space opens the list.
- List: Tab or arrows (listbox) between rows, Space selects.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every selector has label (or ariaLabel); every list item has a header that makes sense on its own.
- Pass expanded while the list is open.

**Don't**
- Don't build the box from a div with onClick.
- Don't put two interactive controls inside a list item's right panel.

---

## AccountSelector · AccountSelectorInvoker · AccountSelectorListItem

**Group:** Forms
**Figma:** 🟢 Selector page → `Account Selector` set (State Initial / Hover / Focus / Pressed / Error / Read-only / Data Hidden / Disabled), `.Invoker account` (same states × Data Single / Multiple / Empty), `Account Selector List Item` (State Selected / Unselected / Hover / Focus / Pressed / Error / Data Hidden / Disabled × Data Single / Multiple Selection) · frame *Account Selector — How to use & Accessibility* (27/10)
**Code:** `src/components/AccountSelector.jsx`, `AccountSelectorInvoker.jsx`, `AccountSelectorListItem.jsx` (atoms)
**Tokens:** `--ds-account-selector-*` (shared in `--ds-selector-common-*`)

A Selector for bank accounts: header (account name), balance (Amount View) and detail (account number).

## How to use

### Designers · Figma

**When to use**
- Choosing a source or destination account: the user recognises it by name, balance and number.
- Other items with a description → Selector.

**Properties**
- State → Initial · Hover · Focus · Pressed · Error · Read-only · Data Hidden · Disabled.
- Data (invoker) → Single · Multiple (badge) · Empty.
- Label · Helper · Validation (booleans) · Amount View inside (Highlight Emphasis by default, Disabled when off).
- List Item: State × Data Single / Multiple Selection.

**Behaviour**
- The whole box is one button that opens the list (dialog, bottom sheet or picker) — the list itself is built by the consumer with List Items.
- Hover: blue fill (bg/hover-primary); Pressed lowers the opacity.
- Focus keeps the border and adds a white gap + blue ring outside it.
- Error: red border + message below · Read-only: grey box, normal text, does not open · Disabled: grey, nothing reacts.
- Data Hidden: description, amount and detail are masked (••••••••); the header stays.
- List Item Selected: 2 px teal border; Error: 1 px red; Focus: double ring inside the row.
- Header 16 (Selector uses 19).

**Sizing**
- Invoker: 12 left padding and 12 gap to the icon (selector/root/paddingHor, gapHor); 16 top, right and bottom (selector/content/padding) and 16 between the text and the right panel (selector/content/gap); border 1, radius 8.
- Icons 24; header Section Header.
- 4 px focus area around the whole selector (selector/root/focusArea/padding); label, help and error inside it.
- List items: same padding, no focus area — the focus ring is drawn inside the row because rows are stacked in lists and panels.

### Developers · React

```jsx
import { AccountSelector } from './components/AccountSelector';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — |  |
| `ariaLabel` | `string` | — | Only without a visible label |
| `headerText / detailText` | `string` | — | Account name / number |
| `amount / currency` | `string` | — | Balance, already formatted |
| `amountType` | `'positive' \| 'negative'` | `'positive'` |  |
| `amountHighlight` | `AmountView highlight` | `'emphasis'` | 'disabled' is forced when the selector is disabled |
| `dataSelection` | `'single' \| 'multiple' \| 'empty'` | `'single'` |  |
| `selectedCount` | `number` | — |  |
| `state` | `'default' \| 'error' \| 'readOnly' \| 'dataHidden' \| 'disabled'` | `'default'` |  |
| `helperText / errorMessage, onClick, expanded, haspopup, fullWidth, id, name` |  | — | As in Selector |
| `AccountSelectorListItem` |  | — | data, selected, onSelectedChange, state, disabled, headerText, amount, currency, amountType, amountHighlight, detailText, name, …rest |

```jsx
<AccountSelector label="Charge account" headerText={acc.name} amount={acc.balance} currency="€" detailText={acc.iban} onClick={openList} expanded={open} />
```

### AI agents · Claude Code

**Pick it when**
- The user picks a bank account.

**Don't pick it when**
- Anything that is not an account → Selector.

**Composition rules**
- Pass the balance already formatted for the user's locale.
- Data Hidden when the balance and number must not be shown on screen.

## Accessibility

### Designers · Figma

**Built in**
- Visible label linked to the button; the help text and the error are read with it.
- Focus ring in the system focus colour, ≥ 3:1, inside the component's own box (inside the row for list items).
- Selected rows are marked by the border and by the Radio/Checkbox, never by colour alone.
- Error is not colour only: icon + text under the field.
- The balance sign is read ("negative") even without a minus symbol.

**Your job**
- Always show a label ("Charge account"), and write the header as the chosen value.
- Say in the spec what opens (list, dialog, sheet) and whether it is single or multiple selection.

### Developers · React

**Semantics**
- The invoker is a <button> with aria-haspopup (dialog by default) and aria-expanded; its name is the label + the chosen value.
- helperText and errorMessage → aria-describedby; state="error" → aria-invalid; the message lives in a persistent live region.
- readOnly → aria-disabled + "read only"; dataHidden reads "hidden" instead of the dots.
- List item as Selector List Item: option in a listbox, or Radio/Checkbox as the control with the ring on the row.

**Keyboard**
- Invoker: Tab, Enter / Space opens the list.
- List: Tab or arrows (listbox), Space selects.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every selector has label (or ariaLabel); every list item has a header that makes sense on its own.
- Pass expanded while the list is open.

**Don't**
- Don't build the box from a div with onClick.
- Don't put two interactive controls inside a list item's right panel.

---

## Link

**Group:** Navigation
**Figma:** 🟢 Links page → `Link` set (Variant Default / Accent × Type Low / Medium Emphasis × Size Extra-small / Small / Medium / Large × State Initial / Visited / Current / Hover / Focus / Pressed, 96 variants; aligned 26/10) · frame *Link — How to use & Accessibility*
**Code:** `src/components/Link.jsx` (atom, v4)
**Tokens:** `--ds-link-*`

A text link with an optional chevron. It takes the user to another page;
with no destination it behaves as a button that looks like a link.

## How to use

### Designers · Figma

**When to use**
- Going to another page or opening a document: "See details", "Terms".
- Inside a sentence, in lists of links, in tables and in navigation.
- An action on the same screen with button weight → Button. A highlighted call to action → CTA Link.

**Properties**
- `Variant` → Default (black) · Accent (teal).
- `Type` → Low Emphasis (regular) · Medium Emphasis (bold).
- `Size` → Extra-small · Small · Medium · Large (label xs–lg; icons 16 / 20 / 24 / 32).
- `State` → Initial · Visited · Current (the page you are on, SemiBold) · Hover · Focus · Pressed.
- `Left icon` / `Right icon` (chevron-right by default).

**Behaviour**
- Always underlined in teal (`borderColor/primary`): colour of the text is never the only clue that it is a link.
- Visited: lilac underline; Accent also lilac text and icon.
- Hover adds a soft background; Pressed lowers the opacity.

**Sizing**
- No focus area: the focus ring sits tight around the link (2 + 2 px). Leave at least 4 px of space around it in the layout.

### Developers · React

```jsx
import { Link } from './components/Link';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | string | — | With `href` → `<a>`; without → `<button type="button">` |
| `onClick` | func | — | |
| `variant` | `'default'` \| `'accent'` | `'default'` | |
| `emphasis` | `'low'` \| `'medium'` | `'low'` | Figma Type |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | `'sm'` | |
| `leftIcon` / `rightIcon` | bool \| icon name | `false` / `true` | `true` = chevron-right |
| `current` | bool | `false` | Current page: `aria-current="page"`, SemiBold |
| `external` | bool | `false` | `target="_blank"` + `rel` + hidden "(opens in new tab)" |
| `target`, `rel`, `ariaLabel` | | | |
| `...rest` | | | Forwarded to the `<a>` / `<button>` |

```jsx
<Link href="/clients/42">See details</Link>
<Link href="/clients" current>Clients</Link>
<Link onClick={startEditing} rightIcon={false}>Edit</Link>
```

### AI agents · Claude Code

**Pick it when**
- The user goes somewhere else (another page, a document, an external site).

**Don't pick it when**
- It runs the main action of the screen → Button.
- It is a highlighted invitation ("Start now") → CTALink.
- A list of navigation links → LinkList.

**Composition rules**
- Text says where it goes ("See invoice 42"), never "Click here".
- Use `current` on the link to the page being shown (menus, breadcrumbs, lists).

## Accessibility

### Designers · Figma

**Built in**
- Underline in every state, so colour is never the only signal.
- Focus ring in the system focus colour, ≥ 3:1 against the background.
- Current page shown by weight, not by colour alone.

**Your job**
- Leave 4 px of space around standalone links so the focus ring is not cut.
- Mark links that open a new tab or download a file in the spec.

### Developers · React

**Semantics**
- `<a href>` when it navigates; `<button>` when it only runs an action.
- `current` → `aria-current="page"`.
- `external` / `target="_blank"` adds "(opens in new tab)" for screen readers.

**Keyboard**
- Tab to focus, Enter to follow (Enter / Space when it renders as a button).

**Known gaps**
- None.

### AI agents · Claude Code

**Check before shipping**
- Every Link has a clear label, or `ariaLabel` if the text repeats ("Edit" in each row → "Edit Ana López").
- No `<a>` without `href`.

**Don't**
- Don't open new tabs without `external`.

---

## LinkList

**Group:** Navigation
**Figma:** 🟢 Links page → `Link list` set (Size Extra-small / Small / Medium / Large; `List Icon` + swappable `Left icon`) · frame *Link list — How to use & Accessibility*
**Code:** `src/components/LinkList.jsx` (atom)
**Tokens:** `--ds-link-list-*` (+ `--ds-link-*` of each Link)

A list of links, each with a list icon in front: quick links, related
pages, footers and secondary navigation.

## How to use

### Designers · Figma

**When to use**
- Several related destinations stacked: "Quick access", "Related documents".
- Main navigation of La Plataforma → Top Navigation or Sidebar Menu.

**Properties**
- `Size` → Extra-small · Small · Medium · Large (the list icon matches the link size).
- `List Icon` (on / off) · `Left icon` (swap; chevron-right by default).
- The nested Link keeps its own Variant / Type / State.

**Behaviour**
- The list icon is always black (`linkList/all/iconLeft/fg/generic`), also for Accent links.

**Sizing**
- 4 px between the list icon and the link. Space between rows is set by the list (small 4 · medium 8 · large 16).

### Developers · React

```jsx
import { LinkList } from './components/LinkList';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | array | `[]` | `{ label, href?, onClick?, icon?, variant?, size?, emphasis?, current?, external?, rightIcon?, ariaLabel? }` |
| `title` | string | — | Visible title; names the `<nav>` |
| `titleLevel` | 2–6 | `2` | Heading level of the title |
| `ariaLabel` | string | — | Required without `title` |
| `gap` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Space between rows |
| `fullWidth` | bool | `false` | |

```jsx
<LinkList title="Quick access" titleLevel={3} items={[
  { label: 'New operation', href: '/ops/new', variant: 'accent', emphasis: 'medium' },
  { label: 'History', href: '/ops/history', current: true },
]} />
```

### AI agents · Claude Code

**Pick it when**
- Three or more related links shown together.

**Don't pick it when**
- One link → Link. Main app navigation → TopNavigation / SidebarMenu.

**Composition rules**
- Give the list a `title` (or `ariaLabel`): it becomes the name of the navigation region.
- Mark the page being shown with `current`.

## Accessibility

### Designers · Figma

**Built in**
- Each row is a real Link (underline, focus ring, Current state).
- The list icon is decorative.

**Your job**
- Give every list a visible title, or note its name in the spec.

### Developers · React

**Semantics**
- `<nav>` named by the title (or `ariaLabel`) with `<ul role="list">` / `<li>`.
- `current` → `aria-current="page"` on that link.

**Keyboard**
- Tab moves from link to link.

**Known gaps**
- None.

### AI agents · Claude Code

**Check before shipping**
- The list has a name (`title` or `ariaLabel`).
- Two lists on the same page have different names.

**Don't**
- Don't use LinkList for actions on the screen; use Buttons.

---

## CTALink

**Group:** Navigation
**Figma:** 🟢 Links page → `CTA link` set (Variant Default / Accent × Type Low / Medium / High emphasis × State Initial / Hover / Focus / Pressed / Disabled, 30 variants; rebuilt 26/10 with the 4 px focus area) · frame *CTA link — How to use & Accessibility*
**Code:** `src/components/CTALink.jsx` (atom, v4)
**Tokens:** `--ds-cta-link-*`

A call to action that takes the user somewhere: "Start now",
"Discover the new plan". Looks like a pill button but it is a link.

## How to use

### Designers · Figma

**When to use**
- Invite the user to a new page or flow, usually one per area.
- An action that saves or sends something on this screen → Button.

**Properties**
- `Type` → Low emphasis (underlined text) · Medium emphasis (outline) · High emphasis (filled).
- `Variant` → Default (black) · Accent (teal).
- `State` → Initial · Hover · Focus · Pressed · Disabled.

**Behaviour**
- Hover: `bgMix` over the background; Low also thickens the underline (1.5).
- Pressed: 80 % opacity. Disabled: its own tokens, never opacity.

**Sizing**
- Same size in the three types: label lg bold, padding 6 / 12, radius 16 / 24 / pill.
- 4 px focus area around it (`ctaLink/all/root/focusArea/padding`): the box is 48 high.

### Developers · React

```jsx
import { CTALink } from './components/CTALink';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | string | — | With `href` → `<a>`; without → `<button>` |
| `onClick` | func | — | |
| `emphasis` | `'low'` \| `'medium'` \| `'high'` | `'medium'` | Figma Type |
| `variant` | `'default'` \| `'accent'` | `'default'` | |
| `disabled` | bool | `false` | Renders `<button disabled>` |
| `external` | bool | `false` | New tab + hidden "(opens in new tab)" |
| `ariaLabel` | string | — | |
| `...rest` | | | Forwarded to the element |

```jsx
<CTALink href="/plans" emphasis="high" variant="accent">Discover the new plan</CTALink>
<CTALink href="/help" emphasis="low">Read the guide</CTALink>
```

### AI agents · Claude Code

**Pick it when**
- A highlighted invitation that navigates.

**Don't pick it when**
- It saves, sends or deletes → Button. A plain text link → Link.

**Composition rules**
- One High emphasis CTA per area at most.
- The text says where it leads, as a verb ("Discover…", "Start…").

## Accessibility

### Designers · Figma

**Built in**
- Focus ring inside the component's own box (never clipped).
- Low emphasis keeps its underline; Disabled uses disabled colours, not opacity.

**Your job**
- Prefer hiding a CTA that is not available over showing it disabled.
- Keep the label short and specific.

### Developers · React

**Semantics**
- `<a href>` when it navigates; `<button>` without `href`.
- `disabled` → `<button disabled>` (a link cannot be disabled), read as unavailable.

**Keyboard**
- Tab to focus, Enter to follow.

**Known gaps**
- None.

### AI agents · Claude Code

**Check before shipping**
- Every CTA has `href` unless it is a real action.
- Not more than one High emphasis CTA in the same area.

**Don't**
- Don't use CTALink to submit forms.

---

## Snackbar

**Group:** Feedback
**Figma:** 🟢 Snackbar page → `Snackbar` set (Length Single Line / Multi-Line; Message, Show Action; nested Button exposed and locked — its Label is the action) · frame *Snackbar — How to use & Accessibility* (27/10)
**Code:** `src/components/Snackbar.jsx` (atom)
**Tokens:** `--ds-snackbar-*`

Short feedback about an action that has just happened, with an optional action (Undo, Retry). The atom only draws the content: timer and position on screen belong to the consumer.

## How to use

### Designers · Figma

**When to use**
- Confirming an action that already happened ("Changes saved", "Item deleted"), optionally with a quick way back.
- Something that needs the user's attention or a decision → Inline Notification or Dialog.
- An error in a form field → Validation Message.

**Properties**
- Length → Single Line (message and action in one row) · Multi-Line (message on its own line, action below on the right).
- Message (text) · Show Action (boolean).
- Button (nested, exposed): edit only its Label; Type / Variant / Size / State stay as they are.

**Behaviour**
- Background and text invert with the mode: black with white text in light, white with black text in dark.
- Action: Button Default Primary — hover lightens / darkens with the inverse veil, pressed lowers the opacity.
- Action focus ring: snackbar/all/action/borderColor/focus-inner | focus-outer (the inverse focus colours), because the system blue does not show on the inverted background.
- Appears at the bottom of the screen (mobile) or a corner (web) and goes away by itself if it has no action; position and timing are not part of the component.

**Sizing**
- Padding 12 left and right (snackbar/all/root/paddingHor); 6 top and bottom in Single Line, 12 in Multi-Line (paddingVer); gap 6 message → action (Single Line); radius 8.
- Message Body sm 16/24 regular; action Button Small (32 + 4 px focus area on each side).
- Width: the consumer decides (343 in the Figma examples = a mobile screen); the height hugs the message.

### Developers · React

```jsx
import { Snackbar } from './components/Snackbar';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `message` | `string` | `'Snackbar message'` | What happened |
| `length` | `'single' \| 'multi'` | `'single'` | Multi when the message needs more than one line |
| `showAction` | `bool` | `true` |  |
| `actionLabel` | `string` | `'Undo'` | Verb |
| `onAction` | `func` | — |  |
| `id, className` |  | — |  |

```jsx
<Snackbar message="Item deleted" actionLabel="Undo" onAction={undo} />
<Snackbar message="Changes saved" showAction={false} />
```

### AI agents · Claude Code

**Pick it when**
- Confirmation of an action that already happened, maybe with Undo / Retry.

**Don't pick it when**
- Errors that block the task or need a decision → InlineNotification / Dialog.
- Field errors → ValidationMessage (inside the input).

**Composition rules**
- Mount it in a fixed container of the page (bottom, above the content); one snackbar at a time.
- The consumer owns the timer: none if there is an action, or pause it on hover / focus.
- Do not move the focus to the snackbar.

## Accessibility

### Designers · Figma

**Built in**
- The message is announced by the screen reader when it appears (polite, through the global live region), without moving the focus.
- Message and action contrast with the inverted background in both modes (white on black / black on white).
- The action's focus ring uses the inverse focus colour (light blue on black, dark blue on white), ≥ 10:1.

**Your job**
- Keep the message short and say what happened ("Item deleted"), not just "Done".
- If there is an action, specify that the snackbar does not close on its own before it can be reached (or that it stays until dismissed).
- Never put the only path to something important in a snackbar: it disappears.

### Developers · React

**Semantics**
- The container is not a live region: message is announced with announce() (polite) when it mounts or changes.
- The action is a real Button (Default · Primary · Small); its focus ring is re-themed with --ds-snackbar-action-focus-*.

**Keyboard**
- Tab reaches the action like any other button, Enter / Space runs it.
- No shortcut to dismiss: the consumer closes it after the action or its timer.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- message says what happened; actionLabel is a verb ("Undo", "Retry").
- With an action: no auto-dismiss timer shorter than the user needs (WCAG 2.2.1) — pause it on hover and on focus.

**Don't**
- Don't use it for errors that need a decision.
- Don't change the nested Button's variant.

---

---

## DescriptionList · DescriptionListItem · DescriptionListAccount

**Group:** Data
**Figma:** 🟢 Description List page → `Description List` set (Variants Text / Not Filled / Link + Icon / Badge / Unordered List / Ordered List / Checkmark List / Account × Orientation Landscape / Portrait; Show Edit, Show icon, Icon, 2nd value/helper txt), `Description List section` (Section Header + pairs + Edit), `.Label` (Weight Regular / Bold) · frame *Description List — How to use & Accessibility* (27/10)
**Code:** `src/organisms/DescriptionList.jsx` (organism; exports DescriptionList, DescriptionListItem, DescriptionListAccount)
**Tokens:** `--ds-descriptionlist-*`

Read-only pairs of label and value (customer data, a summary before confirming). The value is a slot for text or other components; Account has its own layout.

## How to use

### Designers · Figma

**When to use**
- Showing data the user reads, not edits in place: a record, a summary step, a details panel.
- Each value can be text, a Link, a Badge, a List or an Account (name + amount + number).
- Data to compare across rows → Table · fields to fill in → Inputs.

**Properties**
- Variants → Text · Not Filled · Link + Icon · Badge · Unordered List · Ordered List · Checkmark List · Account.
- Orientation → Landscape (label | value) · Portrait (value under the label).
- Show Edit (Link under the value) · Account: Show icon + Icon, 2nd value/helper txt.
- .Label Weight → Regular · Bold.
- Description List section → Section Header + pairs + one Edit for the whole section.

**Behaviour**
- Static content: the only interactive parts are the Edit links and any Link in a value.
- Not Filled: the value shows a placeholder text in the subtle colour.
- Long values wrap; the label column keeps its half.

**Sizing**
- Each pair: content + 8 + divider line (also under the last one), 8 between pairs — descriptionList/all/gap/generic.
- Landscape: label and value share the width 50 / 50, aligned on the text baseline · Portrait: value 8 under the label.
- Edit link 8 under the value · Account values 4 apart (descriptionList/all/account/gap/generic), icon 24.
- Section: Section Header 19 bold primary + 8 + list + 8 + section Edit.

### Developers · React

```jsx
import { DescriptionList, DescriptionListItem, DescriptionListAccount } from './organisms/DescriptionList';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `'landscape' \| 'portrait'` | `'landscape'` |  |
| `title` | `string` | — | Section Header; with it the list is wrapped in <section> |
| `titleLevel` | `2–6` | `2` | Heading level of the title |
| `showEdit / onEdit / editLabel` | `bool / func / string` | `false / — / 'Edit'` | Edit for the whole section |
| `DescriptionListItem` |  | — | label, labelWeight 'regular'\|'bold', emptyText, showEdit, onEdit, editLabel, children (the value) |
| `DescriptionListAccount` |  | — | name, amount, currency, amountType, amountHighlight ('neutral'), number, helperText, icon (icon name) |

```jsx
<DescriptionList title="Customer" showEdit onEdit={edit}>
  <DescriptionListItem label="Name">Jane Doe</DescriptionListItem>
  <DescriptionListItem label="Phone" emptyText="Not filled" />
  <DescriptionListItem label="Account"><DescriptionListAccount name="Main account" amount="1,289.00" currency="EUR" number="XX71 0961 2345 6769" /></DescriptionListItem>
</DescriptionList>
```

### AI agents · Claude Code

**Pick it when**
- Read-only record details or a summary before confirming.

**Don't pick it when**
- Tabular data with several records → Table.
- Editable form → Inputs / Selectors.

**Composition rules**
- Values: instantiate Link, BadgeHighlight, List, AmountView — never copy their styles.
- Account pair → DescriptionListAccount.
- A titled block → title (+ showEdit for one Edit for the section); several sections stack with the page's spacing.

## Accessibility

### Designers · Figma

**Built in**
- Real description list: each label is announced together with its value.
- Each Edit link says what it edits ("Edit Status", hidden text).
- Empty values show text ("Not filled"), not a blank.
- The section title is a real heading.

**Your job**
- Write labels that make sense alone ("Account holder", not "Name 2").
- Say which heading level the section title takes on each page.

### Developers · React

**Semantics**
- <dl> with one <div> per pair holding <dt> + <dd>; the divider is the pair's bottom border, not an <hr> (invalid inside <dl>).
- Section: <section> with SectionHeader (h2 by default, titleLevel) and the list.
- Edit = Link without href → <button>, name "Edit <label>".

**Keyboard**
- Only the Edit links and Links inside values are focusable, in reading order.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Set titleLevel to fit the page outline.
- Pass emptyText instead of leaving a value blank.

**Don't**
- Don't put form fields inside the values.
- Don't add an <hr> or Divider between the pairs: the line is built in.

---

---

## Table · TableRow · CellHeader · CellData · CellMore · CellActions

**Group:** Data
**Figma:** 🟢 Table page → `Column Header` (Type Compact / Basic × Surface Neutral / onSurface / Zebra × Border Subtle / Primary × Alignment × Sort Off / None / Ascending / Descending × State Initial / Hover / Pressed / Focus; Header text), `Column Cell` (Type × Surface × Border Subtle / Last row × Alignment; Cell Data text), `Column More` (Type × Surface × Border × State; Show label, Text) · frame *Table — How to use & Accessibility* (27/10)
**Code:** `src/organisms/Table.jsx` (Table, TableRow), `src/components/CellHeader.jsx`, `CellData.jsx`, `CellMore.jsx` (atoms), `src/organisms/CellActions.jsx`
**Tokens:** `--ds-cell-common-*`, `--ds-cell-data-*`, `--ds-cell-header-*`

Tabular data built from cells: column headers (optionally sortable), data cells, a More cell that opens the row's details, and an actions cell. Table and TableRow only lay out and name the grid; the cells carry the look.

## How to use

### Designers · Figma

**When to use**
- Several records compared across the same columns (accounts, movements, customers).
- One record's details → Description List · a list of selectable rows → List View.

**Properties**
- Type → Compact (32, inside panels) · Basic (36) — the same in every cell of a row.
- Surface → Neutral (on the page) · onSurface (on a panel) · Zebra (alternate rows).
- Border → Subtle · Primary (header of the sorted column) / Last row (closes the table).
- Alignment → Left · Right (numbers and amounts).
- Column Header Sort → Off (not sortable) · None (sortable, unsorted) · Ascending · Descending.
- Column Header / More State → Initial · Hover · Pressed · Focus · Column More: Show label (icon only when off).

**Behaviour**
- Sortable header: the whole cell is the button; clicking cycles the sort the product defines.
- Hover: veil over the cell (opacity/hover); Pressed: opacity 0.8; Focus: double ring inside the cell.
- More: opens the row's details (page, panel or menu); always at the end of the row, right aligned.
- Actions cell: up to 2 actions (Button / Link / CTA Link).

**Sizing**
- Compact 32 high (4 + 24 + 4), Basic 36 (Cell 6 + 24 + 6; Header 8 + 24 + 4, text at the bottom) — the bottom line is drawn inside.
- Padding 6 left and right (table/all/cellCommon/padding/hor), 4 between text and icon; sort and More icons 16.
- Focus ring 2 + 2 inside the cell (cells sit edge to edge, there is no room outside).

### Developers · React

```jsx
import { Table, TableRow } from './organisms/Table';
import { CellHeader } from './components/CellHeader';
import { CellData } from './components/CellData';
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `Table` |  | — | ariaLabel / ariaLabelledBy, children (TableRow) |
| `CellHeader` |  | — | align, density 'compact'\|'basic', surface, border 'subtle'\|'primary', onSort (sortable), sortDirection 'none'\|'ascending'\|'descending', children |
| `CellData` |  | — | align, density, surface, lastRow, children |
| `CellMore` |  | — | label ('More'; '' = icon only), ariaLabel, haspopup, density, surface, lastRow, onClick, disabled |
| `CellActions` |  | — | align ('right'), surface, lastRow, children (≤ 2 actions) |

```jsx
<Table ariaLabelledBy="customers-title">
  <TableRow><CellHeader border="primary" sortDirection="ascending" onSort={sort}>Customer</CellHeader><CellHeader align="right">Amount</CellHeader></TableRow>
  <TableRow><CellData>Jane Doe</CellData><CellData align="right">1,250.00 €</CellData></TableRow>
  <TableRow><CellData lastRow>Total</CellData><CellData lastRow align="right">1,250.00 €</CellData></TableRow>
</Table>
```

### AI agents · Claude Code

**Pick it when**
- Records compared across columns.

**Don't pick it when**
- Single record → DescriptionList.
- Selectable list → ListView / SelectorListItem.

**Composition rules**
- Compose Table > TableRow > cells; Table never clones or injects props — set surface, density and lastRow on each cell.
- Sorting: one header with border="primary" and sortDirection; the consumer reorders the rows in onSort.
- Values in cells: instantiate BadgeHighlight, AmountView, Link… — never copy their styles.

## Accessibility

### Designers · Figma

**Built in**
- Real table semantics: every cell is announced with its column header.
- Sort state is read ("sorted ascending") and shown by icon + Primary line, not by colour only.
- Sortable headers and More are real buttons with a visible focus ring.
- Text and lines contrast on all three surfaces, light and dark.

**Your job**
- Give every table a visible title; developers link the table to it.
- More: say what it opens and give each row's More a specific name ("More about García").

### Developers · React

**Semantics**
- Table = role table + rows; CellHeader = columnheader, CellData / CellActions / CellMore = cell.
- Sortable header: <button> inside the columnheader, aria-sort on the columnheader (ascending / descending).
- Name the table: ariaLabelledBy (id of the visible title) or ariaLabel — dev warning without it.

**Keyboard**
- Tab moves through sortable headers, More buttons and actions in reading order; Enter / Space activates.

Known gaps: none.

### AI agents · Claude Code

**Check before shipping**
- Every Table has ariaLabelledBy or ariaLabel.
- Same density in every cell of a row; lastRow on every cell of the last row.
- CellMore: ariaLabel with the row's context; haspopup when it opens a menu or dialog.

**Don't**
- Don't use a table for layout.
- Don't put more than 2 actions in a cell.

---

## Dialog · DialogSimple · ErrorAndEmptyState · Scrim

**Group:** Overlays
**Figma:** 🟢 Dialog page → `Dialog` (Width PopUp / Full Screen × Size Standard / Small × Header Default / Primary / onPrimary / Secondary / Tertiary; Show Buttons, Main Button, Secondary Button), `Dialog Simple` (Default / Expanded), `.Header` (Color × Size; Title, Back button, Close button — Icon Button instances), `Error and Empty State` (Full Screen / Pop up), `Scrim`, `Dialog with Scrim` · frame *Dialog — How to use & Accessibility* (27/10)
**Code:** `src/components/Dialog.jsx`, `DialogSimple.jsx`, `ErrorAndEmptyState.jsx`, `Scrim.jsx`, shared header `_dialogBase.jsx` (internal)
**Tokens:** `--ds-dialog-*` (header colours, focus per header, root, control area, simple, empty state), `--ds-borderColor-focus-*-onColor|onLight`

Modal surfaces: Dialog for a task or decision, Dialog Simple for a short question, Error and Empty State for an empty or failed view, Scrim behind them. They share one header (title + Back and Close as Icon Buttons).

## How to use

### Designers · Figma

**When to use**
- A task or decision that needs the user's full attention before going back to the page (Dialog)
- A short question or confirmation with one or two answers (Dialog Simple)
- Nothing to show or an error loading a view (Error and Empty State)
- Short, non-blocking feedback → Snackbar or Inline Notification.

**Properties**
- Dialog · Header → Default · Primary · onPrimary · Secondary · Tertiary (colour of the header bar)
- Dialog · Size → Standard (header 60) · Small (header 44)
- Dialog · Width → PopUp (480, height by content, up to the screen) · Full Screen (fills the screen; sample 375 × 667)
- Dialog · Show Buttons / Main Button / Secondary Button.
- Dialog Simple · Default (280, Small buttons) · Expanded (480 × 680, Large buttons)
- Error and Empty State · Full Screen · Pop up (359) — Image 1:1 (120) + title + paragraph.
- Header · Back button / Close button (Icon Button Default Tertiary, locked).

**Full Screen or Pop up**
- Dialog Pop up → tablet and desktop (≥ 768): a short task that keeps the page visible behind.
- Dialog Full Screen → mobile (< 768), and on any device for long or multi-step tasks (forms, lists to pick from).
- Same task on every device: Full Screen on mobile, Pop up from tablet up — never a 480 Pop up on a 375 screen.
- Dialog Simple → any device: it is 280 wide and only asks one question.
- Error and Empty State Full Screen → the whole view is empty or failed (it replaces the page content, not a modal).
- Error and Empty State Pop up → an action inside the page returned nothing or failed and the page stays behind; on mobile use Full Screen.

**Behaviour**
- Opens over a Scrim; the rest of the page can't be used until it closes.
- Close (X), Escape or an answer closes it; focus goes back to what opened it.
- Content scrolls inside; header and buttons stay in place.

**Sizing**
- Header Standard 4 + Icon Button Medium 52 + 4 = 60 · Small 2 + 40 + 2 = 44 (focus area included)
- Header gap 12 · Control area padding 16, gap 12 · Dialog Simple padding 12, buttons gap 8.
- Error and Empty State padding 16 · image → text 16 · title → paragraph 8 · Full Screen: content centred in the free space, buttons at the bottom.

### Developers · React

**Import**
- `import { Dialog } from './components/Dialog'; DialogSimple, ErrorAndEmptyState, Scrim from './components/*'`

**Props**
- Dialog · header, size 'standard'|'small', width 'popUp'|'fullScreen', title, showArrow + onBack, crossButton + onClose, showButtons, mainButton(+Label, onMainButton), secondaryButton(+Label, onSecondaryButton), children, modal, backLabel, closeLabel.
- DialogSimple · variant 'default'|'expanded', title, message, onClose, showButtonBar, primaryButton / secondaryButton (+Label, on…), modal, closeLabel.
- ErrorAndEmptyState · variant 'fullScreen'|'popUp', imageSrc, imageAlt, title, description, onClose, showButtons, primary/secondary button props, headingLevel, announceOnMount.
- Scrim · onClick (optional mouse close)

**Example**
- `{open && (<div className="overlay"><Scrim onClick={close} />`
- `<Dialog header="primary" title="Edit address" onClose={close} mainButtonLabel="Save" onMainButton={save} secondaryButtonLabel="Cancel" onSecondaryButton={close}>…</Dialog></div>)}`
- The consumer owns the portal, the fixed position and the open state: mounted = open.

### AI agents · Claude Code

**Pick it when**
- A blocking task or decision → Dialog; a yes/no question → DialogSimple; empty or failed view → ErrorAndEmptyState.

**Don't pick it when**
- Feedback that doesn't need an answer → Snackbar / InlineNotification.
- Extra content next to a control → PopoverSheet.

**Full Screen or Pop up**
- Mobile (< 768) → `width="fullScreen"`; tablet / desktop → `popUp`, unless the task is long.
- ErrorAndEmptyState: `fullScreen` when it replaces a whole view, `popUp` only over a page that stays.

**Composition rules**
- Mount it only while open; render Scrim behind it.
- Never rebuild the header buttons: Back/Close are IconButton inside DialogHeader.
- Main action = Primary button, the other = Secondary; header colour decides Default or Accent buttons.
- Use `modal={false}` only for static documentation.

## Accessibility

### Designers · Figma

**Built in**
- Focus moves into the dialog, stays inside while it is open and returns to the trigger on close.
- Escape closes; the page behind can't be reached.
- The title names the dialog; Dialog Simple also reads its question.
- Back and Close have a visible focus ring that contrasts with every header colour.
- Text and icons contrast on all header colours, light and dark.

**Your job**
- Write a title that says what the dialog is for.
- Label buttons with the action ("Delete", "Save"), not "OK".
- Error and Empty State image: decorative unless it adds information.

### Developers · React

**Semantics**
- Dialog / Error and Empty State Pop up = role dialog + aria-modal, named by the h2 title.
- Dialog Simple = role alertdialog, aria-describedby = the message.
- Error and Empty State Full Screen = page content: heading (headingLevel), title + text announced on mount.
- Back / Close = IconButton with backLabel / closeLabel ('Back' / 'Close').

**Keyboard**
- Tab / Shift+Tab cycle inside; Escape → onClose; Enter / Space activate buttons.

**Known gaps**
- None.

### AI agents · Claude Code

**Check before shipping**
- Every Dialog has a title (or an explicit aria-label)
- onClose is wired: Escape and X must close it.
- imageAlt set when the image carries meaning.

**Don't**
- Don't open a dialog from another dialog.
- Don't put the only way to close it in the content.
- Don't change the variant properties of the header's Icon Buttons.

---

## Switch

**Group:** Forms
**Figma:** 🟢 Switch page → `Switch` (State Initial / Hover / Pressed / Focus / Read-only / Disabled × Behavior Selected / Unselected; Show Label, Label), `.Switch` (track + thumb, State Initial / Read-only / Disabled × Behavior On / Off) · frame *Switch — How to use & Accessibility* (28/10)
**Code:** `src/components/Switch.jsx`
**Tokens:** `--ds-switch-*`

An on/off control that applies a setting immediately. Same structure as Checkbox: the whole row (label + switch) is the control, with a 4 px focus area.

## How to use

### Designers · Figma

**When to use**
- A setting that takes effect at once, without Save (notifications on, auto-renew)
- A choice inside a form that is saved with the form → Checkbox.
- One of several options → Radio Group or Segmented Control.

**Properties**
- State → Initial · Hover · Pressed · Focus · Read-only · Disabled.
- Behavior → Selected (on) · Unselected (off)
- Show Label / Label — the label sits on the left.

**Behaviour**
- The whole row (label + switch) is the control: hover fills the row, pressed lowers its opacity.
- Read-only: shows the value but can't be changed — disabled background, thumb in the normal colour.
- On = green track, thumb right · Off = dark track, thumb left (position also tells the state)

**Sizing**
- Track 44 × 24 (2 + thumb 20 + 2) · row padding 2, label → switch 6, radius 8.
- Focus area 4 around the row: double ring inside the component, its size never changes.

### Developers · React

**Import**
- `import { Switch } from './components/Switch'`

**Props**
- checked / defaultChecked, onChange, label, showLabel, ariaLabel (when there's no visible label), state 'default'|'readOnly'|'disabled', readOnlyLabel ('read only'), name, value, id, fullWidth.

**Example**
- `<Switch label="Notifications" checked={on} onChange={(e) => setOn(e.target.checked)} />`
- `<Switch label="Auto-renew" checked state="readOnly" />`

### AI agents · Claude Code

**Pick it when**
- An on/off setting applied immediately.

**Don't pick it when**
- The value is submitted with a form → Checkbox.
- More than two options → RadioGroup / SegmentedControl.

**Composition rules**
- Label says what is switched on, not the action ("Notifications", not "Turn on notifications")
- Inside a List View row use ListView control="switch", never a Switch inside the row.

## Accessibility

### Designers · Figma

**Built in**
- Read as "switch, on / off"; Space toggles it.
- State shown by colour and thumb position, never colour alone.
- Visible double focus ring around the row.
- Read-only stays reachable with the keyboard and says "read only".

**Your job**
- Every switch has a visible label (or a name for screen readers)
- Show the result of the change somewhere if it isn't obvious.

### Developers · React

**Semantics**
- `<input type="checkbox" role="switch"> inside a <label>; aria-checked comes from the native checked state`
- Read-only: aria-readonly, the change is blocked; a hidden ", read only" is added to the name.
- Disabled: native disabled, out of the Tab order.
- Without label: ariaLabel (dev warning if missing)

**Keyboard**
- Tab focuses it, Space toggles it.

**Known gaps**
- None.

### AI agents · Claude Code

**Check before shipping**
- Every Switch has label or ariaLabel.
- onChange applies the setting immediately (no Save button for it)

**Don't**
- Don't use a Switch for a form field that is submitted later.
- Don't put a Switch inside a clickable row.

---

## ListView

**Group:** Data
**Figma:** 🟢 List View page → `List View` (State × Divider; Selected, Description, Detail, Left Panel, Right Panel, Swap Description), `.Left Panel`, `.Right Panel` · frame *List View — How to use & Accessibility* (28/10)
**Code:** `src/components/ListView.jsx`
**Tokens:** `--ds-list-view-*`

A clickable row in a list: header, description and detail, with an optional left panel (icon or selection control) and right panel (amount, badge, icon…).

## How to use

### Designers · Figma

**When to use**
- A list of records the user opens or selects (search results, accounts, menu items)
- Data compared across columns → Table · one record's details → Description List.

**Properties**
- State → Initial · Hover · Pressed · Focus · Disabled.
- Divider → None · Partial Bottom (leaves the left panel free) · Full Bottom · All Sides — 1 px.
- Selected → 4 px ribbon on the left · Description / Detail on or off · Swap Description (Text)
- Left Panel → Icon · Checkbox · Radio Button · Switch · Loading Indicator.
- Right Panel → Amount View · Amount Two · Highlight Badge · Badge with Icon · Icon · Loading Indicator · Checkbox · Radio Button · Switch.

**Behaviour**
- The whole row is one control: it opens the item, or with Checkbox / Radio / Switch the row is that control.
- The control in a panel is only the indicator: it is not focusable on its own.
- Hover blue, pressed opacity 0.8, focus double ring inside the row (rows are stacked)

**Sizing**
- Row padding-left 16, gap 16 · content padding 16 top/right/bottom · header → description → detail 4.
- Dividers and focus are drawn inside: the row height never changes.

### Developers · React

**Import**
- `import { ListView } from './components/ListView'`

**Props**
- header, description + descriptionText, swapDescription, detail + detailText + detailColor, leftPanel + leftIcon, rightPanel + rightPanelContent, control 'checkbox'|'radio'|'switch', controlPlacement 'left'|'right', checked, selected + current, divider 'none'|'partialBottom'|'fullBottom'|'allSides', disabled, onClick.

**Example**
- `<ListView header="Current account" descriptionText="ES00 0000 …" rightPanelContent={<AmountView amount="1,250.00" currency="EUR" />} divider="fullBottom" onClick={open} />`
- `<ListView header="Email alerts" control="switch" controlPlacement="right" checked={on} onClick={() => setOn(!on)} />`

### AI agents · Claude Code

**Pick it when**
- Rows that open something or are selected one by one.

**Don't pick it when**
- A dropdown or picker list → SelectorListItem.
- Columns of data → Table.

**Composition rules**
- rightPanelContent: static content only (AmountView, BadgeHighlight, Icon, LoadingSpinner) — no buttons or links.
- Selection: use control, never a Checkbox / Radio / Switch inside rightPanelContent.
- Radio rows: wrap them in an element with role="radiogroup" and a name.

## Accessibility

### Designers · Figma

**Built in**
- Each row is one stop in the Tab order and reads its header, description and detail.
- Selected row is announced as current; selection rows announce checked / not checked.
- Focus ring visible on every background, inside the row.
- Text, icons and dividers contrast in light and dark.

**Your job**
- Keep the header short and unique in the list.
- Don't design a second action inside the row: put it outside the list.

### Developers · React

**Semantics**
- Root = <button>; with control → role checkbox / radio / switch + aria-checked.
- selected → aria-current (current, 'page' in navigation)
- The control indicator is inert and aria-hidden; the row carries the name.
- Dev warning when rightPanelContent / swapDescription contain an interactive element.

**Keyboard**
- Tab between rows; Enter / Space activate (or toggle with control)

**Known gaps**
- None.

### AI agents · Claude Code

**Check before shipping**
- onClick on every row (or control + checked + onClick)
- Radio rows inside role="radiogroup" with aria-label.

**Don't**
- Don't nest buttons or links in the row.
- Don't use selected for checked state: selected = current item, checked = control.

---

## FileUpload · FileSelector · DropZone · DocumentItem · LabelDescription

**Group:** Forms
**Figma:** 🟢 File Upload page → `File Upload` (Layout Wide / Compact / Stacked × State Initial / Active; Show Label + Desc), `File Selector`, `Drop Zone` (State Initial / Hover / Disabled; Instruction, Hover Instruction), `Document Item` (Status Uploading / Uploaded / Error × State Initial / Hover / Focus — renamed from "List Item" on 28/10 so it isn't confused with List View), `Label + Description` · frame *File Upload — How to use & Accessibility* (28/10)
**Code:** `src/organisms/FileUpload.jsx`, `FileSelector.jsx` · `src/components/DropZone.jsx`, `DocumentItem.jsx` (was `ListItem.jsx`), `LabelDescription.jsx`
**Tokens:** `--ds-file-upload-*` (`fileUpload/common|documentItem|dropZone|root/*`)

Lets the user attach documents to a form: a drop area with a button, and one row per file with its status.

## How to use

### Designers · Figma

**When to use**
- The user attaches one or more documents to a form (invoices, ID, contracts)
- Wide → forms with labels on the left (desktop) · Stacked → one column (mobile, narrow panels) · Compact → exactly one file, no drop area

**Pieces**
- Label + Description → the question and its rules (format, size)
- Drop Zone → dashed area + Button Default Secondary Small; Instruction / Hover Instruction texts
- Document Item → one uploaded file: icon (spinner while uploading), editable name, remove X
- File Selector → Drop Zone + the Document Items below (8 between them)

**Properties**
- File Upload · Layout → Wide · Compact · Stacked · State → Initial · Active (with files) · Show Label + Desc
- Drop Zone · State → Initial · Hover (a file is dragged over it) · Disabled
- Document Item · Status → Uploading · Uploaded · Error · State → Initial · Hover · Focus

**Behaviour**
- Hover on the Drop Zone = a file is being dragged over it: blue background, bold "Drop your files here", button disabled
- Uploading: spinner and grey name, which can't be edited yet
- Error: red 1 px border around the document and the message below — never colour alone

**Sizing**
- Document Item 36 high (padding 4 + icon 24; name and X padding 2 for the focus ring) · icon → name → X gap 12
- Drop Zone padding 16/12, text → button 8, border 1.5 dashed · blocks 24 apart · Wide label 235

### Developers · React

**Import**
- `import { FileUpload } from './organisms/FileUpload'; FileSelector from './organisms/FileSelector'; DropZone, DocumentItem, LabelDescription from './components/*'`

**Props**
- FileUpload · layout 'wide'|'stacked'|'compact', label, description, showLabel, files [{ id, name, status, errorMessage }], onButtonClick, onFilesDrop, onFileNameChange(id, name), onFileRemove(id), buttonLabel, instruction, hoverInstruction, disabled, removeLabel, nameLabel
- DocumentItem · status 'uploading'|'uploaded'|'error', documentName, onNameChange, onRemove, errorMessage, nameLabel, removeLabel(name), statusLabels
- DropZone · onButtonClick, onFilesDrop(files), buttonLabel, instruction, hoverInstruction, disabled

**Example**
- `<FileUpload layout="wide" label="Documents" description="PDF or JPG, up to 10 MB" buttonLabel="Choose files" files={files} onButtonClick={pick} onFilesDrop={add} onFileNameChange={rename} onFileRemove={remove} />`
- The consumer owns the <input type="file">, the upload and each file's status

### AI agents · Claude Code

**Pick it when**
- The user must attach files to a form → FileUpload (layout by width; compact for a single file)

**Don't pick it when**
- Showing documents already stored → List View or Description List

**Composition rules**
- Keep status in sync: 'uploading' while sending, then 'uploaded' or 'error' with errorMessage
- Give every file a stable id; never reuse ids
- Name the button with the action ("Choose files"), not "Button"
- Without visible label (showLabel={false}) the buttonLabel must say what is being uploaded
- Never rebuild a file row: use DocumentItem (renamed from ListItem — not List View)

## Accessibility

### Designers · Figma

**Built in**
- The button is described by the label and description
- Dropping is never the only way: the button always works with mouse and keyboard
- Upload finished, errors, added and removed files are announced
- Removing a file moves focus to the next X (or the button), focus is never lost
- Visible double focus ring on the name and on the X; error shown by border + icon + text

**Your job**
- Write the rules (format, size, how many) in the description
- Error messages say what to do ("Use a PDF under 10 MB")

### Developers · React

**Semantics**
- Button = Button Default Secondary Small with aria-describedby = label + description + instruction
- File name = <input type="text"> named "File name"; read-only while uploading; aria-invalid + aria-describedby the error
- X = <button> named "Remove {file name}"
- Status changes and added / removed files through announce() (polite)

**Keyboard**
- Tab: the button, then the name and the X of each file; Enter / Space press; typing renames

**Known gaps**
- None

### AI agents · Claude Code

**Check before shipping**
- buttonLabel set (dev warning for "Button")
- Every file has id, name and status; errors have errorMessage
- onFileRemove removes the file from state (focus handling depends on it)

**Don't**
- Don't hide the button while dragging (it only disables during the drop)
- Don't show errors only in red: always errorMessage

## Tabs · TabItem · TabPanel

**Group:** Navigation
**Figma:** 🟢 Tabs page → `Tabs` (Type Fixed / Scrollable × Size S / M / L × Style Line / Contained; Show tab 3…8), `Tab Item` (Size × Style × State Initial / Hover / Pressed / Selected / Focus / Focus Selected) · frame *Tabs — How to use & Accessibility* (30/10)
**Code:** `src/organisms/Tabs.jsx` (Tabs, TabPanel) · `src/components/TabItem.jsx`
**Tokens:** `--ds-tabs-*` (`tabs/all/*`, `tabs/contained/*`)

A row of tabs that switches between views of the same content, one panel visible at a time.

## How to use

### Designers · Figma

**When to use**
- Switch between views of the same subject without leaving the page (Summary · Movements · Documents)
- Steps of a process → Step Indicator · options that filter one list → Segmented Control · main navigation → Top Navigation

**Properties**
- Tabs · Type → Fixed (tabs share the width) · Scrollable (natural width, scrolls when it overflows)
- Tabs · Size → S 40 · M 48 · L 56 (fixed, chosen by context, not by device)
- Tabs · Style → Line (navigation of a page, line under the bar) · Contained (tabs joined to a panel below)
- Tabs · Show tab 3…8 — Figma only; in code any number
- Tab Item · State → Initial · Hover · Pressed · Selected · Focus · Focus Selected

**Behaviour**
- Selected: bold label + 4 px teal ribbon (bottom in Line, top in Contained); a Contained tab loses its bottom border and joins the panel
- Hover blue, Pressed grey, focus double ring inside the tab
- No disabled tabs: if a section doesn't apply, don't show its tab

**Sizing**
- Padding 12 / 14 / 16 vertical, 16 horizontal · label 12 / 14 / 16
- Borders, ribbon and focus are drawn inside: the height never changes

### Developers · React

**Import**
- `import { Tabs, TabPanel } from './organisms/Tabs'; TabItem from './components/TabItem'`

**Props**
- Tabs · items [{ id, label }], selectedId, onChange(id), size 's'|'m'|'l', type 'fixed'|'scrollable', variant 'line'|'contained', ariaLabel / ariaLabelledBy, id (links each tab to its TabPanel)
- TabPanel · tabsId, itemId, hidden, children
- TabItem · size, variant, selected, onClick, role (null = plain button, used by Top Navigation)

**Example**
- `<Tabs id="account" ariaLabel="Account" items={[{ id: 'sum', label: 'Summary' }, { id: 'mov', label: 'Movements' }]} selectedId={tab} onChange={setTab} />`
- `<TabPanel tabsId="account" itemId={tab}>…</TabPanel>`
- Contained: the consumer draws the panel below; Tabs overlaps it by the border width

### AI agents · Claude Code

**Pick it when**
- Two or more views of the same content, one visible at a time

**Don't pick it when**
- Moving between pages of the app → Top Navigation / Sidebar Menu
- Filtering a list → Segmented Control or Chips
- A sequence the user must follow → Step Indicator

**Composition rules**
- Always pass id + one TabPanel per tab, or ariaLabel at least
- Short labels (one or two words); don't mix icons
- Fixed for 2–5 tabs that fit; Scrollable when they may not fit
- Never use TabItem alone as a tab outside a tablist: as a nav button pass role={null}

## Accessibility

### Designers · Figma

**Built in**
- The bar is one stop in the Tab order: arrows change tab, Home / End go to first / last
- The selected tab is announced as selected; the panel is named by its tab
- Selection shown by weight and ribbon, never colour alone
- Focus ring double and inside, visible on white and dark

**Your job**
- Name the set of tabs ("Account"), and give every tab a distinct label
- Keep the content of each panel independent: nothing the user must see in another tab first

### Developers · React

**Semantics**
- Tabs = role tablist with aria-label; TabItem = <button role="tab"> with aria-selected and aria-controls
- TabPanel = role tabpanel, aria-labelledby its tab, tabIndex 0
- Automatic activation: arrows select (APG tabs pattern); one stop in the Tab order (roving tabindex)
- Dev warning when Tabs has no name

**Keyboard**
- Tab enters the selected tab · ← → change tab · Home / End · Tab again goes into the panel

**Known gaps**
- None

### AI agents · Claude Code

**Check before shipping**
- ariaLabel or ariaLabelledBy on Tabs
- id on Tabs and a TabPanel for the selected tab

**Don't**
- Don't use items[].disabled (removed): hide the tab instead
- Don't put links or buttons inside a tab label
- Don't use Tabs for page navigation

## PageTitle

**Group:** Navigation
**Figma:** 🟢 Page Title page → `Page Title` (Device Mobile / Tablet / Desktop × Nav Close / Back / Link / Text / TextBold / TextDisabled / None / Breadcrumb; Show action 1 / 2 / 3) · frame *Page Title — How to use & Accessibility* (30/10)
**Code:** `src/organisms/PageTitle.jsx`
**Tokens:** `--ds-page-title-*` (`pageTitle/root|buttons|nav|desktop/*`)

The header of a page: its only h1, a way back or out, and up to three page-level actions. Mobile/Tablet and Desktop have different layouts.

## How to use

### Designers · Figma

**When to use**
- The top of every page: says where the user is (one h1), how to leave and what they can do with the whole page
- Actions on a single item of the page → put them next to that item, not here

**Properties**
- Device → Mobile · Tablet · Desktop (pick the one of the frame; the title size follows the device)
- Nav (Mobile / Tablet) → Close · Back · Link · Text · TextBold · TextDisabled · None
- Nav (Desktop) → Breadcrumb: location pin (decorative) + links + current page
- Show action 1 / 2 / 3 — neutral placeholders (holder icon on Mobile/Tablet, "Action" button on Desktop)

**Actions: what to put in the placeholders**
- Page-level actions only, most used first: Share, Add to favourites, Search in the page, Download, Print, Edit, More options
- At most 3; if there are more, keep 2 and move the rest to a "More options" action
- Mobile / Tablet show only the icon: choose icons that are clear on their own

**Behaviour**
- Mobile / Tablet: nav left, actions right, title below; icons 20 (Mobile) / 24 (Tablet) with a double focus ring
- Desktop: breadcrumb above; title left and actions (Button Default Tertiary Medium) right
- The title wraps to more lines, never truncates

**Sizing**
- Mobile / Tablet padding 4 / 8, nav → title 12 · Desktop padding 16 (no bottom), breadcrumb → title 8, title row 16 top/bottom, title → actions 16

### Developers · React

**Import**
- `import { PageTitle } from './organisms/PageTitle'`

**Props**
- title (string, always <h1>)
- nav · { type: 'icon', icon, ariaLabel, onClick } · { type: 'link', label, href?, onClick? } · { type: 'text', label, weight?, disabled? } · { type: 'breadcrumb', items: [{ label, href?, onClick? }], ariaLabel? } · undefined = None
- actions · [{ icon, label, onClick }] — label is the accessible name (icon only on Mobile/Tablet) and the button text on Desktop

**Example**
- `<PageTitle title="Payment details" nav={{ type: 'breadcrumb', items: [{ label: 'Accounts', href: '/accounts' }, { label: 'Payment details' }] }} actions={[{ icon: 'share', label: 'Share', onClick: share }]} />`
- Mobile / Tablet and Desktop render both layouts; a 1024 px media query shows one

### AI agents · Claude Code

**Pick it when**
- Any page of La Plataforma: exactly one per page, at the top

**Don't pick it when**
- Section titles inside the page → SectionHeader or Headline level 2+
- Titles inside a Dialog → the Dialog title

**Composition rules**
- One PageTitle per page; never a second h1
- Breadcrumb only on Desktop; on Mobile/Tablet give a Back icon or link
- Actions: page-level, max 3, label always set (it becomes the name of the icon button)
- Use neutral icon names for the placeholders only in documentation; real pages use the icon of the action

## Accessibility

### Designers · Figma

**Built in**
- The title is the page's only h1, same level on every device
- Icons on Mobile/Tablet are real buttons with a visible double focus ring
- Breadcrumb is a navigation landmark; the current page is announced as current
- The location pin is decorative and isn't read

**Your job**
- Write a title that matches the page and the browser tab
- Pick icons that make sense without text on Mobile/Tablet; their label is what is read

### Developers · React

**Semantics**
- title → Headline level 1 (h1)
- Icon nav and actions → <button> with aria-label (nav.ariaLabel / action.label)
- Breadcrumb → <nav aria-label="Breadcrumb"> + <ol>; last item aria-current="page"; pin aria-hidden
- Hidden layout uses display:none, so only one h1 is in the accessibility tree

**Keyboard**
- Tab: nav, actions (and breadcrumb links on Desktop); Enter / Space activate

**Known gaps**
- None

### AI agents · Claude Code

**Check before shipping**
- label on every action and ariaLabel on icon nav
- Breadcrumb last item without href (it is the current page)

**Don't**
- Don't add another h1 to the page
- Don't use the breadcrumb pin as a button
- Don't put more than 3 actions
