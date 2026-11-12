# Layouts

The six page layouts of La Plataforma, translated into the CS Design System.
This is the base for step 5 of the project (the layout-generation agent): the
agent reads `docs/component-index.md` to pick pieces and this file to place
them on a page.

Source: the layout guidelines of UIKit Plataforma, used as examples only. We
keep the behaviour rules and the structure; names, colours, typography and
brand come from our own tokens and components. Nothing is copied from the
reference files.

Status (12/11/2026): analysis. No layout is built yet; gaps are listed at the
end.

## Shared skeleton

Every layout uses the same frame around its content:

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

## Gaps

| # | Gap | Proposal |
|---|---|---|
| 1 | Filters: button with pressed state, applied-chips area, floating panel | New organism; reuse `_floating` (`useFlip`) and `_popoverDismiss` |
| 2 | Content group, repeated in 4 layouts | New organism over Card + Headline + Collapsible + ButtonBar |
| 3 | Table header: rows per page + count | Part of a table container organism, or a prop of Table |
| 4 | Loading skeleton for tables | New atom (Skeleton) |
| 5 | Layout grids: Basic stack, 3-column grid, 2/3 + 1/3 | Decide: templates in code (`src/layouts/`) or documented composition only |
| 6 | PageTitle has no description prop | Add `description` (one line) |
