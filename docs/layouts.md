# Layouts

The seven page layouts of the CS Design System. Layouts 1–6 are back-office
screens (La Plataforma); layout 7 is a content page (article or case study).
This is the base for step 5 of the project (the layout-generation agent): the
agent reads `docs/component-index.md` to pick pieces and this file to place
them on a page.

Status (12/11/2026): analysis. No layout is built yet; gaps are listed at the
end.

## Shared skeleton

Layouts 1–6 use the same frame around their content (layout 7 has its own,
see below):

| Area | Piece | Rules |
|---|---|---|
| Top bar | TopNavigation | Always present |
| Side menu | SidebarMenu | Hidden (collapsed) by default. When shown: feature title is mandatory, up to 3 navigation levels, items with a chevron only show or hide their children (they don't navigate). Clicking the content area hides it (`collapseOnDismiss`) |
| Page header | PageTitle | Breadcrumb on Desktop (`nav={{ type: 'breadcrumb' }}`). Title is always Headline level 1. Optional description of one line, never two |
| Content | the layout below | With the side menu shown, the content shrinks to the available width; it never goes under the menu |

Never show the side menu and the filters panel at the same time.

## Content group

Four of the six layouts repeat the same block. We call it a **content group**:

- Card (Basic)
- Header: Headline level 2 + optional HelperText, and optionally a Collapsible
  trigger ("Hide" / "Show") or a Button on the right
- Body: a slot for a form, a detail (DescriptionList), a Table or Tabs with
  level-3 headings inside
- Optional InlineNotification above the buttons
- Optional ButtonBar at the end

Today it is composed by hand; see gap 2.

## 1 · Basic

For details and forms.

- Up to 7 content groups stacked vertically. Keep an eye on performance when
  a page holds many heavy components.
- Typical uses:
  - Detail: content group with DescriptionList + ButtonBar (Edit)
  - Form: content group with fields + ButtonBar (Cancel, Send)
  - Detail with sections: level-2 group with level-3 headings and Tabs inside
  - Long records (a customer file): several collapsible groups, each with its
    own Edit action

## 2 · Filter a report

Narrow down content that is already loaded, usually a report.

- **Filters button** floating at the top right, above the table. Clicking it
  opens the filters panel; while open the button shows its pressed state.
- **Applied filters**: Chips to the left of the button. A report may load
  pre-filtered (for example, pending items of today), and then the chips show
  on load. Chips wrap to a new line; keep them to 2 lines at most.
- **Filters panel**: HelperText + a slot for the filter fields + ButtonBar
  (Clear, Search).
- **Table group**: Headline level 2 + optional Button, rows-per-page
  (InputDropdown) and count ("1–25 of 100"), Table, Pagination.

## 3 · Search for results

Load content on a blank page, for example searching customers by surname.

- On load: the search group is open (fields + ButtonBar Clear, Search) and a
  table skeleton is shown below.
- After searching: the search group collapses by itself and can be opened
  again to search once more. One or more result tables appear, each in its
  own group with title, actions and Pagination.
- Unhappy paths with ErrorAndEmptyState: no results (illustration + message)
  and unexpected error (illustration + message + retry action).

## 4 · Step process

A task split into steps.

- StepIndicatorLarge under the PageTitle.
- One content group per step: Headline level 2 with the step name + HelperText
  + form fields + InlineNotification for errors.
- ButtonBar: Previous (from step 2 on), Cancel, secondary CTA, primary CTA
  (`onPrev`, `cancelLabel`, `secondaryLabel`, `primaryLabel`).
- Navigation rules:
  - A step has to be completed to move to the next one.
  - The user can always go back to a completed step, and move back and
    forth between completed steps (Next appears when going back: `onNext`).
  - The last step sends the form, or sends it to validation (four-eyes) when
    required.

## 5 · Dashboard (Grid)

Tiles in a uniform grid, each independent of the others.

- 3 columns on Desktop, with `layout/margin` and `layout/gutter` from Device.
- Each tile is a Card with Headline + content: LinkList (shortcuts),
  BadgeHighlight (status), AmountView or counters.

## 6 · Dashboard (Main & Related)

One main area with optional side panels.

- Main column (2/3): optional filters on top + main area.
- Related column (1/3): Cards with related information or shortcuts.
- Filters, main and related can each be shown or hidden.

## 7 · Article / Case study

A long reading page about one piece of work or one topic: a case study, a
project write-up, an article. Status (24/11/2026): proposal drawn in Figma for
Desktop, Tablet and Mobile; not built in code. Only system components; what is
new is how they are placed.

### Frame

Top Navigation → Back bar → Hero (Shape) → Content → Footer.

| Area | Piece | Rules |
|---|---|---|
| Top bar | TopNavigation | Desktop on ≥ 1024, Collapsed below |
| Back bar | Link Small, icon left: "Back to …" (the list the page came from) | Absolute, right under the navigation (y = its height), over the Hero, so the Hero shape always touches the menu. Padding `layout/margin` on the sides and `spacing/xl` on top. In the DOM it comes before the Hero |
| Header | Hero, variant shape | See *Header* |
| Content | Sections stacked | Padding `layout/margin` (sides) and `layout/section` (top and bottom), width up to `layout/maxWidth`; `layout/section` between sections (48 · 64 · 80) |
| Closing | Footer | Desktop / Stacked |

### Header

- Eyebrow = the type of page ("Case study", "Project", "Article").
- Title = the page h1. Content = Paragraph 24 (the introduction).
- Shape Media = the illustration of the work (the same file as its Media Card,
  made on the Shape Media templates). Never an image with text to read.
- Backdrop of the shape by type of page: one backdrop colour per type
  (e.g. primary for case studies, secondary for other projects), the same on
  every page of that type.
- Actions = an optional Logo (the client or organisation of the work), alone,
  no buttons. No client → no actions.

### At a glance

- Headline lg (h2) + the key facts of the work (for example: role, team,
  timeline, tools, outcome).
- Facts in 3 columns on Desktop (384 each, gap `layout/gutter`), 2 on Tablet,
  1 on Mobile; rows gap 24.
- Each fact: label in Text 14 Bold Secondary + value in Paragraph 16 (it may
  wrap to two lines). In code it is a `<dl>`: label `<dt>`, value `<dd>`.

### Sections

- Section = Headline xl (h2) + body, gap `spacing/2xl` (24).
- Body text: Paragraph 20, paragraphs 24 apart; bold only for the lead-in of
  a point.
- Text columns that take the page are capped at `layout/textMaxWidth` (800,
  about 70 characters with Paragraph 20). Columns of 592 next to a figure use
  the column width.

**Patterns.** Named by where the figure sits next to the text, which is in
every pattern. Two families: **Split** (text and figure side by side, two
columns of 592 with gutter 32 inside 1216) and **Stacked** (text on top at
`layout/textMaxWidth`, figures below). Media position uses the same words as
`mediaPosition` in Hero and ContentBlock.

| Pattern | Figma properties | Desktop | Stacked (< 1024) |
|---|---|---|---|
| **Text only** | Layout = Text only | One column at `layout/textMaxWidth` | Same, full width |
| **Split · Media right** | Layout = Split, Media position = Right | Text 592 · figure 592, tops aligned | Text, then figure |
| **Split · Media left** | Layout = Split, Media position = Left | Figure 592 · text 592, tops aligned | Text, then figure |
| **Stacked · Media full width** | Layout = Stacked, Media = Single | Text at `layout/textMaxWidth`, figure 1216 below | Text, then figure |
| **Stacked · Media pair** | Layout = Stacked, Media = Pair | Text at `layout/textMaxWidth`, figures 592 + 592 below | Text, then the two figures stacked |

Split · Media right and Split · Media left are two patterns on purpose: they
alternate down the page so content pages don't all look the same. In Stacked
there is one column and the text always comes before the figure.

Layer names: in the design system the section layer takes the pattern name
(`Section · Split · Media left`); on a real page it takes the name of its
content (`Section · Our approach`).

### Figure

- Image 16:9, fit contain, with caption: title in bold + line break +
  description in regular (`caption={<><strong>Title</strong><br />Description</>}`).
- Sizes: 592 × 333 (Split, Stacked · Media pair) · 1216 × 684 (Stacked · Media full width). Export at 2×: 1184 × 666 and
  2432 × 1368 (Image → Images).
- A screenshot whose text must be read goes full width (Stacked · Media full width). alt says what the
  figure shows; the caption is not the alt.
- No logos as figures (Logo) and no images in shapes (Shape Media is only for
  the Hero).

### Prompt outline for the agent

1. TopNavigation, Back bar (Link "Back to …"), Hero shape (eyebrow = type,
   h1, Paragraph 24, Shape Media with the work's illustration, optional Logo
   in actions), Footer.
2. At a glance: Headline lg + `<dl>` of facts, 3 / 2 / 1 columns.
3. One section per topic: Headline xl h2 + Paragraph 20; choose Text only, Split
   (Media right / left, alternating) or Stacked (Media full width / pair) by
   the figures available.
4. Stop and ask when a figure doesn't have 16:9, an image has text to read
   and isn't full width, a logo has a white background or margins, or a video
   has no `.vtt`.

## Gaps

| # | Gap | Proposal |
|---|---|---|
| 1 | Filters: button with pressed state, applied-chips area, floating panel | New organism; reuse `_floating` (`useFlip`) and `_popoverDismiss` |
| 2 | Content group, repeated in 4 layouts | New organism over Card + Headline + Collapsible + ButtonBar |
| 3 | Table header: rows per page + count | Part of a table container organism, or a prop of Table |
| 4 | Loading skeleton for tables | New atom (Skeleton) |
| 5 | Layout grids: Basic stack, 3-column grid, 2/3 + 1/3 | Decide: templates in code (`src/layouts/`) or documented composition only |
| 6 | PageTitle has no description prop | Add `description` (one line) |
| 7 | Article: Back bar over the Hero (absolute under TopNavigation) | Decide: a prop of Hero (`backLink`) or a small page-level piece; today composed by hand |
| 8 | Article: facts grid "At a glance" (3 / 2 / 1 columns, label + value) | New organism over Text + Paragraph as a `<dl>`, or reuse DescriptionList with a grid variant |
| 9 | Article: section patterns (Text only, Split, Stacked) and the figure pair | Layout component (`src/layouts/`) or documented composition only (same decision as gap 5) |
| 10 | Article: DOM order of Split · Media left | Figma draws the figure first on Desktop and the text first in Stacked. Decide for code: figure first in the DOM (Stacked then needs CSS order to put text first) or text first (Desktop mirrors with CSS). Either way, reading order must match one of the two visual orders |
| 11 | Article: headline levels | At a glance uses Headline lg and sections Headline xl, both h2: confirm the size difference is intended |
