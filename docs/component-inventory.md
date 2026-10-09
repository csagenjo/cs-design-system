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
| **Accessibility** (same three audiences) | Everyone | What's built in, what the designer / developer / agent still has to do, known gaps |
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
| Forms | _to be filled_ |
| Data | _to be filled_ |
| Feedback | _to be filled_ |
| Navigation | _to be filled (includes Pagination)_ |
| Page structure | Accordion, AccordionGroup |
| Internal parts | _to be filled_ |

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
- `State` → Initial · Hover · Focus · Pressed (documentation only — in
  screens keep Initial).
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
- The trigger is a native `<button type="button">` with `aria-expanded`.
- Collapsed content is removed from the DOM, so Tab and screen readers
  skip it.

**Keyboard**
- Tab / Shift + Tab move between triggers · Enter or Space toggles.
- Focus ring comes from `:focus-visible` — don't override or remove it.

**Known gaps** (CLAUDE.md §10)
- No `aria-controls` / `id` linking the trigger to its content yet.
- The trigger isn't wrapped in a heading (h2–h4), as the WAI-ARIA
  accordion pattern recommends.

### AI agents · Claude Code

**Check before shipping**
- Every title is unique within its group and describes the content.
- Required fields and error messages are never hidden inside a collapsed
  item.
- No AccordionGroup nested inside another one.

**Don't**
- Put interactive elements in the title.
- Hide content every user must read (legal text, errors, key amounts).
