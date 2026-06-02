# CS Design System — Architecture

## Token structure

Tokens are generated from Figma exports and compiled into `src/tokens.css`.  
All components reference `--ds-*` CSS custom properties — no hardcoded values anywhere.

### Four layers (Figma → CSS)

```
Base tokens      → raw color palette (50→950 scales)
Mode tokens      → semantic roles (fg, bg, borderColor) · Light + Dark
Component tokens → component-specific values (--ds-button-*, etc.)
Typography       → font family, size, weight, line-height scales
```

### CSS variable naming

```css
--ds-color-{group}-{step}      /* base palette:  --ds-color-primary-500 */
--ds-fg-{role}                 /* foreground:    --ds-fg-default */
--ds-bg-{role}                 /* background:    --ds-bg-subtle */
--ds-borderColor-{role}        /* borders:       --ds-borderColor-error */
--ds-{component}-{property}    /* component:     --ds-button-radius */
--ds-fontSize-{scale}-{step}   /* typography:    --ds-fontSize-label-md */
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

| Component | Variants | Tokens |
|-----------|----------|--------|
| `Button` | accent · default · negative · ghost · outline · floating | `--ds-button-*` |
| `ButtonBar` | complex · simple · form · detail | inherits Button |
| `Input` | text · all states · adaptive (textarea) | semantic `--ds-*` |
| `Checkbox` | unselected · selected · indeterminate · all states | semantic `--ds-*` |

---

## System rules

- **No hardcoded values** — every color, size, and radius comes from a `--ds-*` token
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
