# CS Design System

A personal component library built with React and Vite, connected to a Figma design system.  
All styles come from design tokens — no hardcoded values.

---

## What's in here

### Tokens
Design tokens generated from Figma exports, available as CSS custom properties (`--ds-*`).

- Color palette: primary teal, secondary pink, tertiary lavender, neutral, semantic colors
- Typography scale: label, body, title, headline, annotation
- Shadows, border radii, spacing

### Components — Capa 1 (Atoms)

| Component | Description | Status |
|-----------|-------------|--------|
| `Button` | Accent / Default / Negative / Ghost · Pill shape · Lucide icons | ✅ |
| `ButtonBar` | Complex / Simple / Form / Detail variants · Always tokens | ✅ |
| `Input` | Text input · All states · forwardRef · aria-complete | ✅ |
| `Checkbox` | Unselected / Selected / Indeterminate · All states | ✅ |

---

## Stack

- **React 18** + Vite
- **lucide-react** for icons (same naming as the Figma DS)
- **CSS custom properties** — no CSS-in-JS, no Tailwind
- Tokens generated from Figma variable exports

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
  /* Color palette */
  --ds-color-primary-500: #4BA9C0;   /* teal */
  --ds-color-primary-700: #286371;   /* teal dark */

  /* Semantic */
  --ds-fg-default:        #050506;
  --ds-bg-default:        #FFFFFF;
  --ds-borderColor-subtle: #D8DBDE;

  /* Component */
  --ds-button-radius:     80px;      /* pill shape */
}
```

---

## Button API

```jsx
<Button
  variant="accent"     // accent | default | negative | ghost
  size="md"            // sm | md | lg
  outline={false}      // outline style
  iconLeft="Search"    // Lucide icon name
  floating={false}     // adds shadow
  fullWidth={false}
  disabled={false}
  loading={false}
>
  Label
</Button>
```

---

## Design system

Figma: [CS Design System](https://www.figma.com/design/QiWDJdMPB5pfY3vHy9CqZv/CS---Design-System)

---

*Built by Carol Sánchez Agenjo · Senior UX & Product Designer → Design Engineer*