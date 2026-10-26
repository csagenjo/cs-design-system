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
- If a piece is listed under **Internal parts**, don't use it directly —
  use the component named next to it.

## Groups

| Group | Pieces |
|---|---|
| Actions | _to be filled_ |
| Forms | FieldLabel, HelperText, ValidationMessage (Form Elements) · RadioGroup, CheckboxGroup · _rest to be filled_ |
| Data | _to be filled_ |
| Feedback | _to be filled_ |
| Navigation | _to be filled (includes Pagination)_ |
| Page structure | Accordion, AccordionGroup |
| Accessibility foundations | VisuallyHidden, LiveRegion (+ `announce`) |
| Internal parts | _to be filled_ — includes `_requiredMark` (use FieldLabel `required`), `_choiceGroup` (use RadioGroup / CheckboxGroup), `_useModal`, `_rovingFocus` (`useRovingFocus`, `useListbox`), `_focus` (layer stack), `_popoverDismiss` |

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
- At least one option is checked by default in a RadioGroup unless "no
  answer" is valid.

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
