# Component inventory

The catalogue of every piece in the CS Design System, written for three
readers at once: designers working in Figma, developers working in React,
and AI agents (Claude Code) that assemble interfaces from requirements.

Figma is the source of truth. Each entry here mirrors the **How to use**
section at the end of the component's page in the Figma library — same
content, plain text, so an agent can read it without opening Figma.

## How to read an entry

Every entry has the same four blocks:

| Block | Audience | What it answers |
|---|---|---|
| **Designers · Figma** | Designers | When to use it, which properties to set, how to build it in a layout |
| **Developers · React** | Developers | Import path, props with types and defaults, usage notes |
| **AI agents · Claude Code** | Agents | Pick it when / don't pick it when (and what to pick instead), composition rules |
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
**Figma:** Accordion page → section *How to use*
**Code:** `src/components/Accordion.jsx` (atom), `src/organisms/AccordionGroup.jsx` (organism)
**Tokens:** `--ds-accordion-*`

A vertical list of items whose content expands and collapses under a
clickable title.

### Designers · Figma

**When to use**
- To show secondary or long content without overwhelming the page
  (FAQs, details, grouped form sections).
- When the user only needs one or a few sections at a time.
- When titles alone are enough for the user to find the right section.

**Properties**
- `Version` — Collapsed / Expanded.
- `State` — Enabled / Hover / Pressed / Focus. Use Enabled in layouts;
  the others are for specs and prototypes.
- `Title` / `Content` — text overrides. Swap Content for a nested
  instance when you need richer content.
- `Last` — turns on the bottom closing border. On only for the last item
  of a group.

**Building a group**
- Stack items in an auto-layout frame, vertical, gap 0.
- Turn `Last` on only in the last item.
- Don't add Dividers between items: each item already draws its own top
  border.

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
